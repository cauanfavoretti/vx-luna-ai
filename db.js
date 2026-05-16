(function () {
  function client() {
    return window.__supabase__ || null;
  }

  function toApp(row) {
    return {
      id:         row.id,
      name:       row.name,
      empresa:    row.empresa || "",
      html:       row.html,
      size:       row.size,
      sections:   row.sections || [],
      createdAt:  row.created_at,
      importedAt: row.imported_at || null,
    };
  }

  const VX_DB = {
    async loadSnapshots() {
      const db = client();
      if (!db) return [];
      const { data, error } = await db
        .from("playbook_snapshots")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) { console.error("[VX DB] loadSnapshots:", error.message); return []; }
      return (data || []).map(toApp);
    },

    async saveSnapshot(snap) {
      const db = client();
      if (!db) throw new Error("Supabase não inicializado. Verifique env-config.js.");
      const { error } = await db.from("playbook_snapshots").insert({
        id:          snap.id,
        name:        snap.name,
        empresa:     snap.empresa || "",
        html:        snap.html,
        size:        snap.size,
        sections:    snap.sections || [],
        created_at:  snap.createdAt,
        imported_at: snap.importedAt || null,
      });
      if (error) throw new Error(error.message);
      return snap;
    },

    async deleteSnapshot(id) {
      const db = client();
      if (!db) return;
      const { error } = await db
        .from("playbook_snapshots")
        .delete()
        .eq("id", id);
      if (error) console.error("[VX DB] deleteSnapshot:", error.message);
    },

    async renameSnapshot(id, name) {
      const db = client();
      if (!db) return;
      const { error } = await db
        .from("playbook_snapshots")
        .update({ name })
        .eq("id", id);
      if (error) console.error("[VX DB] renameSnapshot:", error.message);
    },

    async savePlaybook(pb) {
      const db = client();
      if (!db) return;
      const { error } = await db.from("playbooks").insert({
        id:         pb.id,
        title:      pb.title,
        empresa:    pb.empresa || "",
        html:       pb.html,
        word_count: pb.wordCount || 0,
        sections:   pb.sections || [],
        created_at: pb.generatedAt,
      });
      if (error) console.error("[VX DB] savePlaybook:", error.message);
    },

    async loadPlaybooks() {
      const db = client();
      if (!db) return [];
      const { data, error } = await db
        .from("playbooks")
        .select("id, title, empresa, word_count, sections, created_at")
        .order("created_at", { ascending: false });
      if (error) { console.error("[VX DB] loadPlaybooks:", error.message); return []; }
      return (data || []).map((row) => ({
        id:          row.id,
        title:       row.title,
        empresa:     row.empresa || "",
        wordCount:   row.word_count || 0,
        sections:    row.sections || [],
        generatedAt: row.created_at,
        version:     "1.0.0",
        html:        null,
        assets:      { scripts: 0, cadencias: 0, cargos: 0, objecaoMatrix: 0 },
      }));
    },

    async loadPlaybookHtml(id) {
      const db = client();
      if (!db) return null;
      const { data, error } = await db
        .from("playbooks")
        .select("html")
        .eq("id", id)
        .single();
      if (error) { console.error("[VX DB] loadPlaybookHtml:", error.message); return null; }
      return data?.html || null;
    },

    async deletePlaybook(id) {
      const db = client();
      if (!db) return;
      const { error } = await db
        .from("playbooks")
        .delete()
        .eq("id", id);
      if (error) console.error("[VX DB] deletePlaybook:", error.message);
    },

    async updatePlaybookHtml(id, html) {
      const db = client();
      if (!db) return;
      const { error } = await db
        .from("playbooks")
        .update({ html })
        .eq("id", id);
      if (error) console.error("[VX DB] updatePlaybookHtml:", error.message);
    },

    async updateSnapshotHtml(id, html, size) {
      const db = client();
      if (!db) return;
      const { error } = await db
        .from("playbook_snapshots")
        .update({ html, size: size || html.length })
        .eq("id", id);
      if (error) console.error("[VX DB] updateSnapshotHtml:", error.message);
    },
  };

  window.VX_DB = VX_DB;
})();
