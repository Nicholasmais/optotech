import tkinter as tk
from tkinter import ttk
from screeninfo import get_monitors

def mm_to_inches(val):
    return val / 25.4

def diagonal(w, h):
    return (w**2 + h**2)**0.5

def get_dpi(monitor):
    diag_px = diagonal(monitor.width, monitor.height)
    diag_in = mm_to_inches(diagonal(monitor.width_mm, monitor.height_mm))
    return diag_px / diag_in


def update_gui_with_result(result_label, text, bg):
    result_label.config(text=text, background=bg)

def on_checkbox_select(checkvar, monitor_index, dpi):
    global selected_dpi
    if checkvar.get():
        selected_dpi = dpi        
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
        checkbox = ttk.Checkbutton(root, text=f"Escolher DPI ({zz(dpi)}) do monitor {i}", 
                                   command=lambda dpi=dpi, checkvar=checkvar, i=i-1: on_checkbox_select(checkvar, i, dpi),
                                   variable=checkvar, style="TCheckbutton")
        
        checkbox.grid(row=i, column=1, padx=5, pady=5)
        if i == 1: 
            checkvar.set(True)
            selected_dpi = dpi

    email_label = ttk.Label(root, text="Insira seu email cadastrado em Optotech:", font=("Segoe UI", font_size), background="#f0f0f0")
    email_label.grid(row=i+1, column=0, sticky="w", padx=10, pady=0)

    email_entry = ttk.Entry(root, font=("Segoe UI", font_size))
    email_entry.grid(row=i+1, column=1, sticky="ew", padx=10, pady=0)

    result_label = ttk.Label(root, text="Selecione uma DPI de um monitor acima.", font=("Segoe UI", round(font_size*0.75)), background="#ffff00", wraplength=screen_width//2)
    result_label.grid(row=len(monitors) + 2, column=0, sticky="w", padx=10, pady=5)

root = tk.Tk()
root.title("Monitor Information")
root.configure(bg='#f0f0f0')
root.state('zoomed')
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()
font_size = max(screen_width, screen_height) // 50 

style = ttk.Style()
style.configure("TLabel", background="#f0f0f0")
style.configure("TButton", font=("Segoe UI", font_size))

email_entry = None
result_label = ttk.Label(root)
display_monitor_info(root, email_entry, result_label)

root.mainloop()
