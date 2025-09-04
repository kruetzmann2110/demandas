// ========================================
// SERVIDOR MOCK SHAREPOINT PARA TESTES
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// ✅ CONFIGURAR CORS E MIDDLEWARE
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ✅ CRIAR ARQUIVOS MOCK PARA TESTE
const MOCK_FILES = {
    'versao.json': {
        version: "2.1.0",
        updated_at: new Date().toISOString(),
        changelog: "Versão de teste com melhorias de performance e correções de bugs",
        components: {
            backend: {
                version: "2.1.0",
                changes: ["Correção de timeout", "Melhor tratamento de erros"]
            },
            frontend: {
                version: "2.1.0", 
                changes: ["Interface responsiva", "Novos gráficos"]
            }
        }
    },
    
    'backend/server.js': `// ========================================
// SERVIDOR BACKEND ATUALIZADO - VERSÃO MOCK 2.1.0
// ========================================

const express = require('express');
const app = express();

// NOVA FUNCIONALIDADE MOCK
console.log('🚀 Servidor Mock v2.1.0 iniciado!');
console.log('✨ Novas features: timeout melhorado, logs detalhados');

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        mock: true
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`🌐 Servidor rodando na porta \${PORT}\`);
});`,

    'frontend/app.js': `// ========================================
// APLICAÇÃO FRONTEND ATUALIZADA - VERSÃO MOCK 2.1.0
// ========================================

console.log('🎨 Frontend Mock v2.1.0 carregado!');

// NOVA FUNCIONALIDADE MOCK
class DashboardManager {
    constructor() {
        this.version = '2.1.0';
        this.features = ['responsive-design', 'dark-mode', 'real-time-updates'];
        console.log('✨ Dashboard Manager inicializado com novas features:', this.features);
    }
    
    init() {
        console.log('🚀 Iniciando dashboard mock...');
        this.loadMockData();
    }
    
    loadMockData() {
        console.log('📊 Carregando dados mock...');
        // Simular carregamento de dados
        setTimeout(() => {
            console.log('✅ Dados mock carregados com sucesso!');
        }, 1000);
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
    dashboard.init();
});`,

    'frontend/style.css': `/* ========================================
   ESTILOS CSS ATUALIZADOS - VERSÃO MOCK 2.1.0
   ======================================== */

:root {
    --primary-color: #0078d4;
    --secondary-color: #106ebe;
    --success-color: #107c10;
    --warning-color: #ff8c00;
    --error-color: #d83b01;
    --background-color: #f3f2f1;
    --text-color: #323130;
    --border-radius: 8px;
    --box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* NOVO: Tema escuro */
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: #1b1a19;
        --text-color: #ffffff;
    }
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0;
    padding: 20px;
    line-height: 1.6;
}

/* NOVO: Container responsivo */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* NOVO: Cards modernos */
.card {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: 20px;
    margin-bottom: 20px;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}

/* NOVO: Botões atualizados */
.btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
}

.btn:hover {
    background: var(--secondary-color);
    transform: translateY(-1px);
}

/* NOVO: Indicador de versão */
.version-indicator {
    position: fixed;
    top: 10px;
    right: 10px;
    background: var(--success-color);
    color: white;
    padding: 5px 10px;
    border-radius: var(--border-radius);
    font-size: 12px;
    font-weight: 600;
}

.version-indicator::before {
    content: "v2.1.0 Mock";
}`,

    'frontend/index.html': `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Demandas - v2.1.0 Mock</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="version-indicator"></div>
    
    <div class="container">
        <header>
            <h1>🎯 Sistema de Demandas Governança TOP</h1>
            <p>Versão 2.1.0 - Mock para Testes de Atualização</p>
        </header>
        
        <main>
            <div class="card">
                <h2>✨ Novidades desta Versão</h2>
                <ul>
                    <li>🎨 Interface responsiva e moderna</li>
                    <li>🌙 Suporte a tema escuro automático</li>
                    <li>📊 Novos gráficos interativos</li>
                    <li>⚡ Performance otimizada</li>
                    <li>🔧 Correções de bugs</li>
                </ul>
            </div>
            
            <div class="card">
                <h2>🧪 Status dos Testes</h2>
                <p id="test-status">Carregando testes...</p>
                <button class="btn" onclick="runTests()">🚀 Executar Testes</button>
            </div>
            
            <div class="card">
                <h2>📋 Informações do Sistema</h2>
                <p><strong>Versão:</strong> 2.1.0 Mock</p>
                <p><strong>Ambiente:</strong> Teste</p>
                <p><strong>Última Atualização:</strong> <span id="last-update"></span></p>
            </div>
        </main>
    </div>
    
    <script src="js/app.js"></script>
    <script>
        // Atualizar timestamp
        document.getElementById('last-update').textContent = new Date().toLocaleString('pt-BR');
        
        // Função de teste
        function runTests() {
            const status = document.getElementById('test-status');
            status.innerHTML = '🔄 Executando testes...';
            
            setTimeout(() => {
                status.innerHTML = '✅ Todos os testes passaram!<br>📡 Conexão SharePoint: OK<br>📁 Download de arquivos: OK<br>🔄 Atualização: Simulada com sucesso';
            }, 2000);
        }
    </script>
</body>
</html>`
};

// ✅ ROTAS PARA SIMULAR SHAREPOINT
app.get('/Demandas/:file(*)', (req, res) => {
    const fileName = req.params.file;
    console.log(`📁 Solicitação para arquivo: ${fileName}`);
    
    if (MOCK_FILES[fileName]) {
        const content = typeof MOCK_FILES[fileName] === 'string' 
            ? MOCK_FILES[fileName] 
            : JSON.stringify(MOCK_FILES[fileName], null, 2);
            
        // Definir content-type apropriado
        if (fileName.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        } else if (fileName.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (fileName.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (fileName.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
        
        console.log(`✅ Enviando arquivo: ${fileName} (${content.length} bytes)`);
        res.send(content);
    } else {
        console.log(`❌ Arquivo não encontrado: ${fileName}`);
        res.status(404).json({ 
            error: 'Arquivo não encontrado',
            available_files: Object.keys(MOCK_FILES)
        });
    }
});

// ✅ ROTA DE STATUS
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        message: 'Mock SharePoint Server rodando',
        available_files: Object.keys(MOCK_FILES),
        version: '2.1.0',
        timestamp: new Date().toISOString()
    });
});

// ✅ ROTA PARA LISTAR ARQUIVOS
app.get('/files', (req, res) => {
    res.json({
        files: Object.keys(MOCK_FILES),
        base_url: `http://localhost:${PORT}/Demandas/`,
        note: 'Este é um servidor mock para testes'
    });
});

// ✅ INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🖥️  MOCK SHAREPOINT SERVER INICIADO`);
    console.log(`========================================`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📋 Status: http://localhost:${PORT}/status`);
    console.log(`📁 Arquivos: http://localhost:${PORT}/files`);
    console.log(`🔗 Base SharePoint Mock: http://localhost:${PORT}/Demandas/`);
    console.log(`\n✅ Servidor pronto para testes de atualização!`);
    console.log(`\n💡 Para testar:`);
    console.log(`   1. Execute: node test-sharepoint-connection.js`);
    console.log(`   2. Modifique verificar-atualizacoes.js para usar localhost`);
    console.log(`   3. Execute o script de atualização`);
    console.log(`========================================\n`);
});

module.exports = app;