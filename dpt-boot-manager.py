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
from tkinter import messagebox, ttk

# ============================================================================
#   KONSTANTEN / GLOBALE EINSTELLUNGEN
# ============================================================================

# GitHub-Repository und API
GITHUB_REPO = "fgrzesiak/dpt-testing"
GITHUB_API_BASE_URL = "https://api.github.com"
# ACHTUNG: Der Token sollte niemals öffentlich sichtbar sein (nur Leserechte)
GITHUB_ACCESS_TOKEN = "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"

# Versionsangabe der Anwendung (wird per CI/CD aktualisiert)
CURRENT_VERSION = "v1.0.10"

# Namen der Dateien, die im Release erwartet werden
COMPOSE_NAME = f"docker-compose-{CURRENT_VERSION}.yml"


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

# Globale Variablen für das GUI
root = None
log_output = None
status_label = None
start_button = None
stop_button = None
save_button = None
reset_button = None
update_button = None

frontend_port_entry = None
mysql_root_password_entry = None
mysql_user_password_entry = None
initial_controller_password_entry = None

# ============================================================================
#   HILFSFUNKTIONEN ZUM DATENLADEN AUS DER YAML-DATEI
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


# ============================================================================
#   UPDATE-FUNKTIONEN FÜR DIE ANWENDUNG
# ============================================================================


def get_latest_release():
    """
    Ruft die neueste Release-Version und deren Assets über die GitHub-API ab.
    Gibt (tag_name, assets) zurück oder (None, None) bei Fehler.
    """
    headers = {"Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}"}
    url = f"{GITHUB_API_BASE_URL}/repos/{GITHUB_REPO}/releases/latest"

    try:
        response = requests.get(url, headers=headers)
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
        "Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}",
        "Accept": "application/octet-stream",
    }
    url = f"{GITHUB_API_BASE_URL}/repos/{GITHUB_REPO}/releases/assets/{asset_id}"
    try:
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        return response.url
    except requests.exceptions.RequestException:
        return None


def check_for_updates_background():
    """
    Prüft im Hintergrund nach einer neuen Version und aktualisiert den Update-Button.
    - Ist eine neuere Version verfügbar, wird der Button rot und führt bei Klick confirm_update aus.
    - Ist die Version bereits aktuell, wird der Button grün und bei Klick erfolgt erneut ein check_for_updates.
    """
    latest_version, latest_assets = get_latest_release()
    if not latest_version:
        log_output.insert(
            tk.END, "Update-Prüfung fehlgeschlagen. Anwendung läuft normal.\n"
        )
        log_output.see(tk.END)
        return

    # Wenn neuere Version verfügbar:
    if latest_version != CURRENT_VERSION:
        log_output.insert(tk.END, f"Neue Version verfügbar: {latest_version}\n")
        log_output.see(tk.END)
        update_button.config(
            fg="red",
            text=f"Update verfügbar ({latest_version})",
            command=lambda: confirm_update(latest_version, latest_assets),
        )
    else:
        # Aktuelle Version = neuester Stand
        log_output.insert(tk.END, "Ihre Version ist aktuell.\n")
        log_output.see(tk.END)
        update_button.config(
            fg="green",
            text=f"Version {CURRENT_VERSION} – aktuell",
            command=check_for_updates,  # Falls User nochmals manuell prüfen möchte
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

    status_label_ = tk.Label(
        update_window, text=f"Update auf {latest_version} wird durchgeführt..."
    )
    status_label_.pack(pady=10)

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
            status_label_,
            progress_bar,
            update_window,
        ),
        daemon=True,
    ).start()


def download_and_replace_files(
    latest_version, latest_assets, status_label_, progress_bar, update_window
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
        status_label_.config(text="Fehler: Update-Dateien nicht gefunden.")
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
                headers={"Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}"},
                stream=True,
                timeout=10,  # Timeout hinzugefügt
            )
            response.raise_for_status()

            total_size = int(response.headers.get("content-length", 0))
            block_size = 8192  # 8 KB
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
            status_label_.config(text=f"Fehler beim Download: {e}")
            progress_bar.stop()
            sys.exit(1)

    # Neue EXE herunterladen (in dasselbe Verzeichnis wie die alte EXE)
    exe_download_url = get_asset_download_url(exe_asset_id)
    if exe_download_url:
        status_label_.config(text="Lade neue Anwendung (EXE) herunter...")
        update_window.update()
        progress_bar["value"] = 0
        new_exe_path = os.path.join(
            os.path.dirname(EXE_PATH),
            f"BootManagerDPT_{latest_version}.exe",
        )
        download_file(
            exe_download_url,
            new_exe_path,
        )

    # Neue Docker-Compose Datei herunterladen
    compose_download_url = get_asset_download_url(compose_asset_id)
    if compose_download_url:
        status_label_.config(text="Lade neue Docker-Compose-Datei herunter...")
        update_window.update()
        progress_bar["value"] = 0
        new_compose_path = os.path.join(
            os.path.dirname(DOCKER_COMPOSE_FILE),
            f"docker-compose-{latest_version}.yml",
        )
        download_file(compose_download_url, new_compose_path)

    status_label_.config(text="Update erfolgreich! Anwendung wird neu gestartet...")
    progress_bar["value"] = progress_bar["maximum"]
    progress_bar.stop()
    update_window.update()
    time.sleep(2)
    restart_application(status_label_, new_exe_path, update_window)


def restart_application(status_label_, new_exe_path, update_window):
    """
    Beendet die aktuelle Anwendung vollständig und startet die neue EXE.
    """
    try:
        status_label_.config(text="Beende alte Version...")
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
#   DOCKER-FUNKTIONEN (START, STOP, PRÜFUNG)
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
        status_label.config(text="Anwendung läuft...", fg="green")
        stop_button.config(state=tk.NORMAL)

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


def reset_to_defaults():
    """
    Setzt die Konfiguration in der versionierten Compose-Datei auf Standardwerte zurück.
    """
    config = load_config()

    # Beispielhafte Defaults – bitte anpassen falls benötigt
    config["services"]["api"]["environment"]["FRONTEND_URL"] = "http://localhost:3000"
    config["services"]["api"]["environment"]["INITIAL_CONTROLLER_PASSWORD"] = "admin"
    config["services"]["web"]["ports"] = ["3000:3000"]
    config["services"]["db"]["environment"]["MYSQL_ROOT_PASSWORD"] = "rootpassword"
    config["services"]["db"]["environment"]["MYSQL_PASSWORD"] = "systempassword"

    save_config(config)
    log_output.insert(tk.END, "Standardwerte wurden zurückgesetzt.\n")
    log_output.see(tk.END)
    reload_gui_values()


def reload_gui_values():
    """
    Aktualisiert die Werte in den Eingabefeldern des GUIs, basierend auf
    dem aktuellen Inhalt der versionierten docker-compose-Datei.
    """
    config = load_config()

    # Frontend-Port
    frontend_port_entry.delete(0, tk.END)
    frontend_port_entry.insert(0, config["services"]["web"]["ports"][0].split(":")[0])

    # MySQL-Root-Passwort
    mysql_root_password_entry.delete(0, tk.END)
    mysql_root_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_ROOT_PASSWORD"]
    )

    # MySQL-Benutzerpasswort
    mysql_user_password_entry.delete(0, tk.END)
    mysql_user_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_PASSWORD"]
    )

    # Initiales Controller-Passwort
    initial_controller_password_entry.delete(0, tk.END)
    initial_controller_password_entry.insert(
        0, config["services"]["api"]["environment"]["INITIAL_CONTROLLER_PASSWORD"]
    )


def update_config():
    """
    Liest die Werte aus den Eingabefeldern und speichert sie in der
    versionierten docker-compose-Datei ab.
    """
    config = load_config()

    frontend_port = frontend_port_entry.get()
    config["services"]["api"]["environment"][
        "FRONTEND_URL"
    ] = f"http://localhost:{frontend_port}"
    config["services"]["web"]["ports"] = [f"{frontend_port}:3000"]
    config["services"]["db"]["environment"][
        "MYSQL_ROOT_PASSWORD"
    ] = mysql_root_password_entry.get()
    config["services"]["db"]["environment"][
        "MYSQL_PASSWORD"
    ] = mysql_user_password_entry.get()
    config["services"]["api"]["environment"][
        "INITIAL_CONTROLLER_PASSWORD"
    ] = initial_controller_password_entry.get()

    save_config(config)
    log_output.insert(tk.END, "Konfiguration gespeichert.\n")
    log_output.see(tk.END)


# ============================================================================
#   HILFSFUNKTIONEN FÜR PROZESSE UND GUI
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
    start_button.config(state=tk.DISABLED)
    stop_button.config(state=tk.DISABLED)
    save_button.config(state=tk.DISABLED)
    reset_button.config(state=tk.DISABLED)
    update_button.config(state=tk.DISABLED)


def enable_action_buttons():
    """
    Aktiviert alle Aktions-Buttons (Start, Stop, Speichern, Reset, Update).
    """
    start_button.config(state=tk.NORMAL)
    stop_button.config(state=tk.NORMAL)
    save_button.config(state=tk.NORMAL)
    reset_button.config(state=tk.NORMAL)
    update_button.config(state=tk.NORMAL)


def start_application():
    """
    Wird aufgerufen, wenn der Benutzer 'Anwendung starten' klickt.
    Docker wird ggf. gestartet, danach wird 'docker-compose up' ausgeführt.
    """
    status_label.config(text="Anwendung startet...", fg="red")
    disable_action_buttons()
    start_docker_if_needed()


def stop_application():
    """
    Wird aufgerufen, wenn der Benutzer 'Anwendung stoppen' klickt.
    Führt 'docker-compose stop' aus und aktualisiert den Anwendungsstatus.
    """
    status_label.config(text="Anwendung wird gestoppt...", fg="red")
    disable_action_buttons()

    def update_status():
        status_label.config(text="Anwendung gestoppt", fg="red")
        enable_action_buttons()
        stop_button.config(state=tk.DISABLED)

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
    Erzeugt das Hauptfenster der Anwendung (Tkinter) und initialisiert
    alle Bedienelemente.
    """
    global root, log_output, status_label
    global start_button, stop_button, save_button, reset_button, update_button
    global frontend_port_entry, mysql_root_password_entry, mysql_user_password_entry, initial_controller_password_entry

    root = tk.Tk()
    root.title(f"Deputatsverwaltung Boot Manager - {CURRENT_VERSION}")
    root.geometry("600x530")

    # Statuslabel
    status_label = tk.Label(root, text="Anwendung nicht gestartet", fg="red")
    status_label.pack()

    # Button zum Öffnen der Anwendung im Browser
    open_browser_button = tk.Button(
        root, text="Deputatsverwaltung im Browser öffnen", command=open_frontend
    )
    open_browser_button.pack(pady=5)

    # Button für manuelle Update-Prüfung
    # Standardtext: "Nach Updates suchen", wir ändern ihn dynamisch nach dem Background-Check
    update_button = tk.Button(
        root, text="Nach Updates suchen", command=check_for_updates
    )
    update_button.pack(pady=5)

    # Frontend-Port
    tk.Label(root, text="Frontend Port (Web)").pack()
    frontend_port_entry = tk.Entry(root)
    frontend_port_entry.pack()

    # MySQL Root Passwort
    tk.Label(root, text="MySQL Root Password").pack()
    mysql_root_password_entry = tk.Entry(root)
    mysql_root_password_entry.pack()

    # MySQL User Passwort
    tk.Label(root, text="MySQL User Password").pack()
    mysql_user_password_entry = tk.Entry(root)
    mysql_user_password_entry.pack()

    # Initiales Controller-Passwort
    tk.Label(root, text="Initial Controller Password").pack()
    initial_controller_password_entry = tk.Entry(root)
    initial_controller_password_entry.pack()

    # Frame für Speichern und Reset
    button_frame = tk.Frame(root)
    button_frame.pack(pady=5)

    save_button = tk.Button(button_frame, text="Speichern", command=update_config)
    save_button.pack(side=tk.LEFT, padx=10)

    reset_button = tk.Button(
        button_frame, text="Standardwerte wiederherstellen", command=reset_to_defaults
    )
    reset_button.pack(side=tk.RIGHT, padx=10)

    # Frame für Start/Stopp
    button_frame2 = tk.Frame(root)
    button_frame2.pack(pady=5)

    start_button = tk.Button(
        button_frame2, text="Anwendung starten", command=start_application
    )
    start_button.pack(side=tk.LEFT, padx=10)

    stop_button = tk.Button(
        button_frame2,
        text="Anwendung stoppen",
        command=stop_application,
        state=tk.DISABLED,
    )
    stop_button.pack(side=tk.RIGHT, padx=10)

    # Konsolenausgabe
    tk.Label(root, text="Konsolenausgabe:").pack()
    log_output = tk.Text(root, height=10, width=70)
    log_output.pack()

    # Automatisch beim Starten nach Updates suchen (Hintergrundprüfung)
    root.after(100, check_for_updates_background)

    # Konfigurationswerte in die GUI-Felder laden
    reload_gui_values()

    # Eventhandler für das Schließen des Fensters
    root.protocol("WM_DELETE_WINDOW", on_closing)

    # Haupt-Loop starten
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
