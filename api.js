/* ─────────────────────────────────────────────────────────────────────────
 * VX · API LAYER — Anthropic Integration
 * ─────────────────────────────────────────────────────────────────────────
 * Configure a API Key Anthropic via VX_API.setKey("sk-...") ou pelo modal.
 * A chave fica salva no localStorage do navegador.
 * ───────────────────────────────────────────────────────────────────────── */

(function () {
  const STORAGE_KEY_APIKEY = "vx_openai_key";
  const DEFAULT_KEY = (typeof window !== "undefined" && window.__VX_KEY__) || "";

  const config = {
    baseUrl: "",
    authToken: null,
    useMock: false,
    openaiKey: DEFAULT_KEY,
    openaiModel: "claude-sonnet-4-6",
    onEvent: null,
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY_APIKEY);
    if (saved && saved.startsWith("sk-")) { config.openaiKey = saved; }
  } catch (_) {}

  /* ─── Helpers ─── */
  function emit(name, payload) {
    if (typeof config.onEvent === "function") {
      try { config.onEvent(name, payload); } catch (_) {}
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ─── Skeleton extractor: strips CSS/JS/SVG, returns them separately ─── */
  function createSkeletonForPrompt(html) {
    const resources = { styles: [], scripts: [] };

    // Pull out every <style> block verbatim
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      resources.styles.push(match);
      return "";
    });

    // Pull out every <script> block verbatim
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) => {
      resources.scripts.push(match);
      return "";
    });

    // Remove decorative SVG elements (icons, illustrations)
    html = html.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");

    // Remove canvas elements
    html = html.replace(/<canvas\b[^>]*(?:>[\s\S]*?<\/canvas>|\s*\/>)/gi, "");

    // Remove HTML comments
    html = html.replace(/<!--(?!\[)[\s\S]*?-->/g, "");

    // Remove data-* attributes (not needed for content adaptation)
    html = html.replace(/\s+data-[a-z][a-z0-9-]*(?:="[^"]*")?/gi, "");

    // Remove contenteditable attributes
    html = html.replace(/\s+contenteditable(?:="[^"]*")?/gi, "");

    // Remove long inline styles (>80 chars) — shorter ones carry layout intent
    html = html.replace(/(\s)style="[^"]{80,}"/g, "");

    // Collapse whitespace
    html = html
      .replace(/>\s{2,}</g, ">\n<")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return { skeleton: html, resources };
  }

  /* ─── Reinjects extracted CSS/JS back into adapted HTML ─── */
  function reinjectResources(html, resources) {
    // Strip any CSS/JS the model may have generated — we use the originals
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

    const styleBlock  = resources.styles.join("\n");
    const scriptBlock = resources.scripts.join("\n");

    if (styleBlock) {
      html = html.includes("</head>")
        ? html.replace("</head>", styleBlock + "\n</head>")
        : styleBlock + "\n" + html;
    }

    if (scriptBlock) {
      html = /(<\/body>)/i.test(html)
        ? html.replace(/(<\/body>)/i, scriptBlock + "\n$1")
        : html + "\n" + scriptBlock;
    }

    return html;
  }

  function mockId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10);
  }

  /* ─── Build structured prompt from 7 sections ─── */
  function buildDataPrompt(data) {
    const MAP = [
      {
        id: "boasvindas", title: "EMPRESA & IDENTIDADE",
        fields: [
          ["nome",         "Nome da empresa"],
          ["nicho",        "Nicho / mercado"],
          ["site",         "Site / Instagram"],
          ["regiao",       "Região de atuação"],
          ["sobre",        "Sobre a empresa"],
          ["resultados",   "Cases e resultados"],
          ["missao",       "Missão"],
          ["visao",        "Visão"],
          ["valores",      "Valores da empresa"],
          ["expert_nome",  "Expert / Sócios"],
          ["expert_cargo", "Cargo do expert"],
          ["expert_bio",   "Bio e trajetória do expert"],
          ["expert_cred",  "Credenciais do expert"],
          ["percepcao",    "Como a empresa deseja ser percebida"],
          ["proposito",    "Propósito e missão comercial"],
          ["conduta",      "Código de conduta — o que fazemos e nunca fazemos"],
        ],
      },
      {
        id: "mercado", title: "ESTUDO DE MERCADO",
        fields: [
          ["mercado_tamanho",      "Tamanho e oportunidade de mercado"],
          ["mercado_tendencia",    "Tendências e diferencial estratégico"],
          ["concorrentes_briefing","Principais concorrentes (briefing)"],
          ["diferenciais",         "Diferencial vs. concorrentes"],
          ["concorrentes_redes",   "Presença digital dos concorrentes"],
          ["concorrentes_anuncios","Biblioteca de anúncios dos concorrentes"],
        ],
      },
      {
        id: "icp", title: "ICP — CLIENTE IDEAL",
        fields: [
          ["modelo",         "Modelo de negócio"],
          ["icp_secundario", "Perfil de cliente secundário"],
          ["anti_icp",       "Anti-ICP — quem NÃO deve ser atendido"],
        ],
      },
      {
        id: "vendas", title: "SCRIPT DE VENDAS — PROCESSO & TOM",
        fields: [
          ["canais",       "Canais de origem dos leads"],
          ["processo",     "Processo de venda (do contato ao fechamento)"],
          ["objecoes",     "Objeções mais comuns"],
          ["formal",       "Tom — Formalidade (0=informal / 100=formal)"],
          ["energia",      "Tom — Energia (0=calma/premium / 100=agressiva/direta)"],
          ["estilo",       "Tom — Estilo (0=direto / 100=consultivo)"],
          ["palavras_sim", "Palavras que a empresa usa"],
          ["palavras_nao", "Palavras proibidas"],
          ["exemplo",      "Exemplo de mensagem ideal (referência de voz)"],
        ],
      },
      {
        id: "time", title: "TIME COMERCIAL — ESTRUTURA & METAS",
        fields: [
          ["equipe",      "Equipe comercial (cargos e responsabilidades)"],
          ["conversao",   "Conversão atual (lead → cliente)"],
          ["vol_leads",   "Volume de leads por mês"],
          ["tempo_fech",  "Tempo médio de fechamento"],
          ["meta",        "Meta dos próximos 90 dias"],
          ["sla_rituais", "SLAs e rituais do time (daily, pipeline, review)"],
        ],
      },
      {
        id: "operacao", title: "MAPA DE OPERAÇÃO & IDENTIDADE VISUAL",
        fields: [
          ["crm",            "CRM utilizado"],
          ["ferramentas",    "Ferramentas do time"],
          ["funis",          "Funil de vendas — etapas e critério de avanço"],
          ["fluxo_mapa",     "Fluxograma detalhado do processo comercial (etapas, responsáveis, ferramentas, SLAs e critérios de avanço)"],
          ["onboarding",     "Onboarding do cliente"],
          ["gargalos",       "Gargalos atuais"],
          ["visual_preset",  "Preset visual selecionado"],
          ["cor_primaria",   "Cor primária"],
          ["cor_secundaria", "Cor secundária"],
          ["cor_fundo",      "Cor de fundo"],
          ["fonte",          "Tipografia/fonte"],
          ["mood",           "Mood visual"],
          ["obs_material",   "Observações sobre os materiais anexados"],
        ],
      },
    ];

    let prompt = "DADOS DA EMPRESA PARA PERSONALIZAÇÃO DO PLAYBOOK:\n\n";
    let hasAny = false;

    /* ── Produtos (tratamento especial — array de objetos) ── */
    const produtosLista = Array.isArray((data.produtos || {}).lista)
      ? (data.produtos.lista).filter((p) => p.nome && p.nome.trim())
      : [];
    if (produtosLista.length > 0) {
      hasAny = true;
      prompt += `### PRODUTOS / SERVIÇOS\n`;
      produtosLista.forEach((p, i) => {
        prompt += `\n── Produto ${i + 1}: ${p.nome}\n`;
        if (p.preco)     prompt += `  Preço / Investimento: ${p.preco}\n`;
        if (p.para_quem) prompt += `  Para quem: ${p.para_quem}\n`;
        if (p.descricao) prompt += `  O que inclui: ${p.descricao}\n`;
      });
      prompt += "\n";
    }

    /* ── ICP por produto (tratamento especial — objeto indexado) ── */
    const icpPorProduto = (data.icp || {}).por_produto;
    if (icpPorProduto && typeof icpPorProduto === "object" && produtosLista.length > 0) {
      const icpLines = [];
      produtosLista.forEach((prod, i) => {
        const icp = icpPorProduto[String(i)];
        if (!icp) return;
        const hasData = icp.segmento || icp.ticket || icp.icp_desc || icp.dor_urgencia || icp.qualifica;
        if (!hasData) return;
        icpLines.push(`\n── ICP do Produto ${i + 1}: ${prod.nome}`);
        if (icp.segmento)    icpLines.push(`  Segmento / setor: ${icp.segmento}`);
        if (icp.ticket)      icpLines.push(`  Ticket médio: ${icp.ticket}`);
        if (icp.icp_desc)    icpLines.push(`  Quem compra: ${icp.icp_desc}`);
        if (icp.dor_urgencia)icpLines.push(`  Dor + gatilhos de urgência: ${icp.dor_urgencia}`);
        if (icp.qualifica)   icpLines.push(`  Critérios de qualificação: ${icp.qualifica}`);
      });
      if (icpLines.length > 0) {
        hasAny = true;
        prompt += `### ICP — PERFIL DE CLIENTE IDEAL POR PRODUTO\n${icpLines.join("\n")}\n\n`;
      }
    }

    MAP.forEach(({ id, title, fields }) => {
      const sData = data[id] || {};
      const lines = [];
      fields.forEach(([key, label]) => {
        const val = sData[key];
        if (val == null || val === "") return;
        if (Array.isArray(val) && val.length === 0) return;

        // Handle flowbuilder canvas objects { nodes, edges }
        if (typeof val === "object" && !Array.isArray(val) && "nodes" in val) {
          const nodes = (val.nodes || []);
          const edges = (val.edges || []);
          if (!nodes.length) return;
          const nodeTypeNames = {
            timer:      "Temporizador (círculo azul)",
            manual:     "Ação Manual (retângulo azul)",
            auto:       "Automação (pentágono roxo)",
            autoManual: "Automação c/ Gatilho Manual (pentágono azul)",
            ifelse:     "Condicional If/Else (pentágono vermelho)",
          };
          const nodeMap = {};
          nodes.forEach((n) => { nodeMap[n.id] = n; });
          let desc = `Fluxograma com ${nodes.length} bloco${nodes.length !== 1 ? "s" : ""}:\n`;
          nodes.forEach((n, i) => {
            const typeName = nodeTypeNames[n.type] || n.type;
            desc += `  ${i + 1}. [${typeName}] "${n.label}"\n`;
          });
          if (edges.length) {
            desc += `\nConexões (→ indica fluxo):\n`;
            edges.forEach((e) => {
              const f = nodeMap[e.from], t = nodeMap[e.to];
              if (f && t) desc += `  "${f.label}" → "${t.label}"\n`;
            });
          }
          lines.push(`${label}:\n${desc.trim()}`);
          return;
        }

        const formatted = Array.isArray(val) ? val.join(", ") : String(val);
        if (formatted.trim()) lines.push(`${label}: ${formatted}`);
      });
      if (lines.length) {
        hasAny = true;
        prompt += `### ${title}\n${lines.join("\n")}\n\n`;
      }
    });

    if (!hasAny) {
      prompt += "Nenhum dado preenchido. Use conteúdo genérico mas altamente persuasivo para uma empresa de consultoria de vendas e operações comerciais.";
    }

    return prompt;
  }

  /* ─── System prompt ─── */
  const SYSTEM_PROMPT = `Você é um Especialista Sênior em UX/UI, Arquitetura de Informação, Front-End Premium e Design Editorial para Playbooks Operacionais de Alto Valor.

Sua missão é criar um PLAYBOOK VISUAL PREMIUM, extremamente organizado, profissional, sofisticado e visualmente impactante, no estilo de empresas premium de consultoria, growth, medicina, odontologia, SaaS, operações e inteligência de negócios.

O resultado deve parecer um sistema proprietário de operação, não um PDF simples. O layout transmite: Autoridade · Clareza · Organização · Premium positioning · Alta percepção de valor · Sensação de framework proprietário · Experiência visual impecável.

══════ REGRAS ABSOLUTAS ══════
1. Retorne APENAS o código HTML. Comece com <!DOCTYPE html>. Sem markdown, sem explicações.
2. HTML standalone — sem arquivos externos exceto Google Fonts.
3. Todos os estilos em <style> único no <head>. Todo JS inline antes do </body>.
4. Personalize TODO o conteúdo com os dados fornecidos. Nunca use conteúdo genérico quando há dado disponível.
5. Adapte terminologia: saúde→paciente/tratamento | B2B→lead/solução | agência→cliente/campanha | imóveis→comprador/imóvel | SaaS→usuário/plano.
6. NÃO faça: layout de blog, documento Word, visual genérico, página corrida de texto, cards pobres, tipografia ruim, interface poluída ou design amador.

══════ PRINCÍPIOS DE DESIGN PREMIUM ══════
Interface minimalista, sofisticada, moderna, clean, corporativa, alta legibilidade, sensação de tecnologia + consultoria premium.
Hierarquia visual forte: headings grandes, espaçamentos amplos, cards premium, containers bem definidos, separação visual forte entre seções, contraste refinado, grid responsivo, visual modular.
Estilo misto: dashboard executivo + documento estratégico + SaaS premium + sistema interno proprietário + manual operacional elite.

══════ EXTRAÇÃO DE IDENTIDADE VISUAL ══════
Antes de qualquer CSS, analise TODOS os dados:
① Cores: hex codes (#rrggbb), nomes PT/EN ("azul royal"→#4169e1, "dourado"→#d4a843, "vinho"→#7b1d1d, "navy"→#001f5b, "terracota"→#e2725b), marcas ("Bradesco"→#cc092f, "Nubank"→#820ad1, "iFood"→#ea1d2c, "Itaú"→#ec7000, "XP"→#000/#f8cb46, "Inter"→#ff7a00)
② Tipografia: campo fonte, menções no texto, nicho implica font (saúde→Nunito, imóveis→Cormorant+Raleway, financeiro→Libre Baskerville+Inter, corporativo→Montserrat, criativo→Poppins, tech→Inter)
③ Derivar paleta completa no :root: --color-primary/secondary/accent/bg/surface/text/muted/border/sidebar-bg/sidebar-text + --font-heading/body/mono
④ Logo SVG/raster fornecido: usar EXATAMENTE no header (max-height:40px), sidebar (52px) e hero (88px). Nunca substituir por ícone genérico.

══════ PRIORIDADE VISUAL ══════
P0 — Logo fornecido → incorporar + derivar paleta | P1 — Visual preenchido → usar exatamente | P2 — Design system do nicho | Fallback → SaaS dark premium

══════ DESIGN SYSTEMS POR NICHO ══════
► SAÚDE/CLÍNICA/ESTÉTICA/ODONTO/PSICOLOGIA/NUTRIÇÃO — detectar: saúde, clínica, médico, odonto, estética, fisio, nutrição, consultório
  Font: Nunito | --bg:#f0f7ff --primary:#1d6fa4 --secondary:#5bb3d0 --accent:#06b6d4 --text:#0c3558 --sidebar-bg:#1d6fa4 --sidebar-text:#fff
  Estilo: limpo, acolhedor, border-radius 16px, sombras suaves, sem agressividade

► CONSULTORIA B2B/ADVOCACIA/GESTÃO/RH — detectar: consultoria, b2b, advocacia, jurídico, rh, gestão, auditoria
  Font: Montserrat | --bg:#f7f8fa --primary:#1e3a5f --secondary:#b8922a --accent:#d4a843 --text:#111827 --sidebar-bg:#1e3a5f --sidebar-text:#fff
  Estilo: sofisticado, autoritativo, detalhes dourados, grid rígido

► AGÊNCIA/MARKETING/COMUNICAÇÃO/DESIGN — detectar: agência, marketing, comunicação, publicidade, social media, branding, performance
  Font: Poppins | --bg:#fafafa --primary:#7c3aed --secondary:#ec4899 --accent:#f59e0b --text:#111827 --sidebar-bg:linear-gradient(160deg,#7c3aed,#ec4899) --sidebar-text:#fff
  Estilo: criativo, vibrante, border-radius 20px, hover translate, gradientes

► SAAS/TECH/STARTUP/SOFTWARE/IA — detectar: saas, software, tecnologia, startup, plataforma, app, digital, ia, automação
  Font: Inter | --bg:#0f172a --surface:rgba(255,255,255,.04) --primary:#3b82f6 --secondary:#6366f1 --accent:#8b5cf6 --text:#f1f5f9 --sidebar-bg:#020617 --sidebar-text:#f1f5f9
  Estilo: dark-mode, técnico, glassmorphism, bordas sutis, mono em dados

► IMOBILIÁRIA/CONSTRUTORA/INCORPORADORA — detectar: imobiliária, imóvel, construtora, loteamento, corretor
  Font: Cormorant Garamond (h1-h3) + Raleway (body) | --bg:#faf9f7 --primary:#1a1a2e --secondary:#b8962e --accent:#d4a843 --text:#1c1917 --sidebar-bg:#1a1a2e --sidebar-text:#faf9f7
  Estilo: premium, elegante, serifada, detalhes dourados

► EDUCAÇÃO/COACHING/MENTORIA/CURSOS — detectar: educação, coaching, mentor, treinamento, curso, capacitação
  Font: Nunito | --bg:#fffbf5 --primary:#9333ea --secondary:#f97316 --accent:#06b6d4 --text:#1c1917 --sidebar-bg:#7e22ce --sidebar-text:#fff
  Estilo: acolhedor, motivacional, border-radius 24px, emojis como ícones

► VAREJO/E-COMMERCE/ATACADO/PRODUTO — detectar: varejo, loja, e-commerce, distribuidor, atacado, comércio
  Font: Inter | --bg:#fff --surface:#f9fafb --primary:#111827 --secondary:#ef4444 --accent:#f59e0b --text:#111827 --sidebar-bg:#111827 --sidebar-text:#f9fafb
  Estilo: direto, conversão, border-radius 6px, mínimo ornamental

► FINANCEIRO/INVESTIMENTOS/CONTABILIDADE/SEGUROS — detectar: financeiro, investimento, contabilidade, seguro, crédito, banco
  Font: Libre Baskerville (h) + Inter (body) | --bg:#f8f9fa --primary:#064e3b --secondary:#059669 --accent:#10b981 --text:#111827 --sidebar-bg:#064e3b --sidebar-text:#ecfdf5
  Estilo: confiável, conservador-moderno, dados organizados

Fundo escuro (#0x,#1x): surface rgba(255,255,255,.04), border rgba(255,255,255,.08) | Fundo claro: surface #fff, border rgba(0,0,0,.08)

══════ DESIGN PREMIUM AVANÇADO ══════

▸ SISTEMA DE ELEVAÇÃO (box-shadow em 4 níveis — adaptar alpha ao tema claro/escuro)
  --shadow-xs: 0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.10)
  --shadow-sm: 0 2px 4px rgba(0,0,0,.07), 0 4px 8px rgba(0,0,0,.08)
  --shadow-md: 0 4px 12px rgba(0,0,0,.10), 0 8px 24px rgba(0,0,0,.08)
  --shadow-lg: 0 12px 32px rgba(0,0,0,.14), 0 20px 48px rgba(0,0,0,.10)
  --shadow-primary: 0 8px 28px rgba(var(--primary-rgb),.28)
  Cards normais → --shadow-sm; Cards hero → --shadow-md; Modais/overlays → --shadow-lg; CTAs principais → --shadow-primary

▸ SISTEMA DE GRADIENTES
  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)
  --gradient-surface: linear-gradient(180deg, var(--color-surface) 0%, rgba(var(--primary-rgb),.03) 100%)
  --gradient-hero: linear-gradient(135deg, rgba(var(--primary-rgb),.12) 0%, rgba(var(--accent-rgb),.06) 100%)
  --gradient-border: linear-gradient(135deg, var(--color-primary), var(--color-accent))
  Usar gradient-border em pseudo-elementos ::before para bordas coloridas nos section heroes.
  Texto com gradiente (títulos impactantes): background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text

▸ TIPOGRAFIA REFINADA
  Escala type: --text-xs:.75rem --text-sm:.875rem --text-base:1rem --text-lg:1.125rem --text-xl:1.25rem --text-2xl:1.5rem --text-3xl:1.875rem --text-4xl:2.25rem --text-5xl:3rem
  Line-heights: headings 1.1–1.2 / corpo 1.6–1.7 / captions 1.4
  Letter-spacing: headings –0.02em / uppercase labels +0.08em / mono 0
  Pesos: heading font-weight:700–800; sub-heading 600; corpo 400; muted 400 opacity:.6
  Número destaque (stat-value): font-variant-numeric:tabular-nums; font-feature-settings:"tnum"
  Uppercase labels (section badges, KPI labels): font-size:.7rem; letter-spacing:.1em; text-transform:uppercase; font-weight:700; opacity:.7

▸ ÍCONES SVG INLINE (obrigatório — NÃO usar ícone externo, emojis apenas em sidebar nav)
  Cada section hero usa ícone SVG inline 48×48px com fill="none" stroke="currentColor" strokeWidth="1.5" — estilo Heroicons/Lucide outline.
  Seção 01 👋: SVG casa/handshake. Seção 02 📊: SVG chart-bar. Seção 03 📦: SVG cube/package.
  Seção 04 🎯: SVG crosshair/target. Seção 05 🗺️: SVG map/flow. Seção 06 💬: SVG message-circle. Seção 07 🏗️: SVG users/org-chart.
  Envolver ícone em div .icon-wrap: display:inline-flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:16px; background:var(--gradient-primary); color:#fff; box-shadow:var(--shadow-primary)
  KPI cards: ícone 20×20 inline no canto superior direito, opacity:.6

▸ ANIMAÇÕES COREOGRAFADAS
  Entrada de seção: cada .reveal entra com stagger — adicionar delay via nth-child (0ms, 80ms, 160ms, 240ms…).
  Hero badge entrada: @keyframes badgePop { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} } — aplicar em .section-badge
  Número counter: animar de 0 ao valor real via requestAnimationFrame com easing ease-out ao entrar no viewport.
  Progress bar fill: entrar com width:0→valor real em 1.2s ease-out ao entrar viewport.
  Card hover: transform:translateY(-4px) scale(1.01); box-shadow:var(--shadow-lg); transition:all .22s cubic-bezier(.22,.68,0,1.2)
  Gradient border hover (cards premium): usar border:1px solid transparent; background:linear-gradient(var(--color-bg),var(--color-bg)) padding-box, var(--gradient-primary) border-box ao hover
  Botão CTA pulse: @keyframes ctaPulse { 0%,100%{box-shadow:0 0 0 0 rgba(var(--primary-rgb),.4)} 60%{box-shadow:0 0 0 8px rgba(var(--primary-rgb),0)} } — aplicar em botão principal de cada seção
  Sidebar item active: @keyframes slideRight { from{transform:translateX(-6px);opacity:0} to{transform:none;opacity:1} }

▸ SCROLL EXPERIENCE
  Scrollbar customizada: ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(var(--primary-rgb),.3);border-radius:4px} ::-webkit-scrollbar-thumb:hover{background:rgba(var(--primary-rgb),.6)}
  Sidebar scrollbar: width:3px

▸ SECTION HEROES CINEMATOGRÁFICOS
  Cada seção começa com hero full-width: padding 64px 0 48px; background: var(--gradient-hero) + padrão de fundo (dot grid ou linhas diagonais sutis em SVG data:uri).
  Dot grid SVG background: background-image:radial-gradient(circle,rgba(var(--primary-rgb),.12) 1px,transparent 1px); background-size:24px 24px
  Estrutura hero: [.section-badge uppercase label primary] → [.icon-wrap 56px] → [h2 gradient-text clamp] → [p.hero-desc muted max-width:600px]
  Separador visual da seção após o hero: div height:1px; background:var(--gradient-border); opacity:.3; margin:0 -56px

▸ DATA VISUALIZATION CSS/SVG PURO (sem bibliotecas externas)
  Bar chart horizontal: divs com width:% animados, label à esquerda, valor à direita, barra com background:var(--gradient-primary); border-radius:0 4px 4px 0; height:10px
  Donut / ring progress: SVG circle stroke-dasharray + stroke-dashoffset animado ao entrar viewport. r=40, cx=50, cy=50, viewBox="0 0 100 100"
  Spark bar (mini chart em KPI): 7 divs inline-block height variável 4-20px; bar-gap:2px; mesmo gradiente primary
  Funil de vendas: divs .funnel-level em coluna centralizada com clip-path:polygon para formato trapézio, cada nível com cor distinta e % animado
  Termômetro de score: div vertical position:relative; fill animado de baixo p/ cima ao entrar viewport

▸ CARDS COM PROFUNDIDADE VISUAL
  Card principal: bg var(--color-surface); border:1px solid var(--color-border); border-radius:16px; padding:24px 28px; box-shadow:var(--shadow-sm); overflow:hidden; position:relative
  Accent line no topo: card::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background:var(--gradient-primary) }
  Card premium (hero/highlight): border-radius:20px; padding:32px 36px; box-shadow:var(--shadow-md); background:var(--gradient-surface)
  Card de estatística: accent line lateral esquerda (width:4px; height:100%; left:0; top:0) + stat-value clamp(1.8rem,4vw,2.6rem) + delta badge (↑/↓ verde/vermelho)
  Card de persona ICP: avatar circular 64px gradiente primary→accent com iniciais; nome bold 1.1rem; cargo muted .85rem; empresa tag pill; quote itálico opacity:.75; borda radius:24px

▸ TABELAS NÍVEL ENTERPRISE
  thead: background:var(--gradient-primary); color:#fff; th: padding:14px 20px; font-size:.8rem; letter-spacing:.08em; text-transform:uppercase
  tbody tr: transition:background .15s; border-bottom:1px solid var(--color-border)
  tbody tr:hover: background:rgba(var(--primary-rgb),.04)
  tbody tr:nth-child(even): background:rgba(var(--primary-rgb),.015)
  td: padding:12px 20px; font-size:.9rem
  Overflow wrapper: div.table-wrap { overflow-x:auto; border-radius:14px; border:1px solid var(--color-border); box-shadow:var(--shadow-xs) }
  Sticky header em tabelas longas: thead th { position:sticky; top:0; z-index:1 }

▸ PILLS E BADGES DETALHADOS
  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:999px; font-size:.72rem; font-weight:700; letter-spacing:.04em }
  .badge-ok: bg rgba(16,185,129,.12) color #059669 border 1px solid rgba(16,185,129,.25)
  .badge-warn: bg rgba(245,158,11,.12) color #d97706 border 1px solid rgba(245,158,11,.25)
  .badge-alert: bg rgba(239,68,68,.12) color #dc2626 border 1px solid rgba(239,68,68,.25)
  .badge-info: bg rgba(59,130,246,.12) color #2563eb border 1px solid rgba(59,130,246,.25)
  .badge-primary: bg rgba(var(--primary-rgb),.14) color var(--color-primary) border 1px solid rgba(var(--primary-rgb),.3)
  .badge-neutral: bg rgba(0,0,0,.05) color inherit border 1px solid var(--color-border)
  Canal emoji pill nos script blocks: font-size:.75rem; padding:4px 12px; border-radius:999px; font-weight:600

▸ FLUXOGRAMA CSS NATIVO (Seção 05)
  Layout flex coluna centralizada no mobile, flex row com wrap no desktop.
  Cada nó: div.flow-node { position:relative; min-width:160px; max-width:200px; padding:14px 18px; border-radius:12px; background:var(--color-surface); border:2px solid var(--color-border); box-shadow:var(--shadow-sm); text-align:center }
  Cores por fase: prospecção border/text #3b82f6; qualificação border/text #f59e0b; proposta border/text #8b5cf6; fechamento border/text #10b981; pós-venda border/text #06b6d4
  Seta connector: div.flow-arrow { display:flex; align-items:center; justify-content:center; color:var(--color-muted); font-size:1.2rem } — usa ↓ em mobile e → em desktop via media query
  Badges dentro do nó: responsável (badge-primary) + ferramenta (badge-neutral) + SLA (badge-warn) em row flex wrap gap:4px margin-top:8px

══════ LAYOUT OBRIGATÓRIO ══════
HEADER fixo (z-index:100, backdrop-filter:blur(12px), border-bottom 1px var(--color-border)):
  Esquerda: logo + nome empresa bold | Centro: "PLAYBOOK OPERACIONAL v1.0" mono 0.7rem muted | Direita: data + "Gerado por Luna AI" + botão hamburger (só ≤1024px)

SIDEBAR (position:fixed, width:260px, height:100vh, overflow-y:auto, bg var(--sidebar-bg)):
  Topo: nome empresa + nicho label | 7 nav items: badge circular nº + emoji + título | Ativo: bg rgba(255,255,255,.12) + border-left 3px branco | Hover: bg rgba(255,255,255,.08) | Rodapé: "⚡ Luna AI" label
  EMOJIS: 01👋 02📊 03📦 04🎯 05🗺️ 06💬 07🏗️
  TÍTULOS: 01·Boas Vindas 02·Estudo de Mercado 03·Produtos 04·ICP 05·Mapa de Operação 06·Scripts de Vendas 07·Time Comercial
  Mobile ≤1024px: transform:translateX(-100%) por padrão, .sidebar-open → translateX(0) transition 0.28s

CONTEÚDO: margin-left:260px desktop / 0 mobile | padding:48px 56px → 36px 32px → 24px 16px | id="secao-01" a "secao-07"

CSS OBRIGATÓRIO:
  @media print { .sidebar{display:none} .content{margin-left:0!important} body{background:#fff!important} }
  h1:clamp(1.5rem,5vw,2.8rem) h2:clamp(1.2rem,3.5vw,2rem) h3:clamp(1rem,2.5vw,1.3rem) stat-value:clamp(1.6rem,4vw,2.4rem)
  .reveal{opacity:0;transform:translateY(20px);transition:opacity .55s ease,transform .55s ease} .reveal.visible{opacity:1;transform:none}
  body{padding-bottom:56px!important}

JAVASCRIPT inline antes de </body>:
  ① IntersectionObserver → item ativo sidebar (threshold:0.25) + smooth scroll
  ② Counter animation em .stat-value ao entrar no viewport
  ③ Botão "↑" flutuante após 300px scroll
  ④ Reveal: IntersectionObserver em .reveal → .visible
  ⑤ Hamburger + overlay + swipe: openSidebar/closeSidebar, touchstart/touchend (dx>60 da borda abre, dx<-60 fecha), ESC fecha
  ⑥ Adicionar antes de </body>: <div id="vx-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:499;backdrop-filter:blur(2px)"></div>
  ⑦ Accordion FAQ: clique no item → toggle open/close com animação height transition
  ⑧ Botão "copiar" nos script blocks: navigator.clipboard.writeText(texto) + feedback visual "Copiado!"

══════ COMPONENTES PREMIUM OBRIGATÓRIOS ══════
Hero section por seção: div.icon-wrap 56px gradient + .section-badge uppercase label + h2 gradient-text clamp + p.hero-desc muted + dot-grid background + separador gradiente após
Stat cards: grid repeat(auto-fit,minmax(200px,1fr)); card com ::before accent line topo 3px gradient; stat-value clamp(1.8rem,4vw,2.6rem) gradient-text; label uppercase muted .7rem; ícone SVG 20px canto superior direito; box-shadow var(--shadow-sm); hover shadow-md + translateY(-4px)
Tabelas: wrapper div.table-wrap border-radius:14px overflow-x:auto; thead gradient primary 100%; letra uppercase .8rem; tr:hover rgba primary .04; nth-child(even) rgba primary .015; td padding 12px 20px; sticky thead; border-radius 14px
Script blocks: bg surface, border-left 4px primary, border-radius 0 12px 12px 0, badge canal emoji pill (📱WhatsApp/📧Email/📞Call/💬DM), font mono .9rem, label momento muted, BOTÃO "📋 Copiar" canto superior direito — navigator.clipboard + feedback "Copiado!" 2s
Cards DEFA/AIDA/Pilares: grid 4 cols → 2 (≤900px) → 1 (≤560px); letra destaque gradient bg-clip:text; card ::before accent gradient topo 3px; hover gradient border via padding-box/border-box
Timeline: horizontal desktop → vertical ≤768px; dot 12px bg primary box-shadow var(--shadow-primary); linha gradient primary→accent; cada ponto: nome bold + badge responsável + badge ferramenta + badge SLA + desc muted; stagger entrada reveal
Progress bars: wrapper bg rgba primary .1 border-radius 999px height 8px; fill gradient primary→accent; animado width:0→valor ao entrar viewport 1.4s ease-out; label valor % à direita mono
Checklists: ✓ circle 22px bg rgba(16,185,129,.12) border rgba(16,185,129,.3) ícone SVG check verde / ✗ circle 22px bg rgba(239,68,68,.10) border rgba(239,68,68,.25) ícone SVG x vermelho; item hover bg rgba primary .03
Badges pill: sistema completo conforme DESIGN PREMIUM AVANÇADO — badge-ok/warn/alert/info/primary/neutral
Glassmorphism (CTAs hero e cards destaque): bg rgba(255,255,255,.05) border 1px solid rgba(255,255,255,.10) backdrop-filter:blur(16px) border-radius:20px; dark mode only
Quote blocks: border-left 4px var(--color-accent); bg rgba(var(--accent-rgb),.04); aspas decorativas " " font-size:4rem opacity:.15 position:absolute top:8px left:16px; padding:20px 24px 20px 48px
Separadores de seção: div com badge circular nº primary 32px + linha gradient primary→transparent flex:1 height:1px ml:12px; margin-bottom:32px
Espaçamento: entre seções 96px | sub-seções 56px | cards gap:20px | padding cards 24-32px
Hover: translateY(-4px) scale(1.01) box-shadow var(--shadow-lg) transition all .22s cubic-bezier(.22,.68,0,1.2)
Accordion: bg surface; header padding 18px 24px; chevron SVG rotativo 180deg; body max-height:0→9999px ease .4s; header.open border-bottom-radius:0; primeiro accordion aberto por padrão
Funil visual: .funnel-level div com clip-path:polygon(5% 0%,95% 0%,100% 100%,0% 100%) ou calc via JS; cada nível altura 52px; gradiente de cores fase→fase; % e label overlay center; wrapper centralizado max-width:420px
KPI Dashboard: grid cards; border-left 4px solid (cor semântica: azul/verde/âmbar/vermelho); bg surface; valor bold clamp(1.6rem,3vw,2rem); delta chip ↑/↓ com bg colorido; desc muted .8rem; ícone SVG 20px; hover shadow-md
Bar chart CSS: .bar-chart div.bar-row (flex, label 120px, barra flex:1, valor 60px); div.bar fill width:% animated; height:10px border-radius:0 4px 4px 0; gradient primary→accent; tooltip data-val em ::after

══════ SISTEMA DE EDIÇÃO INLINE (obrigatório) ══════
① data-editable="true" + id único em TODOS: h1/h2/h3, p conteúdo, td/th, li, .script-text, .stat-value, blockquote p. NÃO marcar: sidebar, header, vx-edit-bar, decorativos.
② CSS no <style>:
  .vx-editing [data-editable]{cursor:text;outline:1.5px dashed rgba(255,91,21,.35);border-radius:3px;transition:outline .15s}
  .vx-editing [data-editable]:hover{outline:2px dashed rgba(255,91,21,.65);background:rgba(255,91,21,.04)}
  .vx-editing [data-editable]:focus{outline:2px solid rgba(255,91,21,.9)!important;background:rgba(255,91,21,.06)}
③ Barra id="vx-edit-bar" (position:fixed bottom:0 left:0 right:0 height:56px z-index:9000 bg:rgba(15,12,10,.97) backdrop-filter:blur(14px) border-top:rgba(255,255,255,.08)):
  Esquerda: ✦ LUNA EDIT mono 11px primary | Botões: vx-btn-edit (✏️ Editar → ✓ Finalizar, bg primary→#22c55e) · vx-btn-undo (↩) · vx-btn-redo (↪) · vx-btn-save (💾) · vx-btn-reset (↺) · vx-status mono 11px | Direita: vx-btn-export (⬇ Exportar HTML)
④ Toolbar id="vx-toolbar" (position:fixed z-index:9999 display:none bg:#1c1917 border:rgba(255,255,255,.12) border-radius:10px): botões B/I/U/S | H1/H2/H3/P | •/1. | link/clear — posicionar sobre seleção via selectionchange
⑤ VXEditor IIFE: STORAGE_KEY='vx_edit_'+pathname | setEditMode toggle body.vx-editing + [data-editable].contentEditable | save JSON.stringify innerHTML por id → localStorage | load ao DOMContentLoaded | auto-save setInterval(save,4000) | exportHTML → cloneNode, remover vx-edit-bar+toolbar+contentEditable, Blob download | reset → confirm → removeItem → reload

══════ 7 SEÇÕES OBRIGATÓRIAS ══════
REGRA GLOBAL DE ACCORDIONS: TODAS as sub-seções devem ser abertas por botões/accordions para não ficarem extensas. CSS dos accordions: .acc-header{cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-radius:12px;background:var(--color-surface);border:1px solid var(--color-border);transition:background .2s} .acc-header:hover{background:rgba(var(--primary-rgb),.06)} .acc-header.open{border-bottom-radius:0;border-color:var(--color-primary)} .acc-chevron{transition:transform .28s ease} .acc-header.open .acc-chevron{transform:rotate(180deg)} .acc-body{overflow:hidden;max-height:0;transition:max-height .4s ease} .acc-body.open{max-height:9999px} — JavaScript: document.querySelectorAll('.acc-header').forEach(h=>{h.addEventListener('click',()=>{h.classList.toggle('open');h.nextElementSibling.classList.toggle('open')})}). O primeiro accordion de cada seção começa aberto por padrão (class="acc-header open" + class="acc-body open").

─── SEÇÃO 01 · MANUAL DE BOAS VINDAS ───
Hero premium: nome da empresa + headline de boas vindas institucional + badges de autoridade (ano de fundação, clientes atendidos, segmento).
4 accordions expansíveis:

① Missão, Visão e Valores
  3 cards premium glassmorphism lado a lado: card Missão (por que existimos — texto narrativo) + card Visão (onde queremos chegar — horizonte ambicioso) + card Valores (lista de valores em pills coloridas com ícone emoji por valor).

② Sobre a Empresa
  Timeline visual da história da empresa: fundação → marcos relevantes → hoje. Stat cards com dados-chave (tempo de mercado, cidades/estados de atuação, número de clientes, equipe). Parágrafo narrativo de apresentação da empresa com tom institucional premium.

③ Sobre o Expert / Sócios
  Card(s) de perfil premium: avatar placeholder circular com iniciais + nome + cargo/título + bio narrativa inspiradora + badges de credenciais (anos de experiência, especializações, reconhecimentos). Se houver mais de um sócio, exibir em grid de cards 2 colunas.

④ Nossa Cultura
  Grid de pilares culturais (mínimo 4): cada pilar em card com emoji grande + nome em destaque + descrição de 2 linhas. Abaixo: tabela "O que fazemos ✓ / O que NUNCA fazemos ✗" com cores verde e vermelho respectivamente.

─── SEÇÃO 02 · ESTUDO DE MERCADO ───
Hero da seção. 3 accordions expansíveis:

① Potencial de Mercado
  Stat cards com dimensionamento do mercado (TAM/SAM/SOM quando disponível, número estimado de potenciais clientes no segmento, crescimento do setor, ticket médio do mercado). Parágrafo de análise de oportunidade. Grid de 3 cards: Oportunidade Identificada + Tendência + Posicionamento Recomendado.

② Concorrentes — Briefing
  Tabela comparativa premium (header bg primary): Concorrente | Posicionamento | Forças | Fraquezas | Ticket estimado | Como nos diferenciamos. Após a tabela: cards individuais dos 3-4 principais concorrentes com análise aprofundada (nome + quem atende + canais principais + ponto forte + ponto fraco + como vencer).

③ Concorrentes — Redes Sociais & Biblioteca de Anúncios
  Grid por concorrente: card com presença em cada rede social (Instagram / LinkedIn / YouTube / TikTok) mostrando volume estimado de seguidores, frequência de posts e tipo de conteúdo predominante. Seção "Biblioteca de Anúncios": cards estilo mockup de anúncio exibindo gancho criativo, formato (vídeo/imagem/carrossel), CTA usado e posicionamento de copy — um card por concorrente com pelo menos 2 exemplos de tipo de anúncio. Fechar com grid de 3 cards: Lacunas encontradas + Oportunidades de diferenciação + Estratégia recomendada.

─── SEÇÃO 03 · PRODUTOS ───
Hero da seção. Accordion por produto — gerar quantos produtos forem fornecidos nos dados (mínimo 1, máximo ilimitado). Cada accordion contém:

① Nome + Tagline + Para quem é (perfil do comprador ideal deste produto)
② O que está incluído: checklist premium ✓ com todos os entregáveis
③ Tabela de planos/tiers (se houver): Plano | Inclui | Para quem | Preço | Diferencial
④ 3 pilares de valor em cards: o que transforma, o que resolve, o que diferencia
⑤ Objeções específicas deste produto + respostas prontas em pills expansíveis
⑥ Comparativo Este Produto vs Concorrentes: tabela com ✓/✗ por feature/benefício

─── SEÇÃO 04 · ICP — CLIENTE IDEAL ───
Hero da seção. 3 accordions grandes — cada um com visual distinto:

① Perfil de Cliente Ideal — Cliente Principal
  Persona visual: avatar placeholder com iniciais em círculo gradient + nome fictício + cargo + empresa exemplo + frase que ele diz. Grid de atributos (segmento, ticket, volume de compra, quem decide). Dores principais em cards badge-alert. Gatilhos de urgência em pills laranja. Checklist de qualificação ✓ em verde. Card de "Como abordá-lo" com dica de primeiro contato.

② Também é Nosso Cliente — Perfil Secundário
  Mesmo formato do anterior, adaptado ao perfil secundário. Seção adicional: "Diferenças na abordagem vs. Cliente Principal" — 3 bullets de adaptação de tom, canal e script.

③ Cliente que NÃO é Ideal — Anti-ICP
  Card com borda e header vermelhos. Lista de características de desqualificação em checklist ✗ badge-alert. Motivos pelos quais este perfil não gera resultado (ROI, churn, conflito). Seção "Como identificar na qualificação": perguntas que revelam o Anti-ICP. Card de ação: o que fazer quando identificar (desqualificar com elegância).

─── SEÇÃO 05 · MAPA DE OPERAÇÃO ───
Hero da seção. Fluxograma visual completo do processo comercial — do lead ao pós-venda.

① Fluxograma CSS premium: caixas conectadas por setas → representando todo o fluxo. Cada nó: nome da etapa em bold + responsável (badge pill) + ferramenta (badge pill) + SLA (badge pill). Cores por fase: prospecção (azul) / qualificação (âmbar) / proposta (roxo) / fechamento (verde) / pós-venda (teal). Layout: horizontal em desktop → vertical em mobile (≤768px).

② Tabela SLA operacional (após o fluxograma): Etapa | Responsável | Ferramenta | SLA máximo | Critério de avanço | Próximo passo.

③ Accordion: Gargalos Identificados — cards problema com badge-alert + impacto quantificado + ação corretiva + prazo recomendado.

─── SEÇÃO 06 · SCRIPTS DE VENDAS ───
Hero da seção. 9 accordions expansíveis — cada um com script COMPLETO E PRONTO (sem [placeholders], mensagem real e personalizada com dados da empresa). Usar palavras_sim, evitar palavras_nao, respeitar tom de voz. Todos os scripts em blocos terminal premium: bg surface, border-left 4px primary, border-radius 0 12px 12px 0, badge canal emoji pill (📱WhatsApp / 📧Email / 📞Call / 💬DM), label momento muted, font mono, BOTÃO "📋 Copiar" no canto superior direito com navegador.clipboard.writeText + feedback "Copiado!".

① Cadência de Qualificação
  Sequência completa: abertura com gancho → pergunta de situação → pergunta de problema → pergunta de implicação → pergunta de necessidade (SPIN) → síntese → proposta de próximo passo. Mínimo 4 mensagens sequenciais com labels de momento (Ex: "Msg 1 — Abertura", "Msg 2 — Diagnóstico").

② Follow Up 1 — Sem Resposta
  Para leads que não responderam ao primeiro contato. Sequência D+1 → D+3 → D+5 → D+10 → Despedida. Cada mensagem com gancho diferente (curiosidade / prova social / urgência / último contato).

③ Follow Up 2 — Após Primeiro Contato sem Agendamento
  Para leads que responderam mas não agendaram ainda. Sequência de 4 mensagens escalando valor e urgência: reforço de benefício → case de cliente similar → oferta de facilitação (horário alternativo, formato diferente) → CTA final.

④ Cadência de Agendamento
  Mensagens para conduzir ao agendamento: proposta de horário com opções → confirmação do agendamento → mensagem de preparação ("O que esperar da nossa conversa").

⑤ Cadência de Lembrete de Agendamento
  Sequência anti-no-show: D-2 (confirmação leve) → D-1 (lembrete com valor) → Dia da reunião manhã (motivação) → 1h antes (link/local + micro-expectativa). Tom amigável mas presente.

⑥ Cadência de Fechamento — Script de Vendas
  Script completo da reunião/call: abertura de rapport → pergunta de diagnóstico → confirmação da dor → apresentação de solução → ancoragem de valor → oferta → silêncio estratégico → tratativa de hesitação → fechamento. Mínimo 5 frases alternativas de fechamento em pills.

⑦ Cadência de Negociação
  Por objeção de preço/condição: Validar (reconhecer) → Esclarecer (entender a objeção real) → Redirecionar (valor > preço) → Fechar (proposta alternativa). Cobre: preço alto / sem orçamento agora / vou pensar / falar com sócio / concorrente mais barato / não é prioridade. Tabela: Objeção | Resposta Completa | Técnica.

⑧ Cadência de Pós Venda
  Sequência após fechamento: boas vindas (D+0) → check-in de onboarding (D+7) → acompanhamento de resultado (D+30) → pedido de depoimento/indicação (D+45) → oferta de upsell/cross-sell (D+60).

⑨ Quebra de Objeção
  Tabela premium com mínimo 8 objeções: Objeção | Script de Resposta Completo | Técnica utilizada (ancoragem/prova social/reframe/urgência) | Taxa de reversão esperada. Cobertura obrigatória: preço, tempo, concorrência, decisor ausente, "já tentei antes", "não é prioridade", "preciso pensar", "manda por e-mail".

─── SEÇÃO 07 · ESTRUTURAÇÃO DO TIME COMERCIAL ───
Hero da seção. 7 accordions expansíveis — um por cargo. Cada accordion contém 3 sub-cards ou tabs internos com visual distinto:

CARD A — DESCRIÇÃO DE CARGO (header azul/primary)
  Objetivo do cargo em 2 linhas + responsabilidades principais em checklist ✓ (mínimo 6 itens) + KPIs de performance (mínimo 4, em stat cards internos mini) + ferramentas utilizadas em badges + perfil ideal (hard skills em pills + soft skills em pills).

CARD B — ROTINA COMERCIAL (header âmbar/accent)
  Agenda modelo da semana em tabela: Dia | Horário | Atividade | Tempo | Objetivo. Rituais diários em checklist. Reuniões da semana (daily/weekly/review). Entregáveis por período: diário / semanal / mensal em cards coloridos.

CARD C — PLANO DE REMUNERAÇÃO (header verde)
  Tabela de remuneração: Componente | Descrição | Valor/Critério. Inclui: salário base (range mínimo-máximo) + comissão (% e sobre o quê + gatilho de pagamento) + bônus (critérios de meta, superação) + benefícios. Tabela de simulação de ganhos: Cenário | Meta Atingida | Salário Base | Comissão | Bônus | Total Estimado — para meta 80%, 100% e 120%.

Cargos (gerar todos os 7 acordeões):
① SDR — Sales Development Representative (prospecção e qualificação de leads)
② BDR — Business Development Representative (abertura de novas contas e canais)
③ CLOSER — Executivo de Vendas (condução e fechamento de negociações)
④ PÓS VENDA — Customer Success / Suporte (retenção, satisfação e expansão)
⑤ FARMER — Gestor de Contas (relacionamento, upsell e cross-sell em base ativa)
⑥ ANALISTA DE CRM — Operações Comerciais (dados, CRM, relatórios e processos)
⑦ RESGATE DE ORÇAMENTO — Recuperação de Leads e Clientes inativos

O resultado deve parecer uma mistura de "Consultoria de growth + SaaS premium + dashboard executivo + manual operacional proprietário". Gere o playbook completo em HTML com as 7 seções, sidebar elegante, TODOS os sub-itens em accordions expansíveis com JavaScript funcional, todos os componentes premium, design sofisticado e sistema de edição inline.

PADRÃO DE QUALIDADE VISUAL OBRIGATÓRIO:
✦ Cada seção deve ter hero cinematográfico com dot-grid background, ícone SVG no .icon-wrap gradiente, título com gradient-text e separador gradiente após.
✦ Usar sistema de elevação completo (--shadow-xs até --shadow-primary) — nunca todos os cards com a mesma sombra.
✦ Animar TUDO ao entrar no viewport: stat counters, progress bars, cards .reveal com stagger delay, seção badges com badgePop.
✦ Todos os números importantes em stat cards com gradient-text + tabular-nums.
✦ Tabelas sempre no wrapper .table-wrap com sticky thead, zebra rows, hover, border-radius 14px.
✦ Botões CTA principais com ctaPulse animation e shadow-primary.
✦ Checklists com círculos SVG ✓/✗, nunca texto puro.
✦ Timeline com dots circulares shadow-primary e linha gradient.
✦ Cards com ::before accent gradient line no topo (3px).
✦ Scrollbar customizada em toda a página e sidebar.
✦ Gradiente de texto (gradient-text) nos h1 e h2 de destaque de cada seção.
✦ O resultado deve ser visualmente indistinguível de um produto SaaS de R$50.000+ — sofisticação absoluta, hierarquia visual precisa, sensação enterprise premium que justifica alto valor percebido.`


  /* ─── Anthropic Messages API (com retry automático) ─── */
  async function callAnthropic(messages, onToken, maxTokens) {
    if (!config.openaiKey) {
      throw new Error("Chave Anthropic não configurada. Configure em 'API Key' no topo.");
    }

    const MAX_RETRIES = 2;
    const TIMEOUT_MS  = 30 * 60 * 1000; // 30 min — sem limite prático

    /* Separar system prompt dos messages (Anthropic exige system no top-level) */
    let systemPrompt = undefined;
    const filteredMessages = [];
    for (const m of messages) {
      if (m.role === "system") {
        systemPrompt = typeof m.content === "string" ? m.content : (m.content?.[0]?.text || "");
      } else {
        /* Converter image_url blocks para formato Anthropic */
        if (Array.isArray(m.content)) {
          const converted = m.content.map((block) => {
            if (block.type === "image_url" && block.image_url?.url) {
              const dataUrl = block.image_url.url;
              const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
              if (match) {
                return {
                  type: "image",
                  source: { type: "base64", media_type: match[1], data: match[2] },
                };
              }
            }
            return block;
          });
          filteredMessages.push({ role: m.role, content: converted });
        } else {
          filteredMessages.push(m);
        }
      }
    }

    const bodyObj = {
      model: config.openaiModel,
      messages: filteredMessages,
      stream: true,
      max_tokens: maxTokens || 64000,
    };
    if (systemPrompt) bodyObj.system = systemPrompt;

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      let abort   = null;
      let timeout = null;
      let reader  = null;

      try {
        abort   = new AbortController();
        timeout = setTimeout(() => abort.abort(), TIMEOUT_MS);

        console.log(`[VX] Chamada Anthropic tentativa ${attempt}/${MAX_RETRIES + 1}:`, config.openaiModel);

        /* ── Fetch ── */
        let res;
        try {
          res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            signal: abort.signal,
            headers: {
              "Content-Type": "application/json",
              "x-api-key": config.openaiKey,
              "anthropic-version": "2023-06-01",
              "anthropic-dangerous-direct-browser-access": "true",
            },
            body: JSON.stringify(bodyObj),
          });
        } catch (fetchErr) {
          if (fetchErr.name === "AbortError") {
            throw new Error("Timeout após 8 minutos. Tente novamente.");
          }
          throw new Error("Falha de rede: " + fetchErr.message);
        }

        console.log("[VX] Status HTTP:", res.status);

        if (!res.ok) {
          const raw = await res.text().catch(() => "");
          console.error("[VX] Erro HTTP:", res.status, raw.slice(0, 300));
          let msg = "Anthropic erro " + res.status;
          try { msg = JSON.parse(raw).error?.message || msg; } catch (_) {}
          // Erros fatais: não retentar
          if (res.status === 401 || res.status === 400 || res.status === 422 || attempt > MAX_RETRIES) {
            throw new Error(msg);
          }
          console.warn(`[VX] HTTP ${res.status} — aguardando ${1500 * attempt}ms antes de retentar...`);
          await new Promise((r) => setTimeout(r, 1500 * attempt));
          continue;
        }

        /* ── Leitura do stream SSE (formato Anthropic) ── */
        reader = res.body.getReader();
        const decoder = new TextDecoder();
        let content    = "";
        let buffer     = "";
        let streamDone = false;

        while (!streamDone) {
          let chunk;
          try {
            chunk = await reader.read();
          } catch (readErr) {
            const errMsg  = readErr.message || "";
            const isOurTimeout = abort.signal.aborted;

            if (isOurTimeout) {
              throw new Error("__FATAL__ Timeout: o modelo demorou mais de 8 minutos. Tente novamente.");
            }

            if (content.length > 5000 && attempt > MAX_RETRIES) {
              console.warn("[VX] Stream abortado com", content.length, "chars — usando conteúdo parcial");
              streamDone = true;
              break;
            }

            console.warn(`[VX] Stream abortado (tentativa ${attempt}): "${errMsg}"`);
            throw readErr;
          }

          if (chunk.done) { streamDone = true; break; }

          buffer += decoder.decode(chunk.value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data: ")) continue;
            const json = t.slice(6).trim();
            if (json === "[DONE]") { streamDone = true; break; }
            try {
              const parsed = JSON.parse(json);
              if (parsed.type === "message_stop") { streamDone = true; break; }
              if (parsed.type === "error") throw new Error(parsed.error?.message || "Erro no stream.");
              if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
                const token = parsed.delta.text || "";
                if (token) { content += token; onToken && onToken(token, content); }
              }
            } catch (e) {
              if (e.message && !e.message.startsWith("JSON")) throw e;
            }
          }
        }

        if (!content.trim()) {
          if (attempt <= MAX_RETRIES) {
            console.warn("[VX] Conteúdo vazio, retentando...");
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          throw new Error("API retornou conteúdo vazio. Modelo: " + config.openaiModel);
        }

        console.log("[VX] Stream concluído:", content.length, "chars");
        return content;

      } catch (err) {
        const msg = err.message || "";
        const isFatal = msg.startsWith("__FATAL__") ||
                        msg.includes("não configurada") ||
                        msg.includes("401") ||
                        msg.includes("400") ||
                        msg.includes("422");

        if (isFatal) {
          throw new Error(msg.replace("__FATAL__ ", ""));
        }

        if (attempt > MAX_RETRIES) {
          throw new Error(
            `Conexão interrompida após ${MAX_RETRIES + 1} tentativas. ` +
            `Verifique sua conexão e tente novamente. (Detalhe: ${msg})`
          );
        }

        const wait = 2000 * attempt;
        console.warn(`[VX] Tentativa ${attempt} falhou: "${msg}" — retentando em ${wait}ms`);
        await new Promise((r) => setTimeout(r, wait));

      } finally {
        if (timeout) clearTimeout(timeout);
        if (reader)  reader.cancel().catch(() => {});
      }
    }

    throw new Error("Falha após múltiplas tentativas. Verifique a conexão e tente novamente.");
  }

  /* ─── Teste rápido de conexão ─── */
  async function testConnection() {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.openaiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: config.openaiModel,
          messages: [{ role: "user", content: "Responda apenas: OK" }],
          max_tokens: 5,
        }),
      });
      const data = await res.json();
      if (data.error) return { ok: false, msg: data.error.message };
      return { ok: true, msg: data.content?.[0]?.text || "OK" };
    } catch (e) {
      return { ok: false, msg: e.message };
    }
  }

  /* ─── Mock HTML ─── */
  function buildMockPlaybook(projectData) {
    const empresa = (projectData.empresa && projectData.empresa.nome) || "Sua Empresa";
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Playbook Operacional — ${empresa}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:60px;max-width:640px;text-align:center}
.badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);border-radius:999px;font-size:13px;color:#a5b4fc;letter-spacing:.05em;margin-bottom:28px}
h1{font-size:2rem;font-weight:800;background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:16px}
p{color:#94a3b8;line-height:1.6;margin-bottom:24px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;border-radius:12px;color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif}
</style>
</head>
<body>
<div class="card">
  <div class="badge">⚡ Modo Preview</div>
  <h1>Playbook Operacional<br>${empresa}</h1>
  <p>Este é o modo mock. Configure sua API Key Anthropic para gerar o playbook completo e personalizado com IA.</p>
  <p style="font-size:13px;color:#64748b">Clique em <strong style="color:#94a3b8">API Key</strong> no topo da tela para configurar.</p>
</div>
</body>
</html>`;

    return {
      id: mockId("pb"),
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      title: `Playbook Operacional — ${empresa}`,
      html,
      pages: 1,
      wordCount: 180,
      sections: [
        "Hero — Proposta de Valor",
        "O Problema",
        "O Sistema Operacional",
        "Como Funciona",
        "Resultados",
        "Diferencial",
        "IA & Automação",
        "CTA Final",
      ],
      assets: { scripts: 8, templates: 6, objecaoMatrix: 12, kpis: 11 },
    };
  }

  /* ─── VX_API ─── */
  const VX_API = {
    config,

    setKey(key) {
      const k = key.trim();
      config.openaiKey = k || DEFAULT_KEY;
      config.useMock = false;
      try {
        if (k) localStorage.setItem(STORAGE_KEY_APIKEY, k);
        else localStorage.removeItem(STORAGE_KEY_APIKEY);
      } catch (_) {}
    },

    removeKey() {
      config.openaiKey = DEFAULT_KEY;
      config.useMock = false;
      try { localStorage.removeItem(STORAGE_KEY_APIKEY); } catch (_) {}
    },

    getKey() {
      return config.openaiKey;
    },

    testConnection,

    async saveProject(projectId, data) {
      emit("project.save", { projectId });
      try { localStorage.setItem("vx_remote_mirror_" + projectId, JSON.stringify(data)); } catch (_) {}
      return { ok: true, projectId, savedAt: new Date().toISOString() };
    },

    async loadProject(projectId) {
      emit("project.load", { projectId });
      const raw = localStorage.getItem("vx_remote_mirror_" + projectId);
      return { ok: true, projectId, data: raw ? JSON.parse(raw) : {} };
    },

    async uploadFiles(projectId, files) {
      emit("files.upload", { projectId, count: files.length });
      await sleep(300);
      return { ok: true, files: files.map((f) => ({ name: f.name, size: f.size, id: mockId("file") })) };
    },

    async generatePlaybook({ projectId, data, attachments, baseTemplate, onStep, onToken }) {
      emit("playbook.generate.start", { projectId });
      console.log("[VX] generatePlaybook iniciado", { model: config.openaiModel, hasKey: !!config.openaiKey, keyPrefix: config.openaiKey.slice(0,12), useMock: config.useMock });

      /* ── Mock mode ── */
      if (config.useMock) {
        const steps = [
          "Lendo identidade e posicionamento",
          "Mapeando ICP e gatilhos",
          "Estruturando oferta",
          "Desenhando funil comercial",
          "Cruzando objeções com respostas",
          "Calibrando KPIs e SLAs",
          "Adaptando tom de voz",
          "Costurando cases",
          "Sintetizando Playbook v1.0",
        ];
        for (let i = 0; i < steps.length; i++) {
          await sleep(700 + Math.random() * 500);
          onStep && onStep({ label: steps[i], progress: Math.round(((i + 1) / steps.length) * 100) });
        }
        const playbook = buildMockPlaybook(data || {});
        emit("playbook.generate.done", { projectId, playbook });
        return { jobId: mockId("job"), playbook };
      }

      /* ── Real Anthropic ── */
      const empresa = (data.produto && data.produto.nome) || "Empresa";
      const dataPrompt = buildDataPrompt(data || {});
      console.log("[VX] Seções com dados:", Object.keys(data || {}).filter(k => {
        const s = data[k]; return s && typeof s === "object" && Object.values(s).some(v => v != null && v !== "" && !(Array.isArray(v) && v.length === 0));
      }));
      console.log("[VX] dataPrompt (500 chars):", dataPrompt.slice(0, 500));

      /* ── Processar attachments (logos + materiais) ── */
      const files = Array.isArray(attachments) ? attachments : [];
      const logoFiles = files.filter((f) => f.kind === "image" || f.kind === "svg");
      const textFiles = files.filter((f) => f.kind !== "image" && f.kind !== "svg" && f.content);

      const logoBlock = logoFiles.length > 0
        ? `\n\n════════════════════════════════════\nIDENTIDADE VISUAL — LOGOS FORNECIDOS\n════════════════════════════════════\n` +
          `Incorpore TODOS os logos no header (max-height:40px), sidebar (52px) e hero (88px).\n\n` +
          logoFiles.map((f, i) => {
            if (f.kind === "svg")
              return `── LOGO ${i+1} SVG: ${f.name} ──\nUsar inline: ${f.content.slice(0, 25000)}`;
            return `── LOGO ${i+1} PNG/JPG: ${f.name} ──\n<img src="${f.dataUrl}" alt="${f.name}" style="max-height:48px;width:auto;object-fit:contain">`;
          }).join("\n\n")
        : "";

      const dataFilesBlock = textFiles.length > 0
        ? `\n\n════════════════════════════════════\nMATERIAL COMPLEMENTAR ANEXADO\n════════════════════════════════════\n` +
          textFiles.map((f, i) => `── ARQUIVO ${i+1}: ${f.name} ──\n${f.content.slice(0, 12000)}`).join("\n\n")
        : "";

      const baseTemplateBlock = baseTemplate
        ? `\n\n════════════════════════════════════\n` +
          (baseTemplate.isSnapshot
            ? `SNAPSHOT ATIVO — ESTRUTURA BLOQUEADA: ${baseTemplate.name}\n` +
              `════════════════════════════════════\n` +
              `ATENÇÃO MÁXIMA: O usuário ativou um SNAPSHOT como estrutura obrigatória. Siga estas regras com prioridade ABSOLUTA acima de qualquer outra instrução:\n\n` +
              `① PRESERVE EXATAMENTE a estrutura de seções, a ordem das seções e a sidebar do snapshot — NÃO adicione, remova ou reordene seções.\n` +
              `② PRESERVE o layout visual, o CSS completo, o JavaScript, os accordions e todos os componentes do snapshot.\n` +
              `③ SUBSTITUA APENAS o conteúdo textual (títulos, textos, valores, nomes, exemplos, scripts) pelos dados do cliente atual fornecidos acima.\n` +
              `④ NÃO mude o design, as cores, a tipografia nem a estrutura de navegação.\n` +
              `⑤ NÃO crie novas seções nem remova existentes — adapte o conteúdo dentro de cada seção já existente.\n` +
              `⑥ Se um dado do cliente não existir para um campo do snapshot, gere conteúdo plausível e profissional baseado no nicho/contexto — nunca deixe campos vazios.\n` +
              `O resultado deve ser IDÊNTICO em estrutura e organização ao snapshot abaixo — apenas o conteúdo muda.\n\n` +
              baseTemplate.content.slice(0, 24000)
            : `TEMPLATE BASE DE INSPIRAÇÃO: ${baseTemplate.name}\n` +
              `════════════════════════════════════\n` +
              `Use a ESTRUTURA DE SEÇÕES e a ARQUITETURA VISUAL deste template como referência.\n` +
              `Substitua TODO o conteúdo pelos dados reais do cliente acima.\n` +
              `Mantenha ou eleve o nível de design — nunca reduza a qualidade visual.\n\n` +
              baseTemplate.content.slice(0, 20000))
        : "";


      const MILESTONES = [
        { chars: 2000,  label: "01 · Criando Manual de Boas Vindas..." },
        { chars: 7000,  label: "02 · Construindo Estudo de Mercado..." },
        { chars: 13000, label: "03 · Detalhando Produtos e Ofertas..." },
        { chars: 19000, label: "04 · Mapeando ICP e Perfis de Cliente..." },
        { chars: 25000, label: "05 · Desenhando Mapa de Operação..." },
        { chars: 32000, label: "06 · Gerando Scripts de Vendas..." },
        { chars: 42000, label: "07 · Estruturando Time Comercial..." },
      ];
      let mIdx = 0;

      onStep && onStep({ label: "Conectando ao Claude Sonnet 4.6...", progress: 2 });
      console.log("[VX] Chamando Anthropic...", config.openaiModel);

      let htmlContent = await callAnthropic(
        [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: dataPrompt + logoBlock + dataFilesBlock + baseTemplateBlock +
              "\n\nAgora gere o playbook operacional premium completo em HTML, " +
              "personalizando profundamente todo o conteúdo com os dados acima. " +
              "Retorne APENAS o HTML, começando com <!DOCTYPE html>.",
          },
        ],
        (token, accumulated) => {
          onToken && onToken(token, accumulated);
          if (mIdx < MILESTONES.length && accumulated.length >= MILESTONES[mIdx].chars) {
            const pct = Math.round((mIdx / MILESTONES.length) * 88) + 6;
            onStep && onStep({ label: MILESTONES[mIdx].label, progress: pct });
            mIdx++;
          }
        },
        64000
      );

      console.log("[VX] Resposta recebida, tamanho:", htmlContent.length, "chars");
      onStep && onStep({ label: "Finalizando e validando HTML...", progress: 98 });

      /* Strip markdown fences if the model added them */
      htmlContent = htmlContent.trim();
      if (htmlContent.startsWith("```html")) htmlContent = htmlContent.slice(7);
      else if (htmlContent.startsWith("```")) htmlContent = htmlContent.slice(3);
      if (htmlContent.endsWith("```")) htmlContent = htmlContent.slice(0, -3);
      htmlContent = htmlContent.trim();

      /* Repair truncated HTML — close any open tags so the browser renders correctly */
      if (!htmlContent.toLowerCase().includes("</html>")) {
        console.warn("[VX] HTML truncado detectado — aplicando reparo");
        // Close unclosed <style> block
        const styleOpen  = (htmlContent.match(/<style[\s>]/gi) || []).length;
        const styleClose = (htmlContent.match(/<\/style>/gi) || []).length;
        if (styleOpen > styleClose) htmlContent += "\n  </style>";
        // Close unclosed <script> block
        const scriptOpen  = (htmlContent.match(/<script[\s>]/gi) || []).length;
        const scriptClose = (htmlContent.match(/<\/script>/gi) || []).length;
        if (scriptOpen > scriptClose) htmlContent += "\n  </script>";
        // Ensure body and html are closed
        if (!htmlContent.toLowerCase().includes("</body>")) htmlContent += "\n</body>";
        htmlContent += "\n</html>";
      }

      const wordCount = htmlContent.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

      const playbook = {
        id: mockId("pb"),
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        title: `Playbook Operacional — ${empresa}`,
        html: htmlContent,
        pages: 1,
        wordCount,

        sections: [
          "01 · Manual de Boas Vindas",
          "02 · Estudo de Mercado",
          "03 · Produtos",
          "04 · ICP — Cliente Ideal",
          "05 · Mapa de Operação",
          "06 · Scripts de Vendas",
          "07 · Time Comercial",
        ],
        assets: { scripts: 9, cadencias: 9, cargos: 7, objecaoMatrix: 8 },
      };

      emit("playbook.generate.done", { projectId, playbook });
      return { jobId: mockId("job"), playbook };
    },

    async generateQuickPlaybook({ description, empresa, nicho, attachments, baseTemplate, onStep, onToken }) {
      emit("playbook.quick.start", {});

      if (!config.openaiKey) {
        throw new Error("Chave Anthropic não configurada. Configure em 'API Key' no topo.");
      }

      /* ─── Detectar se algum anexo é um playbook modelo ─── */
      function isPlaybookTemplate(att) {
        const name    = att.name.toLowerCase();
        const content = att.content.toLowerCase();
        // HTML com estrutura de playbook
        if ((name.endsWith(".html") || name.endsWith(".htm")) &&
            (content.includes("playbook") || content.includes("<!doctype") || content.includes("<section"))) {
          return true;
        }
        // Texto/markdown com densidade de palavras-chave de playbook
        const kws = ["playbook","seção","script","objeção","funil","icp","defa","aida",
                     "fechamento","qualificação","follow-up","cadência","pós-venda","kpi",
                     "spin","sidebar","métricas","scripts","objeções"];
        const hits = kws.filter((k) => content.includes(k)).length;
        return hits >= 4;
      }

      const files = attachments || [];
      // baseTemplate (aba Template Base) tem prioridade sobre auto-detecção nos anexos
      const templateFile = baseTemplate || files.find(isPlaybookTemplate) || null;
      const dataFiles    = baseTemplate
        ? files // se baseTemplate global, todos os anexos são dados
        : files.filter((f) => f !== templateFile);

      /* ─── Bloco de dados do cliente ─── */
      const clientBlock =
        `════════════════════════════════════\n` +
        `DADOS DO CLIENTE\n` +
        `════════════════════════════════════\n\n` +
        (empresa ? `EMPRESA: ${empresa}\n` : "") +
        (nicho   ? `NICHO: ${nicho}\n`   : "") +
        `\nDESCRIÇÃO FORNECIDA PELO CLIENTE:\n${description}\n`;

      /* ─── Separar logos/imagens dos arquivos de dados ─── */
      const logoFiles  = dataFiles.filter((f) => f.kind === "image" || f.kind === "svg");
      const textFiles  = dataFiles.filter((f) => f.kind !== "image" && f.kind !== "svg");

      /* ─── Bloco de logos / identidade visual visual ─── */
      const logoBlock = logoFiles.length > 0
        ? `\n\n════════════════════════════════════\n` +
          `IDENTIDADE VISUAL — ARQUIVOS FORNECIDOS\n` +
          `════════════════════════════════════\n` +
          `INSTRUÇÕES CRÍTICAS PARA LOGOS E IMAGENS:\n` +
          `① Incorpore TODOS os logos abaixo no playbook: header (topo esquerdo), sidebar (topo) e hero de capa.\n` +
          `② Use o src exato para <img> ou o código SVG inline — NÃO altere nenhum caractere do dado.\n` +
          `③ Extraia a paleta de cores dominante de cada imagem pelo nome do arquivo e contexto.\n` +
          `④ Derive --color-primary, --color-secondary e --color-accent a partir dessas cores.\n\n` +
          logoFiles.map((f, i) => {
            if (f.kind === "svg") {
              return `── LOGO ${i + 1} (SVG VETORIAL): ${f.name} ──\n` +
                     `Incorporar como SVG inline nos locais indicados:\n` +
                     f.content.slice(0, 25000);
            }
            return `── LOGO ${i + 1} (IMAGEM): ${f.name} ──\n` +
                   `Incorporar com: <img src="[DATA_URL_ABAIXO]" alt="${f.name}" style="max-height:48px;width:auto;object-fit:contain">\n` +
                   `DATA URL (copiar EXATAMENTE como src do <img>):\n` +
                   f.dataUrl.slice(0, 200000);
          }).join("\n\n")
        : "";

      /* ─── Bloco de arquivos de contexto (não-template, não-imagem) ─── */
      const dataFilesBlock = textFiles.length > 0
        ? `\n\n════════════════════════════════════\n` +
          `MATERIAL COMPLEMENTAR ANEXADO\n` +
          `(Extraia e use TODO conteúdo relevante: dados da empresa, ofertas, scripts,\n` +
          ` métricas, processos, personas, cases — tudo que enriqueça o playbook)\n` +
          `════════════════════════════════════\n\n` +
          textFiles.map((a, i) =>
            `── ARQUIVO ${i + 1}: ${a.name} ──\n${a.content.slice(0, 18000)}`
          ).join("\n\n")
        : "";

      /* ─── Bloco do template modelo (se houver) ─── */
      const templateBlock = templateFile
        ? `\n\n════════════════════════════════════\n` +
          `PLAYBOOK MODELO ANEXADO: ${templateFile.name}\n` +
          `════════════════════════════════════\n` +
          `${templateFile.content.slice(0, 20000)}`
        : "";

      /* ─── Instrução de estrutura (condicional) ─── */
      const structureInstruction = (baseTemplate && baseTemplate.isSnapshot)
        ? `\n\n════════════════════════════════════\n` +
          `SNAPSHOT ATIVO — ESTRUTURA BLOQUEADA: ${baseTemplate.name}\n` +
          `════════════════════════════════════\n` +
          `ATENÇÃO MÁXIMA: O usuário ativou um SNAPSHOT como estrutura obrigatória. Siga estas regras com prioridade ABSOLUTA acima de qualquer outra instrução:\n\n` +
          `① PRESERVE EXATAMENTE a estrutura de seções, a ordem das seções e a sidebar do snapshot — NÃO adicione, remova ou reordene seções.\n` +
          `② PRESERVE o layout visual, o CSS completo, o JavaScript, os accordions e todos os componentes do snapshot.\n` +
          `③ SUBSTITUA APENAS o conteúdo textual (títulos, textos, valores, nomes, exemplos, scripts) pelos dados do cliente atual fornecidos acima.\n` +
          `④ NÃO mude o design, as cores, a tipografia nem a estrutura de navegação.\n` +
          `⑤ NÃO crie novas seções nem remova existentes — adapte o conteúdo dentro de cada seção já existente.\n` +
          `⑥ Se um dado do cliente não existir para um campo do snapshot, gere conteúdo plausível e profissional baseado no nicho/contexto — nunca deixe campos vazios.\n\n` +
          `O resultado deve ser IDÊNTICO em estrutura e organização ao snapshot — apenas o conteúdo muda.\n\n` +
          `Retorne APENAS o HTML completo, começando com <!DOCTYPE html>.`
        : templateFile
        ? `\n\n════════════════════════════════════\n` +
          `INSTRUÇÃO DE ESTRUTURA — MODO TEMPLATE\n` +
          `════════════════════════════════════\n` +
          `Foi anexado um PLAYBOOK MODELO. Siga estas regras com prioridade máxima:\n\n` +
          `① USE A MESMA ESTRUTURA DE SEÇÕES do modelo — mantenha a ordem, os títulos das seções\n` +
          `   e a organização visual como referência principal.\n` +
          `② SUBSTITUA TODO O CONTEÚDO pelos dados reais do cliente fornecidos acima.\n` +
          `   Não reutilize nenhum texto do modelo — apenas a estrutura.\n` +
          `③ MANTENHA OU MELHORE O DESIGN VISUAL — se o modelo tiver um layout premium,\n` +
          `   reproduza-o adaptado ao nicho/cores do cliente. Se o design for simples, eleve-o.\n` +
          `④ ADAPTE a terminologia ao nicho detectado nos dados do cliente.\n` +
          `⑤ O resultado deve parecer um playbook completamente novo e personalizado,\n` +
          `   não uma cópia — apenas a arquitetura de seções é herdada do modelo.\n\n` +
          `Retorne APENAS o HTML completo, começando com <!DOCTYPE html>.`
        : `\n\n════════════════════════════════════\n` +
          `INSTRUÇÃO DE ESTRUTURA — FORMATO PADRÃO VX\n` +
          `════════════════════════════════════\n` +
          `Nenhum playbook modelo foi anexado. Use a estrutura padrão VX com as 7 seções\n` +
          `obrigatórias (Boas Vindas, Estudo de Mercado, Produtos, ICP, Mapa de Operação, Scripts de Vendas, Time Comercial),\n` +
          `personalizando profundamente\n` +
          `todo o conteúdo com os dados do cliente acima.\n\n` +
          `Infira os dados que não foram fornecidos explicitamente a partir do contexto\n` +
          `(nicho, descrição, arquivos anexados). Nunca deixe seção genérica quando\n` +
          `é possível personalizar a partir das informações disponíveis.\n\n` +
          `Retorne APENAS o HTML completo, começando com <!DOCTYPE html>.`;

      const userPrompt = clientBlock + logoBlock + dataFilesBlock + templateBlock + structureInstruction;

      console.log("[VX] Quick prompt montado —",
        `desc: ${description.length} chars |`,
        `arquivos de dados: ${dataFiles.length} |`,
        `template detectado: ${templateFile ? templateFile.name : "nenhum"} |`,
        `prompt total: ${userPrompt.length} chars`
      );

      const MILESTONES = [
        { chars: 2000,  label: "01 · Criando Manual de Boas Vindas..." },
        { chars: 7000,  label: "02 · Construindo Estudo de Mercado..." },
        { chars: 13000, label: "03 · Detalhando Produtos e Ofertas..." },
        { chars: 19000, label: "04 · Mapeando ICP e Perfis de Cliente..." },
        { chars: 25000, label: "05 · Desenhando Mapa de Operação..." },
        { chars: 32000, label: "06 · Gerando Scripts de Vendas..." },
        { chars: 42000, label: "07 · Estruturando Time Comercial..." },
      ];
      let mIdx = 0;

      onStep && onStep({
        label: baseTemplate
          ? `Template base ativo · "${baseTemplate.name}"...`
          : templateFile
            ? `Modo template · usando "${templateFile.name}" como base...`
            : `Conectando ao Claude Opus 4.7${files.length > 0 ? ` · ${files.length} arquivo(s) anexado(s)` : ""}...`,
        progress: 2,
      });
      console.log("[VX] generateQuickPlaybook — chamando Anthropic...");

      let htmlContent = await callAnthropic(
        [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        (token, accumulated) => {
          onToken && onToken(token, accumulated);
          if (mIdx < MILESTONES.length && accumulated.length >= MILESTONES[mIdx].chars) {
            const pct = Math.round((mIdx / MILESTONES.length) * 88) + 6;
            onStep && onStep({ label: MILESTONES[mIdx].label, progress: pct });
            mIdx++;
          }
        }
      );

      console.log("[VX] Quick playbook recebido:", htmlContent.length, "chars");
      onStep && onStep({ label: "Finalizando e validando HTML...", progress: 98 });

      htmlContent = htmlContent.trim();
      if (htmlContent.startsWith("```html")) htmlContent = htmlContent.slice(7);
      else if (htmlContent.startsWith("```")) htmlContent = htmlContent.slice(3);
      if (htmlContent.endsWith("```")) htmlContent = htmlContent.slice(0, -3);
      htmlContent = htmlContent.trim();

      const wordCount = htmlContent.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      const nomeEmpresa = empresa || "Empresa";

      const playbook = {
        id: mockId("pb"),
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        title: `Playbook Operacional — ${nomeEmpresa}`,
        html: htmlContent,
        pages: 1,
        wordCount,
        sections: [
          "01 · Manual de Boas Vindas",
          "02 · Estudo de Mercado",
          "03 · Produtos",
          "04 · ICP — Cliente Ideal",
          "05 · Mapa de Operação",
          "06 · Scripts de Vendas",
          "07 · Time Comercial",
        ],
        assets: { scripts: 9, cadencias: 9, cargos: 7, objecaoMatrix: 8 },
      };

      emit("playbook.quick.done", { playbook });
      return { jobId: mockId("job"), playbook };
    },

    buildDataPrompt,

    async adaptPlaybook({ html, prompt, onStep, onToken }) {
      if (!config.openaiKey) {
        throw new Error("Chave Anthropic não configurada. Configure em 'API Key' no topo.");
      }

      /* System prompt focado só em conteúdo — CSS/JS são preservados localmente */
      const ADAPT_SYSTEM = `Você é um especialista em adaptação de playbooks operacionais HTML.
Receberá o HTML ESTRUTURAL de um playbook (blocos <style> e <script> foram removidos e serão reinjetados automaticamente do original — NÃO os gere) e dados de uma nova empresa.
Sua missão: atualizar APENAS o conteúdo textual visível — nomes, scripts, valores, métricas, narrativas — pelos novos dados, mantendo a estrutura HTML intacta.

REGRAS ABSOLUTAS:
1. Retorne APENAS o HTML estrutural atualizado, começando com <!DOCTYPE html>. Sem markdown, sem explicações.
2. NÃO inclua blocos <style> nem <script> — eles serão reinjetados do original automaticamente.
3. PRESERVE: estrutura HTML, layout, sidebar, accordions, IDs, classes e atributos dos elementos.
4. SUBSTITUA: nomes da empresa, scripts de vendas, objeções, perfis de ICP, valores, métricas, processos e textos narrativos.
5. Adapte terminologia ao nicho detectado (médico→paciente, b2b→lead, imóvel→unidade, etc.).
6. Se um dado não foi fornecido, mantenha o conteúdo existente ou gere texto profissional plausível para o nicho.
7. NÃO adicione nem remova seções, accordions ou itens da sidebar.
8. Retorne a mesma estrutura do input — apenas o conteúdo textual muda.`;

      /* Milestones calibrados para o output menor (skeleton ~8–15k chars) */
      const MILESTONES = [
        { chars: 1000,  label: "01 · Atualizando Manual de Boas Vindas..." },
        { chars: 3000,  label: "02 · Adaptando Estudo de Mercado..." },
        { chars: 5500,  label: "03 · Atualizando Produtos e Ofertas..." },
        { chars: 8000,  label: "04 · Adaptando ICP e Perfis de Cliente..." },
        { chars: 11000, label: "05 · Atualizando Mapa de Operação..." },
        { chars: 14000, label: "06 · Adaptando Scripts de Vendas..." },
        { chars: 18000, label: "07 · Atualizando Time Comercial..." },
      ];
      let mIdx = 0;

      onStep && onStep({ label: "Preparando skeleton do playbook...", progress: 2 });

      const { skeleton, resources } = createSkeletonForPrompt(html);
      console.log(
        `[VX] adaptPlaybook: ${html.length} → skeleton ${skeleton.length} chars ` +
        `(${Math.round((1 - skeleton.length / html.length) * 100)}% redução | ` +
        `${resources.styles.length} style blocks | ${resources.scripts.length} script blocks)`
      );

      let result = await callAnthropic(
        [
          { role: "system", content: ADAPT_SYSTEM },
          {
            role: "user",
            content:
              "DADOS DA NOVA EMPRESA:\n" + prompt +
              "\n\nPLAYBOOK — HTML ESTRUTURAL (adapte o conteúdo textual):\n" + skeleton,
          },
        ],
        (token, accumulated) => {
          onToken && onToken(token, accumulated);
          if (mIdx < MILESTONES.length && accumulated.length >= MILESTONES[mIdx].chars) {
            const pct = Math.round((mIdx / MILESTONES.length) * 88) + 6;
            onStep && onStep({ label: MILESTONES[mIdx].label, progress: pct });
            mIdx++;
          }
        }
      );

      onStep && onStep({ label: "Reinjetando estilos e scripts originais...", progress: 97 });

      result = result.trim();
      if (result.startsWith("```html")) result = result.slice(7);
      else if (result.startsWith("```")) result = result.slice(3);
      if (result.endsWith("```")) result = result.slice(0, -3);
      result = result.trim();

      /* Ensure closing tags */
      if (!result.toLowerCase().includes("</body>")) result += "\n</body>";
      if (!result.toLowerCase().includes("</html>")) result += "\n</html>";

      /* Inject original CSS and JS back — this is what makes the visual identical */
      result = reinjectResources(result, resources);

      console.log(`[VX] adaptPlaybook: output final ${result.length} chars`);
      return result;
    },

    async editPlaybook({ html, prompt, attachments, onToken }) {
      if (!config.openaiKey) {
        throw new Error("Chave Anthropic não configurada. Configure em 'API Key' no topo.");
      }

      const EDIT_SYSTEM = `Você é um editor especializado de playbooks HTML.
Receberá um playbook HTML completo, uma instrução de edição e opcionalmente arquivos anexados (imagens, logos, documentos de referência).
Sua tarefa: aplicar APENAS as mudanças solicitadas, utilizando os anexos como referência quando relevante para enriquecer a edição.
REGRAS OBRIGATÓRIAS:
- Retorne APENAS o HTML completo e válido, começando exatamente com <!DOCTYPE html>
- Não adicione explicações, markdown, comentários ou qualquer texto fora do HTML
- Não refaça nem altere seções não mencionadas na instrução
- Preserve todos os estilos, scripts, estrutura e layout existentes
- Aplique as mudanças de forma cirúrgica, precisa e mínima
- Se imagens foram anexadas e são relevantes à instrução, analise-as visualmente e incorpore-as onde indicado (use o dataUrl exato como src do <img>)`;

      /* ── Build attachment blocks ── */
      const files = Array.isArray(attachments) ? attachments : [];
      const svgFiles   = files.filter((f) => f.kind === "svg");
      const rasterImgs = files.filter((f) => f.kind === "image" && f.dataUrl);
      const textFiles  = files.filter((f) => f.kind !== "image" && f.kind !== "svg" && f.content);

      let textAttBlock = "";

      if (svgFiles.length > 0) {
        textAttBlock += "\n\n════ SVGs ANEXADOS ════\n";
        textAttBlock += "Incorpore-os no playbook conforme a instrução (código SVG inline exato abaixo).\n\n";
        svgFiles.forEach((f, i) => {
          textAttBlock += `── ${i + 1}. SVG: ${f.name}\n${f.content.slice(0, 20000)}\n\n`;
        });
      }

      if (rasterImgs.length > 0) {
        textAttBlock += "\n\n════ IMAGENS ANEXADAS ════\n";
        textAttBlock += `${rasterImgs.length} imagem(ns) enviada(s) acima no formato vision. Analise-as e incorpore-as no playbook conforme solicitado, `;
        textAttBlock += "usando <img src=\"[DATA_URL_DA_IMAGEM]\" ...> com o dataUrl exato recebido.\n";
        rasterImgs.forEach((f, i) => {
          textAttBlock += `── ${i + 1}. ${f.name} (use o src exato da imagem ${i + 1} acima)\n`;
        });
        textAttBlock += "\n";
      }

      if (textFiles.length > 0) {
        textAttBlock += "\n\n════ ARQUIVOS DE REFERÊNCIA ANEXADOS ════\n";
        textAttBlock += "Use o conteúdo abaixo para enriquecer as edições solicitadas.\n\n";
        textFiles.forEach((f, i) => {
          textAttBlock += `── ${i + 1}. ${f.name}:\n${f.content.slice(0, 10000)}\n\n`;
        });
      }

      const textContent =
        "INSTRUÇÃO DE EDIÇÃO:\n" + prompt +
        textAttBlock +
        "\n\nPLAYBOOK ATUAL:\n" + html;

      /* ── Montar content: array vision se houver imagens raster, string caso contrário ── */
      let userContent;
      if (rasterImgs.length > 0) {
        userContent = [
          { type: "text", text: textContent },
          ...rasterImgs.map((f) => ({
            type: "image_url",
            image_url: { url: f.dataUrl, detail: "high" },
          })),
        ];
      } else {
        userContent = textContent;
      }

      let result = await callAnthropic(
        [
          { role: "system", content: EDIT_SYSTEM },
          { role: "user", content: userContent },
        ],
        onToken
      );

      result = result.trim();
      if (result.startsWith("```html")) result = result.slice(7);
      else if (result.startsWith("```")) result = result.slice(3);
      if (result.endsWith("```")) result = result.slice(0, -3);
      return result.trim();
    },

    async getDownloadUrl(playbookId, format) {
      emit("playbook.download", { playbookId, format });
      await sleep(100);
      return { url: null, filename: `vx-playbook-${playbookId}.${format}` };
    },

    async createShareLink(playbookId) {
      emit("playbook.share", { playbookId });
      await sleep(180);
      return { url: `https://vx.ai/p/${playbookId}`, expiresAt: null };
    },
  };

  window.VX_API = VX_API;
})();
