// ========================================
// SISTEMA DE FALLBACK PARA DOWNLOAD EM AMBIENTE CORPORATIVO
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class CorporateDownloader {
    constructor() {
        this.baseUrl = 'https://raw.githubusercontent.com/kruetzmann2110/demandas/main';
    }

    /**
     * Tentar download usando curl (funciona melhor em ambientes corporativos)
     */
    async downloadWithCurl(filePath, localPath) {
        return new Promise((resolve) => {
            const url = `${this.baseUrl}/${filePath}`;
            console.log(`🔄 Tentando download via curl: ${url}`);
            
            const curlCommand = `curl -k -L -o "${localPath}" "${url}"`;
            
            exec(curlCommand, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ Curl falhou: ${error.message}`);
                    resolve({ success: false, error: error.message });
                    return;
                }
                
                if (fs.existsSync(localPath)) {
                    const stats = fs.statSync(localPath);
                    if (stats.size > 0) {
                        console.log(`✅ Download via curl sucesso: ${localPath} (${stats.size} bytes)`);
                        resolve({ success: true, size: stats.size });
                    } else {
                        console.log(`❌ Arquivo vazio: ${localPath}`);
                        resolve({ success: false, error: 'Arquivo vazio' });
                    }
                } else {
                    console.log(`❌ Arquivo não criado: ${localPath}`);
                    resolve({ success: false, error: 'Arquivo não criado' });
                }
            });
        });
    }

    /**
     * Tentar download usando PowerShell (alternativa ao curl)
     */
    async downloadWithPowerShell(filePath, localPath) {
        return new Promise((resolve) => {
            const url = `${this.baseUrl}/${filePath}`;
            console.log(`🔄 Tentando download via PowerShell: ${url}`);
            
            // PowerShell com configuração para ignorar certificados SSL
            const psCommand = `powershell -Command "
                [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true};
                [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;
                try {
                    Invoke-WebRequest -Uri '${url}' -OutFile '${localPath}' -UseBasicParsing;
                    Write-Host 'Download concluído';
                } catch {
                    Write-Host 'Erro:' $_.Exception.Message;
                    exit 1;
                }"`;
            
            exec(psCommand, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ PowerShell falhou: ${error.message}`);
                    resolve({ success: false, error: error.message });
                    return;
                }
                
                if (fs.existsSync(localPath)) {
                    const stats = fs.statSync(localPath);
                    if (stats.size > 0) {
                        console.log(`✅ Download via PowerShell sucesso: ${localPath} (${stats.size} bytes)`);
                        resolve({ success: true, size: stats.size });
                    } else {
                        console.log(`❌ Arquivo vazio: ${localPath}`);
                        resolve({ success: false, error: 'Arquivo vazio' });
                    }
                } else {
                    console.log(`❌ Arquivo não criado: ${localPath}`);
                    resolve({ success: false, error: 'Arquivo não criado' });
                }
            });
        });
    }

    /**
     * Verificar versão usando múltiplos métodos
     */
    async verificarVersaoGitHub() {
        console.log('🔍 Verificando versão no GitHub (modo corporativo)...');
        
        const tempFile = path.join(__dirname, 'temp-versao.json');
        
        // Tentar curl primeiro
        let result = await this.downloadWithCurl('releases/versao.json', tempFile);
        
        if (!result.success) {
            console.log('⚠️ Curl falhou, tentando PowerShell...');
            result = await this.downloadWithPowerShell('releases/versao.json', tempFile);
        }
        
        if (result.success) {
            try {
                const content = fs.readFileSync(tempFile, 'utf8');
                const versaoData = JSON.parse(content);
                
                // Limpar arquivo temporário
                fs.unlinkSync(tempFile);
                
                console.log(`📋 Versão GitHub: ${versaoData.version}`);
                console.log(`📅 Atualização: ${versaoData.updated_at}`);
                
                return versaoData;
            } catch (parseError) {
                console.error(`❌ Erro ao fazer parse do JSON: ${parseError.message}`);
                
                // Limpar arquivo temporário mesmo em caso de erro
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
                
                return null;
            }
        } else {
            console.log('⚠️ Todos os métodos de download falharam');
            return null;
        }
    }

    /**
     * Testar conectividade usando diferentes métodos
     */
    async testarConectividade() {
        console.log('========================================');
        console.log('🧪 TESTE DE CONECTIVIDADE CORPORATIVA');
        console.log('========================================\n');
        
        const testes = [
            {
                nome: 'Curl disponível',
                teste: () => new Promise(resolve => {
                    exec('curl --version', (error) => {
                        resolve({ success: !error });
                    });
                })
            },
            {
                nome: 'PowerShell disponível',
                teste: () => new Promise(resolve => {
                    exec('powershell -Command "Get-Host"', (error) => {
                        resolve({ success: !error });
                    });
                })
            },
            {
                nome: 'Download via curl',
                teste: () => this.downloadWithCurl('releases/versao.json', path.join(__dirname, 'test-curl.json'))
            },
            {
                nome: 'Download via PowerShell',
                teste: () => this.downloadWithPowerShell('releases/versao.json', path.join(__dirname, 'test-ps.json'))
            }
        ];
        
        for (const teste of testes) {
            console.log(`🧪 ${teste.nome}...`);
            
            try {
                const resultado = await teste.teste();
                const sucesso = resultado && resultado.success;
                
                console.log(`${sucesso ? '✅' : '❌'} ${teste.nome}: ${sucesso ? 'OK' : 'Falhou'}\n`);
                
                // Limpar arquivos de teste
                const testFiles = ['test-curl.json', 'test-ps.json'];
                testFiles.forEach(file => {
                    const fullPath = path.join(__dirname, file);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                });
                
            } catch (error) {
                console.log(`❌ ${teste.nome}: Erro - ${error.message}\n`);
            }
        }
        
        console.log('📊 Teste de conectividade concluído');
        console.log('💡 Se todos falharam, o GitHub pode estar bloqueado pela rede corporativa');
    }
}

module.exports = CorporateDownloader;

// ✅ EXECUTAR SE CHAMADO DIRETAMENTE
if (require.main === module) {
    const downloader = new CorporateDownloader();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--test')) {
        downloader.testarConectividade()
            .then(() => {
                console.log('\n🏁 Teste concluído!');
                process.exit(0);
            })
            .catch((error) => {
                console.error('💥 Falha no teste:', error.message);
                process.exit(1);
            });
    } else {
        downloader.verificarVersaoGitHub()
            .then(versao => {
                if (versao) {
                    console.log('\n✅ Versão obtida com sucesso:', versao.version);
                } else {
                    console.log('\n⚠️ Não foi possível obter a versão');
                }
                process.exit(0);
            })
            .catch(error => {
                console.error('💥 Erro:', error);
                process.exit(1);
            });
    }
}