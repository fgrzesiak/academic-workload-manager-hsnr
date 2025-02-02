import tkinter as tk
import subprocess
import yaml
import threading
import os

docker_compose_file = "docker-compose.prod.yml"
docker_compose_backup = "docker-compose.prod.yml.bak"


def load_config():
    with open(docker_compose_file, "r", newline="\n") as file:
        return yaml.safe_load(file)


def save_config(config):
    with open(docker_compose_file, "w", newline="\n") as file:
        yaml.safe_dump(config, file, default_flow_style=False)


def reset_to_defaults():
    if os.path.exists(docker_compose_backup):
        with open(docker_compose_backup, "r") as file:
            with open(docker_compose_file, "w") as dest:
                dest.write(file.read())
        log_output.insert(
            tk.END, "Docker Compose Datei auf Standardwerte zurückgesetzt.\n"
        )
        log_output.see(tk.END)


def run_command(command, on_complete=None):
    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
    )

    start_button.config(state=tk.DISABLED)
    stop_button.config(state=tk.DISABLED)

    def read_stream(stream):
        for line in iter(stream.readline, ""):
            log_output.insert(tk.END, line)
            log_output.see(tk.END)
            log_output.update_idletasks()

    stdout_thread = threading.Thread(
        target=read_stream, args=(process.stdout,), daemon=True
    )
    stderr_thread = threading.Thread(
        target=read_stream, args=(process.stderr,), daemon=True
    )

    stdout_thread.start()
    stderr_thread.start()

    process.wait()  # Warte, bis der Prozess beendet ist

    start_button.config(state=tk.NORMAL)
    stop_button.config(state=tk.NORMAL)

    if on_complete:
        root.after(100, on_complete)  # GUI-Update nach Abschluss des Prozesses


def start_application():
    status_label.config(text="Anwendung läuft...", fg="green")
    threading.Thread(
        target=run_command,
        args=("docker-compose -f " + docker_compose_file + " up -d --pull always",),
    ).start()


def stop_application():
    def update_status():
        status_label.config(text="Anwendung gestoppt", fg="red")

    threading.Thread(
        target=run_command,
        args=("docker-compose -f " + docker_compose_file + " down", update_status),
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


def create_gui():
    global log_output, status_label, root, start_button, stop_button
    config = load_config()

    root = tk.Tk()
    root.title("Docker Compose GUI")
    root.geometry("600x500")

    status_label = tk.Label(root, text="Anwendung nicht gestartet", fg="red")
    status_label.pack()

    tk.Label(root, text="Frontend Port (Web)").pack()
    global frontend_port_entry
    frontend_port_entry = tk.Entry(root)
    frontend_port_entry.insert(0, config["services"]["web"]["ports"][0].split(":")[0])
    frontend_port_entry.pack()

    tk.Label(root, text="MySQL Root Password").pack()
    global mysql_root_password_entry
    mysql_root_password_entry = tk.Entry(root)
    mysql_root_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_ROOT_PASSWORD"]
    )
    mysql_root_password_entry.pack()

    tk.Label(root, text="MySQL User Password").pack()
    global mysql_user_password_entry
    mysql_user_password_entry = tk.Entry(root)
    mysql_user_password_entry.insert(
        0, config["services"]["db"]["environment"]["MYSQL_PASSWORD"]
    )
    mysql_user_password_entry.pack()

    tk.Label(root, text="Initial Controller Password").pack()
    global initial_controller_password_entry
    initial_controller_password_entry = tk.Entry(root)
    initial_controller_password_entry.insert(
        0, config["services"]["api"]["environment"]["INITIAL_CONTROLLER_PASSWORD"]
    )
    initial_controller_password_entry.pack()

    save_button = tk.Button(root, text="Speichern", command=update_config)
    save_button.pack(pady=5)

    button_frame = tk.Frame(root)
    button_frame.pack(pady=5)

    start_button = tk.Button(
        button_frame, text="Anwendung starten", command=start_application
    )
    start_button.pack(side=tk.LEFT, padx=10)

    stop_button = tk.Button(
        button_frame, text="Anwendung stoppen", command=stop_application
    )
    stop_button.pack(side=tk.RIGHT, padx=10)

    reset_button = tk.Button(
        root, text="Standardwerte wiederherstellen", command=reset_to_defaults
    )
    reset_button.pack(pady=5)

    tk.Label(root, text="Konsolenausgabe:").pack()
    log_output = tk.Text(root, height=10, width=70)
    log_output.pack()

    root.mainloop()


if __name__ == "__main__":
    create_gui()
