// ========================================
// EXECUTOR DE TESTES COMPLETO PARA SHAREPOINT
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const testConfig = require('./test-config');

class SharePointTestRunner {
    constructor() {
        this.testResults = [];
        this.mockServerProcess = null;
        this.startTime = null;
    }
    
    // ✅ INICIAR SERVIDOR MOCK (SE NECESSÁRIO)
    async startMockServer() {
        return new Promise((resolve, reject) => {
            console.log('🚀 Iniciando servidor mock SharePoint...');
            
            const mockServer = spawn('node', ['mock-sharepoint-server.js'], {
                cwd: __dirname,
                stdio: ['ignore', 'pipe', 'pipe']
            });
            
            let output = '';
            
            mockServer.stdout.on('data', (data) => {
                output += data.toString();
                if (output.includes('Servidor pronto para testes')) {
                    console.log('✅ Servidor mock iniciado com sucesso!');
                    this.mockServerProcess = mockServer;
                    resolve(mockServer);
                }
            });
            
            mockServer.stderr.on('data', (data) => {
                console.error('❌ Erro no servidor mock:', data.toString());
            });
            
            mockServer.on('error', (error) => {
                console.error('💥 Falha ao iniciar servidor mock:', error);
                reject(error);
            });
            
            // Timeout de 10 segundos para inicialização
            setTimeout(() => {
                if (!this.mockServerProcess) {
                    mockServer.kill();
                    reject(new Error('Timeout ao iniciar servidor mock'));
                }
            }, 10000);
        });
    }
    
    // ✅ PARAR SERVIDOR MOCK
    stopMockServer() {
        if (this.mockServerProcess) {
            console.log('🛑 Parando servidor mock...');
            this.mockServerProcess.kill();
            this.mockServerProcess = null;
            console.log('✅ Servidor mock parado');
        }
    }
    
    // ✅ EXECUTAR TESTE DE CONEXÃO
    async runConnectionTest() {
        console.log('\\n📡 EXECUTANDO TESTE DE CONEXÃO...');
        
        try {
            const { executarTestesSharePoint } = require('./test-sharepoint-connection');
            const result = await executarTestesSharePoint();
            
            this.testResults.push({
                test: 'connection',
                success: result.baseUrl && result.baseUrl.success,
                details: result,
                timestamp: new Date().toISOString()
            });
            
            return result;
        } catch (error) {
            console.error('❌ Erro no teste de conexão:', error);
            this.testResults.push({
                test: 'connection',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }
    
    // ✅ EXECUTAR TESTE DE ATUALIZAÇÃO
    async runUpdateTest() {
        console.log('\\n🔄 EXECUTANDO TESTE DE ATUALIZAÇÃO...');
        
        try {
            // Modificar temporariamente o script de atualização para usar configuração de teste
            const originalScript = path.join(__dirname, 'verificar-atualizacoes.js');
            const backupScript = originalScript + '.backup';
            
            // Fazer backup do script original
            fs.copyFileSync(originalScript, backupScript);
            
            // Criar versão modificada para teste
            const scriptContent = fs.readFileSync(originalScript, 'utf8');
            const config = testConfig.getCurrentConfig();
            
            const modifiedScript = scriptContent.replace(
                /SHAREPOINT_BASE_URL: '[^']*'/,
                `SHAREPOINT_BASE_URL: '${config.BASE_URL}'`
            ).replace(
                /TIMEOUT: \\d+/,
                `TIMEOUT: ${config.TIMEOUT}`
            );
            
            fs.writeFileSync(originalScript, modifiedScript);
            
            // Executar teste de atualização
            const { verificarEAtualizarSistema } = require('./verificar-atualizacoes');
            
            // Limpar cache do require para pegar a versão modificada
            delete require.cache[require.resolve('./verificar-atualizacoes')];
            
            const updateResult = await verificarEAtualizarSistema();
            
            this.testResults.push({
                test: 'update',
                success: updateResult,
                timestamp: new Date().toISOString()
            });
            
            // Restaurar script original
            fs.copyFileSync(backupScript, originalScript);
            fs.unlinkSync(backupScript);
            
            return updateResult;
            
        } catch (error) {
            console.error('❌ Erro no teste de atualização:', error);
            this.testResults.push({
                test: 'update',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            // Tentar restaurar backup se existir
            const backupScript = path.join(__dirname, 'verificar-atualizacoes.js.backup');
            const originalScript = path.join(__dirname, 'verificar-atualizacoes.js');
            
            if (fs.existsSync(backupScript)) {
                fs.copyFileSync(backupScript, originalScript);
                fs.unlinkSync(backupScript);
            }
            
            throw error;
        }
    }
    
    // ✅ TESTAR CONFIGURAÇÃO ATUAL
    async testCurrentConfig() {
        console.log('\\n⚙️ TESTANDO CONFIGURAÇÃO ATUAL...');
        
        const configReport = testConfig.getReport();
        
        this.testResults.push({
            test: 'configuration',
            success: configReport.validation.valid,
            details: configReport,
            timestamp: new Date().toISOString()
        });
        
        if (!configReport.validation.valid) {
            throw new Error('Configuração inválida: ' + configReport.validation.issues.join(', '));
        }
        
        return configReport;
    }
    
    // ✅ EXECUTAR TODOS OS TESTES
    async runAllTests() {
        this.startTime = new Date();
        
        console.log('========================================');
        console.log('🧪 INICIANDO BATERIA COMPLETA DE TESTES');
        console.log('========================================');
        
        try {
            // 1. Testar configuração
            await this.testCurrentConfig();
            
            // 2. Iniciar servidor mock se necessário
            const config = testConfig.getCurrentConfig();
            if (config.mode === 'TEST') {
                await this.startMockServer();
                // Aguardar um pouco para o servidor estabilizar
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // 3. Testar conexão
            await this.runConnectionTest();
            
            // 4. Testar atualização
            await this.runUpdateTest();
            
            // 5. Gerar relatório final
            this.generateFinalReport();
            
        } catch (error) {
            console.error('💥 Erro durante execução dos testes:', error);
            this.generateFinalReport();
            throw error;
        } finally {
            // Limpar recursos
            this.stopMockServer();
        }
    }
    
    // ✅ GERAR RELATÓRIO FINAL
    generateFinalReport() {
        const endTime = new Date();
        const duration = endTime - this.startTime;
        
        console.log('\\n========================================');
        console.log('📊 RELATÓRIO FINAL DOS TESTES');
        console.log('========================================');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(t => t.success).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`⏱️ Duração total: ${Math.round(duration / 1000)}s`);
        console.log(`📈 Testes executados: ${totalTests}`);
        console.log(`✅ Testes aprovados: ${passedTests}`);
        console.log(`❌ Testes falharam: ${failedTests}`);
        console.log(`🎯 Taxa de sucesso: ${Math.round(passedTests / totalTests * 100)}%`);
        
        console.log('\\n📋 Detalhes por teste:');
        this.testResults.forEach((result, index) => {
            const status = result.success ? '✅' : '❌';
            const error = result.error ? ` (${result.error})` : '';
            console.log(`   ${index + 1}. ${status} ${result.test}${error}`);
        });
        
        // Salvar relatório em arquivo
        const reportFile = path.join(__dirname, 'test-report.json');
        const report = {
            timestamp: endTime.toISOString(),
            duration: duration,
            config: testConfig.getCurrentConfig(),
            results: this.testResults,
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: Math.round(passedTests / totalTests * 100)
            }
        };
        
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        console.log(`\\n📄 Relatório completo salvo em: ${reportFile}`);
        
        // Recomendações
        console.log('\\n💡 RECOMENDAÇÕES:');
        if (passedTests === totalTests) {
            console.log('   🎉 Todos os testes passaram! Sistema pronto para produção.');
        } else {
            console.log('   🔧 Corrija os problemas identificados antes de usar em produção.');
            console.log('   📚 Consulte os logs detalhados para mais informações.');
        }
        
        console.log('========================================\\n');
        
        return report;
    }
}

// ✅ EXECUTAR SE CHAMADO DIRETAMENTE
if (require.main === module) {
    const runner = new SharePointTestRunner();
    
    // Verificar argumentos da linha de comando
    const args = process.argv.slice(2);
    
    if (args.includes('--production')) {
        testConfig.setMode('PRODUCTION');
        console.log('🌍 Modo configurado para PRODUCTION (SharePoint real)');
    } else if (args.includes('--test')) {
        testConfig.setMode('TEST');
        console.log('🧪 Modo configurado para TEST (servidor mock)');
    }
    
    runner.runAllTests()
        .then(() => {
            console.log('🏁 Todos os testes concluídos com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Falha na execução dos testes:', error.message);
            process.exit(1);
        });
}

module.exports = SharePointTestRunner;