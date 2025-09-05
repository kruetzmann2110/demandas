@echo off
echo ========================================
echo PREPARANDO ARQUIVOS PARA GITHUB
echo ========================================
echo.

REM Criar pasta temporaria para arquivos limpos
if exist "ARQUIVOS-PARA-GITHUB" rmdir /s /q "ARQUIVOS-PARA-GITHUB"
mkdir "ARQUIVOS-PARA-GITHUB"

echo 📋 Copiando arquivos essenciais...

REM Arquivos principais
copy "package.json" "ARQUIVOS-PARA-GITHUB\"
copy "version.json" "ARQUIVOS-PARA-GITHUB\"
copy "startup-with-updates.js" "ARQUIVOS-PARA-GITHUB\"
copy "server.js" "ARQUIVOS-PARA-GITHUB\"
copy "index.html" "ARQUIVOS-PARA-GITHUB\"
copy "README.md" "ARQUIVOS-PARA-GITHUB\"

REM Pastas importantes
xcopy "scripts" "ARQUIVOS-PARA-GITHUB\scripts\" /E /I
xcopy "js" "ARQUIVOS-PARA-GITHUB\js\" /E /I
xcopy "css" "ARQUIVOS-PARA-GITHUB\css\" /E /I
xcopy "backend" "ARQUIVOS-PARA-GITHUB\backend\" /E /I
xcopy "config" "ARQUIVOS-PARA-GITHUB\config\" /E /I
xcopy "docs" "ARQUIVOS-PARA-GITHUB\docs\" /E /I
xcopy "web" "ARQUIVOS-PARA-GITHUB\web\" /E /I

REM Criar pasta releases (importante para atualizacoes)
mkdir "ARQUIVOS-PARA-GITHUB\releases"
copy "version.json" "ARQUIVOS-PARA-GITHUB\releases\"

echo ✅ Arquivos preparados na pasta: ARQUIVOS-PARA-GITHUB
echo.
echo 📋 PRÓXIMOS PASSOS:
echo 1. Abra a pasta ARQUIVOS-PARA-GITHUB
echo 2. Selecione TODOS os arquivos e pastas
echo 3. Arraste para o repositório GitHub no navegador
echo 4. Adicione commit message: "Initial release v2.0.4"
echo 5. Clique em "Commit new files"
echo.
pause
