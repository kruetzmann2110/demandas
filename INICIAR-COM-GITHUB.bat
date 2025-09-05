@echo off
title Sistema de Demandas - GitHub Auto Update v3.0.3
chcp 65001 >nul
color 0B
cls

echo.
echo ========================================
echo 🏢 SISTEMA DE DEMANDAS GOVERNANÇA TOP
echo 📅 Versão 3.0.3 - Auto Update GitHub
echo ========================================
echo.

echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale o Node.js em: https://nodejs.org ou central de Software
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

echo 📦 Verificando dependências...
if not exist "node_modules" (
    echo 🔧 Instalando dependências...
    call npm install express mssql
    if errorlevel 1 (
        echo ⚠️ Aviso: Problemas na instalação das dependências
        echo 🔧 Tente executar manualmente: npm install express mssql
        echo.
    ) else (
        echo ✅ Dependências instaladas
    )
) else (
    echo ✅ Dependências já instaladas
)
echo.

echo 🔄 Iniciando sistema com verificação automática de atualizações...
echo 📡 Repositório: kruetzmann2110/demandas
echo.

:: Executar o sistema com auto-update do GitHub
node startup-with-updates.js

echo.
echo 🛑 Sistema finalizado
pause