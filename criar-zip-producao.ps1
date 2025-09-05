# SCRIPT PARA CRIAR ZIP DE PRODUÇÃO
# Sistema de Gestão de Demandas - Arquivos Essenciais para Produção

Write-Host "🚀 CRIANDO PACOTE DE PRODUÇÃO..." -ForegroundColor Green
Write-Host ""

$baseDir = Get-Location
$tempDir = Join-Path $env:TEMP "demandas-producao-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$zipFile = Join-Path $baseDir "DEMANDAS-PRODUCAO-v3.0.3.zip"

Write-Host "📁 Criando diretório temporário: $tempDir" -ForegroundColor Yellow

# Criar diretório temporário
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Criar estrutura de pastas
$folders = @(
    "web",
    "web\js", 
    "web\css",
    "backend",
    "config",
    "scripts"
)

foreach ($folder in $folders) {
    $folderPath = Join-Path $tempDir $folder
    New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
    Write-Host "  ✅ Criada pasta: $folder" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 COPIANDO ARQUIVOS ESSENCIAIS..." -ForegroundColor Cyan

# Função para copiar arquivo com verificação
function Copy-ProductionFile {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Description
    )
    
    if (Test-Path $Source) {
        Copy-Item $Source $Destination -Force
        $size = [math]::Round((Get-Item $Destination).Length / 1KB, 1)
        Write-Host "  ✅ $Description ($($size)KB)" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ❌ ERRO: $Description não encontrado" -ForegroundColor Red
        return $false
    }
}

$copied = 0
$total = 0

# ARQUIVOS PRINCIPAIS
Write-Host "📦 Arquivos principais:" -ForegroundColor Yellow

$total++; if (Copy-ProductionFile "server 1.js" "$tempDir\server.js" "Backend principal (server 1.js → server.js)") { $copied++ }
$total++; if (Copy-ProductionFile "package.json" "$tempDir\package.json" "Dependências do Node.js") { $copied++ }
$total++; if (Copy-ProductionFile "version.json" "$tempDir\version.json" "Controle de versão") { $copied++ }

# FRONTEND COMPLETO
Write-Host "🎨 Frontend (web/):" -ForegroundColor Yellow

$total++; if (Copy-ProductionFile "web\index.html" "$tempDir\web\index.html" "Interface principal") { $copied++ }
$total++; if (Copy-ProductionFile "web\js\app.js" "$tempDir\web\js\app.js" "JavaScript da aplicação") { $copied++ }
$total++; if (Copy-ProductionFile "web\css\style.css" "$tempDir\web\css\style.css" "Estilos CSS") { $copied++ }

# BACKEND ALTERNATIVO
Write-Host "🔧 Backend alternativo:" -ForegroundColor Yellow

$total++; if (Copy-ProductionFile "backend\server.js" "$tempDir\backend\server.js" "Backend alternativo") { $copied++ }

# CONFIGURAÇÕES
Write-Host "⚙️ Configurações:" -ForegroundColor Yellow

$total++; if (Copy-ProductionFile "config\database.json" "$tempDir\config\database.json" "Configuração do banco") { $copied++ }

if (Test-Path "backend\users-auth.json") {
    $total++; if (Copy-ProductionFile "backend\users-auth.json" "$tempDir\backend\users-auth.json" "Autenticação de usuários") { $copied++ }
}

# SCRIPTS AUXILIARES  
Write-Host "📜 Scripts auxiliares:" -ForegroundColor Yellow

$total++; if (Copy-ProductionFile "startup-with-updates.js" "$tempDir\startup-with-updates.js" "Sistema de auto-update") { $copied++ }
$total++; if (Copy-ProductionFile "scripts\github-update-system.js" "$tempDir\scripts\github-update-system.js" "Motor de atualizações") { $copied++ }

# ARQUIVO BAT DE INICIALIZAÇÃO
Write-Host "🚀 Arquivo de inicialização:" -ForegroundColor Yellow

$batContent = @"
@echo off
title Sistema de Demandas - Producao v3.0.3
chcp 65001 >nul
color 0B
cls

echo.
echo ========================================
echo 🏢 SISTEMA DE DEMANDAS GOVERNANÇA TOP
echo 📅 Versão 3.0.3 - Produção
echo ========================================
echo.

echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale o Node.js em: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

echo 📦 Verificando dependências...
if not exist "node_modules" (
    echo 🔧 Instalando dependências...
    call npm install express mssql
    if errorlevel 1 (
        echo ⚠️ Aviso: Problemas na instalação das dependências
        echo 🔧 Tente executar manualmente: npm install express mssql
        echo.
    ) else (
        echo ✅ Dependências instaladas
    )
) else (
    echo ✅ Dependências já instaladas
)
echo.

echo 🔄 Iniciando sistema com auto-update...
echo 📡 Repositório: kruetzmann2110/demandas
echo.

:: Executar com auto-update
node startup-with-updates.js

echo.
echo 🛑 Sistema finalizado
pause
"@

$batFile = Join-Path $tempDir "INICIAR-SISTEMA.bat"
$batContent | Out-File -FilePath $batFile -Encoding UTF8
Write-Host "  ✅ Script de inicialização (INICIAR-SISTEMA.bat)" -ForegroundColor Green
$copied++
$total++

# ARQUIVO README PARA PRODUÇÃO
Write-Host "📖 Documentação:" -ForegroundColor Yellow

$readmeContent = @"
# SISTEMA DE DEMANDAS - GOVERNANÇA TOP
## Versão 3.0.3 - Pacote de Produção

### 🚀 COMO USAR:

1. **Instalar Node.js** (se não tiver):
   - Baixe em: https://nodejs.org
   - Versão recomendada: LTS (Long Term Support)

2. **Executar o sistema**:
   - Clique duplo em: `INICIAR-SISTEMA.bat`
   - OU execute no terminal: `node startup-with-updates.js`

3. **Acessar o sistema**:
   - Navegador abrirá automaticamente
   - OU acesse: http://localhost:3000

### 📁 ESTRUTURA DOS ARQUIVOS:

```
📦 DEMANDAS-PRODUCAO/
├── 🚀 INICIAR-SISTEMA.bat          # Clique duplo para iniciar
├── ⚙️ server.js                    # Backend principal  
├── 🔄 startup-with-updates.js      # Sistema de auto-update
├── 📋 package.json                 # Dependências
├── 📊 version.json                 # Controle de versão
├── 📁 web/                         # Interface do usuário
│   ├── 🌐 index.html              # Página principal
│   ├── 📁 js/
│   │   └── 🎯 app.js              # Lógica da aplicação
│   └── 📁 css/
│       └── 🎨 style.css           # Estilos visuais
├── 📁 backend/                     # Backend alternativo
│   ├── 🔧 server.js               # Servidor alternativo
│   └── 👥 users-auth.json         # Usuários (se existir)
├── 📁 config/                      # Configurações
│   └── 🗃️ database.json          # Config do banco
└── 📁 scripts/                     # Scripts auxiliares
    └── 🔄 github-update-system.js # Motor de updates
```

### ✨ FUNCIONALIDADES:

- ✅ **Auto-Update**: Baixa atualizações automáticas do GitHub
- ✅ **Anti-Cache**: Headers para evitar cache do navegador  
- ✅ **SQL Server**: Conexão com banco de dados corporativo
- ✅ **Timeline**: Sistema de histórico de demandas
- ✅ **Responsivo**: Funciona em desktop e mobile
- ✅ **Multi-usuário**: Suporte a diferentes perfis (admin/focal/colaborador)

### 🔧 SOLUÇÃO DE PROBLEMAS:

**Problema: "Node.js não encontrado"**
- Instale Node.js em: https://nodejs.org

**Problema: "Erro ao conectar banco"**
- Verifique se está na rede corporativa
- Configure VPN se necessário

**Problema: "Porta 3000 já em uso"**
- Feche outras aplicações Node.js
- OU edite server.js para usar outra porta

**Problema: "Cache do navegador"**
- Pressione Ctrl+Shift+R (hard refresh)
- OU use modo anônimo/incógnito

### 🆘 SUPORTE:

- 📧 Contato: Equipe de Governança
- 🔗 Repositório: kruetzmann2110/demandas
- 📅 Versão: 3.0.3 ($(Get-Date -Format 'dd/MM/yyyy HH:mm'))

### 📝 CHANGELOG v3.0.3:

- ✅ CORREÇÃO: Headers anti-cache implementados
- ✅ CORREÇÃO: Sistema usa branch master corretamente  
- ✅ MELHORIA: Pacote de produção otimizado
- ✅ MELHORIA: Documentação completa incluída
"@

$readmeFile = Join-Path $tempDir "README.md"
$readmeContent | Out-File -FilePath $readmeFile -Encoding UTF8
Write-Host "  ✅ Documentação completa (README.md)" -ForegroundColor Green
$copied++
$total++

Write-Host ""
Write-Host "📊 RESUMO:" -ForegroundColor Magenta
Write-Host "  📁 Arquivos copiados: $copied de $total" -ForegroundColor Green
Write-Host "  📦 Diretório: $tempDir" -ForegroundColor Yellow

# CRIAR ZIP
Write-Host ""
Write-Host "🗜️ CRIANDO ARQUIVO ZIP..." -ForegroundColor Cyan

if (Get-Command "Compress-Archive" -ErrorAction SilentlyContinue) {
    # Usar PowerShell nativo (Windows 10+)
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFile -Force
    Write-Host "  ✅ ZIP criado com PowerShell nativo" -ForegroundColor Green
} else {
    # Fallback para 7-Zip se disponível
    $sevenZip = Get-Command "7z" -ErrorAction SilentlyContinue
    if ($sevenZip) {
        & 7z a -tzip $zipFile "$tempDir\*"
        Write-Host "  ✅ ZIP criado com 7-Zip" -ForegroundColor Green
    } else {
        Write-Host "  ❌ ERRO: Não foi possível criar ZIP. Instale 7-Zip ou use Windows 10+" -ForegroundColor Red
        Write-Host "  📁 Arquivos estão disponíveis em: $tempDir" -ForegroundColor Yellow
        exit 1
    }
}

# VERIFICAR ZIP CRIADO
if (Test-Path $zipFile) {
    $zipSize = [math]::Round((Get-Item $zipFile).Length / 1MB, 1)
    Write-Host ""
    Write-Host "🎉 SUCESSO! PACOTE DE PRODUÇÃO CRIADO:" -ForegroundColor Green -BackgroundColor Black
    Write-Host ""
    Write-Host "  📦 Arquivo: DEMANDAS-PRODUCAO-v3.0.3.zip" -ForegroundColor White -BackgroundColor DarkGreen
    Write-Host "  📏 Tamanho: $($zipSize) MB" -ForegroundColor Yellow
    Write-Host "  📁 Localização: $zipFile" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 INSTRUÇÕES PARA PRODUÇÃO:" -ForegroundColor Magenta
    Write-Host "  1. Extraia o ZIP no servidor de produção" -ForegroundColor White
    Write-Host "  2. Execute: INICIAR-SISTEMA.bat" -ForegroundColor White  
    Write-Host "  3. Acesse: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    
    # Limpar diretório temporário
    Remove-Item $tempDir -Recurse -Force
    Write-Host "🧹 Limpeza: Diretório temporário removido" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "🚀 PRONTO PARA PRODUÇÃO!" -ForegroundColor Green -BackgroundColor Black
    
} else {
    Write-Host "  ❌ ERRO: Falha ao criar ZIP" -ForegroundColor Red
    Write-Host "  📁 Arquivos estão disponíveis em: $tempDir" -ForegroundColor Yellow
}
