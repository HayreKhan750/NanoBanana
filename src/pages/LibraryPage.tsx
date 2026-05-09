import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPresentations, deletePresentation } from "@/lib/aiService";
import type { Presentation } from "@/types/presentation";
import { STYLE_PRESETS } from "@/constants/presets";
import { Plus, Trash2, ExternalLink, Clock, Layers, Zap } from "lucide-react";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";

function PresentationCard({ pres, onDelete }: { pres: Presentation; onDelete: (id: string) => void }) {
  const preset = STYLE_PRESETS.find((p) => p.id === pres.theme);
  const score = pres.coachScore?.overall;

  return (
    <div className="glass-panel glass-panel-hover p-5 relative group"
      style={{ background: "#0F0F1A" }}>
      {/* Preview area */}
      <div className="h-32 rounded-xl mb-4 overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${preset?.backgroundColor || "#0A0A0F"}, ${preset?.primaryColor || "#F5C518"}20)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-1">{preset?.emoji || "📊"}</div>
            <div className="text-xs font-bold text-white/60">{pres.title}</div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          {score !== undefined && (
            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: score >= 85 ? "rgba(16,185,129,0.2)" : "rgba(245,197,24,0.2)", color: score >= 85 ? "#10B981" : "#F5C518", border: `1px solid ${score >= 85 ? "rgba(16,185,129,0.4)" : "rgba(245,197,24,0.4)"}` }}>
              Score: {score}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <h3 className="text-sm font-bold text-white mb-1 truncate">{pres.title}</h3>
      {pres.subtitle && (
        <p className="text-xs text-white/35 mb-3 truncate">{pres.subtitle}</p>
      )}

      <div className="flex items-center gap-3 text-white/30 text-xs mb-4">
        <span className="flex items-center gap-1"><Layers size={10} /> {pres.totalSlides} slides</span>
        <span className="flex items-center gap-1"><Clock size={10} /> {pres.estimatedDuration} min</span>
        <span>{preset?.emoji} {preset?.name}</span>
      </div>

      <div className="flex gap-2">
        <Link to={`/studio/${pres.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
          style={{ background: "rgba(245,197,24,0.1)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.25)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,197,24,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,197,24,0.1)"; }}>
          <ExternalLink size={12} /> Open Studio
        </Link>
        <button
          onClick={() => { deletePresentation(pres.id); onDelete(pres.id); toast.success("Presentation deleted"); }}
          className="px-3 py-2 rounded-lg transition-all"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}>
          <Trash2 size={13} color="#ef4444" />
        </button>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);

  useEffect(() => {
    setPresentations(getPresentations());
  }, []);

  function handleDelete(id: string) {
    setPresentations((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen pt-16 pb-12 px-6" style={{ background: "#0A0A0F" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="py-12 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">My Presentations</h1>
            <p className="text-white/40">{presentations.length} presentations · Saved in your browser</p>
          </div>
          <Link to="/generate"
            className="btn-banana flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
            <Plus size={18} /> New Presentation
          </Link>
        </div>

        {presentations.length === 0 ? (
          <div className="glass-panel p-16 text-center" style={{ background: "#0F0F1A" }}>
            <img src={logoImg} alt="" className="w-16 h-16 object-contain mx-auto mb-6 opacity-40" />
            <h2 className="text-2xl font-bold text-white/60 mb-4">No presentations yet</h2>
            <p className="text-white/30 mb-8">Generate your first AI-powered presentation to get started.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generate"
                className="btn-banana flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold">
                <Zap size={20} /> Create First Presentation
              </Link>
              <Link to="/studio/demo"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}>
                View Demo →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Demo card always shown */}
            <div className="glass-panel glass-panel-hover p-5" style={{ background: "#0F0F1A", border: "1px solid rgba(245,197,24,0.15)" }}>
              <div className="h-32 rounded-xl mb-4 overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #050510, rgba(245,197,24,0.3))" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-1">🤖</div>
                    <div className="text-xs font-bold text-white/60">Demo Presentation</div>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(245,197,24,0.2)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.4)" }}>
                    DEMO
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">The Future of AI-Powered Work</h3>
              <p className="text-xs text-white/35 mb-3">Nano Banana AI Demo · TED Talk Style</p>
              <div className="flex items-center gap-3 text-white/30 text-xs mb-4">
                <span className="flex items-center gap-1"><Layers size={10} /> 8 slides</span>
                <span className="flex items-center gap-1"><Clock size={10} /> 12 min</span>
              </div>
              <Link to="/studio/demo"
                className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold w-full transition-all"
                style={{ background: "rgba(245,197,24,0.1)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.25)" }}>
                <ExternalLink size={12} /> Open Demo
              </Link>
            </div>

            {presentations.map((pres) => (
              <PresentationCard key={pres.id} pres={pres} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
