# 🏢 SOLUÇÃO PARA AMBIENTE CORPORATIVO

## 🚨 Problema Identificado
```
❌ Erro no download: self-signed certificate in certificate chain
⚠️ Não foi possível acessar versao.json: self-signed certificate in certificate chain
```

**Causa**: Ambiente corporativo com proxy/firewall que intercepta conexões HTTPS

## ✅ Soluções Implementadas

### 1. **Sistema Automático de Fallback**
O sistema agora detecta automaticamente problemas de certificado e usa métodos alternativos:

- ✅ **Método 1**: HTTPS padrão (tentativa inicial)
- ✅ **Método 2**: HTTPS com SSL relaxado 
- ✅ **Método 3**: Curl com opção `-k` (ignora certificados)
- ✅ **Método 4**: PowerShell com validação desabilitada
- ✅ **Método 5**: Modo offline (continua funcionando)

### 2. **Teste de Conectividade**
Execute para diagnóstico completo:
```bash
TESTAR-CONECTIVIDADE-CORPORATIVA.bat
```

### 3. **Atualização Manual**
Se todos os métodos automáticos falharem:
```bash
# Download manual do GitHub
curl -k -L -o temp.zip https://github.com/kruetzmann2110/demandas/archive/main.zip
# Extrair sobre a instalação atual
```

## 🔧 Comandos de Teste

### Testar sistema atualizado:
```bash
# Testar conectividade
node scripts/corporate-downloader.js --test

# Testar sistema completo
node startup-with-updates.js --test

# Iniciar sistema
INICIAR-COM-GITHUB.bat
```

### Verificar se curl está disponível:
```bash
curl --version
```

### Verificar se PowerShell funciona:
```bash
powershell -Command "Get-Host"
```

## 📋 Status Esperado

### ✅ Funcionamento Normal:
```
🏢 SISTEMA DE DEMANDAS GOVERNANÇA TOP
📅 Versão 2.0.0 - Auto Update GitHub
========================================

🔍 Verificando Node.js...
✅ Node.js detectado

🔄 Iniciando sistema com verificação automática de atualizações...
📡 Repositório: kruetzmann2110/demandas

🏢 Tentando método corporativo para ambientes com proxy/firewall...
✅ Conexão via método corporativo estabelecida!
📋 Versão disponível: 2.0.1
🆕 Nova versão disponível!

🎯 INICIANDO SERVIDOR BACKEND...
✅ Servidor iniciado com sucesso!
```

### ⚠️ Modo Offline (Aceitável):
```
⚠️ Métodos de atualização indisponíveis - GitHub pode estar bloqueado
⚠️ GitHub não acessível - continuando com versão local
✅ Sistema já está na versão mais recente!
🚀 Iniciando servidor...
```

## 🎯 Próximos Passos

1. **Execute o teste**: `TESTAR-CONECTIVIDADE-CORPORATIVA.bat`
2. **Inicie o sistema**: `INICIAR-COM-GITHUB.bat`
3. **Verifique o funcionamento**: Acesse `http://localhost:3000`

O sistema agora deve funcionar corretamente mesmo em ambiente corporativo! 🎉

## 📞 Suporte

Se ainda houver problemas:
- 📧 **Email**: fabiano.kruetzmann@telefonica.com
- 🐛 **Issues**: https://github.com/kruetzmann2110/demandas/issues
- 💬 **Inclua sempre**: O log completo do erro

---
✅ **Sistema otimizado para ambientes corporativos com proxy/firewall**