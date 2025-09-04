// ========================================
// SISTEMA DE INICIALIZAÇÃO COM ATUALIZAÇÕES
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const path = require('path');
const { spawn } = require('child_process');
const GitHubUpdateSystem = require('./scripts/github-update-system');
const CorporateDownloader = require('./scripts/corporate-downloader');

console.log('🚀 INICIANDO SISTEMA DE DEMANDAS...\n');

class SystemStarter {
    constructor() {
        this.githubUpdater = new GitHubUpdateSystem({
            owner: 'kruetzmann2110',
            repo: 'demandas',
            branch: 'main',
            folder: 'releases'
        });
        
        this.corporateDownloader = new CorporateDownloader();
    }

    /**
     * Verificar se há atualizações disponíveis
     */
    async verificarAtualizacoes() {
        console.log('🔍 VERIFICANDO ATUALIZAÇÕES...\n');
        
        try {
            // Tentar método padrão primeiro
            let atualizacaoDisponivel = await this.githubUpdater.verificarEAtualizarSistema();
            
            // Se falhou por certificado SSL, tentar método corporativo
            if (!atualizacaoDisponivel) {
                console.log('\n🏢 Tentando método corporativo para ambientes com proxy/firewall...');
                
                const versaoGitHub = await this.corporateDownloader.verificarVersaoGitHub();
                
                if (versaoGitHub) {
                    console.log('✅ Conexão via método corporativo estabelecida!');
                    console.log(`📋 Versão disponível: ${versaoGitHub.version}`);
                    
                    // Verificar se precisa atualizar (versão simplificada)
                    const CURRENT_VERSION = '2.0.0';
                    if (versaoGitHub.version !== CURRENT_VERSION) {
                        console.log('🆕 Nova versão disponível!');
                        console.log('📋 Para atualizar manualmente, baixe do GitHub: https://github.com/kruetzmann2110/demandas');
                    } else {
                        console.log('✅ Versão atual é a mais recente');
                    }
                } else {
                    console.log('⚠️ Métodos de atualização indisponíveis - GitHub pode estar bloqueado');
                }
            }
            
            if (atualizacaoDisponivel) {
                console.log('\n✅ SISTEMA ATUALIZADO COM SUCESSO!');
                console.log('🔄 REINICIANDO COM NOVA VERSÃO...\n');
                
                // Aguardar um pouco antes de reiniciar
                await this.aguardar(2000);
                return true;
            } else {
                console.log('✅ Sistema já está na versão mais recente!');
                console.log('🚀 Iniciando servidor...\n');
                return false;
            }
            
        } catch (error) {
            console.error('⚠️ Erro ao verificar atualizações:', error.message);
            console.log('📱 Continuando com versão local...\n');
            return false;
        }
    }

    /**
     * Iniciar o servidor backend
     */
    async iniciarServidor() {
        return new Promise((resolve, reject) => {
            console.log('🎯 INICIANDO SERVIDOR BACKEND...\n');
            
            // Caminho para o servidor
            const serverPath = path.join(__dirname, 'backend', 'server.js');
            
            // Iniciar o processo do servidor
            const serverProcess = spawn('node', [serverPath], {
                stdio: 'inherit', // Mostrar output do servidor no console atual
                cwd: __dirname
            });

            // Quando o servidor iniciar
            serverProcess.on('spawn', () => {
                console.log('✅ Servidor iniciado com sucesso!');
                console.log('🌐 Acesse: http://localhost:3000');
                console.log('📊 Dashboard: http://localhost:3000/index.html');
                console.log('\n🔥 SISTEMA DE DEMANDAS FUNCIONANDO!\n');
                resolve(serverProcess);
            });

            // Se houver erro
            serverProcess.on('error', (error) => {
                console.error('❌ Erro ao iniciar servidor:', error.message);
                reject(error);
            });

            // Se o servidor fechar
            serverProcess.on('close', (code) => {
                if (code !== 0) {
                    console.log(`⚠️ Servidor fechou com código: ${code}`);
                } else {
                    console.log('✅ Servidor fechado normalmente');
                }
            });

            // Capturar Ctrl+C para fechar graciosamente
            process.on('SIGINT', () => {
                console.log('\n🛑 Fechando sistema...');
                serverProcess.kill();
                process.exit(0);
            });
        });
    }

    /**
     * Aguardar um tempo em millisegundos
     */
    async aguardar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Iniciar o sistema completo
     */
    async iniciar() {
        try {
            console.log('========================================');
            console.log('🏢 SISTEMA DE DEMANDAS GOVERNANÇA TOP');
            console.log('📅 Versão 2.0.0 - Auto Update via GitHub');
            console.log('========================================\n');

            // 1. Verificar atualizações
            const foiAtualizado = await this.verificarAtualizacoes();
            
            if (foiAtualizado) {
                // Se foi atualizado, reiniciar o processo inteiro
                console.log('🔄 Reiniciando processo após atualização...\n');
                
                // Reiniciar este script
                const novoProcesso = spawn('node', [__filename], {
                    stdio: 'inherit',
                    detached: true
                });
                
                novoProcesso.unref();
                process.exit(0);
            }

            // 2. Iniciar servidor normalmente
            await this.iniciarServidor();
            
        } catch (error) {
            console.error('💥 Erro crítico durante inicialização:', error.message);
            console.log('🔄 Tentando iniciar servidor mesmo assim...\n');
            
            try {
                await this.iniciarServidor();
            } catch (serverError) {
                console.error('❌ Falha total na inicialização:', serverError.message);
                process.exit(1);
            }
        }
    }

    /**
     * Testar conectividade com GitHub (modo teste)
     */
    async testarConectividade() {
        console.log('🧪 MODO TESTE - VERIFICANDO CONECTIVIDADE GITHUB\n');
        
        try {
            const resultados = await this.githubUpdater.testarConectividade();
            
            const sucessos = resultados.filter(r => r.success).length;
            
            if (sucessos === resultados.length) {
                console.log('\n🎉 TODOS OS TESTES PASSARAM!');
                console.log('✅ GitHub está acessível e configurado corretamente');
                console.log('🚀 Sistema pronto para auto-updates\n');
            } else {
                console.log('\n⚠️ ALGUNS TESTES FALHARAM');
                console.log('🔧 Verifique a configuração do repositório\n');
            }
            
            return sucessos === resultados.length;
            
        } catch (error) {
            console.error('❌ Erro nos testes:', error.message);
            return false;
        }
    }
}

// ✅ EXECUTAR BASEADO NOS ARGUMENTOS
if (require.main === module) {
    const starter = new SystemStarter();
    const args = process.argv.slice(2);
    
    if (args.includes('--test')) {
        // Modo teste - só verificar conectividade
        starter.testarConectividade()
            .then(sucesso => {
                process.exit(sucesso ? 0 : 1);
            })
            .catch(error => {
                console.error('💥 Falha no teste:', error.message);
                process.exit(1);
            });
    } else {
        // Modo normal - iniciar sistema com verificação de updates
        starter.iniciar()
            .catch(error => {
                console.error('💥 Falha na inicialização:', error.message);
                process.exit(1);
            });
    }
}

module.exports = SystemStarter;