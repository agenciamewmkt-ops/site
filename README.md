# Mew — variação Illuminated Hero

## Visualizar
Abra `index.html` em um navegador. Esta versão **não substitui** a homepage anterior: é uma alternativa de hero com fundo marrom quase preto, iluminação cobre, título luminoso, texto e CTAs da Mew. As outras seções e o menu Slide Tabs foram preservados.

## Estrutura atual
O projeto publicado é **HTML/CSS/JavaScript estático**, sem React, TypeScript ou Tailwind. A variação funcional da homepage está em `index.html`. O arquivo `components/ui/illuminated-hero.tsx` é a versão React/TypeScript reutilizável para uma migração futura, e não é importado pelo HTML.

## Integração React + shadcn/ui + Tailwind 4 + TypeScript
1. Crie um projeto Vite com React e TypeScript: `npm create vite@latest mew-react -- --template react-ts`; entre na pasta e execute `npm install`.
2. Siga o guia oficial do shadcn/ui para Vite (`https://ui.shadcn.com/docs/installation/vite`), que configura Tailwind, alias `@/` e o arquivo `src/lib/utils.ts` (função `cn`). Inicialize com `npx shadcn@latest init`.
3. Copie `components/ui/illuminated-hero.tsx` para `src/components/ui/illuminated-hero.tsx` e `illuminated-hero.css` para `src/illuminated-hero.css`. Importe o CSS no ponto de entrada (`src/main.tsx` ou `src/index.css`).
4. Importe `IlluminatedHero` de `@/components/ui/illuminated-hero` em sua homepage. Se estiver usando Tailwind 4, mantenha `@import "tailwindcss";` no CSS principal.
5. O componente **não usa framer-motion nem lucide-react**, portanto não requer essas dependências. Não utiliza imagens stock, pois o design é inteiramente tipográfico e vetorial. Também não exige providers ou gerenciamento de estado.
6. A estrutura padrão do Vite/shadcn geralmente é `src/components/ui` e `src/index.css`, não `/components/ui` na raiz. Mantenha `src/components/ui` para que o alias `@/components/ui` resolva corretamente; se desejar `/components/ui` na raiz, ajuste `tsconfig` e `vite.config.ts` para o novo alias.
7. Confira as âncoras `#contato` e `#projetos` na homepage e preserve o menu responsivo existente.

## Produção
- Os botões do hero levam às seções de contato e projetos.
- O formulário continua **sem integração** com planilha.
- Textos jurídicos exigem validação com dados cadastrais e operação real da Mew antes de publicação.
- Valide o visual em desktop e mobile e ajuste a intensidade do brilho conforme a preferência da equipe.

## Cursor personalizado
O site estático usa `mew-cursor.css` e `mew-cursor.js` nas três páginas. O ponteiro cobre possui inércia, leve rotação conforme velocidade e etiqueta contextual em elementos interativos. Só aparece com mouse preciso e sem preferência por movimento reduzido. Em telas touch, o cursor do sistema é mantido.

### Versão React/TypeScript
`components/ui/cursor.tsx` é uma adaptação autossuficiente do cursor enviado, com `motion/react`, sem depender de `cursor-utils/cursor-primitive` (que não foi fornecido). O componente oferece `CursorProvider`, `Cursor` e `CursorFollow`. Instale `npm install motion` em um projeto React/TypeScript com Tailwind e shadcn/ui, conforme o guia de configuração acima. Use `src/components/ui` se o alias `@/` apontar para `src`; a pasta `/components/ui` na raiz só é adequada quando o alias estiver configurado para ela. Inclua `<CursorProvider global><Cursor/><CursorFollow>Explorar</CursorFollow></CursorProvider>` no layout da aplicação. A implementação não requer imagens nem lucide-react.

## Ajustes visuais — versão refinada
- Header escuro integrado ao hero, menu Slide Tabs marrom com indicador cobre e logotipo bege original.
- Hero centralizado com compensação de altura do header, brilho reduzido e maior legibilidade.
- Botões e WhatsApp refinados; layout responsivo e preferência por movimento reduzido preservados.
- Arquivos `logo-bege.png` e `logo-marrom.png` incluídos para futura alternância em seções claras.
- A integração do formulário à planilha permanece pendente.
