# Sistema de Demandas Governança TOP

🏢 **Sistema de gestão de demandas com auto-atualização via GitHub**

## 📋 Descrição

Sistema Node.js para gestão de demandas empresariais com:
- ✅ Dashboard moderno e interativo
- 📊 Ranking por categorias
- 📈 Timeline de atividades
- 🔄 Auto-atualização via GitHub
- 📱 Interface responsiva

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+ instalado
- Acesso ao SQL Server (configurado)

### Passos de Instalação

1. **Baixar o sistema**
   ```bash
   git clone https://github.com/kruetzmann2110/demandas.git
   cd demandas
   ```

2. **Instalar dependências**
   ```bash
   npm install express mssql
   ```

3. **Configurar banco de dados**
   - Editar `backend/server.js` com suas credenciais SQL Server

4. **Iniciar sistema**
   - Execute: `INICIAR-COM-GITHUB.bat`
   - Ou: `node startup-with-updates.js`

## 🔄 Auto-Atualização

O sistema verifica automaticamente por atualizações neste repositório GitHub a cada inicialização.

### Estrutura de Releases

Os arquivos de atualização ficam na pasta `releases/`:
- `releases/versao.json` - Informações da versão
- `releases/backend/` - Arquivos do servidor
- `releases/web/` - Arquivos do frontend

### Versão Atual

**v2.0.0** - Sistema completo com dashboard e auto-update

## 📊 Funcionalidades

- 📝 **Gestão de Demandas**: Criar, editar e acompanhar demandas
- 📈 **Dashboard**: Gráficos e métricas em tempo real
- 🏆 **Rankings**: Classificação por categorias (Op1, Ql2, An3...)
- 📅 **Timeline**: Histórico completo de atividades
- 📤 **Export**: Exportação para Excel
- 🔐 **Segurança**: Autenticação e controle de acesso

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Banco**: SQL Server
- **Auto-Update**: GitHub API

## 🚨 Resolução de Problemas

### Erro: "Cannot find module startup-with-updates.js"

**Causa**: Arquivo não foi copiado para produção

**Solução Rápida**:
```bash
# 1. Baixar arquivo essencial
curl -o startup-with-updates.js https://raw.githubusercontent.com/kruetzmann2110/demandas/main/startup-with-updates.js

# 2. Baixar sistema de update
mkdir scripts
curl -o scripts/github-update-system.js https://raw.githubusercontent.com/kruetzmann2110/demandas/main/scripts/github-update-system.js

# 3. Testar
node startup-with-updates.js --test
```

**Solução Completa**:
1. Execute o diagnóstico: `node diagnostico-producao.js`
2. Ou baixe o instalador: `INSTALAR-SISTEMA-COMPLETO.bat`
3. Ou clone o repositório: `git clone https://github.com/kruetzmann2110/demandas.git .`

### Outros Problemas

- **Node.js não encontrado**: Instalar Node.js LTS
- **Dependências**: `npm install express mssql`
- **Conexão GitHub**: Verificar internet

## 📞 Suporte

Para suporte técnico ou dúvidas:
- 📧 Email: fabiano.kruetzmann@telefonica.com
- 🐛 Issues: Abra uma issue neste repositório

---

🔄 **Auto-update ativo** - O sistema se atualiza automaticamente a partir deste repositório.