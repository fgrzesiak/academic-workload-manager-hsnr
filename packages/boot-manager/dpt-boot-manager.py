import atexit
import os
import subprocess
import sys
import threading
import time
import tkinter as tk
import webbrowser
import yaml
import requests
import sv_ttk
import darkdetect
from tkinter import messagebox, ttk

# ============================================================================
#   KONSTANTEN / GLOBALE EINSTELLUNGEN
# ============================================================================

# GitHub API
GITHUB_API_BASE_URL = "https://api.github.com"

# Versionsangabe der Anwendung (wird per CI/CD aktualisiert)
CURRENT_VERSION = "v1.0.10"

# Namen der Dateien, die im Release erwartet werden
if getattr(sys, "frozen", False):
    # Gefrorene Anwendung (EXE)
    COMPOSE_NAME = f"docker-compose-{CURRENT_VERSION}.yml"
else:
    # Ungefrorener Python-Code
    COMPOSE_NAME = f"../../docker/docker-compose.prod.yml"


def get_app_folder():
    """
    Gibt den Pfad zum Verzeichnis zurück, in dem die Anwendung liegt.
    - Bei gefrorener Anwendung (EXE) ist das: os.path.dirname(sys.executable).
    - Bei ungefrorenem Python-Code ist das: os.path.dirname(__file__).
    """
    if getattr(sys, "frozen", False):
        # Gefrorene Anwendung (PyInstaller)
        return os.path.dirname(sys.executable)
    else:
        # Normaler Python-Start
        return os.path.dirname(__file__)


# Pfade zur aktuell laufenden Anwendung und Docker-Compose-Datei
EXE_PATH = os.path.abspath(sys.argv[0])
APP_FOLDER = get_app_folder()

# Statt fester "docker-compose.prod.yml" verwenden wir nun eine
# versionierte Compose-Datei (z. B. "docker-compose-1.0.0.yml").
DOCKER_COMPOSE_FILE = os.path.join(APP_FOLDER, COMPOSE_NAME)


# ============================================================================
#   GLOBALE VARIABLEN (GUI, STATUS, ETC.)
# ============================================================================

root = None
log_output = None
update_button = None

frontend_port_entry = None
mysql_root_password_entry = None
mysql_api_password_entry = None
first_controller_username_entry = None
first_controller_password_entry = None
first_controller_firstname_entry = None
first_controller_lastname_entry = None

# Toggle‐Button statt Start/Stop:
toggle_button = None
app_is_running = False  # Merkt sich, ob die Anwendung aktuell läuft


# ------------------------------------------------------
# Konfiguration: Nur Felder, die der Benutzer direkt ändern darf
# ------------------------------------------------------
CONFIG_SCHEMA = [
    {
        "group_name": "Web-Einstellungen",
        "fields": [
            {
                "label_text": "Frontend Port (Web)",
                "compose_path": ("services", "web", "ports", 0),
                "default": "3000",
                "extract": lambda val: val.split(":")[0] if ":" in val else val,
                "inject": lambda old_val, new_val: f"{new_val}:3000",
            },
        ],
    },
    {
        "group_name": "Datenbank-Einstellungen",
        "fields": [
            {
                "label_text": "MySQL Root Passwort",
                "compose_path": (
                    "services",
                    "db",
                    "environment",
                    "MYSQL_ROOT_PASSWORD",
                ),
                "default": "rootpassword",
            },
            {
                "label_text": "MySQL System Passwort (API)",
                "compose_path": ("services", "db", "environment", "MYSQL_PASSWORD"),
                "default": "systempassword",
            },
        ],
    },
    {
        "group_name": "Admin-Controller",
        "fields": [
            {
                "label_text": "Nutzername",
                "compose_path": (
                    "services",
                    "api",
                    "environment",
                    "FIRST_CONTROLLER_USERNAME",
                ),
                "default": "admin",
            },
            {
                "label_text": "Passwort",
                "compose_path": (
                    "services",
                    "api",
                    "environment",
                    "FIRST_CONTROLLER_PASSWORD",
                ),
                "default": "admin",
            },
            {
                "label_text": "Vorname",
                "compose_path": (
                    "services",
                    "api",
                    "environment",
                    "FIRST_CONTROLLER_FIRSTNAME",
                ),
                "default": "Admin",
            },
            {
                "label_text": "Nachname",
                "compose_path": (
                    "services",
                    "api",
                    "environment",
                    "FIRST_CONTROLLER_LASTNAME",
                ),
                "default": "Admin",
            },
        ],
    },
]

# ============================================================================
#   KONFIGURATION LADEN / SPEICHERN, geschaltete Pfade auslesen/setzen
# ============================================================================


def load_config():
    """
    Lädt die Konfiguration aus der versionierten docker-compose-Datei.
    """
    with open(DOCKER_COMPOSE_FILE, "r", newline="\n") as file:
        return yaml.safe_load(file)


def save_config(config):
    """
    Speichert die geänderte Konfiguration in der versionierten docker-compose-Datei.
    """
    with open(DOCKER_COMPOSE_FILE, "w", newline="\n") as file:
        yaml.safe_dump(config, file, default_flow_style=False)


def get_nested(dct, path):
    """
    Holt rekursiv den Wert aus dem Dictionary 'dct' für den angegebenen Pfad,
    z.B. path = ("services", "db", "environment", "MYSQL_ROOT_PASSWORD").
    """
    current = dct
    for key in path:
        current = current[key]
    return current


def set_nested(dct, path, value):
    """
    Setzt rekursiv den Wert in 'dct' für den angegebenen Pfad.
    """
    *parents, last = path
    current = dct
    for key in parents:
        current = current[key]
    current[last] = value


# ------------------------------------------------------
# Funktion zum Anpassen abhängiger Werte
# ------------------------------------------------------
def fix_dependent_values(config):
    """
    Sorgt dafür, dass Abhängigkeiten (Port -> FRONTEND_URL, Root PW -> DATABASE_URL usw.)
    nach dem Speichern der GUI-Werte automatisch konsistent sind.
    """
    # FRONTEND_URL an den Port anpassen
    # Wir lesen die "services.web.ports[0]" -> extrahieren den Port.
    try:
        web_port_full = get_nested(
            config, ("services", "web", "ports", 0)
        )  # z.B. "8080:3000"
        web_port = web_port_full.split(":")[0]
        # Dann setzen wir in "services.api.environment.FRONTEND_URL" den Port.
        config["services"]["api"]["environment"][
            "FRONTEND_URL"
        ] = f"http://localhost:{web_port}"
    except KeyError:
        pass

    # DATABASE_URL basierend auf Root Password
    # Wir speichern root PW in "services.db.environment.MYSQL_ROOT_PASSWORD"
    # und wollen die Prisma-DB-Connection "services.prisma.environment.DATABASE_URL" anpassen.
    try:
        root_pw = get_nested(
            config, ("services", "db", "environment", "MYSQL_ROOT_PASSWORD")
        )
        new_db_url = f"mysql://root:{root_pw}@db:3306/core"
        config["services"]["prisma"]["environment"]["DATABASE_URL"] = new_db_url
    except KeyError:
        pass

    # API-Datenbank-URL anpassen
    try:
        api_db_pw = get_nested(
            config, ("services", "db", "environment", "MYSQL_PASSWORD")
        )
        new_api_db_url = f"mysql://system:{api_db_pw}@db:3306/core"
        config["services"]["api"]["environment"]["DATABASE_URL"] = new_api_db_url
    except KeyError:
        pass


# ============================================================================
#   UPDATE-FUNKTIONEN
# ============================================================================


def get_latest_release():
    """
    Ruft die neueste Release-Version und deren Assets über die GitHub-API ab.
    Gibt (tag_name, assets) zurück oder (None, None) bei Fehler.
    """
    url = f"{GITHUB_API_BASE_URL}/repositories/861008208/releases/latest"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data["tag_name"], data["assets"]
    except requests.exceptions.RequestException as e:
        log_output.insert(tk.END, f"Fehler bei der Update-Prüfung: {e}\n")
        log_output.see(tk.END)
        return None, None


def get_asset_download_url(asset_id):
    """
    Ermittelt die direkte Download-URL für ein Release-Asset anhand seiner Asset-ID.
    Gibt die Download-URL oder None zurück.
    """
    headers = {
        "Accept": "application/octet-stream",
    }
    url = f"{GITHUB_API_BASE_URL}/repositories/861008208/releases/assets/{asset_id}"
    try:
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        return response.url
    except requests.exceptions.RequestException:
        return None


def check_for_updates_background():
    """
    Prüft im Hintergrund nach einer neuen Version und aktualisiert den Update-Button.
    - Ist eine neuere Version verfügbar, wird der Button farblich markiert (rot) und führt bei Klick confirm_update aus.
    - Ist die Version bereits aktuell, wird der Button grün und bei Klick erfolgt erneut ein check_for_updates.
    """
    latest_version, latest_assets = get_latest_release()
    if not latest_version:
        log_output.insert(
            tk.END, "Update-Prüfung fehlgeschlagen. Anwendung läuft normal.\n"
        )
        log_output.see(tk.END)
        return

    if latest_version != CURRENT_VERSION:
        # Neuere Version verfügbar
        log_output.insert(tk.END, f"Neue Version verfügbar: {latest_version}\n")
        log_output.see(tk.END)
        update_button.configure(
            text=f"Update verfügbar ({latest_version})",
            style="UpdateOrange.TButton",
            command=lambda: confirm_update(latest_version, latest_assets),
        )
    else:
        # Aktuelle Version = neuester Stand
        log_output.insert(tk.END, "Ihre Version ist aktuell.\n")
        log_output.see(tk.END)
        update_button.configure(
            text=f"Version {CURRENT_VERSION} – aktuell",
            style="IsLatest.TButton",
            command=check_for_updates,
        )


def check_for_updates():
    """
    Löst eine manuelle Prüfung auf Updates aus und gibt eine Nachricht in das Log-Feld aus.
    """
    log_output.insert(tk.END, "Suche nach Updates...\n")
    log_output.see(tk.END)
    threading.Thread(target=check_for_updates_background, daemon=True).start()


def confirm_update(latest_version, latest_assets):
    """
    Fragt den Benutzer per Dialog, ob das gefundene Update wirklich installiert werden soll.
    """
    user_response = messagebox.askyesno(
        "Update bestätigen",
        f"Möchten Sie wirklich von Version {CURRENT_VERSION} auf {latest_version} aktualisieren?",
    )
    if user_response:
        show_update_progress(latest_version, latest_assets)


def show_update_progress(latest_version, latest_assets):
    """
    Zeigt ein kleines Fenster mit Fortschrittsbalken an und startet den
    Download-Thread für die neuen Dateien.
    """
    update_window = tk.Toplevel(root)
    update_window.title("Update läuft")
    update_window.geometry("400x200")

    status_label = ttk.Label(
        update_window, text=f"Update auf {latest_version} wird durchgeführt..."
    )
    status_label.pack(pady=10)

    progress_bar = ttk.Progressbar(
        update_window, orient="horizontal", length=300, mode="determinate"
    )
    progress_bar.pack(pady=10)
    progress_bar.start()

    update_window.update()

    threading.Thread(
        target=download_and_replace_files,
        args=(
            latest_version,
            latest_assets,
            status_label,
            progress_bar,
            update_window,
        ),
        daemon=True,
    ).start()


def download_and_replace_files(
    latest_version, latest_assets, status_label, progress_bar, update_window
):
    """
    Lädt die Assets (EXE und docker-compose.yml) herunter und ersetzt
    die alten Dateien. Zeigt den Fortschritt im übergebenen Fortschrittsbalken an.
    """
    exe_asset_id = None
    compose_asset_id = None

    # Asset-IDs aus dem Release ermitteln
    for asset in latest_assets:
        if asset["name"].endswith(".exe"):
            exe_asset_id = asset["id"]
        elif asset["name"].endswith(".yml"):
            compose_asset_id = asset["id"]

    if not exe_asset_id or not compose_asset_id:
        status_label.config(text="Fehler: Update-Dateien nicht gefunden.")
        progress_bar.stop()
        return

    def download_file(url, save_path):
        """
        Hilfsfunktion, um eine Datei (EXE, YML) herunterzuladen und gleichzeitig
        den Fortschrittsbalken zu aktualisieren.
        """
        try:
            response = requests.get(
                url,
                stream=True,
                timeout=10,
            )
            response.raise_for_status()

            total_size = int(response.headers.get("content-length", 0))
            block_size = 8192
            progress_bar["maximum"] = total_size if total_size else 100

            downloaded = 0
            with open(save_path, "wb") as f:
                for chunk in response.iter_content(block_size):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        progress_bar["value"] = min(downloaded, progress_bar["maximum"])

            # Fortschrittsbalken am Ende füllen
            progress_bar["value"] = progress_bar["maximum"]
            update_window.update_idletasks()

        except Exception as e:
            status_label.config(text=f"Fehler beim Download: {e}")
            status_label.config(text=f"Fehler beim Download: {e}")
            progress_bar.stop()
            sys.exit(1)

    # Neue EXE herunterladen (in dasselbe Verzeichnis wie die alte EXE)
    exe_download_url = get_asset_download_url(exe_asset_id)
    if exe_download_url:
        update_window.update()
        progress_bar["value"] = 0
        new_exe_path = os.path.join(
            os.path.dirname(EXE_PATH), f"BootManagerDPT_{latest_version}.exe"
        )
        download_file(exe_download_url, new_exe_path)

    # Neue Docker-Compose Datei herunterladen
    compose_download_url = get_asset_download_url(compose_asset_id)
    if compose_download_url:
        status_label.config(text="Lade neue Docker-Compose-Datei herunter...")
        update_window.update()
        progress_bar["value"] = 0
        new_compose_path = os.path.join(
            os.path.dirname(DOCKER_COMPOSE_FILE), f"docker-compose-{latest_version}.yml"
        )
        download_file(compose_download_url, new_compose_path)

    status_label.config(text="Update erfolgreich! Anwendung wird neu gestartet...")
    progress_bar["value"] = progress_bar["maximum"]
    progress_bar.stop()
    update_window.update()
    time.sleep(2)
    restart_application(status_label, new_exe_path, update_window)

    """
    Beendet die aktuelle Anwendung vollständig und startet die neue EXE.
    """


def restart_application(status_label, new_exe_path, update_window):
    try:
        status_label.config(text="Beende alte Version...")
        update_window.update()

        # Starte die neue EXE
        subprocess.Popen([new_exe_path])

        # Schließe das Update-Fenster
        update_window.destroy()

        # Beende die laufende Anwendung (alle Threads)
        os._exit(0)

    except Exception as e:
        print(f"Fehler beim Neustart: {e}")


# ============================================================================
#   DOCKER-FUNKTIONEN
# ============================================================================


def is_docker_running():
    """
    Prüft, ob Docker auf dem System läuft. Gibt True/False zurück.
    """
    try:
        result = subprocess.run(
            ["docker", "info"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def start_docker_if_needed():
    """
    Startet Docker Desktop unter Windows, falls es noch nicht läuft.
    Wartet im Hintergrund, bis Docker läuft und ruft danach 'start_docker_compose' auf.
    """

    def docker_thread():
        if not is_docker_running():
            root.after(
                0,
                lambda: log_output.insert(tk.END, "Docker Desktop wird gestartet...\n"),
            )
            root.after(0, log_output.see, tk.END)

            # Docker Desktop starten
            subprocess.run(
                ["start", "", "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"],
                shell=True,
            )
            time.sleep(5)  # Wartezeit für Docker Desktop-Start

            # Überprüfen, bis Docker läuft
            while not is_docker_running():
                time.sleep(5)
                root.after(
                    0,
                    lambda: log_output.insert(tk.END, "Warte auf Docker Desktop...\n"),
                )
                root.after(0, log_output.see, tk.END)

            root.after(0, lambda: log_output.insert(tk.END, "Docker Desktop läuft.\n"))
            root.after(0, log_output.see, tk.END)

        # Sobald Docker läuft, docker-compose aufrufen
        start_docker_compose()

    threading.Thread(target=docker_thread, daemon=True).start()


def start_docker_compose():
    """
    Führt 'docker-compose up -d' aus und setzt den Anwendungsstatus auf "läuft".
    """

    def update_status():
        # Nach dem Start => app_is_running = True, Toggle-Button anpassen
        global app_is_running
        app_is_running = True
        toggle_button.configure(
            text="Anwendung stoppen", state=tk.NORMAL, style="UpdateOrange.TButton"
        )

    cmd = f"docker-compose -f {DOCKER_COMPOSE_FILE} up -d --pull always"
    threading.Thread(target=run_command, args=(cmd, update_status), daemon=True).start()


def stop_docker_compose():
    """
    Führt 'docker-compose stop' für das definierte Compose-File aus.
    """
    subprocess.run(["docker-compose", "-f", DOCKER_COMPOSE_FILE, "stop"])


# ============================================================================
#   FUNKTIONEN FÜR KONFIGURATIONSÄNDERUNGEN
# ============================================================================


def reload_gui_values():
    """Lädt die Konfiguration und füllt die Einträge."""
    config = load_config()

    for field_info in field_widgets:
        path = field_info["compose_path"]
        raw_value = get_nested(config, path)

        # Wenn es eine Extract-Funktion gibt, anwenden
        if field_info["extract"] is not None:
            raw_value = field_info["extract"](raw_value)

        field_info["var"].set(str(raw_value))


def update_config():
    """Liest die GUI-Werte und speichert sie ins Compose. Anschließend abhängige Felder aktualisieren."""
    config = load_config()

    # 1) Felder ins config schreiben
    for field_info in field_widgets:
        path = field_info["compose_path"]
        gui_value = field_info["var"].get()

        if field_info["inject"]:
            old_value = get_nested(config, path)
            new_value = field_info["inject"](old_value, gui_value)
        else:
            new_value = gui_value

        set_nested(config, path, new_value)

    # 2) Abhängigkeiten korrigieren
    fix_dependent_values(config)

    # 3) Speichern
    save_config(config)
    log_output.insert(tk.END, "Konfiguration gespeichert.\n")
    log_output.see(tk.END)

    # Bei Bedarf GUI neu laden, um auch die sichtbaren Felder zu aktualisieren (falls abhängig)
    # reload_gui_values()


def reset_to_defaults():
    """Schreibt in alle Felder den in CONFIG_SCHEMA definierten Default-Wert."""
    config = load_config()

    for field_info in field_widgets:
        path = field_info["compose_path"]
        default = field_info["default"]

        # Falls es eine Inject-Funktion gibt, sollte man u.U. den alten Wert
        # (z.B. "3000:3000") zusammenbauen. Hier vereinfachtes Beispiel:
        if field_info["inject"] is not None:
            old_value = get_nested(config, path)
            default = field_info["inject"](old_value, default)

        set_nested(config, path, default)

    # Abhängigkeiten aktualisieren
    fix_dependent_values(config)

    save_config(config)
    log_output.insert(tk.END, "Standardwerte wiederhergestellt.\n")
    log_output.see(tk.END)

    # Anschließend GUI neu laden, um auch die sichtbaren Felder zu aktualisieren
    reload_gui_values()


# ============================================================================
#   HILFSFUNKTIONEN FÜR KOMMANDOS UND BUTTONS
# ============================================================================


def run_command(command, on_complete=None):
    """
    Führt ein Shell-Kommando in einem eigenen Thread aus und leitet stdout/stderr
    live in das Log-Feld des GUIs.
    """
    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
    )

    def read_stream(stream):
        for line in iter(stream.readline, ""):
            log_output.insert(tk.END, line)
            log_output.see(tk.END)
            log_output.update_idletasks()

    threading.Thread(target=read_stream, args=(process.stdout,), daemon=True).start()
    threading.Thread(target=read_stream, args=(process.stderr,), daemon=True).start()

    process.wait()
    if on_complete:
        root.after(100, on_complete)


def disable_action_buttons():
    """
    Deaktiviert alle Aktions-Buttons (Start, Stop, Speichern, Reset, Update).
    """
    toggle_button.config(state=tk.DISABLED)
    update_button.config(state=tk.DISABLED)
    save_button.config(state=tk.DISABLED)
    reset_button.config(state=tk.DISABLED)


def enable_action_buttons():
    """
    Aktiviert alle Aktions-Buttons (Start, Stop, Speichern, Reset, Update).
    """
    toggle_button.config(state=tk.NORMAL)
    update_button.config(state=tk.NORMAL)
    save_button.config(state=tk.NORMAL)
    reset_button.config(state=tk.NORMAL)


# ============================================================================
#   NEUE TOGGLE-FUNKTION FÜR EINEN EINZIGEN BUTTON
# ============================================================================


def toggle_start_stop():
    """
    Schaltet zwischen Start und Stop um.
    - Falls die Anwendung nicht läuft, wird start_application() aufgerufen.
    - Läuft die Anwendung, wird stop_application() aufgerufen.
    """
    if not app_is_running:
        start_application()
    else:
        stop_application()


def start_application():
    """
    Wird aufgerufen, wenn der Benutzer 'Anwendung starten' klickt.
    Docker wird ggf. gestartet, danach wird 'docker-compose up' ausgeführt.
    """
    # Check if Docker Desktop can be automatically found.
    if not is_docker_running():
        if not os.path.exists("C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"):
            root.after(
                0,
                lambda: log_output.insert(
                    tk.END,
                    "Docker Desktop nicht gefunden. Bitte starten Sie Docker Desktop manuell.\n",
                ),
            )
            root.after(0, lambda: log_output.see(tk.END))
            return

    toggle_button.configure(text="Anwendung startet...", style="UpdateOrange.TButton")
    disable_action_buttons()
    start_docker_if_needed()
    # => Wenn docker-compose fertig ist, setzt start_docker_compose() app_is_running = True
    #    und ändert den Toggle-Button auf "Stoppen".


def stop_application():
    """
    Wird aufgerufen, wenn der Benutzer 'Anwendung stoppen' klickt.
    Führt 'docker-compose stop' aus und aktualisiert den Anwendungsstatus.
    """
    toggle_button.configure(
        text="Anwendung wird gestoppt...", style="UpdateOrange.TButton"
    )
    disable_action_buttons()

    def update_status():
        enable_action_buttons()
        # Nach dem Stop => app_is_running = False
        global app_is_running
        app_is_running = False
        toggle_button.configure(text="Anwendung starten", style="UpdateBlue.TButton")

    cmd = f"docker-compose -f {DOCKER_COMPOSE_FILE} stop"
    threading.Thread(target=run_command, args=(cmd, update_status), daemon=True).start()


def open_frontend():
    """
    Öffnet die in docker-compose-{CURRENT_VERSION}.yml hinterlegte FRONTEND_URL im Standardbrowser.
    """
    config = load_config()
    frontend_url = config["services"]["api"]["environment"].get(
        "FRONTEND_URL", "http://localhost:3000"
    )
    webbrowser.open(frontend_url)


def on_closing():
    """
    Callback, der beim Schließen des Hauptfensters aufgerufen wird.
    Stoppt vorsichtshalber Docker-Container und zerstört das Fenster.
    """
    stop_docker_compose()
    root.destroy()


# ============================================================================
#   GUI-AUFBAU
# ============================================================================


def create_gui():
    """
    Erzeugt ein schlankes, optisch ansprechendes Hauptfenster
    für die Anwendung (Tkinter) und initialisiert alle Bedienelemente.
    """
    global root, log_output, field_widgets
    global update_button, toggle_button, save_button, reset_button
    global frontend_port_entry, mysql_root_password_entry, mysql_api_password_entry
    global first_controller_username_entry, first_controller_password_entry, first_controller_firstname_entry, first_controller_lastname_entry

    root = tk.Tk()
    root.title(f"Deputatsverwaltung Boot Manager - {CURRENT_VERSION}")
    root.geometry("600x700")
    root.resizable(False, False)

    # Wir halten eine Mapping: field_dict[(group_idx, field_idx)] = entry_widget
    # oder einfach in einer Liste in gleicher Reihenfolge,
    # oder noch besser: wir packen pro Feld ein kleines Objekt (dict).
    field_widgets = []  # Speichert pro Feld ein Dict: {"schema":..., "entry":...}

    # sun-valley-ttk Theme auswählen (dark oder light je nach OS).
    sv_ttk.set_theme(darkdetect.theme())

    # Style-Objekt erstellen und Farb-Styles definieren
    style = ttk.Style(root)
    style.configure("UpdateGreen.TButton", foreground="green")
    style.configure("UpdateOrange.TButton", foreground="orange")
    style.configure("UpdateBlue.TButton", foreground="steel blue")
    style.configure("IsLatest.TButton", foreground="sea green")

    main_frame = ttk.Frame(root)
    main_frame.pack(padx=20, pady=(5, 20), fill="both", expand=True)

    title_label = ttk.Label(
        main_frame,
        text=f"Deputatsverwaltung Boot Manager - {CURRENT_VERSION}",
        font=("Arial", 14, "bold"),
    )
    title_label.pack(pady=10)

    # Update-Button
    update_button = ttk.Button(
        main_frame,
        text="Nach Updates suchen",
        command=check_for_updates,
        style="UpdateBlue.TButton",
    )
    update_button.pack(pady=5)

    # Dynamisch Gruppen erzeugen
    for group_def in CONFIG_SCHEMA:
        group_frame = ttk.LabelFrame(main_frame, text=group_def["group_name"])
        group_frame.pack(fill="x", pady=5)
        group_margin_frame = ttk.Frame(group_frame)
        group_margin_frame.pack(fill="both", expand=True, padx=5, pady=5)

        for field_def in group_def["fields"]:
            row_frame = ttk.Frame(group_margin_frame)
            row_frame.pack(fill="x", padx=5, pady=2)

            label = ttk.Label(row_frame, text=field_def["label_text"], width=30)
            label.pack(side=tk.LEFT)

            entry_var = tk.StringVar()
            entry = ttk.Entry(row_frame, textvariable=entry_var, width=30)
            entry.pack(side=tk.LEFT)

            # Wir speichern alle Informationen über dieses Feld
            field_info = {
                "label_text": field_def["label_text"],
                "compose_path": field_def["compose_path"],
                "default": field_def["default"],
                "extract": field_def.get("extract"),
                "inject": field_def.get("inject"),
                "var": entry_var,
            }
            field_widgets.append(field_info)

    # Parent Frame für die unteren Buttons
    bottom_actions_buttons = ttk.Frame(main_frame)
    bottom_actions_buttons.pack(pady=(0, 5), fill="x")

    # Frame für Save/Reset buttons
    config_buttons = ttk.Frame(bottom_actions_buttons)
    config_buttons.pack(fill="x", expand=True, pady=5)

    save_button = ttk.Button(config_buttons, text="Speichern", command=update_config)
    save_button.pack(side=tk.LEFT, fill="x", expand=True, padx=(0, 5))

    reset_button = ttk.Button(
        config_buttons, text="Standardwerte wiederherstellen", command=reset_to_defaults
    )
    reset_button.pack(side=tk.LEFT, fill="x", expand=True)

    # Frame für Start/Open Browser buttons
    start_open_frame = ttk.Frame(bottom_actions_buttons)
    start_open_frame.pack(fill="x", expand=True)

    # Toggle Start/Stop Button
    toggle_button = ttk.Button(
        start_open_frame,
        text="Anwendung starten",
        command=toggle_start_stop,
        style="UpdateBlue.TButton",
    )
    toggle_button.pack(side=tk.LEFT, fill="x", expand=True, padx=(0, 5))

    # Open in Browser Button
    open_browser_button = ttk.Button(
        start_open_frame,
        text="Anwendung im Browser öffnen",
        command=open_frontend,
    )
    open_browser_button.pack(side=tk.LEFT, fill="x", expand=True)

    console_frame = ttk.LabelFrame(main_frame, text="Konsolenausgabe")
    console_frame.pack(fill="x")
    console_margin_frame = ttk.Frame(console_frame)
    console_margin_frame.pack(fill="both", expand=True, padx=5, pady=5)

    log_text = tk.Text(
        console_margin_frame,
        height=12,
        width=70,
        relief="solid",
        padx=5,
        pady=5,
        border=0,
        highlightthickness=0,
        wrap="word",
    )
    log_text.bind("<Key>", lambda e: "break")  # Disable editing
    log_text.pack()

    global log_output
    log_output = log_text

    root.after(100, check_for_updates_background)
    reload_gui_values()

    root.mainloop()


# ============================================================================
#   PROGRAMMAUSTIEG
# ============================================================================


@atexit.register
def cleanup_on_exit():
    """
    Stellt sicher, dass beim Beenden des Programms die Docker-Container gestoppt werden.
    """
    stop_docker_compose()


# ============================================================================
#   PROGRAMMEINSTIEG
# ============================================================================

if __name__ == "__main__":
    create_gui()
