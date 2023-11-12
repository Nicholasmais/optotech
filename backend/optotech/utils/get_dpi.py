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

def http_request(root, user_email, result_label):
    global selected_dpi
    root.after(0, lambda: update_gui_with_result(result_label, "Carregando informações DPI para o sistema OptoTech...", "#ffff00")) 
    try:
        if user_email == "" :
            raise Exception("Preencha o campo de E-mail!")
        
        body = {"dpi": round(selected_dpi)}
        response = requests.patch(f"http://localhost:8000/users/{user_email}/", data=body)
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
    except Exception as e:
        result_text = f"Erro na requisição: {e}"
        result_bg = "#f8d4d4"

    root.after(0, lambda: update_gui_with_result(result_label, result_text, result_bg))

def update_gui_with_result(result_label, text, bg):
    result_label.config(text=text, background=bg)

def on_request_button_click(root, email_entry, result_label):
    start_http_request_thread(root, email_entry.get(), result_label)

def start_http_request_thread(root, user_email, result_label):
    threading.Thread(target=http_request, args=(root, user_email, result_label), daemon=True).start()

def on_checkbox_select(checkvar, monitor_index, dpi):
    global selected_dpi  # Referência à variável global   
    if checkvar.get():
        selected_dpi = dpi  # Atualize selected_dpi quando um checkbox é selecionado
        # Uncheck other checkboxes
        for i, var in enumerate(checkbox_vars):
            if i != monitor_index:
                var.set(False)

def display_monitor_info(root, email_entry, result_label):
    root.grid_columnconfigure(1, weight=1)

    monitors = get_monitors()
    global checkbox_vars, selected_dpi
    checkbox_vars = []
    selected_dpi = None

    style.configure("TCheckbutton", font=("Segoe UI", font_size))

    for i, monitor in enumerate(monitors, start=1):
        dpi = get_dpi(monitor)
        diag_px = diagonal(monitor.width, monitor.height)
        diag_mm = diagonal(monitor.width_mm, monitor.height_mm)
        diag_in = mm_to_inches(diag_mm)
        
        primary_text = " (PRINCIPAL)" if monitor.is_primary else ""
        text = f"Monitor {i}{primary_text}:\nResolução: {monitor.width}x{monitor.height} px\nDiagonal: {diag_mm:.2f} mm / {diag_in:.2f} in\nDPI: {dpi:.2f}"
        label = ttk.Label(root, text=text, font=("Segoe UI", font_size), background="#f0f0f0",borderwidth=2, relief="groove", wraplength=screen_width//2)
        label.grid(row=i, column=0, sticky="ew", padx=10, pady=0)

        checkvar = tk.BooleanVar()
        checkbox_vars.append(checkvar)
        checkbox = ttk.Checkbutton(root, text=f"Escolher DPI ({round(dpi)}) do monitor {i}", 
                                   command=lambda dpi=dpi, checkvar=checkvar, i=i-1: on_checkbox_select(checkvar, i, dpi),
                                   variable=checkvar, style="TCheckbutton")
        
        checkbox.grid(row=i, column=1, padx=5, pady=5)
        if i == 1:  # Preselect the DPI of the first monitor by default
            checkvar.set(True)
            selected_dpi = dpi

    email_label = ttk.Label(root, text="Insira seu email cadastrado em Optotech:", font=("Segoe UI", font_size), background="#f0f0f0")
    email_label.grid(row=i+1, column=0, sticky="w", padx=10, pady=0)

    email_entry = ttk.Entry(root, font=("Segoe UI", font_size))
    email_entry.grid(row=i+1, column=1, sticky="ew", padx=10, pady=0)

    # Rótulo para o resultado da requisição HTTP
    result_label = ttk.Label(root, text="Selecione uma DPI de um monitor acima.", font=("Segoe UI", round(font_size*0.75)), background="#ffff00", wraplength=screen_width//2)
    result_label.grid(row=len(monitors) + 2, column=0, sticky="w", padx=10, pady=5)

    # Botão para enviar a requisição
    request_button = ttk.Button(root, text="Enviar DPI Selecionada", command=lambda: on_request_button_click(root, email_entry, result_label))
    request_button.grid(row=len(monitors) + 2, column=1, padx=10, pady=5)

root = tk.Tk()
root.title("Monitor Information")
root.configure(bg='#f0f0f0')
root.state('zoomed')
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()
font_size = max(screen_width, screen_height) // 50  # Exemplo de cálculo proporcional

style = ttk.Style()
style.configure("TLabel", background="#f0f0f0")
style.configure("TButton", font=("Segoe UI", font_size))

email_entry = None
result_label = ttk.Label(root)
display_monitor_info(root, email_entry, result_label)

root.mainloop()
