# VX · Playbook Operacional — Training Guide
> Documento de instrução para a IA gerar o playbook seguindo a estrutura padrão VX.
> Todo conteúdo deve ser personalizado com os dados preenchidos na plataforma.

---

## REGRAS GERAIS DE GERAÇÃO

- **Personalização total**: use o nome da empresa, nicho, promessa, ICP, tom e dados reais dos campos
- **Linguagem adaptada**: se for clínica → paciente/tratamento; B2B → lead/solução; agência → cliente/campanha
- **Sem conteúdo genérico**: se o dado não foi preenchido, inferir com base no nicho/setor informado
- **Tom fiel**: respeitar os sliders de formalidade, energia, estilo e profundidade
- **Frameworks obrigatórios**: DEFA, AIDA, SPIN e 5 Níveis de Consciência devem aparecer em toda geração
- **Output**: HTML standalone completo, com sidebar de navegação, pronto para uso

---

## ESTRUTURA DO PLAYBOOK — 11 SEÇÕES

---

### 01 · INÍCIO
**Identidade, propósito e posicionamento da empresa**

Gerar com base em: `empresa.nome`, `empresa.vende`, `empresa.transformacao`, `empresa.diferencial`, `empresa.promessa`, `empresa.percepcao`

#### Conteúdo obrigatório:

**Propósito**
> Por que a empresa existe além de lucrar. Conexão emocional com a missão.
> Formato: 2–3 frases diretas, impactantes.

**Missão comercial**
> O que o time comercial existe para fazer. Orientação clara de comportamento.

**Oferta principal**
> Nome da oferta, o que inclui, para quem é, qual transformação entrega.
> Formato: bloco destacado com título + descrição + bullet de benefícios

**Pilares da marca** (3 pilares, tabela)
| Pilar | Significado | Como aplicar no dia a dia |
|-------|-------------|--------------------------|
| [Pilar 1 baseado nos diferenciais] | [descrição] | [aplicação prática] |
| [Pilar 2] | [descrição] | [aplicação prática] |
| [Pilar 3] | [descrição] | [aplicação prática] |

**Os três valores comerciais** (formato card triplo)
> Valores que guiam todas as decisões de venda da empresa.
> Baseado em: tom, diferencial e promessa central.

---

### 02 · ICP — CLIENTE IDEAL
**Perfil exato de quem compra, fecha e gera lucro**

Gerar com base em: `icp.*`, `empresa.nicho`, `oferta.ticket`, `processo.qualifica`, `processo.desqualifica`

#### Conteúdo obrigatório:

**Perfil do cliente ideal** (narrativo)
> Descrição em prosa: quem é, qual cargo/situação, qual contexto de vida/negócio,
> qual dor principal, o que motivou a busca, qual transformação deseja.

**Perfis comportamentais** (4 perfis, cards)
Classificar os perfis de cliente com base no ICP descrito:
| Perfil | Comportamento | Como abordar | Gatilho de fechamento |
|--------|--------------|--------------|----------------------|
| Analítico | Pede dados, compara, demora | Apresentar números e provas | ROI comprovado |
| Decidido | Quer velocidade, objetivo | Ser direto, sem enrolação | Disponibilidade imediata |
| Cético | Teve experiência ruim | Construir confiança aos poucos | Garantia e prova social |
| Relacional | Decide pela conexão | Investir no relacionamento | Confiança na pessoa |

**Abordagem por personalidade**
> Para cada perfil: linguagem ideal, o que evitar, como conduzir o processo.

**Anti-ICP — Quem NÃO atender**
> Lista clara de perfis que a empresa deve rejeitar ou não priorizar.
> Baseado em: `icp.perde_vendas`, `processo.desqualifica`, conhecimento do nicho.
> Formato: lista com ícone ✗, título e justificativa curta.

---

### 03 · DEFA — METODOLOGIA COMERCIAL
**O processo de vendas da empresa, letra por letra**

Gerar com base em: `processo.*`, `icp.dor_principal`, `icp.urgencia`, `oferta.*`, `tom.*`

O DEFA define as 4 fases do processo comercial. Cada fase tem objetivo, ferramentas e critério de avanço.

#### D — DIAGNÓSTICO
> Objetivo: entender profundamente o cliente antes de qualquer apresentação.

Gerar 5–7 perguntas de diagnóstico personalizadas para o nicho da empresa.
Formato: lista numerada com a pergunta + o que ela revela.

Exemplo de estrutura (adaptar para o nicho):
- Qual sua principal dor/desafio com [tema do produto]?
- Há quanto tempo convive com isso?
- O que motivou buscar uma solução agora?
- Já tentou outras soluções? O que funcionou/não funcionou?
- Qual o prazo esperado para resolver isso?

#### E — ENCANTAMENTO
> Objetivo: conectar a solução à transformação de vida/negócio do cliente.

Gerar diretrizes de apresentação baseadas no tom e oferta:
- Quantos atributos apresentar (3–4, os mais relevantes para o perfil)
- Como criar o cenário de transformação ("Imagina você/sua empresa...")
- Linguagem de benefício (não de ficha técnica)
- Como usar casos e depoimentos nessa fase

#### F — FECHAMENTO
> Objetivo: conduzir a decisão com naturalidade.

Gerar:
- Checklist de verificação antes de fechar (objeções tratadas? próximo passo definido?)
- 3–5 frases de fechamento personalizadas para o tom da empresa
- Gatilhos de fechamento adequados ao nicho

#### A — ACOMPANHAMENTO
> Objetivo: follow-up disciplinado. Aqui nascem as recompras e indicações.

Gerar cadência personalizada (ver também seção 09 · Follow-up):
- Dia 1: ação + mensagem
- Dia 2: ação + mensagem
- Dia 3: ação + mensagem
- Dia 5: ação + mensagem
- Dia 10+: ação + mensagem

#### SPIN Selling aplicado ao negócio
Gerar tabela com perguntas SPIN personalizadas para o nicho:
| Etapa | Pergunta modelo | Objetivo |
|-------|----------------|----------|
| Situação | [pergunta sobre contexto atual] | Mapear a situação real |
| Problema | [pergunta sobre a dor] | Fazer o cliente nomear o problema |
| Implicação | [pergunta sobre consequências] | Ampliar a percepção do custo do problema |
| Necessidade de solução | [pergunta sobre o ideal] | Cliente articula o que precisa |

---

### 04 · AIDA — JORNADA EMOCIONAL DO CLIENTE
**Do primeiro impacto até a decisão de compra**

Gerar com base em: `empresa.promessa`, `empresa.diferencial`, `icp.dor_principal`, `icp.urgencia`, `tom.*`, `cases.*`

O AIDA guia a emoção do cliente em cada fase. Cada etapa tem uma emoção-alvo e linguagem específica.

#### A — ATENÇÃO | Emoção: Curiosidade + Atração
> Gerar: headline de impacto para primeiro contato (anúncio, mensagem inicial, post).
> Baseado na promessa e diferencial da empresa.
> Tom: disruptivo, diferente do mercado.

#### I — INTERESSE | Emoção: Identificação + Segurança
> Gerar: mensagem de identificação com o ICP.
> Conectar ao perfil exato do cliente, fazer ele se sentir compreendido.
> Usar a dor principal e o contexto do ICP.

#### D — DESEJO | Emoção: Transformação + Conquista
> Gerar: frase/bloco que faz o cliente se ver com o problema resolvido.
> Usar cenário real e específico para o nicho.
> Este é o momento em que a venda acontece emocionalmente.

#### A — AÇÃO | Emoção: Decisão + Urgência Real
> Gerar: convite direto para o próximo passo (reunião, consulta, demo, visita).
> Reduzir risco percebido. Urgência genuína (não fake).

#### 5 Níveis de Consciência
Adaptar a abordagem ao nível de consciência do cliente:
| Nível | Situação do cliente | Abordagem | Exemplo de fala personalizada |
|-------|--------------------|-----------|-----------------------------|
| Inconsciente | Não sabe que tem o problema | Provocar com dado/realidade | [gerar com base no nicho] |
| Com problema | Sabe que tem, não sabe a solução | Nomear e validar o problema | [gerar] |
| Com solução | Sabe a solução, não conhece a empresa | Apresentar diferencial | [gerar] |
| Com produto | Conhece a empresa, está comparando | Reforçar prova social e ROI | [gerar] |
| Pronto para comprar | Decidido, precisa do empurrão | Facilitar ação e remover fricção | [gerar] |

---

### 05 · FUNIL — PIPELINE COMERCIAL
**O caminho padrão de todo lead, com responsáveis e SLAs**

Gerar com base em: `processo.*`, `metricas.*`, `operacao.crm`, `operacao.equipe`

#### Etapas do Funil
Gerar as etapas do funil baseado no processo comercial informado.
Para cada etapa:
| Etapa | Objetivo | Responsável | Critério de avanço | SLA |
|-------|----------|-------------|-------------------|-----|
| [etapa 1] | [objetivo] | [cargo] | [critério] | [tempo máximo] |
| ... | | | | |

#### SLAs de Atendimento
| Ação | Tempo máximo | Prioridade |
|------|-------------|-----------|
| Primeiro contato com lead novo | [baseado no nicho] | Alta |
| Retorno de proposta enviada | [baseado nos SLAs informados] | Alta |
| Follow-up após reunião | [baseado no processo] | Média |
| Reativação de lead frio | [cadência informada] | Baixa |

#### Regras do CRM
> Baseado em `operacao.crm` e disciplina operacional:

**Regra 1 — Primeiro contato rápido**
Todo lead registrado no CRM em até [tempo] do primeiro contato. Sem exceção.

**Regra 2 — Próximo passo obrigatório**
Nenhuma oportunidade avança sem "próximo passo" com data e responsável preenchidos.

**Regra 3 — Motivo de perda**
Todo lead perdido com motivo registrado. Base para melhorar o processo.

**Regra 4 — Tags de perfil ICP**
Preencher na qualificação: ICP A (alto valor) / ICP B (nurturing) / Fora do perfil.

---

### 06 · SCRIPTS DE ATENDIMENTO
**Conversas que convertem — adaptadas ao tom e oferta da empresa**

Gerar com base em: `tom.*`, `icp.*`, `oferta.*`, `empresa.*`, `objecoes.*`

> "Scripts não são engessamentos — são âncoras. Use como base e adapte ao contexto."

Gerar os 4 scripts completos, personalizados com nome da empresa, oferta, ICP e tom:

#### Script 01 — Primeiro Contato
> Canal: WhatsApp / mensagem inicial
> Objetivo: gerar curiosidade e conseguir abertura para conversa
> Tom: [baseado nos sliders de formalidade e energia]

```
[Gerar script completo de 3–5 mensagens sequenciais]
Mensagem 1: apresentação + gancho
Mensagem 2: proposta de valor + pergunta de abertura
Mensagem 3: se não respondeu — follow-up leve
```

#### Script 02 — Qualificação
> Objetivo: identificar se é ICP, mapear dor e urgência
> Tom: consultivo, sem pressão

```
[Gerar script de qualificação com as perguntas SPIN adaptadas]
Abertura natural → perguntas de situação → problema → implicação → necessidade
Duração estimada: [X] minutos
```

#### Script 03 — Agendamento / Fechamento
> Objetivo: confirmar reunião ou fechar proposta
> Tom: direto, confiante, sem agressividade

```
[Gerar script de fechamento com as frases de fechamento adaptadas ao nicho]
Verificação de objeções → proposta → fechamento → confirmação
```

#### Script 04 — Pós-venda
> Objetivo: garantir satisfação, coletar depoimento, gerar indicação
> Tom: próximo, humanizado

```
[Gerar script de pós-venda em 3 momentos: D+1, D+7, D+30]
Cada momento com objetivo específico e mensagem adaptada
```

---

### 07 · CARGOS — ESTRUTURA DO TIME
**Funções, responsabilidades e metas individuais**

Gerar com base em: `operacao.equipe`, `operacao.funis`, `metricas.*`, `processo.*`

Para cada cargo do time comercial informado:

| Cargo | Missão | Atividades diárias | Meta mensal | KPI principal |
|-------|--------|-------------------|-------------|---------------|
| [cargo 1] | [missão] | [atividades] | [meta] | [KPI] |
| ... | | | | |

**Rituais do time**
> Reuniões e cadências obrigatórias baseadas na estrutura informada:
- Daily de [X] min — objetivo e pauta padrão
- Reunião semanal de pipeline — formato e participantes
- Review mensal de performance — métricas analisadas

---

### 08 · OBJEÇÕES — TRATATIVA DE RESISTÊNCIAS
**Transformando objeções em avanços**

Gerar com base em: `objecoes.*`, `icp.inseguranca`, `oferta.porque`, `cases.*`

> Método obrigatório: **Validar → Esclarecer → Redirecionar**
> Toda objeção é um pedido disfarçado de mais informação.

Para cada objeção listada, gerar o tratamento completo:

#### [Objeção mais comum]
**Validar**: [reconhecer sem concordar]
**Esclarecer**: [pergunta para entender a objeção real]
**Redirecionar**: [resposta que avança para o fechamento]
**Frase de fechamento**: [frase específica para essa objeção]

[Repetir para cada objeção da lista `objecoes.obj_lista`]

---

### 09 · FOLLOW-UP — CADÊNCIA DE ACOMPANHAMENTO
**O acompanhamento que fecha vendas**

Gerar com base em: `processo.proposta`, `operacao.sla`, `tom.*`, `icp.*`

> "A maioria das vendas não acontece no primeiro contato."

#### Cadência padrão após proposta enviada

| Dia | Canal | Ação | Mensagem/Script |
|-----|-------|------|----------------|
| Dia 1 | [canal] | Reforço da proposta | [mensagem personalizada] |
| Dia 2 | [canal] | Evidência — caso similar | [mensagem com social proof] |
| Dia 3 | [canal] | Disponibilidade de agenda | [mensagem com CTA] |
| Dia 5 | [canal] | Novo ângulo ou condição | [mensagem com novo valor] |
| Dia 10+ | [canal] | Reativação | [mensagem de reativação] |

#### Cadência de leads frios (sem resposta)
> Para leads que pararam de responder:
- Sequência de [X] tentativas em [Y] dias
- Critério de descarte: [baseado no processo informado]
- Mensagem de despedida estratégica (abre porta para futuro)

---

### 10 · PÓS-VENDA — ONDE NASCEM AS INDICAÇÕES
**Retenção, recompra e geração de promotores**

Gerar com base em: `cases.depoimentos`, `oferta.resultados`, `operacao.onboarding`, `icp.*`

> "Tratamento/projeto concluído não é ciclo encerrado — é o início do relacionamento."

#### Jornada do cliente após a compra
| Momento | Ação | Objetivo | Responsável |
|---------|------|----------|-------------|
| D+1 | [ação baseada no negócio] | Garantir início sem fricção | [cargo] |
| D+7 | [check-in] | Identificar dúvidas e reforçar resultado | [cargo] |
| D+30 | [review de resultado] | Coletar feedback e NPS | [cargo] |
| D+60 | [oferta de expansão/recompra] | Aumentar LTV | [cargo] |
| D+90 | [pedido de indicação] | Gerar pipeline por referral | [cargo] |

#### Como pedir indicação (script)
> Gerar script específico para solicitar indicação no momento certo.
> Tom baseado em `tom.*` da empresa.

#### Protocolo de coleta de depoimento
> Momento certo, pergunta certa, canal certo.
> Usar os depoimentos existentes em `cases.depoimentos` como referência de tom.

---

### 11 · MÉTRICAS — INDICADORES E GESTÃO
**Sem números, não há escala**

Gerar com base em: `metricas.*`, `operacao.*`, `processo.*`

#### KPIs obrigatórios — acompanhamento semanal

| Indicador | Fórmula | Meta | Frequência |
|-----------|---------|------|-----------|
| Volume de leads | Leads novos no período | [baseado em `metricas.vol_leads`] | Semanal |
| Taxa de conversão | Fechamentos / Leads | [baseado em `metricas.conversao`] | Semanal |
| Ticket médio | Receita / Clientes | [baseado em `metricas.ticket_med`] | Mensal |
| Tempo de fechamento | Dias entre lead e venda | [baseado em `metricas.tempo_fech`] | Mensal |
| CAC | Investimento / Clientes | [baseado em `metricas.cac`] | Mensal |
| Taxa de no-show | Reuniões canceladas / Agendadas | Meta: abaixo de 15% | Semanal |
| Taxa de indicação | Clientes por referral / Total | Meta: acima de 30% | Mensal |

#### Origem dos leads — meta de distribuição
> Baseado nos canais informados em `processo.canais`:
> Gerar gráfico de barra visual em CSS + tabela com canal, volume atual e meta.

#### Meta dos próximos 90 dias
> Baseado em `metricas.meta`:
> Desdobrar a meta em semanas com milestones claros.
> Formato: linha do tempo + tabela de acompanhamento.

---

## REGRAS DE GERAÇÃO DE HTML

### Layout obrigatório
- **Sidebar fixa** à esquerda com as 11 seções numeradas, clicável
- **Área de conteúdo** principal com scroll independente
- **Header** com nome da empresa + versão + data de geração
- **Âncoras** em cada seção para navegação interna

### Design visual
- Fundo: `#0f172a` (principal) ou `#f8fafc` (alternativo claro)
- Sidebar: `#1e293b` com itens clicáveis
- Acentos: `#3b82f6` (azul) e `#6366f1` (índigo)
- Fonte: Inter (Google Fonts)
- Tabelas: bordas sutis, zebra striping leve
- Cards: `background rgba(255,255,255,0.03)`, borda `1px solid rgba(255,255,255,0.08)`
- Scripts: fundo `#0d1117` (terminal-like), fonte monospace, padding generoso
- Frameworks (DEFA/AIDA): cards 4 colunas com letra em destaque e cor

### Elementos visuais obrigatórios
- Cada seção com número e título no topo
- Tabelas formatadas com header colorido
- Scripts em blocos visuais distintos (tipo "terminal" ou "chat bubble")
- Letras do DEFA e AIDA em destaque tipográfico grande
- Badge de versão e data no header
- Smooth scroll + active state no sidebar ao navegar

### JavaScript obrigatório
- Highlight do item ativo no sidebar baseado no scroll (IntersectionObserver)
- Smooth scroll ao clicar nos itens do sidebar
- Botão "Voltar ao topo" flutuante

---

## GLOSSÁRIO DE ADAPTAÇÃO POR NICHO

Usar os termos corretos para o nicho da empresa:

| Conceito | Clínica/Saúde | B2B/Consultoria | Agência | Imóveis |
|---------|--------------|----------------|---------|---------|
| Cliente | Paciente | Cliente/Lead | Cliente | Comprador |
| Produto | Tratamento | Solução/Projeto | Campanha | Imóvel |
| Venda | Início do tratamento | Contrato | Briefing | Escritura |
| Recorrência | Manutenção | Renovação | Retenção | Recompra |
| Indicação | Indicação | Referral | Indicação | Referência |
| Reunião | Consulta/Avaliação | Reunião/Call | Briefing | Visita |

---

*VX · Playbook Training Guide v2.0 — Cauan Favoretti*
