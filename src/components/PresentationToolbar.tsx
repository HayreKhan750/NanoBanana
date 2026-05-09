import type { Presentation } from "@/types/presentation";
import { Download, Share2, Eye, EyeOff, BarChart2, Play, ZoomIn, ZoomOut } from "lucide-react";
import { STYLE_PRESETS } from "@/constants/presets";

interface PresentationToolbarProps {
  presentation: Presentation;
  showNotes: boolean;
  showCoach: boolean;
  zoom: number;
  onToggleNotes: () => void;
  onToggleCoach: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExport: () => void;
  onPresent: () => void;
}

export default function PresentationToolbar({
  presentation,
  showNotes,
  showCoach,
  zoom,
  onToggleNotes,
  onToggleCoach,
  onZoomIn,
  onZoomOut,
  onExport,
  onPresent,
}: PresentationToolbarProps) {
  const preset = STYLE_PRESETS.find((p) => p.id === presentation.theme);

  return (
    <div className="h-12 flex items-center px-6 gap-4 flex-shrink-0"
      style={{ background: "rgba(10,10,15,0.9)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Presentation info */}
      <div className="flex-1 flex items-center gap-3">
        <div>
          <div className="text-sm font-semibold text-white leading-none truncate max-w-48">{presentation.title}</div>
          <div className="text-[10px] text-white/30 mt-0.5">{presentation.slides.length} slides · {presentation.estimatedDuration} min</div>
        </div>
        {preset && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-xs">{preset.emoji}</span>
            <span className="text-xs text-white/50">{preset.name}</span>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onZoomOut} className="p-1 rounded hover:bg-white/10 transition-colors" title="Zoom out">
          <ZoomOut size={13} color="rgba(255,255,255,0.5)" />
        </button>
        <span className="text-xs text-white/40 w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
        <button onClick={onZoomIn} className="p-1 rounded hover:bg-white/10 transition-colors" title="Zoom in">
          <ZoomIn size={13} color="rgba(255,255,255,0.5)" />
        </button>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/10" />

      {/* Toggle buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleNotes}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: showNotes ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
            color: showNotes ? "#8B5CF6" : "rgba(255,255,255,0.4)",
            border: `1px solid ${showNotes ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.08)"}`,
          }}>
          {showNotes ? <Eye size={12} /> : <EyeOff size={12} />}
          Notes
        </button>

        <button
          onClick={onToggleCoach}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: showCoach ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
            color: showCoach ? "#10B981" : "rgba(255,255,255,0.4)",
            border: `1px solid ${showCoach ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
          }}>
          <BarChart2 size={12} />
          Coach
        </button>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/10" />

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}>
          <Download size={12} />
          Export
        </button>

        <button
          onClick={onPresent}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold btn-banana">
          <Play size={12} />
          Present
        </button>
      </div>
    </div>
  );
}
