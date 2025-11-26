import React, { useEffect, useMemo, useState } from "react";
import MiniFooter from "./components/MiniFooter";
import { topicsData } from "./list/topicsData.js";

function parseContent(raw) {
  const segments = [];
  const codeRegex = /```(sql|bash)?\n([\s\S]*?)```/g;
  let last = 0;
  let m;
  while ((m = codeRegex.exec(raw)) !== null) {
    if (m.index > last) {
      const txt = raw.slice(last, m.index).trim();
      if (txt) segments.push({ type: "text", content: txt });
    }
    segments.push({ type: "code", lang: m[1] || "sql", content: m[2].trim() });
    last = codeRegex.lastIndex;
  }
  if (last < raw.length) {
    const txt = raw.slice(last).trim();
    if (txt) segments.push({ type: "text", content: txt });
  }
  return segments;
}

export default function QueryDocs() {
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeId, setActiveId] = useState(() =>
    typeof window !== "undefined" && window.location.hash
      ? window.location.hash.replace("#", "")
      : topicsData[0].id
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${activeId}`);
    }
  }, [activeId]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [isDark]);

  const activeTopic = useMemo(
    () => topicsData.find((t) => t.id === activeId) || topicsData[0],
    [activeId]
  );

  const segments = useMemo(() => parseContent(activeTopic.content || ""), [activeTopic]);

  const [copiedKey, setCopiedKey] = useState(null);

  async function copyText(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
    } catch (err) {
      console.error("copy failed", err);
    }
  }

  // Theme-aware Tailwind helpers
  const bg = isDark ? "bg-[#07051a]" : "bg-white";
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const panelBg = isDark ? "bg-transparent" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const muted = isDark ? "text-slate-300" : "text-slate-600";
  const sidebarActive = isDark ? "bg-slate-800 text-white" : "bg-green-100 text-slate-900";
  const preBg = isDark ? "bg-slate-900/40 text-slate-200" : "bg-slate-50 text-slate-900";
  const codeBorder = isDark ? "border-slate-700" : "border-slate-200";
  const copyBtnBg = isDark ? "bg-slate-800/80 hover:bg-slate-700/90 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900";

  // Scrollbar CSS (keeps original)
  const scrollbarCss = isDark
    ? `
      .sidebar-scroll::-webkit-scrollbar,
      .content-scroll::-webkit-scrollbar { width: 10px; }
      .sidebar-scroll::-webkit-scrollbar-track,
      .content-scroll::-webkit-scrollbar-track { background: transparent; }
      .sidebar-scroll::-webkit-scrollbar-thumb,
      .content-scroll::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.08);
        border-radius: 999px; border: 2px solid transparent; background-clip: padding-box;
      }
      .sidebar-scroll, .content-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
    `
    : `
      .sidebar-scroll::-webkit-scrollbar,
      .content-scroll::-webkit-scrollbar { width: 10px; }
      .sidebar-scroll::-webkit-scrollbar-track,
      .content-scroll::-webkit-scrollbar-track { background: transparent; }
      .sidebar-scroll::-webkit-scrollbar-thumb,
      .content-scroll::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.18);
        border-radius: 999px; border: 2px solid transparent; background-clip: padding-box;
      }
      .sidebar-scroll, .content-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.18) transparent; }
    `;

  // confetti CSS (shared)
  const confettiCss = `
    .confetti-dot { position: absolute; width: 6px; height: 6px; border-radius: 50%; opacity: 0; transform: translateY(0) scale(0.6); }
    .confetti-anim .confetti-dot { animation: confetti 700ms ease-out forwards; }
    .confetti-anim .confetti-dot:nth-child(1){ background:#34d399; left: -6px; top: -6px; animation-delay: 40ms; }
    .confetti-anim .confetti-dot:nth-child(2){ background:#60a5fa; left: 10px; top: -8px; animation-delay: 80ms; }
    .confetti-anim .confetti-dot:nth-child(3){ background:#f97316; left: 22px; top: -6px; animation-delay: 120ms; }
    .confetti-anim .confetti-dot:nth-child(4){ background:#f472b6; left: 6px; top: -14px; animation-delay: 160ms; }
    @keyframes confetti { 0% { opacity: 0; transform: translateY(0) scale(0.6); } 50% { opacity: 1; transform: translateY(-10px) scale(1); } 100% { opacity: 0; transform: translateY(-18px) scale(0.8); } }
  `;

  // handle topic change from mobile select
  function handleMobileSelect(e) {
    setActiveId(e.target.value);
    setSidebarOpen(false);
  }

  return (
    <div className={`${bg} ${text} min-h-screen px-4 sm:px-8 py-6`}>
      <style>{scrollbarCss + confettiCss}</style>

      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className={`rounded-lg border ${border} px-3 py-2 inline-block ${panelBg} text-sm font-semibold`}>QueryDocs</div>

        <div className="flex items-center gap-3">
          {/* Mobile: menu toggle */}
          <button
            className="md:hidden p-2 rounded-md border border-transparent hover:bg-slate-200/10"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className={`${muted} text-sm hidden sm:inline`}>{isDark ? "Dark" : "Light"}</span>
          <button
            onClick={() => setIsDark((s) => !s)}
            aria-pressed={isDark}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
            title="Toggle theme"
          >
            <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition ${isDark ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </header>

      {/* On very small screens show a select to jump topics */}
      <div className="mb-4 md:hidden">
        <label className={`sr-only`}>Select topic</label>
        <select
          value={activeId}
          onChange={handleMobileSelect}
          className={`w-full rounded-md p-2 border ${border} ${panelBg} ${muted}`}
        >
          {topicsData.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className={`rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-4 md:gap-6`}>
        {/* Sidebar for md+ */}
        <aside className={`hidden md:block w-72 max-w-[22rem] ${panelBg} border ${border} rounded-md overflow-hidden`}>
          <div className={`px-4 py-3 font-semibold border-b ${border}`}>SQL Tutorial</div>
          <nav className="sidebar-scroll max-h-[68vh] overflow-y-auto px-2 py-3 space-y-1">
            {topicsData.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center transition ${
                    isActive ? sidebarActive : `${muted} hover:${isDark ? "bg-slate-900/30" : "bg-slate-100"}`
                  }`}
                >
                  {t.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className={`absolute left-0 top-0 bottom-0 w-4/5 max-w-xs ${panelBg} border-r ${border} p-3 overflow-y-auto`}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">SQL Tutorial</div>
                <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="p-1">
                  ✕
                </button>
              </div>
              <nav className="space-y-2">
                {topicsData.map((t) => {
                  const isActive = t.id === activeId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveId(t.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center transition ${
                        isActive ? sidebarActive : `${muted} hover:bg-slate-100/30`
                      }`}
                    >
                      {t.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Content */}
        <main className={`flex-1 bg-transparent border ${border} rounded-md p-4 overflow-auto content-scroll`} style={{ maxHeight: "calc(100vh - 170px)" }}>
          <article className="max-w-none">
            <div className="flex items-start justify-between mb-4">
              <h2 className={`text-xl sm:text-2xl ${isDark ? "text-slate-100" : "text-slate-900"}`}>{activeTopic.title}</h2>
            </div>

            <div className="space-y-6">
              {segments.map((seg, i) => {
                if (seg.type === "text") {
                  const paragraphs = seg.content
                    .split(/\n\s*\n/)
                    .map((p) => p.trim())
                    .filter(Boolean);
                  return (
                    <div key={i} className={`max-w-none ${isDark ? "prose prose-invert text-slate-200" : "prose text-slate-800"}`}>
                      {paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  );
                }

                const key = `${activeTopic.id}-code-${i}`;
                const isCopied = copiedKey === key;

                return (
                  <div key={i} className="relative">
                    <pre
                      className={`rounded-md border ${codeBorder} p-4 overflow-auto text-sm ${preBg}`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <code className={`${isDark ? "text-slate-200" : "text-slate-900"}`}>{seg.content}</code>
                    </pre>

                    <div className="absolute right-3 top-3 flex items-center">
                      {/* Animated badge */}
                      <div className="relative overflow-visible" aria-hidden={!isCopied}>
                        <div
                          className={`inline-flex items-center justify-center rounded-full mr-2 px-3 py-1 text-xs transform transition-all duration-300 ${
                            isCopied ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
                          } ${isDark ? "bg-emerald-400 text-black" : "bg-emerald-600 text-white"}`}
                        >
                          ✓ Copied
                        </div>

                        <div className={`absolute inset-0 pointer-events-none ${isCopied ? "confetti-anim" : ""}`}>
                          <span className="confetti-dot" />
                          <span className="confetti-dot" />
                          <span className="confetti-dot" />
                          <span className="confetti-dot" />
                        </div>
                      </div>
                      <button
                        onClick={() => copyText(seg.content, key)}
                        className={`px-2 py-1 text-xs rounded-md ${copyBtnBg}`}
                        aria-label="Copy code"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </main>
      </div>

      <div className="w-full border dark:border-slate-800 mt-4 border-gray-700"></div>
      <MiniFooter isDark={isDark} />
    </div>
  );
}
