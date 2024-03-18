import tkinter as tk
from tkinter import ttk
import requests
import threading
from screeninfo import get_monitors

def mm_to_inches(val):
    return val / 25.4

def diagonal(w, h):
    return (w**2 + h**2)**0.5

def get_dpi(monitor):
    diag_px = diagonal(monitor.width, monitor.height)
    diag_in = mm_to_inches(diagonal(monitor.width_mm, monitor.height_mm))
    return diag_px / diag_in

def http_request(root, user_id, dpi, result_label):
    root.after(0, lambda: update_gui_with_result(result_label, "Carregando informações DPI para o sistema OptoTech...", "#ffff00")) 
    try:
        body = {"dpi": round(dpi)}
        response = requests.patch(f"http://localhost:8000/users/{user_id}/", data=body)
        if response.status_code == 200:
            helper_dict = {"user": "Usuário", "email": "E-mail", "dpi": "DPI"}
            text_body = response.json()
            text_body = {helper_dict.get(k, k): text_body.get(k, None) for k in helper_dict}
            text = f"\n"
            for chave, valor in text_body.items():
                text += f"{chave} : {valor}"
                if chave != "DPI":
                    text += "\n"
            result_text = f"Sucesso: {text}\nVocê pode fechar esta janela e voltar para o OptoTech."
            result_bg = "#d4f8d4"
        else:            
            result_text = f"Falha: Código de status {response.status_code}\nDetalhe: {response.json()}"
            result_bg = "#f8d4d4"
    except requests.exceptions.RequestException as e:
        result_text = f"Erro na requisição: {e}"
        result_bg = "#f8d4d4"

    # Atualiza a interface gráfica no thread principal
    root.after(0, lambda: update_gui_with_result(result_label, result_text, result_bg))

def update_gui_with_result(result_label, text, bg):
    result_label.config(text=text, background=bg)

def start_http_request_thread(root, user_id, dpi, result_label):
    threading.Thread(target=http_request, args=(root, user_id, dpi, result_label), daemon=True).start()

def display_monitor_info(root, user_id):
    user_id_label = ttk.Label(root, text=f"User ID: {user_id}", font=("Segoe UI", 10), background="#f0f0f0")
    user_id_label.grid(row=0, column=0, sticky="w", padx=10, pady=5)

    monitors = get_monitors()
    for i, monitor in enumerate(monitors, start=1):
        dpi = get_dpi(monitor)
        diag_px = diagonal(monitor.width, monitor.height)
        diag_mm = diagonal(monitor.width_mm, monitor.height_mm)
        diag_in = mm_to_inches(diag_mm)
        primary_text = " (PRINCIPAL)" if monitor.is_primary else ""
        text = f"Monitor {i}: {monitor.width}x{monitor.height} px, Diagonal: {diag_mm:.2f} mm / {diag_in:.2f} in, DPI: {dpi:.2f}{primary_text}"
        label = ttk.Label(root, text=text, font=("Segoe UI", 10), background="#f0f0f0")
        label.grid(row=i, column=0, sticky="w", padx=10, pady=5)
        dpi_button = ttk.Button(root, text=f"Escolher DPI ({round(dpi)}) do monitor {i}", command=lambda dpi=dpi: start_http_request_thread(root, user_id, dpi, result_label))
        dpi_button.grid(row=i, column=1, padx=5, pady=5)

    # Rótulo para o resultado da requisição HTTP
    result_label = ttk.Label(root, text="Selecione uma DPI de um monitor acima.", font=("Segoe UI", 10), background="#ffff00")
    result_label.grid(row=len(monitors) + 1, column=0, columnspan=2, sticky="w", padx=10, pady=5)

# Configurando a janela Tkinter
root = tk.Tk()
root.title("Monitor Information")
root.configure(bg='#f0f0f0')
root.geometry("700x400")

style = ttk.Style()
style.configure("TLabel", background="#f0f0f0")
style.configure("TButton", font=("Segoe UI", 10))

user_id = "{{USER_id}}"
display_monitor_info(root, user_id)

root.mainloop()
