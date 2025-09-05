// TESTE COMPLETO PARA VERIFICAR SE O SERVIDOR ESTÁ SERVINDO O ARQUIVO CORRETO
// Este script vai fazer uma requisição HTTP e verificar o conteúdo exato

const http = require('http');

console.log('🔍 DIAGNÓSTICO COMPLETO - Verificando servidor de produção...');

function testHttpRequest(port, path = '/') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'Node.js Test Client',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        };

        const req = http.request(options, (res) => {
            console.log(`📡 [PORTA ${port}] Status: ${res.statusCode}`);
            console.log(`📡 [PORTA ${port}] Headers:`, res.headers);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({ port, status: res.statusCode, data, headers: res.headers });
            });
        });

        req.on('error', (err) => {
            console.log(`❌ [PORTA ${port}] Erro: ${err.message}`);
            resolve({ port, error: err.message });
        });

        req.setTimeout(5000, () => {
            console.log(`⏰ [PORTA ${port}] Timeout`);
            req.destroy();
            resolve({ port, error: 'Timeout' });
        });

        req.end();
    });
}

async function runCompleteTest() {
    console.log('\n🔍 Testando múltiplas portas...\n');
    
    const ports = [3000, 3001];
    const results = [];
    
    for (const port of ports) {
        const result = await testHttpRequest(port);
        results.push(result);
        
        if (result.data) {
            console.log(`\n📝 [PORTA ${port}] Análise do conteúdo:`);
            
            // Verificar título
            const titleMatch = result.data.match(/<title>(.*?)<\/title>/i);
            if (titleMatch) {
                const title = titleMatch[1];
                console.log(`📋 Título encontrado: "${title}"`);
                
                if (title.includes('[BRANCH MASTER v3.0.2]')) {
                    console.log(`✅ Título CORRETO encontrado!`);
                } else {
                    console.log(`❌ Título INCORRETO - não contém versão atualizada`);
                }
            } else {
                console.log(`❌ Título não encontrado no HTML`);
            }
            
            // Verificar se é HTML embarcado ou arquivo
            if (result.data.includes('Sistema de Gestão de Demandas')) {
                if (result.data.includes('JavaScript básico para carregar demandas')) {
                    console.log(`⚠️  HTML EMBARCADO detectado (fallback do servidor)`);
                } else {
                    console.log(`✅ HTML do arquivo detectado`);
                }
            }
            
            // Verificar tamanho
            console.log(`📏 Tamanho do HTML: ${result.data.length} bytes`);
            
            // Verificar primeiras linhas
            const firstLines = result.data.split('\n').slice(0, 10).join('\n');
            console.log(`📄 Primeiras linhas:\n${firstLines}`);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
    }
    
    return results;
}

// Executar teste
runCompleteTest().then(results => {
    console.log('\n🎯 RESUMO DOS RESULTADOS:');
    results.forEach(result => {
        if (result.error) {
            console.log(`❌ Porta ${result.port}: ${result.error}`);
        } else {
            const hasCorrectTitle = result.data && result.data.includes('[BRANCH MASTER v3.0.2]');
            console.log(`${hasCorrectTitle ? '✅' : '❌'} Porta ${result.port}: Status ${result.status} - Título ${hasCorrectTitle ? 'CORRETO' : 'INCORRETO'}`);
        }
    });
}).catch(console.error);
