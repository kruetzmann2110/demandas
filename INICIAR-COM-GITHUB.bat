@echo off
title Sistema de Demandas - GitHub Auto Update
chcp 65001 >nul
color 0B
cls

echo.
echo ========================================
echo 🏢 SISTEMA DE DEMANDAS GOVERNANÇA TOP
echo 📅 Versão 2.0.0 - Auto Update GitHub
echo ========================================
echo.

echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale o Node.js em: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

echo 🔄 Iniciando sistema com verificação automática de atualizações...
echo 📡 Repositório: kruetzmann2110/demandas
echo.

:: Executar o sistema com auto-update do GitHub
node startup-with-updates.js

echo.
echo 🛑 Sistema finalizado
pause