// ========================================
// TESTE CREDENCIAIS FABIANO - SHAREPOINT
// Sistema de Demandas Governança TOP v2.0.0
// ========================================

const sprLib = require('sprestlib');

console.log('========================================');
console.log('🔐 TESTE COM CREDENCIAIS FABIANO');
console.log('========================================\n');

async function testarCredenciaisFabiano() {
    try {
        console.log('📚 SpRestLib versão:', sprLib.version);
        console.log('👤 Usuário: fabiano.kruetzmann@telefonica.com');
        console.log('🔗 Site: https://telefonicacorp.sharepoint.com/sites/ESCALONAMENTO_TOP_SIGITM.TMBNL\n');

        // 1. Configurar Node.js
        console.log('1️⃣ Configurando ambiente Node.js...');
        sprLib.nodeConfig({ nodeEnabled: true });
        console.log('✅ Node.js configurado\n');

        // 2. Configurar URL base
        console.log('2️⃣ Configurando URL base...');
        const siteUrl = 'https://telefonicacorp.sharepoint.com/sites/ESCALONAMENTO_TOP_SIGITM.TMBNL';
        sprLib.baseUrl(siteUrl);
        console.log('✅ URL base configurada\n');

        // 3. Autenticar com credenciais
        console.log('3️⃣ Autenticando com credenciais...');
        console.log('   📡 Tentando autenticação...');
        
        const authResult = await sprLib.auth({
            username: 'fabiano.kruetzmann@telefonica.com',
            password: 'FSKpsm!@#$%Pedro82'
        });
        
        console.log('✅ Autenticação executada');
        console.log('📋 Resultado:', authResult);
        console.log('');

        // 4. Testar acesso ao site
        console.log('4️⃣ Testando acesso ao site...');
        console.log('   📡 Obtendo informações do site...');
        
        const siteInfo = await sprLib.site().info();
        
        console.log('✅ Informações do site obtidas!');
        console.log('📄 Título:', siteInfo.Title);
        console.log('🔗 URL:', siteInfo.Url);
        console.log('📅 Criado:', siteInfo.Created);
        console.log('👤 Autor:', siteInfo.Author?.Title || 'N/A');
        console.log('');

        // 5. Testar lista de documentos
        console.log('5️⃣ Testando lista de documentos...');
        console.log('   📡 Acessando biblioteca Documents...');
        
        const listInfo = await sprLib.list('Documents').info();
        
        console.log('✅ Lista de documentos acessada!');
        console.log('📄 Título:', listInfo.Title);
        console.log('🔢 Itens:', listInfo.ItemCount);
        console.log('📅 Criada:', listInfo.Created);
        console.log('');

        // 6. Buscar arquivos na pasta Demandas
        console.log('6️⃣ Buscando arquivos na pasta Demandas...');
        console.log('   📡 Procurando arquivos...');
        
        const files = await sprLib.list('Documents').get({
            select: ['FileRef', 'Title', 'Modified', 'File_x0020_Size'],
            filter: "substringof('Demandas', FileRef)",
            top: 10
        });
        
        console.log(`✅ Encontrados ${files.length} arquivos!`);
        files.forEach((file, index) => {
            const fileName = file.FileRef.split('/').pop();
            const size = file.File_x0020_Size ? `${file.File_x0020_Size} bytes` : 'N/A';
            console.log(`   ${index + 1}. ${fileName} (${size})`);
        });
        console.log('');

        // 7. Testar download do versao.json
        console.log('7️⃣ Tentando baixar versao.json...');
        
        const versionFile = files.find(f => f.FileRef.includes('versao.json'));
        
        if (versionFile) {
            console.log('🎯 Arquivo versao.json encontrado!');
            console.log('📍 Caminho:', versionFile.FileRef);
            
            try {
                console.log('   📡 Baixando conteúdo...');
                const fileContent = await sprLib.file(versionFile.FileRef).get();
                
                console.log('✅ Arquivo baixado com sucesso!');
                console.log(`📊 Tamanho: ${fileContent.length} caracteres`);
                console.log(`📄 Conteúdo (início): ${fileContent.substring(0, 200)}...`);
                
                try {
                    const jsonData = JSON.parse(fileContent);
                    console.log(`🔍 Versão encontrada: ${jsonData.version}`);
                    console.log(`📅 Atualização: ${jsonData.updated_at}`);
                } catch (parseError) {
                    console.log('⚠️ Conteúdo não é JSON válido');
                }
                
            } catch (downloadError) {
                console.log('❌ Erro no download:', downloadError.message);
            }
        } else {
            console.log('⚠️ Arquivo versao.json não encontrado na busca');
        }

        console.log('\n========================================');
        console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('========================================');
        console.log('✅ Autenticação funcionou');
        console.log('✅ Acesso ao site funcionou'); 
        console.log('✅ Lista de documentos acessível');
        console.log(`✅ ${files.length} arquivos encontrados na pasta Demandas`);
        console.log('🚀 SpRestLib está funcionando perfeitamente!');
        console.log('🔄 Pronto para integrar com verificar-atualizacoes.js');

        return {
            success: true,
            siteInfo,
            listInfo,
            files,
            versionFile
        };

    } catch (error) {
        console.log('\n========================================');
        console.log('❌ ERRO NO TESTE');
        console.log('========================================');
        console.log('💥 Erro:', error.message);
        console.log('📋 Stack:', error.stack);
        
        console.log('\n🔧 POSSÍVEIS SOLUÇÕES:');
        console.log('1. Verificar se está conectado à rede corporativa');
        console.log('2. Confirmar se as credenciais estão corretas');
        console.log('3. Testar acesso via navegador primeiro');
        console.log('4. Verificar se o SharePoint está acessível');

        return {
            success: false,
            error: error.message
        };
    }
}

// Executar teste
testarCredenciaisFabiano()
    .then(result => {
        if (result.success) {
            console.log('\n🏁 Teste bem-sucedido!');
            process.exit(0);
        } else {
            console.log('\n💥 Teste falhou!');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('💥 Erro crítico:', error);
        process.exit(1);
    });