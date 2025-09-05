# SCRIPT DE CRIACAO DE ZIP DE PRODUCAO
# Sistema de Demandas - Arquivos Essenciais

Write-Host "Criando pacote de producao..." -ForegroundColor Green

$baseDir = Get-Location
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$tempDir = Join-Path $env:TEMP "demandas-producao-$timestamp"
$zipFile = Join-Path $baseDir "DEMANDAS-PRODUCAO-v3.0.3.zip"

# Criar diretorio temporario
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Write-Host "Diretorio temporario criado: $tempDir"

# Criar estrutura de pastas
$folders = @("web", "web\js", "web\css", "backend", "config", "scripts")
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path (Join-Path $tempDir $folder) -Force | Out-Null
}

Write-Host "Copiando arquivos essenciais..."

# Copiar arquivos principais
$files = @{
    "server 1.js" = "server.js"
    "package.json" = "package.json"
    "version.json" = "version.json"
    "startup-with-updates.js" = "startup-with-updates.js"
    "web\index.html" = "web\index.html"
    "web\js\app.js" = "web\js\app.js"
    "web\css\style.css" = "web\css\style.css"
    "backend\server.js" = "backend\server.js"
    "config\database.json" = "config\database.json"
    "scripts\github-update-system.js" = "scripts\github-update-system.js"
}

$copied = 0
foreach ($source in $files.Keys) {
    $dest = Join-Path $tempDir $files[$source]
    if (Test-Path $source) {
        Copy-Item $source $dest -Force
        Write-Host "  Copiado: $source" -ForegroundColor Green
        $copied++
    } else {
        Write-Host "  AVISO: $source nao encontrado" -ForegroundColor Yellow
    }
}

# Copiar arquivo de autenticacao se existir
if (Test-Path "backend\users-auth.json") {
    Copy-Item "backend\users-auth.json" "$tempDir\backend\users-auth.json" -Force
    Write-Host "  Copiado: backend\users-auth.json" -ForegroundColor Green
    $copied++
}

# Criar arquivo BAT de inicializacao
$batContent = @"
@echo off
title Sistema de Demandas - Producao v3.0.3
chcp 65001 >nul
color 0B
cls

echo.
echo ========================================
echo Sistema de Demandas Governanca
echo Versao 3.0.3 - Producao
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2^&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale o Node.js em: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js detectado
echo.

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install express mssql
    if errorlevel 1 (
        echo AVISO: Problemas na instalacao das dependencias
        echo Tente executar manualmente: npm install express mssql
        echo.
    ) else (
        echo Dependencias instaladas
    )
) else (
    echo Dependencias ja instaladas
)
echo.

echo Iniciando sistema com auto-update...
echo Repositorio: kruetzmann2110/demandas
echo.

node startup-with-updates.js

echo.
echo Sistema finalizado
pause
"@

$batFile = Join-Path $tempDir "INICIAR-SISTEMA.bat"
[System.IO.File]::WriteAllText($batFile, $batContent, [System.Text.Encoding]::UTF8)
Write-Host "  Criado: INICIAR-SISTEMA.bat" -ForegroundColor Green

# Criar README
$readmeContent = @"
# SISTEMA DE DEMANDAS - GOVERNANCA
## Versao 3.0.3 - Pacote de Producao

### COMO USAR:

1. Instalar Node.js (se nao tiver):
   - Baixe em: https://nodejs.org

2. Executar o sistema:
   - Clique duplo em: INICIAR-SISTEMA.bat
   - OU execute: node startup-with-updates.js

3. Acessar:
   - http://localhost:3000

### ESTRUTURA DOS ARQUIVOS:

- INICIAR-SISTEMA.bat       # Clique duplo para iniciar
- server.js                 # Backend principal  
- startup-with-updates.js   # Sistema de auto-update
- package.json              # Dependencias
- version.json              # Controle de versao
- web/                      # Interface do usuario
  - index.html             # Pagina principal
  - js/app.js              # Logica da aplicacao
  - css/style.css          # Estilos
- backend/                  # Backend alternativo
- config/                   # Configuracoes
- scripts/                  # Scripts auxiliares

### FUNCIONALIDADES:

- Auto-Update: Baixa atualizacoes do GitHub
- Anti-Cache: Headers para evitar cache
- SQL Server: Conexao com banco corporativo
- Timeline: Sistema de historico
- Responsivo: Desktop e mobile
- Multi-usuario: Diferentes perfis

### SOLUCAO DE PROBLEMAS:

- Node.js nao encontrado: Instale em https://nodejs.org
- Erro ao conectar banco: Verifique rede corporativa
- Porta 3000 em uso: Feche outras aplicacoes Node.js
- Cache do navegador: Pressione Ctrl+Shift+R

### SUPORTE:

- Contato: Equipe de Governanca
- Repositorio: kruetzmann2110/demandas
- Versao: 3.0.3
"@

$readmeFile = Join-Path $tempDir "README.md"
[System.IO.File]::WriteAllText($readmeFile, $readmeContent, [System.Text.Encoding]::UTF8)
Write-Host "  Criado: README.md" -ForegroundColor Green

Write-Host ""
Write-Host "Arquivos copiados: $($copied + 2)" -ForegroundColor Cyan

# Criar ZIP
Write-Host ""
Write-Host "Criando arquivo ZIP..." -ForegroundColor Cyan

try {
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFile -Force
    Write-Host "ZIP criado com sucesso!" -ForegroundColor Green
    
    if (Test-Path $zipFile) {
        $zipSize = [math]::Round((Get-Item $zipFile).Length / 1MB, 1)
        Write-Host ""
        Write-Host "SUCESSO! PACOTE DE PRODUCAO CRIADO:" -ForegroundColor Green
        Write-Host ""
        Write-Host "Arquivo: DEMANDAS-PRODUCAO-v3.0.3.zip" -ForegroundColor White
        Write-Host "Tamanho: $zipSize MB" -ForegroundColor Yellow
        Write-Host "Local: $zipFile" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "INSTRUCOES:" -ForegroundColor Magenta
        Write-Host "1. Extraia o ZIP no servidor" -ForegroundColor White
        Write-Host "2. Execute: INICIAR-SISTEMA.bat" -ForegroundColor White
        Write-Host "3. Acesse: http://localhost:3000" -ForegroundColor White
        Write-Host ""
    }
} catch {
    Write-Host "ERRO ao criar ZIP: $_" -ForegroundColor Red
    Write-Host "Arquivos disponiveis em: $tempDir" -ForegroundColor Yellow
}

# Limpar diretorio temporario
try {
    Remove-Item $tempDir -Recurse -Force
    Write-Host "Limpeza concluida" -ForegroundColor Gray
} catch {
    Write-Host "AVISO: Nao foi possivel limpar diretorio temporario" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PRONTO PARA PRODUCAO!" -ForegroundColor Green
