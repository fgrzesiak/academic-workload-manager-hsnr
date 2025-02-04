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
from tkinter import messagebox

GITHUB_REPO = "fgrzesiak/dpt-testing"
CURRENT_VERSION = "1.0.0"  # This will be dynamically updated in CI/CD
docker_compose_file = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "docker-compose.prod.yml"
)
exe_path = os.path.abspath(sys.argv[0])  # Path to the running exe file


def get_latest_release():
    """Fetch the latest release version from GitHub"""
    headers = {
        "Authorization": "Bearer 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"
    }
    url = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["tag_name"], data["assets"]
    except requests.exceptions.RequestException as e:
        log_output.insert(tk.END, f"Fehler beim Abrufen der neuesten Version: {e}\n")
        log_output.see(tk.END)
        return None, None


def download_and_replace_files(latest_assets):
    """Download and replace the application files if an update is found"""
    global exe_path, docker_compose_file

    exe_url = None
    compose_url = None
    headers = {"Authorization": "Bearer YOUR_GITHUB_ACCESS_TOKEN"}

    for asset in latest_assets:
        if asset["name"].endswith(".exe"):
            exe_url = asset["browser_download_url"]
        elif "docker-compose" in asset["name"]:
            compose_url = asset["browser_download_url"]

    if not exe_url or not compose_url:
        log_output.insert(tk.END, "Update-Dateien konnten nicht gefunden werden.\n")
        log_output.see(tk.END)
        return

    log_output.insert(tk.END, "Lade neueste Version herunter...\n")
    log_output.see(tk.END)

    # Download new EXE
    new_exe_path = exe_path + ".new"
    with requests.get(exe_url, headers=headers, stream=True) as r:
        if r.status_code == 404:
            log_output.insert(
                tk.END, "Fehler: Exe-Datei nicht gefunden. Prüfe die Berechtigungen.\n"
            )
            log_output.see(tk.END)
            return
        r.raise_for_status()
        with open(new_exe_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

    # Download new Docker Compose file
    with requests.get(compose_url, headers=headers, stream=True) as r:
        if r.status_code == 404:
            log_output.insert(tk.END, "Fehler: Docker Compose Datei nicht gefunden.\n")
            log_output.see(tk.END)
            return
        r.raise_for_status()
        with open(docker_compose_file, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

    # Replace old EXE with new one
    os.rename(exe_path, exe_path + ".old")
    os.rename(new_exe_path, exe_path)

    log_output.insert(tk.END, "Update abgeschlossen. Starte Anwendung neu...\n")
    log_output.see(tk.END)

    restart_application()


def restart_application():
    """Restart the application after an update"""
    log_output.insert(tk.END, "Starte Anwendung neu...\n")
    log_output.see(tk.END)
    subprocess.Popen([exe_path])
    sys.exit()


def check_for_updates():
    """Check for updates and prompt the user"""
    latest_version, latest_assets = get_latest_release()
    if not latest_version:
        return

    if latest_version != CURRENT_VERSION:
        log_output.insert(tk.END, f"Neue Version verfügbar: {latest_version}\n")
        log_output.see(tk.END)

        update_prompt = messagebox.askyesno(
            "Update verfügbar",
            f"Version {latest_version} ist verfügbar. Jetzt aktualisieren?",
        )
        if update_prompt:
            download_and_replace_files(latest_assets)
    else:
        log_output.insert(tk.END, "Ihre Version ist aktuell.\n")
        log_output.see(tk.END)


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


def disable_controls():
    start_button.config(state=tk.DISABLED)
    stop_button.config(state=tk.DISABLED)
    save_button.config(state=tk.DISABLED)
    reset_button.config(state=tk.DISABLED)
    frontend_port_entry.config(state=tk.DISABLED)
    mysql_root_password_entry.config(state=tk.DISABLED)
    mysql_user_password_entry.config(state=tk.DISABLED)
    initial_controller_password_entry.config(state=tk.DISABLED)


def enable_controls():
    start_button.config(state=tk.NORMAL)
    stop_button.config(state=tk.NORMAL)
    save_button.config(state=tk.NORMAL)
    reset_button.config(state=tk.NORMAL)
    frontend_port_entry.config(state=tk.NORMAL)
    mysql_root_password_entry.config(state=tk.NORMAL)
    mysql_user_password_entry.config(state=tk.NORMAL)
    initial_controller_password_entry.config(state=tk.NORMAL)


def run_command(command, on_complete=None):
    disable_controls()
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
    enable_controls()
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
        start_button.config(state=tk.DISABLED)
        stop_button.config(state=tk.NORMAL)
        save_button.config(state=tk.DISABLED)
        reset_button.config(state=tk.DISABLED)
        frontend_port_entry.config(state=tk.DISABLED)
        mysql_root_password_entry.config(state=tk.DISABLED)
        mysql_user_password_entry.config(state=tk.DISABLED)
        initial_controller_password_entry.config(state=tk.DISABLED)

    threading.Thread(
        target=run_command,
        args=(
            "docker-compose -f " + docker_compose_file + " up -d --pull always",
            update_status,
        ),
    ).start()


def start_application():
    status_label.config(text="Anwendung startet...", fg="red")
    start_button.config(state=tk.DISABLED)
    stop_button.config(state=tk.DISABLED)

    start_docker_if_needed()


def stop_application():
    status_label.config(text="Anwendung wird gestoppt...", fg="red")
    start_button.config(state=tk.DISABLED)
    stop_button.config(state=tk.DISABLED)

    def update_status():
        status_label.config(text="Anwendung gestoppt", fg="red")
        start_button.config(state=tk.NORMAL)
        stop_button.config(state=tk.DISABLED)
        save_button.config(state=tk.NORMAL)
        reset_button.config(state=tk.NORMAL)
        frontend_port_entry.config(state=tk.NORMAL)
        mysql_root_password_entry.config(state=tk.NORMAL)
        mysql_user_password_entry.config(state=tk.NORMAL)
        initial_controller_password_entry.config(state=tk.NORMAL)

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
    global log_output, status_label, root, start_button, stop_button, save_button, reset_button
    global frontend_port_entry, mysql_root_password_entry, mysql_user_password_entry, initial_controller_password_entry
    config = load_config()

    root = tk.Tk()
    root.title("Deputatsverwaltung Boot Manager")
    root.geometry("600x500")

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
        button_frame2, text="Anwendung stoppen", command=stop_application
    )
    stop_button.pack(side=tk.RIGHT, padx=10)

    tk.Label(root, text="Konsolenausgabe:").pack()
    log_output = tk.Text(root, height=10, width=70)
    log_output.pack()

    root.mainloop()


def stop_docker_compose():
    subprocess.run(["docker-compose", "-f", docker_compose_file, "stop"])


def on_closing():
    stop_docker_compose()
    root.destroy()


atexit.register(stop_docker_compose)

if __name__ == "__main__":
    create_gui()
