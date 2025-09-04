# ========================================
# SCRIPT POWERSHELL PARA SHAREPOINT
# Sistema de Demandas Governança TOP v2.0.0
# ========================================

param(
    [string]$Action = "test",
    [string]$File = "versao.json"
)

# Configurações
$SharePointBaseUrl = "https://telefonicacorp.sharepoint.com/sites/ESCALONAMENTO_TOP_SIGITM.TMBNL/Shared%20Documents/Demandas"
$TempDir = Join-Path $PSScriptRoot "temp-downloads"

# Criar diretório temporário se não existir
if (-not (Test-Path $TempDir)) {
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔐 TESTADOR SHAREPOINT VIA POWERSHELL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-SharePointAccess {
    Write-Host "📡 Testando acesso ao SharePoint..." -ForegroundColor Yellow
    Write-Host "🔗 URL: $SharePointBaseUrl" -ForegroundColor Gray
    Write-Host ""
    
    try {
        # Teste 1: Invoke-WebRequest básico
        Write-Host "🧪 TESTE 1: Invoke-WebRequest básico" -ForegroundColor Magenta
        Write-Host "─────────────────────────────────────" -ForegroundColor Gray
        
        $url = "$SharePointBaseUrl/$File"
        Write-Host "   URL testada: $url" -ForegroundColor Gray
        
        try {
            $response = Invoke-WebRequest -Uri $url -UseDefaultCredentials -TimeoutSec 30
            Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
            Write-Host "   📊 Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
            Write-Host "   📄 Conteúdo (início): $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))" -ForegroundColor Green
            Write-Host ""
            return $true
        }
        catch {
            Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
        }
        
        # Teste 2: Com UseBasicParsing
        Write-Host "🧪 TESTE 2: Com UseBasicParsing" -ForegroundColor Magenta
        Write-Host "─────────────────────────────────────" -ForegroundColor Gray
        
        try {
            $response = Invoke-WebRequest -Uri $url -UseDefaultCredentials -UseBasicParsing -TimeoutSec 30
            Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
            Write-Host "   📊 Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
            Write-Host ""
            return $true
        }
        catch {
            Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
        }
        
        # Teste 3: Invoke-RestMethod
        Write-Host "🧪 TESTE 3: Invoke-RestMethod" -ForegroundColor Magenta
        Write-Host "─────────────────────────────────────" -ForegroundColor Gray
        
        try {
            $response = Invoke-RestMethod -Uri $url -UseDefaultCredentials -TimeoutSec 30
            Write-Host "   ✅ Sucesso!" -ForegroundColor Green
            Write-Host "   📄 Resposta: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Green
            Write-Host ""
            return $true
        }
        catch {
            Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
        }
        
        # Teste 4: Com headers específicos
        Write-Host "🧪 TESTE 4: Com headers de navegador" -ForegroundColor Magenta
        Write-Host "─────────────────────────────────────" -ForegroundColor Gray
        
        $headers = @{
            'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            'Accept' = 'application/json, text/plain, */*'
            'Referer' = 'https://telefonicacorp.sharepoint.com/'
        }
        
        try {
            $response = Invoke-WebRequest -Uri $url -UseDefaultCredentials -Headers $headers -UseBasicParsing -TimeoutSec 30
            Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
            Write-Host "   📊 Tamanho: $($response.Content.Length) bytes" -ForegroundColor Green
            Write-Host ""
            return $true
        }
        catch {
            Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
        }
        
        return $false
        
    }
    catch {
        Write-Host "💥 Erro crítico: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Download-SharePointFile {
    param(
        [string]$FileName,
        [string]$LocalPath
    )
    
    Write-Host "📥 Baixando arquivo: $FileName" -ForegroundColor Yellow
    
    $url = "$SharePointBaseUrl/$FileName"
    $outputPath = Join-Path $LocalPath $FileName
    
    # Criar diretório se necessário
    $dir = Split-Path $outputPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseDefaultCredentials -UseBasicParsing -OutFile $outputPath -TimeoutSec 30
        Write-Host "   ✅ Baixado para: $outputPath" -ForegroundColor Green
        
        if (Test-Path $outputPath) {
            $size = (Get-Item $outputPath).Length
            Write-Host "   📊 Tamanho: $size bytes" -ForegroundColor Green
            return $true
        }
        
        return $false
    }
    catch {
        Write-Host "   ❌ Erro no download: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-SharePointFiles {
    Write-Host "📁 Testando arquivos específicos..." -ForegroundColor Yellow
    Write-Host ""
    
    $files = @("versao.json", "backend/server.js", "frontend/app.js", "frontend/style.css", "frontend/index.html")
    $results = @{}
    
    foreach ($file in $files) {
        Write-Host "🔍 Testando: $file" -ForegroundColor Cyan
        
        $url = "$SharePointBaseUrl/$file"
        
        try {
            $response = Invoke-WebRequest -Uri $url -UseDefaultCredentials -UseBasicParsing -Method Head -TimeoutSec 10
            Write-Host "   ✅ Existe - Status: $($response.StatusCode)" -ForegroundColor Green
            $results[$file] = $true
        }
        catch {
            Write-Host "   ❌ Não encontrado ou sem acesso" -ForegroundColor Red
            $results[$file] = $false
        }
    }
    
    Write-Host ""
    Write-Host "📊 Resumo dos arquivos:" -ForegroundColor Yellow
    $existingFiles = ($results.Values | Where-Object { $_ -eq $true }).Count
    $totalFiles = $results.Count
    Write-Host "   📈 Arquivos encontrados: $existingFiles/$totalFiles" -ForegroundColor $(if ($existingFiles -gt 0) { "Green" } else { "Red" })
    
    return $results
}

function Show-Recommendations {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "💡 RECOMENDAÇÕES PARA SHAREPOINT" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "🔧 SOLUÇÕES IMEDIATAS:" -ForegroundColor Yellow
    Write-Host "1. 📄 Criar arquivos públicos na pasta Demandas" -ForegroundColor White
    Write-Host "2. 🔐 Configurar permissões de leitura para 'Everyone'" -ForegroundColor White
    Write-Host "3. 🔑 Usar Service Principal com ClientId/Secret" -ForegroundColor White
    Write-Host "4. 🌐 Implementar proxy com autenticação" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🚀 IMPLEMENTAÇÃO VIA NODE.JS:" -ForegroundColor Yellow
    Write-Host "• Use @azure/msal-node para autenticação OAuth" -ForegroundColor White
    Write-Host "• Configure App Registration no Azure AD" -ForegroundColor White
    Write-Host "• Use Microsoft Graph API como alternativa" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔄 ALTERNATIVAS:" -ForegroundColor Yellow
    Write-Host "• Sincronização via OneDrive local" -ForegroundColor White
    Write-Host "• Webhook para notificações de atualização" -ForegroundColor White
    Write-Host "• Polling manual com credenciais armazenadas" -ForegroundColor White
    Write-Host ""
}

# ✅ EXECUÇÃO PRINCIPAL
switch ($Action.ToLower()) {
    "test" {
        $success = Test-SharePointAccess
        if (-not $success) {
            Write-Host "❌ Todos os testes falharam" -ForegroundColor Red
            Show-Recommendations
        }
    }
    
    "files" {
        Test-SharePointFiles | Out-Null
    }
    
    "download" {
        $success = Download-SharePointFile -FileName $File -LocalPath $TempDir
        if ($success) {
            Write-Host "🎉 Download concluído!" -ForegroundColor Green
        }
    }
    
    "all" {
        Write-Host "🔄 Executando todos os testes..." -ForegroundColor Cyan
        Write-Host ""
        
        $accessSuccess = Test-SharePointAccess
        Write-Host ""
        
        $filesResults = Test-SharePointFiles
        Write-Host ""
        
        if (-not $accessSuccess) {
            Show-Recommendations
        } else {
            Write-Host "🎉 SharePoint acessível via PowerShell!" -ForegroundColor Green
            Write-Host "💡 Considere usar PowerShell como bridge para Node.js" -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host "❌ Ação inválida. Use: test, files, download, ou all" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🏁 Script concluído!" -ForegroundColor Green