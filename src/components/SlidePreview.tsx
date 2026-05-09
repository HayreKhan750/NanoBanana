import { useMemo } from "react";
import type { Slide } from "@/types/presentation";
import { BarChart2, PieChart, TrendingUp } from "lucide-react";

interface SlidePreviewProps {
  slide: Slide;
  isActive?: boolean;
  onClick?: () => void;
  scale?: number;
}

const SLIDE_TYPE_ACCENT: Record<string, string> = {
  title: "#F5C518",
  agenda: "#06B6D4",
  section: "#8B5CF6",
  concept: "#F5C518",
  data: "#10B981",
  infographic: "#F97316",
  quote: "#EC4899",
  comparison: "#8B5CF6",
  timeline: "#06B6D4",
  summary: "#F5C518",
  cta: "#F5C518",
};

function MiniChart({ data }: { data: Slide["chartData"] }) {
  if (!data) return null;
  const values = data.datasets[0]?.data || [];
  const max = Math.max(...values, 1);

  if (data.type === "bar") {
    return (
      <div className="flex items-end gap-1 h-12 mt-2">
        {values.slice(0, 6).map((v, i) => (
          <div key={i} className="flex-1 rounded-t-sm transition-all"
            style={{ height: `${(v / max) * 100}%`, background: "rgba(245,197,24,0.6)" }} />
        ))}
      </div>
    );
  }

  if (data.type === "pie" || data.type === "donut") {
    return (
      <div className="flex items-center justify-center mt-2">
        <PieChart size={32} style={{ color: "#F5C518" }} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-2">
      <TrendingUp size={24} style={{ color: "#10B981" }} />
      <span className="text-xs text-green-400">+{Math.round((values[values.length - 1] / values[0] - 1) * 100)}%</span>
    </div>
  );
}

export default function SlidePreview({ slide, isActive, onClick, scale = 1 }: SlidePreviewProps) {
  const accent = useMemo(() => SLIDE_TYPE_ACCENT[slide.type] || "#F5C518", [slide.type]);

  const isTitle = slide.type === "title" || slide.type === "cta";
  const hasBg = slide.visualUrl && (isTitle || slide.type === "section");

  return (
    <div
      className={`slide-thumbnail ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      <div className="slide-canvas relative flex flex-col justify-center overflow-hidden"
        style={{ background: "#0F0F1A", width: "100%", height: "100%" }}>
        {/* Background image for title slides */}
        {hasBg && (
          <img src={slide.visualUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}

        {/* Accent gradient */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${accent}30 0%, transparent 60%)` }} />

        {/* Slide number + type badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
            {slide.type.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-3">
          {isTitle ? (
            <div className="text-center">
              <div className="text-[11px] font-bold text-white leading-tight mb-1 truncate">{slide.title}</div>
              {slide.subtitle && (
                <div className="text-[8px] text-white/50 truncate">{slide.subtitle}</div>
              )}
            </div>
          ) : (
            <>
              <div className="text-[9px] font-bold mb-1.5 leading-tight"
                style={{ color: accent }}>{slide.title}</div>
              <div className="space-y-0.5">
                {slide.content.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <div className="w-0.5 h-0.5 rounded-full mt-1 flex-shrink-0"
                      style={{ background: accent }} />
                    <span className="text-[7px] text-white/60 leading-tight truncate">{item}</span>
                  </div>
                ))}
              </div>
              {slide.chartData && <MiniChart data={slide.chartData} />}
            </>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${accent}80, transparent)` }} />
      </div>
    </div>
  );
}
