# Agência Extend · landing page

Página de captação (Google Ads e Meta Ads) da Agência Extend. Princípio visual: **menos efeitos, mais intenção.**

## Como abrir

- **Jeito rápido:** dois cliques em `index.html`. Abre direto no navegador, sem build e sem instalar nada.
- **Para testar tudo (recomendado):** sirva a pasta por um servidor local, por exemplo `python -m http.server 8000`, e abra `http://localhost:8000`. Alguns navegadores limitam scripts em `file://`.
- Teste o título por campanha: `index.html?kw=agencia-marketing`, `?kw=trafego-pago`, `?cidade=criciuma`, `?utm_content=remarketing`.

## Arquivos

```
index.html          página
privacidade.html    Política de Privacidade (texto provisório)
termos.html         Termos de Uso (texto provisório)
css/styles.css      estilos, tokens da marca em :root
js/config.js        número do WhatsApp, IDs de rastreamento, títulos e cidades (edite aqui)
js/main.js          formulário, WhatsApp, rastreamento, cookies, cabeçalho, barra do celular, sanfona, reveal
assets/            logos oficiais (colorido e branco, completo e só símbolo)
```

## Estrutura da página (arquitetura de conversão)

| # | Seção | Pergunta que responde |
|---|---|---|
| 1 | Hero | O que é e o que eu faço agora? (título, subtítulo, um CTA). Ocupa a tela inteira (`100svh`), com o conteúdo centralizado e uma seta discreta no pé; a próxima seção só aparece ao rolar. Em telas muito baixas, cresce o necessário para não cortar o texto. |
| 1b | Clientes | Quem já trabalha com a Extend? (cards com empresa, segmento e cidade; no celular viram um carrossel de arrastar para o lado, com o selo "Arraste para o lado"; 2 colunas no tablet e 4 no desktop) |
| 2 | Confiança | Dá para confiar? (fatos verificáveis: equipe própria, região, números semanais, contrato) |
| 3 | Problema | Por que meu anúncio não vira venda? |
| 4 | Manifesto | Qual é a ideia da Extend? (Anúncio bom traz contato. Processo bom transforma contato em cliente.) |
| 5 | Processo | Como funciona na prática? (Atraímos, Capturamos, Qualificamos, Convertemos, Otimizamos) |
| 6 | Benefícios | O que eu ganho? (resultado primeiro, serviço como "Como:") |
| 7 | Time | Quem cuida da minha conta? |
| 8 | Cases | **Escondida** até existir case real e autorizado |
| 9 | Qualificação | Isso é para mim? |
| 10 | Formulário | Próximo passo |
| 11 | Dúvidas | Objeções finais |
| 12 | CTA final | Última chamada |

Todos os botões levam ao mesmo formulário (`#contato`). O WhatsApp direto fica como alternativa discreta (abaixo do formulário, no CTA final, no rodapé e no botão flutuante do desktop).

## O que é placeholder (precisa trocar)

| Item | Onde | O que fazer |
|---|---|---|
| Logo | cabeçalho e rodapé | **Já é o oficial** (`assets/logo-extend*.png` e `assets/logo-icone*.png`, gerados a partir de `referencias/`). Se existir versão em SVG, trocar os PNGs por ela. |
| Fonte | todo o site | Montserrat via Google Fonts, a alternativa gratuita mais próxima da fonte dos posts (que parece ser Gilroy, paga). Se a Extend tiver a licença da fonte oficial, trocar `--font` em `css/styles.css` e hospedar os arquivos no próprio site. |
| Clientes | `#clientes`, logo abaixo do hero | 4 cards de **exemplo provisório** ("Empresa Exemplo 1" a "4", com segmento, cidade e a logo da Extend no lugar da logo do cliente), só para visualizar o layout. Trocar nome, segmento, cidade e logo (`assets/clientes/`, com `alt` = nome da empresa) pelos clientes reais. Trocar só com autorização por escrito de cada cliente (exigência do briefing). Para mais ou menos clientes, duplicar ou apagar um `<li>`. |
| Foto da equipe | Time | Bloco rotulado. Só foto real, sem banco de imagens e sem IA. WebP/AVIF, `loading="lazy"`. |
| Cases | `#cases` | Seção pronta (Cliente, Desafio, Estratégia, Resultado) e escondida. Ativar só com dados reais. |
| Dados legais | rodapé | "[razão social, CNPJ e endereço a preencher]". |
| Privacidade e termos | `privacidade.html`, `termos.html` | Texto de exemplo, marcado como provisório. |
| IDs de rastreamento | `js/config.js` | `GTM_ID`, `META_PIXEL_ID`, `GOOGLE_ADS_ID` vazios. Vazio = nenhum script de terceiros carrega. |
| Favicon | `assets/logo-icone.png` | Símbolo oficial. Ideal ter versão quadrada própria. |

## Identidade visual

- **Cores** medidas pixel a pixel nos posts (`referencias/Cores e tipografia.jpg` e `cores e tipo grafia 2.jpg`) e no logo:
  - azul royal `#0348C9` (botões e destaques sobre claro)
  - azul profundo `#022D8C` (manifesto e rodapé)
  - azul vibrante `#0476E6` (só nos cantos do degradê)
  - caixa de destaque `#1E8BDB`
  - ciano `#8CDCFF` (selos e destaques sobre azul)
  - degradê do logo de `#1063C6` a `#31A0DD`
- **Tipografia** como nos posts: títulos (H1 e H2) em caixa alta e peso 800, selos com espaçamento largo entre letras e corpo em peso normal.
- **Caixa de destaque** (`.hl-box`): texto branco sobre azul claro, como "CLAREZA E CONFIANÇA" nos posts. Usada na segunda frase do manifesto. Como o contraste é de 3,6:1, só pode ir em texto grande (24px ou mais).
- **Logo:** no hero o logo aparece em branco. Com o cabeçalho claro, aparece colorido, com o degradê original. No celular, até 479px, mostra só o símbolo. No rodapé fica o logo completo em branco, e o símbolo aparece em marca d'água a 5% no manifesto.
- **Mudança de regra:** a regra anterior do briefing era títulos em caixa normal. Mudei para caixa alta a pedido do Luiz, para ficar igual aos posts.

## Como o formulário funciona

- Um componente (`<template id="tpl-form">`) instanciado pela função `criarFormulario()` em `main.js`. Para ter outro formulário na página, basta adicionar `<div data-form-mount data-titulo="...">`.
- Campos: nome e empresa (obrigatórios), segmento e "já investe em anúncios" (opcionais). **Não há telefone nem faturamento:** o WhatsApp já mostra o número de quem envia, e o briefing tirou os campos de faturamento e investimento para reduzir atrito. Essas informações vêm na conversa.
- Estados: padrão, foco (anel azul), preenchido, válido (borda azul e check), erro (mensagem ao lado do campo, anunciada ao leitor de tela, foco no primeiro campo com erro), carregando (spinner no botão) e sucesso ("Abrindo o seu WhatsApp..." com botão de reserva "Abrir o WhatsApp").
- Ao enviar: valida, dispara `lead_form` (uma vez por página) e, 300 ms depois, abre o `wa.me` na mesma aba com a mensagem montada. Nada é salvo: não há CRM, banco nem back-end.
- O texto digitado é limpo (sem `*`, `_`, `~`, crase, quebras de linha) e cortado (nome 60, empresa 80).
- Código de origem no fim da mensagem: `#g` Google, `#m` Meta, `#o` outras.

## Rastreamento e LGPD

- `track(evento, dados)` sempre faz `dataLayer.push` e chama `gtag`/`fbq` se existirem. Eventos: `page_view`, `scroll_50`, `lead_form` (Lead), `whatsapp_click` (Contact).
- Nome e empresa **nunca** vão para o `dataLayer` nem para as tags.
- As tags só carregam depois do "Aceitar" no aviso de cookies **e** se os IDs estiverem preenchidos.
- `utm_*`, `gclid`, `wbraid`, `gbraid` e `fbclid` ficam no navegador por 90 dias, **só depois do aceite**.

## Movimento

- Entrada do hero: eyebrow, título, subtítulo e CTA, só com opacidade e 12px de deslocamento, 600 ms, intervalos de 60 a 100 ms.
- Reveal ao rolar **só** em: cards do problema e dos benefícios (stagger de 60 ms), frase do manifesto e painéis de qualificação. Títulos, textos, formulário e FAQ ficam estáticos de propósito.
- Linha do processo revelada ao entrar na seção (horizontal no desktop, conectores verticais no celular).
- Hover: botões sobem 1px com sombra, cards sobem 3px, seta do botão anda 3px.
- Cabeçalho: ao rolar fica 8px mais baixo, translúcido, com desfoque e borda sutil.
- `prefers-reduced-motion: reduce`: todas as animações e transições caem para quase zero e tudo aparece direto.
- Saiu a faixa de palavras rolando (animação contínua, sem função de conversão).

## Decisões tomadas

1. **Título por campanha:** prioridade `utm_content=remarketing` > `kw` > `cidade`, só valores da lista fixa, escritos com `textContent` antes da primeira pintura. O destaque em azul claro vai em "chamando no WhatsApp" (ou no trecho equivalente de cada variação, ver `H1_DESTAQUES` em `config.js`).
2. **Origem sem `utm_source`:** `gclid`/`gbraid`/`wbraid` vale `#g`; `fbclid` vale `#m`; sem nada, `#o`.
3. **Hero enxuto:** saíram os três sinais de confiança, o segundo botão e o parágrafo longo. Os fatos de confiança ficam numa seção própria, depois dos clientes. O bloco de vídeo saiu do hero a pedido do Luiz: o hero termina na microcopy abaixo do botão.
4. **Prova social:** a seção de clientes (`#clientes`) está pronta com placeholders. A seção de confiança usa só fatos verificáveis do briefing. A seção de cases está pronta e escondida.
5. **Cabeçalho no celular:** só logo e "Falar com a Extend", sem menu hambúrguer (o briefing pede menos links de saída para tráfego pago).
6. **CTA fixo no celular:** um botão só, "Falar com a Extend", que aparece depois do hero e some quando o formulário está na tela.
7. **Barra de vagas:** virou um selo discreto acima do título do formulário. Revisar todo mês; se não houver limite real, apagar o bloco `.vagas`.
8. **Layout centralizado** em todas as seções (pedido do Luiz). Dentro dos cards de qualificação e do formulário, as listas e os campos ficam alinhados à esquerda para leitura.
9. **Mobile:** o título do hero ocupa 4 linhas no celular e 2 no desktop. A frase do manifesto chega a 6 linhas no celular (com a caixa de destaque, de propósito, como nos posts). Em 320px o título do problema também chega a 6.
11. **A página sempre abre no topo:** os links internos (botões para `#contato`, seta do hero, menu) rolam suave sem gravar `#secao` no endereço, e ao abrir a página qualquer `#` é removido e a rolagem anterior não é restaurada. Antes, quem reabria a página com `/#contato` no endereço caía direto no formulário. Os parâmetros de campanha (`?kw=`, `?cidade=`, `utm_*`) são mantidos.
10. **Aviso de cookies no celular:** só aparece depois que o hero sai da tela e some enquanto o formulário está visível, para nunca cobrir o botão principal nem o formulário (em telas de 320x640 ele cobria). Nenhuma tag carrega antes do aceite, então isso não muda nada na LGPD. No desktop continua no canto inferior esquerdo.

## Verificação feita

Testes no navegador por um servidor local (este computador não tem Python nem Node):

- 320, 360, 375, 390, 414, 480, 600, 768, 1024, 1280, 1440 e 1920 px: sem rolagem horizontal, sem texto cortado, nada saindo de dentro dos cards, sem texto abaixo de 13px, todos os alvos de toque com 44px ou mais, cabeçalho em uma linha.
- Estrutura: um único H1, hierarquia de títulos sem pulos, nenhum ID repetido, nenhuma âncora quebrada, todas as imagens com `alt`, todos os campos com `label`, nenhum ícone apontando para símbolo inexistente, console sem erros.
- `privacidade.html` e `termos.html` em 320px: sem rolagem horizontal, logo e fonte carregando.
- Formulário: erros, foco no campo com erro, estado válido, carregando, mensagem do WhatsApp, `lead_form` uma vez só, `whatsapp_click` separado.
- Título por campanha com todos os parâmetros, inclusive cidade inválida.
- Grep sem travessões, palavras proibidas, preços ou promessa de resultado. Um único H1.

## Para o desenvolvedor (passagem)

A pasta é autossuficiente: HTML, CSS e JS puros, sem build, sem dependências, sem `npm install`. Basta copiar para qualquer hospedagem estática (Netlify, Vercel, Hostinger, servidor da agência etc.) e abrir o `index.html`. Também pode virar tema de WordPress, Webflow ou Elementor, usando este código como referência fiel.

- **Fontes da verdade:** o código e este README. As imagens de marca em `referencias/` (posts e logos) mostram a identidade atual.
- **Desatualizados (manter só como histórico):**
  - `referencias/Briefing.pdf` continua valendo para as regras de negócio: formulário, envio para o WhatsApp, LGPD, rastreamento, palavras proibidas e "sem prova inventada". Mas está **desatualizado** em cores (a paleta `#3355D8`/`#1E32A0` foi trocada pela medida nos posts), fonte (Poppins virou Montserrat), títulos (caixa normal virou caixa alta), copy e ordem das seções.
  - `PROMPT.md.md` é o pedido original do protótipo e está desatualizado nos mesmos pontos.
  - Em caso de conflito, vale o que está no código e na seção "Identidade visual" deste README.
- **Antes de publicar (checklist):**
  1. Nomes reais dos clientes em `#clientes` (com autorização por escrito).
  2. Foto real da equipe na seção "Quem cuida da sua conta".
  3. Razão social, CNPJ e endereço no rodapé e nas páginas legais.
  4. Política de Privacidade e Termos revisados.
  5. IDs de GTM, Meta Pixel e Google Ads em `js/config.js`, testados com Tag Assistant e Test Events do Meta.
  6. Confirmar se a barra de vagas continua verdadeira (revisar todo mês).
  7. Se possível: logo em SVG, fonte oficial hospedada no próprio site e favicon quadrado.
  8. Testar o envio para o WhatsApp no iPhone (Safari e navegador interno do Instagram), no Android (Chrome) e no computador (WhatsApp Web).
  9. Rodar o PageSpeed Insights no celular (meta: LCP abaixo de 2,5s, CLS abaixo de 0,1).

## O que o web design precisa decidir ou trocar

- Fonte oficial, nomes reais dos clientes e foto real da equipe.
- Prova social e cases, quando houver material autorizado.
- Ícones: SVGs de linha provisórios (traço 2px em `#0348C9`), podem ser trocados por um set da marca.
- Antes de publicar: dados legais, Política de Privacidade e Termos revisados, IDs de rastreamento, testes no iPhone (Safari e navegador interno do Instagram), Android (Chrome) e WhatsApp Web.

## Otimização de conversão (rodada aprovada pelo Luiz)

Ajustes cirúrgicos de copy e CTA, sem mudar oferta, layout, formulário ou identidade:

- **Hero:** saiu "TODO MÊS" (soava como promessa de resultado). Título: "Mais clientes chamando no WhatsApp da sua empresa." Subtítulo: "Estratégia, anúncios e estrutura comercial para que o seu investimento em tráfego se transforme em oportunidades reais de venda." CTA "Quero atrair mais clientes →" e microfrase "Fale com a Extend e descubra como podemos estruturar sua aquisição de clientes." A variação por cidade também perdeu o "Todo mês".
- **Hierarquia de CTAs:** primeira dobra "Quero atrair mais clientes"; todos os outros botões (processo, time, formulário, CTA final e cases) "Quero falar com a Extend". O cabeçalho e a barra fixa do celular seguem "Falar com a Extend".
- **Títulos trocados:** clientes ("...que já confiam na Extend"), problema ("Mas quem transforma esse contato em cliente?" + novo texto de apoio), processo ("Do anúncio à venda: um processo pensado para converter"), WhatsApp ("Seu WhatsApp precisa transformar conversas em oportunidades" + novo texto de apoio), diferencial ("Uma agência que pensa no seu negócio, não só nos seus anúncios"), formulário ("Vamos entender como a Extend pode ajudar sua empresa" + "Responda algumas perguntas rápidas e fale diretamente com nossa equipe pelo WhatsApp") e FAQ ("As principais dúvidas antes de começar").
- **Preservados sem alteração:** "Anúncio bom traz contato. Processo bom transforma contato em cliente.", "Feito para quem quer crescer com processo, não com sorte.", "Seu anúncio já pode trazer o contato. Agora falta o processo.", as perguntas do FAQ, os campos do formulário e a mensagem enviada ao WhatsApp.
- **Processo:** mudou só o título. As 5 etapas existentes (Atraímos, Capturamos, Qualificamos, Convertemos, Otimizamos) foram mantidas, sem inventar etapas novas.
- **"Já confiam na Extend":** só é verdade quando os placeholders `[Empresa]` forem trocados por clientes reais e autorizados.