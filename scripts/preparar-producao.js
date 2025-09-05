// ========================================
// PREPARAR PACOTE DE DISTRIBUIÇÃO PARA PRODUÇÃO
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const fs = require('fs');
const path = require('path');

// Verificar se está rodando no ambiente de produção
const isProduction = process.argv.includes('--production') || 
                   process.cwd().toLowerCase().includes('producao') ||
                   process.cwd().toLowerCase().includes('production');

if (isProduction) {
    console.log('🏭 MODO PRODUÇÃO - Verificando arquivos instalados...\n');
} else {
    console.log('📦 PREPARANDO PACOTE DE DISTRIBUIÇÃO PARA PRODUÇÃO...\n');
}

// Lista de arquivos obrigatórios para funcionamento em produção
const arquivosObrigatorios = [
    'startup-with-updates.js',
    'INICIAR-COM-GITHUB.bat',
    'package.json',
    'README.md',
    'version.json',
    'backend/server.js',
    'backend/users-auth.json',
    'web/index.html',
    'web/js/app.js',
    'web/css/style.css',
    'scripts/github-update-system.js'
];

// Verificar se todos os arquivos existem
console.log('🔍 VERIFICANDO ARQUIVOS OBRIGATÓRIOS:\n');

const arquivosFaltando = [];
const arquivosPresentes = [];

arquivosObrigatorios.forEach(arquivo => {
    const caminhoCompleto = isProduction ? 
        path.join(process.cwd(), arquivo) : 
        path.join(__dirname, '..', arquivo);
        
    if (fs.existsSync(caminhoCompleto)) {
        const stats = fs.statSync(caminhoCompleto);
        const tamanho = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${arquivo} (${tamanho} KB)`);
        arquivosPresentes.push(arquivo);
    } else {
        console.log(`❌ ${arquivo} - ARQUIVO NÃO ENCONTRADO`);
        arquivosFaltando.push(arquivo);
    }
});

console.log(`\n📊 RESUMO:`);
console.log(`✅ Arquivos presentes: ${arquivosPresentes.length}`);
console.log(`❌ Arquivos faltando: ${arquivosFaltando.length}`);

if (arquivosFaltando.length > 0) {
    console.log(`\n🚨 ATENÇÃO: Arquivos obrigatórios estão faltando!`);
    console.log(`📋 Arquivos que precisam ser copiados:`);
    arquivosFaltando.forEach(arquivo => console.log(`   • ${arquivo}`));
    
    if (isProduction) {
        console.log('\n🚨 ERRO CRÍTICO EM PRODUÇÃO!');
        console.log('\n🔧 SOLUÇÕES IMEDIATAS:');
        console.log('   1. Baixe o instalador completo:');
        console.log('      https://raw.githubusercontent.com/kruetzmann2110/demandas/main/INSTALAR-SISTEMA-COMPLETO.bat');
        console.log('   2. OU copie manualmente do ambiente de desenvolvimento');
        console.log('   3. OU execute: git clone https://github.com/kruetzmann2110/demandas.git .');
        console.log('\n📞 SUPORTE: fabiano.kruetzmann@telefonica.com');
    }
} else if (isProduction) {
    console.log('\n✅ TODOS OS ARQUIVOS ESSENCIAIS ENCONTRADOS!');
    console.log('🏭 Sistema de produção está completo!');
    
    // Verificar dependências em produção
    console.log('\n🔍 Verificando dependências...');
    try {
        require('express');
        console.log('✅ Express instalado');
    } catch (error) {
        console.log('❌ Express não encontrado - Execute: npm install express');
    }
    
    try {
        require('mssql');
        console.log('✅ MSSQL instalado');
    } catch (error) {
        console.log('❌ MSSQL não encontrado - Execute: npm install mssql');
    }
}

// Criar instruções de instalação
const instrucoes = `
========================================
📋 INSTRUÇÕES DE INSTALAÇÃO EM PRODUÇÃO
========================================

📂 ARQUIVOS OBRIGATÓRIOS:
${arquivosObrigatorios.map(arquivo => `   • ${arquivo}`).join('\n')}

🚀 PASSOS PARA INSTALAÇÃO:

1️⃣ CRIAR PASTA DE PRODUÇÃO:
   • Criar pasta: C:\\SistemaDemandas (ou local de sua escolha)

2️⃣ COPIAR ARQUIVOS:
   • Baixar do GitHub: https://github.com/kruetzmann2110/demandas
   • Ou copiar os arquivos listados acima da pasta de desenvolvimento

3️⃣ INSTALAR DEPENDÊNCIAS:
   • Abrir CMD na pasta de produção
   • Executar: npm install express mssql

4️⃣ EXECUTAR SISTEMA:
   • Duplo clique em: INICIAR-COM-GITHUB.bat
   • Ou executar: node startup-with-updates.js

🔧 VERIFICAÇÃO:
   • Testar conectividade: node startup-with-updates.js --test
   • Verificar arquivos: dir (deve mostrar todos os arquivos listados)

⚠️ PROBLEMAS COMUNS:
   • "Cannot find module": Arquivo startup-with-updates.js não foi copiado
   • "npm install failed": Node.js não instalado ou versão antiga
   • "GitHub connection failed": Verificar conexão com internet

📞 SUPORTE:
   • GitHub: https://github.com/kruetzmann2110/demandas/issues
   • Email: fabiano.kruetzmann@telefonica.com

========================================
`;

console.log(instrucoes);

// Salvar instruções em arquivo
const arquivoInstrucoes = path.join(__dirname, 'INSTRUCOES-PRODUCAO.txt');
fs.writeFileSync(arquivoInstrucoes, instrucoes);
console.log(`📄 Instruções salvas em: ${arquivoInstrucoes}`);

// Verificar se package.json existe e tem as dependências corretas
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log(`\n📦 DEPENDÊNCIAS NO PACKAGE.JSON:`);
        
        if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach(dep => {
                console.log(`   • ${dep}: ${packageJson.dependencies[dep]}`);
            });
        } else {
            console.log(`⚠️ Nenhuma dependência encontrada no package.json`);
            console.log(`📝 Adicionando dependências obrigatórias...`);
            
            packageJson.dependencies = {
                "express": "^4.18.2",
                "mssql": "^9.1.1"
            };
            
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log(`✅ Dependências adicionadas ao package.json`);
        }
    } catch (error) {
        console.error(`❌ Erro ao ler package.json:`, error.message);
    }
}

console.log(`\n🎯 PRÓXIMOS PASSOS PARA RESOLVER O PROBLEMA:`);
console.log(`1. Verificar se a pasta de produção tem TODOS os arquivos listados acima`);
console.log(`2. Executar 'npm install express mssql' na pasta de produção`);
console.log(`3. Testar com: node startup-with-updates.js --test`);
console.log(`4. Se tudo OK, usar: INICIAR-COM-GITHUB.bat`);

console.log(`\n✅ PREPARAÇÃO CONCLUÍDA!`);