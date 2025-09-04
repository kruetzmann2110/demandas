@echo off
chcp 65001 >nul
echo ========================================
echo 🧪 TESTES DE SHAREPOINT - SISTEMA DE DEMANDAS
echo ========================================
echo.

cd /d "%~dp0"

echo 📋 Opções disponíveis:
echo.
echo 1. 🧪 Testar com servidor mock local
echo 2. 🌍 Testar com SharePoint real (produção)
echo 3. 📡 Apenas teste de conexão
echo 4. ⚙️ Verificar configurações
echo 5. 📊 Ver último relatório de testes
echo 6. 🚀 Executar servidor mock separadamente
echo.

set /p choice="Digite sua escolha (1-6): "

if "%choice%"=="1" goto :test_mock
if "%choice%"=="2" goto :test_production  
if "%choice%"=="3" goto :connection_only
if "%choice%"=="4" goto :check_config
if "%choice%"=="5" goto :view_report
if "%choice%"=="6" goto :run_mock_server
goto :invalid_choice

:test_mock
echo.
echo 🧪 Executando testes com servidor mock local...
echo ℹ️ Este modo é seguro e não acessa o SharePoint real
echo.
node run-tests.js --test
goto :end

:test_production
echo.
echo ⚠️ ATENÇÃO: Este modo tentará acessar o SharePoint real!
echo ⚠️ Certifique-se de estar conectado à rede corporativa
echo.
set /p confirm="Deseja continuar? (S/N): "
if /i "%confirm%"=="S" (
    echo.
    echo 🌍 Executando testes com SharePoint real...
    node run-tests.js --production
) else (
    echo ❌ Teste cancelado pelo usuário
)
goto :end

:connection_only
echo.
echo 📡 Executando apenas teste de conexão...
node test-sharepoint-connection.js
goto :end

:check_config
echo.
echo ⚙️ Verificando configurações atuais...
node -e "const config = require('./test-config'); config.getReport();"
goto :end

:view_report
echo.
echo 📊 Exibindo último relatório de testes...
if exist "test-report.json" (
    type test-report.json
) else (
    echo ❌ Nenhum relatório encontrado. Execute os testes primeiro.
)
goto :end

:run_mock_server
echo.
echo 🚀 Iniciando servidor mock SharePoint...
echo ℹ️ O servidor ficará rodando até você pressionar Ctrl+C
echo ℹ️ URL: http://localhost:3001
echo.
node mock-sharepoint-server.js
goto :end

:invalid_choice
echo.
echo ❌ Escolha inválida! Digite um número entre 1 e 6.
echo.
pause
goto :start

:end
echo.
echo 📁 Arquivos gerados neste teste:
if exist "sharepoint-test-results.json" echo    • sharepoint-test-results.json (resultados detalhados)
if exist "test-report.json" echo    • test-report.json (relatório completo)
if exist "test-downloads\" echo    • test-downloads\ (arquivos baixados para teste)
echo.
echo 🏁 Teste concluído!
pause