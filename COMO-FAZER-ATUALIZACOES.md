# 🔄 GUIA COMPLETO: Como Fazer Atualizações via GitHub

## 🎯 **Processo de Atualização Automática**

O sistema verifica automaticamente por atualizações a cada inicialização. Quando uma nova versão é detectada, os arquivos são baixados e aplicados automaticamente.

## 📋 **Passo a Passo para Fazer Atualizações**

### **1️⃣ FAZER ALTERAÇÕES NO CÓDIGO**

#### **Frontend (Interface do Usuário)**
```html
# Arquivos que você pode modificar:
- web/index.html          # Página principal
- web/js/app.js           # JavaScript da aplicação
- web/css/style.css       # Estilos CSS
```

#### **Backend (Servidor)**
```javascript
# Arquivos que você pode modificar:
- backend/server.js       # Servidor principal
- backend/users-auth.json # Usuários autorizados
```

#### **Exemplo de Alteração Frontend:**
```html
<!-- Em web/index.html -->
<title>Sistema de Demandas v2.0.1 - Nova Funcionalidade</title>

<!-- Adicionar badge de versão -->
<span class="badge bg-success">v2.0.1 🔄</span>
```

#### **Exemplo de Alteração Backend:**
```javascript
// Em backend/server.js
app.get('/version', (req, res) => {
    res.json({ 
        version: '2.0.1',
        updated: new Date(),
        message: 'Nova funcionalidade adicionada!'
    });
});
```

### **2️⃣ ATUALIZAR ARQUIVO DE VERSÃO**

**OBRIGATÓRIO**: Sempre atualizar `releases/versao.json`:

```json
{
  "version": "2.0.2",                    // ⬅️ INCREMENTE A VERSÃO
  "updated_at": "2025-09-04T18:00:00.000Z",
  "changelog": "Descrição das alterações feitas",
  "components": {
    "backend": {
      "version": "2.0.2",              // ⬅️ SE ALTEROU BACKEND
      "last_update": "2025-09-04T18:00:00.000Z",
      "changes": ["Nova API de versão", "Melhorias de performance"]
    },
    "frontend": {
      "version": "2.0.2",              // ⬅️ SE ALTEROU FRONTEND
      "last_update": "2025-09-04T18:00:00.000Z",
      "changes": ["Novo layout", "Badge de versão", "Correções de CSS"]
    }
  }
}
```

### **3️⃣ ENVIAR PARA GITHUB**

```bash
# 1. Adicionar arquivos alterados
git add .

# 2. Fazer commit com mensagem descritiva
git commit -m "✨ v2.0.2: Nova funcionalidade XYZ adicionada"

# 3. Enviar para GitHub
git push
```

### **4️⃣ TESTAR A ATUALIZAÇÃO**

#### **Em Desenvolvimento:**
```bash
# Testar se o sistema detecta a nova versão
node startup-with-updates.js --test

# Simular atualização
node startup-with-updates.js
```

#### **Em Produção:**
```
1. Reiniciar o sistema: INICIAR-COM-GITHUB.bat
2. O sistema deve detectar: "🆕 NOVA VERSÃO DISPONÍVEL: 2.0.2"
3. Arquivos serão baixados automaticamente
4. Sistema reinicia com nova versão
```

## 🚀 **EXEMPLO PRÁTICO COMPLETO**

### **Cenário**: Adicionar nova funcionalidade no dashboard

#### **1. Modificar Frontend**
```html
<!-- Em web/index.html -->
<li class="nav-item">
    <a class="nav-link" href="#" id="nav-new-feature">
        <i class="fas fa-star me-1"></i>Nova Funcionalidade
    </a>
</li>
```

#### **2. Modificar JavaScript**
```javascript
// Em web/js/app.js
document.getElementById('nav-new-feature').addEventListener('click', function() {
    showNewFeature();
});

function showNewFeature() {
    // Sua nova funcionalidade aqui
    alert('Nova funcionalidade v2.0.2!');
}
```

#### **3. Atualizar Versão**
```json
// Em releases/versao.json
{
  "version": "2.0.2",
  "updated_at": "2025-09-04T18:30:00.000Z",
  "changelog": "Adicionada nova funcionalidade no menu principal",
  "components": {
    "frontend": {
      "version": "2.0.2",
      "changes": ["Nova funcionalidade no menu", "Botão 'Nova Funcionalidade' adicionado"]
    }
  }
}
```

#### **4. Commit e Push**
```bash
git add .
git commit -m "✨ v2.0.2: Adicionada nova funcionalidade no menu"
git push
```

## 📊 **TIPOS DE VERSÃO**

### **Incremento de Versão:**
- **2.0.1 → 2.0.2**: Pequenas melhorias, correções
- **2.0.x → 2.1.0**: Novas funcionalidades
- **2.x.x → 3.0.0**: Grandes mudanças, refatoração

### **Arquivos que Acionam Update:**
- `web/index.html` - Interface principal
- `web/js/app.js` - JavaScript 
- `web/css/style.css` - Estilos
- `backend/server.js` - Servidor
- `releases/versao.json` - **OBRIGATÓRIO**

## 🔧 **DICAS IMPORTANTES**

### ✅ **Boas Práticas:**
1. **Sempre teste localmente** antes de fazer push
2. **Incremente a versão** em `releases/versao.json`
3. **Use mensagens descritivas** nos commits
4. **Faça backup** antes de grandes mudanças
5. **Teste em produção** após atualização

### ⚠️ **Cuidados:**
1. **Não quebre** funcionalidades existentes
2. **Mantenha compatibilidade** com dados existentes
3. **Teste em ambiente corporativo** se possível
4. **Monitore logs** após atualização

### 🔄 **Como o Sistema Funciona:**
1. **Inicialização**: Sistema verifica `releases/versao.json` no GitHub
2. **Comparação**: Compara versão local vs GitHub
3. **Download**: Se nova versão, baixa arquivos atualizados
4. **Aplicação**: Substitui arquivos locais
5. **Reinício**: Reinicia sistema com nova versão

## 📞 **Suporte**

Se algo der errado:
- 🔄 **Rollback**: Reverta o commit no GitHub
- 🧪 **Teste**: Use `node startup-with-updates.js --test`
- 🏢 **Corporativo**: Use `TESTAR-CONECTIVIDADE-CORPORATIVA.bat`
- 📧 **Email**: fabiano.kruetzmann@telefonica.com

---

✅ **Agora você sabe como fazer atualizações que serão automaticamente distribuídas para todos os usuários via GitHub!**