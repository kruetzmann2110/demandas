@echo off
title Instalacao Completa - Sistema de Demandas
chcp 65001 >nul
color 0A
cls

echo.
echo ================================================================
echo 🚀 INSTALAÇÃO COMPLETA - SISTEMA DE DEMANDAS GOVERNANÇA TOP
echo ================================================================
echo.

:: Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 SOLUÇÃO:
    echo    1. Baixe o Node.js: https://nodejs.org
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

:: Criar estrutura de pastas
echo [2/5] Criando estrutura de pastas...
if not exist "backend" mkdir backend
if not exist "web" mkdir web
if not exist "web\js" mkdir web\js
if not exist "web\css" mkdir web\css
if not exist "scripts" mkdir scripts
if not exist "releases" mkdir releases
if not exist "docs" mkdir docs
echo ✅ Estrutura de pastas criada
echo.

:: Baixar arquivos essenciais do GitHub
echo [3/5] Baixando arquivos do GitHub...
echo 📡 Conectando a: https://github.com/kruetzmann2110/demandas
echo.

:: Função para baixar arquivos
call :baixar_arquivo "startup-with-updates.js" "startup-with-updates.js"
call :baixar_arquivo "scripts/github-update-system.js" "scripts\github-update-system.js"
call :baixar_arquivo "INICIAR-COM-GITHUB.bat" "INICIAR-COM-GITHUB.bat"
call :baixar_arquivo "releases/versao.json" "releases\versao.json"
call :baixar_arquivo "backend/server.js" "backend\server.js"
call :baixar_arquivo "web/index.html" "web\index.html"
call :baixar_arquivo "web/js/app.js" "web\js\app.js"
call :baixar_arquivo "web/css/style.css" "web\css\style.css"
call :baixar_arquivo "package.json" "package.json"

echo.
echo ✅ Arquivos baixados com sucesso
echo.

:: Instalar dependências
echo [4/5] Instalando dependências...
call npm install express mssql
if errorlevel 1 (
    echo ⚠️ Aviso: Erro ao instalar dependências
    echo 🔧 Execute manualmente: npm install express mssql
    echo.
) else (
    echo ✅ Dependências instaladas
)
echo.

:: Verificar instalação
echo [5/5] Verificando instalação...
if exist "startup-with-updates.js" (
    echo ✅ startup-with-updates.js - OK
) else (
    echo ❌ startup-with-updates.js - FALTANDO
    goto :error
)

if exist "scripts\github-update-system.js" (
    echo ✅ github-update-system.js - OK
) else (
    echo ❌ github-update-system.js - FALTANDO
    goto :error
)

if exist "backend\server.js" (
    echo ✅ server.js - OK
) else (
    echo ❌ server.js - FALTANDO
    goto :error
)

echo.
echo ================================================================
echo 🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!
echo ================================================================
echo.
echo 🚀 PRÓXIMOS PASSOS:
echo    1. Execute: INICIAR-COM-GITHUB.bat
echo    2. Acesse: http://localhost:3000
echo    3. Sistema verificará atualizações automaticamente
echo.
echo 📋 ARQUIVOS INSTALADOS:
echo    • startup-with-updates.js (Sistema de inicialização)
echo    • scripts\github-update-system.js (Auto-update)
echo    • backend\server.js (Servidor principal)
echo    • web\*.* (Interface web)
echo    • INICIAR-COM-GITHUB.bat (Script de inicialização)
echo.
echo 🔄 AUTO-UPDATE: O sistema verificará atualizações a cada inicialização
echo 📡 REPOSITÓRIO: https://github.com/kruetzmann2110/demandas
echo.
pause
goto :eof

:baixar_arquivo
set "url_arquivo=%~1"
set "arquivo_local=%~2"

echo 📥 Baixando: %url_arquivo%

:: Usar PowerShell para baixar arquivo
powershell -Command "try { Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/kruetzmann2110/demandas/main/%url_arquivo%' -OutFile '%arquivo_local%' -ErrorAction Stop; Write-Host '   ✅ %arquivo_local% baixado' } catch { Write-Host '   ⚠️ Erro ao baixar %arquivo_local%: ' + $_.Exception.Message }"

goto :eof

:error
echo.
echo ================================================================
echo ❌ ERRO NA INSTALAÇÃO
echo ================================================================
echo.
echo 🔧 SOLUÇÕES POSSÍVEIS:
echo    1. Verifique sua conexão com a internet
echo    2. Verifique se o repositório GitHub está acessível
echo    3. Execute este script como Administrador
echo    4. Baixe manualmente do GitHub: https://github.com/kruetzmann2110/demandas
echo.
echo 📞 SUPORTE:
echo    📧 fabiano.kruetzmann@telefonica.com
echo    🐛 https://github.com/kruetzmann2110/demandas/issues
echo.
pause
exit /b 1