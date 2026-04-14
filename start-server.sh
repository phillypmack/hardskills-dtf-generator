#!/bin/bash

echo "========================================"
echo "  HardSkills - Servidor Local"
echo "========================================"
echo
echo "Atualizando lista de SVGs..."
node generate-svg-list.cjs
echo
echo "Iniciando servidor HTTP na porta 5173..."
echo
echo "Acesse: http://localhost:5173"
echo
echo "Pressione Ctrl+C para parar o servidor"
echo "========================================"
echo

# Verifica se Python está instalado
if command -v python3 &> /dev/null; then
    echo "Usando Python..."
    python3 -m http.server 5173
elif command -v python &> /dev/null; then
    echo "Usando Python..."
    python -m http.server 5173
# Tenta usar Node.js
elif command -v node &> /dev/null; then
    echo "Usando Node.js..."
    npx http-server -p 5173 -o
else
    echo
    echo "ERRO: Nem Python nem Node.js foram encontrados!"
    echo
    echo "Por favor, instale uma das opções:"
    echo "  - Python: sudo apt install python3"
    echo "  - Node.js: https://nodejs.org/"
    echo
    read -p "Pressione Enter para sair..."
fi
