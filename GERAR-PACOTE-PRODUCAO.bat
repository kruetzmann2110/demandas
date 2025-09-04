@echo off
title Gerador de Pacote para Producao
chcp 65001 >nul
color 0B
cls

echo.
echo ================================================================
echo 📦 GERADOR DE PACOTE PARA PRODUÇÃO
echo    Sistema de Demandas Governança TOP v2.0.1
echo ================================================================
echo.

echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 SOLUÇÃO:
    echo    1. Baixe Node.js: https://nodejs.org
    echo    2. Instale a versão LTS
    echo    3. Reinicie o computador
    echo    4. Execute este script novamente
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detectado
echo.

echo 🚀 Iniciando geração do pacote...
echo.

:: Executar gerador de pacote
node scripts/gerar-pacote-producao.js

echo.
echo ================================================================
echo 📋 INSTRUÇÕES DE DISTRIBUIÇÃO
echo ================================================================
echo.

echo 📦 COMO DISTRIBUIR:
echo.
echo 1️⃣ ENVIO POR EMAIL:
echo    • Anexe o arquivo ZIP gerado
echo    • Inclua as instruções de instalação
echo.
echo 2️⃣ COMPARTILHAMENTO EM REDE:
echo    • Copie o ZIP para pasta compartilhada
echo    • Informe o caminho aos usuários
echo.
echo 3️⃣ PENDRIVE/MÍDIA FÍSICA:
echo    • Copie o ZIP para pendrive
echo    • Distribua fisicamente
echo.
echo ✅ CADA USUÁRIO DEVE:
echo    1. Extrair o ZIP em uma pasta
echo    2. Instalar Node.js (se não tiver)
echo    3. Executar: INICIAR-COM-GITHUB.bat
echo.

echo 🔧 RESOLUÇÃO DE PROBLEMAS:
echo    • TESTAR-CONECTIVIDADE-CORPORATIVA.bat
echo    • CORRIGIR-PRODUCAO.bat
echo    • diagnostico-producao.js
echo.

echo 📞 SUPORTE:
echo    📧 fabiano.kruetzmann@telefonica.com
echo    🐛 https://github.com/kruetzmann2110/demandas/issues
echo.

pause