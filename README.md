# Debian Silk OS

Simulação de um desktop Linux (estilo Debian + OpenKylin) construída em **React 19 + Vite + Tailwind CSS v4**, com visual de vidro fosco (*acrylic*), barra de tarefas personalizável e gerenciador de janelas próprio.

## Requisitos

- [Bun](https://bun.sh) (gerenciador de pacotes e runner de testes)
- Node.js 18+ apenas para referência de compatibilidade; o projeto usa Bun para instalar e testar.

## Início rápido

```bash
bun install        # instala dependências (respeita o lockfile)
bun run dev        # servidor de desenvolvimento em http://localhost:3000
```

## Scripts

| Script | O que faz |
| --- | --- |
| `bun run dev` | Sobe o Vite na porta 3000, escutando em `0.0.0.0` |
| `bun run build` | Gera o build de produção em `dist/` |
| `bun run preview` | Serve o build de produção localmente |
| `bun run lint` | Checagem de tipos com `tsc --noEmit` |
| `bun test` | Roda os testes (`src/**/*.test.ts`) |
| `bun run check` | `lint` + `test` juntos — use antes de commitar |
| `bun run clean` | Remove `dist/` e `server.js` |

## Recursos

- **Barra de tarefas personalizável** — posição (topo/base/esquerda/direita), modo *dock* ou painel, tamanho, opacidade, blur, auto-ocultar, ícones centralizados, botão "mostrar área de trabalho", brilho de ícones e modos do Menu Iniciar.
- **Sistema de cor de destaque** — o seletor "Cor de Destaque" publica `--accent-color` e todas as utilitárias (`bg-accent`, `text-accent`, `border-accent`, `ring-accent`…) seguem essa variável, então a cor escolhida temaiza a interface inteira. Seis cores disponíveis (Azul Silk, Debian Rubro, Verde OpenKylin, Grafite Nórdico, Índigo Profundo, Âmbar Executivo).
- **Temas e transparência** — modo claro/escuro, quatro papéis de parede e acabamento acrílico ligável.
- **Gerenciador de janelas** — arrastar pela barra de título, maximizar/restaurar (duplo clique), minimizar, fechar, snap em metades e **redimensionamento pelas 8 bordas** com tamanho mínimo de 320×200.
- **Aplicativos implementados** — Central de Personalização, Terminal Silk, Gerenciador de Arquivos, Debian Software Hub e Monitor de Recursos. Os demais itens do catálogo abrem uma janela provisória.
- **Menu Iniciar** — busca, categorias e dois modos (convencional ou *launchpad* em tela cheia).
- **Central de Ações, Calendário e Notificações** — painéis flutuantes ancorados na barra, acessíveis por teclado (`Esc` fecha qualquer um).
- **Persistência** — tema, cor de destaque, papel de parede, acrílico, tamanho de ícones e todas as preferências da barra ficam em `localStorage`, com validação dos valores lidos.
- **Acessibilidade** — foco de teclado visível na cor de destaque, `role="dialog"` nos painéis, `aria-label`/`aria-expanded` nos botões da barra, navegação nos ícones da área de trabalho via `Enter`/`Espaço` e respeito a `prefers-reduced-motion`.

## Estrutura do projeto

```
src/
├── App.tsx                     # estado global, persistência e composição do desktop
├── index.css                   # tema base + utilitárias de destaque (Tailwind v4)
├── components/
│   ├── WindowManager.tsx       # arraste, resize e renderização das janelas
│   ├── Taskbar.tsx             # barra de tarefas e relógio
│   ├── StartMenu.tsx           # menu iniciar + catálogo de aplicativos
│   ├── QuickSettings.tsx       # central de ações (rede, volume, bateria)
│   ├── CalendarFlyout.tsx      # calendário flutuante
│   ├── NotificationCenter.tsx  # notificações
│   ├── DesktopIcons.tsx        # ícones da área de trabalho
│   ├── DesktopContextMenu.tsx  # menu de contexto da área de trabalho
│   ├── TaskViewOverview.tsx    # visão geral de janelas (exposé)
│   └── apps/                   # aplicativos internos
└── utils/
    ├── desktopConfig.ts        # tipos, constantes e lógica pura (snap, layout)
    └── desktopConfig.test.ts   # testes dessas funções
```

## Testes

Os testes cobrem a lógica pura de `desktopConfig.ts`: alturas da barra por modo, cálculo de layout (blur/opacidade/orientação), divisão de tela no snap e o interpretador de comandos do terminal.

```bash
bun test            # todos
bun test src/utils/desktopConfig.test.ts   # arquivo específico
```

## Observações

- O Vite desativa o HMR quando a variável `DISABLE_HMR=true` está definida (usado pelo AI Studio para evitar flicker durante edições).
- As janelas usam `position: absolute` dentro de um contêiner da área de trabalho; o redimensionamento respeita o viewport e o tamanho mínimo, mas não colide com a barra de tarefas.
