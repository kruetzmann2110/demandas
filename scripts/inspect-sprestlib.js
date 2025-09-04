// ========================================
// INSPETOR DA API SPRESTLIB
// ========================================

const sprLib = require('sprestlib');

console.log('========================================');
console.log('🔍 INSPECIONANDO API DA SPRESTLIB');
console.log('========================================\n');

console.log('📋 Propriedades disponíveis em sprLib:');
console.log(Object.getOwnPropertyNames(sprLib));
console.log('\n📋 Métodos disponíveis:');
Object.getOwnPropertyNames(sprLib).forEach(prop => {
    try {
        if (typeof sprLib[prop] === 'function') {
            console.log(`   🔧 ${prop}(): ${sprLib[prop].toString().substring(0, 100)}...`);
        } else if (typeof sprLib[prop] === 'object' && sprLib[prop] !== null) {
            console.log(`   📁 ${prop}: Object com propriedades:`, Object.getOwnPropertyNames(sprLib[prop]));
        } else {
            console.log(`   📄 ${prop}: ${typeof sprLib[prop]} = ${sprLib[prop]}`);
        }
    } catch (error) {
        console.log(`   ❌ ${prop}: Erro ao inspecionar - ${error.message}`);
    }
});

console.log('\n🔧 Verificando funcionalidades principais...');

// Testar nodeConfig
try {
    if (typeof sprLib.nodeConfig === 'function') {
        console.log('✅ nodeConfig() disponível');
        sprLib.nodeConfig({ nodeEnabled: true });
        console.log('✅ nodeConfig({ nodeEnabled: true }) executado');
    } else {
        console.log('❌ nodeConfig() não disponível');
    }
} catch (error) {
    console.log(`❌ Erro em nodeConfig: ${error.message}`);
}

// Testar setup
try {
    if (typeof sprLib.setup === 'function') {
        console.log('✅ setup() disponível');
    } else {
        console.log('❌ setup() não disponível');
    }
} catch (error) {
    console.log(`❌ Erro em setup: ${error.message}`);
}

// Verificar versão da biblioteca
try {
    if (sprLib.version) {
        console.log(`📋 Versão SpRestLib: ${sprLib.version}`);
    }
    
    if (sprLib.VERSION) {
        console.log(`📋 VERSION: ${sprLib.VERSION}`);
    }
} catch (error) {
    console.log(`❌ Erro ao obter versão: ${error.message}`);
}

console.log('\n========================================');
console.log('🏁 Inspeção concluída!');
console.log('========================================');