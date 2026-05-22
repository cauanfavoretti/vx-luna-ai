// Estrutura das 7 seções do playbook
const SECTIONS = [
  {
    id: "boasvindas",
    num: "01",
    title: "Boas Vindas",
    subtitle: "Identidade, missão e cultura da empresa",
    icon: "building",
    summary: "Fundação, valores, sócios e jeito de ser.",
    fields: [
      { id: "g_empresa",    kind: "group",    label: "Empresa" },
      { id: "nome",         kind: "text",     label: "Nome da empresa",    placeholder: "ex.: Acme Vendas",                col: 6 },
      { id: "nicho",        kind: "text",     label: "Nicho / mercado",    placeholder: "ex.: SaaS B2B, Clínica, Agência", col: 6 },
      { id: "site",         kind: "text",     label: "Site / Instagram",   placeholder: "https:// ou @perfil",             col: 6 },
      { id: "regiao",       kind: "text",     label: "Região de atuação",  placeholder: "ex.: Brasil, SP, LATAM",          col: 6 },
      { id: "sobre",        kind: "textarea", label: "Sobre a empresa",    placeholder: "Breve histórico — quando foi fundada, o que fazem e por quê", rows: 3 },
      { id: "resultados",   kind: "textarea", label: "Cases e resultados", placeholder: "Resultados reais de clientes, ROI, depoimentos e números que provam a entrega", rows: 2 },

      { id: "g_mvv",   kind: "group",    label: "Missão, Visão e Valores" },
      { id: "missao",  kind: "textarea", label: "Missão", placeholder: "Por que a empresa existe além de lucrar — propósito em 1-2 frases", rows: 2 },
      { id: "visao",   kind: "textarea", label: "Visão",  placeholder: "Onde quer chegar — horizonte de 3-5 anos", rows: 2 },
      { id: "valores", kind: "chips",    label: "Valores", suggestions: ["Resultado", "Transparência", "Excelência", "Inovação", "Cliente no centro", "Integridade", "Velocidade", "Confiança"] },

      { id: "g_expert",     kind: "group",    label: "Expert / Sócios" },
      { id: "expert_nome",  kind: "text",     label: "Nome(s)",            placeholder: "ex.: João Silva, Maria Costa",            col: 6 },
      { id: "expert_cargo", kind: "text",     label: "Cargo",              placeholder: "ex.: CEO, Fundadora, Head Comercial",      col: 6 },
      { id: "expert_bio",   kind: "textarea", label: "Bio e trajetória",   placeholder: "Experiência, conquistas e por que é referência no nicho", rows: 2 },
      { id: "expert_cred",  kind: "chips",    label: "Credenciais", suggestions: ["10+ anos de experiência", "MBA", "Ex-Big4", "Ex-Google", "100+ clientes", "Prêmio de mercado"] },

      { id: "g_cultura",  kind: "group",    label: "Nossa Cultura" },
      { id: "percepcao",  kind: "chips",    label: "Como deseja ser percebida", suggestions: ["Premium", "Consultiva", "Técnica", "Próxima", "Inovadora", "Confiável", "Ágil", "Humana", "Especialista"] },
      { id: "proposito",  kind: "textarea", label: "Propósito e missão comercial",       placeholder: "O que o time de vendas existe para fazer no mundo", rows: 2 },
      { id: "conduta",    kind: "textarea", label: "O que fazemos vs. NUNCA fazemos",    placeholder: "Comportamentos esperados e linhas vermelhas inegociáveis do time", rows: 2 },
    ],
  },
  {
    id: "mercado",
    num: "02",
    title: "Estudo de Mercado",
    subtitle: "Oportunidade, concorrentes e estratégia",
    icon: "chart",
    summary: "Tamanho de mercado, análise competitiva e posicionamento.",
    fields: [
      { id: "g_potencial",       kind: "group",    label: "Potencial de Mercado" },
      { id: "mercado_tamanho",   kind: "textarea", label: "Tamanho e oportunidade",   placeholder: "Estimativa do mercado, número de clientes potenciais e crescimento do setor", rows: 2 },
      { id: "mercado_tendencia", kind: "textarea", label: "Tendências e diferencial", placeholder: "O que está mudando no setor e como vocês se posicionam para capturar essa oportunidade", rows: 2 },

      { id: "g_concorrentes",        kind: "group",    label: "Concorrentes — Briefing" },
      { id: "concorrentes_briefing", kind: "textarea", label: "Principais concorrentes",            placeholder: "Liste 3-5 concorrentes: nome · posicionamento · preço estimado · forças · fraquezas", rows: 5 },
      { id: "diferenciais",          kind: "textarea", label: "Nosso diferencial vs. concorrentes", placeholder: "Por que um cliente escolheria vocês? Argumento principal de diferenciação.", rows: 2 },

      { id: "g_redes",               kind: "group",    label: "Redes Sociais & Biblioteca de Anúncios" },
      { id: "concorrentes_redes",    kind: "textarea", label: "Presença digital dos concorrentes", placeholder: "Instagram, LinkedIn, YouTube por concorrente — volume estimado, frequência e tipo de conteúdo", rows: 3 },
      { id: "concorrentes_anuncios", kind: "textarea", label: "Biblioteca de anúncios",            placeholder: "Tipos de criativos, ganchos, formatos e CTAs que os concorrentes usam", rows: 3 },
    ],
  },
  {
    id: "produtos",
    num: "03",
    title: "Produtos",
    subtitle: "O que você vende e como está estruturado",
    icon: "box",
    summary: "Cada produto com nome, preço, público e entregáveis.",
    fields: [
      { id: "lista", kind: "products", label: "Produtos / Serviços" },
    ],
  },
  {
    id: "icp",
    num: "04",
    title: "ICP",
    subtitle: "Quem compra cada produto, quem não compra",
    icon: "target",
    summary: "ICP por produto, perfil secundário e Anti-ICP.",
    fields: [
      { id: "modelo",      kind: "segmented", label: "Modelo de negócio", options: ["B2B", "B2C", "B2B2C", "D2C"] },

      { id: "g_principal", kind: "group",        label: "ICP por Produto" },
      { id: "por_produto", kind: "icp_products",  label: "ICP por Produto" },

      { id: "g_secundario",   kind: "group",    label: "Também é Nosso Cliente" },
      { id: "icp_secundario", kind: "textarea", label: "Perfil secundário e diferenças na abordagem", placeholder: "Quem mais compra — cargo, contexto, dor — e como abordar diferente do perfil principal", rows: 3 },

      { id: "g_antiicp", kind: "group",    label: "Cliente que NÃO é Ideal" },
      { id: "anti_icp",  kind: "textarea", label: "Perfil que não devem atender", placeholder: "Características, por que não funciona (churn, ROI negativo, conflito) e como dispensar com elegância", rows: 3 },
    ],
  },
  {
    id: "operacao",
    num: "05",
    title: "Mapa de Operação",
    subtitle: "Fluxo comercial do lead ao pós-venda",
    icon: "gear",
    summary: "Stack, funil, fluxograma, gargalos e identidade visual.",
    fields: [
      { id: "crm",           kind: "text",        label: "CRM utilizado",                      placeholder: "ex.: HubSpot, Pipedrive, RD Station", col: 6 },
      { id: "ferramentas",   kind: "chips",       label: "Ferramentas do time", suggestions: ["WhatsApp Business", "Notion", "Slack", "Loom", "Apollo", "Calendly", "Make", "Zapier", "Google Meet"] },
      { id: "funis",         kind: "textarea",    label: "Etapas do funil e critério de avanço", placeholder: "Cada etapa e o que determina que um lead avança", rows: 2 },
      { id: "fluxo_mapa",    kind: "flowbuilder", label: "Fluxograma do Processo Comercial" },
      { id: "onboarding",    kind: "textarea",    label: "Onboarding do cliente",  placeholder: "Primeiros passos após o fechamento — como entregam o que venderam", rows: 2 },
      { id: "gargalos",      kind: "textarea",    label: "Gargalos atuais",        placeholder: "Onde a operação trava hoje — seja específico", rows: 2 },
      { id: "visual_preset", kind: "visualpreset",label: "Visual do playbook" },
      { id: "cor_primaria",  kind: "text",        label: "Cor primária",   placeholder: "#3b82f6 ou 'azul royal'", col: 4 },
      { id: "cor_secundaria",kind: "text",        label: "Cor secundária", placeholder: "#6366f1 ou 'índigo'",    col: 4 },
      { id: "cor_fundo",     kind: "text",        label: "Cor de fundo",   placeholder: "#0f172a ou 'branco'",    col: 4 },
      { id: "fonte",         kind: "segmented",   label: "Tipografia",     options: ["Inter", "Poppins", "Montserrat", "Sora"] },
      { id: "mood",          kind: "chips",       label: "Mood visual", suggestions: ["Minimalista", "Sofisticado", "Tecnológico", "Humanizado", "Premium", "Arrojado", "Clean", "Corporativo"] },
      { id: "uploads",       kind: "upload",      label: "Materiais de apoio", accept: "PDFs, imagens, logo, planilhas, apresentações..." },
      { id: "obs_material",  kind: "textarea",    label: "Observações sobre os materiais", placeholder: "O que a IA deve focar ou ignorar", rows: 2 },
    ],
  },
  {
    id: "vendas",
    num: "06",
    title: "Script de Vendas",
    subtitle: "Tom, canais, processo e objeções",
    icon: "flow",
    summary: "Abordagem, voz da marca e tratativa de objeções.",
    fields: [
      { id: "canais",   kind: "chips",    label: "De onde vêm os leads?", suggestions: ["Inbound", "Outbound", "Indicação", "Tráfego pago", "Eventos", "Parcerias", "LinkedIn", "WhatsApp"] },
      { id: "processo", kind: "textarea", label: "Processo de venda",     placeholder: "Do primeiro contato ao fechamento — etapas e tempo médio em cada uma", rows: 2 },
      { id: "objecoes", kind: "chips",    label: "Objeções mais comuns",  suggestions: ["Preço alto", "Sem orçamento", "Vou pensar", "Já uso outro", "Não é prioridade", "Falar com sócio", "Não tenho tempo"] },

      { id: "g_tom",   kind: "group", label: "Tom de Voz" },
      { id: "formal",  kind: "scale", label: "Formalidade", left: "Informal",        right: "Formal" },
      { id: "energia", kind: "scale", label: "Energia",     left: "Premium / calma", right: "Agressiva / direta" },
      { id: "estilo",  kind: "scale", label: "Estilo",      left: "Direto",          right: "Consultivo" },

      { id: "g_vocab",      kind: "group",    label: "Vocabulário" },
      { id: "palavras_sim", kind: "chips",    label: "Palavras que vocês usam" },
      { id: "palavras_nao", kind: "chips",    label: "Palavras proibidas" },
      { id: "exemplo",      kind: "textarea", label: "Exemplo de mensagem ideal", placeholder: "Cole um trecho real — WhatsApp, e-mail, roteiro de call...", rows: 3, mono: true },
    ],
  },
  {
    id: "time",
    num: "07",
    title: "Time Comercial",
    subtitle: "Estrutura, metas e rituais",
    icon: "trophy",
    summary: "Cargos, conversão, KPIs e SLAs operacionais.",
    fields: [
      { id: "g_estrutura", kind: "group",    label: "Estrutura do Time" },
      { id: "equipe",      kind: "textarea", label: "Equipe comercial", placeholder: "Cargos e responsabilidades. ex.: 2 SDRs (prospecção), 3 Closers (fechamento), 1 CS (pós-venda)", rows: 3 },

      { id: "g_metricas", kind: "group", label: "Métricas Atuais" },
      { id: "conversao",  kind: "text",  label: "Conversão lead → cliente",  placeholder: "ex.: 12%", col: 4 },
      { id: "vol_leads",  kind: "text",  label: "Leads por mês",             placeholder: "ex.: 320", col: 4 },
      { id: "tempo_fech", kind: "text",  label: "Tempo médio de fechamento", placeholder: "ex.: 18d", col: 4 },

      { id: "g_metas",     kind: "group",    label: "Metas e Rituais" },
      { id: "meta",        kind: "textarea", label: "Meta dos próximos 90 dias", placeholder: "Receita, novos clientes, conversão, canais a explorar...", rows: 2 },
      { id: "sla_rituais", kind: "textarea", label: "SLAs e rituais do time",    placeholder: "Tempo de resposta a leads, daily de vendas, reunião de pipeline, review mensal...", rows: 2 },
    ],
  },
];

window.SECTIONS = SECTIONS;

/* Presets de identidade visual */
window.VISUAL_PRESETS = {
  "Dark Premium": {
    cor_primaria: "#3b82f6",
    cor_secundaria: "#6366f1",
    cor_acento: "#8b5cf6",
    cor_fundo: "#0f172a",
    fonte: "Inter",
    mood: ["Dark", "Premium", "Tecnológico", "Minimalista"],
    estilo_desc: "Visual escuro e sofisticado. Fundo profundo azul-marinho com acentos em azul elétrico e roxo. Tipografia forte Inter. Estilo SaaS premium — Linear, Stripe, Vercel.",
  },
  "Light Clean": {
    cor_primaria: "#1e293b",
    cor_secundaria: "#3b82f6",
    cor_acento: "#10b981",
    cor_fundo: "#f8fafc",
    fonte: "Inter",
    mood: ["Clean", "Profissional", "Claro", "Moderno"],
    estilo_desc: "Visual claro e limpo. Fundo branco com elementos em azul-escuro e verde-esmeralda. Leve, profissional e de fácil leitura.",
  },
  "Corporativo": {
    cor_primaria: "#1a1a2e",
    cor_secundaria: "#c9a84c",
    cor_acento: "#e8d5b7",
    cor_fundo: "#ffffff",
    fonte: "Montserrat",
    mood: ["Corporativo", "Sofisticado", "Sério", "Elegante"],
    estilo_desc: "Visual corporativo premium. Fundo branco com azul-marinho profundo e dourado como acento. Elegância e autoridade. Referência: consultoria e finanças.",
  },
  "Minimalista": {
    cor_primaria: "#111827",
    cor_secundaria: "#374151",
    cor_acento: "#f59e0b",
    cor_fundo: "#fafafa",
    fonte: "Sora",
    mood: ["Minimalista", "Clean", "Leve", "Editorial"],
    estilo_desc: "Visual extremamente limpo. Fundo quase-branco com texto escuro e toque âmbar como destaque. Espaçamento generoso. Estilo editorial.",
  },
};
