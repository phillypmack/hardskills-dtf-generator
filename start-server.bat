@echo off
echo ========================================
echo   HardSkills - Servidor Local
echo ========================================
echo.
echo Atualizando lista de SVGs...
node generate-svg-list.cjs
echo.
echo Iniciando servidor HTTP na porta 5173...
echo.
echo Acesse: http://localhost:5173
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

REM Verifica se Python está instalado
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Usando Python...
    python -m http.server 5173
) else (
    REM Tenta usar Node.js
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Usando Node.js...
        npx http-server -p 5173 -o
    ) else (
        echo.
        echo ERRO: Nem Python nem Node.js foram encontrados!
        echo.
        echo Por favor, instale uma das opcoes:
        echo   - Python: https://www.python.org/downloads/
        echo   - Node.js: https://nodejs.org/
        echo.
        pause
    )
)
