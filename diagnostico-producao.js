// ========================================
// DIAGNÓSTICO RÁPIDO PARA PRODUÇÃO
// ========================================

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DO SISTEMA EM PRODUÇÃO\n');
console.log(`📂 Pasta atual: ${process.cwd()}\n`);

// Arquivos críticos que devem existir
const arquivosCriticos = [
    'startup-with-updates.js',
    'scripts/github-update-system.js',
    'INICIAR-COM-GITHUB.bat',
    'backend/server.js',
    'package.json'
];

console.log('📋 VERIFICANDO ARQUIVOS CRÍTICOS:\n');

let arquivosFaltando = [];
let problemasEncontrados = [];

arquivosCriticos.forEach(arquivo => {
    if (fs.existsSync(arquivo)) {
        console.log(`✅ ${arquivo}`);
    } else {
        console.log(`❌ ${arquivo} - FALTANDO`);
        arquivosFaltando.push(arquivo);
        problemasEncontrados.push(`Arquivo ${arquivo} não encontrado`);
    }
});

// Verificar Node.js
console.log('\n🔍 VERIFICANDO NODE.JS:');
console.log(`✅ Node.js ${process.version}`);

// Verificar dependências
console.log('\n🔍 VERIFICANDO DEPENDÊNCIAS:');
try {
    require('express');
    console.log('✅ Express instalado');
} catch (error) {
    console.log('❌ Express não encontrado');
    problemasEncontrados.push('Express não instalado');
}

try {
    require('mssql');
    console.log('✅ MSSQL instalado');
} catch (error) {
    console.log('❌ MSSQL não encontrado');
    problemasEncontrados.push('MSSQL não instalado');
}

// Resultado do diagnóstico
console.log('\n' + '='.repeat(50));
console.log('📊 RESULTADO DO DIAGNÓSTICO');
console.log('='.repeat(50));

if (problemasEncontrados.length === 0) {
    console.log('🎉 SISTEMA COMPLETO E FUNCIONAL!');
    console.log('\n🚀 PARA INICIAR:');
    console.log('   • Execute: INICIAR-COM-GITHUB.bat');
    console.log('   • Ou: node startup-with-updates.js');
} else {
    console.log('🚨 PROBLEMAS ENCONTRADOS:');
    problemasEncontrados.forEach((problema, index) => {
        console.log(`   ${index + 1}. ${problema}`);
    });
    
    console.log('\n🔧 SOLUÇÕES:');
    
    if (arquivosFaltando.length > 0) {
        console.log('\n📥 DOWNLOAD AUTOMÁTICO DOS ARQUIVOS:');
        console.log('   PowerShell:');
        arquivosFaltando.forEach(arquivo => {
            const url = `https://raw.githubusercontent.com/kruetzmann2110/demandas/main/${arquivo}`;
            const dir = path.dirname(arquivo);
            if (dir !== '.') {
                console.log(`   mkdir ${dir} -Force`);
            }
            console.log(`   Invoke-WebRequest -Uri "${url}" -OutFile "${arquivo}"`);
        });
        
        console.log('\n   OU MANUAL:');
        console.log('   1. Baixe: https://github.com/kruetzmann2110/demandas/archive/main.zip');
        console.log('   2. Extraia todos os arquivos para esta pasta');
    }
    
    if (problemasEncontrados.some(p => p.includes('Express') || p.includes('MSSQL'))) {
        console.log('\n📦 INSTALAR DEPENDÊNCIAS:');
        console.log('   npm install express mssql');
    }
}

console.log('\n📞 SUPORTE:');
console.log('   📧 fabiano.kruetzmann@telefonica.com');
console.log('   🐛 https://github.com/kruetzmann2110/demandas/issues');

console.log('\n' + '='.repeat(50));