# 📋 Guia de Instalação - Sistema de Demandas

## 🎯 Objetivo
Este guia orienta a instalação do Sistema de Demandas Governança TOP nas máquinas dos colaboradores.

## 📋 Pré-requisitos

### Software Necessário
- **Node.js 16+** - [Download aqui](https://nodejs.org)
- **Acesso ao SQL Server** - Configurado pela TI
- **Windows 10/11** - Para execução dos scripts .bat

### Permissões
- Execução de arquivos .bat
- Instalação de pacotes npm
- Acesso à rede para GitHub

## 🚀 Instalação

### Método 1: Download via Git (Recomendado)
```bash
# 1. Clonar o repositório
git clone https://github.com/kruetzmann2110/demandas.git

# 2. Entrar na pasta
cd demandas

# 3. Instalar dependências
npm install express mssql

# 4. Iniciar sistema
INICIAR-COM-GITHUB.bat
```

### Método 2: Download manual
1. Baixar ZIP do repositório GitHub
2. Extrair para uma pasta (ex: `C:\SistemaDemandas`)
3. Abrir CMD nesta pasta
4. Executar: `npm install express mssql`
5. Executar: `INICIAR-COM-GITHUB.bat`

## ⚙️ Configuração

### Banco de Dados
O sistema já vem configurado para o servidor:
- **Servidor**: 10.124.100.94
- **Base**: b2b
- **Usuário**: AUTOMACAO_B2B

### Usuários
O sistema detecta automaticamente o usuário Windows logado.

## 🔄 Auto-Atualização

O sistema verifica atualizações automaticamente:
- ✅ **A cada inicialização** verifica o GitHub
- ✅ **Baixa automaticamente** novos arquivos
- ✅ **Reinicia** se houver atualizações
- ✅ **Funciona offline** se GitHub inacessível

## 🛠️ Resolução de Problemas

### Node.js não encontrado
```bash
# Instalar Node.js LTS
# Reiniciar o computador
# Verificar instalação: node --version
```

### Erro de conexão
- Verificar conectividade de rede
- Verificar acesso ao SQL Server
- Contatar TI se necessário

### Sistema não inicia
- Executar como Administrador
- Verificar antivírus
- Executar: `node startup-with-updates.js --test`

## 📞 Suporte

**TI Interna:**
- 📧 Email: fabiano.kruetzmann@telefonica.com
- 🐛 Issues: https://github.com/kruetzmann2110/demandas/issues

**Acesso:**
- 🌐 **Local**: http://localhost:3000
- 📊 **Dashboard**: http://localhost:3000/index.html

---

✅ **Sistema pronto para uso com auto-update via GitHub!**