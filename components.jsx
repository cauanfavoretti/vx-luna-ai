/* Reusable components and icons for VX */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ───────────────────────── ICONS ───────────────────────── */

const VXLogo = ({ size = 36 }) => {
  const [useImg, setUseImg] = React.useState(true);
  if (useImg) {
    return (
      <img
        src="logo.png"
        alt="VX"
        width={size}
        height={size}
        style={{ objectFit: "contain", display: "block" }}
        onError={() => setUseImg(false)}
      />
    );
  }
  /* SVG fallback fiel ao logo real — V laranja + chevron */
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* V shape — lado esquerdo */}
      <path
        d="M8 18 L30 78 L42 78 L50 58 L58 78 L70 78 L50 30 L44 48 L36 28 Z"
        fill="#e8720a"
      />
      {/* Chevron / seta → laranja */}
      <path
        d="M52 32 L68 50 L52 68 L60 68 L78 50 L60 32 Z"
        fill="#e8720a"
      />
      {/* X outline claro (lado direito) */}
      <path
        d="M72 30 L88 50 L72 70 L78 70 L92 50 L78 30 Z"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2.5"
      />
    </svg>
  );
};

const Icon = ({ name, size = 18, stroke = "currentColor" }) => {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "building": return <svg {...c}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6"/></svg>;
    case "target":   return <svg {...c}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={stroke}/></svg>;
    case "box":      return <svg {...c}><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>;
    case "flow":     return <svg {...c}><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6.5 7.5L11 16M17.5 7.5L13 16"/></svg>;
    case "shield":   return <svg {...c}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>;
    case "chart":    return <svg {...c}><path d="M3 21h18"/><rect x="6" y="11" width="3" height="8"/><rect x="11" y="6" width="3" height="13"/><rect x="16" y="14" width="3" height="5"/></svg>;
    case "gear":     return <svg {...c}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "voice":    return <svg {...c}><path d="M12 3v18M7 7v10M17 7v10M3 11v2M21 11v2"/></svg>;
    case "trophy":   return <svg {...c}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3"/></svg>;
    case "upload":   return <svg {...c}><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>;
    case "spark":    return <svg {...c}><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/></svg>;
    case "check":    return <svg {...c}><path d="M5 13l4 4L19 7"/></svg>;
    case "arrow":    return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "back":     return <svg {...c}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>;
    case "save":     return <svg {...c}><path d="M5 4h11l3 3v13H5V4z"/><path d="M9 4v6h6V4M8 14h8v6H8z"/></svg>;
    case "x":        return <svg {...c}><path d="M6 6l12 12M6 18L18 6"/></svg>;
    case "plus":     return <svg {...c}><path d="M12 5v14M5 12h14"/></svg>;
    case "file":     return <svg {...c}><path d="M14 3H6v18h12V7l-4-4z"/><path d="M14 3v4h4"/></svg>;
    case "menu":     return <svg {...c}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "palette":  return <svg {...c}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/><circle cx="6.5" cy="11.5" r="1.5" fill={stroke} stroke="none"/><circle cx="9.5" cy="7.5" r="1.5" fill={stroke} stroke="none"/><circle cx="14.5" cy="7.5" r="1.5" fill={stroke} stroke="none"/><circle cx="17.5" cy="11.5" r="1.5" fill={stroke} stroke="none"/></svg>;
    case "folder":   return <svg {...c}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>;
    case "link":     return <svg {...c}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case "code":     return <svg {...c}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>;
    default:         return null;
  }
};

window.VXLogo = VXLogo;
window.Icon = Icon;

/* ───────────────────────── FIELD COMPONENTS ───────────────────────── */

const fieldStyles = {
  wrap: { display: "flex", flexDirection: "column", gap: 10 },
  label: {
    fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "var(--muted)",
    display: "flex", alignItems: "center", gap: 8,
  },
  hint: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted-2)", letterSpacing: "0.05em" },
  input: {
    width: "100%", background: "transparent", color: "var(--ink)",
    border: "none", borderBottom: "1px solid var(--border-strong)",
    padding: "10px 0", fontSize: 17, fontFamily: "var(--display)", fontWeight: 400,
    transition: "border-color .15s",
  },
  textarea: {
    width: "100%", background: "var(--surface)", color: "var(--ink)",
    border: "1px solid var(--border)", borderRadius: 8,
    padding: "12px 14px", fontSize: 15, lineHeight: 1.55, fontFamily: "var(--display)",
    resize: "vertical", minHeight: 64, transition: "border-color .15s, background .15s",
  },
};

function FieldShell({ field, children, charCount }) {
  return (
    <div style={fieldStyles.wrap}>
      <div style={fieldStyles.label}>
        <span style={{ color: "var(--orange)", fontWeight: 600 }}>›</span>
        <span>{field.label}</span>
        {charCount != null && (
          <span style={{ marginLeft: "auto", color: "var(--muted-2)", fontSize: 10 }}>
            {charCount} chr
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function TextField({ field, value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <FieldShell field={field}>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={field.placeholder || ""}
        style={{
          ...fieldStyles.input,
          borderBottomColor: focus ? "var(--orange)" : "var(--border-strong)",
        }}
      />
    </FieldShell>
  );
}

function TextArea({ field, value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <FieldShell field={field} charCount={(value || "").length}>
      <textarea
        rows={field.rows || 3}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={field.placeholder || ""}
        style={{
          ...fieldStyles.textarea,
          fontFamily: field.mono ? "var(--mono)" : "var(--display)",
          fontSize: field.mono ? 13 : 15,
          background: focus ? "var(--surface-2)" : "var(--surface)",
          borderColor: focus ? "var(--orange)" : "var(--border)",
        }}
      />
    </FieldShell>
  );
}

function Segmented({ field, value, onChange }) {
  return (
    <FieldShell field={field}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {field.options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.05em",
                padding: "8px 14px", borderRadius: 999,
                background: active ? "var(--orange)" : "transparent",
                color: active ? "#0a0907" : "var(--ink-2)",
                border: `1px solid ${active ? "var(--orange)" : "var(--border-strong)"}`,
                cursor: "pointer", fontWeight: active ? 600 : 500,
                transition: "all .15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

function Scale({ field, value, onChange }) {
  const v = value == null ? 50 : value;
  return (
    <FieldShell field={field}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>{field.left}</span>
        <div style={{ flex: 1, position: "relative", height: 28, display: "flex", alignItems: "center" }}>
          <div style={{ height: 2, background: "var(--border-strong)", width: "100%", borderRadius: 2 }}>
            <div style={{ height: 2, background: "var(--orange)", width: `${v}%`, borderRadius: 2, transition: "width .15s" }} />
          </div>
          <input
            type="range" min={0} max={100} step={1}
            value={v}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            style={{
              position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer",
            }}
          />
          <div
            style={{
              position: "absolute", left: `calc(${v}% - 8px)`,
              width: 16, height: 16, borderRadius: 8, background: "var(--orange)",
              boxShadow: "0 0 0 4px rgba(255,91,21,0.18)",
              pointerEvents: "none",
            }}
          />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink)", whiteSpace: "nowrap" }}>{field.right}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--orange)", width: 36, textAlign: "right" }}>{v}%</span>
      </div>
    </FieldShell>
  );
}

function Chips({ field, value, onChange }) {
  const chips = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState("");
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);

  const add = (text) => {
    const t = text.trim();
    if (!t || chips.includes(t)) return;
    onChange([...chips, t]);
    setDraft("");
  };
  const remove = (t) => onChange(chips.filter((c) => c !== t));

  return (
    <FieldShell field={field}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex", flexWrap: "wrap", gap: 6,
          padding: "10px 12px", minHeight: 50,
          background: focus ? "var(--surface-2)" : "var(--surface)",
          border: `1px solid ${focus ? "var(--orange)" : "var(--border)"}`,
          borderRadius: 8, transition: "all .15s", cursor: "text",
        }}
      >
        {chips.map((c) => (
          <span
            key={c}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,91,21,0.08)", color: "var(--orange-2)",
              border: "1px solid rgba(255,91,21,0.25)",
              padding: "4px 6px 4px 10px", borderRadius: 999,
              fontFamily: "var(--mono)", fontSize: 12, fontWeight: 500,
            }}
          >
            {c}
            <button
              type="button" onClick={(e) => { e.stopPropagation(); remove(c); }}
              style={{
                width: 16, height: 16, padding: 0, border: "none",
                background: "transparent", color: "var(--orange-2)",
                cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
            ><Icon name="x" size={12} /></button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => { setFocus(false); add(draft); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(draft); }
            else if (e.key === "Backspace" && !draft && chips.length) remove(chips[chips.length - 1]);
          }}
          placeholder={chips.length ? "" : (field.placeholder || "Adicionar + Enter")}
          style={{
            flex: 1, minWidth: 120,
            background: "transparent", border: "none", color: "var(--ink)",
            fontFamily: "var(--display)", fontSize: 14, padding: "4px 0",
          }}
        />
      </div>
      {!chips.length && field.suggestions && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
          <span style={fieldStyles.hint}>Sugestões:</span>
          {field.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              style={{
                background: "transparent", border: "1px dashed var(--border-strong)",
                color: "var(--muted)", padding: "2px 8px", borderRadius: 999,
                fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer",
              }}
            >+ {s}</button>
          ))}
        </div>
      )}
    </FieldShell>
  );
}

const _IMG_EXTS  = /\.(png|jpg|jpeg|gif|webp|bmp|avif)$/i;
const _SVG_EXT   = /\.svg$/i;
const _MAX_IMG   = 1.5 * 1024 * 1024;

async function _readUploadFile(f) {
  const n = f.name.toLowerCase();
  if (_IMG_EXTS.test(n)) {
    if (f.size > _MAX_IMG) return { kind: "image_large", content: "", dataUrl: "" };
    return new Promise((res) => {
      const r = new FileReader();
      r.onload  = (e) => res({ kind: "image", content: "", dataUrl: e.target.result });
      r.onerror = () => res({ kind: "image_large", content: "", dataUrl: "" });
      r.readAsDataURL(f);
    });
  }
  if (_SVG_EXT.test(n)) {
    return new Promise((res) => {
      const r = new FileReader();
      r.onload  = (e) => res({ kind: "svg", content: e.target.result, dataUrl: "" });
      r.onerror = () => res({ kind: "text", content: "", dataUrl: "" });
      r.readAsText(f, "UTF-8");
    });
  }
  return new Promise((res) => {
    const r = new FileReader();
    r.onload  = (e) => res({ kind: "text", content: e.target.result || "", dataUrl: "" });
    r.onerror = () => res({ kind: "text", content: "", dataUrl: "" });
    r.readAsText(f, "UTF-8");
  });
}

function Upload({ field, value, onChange }) {
  const files = Array.isArray(value) ? value : [];
  const [drag, setDrag] = useState(false);
  const [reading, setReading] = useState(false);
  const inputRef = useRef(null);

  const ingest = async (fileList) => {
    setReading(true);
    const results = [];
    for (const f of Array.from(fileList)) {
      try {
        const r = await _readUploadFile(f);
        results.push({
          name: f.name,
          size: f.size,
          type: f.type || (f.name.split(".").pop() || "").toUpperCase(),
          kind:    r.kind,
          content: r.content,
          dataUrl: r.dataUrl,
        });
      } catch (_) {
        results.push({ name: f.name, size: f.size, type: f.type || "", kind: "text", content: "", dataUrl: "" });
      }
    }
    onChange([...files, ...results]);
    setReading(false);
  };

  const fmt = (b) => {
    if (b < 1024) return b + " B";
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
    return (b / 1024 / 1024).toFixed(1) + " MB";
  };

  return (
    <div style={fieldStyles.wrap}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); ingest(e.dataTransfer.files); }}
        onClick={() => !reading && inputRef.current?.click()}
        style={{
          padding: "32px 28px", borderRadius: 12, cursor: "pointer",
          border: `1.5px dashed ${drag ? "var(--orange)" : "var(--border-strong)"}`,
          background: drag ? "rgba(255,91,21,0.06)" : "var(--surface)",
          transition: "all .15s",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "rgba(255,91,21,0.10)", color: "var(--orange)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,91,21,0.25)",
        }}>
          <Icon name="upload" size={22} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{reading ? "Lendo arquivos…" : field.label}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 6, letterSpacing: "0.04em" }}>
            {field.accept}
          </div>
        </div>
        <input ref={inputRef} type="file" multiple style={{ display: "none" }}
          onChange={(e) => ingest(e.target.files)} />
      </div>

      {!!files.length && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", border: "1px solid var(--border)",
              borderRadius: 8, background: "var(--surface)",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6,
                background: "rgba(255,91,21,0.08)", color: "var(--orange)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><Icon name="file" size={16}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.04em" }}>
                  {fmt(f.size)} · {(f.type.split("/").pop() || f.type || "FILE").toUpperCase()}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(files.filter((_, j) => j !== i)); }}
                style={{
                  background: "transparent", border: "none", color: "var(--muted)",
                  cursor: "pointer", padding: 4, display: "inline-flex",
                }}
              ><Icon name="x" size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── VISUAL PRESET ───────────────────────── */

const PRESET_META = {
  "Dark Premium":  { fundo: "#0f172a", primaria: "#3b82f6", acento: "#8b5cf6", label: "Dark Premium",  hint: "Escuro · Azul · Roxo · SaaS" },
  "Light Clean":   { fundo: "#f8fafc", primaria: "#1e293b", acento: "#10b981", label: "Light Clean",   hint: "Claro · Azul escuro · Verde" },
  "Corporativo":   { fundo: "#ffffff", primaria: "#1a1a2e", acento: "#c9a84c", label: "Corporativo",   hint: "Branco · Azul marinho · Dourado" },
  "Minimalista":   { fundo: "#fafafa", primaria: "#111827", acento: "#f59e0b", label: "Minimalista",   hint: "Off-white · Grafite · Âmbar" },
  "Personalizado": { fundo: null,      primaria: null,      acento: null,      label: "Personalizado", hint: "Defina suas cores abaixo" },
};

function VisualPreset({ field, value, onChange }) {
  const presets = Object.entries(PRESET_META);
  return (
    <FieldShell field={field}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {presets.map(([key, meta]) => {
          const active = value === key;
          const isCustom = key === "Personalizado";
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              style={{
                display: "flex", flexDirection: "column", gap: 8,
                padding: "14px 12px", borderRadius: 12, cursor: "pointer",
                background: active ? "rgba(255,91,21,0.08)" : "var(--surface)",
                border: `1.5px solid ${active ? "var(--orange)" : "var(--border)"}`,
                transition: "all .18s", textAlign: "left",
                transform: active ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* Color swatch */}
              {isCustom ? (
                <div style={{
                  height: 32, borderRadius: 8, border: "1.5px dashed var(--border-strong)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "var(--muted)",
                }}>✦</div>
              ) : (
                <div style={{ display: "flex", gap: 3, height: 32 }}>
                  <div style={{ flex: 1, borderRadius: "6px 0 0 6px", background: meta.fundo, border: "1px solid rgba(255,255,255,0.1)" }} />
                  <div style={{ flex: 1, background: meta.primaria }} />
                  <div style={{ flex: 1, borderRadius: "0 6px 6px 0", background: meta.acento }} />
                </div>
              )}
              {/* Label */}
              <div>
                <div style={{
                  fontFamily: "var(--display)", fontWeight: active ? 700 : 500,
                  fontSize: 12, color: active ? "var(--ink)" : "var(--ink-2)",
                  marginBottom: 2,
                }}>{meta.label}</div>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)",
                  letterSpacing: "0.04em", lineHeight: 1.4,
                }}>{meta.hint}</div>
              </div>
              {active && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontFamily: "var(--mono)", fontSize: 9, color: "var(--orange)",
                  letterSpacing: "0.08em",
                }}>
                  <Icon name="check" size={10} stroke="var(--orange)" /> ATIVO
                </div>
              )}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* ───────────────────────── FLOW BUILDER (canvas) ───────────────────────── */

const FLOW_CANVAS_H = 500;
const FLOW_DRAG_THRESHOLD = 5;

const FLOW_NODES = {
  timer:        { label: "Temporizador",    shape: "circle", fill: "#0f2a5e", stroke: "#3b82f6", w: 90,  h: 90  },
  manual:       { label: "Ação Manual",     shape: "rect",   fill: "#0f2a5e", stroke: "#60a5fa", w: 148, h: 64  },
  auto:         { label: "Automação",       shape: "penta",  fill: "#2e0a6e", stroke: "#a855f7", w: 148, h: 90  },
  autoManual:   { label: "Auto c/ Gatilho", shape: "penta",  fill: "#0f2a5e", stroke: "#93c5fd", w: 148, h: 90  },
  ifelse:       { label: "If / Else",       shape: "penta",  fill: "#5e0f0f", stroke: "#ef4444", w: 148, h: 90  },
  clientAction: { label: "Ação do Cliente", shape: "rect",   fill: "#0f3320", stroke: "#4ade80", w: 148, h: 64  },
  scheduling:   { label: "Agendamento",     shape: "circle", fill: "#1c150a", stroke: "#fbbf24", w: 90,  h: 90  },
};

const nodeSize = (node) => ({
  w: node.w || FLOW_NODES[node.type]?.w || 148,
  h: node.h || FLOW_NODES[node.type]?.h || 64,
});

function flowPentaPts(w, h, pad) {
  const p = pad + 3;
  return [
    [w / 2, p],
    [w - p, h * 0.38],
    [w - p * 0.55, h - p],
    [p * 0.55, h - p],
    [p, h * 0.38],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function FlowShape({ type, w, h, sel }) {
  const d = FLOW_NODES[type];
  if (!d) return null;
  const sw = sel ? 2.5 : 1.5;
  const sc = sel ? "var(--orange)" : d.stroke;
  if (d.shape === "circle") {
    const r = Math.min(w, h) / 2 - sw - 1;
    return (
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <circle cx={w / 2} cy={h / 2} r={r} fill={d.fill} stroke={sc} strokeWidth={sw} />
      </svg>
    );
  }
  if (d.shape === "rect") {
    return (
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <rect x={sw} y={sw} width={w - sw * 2} height={h - sw * 2} rx={8} fill={d.fill} stroke={sc} strokeWidth={sw} />
      </svg>
    );
  }
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <polygon points={flowPentaPts(w, h, sw)} fill={d.fill} stroke={sc} strokeWidth={sw} />
    </svg>
  );
}

function FlowPaletteIcon({ type }) {
  const d = FLOW_NODES[type];
  const s = 13;
  if (!d) return null;
  if (d.shape === "circle")
    return <svg width={s} height={s} viewBox="0 0 13 13" style={{ flexShrink: 0 }}><circle cx="6.5" cy="6.5" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
  if (d.shape === "rect")
    return <svg width={s} height={s} viewBox="0 0 13 13" style={{ flexShrink: 0 }}><rect x="1" y="2.5" width="11" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
  return (
    <svg width={s} height={s} viewBox="0 0 13 13" style={{ flexShrink: 0 }}>
      <polygon points="6.5,1 12,4.5 10,12 3,12 1,4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FlowBuilder({ field, value, onChange }) {
  const norm = (v) =>
    v && typeof v === "object" && "nodes" in v
      ? { nodes: v.nodes || [], edges: v.edges || [], description: v.description || "" }
      : { nodes: [], edges: [], description: "" };
  const data = norm(value);

  /* ── React state (drive re-renders) ── */
  const [selected,    setSelected]    = useState(null);
  const [editingId,   setEditingId]   = useState(null);
  const [hovered,     setHovered]     = useState(null);
  const [pending,     setPending]     = useState(null);       // { fromId }
  const [pendingMouse,setPendingMouse]= useState(null);       // { x, y } canvas-relative
  const [isDragging,  setIsDragging]  = useState(false);

  /* ── Refs (used inside always-on effect) ── */
  const canvasRef    = useRef(null);
  const dataRef      = useRef(data);
  const cbRef        = useRef(onChange);
  const dragRef      = useRef(null);   // active drag info
  const dragStartRef = useRef(null);   // potential drag (below threshold)
  const pendingRef   = useRef(null);   // pending edge
  const hoveredRef   = useRef(null);   // hovered node id

  dataRef.current = data;
  cbRef.current   = onChange;

  const emit = (patch) => cbRef.current({ ...dataRef.current, ...patch });

  /* ── Node operations ── */
  const addNode = (type) => {
    const def = FLOW_NODES[type];
    const id  = "n" + Date.now().toString(36);
    const cw  = canvasRef.current ? canvasRef.current.clientWidth : 700;
    const x   = Math.max(20, Math.min(cw - def.w - 20, cw / 2 - def.w / 2 + (Math.random() - 0.5) * 180));
    const y   = 24 + Math.random() * (FLOW_CANVAS_H - def.h - 60);
    emit({ nodes: [...dataRef.current.nodes, { id, type, x, y, label: def.label }] });
  };

  const resizeNode = (id, factor) => {
    const node = dataRef.current.nodes.find((n) => n.id === id);
    if (!node) return;
    const ns   = nodeSize(node);
    const newW = Math.max(60, Math.min(320, Math.round(ns.w * factor)));
    const newH = Math.max(40, Math.min(220, Math.round(ns.h * factor)));
    emit({ nodes: dataRef.current.nodes.map((n) => n.id === id ? { ...n, w: newW, h: newH } : n) });
  };

  const deleteNode = (id) => {
    emit({
      nodes: dataRef.current.nodes.filter((n) => n.id !== id),
      edges: dataRef.current.edges.filter((e) => e.from !== id && e.to !== id),
    });
    if (selected  === id) setSelected(null);
    if (editingId === id) setEditingId(null);
  };

  const updateLabel = (id, label) =>
    emit({ nodes: dataRef.current.nodes.map((n) => n.id === id ? { ...n, label } : n) });

  const deleteEdge = (id) =>
    emit({ edges: dataRef.current.edges.filter((e) => e.id !== id) });

  /* ── Single always-on global effect ── */
  useEffect(() => {
    const onMove = (e) => {
      /* Potential drag → check threshold */
      if (dragStartRef.current && !dragRef.current) {
        const ds = dragStartRef.current;
        const dx = e.clientX - ds.cx0, dy = e.clientY - ds.cy0;
        if (Math.sqrt(dx * dx + dy * dy) > FLOW_DRAG_THRESHOLD) {
          dragRef.current = ds;
          dragStartRef.current = null;
          setIsDragging(true);
        }
      }
      /* Active drag → move node */
      if (dragRef.current) {
        const drag = dragRef.current;
        const d    = dataRef.current;
        const cw   = canvasRef.current ? canvasRef.current.clientWidth : 800;
        const nx   = Math.max(0, Math.min(cw - drag.nw, drag.x0 + e.clientX - drag.cx0));
        const ny   = Math.max(0, Math.min(FLOW_CANVAS_H - drag.nh, drag.y0 + e.clientY - drag.cy0));
        cbRef.current({ ...d, nodes: d.nodes.map((n) => n.id === drag.id ? { ...n, x: nx, y: ny } : n) });
      }
      /* Pending edge → track mouse on canvas */
      if (pendingRef.current) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) setPendingMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    const onUp = () => {
      /* Click (no drag) → enter edit mode */
      if (dragStartRef.current && !dragRef.current) {
        const id = dragStartRef.current.id;
        setEditingId(id);
        dragStartRef.current = null;
      }
      /* Finish pending edge */
      if (pendingRef.current) {
        const fromId   = pendingRef.current.fromId;
        const fromPort = pendingRef.current.fromPort || null;
        const targetId = hoveredRef.current;
        if (targetId && targetId !== fromId) {
          const d = dataRef.current;
          const exists = d.edges.some((ex) => ex.from === fromId && ex.to === targetId && ex.fromPort === fromPort);
          if (!exists) cbRef.current({ ...d, edges: [...d.edges, { id: "e" + Date.now().toString(36), from: fromId, to: targetId, fromPort }] });
        }
        pendingRef.current = null;
        setPending(null);
        setPendingMouse(null);
      }
      dragRef.current = null;
      dragStartRef.current = null;
      setIsDragging(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        pendingRef.current = null;
        setPending(null);
        setPendingMouse(null);
        setSelected(null);
        setEditingId(null);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("keydown",   onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("keydown",   onKey);
    };
  }, []); // empty deps — all mutable state via refs

  /* ── Output port mousedown → start pending edge ── */
  const onPortDown = (e, nodeId, port = null) => {
    e.stopPropagation();
    e.preventDefault();
    setSelected(null);
    setEditingId(null);
    pendingRef.current = { fromId: nodeId, fromPort: port };
    setPending({ fromId: nodeId, fromPort: port });
    const rect = canvasRef.current?.getBoundingClientRect();
    const node = data.nodes.find((n) => n.id === nodeId);
    if (rect && node) {
      const ns = nodeSize(node);
      const portYFrac = port === "sim" ? 0.3 : port === "nao" ? 0.7 : 0.5;
      setPendingMouse({ x: node.x + ns.w + 6 - (canvasRef.current.scrollLeft || 0), y: node.y + ns.h * portYFrac });
    }
  };

  /* ── Node body mousedown → select + potential drag ── */
  const onNodeDown = (e, node) => {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
    e.preventDefault();
    e.stopPropagation();

    /* Drop pending edge onto this node */
    if (pendingRef.current) {
      const fromId = pendingRef.current.fromId;
      if (fromId !== node.id) {
        const d = dataRef.current;
        const exists = d.edges.some((ex) => ex.from === fromId && ex.to === node.id);
        if (!exists) cbRef.current({ ...d, edges: [...d.edges, { id: "e" + Date.now().toString(36), from: fromId, to: node.id }] });
      }
      pendingRef.current = null;
      setPending(null);
      setPendingMouse(null);
      return;
    }

    /* Already editing this node → keep editing, just start potential drag */
    if (editingId === node.id) {
      const ns = nodeSize(node);
      dragStartRef.current = { id: node.id, type: node.type, x0: node.x, y0: node.y, cx0: e.clientX, cy0: e.clientY, nw: ns.w, nh: ns.h };
      return;
    }

    /* Select and set up potential drag (click will trigger edit, drag will move) */
    setSelected(node.id);
    setEditingId(null);
    const ns = nodeSize(node);
    dragStartRef.current = { id: node.id, type: node.type, x0: node.x, y0: node.y, cx0: e.clientX, cy0: e.clientY, nw: ns.w, nh: ns.h };
  };

  const onCanvasDown = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (["svg", "rect", "circle", "polygon", "path", "g", "defs", "pattern"].includes(tag)) {
      if (pendingRef.current) { pendingRef.current = null; setPending(null); setPendingMouse(null); return; }
      setSelected(null);
      setEditingId(null);
    }
  };

  /* ── SVG edges ── */
  const svgEdges = data.edges.map((edge) => {
    const fn = data.nodes.find((n) => n.id === edge.from);
    const tn = data.nodes.find((n) => n.id === edge.to);
    if (!fn || !tn) return null;
    const fns = nodeSize(fn), tns = nodeSize(tn);
    const portYFrac = edge.fromPort === "sim" ? 0.3 : edge.fromPort === "nao" ? 0.7 : 0.5;
    const x1 = fn.x + fns.w + 6, y1 = fn.y + fns.h * portYFrac;
    const x2 = tn.x - 6,         y2 = tn.y + tns.h / 2;
    const bend = Math.max(40, Math.abs(x2 - x1) * 0.44);
    const d = `M${x1},${y1} C${x1 + bend},${y1} ${x2 - bend},${y2} ${x2},${y2}`;
    const portLabel = edge.fromPort === "sim" ? "Sim" : edge.fromPort === "nao" ? "Não" : null;
    const portColor = edge.fromPort === "sim" ? "#4ade80" : "#ef4444";
    const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2 - 7;
    return (
      <g key={edge.id}>
        <path d={d} stroke="#4a4035" strokeWidth={2} fill="none" markerEnd="url(#flarrow)" />
        <path d={d} stroke="transparent" strokeWidth={18} fill="none" style={{ cursor: "pointer" }}
          onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }} />
        {portLabel && (
          <text x={midX} y={midY} textAnchor="middle" fill={portColor}
            fontFamily="monospace" fontSize={9} fontWeight="700"
            style={{ pointerEvents: "none" }}>{portLabel}</text>
        )}
      </g>
    );
  });

  /* ── Pending edge line ── */
  const pendingPath = (pending && pendingMouse) ? (() => {
    const fromNode = data.nodes.find((n) => n.id === pending.fromId);
    if (!fromNode) return null;
    const ns = nodeSize(fromNode);
    const portYFrac = pending.fromPort === "sim" ? 0.3 : pending.fromPort === "nao" ? 0.7 : 0.5;
    const x1 = fromNode.x + ns.w + 6, y1 = fromNode.y + ns.h * portYFrac;
    const x2 = pendingMouse.x, y2 = pendingMouse.y;
    const bend = Math.max(30, Math.abs(x2 - x1) * 0.42);
    const dp = `M${x1},${y1} C${x1 + bend},${y1} ${x2 - bend},${y2} ${x2},${y2}`;
    return <path d={dp} stroke="rgba(255,91,21,0.65)" strokeWidth={1.5} fill="none" strokeDasharray="6,3" />;
  })() : null;

  return (
    <FieldShell field={field}>

      {/* Palette */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
        {Object.entries(FLOW_NODES).map(([type, def]) => (
          <button key={type} type="button" onClick={() => addNode(type)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
              borderRadius: 999, cursor: "pointer", transition: "background .15s",
              background: def.fill + "99", color: def.stroke, border: `1px solid ${def.stroke}55`,
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = def.fill + "ee"}
            onMouseLeave={(e) => e.currentTarget.style.background = def.fill + "99"}
          >
            <FlowPaletteIcon type={type} />{def.label}
          </button>
        ))}
        {data.nodes.length > 0 && (
          <button type="button"
            onClick={() => { emit({ nodes: [], edges: [] }); setSelected(null); setEditingId(null); pendingRef.current = null; setPending(null); }}
            style={{
              marginLeft: "auto", padding: "5px 10px", borderRadius: 999, cursor: "pointer",
              background: "transparent", border: "1px solid var(--border-strong)",
              color: "var(--muted-2)", fontFamily: "var(--mono)", fontSize: 10, transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted-2)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
          >limpar tudo</button>
        )}
      </div>

      {pending && (
        <div style={{
          marginBottom: 8, padding: "5px 14px", borderRadius: 6,
          background: "rgba(255,91,21,0.08)", border: "1px solid rgba(255,91,21,0.3)",
          fontFamily: "var(--mono)", fontSize: 10, color: "var(--orange)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>⬤</span> Arraste até o bloco destino · ESC cancela
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        onMouseDown={onCanvasDown}
        style={{
          position: "relative", width: "100%", height: FLOW_CANVAS_H,
          background: "#080706",
          border: `1px solid ${pending ? "rgba(255,91,21,0.4)" : (selected ? "var(--border-strong)" : "var(--border)")}`,
          borderRadius: 10,
          cursor: pending ? "crosshair" : "default",
          transition: "border-color .2s",
        }}
      >
        {/* SVG overlay: grid + edges */}
        <svg width="100%" height="100%"
          style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "visible" }}
          onMouseDown={onCanvasDown}
        >
          <defs>
            <pattern id="flow-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1" fill="rgba(74,64,54,0.5)" />
            </pattern>
            <marker id="flarrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0,0 8,4 0,8" fill="#5a5040" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#flow-grid)" />
          {svgEdges}
          {pendingPath}
        </svg>

        {/* Nodes */}
        {data.nodes.map((node) => {
          const def      = FLOW_NODES[node.type];
          if (!def) return null;
          const ns       = nodeSize(node);
          const isSel    = selected  === node.id;
          const isEdit   = editingId === node.id;
          const isHov    = hovered   === node.id;
          const showPorts= isSel || isHov;
          const portY    = ns.h / 2 - 5;
          const isIfElse = node.type === "ifelse";

          return (
            <div
              key={node.id}
              onMouseDown={(e) => onNodeDown(e, node)}
              onMouseEnter={() => { hoveredRef.current = node.id; setHovered(node.id); }}
              onMouseLeave={() => { hoveredRef.current = null; setHovered(null); }}
              style={{
                position: "absolute", left: node.x, top: node.y,
                width: ns.w, height: ns.h, zIndex: isSel ? 10 : 2,
                cursor: isDragging && dragRef.current?.id === node.id ? "grabbing" : (pending ? "crosshair" : "grab"),
                userSelect: "none",
              }}
            >
              <FlowShape type={node.type} w={ns.w} h={ns.h} sel={isSel} />

              {/* Label — static or editable */}
              {isEdit ? (
                <textarea
                  autoFocus
                  value={node.label}
                  onChange={(e) => updateLabel(node.id, e.target.value)}
                  onMouseDown={(e) => { e.stopPropagation(); }}
                  onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); e.stopPropagation(); }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 4,
                    background: "rgba(0,0,0,0.55)", border: "none", outline: "none", resize: "none",
                    color: "#fff", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
                    textAlign: "center", padding: "8px 6px", lineHeight: 1.4,
                    letterSpacing: "0.04em", cursor: "text", borderRadius: "inherit",
                  }}
                />
              ) : (
                <div style={{
                  position: "absolute", inset: 0, zIndex: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 8, pointerEvents: "none",
                }}>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600,
                    color: "#ddd4c5",
                    textAlign: "center", lineHeight: 1.4, letterSpacing: "0.04em", wordBreak: "break-word",
                  }}>{node.label}</span>
                </div>
              )}

              {/* INPUT port — left center */}
              {showPorts && (
                <div style={{
                  position: "absolute", left: -6, top: portY, width: 12, height: 12,
                  borderRadius: "50%", zIndex: 5, pointerEvents: "none",
                  background: "#1a1410", border: "2px solid #5a5040",
                  boxShadow: "0 0 0 2px rgba(90,80,64,0.2)",
                }} />
              )}

              {/* OUTPUT ports */}
              {showPorts && isIfElse ? (
                <>
                  {/* Sim port (top) */}
                  <div
                    onMouseDown={(e) => onPortDown(e, node.id, "sim")}
                    style={{
                      position: "absolute", right: -6, top: Math.round(ns.h * 0.3) - 5,
                      width: 12, height: 12, borderRadius: "50%", zIndex: 5, cursor: "crosshair",
                      background: "#4ade80", border: "2px solid #0a0907",
                      boxShadow: "0 0 0 3px #4ade8044", transition: "transform .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.35)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    title="Sim — arrastar para conectar"
                  />
                  <div style={{
                    position: "absolute", right: 12, top: Math.round(ns.h * 0.3) - 7,
                    fontFamily: "var(--mono)", fontSize: 7, color: "#4ade80",
                    letterSpacing: "0.06em", pointerEvents: "none", zIndex: 5,
                  }}>Sim</div>
                  {/* Não port (bottom) */}
                  <div
                    onMouseDown={(e) => onPortDown(e, node.id, "nao")}
                    style={{
                      position: "absolute", right: -6, top: Math.round(ns.h * 0.7) - 5,
                      width: 12, height: 12, borderRadius: "50%", zIndex: 5, cursor: "crosshair",
                      background: "#ef4444", border: "2px solid #0a0907",
                      boxShadow: "0 0 0 3px #ef444444", transition: "transform .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.35)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    title="Não — arrastar para conectar"
                  />
                  <div style={{
                    position: "absolute", right: 12, top: Math.round(ns.h * 0.7) - 4,
                    fontFamily: "var(--mono)", fontSize: 7, color: "#ef4444",
                    letterSpacing: "0.06em", pointerEvents: "none", zIndex: 5,
                  }}>Não</div>
                </>
              ) : showPorts && (
                <div
                  onMouseDown={(e) => onPortDown(e, node.id)}
                  style={{
                    position: "absolute", right: -6, top: portY, width: 12, height: 12,
                    borderRadius: "50%", zIndex: 5, cursor: "crosshair",
                    background: pending?.fromId === node.id ? "var(--orange)" : def.stroke,
                    border: "2px solid #0a0907",
                    boxShadow: `0 0 0 3px ${def.stroke}44`,
                    transition: "transform .12s, box-shadow .12s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  title="Arraste para conectar"
                />
              )}

              {/* Toolbar above selected node */}
              {isSel && !isEdit && (
                <div
                  style={{
                    position: "absolute", bottom: "100%", left: "50%",
                    transform: "translateX(-50%)", marginBottom: 7,
                    display: "flex", gap: 4, zIndex: 20, whiteSpace: "nowrap",
                    background: "var(--surface)", border: "1px solid var(--border-strong)",
                    borderRadius: 8, padding: "4px 6px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.7)",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); resizeNode(node.id, 1 / 1.18); }}
                    style={{
                      padding: "3px 8px", borderRadius: 6, cursor: "pointer",
                      background: "transparent", border: "1px solid var(--border)",
                      color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 12,
                    }}
                    title="Diminuir"
                  >−</button>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); resizeNode(node.id, 1.18); }}
                    style={{
                      padding: "3px 8px", borderRadius: 6, cursor: "pointer",
                      background: "transparent", border: "1px solid var(--border)",
                      color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 12,
                    }}
                    title="Aumentar"
                  >+</button>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingId(node.id); }}
                    style={{
                      padding: "3px 9px", borderRadius: 6, cursor: "pointer",
                      background: "rgba(255,91,21,0.12)", border: "1px solid rgba(255,91,21,0.35)",
                      color: "var(--orange)", fontFamily: "var(--mono)", fontSize: 9,
                    }}
                  >✏ editar</button>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                    style={{
                      padding: "3px 8px", borderRadius: 6, cursor: "pointer",
                      background: "transparent", border: "1px solid var(--border)",
                      color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 9,
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >✕ remover</button>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {data.nodes.length === 0 && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity: 0.15 }}>
              <polygon points="22,2 42,14 35,40 9,40 2,14" fill="none" stroke="#ff5b15" strokeWidth="1.5"/>
              <circle cx="22" cy="22" r="10" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
            </svg>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted-2)", letterSpacing: "0.08em" }}>
              Clique nos tipos acima para adicionar blocos
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      {data.nodes.length > 0 && (
        <div style={{ marginTop: 5, fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted-2)", letterSpacing: "0.05em" }}>
          {data.nodes.length} bloco{data.nodes.length !== 1 ? "s" : ""} · {data.edges.length} conexão{data.edges.length !== 1 ? "ões" : ""} · clique = selecionar · clique 2× = editar texto · ⬤ porta direita = arrastar conexão · if/else tem porta Sim (verde) e Não (vermelho) · − / + = redimensionar · linha = clique para apagar
        </div>
      )}

      {/* Description textarea */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
          › Descrição detalhada do fluxo
        </div>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => emit({ description: e.target.value })}
          placeholder="Explique com mais detalhes: timing entre etapas, condições do If/Else, responsáveis, SLAs, exceções, integrações e qualquer contexto que ajude a IA a entender o processo..."
          style={{
            ...fieldStyles.textarea,
            fontFamily: "var(--display)", fontSize: 13, lineHeight: 1.6,
          }}
        />
      </div>

    </FieldShell>
  );
}

function Field({ field, value, onChange }) {
  switch (field.kind) {
    case "text":        return <TextField    field={field} value={value} onChange={onChange} />;
    case "textarea":    return <TextArea     field={field} value={value} onChange={onChange} />;
    case "segmented":   return <Segmented   field={field} value={value} onChange={onChange} />;
    case "scale":       return <Scale       field={field} value={value} onChange={onChange} />;
    case "chips":       return <Chips       field={field} value={value} onChange={onChange} />;
    case "upload":      return <Upload      field={field} value={value} onChange={onChange} />;
    case "visualpreset":return <VisualPreset field={field} value={value} onChange={onChange} />;
    case "flowbuilder": return <FlowBuilder  field={field} value={value} onChange={onChange} />;
    default:            return null;
  }
}

window.Field = Field;

/* ───────────────────────── Helpers ───────────────────────── */

function isFilled(field, value) {
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return true;
  if (field.kind === "flowbuilder" && typeof value === "object") {
    if ("nodes" in value) return (value.nodes || []).length > 0;
    return false;
  }
  return String(value).trim().length > 0;
}

function sectionProgress(section, data) {
  const ds = data[section.id] || {};
  const total = section.fields.length;
  const done = section.fields.filter((f) => isFilled(f, ds[f.id])).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

window.isFilled = isFilled;
window._readUploadFile = _readUploadFile;
window.sectionProgress = sectionProgress;
