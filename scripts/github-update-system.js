// ========================================
// SISTEMA DE ATUALIZAÇÃO VIA GITHUB
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração para ambiente corporativo
// Ignorar verificação de certificado SSL APENAS para ambientes com proxy/firewall
if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    // Suprimir warning específico do NODE_TLS_REJECT_UNAUTHORIZED em produção
    const originalEmitWarning = process.emitWarning;
    process.emitWarning = (warning, ...args) => {
        if (typeof warning === 'string' && warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {
            // Warning suprimido - configuração necessária para ambientes corporativos
            return;
        }
        return originalEmitWarning.call(process, warning, ...args);
    };
}

// Configurar agent HTTPS para ambientes corporativos
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    timeout: 30000
});

class GitHubUpdateSystem {
    constructor(config = {}) {
        // Configuração do repositório GitHub
        this.config = {
            owner: config.owner || 'kruetzmann2110', // seu usuário GitHub
            repo: config.repo || 'demandas', // seu novo repositório
            branch: config.branch || 'master',
            folder: config.folder || 'releases', // pasta onde ficam as atualizações
            token: config.token || null, // GitHub token (opcional para repos públicos)
            ...config
        };
        
        this.baseUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`;
        this.rawUrl = `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}`;
    }

    /**
     * Fazer requisição para GitHub API
     */
    async makeGitHubRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const headers = {
                'User-Agent': 'Sistema-Demandas-Updater/1.0',
                'Accept': 'application/vnd.github.v3+json',
                ...options.headers
            };

            // Adicionar token se disponível
            if (this.config.token) {
                headers['Authorization'] = `token ${this.config.token}`;
            }

            console.log(`🔗 GET ${url}`);

            const req = https.request(url, {
                method: options.method || 'GET',
                headers: headers,
                timeout: 30000,
                agent: httpsAgent  // Usar agent configurado para ambiente corporativo
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    console.log(`📡 Status: ${res.statusCode}`);
                    
                    try {
                        const result = {
                            statusCode: res.statusCode,
                            headers: res.headers,
                            data: res.statusCode === 200 ? JSON.parse(data) : data,
                            rawData: data
                        };
                        resolve(result);
                    } catch (parseError) {
                        // Se não for JSON, retornar como texto
                        resolve({
                            statusCode: res.statusCode,
                            headers: res.headers,
                            data: data,
                            rawData: data
                        });
                    }
                });
            });

            req.on('error', (error) => {
                console.log(`❌ Erro na requisição: ${error.message}`);
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Timeout na requisição GitHub'));
            });

            req.end();
        });
    }

    /**
     * Baixar arquivo raw do GitHub
     */
    async downloadRawFile(filePath) {
        const url = `${this.rawUrl}/${this.config.folder}/${filePath}`;
        
        return new Promise((resolve, reject) => {
            console.log(`📥 Baixando: ${url}`);

            const req = https.request(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Sistema-Demandas-Updater/1.0'
                },
                timeout: 30000,
                agent: httpsAgent  // Usar agent configurado para ambiente corporativo
            }, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    console.log(`📡 Status: ${res.statusCode}`);
                    
                    if (res.statusCode === 200) {
                        console.log(`✅ Baixado: ${filePath} (${data.length} bytes)`);
                        resolve({
                            success: true,
                            content: data,
                            size: data.length,
                            filePath: filePath
                        });
                    } else {
                        console.log(`❌ Falha no download: ${res.statusCode}`);
                        resolve({
                            success: false,
                            statusCode: res.statusCode,
                            error: `HTTP ${res.statusCode}`,
                            filePath: filePath
                        });
                    }
                });
            });

            req.on('error', (error) => {
                console.log(`❌ Erro no download: ${error.message}`);
                resolve({
                    success: false,
                    error: error.message,
                    filePath: filePath
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'Timeout',
                    filePath: filePath
                });
            });

            req.end();
        });
    }

    /**
     * Verificar versão no GitHub
     */
    async verificarVersaoGitHub() {
        console.log('🔍 Verificando versão no GitHub...');
        
        try {
            const result = await this.downloadRawFile('versao.json');
            
            if (result.success) {
                try {
                    const versaoData = JSON.parse(result.content);
                    console.log(`📋 Versão GitHub: ${versaoData.version}`);
                    console.log(`📅 Atualização: ${versaoData.updated_at}`);
                    
                    return versaoData;
                } catch (parseError) {
                    console.error(`❌ Erro ao fazer parse do JSON: ${parseError.message}`);
                    console.log(`📄 Conteúdo recebido: ${result.content.substring(0, 300)}...`);
                    return null;
                }
            } else {
                console.log(`⚠️ Não foi possível acessar versao.json: ${result.error}`);
                return null;
            }
            
        } catch (error) {
            console.error(`💥 Erro na verificação de versão: ${error.message}`);
            return null;
        }
    }

    /**
     * Listar releases/tags disponíveis
     */
    async listarReleases() {
        console.log('📋 Listando releases disponíveis...');
        
        try {
            const url = `${this.baseUrl}/releases`;
            const result = await this.makeGitHubRequest(url);
            
            if (result.statusCode === 200 && Array.isArray(result.data)) {
                console.log(`📊 Encontradas ${result.data.length} releases:`);
                
                result.data.slice(0, 5).forEach((release, index) => {
                    console.log(`   ${index + 1}. ${release.tag_name} - ${release.name}`);
                    console.log(`      📅 ${release.published_at}`);
                    if (release.prerelease) console.log('      ⚠️ Pre-release');
                });
                
                return {
                    success: true,
                    releases: result.data
                };
            } else {
                console.log(`❌ Erro ao listar releases: ${result.statusCode}`);
                return {
                    success: false,
                    error: `HTTP ${result.statusCode}`
                };
            }
            
        } catch (error) {
            console.log(`💥 Erro ao listar releases: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Baixar arquivos de atualização
     */
    async baixarAtualizacoes(arquivos) {
        console.log(`🔄 Baixando ${arquivos.length} arquivos do GitHub...`);
        
        const results = [];
        
        for (const arquivo of arquivos) {
            console.log(`\n📥 Processando: ${arquivo}`);
            
            try {
                const result = await this.downloadRawFile(arquivo);
                
                if (result.success) {
                    // Salvar arquivo localmente - APENAS na pasta correta (web/)
                    let localPath;
                    
                    if (arquivo.startsWith('web/')) {
                        // Para arquivos web/, manter a estrutura completa na pasta web
                        localPath = path.join(__dirname, '..', arquivo);
                    } else {
                        // Para backend, remover primeira pasta
                        localPath = path.join(__dirname, '..', arquivo.replace(/^[^/]+\//, ''));
                    }
                    
                    // Criar diretório se necessário
                    const dir = path.dirname(localPath);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    
                    // Salvar novo arquivo diretamente
                    fs.writeFileSync(localPath, result.content);
                    console.log(`✅ Arquivo atualizado: ${localPath}`);
                    
                    results.push({
                        arquivo: arquivo,
                        success: true,
                        localPath: localPath,
                        size: result.size
                    });
                } else {
                    console.log(`❌ Falha no download: ${result.error}`);
                    results.push({
                        arquivo: arquivo,
                        success: false,
                        error: result.error
                    });
                }
                
                // Pausa entre downloads
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`💥 Erro com ${arquivo}: ${error.message}`);
                results.push({
                    arquivo: arquivo,
                    success: false,
                    error: error.message
                });
            }
        }
        
        const sucessos = results.filter(r => r.success).length;
        console.log(`\n📊 Resultados: ${sucessos}/${results.length} arquivos baixados`);
        
        return results;
    }

    /**
     * Comparar versões (igual ao sistema anterior)
     */
    precisaAtualizar(versaoAtual, versaoGitHub) {
        if (!versaoGitHub) return false;
        
        const [majorA, minorA, patchA] = versaoAtual.split('.').map(Number);
        const [majorG, minorG, patchG] = versaoGitHub.split('.').map(Number);
        
        if (majorG > majorA) return true;
        if (majorG === majorA && minorG > minorA) return true;
        if (majorG === majorA && minorG === minorA && patchG > patchA) return true;
        
        return false;
    }

    /**
     * Executar verificação e atualização completa
     */
    async verificarEAtualizarSistema() {
        console.log('\n========================================');
        console.log('🔍 VERIFICANDO ATUALIZAÇÕES NO GITHUB');
        console.log('========================================\n');
        
        const CURRENT_VERSION = '2.0.0'; // Versão atual do sistema
        
        try {
            // 1. Verificar versão no GitHub
            const versaoGitHub = await this.verificarVersaoGitHub();
            
            if (!versaoGitHub) {
                console.log('⚠️ GitHub não acessível - continuando com versão local');
                return false;
            }
            
            // 2. Comparar versões
            const needsUpdate = this.precisaAtualizar(CURRENT_VERSION, versaoGitHub.version);
            
            if (!needsUpdate) {
                console.log('✅ Sistema já está na versão mais recente!');
                return false;
            }
            
            console.log(`🆕 NOVA VERSÃO DISPONÍVEL: ${versaoGitHub.version}`);
            console.log(`📋 Mudanças: ${versaoGitHub.changelog || 'Melhorias e correções'}`);
            
            // 3. Baixar atualizações - AGORA ATUALIZA AMBOS OS FRONTENDS
            const arquivosParaBaixar = [
                'backend/server.js',     // Backend
                'web/js/app.js',        // JavaScript WEB
                'web/css/style.css',    // CSS WEB  
                'web/index.html'        // HTML WEB
            ];
            
            const arquivosAtualizados = await this.baixarAtualizacoes(arquivosParaBaixar);
            
            const sucessos = arquivosAtualizados.filter(a => a.success);
            
            if (sucessos.length > 0) {
                console.log('\n✅ ATUALIZAÇÕES APLICADAS COM SUCESSO!');
                console.log('📁 Arquivos atualizados:');
                sucessos.forEach(arquivo => console.log(`   • ${arquivo.arquivo}`));
                
                // 4. Atualizar arquivo de versão local
                const localVersionFile = path.join(__dirname, '..', 'version.json');
                fs.writeFileSync(localVersionFile, JSON.stringify({
                    version: versaoGitHub.version,
                    updated_at: new Date().toISOString(),
                    changelog: versaoGitHub.changelog,
                    source: 'GitHub',
                    repository: `${this.config.owner}/${this.config.repo}`
                }, null, 2));
                
                console.log(`\n🎉 SISTEMA ATUALIZADO PARA VERSÃO ${versaoGitHub.version}!`);
                console.log(`📋 Fonte: GitHub (${this.config.owner}/${this.config.repo})`);
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

    /**
     * Testar conectividade com GitHub
     */
    async testarConectividade() {
        console.log('========================================');
        console.log('🧪 TESTANDO CONECTIVIDADE GITHUB');
        console.log('========================================\n');
        
        console.log(`📋 Repositório: ${this.config.owner}/${this.config.repo}`);
        console.log(`🌿 Branch: ${this.config.branch}`);
        console.log(`📁 Pasta: ${this.config.folder}\n`);
        
        const tests = [
            {
                name: 'Informações do repositório',
                test: () => this.makeGitHubRequest(this.baseUrl)
            },
            {
                name: 'Listar releases',
                test: () => this.listarReleases()
            },
            {
                name: 'Download versao.json',
                test: () => this.verificarVersaoGitHub()
            }
        ];
        
        const results = [];
        
        for (const test of tests) {
            console.log(`🧪 ${test.name}...`);
            
            try {
                const result = await test.test();
                const success = result && (result.success !== false) && (result.statusCode === 200 || result.statusCode === undefined);
                
                console.log(`${success ? '✅' : '❌'} ${test.name}: ${success ? 'OK' : 'Falhou'}\n`);
                
                results.push({
                    name: test.name,
                    success: success,
                    result: result
                });
                
            } catch (error) {
                console.log(`❌ ${test.name}: Erro - ${error.message}\n`);
                results.push({
                    name: test.name,
                    success: false,
                    error: error.message
                });
            }
        }
        
        const sucessos = results.filter(r => r.success).length;
        console.log(`📊 Resultado: ${sucessos}/${results.length} testes passaram`);
        
        if (sucessos === results.length) {
            console.log('🎉 GitHub está totalmente acessível!');
            console.log('🚀 Pronto para implementar sistema de atualização via GitHub');
        } else {
            console.log('⚠️ Alguns testes falharam - verifique configuração');
        }
        
        return results;
    }
}

// ✅ EXECUTAR SE CHAMADO DIRETAMENTE
if (require.main === module) {
    // Configuração para o novo repositório "demandas"
    const githubUpdater = new GitHubUpdateSystem({
        owner: 'kruetzmann2110', // seu usuário GitHub
        repo: 'demandas', // seu novo repositório
        branch: 'master',
        folder: 'releases'
        // token: 'ghp_xxxxxxxxxxxx' // GitHub token se necessário
    });
    
    // Escolher que teste executar
    const args = process.argv.slice(2);
    
    if (args.includes('--test')) {
        githubUpdater.testarConectividade()
            .then(() => {
                console.log('\n🏁 Teste de conectividade concluído!');
                process.exit(0);
            })
            .catch((error) => {
                console.error('💥 Falha no teste:', error.message);
                process.exit(1);
            });
    } else {
        githubUpdater.verificarEAtualizarSistema()
            .then(updated => {
                if (updated) {
                    console.log('\n🔄 REINICIE O SISTEMA PARA APLICAR AS ATUALIZAÇÕES');
                    process.exit(1);
                } else {
                    console.log('\n✅ Continuando com sistema atual...');
                    process.exit(0);
                }
            })
            .catch(error => {
                console.error('💥 Erro crítico:', error);
                process.exit(0);
            });
    }
}

module.exports = GitHubUpdateSystem;