/* VX — Gerador de Playbook (main app) */

const { useState, useEffect, useMemo, useRef } = React;

const STORAGE_KEY     = "vx_playbook_data_v1";
const ACTIVE_SNAP_KEY = "vx_active_snapshot";

/* ───────────────────────── INTRO SCREEN ───────────────────────── */

function IntroScreen({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter → text → ring → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 180);
    const t2 = setTimeout(() => setPhase("ring"), 500);
    const t3 = setTimeout(() => setPhase("exit"), 2700);
    const t4 = setTimeout(() => onDone(),         3550);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const dots = useMemo(() => {
    const arr = [];
    const seed = [
      [8,12],[18,75],[30,25],[45,88],[60,15],[72,60],[85,30],[92,80],
      [15,45],[35,55],[55,40],[78,20],[88,65],[25,70],[65,85],[50,5],
      [5,50],[40,10],[70,50],[95,35],[20,95],[80,92],[48,68],[12,38],
      [58,78],[35,5],[75,42],[90,15],
    ];
    seed.forEach(([l, t], i) => {
      arr.push({
        left: l + "%",
        top: t + "%",
        size: 2.5 + (i % 3) * 1.8,
        delay: (i * 0.13) % 2.2,
        dur: 1.6 + (i % 4) * 0.4,
      });
    });
    return arr;
  }, []);

  const r = 90;
  const circ = +(2 * Math.PI * r).toFixed(2);
  const isExit = phase === "exit";
  const hasText = phase !== "enter";
  const hasRing = phase === "ring" || isExit;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0a0907",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      clipPath: isExit ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)",
      transition: isExit
        ? "clip-path 0.82s cubic-bezier(0.76, 0, 0.24, 1)"
        : "none",
    }}>
      <style>{`
        @keyframes vxDot {
          0%,100% { opacity:.12; transform:scale(1); }
          50%      { opacity:.65; transform:scale(1.5); }
        }
        @keyframes vxFadeUp {
          from { opacity:0; transform:translateY(10px); filter:blur(6px); }
          to   { opacity:1; transform:translateY(0);    filter:blur(0); }
        }
        @keyframes vxBlink { to { opacity:0; } }
        @keyframes vxLogoIn {
          from { opacity:0; transform:scale(.85); }
          to   { opacity:1; transform:scale(1); }
        }
      `}</style>

      {/* Scattered dots */}
      {dots.map((d, i) => (
        <div key={i} style={{
          position: "absolute",
          left: d.left, top: d.top,
          width: d.size, height: d.size,
          borderRadius: "50%",
          background: "var(--orange)",
          animation: `vxDot ${d.dur}s ${d.delay}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* SVG ring + logo */}
      <div style={{ position: "relative", width: 220, height: 220,
        display: "flex", alignItems: "center", justifyContent: "center" }}>

        <svg width={220} height={220} style={{ position: "absolute", inset: 0 }}>
          {/* faint static ring */}
          <circle cx={110} cy={110} r={r}
            fill="none" stroke="rgba(255,91,21,0.10)" strokeWidth={1} />
          {/* animated drawing ring */}
          <circle cx={110} cy={110} r={r}
            fill="none"
            stroke="var(--orange)" strokeWidth={1.6} strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={hasRing ? 0 : circ}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "110px 110px",
              transition: hasRing
                ? "stroke-dashoffset 1.9s cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
            }}
          />
          {/* inner glow ring */}
          <circle cx={110} cy={110} r={r - 14}
            fill="none" stroke="rgba(255,91,21,0.06)" strokeWidth={8} />
        </svg>

        {/* Logo centered */}
        <div style={{
          animation: hasText ? "vxLogoIn 0.55s ease both" : "none",
          opacity: hasText ? 1 : 0,
        }}>
          <window.VXLogo size={44} />
        </div>
      </div>

      {/* Main text */}
      <div style={{
        marginTop: 32, textAlign: "center",
        animation: hasText ? "vxFadeUp 0.65s 0.1s ease both" : "none",
        opacity: hasText ? 1 : 0,
        padding: "0 24px",
      }}>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: "clamp(20px, 4vw, 42px)",
          color: "var(--orange)",
          letterSpacing: "-0.01em", lineHeight: 1.2,
          textShadow: "0 0 40px rgba(255,91,21,0.35)",
        }}>
          o que vamos criar hoje?
          <span style={{
            display: "inline-block", marginLeft: 3,
            animation: "vxBlink 2.05s steps(2, start) infinite",
            color: "var(--orange)",
          }}>_</span>
        </div>
        <div style={{
          marginTop: 14,
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
          color: "var(--muted)", textTransform: "uppercase",
          animation: hasText ? "vxFadeUp 0.65s 0.35s ease both" : "none",
          opacity: hasText ? 1 : 0,
        }}>
          Luna AI · Sales Operations Engine
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={() => { setPhase("exit"); setTimeout(onDone, 850); }}
        style={{
          position: "absolute", bottom: 28, right: 28,
          background: "transparent", border: "none",
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--muted-2)", letterSpacing: "0.1em",
          cursor: "pointer", padding: "8px 12px",
          opacity: hasText ? 0.6 : 0,
          transition: "opacity 0.4s",
        }}
      >
        PULAR →
      </button>
    </div>
  );
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log("[VX] Dados restaurados do localStorage:", Object.keys(parsed));
      return parsed;
    }
  } catch (_) {}
  return {};
}

function loadActiveSnapshotId() {
  try { return localStorage.getItem(ACTIVE_SNAP_KEY) || null; } catch { return null; }
}

const PROJECT_ID = "draft-001";

/* ───────────────────────── PRODUCT SELECT ───────────────────────── */

function ProductSelectScreen({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  const products = [
    {
      id: "playbook",
      icon: (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <rect x="6" y="5" width="20" height="28" rx="3" stroke="var(--orange)" strokeWidth="1.6"/>
          <rect x="10" y="5" width="20" height="28" rx="3" stroke="var(--orange)" strokeOpacity="0.35" strokeWidth="1.6"/>
          <line x1="10" y1="13" x2="22" y2="13" stroke="var(--orange)" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="10" y1="18" x2="22" y2="18" stroke="var(--orange)" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="10" y1="23" x2="17" y2="23" stroke="var(--orange)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      label: "Playbook",
      desc: "Crie playbooks de vendas completos com identidade visual, scripts, objeções e estratégias personalizadas.",
      tag: null,
      active: true,
    },
    {
      id: "onboarding",
      icon: (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <circle cx="19" cy="14" r="6" stroke="var(--muted-2)" strokeWidth="1.6"/>
          <path d="M7 32c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="var(--muted-2)" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="29" cy="12" r="4" fill="var(--surface-2)" stroke="var(--muted-2)" strokeWidth="1.4"/>
          <line x1="29" y1="10" x2="29" y2="14" stroke="var(--muted-2)" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="29" y1="15.5" x2="29" y2="15.5" stroke="var(--muted-2)" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
      label: "Onboarding",
      desc: "Fluxos de onboarding estruturados para novos clientes e colaboradores.",
      tag: "em breve",
      active: false,
    },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "#0a0907",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      animation: "fadeIn .45s ease both",
      padding: "0 24px",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes psCardIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em",
          color: "var(--orange)", textTransform: "uppercase", marginBottom: 14,
          animation: "psCardIn .5s .05s ease both",
        }}>
          Luna AI · Sales Operations Engine
        </div>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: "clamp(26px, 4vw, 48px)",
          color: "var(--ink)", lineHeight: 1.15,
          animation: "psCardIn .5s .12s ease both",
        }}>
          o que vamos criar hoje?
        </div>
        <div style={{
          marginTop: 12, fontFamily: "var(--display)", fontSize: 14,
          color: "var(--muted)", animation: "psCardIn .5s .2s ease both",
        }}>
          Escolha o tipo de documento para começar
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center",
        maxWidth: 720,
      }}>
        {products.map((p, i) => {
          const isHov = hovered === p.id;
          return (
            <div
              key={p.id}
              onMouseEnter={() => p.active && setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => p.active && onSelect(p.id)}
              style={{
                position: "relative",
                width: 300, minHeight: 200,
                background: p.active
                  ? (isHov ? "var(--surface-2)" : "var(--surface)")
                  : "var(--surface)",
                border: `1px solid ${p.active && isHov ? "var(--orange)" : "var(--border)"}`,
                borderRadius: 20,
                padding: "32px 28px",
                cursor: p.active ? "pointer" : "default",
                transition: "all .2s",
                animation: `psCardIn .5s ${0.18 + i * 0.1}s ease both`,
                opacity: p.active ? 1 : 0.55,
                boxShadow: p.active && isHov
                  ? "0 0 0 1px var(--orange), 0 12px 40px rgba(255,91,21,0.12)"
                  : "none",
              }}
            >
              {/* Em breve badge */}
              {p.tag && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "var(--muted)",
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: 20, padding: "3px 10px",
                }}>
                  {p.tag}
                </div>
              )}

              {/* Active glow dot */}
              {p.active && (
                <div style={{
                  position: "absolute", top: 18, right: 18,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--orange)",
                  boxShadow: "0 0 8px rgba(255,91,21,0.7)",
                }} />
              )}

              <div style={{ marginBottom: 20 }}>{p.icon}</div>

              <div style={{
                fontFamily: "var(--display)", fontSize: 20, fontWeight: 700,
                color: p.active ? "var(--ink)" : "var(--muted)",
                marginBottom: 10, letterSpacing: "0.01em",
              }}>
                {p.label}
              </div>

              <div style={{
                fontFamily: "var(--display)", fontSize: 13,
                color: "var(--muted)", lineHeight: 1.6,
              }}>
                {p.desc}
              </div>

              {p.active && (
                <div style={{
                  marginTop: 24, display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
                  color: isHov ? "var(--orange)" : "var(--muted-2)",
                  textTransform: "uppercase", transition: "color .15s",
                }}>
                  Começar
                  <span style={{ fontSize: 14, transition: "transform .15s", transform: isHov ? "translateX(4px)" : "none", display: "inline-block" }}>→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      <div style={{
        marginTop: 48, fontFamily: "var(--mono)", fontSize: 11,
        color: "var(--muted-2)", letterSpacing: "0.12em",
        animation: "psCardIn .5s .4s ease both",
      }}>
        Luna AI · PLAYBOOK · v2
      </div>
    </div>
  );
}

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [productSelected, setProductSelected] = useState(false);
  const [activeTab, setActiveTab] = useState("completo");
  const [activeIdx, setActiveIdx] = useState(0);
  const [data, setData] = useState(loadInitial);
  const [savedAt, setSavedAt] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [liveContent, setLiveContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState(null);
  const [playbook, setPlaybook] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(!(window.VX_API?.getKey()));
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem("vx_welcome_1.1_beta"));
  const [snapshots, setSnapshots] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [activeSnapshotId, setActiveSnapshotId] = useState(loadActiveSnapshotId);
  const [activity, setActivity] = useState([
    { t: "Agente VX inicializado", k: "ok" },
    { t: "Aguardando coleta da Seção 01 — Empresa", k: "wait" },
  ]);

  const activeSnapshot = snapshots.find((s) => s.id === activeSnapshotId) || null;
  const effectiveBaseTemplate = activeSnapshot
    ? { name: activeSnapshot.name, content: activeSnapshot.html || "", size: (activeSnapshot.html || "").length, isSnapshot: true }
    : null;

  const saveSnapshot = async (pb, customName) => {
    const snap = {
      id: "snap_" + Date.now().toString(36),
      name: customName || pb.title || ("Snapshot " + new Date().toLocaleDateString("pt-BR")),
      createdAt: new Date().toISOString(),
      html: pb.html,
      size: pb.html.length,
      empresa: (pb.title || "").replace("Playbook Operacional — ", ""),
      sections: pb.sections || [],
    };
    setSnapshots((prev) => [snap, ...prev]);
    try {
      await window.VX_DB.saveSnapshot(snap);
    } catch (err) {
      setSnapshots((prev) => prev.filter((s) => s.id !== snap.id));
      throw err;
    }
    return snap;
  };

  const deleteSnapshot = async (id) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
    await window.VX_DB.deleteSnapshot(id);
    if (activeSnapshotId === id) {
      setActiveSnapshotId(null);
      try { localStorage.removeItem(ACTIVE_SNAP_KEY); } catch {}
    }
  };

  const activateSnapshot = (id) => {
    const newId = activeSnapshotId === id ? null : id;
    setActiveSnapshotId(newId);
    try {
      if (newId) localStorage.setItem(ACTIVE_SNAP_KEY, newId);
      else localStorage.removeItem(ACTIVE_SNAP_KEY);
    } catch {}
  };

  const exportSnapshot = (snap) => {
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vx-snapshot-${snap.id}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const parsePDFSnapshot = async (file) => {
    const lib = window.pdfjsLib;
    if (!lib) throw new Error("PDF.js não disponível");
    lib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      pages.push(tc.items.map((s) => s.str).join(" "));
    }
    return pages.join("\n\n");
  };

  const importSnapshot = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    const now = new Date().toISOString();

    if (ext === "json") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const snap = JSON.parse(e.target.result);
          if (!snap.html || !snap.name) return;
          snap.id = "snap_" + Date.now().toString(36);
          snap.importedAt = now;
          snap.createdAt = snap.createdAt || now;
          setSnapshots((prev) => [snap, ...prev]);
          await window.VX_DB.saveSnapshot(snap);
        } catch {}
      };
      reader.readAsText(file, "UTF-8");
      return;
    }

    let content = "";
    try {
      if (ext === "pdf") {
        content = await parsePDFSnapshot(file);
      } else {
        content = await file.text();
      }
    } catch (err) { console.error("[VX] importSnapshot parse error:", err); return; }

    const snap = {
      id: "snap_" + Date.now().toString(36),
      name: file.name.replace(/\.[^.]+$/, ""),
      createdAt: now,
      importedAt: now,
      html: content,
      size: content.length,
      empresa: "",
      sections: [],
    };
    setSnapshots((prev) => [snap, ...prev]);
    await window.VX_DB.saveSnapshot(snap);
  };

  const importSnapshotFolder = async (fileEntries, folderName) => {
    // Bloqueia apenas binários conhecidos — aceita todo o resto como texto
    const BINARY_EXTS = new Set([
      "png","jpg","jpeg","gif","webp","bmp","ico","svg",
      "ttf","woff","woff2","eot","otf",
      "mp4","mp3","avi","mov","wav","ogg","flac",
      "zip","tar","gz","rar","7z","bz2",
      "exe","dll","so","bin","class","pyc","o","a",
      "db","sqlite","lock","DS_Store",
    ]);

    const now = new Date().toISOString();
    const parts = [];

    for (const entry of fileEntries) {
      const { file, path } = entry;
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (BINARY_EXTS.has(ext)) continue;
      try {
        let content = ext === "pdf" ? await parsePDFSnapshot(file) : await file.text();
        parts.push(`--- ${path} ---\n${content}`);
      } catch {}
    }

    if (!parts.length) return;
    const html = parts.join("\n\n");
    const snap = {
      id: "snap_" + Date.now().toString(36),
      name: folderName,
      createdAt: now,
      importedAt: now,
      html,
      size: html.length,
      empresa: "",
      sections: [],
    };
    setSnapshots((prev) => [snap, ...prev]);
    await window.VX_DB.saveSnapshot(snap);
  };

  const renameSnapshot = async (id, newName) => {
    if (!newName.trim()) return;
    setSnapshots((prev) => prev.map((s) => s.id === id ? { ...s, name: newName.trim() } : s));
    await window.VX_DB.renameSnapshot(id, newName.trim());
  };

  const editSnapshot = async (id, prompt, { onToken, onDone, onError, attachments } = {}) => {
    const snap = snapshots.find((s) => s.id === id);
    if (!snap || !snap.html) { onError?.("Snapshot sem HTML para editar."); return; }
    try {
      const newHtml = await window.VX_API.editPlaybook({ html: snap.html, prompt, attachments, onToken });
      const newSize = new Blob([newHtml]).size;
      setSnapshots((prev) => prev.map((s) => s.id === id ? { ...s, html: newHtml, size: newSize } : s));
      await window.VX_DB.updateSnapshotHtml(id, newHtml, newSize).catch((e) =>
        console.error("[VX] updateSnapshotHtml:", e.message)
      );
      onDone?.(newHtml);
    } catch (err) {
      onError?.(err.message || "Erro ao editar snapshot.");
    }
  };

  const autoSavePlaybook = async (pb) => {
    setPlaybooks((prev) => [pb, ...prev.filter((p) => p.id !== pb.id)]);
    await window.VX_DB.savePlaybook(pb).catch((e) => console.error("[VX] autoSavePlaybook:", e.message));
  };

  const deletePlaybook = async (id) => {
    setPlaybooks((prev) => prev.filter((p) => p.id !== id));
    await window.VX_DB.deletePlaybook(id);
  };

  const openHistoryPlaybook = async (pb) => {
    if (pb.html) { setPlaybook(pb); return; }
    const html = await window.VX_DB.loadPlaybookHtml(pb.id);
    setPlaybook({ ...pb, html: html || "" });
  };

  const handlePlaybookUpdate = async (id, newHtml) => {
    setPlaybook((prev) => prev ? { ...prev, html: newHtml } : prev);
    setPlaybooks((prev) => prev.map((p) => p.id === id ? { ...p, html: newHtml } : p));
    await window.VX_DB.updatePlaybookHtml(id, newHtml).catch((e) => console.error("[VX] updatePlaybookHtml:", e.message));
  };

  // carregar snapshots e playbooks do Supabase na inicialização
  useEffect(() => {
    window.VX_DB.loadSnapshots().then(setSnapshots);
    window.VX_DB.loadPlaybooks().then(setPlaybooks);
  }, []);

  // autosave (local + back-end)
  useEffect(() => {
    const id = setTimeout(async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      try { await window.VX_API.saveProject(PROJECT_ID, data); } catch (_) {}
      setSavedAt(new Date());
    }, 500);
    return () => clearTimeout(id);
  }, [data]);

  const setField = (sectionId, fieldId, val) => {
    if (sectionId === "operacao" && fieldId === "visual_preset" && val !== "Personalizado") {
      const preset = (window.VISUAL_PRESETS || {})[val];
      if (preset) {
        setData((d) => ({
          ...d,
          operacao: {
            ...(d.operacao || {}),
            visual_preset: val,
            cor_primaria: preset.cor_primaria,
            cor_secundaria: preset.cor_secundaria,
            cor_fundo: preset.cor_fundo,
            fonte: preset.fonte,
            mood: preset.mood,
          },
        }));
        return;
      }
    }
    setData((d) => ({ ...d, [sectionId]: { ...(d[sectionId] || {}), [fieldId]: val } }));
  };

  const sections = window.SECTIONS;
  const active = sections[activeIdx];

  const totals = useMemo(() => {
    let done = 0, total = 0;
    sections.forEach((s) => {
      const p = window.sectionProgress(s, data);
      done += p.done; total += p.total;
    });
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [data, sections]);

  const completedSections = sections.filter((s) => window.sectionProgress(s, data).pct === 100).length;

  const handleQuickGenerate = async ({ desc, empresa, nicho, attachments }) => {
    if (generating) return;
    if (!window.VX_API.getKey()) { setShowKeyModal(true); return; }
    setGenerating(true);
    setPlaybook(null);
    setLiveContent("");
    setGeneratingLabel(null);
    try {
      if (activeSnapshot && activeSnapshot.html) {
        /* ── Modo edição: adapta o snapshot ativo com os novos dados ── */
        setGeneratingLabel(`Editando · ${activeSnapshot.name}`);

        const clientBlock =
          (empresa ? `EMPRESA: ${empresa}\n` : "") +
          (nicho   ? `NICHO: ${nicho}\n`   : "") +
          `\nDESCRIÇÃO DO CLIENTE:\n${desc}`;

        const textAtts = (attachments || []).filter((f) => f.kind !== "image" && f.kind !== "svg" && f.content);
        const attBlock = textAtts.length > 0
          ? "\n\nMATERIAL COMPLEMENTAR:\n" + textAtts.map((f) => `── ${f.name}:\n${f.content.slice(0, 8000)}`).join("\n\n")
          : "";

        const newHtml = await window.VX_API.adaptPlaybook({
          html: activeSnapshot.html,
          prompt: clientBlock + attBlock,
          onStep: (s) => setActivity((a) => [{ t: s.label, k: "run" }, ...a].slice(0, 9)),
          onToken: (_, accumulated) => setLiveContent(accumulated),
        });

        const wordCount = newHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
        const pb = {
          id: "pb-" + Date.now().toString(36),
          version: "2.0.0",
          generatedAt: new Date().toISOString(),
          title: `Playbook Operacional — ${empresa || activeSnapshot.empresa || "Empresa"}`,
          html: newHtml,
          pages: 1,
          wordCount,
          sections: activeSnapshot.sections || [],
          assets: { scripts: 9, cadencias: 9, cargos: 7, objecaoMatrix: 8 },
        };
        setActivity((a) => [{ t: `Playbook editado · pronto para download`, k: "ok" }, ...a].slice(0, 9));
        setPlaybook(pb);
        autoSavePlaybook(pb);
      } else {
        /* ── Modo geração normal ── */
        const { playbook: pb } = await window.VX_API.generateQuickPlaybook({
          description: desc,
          empresa,
          nicho,
          attachments,
          baseTemplate: effectiveBaseTemplate,
          onStep: (s) => setActivity((a) => [{ t: s.label, k: "run" }, ...a].slice(0, 9)),
          onToken: (_, accumulated) => setLiveContent(accumulated),
        });
        setActivity((a) => [{ t: `Playbook ${pb.version} gerado · pronto para download`, k: "ok" }, ...a].slice(0, 9));
        setPlaybook(pb);
        autoSavePlaybook(pb);
      }
    } catch (e) {
      const msg = e?.message || "Erro desconhecido ao gerar o playbook.";
      console.error("[VX] Erro na geração rápida:", e);
      setActivity((a) => [{ t: "Falha: " + msg, k: "wait" }, ...a].slice(0, 9));
      setErrorMsg(msg);
    } finally {
      setGenerating(false);
      setLiveContent("");
      setGeneratingLabel(null);
    }
  };

  const handleGenerate = async () => {
    if (generating) return;
    if (!window.VX_API.getKey()) { setShowKeyModal(true); return; }
    setGenerating(true);
    setPlaybook(null);
    setLiveContent("");
    setGeneratingLabel(null);
    try {
      const formUploads = (data.operacao && Array.isArray(data.operacao.uploads))
        ? data.operacao.uploads
        : [];

      if (activeSnapshot && activeSnapshot.html) {
        /* ── Modo edição: adapta o snapshot ativo com os dados do formulário ── */
        setGeneratingLabel(`Editando · ${activeSnapshot.name}`);

        const dataPrompt = window.VX_API.buildDataPrompt(data);
        const textFiles = formUploads.filter((f) => f.kind !== "image" && f.kind !== "svg" && f.content);
        const attBlock = textFiles.length > 0
          ? "\n\nMATERIAL COMPLEMENTAR:\n" + textFiles.map((f) => `── ${f.name}:\n${f.content.slice(0, 8000)}`).join("\n\n")
          : "";

        const newHtml = await window.VX_API.adaptPlaybook({
          html: activeSnapshot.html,
          prompt: dataPrompt + attBlock,
          onStep: (s) => setActivity((a) => [{ t: s.label, k: "run" }, ...a].slice(0, 9)),
          onToken: (_, accumulated) => setLiveContent(accumulated),
        });

        const wordCount = newHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
        const empresa = (data.produto && data.produto.nome) || activeSnapshot.empresa || "Empresa";
        const pb = {
          id: "pb-" + Date.now().toString(36),
          version: "2.0.0",
          generatedAt: new Date().toISOString(),
          title: `Playbook Operacional — ${empresa}`,
          html: newHtml,
          pages: 1,
          wordCount,
          sections: activeSnapshot.sections || [],
          assets: { scripts: 9, cadencias: 9, cargos: 7, objecaoMatrix: 8 },
        };
        setActivity((a) => [{ t: `Playbook editado · pronto para download`, k: "ok" }, ...a].slice(0, 9));
        setPlaybook(pb);
        autoSavePlaybook(pb);
      } else {
        /* ── Modo geração normal ── */
        const { playbook: pb } = await window.VX_API.generatePlaybook({
          projectId: PROJECT_ID,
          data,
          attachments: formUploads,
          baseTemplate: effectiveBaseTemplate,
          onStep: (s) => setActivity((a) => [{ t: s.label, k: "run" }, ...a].slice(0, 9)),
          onToken: (_, accumulated) => setLiveContent(accumulated),
        });
        setActivity((a) => [{ t: `Playbook ${pb.version} gerado · pronto para download`, k: "ok" }, ...a].slice(0, 9));
        setPlaybook(pb);
        autoSavePlaybook(pb);
      }
    } catch (e) {
      const msg = e?.message || "Erro desconhecido ao gerar o playbook.";
      console.error("[VX] Erro na geração:", e);
      setActivity((a) => [{ t: "Falha: " + msg, k: "wait" }, ...a].slice(0, 9));
      setErrorMsg(msg);
    } finally {
      setGenerating(false);
      setLiveContent("");
      setGeneratingLabel(null);
    }
  };

  if (!introComplete) {
    return <IntroScreen onDone={() => setIntroComplete(true)} />;
  }

  if (!productSelected) {
    return <ProductSelectScreen onSelect={() => setProductSelected(true)} />;
  }

  return (
    <div style={layout.shell}>
      <TopBar
        totals={totals}
        completedSections={completedSections}
        sectionCount={sections.length}
        savedAt={savedAt}
        onGenerate={handleGenerate}
        generating={generating}
        onKeyClick={() => setShowKeyModal(true)}
        hasKey={!!(window.VX_API?.getKey())}
        activeTab={activeTab}
      />
      <TabBar activeTab={activeTab} onSelect={setActiveTab} activeSnapshot={activeSnapshot} snapshotCount={snapshots.length} playbookCount={playbooks.length} />
      {activeTab === "completo" ? (
        <div style={layout.body}>
          <SideNav
            sections={sections}
            activeIdx={activeIdx}
            onSelect={setActiveIdx}
            data={data}
          />
          <Main
            section={active}
            idx={activeIdx}
            total={sections.length}
            data={data[active.id] || {}}
            onChange={(fid, v) => setField(active.id, fid, v)}
            onPrev={() => setActiveIdx(Math.max(0, activeIdx - 1))}
            onNext={() => setActiveIdx(Math.min(sections.length - 1, activeIdx + 1))}
            onGenerate={handleGenerate}
            allData={data}
          />
          <RightRail
            totals={totals}
            completedSections={completedSections}
            sectionCount={sections.length}
            activity={activity}
            generating={generating}
            activeSection={active}
            activeData={data[active.id] || {}}
            activeSnapshot={activeSnapshot}
          />
        </div>
      ) : activeTab === "rapido" ? (
        <QuickPlaybookView
          onGenerate={handleQuickGenerate}
          generating={generating}
          activity={activity}
          activeSnapshot={activeSnapshot}
        />
      ) : activeTab === "snapshots" ? (
        <SnapshotsView
          snapshots={snapshots}
          activeSnapshotId={activeSnapshotId}
          onActivate={activateSnapshot}
          onDelete={deleteSnapshot}
          onExport={exportSnapshot}
          onImport={importSnapshot}
          onImportFolder={importSnapshotFolder}
          onRename={renameSnapshot}
          onEdit={editSnapshot}
        />
      ) : (
        <HistoricoView
          playbooks={playbooks}
          onOpen={openHistoryPlaybook}
          onDelete={deletePlaybook}
        />
      )}
      <Footer />
      <GeneratingOverlay open={generating} liveContent={liveContent} editLabel={generatingLabel} />
      <DownloadScreen
        playbook={playbook}
        onClose={() => setPlaybook(null)}
        onSaveSnapshot={saveSnapshot}
        onGoToSnapshots={() => { setPlaybook(null); setActiveTab("snapshots"); }}
        onUpdate={(newHtml) => playbook && handlePlaybookUpdate(playbook.id, newHtml)}
      />
      <APIKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
      <ErrorModal msg={errorMsg} onClose={() => setErrorMsg(null)} />
      <WelcomeModal open={showWelcome} onClose={() => { localStorage.setItem("vx_welcome_1.1_beta", "1"); setShowWelcome(false); }} />
    </div>
  );
}

/* ───────────────────────── LAYOUT ───────────────────────── */

const layout = {
  shell: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateRows: "auto auto 1fr auto",
  },
  body: {
    display: "grid",
    gridTemplateColumns: "300px 1fr 340px",
    minHeight: "calc(100vh - 64px - 48px - 56px)",
  },
};

/* ───────────────────────── TAB BAR ───────────────────────── */

function TabBar({ activeTab, onSelect, activeSnapshot, snapshotCount, playbookCount }) {
  const tabs = [
    { id: "completo",   label: "Playbook Completo", sub: "6 seções · personalização total" },
    { id: "rapido",     label: "Playbook Rápido",   sub: "descrição livre · geração imediata", badge: "⚡" },
    { id: "snapshots",  label: "Snapshots",         sub: activeSnapshot ? `ativo: ${activeSnapshot.name.slice(0,22)}` : snapshotCount > 0 ? `${snapshotCount} salvo${snapshotCount > 1 ? "s" : ""}` : "html · pdf · pasta · json", dot: !!activeSnapshot, dotColor: activeSnapshot ? "var(--orange)" : "var(--green)", badge: activeSnapshot ? "🔗" : null },
    { id: "historico",  label: "Histórico",          sub: playbookCount > 0 ? `${playbookCount} playbook${playbookCount !== 1 ? "s" : ""} gerado${playbookCount !== 1 ? "s" : ""}` : "playbooks salvos automaticamente" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      borderBottom: "1px solid var(--border)",
      background: "rgba(15,13,10,0.7)",
      backdropFilter: "blur(8px)",
      padding: "0 26px",
      height: 48, flexShrink: 0,
    }}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "0 16px",
              background: "transparent", border: "none",
              borderBottom: `2px solid ${active ? "var(--orange)" : "transparent"}`,
              color: active ? "var(--ink)" : "var(--muted)",
              cursor: "pointer", transition: "all .15s",
              fontFamily: "var(--display)", fontSize: 13,
              fontWeight: active ? 600 : 500,
              letterSpacing: "0.01em",
              marginBottom: -1,
            }}
          >
            {tab.badge && (
              <span style={{ fontSize: 13, lineHeight: 1 }}>{tab.badge}</span>
            )}
            {tab.label}
            {tab.dot && (
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: tab.dotColor || "var(--green)", flexShrink: 0,
                boxShadow: tab.dotColor === "var(--orange)"
                  ? "0 0 6px rgba(255,91,21,0.7)"
                  : "0 0 6px rgba(110,231,168,0.7)",
              }} />
            )}
            <span style={{
              fontFamily: "var(--mono)", fontSize: 10,
              color: active ? (tab.dot ? "rgba(110,231,168,0.8)" : "rgba(255,91,21,0.7)") : "var(--muted-2)",
              letterSpacing: "0.06em",
            }}>
              · {tab.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── SNAPSHOTS VIEW ───────────────────────── */

function SnapshotsView({ snapshots, activeSnapshotId, onActivate, onDelete, onExport, onImport, onImportFolder, onRename, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [importError, setImportError] = useState(null);
  const importRef = useRef(null);
  const folderRef = useRef(null);

  /* ── AI Edit state ── */
  const [aiEditId, setAiEditId] = useState(null);
  const [aiEditPrompt, setAiEditPrompt] = useState("");
  const [aiEditing, setAiEditing] = useState(false);
  const [aiEditChars, setAiEditChars] = useState(0);
  const [aiEditError, setAiEditError] = useState(null);
  const [aiEditDone, setAiEditDone] = useState(false);
  const [aiEditAtts, setAiEditAtts] = useState([]);
  const [aiEditAttLoading, setAiEditAttLoading] = useState(false);
  const aiEditFileRef = useRef(null);

  const openAiEdit = (snap) => {
    setAiEditId(snap.id);
    setAiEditPrompt("");
    setAiEditError(null);
    setAiEditDone(false);
    setAiEditChars(0);
    setAiEditAtts([]);
  };

  const closeAiEdit = () => {
    if (aiEditing) return;
    setAiEditId(null);
    setAiEditError(null);
    setAiEditDone(false);
    setAiEditAtts([]);
  };

  const handleAiEditFiles = async (fileList) => {
    setAiEditAttLoading(true);
    const added = [];
    for (const file of Array.from(fileList)) {
      try {
        const result = await readFileContent(file);
        if (result && result.kind !== "image_too_large") added.push({ ...result, name: file.name, size: file.size });
        else if (result && result.kind === "image_too_large")
          setAiEditError(`Imagem "${file.name}" muito grande (máx. 1.5 MB).`);
      } catch (_) {}
    }
    setAiEditAtts((prev) => [...prev, ...added]);
    setAiEditAttLoading(false);
  };

  const removeAiEditAtt = (idx) => setAiEditAtts((prev) => prev.filter((_, i) => i !== idx));

  const handleAiEdit = () => {
    if (!aiEditPrompt.trim() || aiEditing) return;
    setAiEditing(true);
    setAiEditError(null);
    setAiEditDone(false);
    setAiEditChars(0);
    onEdit(aiEditId, aiEditPrompt, {
      attachments: aiEditAtts,
      onToken: (_, acc) => setAiEditChars(acc.length),
      onDone: () => { setAiEditing(false); setAiEditDone(true); setAiEditAtts([]); },
      onError: (msg) => { setAiEditing(false); setAiEditError(msg); },
    });
  };

  const FILE_ACCEPT = ".json,.html,.htm,.pdf,.txt,.md,.csv";

  const runImport = async (fn) => {
    setImportError(null);
    setLoadingFile(true);
    try { await fn(); }
    catch (err) { setImportError(err.message || "Erro ao salvar no banco. Verifique se a tabela foi criada no Supabase."); }
    finally { setLoadingFile(false); }
  };

  // Retorna [{file, path}] com caminhos relativos preservados
  const getFilesFromDirEntry = async (dirEntry, basePath = "") => {
    const entries = [];
    const traverse = async (entry, currentPath) => {
      if (entry.isFile) {
        const file = await new Promise((res, rej) => entry.file(res, rej));
        entries.push({ file, path: currentPath + entry.name });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const allEntries = [];
        const readBatch = () => new Promise((res) => reader.readEntries(res));
        let batch;
        while ((batch = await readBatch()).length > 0) allEntries.push(...batch);
        for (const e of allEntries) await traverse(e, currentPath + entry.name + "/");
      }
    };
    await traverse(dirEntry, basePath);
    return entries;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    runImport(async () => {
      const dtItems = Array.from(e.dataTransfer.items || []);
      if (!dtItems.length) {
        for (const f of Array.from(e.dataTransfer.files || [])) await onImport(f);
        return;
      }
      for (const dtItem of dtItems) {
        const entry = dtItem.webkitGetAsEntry?.();
        if (!entry) continue;
        if (entry.isDirectory) {
          const fileEntries = await getFilesFromDirEntry(entry, entry.name + "/");
          await onImportFolder(fileEntries, entry.name);
        } else {
          const file = await new Promise((res, rej) => entry.file(res, rej));
          await onImport(file);
        }
      }
    });
  };

  const handleFolderInput = (e) => {
    const fileArray = Array.from(e.target.files || []);
    if (!fileArray.length) return;
    e.target.value = "";
    runImport(async () => {
      const byFolder = {};
      for (const f of fileArray) {
        const rel = f.webkitRelativePath || f.name;
        const folderName = rel.split("/")[0];
        if (!byFolder[folderName]) byFolder[folderName] = [];
        byFolder[folderName].push({ file: f, path: rel });
      }
      for (const [folderName, fileEntries] of Object.entries(byFolder)) {
        await onImportFolder(fileEntries, folderName);
      }
    });
  };

  const sectionLabel = {
    color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 10,
    letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8,
  };

  const startEdit = (snap) => { setEditingId(snap.id); setEditName(snap.name); };
  const finishEdit = (id) => { onRename(id, editName); setEditingId(null); };

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" }); }
    catch { return "—"; }
  };

  const fmtSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      padding: "52px 32px", gap: 48,
      minHeight: "calc(100vh - 64px - 48px - 56px)",
    }}>

      {/* Left — main area */}
      <div style={{ flex: "0 0 660px", maxWidth: 660 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>Snapshots</div>
          <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(22px,3vw,34px)", color: "var(--ink)", lineHeight: 1.2, marginBottom: 10 }}>
            Referências salvas para a IA
          </div>
          <div style={{ fontFamily: "var(--display)", fontSize: 14, color: "var(--muted)", lineHeight: 1.7, maxWidth: 560 }}>
            Salve playbooks gerados ou importe arquivos externos (HTML, PDF, TXT, pastas). Quando ativo, o snapshot serve como estrutura base — a IA preserva a organização e adapta o conteúdo.
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => importRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? "var(--orange)" : "var(--border-strong)"}`,
            borderRadius: 14, padding: "22px 24px",
            display: "flex", alignItems: "center", gap: 16,
            cursor: "pointer", transition: "all .2s",
            background: isDragging ? "rgba(255,91,21,0.04)" : "var(--surface)",
            marginBottom: 10,
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: isDragging ? "rgba(255,91,21,0.12)" : "var(--surface-2)",
            border: `1px solid ${isDragging ? "rgba(255,91,21,0.4)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s",
          }}>
            <window.Icon name="upload" size={16} stroke={isDragging ? "var(--orange)" : "var(--muted)"} />
          </div>
          {loadingFile ? (
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--orange)" }}>Processando arquivo...</div>
          ) : (
            <div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)", marginBottom: 3 }}>
                Arraste arquivos ou pastas · clique para selecionar
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em" }}>
                .html · .pdf · .txt · .md · .csv · .json (snapshot exportado)
              </div>
            </div>
          )}
          <input
            ref={importRef} type="file" accept={FILE_ACCEPT} multiple
            style={{ display: "none" }}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              e.target.value = "";
              runImport(async () => { for (const f of files) await onImport(f); });
            }}
          />
        </div>

        {/* Folder button */}
        <button
          onClick={() => folderRef.current?.click()}
          style={{
            width: "100%", padding: "8px 16px", borderRadius: 9, marginBottom: 24,
            background: "var(--surface)", border: "1px solid var(--border)",
            color: "var(--muted)", fontFamily: "var(--display)", fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
        >
          <window.Icon name="folder" size={13} stroke="var(--gold)" />
          Selecionar pasta inteira
          <input
            ref={folderRef} type="file" webkitdirectory="" mozdirectory="" multiple
            style={{ display: "none" }}
            onChange={handleFolderInput}
          />
        </button>

        {importError && (
          <div style={{
            marginBottom: 16, padding: "11px 14px", borderRadius: 9,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
            fontFamily: "var(--mono)", fontSize: 11, color: "#f87171", lineHeight: 1.6,
          }}>
            ✕ {importError}
          </div>
        )}

        {/* Empty state */}
        {snapshots.length === 0 && (
          <div style={{
            border: "1px solid var(--border)", borderRadius: 14,
            padding: "40px 32px", textAlign: "center",
            background: "var(--surface)",
          }}>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 15, color: "var(--ink-2)", marginBottom: 8 }}>
              Nenhum snapshot ainda
            </div>
            <div style={{ fontFamily: "var(--display)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
              Gere um playbook e salve como snapshot, ou arraste qualquer arquivo acima.
            </div>
          </div>
        )}

        {/* Snapshots grid */}
        {snapshots.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {snapshots.map((snap) => {
              const isActive = snap.id === activeSnapshotId;
              const isEditingThis = editingId === snap.id;
              const isDeleteConfirm = deleteConfirm === snap.id;
              return (
                <div
                  key={snap.id}
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${isActive ? "rgba(255,91,21,0.6)" : "var(--border-strong)"}`,
                    borderRadius: 16, padding: "22px 22px 18px",
                    display: "flex", flexDirection: "column", gap: 14,
                    boxShadow: isActive ? "0 0 0 1px rgba(255,91,21,0.2), 0 8px 32px rgba(255,91,21,0.08)" : "none",
                    transition: "all .2s",
                    position: "relative",
                  }}
                >
                  {/* Active badge */}
                  {isActive && (
                    <div style={{
                      position: "absolute", top: -1, left: 16,
                      background: "var(--orange)", color: "#0a0907",
                      fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.12em", padding: "3px 10px",
                      borderRadius: "0 0 8px 8px",
                    }}>
                      ATIVO
                    </div>
                  )}

                  {/* Name */}
                  <div style={{ marginTop: isActive ? 10 : 0 }}>
                    {isEditingThis ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => finishEdit(snap.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") finishEdit(snap.id); if (e.key === "Escape") setEditingId(null); }}
                        style={{
                          width: "100%", background: "var(--bg-2)", color: "var(--ink)",
                          border: "1px solid var(--orange)", borderRadius: 6,
                          padding: "6px 10px", fontFamily: "var(--display)", fontSize: 14, fontWeight: 600,
                          outline: "none",
                        }}
                      />
                    ) : (
                      <div
                        onClick={() => startEdit(snap)}
                        title="Clique para renomear"
                        style={{
                          fontFamily: "var(--display)", fontWeight: 600, fontSize: 15,
                          color: isActive ? "var(--orange)" : "var(--ink)",
                          cursor: "text", borderRadius: 4, padding: "2px 4px",
                          transition: "background .12s",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        {snap.name}
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { label: fmtDate(snap.importedAt || snap.createdAt) },
                      { label: fmtSize(snap.size) },
                      snap.sections?.length ? { label: snap.sections.length + " seções" } : null,
                    ].filter(Boolean).map((m, i) => (
                      <span key={i} style={{
                        fontFamily: "var(--mono)", fontSize: 10,
                        color: "var(--muted)", letterSpacing: "0.06em",
                        padding: "2px 8px", borderRadius: 999,
                        background: "var(--bg-2)", border: "1px solid var(--border)",
                      }}>{m.label}</span>
                    ))}
                    {snap.importedAt && (
                      <span style={{
                        fontFamily: "var(--mono)", fontSize: 10, color: "#3b82f6",
                        padding: "2px 8px", borderRadius: 999,
                        background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)",
                      }}>importado</span>
                    )}
                  </div>

                  {/* Preview */}
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--muted)",
                    lineHeight: 1.6, background: "var(--bg-2)", borderRadius: 8,
                    padding: "10px 12px", maxHeight: 64, overflow: "hidden",
                    maskImage: "linear-gradient(to bottom, black 50%, transparent)",
                  }}>
                    {(snap.html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200)}
                  </div>

                  {/* Actions */}
                  {isDeleteConfirm ? (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", flex: 1 }}>Confirmar exclusão?</span>
                      <button
                        onClick={() => { onDelete(snap.id); setDeleteConfirm(null); }}
                        style={{
                          padding: "6px 12px", borderRadius: 7,
                          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                          color: "#f87171", fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer",
                        }}
                      >Excluir</button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          padding: "6px 12px", borderRadius: 7,
                          background: "var(--surface-2)", border: "1px solid var(--border)",
                          color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer",
                        }}
                      >Cancelar</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      {/* Activate / Deactivate */}
                      <button
                        onClick={() => onActivate(snap.id)}
                        style={{
                          flex: 1, padding: "8px 12px", borderRadius: 8,
                          background: isActive ? "rgba(255,91,21,0.12)" : "var(--surface-2)",
                          border: `1px solid ${isActive ? "rgba(255,91,21,0.5)" : "var(--border-strong)"}`,
                          color: isActive ? "var(--orange)" : "var(--ink-2)",
                          fontFamily: "var(--display)", fontSize: 12, fontWeight: 600,
                          cursor: "pointer", transition: "all .15s",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        {isActive ? (
                          <><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></svg> Desativar</>
                        ) : (
                          <><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6"/></svg> Ativar</>
                        )}
                      </button>

                      {/* Preview */}
                      {snap.html && (
                        <button
                          onClick={() => {
                            const blob = new Blob([snap.html], { type: "text/html;charset=utf-8" });
                            window.open(URL.createObjectURL(blob), "_blank");
                          }}
                          title="Visualizar snapshot"
                          style={{
                            padding: "8px 11px", borderRadius: 8,
                            background: "var(--surface-2)", border: "1px solid var(--border-strong)",
                            color: "var(--muted)", cursor: "pointer", transition: "all .15s",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--green)"; e.currentTarget.style.borderColor = "rgba(110,231,168,0.4)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                        >
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      )}

                      {/* Export */}
                      <button
                        onClick={() => onExport(snap)}
                        title="Exportar como arquivo JSON"
                        style={{
                          padding: "8px 11px", borderRadius: 8,
                          background: "var(--surface-2)", border: "1px solid var(--border-strong)",
                          color: "var(--muted)", cursor: "pointer", transition: "all .15s",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-2)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
                      >
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      </button>

                      {/* Edit with AI */}
                      {snap.html && onEdit && (
                        <button
                          onClick={() => aiEditId === snap.id ? closeAiEdit() : openAiEdit(snap)}
                          title="Editar com IA"
                          style={{
                            padding: "8px 11px", borderRadius: 8,
                            background: aiEditId === snap.id ? "rgba(255,91,21,0.12)" : "var(--surface-2)",
                            border: `1px solid ${aiEditId === snap.id ? "rgba(255,91,21,0.5)" : "var(--border-strong)"}`,
                            color: aiEditId === snap.id ? "var(--orange)" : "var(--muted)",
                            cursor: "pointer", transition: "all .15s",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onMouseEnter={(e) => { if (aiEditId !== snap.id) { e.currentTarget.style.color = "var(--orange)"; e.currentTarget.style.borderColor = "rgba(255,91,21,0.4)"; } }}
                          onMouseLeave={(e) => { if (aiEditId !== snap.id) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border-strong)"; } }}
                        >
                          <window.Icon name="spark" size={14} stroke="currentColor" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirm(snap.id)}
                        title="Excluir snapshot"
                        style={{
                          padding: "8px 11px", borderRadius: 8,
                          background: "transparent", border: "1px solid transparent",
                          color: "var(--muted-2)", cursor: "pointer", transition: "all .15s",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "var(--muted-2)"; }}
                      >
                        <window.Icon name="x" size={14} stroke="currentColor" />
                      </button>
                    </div>
                  )}

                  {/* ── AI Edit Panel ── */}
                  {aiEditId === snap.id && (
                    <div style={{
                      borderTop: "1px solid var(--border-strong)",
                      paddingTop: 16,
                      display: "flex", flexDirection: "column", gap: 10,
                    }}>
                      <div style={{
                        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
                        textTransform: "uppercase", color: "var(--orange)",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <window.Icon name="spark" size={11} stroke="var(--orange)" />
                        Editar com IA
                      </div>

                      <textarea
                        value={aiEditPrompt}
                        onChange={(e) => setAiEditPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !aiEditing && aiEditPrompt.trim()) {
                            e.preventDefault();
                            handleAiEdit();
                          }
                        }}
                        placeholder={"Descreva o que deseja alterar neste playbook.\nEx: \"Atualize os scripts para tom mais consultivo\" ou \"Adicione 2 objeções novas sobre preço\""}
                        disabled={aiEditing}
                        rows={4}
                        style={{
                          width: "100%", resize: "vertical",
                          background: "var(--bg-2)",
                          border: `1px solid ${aiEditing ? "var(--border)" : "var(--border-strong)"}`,
                          borderRadius: 8,
                          color: aiEditing ? "var(--muted)" : "var(--ink)",
                          fontFamily: "var(--display)", fontSize: 12.5, lineHeight: 1.55,
                          padding: "10px 12px", outline: "none", transition: "border-color .15s",
                        }}
                        onFocus={(e) => { if (!aiEditing) e.currentTarget.style.borderColor = "rgba(255,91,21,0.5)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                      />

                      {/* Attachments */}
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                        {aiEditAtts.map((att, i) => {
                          const isImg = att.kind === "image" || att.kind === "svg";
                          return (
                            <div key={i} style={{
                              display: "flex", alignItems: "center", gap: 5,
                              padding: "3px 6px 3px 9px", borderRadius: 999,
                              background: isImg ? "rgba(110,231,168,0.07)" : "rgba(59,130,246,0.07)",
                              border: `1px solid ${isImg ? "rgba(110,231,168,0.28)" : "rgba(59,130,246,0.28)"}`,
                              fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-2)",
                              maxWidth: 180,
                            }}>
                              <span style={{ flexShrink: 0 }}>
                                {att.kind === "svg" ? "🎨" : isImg ? "🖼" : "📄"}
                              </span>
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {att.name}
                              </span>
                              <button
                                onClick={() => removeAiEditAtt(i)}
                                style={{
                                  background: "none", border: "none", color: "var(--muted-2)",
                                  cursor: "pointer", padding: "0 2px", fontSize: 13, lineHeight: 1,
                                  flexShrink: 0,
                                }}
                              >×</button>
                            </div>
                          );
                        })}
                        <button
                          onClick={() => aiEditFileRef.current?.click()}
                          disabled={aiEditing || aiEditAttLoading}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "4px 10px", borderRadius: 6,
                            background: "transparent", border: "1px solid var(--border)",
                            color: (aiEditing || aiEditAttLoading) ? "var(--muted-2)" : "var(--muted)",
                            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em",
                            cursor: (aiEditing || aiEditAttLoading) ? "default" : "pointer", transition: "all .15s",
                          }}
                          onMouseEnter={(e) => { if (!aiEditing && !aiEditAttLoading) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-2)"; } }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                        >
                          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M21.44 12.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                          {aiEditAttLoading ? "LENDO..." : "ANEXAR"}
                        </button>
                        <input
                          ref={aiEditFileRef}
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg,.gif,.webp,.avif,.svg,.pdf,.txt,.md,.csv,.json,.html,.htm"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const fileArr = Array.from(e.target.files || []);
                            e.target.value = "";
                            if (fileArr.length) handleAiEditFiles(fileArr);
                          }}
                        />
                      </div>

                      {/* Progress */}
                      {aiEditing && (
                        <div style={{
                          fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
                          display: "flex", alignItems: "center", gap: 8,
                        }}>
                          <div className="pulse-dot" style={{ width: 6, height: 6, flexShrink: 0 }} />
                          Aplicando edições... {aiEditChars > 0 ? `${aiEditChars.toLocaleString("pt-BR")} chars gerados` : "aguardando modelo..."}
                        </div>
                      )}

                      {/* Error */}
                      {aiEditError && (
                        <div style={{
                          fontFamily: "var(--mono)", fontSize: 11, color: "#f87171",
                          padding: "8px 10px", borderRadius: 7,
                          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                          lineHeight: 1.5,
                        }}>
                          ✕ {aiEditError}
                        </div>
                      )}

                      {/* Success */}
                      {aiEditDone && (
                        <div style={{
                          fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)",
                          padding: "8px 10px", borderRadius: 7,
                          background: "rgba(110,231,168,0.06)", border: "1px solid rgba(110,231,168,0.25)",
                        }}>
                          ✓ Edição aplicada e snapshot atualizado
                        </div>
                      )}

                      {/* Buttons */}
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          onClick={closeAiEdit}
                          disabled={aiEditing}
                          style={{
                            padding: "7px 14px", borderRadius: 7,
                            background: "var(--surface-2)", border: "1px solid var(--border)",
                            color: "var(--muted)", fontFamily: "var(--display)", fontSize: 12,
                            cursor: aiEditing ? "default" : "pointer",
                            opacity: aiEditing ? 0.45 : 1, transition: "opacity .15s",
                          }}
                        >
                          {aiEditDone ? "Fechar" : "Cancelar"}
                        </button>
                        {!aiEditDone && (
                          <button
                            onClick={handleAiEdit}
                            disabled={aiEditing || !aiEditPrompt.trim()}
                            title="Cmd+Enter para enviar"
                            style={{
                              padding: "7px 16px", borderRadius: 7, border: "none",
                              background: (aiEditing || !aiEditPrompt.trim()) ? "rgba(255,91,21,0.25)" : "var(--orange)",
                              color: "#0a0907", fontFamily: "var(--display)", fontWeight: 700, fontSize: 12,
                              cursor: (aiEditing || !aiEditPrompt.trim()) ? "default" : "pointer",
                              display: "flex", alignItems: "center", gap: 6,
                              transition: "background .15s",
                            }}
                          >
                            {aiEditing ? (
                              <><span className="blink">▋</span> Editando...</>
                            ) : (
                              <>✦ Aplicar edição</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right — explanatory */}
      <div style={{ flex: "0 0 280px", maxWidth: 280, paddingTop: 8 }}>
        <div style={{ ...sectionLabel, marginBottom: 20 }}>Como funciona</div>
        {[
          { icon: "save",   title: "Salve playbooks prontos",  desc: "Ao gerar um playbook, clique em \"Salvar como Snapshot\" para armazená-lo como referência." },
          { icon: "upload", title: "Importe qualquer arquivo", desc: "HTML, PDF, TXT, MD, CSV ou pastas inteiras — tudo vira snapshot para a IA usar como base." },
          { icon: "check",  title: "Ative como base",          desc: "Com um snapshot ativo, toda geração seguirá exatamente a mesma organização de seções e layout." },
          { icon: "spark",  title: "Edite com IA",             desc: "Clique no ícone ✦ do card para enviar um prompt — a IA aplica as alterações sem recriar o playbook." },
        ].map((item) => (
          <div key={item.title} style={{ display: "flex", gap: 14, marginBottom: 22 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: "var(--surface-2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <window.Icon name={item.icon} size={14} stroke="var(--orange)" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          </div>
        ))}

        {activeSnapshotId && snapshots.find((s) => s.id === activeSnapshotId) && (
          <div style={{
            marginTop: 8, padding: "14px 16px", borderRadius: 12,
            background: "rgba(255,91,21,0.06)", border: "1px solid rgba(255,91,21,0.3)",
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--orange)", lineHeight: 1.7,
          }}>
            🔗 Snapshot ativo — o próximo playbook gerado herdará exatamente a estrutura de <strong>{snapshots.find((s) => s.id === activeSnapshotId).name}</strong>.
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── QUICK PLAYBOOK VIEW ───────────────────────── */

const QUICK_EXAMPLES = [
  "Tenho uma clínica de estética com 3 profissionais. Atendo mulheres de 25 a 45 anos focadas em rejuvenescimento facial. Meu diferencial é laser combinado com cosméticos premium. Ticket R$800. Maior dificuldade: converter consultas gratuitas em clientes pagantes.",
  "Consultoria B2B de gestão empresarial para PMEs. Vendemos diagnóstico + implantação de processos. Projetos de R$15k a R$50k. Maior gargalo: reuniões que não viram proposta aceita. Preciso de um processo de qualificação e follow-up mais eficiente.",
  "Agência de tráfego pago focada em e-commerce. Atendo lojas que faturam entre R$100k e R$1M/mês. Vendo gestão mensal + estratégia. Problema: alto churn após 3 meses e dificuldade em mostrar ROI para clientes céticos.",
];

const QUICK_SECTIONS = [
  "01 · Identidade & Propósito",
  "02 · Perfil do Cliente Ideal",
  "03 · Metodologia DEFA",
  "04 · Framework AIDA",
  "05 · Pipeline & SLAs",
  "06 · Scripts de Atendimento",
  "07 · Estrutura do Time",
  "08 · Tratativa de Objeções",
  "09 · Cadência de Follow-up",
  "10 · Pós-venda & Recompra",
  "11 · KPIs & Métricas",
];

/* ─── File reading helpers ─── */
const IMAGE_EXTS  = /\.(png|jpg|jpeg|gif|webp|bmp|avif)$/i;
const SVG_EXT     = /\.svg$/i;
const TEXT_EXTS   = /\.(txt|md|csv|json|html?|xml|rtf|yaml|yml|log|ini|env|ts|js|py|sql|docx?)$/i;
const MAX_IMG_BYTES = 1.5 * 1024 * 1024; // 1.5 MB — larger logos may exceed prompt limit

async function readFileContent(file) {
  const name = file.name.toLowerCase();

  /* ── Imagem raster (logo, identidade visual) ── */
  if (IMAGE_EXTS.test(name)) {
    if (file.size > MAX_IMG_BYTES) {
      return { kind: "image_too_large", content: `[Imagem ${file.name} muito grande para incorporar — máx. 1.5 MB]`, dataUrl: "" };
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = (e) => resolve({ kind: "image", content: "", dataUrl: e.target.result });
      reader.onerror = () => reject(new Error("Erro ao ler imagem " + file.name));
      reader.readAsDataURL(file);
    });
  }

  /* ── SVG (logo vetorial) ── */
  if (SVG_EXT.test(name)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = (e) => resolve({ kind: "svg", content: e.target.result, dataUrl: "" });
      reader.onerror = () => reject(new Error("Erro ao ler SVG " + file.name));
      reader.readAsText(file, "UTF-8");
    });
  }

  /* ── PDF ── */
  if (name.endsWith(".pdf")) {
    try {
      const buffer = await file.arrayBuffer();
      const raw = new TextDecoder("latin1").decode(new Uint8Array(buffer));
      const matches = raw.match(/\(([^)]{2,300})\)/g) || [];
      const text = matches
        .map((m) => m.slice(1, -1).replace(/\\n/g, "\n").replace(/\\r/g, "").replace(/\\t/g, " "))
        .filter((s) => /[\w\s,.!?:;áéíóúâêîôûãõàèìòùç-]{3,}/.test(s))
        .join(" ")
        .replace(/\s{2,}/g, " ")
        .trim();
      return { kind: "text", content: text || "[PDF: extração automática limitada]", dataUrl: "" };
    } catch {
      return { kind: "text", content: "[PDF: não foi possível extrair o conteúdo]", dataUrl: "" };
    }
  }

  /* ── Texto / código ── */
  if (TEXT_EXTS.test(name)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = (e) => resolve({ kind: "text", content: e.target.result, dataUrl: "" });
      reader.onerror = () => reject(new Error("Erro ao ler " + file.name));
      reader.readAsText(file, "UTF-8");
    });
  }

  return null;
}

function formatBytes(bytes) {
  if (bytes < 1024)         return bytes + " B";
  if (bytes < 1024 * 1024)  return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const FILE_EXT_COLOR = {
  pdf: "#ef4444", txt: "#6ee7a8", md: "#6ee7a8", csv: "#3b82f6",
  json: "#f59e0b", html: "#8b5cf6", htm: "#8b5cf6", svg: "#f472b6",
  png: "#f472b6", jpg: "#f472b6", jpeg: "#f472b6", webp: "#f472b6",
  gif: "#f472b6", bmp: "#f472b6",
};
function fileExt(name) { return name.split(".").pop().toLowerCase(); }
function isImageKind(f) { return f.kind === "image" || f.kind === "svg"; }

function QuickPlaybookView({ onGenerate, generating, activity, activeSnapshot }) {
  const [desc, setDesc] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nicho, setNicho] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [readingFiles, setReadingFiles] = useState(false);
  const fileInputRef = useRef(null);

  const canGenerate = desc.trim().length >= 20 && !generating && !readingFiles;

  /* Detecta se algum arquivo parece ser um playbook modelo (ignora imagens) */
  const detectTemplate = (files) => {
    const kws = ["playbook","seção","script","objeção","funil","icp","defa","aida",
                 "fechamento","qualificação","follow-up","cadência","kpi","spin","sidebar","métricas"];
    return files.find((f) => {
      if (isImageKind(f)) return false;
      const name    = f.name.toLowerCase();
      const content = (f.content || "").toLowerCase();
      if ((name.endsWith(".html") || name.endsWith(".htm")) &&
          (content.includes("playbook") || content.includes("<!doctype") || content.includes("<section"))) {
        return true;
      }
      return kws.filter((k) => content.includes(k)).length >= 4;
    }) || null;
  };

  /* Detecta arquivos de logo (imagem ou SVG) */
  const detectLogos = (files) => files.filter(isImageKind);

  const addFiles = async (fileList) => {
    const MAX = 8; // aumentado para permitir logos + arquivos
    const remaining = MAX - attachedFiles.length;
    if (remaining <= 0) return;
    const toAdd = Array.from(fileList).slice(0, remaining);
    setReadingFiles(true);
    const results = [];
    for (const file of toAdd) {
      try {
        const result = await readFileContent(file);
        if (result !== null) {
          results.push({
            id: Math.random().toString(36).slice(2, 10),
            name: file.name,
            size: file.size,
            kind:    result.kind,
            content: result.content || "",
            dataUrl: result.dataUrl || "",
          });
        }
      } catch (_) {}
    }
    setAttachedFiles((prev) => [...prev, ...results]);
    setReadingFiles(false);
  };

  const removeFile = (id) => setAttachedFiles((prev) => prev.filter((f) => f.id !== id));

  const inputBase = {
    width: "100%", background: "var(--surface)", color: "var(--ink)",
    border: "1px solid var(--border-strong)",
    borderRadius: 10, padding: "10px 14px",
    fontFamily: "var(--display)", fontSize: 13,
    outline: "none", transition: "border-color .15s",
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 360px",
      minHeight: "calc(100vh - 64px - 48px - 56px)",
    }}>

      {/* ── Left: Form ── */}
      <div style={{
        padding: "52px 64px 60px",
        borderRight: "1px solid var(--border)",
        overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 12px", borderRadius: 999,
            background: "rgba(255,91,21,0.08)",
            border: "1px solid rgba(255,91,21,0.25)",
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--orange)",
            letterSpacing: "0.14em", textTransform: "uppercase",
            marginBottom: 18,
          }}>
            ⚡ Modo Rápido
          </div>
          <h1 style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: "clamp(28px, 4vw, 50px)",
            letterSpacing: "-0.01em", lineHeight: 1.1,
            margin: "0 0 14px", fontWeight: 400,
          }}>
            o que você precisa<br />
            <span style={{ color: "var(--orange)" }}>hoje?</span>
            <span className="blink" style={{ color: "var(--orange)" }}>_</span>
          </h1>
          <p style={{
            color: "var(--muted)", fontSize: 15, lineHeight: 1.65,
            maxWidth: 540, margin: 0,
          }}>
            Descreva livremente sua empresa, produto, nicho e desafio comercial.
            A IA interpreta tudo e gera um playbook completo com as 11 seções em minutos.
          </p>
        </div>

        {/* Textarea */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
            letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10,
          }}>
            Sua descrição
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={"Ex: Tenho uma consultoria de vendas B2B para empresas de tecnologia. Vendemos implantação de CRM e treinamento de time comercial. Ticket médio R$25k. O maior problema é que nossos vendedores não seguem processo e a taxa de conversão está em 8%..."}
            rows={10}
            style={{
              ...inputBase,
              borderRadius: 14,
              padding: "18px 20px",
              fontSize: 14,
              lineHeight: 1.7,
              resize: "vertical",
              minHeight: 220,
              fontFamily: "var(--display)",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--orange)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "var(--border-strong)"; }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 6,
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)",
            letterSpacing: "0.06em",
          }}>
            <span>
              {desc.length > 0 && desc.length < 20 && (
                <span style={{ color: "var(--gold)" }}>mínimo 20 caracteres</span>
              )}
            </span>
            <span>{desc.length} chars</span>
          </div>
        </div>

        {/* Quick fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
          <div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8,
            }}>
              Empresa (opcional)
            </div>
            <input
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Nome da empresa"
              style={inputBase}
              onFocus={(e) => { e.target.style.borderColor = "var(--orange)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "var(--border-strong)"; }}
            />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8,
            }}>
              Nicho (opcional)
            </div>
            <input
              type="text"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              placeholder="Ex: Saúde, B2B, Agência, SaaS…"
              style={inputBase}
              onFocus={(e) => { e.target.style.borderColor = "var(--orange)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "var(--border-strong)"; }}
            />
          </div>
        </div>

        {/* ── File attachment zone ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
            letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span>Anexar arquivos (opcional)</span>
            <span style={{ color: "var(--muted-2)" }}>{attachedFiles.length}/5 · .txt .md .csv .json .html .pdf</span>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); }}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
            onClick={() => attachedFiles.length < 5 && fileInputRef.current?.click()}
            style={{
              border: `1.5px dashed ${isDragging ? "var(--orange)" : "var(--border-strong)"}`,
              borderRadius: 12,
              padding: "18px 20px",
              background: isDragging ? "rgba(255,91,21,0.05)" : "rgba(15,13,10,0.4)",
              cursor: attachedFiles.length < 5 ? "pointer" : "default",
              transition: "all .18s",
              display: "flex", alignItems: "center", gap: 14,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.csv,.json,.html,.htm,.pdf,.xml,.rtf,.log,.yaml,.yml,.svg,.png,.jpg,.jpeg,.webp,.gif,.bmp"
              style={{ display: "none" }}
              onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            />

            {/* Upload icon */}
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: isDragging ? "rgba(255,91,21,0.12)" : "var(--surface)",
              border: "1px solid " + (isDragging ? "rgba(255,91,21,0.4)" : "var(--border-strong)"),
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .18s",
            }}>
              {readingFiles ? (
                <div style={{ width: 16, height: 16, border: "2px solid var(--border-strong)", borderTopColor: "var(--orange)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
              ) : (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={isDragging ? "var(--orange)" : "var(--muted)"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: isDragging ? "var(--orange)" : "var(--ink-2)", fontWeight: 500, marginBottom: 2 }}>
                {readingFiles ? "Lendo arquivos…" : isDragging ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para selecionar"}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)", letterSpacing: "0.04em" }}>
                {attachedFiles.length >= 8
                  ? "Limite de 8 arquivos atingido"
                  : "Logo (PNG/SVG/JPG) · Paleta · Scripts · PDFs · Planilhas…"}
              </div>
            </div>

            {attachedFiles.length < 5 && !readingFiles && (
              <div style={{
                padding: "6px 12px", borderRadius: 999,
                border: "1px solid var(--border-strong)",
                fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
                letterSpacing: "0.08em", flexShrink: 0,
              }}>
                SELECIONAR
              </div>
            )}
          </div>

          {/* Attached files list */}
          {attachedFiles.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>

              {/* Logos detectados */}
              {(() => {
                const logos = detectLogos(attachedFiles);
                return logos.length > 0 ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 13px", borderRadius: 8,
                    background: "rgba(244,114,182,0.06)",
                    border: "1px solid rgba(244,114,182,0.3)",
                    fontFamily: "var(--mono)", fontSize: 11,
                    color: "#f472b6", letterSpacing: "0.04em",
                  }}>
                    <span>🎨</span>
                    <span>{logos.length === 1
                      ? `Logo detectado — ${logos[0].name} será incorporado ao playbook`
                      : `${logos.length} imagens detectadas — usadas como identidade visual`}
                    </span>
                  </div>
                ) : null;
              })()}

              {/* Template detectado */}
              {(() => {
                const tpl = detectTemplate(attachedFiles);
                return tpl ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 13px", borderRadius: 8,
                    background: "rgba(110,231,168,0.06)",
                    border: "1px solid rgba(110,231,168,0.3)",
                    fontFamily: "var(--mono)", fontSize: 11,
                    color: "var(--green)", letterSpacing: "0.04em",
                  }}>
                    <span>✓</span>
                    <span>Playbook modelo — <strong style={{ color: "var(--green)" }}>{tpl.name}</strong> usado como estrutura base</span>
                  </div>
                ) : null;
              })()}

              {attachedFiles.map((f) => {
                const tplFile    = detectTemplate(attachedFiles);
                const isTemplate = tplFile && tplFile.id === f.id;
                const isImg      = isImageKind(f);
                const ext        = fileExt(f.name);
                const color      = isTemplate ? "var(--green)"
                                 : isImg      ? "#f472b6"
                                 : (FILE_EXT_COLOR[ext] || "var(--muted)");
                return (
                  <div key={f.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px", borderRadius: 8,
                    background: isTemplate ? "rgba(110,231,168,0.04)"
                              : isImg      ? "rgba(244,114,182,0.04)"
                              : "var(--surface)",
                    border: "1px solid " + (isTemplate ? "rgba(110,231,168,0.25)"
                                          : isImg      ? "rgba(244,114,182,0.25)"
                                          : "var(--border)"),
                  }}>

                    {/* Preview de imagem OU badge de extensão */}
                    {isImg ? (
                      <div style={{
                        width: 44, height: 34, borderRadius: 6, overflow: "hidden",
                        border: "1px solid rgba(244,114,182,0.3)",
                        background: "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {f.kind === "image" && f.dataUrl
                          ? <img src={f.dataUrl} alt={f.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          : <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#f472b6", fontWeight: 700 }}>SVG</span>
                        }
                      </div>
                    ) : (
                      <div style={{
                        padding: "2px 7px", borderRadius: 4,
                        background: color + "18", border: "1px solid " + color + "40",
                        fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
                        color, letterSpacing: "0.06em", textTransform: "uppercase",
                        flexShrink: 0,
                      }}>
                        {isTemplate ? "modelo" : ext}
                      </div>
                    )}

                    {/* File name */}
                    <span style={{
                      flex: 1, fontSize: 12.5, color: "var(--ink-2)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {f.name}
                      {isImg && <span style={{ color: "#f472b6", fontSize: 10, marginLeft: 6, fontFamily: "var(--mono)" }}>logo</span>}
                    </span>

                    {/* Size */}
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)",
                      letterSpacing: "0.04em", flexShrink: 0,
                    }}>
                      {formatBytes(f.size)}
                    </span>

                    {/* Chars / info */}
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 10,
                      color: isImg ? "#f472b6" : "var(--green)",
                      letterSpacing: "0.04em", flexShrink: 0,
                    }}>
                      {isImg ? "incorporado" : (f.content.length.toLocaleString("pt-BR") + " chars")}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeFile(f.id)}
                      style={{
                        background: "transparent", border: "none", cursor: "pointer",
                        color: "var(--muted-2)", padding: "2px 4px", borderRadius: 4,
                        fontSize: 14, lineHeight: 1, flexShrink: 0, transition: "color .12s",
                      }}
                      onMouseEnter={(e) => e.target.style.color = "var(--red)"}
                      onMouseLeave={(e) => e.target.style.color = "var(--muted-2)"}
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Generate button */}
        <button
          onClick={() => canGenerate && onGenerate({ desc, empresa, nicho, attachments: attachedFiles })}
          disabled={!canGenerate}
          style={{
            width: "100%", padding: "16px 24px",
            borderRadius: 14,
            cursor: canGenerate ? "pointer" : "not-allowed",
            background: canGenerate ? "var(--orange)" : "var(--surface-2)",
            color: canGenerate ? "#0a0907" : "var(--muted-2)",
            border: "1px solid " + (canGenerate ? "var(--orange)" : "var(--border)"),
            fontFamily: "var(--display)", fontWeight: 700, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            animation: canGenerate && !generating ? "glow 2.4s ease-in-out infinite" : "none",
            transition: "all .2s",
          }}
        >
          <window.Icon name="spark" size={18} stroke={canGenerate ? "#0a0907" : "var(--muted-2)"} />
          {readingFiles
            ? "Lendo arquivos…"
            : generating
            ? "Gerando playbook…"
            : attachedFiles.length > 0
            ? `Gerar Playbook Rápido · ${attachedFiles.length} arquivo${attachedFiles.length > 1 ? "s" : ""}`
            : "Gerar Playbook Rápido"}
        </button>

        {/* Activity log (inline) */}
        {activity.some((a) => a.k === "run") && (
          <div style={{
            marginTop: 16, padding: "10px 14px", borderRadius: 10,
            background: "var(--surface)", border: "1px solid var(--border)",
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)",
            lineHeight: 1.7,
          }}>
            {activity.filter((a) => a.k === "run").slice(0, 1).map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: "var(--orange)" }}>•</span>
                <span>{a.t}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Tips & Examples ── */}
      <div style={{
        padding: "40px 24px 40px",
        background: "rgba(15,13,10,0.5)",
        borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column", gap: 26,
        overflowY: "auto",
      }}>

        {/* Tips */}
        <div>
          <div style={railHeader}>Como descrever bem</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { emoji: "🏢", tip: "O que a empresa vende e para quem" },
              { emoji: "🎯", tip: "Quem é o cliente ideal e sua principal dor" },
              { emoji: "💰", tip: "Ticket médio e modelo de negócio" },
              { emoji: "⚠️", tip: "Maior desafio comercial atual" },
              { emoji: "✨", tip: "Diferencial ou resultado que entrega" },
              { emoji: "📎", tip: "Anexe scripts, apresentações ou planilhas para enriquecer o playbook" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "9px 12px", borderRadius: 8,
                background: "var(--surface)", border: "1px solid var(--border)",
                fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.4,
              }}>
                <span style={{ flexShrink: 0, fontSize: 14 }}>{item.emoji}</span>
                <span>{item.tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Example prompts */}
        <div>
          <div style={railHeader}>Exemplos de descrição</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {QUICK_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setDesc(ex)}
                style={{
                  padding: "11px 13px", borderRadius: 8, textAlign: "left",
                  background: desc === ex ? "rgba(255,91,21,0.06)" : "var(--surface)",
                  border: "1px solid " + (desc === ex ? "rgba(255,91,21,0.3)" : "var(--border)"),
                  color: "var(--ink-2)", cursor: "pointer",
                  fontSize: 11.5, lineHeight: 1.55, transition: "all .15s",
                  fontFamily: "var(--display)",
                }}
              >
                {ex.slice(0, 110)}
                <span style={{ color: "var(--muted-2)" }}>…</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active snapshot indicator */}
        {activeSnapshot && (
          <div style={{
            padding: "12px 14px", borderRadius: 10,
            background: "rgba(255,91,21,0.06)", border: "1px solid rgba(255,91,21,0.35)",
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--orange)", letterSpacing: "0.1em", marginBottom: 6 }}>
              🔗 SNAPSHOT ATIVO
            </div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 13, color: "var(--ink)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeSnapshot.name}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", lineHeight: 1.5 }}>
              A IA vai preservar a estrutura deste snapshot e adaptar o conteúdo.
            </div>
          </div>
        )}

        {/* What gets generated */}
        <div>
          {(() => {
            const tpl = !activeSnapshot && detectTemplate(attachedFiles);
            return tpl ? (
              <>
                <div style={railHeader}>Modo Template Ativo</div>
                <div style={{
                  padding: "12px 14px", borderRadius: 8,
                  background: "rgba(110,231,168,0.06)",
                  border: "1px solid rgba(110,231,168,0.25)",
                  marginBottom: 10,
                }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)", letterSpacing: "0.08em", marginBottom: 6 }}>
                    ✓ ESTRUTURA DO MODELO
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>
                    A IA vai replicar a estrutura de seções de <strong style={{ color: "var(--green)" }}>{tpl.name}</strong> e substituir todo o conteúdo pelos dados do seu cliente.
                  </div>
                </div>
                <div style={{
                  padding: "10px 12px", borderRadius: 8,
                  background: "rgba(255,91,21,0.04)",
                  border: "1px solid rgba(255,91,21,0.15)",
                  fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
                  lineHeight: 1.6, letterSpacing: "0.03em",
                }}>
                  Outros arquivos anexados serão usados como dados de conteúdo (scripts, métricas, personas…).
                </div>
              </>
            ) : (
              <>
                <div style={railHeader}>O que será gerado</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {QUICK_SECTIONS.map((s, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "5px 6px", borderRadius: 5,
                      fontFamily: "var(--mono)", fontSize: 10,
                      color: "var(--muted)", letterSpacing: "0.04em",
                    }}>
                      <span style={{ color: "var(--orange-deep)", fontSize: 8, flexShrink: 0 }}>►</span>
                      {s}
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 12, padding: "10px 12px", borderRadius: 8,
                  background: "rgba(255,91,21,0.04)",
                  border: "1px solid rgba(255,91,21,0.15)",
                  fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
                  lineHeight: 1.6, letterSpacing: "0.03em",
                }}>
                  Anexe um HTML de playbook existente para usar como estrutura base.
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── TOP BAR ───────────────────────── */

function TopBar({ totals, completedSections, sectionCount, savedAt, onGenerate, generating, onKeyClick, hasKey, activeTab }) {
  const ago = useRelativeTime(savedAt);
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 18,
      padding: "12px 26px", height: 64,
      borderBottom: "1px solid var(--border)",
      background: "rgba(10, 9, 7, 0.85)",
      backdropFilter: "blur(10px)",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <window.VXLogo size={36} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.02em" }}>
            <span style={{ color: "var(--orange)" }}>Luna AI</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em" }}>
            AI-NATIVE · SALES OPS · v2.0
          </div>
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginLeft: 18, paddingLeft: 18, borderLeft: "1px solid var(--border)",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: 8, background: "var(--green)" }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.05em" }}>
          PROJETO · DRAFT-001
        </span>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)",
      }}>
        <window.Icon name="save" size={13} />
        <span>{savedAt ? `salvo ${ago}` : "novo projeto"}</span>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 12px", borderRadius: 999,
        border: "1px solid var(--border-strong)",
        fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)",
        letterSpacing: "0.05em",
      }}>
        <span style={{ color: "var(--muted)" }}>PROGRESSO</span>
        <span style={{ color: "var(--orange)", fontWeight: 600 }}>{totals.pct}%</span>
        <span style={{ color: "var(--muted-2)" }}>·</span>
        <span>{completedSections}/{sectionCount} seções</span>
      </div>

      <button
        onClick={onKeyClick}
        data-key-btn="1"
        title={hasKey ? "API Key configurada — clique para alterar" : "Configurar API Key OpenAI"}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: 999,
          background: "transparent",
          color: hasKey ? "var(--green)" : "var(--gold)",
          border: "1px solid " + (hasKey ? "rgba(110,231,168,0.35)" : "rgba(255,181,71,0.4)"),
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em",
          cursor: "pointer", transition: "all .15s",
        }}
      >
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
        </svg>
        {hasKey ? "API Key ✓" : "API Key"}
      </button>

      {activeTab === "completo" && (
        <button
          onClick={onGenerate}
          disabled={generating}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 18px", borderRadius: 999,
            background: generating ? "var(--surface-2)" : "var(--orange)",
            color: generating ? "var(--muted)" : "#0a0907",
            border: "1px solid " + (generating ? "var(--border-strong)" : "var(--orange)"),
            fontFamily: "var(--display)", fontWeight: 600, fontSize: 14,
            cursor: generating ? "wait" : "pointer",
            animation: generating ? "none" : "glow 2.4s ease-in-out infinite",
            transition: "all .15s",
          }}
        >
          <window.Icon name="spark" size={16} stroke={generating ? "var(--muted)" : "#0a0907"} />
          {generating ? "Gerando playbook…" : "Gerar Playbook"}
        </button>
      )}
    </header>
  );
}

function useRelativeTime(date) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);
  if (!date) return "";
  const s = Math.round((Date.now() - date.getTime()) / 1000);
  if (s < 5) return "agora";
  if (s < 60) return `há ${s}s`;
  if (s < 3600) return `há ${Math.round(s/60)}min`;
  return `há ${Math.round(s/3600)}h`;
}

/* ───────────────────────── SIDE NAV ───────────────────────── */

function SideNav({ sections, activeIdx, onSelect, data }) {
  return (
    <aside style={{
      borderRight: "1px solid var(--border)",
      padding: "26px 0",
      background: "rgba(15, 13, 10, 0.5)",
      overflowY: "auto", maxHeight: "calc(100vh - 64px - 48px - 56px)",
      position: "sticky", top: 112,
      alignSelf: "start", height: "calc(100vh - 64px - 48px - 56px)",
    }}>
      <div style={{
        padding: "0 26px 16px",
        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
        color: "var(--muted)", textTransform: "uppercase",
      }}>
        Coleta · 6 seções
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {sections.map((s, i) => {
          const p = window.sectionProgress(s, data);
          const active = i === activeIdx;
          const complete = p.pct === 100;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 12, alignItems: "center",
                padding: "12px 26px",
                background: active ? "linear-gradient(90deg, rgba(255,91,21,0.10), transparent 80%)" : "transparent",
                border: "none",
                borderLeft: `2px solid ${active ? "var(--orange)" : "transparent"}`,
                color: active ? "var(--ink)" : "var(--ink-2)",
                cursor: "pointer", textAlign: "left",
                transition: "background .15s",
                fontFamily: "var(--display)",
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: complete
                  ? "var(--orange)"
                  : active ? "rgba(255,91,21,0.12)" : "var(--surface)",
                color: complete ? "#0a0907" : active ? "var(--orange)" : "var(--muted)",
                border: "1px solid " + (complete ? "var(--orange)" : active ? "rgba(255,91,21,0.3)" : "var(--border)"),
                fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
              }}>
                {complete ? <window.Icon name="check" size={14} stroke="#0a0907" /> : s.num}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: active ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.04em", marginTop: 2 }}>
                  {p.done}/{p.total} · {p.pct}%
                </div>
              </div>
              <window.Icon name="arrow" size={14} stroke={active ? "var(--orange)" : "var(--muted-2)"} />
            </button>
          );
        })}
      </div>

    </aside>
  );
}

/* ───────────────────────── MAIN ───────────────────────── */

function Main({ section, idx, total, data, onChange, onPrev, onNext, onGenerate, allData }) {
  const sFields = section.fields.filter((f) => f.kind !== "group");
  const sDone = sFields.filter((f) => window.isFilled(f, data[f.id])).length;
  const p = { done: sDone, total: sFields.length, pct: sFields.length ? Math.round((sDone / sFields.length) * 100) : 0 };
  return (
    <main key={section.id} className="slide-up" style={{
      padding: "36px 56px 56px",
      maxWidth: 880, width: "100%", margin: "0 auto",
      overflowY: "auto",
    }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 22, marginBottom: 36 }}>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 88, lineHeight: 0.9, color: "var(--orange)",
          letterSpacing: "-0.02em",
        }}>
          {section.num}<span style={{ color: "var(--muted-2)", fontSize: 36 }}>/{String(total).padStart(2,"0")}</span>
        </div>
        <div style={{ flex: 1, paddingTop: 18 }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em",
            color: "var(--orange)", textTransform: "uppercase", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <window.Icon name={section.icon} size={14} stroke="var(--orange)"/>
            Etapa de coleta
          </div>
          <h1 style={{
            margin: 0, fontSize: 44, fontWeight: 700, letterSpacing: "-0.01em",
            lineHeight: 2.05, textTransform: "none",
          }}>
            {section.title}
            <span className="blink" style={{ color: "var(--orange)", marginLeft: 4 }}>_</span>
          </h1>
          <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 16, maxWidth: 520, lineHeight: 1.5 }}>
            {section.subtitle}. {section.summary}
          </p>
        </div>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
          paddingTop: 22,
        }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.14em" }}>
            PREENCHIDO
          </div>
          <div style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 600, color: p.pct === 100 ? "var(--green)" : "var(--orange)" }}>
            {p.pct}%
          </div>
          <div style={{ width: 80, height: 4, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${p.pct}%`, height: "100%", background: p.pct === 100 ? "var(--green)" : "var(--orange)", transition: "width .25s" }} />
          </div>
        </div>
      </div>

      {/* Field grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 28,
      }}>
        {section.fields.map((f) => (
          <div key={f.id} style={{ gridColumn: `span ${f.col || 12}` }}>
            <window.Field field={f} value={data[f.id]} onChange={(v) => onChange(f.id, v)} allData={allData} />
          </div>
        ))}
      </div>

      {/* Nav */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--border)",
      }}>
        <button
          onClick={onPrev}
          disabled={idx === 0}
          style={navBtnStyle(idx === 0)}
        >
          <window.Icon name="back" size={14} stroke={idx === 0 ? "var(--muted-2)" : "var(--ink-2)"} />
          Anterior
        </button>

        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>
          {String(idx+1).padStart(2,"0")} / {String(total).padStart(2,"0")}
        </div>

        {idx < total - 1 ? (
          <button onClick={onNext} style={navBtnPrimary()}>
            Próxima · {window.SECTIONS[idx+1].title}
            <window.Icon name="arrow" size={14} stroke="#0a0907" />
          </button>
        ) : (
          <button onClick={onGenerate} style={{ ...navBtnPrimary(), background: "var(--orange)", animation: "glow 2.4s ease-in-out infinite" }}>
            <window.Icon name="spark" size={14} stroke="#0a0907" />
            Gerar Playbook
          </button>
        )}
      </div>
    </main>
  );
}

const navBtnStyle = (disabled) => ({
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "10px 16px", borderRadius: 999,
  background: "transparent",
  color: disabled ? "var(--muted-2)" : "var(--ink-2)",
  border: "1px solid var(--border-strong)",
  fontFamily: "var(--display)", fontWeight: 500, fontSize: 13,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
});
const navBtnPrimary = () => ({
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "10px 18px", borderRadius: 999,
  background: "var(--ink)",
  color: "#0a0907",
  border: "1px solid var(--ink)",
  fontFamily: "var(--display)", fontWeight: 600, fontSize: 13,
  cursor: "pointer",
});

/* ───────────────────────── RIGHT RAIL ───────────────────────── */

function RightRail({ totals, completedSections, sectionCount, activity, generating, activeSection, activeData, activeSnapshot }) {
  return (
    <aside style={{
      borderLeft: "1px solid var(--border)",
      padding: "26px 22px",
      background: "rgba(15, 13, 10, 0.5)",
      display: "flex", flexDirection: "column", gap: 22,
      maxHeight: "calc(100vh - 64px - 48px - 56px)",
      overflowY: "auto",
      position: "sticky", top: 112, alignSelf: "start",
      height: "calc(100vh - 64px - 48px - 56px)",
    }}>
      {/* Active snapshot indicator */}
      {activeSnapshot && (
        <div style={{
          padding: "12px 14px", borderRadius: 10,
          background: "rgba(255,91,21,0.06)", border: "1px solid rgba(255,91,21,0.35)",
        }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--orange)", letterSpacing: "0.1em", marginBottom: 5 }}>
            🔗 SNAPSHOT ATIVO
          </div>
          <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 13, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {activeSnapshot.name}
          </div>
        </div>
      )}

      {/* Agent state */}
      <div style={{
        position: "relative",
        padding: "18px 18px 20px",
        border: "1px solid var(--border-strong)",
        borderRadius: 12,
        background: "linear-gradient(180deg, rgba(255,91,21,0.06), transparent 60%), var(--surface)",
        overflow: "hidden",
      }}>
        {generating && (
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(180deg, transparent, rgba(255,91,21,0.18) 50%, transparent)",
            height: 40, animation: "scan 1.6s linear infinite",
          }} />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div className="pulse-dot" />
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--orange)",
            letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            Agente VX {generating ? "· processando" : "· em standby"}
          </div>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>
          {generating
            ? "Compondo o playbook a partir de toda a coleta. Não feche esta aba."
            : <>Foco atual: <strong style={{ color: "var(--ink)" }}>{activeSection.title}</strong>. Preencha os campos para alimentar o modelo.</>
          }
        </div>
      </div>

      {/* Coverage rings */}
      <div>
        <div style={railHeader}>Cobertura do Playbook</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "16px", borderRadius: 12,
          border: "1px solid var(--border)", background: "var(--surface)",
        }}>
          <Ring pct={totals.pct} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Campos</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>
              {totals.done}<span style={{ color: "var(--muted)", fontWeight: 400 }}> / {totals.total}</span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              {completedSections}/{sectionCount} seções concluídas
            </div>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div>
        <div style={railHeader}>Log do Agente</div>
        <div style={{
          padding: "8px 10px", borderRadius: 12,
          border: "1px solid var(--border)", background: "var(--surface)",
          maxHeight: 220, overflowY: "auto",
          fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.6,
          color: "var(--ink-2)",
        }}>
          {activity.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 4px" }}>
              <span style={{
                color:
                  a.k === "ok"  ? "var(--green)"  :
                  a.k === "run" ? "var(--orange)" :
                  "var(--muted-2)",
              }}>
                {a.k === "ok" ? "›" : a.k === "run" ? "•" : "·"}
              </span>
              <span style={{ flex: 1 }}>{a.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section preview */}
      <div>
        <div style={railHeader}>Resumo desta seção</div>
        <div style={{
          padding: "14px 14px 16px", borderRadius: 12,
          border: "1px dashed var(--border-strong)",
          background: "transparent",
        }}>
          <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
            {summarizeActive(activeSection, activeData)}
          </div>
        </div>
      </div>
    </aside>
  );
}

const railHeader = {
  fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
  letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8,
};

function Ring({ pct, size = 56 }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-strong)" strokeWidth="3"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--orange)" strokeWidth="3"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset .3s" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(90 ${size/2} ${size/2})`}
        style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, fill: "var(--ink)" }}>
        {pct}%
      </text>
    </svg>
  );
}

function summarizeActive(section, data) {
  const filled = section.fields.filter((f) => window.isFilled(f, data[f.id]));
  if (!filled.length) {
    return <em style={{ color: "var(--muted)" }}>Nada preenchido aqui ainda. Conforme você responde, o agente sintetiza essa visão em tempo real.</em>;
  }
  const previews = filled.slice(0, 4).map((f) => {
    let v = data[f.id];
    if (Array.isArray(v)) v = v.map((x) => (typeof x === "string" ? x : x.name)).join(", ");
    if (typeof v === "number") v = v + (f.kind === "scale" ? "%" : "");
    v = String(v).slice(0, 90);
    return { label: f.label, value: v };
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {previews.map((p, i) => (
        <div key={i}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase" }}>
            {p.label}
          </div>
          <div style={{ color: "var(--ink)" }}>{p.value || <em style={{ color: "var(--muted)" }}>—</em>}</div>
        </div>
      ))}
      {filled.length > 4 && (
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
          + {filled.length - 4} outros campos
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── FOOTER ───────────────────────── */

function Footer() {
  return (
    <footer style={{
      height: 56, padding: "0 26px",
      borderTop: "1px solid var(--border)",
      background: "rgba(10, 9, 7, 0.85)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.06em" }}>
        <span>Luna AI · Sales Operations Engine</span>
        <span style={{ color: "var(--border-strong)" }}>|</span>
        <span>10 etapas · agente próprio · saída editável</span>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        fontFamily: "var(--display)", fontSize: 13,
      }}>
        <span style={{ color: "var(--muted)" }}>Idealizado por</span>
        <span style={{
          padding: "4px 10px", borderRadius: 999,
          border: "1px solid var(--orange)", color: "var(--orange)",
          fontWeight: 600, letterSpacing: "0.02em",
          background: "rgba(255,91,21,0.06)",
        }}>
          Cauan Favoretti
        </span>
      </div>
    </footer>
  );
}

/* ───────────────────────── GENERATING OVERLAY ───────────────────────── */

const PHRASES = [
  "mapeando o negócio",
  "estruturando o ICP",
  "desenvolvendo scripts",
  "calibrando o tom de voz",
  "montando o time comercial",
  "construindo o manual de cultura",
  "desenhando o mapa de operação",
];

const EDIT_PHRASES = [
  "analisando estrutura existente",
  "atualizando conteúdo",
  "adaptando scripts de vendas",
  "personalizando o ICP",
  "calibrando o tom de voz",
  "atualizando objeções e respostas",
  "preservando layout e design",
];

function GeneratingOverlay({ open, liveContent, editLabel }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  // Cycle through phrases
  useEffect(() => {
    if (!open) return;
    setPhraseIdx(0);
    const phrases = editLabel ? EDIT_PHRASES : PHRASES;
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }, 30000);
    return () => clearInterval(id);
  }, [open, editLabel]);

  // 3D dot sphere
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Build dots on a sphere using Fibonacci lattice
    const N = 520;
    const dots = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      dots.push({
        x: Math.cos(theta) * r,
        y: y,
        z: Math.sin(theta) * r,
      });
    }

    startRef.current = performance.now();

    const draw = (now) => {
      const t = (now - startRef.current) / 1000;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      // Pulsing radius
      const pulse = 1 + Math.sin(t * 2.6) * 0.06 + Math.sin(t * 1.1) * 0.025;
      const baseR = Math.min(W, H) * 0.30 * pulse;

      // Rotation
      const ay = t * 0.55;
      const ax = Math.sin(t * 0.38) * 0.45;
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      const cosX = Math.cos(ax), sinX = Math.sin(ax);

      const projected = [];
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // rotate Y
        let x = d.x * cosY + d.z * sinY;
        let z = -d.x * sinY + d.z * cosY;
        let y = d.y;
        // rotate X
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        y = y2; z = z2;

        // perspective
        const persp = 1 / (1.6 - z * 0.55);
        const sx = cx + x * baseR * persp;
        const sy = cy + y * baseR * persp;

        projected.push({ sx, sy, z, persp });
      }
      // Draw back-to-front for depth feel
      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const depth = (p.z + 1) / 2; // 0..1
        const size = (2.0 + depth * 2.4) * dpr;
        const alpha = 0.18 + depth * 0.82;

        // Color blend: white core to orange edges based on depth
        // Front-facing = orange-bright; back = dim ember
        const r = Math.round(255 * (0.9 + depth * 0.1));
        const g = Math.round(91 + depth * 60);
        const b = Math.round(21 + depth * 30);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // soft inner glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.4);
      grad.addColorStop(0, "rgba(255, 91, 21, 0.18)");
      grad.addColorStop(0.5, "rgba(255, 91, 21, 0.04)");
      grad.addColorStop(1, "rgba(255, 91, 21, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.4, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open]);

  const liveRef = useRef(null);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.scrollTop = liveRef.current.scrollHeight;
    }
  }, [liveContent]);

  if (!open) return null;

  const charCount = liveContent.length;
  const pct = Math.min(100, Math.round((charCount / 32000) * 100));
  const liveText = liveContent
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(-1200);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(8, 7, 6, 0.97)",
      backdropFilter: "blur(14px)",
      display: "flex",
      animation: "fadeIn .25s ease both",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes phraseIn {
          from { opacity: 0; transform: translateY(6px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes cursorBlink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>

      {/* Esquerda — esfera + status */}
      <div style={{
        width: 380, flexShrink: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        borderRight: "1px solid var(--border)",
        padding: "32px 24px",
      }}>
        <div style={{ width: 260, height: 260, position: "relative" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>

        <div style={{ marginTop: 20, textAlign: "center", width: "100%" }}>
          {editLabel && (
            <div style={{
              marginBottom: 10,
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--orange)",
              display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
            }}>
              <window.Icon name="spark" size={11} stroke="var(--orange)" />
              modo edição
            </div>
          )}

          <div style={{
            fontFamily: "var(--display)", fontSize: 16, fontWeight: 600,
            color: "var(--ink)", marginBottom: editLabel ? 6 : 16, letterSpacing: "-0.01em",
            textAlign: "center",
          }}>
            {editLabel ? "Editando playbook" : "A Luna está trabalhando, aguarde um instante"}
          </div>

          {editLabel && (
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--orange)",
              marginBottom: 14, textAlign: "center", letterSpacing: "0.02em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              maxWidth: "100%", padding: "0 8px",
            }}>
              {editLabel.replace(/^Editando · /, "")}
            </div>
          )}

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "7px 14px", borderRadius: 999,
            border: "1px solid var(--border-strong)",
            background: "rgba(20, 18, 14, 0.7)",
            width: "100%", justifyContent: "center", marginBottom: 20,
          }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, flexShrink: 0 }} />
            <span
              key={phraseIdx}
              style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: "var(--orange)", letterSpacing: "0.12em",
                textTransform: "uppercase",
                animation: "phraseIn .35s ease both",
              }}
            >
              {(editLabel ? EDIT_PHRASES : PHRASES)[phraseIdx]}<span className="blink" style={{ marginLeft: 2 }}>_</span>
            </span>
          </div>

          {/* Barra de progresso */}
          <div style={{ width: "100%", marginBottom: 10 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", marginBottom: 6,
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
              letterSpacing: "0.1em",
            }}>
              <span>PROGRESSO</span>
              <span style={{ color: "var(--orange)" }}>{charCount.toLocaleString("pt-BR")} chars</span>
            </div>
            <div style={{
              width: "100%", height: 4, borderRadius: 999,
              background: "var(--border)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 999,
                background: "linear-gradient(90deg, var(--orange), var(--orange-2))",
                width: pct + "%", transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          <div style={{
            fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted-2)",
            letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 8,
          }}>
            Luna AI · Claude Opus 4.7 · Sales Ops Engine
          </div>
        </div>
      </div>

      {/* Direita — painel ao vivo */}
      <div style={{
        width: collapsed ? 0 : undefined,
        flex: collapsed ? "0 0 0" : 1,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "flex .3s ease, width .3s ease",
        position: "relative",
      }}>
        {/* Botão flutuante de minimizar — visível mesmo colapsado */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expandir painel" : "Minimizar painel"}
          style={{
            position: "absolute",
            top: "50%", left: collapsed ? -40 : 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 28, height: 56,
            background: "var(--surface-2)",
            border: "1px solid var(--border-strong)",
            borderRight: collapsed ? "1px solid var(--border-strong)" : "none",
            borderRadius: collapsed ? "8px 0 0 8px" : "0 8px 8px 0",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--muted)",
            fontSize: 14,
            transition: "all .3s ease",
          }}
        >
          {collapsed ? "◀" : "▶"}
        </button>

        {!collapsed && (<>
        {/* Header do painel */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 24px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(15,13,10,0.8)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)",
            letterSpacing: "0.1em", marginLeft: 8,
          }}>
            OUTPUT · Claude Opus 4.7 · LIVE STREAM
          </span>
          <div style={{ flex: 1 }} />
          <span style={{
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)",
            letterSpacing: "0.08em",
          }}>
            {liveContent ? liveContent.split(/\s+/).filter(Boolean).length.toLocaleString("pt-BR") + " palavras" : "aguardando..."}
          </span>
        </div>

        {/* Conteúdo ao vivo */}
        <div
          ref={liveRef}
          style={{
            flex: 1, overflowY: "auto", padding: "20px 28px",
            fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.9,
            color: "#a3e635",
            background: "#050403",
            letterSpacing: "0.02em",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {liveText
            ? liveText + " "
            : (
              <span style={{ color: "var(--muted-2)" }}>
                {editLabel
                  ? "Carregando playbook base e iniciando edição..."
                  : "Conectando ao Claude Opus 4.7 e iniciando geração do playbook..."}
              </span>
            )
          }
          {liveContent && (
            <span style={{
              display: "inline-block", width: 8, height: 14,
              background: "#a3e635", marginLeft: 2, verticalAlign: "middle",
              animation: "cursorBlink 1s steps(1) infinite",
            }} />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "10px 24px",
          borderTop: "1px solid var(--border)",
          background: "rgba(15,13,10,0.8)",
          fontFamily: "var(--mono)", fontSize: 10,
          color: "var(--muted-2)", letterSpacing: "0.1em",
          flexShrink: 0,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>model: claude-opus-4-7 · stream: true · max_tokens: 50000</span>
          <span style={{ color: "var(--orange)" }}>
            {charCount > 0 ? "● RECEBENDO" : "○ AGUARDANDO"}
          </span>
        </div>
        </>)}
      </div>
    </div>
  );
}

window.GeneratingOverlay = GeneratingOverlay;

/* ───────────────────────── PLAYBOOK EDITOR ───────────────────────── */

function PlaybookEditor({ playbook, onClose }) {
  const iframeRef = useRef(null);
  const logoInputRef = useRef(null);
  const imgInputRef = useRef(null);
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    const blob = new Blob([playbook.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const iframe = iframeRef.current;
    if (!iframe) { URL.revokeObjectURL(url); return; }
    iframe.src = url;
    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument;
        doc.designMode = "on";
        doc.addEventListener("input", () => setUnsaved(true));
      } catch (_) {}
    };
    return () => URL.revokeObjectURL(url);
  }, [playbook.html]);

  const execCmd = (cmd, val = null) => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) { doc.execCommand(cmd, false, val); doc.body?.focus(); }
    } catch (_) {}
    setUnsaved(true);
  };

  const insertFile = async (file) => {
    if (!file) return;
    const r = await window._readUploadFile(file);
    if (r.kind === "image" && r.dataUrl) {
      execCmd("insertHTML",
        `<img src="${r.dataUrl}" alt="${file.name.replace(/\.[^.]+$/, "")}" ` +
        `style="max-height:80px;width:auto;display:inline-block;vertical-align:middle;margin:4px 6px">`
      );
    } else if (r.kind === "svg" && r.content) {
      execCmd("insertHTML", r.content);
    }
  };

  const getEditedHTML = () => {
    try {
      return "<!DOCTYPE html>\n" +
        (iframeRef.current?.contentDocument?.documentElement?.outerHTML || playbook.html);
    } catch (_) { return playbook.html; }
  };

  const download = () => {
    const html = getEditedHTML();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vx-playbook-${playbook.id}.html`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    setUnsaved(false);
  };

  const TBtn = ({ title, onClick, children, highlight, style: sx }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        background: highlight ? "var(--orange)" : "transparent",
        color: highlight ? "#0a0907" : "var(--ink-2)",
        border: `1px solid ${highlight ? "var(--orange)" : "var(--border)"}`,
        borderRadius: 6, padding: "5px 11px", cursor: "pointer",
        fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
        display: "inline-flex", alignItems: "center", gap: 6,
        letterSpacing: "0.04em", whiteSpace: "nowrap", transition: "all .12s",
        ...sx,
      }}
    >{children}</button>
  );

  const Sep = () => (
    <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 2px" }} />
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1200,
      display: "flex", flexDirection: "column",
      background: "var(--bg)",
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
        padding: "9px 14px", flexShrink: 0,
        background: "var(--surface)", borderBottom: "1px solid var(--border-strong)",
      }}>
        <TBtn title="Opções de download e resumo do playbook" onClick={onClose}>
          <Icon name="back" size={13} /> Opções
        </TBtn>

        <Sep />

        {/* Insert logo */}
        <TBtn
          title="Clique no local desejado no playbook, depois clique aqui para inserir o logo"
          onClick={() => logoInputRef.current?.click()}
          style={{ color: "var(--orange)", borderColor: "rgba(255,91,21,0.4)" }}
        >
          <Icon name="spark" size={13} stroke="var(--orange)" /> Inserir Logo
        </TBtn>
        <input
          ref={logoInputRef} type="file"
          accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
          style={{ display: "none" }}
          onChange={(e) => { insertFile(e.target.files?.[0]); e.target.value = ""; }}
        />

        {/* Insert image */}
        <TBtn
          title="Inserir qualquer imagem no ponto atual do cursor"
          onClick={() => imgInputRef.current?.click()}
        >
          <Icon name="palette" size={13} /> Imagem
        </TBtn>
        <input
          ref={imgInputRef} type="file"
          accept=".png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.avif"
          style={{ display: "none" }}
          onChange={(e) => { insertFile(e.target.files?.[0]); e.target.value = ""; }}
        />

        <Sep />

        {/* Text formatting */}
        <TBtn title="Negrito" onClick={() => execCmd("bold")} sx={{ fontWeight: 700, fontFamily: "serif", fontSize: 14 }}>
          <strong>B</strong>
        </TBtn>
        <TBtn title="Itálico" onClick={() => execCmd("italic")}>
          <em style={{ fontFamily: "serif", fontSize: 14 }}>I</em>
        </TBtn>
        <TBtn title="Sublinhado" onClick={() => execCmd("underline")}>
          <span style={{ textDecoration: "underline", fontFamily: "serif", fontSize: 14 }}>U</span>
        </TBtn>

        <Sep />

        {/* Undo / Redo */}
        <TBtn title="Desfazer (Ctrl+Z)" onClick={() => execCmd("undo")}>↩ Desfazer</TBtn>
        <TBtn title="Refazer (Ctrl+Y)" onClick={() => execCmd("redo")}>↪ Refazer</TBtn>

        <Sep />

        {/* Download */}
        <TBtn title="Baixar HTML com as edições" onClick={download} highlight={unsaved}>
          <Icon name="save" size={13} stroke={unsaved ? "#0a0907" : "var(--ink-2)"} />
          {unsaved ? "Baixar *" : "Baixar"}
        </TBtn>

        {unsaved && (
          <span style={{
            fontFamily: "var(--mono)", fontSize: 10,
            color: "var(--orange)", letterSpacing: "0.07em",
          }}>
            alterações não salvas
          </span>
        )}

        {/* Help hint */}
        <span style={{
          marginLeft: "auto",
          fontFamily: "var(--mono)", fontSize: 10,
          color: "var(--muted-2)", letterSpacing: "0.05em",
        }}>
          Clique no playbook para editar · Ctrl+Z desfaz
        </span>
      </div>

      {/* Editable iframe */}
      <iframe
        ref={iframeRef}
        title="Editor de Playbook"
        style={{ flex: 1, border: "none", background: "#fff" }}
      />
    </div>
  );
}

window.PlaybookEditor = PlaybookEditor;

/* ───────────────────────── HISTÓRICO VIEW ───────────────────────── */

function HistoricoView({ playbooks, onOpen, onDelete }) {
  const [deleting, setDeleting] = React.useState(null);
  const [loading, setLoading] = React.useState(null);

  const handleOpen = async (pb) => {
    setLoading(pb.id);
    try { await onOpen(pb); } finally { setLoading(null); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await onDelete(id); } finally { setDeleting(null); }
  };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--orange)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
          ✦ Histórico
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>
          Playbooks Gerados
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
          Salvos automaticamente após cada geração. Clique para reabrir ou baixar.
        </div>
      </div>

      {playbooks.length === 0 ? (
        <div style={{
          padding: "56px 32px", borderRadius: 16, textAlign: "center",
          border: "1px dashed var(--border-strong)", background: "var(--surface)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 14 }}>📄</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Nenhum playbook ainda</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
            Gere um playbook na aba Completo ou Rápido e ele aparecerá aqui automaticamente.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {playbooks.map((pb) => {
            const date = pb.generatedAt ? new Date(pb.generatedAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
            const empresa = pb.empresa || pb.title?.replace("Playbook Operacional — ", "") || "Empresa";
            const isLoading = loading === pb.id;
            const isDeleting = deleting === pb.id;
            return (
              <div key={pb.id} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 20px", borderRadius: 12,
                background: "var(--surface)", border: "1px solid var(--border)",
                transition: "border-color .15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-strong)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: "rgba(255,91,21,0.1)", color: "var(--orange)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {pb.title || `Playbook — ${empresa}`}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.04em" }}>
                      {date}
                    </span>
                    {pb.wordCount > 0 && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)" }}>
                        {pb.wordCount.toLocaleString("pt-BR")} palavras
                      </span>
                    )}
                    {pb.sections?.length > 0 && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)" }}>
                        {pb.sections.length} seções
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleOpen(pb)}
                    disabled={isLoading}
                    style={{
                      padding: "7px 16px", borderRadius: 8, cursor: isLoading ? "default" : "pointer",
                      background: isLoading ? "var(--surface-2)" : "var(--orange)",
                      color: isLoading ? "var(--muted)" : "#0a0907",
                      border: "none", fontFamily: "var(--display)", fontWeight: 600, fontSize: 12,
                      transition: "all .15s",
                    }}
                  >{isLoading ? "Abrindo..." : "Abrir"}</button>
                  <button
                    onClick={() => handleDelete(pb.id)}
                    disabled={isDeleting}
                    style={{
                      padding: "7px 10px", borderRadius: 8, cursor: isDeleting ? "default" : "pointer",
                      background: "transparent", color: isDeleting ? "var(--muted-2)" : "var(--muted)",
                      border: "1px solid var(--border)", transition: "all .15s",
                    }}
                    onMouseEnter={(e) => { if (!isDeleting) { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── DOWNLOAD SCREEN ───────────────────────── */

function DownloadScreen({ playbook, onClose, onSaveSnapshot, onGoToSnapshots, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(true);
  const [snapName, setSnapName] = useState("");
  const [snapSaved, setSnapSaved] = useState(false);
  const [snapSaving, setSnapSaving] = useState(false);
  const [snapError, setSnapError] = useState(null);
  const [showSnapInput, setShowSnapInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editChars, setEditChars] = useState(0);
  const [editError, setEditError] = useState(null);
  const [editDone, setEditDone] = useState(false);
  const [editAttachments, setEditAttachments] = useState([]);
  const [editAttLoading, setEditAttLoading] = useState(false);
  const editFileRef = useRef(null);

  if (!playbook) return null;

  if (editing) {
    return <PlaybookEditor playbook={playbook} onClose={() => setEditing(false)} />;
  }

  const handleSaveSnapshot = async () => {
    const name = snapName.trim() || playbook.title;
    setSnapSaving(true);
    setSnapError(null);
    try {
      await onSaveSnapshot(playbook, name);
      setSnapSaved(true);
      setShowSnapInput(false);
      setSnapName("");
    } catch (err) {
      setSnapError(err.message || "Erro ao salvar no banco. Verifique se a tabela foi criada no Supabase.");
    } finally {
      setSnapSaving(false);
    }
  };

  const handleEditFiles = async (fileList) => {
    setEditAttLoading(true);
    const added = [];
    for (const file of Array.from(fileList)) {
      try {
        const result = await readFileContent(file);
        if (result && result.kind !== "image_too_large") added.push({ ...result, name: file.name, size: file.size });
        else if (result && result.kind === "image_too_large") {
          setEditError(`Imagem "${file.name}" muito grande (máx. 1.5 MB). Reduza o tamanho e tente novamente.`);
        }
      } catch (_) {}
    }
    setEditAttachments((prev) => [...prev, ...added]);
    setEditAttLoading(false);
  };

  const removeEditAttachment = (idx) => {
    setEditAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEdit = async () => {
    if (!editPrompt.trim() || editLoading) return;
    setEditLoading(true);
    setEditChars(0);
    setEditError(null);
    setEditDone(false);
    try {
      const newHtml = await window.VX_API.editPlaybook({
        html: playbook.html,
        prompt: editPrompt.trim(),
        attachments: editAttachments,
        onToken: (_, accumulated) => setEditChars(accumulated.length),
      });
      onUpdate && onUpdate(newHtml);
      setEditPrompt("");
      setEditAttachments([]);
      setEditDone(true);
      setTimeout(() => setEditDone(false), 4000);
    } catch (err) {
      setEditError(err.message || "Erro ao editar. Tente novamente.");
    } finally {
      setEditLoading(false);
      setEditChars(0);
    }
  };

  const openPreview = () => {
    if (!playbook.html) return;
    const blob = new Blob([playbook.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const downloadHtml = () => {
    if (!playbook.html) return;
    const blob = new Blob([playbook.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vx-playbook-${playbook.id}.html`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const copyHtml = () => {
    if (!playbook.html) return;
    navigator.clipboard?.writeText(playbook.html);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const assets = playbook.assets || {};
  const stats = [
    { l: "Seções",   v: (playbook.sections || []).length },
    { l: "Palavras", v: (playbook.wordCount || 0).toLocaleString("pt-BR") },
    { l: "Módulos",  v: assets.scripts ?? assets.cadencias ?? "—" },
    { l: "Cargos",   v: assets.cargos ?? assets.kpis ?? "—" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(8,7,6,0.95)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 32, animation: "fadeIn .3s ease both",
    }}>
      <style>{`
        @keyframes pop { from { opacity:0; transform: translateY(10px) scale(.98) } to { opacity:1; transform:none } }
        @keyframes ringPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,91,21,.45) } 50% { box-shadow: 0 0 0 18px rgba(255,91,21,0) } }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 860,
        background: "linear-gradient(180deg, rgba(255,91,21,0.05), transparent 35%), var(--surface)",
        border: "1px solid var(--border-strong)", borderRadius: 20,
        padding: "36px 40px 32px", position: "relative",
        animation: "pop .4s ease both",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "transparent", border: "1px solid var(--border)",
          color: "var(--muted)", borderRadius: 8, padding: 6, cursor: "pointer",
        }}><window.Icon name="x" size={16}/></button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "var(--orange)", color: "#0a0907",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "ringPulse 2.4s ease-out infinite", flexShrink: 0,
          }}>
            <window.Icon name="check" size={24} stroke="#0a0907" />
          </div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--orange)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Playbook pronto · v{playbook.version}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 3 }}>
              {playbook.title}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 26 }}>
          {stats.map((s) => (
            <div key={s.l} style={{
              padding: "14px 16px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--bg-2)",
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.l}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Sections list */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
            Sumário gerado
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
            {playbook.sections.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8,
                background: "rgba(255,91,21,0.04)",
                border: "1px solid var(--border)",
                fontSize: 13, color: "var(--ink-2)",
              }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--orange)" }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s}</span>
                <window.Icon name="check" size={12} stroke="var(--green)"/>
              </div>
            ))}
          </div>
        </div>

        {/* Primary actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <button
            onClick={openPreview}
            style={{
              padding: "18px 22px", borderRadius: 12,
              background: "var(--orange)", color: "#0a0907",
              border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 4,
              fontFamily: "var(--display)", textAlign: "left",
              transition: "transform .12s",
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "none"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#0a0907" strokeWidth={1.8} strokeLinecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <path d="M15 3h6v6"/>
                <path d="M10 14L21 3"/>
              </svg>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Abrir Preview</span>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, opacity: 0.75, letterSpacing: "0.04em" }}>
              Abre o playbook em nova aba · HTML completo
            </span>
          </button>

          <button
            onClick={downloadHtml}
            style={{
              padding: "18px 22px", borderRadius: 12,
              background: "var(--surface-2)", color: "var(--ink)",
              border: "1px solid var(--border-strong)", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 4,
              fontFamily: "var(--display)", textAlign: "left",
              transition: "transform .12s",
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "none"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <window.Icon name="upload" size={18} stroke="var(--orange)"/>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Baixar HTML</span>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}>
              Arquivo standalone · pronto para hospedar
            </span>
          </button>
        </div>

        {/* Edit button */}
        <button
          onClick={() => setEditing(true)}
          style={{
            width: "100%", marginBottom: 12,
            padding: "15px 22px", borderRadius: 12,
            background: "rgba(255,91,21,0.06)", color: "var(--ink)",
            border: "1px solid rgba(255,91,21,0.35)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12,
            fontFamily: "var(--display)", textAlign: "left",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,91,21,0.12)"; e.currentTarget.style.borderColor = "rgba(255,91,21,0.6)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,91,21,0.06)"; e.currentTarget.style.borderColor = "rgba(255,91,21,0.35)"; }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: "rgba(255,91,21,0.15)", color: "var(--orange)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--orange)" }}>Editar Playbook</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em", marginTop: 2 }}>
              Edite textos, insira logos e imagens diretamente no arquivo gerado
            </div>
          </div>
          <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--orange)", letterSpacing: "0.1em" }}>
            ABRIR →
          </span>
        </button>

        {/* Save as Snapshot */}
        {snapSaved ? (
          <div style={{
            marginBottom: 12, padding: "14px 18px", borderRadius: 12,
            background: "rgba(255,91,21,0.06)", border: "1px solid rgba(255,91,21,0.35)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 14, color: "var(--orange)" }}>Snapshot salvo!</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Acesse na aba Snapshots para ativar como estrutura base</div>
            </div>
            <button
              onClick={onGoToSnapshots}
              style={{
                padding: "7px 14px", borderRadius: 8,
                background: "rgba(255,91,21,0.15)", border: "1px solid rgba(255,91,21,0.4)",
                color: "var(--orange)", fontFamily: "var(--mono)", fontSize: 11,
                cursor: "pointer", letterSpacing: "0.06em",
              }}
            >
              VER SNAPSHOTS →
            </button>
          </div>
        ) : showSnapInput ? (
          <div style={{
            marginBottom: 12, padding: "16px 18px", borderRadius: 12,
            background: "var(--surface-2)", border: "1px solid var(--border-strong)",
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.14em", marginBottom: 10 }}>NOME DO SNAPSHOT</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                autoFocus
                value={snapName}
                onChange={(e) => { setSnapName(e.target.value); setSnapError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveSnapshot(); if (e.key === "Escape") setShowSnapInput(false); }}
                placeholder={playbook.title}
                disabled={snapSaving}
                style={{
                  flex: 1, background: "var(--bg-2)", color: "var(--ink)",
                  border: `1px solid ${snapError ? "rgba(239,68,68,0.6)" : "var(--orange)"}`, borderRadius: 8,
                  padding: "9px 13px", fontFamily: "var(--display)", fontSize: 13, outline: "none",
                  opacity: snapSaving ? 0.6 : 1,
                }}
              />
              <button
                onClick={handleSaveSnapshot}
                disabled={snapSaving}
                style={{
                  padding: "9px 18px", borderRadius: 8,
                  background: snapSaving ? "var(--surface-2)" : "var(--orange)",
                  color: snapSaving ? "var(--muted)" : "#0a0907",
                  border: "none", fontFamily: "var(--display)", fontWeight: 600, fontSize: 13,
                  cursor: snapSaving ? "default" : "pointer", minWidth: 80,
                }}
              >{snapSaving ? "Salvando..." : "Salvar"}</button>
              <button
                onClick={() => setShowSnapInput(false)}
                style={{
                  padding: "9px 12px", borderRadius: 8,
                  background: "transparent", border: "1px solid var(--border)",
                  color: "var(--muted)", cursor: "pointer",
                }}
              >✕</button>
            </div>
            {snapError && (
              <div style={{
                marginTop: 10, padding: "10px 14px", borderRadius: 8,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
                fontFamily: "var(--mono)", fontSize: 11, color: "#f87171", lineHeight: 1.6,
              }}>
                ✕ {snapError}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowSnapInput(true)}
            style={{
              width: "100%", marginBottom: 12,
              padding: "13px 18px", borderRadius: 12,
              background: "transparent", border: "1px dashed var(--border-strong)",
              color: "var(--muted)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
              fontFamily: "var(--display)", fontSize: 14, transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,91,21,0.5)"; e.currentTarget.style.color = "var(--orange)"; e.currentTarget.style.background = "rgba(255,91,21,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M5 4h11l3 3v13H5V4z"/><path d="M9 4v6h6V4M8 14h8v6H8z"/></svg>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600 }}>Salvar como Snapshot</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)", marginTop: 2, letterSpacing: "0.04em" }}>
                Reutilize este playbook como estrutura base para futuras gerações
              </div>
            </div>
            <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em" }}>+ SNAPSHOT</span>
          </button>
        )}

        {/* Edit with AI */}
        <div style={{
          marginBottom: 12, padding: "16px 18px", borderRadius: 12,
          background: "var(--surface-2)", border: "1px solid var(--border-strong)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Editar com IA — sem regenerar
          </div>
          {editDone ? (
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: "rgba(110,231,168,0.08)", border: "1px solid rgba(110,231,168,0.3)",
              display: "flex", alignItems: "center", gap: 8,
              fontFamily: "var(--mono)", fontSize: 12, color: "var(--green)",
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
              Edição aplicada! Abra o Preview para ver as mudanças.
            </div>
          ) : editLoading ? (
            <div style={{
              padding: "14px 16px", borderRadius: 8,
              background: "var(--bg-2)", border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div className="pulse-dot" />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--orange)", letterSpacing: "0.06em" }}>
                  Aplicando edição cirúrgica...
                </span>
              </div>
              <div style={{
                height: 4, borderRadius: 4, background: "var(--border)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", background: "var(--orange)",
                  width: `${Math.min(99, (editChars / 45000) * 100)}%`,
                  transition: "width .3s ease",
                  borderRadius: 4,
                }} />
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginTop: 6 }}>
                {editChars.toLocaleString("pt-BR")} caracteres recebidos...
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8 }}>
                <textarea
                  value={editPrompt}
                  onChange={(e) => { setEditPrompt(e.target.value); setEditError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleEdit(); }}
                  placeholder="Ex: Torne os scripts mais diretos. Adicione um case de sucesso. Troque o logo pelo anexado. Mude o nome da empresa para VX Corp..."
                  rows={3}
                  style={{
                    flex: 1, background: "var(--bg-2)", color: "var(--ink)",
                    border: `1px solid ${editError ? "rgba(239,68,68,0.5)" : "var(--border-strong)"}`,
                    borderRadius: 8, padding: "10px 12px",
                    fontFamily: "var(--display)", fontSize: 12,
                    resize: "vertical", outline: "none", lineHeight: 1.5,
                  }}
                />
                <button
                  onClick={handleEdit}
                  disabled={!editPrompt.trim()}
                  style={{
                    padding: "10px 16px", borderRadius: 8, alignSelf: "flex-end",
                    background: editPrompt.trim() ? "rgba(255,91,21,0.15)" : "transparent",
                    color: editPrompt.trim() ? "var(--orange)" : "var(--muted-2)",
                    border: `1px solid ${editPrompt.trim() ? "rgba(255,91,21,0.4)" : "var(--border)"}`,
                    fontFamily: "var(--display)", fontWeight: 600, fontSize: 12,
                    cursor: editPrompt.trim() ? "pointer" : "default",
                    transition: "all .15s", whiteSpace: "nowrap",
                  }}
                >
                  Aplicar ✦
                </button>
              </div>

              {/* ── Attachments ── */}
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                {/* File chips */}
                {editAttachments.map((att, i) => {
                  const isImg = att.kind === "image" || att.kind === "svg";
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "3px 6px 3px 9px", borderRadius: 999,
                      background: isImg ? "rgba(110,231,168,0.07)" : "rgba(59,130,246,0.07)",
                      border: `1px solid ${isImg ? "rgba(110,231,168,0.28)" : "rgba(59,130,246,0.28)"}`,
                      fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-2)",
                      maxWidth: 180,
                    }}>
                      <span style={{ flexShrink: 0 }}>
                        {att.kind === "svg" ? "🎨" : isImg ? "🖼" : "📄"}
                      </span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {att.name}
                      </span>
                      <button
                        onClick={() => removeEditAttachment(i)}
                        style={{
                          background: "none", border: "none", color: "var(--muted-2)",
                          cursor: "pointer", padding: "0 2px", fontSize: 13, lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >×</button>
                    </div>
                  );
                })}

                {/* Attach button */}
                <button
                  onClick={() => editFileRef.current?.click()}
                  disabled={editAttLoading}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 6,
                    background: "transparent", border: "1px solid var(--border)",
                    color: editAttLoading ? "var(--muted-2)" : "var(--muted)",
                    fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em",
                    cursor: editAttLoading ? "default" : "pointer", transition: "all .15s",
                  }}
                  onMouseEnter={(e) => { if (!editAttLoading) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--ink-2)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M21.44 12.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  {editAttLoading ? "LENDO..." : "ANEXAR"}
                </button>
                <input
                  ref={editFileRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.gif,.webp,.avif,.svg,.pdf,.txt,.md,.csv,.json,.html,.htm"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const fileArr = Array.from(e.target.files || []);
                    e.target.value = "";
                    if (fileArr.length) handleEditFiles(fileArr);
                  }}
                />
              </div>

              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)", marginTop: 6, letterSpacing: "0.04em" }}>
                Ctrl+Enter para enviar · Anexe imagens, logos ou documentos de referência
              </div>
              {editError && (
                <div style={{
                  marginTop: 8, padding: "8px 12px", borderRadius: 8,
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                  fontFamily: "var(--mono)", fontSize: 11, color: "#f87171",
                }}>
                  ✕ {editError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Copy source */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 14px", borderRadius: 10,
          background: "var(--bg-2)", border: "1px solid var(--border)",
          marginBottom: 16,
        }}>
          <window.Icon name="file" size={14} stroke="var(--muted)"/>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", flex: 1, letterSpacing: "0.04em" }}>
            Código-fonte HTML · {(playbook.html || "").length.toLocaleString("pt-BR")} caracteres
          </span>
          <button onClick={copyHtml} style={{
            background: copied ? "var(--green)" : "transparent",
            color: copied ? "#0a0907" : "var(--ink-2)",
            border: "1px solid " + (copied ? "var(--green)" : "var(--border-strong)"),
            padding: "6px 14px", borderRadius: 6,
            fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.06em", cursor: "pointer", transition: "all .15s",
          }}>{copied ? "COPIADO ✓" : "COPIAR HTML"}</button>
        </div>

        {/* Footer row */}
        <div style={{
          paddingTop: 14, borderTop: "1px dashed var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em",
        }}>
          <span>Luna AI · gerado {new Date(playbook.generatedAt).toLocaleString("pt-BR")} · {playbook.id}</span>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", color: "var(--ink-2)",
            cursor: "pointer", fontFamily: "var(--display)", fontSize: 13,
          }}>Voltar para edição →</button>
        </div>
      </div>
    </div>
  );
}

window.DownloadScreen = DownloadScreen;

/* ───────────────────────── API KEY MODAL ───────────────────────── */

function APIKeyModal({ open, onClose }) {
  const [key, setKey] = useState(() => window.VX_API?.getKey() || "");
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!open) return null;

  const save = () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-")) {
      setErr("A chave deve começar com sk-");
      return;
    }
    setErr("");
    window.VX_API?.setKey(trimmed);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const clear = () => {
    setKey("");
    window.VX_API?.setKey("");
    onClose();
  };

  const test = async () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-")) { setErr("A chave deve começar com sk-"); return; }
    setTesting(true);
    setTestResult(null);
    window.VX_API?.setKey(trimmed);
    const result = await window.VX_API?.testConnection();
    setTesting(false);
    setTestResult(result);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1200,
      background: "rgba(8,7,6,0.92)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "fadeIn .2s ease both",
    }}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: "var(--surface)",
        border: "1px solid var(--border-strong)", borderRadius: 18,
        padding: "32px 32px 28px",
        animation: "pop .3s ease both",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", right: 16, top: 16,
          background: "transparent", border: "1px solid var(--border)",
          color: "var(--muted)", borderRadius: 8, padding: 6, cursor: "pointer",
          display: "flex",
        }}><window.Icon name="x" size={15}/></button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(255,91,21,0.10)", border: "1px solid rgba(255,91,21,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinecap="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Configurar Anthropic API Key</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Salva apenas no seu navegador (localStorage)
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 20 }}>
          A chave é usada diretamente do browser para chamar o modelo <strong style={{ color: "var(--ink)" }}>Claude Opus 4.7</strong> e gerar o playbook em HTML.
          Obtenha sua chave em <strong style={{ color: "var(--orange)" }}>console.anthropic.com/settings/keys</strong>.
        </div>

        <div style={{ marginBottom: 6 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Sua API Key
          </div>
          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="sk-proj-..."
            autoFocus
            style={{
              width: "100%", background: "var(--bg-2)", color: "var(--ink)",
              border: `1px solid ${err ? "var(--red)" : "var(--border-strong)"}`,
              borderRadius: 10, padding: "12px 14px",
              fontFamily: "var(--mono)", fontSize: 13, letterSpacing: "0.04em",
              outline: "none", transition: "border-color .15s",
            }}
          />
          {err && (
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)", marginTop: 6 }}>
              {err}
            </div>
          )}
        </div>

        {testResult && (
          <div style={{
            margin: "12px 0 0", padding: "10px 14px", borderRadius: 8,
            background: testResult.ok ? "rgba(110,231,168,0.08)" : "rgba(239,68,68,0.08)",
            border: "1px solid " + (testResult.ok ? "rgba(110,231,168,0.3)" : "rgba(239,68,68,0.3)"),
            fontFamily: "var(--mono)", fontSize: 12,
            color: testResult.ok ? "var(--green)" : "var(--red)",
          }}>
            {testResult.ok ? "✓ Conexão OK — " + testResult.msg : "✗ Erro: " + testResult.msg}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={save} style={{
            flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer",
            background: saved ? "var(--green)" : "var(--orange)", color: "#0a0907",
            border: "none", fontFamily: "var(--display)", fontWeight: 700, fontSize: 14,
            transition: "all .2s",
          }}>
            {saved ? "✓ Salvo!" : "Salvar e ativar"}
          </button>
          <button onClick={test} disabled={testing} style={{
            padding: "12px 16px", borderRadius: 10, cursor: testing ? "wait" : "pointer",
            background: "transparent", color: "var(--ink-2)",
            border: "1px solid var(--border-strong)",
            fontFamily: "var(--display)", fontSize: 13,
            opacity: testing ? 0.6 : 1,
          }}>
            {testing ? "Testando..." : "Testar"}
          </button>
          {window.VX_API?.getKey() && (
            <button onClick={clear} style={{
              padding: "12px 14px", borderRadius: 10, cursor: "pointer",
              background: "transparent", color: "var(--muted)",
              border: "1px solid var(--border-strong)",
              fontFamily: "var(--display)", fontSize: 13,
            }}>
              Remover
            </button>
          )}
        </div>

        <div style={{
          marginTop: 20, padding: "12px 14px", borderRadius: 8,
          background: "rgba(255,181,71,0.06)", border: "1px solid rgba(255,181,71,0.2)",
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--gold)", lineHeight: 1.5,
          letterSpacing: "0.03em",
        }}>
          ⚠ A chave fica no localStorage do seu navegador. Para produção, prefira um backend.
        </div>
      </div>
    </div>
  );
}

window.APIKeyModal = APIKeyModal;

/* ───────────────────────── TEMPLATE MODAL ───────────────────────── */

const TAG_COLORS = {
  "B2B": "#3b82f6", "B2C": "#8b5cf6", "SaaS": "#6366f1",
  "Marketing": "#ec4899", "Consultoria": "#ff5b15", "Vendas": "#f59e0b",
  "Saúde": "#6ee7a8", "Clínica": "#6ee7a8", "Tráfego Pago": "#ec4899",
  "Social Media": "#f472b6", "Imóveis": "#ffb547", "Tech": "#3b82f6",
  "Alto Ticket": "#ffb547", "Recorrente": "#a78bfa", "Local": "#34d399",
  "Treinamento": "#fb923c", "Software": "#6366f1", "Lançamentos": "#fbbf24",
};

function TemplateModal({ open, onClose, onLoad }) {
  const [selected, setSelected] = useState(null);
  const [confirmMode, setConfirmMode] = useState(false);
  const templates = window.VX_TEMPLATES || [];

  useEffect(() => { if (!open) { setSelected(null); setConfirmMode(false); } }, [open]);

  if (!open) return null;

  const tpl = selected != null ? templates[selected] : null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1200,
      background: "rgba(8,7,6,0.95)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "fadeIn .2s ease both",
    }}>
      <div style={{
        width: "100%", maxWidth: 900,
        background: "var(--surface)",
        border: "1px solid var(--border-strong)", borderRadius: 20,
        overflow: "hidden", animation: "pop .35s ease both",
        display: "flex", flexDirection: "column",
        maxHeight: "90vh",
      }}>
        {/* Header */}
        <div style={{
          padding: "22px 28px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Carregar template</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 3, letterSpacing: "0.06em" }}>
              Escolha um nicho como base e personalize os campos
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--muted)", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex",
          }}><window.Icon name="x" size={15}/></button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 28px", overflowY: "auto", flex: 1 }}>
          {!confirmMode ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                {templates.map((t, i) => {
                  const isSelected = selected === i;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelected(isSelected ? null : i)}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${t.color}12, ${t.color}06)`
                          : "rgba(255,255,255,0.02)",
                        border: `1.5px solid ${isSelected ? t.color : "var(--border)"}`,
                        borderRadius: 14, padding: "18px 18px 16px",
                        cursor: "pointer", textAlign: "left",
                        transition: "all .18s",
                        transform: isSelected ? "scale(2.01)" : "scale(1)",
                      }}
                    >
                      {/* Icon + name */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                          background: `${t.color}18`,
                          border: `1px solid ${t.color}40`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <window.Icon name={t.icon} size={18} stroke={t.color} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", lineHeight: 1.2 }}>
                          {t.name}
                        </div>
                      </div>

                      {/* Description */}
                      <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 12 }}>
                        {t.description}
                      </div>

                      {/* Tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {t.tags.map((tag) => (
                          <span key={tag} style={{
                            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.05em",
                            padding: "3px 8px", borderRadius: 999,
                            background: `${TAG_COLORS[tag] || "var(--orange)"}18`,
                            color: TAG_COLORS[tag] || "var(--orange)",
                            border: `1px solid ${TAG_COLORS[tag] || "var(--orange)"}35`,
                          }}>{tag}</span>
                        ))}
                      </div>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div style={{
                          marginTop: 12, paddingTop: 10, borderTop: `1px solid ${t.color}30`,
                          display: "flex", alignItems: "center", gap: 6,
                          fontFamily: "var(--mono)", fontSize: 11, color: t.color, letterSpacing: "0.06em",
                        }}>
                          <window.Icon name="check" size={12} stroke={t.color} />
                          SELECIONADO
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Preview strip when selected */}
              {tpl && (
                <div style={{
                  marginTop: 18, padding: "16px 18px", borderRadius: 12,
                  background: `linear-gradient(135deg, ${tpl.color}08, transparent)`,
                  border: `1px solid ${tpl.color}30`,
                }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                    Preview do template — {tpl.name}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {[
                      { l: "Nicho", v: tpl.data.empresa?.nicho },
                      { l: "Promessa", v: tpl.data.empresa?.promessa },
                      { l: "Ticket médio", v: tpl.data.oferta?.["planos"] ? tpl.data.icp?.ticket : tpl.data.icp?.ticket },
                      { l: "Modelo", v: tpl.data.icp?.modelo },
                      { l: "Principal dor", v: tpl.data.icp?.dor_principal?.slice(0, 60) + "..." },
                      { l: "ROI típico", v: tpl.data.cases?.roi },
                    ].filter(x => x.v).map((item) => (
                      <div key={item.l} style={{
                        padding: "10px 12px", borderRadius: 8,
                        background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)",
                      }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                          {item.l}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4 }}>{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Confirm mode */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, margin: "0 auto 16px",
                background: `${tpl.color}18`, border: `1px solid ${tpl.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <window.Icon name={tpl.icon} size={26} stroke={tpl.color} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Carregar "{tpl.name}"?
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: 460, margin: "0 auto 24px", lineHeight: 1.6 }}>
                Os campos do template serão <strong style={{ color: "var(--ink)" }}>mesclados</strong> com seus dados atuais.
                Campos já preenchidos serão <strong style={{ color: "var(--orange)" }}>substituídos</strong> pelo conteúdo do template.
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => onLoad(tpl.data)}
                  style={{
                    padding: "13px 28px", borderRadius: 10, cursor: "pointer",
                    background: tpl.color, color: "#0a0907",
                    border: "none", fontFamily: "var(--display)", fontWeight: 700, fontSize: 15,
                  }}
                >
                  Confirmar e carregar
                </button>
                <button
                  onClick={() => setConfirmMode(false)}
                  style={{
                    padding: "13px 22px", borderRadius: 10, cursor: "pointer",
                    background: "transparent", color: "var(--ink-2)",
                    border: "1px solid var(--border-strong)",
                    fontFamily: "var(--display)", fontSize: 14,
                  }}
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!confirmMode && (
          <div style={{
            padding: "16px 28px", borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>
              {selected != null ? `Template selecionado: ${tpl.name}` : `${templates.length} templates disponíveis · selecione um para continuar`}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{
                padding: "10px 18px", borderRadius: 8, cursor: "pointer",
                background: "transparent", color: "var(--ink-2)",
                border: "1px solid var(--border-strong)",
                fontFamily: "var(--display)", fontSize: 13,
              }}>Cancelar</button>
              <button
                onClick={() => selected != null && setConfirmMode(true)}
                disabled={selected == null}
                style={{
                  padding: "10px 22px", borderRadius: 8,
                  background: selected != null ? (tpl?.color || "var(--orange)") : "var(--surface-2)",
                  color: selected != null ? "#0a0907" : "var(--muted)",
                  border: "none", cursor: selected != null ? "pointer" : "not-allowed",
                  fontFamily: "var(--display)", fontWeight: 600, fontSize: 13,
                  transition: "all .15s",
                }}
              >
                Usar template →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.TemplateModal = TemplateModal;

/* ───────────────────────── ERROR MODAL ───────────────────────── */

function ErrorModal({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(8,7,6,0.88)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 32, animation: "fadeIn .25s ease both",
    }}>
      <div style={{
        width: "100%", maxWidth: 520,
        background: "var(--surface)",
        border: "1px solid rgba(239,68,68,0.4)",
        borderRadius: 16, padding: "32px 36px",
        animation: "pop .3s ease both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>⚠️</div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#f87171", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>
              Erro ao gerar playbook
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
              A geração não foi concluída
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 10, padding: "14px 16px", marginBottom: 20,
          fontFamily: "var(--mono)", fontSize: 12, color: "#fca5a5", lineHeight: 1.6,
          wordBreak: "break-word",
        }}>
          {msg}
        </div>

        <div style={{ fontFamily: "var(--display)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
          Causas comuns: chave API inválida ou expirada, modelo não encontrado, ou quota esgotada.
          Clique em <strong style={{ color: "var(--ink-2)" }}>API Key</strong> no topo para verificar sua chave.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 10,
              background: "var(--surface-2)", border: "1px solid var(--border)",
              color: "var(--ink-2)", fontFamily: "var(--display)", fontSize: 14,
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
          <button
            onClick={() => { onClose(); document.querySelector("[data-key-btn]")?.click(); }}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 10,
              background: "var(--orange)", border: "none",
              color: "#0a0907", fontFamily: "var(--display)", fontWeight: 600, fontSize: 14,
              cursor: "pointer",
            }}
          >
            Configurar API Key
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── WELCOME MODAL ───────────────────────── */

function WelcomeModal({ open, onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 320);
  };

  if (!open) return null;

  const overlayAnim = closing ? "welcomeOut .32s ease both" : "welcomeIn .38s cubic-bezier(.22,.68,0,1.2) both";
  const cardAnim    = closing ? "welcomeCardOut .32s cubic-bezier(.4,0,1,1) both" : "welcomeCardIn .42s cubic-bezier(.22,.68,0,1.2) both";

  return (
    <>
      <style>{`
        @keyframes welcomeIn       { from { opacity:0 } to { opacity:1 } }
        @keyframes welcomeOut      { from { opacity:1 } to { opacity:0 } }
        @keyframes welcomeCardIn   { from { opacity:0; transform: scale(.6)  } to { opacity:1; transform: scale(1)  } }
        @keyframes welcomeCardOut  { from { opacity:1; transform: scale(1)   } to { opacity:0; transform: scale(.6) } }
      `}</style>
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1500,
          background: "rgba(5,4,3,0.88)", backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          animation: overlayAnim,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 520,
            background: "#0a0907",
            border: "1px solid rgba(255,91,21,0.35)",
            borderRadius: 20,
            padding: "40px 36px 34px",
            boxShadow: "0 0 80px rgba(255,91,21,0.14), 0 24px 80px rgba(0,0,0,0.8)",
            animation: cardAnim,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {/* Glow de fundo */}
          <div style={{
            position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,91,21,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Badge versão */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "4px 16px", borderRadius: 999, marginBottom: 24,
            background: "rgba(255,91,21,0.10)", border: "1px solid rgba(255,91,21,0.30)",
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--orange)", letterSpacing: "0.14em",
          }}>
            <div className="pulse-dot" style={{ width: 6, height: 6, flexShrink: 0 }} />
            PATCH 1.1 BETA
          </div>

          {/* Título */}
          <div style={{
            fontSize: 28, fontWeight: 800, fontFamily: "var(--display)",
            color: "#f5efe4", lineHeight: 1.15, marginBottom: 6,
          }}>
            <span style={{ color: "var(--orange)" }}>Luna AI</span> 1.1 Beta
          </div>

          {/* Subtítulo */}
          <div style={{
            fontSize: 13, fontWeight: 500, color: "var(--muted)",
            fontFamily: "var(--mono)", marginBottom: 22, letterSpacing: "0.04em",
          }}>
            O que há de novo nesta versão
          </div>

          {/* Divisor */}
          <div style={{ height: 1, background: "rgba(255,91,21,0.15)", marginBottom: 20 }} />

          {/* Patch notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, textAlign: "left" }}>
            {[
              { icon: "🗺️", tag: "NOVO",      col: "#f97316", text: "Mapa de Operações redesenhado — triggers como categoria própria, nodes organizados, picker n8n-style e badge ⚡ nos gatilhos" },
              { icon: "📋", tag: "NOVO",      col: "#f97316", text: "Questionário com novas divisões: 7 seções, separadores visuais de grupo e ICP por produto" },
              { icon: "⚡", tag: "MELHORIA",  col: "#60a5fa", text: "Luna gerando mais rápido e com menor consumo de tokens — modo compacto automático quando não há snapshot ativo" },
              { icon: "🐛", tag: "FIX",       col: "#4ade80", text: "Correções na geração do playbook: campos ICP por produto, mapeamento de seções e estabilidade geral" },
            ].map(({ icon, tag, col, text }) => (
              <div key={tag + text.slice(0,10)} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>{icon}</span>
                <div>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                    color: col, background: col + "18", border: `1px solid ${col}44`,
                    borderRadius: 4, padding: "1px 6px", marginRight: 8,
                  }}>{tag}</span>
                  <span style={{ fontFamily: "var(--display)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Botão */}
          <button
            onClick={handleClose}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, cursor: "pointer",
              background: "linear-gradient(135deg, #ff5b15, #c4400a)",
              border: "none", color: "#fff",
              fontFamily: "var(--display)", fontSize: 15, fontWeight: 700,
              letterSpacing: "0.02em",
              boxShadow: "0 4px 24px rgba(255,91,21,0.40)",
              transition: "opacity .15s, transform .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            Entendido, vamos lá
          </button>
        </div>
      </div>
    </>
  );
}

/* ───────────────────────── MOUNT ───────────────────────── */

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
