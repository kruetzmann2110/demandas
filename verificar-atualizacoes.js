// ========================================
// SISTEMA DE AUTO-ATUALIZAÇÃO VIA SHAREPOINT
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ✅ CONFIGURAÇÕES DO SHAREPOINT
const CONFIG = {
    // URL do SharePoint onde estão as atualizações (pasta Demandas criada)
    SHAREPOINT_BASE_URL: 'https://telefonicacorp.sharepoint.com/sites/ESCALONAMENTO_TOP_SIGITM.TMBNL/Shared%20Documents/Demandas',
    
    // Arquivos a serem verificados
    FILES_TO_CHECK: {
        'versao.json': 'versao.json',
        'backend/server.js': 'backend/server.js', 
        'web/js/app.js': 'frontend/app.js',
        'web/css/style.css': 'frontend/style.css',
        'web/index.html': 'frontend/index.html'
    },
    
    // Versão atual do sistema
    CURRENT_VERSION: '2.0.0',
    
    // Timeout para downloads
    TIMEOUT: 30000
};

// ✅ FUNÇÃO PARA BAIXAR ARQUIVO DO SHAREPOINT
async function downloadFile(url, localPath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        console.log(`📥 Baixando: ${url}`);
        
        const request = protocol.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(localPath);
                response.pipe(fileStream);
                
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`✅ Baixado: ${localPath}`);
                    resolve(true);
                });
                
                fileStream.on('error', (error) => {
                    fs.unlink(localPath, () => {}); // Limpar arquivo parcial
                    reject(error);
                });
            } else {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
            }
        });
        
        request.on('error', reject);
        request.setTimeout(CONFIG.TIMEOUT, () => {
            request.destroy();
            reject(new Error('Timeout na requisição'));
        });
    });
}

// ✅ FUNÇÃO PARA VERIFICAR VERSÃO NO SHAREPOINT
async function verificarVersaoSharePoint() {
    try {
        const versaoUrl = `${CONFIG.SHAREPOINT_BASE_URL}/versao.json`;
        const tempFile = path.join(__dirname, 'temp-versao.json');
        
        await downloadFile(versaoUrl, tempFile);
        
        const versaoData = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
        fs.unlinkSync(tempFile); // Limpar arquivo temporário
        
        console.log(`📋 Versão atual: ${CONFIG.CURRENT_VERSION}`);
        console.log(`📋 Versão SharePoint: ${versaoData.version}`);
        
        return versaoData;
        
    } catch (error) {
        console.log(`⚠️ Não foi possível verificar atualizações: ${error.message}`);
        return null;
    }
}

// ✅ FUNÇÃO PARA COMPARAR VERSÕES
function precisaAtualizar(versaoAtual, versaoSharePoint) {
    if (!versaoSharePoint) return false;
    
    const [majorA, minorA, patchA] = versaoAtual.split('.').map(Number);
    const [majorS, minorS, patchS] = versaoSharePoint.split('.').map(Number);
    
    if (majorS > majorA) return true;
    if (majorS === majorA && minorS > minorA) return true;
    if (majorS === majorA && minorS === minorA && patchS > patchA) return true;
    
    return false;
}

// ✅ FUNÇÃO PARA BAIXAR ATUALIZAÇÕES
async function baixarAtualizacoes(versaoInfo) {
    console.log('\n🔄 INICIANDO DOWNLOAD DAS ATUALIZAÇÕES...\n');
    
    const updates = [];
    
    // Verificar quais arquivos precisam ser atualizados
    for (const [localPath, remotePath] of Object.entries(CONFIG.FILES_TO_CHECK)) {
        if (localPath === 'versao.json') continue; // Pular arquivo de versão
        
        const arquivoLocal = path.join(__dirname, '..', localPath);
        const urlRemoto = `${CONFIG.SHAREPOINT_BASE_URL}/${remotePath}`;
        
        try {
            // Fazer backup do arquivo atual
            if (fs.existsSync(arquivoLocal)) {
                const backupPath = `${arquivoLocal}.backup-${Date.now()}`;
                fs.copyFileSync(arquivoLocal, backupPath);
                console.log(`💾 Backup criado: ${backupPath}`);
            }
            
            // Baixar nova versão
            await downloadFile(urlRemoto, arquivoLocal);
            updates.push(localPath);
            
        } catch (error) {
            console.log(`❌ Erro ao atualizar ${localPath}: ${error.message}`);
        }
    }
    
    return updates;
}

// ✅ FUNÇÃO PRINCIPAL DE VERIFICAÇÃO
async function verificarEAtualizarSistema() {
    console.log('\n========================================');
    console.log('🔍 VERIFICANDO ATUALIZAÇÕES NO SHAREPOINT');
    console.log('========================================\n');
    
    try {
        // 1. Verificar versão no SharePoint
        const versaoSharePoint = await verificarVersaoSharePoint();
        
        if (!versaoSharePoint) {
            console.log('⚠️ SharePoint não acessível - continuando com versão local');
            return false;
        }
        
        // 2. Comparar versões
        const needsUpdate = precisaAtualizar(CONFIG.CURRENT_VERSION, versaoSharePoint.version);
        
        if (!needsUpdate) {
            console.log('✅ Sistema já está na versão mais recente!');
            return false;
        }
        
        console.log(`🆕 NOVA VERSÃO DISPONÍVEL: ${versaoSharePoint.version}`);
        console.log(`📋 Mudanças: ${versaoSharePoint.changelog || 'Melhorias e correções'}`);
        
        // 3. Baixar atualizações
        const arquivosAtualizados = await baixarAtualizacoes(versaoSharePoint);
        
        if (arquivosAtualizados.length > 0) {
            console.log('\n✅ ATUALIZAÇÕES APLICADAS COM SUCESSO!');
            console.log('📁 Arquivos atualizados:');
            arquivosAtualizados.forEach(arquivo => console.log(`   • ${arquivo}`));
            
            // 4. Atualizar arquivo de versão local
            const localVersionFile = path.join(__dirname, '..', 'version.json');
            fs.writeFileSync(localVersionFile, JSON.stringify({
                version: versaoSharePoint.version,
                updated_at: new Date().toISOString(),
                changelog: versaoSharePoint.changelog
            }, null, 2));
            
            console.log(`\n🎉 SISTEMA ATUALIZADO PARA VERSÃO ${versaoSharePoint.version}!`);
            return true;
        } else {
            console.log('⚠️ Nenhuma atualização foi aplicada');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro durante verificação de atualizações:', error.message);
        return false;
    }
}

// ✅ EXECUTAR SE CHAMADO DIRETAMENTE
if (require.main === module) {
    verificarEAtualizacoes()
        .then(updated => {
            if (updated) {
                console.log('\n🔄 REINICIE O SISTEMA PARA APLICAR AS ATUALIZAÇÕES');
                process.exit(1); // Sinalizar que precisa reiniciar
            } else {
                console.log('\n✅ Continuando com sistema atual...');
                process.exit(0); // Continuar normalmente
            }
        })
        .catch(error => {
            console.error('💥 Erro crítico:', error);
            process.exit(0); // Continuar mesmo com erro
        });
}

module.exports = { verificarEAtualizarSistema };
