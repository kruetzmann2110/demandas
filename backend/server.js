// BACKEND CORRIGIDO - BASEADO NO EXEMPLO FUNCIONAL
// Este é o backend que deve ser usado no ambiente real com SQL Server

const express = require('express');
const sql = require('mssql');
const path = require('path');
const fs = require('fs');

const app = express();

// ✅ MIDDLEWARE CORRIGIDO - Garantir parsing do JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ MIDDLEWARE DE DEBUG - Logar todos os requests
app.use((req, res, next) => {
    console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log(`📋 Headers:`, req.headers);
    console.log(`📋 Body:`, req.body);
    console.log(`📋 Query:`, req.query);
    next();
});

// ============== SERVIR ARQUIVOS ESTÁTICOS ==============
app.use(express.static(path.join(__dirname, '..', 'web')));

// ============== HEALTH CHECK ==============
app.get('/health', (req, res) => {
    console.log('[HEALTH] Health check solicitado');
    res.json({ 
        success: true, 
        status: 'OK', 
        message: 'Sistema de Demandas funcionando',
        timestamp: new Date().toISOString()
    });
});

console.log('=== SISTEMA DE DEMANDAS COM TIMELINE (BASEADO NO EXEMPLO FUNCIONAL) ===');

// Configuração do banco SQL Server (para ambiente real)
const dbConfig = {
    server: '+++++',
    database: 'b2b',
    user: 'AUTOMACAO_B2B',
    password: '++++!',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Função para conectar ao banco
async function connectDB() {
    try {
        console.log('[DATABASE] Conectando ao SQL Server...');
        console.log('[DATABASE] Config:', {
            server: dbConfig.server,
            database: dbConfig.database,
            user: dbConfig.user
        });
        const pool = await sql.connect(dbConfig);
        console.log('[DATABASE] ✅ Conectado ao SQL Server com sucesso!');
        return pool;
    } catch (error) {
        console.error('[DATABASE] ❌ Erro ao conectar:');
        console.error('[DATABASE] Erro completo:', error);
        console.error('[DATABASE] Mensagem:', error.message);
        console.error('[DATABASE] Código:', error.code);
        console.error('[DATABASE] Stack:', error.stack);
        throw error;
    }
}

// ✅ FUNÇÃO CORRIGIDA PARA TIMEZONE DE SÃO PAULO
function getDataSaoPaulo() {
    const now = new Date();
    const saoPauloTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    const offsetDiff = now.getTimezoneOffset() * 60000;
    const localTime = new Date(saoPauloTime.getTime() + offsetDiff);
    
    console.log(`[TIMEZONE] Data original UTC: ${now.toISOString()}`);
    console.log(`[TIMEZONE] Data São Paulo: ${saoPauloTime.toISOString()}`);
    console.log(`[TIMEZONE] Data local ajustada: ${localTime.toISOString()}`);
    
    return localTime;
}

// ✅ FUNÇÃO PARA PROCESSAR DATA DO FRONTEND
function processarDataDoFrontend(dataString) {
    if (!dataString) return getDataSaoPaulo();
    
    try {
        if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dataString.split('-');
            const dataSaoPaulo = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
            console.log(`[FRONTEND-DATE] Data recebida: ${dataString}`);
            console.log(`[FRONTEND-DATE] Data processada: ${dataSaoPaulo.toISOString()}`);
            return dataSaoPaulo;
        }
        
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? getDataSaoPaulo() : data;
        
    } catch (error) {
        console.error(`[FRONTEND-DATE] Erro ao processar data: ${dataString}`, error);
        return getDataSaoPaulo();
    }
}

// ============== API PRINCIPAL: /api/demands COM TIMELINE (COMO NO EXEMPLO) ==============
app.get('/api/demands', async (req, res) => {
    console.log('[API] 🔍 Buscando demandas com timeline (baseado no exemplo funcional)...');
    
    try {
        console.log('[API] 📡 Tentando conectar ao banco de dados...');
        const pool = await connectDB();
        console.log('[API] ✅ Conexão estabelecida, executando query de demandas...');
        
        // 1. Primeiro, busca todas as demandas (incluindo novos campos)
        console.log('[API] 📊 Executando query principal de demandas...');
        const demandsResult = await pool.request().query(`
            SELECT 
                d.id, 
                d.requester,
                d.group_name,
                d.scenario,
                d.observation,
                d.open_date,
                d.status,
                d.responsible,
                u.name AS responsible_name,
                d.deadline,
                d.priority,
                d.priority_classification,
                d.priority_score,
                d.impacto_cliente_final,
                d.complexidade_tecnica,
                d.tdna,
                d.nps,
                d.reincidencia,
                d.reclamada,
                d.frequencia_automacao,
                d.gestao_equipes_direta,
                d.envolvimento_grupos,
                d.gerar_dentro_casa,
                d.created_at,
                d.updated_at,
                d.theme,
                d.title,
                d.description,
                d.due_date,
                d.real_demand_id,
                d.submotivo,
                d.categoria
            FROM demands d
            LEFT JOIN usuarios_demanda u ON d.responsible = u.name
            ORDER BY d.created_at DESC
        `);
        
        console.log('[API] ✅ Query de demandas executada com sucesso');
        const demands = demandsResult.recordset;
        console.log(`[API] 📋 Encontradas ${demands.length} demandas`);
        
        if (demands.length === 0) {
            console.log('[API] ⚠️ Nenhuma demanda encontrada, retornando array vazio');
            return res.json({ success: true, data: [] });
        }
        
        // ✅ NORMALIZAR campos de prioridade e garantir valores consistentes
        console.log('[API] 🔧 Normalizando campos de prioridade...');
        demands.forEach(demand => {
            // Garantir que priority seja numérico (1, 2, 3)
            if (demand.priority === null || demand.priority === undefined) {
                demand.priority = 2; // Default: Média
            }
            
            // Garantir que priority_score seja numérico
            if (demand.priority_score === null || demand.priority_score === undefined) {
                demand.priority_score = 0;
            }
            
            // Garantir que priority_classification seja string
            if (!demand.priority_classification) {
                demand.priority_classification = 'Média';
            }
            
            console.log(`[PRIORITY-CHECK] ID ${demand.id}: priority=${demand.priority}, score=${demand.priority_score}, class=${demand.priority_classification}`);
        });

        // 2. Em seguida, busca todas as timeline entries para essas demandas (EXATAMENTE como no exemplo)
        console.log('[API] 📈 Buscando timeline para as demandas...');
        const demandIds = demands.map(d => d.id);
        const placeholders = demandIds.map((_, index) => `@param${index}`).join(',');
        console.log(`[API] 🎯 IDs das demandas: [${demandIds.join(', ')}]`);
        
        console.log('[API] 📊 Montando query de timeline...');
        const sqlTimeline = `
            SELECT 
                t.id,
                t.demand_id,
                t.event_date,
                t.event_text,
                t.created_at,
                t.user_id,
                COALESCE(u.name, t.user_id, 'Sistema') as user_name
            FROM demand_timeline t
            LEFT JOIN usuarios_demanda u ON t.user_id = u.name OR LOWER(t.user_id) = LOWER(u.name)
            WHERE t.demand_id IN (${placeholders}) 
            ORDER BY t.demand_id, t.event_date ASC`;

        console.log('[API] 🔍 Query de timeline preparada:', sqlTimeline);
        console.log('[API] 📝 Executando query de timeline...');
        
        const timelineRequest = pool.request();
        demandIds.forEach((id, index) => {
            timelineRequest.input(`param${index}`, sql.Int, id);
        });

        const timelineResult = await timelineRequest.query(sqlTimeline);
        const timelineEntries = timelineResult.recordset;
        
        console.log(`[API] ✅ Timeline query executada - Encontradas ${timelineEntries.length} entradas`);
        
        if (timelineEntries.length > 0) {
            console.log('[API] 📋 Primeiras 3 entradas de timeline:', timelineEntries.slice(0, 3));
        }

        // 3. Organiza as timeline entries em um mapa (EXATAMENTE como no exemplo)
        console.log('[API] 🗂️ Organizando timeline em mapa...');
        const timelineMap = new Map();
        timelineEntries.forEach(entry => {
            if (!timelineMap.has(entry.demand_id)) {
                timelineMap.set(entry.demand_id, []);
            }
            timelineMap.get(entry.demand_id).push({
                id: entry.id,
                demand_id: entry.demand_id,
                usuario: entry.user_name || 'Sistema', // Usar o nome real do usuário
                acao: entry.event_text, // Usar event_text real da tabela
                descricao: entry.event_text, // Usar event_text como descrição
                data_acao: entry.event_date, // Usar event_date real da tabela
                created_at: entry.created_at, // Usar created_at real da tabela
                user_id: entry.user_id // Incluir user_id para referência
            });
        });

        console.log(`[API] 📊 Mapa de timeline criado para ${timelineMap.size} demandas`);

        // 4. Anexa as timelines a cada demanda (EXATAMENTE como no exemplo funcional)
        console.log('[API] 🔗 Anexando timeline às demandas...');
        const demandsComTimeline = demands.map(demand => ({
            ...demand,
            timeline: timelineMap.get(demand.id) || [] // ✅ CAMPO TIMELINE INCLUÍDO!
        }));

        console.log('[API] ✅ Timeline anexada a todas as demandas');
        
        // Log de debugging detalhado
        const demandsWithTimeline = demandsComTimeline.filter(d => d.timeline.length > 0);
        console.log(`[API] 📊 ${demandsWithTimeline.length} de ${demandsComTimeline.length} demandas têm entradas na timeline`);
        
        // Log das primeiras demandas para debug
        console.log('[API] 🔍 Primeiras 2 demandas preparadas:');
        demandsComTimeline.slice(0, 2).forEach(demand => {
            console.log(`  - ID ${demand.id}: ${demand.scenario || 'sem cenário'} (${demand.timeline.length} eventos na timeline)`);
        });

        console.log('[API] 🎉 Respondendo com sucesso ao frontend');
        res.json({ success: true, data: demandsComTimeline });

    } catch (error) {
        console.error('[API] ❌ ERRO FATAL ao buscar demandas:');
        console.error('[API] Mensagem:', error.message);
        console.error('[API] Stack:', error.stack);
        console.error('[API] Código:', error.code);
        console.error('[API] Detalhes completos:', error);
        
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: error.code || 'Erro desconhecido'
        });
    }
});

// ============== API PARA ADICIONAR ENTRADA NA TIMELINE (ESTRUTURA REAL) ==============
app.post('/api/demands/:id/timeline', async (req, res) => {
    const demandId = req.params.id;
    
    console.log(`[TIMELINE] 🔍 POST /api/demands/${demandId}/timeline`);
    console.log(`[TIMELINE] 📋 Body completo:`, req.body);
    console.log(`[TIMELINE] 📋 Tipo do body:`, typeof req.body);
    console.log(`[TIMELINE] 📋 Keys do body:`, Object.keys(req.body || {}));
    
    // ✅ VALIDAÇÃO ROBUSTA - Aceitar múltiplos formatos
    let eventText = null;
    let userId = null;
    
    if (req.body && typeof req.body === 'object') {
        eventText = req.body.event_text || req.body.text || req.body.observation || req.body.message;
        userId = req.body.user_id || req.body.userId || req.body.usuario;
    } else if (typeof req.body === 'string') {
        // Se o body for uma string, tentar fazer parse
        try {
            const parsed = JSON.parse(req.body);
            eventText = parsed.event_text || parsed.text || parsed.observation || parsed.message;
            userId = parsed.user_id || parsed.userId || parsed.usuario;
        } catch (e) {
            eventText = req.body; // Usar a string diretamente
        }
    }
    
    // Tentar detectar usuário atual de outras formas se não foi fornecido
    if (!userId) {
        // Método 1: Headers do Windows Auth
        userId = req.headers['x-forwarded-user'] || req.headers['x-ms-client-principal-name'];
        
        // Método 2: Variável de ambiente Windows
        if (!userId) {
            const windowsUser = process.env.USERNAME;
            if (windowsUser) {
                userId = windowsUser.replace(/.*\\/, ''); // Remove domínio
            }
        }
        
        // Método 3: Fallback para usuário padrão
        if (!userId) {
            userId = 'G0040925'; // Usuário padrão para desenvolvimento
        }
    }
    
    console.log(`[TIMELINE] 📝 Event text extraído: "${eventText}"`);
    console.log(`[TIMELINE] 👤 User ID detectado: "${userId}"`);
    
    if (!eventText) {
        console.log(`[TIMELINE] ❌ Event text não encontrado no body`);
        return res.status(400).json({ 
            success: false, 
            error: 'event_text é obrigatório',
            received_body: req.body,
            body_type: typeof req.body
        });
    }
    
    console.log(`[TIMELINE] ✅ Adicionando entrada na timeline da demanda ${demandId}`);
    console.log(`[TIMELINE] ✅ Texto: "${eventText}", Usuário: "${userId}"`);
    
    try {
        const pool = await connectDB();
        
        // ✅ CORREÇÃO: Usar timezone de São Paulo correto
        const dataAtualSP = getDataSaoPaulo();
        
        const result = await pool.request()
            .input('demandId', sql.Int, demandId)
            .input('eventText', sql.NVarChar, eventText)
            .input('userId', sql.NVarChar, userId)
            .input('dataAtual', sql.DateTime2, dataAtualSP)
            .query(`
                INSERT INTO demand_timeline (demand_id, event_date, event_text, created_at, user_id)
                VALUES (@demandId, @dataAtual, @eventText, @dataAtual, @userId);
                
                SELECT SCOPE_IDENTITY() as id
            `);
        
        const newId = result.recordset[0].id;
        console.log(`[TIMELINE] ✅ Entrada criada com ID: ${newId}`);
        
        res.json({ 
            success: true,
            data: { id: newId },
            message: 'Entrada adicionada à timeline com sucesso' 
        });
        
    } catch (error) {
        console.error('[TIMELINE] ❌ Erro ao adicionar entrada:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============== API PARA BUSCAR TIMELINE DE UMA DEMANDA ESPECÍFICA ==============
app.get('/api/demands/:id/timeline', async (req, res) => {
    const demandId = req.params.id;
    
    console.log(`[TIMELINE] 🔍 GET /api/demands/${demandId}/timeline`);
    console.log(`[TIMELINE] 📋 Parâmetros:`, req.params);
    console.log(`[TIMELINE] 📋 Query params:`, req.query);
    
    if (!demandId || isNaN(demandId)) {
        console.error(`[TIMELINE] ❌ ID inválido: ${demandId}`);
        return res.status(400).json({ 
            success: false, 
            error: 'ID da demanda inválido' 
        });
    }
    
    try {
        console.log(`[TIMELINE] 📡 Conectando ao banco para demanda ${demandId}...`);
        const pool = await connectDB();
        console.log(`[TIMELINE] ✅ Conexão estabelecida, executando query...`);
        
        const result = await pool.request()
            .input('demandId', sql.Int, demandId)
            .query(`
                SELECT 
                    t.id,
                    t.demand_id,
                    t.event_date,
                    t.event_text,
                    t.created_at,
                    t.user_id,
                    COALESCE(u.name, t.user_id, 'Sistema') as user_name
                FROM demand_timeline t
                LEFT JOIN usuarios_demanda u ON t.user_id = u.name OR LOWER(t.user_id) = LOWER(u.name)
                WHERE t.demand_id = @demandId
                ORDER BY t.event_date ASC
            `);
        
        const timeline = result.recordset;
        console.log(`[TIMELINE] ✅ Query executada - ${timeline.length} entradas encontradas para demanda ${demandId}`);
        
        if (timeline.length > 0) {
            console.log(`[TIMELINE] 📋 Primeira entrada:`, timeline[0]);
            console.log(`[TIMELINE] 📋 Última entrada:`, timeline[timeline.length - 1]);
        }
        
        console.log(`[TIMELINE] 🎉 Respondendo timeline da demanda ${demandId} com sucesso`);
        res.json({ 
            success: true, 
            data: timeline 
        });
        
    } catch (error) {
        console.error(`[TIMELINE] ❌ ERRO ao buscar timeline da demanda ${demandId}:`);
        console.error('[TIMELINE] Mensagem:', error.message);
        console.error('[TIMELINE] Stack:', error.stack);
        console.error('[TIMELINE] Código:', error.code);
        console.error('[TIMELINE] Detalhes completos:', error);
        
        res.status(500).json({ 
            success: false, 
            error: error.message,
            demandId: demandId,
            details: error.code || 'Erro desconhecido'
        });
    }
});

// ============== CARREGAMENTO DO ARQUIVO DE AUTENTICAÇÃO LOCAL ==============
let localUsersAuth = {};
const authFilePath = path.join(__dirname, 'users-auth.json');

function loadLocalAuth() {
    try {
        if (fs.existsSync(authFilePath)) {
            const data = fs.readFileSync(authFilePath, 'utf8');
            localUsersAuth = JSON.parse(data);
            const userCount = Object.keys(localUsersAuth.users || {}).length;
            const themeCount = Object.keys(localUsersAuth.themes || {}).length;
            console.log(`[AUTH-LOCAL] ✅ Arquivo de autenticação carregado: ${userCount} usuários, ${themeCount} temas`);
        } else {
            console.log('[AUTH-LOCAL] ⚠️ Arquivo users-auth.json não encontrado');
            localUsersAuth = { users: {}, themes: {}, metadata: {} };
        }
    } catch (error) {
        console.error('[AUTH-LOCAL] ❌ Erro ao carregar arquivo de autenticação:', error.message);
        localUsersAuth = { users: {}, themes: {}, metadata: {} };
    }
}

// Função para buscar usuário no arquivo local
function findUserInLocal(username) {
    const cleanUsername = username.toUpperCase().trim();
    
    // Buscar diretamente
    if (localUsersAuth.users && localUsersAuth.users[cleanUsername]) {
        return localUsersAuth.users[cleanUsername];
    }
    
    // Buscar case-insensitive
    for (const [key, user] of Object.entries(localUsersAuth.users || {})) {
        if (key.toLowerCase() === cleanUsername.toLowerCase()) {
            return user;
        }
    }
    
    return null;
}

// Carregar arquivo na inicialização
loadLocalAuth();

// ============== API PARA DETECTAR USUÁRIO WINDOWS E BUSCAR ROLE ==============
app.get('/api/current-user', async (req, res) => {
    console.log('[AUTH] Tentando detectar usuário Windows...');
    
    // Em um ambiente Windows com IISNode, o nome de usuário pode estar em headers
    const forwardedUser = req.headers['x-forwarded-user'] || req.headers['x-ms-client-principal-name'];
    
    // A forma mais comum em Node.js rodando em Windows
    const windowsUser = process.env.USERNAME || forwardedUser;

    if (!windowsUser) {
        console.log('[AUTH] ⚠️ Não foi possível detectar o usuário Windows. Usando fallback.');
        // Fallback para um usuário padrão em caso de falha na detecção
        return res.json({ 
            success: true, 
            user: 'usuario.padrao', 
            role: 'colaborador',
            message: 'Usuário fallback - Windows não detectado'
        });
    }

    const cleanUser = windowsUser.replace(/.*\\/, ''); // Remove domínio (ex: DOMAIN\user -> user)
    console.log(`[AUTH] 🔍 Usuário detectado: "${cleanUser}" (length: ${cleanUser.length})`);
    console.log(`[AUTH] 🔍 Caracteres do usuário:`, Array.from(cleanUser).map(c => `${c}(${c.charCodeAt(0)})`).join(' '));

    try {
        // ✅ TIMEOUT para evitar que banco lento cause fallback desnecessário
        const pool = await Promise.race([
            connectDB(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 10000)) // 10 segundos
        ]);
        
        console.log(`[AUTH] 🔍 Executando query para buscar usuário...`);
        
        // ✅ Query case-insensitive para evitar problemas de maiúscula/minúscula
        const result = await pool.request()
            .input('windowsUser', sql.NVarChar, cleanUser)
            .query('SELECT name, role FROM usuarios_demanda WHERE LOWER(name) = LOWER(@windowsUser)');

        console.log(`[AUTH] 🔍 Query executada. Resultados encontrados: ${result.recordset.length}`);
        
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            console.log(`[AUTH] ✅ Usuário encontrado no banco: ${user.name}, Role: ${user.role}`);
            res.json({ success: true, user: user.name, role: user.role });
            return; // ✅ SUCESSO - Sair da função
        }
        
        // Se não encontrou, continuar para os fallbacks...
        console.log(`[AUTH] ⚠️ Usuário "${cleanUser}" não encontrado no banco após busca case-insensitive`);
        
    } catch (error) {
        console.error('[AUTH] ❌ Erro ao buscar usuário no banco:', error.message);
        console.log(`[AUTH] 🔄 Continuando para fallbacks devido ao erro...`);
    }

    // ============== FALLBACKS (APENAS APÓS TENTAR O BANCO) ==============
    console.log(`[AUTH] 🔄 Iniciando sistema de fallbacks para usuário: ${cleanUser}`);
    
    // Fallback 1: Configuração especial para G0040925
    if (cleanUser.toLowerCase() === 'g0040925') {
        console.log(`[AUTH] ✅ Usando fallback especial para G0040925`);
        res.json({ 
            success: true, 
            user: 'G0040925', 
            role: 'admin',
            message: 'Fallback: Usuário configurado como admin'
        });
        return;
    }
    
    // Fallback 2: Buscar no arquivo JSON local
    console.log(`[AUTH] 🔄 Tentando buscar usuário no arquivo local...`);
    const localUser = findUserInLocal(cleanUser);
    if (localUser) {
        console.log(`[AUTH] ✅ Usuário encontrado no arquivo local: ${localUser.name}, Role: ${localUser.role}`);
        res.json({ 
            success: true, 
            user: localUser.name, 
            role: localUser.role,
            message: 'Fallback: Usuário encontrado no arquivo local'
        });
        return;
    }
    
    // Fallback 3: Tentar G0040925 no banco como fallback geral
    try {
        const pool = await connectDB();
        const fallbackResult = await pool.request()
            .input('fallbackUser', sql.NVarChar, 'G0040925')
            .query('SELECT name, role FROM usuarios_demanda WHERE LOWER(name) = LOWER(@fallbackUser)');
        
        if (fallbackResult.recordset.length > 0) {
            const fallbackUser = fallbackResult.recordset[0];
            console.log(`[AUTH] ✅ Usando fallback geral para G0040925: ${fallbackUser.role}`);
            res.json({ 
                success: true, 
                user: fallbackUser.name, 
                role: fallbackUser.role,
                message: `Fallback: Usuário ${cleanUser} não encontrado, usando G0040925`
            });
            return;
        }
    } catch (fallbackError) {
        console.error('[AUTH] ❌ Erro no fallback G0040925:', fallbackError.message);
    }
    
    // Fallback 4: Role padrão colaborador
    console.log(`[AUTH] ⚠️ Todos os fallbacks falharam. Atribuindo role padrão para: ${cleanUser}`);
    res.json({ 
        success: true, 
        user: cleanUser, 
        role: 'colaborador',
        message: 'Fallback: Usuário não cadastrado, usando role padrão'
    });
});

// ============== API PARA LISTAR USUÁRIOS ==============
app.get('/api/users', async (req, res) => {
    console.log('[API] Buscando lista de usuários...');
    
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT id, name, role, created_at, updated_at
            FROM usuarios_demanda
            ORDER BY name ASC
        `);
        
        const users = result.recordset;
        console.log(`[API] ✅ ${users.length} usuários encontrados`);
        
        res.json({ 
            success: true, 
            data: users 
        });
        
    } catch (error) {
        console.error('[API] ❌ Erro ao buscar usuários:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============== API PARA TEMAS E GLOSSÁRIO ==============
app.get('/api/temas', async (req, res) => {
    console.log('[API] Buscando temas e glossário...');
    
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT id, tema, usuario_windows, focal_nome, glossario
            FROM temas_glossario
            ORDER BY tema ASC
        `);
        
        const temas = result.recordset;
        console.log(`[API] ✅ ${temas.length} temas encontrados`);
        
        res.json({ 
            success: true, 
            data: temas 
        });
        
    } catch (error) {
        console.error('[API] ❌ Erro ao buscar temas:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============== API PARA BUSCAR TEMA ESPECÍFICO ==============
app.get('/api/temas/:tema', async (req, res) => {
    const tema = req.params.tema;
    
    console.log(`[API] Buscando informações do tema: ${tema}`);
    
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('tema', sql.NVarChar, tema)
            .query(`
                SELECT id, tema, usuario_windows, focal_nome, glossario
                FROM temas_glossario
                WHERE tema = @tema
            `);
        
        if (result.recordset.length > 0) {
            const temaInfo = result.recordset[0];
            console.log(`[API] ✅ Tema encontrado: ${temaInfo.tema}`);
            res.json({ 
                success: true, 
                data: temaInfo 
            });
        } else {
            console.log(`[API] ⚠️ Tema não encontrado: ${tema}`);
            res.json({ 
                success: false, 
                message: 'Tema não encontrado',
                data: null 
            });
        }
        
    } catch (error) {
        console.error('[API] ❌ Erro ao buscar tema:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============== API PARA BUSCAR VALORES VÁLIDOS DE STATUS ==============
app.get('/api/status-values', async (req, res) => {
    console.log('[API] Buscando valores válidos de status...');
    
    try {
        const pool = await connectDB();
        
        // Buscar constraint de status para descobrir valores válidos
        const result = await pool.request().query(`
            SELECT 
                cc.definition
            FROM sys.check_constraints cc
            JOIN sys.objects o ON cc.parent_object_id = o.object_id
            JOIN sys.columns c ON cc.parent_object_id = c.object_id AND cc.parent_column_id = c.column_id
            WHERE o.name = 'demands' AND c.name = 'status'
        `);
        
        let validStatuses = ['Novo', 'Em analise', 'Aguardando demandante', 'Em andamento', 'Concluido', 'Cancelado'];
        
        if (result.recordset.length > 0) {
            const constraintDef = result.recordset[0].definition;
            console.log('[API] Constraint encontrada:', constraintDef);
            
            // Extrair valores da constraint (regex para pegar valores entre aspas)
            const matches = constraintDef.match(/'([^']+)'/g);
            if (matches) {
                validStatuses = matches.map(m => m.replace(/'/g, ''));
                console.log('[API] Status válidos extraídos:', validStatuses);
            }
        }
        
        res.json({ 
            success: true, 
            data: validStatuses 
        });
        
    } catch (error) {
        console.error('[API] ❌ Erro ao buscar status válidos:', error.message);
        // Retornar valores padrão em caso de erro
        res.json({ 
            success: true, 
            data: ['Novo', 'Em analise', 'Aguardando demandante', 'Em andamento', 'Concluido', 'Cancelado']
        });
    }
});

// ============== API PARA PERMISSÕES DO USUÁRIO ==============
app.get('/api/users/:username/permissions', async (req, res) => {
    const username = req.params.username;
    console.log(`[PERMISSIONS] 🔍 Buscando permissões para usuário: "${username}"`);
    
    let permissions = {
        canExport: false,
        canManageUsers: false,
        canViewAll: false,
        canEdit: false
    };

    try {
        // ✅ TIMEOUT para evitar que banco lento cause fallback desnecessário
        const pool = await Promise.race([
            connectDB(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 10000)) // 10 segundos
        ]);
        
        console.log(`[PERMISSIONS] 🔍 Executando query para buscar permissões...`);
        
        // ✅ Query case-insensitive 
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT name, role FROM usuarios_demanda WHERE LOWER(name) = LOWER(@username)');

        console.log(`[PERMISSIONS] 🔍 Query executada. Resultados: ${result.recordset.length}`);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const role = user.role;
            
            // Definir permissões baseadas no role
            switch (role) {
                case 'admin':
                    permissions = {
                        canExport: true,
                        canManageUsers: true,
                        canViewAll: true,
                        canEdit: true
                    };
                    break;
                case 'focal':
                    permissions = {
                        canExport: true,
                        canManageUsers: false,
                        canViewAll: true,
                        canEdit: true
                    };
                    break;
                case 'colaborador':
                default:
                    permissions = {
                        canExport: false,
                        canManageUsers: false,
                        canViewAll: false,
                        canEdit: false
                    };
                    break;
            }
            
            console.log(`[PERMISSIONS] ✅ Permissões encontradas para ${username} (${role}):`, permissions);
        } else {
            console.log(`[PERMISSIONS] ⚠️ Usuário ${username} não encontrado no banco, usando permissões padrão colaborador`);
            // permissions já está definido como colaborador (default)
        }
        
    } catch (error) {
        console.error('[PERMISSIONS] ❌ Erro ao buscar no banco:', error.message);
        console.log(`[PERMISSIONS] 🔄 Usando permissões padrão devido ao erro`);
        // permissions já está definido como colaborador (default)
    }
    
    // ✅ SEMPRE retornar resposta (nunca erro 500 para permissões)
    res.json({ 
        success: true, 
        data: permissions 
    });
});

// ============== OUTRAS APIs (PARA COMPATIBILIDADE) ==============

// API para salvar demanda
app.post('/api/demands', async (req, res) => {
    console.log('[API] Criando nova demanda...');
    
    try {
        const {
            requester,
            group_name,
            scenario,
            observation,
            responsible,
            deadline,
            priority,
            analyticsScore,
            analyticsPriority,
            impacto_cliente_final,
            complexidade_tecnica,
            tdna,
            nps,
            reincidencia,
            reclamada,
            frequencia_automacao,
            gestao_equipes_direta,
            envolvimento_grupos,
            gerar_dentro_casa,
            real_demand_id,
            submotivo,
            demand_open_date
        } = req.body;

        const pool = await connectDB();
        const dataAtual = getDataSaoPaulo();
        
        // ✅ LOG: Valores recebidos para prioridade
        console.log(`[CREATE-DEMAND] Valores de prioridade recebidos:`);
        console.log(`[CREATE-DEMAND] - priority: ${priority} (${typeof priority})`);
        console.log(`[CREATE-DEMAND] - analyticsScore: ${analyticsScore} (${typeof analyticsScore})`);
        console.log(`[CREATE-DEMAND] - analyticsPriority: ${analyticsPriority} (${typeof analyticsPriority})`);
        
        // ✅ NORMALIZAR valores antes de inserir
        const normalizedPriority = priority ? parseInt(priority) : 2; // Default: Média = 2
        const normalizedScore = analyticsScore ? parseInt(analyticsScore) : 0;
        const normalizedClassification = analyticsPriority || 'Média';
        
        console.log(`[CREATE-DEMAND] Valores normalizados:`);
        console.log(`[CREATE-DEMAND] - priority: ${normalizedPriority}`);
        console.log(`[CREATE-DEMAND] - priority_score: ${normalizedScore}`);
        console.log(`[CREATE-DEMAND] - priority_classification: ${normalizedClassification}`);
        
        // ✅ PREPARAR DATA DE ABERTURA: Usar função corrigida de timezone
        const dataAbertura = demand_open_date ? processarDataDoFrontend(demand_open_date) : dataAtual;
        
        const result = await pool.request()
            .input('requester', sql.NVarChar, requester)
            .input('group_name', sql.NVarChar, group_name)
            .input('scenario', sql.NVarChar, scenario)
            .input('observation', sql.NVarChar, observation)
            .input('responsible', sql.NVarChar, responsible)
            .input('deadline', sql.DateTime2, deadline)
            .input('priority', sql.Int, normalizedPriority)
            .input('open_date', sql.DateTime2, dataAbertura)
            .input('status', sql.NVarChar, 'Aberta')
            .input('priority_score', sql.Int, normalizedScore)
            .input('priority_classification', sql.NVarChar, normalizedClassification)
            .input('impacto_cliente_final', sql.Int, parseInt(impacto_cliente_final) || null)
            .input('complexidade_tecnica', sql.Int, parseInt(complexidade_tecnica) || null)
            .input('tdna', sql.Int, parseInt(tdna) || null)
            .input('nps', sql.Int, parseInt(nps) || null)
            .input('reincidencia', sql.Int, parseInt(reincidencia) || null)
            .input('reclamada', sql.Int, parseInt(reclamada) || null)
            .input('frequencia_automacao', sql.Int, parseInt(frequencia_automacao) || null)
            .input('gestao_equipes_direta', sql.NVarChar, gestao_equipes_direta)
            .input('envolvimento_grupos', sql.NVarChar, envolvimento_grupos)
            .input('gerar_dentro_casa', sql.NVarChar, gerar_dentro_casa)
            .input('real_demand_id', sql.NVarChar, real_demand_id)
            .input('submotivo', sql.NVarChar, submotivo)
            .input('created_at', sql.DateTime2, dataAtual) // ✅ CORREÇÃO: Usar campo correto
            .query(`
                INSERT INTO demands (
                    requester, group_name, scenario, observation, 
                    responsible, deadline, priority, open_date, 
                    status, priority_score, priority_classification,
                    impacto_cliente_final, complexidade_tecnica, tdna, nps,
                    reincidencia, reclamada, frequencia_automacao,
                    gestao_equipes_direta, envolvimento_grupos, gerar_dentro_casa,
                    real_demand_id, submotivo, created_at
                )
                VALUES (
                    @requester, @group_name, @scenario, @observation,
                    @responsible, @deadline, @priority, @open_date,
                    @status, @priority_score, @priority_classification,
                    @impacto_cliente_final, @complexidade_tecnica, @tdna, @nps,
                    @reincidencia, @reclamada, @frequencia_automacao,
                    @gestao_equipes_direta, @envolvimento_grupos, @gerar_dentro_casa,
                    @real_demand_id, @submotivo, @created_at
                );
                
                SELECT SCOPE_IDENTITY() as id
            `);
        
        const newId = result.recordset[0].id;
        console.log(`[API] ✅ Demanda criada com ID: ${newId}`);
        
        // ✅ CORREÇÃO: Criar entrada inicial na timeline com timezone correto
        const dataAtualSP = getDataSaoPaulo();
        await pool.request()
            .input('demandId', sql.Int, newId)
            .input('eventText', sql.NVarChar, `Demanda "${scenario}" foi criada`)
            .input('userId', sql.NVarChar, requester) // Usar o solicitante como usuário
            .input('dataAtual', sql.DateTime2, dataAtualSP)
            .query(`
                INSERT INTO demand_timeline (demand_id, event_date, event_text, created_at, user_id)
                VALUES (@demandId, @dataAtual, @eventText, @dataAtual, @userId)
            `);
        
        res.json({ 
            success: true,
            data: { id: newId },
            message: 'Demanda criada com sucesso' 
        });

    } catch (error) {
        console.error('[API] ❌ Erro ao criar demanda:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// API para atualizar demanda
app.put('/api/demands/:id', async (req, res) => {
    const demandId = req.params.id;
    
    console.log(`[API] Atualizando demanda ${demandId}...`);
    
    try {
        const updateData = req.body;
        const pool = await connectDB();
        
        // Construir query de update dinamicamente
        const updateFields = [];
        const updateValues = {};
        
        Object.keys(updateData).forEach(key => {
            if (key !== 'id') {
                updateFields.push(`${key} = @${key}`);
                updateValues[key] = updateData[key];
            }
        });
        
        if (updateFields.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Nenhum campo para atualizar' 
            });
        }
        
        const request = pool.request();
        Object.keys(updateValues).forEach(key => {
            if (key === 'priority') {
                request.input(key, sql.Int, updateValues[key]);
            } else if (key === 'deadline') {
                request.input(key, sql.DateTime2, updateValues[key]);
            } else {
                request.input(key, sql.NVarChar, updateValues[key]);
            }
        });
        request.input('id', sql.Int, demandId);
        
        // ✅ CORREÇÃO: Usar timezone de São Paulo para updated_at
        const dataAtualSP = getDataSaoPaulo();
        request.input('updated_at_param', sql.DateTime2, dataAtualSP);
        
        await request.query(`
            UPDATE demands 
            SET ${updateFields.join(', ')}, updated_at = @updated_at_param
            WHERE id = @id
        `);
        
        console.log(`[API] ✅ Demanda ${demandId} atualizada`);
        
        res.json({ 
            success: true,
            message: 'Demanda atualizada com sucesso' 
        });

    } catch (error) {
        console.error('[API] ❌ Erro ao atualizar demanda:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ✅ NOVO: API simples para atualizar um campo específico
app.patch('/api/demands/:id/update-field', async (req, res) => {
    const demandId = req.params.id;
    
    console.log(`[UPDATE-FIELD] 🔧 Atualizando campo da demanda ${demandId}...`);
    console.log(`[UPDATE-FIELD] 📝 Body:`, req.body);
    
    try {
        const pool = await connectDB();
        
        // Determinar qual campo atualizar
        const updateFields = [];
        const updateValues = {};
        
        // Campos permitidos
        if (req.body.real_demand_id !== undefined) {
            updateFields.push('real_demand_id = @real_demand_id');
            updateValues.real_demand_id = req.body.real_demand_id;
        }
        
        if (req.body.open_date !== undefined) {
            updateFields.push('open_date = @open_date');
            updateValues.open_date = req.body.open_date;
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Nenhum campo válido para atualizar' 
            });
        }
        
        // Montar a query
        const request = pool.request();
        Object.keys(updateValues).forEach(key => {
            if (key === 'open_date') {
                request.input(key, sql.Date, updateValues[key]);
            } else {
                request.input(key, sql.NVarChar, updateValues[key]);
            }
        });
        request.input('id', sql.Int, demandId);
        
        const dataAtualSP = getDataSaoPaulo();
        request.input('updated_at_param', sql.DateTime2, dataAtualSP);
        
        await request.query(`
            UPDATE demands 
            SET ${updateFields.join(', ')}, updated_at = @updated_at_param
            WHERE id = @id
        `);
        
        console.log(`[UPDATE-FIELD] ✅ Demanda ${demandId} atualizada com sucesso`);
        
        res.json({ 
            success: true,
            message: 'Campo atualizado com sucesso' 
        });

    } catch (error) {
        console.error(`[UPDATE-FIELD] ❌ Erro ao atualizar demanda ${demandId}:`, error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ✅ API para editar campos específicos via timeline
app.patch('/api/demands/:id/timeline-edit', async (req, res) => {
    const demandId = req.params.id;
    const { real_demand_id, open_date, user_id, user_name } = req.body;
    
    console.log(`[TIMELINE-EDIT] 🔧 Iniciando edição via timeline para demanda ${demandId}`);
    console.log(`[TIMELINE-EDIT] 📝 Dados recebidos:`, { real_demand_id, open_date, user_id, user_name });
    
    try {
        const pool = await connectDB();
        
        // Construir campos para atualizar
        const updateFields = [];
        const updateValues = {};
        
        if (real_demand_id !== undefined) {
            updateFields.push('real_demand_id = @real_demand_id');
            updateValues.real_demand_id = real_demand_id;
        }
        
        if (open_date !== undefined) {
            updateFields.push('open_date = @open_date');
            updateValues.open_date = open_date;
        }
        
        if (updateFields.length === 0) {
            console.log(`[TIMELINE-EDIT] ⚠️ Nenhum campo para atualizar`);
            return res.status(400).json({ 
                success: false, 
                error: 'Nenhum campo para atualizar' 
            });
        }
        
        // Atualizar demanda
        const request = pool.request();
        Object.keys(updateValues).forEach(key => {
            if (key === 'open_date') {
                request.input(key, sql.Date, updateValues[key]);
            } else {
                request.input(key, sql.NVarChar, updateValues[key]);
            }
        });
        request.input('id', sql.Int, demandId);
        
        const dataAtualSP = getDataSaoPaulo();
        request.input('updated_at_param', sql.DateTime2, dataAtualSP);
        
        await request.query(`
            UPDATE demands 
            SET ${updateFields.join(', ')}, updated_at = @updated_at_param
            WHERE id = @id
        `);
        
        console.log(`[TIMELINE-EDIT] ✅ Demanda ${demandId} atualizada com sucesso`);
        
        // Criar entrada na timeline
        const timelineRequest = pool.request();
        timelineRequest.input('demand_id', sql.Int, parseInt(demandId));
        timelineRequest.input('user_id', sql.NVarChar, user_id || 'sistema');
        timelineRequest.input('user_name', sql.NVarChar, user_name || 'Sistema');
        timelineRequest.input('action', sql.NVarChar, 'edição_campos');
        
        // Criar descrição da ação
        const changes = [];
        if (real_demand_id !== undefined) {
            changes.push(`ID da demanda real: "${real_demand_id}"`);
        }
        if (open_date !== undefined) {
            changes.push(`Data de abertura: "${open_date}"`);
        }
        const description = `Campos editados via timeline: ${changes.join(', ')}`;
        
        timelineRequest.input('description', sql.NVarChar, description);
        timelineRequest.input('timestamp', sql.DateTime2, dataAtualSP);
        
        await timelineRequest.query(`
            INSERT INTO demand_timeline (demand_id, user_id, user_name, action, description, timestamp)
            VALUES (@demand_id, @user_id, @user_name, @action, @description, @timestamp)
        `);
        
        console.log(`[TIMELINE-EDIT] 📝 Entrada criada na timeline: ${description}`);
        
        res.json({ 
            success: true,
            message: 'Campos atualizados com sucesso',
            updated_fields: Object.keys(updateValues)
        });

    } catch (error) {
        console.error(`[TIMELINE-EDIT] ❌ Erro ao editar campos:`, error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============== APIs DE TIMELINE (COMPATIBILIDADE COM FRONTEND) ==============

// API para buscar timeline por query parameter (como no SQLite)
app.get('/api/timeline', async (req, res) => {
    const demandId = req.query.demand_id;
    
    if (!demandId) {
        return res.status(400).json({ 
            success: false, 
            error: 'demand_id é obrigatório' 
        });
    }
    
    console.log(`[TIMELINE-API] Buscando timeline da demanda ${demandId}`);
    
    try {
        const pool = await connectDB();
        
        const result = await pool.request()
            .input('demandId', sql.Int, demandId)
            .query(`
                SELECT 
                    id,
                    demand_id,
                    event_date,
                    event_text,
                    created_at
                FROM demand_timeline 
                WHERE demand_id = @demandId
                ORDER BY event_date DESC
            `);
        
        const timeline = result.recordset;
        console.log(`[TIMELINE-API] ✅ ${timeline.length} eventos encontrados`);
        
        res.json(timeline);
        
    } catch (error) {
        console.error('[TIMELINE-API] ❌ Erro:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// API para adicionar evento na timeline (como no SQLite)
app.post('/api/timeline', async (req, res) => {
    console.log(`[TIMELINE-API] 🔍 POST /api/timeline`);
    console.log(`[TIMELINE-API] 📋 Body completo:`, req.body);
    
    // ✅ VALIDAÇÃO ROBUSTA - Aceitar múltiplos formatos
    let demandId = null;
    let eventText = null;
    
    if (req.body && typeof req.body === 'object') {
        demandId = req.body.demand_id || req.body.demandId || req.body.id;
        eventText = req.body.event_text || req.body.text || req.body.observation || req.body.message;
    }
    
    console.log(`[TIMELINE-API] 📝 Demand ID extraído: ${demandId}`);
    console.log(`[TIMELINE-API] 📝 Event text extraído: "${eventText}"`);
    
    if (!demandId || !eventText) {
        console.log(`[TIMELINE-API] ❌ Dados obrigatórios não encontrados`);
        return res.status(400).json({ 
            success: false, 
            error: 'demand_id e event_text são obrigatórios',
            received_body: req.body
        });
    }
    
    console.log(`[TIMELINE-API] ✅ Adicionando evento para demanda ${demandId}: ${eventText}`);
    
    try {
        const pool = await connectDB();
        
        // ✅ CORREÇÃO: Usar timezone de São Paulo correto
        const dataAtualSP = getDataSaoPaulo();
        
        const result = await pool.request()
            .input('demandId', sql.Int, demandId)
            .input('eventText', sql.NVarChar, eventText)
            .input('dataAtual', sql.DateTime2, dataAtualSP)
            .query(`
                INSERT INTO demand_timeline (demand_id, event_date, event_text, created_at)
                VALUES (@demandId, @dataAtual, @eventText, @dataAtual);
                
                SELECT 
                    SCOPE_IDENTITY() as id,
                    @demandId as demand_id,
                    @dataAtual as event_date,
                    @eventText as event_text,
                    @dataAtual as created_at
            `);
        
        const novoEvento = result.recordset[0];
        console.log(`[TIMELINE-API] ✅ Evento criado com ID: ${novoEvento.id}`);
        
        res.status(201).json(novoEvento);
        
    } catch (error) {
        console.error('[TIMELINE-API] ❌ Erro ao adicionar evento:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Servir arquivos estáticos e interface web
app.use('/css', express.static(path.join(__dirname, 'web', 'css')));
app.use('/js', express.static(path.join(__dirname, 'web', 'js')));

// Rota raiz com HTML embarcado para evitar problemas com pkg
app.get('/', (req, res) => {
    // Se o arquivo existir, serve normalmente
    const htmlPath = path.join(__dirname, '..', 'web', 'index.html');
    if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
    } else {
        // HTML mínimo embarcado para casos onde pkg não inclui arquivos
        res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Gestão de Demandas - Sistema Timeline</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                .timeline-item { border-left: 3px solid #007bff; padding: 10px; margin: 10px 0; }
                .loading { text-align: center; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container mt-4">
                <h1><i class="fas fa-tasks"></i> Sistema de Gestão de Demandas</h1>
                <div id="demands-container">
                    <div class="loading">Carregando demandas...</div>
                </div>
            </div>
            <script>
                // JavaScript básico para carregar demandas
                async function loadDemands() {
                    try {
                        const response = await fetch('/api/demands');
                        const result = await response.json();
                        
                        const container = document.getElementById('demands-container');
                        if (result.success && result.data.length > 0) {
                            container.innerHTML = result.data.map(demand => \`
                                <div class="card mb-3">
                                    <div class="card-header">
                                        <h5>\${demand.scenario || 'Sem cenário'}</h5>
                                        <span class="badge bg-primary">\${demand.status || 'Novo'}</span>
                                    </div>
                                    <div class="card-body">
                                        <p>\${demand.observation || 'Sem descrição'}</p>
                                        <div class="timeline">
                                            \${demand.timeline ? demand.timeline.map(t => \`
                                                <div class="timeline-item">
                                                    <strong>\${t.usuario || 'Sistema'}</strong> - \${new Date(t.data_acao || t.event_date).toLocaleDateString()}
                                                    <br><small>\${t.acao || t.event_text || ''}</small>
                                                </div>
                                            \`).join('') : '<p>Sem timeline</p>'}
                                        </div>
                                    </div>
                                </div>
                            \`).join('');
                        } else {
                            container.innerHTML = '<div class="alert alert-info">Nenhuma demanda encontrada</div>';
                        }
                    } catch (error) {
                        document.getElementById('demands-container').innerHTML = 
                            '<div class="alert alert-danger">Erro ao carregar demandas: ' + error.message + '</div>';
                    }
                }
                
                // Carregar demandas ao iniciar
                loadDemands();
            </script>
        </body>
        </html>
        `);
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n=== ✨Gestão de Demandas Governança ===');
    console.log(`🚀  Rodando na porta ${PORT}`);
    console.log(`📋 API: http://localhost:${PORT}/api/demands`);
    console.log(`📋 aguarde inicialização...`);


    // ✅ ABERTURA AUTOMÁTICA DO NAVEGADOR quando executável for iniciado
    // Verificar se está rodando como executável PKG ou em desenvolvimento
    const isExecutable = process.pkg || process.argv[0].includes('.exe');
    
    if (isExecutable) {
        console.log(`🌐 Detectado executável - abrindo navegador automaticamente...`);
        
        // Aguardar 3 segundos para o servidor terminar de inicializar
        setTimeout(() => {
            const { exec } = require('child_process');
            const url = `http://localhost:${PORT}`;
            
            try {
                // Usar exec para comando mais simples e melhor tratamento de erros
                if (process.platform === 'win32') {
                    exec(`start "" "${url}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`⚠️  Erro ao abrir navegador: ${error.message}`);
                            console.log(`🌐 Acesse manualmente: ${url}`);
                        } else {
                            console.log(`✅ Navegador aberto: ${url}`);
                        }
                    });
                } else {
                    // Fallback para outros sistemas (Mac/Linux)
                    exec(`open "${url}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`⚠️  Erro ao abrir navegador: ${error.message}`);
                            console.log(`🌐 Acesse manualmente: ${url}`);
                        } else {
                            console.log(`✅ Navegador aberto: ${url}`);
                        }
                    });
                }
            } catch (error) {
                console.log(`⚠️  Não foi possível abrir o navegador automaticamente.`);
                console.log(`🌐 Acesse manualmente no navegador em: ${url}`);
            }
        }, 3000);
    } else {
        console.log(`💻 Modo desenvolvimento - navegador não será aberto automaticamente`);
        console.log(`🌐 Acesse: http://localhost:${PORT}`);
    }
});

// ============== ENDPOINT DE EXPORTAÇÃO ESPECÍFICO ==============
app.get('/api/export', async (req, res) => {
    console.log('[EXPORT] Gerando dados para exportação Excel...');
    
    try {
        const pool = await connectDB();
        
        // Query específica solicitada para a exportação
        const result = await pool.request().query(`
            SELECT 
                id, 
                requester,
                categoria, 
                group_name, 
                scenario, 
                observation, 
                open_date, 
                status, 
                responsible, 
                deadline, 
                priority, 
                priority_classification, 
                priority_score, 
                impacto_cliente_final, 
                complexidade_tecnica, 
                tdna, 
                nps, 
                reincidencia, 
                reclamada, 
                frequencia_automacao, 
                gestao_equipes_direta, 
                envolvimento_grupos, 
                gerar_dentro_casa, 
                created_at, 
                updated_at, 
                theme, 
                title, 
                description, 
                due_date,
                real_demand_id,
                submotivo
            FROM b2b.dbo.demands
            ORDER BY created_at DESC
        `);
        
        const demands = result.recordset;
        console.log(`[EXPORT] ✅ ${demands.length} demandas preparadas para export`);
        
        res.json({ 
            success: true, 
            data: demands,
            message: 'Dados de exportação carregados com sucesso'
        });

    } catch (error) {
        console.error('[EXPORT] ❌ Erro ao gerar dados de exportação:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============== ENDPOINT SIMPLES PARA ATUALIZAR CAMPOS DA DEMANDA ==============
app.patch('/api/demands/:id/timeline-edit', async (req, res) => {
    const demandId = req.params.id;
    const { real_demand_id, open_date } = req.body;
    
    console.log(`[UPDATE-DEMAND] 🔧 Atualizando demanda ${demandId}`);
    console.log(`[UPDATE-DEMAND] 📝 Dados:`, { real_demand_id, open_date });
    
    try {
        const pool = await connectDB();
        
        // Construir campos para atualizar dinamicamente
        const updateFields = [];
        const request = pool.request();
        
        if (real_demand_id !== undefined) {
            updateFields.push('real_demand_id = @real_demand_id');
            request.input('real_demand_id', sql.NVarChar, real_demand_id);
        }
        
        if (open_date !== undefined) {
            updateFields.push('open_date = @open_date');
            request.input('open_date', sql.Date, open_date);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Nenhum campo para atualizar' 
            });
        }
        
        // UPDATE simples na tabela demands
        request.input('id', sql.Int, demandId);
        
        await request.query(`
            UPDATE demands 
            SET ${updateFields.join(', ')}
            WHERE id = @id
        `);
        
        console.log(`[UPDATE-DEMAND] ✅ Demanda ${demandId} atualizada com sucesso`);
        
        res.json({ 
            success: true,
            message: 'Campos atualizados com sucesso'
        });

    } catch (error) {
        console.error(`[UPDATE-DEMAND] ❌ Erro ao atualizar demanda ${demandId}:`, error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = app;
