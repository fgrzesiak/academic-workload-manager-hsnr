import tkinter as tk
import subprocess
import yaml
import threading
import webbrowser
import atexit
import time
import requests
import os
import sys
from tkinter import messagebox, ttk

# Konfiguration für GitHub-Updates
GITHUB_REPO = "fgrzesiak/dpt-testing"
GITHUB_API_BASE_URL = "https://api.github.com"
GITHUB_ACCESS_TOKEN = "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"
CURRENT_VERSION = "1.0.0"  # Diese wird dynamisch in CI/CD aktualisiert
EXE_NAME = f"dpt-boot-manager-{CURRENT_VERSION}.exe"
COMPOSE_NAME = f"docker-compose-{CURRENT_VERSION}.yml"

# Globale Konstanten
EXE_PATH = os.path.abspath(sys.argv[0])  # Pfad zur laufenden EXE-Datei
DOCKER_COMPOSE_FILE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "docker-compose.prod.yml"
)


def get_latest_release():
    """Abrufen der neuesten Release-Version aus der GitHub API."""
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
    """Abrufen der direkten Download-URL für ein Release-Asset über seine Asset-ID."""
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
    """Prüft im Hintergrund nach Updates und aktualisiert die GUI entsprechend."""
    latest_version, latest_assets = get_latest_release()
    if not latest_version:
        log_output.insert(
            tk.END, "Update-Prüfung fehlgeschlagen. Anwendung läuft normal.\n"
        )
        log_output.see(tk.END)
        return

    if latest_version != CURRENT_VERSION:
        log_output.insert(tk.END, f"Neue Version verfügbar: {latest_version}\n")
        log_output.see(tk.END)
        update_button.config(
            fg="red",
            text=f"Update verfügbar ({latest_version})",
            command=lambda: confirm_update(latest_version, latest_assets),
        )
    else:
        log_output.insert(tk.END, "Ihre Version ist aktuell.\n")
        log_output.see(tk.END)


def confirm_update(latest_version, latest_assets):
    """Zeigt eine Bestätigungsbox für das Update an."""
    user_response = messagebox.askyesno(
        "Update bestätigen",
        f"Möchten Sie wirklich von Version {CURRENT_VERSION} auf {latest_version} aktualisieren?",
    )
    if user_response:
        show_update_progress(latest_version, latest_assets)


def show_update_progress(latest_version, latest_assets):
    """Erstellt ein Update-Fenster mit Statusmeldung und Fortschrittsbalken."""
    update_window = tk.Toplevel(root)
    update_window.title("Update läuft")
    update_window.geometry("400x200")

    status_label = tk.Label(
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
        args=(latest_assets, status_label, progress_bar, update_window),
        daemon=True,
    ).start()


def download_and_replace_files(
    latest_assets, status_label, progress_bar, update_window
):
    """Herunterladen und Ersetzen der Anwendungsdateien mit Fortschrittsanzeige."""
    exe_asset_id = None
    compose_asset_id = None

    for asset in latest_assets:
        if asset["name"].endswith(".exe"):
            exe_asset_id = asset["id"]
        elif asset["name"].endswith(".yml"):
            compose_asset_id = asset["id"]

    if not exe_asset_id or not compose_asset_id:
        status_label.config(text="Fehler: Update-Dateien nicht gefunden.")
        progress_bar.stop()
        return

    status_label.config(text="Lade neue Version herunter...")
    update_window.update()

    def download_file(url, save_path):
        response = requests.get(
            url, headers={"Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}"}, stream=True
        )
        total_size = int(response.headers.get("content-length", 0))
        block_size = 8192  # 8 KB
        progress_bar["maximum"] = total_size if total_size else 100

        with open(save_path, "wb") as f:
            downloaded = 0
            for chunk in response.iter_content(block_size):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    progress_bar["value"] = min(downloaded, progress_bar["maximum"])
                    update_window.update()
        progress_bar["value"] = progress_bar["maximum"]  # Ensure full progress

    # Neue EXE herunterladen
    new_exe_path = os.path.join(
        os.path.dirname(EXE_PATH), f"dpt-boot-manager-{CURRENT_VERSION}.exe"
    )
    exe_download_url = get_asset_download_url(exe_asset_id)
    if exe_download_url:
        download_file(exe_download_url, new_exe_path)

    # Neue Docker Compose Datei herunterladen
    new_compose_path = os.path.join(
        os.path.dirname(DOCKER_COMPOSE_FILE), f"docker-compose-{CURRENT_VERSION}.yml"
    )
    compose_download_url = get_asset_download_url(compose_asset_id)
    if compose_download_url:
        download_file(compose_download_url, new_compose_path)

    status_label.config(text="Update erfolgreich! Anwendung wird neu gestartet...")
    progress_bar.stop()
    update_window.update()
    time.sleep(2)
    restart_application(status_label, new_exe_path, update_window)


def restart_application(status_label, new_exe_path, update_window):
    """Neustart der Anwendung nach einem Update."""
    try:
        # Terminate the current process
        status_label.config(text="Beende alte Version...")
        update_window.update()
        time.sleep(1)

        subprocess.Popen([new_exe_path])
        update_window.destroy()  # Close the update window
        sys.exit()
    except Exception as e:
        print(f"Fehler beim Neustart: {e}")


def check_for_updates():
    """Manuelle Prüfung auf Updates durch den Benutzer."""
    log_output.insert(tk.END, "Suche nach Updates...\n")
    log_output.see(tk.END)
    threading.Thread(target=check_for_updates_background, daemon=True).start()


# https://stackoverflow.com/a/53605128
def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


docker_compose_file = "docker-compose.prod.yml"


def load_config():
    with open(docker_compose_file, "r", newline="\n") as file:
        return yaml.safe_load(file)


def save_config(config):
    with open(docker_compose_file, "w", newline="\n") as file:
        yaml.safe_dump(config, file, default_flow_style=False)


def open_frontend():
    config = load_config()
    frontend_url = config["services"]["api"]["environment"].get(
        "FRONTEND_URL", "http://localhost:3000"
    )
    webbrowser.open(frontend_url)


def reset_to_defaults():
    config = load_config()
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
    config = load_config()
    frontend_port_entry.delete(0, tk.END)
    frontend_port_entry.insert(0, config["services"]["web"]["ports"][0].split(":")[0])
    mysql_root_password_entry.delete(0, tk.END)
    mysql_root_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_ROOT_PASSWORD"]
    )
    mysql_user_password_entry.delete(0, tk.END)
    mysql_user_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_PASSWORD"]
    )
    initial_controller_password_entry.delete(0, tk.END)
    initial_controller_password_entry.insert(
        0, config["services"]["api"]["environment"]["INITIAL_CONTROLLER_PASSWORD"]
    )


def run_command(command, on_complete=None):
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


def is_docker_running():
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
    def docker_thread():
        if not is_docker_running():
            root.after(
                0,
                lambda: log_output.insert(tk.END, "Docker Desktop wird gestartet...\n"),
            )
            root.after(0, log_output.see, tk.END)
            subprocess.run(
                ["start", "", "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"],
                shell=True,
            )
            time.sleep(10)  # Wartezeit für Docker Desktop-Start
            while not is_docker_running():
                time.sleep(5)
                root.after(
                    0,
                    lambda: log_output.insert(tk.END, "Warte auf Docker Desktop...\n"),
                )
                root.after(0, log_output.see, tk.END)
            root.after(0, lambda: log_output.insert(tk.END, "Docker Desktop läuft.\n"))
            root.after(0, log_output.see, tk.END)
        start_docker_compose()

    threading.Thread(target=docker_thread, daemon=True).start()


def start_docker_compose():
    def update_status():
        status_label.config(text="Anwendung läuft...", fg="green")
        stop_button.config(state=tk.NORMAL)

    threading.Thread(
        target=run_command,
        args=(
            "docker-compose -f " + docker_compose_file + " up -d --pull always",
            update_status,
        ),
    ).start()


def start_application():
    status_label.config(text="Anwendung startet...", fg="red")
    disable_action_buttons()
    start_docker_if_needed()


def disable_action_buttons():
    start_button.config(state=tk.DISABLED)
    stop_button.config(state=tk.DISABLED)
    save_button.config(state=tk.DISABLED)
    reset_button.config(state=tk.DISABLED)
    update_button.config(state=tk.DISABLED)


def enable_action_buttons():
    start_button.config(state=tk.NORMAL)
    stop_button.config(state=tk.NORMAL)
    save_button.config(state=tk.NORMAL)
    reset_button.config(state=tk.NORMAL)
    update_button.config(state=tk.NORMAL)


def stop_application():
    status_label.config(text="Anwendung wird gestoppt...", fg="red")
    disable_action_buttons()

    def update_status():
        status_label.config(text="Anwendung gestoppt", fg="red")
        enable_action_buttons()
        stop_button.config(state=tk.DISABLED)

    threading.Thread(
        target=run_command,
        args=("docker-compose -f " + docker_compose_file + " stop", update_status),
    ).start()


def update_config():
    config = load_config()
    frontend_port = frontend_port_entry.get()
    config["services"]["api"]["environment"]["FRONTEND_URL"] = (
        "http://localhost:" + frontend_port
    )
    config["services"]["web"]["ports"] = [frontend_port + ":3000"]
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


def create_gui():
    global log_output, status_label, root, start_button, stop_button, save_button, reset_button, update_button
    global frontend_port_entry, mysql_root_password_entry, mysql_user_password_entry, initial_controller_password_entry
    config = load_config()

    root = tk.Tk()
    root.title(f"Deputatsverwaltung Boot Manager - v{CURRENT_VERSION}")
    root.geometry("600x530")

    status_label = tk.Label(root, text="Anwendung nicht gestartet", fg="red")
    status_label.pack()

    open_browser_button = tk.Button(
        root, text="Deputatsverwaltung im Browser öffnen", command=open_frontend
    )
    open_browser_button.pack(pady=5)

    update_button = tk.Button(
        root, text="Nach Updates suchen", command=check_for_updates
    )
    update_button.pack(pady=5)

    tk.Label(root, text="Frontend Port (Web)").pack()
    frontend_port_entry = tk.Entry(root)
    frontend_port_entry.insert(0, config["services"]["web"]["ports"][0].split(":")[0])
    frontend_port_entry.pack()

    tk.Label(root, text="MySQL Root Password").pack()
    mysql_root_password_entry = tk.Entry(root)
    mysql_root_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_ROOT_PASSWORD"]
    )
    mysql_root_password_entry.pack()

    tk.Label(root, text="MySQL User Password").pack()
    mysql_user_password_entry = tk.Entry(root)
    mysql_user_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_PASSWORD"]
    )
    mysql_user_password_entry.pack()

    tk.Label(root, text="Initial Controller Password").pack()
    initial_controller_password_entry = tk.Entry(root)
    initial_controller_password_entry.insert(
        0, config["services"]["api"]["environment"]["INITIAL_CONTROLLER_PASSWORD"]
    )
    initial_controller_password_entry.pack()

    button_frame = tk.Frame(root)
    button_frame.pack(pady=5)

    save_button = tk.Button(button_frame, text="Speichern", command=update_config)
    save_button.pack(side=tk.LEFT, padx=10)

    reset_button = tk.Button(
        button_frame, text="Standardwerte wiederherstellen", command=reset_to_defaults
    )
    reset_button.pack(side=tk.RIGHT, padx=10)

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

    tk.Label(root, text="Konsolenausgabe:").pack()
    log_output = tk.Text(root, height=10, width=70)
    log_output.pack()

    root.after(100, check_for_updates_background)
    root.mainloop()


def stop_docker_compose():
    subprocess.run(["docker-compose", "-f", docker_compose_file, "stop"])


def on_closing():
    stop_docker_compose()
    root.destroy()


atexit.register(stop_docker_compose)

if __name__ == "__main__":
    create_gui()
