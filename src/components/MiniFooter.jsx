import React from "react";


 export default function MiniFooter({ isDark }) {
  const text = isDark ? "text-slate-300" : "text-slate-600";
  const link = isDark ? "text-slate-200 hover:text-white" : "text-slate-800 hover:text-black";
  const bg = isDark ? "bg-transparent" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-t border-slate-200";

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className={`${bg} ${border} mt-2 py-2`}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`text-sm ${text}`}>© {new Date().getFullYear()} QueryDocs</span>
          <span className={`hidden sm:inline-block h-4 border-l mx-2 ${isDark ? "border-slate-700" : "border-slate-200"}`} />
          <nav className="flex items-center gap-3">
            <a
              href="#install"
              className={`text-sm ${link} transition-colors`}
              title="Installation guide"
            >
              Install
            </a>
            <a
              href="#select"
              className={`text-sm ${link} transition-colors`}
              title="SELECT reference"
            >
              SELECT
            </a>
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/SQL" // example external link
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${link} transition-colors`}
              title="More SQL reference"
            >
              Reference
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={scrollTop}
            className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md transition ${isDark ? "bg-slate-800/60 hover:bg-slate-700/80 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}
            aria-label="Back to top"
            title="Back to top"
          >
            ↑ Top
          </button>

          <a
            href="mailto:urgeforcode@gmail.com"
            className={`text-sm ${link} px-3 py-1 rounded-md transition ${isDark ? "bg-slate-800/60 hover:bg-slate-700/80 text-slate-100" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}
            title="Contact"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
