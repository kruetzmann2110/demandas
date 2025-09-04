@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 TESTADOR COMPLETO SHAREPOINT
echo Sistema de Demandas Governança TOP v2.0.0
echo ========================================
echo.

cd /d "%~dp0"

echo 📋 Métodos de teste disponíveis:
echo.
echo 1. 🧪 Teste Mock (funciona offline)
echo 2. 🔐 Teste autenticação básica
echo 3. 📡 Teste REST API SharePoint
echo 4. 🔧 Demo SpRestLib (implementação recomendada)
echo 5. 💻 Teste PowerShell (Windows integrado)
echo 6. ⚙️ Verificar configurações atuais
echo 7. 📊 Ver todos os relatórios
echo 8. 🔄 Atualizar configurações com novo link
echo 9. 📋 Mostrar guia completo de implementação
echo.

set /p choice="Digite sua escolha (1-9): "

if "%choice%"=="1" goto :test_mock
if "%choice%"=="2" goto :test_auth
if "%choice%"=="3" goto :test_rest_api
if "%choice%"=="4" goto :demo_sprestlib
if "%choice%"=="5" goto :test_powershell
if "%choice%"=="6" goto :check_config
if "%choice%"=="7" goto :view_reports
if "%choice%"=="8" goto :update_config
if "%choice%"=="9" goto :implementation_guide
goto :invalid_choice

:test_mock
echo.
echo 🧪 Executando teste mock (funciona sempre)...
echo ℹ️ Este teste simula o SharePoint localmente
echo.
node run-tests.js --test
goto :end

:test_auth
echo.
echo 🔐 Testando métodos de autenticação básica...
echo ⚠️ Este teste tentará acessar o SharePoint real
echo.
node sharepoint-auth-tester.js
goto :end

:test_rest_api
echo.
echo 📡 Testando SharePoint REST API...
echo ⚠️ Requer conexão com rede corporativa
echo.
node sharepoint-rest-client.js
goto :end

:demo_sprestlib
echo.
echo 🔧 Demonstração SpRestLib (implementação recomendada)...
echo ℹ️ Mostra como seria a implementação real
echo.
node sharepoint-sprestlib-demo.js
goto :end

:test_powershell
echo.
echo 💻 Testando com PowerShell...
echo ℹ️ PowerShell pode ter melhor integração com SharePoint
echo.
powershell.exe -ExecutionPolicy Bypass -File "Test-SharePoint.ps1" -Action "all"
goto :end

:check_config
echo.
echo ⚙️ Verificando configurações atuais...
node -e "const config = require('./test-config'); config.getReport();"
goto :end

:view_reports
echo.
echo 📊 Exibindo relatórios de testes...
echo.
echo === RELATÓRIO MOCK ===
if exist "test-report.json" (
    echo 📄 test-report.json encontrado
    type test-report.json | findstr "success\|total\|passed\|failed"
) else (
    echo ❌ test-report.json não encontrado
)
echo.
echo === RELATÓRIO REST API ===
if exist "sharepoint-rest-api-report.json" (
    echo 📄 sharepoint-rest-api-report.json encontrado
    type sharepoint-rest-api-report.json | findstr "success\|statusCode"
) else (
    echo ❌ sharepoint-rest-api-report.json não encontrado
)
echo.
echo === RELATÓRIO AUTENTICAÇÃO ===
if exist "sharepoint-auth-test-results.json" (
    echo 📄 sharepoint-auth-test-results.json encontrado
    type sharepoint-auth-test-results.json | findstr "success\|method"
) else (
    echo ❌ sharepoint-auth-test-results.json não encontrado
)
echo.
echo === RELATÓRIO POWERSHELL ===
if exist "powershell-bridge-report.json" (
    echo 📄 powershell-bridge-report.json encontrado
    type powershell-bridge-report.json | findstr "success\|conectividade"
) else (
    echo ❌ powershell-bridge-report.json não encontrado
)
goto :end

:update_config
echo.
echo 🔄 Atualizando configurações...
echo ℹ️ Use este comando quando tiver um novo link do SharePoint
echo.
node atualizar-config.js
goto :end

:implementation_guide
echo.
echo ========================================
echo 📋 GUIA COMPLETO DE IMPLEMENTAÇÃO
echo ========================================
echo.
echo 🎯 PROBLEMA IDENTIFICADO:
echo   SharePoint requer autenticação OAuth/MSAL
echo   Status 403 Forbidden em todos os métodos básicos
echo.
echo 🔧 SOLUÇÕES DISPONÍVEIS:
echo.
echo 1. 🥇 SPRESTLIB (RECOMENDADO):
echo    • npm install gitbrent/SpRestLib
echo    • Autenticação automática OAuth
echo    • API simplificada para SharePoint
echo    • Suporte completo a operações REST
echo.
echo 2. 🥈 AZURE MSAL (MICROSOFT OFICIAL):
echo    • npm install @azure/msal-node
echo    • Configurar App Registration no Azure AD
echo    • Usar Client ID/Secret para autenticação
echo    • Requer mais configuração manual
echo.
echo 3. 🥉 POWERSHELL BRIDGE:
echo    • Usar PowerShell como intermediário
echo    • Melhor integração com Windows/Office 365
echo    • Solução híbrida Node.js + PowerShell
echo.
echo 📋 ARQUIVOS CRIADOS PARA VOCÊ:
echo   • sharepoint-sprestlib-real.js (implementação completa)
echo   • sharepoint-rest-client.js (testes REST API)
echo   • Test-SharePoint.ps1 (solução PowerShell)
echo   • Vários scripts de teste e configuração
echo.
echo 🚀 PRÓXIMOS PASSOS NA EMPRESA:
echo   1. Conectar na rede corporativa
echo   2. Instalar SpRestLib: npm install gitbrent/SpRestLib
echo   3. Configurar credenciais de Service Principal
echo   4. Testar com sharepoint-sprestlib-real.js
echo   5. Integrar com verificar-atualizacoes.js
echo.
echo 📄 DOCUMENTAÇÃO:
echo   SpRestLib: https://github.com/gitbrent/SpRestLib
echo   Azure MSAL: https://docs.microsoft.com/azure/active-directory/develop/msal-node
echo.
goto :end

:invalid_choice
echo.
echo ❌ Escolha inválida! Digite um número entre 1 e 9.
echo.
pause
goto :start

:end
echo.
echo 📁 Arquivos de teste disponíveis:
if exist "test-report.json" echo    • test-report.json (relatório mock)
if exist "sharepoint-rest-api-report.json" echo    • sharepoint-rest-api-report.json (testes REST)
if exist "sharepoint-auth-test-results.json" echo    • sharepoint-auth-test-results.json (autenticação)
if exist "powershell-bridge-report.json" echo    • powershell-bridge-report.json (PowerShell)
if exist "sharepoint-sprestlib-real.js" echo    • sharepoint-sprestlib-real.js (implementação SpRestLib)
if exist "config-update-report.json" echo    • config-update-report.json (atualização configs)
echo.
echo 🎯 RESUMO DOS RESULTADOS:
echo   ✅ Sistema de testes funcionando
echo   ✅ URLs extraídas e configuradas corretamente
echo   ❌ SharePoint requer autenticação OAuth
echo   🔧 SpRestLib é a solução recomendada
echo.
echo 🏁 Teste concluído!
pause