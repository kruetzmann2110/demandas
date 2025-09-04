// ========================================
// GERADOR DE PACOTE PARA PRODUÇÃO
// Sistema de Demandas Governança TOP v2.0.1
// ========================================

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('📦 GERANDO PACOTE PARA PRODUÇÃO...\n');

class ProductionPackager {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.outputDir = path.join(this.baseDir, 'dist-producao');
        this.zipFile = `sistema-demandas-producao-${this.getTimestamp()}.zip`;
        
        // Lista de arquivos essenciais para produção
        this.arquivosEssenciais = [
            // Arquivos principais
            'startup-with-updates.js',
            'INICIAR-COM-GITHUB.bat',
            'package.json',
            'README.md',
            'version.json',
            
            // Scripts de sistema
            'scripts/github-update-system.js',
            'scripts/corporate-downloader.js',
            'scripts/preparar-producao.js',
            
            // Backend
            'backend/server.js',
            'backend/users-auth.json',
            
            // Frontend
            'web/index.html',
            'web/js/app.js',
            'web/css/style.css',
            
            // Releases e configuração
            'releases/versao.json',
            
            // Scripts de teste e correção
            'TESTAR-CONECTIVIDADE-CORPORATIVA.bat',
            'CORRIGIR-PRODUCAO.bat',
            'INSTALAR-SISTEMA-COMPLETO.bat',
            'diagnostico-producao.js',
            
            // Documentação
            'docs/instalacao.md',
            'SOLUCAO-PRODUCAO.md',
            'SOLUCAO-CORPORATIVA.md',
            
            // Configuração
            '.gitignore'
        ];
        
        // Arquivos opcionais (incluir se existirem)
        this.arquivosOpcionais = [
            'config/database.json',
            'config/auth.json',
            'web/js/dashboard.js',
            'web/css/dashboard.css',
            'scripts/verificar-atualizacoes.js'
        ];
    }
    
    getTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}${month}${day}-${hour}${minute}`;
    }
    
    async criarDiretorioTemp() {
        console.log('📁 Criando diretório temporário...');
        
        if (fs.existsSync(this.outputDir)) {
            this.removerDiretorio(this.outputDir);
        }
        
        fs.mkdirSync(this.outputDir, { recursive: true });
        console.log(`✅ Diretório criado: ${this.outputDir}`);
    }
    
    removerDiretorio(dir) {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file) => {
                const curPath = path.join(dir, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.removerDiretorio(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir);
        }
    }
    
    async copiarArquivos() {
        console.log('\n📋 COPIANDO ARQUIVOS ESSENCIAIS:\n');
        
        let arquivosCopiados = 0;
        let arquivosFaltando = [];
        
        // Copiar arquivos essenciais
        for (const arquivo of this.arquivosEssenciais) {
            const origem = path.join(this.baseDir, arquivo);
            const destino = path.join(this.outputDir, arquivo);
            
            if (fs.existsSync(origem)) {
                // Criar diretório se necessário
                const destinoDir = path.dirname(destino);
                if (!fs.existsSync(destinoDir)) {
                    fs.mkdirSync(destinoDir, { recursive: true });
                }
                
                // Copiar arquivo
                fs.copyFileSync(origem, destino);
                
                const stats = fs.statSync(destino);
                const tamanho = (stats.size / 1024).toFixed(1);
                console.log(`✅ ${arquivo} (${tamanho} KB)`);
                arquivosCopiados++;
                
            } else {
                console.log(`❌ ${arquivo} - NÃO ENCONTRADO`);
                arquivosFaltando.push(arquivo);
            }
        }
        
        // Copiar arquivos opcionais
        console.log('\n📋 COPIANDO ARQUIVOS OPCIONAIS:\n');
        
        for (const arquivo of this.arquivosOpcionais) {
            const origem = path.join(this.baseDir, arquivo);
            const destino = path.join(this.outputDir, arquivo);
            
            if (fs.existsSync(origem)) {
                const destinoDir = path.dirname(destino);
                if (!fs.existsSync(destinoDir)) {
                    fs.mkdirSync(destinoDir, { recursive: true });
                }
                
                fs.copyFileSync(origem, destino);
                
                const stats = fs.statSync(destino);
                const tamanho = (stats.size / 1024).toFixed(1);
                console.log(`✅ ${arquivo} (${tamanho} KB)`);
                arquivosCopiados++;
                
            } else {
                console.log(`⚠️ ${arquivo} - OPCIONAL, NÃO ENCONTRADO`);
            }
        }
        
        return { arquivosCopiados, arquivosFaltando };
    }
    
    async criarArquivoInstalacao() {
        console.log('\n📄 Criando arquivo de instruções de instalação...');
        
        const instrucoes = `
========================================
📦 PACOTE DE PRODUÇÃO - SISTEMA DE DEMANDAS
========================================

🎯 VERSÃO: 2.0.1 - Otimizada para ambiente corporativo
📅 GERADO EM: ${new Date().toLocaleString('pt-BR')}

🚀 INSTALAÇÃO RÁPIDA:

1️⃣ EXTRAIR ARQUIVOS:
   • Extraia todos os arquivos para uma pasta (ex: C:\\SistemaDemandas)

2️⃣ INSTALAR NODE.JS:
   • Baixe e instale Node.js LTS: https://nodejs.org
   • Reinicie o computador após instalação

3️⃣ INSTALAR DEPENDÊNCIAS:
   • Abra CMD na pasta extraída
   • Execute: npm install express mssql

4️⃣ INICIAR SISTEMA:
   • Duplo clique em: INICIAR-COM-GITHUB.bat
   • Ou execute: node startup-with-updates.js

🔧 RESOLUÇÃO DE PROBLEMAS:

• ERRO DE CERTIFICADO SSL:
  - Execute: TESTAR-CONECTIVIDADE-CORPORATIVA.bat
  - O sistema usa fallback automático para curl/PowerShell

• ARQUIVOS FALTANDO:
  - Execute: CORRIGIR-PRODUCAO.bat
  - Ou execute: diagnostico-producao.js

• INSTALAÇÃO COMPLETA:
  - Execute: INSTALAR-SISTEMA-COMPLETO.bat

📋 ARQUIVOS INCLUSOS:

✅ SISTEMA PRINCIPAL:
   • startup-with-updates.js (Sistema de inicialização)
   • INICIAR-COM-GITHUB.bat (Script de início)
   • backend/server.js (Servidor principal)
   • web/* (Interface do usuário)

✅ AUTO-UPDATE:
   • scripts/github-update-system.js (Update padrão)
   • scripts/corporate-downloader.js (Fallback corporativo)
   • releases/versao.json (Controle de versão)

✅ FERRAMENTAS DE SUPORTE:
   • TESTAR-CONECTIVIDADE-CORPORATIVA.bat
   • CORRIGIR-PRODUCAO.bat
   • diagnostico-producao.js
   • INSTALAR-SISTEMA-COMPLETO.bat

✅ DOCUMENTAÇÃO:
   • README.md (Documentação geral)
   • docs/instalacao.md (Guia de instalação)
   • SOLUCAO-CORPORATIVA.md (Ambiente corporativo)

🌐 ACESSO:
   • URL: http://localhost:3000
   • Dashboard: http://localhost:3000/index.html

📞 SUPORTE:
   • Email: fabiano.kruetzmann@telefonica.com
   • GitHub: https://github.com/kruetzmann2110/demandas/issues

========================================
✅ SISTEMA PRONTO PARA PRODUÇÃO!
========================================
`;
        
        const arquivoInstrucoes = path.join(this.outputDir, 'INSTRUCOES-INSTALACAO.txt');
        fs.writeFileSync(arquivoInstrucoes, instrucoes);
        
        console.log(`✅ Instruções criadas: INSTRUCOES-INSTALACAO.txt`);
    }
    
    async criarZip() {
        console.log('\n🗜️ CRIANDO ARQUIVO ZIP...\n');
        
        return new Promise((resolve, reject) => {
            // Tentar usar PowerShell primeiro (mais compatível)
            const psCommand = `powershell -Command "Compress-Archive -Path '${this.outputDir}\\*' -DestinationPath '${path.join(this.baseDir, this.zipFile)}' -Force"`;
            
            exec(psCommand, (error, stdout, stderr) => {
                if (error) {
                    console.log('⚠️ PowerShell falhou, tentando tar...');
                    
                    // Fallback para tar (disponível no Windows 10+)
                    const tarCommand = `tar -czf "${path.join(this.baseDir, this.zipFile)}" -C "${this.outputDir}" .`;
                    
                    exec(tarCommand, (tarError, tarStdout, tarStderr) => {
                        if (tarError) {
                            console.error('❌ Erro ao criar ZIP:', tarError.message);
                            reject(tarError);
                        } else {
                            console.log('✅ ZIP criado com tar!');
                            resolve();
                        }
                    });
                } else {
                    console.log('✅ ZIP criado com PowerShell!');
                    resolve();
                }
            });
        });
    }
    
    async verificarZip() {
        const zipPath = path.join(this.baseDir, this.zipFile);
        
        if (fs.existsSync(zipPath)) {
            const stats = fs.statSync(zipPath);
            const tamanhoMB = (stats.size / 1024 / 1024).toFixed(2);
            
            console.log(`\n📦 ARQUIVO ZIP CRIADO:`);
            console.log(`   📄 Nome: ${this.zipFile}`);
            console.log(`   📂 Local: ${zipPath}`);
            console.log(`   📊 Tamanho: ${tamanhoMB} MB`);
            
            return true;
        } else {
            console.log('\n❌ Arquivo ZIP não foi criado!');
            return false;
        }
    }
    
    async limparTemp() {
        console.log('\n🧹 Limpando arquivos temporários...');
        this.removerDiretorio(this.outputDir);
        console.log('✅ Limpeza concluída');
    }
    
    async gerarPacote() {
        try {
            console.log('========================================');
            console.log('📦 INICIANDO GERAÇÃO DO PACOTE');
            console.log('========================================\n');
            
            // 1. Criar diretório temporário
            await this.criarDiretorioTemp();
            
            // 2. Copiar arquivos
            const { arquivosCopiados, arquivosFaltando } = await this.copiarArquivos();
            
            // 3. Criar instruções
            await this.criarArquivoInstalacao();
            
            // 4. Criar ZIP
            await this.criarZip();
            
            // 5. Verificar resultado
            const zipCriado = await this.verificarZip();
            
            // 6. Limpar temporários
            await this.limparTemp();
            
            // 7. Resumo final
            console.log('\n========================================');
            console.log('🎉 PACOTE DE PRODUÇÃO CONCLUÍDO!');
            console.log('========================================\n');
            
            console.log(`📊 ESTATÍSTICAS:`);
            console.log(`   • Arquivos copiados: ${arquivosCopiados}`);
            console.log(`   • Arquivos faltando: ${arquivosFaltando.length}`);
            
            if (arquivosFaltando.length > 0) {
                console.log(`\n⚠️ ARQUIVOS FALTANDO:`);
                arquivosFaltando.forEach(arquivo => console.log(`   • ${arquivo}`));
            }
            
            if (zipCriado) {
                console.log(`\n✅ PRONTO PARA DISTRIBUIÇÃO!`);
                console.log(`📦 Arquivo: ${this.zipFile}`);
                console.log(`📋 Inclui instruções completas de instalação`);
                console.log(`🏢 Otimizado para ambiente corporativo`);
                console.log(`🔄 Auto-update via GitHub com fallback`);
            } else {
                console.log(`\n❌ FALHA NA CRIAÇÃO DO ZIP`);
                console.log(`📁 Arquivos disponíveis em: ${this.outputDir}`);
            }
            
            console.log(`\n📞 SUPORTE:`);
            console.log(`   📧 fabiano.kruetzmann@telefonica.com`);
            console.log(`   🐛 https://github.com/kruetzmann2110/demandas/issues`);
            
        } catch (error) {
            console.error('\n💥 ERRO DURANTE GERAÇÃO:', error.message);
            console.log('\n🔧 AÇÕES POSSÍVEIS:');
            console.log('   1. Verificar se todos os arquivos existem');
            console.log('   2. Executar como Administrador');
            console.log('   3. Verificar espaço em disco');
            console.log('   4. Tentar novamente');
        }
    }
}

// ✅ EXECUTAR SE CHAMADO DIRETAMENTE
if (require.main === module) {
    const packager = new ProductionPackager();
    packager.gerarPacote()
        .then(() => {
            console.log('\n🏁 Processamento concluído!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Falha crítica:', error.message);
            process.exit(1);
        });
}

module.exports = ProductionPackager;