@echo off
title Download Sistema Demandas - Producao
chcp 65001 >nul
color 0B
cls

echo.
echo ========================================
echo 📥 DOWNLOAD SISTEMA DE DEMANDAS
echo 📅 Versão 2.0.0 - Produção GitHub
echo ========================================
echo.

echo 🔍 Verificando Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não encontrado!
    echo.
    echo 📥 OPÇÃO 1 - Instalar Git:
    echo    1. Baixe em: https://git-scm.com/download/win
    echo    2. Instale com configurações padrão
    echo    3. Execute este script novamente
    echo.
    echo 📥 OPÇÃO 2 - Download manual:
    echo    1. Acesse: https://github.com/kruetzmann2110/demandas
    echo    2. Clique em "Code" > "Download ZIP"
    echo    3. Extrair para pasta de produção
    echo.
    pause
    exit /b 1
)

echo ✅ Git detectado
echo.

echo 🔄 Fazendo download do repositório...
echo 📡 URL: https://github.com/kruetzmann2110/demandas.git
echo.

:: Remover pasta existente se houver
if exist demandas rmdir /s /q demandas

:: Clonar repositório
git clone https://github.com/kruetzmann2110/demandas.git

if errorlevel 1 (
    echo ❌ Erro no download!
    echo.
    echo 🔧 SOLUÇÕES:
    echo    1. Verificar conexão com internet
    echo    2. Tentar download manual do ZIP
    echo    3. Contatar suporte técnico
    echo.
    pause
    exit /b 1
)

echo ✅ Download concluído!
echo.

echo 📂 Entrando na pasta do sistema...
cd demandas

echo 📦 Instalando dependências...
npm install express mssql

if errorlevel 1 (
    echo ⚠️ Erro ao instalar dependências
    echo 🔄 Tentando novamente...
    npm install
)

echo.
echo ✅ INSTALAÇÃO CONCLUÍDA!
echo.
echo 🎯 PRÓXIMOS PASSOS:
echo    1. Verificar se funcionou: node startup-with-updates.js --test
echo    2. Iniciar sistema: INICIAR-COM-GITHUB.bat
echo    3. Acesso: http://localhost:3000
echo.
echo 📂 Sistema instalado em: %CD%
echo.

pause