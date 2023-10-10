#!/bin/bash

# Abrir um novo terminal para o servidor front-end e executar os comandos
wsl.exe -d Ubuntu -e bash -c 'cd frontend/ && npm install && npm run dev'

# Aguarde um curto período de tempo para o primeiro terminal abrir
sleep 2

# Abrir um novo terminal para o servidor back-end e executar os comandos
wsl.exe -d Ubuntu -e bash -c 'cd backend/ && python3 manage.py runserver'
