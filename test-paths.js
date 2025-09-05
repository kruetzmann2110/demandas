// TESTE ESPECÍFICO PARA VERIFICAR PATHS DO SERVER 1.JS
const path = require('path');
const fs = require('fs');

console.log('🔍 TESTANDO PATHS DO SERVER 1.JS...');
console.log('');

// Simular __dirname do server 1.js
const serverDir = 'c:\\Users\\kruet\\OneDrive\\Área de Trabalho\\GitHubFuncional';

console.log('📁 Diretório do server 1.js:', serverDir);
console.log('');

// Testar path ANTIGO (incorreto)
const pathAntigo = path.join(serverDir, '..', 'web', 'index.html');
console.log('❌ PATH ANTIGO (incorreto):', pathAntigo);
console.log('   Existe?', fs.existsSync(pathAntigo));

// Testar path NOVO (correto)  
const pathNovo = path.join(serverDir, 'web', 'index.html');
console.log('✅ PATH NOVO (correto):', pathNovo);
console.log('   Existe?', fs.existsSync(pathNovo));

console.log('');

// Verificar se pasta web existe
const pastaWeb = path.join(serverDir, 'web');
console.log('📁 Pasta web:', pastaWeb);
console.log('   Existe?', fs.existsSync(pastaWeb));

if (fs.existsSync(pastaWeb)) {
    console.log('   Conteúdo:');
    try {
        const arquivos = fs.readdirSync(pastaWeb);
        arquivos.forEach(arquivo => {
            console.log('   -', arquivo);
        });
    } catch (error) {
        console.log('   Erro ao listar:', error.message);
    }
}
