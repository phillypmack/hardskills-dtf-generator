# 🎯 HardSkills - Gerador de Adesivos DTF UV

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)

**Gerador profissional de adesivos DTF UV com efeito 3D em alto relevo para tecnologias e linguagens de programação**

[Demonstração](#-demonstração) •
[Instalação](#-instalação) •
[Uso](#-como-usar) •
[Documentação](#-documentação) •
[Contribuir](#-contribuindo)

</div>

---

## 📋 Índice

- [Sobre](#-sobre-o-projeto)
- [Características](#-características)
- [Tecnologias](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎨 Sobre o Projeto

O **HardSkills** é uma aplicação web que permite gerar arquivos SVG profissionais para impressão DTF UV (Direct to Film com verniz UV) de adesivos de tecnologias. A aplicação gera automaticamente 3 camadas necessárias para a impressão:

- **🎨 CORES (CMYK)**: Camada colorida para impressão
- **⚪ BRANCO**: Camada base opaca
- **✨ VERNIZ**: Camada de verniz UV para efeito 3D em alto relevo

### 💡 Por que usar?

- ✅ **800+ ícones** de tecnologias, linguagens e ferramentas
- ✅ **424+ modelos SVG locais** - adicione quantos quiser à pasta `svg/`
- ✅ **Carregamento dinâmico** - novos SVGs aparecem automaticamente
- ✅ **Geração automática** das 3 camadas DTF UV
- ✅ **Múltiplos formatos** de papel (A4, A5, A3, Carta, Ofício, Custom)
- ✅ **Formas personalizáveis** (círculo, quadrado, arredondado)
- ✅ **Preview em tempo real** com lupa de ampliação
- ✅ **Sem instalação** - funciona diretamente no navegador

---

## ✨ Características

### 🎯 Funcionalidades Principais

- **Seleção Intuitiva**: Interface drag-free com seleção por clique
- **Busca Inteligente**: Filtro de busca em tempo real
- **Seleção por Categoria**: Selecione categorias inteiras de uma vez
- **Quantidades Personalizadas**: Defina quantidade individual para cada ícone
- **Cálculo Automático**: Calcula automaticamente quantas folhas serão necessárias
- **Preview Interativo**: Visualize como ficará o resultado final com lupa de zoom
- **Exportação Otimizada**: SVGs otimizados prontos para gráfica

### 🎨 Personalizações Disponíveis

| Opção | Valores Disponíveis |
|-------|---------------------|
| **Formato do Papel** | A4, A5, A3, Carta, Ofício, Personalizado |
| **Tamanho do Adesivo** | 10mm, 15mm, 20mm, 25mm, 30mm, 35mm, 40mm |
| **Espaçamento** | 5mm, 10mm, 15mm |
| **Forma** | Círculo, Quadrado, Arredondado |
| **Fundo** | Transparente, Cor do Ícone |

### 📊 Categorias de Tecnologias

<details>
<summary><b>Ver todas as 40+ categorias disponíveis</b></summary>

- 🔥 Top 20 Linguagens
- 🌐 Web Development
- ⚙️ Backend Frameworks
- 💾 Databases
- ☁️ DevOps & Cloud
- 🐧 Linux Distributions
- 🛠️ Ferramentas
- 📱 Mobile Development
- 🧠 IA & Data Science
- 🎨 Design & Prototipação
- 🔧 Testes & Qualidade
- 📦 Package Managers
- 🌟 Frameworks Web
- 🔐 Segurança & Auth
- 📡 APIs & Messaging
- 🎮 Game Development
- 🎯 Jogos & Plataformas (24 ícones: Minecraft, Steam, PlayStation, Xbox, etc.)
  - ⚠️ **Nota**: Simple Icons possui poucos jogos. Para adicionar mais games, veja [SOLUCAO-ICONES-GAMES.md](SOLUCAO-ICONES-GAMES.md)
- 🔨 Build Tools
- 🐳 Containers & Orchestration
- 📊 Monitoring & Analytics
- 🖥️ Editores & IDEs
- 🎯 CMS & E-commerce
- ... e muito mais!

</details>

---

## 🚀 Tecnologias Utilizadas

```json
{
  "frontend": {
    "html": "HTML5 Semântico",
    "css": "CSS3 + Tailwind CSS",
    "javascript": "ES6+ Modules",
    "icons": "DevIcon CDN"
  },
  "features": {
    "svg": "Geração dinâmica de SVG",
    "responsive": "Design responsivo",
    "accessibility": "ARIA labels"
  },
  "build": {
    "bundler": "Vite",
    "modules": "ES6 Modules"
  }
}
```

---

## 📥 Instalação

### Opção 1: Uso Direto (Recomendado para iniciantes)

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/hardskills-adesivos.git
   cd hardskills-adesivos
   ```

2. **Abra o arquivo**:
   ```bash
   # Windows
   start index.html

   # macOS
   open index.html

   # Linux
   xdg-open index.html
   ```

### Opção 2: Com Servidor de Desenvolvimento (Recomendado para desenvolvimento)

1. **Clone e instale dependências**:
   ```bash
   git clone https://github.com/seu-usuario/hardskills-adesivos.git
   cd hardskills-adesivos
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acesse no navegador**:
   ```
   http://localhost:5173
   ```

### Opção 3: Build para Produção

```bash
npm run build
npm run preview
```

Os arquivos otimizados estarão em `dist/`

---

## 📖 Como Usar

### Passo 1: Selecione os Ícones

1. Use a **barra de busca** para encontrar tecnologias específicas
2. **Clique nos ícones** que deseja imprimir
3. Ou clique em **"Selecionar"** para pegar uma categoria inteira
4. Ajuste a **quantidade** de cada ícone selecionado

### Passo 2: Configure as Opções

1. **Formato do Papel**: Escolha A4, A5, A3, etc.
2. **Tamanho do Adesivo**: Defina o tamanho em mm
3. **Espaçamento**: Ajuste o espaço entre adesivos
4. **Forma**: Escolha círculo, quadrado ou arredondado
5. **Fundo**: Transparente ou cor do ícone

### Passo 3: Visualize o Preview

- Passe o mouse sobre o preview para usar a **lupa de ampliação**
- Verifique se está tudo correto
- Veja quantas **folhas serão necessárias**

### Passo 4: Gere os Arquivos

1. Clique em **"Gerar Arquivos DTF UV"**
2. Aguarde o download dos 3 arquivos SVG:
   - `adesivos-CORES-sheet1-de-X.svg`
   - `adesivos-BRANCO-sheet1-de-X.svg`
   - `adesivos-VERNIZ-sheet1-de-X.svg`

### Passo 5: Envie para Gráfica

Envie os **3 arquivos** para a gráfica especializada em DTF UV e especifique:
- Impressão CMYK (arquivo CORES)
- Camada branca (arquivo BRANCO)
- Verniz UV 3D (arquivo VERNIZ)

---

## 📂 Modelos Locais Dinâmicos

### 🎯 Adicione Seus Próprios SVGs!

A aplicação agora **detecta automaticamente** qualquer SVG adicionado à pasta `svg/`:

#### Passo a Passo:

1. **Adicione seu SVG** à pasta `svg/`:
   ```
   Cola/svg/MeuIcone.svg
   ```

2. **Atualize a lista**:
   ```bash
   npm run update-svg-list
   ```
   Ou simplesmente inicie o servidor com `start-server.bat` (atualiza automaticamente)

3. **Pronto!** Acesse "Modelos Locais" e seus SVGs estarão lá! 🎉

#### Documentação Completa:
📖 Veja [COMO_ADICIONAR_NOVOS_SVGS.md](COMO_ADICIONAR_NOVOS_SVGS.md) para guia completo

---

## 📁 Estrutura do Projeto

```
Cola/
├── src/                          # Código fonte
│   ├── index.html               # Página principal
│   ├── css/                     # Estilos
│   │   ├── base/               # Reset e variáveis
│   │   ├── components/         # Componentes CSS
│   │   └── main.css            # CSS principal
│   ├── js/                      # JavaScript
│   │   ├── config/             # Configurações
│   │   │   └── config.js       # Constantes globais
│   │   ├── data/               # Dados
│   │   │   └── languages.js    # Base de tecnologias
│   │   ├── modules/            # Módulos principais
│   │   │   ├── ui.js           # Interface
│   │   │   ├── stats.js        # Estatísticas
│   │   │   ├── svg-generator.js # Geração de SVG
│   │   │   ├── icon-loader.js  # Carregamento de ícones
│   │   │   ├── magnifier.js    # Lupa de zoom
│   │   │   └── preview.js      # Preview
│   │   ├── utils/              # Utilitários
│   │   │   └── helpers.js      # Funções auxiliares
│   │   └── main.js             # Ponto de entrada
│   └── assets/                  # Assets estáticos
│       ├── icons/              # Ícones da UI
│       └── images/             # Imagens
├── dist/                        # Build de produção
├── docs/                        # Documentação
│   ├── SETUP.md                # Guia de instalação
│   └── ARCHITECTURE.md         # Arquitetura técnica
├── tests/                       # Testes
│   ├── unit/                   # Testes unitários
│   └── integration/            # Testes de integração
├── .gitignore                   # Arquivos ignorados pelo Git
├── package.json                 # Dependências e scripts
├── vite.config.js              # Configuração do Vite
└── README.md                    # Este arquivo
```

---

## 📚 Documentação

### Documentação Técnica

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Arquitetura detalhada do sistema
- **[SETUP.md](docs/SETUP.md)** - Guia completo de instalação
- **[API.md](docs/API.md)** - Documentação das funções e módulos

### Exemplos de Uso

```javascript
// Exemplo: Adicionar nova categoria de tecnologias
import { languagesData } from './src/js/data/languages.js';

languagesData["🆕 Minha Categoria"] = [
    { name: "Tecnologia", devicon: "tech", color: "#ff0000" }
];
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Diretrizes

- Mantenha o código limpo e bem documentado
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Siga o padrão de código existente

---

## 🐛 Reportar Bugs

Encontrou um bug? Por favor, abra uma [issue](https://github.com/seu-usuario/hardskills-adesivos/issues) com:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs. comportamento atual
- Screenshots (se aplicável)
- Navegador e versão

---

## 📝 Roadmap

- [ ] Suporte a ícones personalizados (upload de SVG)
- [ ] Exportação em outros formatos (PNG, PDF)
- [ ] Templates prontos (laptop, caneca, etc.)
- [ ] Modo escuro/claro
- [ ] Internacionalização (i18n)
- [ ] PWA (Progressive Web App)
- [ ] API REST para integração

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Perfil](https://linkedin.com/in/seu-perfil)

---

## 🙏 Agradecimentos

- [DevIcon](https://devicon.dev/) - Pelos incríveis ícones de tecnologias
- [Tailwind CSS](https://tailwindcss.com/) - Pelo framework CSS
- Comunidade de desenvolvedores que contribuíram com feedback

---

## 📞 Suporte

Se você gostou do projeto, considere:

- ⭐ Dar uma estrela no repositório
- 🐛 Reportar bugs
- 💡 Sugerir novas features
- 🤝 Contribuir com código

---

<div align="center">

**Feito com ❤️ e muita ☕**

[⬆ Voltar ao topo](#-hardskills---gerador-de-adesivos-dtf-uv)

</div>
