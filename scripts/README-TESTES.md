# 🧪 Sistema de Testes para Atualização via SharePoint

Este conjunto de ferramentas permite testar o sistema de atualização automática via SharePoint sem precisar acessar o SharePoint real ou conectar com o SQL Server corporativo.

## 📁 Arquivos de Teste Criados

### Principais
- `EXECUTAR-TESTES.bat` - Interface principal para executar testes (Windows)
- `run-tests.js` - Executor completo de todos os testes
- `test-sharepoint-connection.js` - Teste específico de conexão SharePoint
- `mock-sharepoint-server.js` - Servidor mock para simular SharePoint
- `test-config.js` - Configurações de teste (mock vs produção)

### Arquivos Originais
- `verificar-atualizacoes.js` - Script original de atualização (será testado)

## 🚀 Como Usar

### Opção 1: Interface Simples (Recomendado)
```bash
# No Windows, execute:
EXECUTAR-TESTES.bat
```

### Opção 2: Linha de Comando
```bash
# Teste com servidor mock (seguro)
node run-tests.js --test

# Teste com SharePoint real (requer rede corporativa)  
node run-tests.js --production

# Apenas teste de conexão
node test-sharepoint-connection.js

# Executar servidor mock separadamente
node mock-sharepoint-server.js
```

## 🧪 Tipos de Teste

### 1. Teste Mock (Recomendado para desenvolvimento)
- ✅ Não requer conexão com SharePoint real
- ✅ Simula arquivos de atualização
- ✅ Testa toda a lógica sem riscos
- ✅ Funciona offline

**Como funciona:**
1. Inicia um servidor local na porta 3001
2. Simula a estrutura do SharePoint
3. Fornece arquivos mock para teste de download
4. Testa o fluxo completo de atualização

### 2. Teste Produção (Para validação final)
- ⚠️ Requer conexão com rede corporativa
- ⚠️ Acessa SharePoint real
- ✅ Valida conectividade real
- ✅ Testa permissões de acesso

## 📋 O Que é Testado

### Teste de Conexão
- ✅ Conectividade com URL do SharePoint
- ✅ Status de resposta HTTP
- ✅ Headers de resposta
- ✅ Tempo de resposta

### Teste de Download
- ✅ Download de `versao.json`
- ✅ Download de `backend/server.js`
- ✅ Download de `frontend/app.js`
- ✅ Download de `frontend/style.css`
- ✅ Download de `frontend/index.html`

### Teste de Atualização
- ✅ Comparação de versões
- ✅ Backup de arquivos existentes
- ✅ Aplicação de atualizações
- ✅ Atualização do arquivo de versão

## 📊 Relatórios Gerados

### Arquivos de Saída
- `test-report.json` - Relatório completo com todas as métricas
- `sharepoint-test-results.json` - Resultados detalhados dos testes de conexão
- `test-downloads/` - Diretório com arquivos baixados para teste

### Métricas Incluídas
- Taxa de sucesso dos testes
- Tempo de execução
- Detalhes de erros
- Status de cada arquivo testado
- Configuração utilizada

## ⚙️ Configuração

### Alternar Entre Modos
```javascript
// Em test-config.js, altere:
MODE: 'TEST'     // Para servidor mock
MODE: 'PRODUCTION'  // Para SharePoint real
```

### URLs Configuradas
```javascript
// Produção (SharePoint real)
BASE_URL: 'https://telefonicacorp.sharepoint.com/sites/ESCALONAMENTO_TOP_SIGITM.TMBNL/Shared%20Documents/Demandas'

// Teste (servidor mock)  
BASE_URL: 'http://localhost:3001/Demandas'
```

## 🔧 Solução de Problemas

### Erro: "Cannot connect to SharePoint"
- ✅ Verifique conexão com internet/rede corporativa
- ✅ Confirme se URL do SharePoint está correta
- ✅ Teste com modo mock primeiro

### Erro: "File not found"  
- ✅ Verifique se arquivos existem no SharePoint
- ✅ Confirme permissões de acesso
- ✅ Use servidor mock para teste inicial

### Erro: "Permission denied"
- ✅ Verifique credenciais de acesso ao SharePoint  
- ✅ Confirme permissões na pasta de Demandas
- ✅ Teste com modo mock primeiro

### Servidor Mock Não Inicia
- ✅ Verifique se porta 3001 está livre
- ✅ Execute: `netstat -ano | findstr :3001`
- ✅ Mate processos que estejam usando a porta

## 📝 Exemplo de Uso Passo-a-Passo

### Para Desenvolvimento/Debug:
1. Execute `EXECUTAR-TESTES.bat`
2. Escolha opção 1 (teste mock)
3. Analise os resultados
4. Verifique arquivos em `test-downloads/`
5. Consulte `test-report.json` para detalhes

### Para Validação Final:
1. Conecte-se à rede corporativa
2. Execute `EXECUTAR-TESTES.bat`  
3. Escolha opção 2 (SharePoint real)
4. Confirme quando solicitado
5. Analise conectividade real

## 🎯 Próximos Passos

Após os testes passarem:
1. ✅ Integrar com sistema principal
2. ✅ Configurar execução automática  
3. ✅ Implementar logs de produção
4. ✅ Criar monitoramento de atualizações

## 🆘 Suporte

Se encontrar problemas:
1. Consulte o arquivo `test-report.json` para detalhes
2. Execute apenas teste de conexão primeiro
3. Teste com servidor mock para isolar problemas
4. Verifique logs no console para erros específicos