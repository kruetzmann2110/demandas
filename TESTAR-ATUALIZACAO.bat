@echo off
echo ========================================
echo TESTE DE SISTEMA DE ATUALIZACOES
echo ========================================
echo.
echo 📋 PASSOS PARA TESTAR:
echo.
echo 1. ✅ CONCLUIDO: Arquivos alterados localmente
echo    - index.html: Titulo alterado para "TESTE v2.0.5"
echo    - version.json: Versao atualizada para 2.0.5
echo    - releases/versao.json: Atualizado para teste
echo.
echo 2. 📤 PROXIMO: Suba estes arquivos para o GitHub:
echo    - Acesse: https://github.com/kruetzmann2110/demandas
echo    - Upload os arquivos alterados:
echo      * index.html
echo      * version.json  
echo      * releases/versao.json
echo    - Commit message: "Teste v2.0.5 - Atualizacao visual"
echo.
echo 3. 🧪 TESTE: Execute o startup-with-updates.js
echo    - O sistema devera detectar a nova versao
echo    - Baixar e aplicar as atualizacoes automaticamente
echo.
echo 4. ✅ VERIFICAR: Abra o aplicativo apos a atualizacao
echo    - O titulo devera mostrar "[TESTE v2.0.5]"
echo    - No cabecalho devera aparecer "🔄 [TESTE v2.0.5]"
echo.
echo ========================================
echo Para executar o teste agora:
echo ========================================
pause
echo.
echo 🚀 Iniciando teste de atualizacao...
node startup-with-updates.js
