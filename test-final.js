// TESTE FINAL - VERIFICAR SE O TÍTULO CORRETO ESTÁ SENDO SERVIDO
const http = require('http');

console.log('🔍 TESTE FINAL - Verificando título após reinício do servidor...');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    headers: {
        'User-Agent': 'Node.js Test Client - Cache Killer',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
};

const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('\n🔍 VERIFICANDO TÍTULO...');
        
        const titleMatch = data.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
            const title = titleMatch[1];
            console.log(`📋 Título encontrado: "${title}"`);
            
            if (title.includes('[BRANCH MASTER v3.0.2 - ANTI-CACHE]')) {
                console.log('✅ SUCCESS: Título CORRETO com anti-cache!');
            } else if (title.includes('[BRANCH MASTER v3.0.2]')) {
                console.log('✅ SUCCESS: Título CORRETO!');
            } else {
                console.log('❌ ERRO: Título ainda incorreto');
            }
        } else {
            console.log('❌ ERRO: Título não encontrado');
        }
        
        console.log('\n📏 Informações do arquivo:');
        console.log(`   Tamanho: ${data.length} bytes`);
        console.log(`   Data de modificação: ${res.headers['last-modified']}`);
        console.log(`   ETag: ${res.headers['etag']}`);
    });
});

req.on('error', (err) => {
    console.log('❌ ERRO:', err.message);
});

req.setTimeout(5000, () => {
    console.log('⏰ Timeout');
    req.destroy();
});

req.end();
