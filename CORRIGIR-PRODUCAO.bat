@echo off
title CORRECAO RAPIDA - Sistema de Demandas
chcp 65001 >nul
color 0C
cls

echo.
echo ================================================================
echo 🚨 CORREÇÃO RÁPIDA - ARQUIVOS FALTANDO EM PRODUÇÃO
echo ================================================================
echo.

echo 🔍 Verificando situação atual...
echo.

:: Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

:: Verificar arquivos críticos
echo 📋 Verificando arquivos críticos...

set ARQUIVO_FALTANDO=0

if not exist "startup-with-updates.js" (
    echo ❌ startup-with-updates.js - FALTANDO
    set ARQUIVO_FALTANDO=1
) else (
    echo ✅ startup-with-updates.js - OK
)

if not exist "scripts\github-update-system.js" (
    echo ❌ scripts\github-update-system.js - FALTANDO
    set ARQUIVO_FALTANDO=1
) else (
    echo ✅ scripts\github-update-system.js - OK
)

if not exist "INICIAR-COM-GITHUB.bat" (
    echo ❌ INICIAR-COM-GITHUB.bat - FALTANDO
    set ARQUIVO_FALTANDO=1
) else (
    echo ✅ INICIAR-COM-GITHUB.bat - OK
)

echo.

if %ARQUIVO_FALTANDO%==1 (
    echo 🔧 BAIXANDO ARQUIVOS FALTANDO...
    echo.
    
    :: Criar pasta scripts se não existir
    if not exist "scripts" mkdir scripts
    
    :: Baixar startup-with-updates.js
    if not exist "startup-with-updates.js" (
        echo 📥 Baixando startup-with-updates.js...
        powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/kruetzmann2110/demandas/main/startup-with-updates.js' -OutFile 'startup-with-updates.js'"
        if exist "startup-with-updates.js" (
            echo ✅ startup-with-updates.js baixado
        ) else (
            echo ❌ Erro ao baixar startup-with-updates.js
        )
    )
    
    :: Baixar github-update-system.js
    if not exist "scripts\github-update-system.js" (
        echo 📥 Baixando github-update-system.js...
        powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/kruetzmann2110/demandas/main/scripts/github-update-system.js' -OutFile 'scripts\github-update-system.js'"
        if exist "scripts\github-update-system.js" (
            echo ✅ github-update-system.js baixado
        ) else (
            echo ❌ Erro ao baixar github-update-system.js
        )
    )
    
    :: Baixar INICIAR-COM-GITHUB.bat
    if not exist "INICIAR-COM-GITHUB.bat" (
        echo 📥 Baixando INICIAR-COM-GITHUB.bat...
        powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/kruetzmann2110/demandas/main/INICIAR-COM-GITHUB.bat' -OutFile 'INICIAR-COM-GITHUB.bat'"
        if exist "INICIAR-COM-GITHUB.bat" (
            echo ✅ INICIAR-COM-GITHUB.bat baixado
        ) else (
            echo ❌ Erro ao baixar INICIAR-COM-GITHUB.bat
        )
    )
    
    echo.
    echo 📦 Instalando dependências...
    call npm install express mssql
    
    echo.
    echo 🧪 Testando sistema...
    node startup-with-updates.js --test
    
    echo.
    echo ================================================================
    echo 🎉 CORREÇÃO CONCLUÍDA!
    echo ================================================================
    echo.
    echo 🚀 PRÓXIMOS PASSOS:
    echo    1. Execute: INICIAR-COM-GITHUB.bat
    echo    2. Acesse: http://localhost:3000
    echo    3. Sistema verificará atualizações automaticamente
    echo.
    echo ✅ O sistema agora está completo e funcional!
    echo.
    
) else (
    echo ✅ TODOS OS ARQUIVOS ESTÃO PRESENTES!
    echo.
    echo 🧪 Testando sistema...
    node startup-with-updates.js --test
    echo.
    echo 🚀 Sistema pronto para uso!
    echo    Execute: INICIAR-COM-GITHUB.bat
    echo.
)

echo 📞 SUPORTE:
echo    📧 fabiano.kruetzmann@telefonica.com
echo    🐛 https://github.com/kruetzmann2110/demandas/issues
echo.

pause