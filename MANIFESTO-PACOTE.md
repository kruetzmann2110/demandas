# 📦 MANIFESTO DO PACOTE DE PRODUÇÃO

## 🎯 Informações do Pacote

- **Sistema**: Sistema de Demandas Governança TOP
- **Versão**: 2.0.1
- **Tipo**: Pacote completo para produção
- **Ambiente**: Windows com Node.js
- **Suporte**: Ambiente corporativo com proxy/firewall

## 📋 Arquivos Incluídos

### 🚀 Sistema Principal
```
startup-with-updates.js           # Sistema de inicialização com auto-update
INICIAR-COM-GITHUB.bat           # Script principal de inicialização
package.json                     # Dependências do projeto
README.md                        # Documentação geral
version.json                     # Controle de versão local
```

### 🔧 Scripts de Sistema
```
scripts/
├── github-update-system.js      # Sistema de update padrão
├── corporate-downloader.js      # Fallback para ambiente corporativo
├── preparar-producao.js         # Verificação de arquivos
└── gerar-pacote-producao.js     # Gerador deste pacote
```

### 🖥️ Backend
```
backend/
├── server.js                    # Servidor Express principal
└── users-auth.json             # Autenticação de usuários
```

### 🌐 Frontend
```
web/
├── index.html                   # Interface principal
├── js/
│   └── app.js                   # JavaScript da aplicação
└── css/
    └── style.css               # Estilos da aplicação
```

### 📦 Releases e Configuração
```
releases/
└── versao.json                 # Arquivo de versão para updates

.gitignore                      # Configuração Git
```

### 🔧 Ferramentas de Suporte
```
TESTAR-CONECTIVIDADE-CORPORATIVA.bat  # Teste de conectividade
CORRIGIR-PRODUCAO.bat                  # Correção automática
INSTALAR-SISTEMA-COMPLETO.bat         # Instalação completa
diagnostico-producao.js               # Diagnóstico de problemas
```

### 📚 Documentação
```
docs/
└── instalacao.md               # Guia detalhado de instalação

SOLUCAO-PRODUCAO.md             # Soluções para produção
SOLUCAO-CORPORATIVA.md          # Soluções para ambiente corporativo
INSTRUCOES-INSTALACAO.txt       # Instruções rápidas (gerado automaticamente)
```

### ⚙️ Arquivos Opcionais (se disponíveis)
```
config/
├── database.json               # Configuração do banco (opcional)
└── auth.json                   # Configuração de autenticação (opcional)

web/js/dashboard.js             # Dashboard avançado (opcional)
web/css/dashboard.css           # Estilos do dashboard (opcional)
scripts/verificar-atualizacoes.js  # Sistema SharePoint (opcional)
```

## 🎯 Funcionalidades Incluídas

### ✅ Auto-Update
- Verificação automática de atualizações no GitHub
- Fallback para ambiente corporativo (curl/PowerShell)
- Funcionamento offline se GitHub inacessível
- Múltiplos métodos de download

### ✅ Ambiente Corporativo
- Bypass de certificados SSL
- Compatibilidade com proxy/firewall
- Fallback automático para diferentes métodos
- Detecção automática de ambiente

### ✅ Ferramentas de Diagnóstico
- Teste completo de conectividade
- Verificação de arquivos
- Correção automática de problemas
- Instalação completa automatizada

### ✅ Documentação Completa
- Guias de instalação
- Soluções para problemas comuns
- Instruções específicas para ambiente corporativo
- Suporte técnico

## 🚀 Requisitos de Instalação

### Software Necessário
- **Node.js 16+** - [Download](https://nodejs.org)
- **Windows 10/11** - Para execução dos scripts .bat
- **Acesso à rede** - Para download de dependências (npm install)

### Permissões
- Execução de arquivos .bat
- Instalação de pacotes npm
- Acesso à pasta de instalação

### Dependências NPM
```bash
npm install express mssql
```

## 📖 Instruções de Uso

### 1. Instalação Básica
```bash
# 1. Extrair ZIP em uma pasta
# 2. Abrir CMD na pasta
# 3. Instalar dependências
npm install express mssql

# 4. Iniciar sistema
INICIAR-COM-GITHUB.bat
```

### 2. Instalação Automatizada
```bash
# Executar instalador completo
INSTALAR-SISTEMA-COMPLETO.bat
```

### 3. Diagnóstico de Problemas
```bash
# Testar conectividade
TESTAR-CONECTIVIDADE-CORPORATIVA.bat

# Diagnosticar problemas
node diagnostico-producao.js

# Corrigir automaticamente
CORRIGIR-PRODUCAO.bat
```

## 🔗 Acesso ao Sistema

- **URL Principal**: http://localhost:3000
- **Dashboard**: http://localhost:3000/index.html
- **API**: http://localhost:3000/api/demands

## 📞 Suporte Técnico

- **Email**: fabiano.kruetzmann@telefonica.com
- **GitHub Issues**: https://github.com/kruetzmann2110/demandas/issues
- **Repositório**: https://github.com/kruetzmann2110/demandas

---

✅ **Pacote completo e testado para ambiente de produção corporativo**