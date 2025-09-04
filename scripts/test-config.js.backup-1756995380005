// ========================================
// CONFIGURAÇÕES DE TESTE PARA SHAREPOINT
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

module.exports = {
    // ✅ CONFIGURAÇÃO DE AMBIENTE
    ENVIRONMENT: {
        // Altere para 'PRODUCTION' para usar SharePoint real
        // Altere para 'TEST' para usar servidor mock local
        MODE: 'TEST', // 'PRODUCTION' | 'TEST'
        
        // Configurações por ambiente
        PRODUCTION: {
            BASE_URL: 'https://telefonicacorp.sharepoint.com/sites/ESCALONAMENTO_TOP_SIGITM.TMBNL/Shared%20Documents/Demandas',
            TIMEOUT: 30000,
            DESCRIPTION: 'SharePoint real da Telefônica'
        },
        
        TEST: {
            BASE_URL: 'http://localhost:3001/Demandas',
            TIMEOUT: 10000,
            DESCRIPTION: 'Servidor mock local para testes'
        }
    },
    
    // ✅ ARQUIVOS PARA VERIFICAÇÃO
    FILES_TO_CHECK: {
        'versao.json': 'versao.json',
        'backend/server.js': 'backend/server.js',
        'web/js/app.js': 'frontend/app.js',
        'web/css/style.css': 'frontend/style.css',
        'web/index.html': 'frontend/index.html'
    },
    
    // ✅ CONFIGURAÇÕES DE TESTE
    TEST_SETTINGS: {
        // Criar backups durante testes
        CREATE_BACKUPS: true,
        
        // Diretório para arquivos de teste
        TEST_DIR: './test-downloads',
        
        // Salvar logs detalhados
        DETAILED_LOGGING: true,
        
        // Simular falhas para testes
        SIMULATE_FAILURES: false
    },
    
    // ✅ FUNÇÃO PARA OBTER CONFIGURAÇÃO ATUAL
    getCurrentConfig() {
        const mode = this.ENVIRONMENT.MODE;
        const config = this.ENVIRONMENT[mode];
        
        if (!config) {
            throw new Error(`Modo de ambiente inválido: ${mode}`);
        }
        
        return {
            ...config,
            mode: mode,
            files: this.FILES_TO_CHECK,
            test: this.TEST_SETTINGS
        };
    },
    
    // ✅ FUNÇÃO PARA ALTERNAR MODO
    setMode(mode) {
        if (!['PRODUCTION', 'TEST'].includes(mode)) {
            throw new Error(`Modo inválido: ${mode}. Use 'PRODUCTION' ou 'TEST'`);
        }
        this.ENVIRONMENT.MODE = mode;
        console.log(`🔄 Modo alterado para: ${mode}`);
        return this.getCurrentConfig();
    },
    
    // ✅ FUNÇÃO PARA VALIDAR CONFIGURAÇÃO
    validate() {
        const config = this.getCurrentConfig();
        const issues = [];
        
        // Verificar URL base
        if (!config.BASE_URL) {
            issues.push('BASE_URL não definida');
        }
        
        // Verificar timeout
        if (!config.TIMEOUT || config.TIMEOUT < 1000) {
            issues.push('TIMEOUT deve ser >= 1000ms');
        }
        
        // Verificar arquivos
        if (!this.FILES_TO_CHECK || Object.keys(this.FILES_TO_CHECK).length === 0) {
            issues.push('Nenhum arquivo definido para verificação');
        }
        
        return {
            valid: issues.length === 0,
            issues: issues,
            config: config
        };
    },
    
    // ✅ FUNÇÃO PARA GERAR RELATÓRIO
    getReport() {
        const config = this.getCurrentConfig();
        const validation = this.validate();
        
        console.log('========================================');
        console.log('📋 RELATÓRIO DE CONFIGURAÇÃO DE TESTE');
        console.log('========================================');
        console.log(`🌍 Modo atual: ${config.mode}`);
        console.log(`🔗 URL base: ${config.BASE_URL}`);
        console.log(`⏱️ Timeout: ${config.TIMEOUT}ms`);
        console.log(`📁 Arquivos para verificar: ${Object.keys(this.FILES_TO_CHECK).length}`);
        console.log(`✅ Configuração válida: ${validation.valid ? 'Sim' : 'Não'}`);
        
        if (!validation.valid) {
            console.log('❌ Problemas encontrados:');
            validation.issues.forEach(issue => console.log(`   • ${issue}`));
        }
        
        console.log('========================================');
        
        return {
            config,
            validation
        };
    }
};