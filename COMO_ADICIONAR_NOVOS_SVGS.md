# 📂 Como Adicionar Novos SVGs aos Modelos Locais

## 🎯 Visão Geral

A aplicação agora **detecta automaticamente** qualquer arquivo SVG adicionado à pasta `svg/`.
Não é mais necessário editar código manualmente!

---

## ✨ Passo a Passo Simples

### 1. Adicione seus arquivos SVG

Copie qualquer arquivo `.svg` para a pasta:
```
Cola/svg/
```

**Exemplo:**
```
Cola/svg/MeuNovoIcone.svg
Cola/svg/Logo-Empresa.svg
Cola/svg/Personagem-Jogo.svg
```

### 2. Atualize a lista de SVGs

Execute **UM** dos comandos abaixo:

#### Opção A - Usando NPM (Recomendado)
```bash
npm run update-svg-list
```

#### Opção B - Usando Node.js diretamente
```bash
node generate-svg-list.cjs
```

#### Opção C - Inicie o servidor (atualiza automaticamente)
```bash
start-server.bat
```
O script `start-server.bat` já atualiza a lista automaticamente antes de iniciar o servidor!

### 3. Pronto!

Acesse a aplicação em http://localhost:5173 e clique na aba **"Modelos Locais"**.
Seus novos SVGs aparecerão automaticamente na lista! 🎉

---

## 📋 Regras e Boas Práticas

### ✅ Formatos Aceitos
- **Extensão**: Apenas arquivos `.svg` (case-insensitive)
- **Nome**: Qualquer nome de arquivo válido no Windows
- **Tamanho**: Sem limite (mas SVGs menores = carregamento mais rápido)

### 💡 Dicas de Nomenclatura

**Bom:**
```
React.svg
Node.js.svg
Python-3.11.svg
Adobe-Photoshop.svg
```

**Evite:**
```
icone final (1).svg          ❌ Espaços e parênteses podem causar problemas
meu_arquivo.SVG              ⚠️  Funciona, mas prefira .svg minúsculo
ícone-português.svg          ⚠️  Acentos podem causar problemas em alguns sistemas
```

### 🎨 Preparando SVGs para DTF UV

Para melhores resultados na impressão DTF UV:

1. **Cores Originais**: Mantenha as cores originais do SVG
   - A camada CORES preservará as cores exatamente como estão

2. **Fundo Transparente**: Remova fundos brancos/pretos
   - Use um editor SVG (Inkscape, Illustrator, Figma)

3. **Tamanho do Viewbox**: Recomendado entre 100x100 e 512x512

4. **Otimização**: Simplifique paths complexos quando possível

---

## 🔧 Solução de Problemas

### Problema: "Meu SVG não aparece!"

**Solução:**
1. Verifique se o arquivo está na pasta `svg/` (não em subpastas)
2. Confirme que a extensão é `.svg`
3. Execute: `npm run update-svg-list`
4. Recarregue a página (Ctrl+F5)

### Problema: "svg-list.json não encontrado"

**Solução:**
```bash
npm run update-svg-list
```

### Problema: "Erro ao carregar modelos locais"

**Solução:**
1. Certifique-se de estar usando um servidor HTTP local
2. Não abra `index.html` diretamente (use http://localhost:5173)
3. Verifique o Console do navegador (F12) para erros específicos

---

## 📊 Estatísticas

Atualmente você tem:
- **424 modelos SVG** locais disponíveis
- Carregamento **100% dinâmico**
- **Zero** manutenção de código necessária

---

## 🚀 Fluxo de Trabalho Recomendado

```bash
# 1. Adicione SVGs à pasta svg/
cp MeuIcone.svg Cola/svg/

# 2. Atualize a lista (ou use start-server.bat)
npm run update-svg-list

# 3. Inicie o servidor (se ainda não estiver rodando)
npm run dev
# OU
start-server.bat

# 4. Acesse http://localhost:5173
# 5. Clique em "Modelos Locais"
# 6. Selecione seus novos ícones!
```

---

## 💻 Para Desenvolvedores

### Estrutura de Arquivos

```
Cola/
├── svg/                          # Pasta com todos os SVGs
│   ├── React.svg
│   ├── Python.svg
│   └── ...424 arquivos...
├── svg-list.json                 # Lista gerada automaticamente
├── generate-svg-list.cjs         # Script de geração
└── js/script.js                  # Código que carrega os SVGs
```

### Como Funciona

1. **`generate-svg-list.cjs`** lê a pasta `svg/` e gera `svg-list.json`
2. **`loadLocalModels()`** faz fetch do `svg-list.json`
3. Cada SVG é mapeado para um objeto com `name`, `filename`, `path`
4. A UI renderiza automaticamente todos os modelos

### Modificando o Script de Geração

Edite `generate-svg-list.cjs` para:
- Adicionar metadados extras
- Filtrar arquivos específicos
- Categorizar SVGs automaticamente
- Extrair cores dominantes

---

## ✅ Checklist de Testes

Antes de usar em produção:

- [ ] Execute `npm run update-svg-list`
- [ ] Verifique que `svg-list.json` foi criado/atualizado
- [ ] Inicie o servidor (`npm run dev` ou `start-server.bat`)
- [ ] Acesse http://localhost:5173
- [ ] Clique em "Modelos Locais"
- [ ] Confirme que todos os SVGs aparecem
- [ ] Teste a busca
- [ ] Gere adesivos de teste
- [ ] Verifique as 3 camadas (CORES, BRANCO, VERNIZ)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Leia a mensagem de erro
3. Consulte este guia
4. Execute `npm run update-svg-list` novamente

---

## 🎉 Agora é Só Usar!

**Adicione quantos SVGs quiser à pasta `svg/`** - eles aparecerão automaticamente!

Não é mais necessário:
- ❌ Editar código
- ❌ Listar arquivos manualmente
- ❌ Reiniciar a aplicação

Basta:
- ✅ Adicionar SVG à pasta
- ✅ Executar `npm run update-svg-list`
- ✅ Recarregar a página

**Aproveite seus modelos ilimitados!** 🚀
