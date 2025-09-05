// TESTE RÁPIDO PARA VERIFICAR SE O BACKEND ESTÁ SERVINDO O INDEX.HTML CORRETO
// Execute este arquivo para testar se o server 1.js está funcionando corretamente

const http = require('http');
const path = require('path');

console.log('🔍 TESTANDO BACKEND DE PRODUÇÃO...');

// Testar se o servidor responde
const testServer = () => {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`📡 Status Code: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('📝 Verificando conteúdo da resposta...');
            
            // Verificar se contém o título correto
            if (data.includes('[BRANCH MASTER v3.0.2]')) {
                console.log('✅ SUCCESS: Título atualizado encontrado!');
                console.log('✅ O backend ESTÁ servindo o index.html correto da pasta web/');
            } else if (data.includes('Gestão de Demandas')) {
                console.log('⚠️  WARNING: HTML encontrado, mas sem título atualizado');
                console.log('⚠️  Pode ser cache do navegador ou arquivo não atualizado');
            } else {
                console.log('❌ ERROR: Resposta não contém HTML esperado');
                console.log('❌ Primeiro conteúdo:', data.substring(0, 200));
            }
        });
    });

    req.on('error', (err) => {
        console.log('❌ ERRO: Servidor não está rodando ou não responde');
        console.log('❌ Erro:', err.message);
        console.log('💡 Execute: node "server 1.js" para iniciar o servidor');
    });

    req.end();
};

// Executar teste
testServer();
