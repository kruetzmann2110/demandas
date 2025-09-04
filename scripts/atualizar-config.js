// ========================================
// ATUALIZADOR AUTOMÁTICO DE CONFIGURAÇÃO SHAREPOINT
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const fs = require('fs');
const path = require('path');
const SharePointUrlHelper = require('./sharepoint-url-helper');

class ConfigUpdater {
    constructor() {
        this.configFile = path.join(__dirname, 'test-config.js');
        this.verificarAtualizacoesFile = path.join(__dirname, 'verificar-atualizacoes.js');
        this.originalShareUrl = 'https://telefonicacorp.sharepoint.com/:f:/s/ESCALONAMENTO_TOP_SIGITM.TMBNL/Euv5uX62jLFNvQOF3e4qSEMBM6qBcQwKyriNZBbhQKSIlw?e=9cHhco';
    }
    
    /**
     * Analisa o link do SharePoint e encontra a melhor URL
     */
    async findBestSharePointUrl() {
        console.log('🔍 Analisando link do SharePoint para encontrar melhor URL...\n');
        
        try {
            // Gerar URLs de teste
            const testUrls = SharePointUrlHelper.generateTestUrls(this.originalShareUrl);
            
            // Teste simples - usar a URL mais provável primeiro
            const parsedInfo = SharePointUrlHelper.parseSharePointUrl(this.originalShareUrl);
            
            // URL mais provável baseada na estrutura padrão do SharePoint
            const likelyUrl = `${parsedInfo.documentsUrl}/Demandas`;
            
            console.log(`🎯 URL mais provável: ${likelyUrl}`);
            
            return {
                recommendedUrl: likelyUrl,
                parsedInfo,
                allUrls: testUrls
            };
            
        } catch (error) {
            console.error('❌ Erro ao analisar URL:', error.message);
            throw error;
        }
    }
    
    /**
     * Atualiza o arquivo test-config.js
     */
    updateTestConfig(newUrl) {
        console.log('📝 Atualizando test-config.js...');
        
        try {
            // Ler arquivo atual
            const configContent = fs.readFileSync(this.configFile, 'utf8');
            
            // Fazer backup
            const backupFile = this.configFile + '.backup-' + Date.now();
            fs.writeFileSync(backupFile, configContent);
            console.log(`💾 Backup criado: ${backupFile}`);
            
            // Atualizar URL de produção
            const updatedContent = configContent.replace(
                /BASE_URL: 'https:\/\/telefonicacorp\.sharepoint\.com[^']*'/,
                `BASE_URL: '${newUrl}'`
            );
            
            // Verificar se houve mudança
            if (updatedContent === configContent) {
                console.log('⚠️ Nenhuma alteração detectada - verificando padrão...');
                
                // Tentar padrão alternativo
                const alternativeUpdate = configContent.replace(
                    /BASE_URL: '[^']*telefonicacorp\.sharepoint\.com[^']*'/,
                    `BASE_URL: '${newUrl}'`
                );
                
                if (alternativeUpdate !== configContent) {
                    fs.writeFileSync(this.configFile, alternativeUpdate);
                    console.log('✅ test-config.js atualizado com sucesso!');
                } else {
                    console.log('❌ Não foi possível atualizar automaticamente');
                    console.log('🔧 Atualize manualmente a linha PRODUCTION.BASE_URL');
                }
            } else {
                fs.writeFileSync(this.configFile, updatedContent);
                console.log('✅ test-config.js atualizado com sucesso!');
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar test-config.js:', error.message);
            throw error;
        }
    }
    
    /**
     * Atualiza o arquivo verificar-atualizacoes.js
     */
    updateVerificarAtualizacoes(newUrl) {
        console.log('📝 Atualizando verificar-atualizacoes.js...');
        
        try {
            // Ler arquivo atual
            const scriptContent = fs.readFileSync(this.verificarAtualizacoesFile, 'utf8');
            
            // Fazer backup
            const backupFile = this.verificarAtualizacoesFile + '.backup-' + Date.now();
            fs.writeFileSync(backupFile, scriptContent);
            console.log(`💾 Backup criado: ${backupFile}`);
            
            // Atualizar URL do SharePoint
            const updatedContent = scriptContent.replace(
                /SHAREPOINT_BASE_URL: '[^']*'/,
                `SHAREPOINT_BASE_URL: '${newUrl}'`
            );
            
            if (updatedContent !== scriptContent) {
                fs.writeFileSync(this.verificarAtualizacoesFile, updatedContent);
                console.log('✅ verificar-atualizacoes.js atualizado com sucesso!');
            } else {
                console.log('⚠️ Nenhuma alteração detectada em verificar-atualizacoes.js');
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar verificar-atualizacoes.js:', error.message);
            console.log('🔧 Atualize manualmente a linha SHAREPOINT_BASE_URL');
        }
    }
    
    /**
     * Valida se as URLs estão corretas nos arquivos
     */
    validateUpdates(expectedUrl) {
        console.log('\n✅ Validando atualizações...');
        
        const results = {
            testConfig: false,
            verificarAtualizacoes: false
        };
        
        try {
            // Verificar test-config.js
            const configContent = fs.readFileSync(this.configFile, 'utf8');
            if (configContent.includes(expectedUrl)) {
                results.testConfig = true;
                console.log('✅ test-config.js: URL atualizada corretamente');
            } else {
                console.log('❌ test-config.js: URL não encontrada');
            }
            
            // Verificar verificar-atualizacoes.js
            const scriptContent = fs.readFileSync(this.verificarAtualizacoesFile, 'utf8');
            if (scriptContent.includes(expectedUrl)) {
                results.verificarAtualizacoes = true;
                console.log('✅ verificar-atualizacoes.js: URL atualizada corretamente');
            } else {
                console.log('❌ verificar-atualizacoes.js: URL não encontrada');
            }
            
        } catch (error) {
            console.error('❌ Erro durante validação:', error.message);
        }
        
        return results;
    }
    
    /**
     * Executa a atualização completa
     */
    async updateAll() {
        console.log('========================================');
        console.log('🔄 ATUALIZANDO CONFIGURAÇÕES DO SHAREPOINT');
        console.log('========================================\n');
        
        try {
            // 1. Encontrar melhor URL
            const analysis = await this.findBestSharePointUrl();
            const newUrl = analysis.recommendedUrl;
            
            console.log(`\n🎯 URL que será usada: ${newUrl}\n`);
            
            // 2. Atualizar arquivos
            this.updateTestConfig(newUrl);
            this.updateVerificarAtualizacoes(newUrl);
            
            // 3. Validar mudanças
            const validation = this.validateUpdates(newUrl);
            
            // 4. Relatório final
            console.log('\n========================================');
            console.log('📊 RELATÓRIO DE ATUALIZAÇÃO');
            console.log('========================================');
            console.log(`🔗 Nova URL: ${newUrl}`);
            console.log(`📝 test-config.js: ${validation.testConfig ? '✅ OK' : '❌ FALHA'}`);
            console.log(`📝 verificar-atualizacoes.js: ${validation.verificarAtualizacoes ? '✅ OK' : '❌ FALHA'}`);
            
            const successCount = Object.values(validation).filter(Boolean).length;
            const totalFiles = Object.keys(validation).length;
            
            console.log(`📈 Taxa de sucesso: ${successCount}/${totalFiles}`);
            
            if (successCount === totalFiles) {
                console.log('\n🎉 TODAS AS CONFIGURAÇÕES ATUALIZADAS COM SUCESSO!');
                console.log('\n💡 PRÓXIMOS PASSOS:');
                console.log('1. Execute: EXECUTAR-TESTES.bat');
                console.log('2. Escolha opção 2 (teste com SharePoint real)');
                console.log('3. Verifique se consegue acessar os arquivos');
                console.log('4. Se funcionar, você está pronto para usar em produção!');
            } else {
                console.log('\n⚠️ ALGUMAS ATUALIZAÇÕES FALHARAM');
                console.log('🔧 Verifique os arquivos manualmente e tente novamente');
            }
            
            // 5. Salvar relatório
            const report = {
                originalUrl: this.originalShareUrl,
                newUrl: newUrl,
                analysis: analysis,
                validation: validation,
                timestamp: new Date().toISOString()
            };
            
            const reportFile = path.join(__dirname, 'config-update-report.json');
            fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
            console.log(`\n📄 Relatório salvo em: ${reportFile}`);
            
            return report;
            
        } catch (error) {
            console.error('\n💥 Erro durante atualização:', error.message);
            throw error;
        }
    }
}

// ✅ EXECUTAR SE CHAMADO DIRETAMENTE
if (require.main === module) {
    const updater = new ConfigUpdater();
    
    updater.updateAll()
        .then(() => {
            console.log('\n🏁 Atualização concluída!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Falha na atualização:', error.message);
            process.exit(1);
        });
}

module.exports = ConfigUpdater;