const fs = require("fs");
const content =
  "window.__VX_KEY__=" + JSON.stringify(process.env.VITE_OPENAI_API_KEY || "") + ";\n" +
  "window.__SUPABASE_URL__=" + JSON.stringify(process.env.SUPABASE_URL || "") + ";\n" +
  "window.__SUPABASE_ANON_KEY__=" + JSON.stringify(process.env.SUPABASE_ANON_KEY || "") + ";\n";
fs.writeFileSync("env-config.js", content);
