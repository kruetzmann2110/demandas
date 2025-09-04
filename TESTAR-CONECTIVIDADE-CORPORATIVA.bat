@echo off
title Teste Conectividade Corporativa - GitHub
chcp 65001 >nul
color 0E
cls

echo.
echo ================================================================
echo 🏢 TESTE DE CONECTIVIDADE CORPORATIVA - GITHUB
echo ================================================================
echo.

echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

echo 🧪 Testando métodos de download para ambiente corporativo...
echo.

echo [1/4] Teste método padrão HTTPS...
node scripts/github-update-system.js --test

echo.
echo [2/4] Teste método corporativo...
node scripts/corporate-downloader.js --test

echo.
echo [3/4] Teste curl direto...
echo 📥 Tentando download com curl...
curl -k -L -o temp-test.json "https://raw.githubusercontent.com/kruetzmann2110/demandas/main/releases/versao.json"
if exist temp-test.json (
    echo ✅ Curl funcionou!
    type temp-test.json
    del temp-test.json
) else (
    echo ❌ Curl falhou
)

echo.
echo [4/4] Teste PowerShell...
echo 📥 Tentando download com PowerShell...
powershell -Command "[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; try { Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/kruetzmann2110/demandas/main/releases/versao.json' -OutFile 'temp-test-ps.json' -UseBasicParsing; Write-Host 'PowerShell funcionou!' } catch { Write-Host 'PowerShell falhou:' $_.Exception.Message }"

if exist temp-test-ps.json (
    echo ✅ PowerShell funcionou!
    type temp-test-ps.json
    del temp-test-ps.json
) else (
    echo ❌ PowerShell falhou
)

echo.
echo ================================================================
echo 📊 RESUMO DO TESTE
echo ================================================================
echo.

echo 💡 SOLUÇÕES PARA AMBIENTE CORPORATIVO:
echo.
echo 1. 🔧 SE CURL FUNCIONOU:
echo    • O sistema usará curl automaticamente como fallback
echo    • Execute: node startup-with-updates.js
echo.
echo 2. 🔧 SE POWERSHELL FUNCIONOU:
echo    • O sistema usará PowerShell automaticamente como fallback
echo    • Execute: node startup-with-updates.js
echo.
echo 3. 🔧 SE NENHUM FUNCIONOU:
echo    • GitHub está bloqueado pela rede corporativa
echo    • Sistema funcionará offline (sem atualizações automáticas)
echo    • Para atualizar: baixe manualmente do GitHub
echo.
echo 4. 🌐 ACESSO MANUAL:
echo    • URL: https://github.com/kruetzmann2110/demandas
echo    • Baixe ZIP e extraia sobre a instalação atual
echo.

echo 📞 SUPORTE:
echo    📧 fabiano.kruetzmann@telefonica.com
echo    🐛 https://github.com/kruetzmann2110/demandas/issues
echo.

pause