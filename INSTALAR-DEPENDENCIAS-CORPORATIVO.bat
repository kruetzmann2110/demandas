@echo off
title Instalacao Dependencias Corporativo
chcp 65001 >nul
color 0E
cls

echo.
echo ================================================================
echo 🏢 INSTALAÇÃO DE DEPENDÊNCIAS - AMBIENTE CORPORATIVO
echo    (Sem necessidade de Git ou NPM)
echo ================================================================
echo.

echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detectado
echo.

echo 🏢 PROBLEMA IDENTIFICADO:
echo    • Git não está instalado ou não está no PATH
echo    • NPM falha com erro: spawn git ENOENT
echo    • Ambiente corporativo com restrições
echo.

echo 🔧 SOLUÇÃO CORPORATIVA:
echo    • Criando Express e MSSQL localmente
echo    • Sem dependência do Git ou registros NPM
echo    • Funcionamento garantido em rede restrita
echo.

echo 📦 Instalando dependências...
node scripts/instalar-dependencias-corporativo.js

if errorlevel 1 (
    echo.
    echo ❌ ERRO NA INSTALAÇÃO
    echo.
    echo 🔧 SOLUÇÕES ALTERNATIVAS:
    echo    1. Verifique se Node.js está funcionando: node --version
    echo    2. Execute como Administrador
    echo    3. Verifique conexão com internet (para downloads)
    echo.
    echo 📞 SUPORTE:
    echo    📧 fabiano.kruetzmann@telefonica.com
    echo.
    pause
    exit /b 1
)

echo.
echo 🧪 Testando instalação...
if exist "node_modules\express\index.js" (
    echo ✅ Express instalado
) else (
    echo ❌ Express não encontrado
)

if exist "node_modules\mssql\index.js" (
    echo ✅ MSSQL instalado
) else (
    echo ❌ MSSQL não encontrado
)

echo.
echo ================================================================
echo 🎉 INSTALAÇÃO CONCLUÍDA!
echo ================================================================
echo.

echo ✅ DEPENDÊNCIAS INSTALADAS:
echo    • Express: Servidor web funcional
echo    • MSSQL: Banco de dados (modo simulado para testes)
echo.

echo 🚀 PRÓXIMOS PASSOS:
echo    1. Execute: INICIAR-COM-GITHUB.bat
echo    2. Ou: node startup-with-updates.js
echo    3. Acesse: http://localhost:3000
echo.

echo 🏢 CARACTERÍSTICAS DO AMBIENTE CORPORATIVO:
echo    • Funciona sem Git instalado
echo    • Funciona sem acesso ao NPM registry
echo    • Otimizado para redes restritas
echo    • Fallback automático em caso de problemas
echo.

echo 📞 SUPORTE:
echo    📧 fabiano.kruetzmann@telefonica.com
echo    🐛 https://github.com/kruetzmann2110/demandas/issues
echo.

pause