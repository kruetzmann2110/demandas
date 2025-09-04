@echo off
title Sistema de Demandas Governanca TOP v2.0.0
color 0A
 
echo.
echo ================================================
echo =                                              =
echo =     SISTEMA DE DEMANDAS GOVERNANCA TOP      =
echo =                v2.0.0                       =
echo =                                              =
echo ================================================
echo.
 
echo [1/4] Verificando requisitos...
 
REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo SOLUCAO:
    echo    1. Baixe Node.js: https://nodejs.org
    echo    2. Instale a versao LTS
    echo    3. Reinicie o computador
    echo    4. Execute este arquivo novamente
    echo.
    pause
    exit /b 1
)
 
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% encontrado!
 
echo.
echo [2/4] Verificando atualizacoes...
 
REM Verificar atualizações do SharePoint (opcional)
if exist verificar-atualizacoes.js (
    echo       Conectando ao SharePoint...
    node verificar-atualizacoes.js >nul 2>&1
    if %errorlevel% equ 1 (
        echo [OK] Atualizacoes aplicadas!
        echo       Reiniciando para aplicar mudancas...
        timeout /t 2 >nul
        goto :restart
    )
    echo [OK] Sistema atualizado!
) else (
    echo [INFO] Auto-atualizacao nao configurada
)
 
echo.
echo [3/4] Instalando dependencias...
call npm install express mssql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Erro ao instalar dependencias!
    echo.
    echo SOLUCAO:
    echo    Execute manualmente: npm install
    echo.
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas!
 
echo.
echo [4/4] Iniciando sistema...
echo.
echo ================================================
echo =                                              =
echo =            INICIANDO SISTEMA...              =
echo =                                              =
echo ================================================
echo.
 
echo URL do Sistema: http://localhost:3000
echo Dashboard Moderno: Menu "Dashboard"
echo.
echo RECURSOS INCLUIDOS:
echo    - Novos campos: Data Abertura + ID Real + Submotivo
echo    - Dashboard com graficos interativos
echo    - Rankings por categoria (Op1, Ql2, An3...)
echo    - Export Excel otimizado
echo    - Timeline com hora correta
echo    - Auto-atualizacao via SharePoint
echo.
echo O navegador abrira automaticamente...
echo Para parar o sistema, feche esta janela
echo.
 
:restart
REM Iniciar servidor
start /min cmd /c "title Servidor Backend & node backend/server.js"
 
REM Aguardar servidor inicializar
timeout /t 3 >nul
 
REM Abrir navegador automaticamente
start http://localhost:3000
 
echo.
echo ================================================
echo =                                              =
echo =         SISTEMA INICIADO COM SUCESSO!       =
echo =                                              =
echo ================================================
echo.
echo [INFO] Se o navegador nao abriu, acesse: http://localhost:3000
echo [INFO] Para reiniciar: feche tudo e execute este arquivo novamente
echo.
 
REM Manter janela aberta para mostrar status
echo IMPORTANTE: Mantenha esta janela aberta enquanto usa o sistema
echo.
echo Pressione qualquer tecla para encerrar o sistema...
pause >nul
 
goto :eof