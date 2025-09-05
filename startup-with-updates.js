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
                    const CURRENT_VERSION = '2.0.3';
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
     * Verificar e instalar dependências se necessário
     */
    async verificarDependencias() {
        console.log('🔍 Verificando dependências...');
        
        try {
            require('express');
            require('mssql');
            console.log('✅ Dependências encontradas\n');
            return true;
        } catch (error) {
            console.log('⚠️ Dependências faltando - instalando automaticamente...');
            
            const { spawn } = require('child_process');
            
            return new Promise((resolve) => {
                const npmInstall = spawn('npm', ['install', 'express', 'mssql'], {
                    stdio: 'inherit',
                    cwd: __dirname
                });
                
                npmInstall.on('close', (code) => {
                    if (code === 0) {
                        console.log('✅ Dependências instaladas com sucesso!\n');
                        resolve(true);
                    } else {
                        console.log('❌ Erro ao instalar dependências via npm');
                        console.log('🏢 Tentando instalador corporativo sem Git...');
                        
                        // Fallback para instalador corporativo
                        this.instalarDependenciasCorporativo()
                            .then(sucesso => {
                                if (sucesso) {
                                    console.log('✅ Dependências instaladas via método corporativo!\n');
                                    resolve(true);
                                } else {
                                    console.log('❌ Falha na instalação corporativa');
                                    console.log('🔧 SOLUÇÕES DISPONÍVEIS:');
                                    console.log('   1. Execute: node scripts/instalar-dependencias-corporativo.js');
                                    console.log('   2. Execute: INSTALAR-DEPENDENCIAS-CORPORATIVO.bat');
                                    console.log('   3. Execute: INICIAR-COM-DEPENDENCIAS.bat (recomendado)');
                                    console.log('   4. Veja: SOLUCAO-ERRO-EXPRESS.md para mais detalhes\n');
                                    resolve(false);
                                }
                            });
                    }
                });
                
                npmInstall.on('error', (error) => {
                    console.log('❌ Erro ao executar npm install:', error.message);
                    console.log('🏢 Tentando instalador corporativo sem Git...');
                    
                    // Fallback para instalador corporativo
                    this.instalarDependenciasCorporativo()
                        .then(sucesso => {
                            if (sucesso) {
                                console.log('✅ Dependências instaladas via método corporativo!\n');
                                resolve(true);
                            } else {
                                console.log('❌ Falha na instalação corporativa');
                                console.log('🔧 SOLUÇÕES DISPONÍVEIS:');
                                console.log('   1. Execute: node scripts/instalar-dependencias-corporativo.js');
                                console.log('   2. Execute: INSTALAR-DEPENDENCIAS-CORPORATIVO.bat');
                                console.log('   3. Execute: INICIAR-COM-DEPENDENCIAS.bat (recomendado)');
                                console.log('   4. Veja: SOLUCAO-ERRO-EXPRESS.md para mais detalhes\n');
                                resolve(false);
                            }
                        });
                });
            });
        }
    }

    /**
     * Instalar dependências usando método corporativo (sem Git)
     */
    async instalarDependenciasCorporativo() {
        try {
            const DependencyInstaller = require('./scripts/instalar-dependencias-corporativo');
            const installer = new DependencyInstaller();
            return await installer.instalar();
        } catch (error) {
            console.log('❌ Erro no instalador corporativo:', error.message);
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
            
            // Iniciar o processo do servidor com as variáveis de ambiente
            const serverProcess = spawn('node', [serverPath], {
                stdio: 'inherit', // Mostrar output do servidor no console atual
                cwd: __dirname,
                env: process.env // Passar todas as variáveis de ambiente, incluindo PORT
            });

            // Quando o servidor iniciar
            serverProcess.on('spawn', () => {
                const port = process.env.PORT || 3000;
                console.log('✅ Servidor iniciado com sucesso!');
                console.log('🌐 Acesse: http://localhost:' + port);
                console.log('📊 Dashboard: http://localhost:' + port + '/index.html');
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
            console.log('📅 Versão 2.0.3 - Auto Update via GitHub');
            console.log('========================================\n');

            // 1. Verificar atualizações
            const foiAtualizado = await this.verificarAtualizacoes();
            
            if (foiAtualizado) {
                // Se foi atualizado, aguardar um pouco e continuar
                console.log('🔄 Sistema atualizado! Aguardando e continuando execução...\n');
                await this.aguardar(3000); // Aguardar 3 segundos
                
                // Não reiniciar o processo, apenas continuar
                console.log('🚀 Continuando com versão atualizada...');
            }

            // 2. Verificar dependências
            const dependenciasOK = await this.verificarDependencias();
            
            if (!dependenciasOK) {
                console.log('❌ Dependências não puderam ser instaladas!');
                console.log('🔧 Por favor, execute manualmente um dos seguintes comandos:');
                console.log('   1. node scripts/instalar-dependencias-corporativo.js');
                console.log('   2. INSTALAR-DEPENDENCIAS-CORPORATIVO.bat');
                console.log('   3. npm install express mssql (se tiver acesso ao npm)');
                console.log('\n🛑 Sistema não pode iniciar sem as dependências necessárias.');
                process.exit(1);
            }

            // 3. Iniciar servidor normalmente
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