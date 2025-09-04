// ========================================
// PREPARAR ARQUIVOS PARA GITHUB
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const fs = require('fs');
const path = require('path');

console.log('📦 PREPARANDO ARQUIVOS PARA GITHUB...\n');

/**
 * Criar estrutura de releases no GitHub
 */
function prepararEstrutura() {
    const baseDir = __dirname;
    
    // Arquivos que devem ir para a pasta "releases" no GitHub
    const arquivosRelease = [
        {
            origem: path.join(baseDir, 'version.json'),
            destino: 'releases/versao.json'
        },
        {
            origem: path.join(baseDir, 'backend', 'server.js'),
            destino: 'releases/backend/server.js'
        },
        {
            origem: path.join(baseDir, 'web', 'js', 'app.js'),
            destino: 'releases/web/js/app.js'
        },
        {
            origem: path.join(baseDir, 'web', 'css', 'style.css'),
            destino: 'releases/web/css/style.css'
        },
        {
            origem: path.join(baseDir, 'web', 'index.html'),
            destino: 'releases/web/index.html'
        }
    ];

    console.log('📋 ESTRUTURA DE ARQUIVOS PARA O GITHUB:\n');
    console.log('📁 Repositório: kruetzmann2110/demandas');
    console.log('🌿 Branch: main');
    console.log('📂 Estrutura necessária:\n');

    console.log('demandas/');
    console.log('├── README.md');
    console.log('├── releases/');
    console.log('│   ├── versao.json');
    console.log('│   ├── backend/');
    console.log('│   │   └── server.js');
    console.log('│   └── web/');
    console.log('│       ├── js/');
    console.log('│       │   └── app.js');
    console.log('│       ├── css/');
    console.log('│       │   └── style.css');
    console.log('│       └── index.html');
    console.log('└── docs/');
    console.log('    └── instalacao.md\n');

    console.log('📄 CONTEÚDO DOS ARQUIVOS:\n');

    // Verificar e mostrar arquivos
    arquivosRelease.forEach(arquivo => {
        if (fs.existsSync(arquivo.origem)) {
            const stats = fs.statSync(arquivo.origem);
            const tamanho = (stats.size / 1024).toFixed(1);
            console.log(`✅ ${arquivo.destino} (${tamanho} KB)`);
        } else {
            console.log(`❌ ${arquivo.destino} - ARQUIVO NÃO ENCONTRADO`);
        }
    });

    return arquivosRelease;
}

/**
 * Criar arquivo README.md para o repositório
 */
function criarReadme() {
    const readmeContent = `# Sistema de Demandas Governança TOP

🏢 **Sistema de gestão de demandas com auto-atualização via GitHub**

## 📋 Descrição

Sistema Node.js para gestão de demandas empresariais com:
- ✅ Dashboard moderno e interativo
- 📊 Ranking por categorias
- 📈 Timeline de atividades
- 🔄 Auto-atualização via GitHub
- 📱 Interface responsiva

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+ instalado
- Acesso ao SQL Server (configurado)

### Passos de Instalação

1. **Baixar o sistema**
   \`\`\`bash
   git clone https://github.com/kruetzmann2110/demandas.git
   cd demandas
   \`\`\`

2. **Instalar dependências**
   \`\`\`bash
   npm install express mssql
   \`\`\`

3. **Configurar banco de dados**
   - Editar \`backend/server.js\` com suas credenciais SQL Server

4. **Iniciar sistema**
   - Execute: \`INICIAR-COM-GITHUB.bat\`
   - Ou: \`node startup-with-updates.js\`

## 🔄 Auto-Atualização

O sistema verifica automaticamente por atualizações neste repositório GitHub a cada inicialização.

### Estrutura de Releases

Os arquivos de atualização ficam na pasta \`releases/\`:
- \`releases/versao.json\` - Informações da versão
- \`releases/backend/\` - Arquivos do servidor
- \`releases/web/\` - Arquivos do frontend

### Versão Atual

**v2.0.0** - Sistema completo com dashboard e auto-update

## 📊 Funcionalidades

- 📝 **Gestão de Demandas**: Criar, editar e acompanhar demandas
- 📈 **Dashboard**: Gráficos e métricas em tempo real
- 🏆 **Rankings**: Classificação por categorias (Op1, Ql2, An3...)
- 📅 **Timeline**: Histórico completo de atividades
- 📤 **Export**: Exportação para Excel
- 🔐 **Segurança**: Autenticação e controle de acesso

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Banco**: SQL Server
- **Auto-Update**: GitHub API

## 📞 Suporte

Para suporte técnico ou dúvidas:
- 📧 Email: [seu-email]
- 🐛 Issues: Abra uma issue neste repositório

---

🔄 **Auto-update ativo** - O sistema se atualiza automaticamente a partir deste repositório.
`;

    console.log('\n📄 CONTEÚDO DO README.md:\n');
    console.log('=' .repeat(50));
    console.log(readmeContent);
    console.log('=' .repeat(50));

    return readmeContent;
}

/**
 * Mostrar comandos git necessários
 */
function mostrarComandosGit() {
    console.log('\n🔧 COMANDOS PARA CONFIGURAR O REPOSITÓRIO:\n');
    
    console.log('1️⃣ INICIALIZAR E ENVIAR PRIMEIRA VERSÃO:');
    console.log('git init');
    console.log('git add .');
    console.log('git commit -m "Initial commit - Sistema de Demandas v2.0.0"');
    console.log('git branch -M main');
    console.log('git remote add origin https://github.com/kruetzmann2110/demandas.git');
    console.log('git push -u origin main');
    
    console.log('\n2️⃣ PARA FUTURAS ATUALIZAÇÕES:');
    console.log('git add .');
    console.log('git commit -m "Update v2.0.1 - [descrição das mudanças]"');
    console.log('git push');

    console.log('\n3️⃣ ESTRUTURA DE PASTAS NO GITHUB:');
    console.log('📁 Criar essas pastas no seu repositório:');
    console.log('   • releases/');
    console.log('   • releases/backend/');
    console.log('   • releases/web/js/');
    console.log('   • releases/web/css/');
    console.log('   • docs/');
}

/**
 * Criar arquivo versao.json para o releases
 */
function criarVersaoJson() {
    const versaoContent = {
        version: "2.0.0",
        updated_at: new Date().toISOString(),
        changelog: "Versão inicial com Dashboard, ranking por categoria, timezone corrigido e auto-update via GitHub",
        components: {
            backend: {
                version: "2.0.0",
                last_update: new Date().toISOString(),
                changes: ["Auto-update GitHub", "Timezone corrigido", "API categoria"]
            },
            frontend: {
                version: "2.0.0", 
                last_update: new Date().toISOString(),
                changes: ["Dashboard moderno", "Ranking por categoria", "Export Excel", "Gráficos interativos"]
            }
        },
        requirements: {
            node_version: ">=16.0.0",
            database: "SQL Server com tabela demands atualizada",
            dependencies: ["express", "mssql"]
        },
        repository: {
            owner: "kruetzmann2110",
            repo: "demandas",
            branch: "main",
            folder: "releases"
        }
    };

    console.log('\n📄 CONTEÚDO DO releases/versao.json:\n');
    console.log('=' .repeat(50));
    console.log(JSON.stringify(versaoContent, null, 2));
    console.log('=' .repeat(50));

    return versaoContent;
}

// ✅ EXECUTAR PREPARAÇÃO
if (require.main === module) {
    console.log('========================================');
    console.log('📦 PREPARAÇÃO PARA GITHUB');
    console.log('========================================\n');

    try {
        // 1. Verificar estrutura de arquivos
        const arquivos = prepararEstrutura();

        // 2. Mostrar README.md
        const readme = criarReadme();

        // 3. Mostrar versao.json
        const versao = criarVersaoJson();

        // 4. Mostrar comandos git
        mostrarComandosGit();

        console.log('\n✅ PREPARAÇÃO CONCLUÍDA!');
        console.log('\n📋 PRÓXIMOS PASSOS:');
        console.log('1. Criar as pastas no GitHub conforme mostrado acima');
        console.log('2. Fazer upload dos arquivos para as respectivas pastas');
        console.log('3. Testar com: node startup-with-updates.js --test');
        console.log('4. Iniciar sistema: INICIAR-COM-GITHUB.bat');

    } catch (error) {
        console.error('❌ Erro na preparação:', error.message);
        process.exit(1);
    }
}

module.exports = { prepararEstrutura, criarReadme, criarVersaoJson };