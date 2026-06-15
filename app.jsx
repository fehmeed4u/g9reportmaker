/* global React, ReactDOM */
const { useState, useEffect, useMemo, useRef, useCallback } = React;

const CATEGORIES = window.CATEGORIES;
const LEVELS = window.LEVELS;
const COMMENT_BANK = window.COMMENT_BANK;
const TARGET_TYPES = window.TARGET_TYPES;

const STORAGE_KEY = "g9_chemistry_reports_v1";
const MAX_CHARS = 550;
const BANNED = [
  "moreover", "furthermore", "showcases", "demonstrates a strong capacity",
  "remarkable journey", "in conclusion", "navigated", "delve", "tapestry", "underscores"
];

/* ───────── helpers ───────── */

function pronounSet(p) {
  if (p === "He/Him") return { subj: "he", obj: "him", poss: "his", reflex: "himself" };
  if (p === "She/Her") return { subj: "she", obj: "her", poss: "her", reflex: "herself" };
  return { subj: "they", obj: "them", poss: "their", reflex: "themselves" };
}

function firstName(full) {
  return (full || "").trim().split(/\s+/)[0] || "";
}

function pickN(arr, n) {
  const copy = arr.slice();
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function stripDashes(s) {
  return s.replace(/\s*[—–]\s*/g, ", ").replace(/--/g, ", ");
}

function truncateAtSentence(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("!"), cut.lastIndexOf("?"));
  if (lastStop > max * 0.6) return cut.slice(0, lastStop + 1);
  return cut.trim().replace(/[,;:]?\s*\S*$/, "") + ".";
}

function postProcess(text) {
  let out = (text || "").trim();
  out = stripDashes(out);
  out = out.replace(/\s+/g, " ");
  out = out.replace(/\s+([,.!?;:])/g, "$1");
  out = out.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  out = truncateAtSentence(out, MAX_CHARS);
  return out;
}

function todayStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function csvEscape(v) {
  const s = (v == null ? "" : String(v));
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/* ───────── icons ───────── */

const Icon = {
  Sparkle: () => <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.4 4.1L13.5 7 9.4 8.4 8 12.5 6.6 8.4 2.5 7l4.1-1.4L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M12.5 11.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>,
  Download: () => <svg viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0L5 7m3 3l3-3M3 12.5v1A1.5 1.5 0 004.5 15h7a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Save: () => <svg viewBox="0 0 16 16" fill="none"><path d="M3 2.5h8L13.5 5v8a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5 2.5v3h5v-3M5 13.5V9h6v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Edit: () => <svg viewBox="0 0 16 16" fill="none"><path d="M11 2.5l2.5 2.5L6 12.5l-3 .5.5-3L11 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Trash: () => <svg viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6 4.5V3a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1.5M4.5 4.5l.5 8a1 1 0 001 1h4a1 1 0 001-1l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/></svg>,
  Plus: () => <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Flask: () => <svg viewBox="0 0 16 16" fill="none"><path d="M6 1.5h4M6.5 1.5v4l-3 6.5a1.5 1.5 0 001.4 2h6.2a1.5 1.5 0 001.4-2l-3-6.5v-4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/><path d="M4.2 9.5h7.6" stroke="currentColor" strokeWidth="1.3"/></svg>,
  X: () => <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
};

/* ───────── AI prompt builder ───────── */

function buildAIPrompt({ name, pronoun, picks, targetTypes }) {
  const fn = firstName(name);
  const pr = pronounSet(pronoun);

  // picks: { categoryKey: { level, fragments: [2 strings] } }
  const fragmentLines = CATEGORIES.map(c => {
    const p = picks[c.key];
    if (!p) return "";
    return `- ${c.label} (${LEVELS.find(l => l.key === p.level).label}): "${p.fragments[0]}"; "${p.fragments[1]}"`;
  }).join("\n");

  const targetLines = targetTypes.map((t, i) => {
    const tt = TARGET_TYPES.find(x => x.key === t);
    return `  ${i + 1}. ${tt.label} — ${tt.blurb}`;
  }).join("\n");

  return `You are a Year 9 IGCSE Chemistry teacher writing an end-of-year report. Write in British English, observational teacher voice. No AI sparkle.

STUDENT: ${fn} (pronouns: ${pr.subj}/${pr.obj}/${pr.poss})

OBSERVATION MATERIAL (weave these in without labelling categories):
${fragmentLines}

Write ONE natural paragraph, MAXIMUM 550 characters including spaces. Hard cap.

RULES:
- Use "${fn}" once near the start, then switch to "${pr.subj}/${pr.obj}/${pr.poss}".
- Weave in all five observation areas naturally, do not list them.
- End with a forward-looking sentence that references the IGCSE Chemistry examination explicitly.
- British spellings (practise, behaviour, organise, analyse).
- NO em-dashes or en-dashes. Use commas.
- NO exclamation marks.
- BANNED words: ${BANNED.join(", ")}.
- Do not use the words "moreover", "furthermore", "showcases", "delve", "tapestry".

Then, on new lines, draft each of the following TARGETS as ONE sentence beginning with a verb (Revise / Practise / Use / Aim to / Build / Develop), max 140 characters each:
${targetLines}

OUTPUT FORMAT (exact):
COMMENT:
<the paragraph>

TARGET_1:
<one sentence>

TARGET_2:
<one sentence>
${targetTypes[2] ? "\nTARGET_3:\n<one sentence>" : ""}
`;
}

function parseAIOutput(text, expectTargets) {
  const out = { comment: "", targets: [] };
  if (!text) return out;
  const t = text.replace(/\r\n/g, "\n");
  const cMatch = t.match(/COMMENT:\s*([\s\S]*?)(?=\n\s*TARGET_\d:|\n*$)/);
  out.comment = cMatch ? cMatch[1].trim() : t.trim();
  for (let i = 1; i <= expectTargets; i++) {
    const re = new RegExp(`TARGET_${i}:\\s*([\\s\\S]*?)(?=\\n\\s*TARGET_\\d:|\\n*$)`);
    const m = t.match(re);
    out.targets.push(m ? m[1].trim().split("\n")[0].trim() : "");
  }
  return out;
}

/* ───────── Components ───────── */

function Topbar({ savedCount, onExport, onClearAll }) {
  return (
    <div className="topbar">
      <div className="logo">G</div>
      <div className="brand">
        <span className="name">G9 Chemistry End of Year Report Maker</span>
        <span className="sub">IGCSE Edition · Comments &amp; targets</span>
      </div>
      <div className="topbar-spacer" />
      <div className="saved-pill">
        <span className="dot" />
        <span><b>{savedCount}</b> saved {savedCount === 1 ? "report" : "reports"}</span>
      </div>
      <button className="btn" onClick={onExport} disabled={savedCount === 0} title="Export CSV">
        <Icon.Download /> Export CSV
      </button>
      <button className="btn ghost danger" onClick={onClearAll} disabled={savedCount === 0}>
        Clear all
      </button>
    </div>
  );
}

function LevelMatrix({ levels, onSet }) {
  return (
    <div className="matrix">
      {CATEGORIES.map(cat => (
        <div className="matrix-row" key={cat.key}>
          <div className="cat-cell">
            <span className="cat-name">{cat.label}</span>
            <span className="cat-blurb">{cat.blurb.length > 64 ? cat.blurb.slice(0, 64) + "…" : cat.blurb}</span>
          </div>
          <div className="level-row">
            {LEVELS.map(lvl => {
              const on = levels[cat.key] === lvl.key;
              const style = on ? {
                "--lvl-tint": lvl.tint,
                "--lvl-soft": lvl.soft,
                "--lvl-ink": lvl.ink,
              } : {};
              return (
                <button
                  key={lvl.key}
                  className="lvl"
                  data-on={on}
                  data-tip={lvl.label}
                  style={style}
                  onClick={() => onSet(cat.key, lvl.key)}
                >
                  {lvl.short}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TargetsStack({ targets, onChange }) {
  // targets is array of 3 strings (type keys or "")
  return (
    <div className="targets-stack">
      {[0, 1, 2].map(i => (
        <div className="target-slot" key={i}>
          <div className={"num" + (i === 2 ? " optional" : "")}>{i + 1}</div>
          <select
            className="select"
            value={targets[i] || ""}
            onChange={e => onChange(i, e.target.value)}
          >
            <option value="">{i === 2 ? "— Optional third target —" : "Choose target area…"}</option>
            {TARGET_TYPES.map(t => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function CommentOutput({ value, onChange }) {
  const len = value.length;
  const over = len > MAX_CHARS;
  return (
    <div className="comment-wrap">
      <label className="field-label">Report comment</label>
      <textarea
        className="textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={6}
        placeholder="Comment will appear here…"
      />
      <span className={"char-counter" + (over ? " over" : "")}>
        {len} / {MAX_CHARS}
      </span>
    </div>
  );
}

function TargetOutputRow({ idx, type, text, onTextChange }) {
  const tt = TARGET_TYPES.find(t => t.key === type);
  return (
    <div className="target-out">
      <div className="target-out-head">
        <span>Target {idx + 1}</span>
        {tt && <span className="target-tag">{tt.short}</span>}
      </div>
      <textarea
        className="textarea"
        value={text}
        onChange={e => onTextChange(e.target.value)}
        rows={2}
        placeholder={tt ? `Target wording for ${tt.short}…` : "Choose a target type above."}
      />
    </div>
  );
}

function Roster({ rows, onEdit, onDelete, onExport }) {
  if (!rows.length) {
    return (
      <div className="card roster-card">
        <div className="card-hd">
          <h2>Saved reports</h2>
          <span className="hint">Roster</span>
        </div>
        <div className="roster-empty">
          <div className="ic"><Icon.Flask /></div>
          No saved reports yet. Build a comment above and hit <b>Save</b> to add a student to the roster.
        </div>
      </div>
    );
  }
  return (
    <div className="card roster-card">
      <div className="card-hd">
        <h2>Saved reports</h2>
        <span className="hint">{rows.length} {rows.length === 1 ? "student" : "students"}</span>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn sm" onClick={onExport}><Icon.Download /> Export CSV</button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="roster-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Report comment</th>
              <th>Target 1</th>
              <th>Target 2</th>
              <th>Target 3</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td className="name-cell">
                  <div className="nm">{r.name}</div>
                  <div className="pn">{r.pronoun}</div>
                </td>
                <td className="cmt-cell">{r.comment}</td>
                {[0, 1, 2].map(i => {
                  const t = r.targets[i];
                  if (!t || !t.text) return <td className="tgt-cell muted" key={i}>—</td>;
                  const tt = TARGET_TYPES.find(x => x.key === t.type);
                  return (
                    <td className="tgt-cell" key={i}>
                      {tt && <div className="tgt-tag-mini">{tt.short}</div>}
                      {t.text}
                    </td>
                  );
                })}
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" title="Edit" onClick={() => onEdit(r.id)}><Icon.Edit /></button>
                    <button className="icon-btn danger" title="Delete" onClick={() => onDelete(r.id)}><Icon.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── App ───────── */

function App() {
  const [name, setName] = useState("");
  const [pronoun, setPronoun] = useState("They/Them");
  const [levels, setLevels] = useState({
    starter: "above", mindset: "above", tests: "average",
    ao3: "average", readiness: "above"
  });
  const [targetTypes, setTargetTypes] = useState(["recall", "ao3target", ""]);
  const [comment, setComment] = useState("");
  const [targetTexts, setTargetTexts] = useState(["", "", ""]);
  const [generating, setGenerating] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load roster
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRows(JSON.parse(raw));
    } catch (e) {}
  }, []);

  // Save roster
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); } catch (e) {}
  }, [rows]);

  const setLevel = (catKey, lvlKey) => {
    setLevels(prev => ({ ...prev, [catKey]: lvlKey }));
  };
  const setTargetType = (i, val) => {
    setTargetTypes(prev => prev.map((v, idx) => idx === i ? val : v));
  };
  const setTargetText = (i, val) => {
    setTargetTexts(prev => prev.map((v, idx) => idx === i ? val : v));
  };

  const activeTargetTypes = targetTypes.filter(Boolean);
  const canGenerate = name.trim() && activeTargetTypes.length >= 2 && !generating;

  const generate = useCallback(async () => {
    if (!canGenerate) return;
    setGenerating(true);
    setStatus("Drafting with AI…");

    // Build picks: 2 random fragments per category at the chosen level
    const picks = {};
    for (const cat of CATEGORIES) {
      const lvl = levels[cat.key];
      const pool = COMMENT_BANK[cat.key][lvl];
      picks[cat.key] = { level: lvl, fragments: pickN(pool, 2) };
    }

    const prompt = buildAIPrompt({
      name, pronoun, picks,
      targetTypes: activeTargetTypes
    });

    try {
      const raw = await window.claude.complete(prompt);
      const parsed = parseAIOutput(raw, activeTargetTypes.length);

      let cleaned = postProcess(parsed.comment);
      // Strip banned tells (case-insensitive whole-word for the simpler ones)
      for (const word of BANNED) {
        const re = new RegExp("\\b" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "ig");
        cleaned = cleaned.replace(re, "");
      }
      cleaned = cleaned.replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
      cleaned = truncateAtSentence(cleaned, MAX_CHARS);

      setComment(cleaned);

      // Build targets array, slotting into right indices
      const newTexts = ["", "", ""];
      let pi = 0;
      for (let i = 0; i < 3; i++) {
        if (targetTypes[i]) {
          let raw = (parsed.targets[pi] || "").trim();
          raw = stripDashes(raw).replace(/\s+/g, " ");
          if (raw.length > 140) raw = truncateAtSentence(raw, 140);
          newTexts[i] = raw;
          pi++;
        }
      }
      setTargetTexts(newTexts);
      setHasOutput(true);
      setStatus("Draft ready. Edit anything before saving.");
    } catch (err) {
      console.error(err);
      setStatus("Couldn't reach the AI. Try again in a moment.");
    } finally {
      setGenerating(false);
    }
  }, [canGenerate, levels, name, pronoun, targetTypes, activeTargetTypes]);

  const clearForm = () => {
    setName(""); setPronoun("They/Them");
    setLevels({ starter: "above", mindset: "above", tests: "average", ao3: "average", readiness: "above" });
    setTargetTypes(["recall", "ao3target", ""]);
    setComment(""); setTargetTexts(["", "", ""]);
    setHasOutput(false); setEditingId(null); setStatus("");
  };

  const save = () => {
    if (!name.trim() || !comment.trim()) {
      setStatus("Need a name and a comment before saving.");
      return;
    }
    const rec = {
      id: editingId || ("r_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
      name: name.trim(),
      pronoun,
      comment: comment.trim(),
      targets: [0, 1, 2].map(i => ({
        type: targetTypes[i] || "",
        text: targetTexts[i]?.trim() || ""
      })),
      savedAt: new Date().toISOString()
    };
    setRows(prev => {
      if (editingId) {
        return prev.map(r => r.id === editingId ? rec : r);
      }
      return [rec, ...prev];
    });
    setStatus(editingId ? "Updated." : "Saved.");
    clearForm();
  };

  const editRow = (id) => {
    const r = rows.find(x => x.id === id);
    if (!r) return;
    setName(r.name);
    setPronoun(r.pronoun);
    setComment(r.comment);
    setTargetTypes([0, 1, 2].map(i => r.targets[i]?.type || ""));
    setTargetTexts([0, 1, 2].map(i => r.targets[i]?.text || ""));
    setEditingId(r.id);
    setHasOutput(true);
    setStatus("Editing — changes will replace the existing row on save.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteRow = (id) => {
    if (!confirm("Delete this student's report?")) return;
    setRows(prev => prev.filter(r => r.id !== id));
    if (editingId === id) clearForm();
  };

  const clearAll = () => {
    if (!confirm("Clear all saved reports? This cannot be undone.")) return;
    setRows([]); clearForm();
  };

  const exportCSV = () => {
    if (!rows.length) return;
    const head = ["Name", "Pronoun", "Comment",
      "Target 1 Type", "Target 1",
      "Target 2 Type", "Target 2",
      "Target 3 Type", "Target 3",
      "Saved At"];
    const lines = [head.join(",")];
    for (const r of rows) {
      const tt = i => {
        const t = r.targets[i];
        if (!t || !t.type) return ["", ""];
        const def = TARGET_TYPES.find(x => x.key === t.type);
        return [def ? def.label : t.type, t.text || ""];
      };
      const [t1k, t1v] = tt(0), [t2k, t2v] = tt(1), [t3k, t3v] = tt(2);
      lines.push([
        r.name, r.pronoun, r.comment,
        t1k, t1v, t2k, t2v, t3k, t3v,
        r.savedAt
      ].map(csvEscape).join(","));
    }
    const csv = "\uFEFF" + lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `g9-chemistry-reports-${todayStamp()}.csv`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  };

  return (
    <React.Fragment>
      <Topbar
        savedCount={rows.length}
        onExport={exportCSV}
        onClearAll={clearAll}
      />

      <div className="page">
        {/* ── Form card ─────────────────────────────── */}
        <div className="card">
          <div className="card-hd">
            <h2>New report</h2>
            <span className="hint">Pick levels · choose targets · generate</span>
          </div>
          <div className="card-bd">
            {editingId && (
              <div className="editing-banner">
                <span className="dot" /> Editing existing row — Save to replace, or
                <button className="btn sm ghost" style={{ marginLeft: 4 }} onClick={clearForm}>cancel</button>
              </div>
            )}

            {/* Row 1: name + pronoun */}
            <div className="row1">
              <div>
                <label className="field-label">Student name</label>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Amelia Hartley"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="field-label">Pronoun</label>
                <div className="chips">
                  {["He/Him", "She/Her", "They/Them"].map(p => (
                    <button
                      key={p}
                      className="chip"
                      data-on={pronoun === p}
                      onClick={() => setPronoun(p)}
                    >{p}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: matrix + targets */}
            <div className="row2">
              <div>
                <label className="field-label">Performance levels</label>
                <LevelMatrix levels={levels} onSet={setLevel} />
              </div>
              <div className="col-divider">
                <label className="field-label">Targets <span className="muted">(min 2, third optional)</span></label>
                <TargetsStack targets={targetTypes} onChange={setTargetType} />

                <div className="generate-row">
                  <button
                    className="btn primary"
                    disabled={!canGenerate}
                    onClick={generate}
                  >
                    {generating ? <span className="spin" /> : <Icon.Sparkle />}
                    {generating ? "Drafting…" : "Generate with AI"}
                  </button>
                  <span className="status-line">
                    {status || (name.trim() ? `Ready for ${firstName(name)}.` : "Enter a name to begin.")}
                  </span>
                </div>
              </div>
            </div>

            {/* Output ─────────────────────────────── */}
            {hasOutput && (
              <React.Fragment>
                <div className="divider-h" />
                <div className="output-grid">
                  <div>
                    <CommentOutput value={comment} onChange={setComment} />
                  </div>
                  <div>
                    <label className="field-label">Editable targets</label>
                    {[0, 1, 2].map(i =>
                      targetTypes[i] ? (
                        <TargetOutputRow
                          key={i}
                          idx={i}
                          type={targetTypes[i]}
                          text={targetTexts[i]}
                          onTextChange={(v) => setTargetText(i, v)}
                        />
                      ) : null
                    )}
                  </div>
                </div>

                <div className="save-row">
                  <button className="btn ghost" onClick={clearForm}>Discard</button>
                  <button className="btn primary" onClick={save}>
                    <Icon.Save /> {editingId ? "Update report" : "Save to roster"}
                  </button>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>

        {/* ── Roster ─────────────────────────────── */}
        <Roster
          rows={rows}
          onEdit={editRow}
          onDelete={deleteRow}
          onExport={exportCSV}
        />
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
