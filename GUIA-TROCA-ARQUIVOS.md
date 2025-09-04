# 📋 GUIA: Quais Arquivos Trocar em Produção

## 🎯 **DUAS OPÇÕES DISPONÍVEIS**

### **OPÇÃO 1: NOVO PACOTE ZIP COMPLETO** ✅ (RECOMENDADO)
- **Arquivo**: `sistema-demandas-producao-20250904-1457.zip` (103 KB)
- **Local**: `c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\`
- **Vantagem**: Substitui tudo, garantia total de funcionamento

### **OPÇÃO 2: TROCAR APENAS ARQUIVOS ESPECÍFICOS**

## 🔧 **ARQUIVOS QUE DEVEM SER TROCADOS** (Opção 2)

### **1️⃣ ARQUIVO PRINCIPAL** (OBRIGATÓRIO)
```
📄 startup-with-updates.js
   📍 De: c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\startup-with-updates.js
   📍 Para: C:\Users\g0040925\OneDrive - Telefonica\Desktop\Producao\github\git2\
   🔧 Motivo: Corrigida lógica de reinicialização
```

### **2️⃣ SISTEMA DE UPDATE** (OBRIGATÓRIO)
```
📄 scripts\github-update-system.js
   📍 De: c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\scripts\github-update-system.js
   📍 Para: C:\Users\g0040925\OneDrive - Telefonica\Desktop\Producao\github\git2\scripts\
   🔧 Motivo: Versão atualizada para 2.0.2
```

### **3️⃣ FRONTEND ATUALIZADO** (OBRIGATÓRIO)
```
📄 web\index.html
   📍 De: c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\web\index.html
   📍 Para: C:\Users\g0040925\OneDrive - Telefonica\Desktop\Producao\github\git2\web\
   🔧 Motivo: Badge atualizada para v2.0.2
```

### **4️⃣ CONTROLE DE VERSÃO** (OBRIGATÓRIO)
```
📄 version.json
   📍 De: c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\version.json
   📍 Para: C:\Users\g0040925\OneDrive - Telefonica\Desktop\Producao\github\git2\
   🔧 Motivo: Versão local atualizada para 2.0.2
```

## 📂 **ESTRUTURA COMPLETA PARA VERIFICAÇÃO**

Sua pasta de produção deve ter esta estrutura:
```
C:\Users\g0040925\OneDrive - Telefonica\Desktop\Producao\github\git2\
├── startup-with-updates.js          ⬅️ TROCAR
├── INICIAR-COM-GITHUB.bat            ✅ OK
├── version.json                      ⬅️ TROCAR
├── package.json                      ✅ OK
├── scripts\
│   ├── github-update-system.js      ⬅️ TROCAR
│   └── corporate-downloader.js      ✅ OK
├── backend\
│   └── server.js                     ✅ OK (será atualizado via GitHub)
└── web\
    ├── index.html                    ⬅️ TROCAR
    ├── js\app.js                     ✅ OK (será atualizado via GitHub)
    └── css\style.css                 ✅ OK (será atualizado via GitHub)
```

## 🚀 **COMO FAZER A TROCA MANUAL**

### **Passo 1: Backup** (Recomendado)
```bash
# Na pasta de produção:
xcopy *.* backup\ /E /Y
```

### **Passo 2: Copiar Arquivos**
```bash
# Copiar do desenvolvimento para produção:
copy "c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\startup-with-updates.js" .
copy "c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\scripts\github-update-system.js" scripts\
copy "c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\web\index.html" web\
copy "c:\Users\fabia\OneDrive\Área de Trabalho\Sharepoint\version.json" .
```

### **Passo 3: Testar**
```bash
# Verificar se tudo está correto:
node startup-with-updates.js --test

# Iniciar sistema:
INICIAR-COM-GITHUB.bat
```

## 🎯 **RESULTADO ESPERADO**

Após a troca, o sistema deve:

1. **Detectar versão 2.0.2** no GitHub
2. **Baixar atualizações** automaticamente
3. **Aguardar 3 segundos** após atualização
4. **Continuar execução** (não finalizar!)
5. **Inicializar servidor** normalmente
6. **Mostrar**: "v2.0.2 🚀 Testando!" na navbar

## ⚠️ **PONTOS DE ATENÇÃO**

### **Se usar OPÇÃO 1 (ZIP):**
✅ Substitui tudo - funcionamento garantido  
✅ Inclui todas as correções  
✅ Inclui ferramentas de diagnóstico  

### **Se usar OPÇÃO 2 (Manual):**
⚠️ Certifique-se de trocar TODOS os 4 arquivos listados  
⚠️ Mantenha a estrutura de pastas  
⚠️ Faça backup antes  

## 🔄 **O QUE VAI ACONTECER APÓS A TROCA**

```
========================================
🏢 SISTEMA DE DEMANDAS GOVERNANÇA TOP
📅 Versão 2.0.2 - Auto Update GitHub
========================================

🔍 VERIFICANDO ATUALIZAÇÕES...
📋 Versão GitHub: 2.0.2
✅ Sistema já está na versão mais recente!
🚀 Iniciando servidor...

🎯 INICIANDO SERVIDOR BACKEND...
✅ Servidor iniciado com sucesso!
🌐 Acesse: http://localhost:3000

🔥 SISTEMA DE DEMANDAS FUNCIONANDO!
```

## 📞 **Suporte**

Se algo der errado:
- 📧 **Email**: fabiano.kruetzmann@telefonica.com
- 🧪 **Teste**: `node startup-with-updates.js --test`
- 🔧 **Diagnóstico**: `node diagnostico-producao.js`

---

## 🎉 **RESUMO**

**✅ RECOMENDADO**: Use o ZIP `sistema-demandas-producao-20250904-1457.zip`  
**🔧 ALTERNATIVA**: Troque manualmente os 4 arquivos listados  
**🎯 OBJETIVO**: Sistema de auto-update funcionando completamente!