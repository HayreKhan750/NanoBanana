import { useState } from "react";
import type { Slide } from "@/types/presentation";
import { BarChart2, PieChart, TrendingUp, Quote } from "lucide-react";
import {
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

interface SlideCanvasProps {
  slide: Slide;
  onTitleChange?: (val: string) => void;
  onSubtitleChange?: (val: string) => void;
  isEditing?: boolean;
}

const SLIDE_GRADIENTS: Record<string, string> = {
  title: "linear-gradient(135deg, #0A0A1A 0%, #1A0A2E 50%, #0A1A2E 100%)",
  agenda: "linear-gradient(135deg, #071428 0%, #0F1F3D 100%)",
  section: "linear-gradient(135deg, #1A0A2E 0%, #2E0A1A 100%)",
  concept: "linear-gradient(135deg, #0A0A0F 0%, #0F0F20 100%)",
  data: "linear-gradient(135deg, #071428 0%, #071E14 100%)",
  infographic: "linear-gradient(135deg, #1A0D00 0%, #200A00 100%)",
  quote: "linear-gradient(135deg, #0D0720 0%, #1A0730 100%)",
  cta: "linear-gradient(135deg, #0A0A0F 0%, #1A0A2E 100%)",
  summary: "linear-gradient(135deg, #100A00 0%, #1A1000 100%)",
  default: "linear-gradient(135deg, #0A0A0F 0%, #141420 100%)",
};

const ACCENT_COLORS: Record<string, string> = {
  title: "#F5C518",
  agenda: "#06B6D4",
  section: "#8B5CF6",
  concept: "#F5C518",
  data: "#10B981",
  infographic: "#F97316",
  quote: "#EC4899",
  cta: "#F5C518",
  summary: "#F5C518",
  default: "#F5C518",
};

function ChartRenderer({ data }: { data: NonNullable<Slide["chartData"]> }) {
  const accent = "#F5C518";
  const colors = ["#F5C518", "#8B5CF6", "#06B6D4", "#10B981", "#EC4899", "#F97316"];

  if (data.type === "bar") {
    const chartData = data.labels.map((label, i) => ({
      name: label,
      value: data.datasets[0]?.data[i] ?? 0,
    }));
    return (
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={chartData} barCategoryGap="35%">
          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
          <Bar dataKey="value" fill={accent} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (data.type === "pie" || data.type === "donut") {
    const chartData = data.labels.map((label, i) => ({
      name: label,
      value: data.datasets[0]?.data[i] ?? 0,
    }));
    return (
      <ResponsiveContainer width="100%" height={140}>
        <RechartsPie>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={data.type === "donut" ? 35 : 0}
            outerRadius={60} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}
            labelLine={{ stroke: "rgba(255,255,255,0.3)" }}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
        </RechartsPie>
      </ResponsiveContainer>
    );
  }

  if (data.type === "line") {
    const chartData = data.labels.map((label, i) => ({
      name: label,
      value: data.datasets[0]?.data[i] ?? 0,
    }));
    return (
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
          <Line type="monotone" dataKey="value" stroke={accent} strokeWidth={2.5} dot={{ fill: accent, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return null;
}

function TitleSlide({ slide, accent, onTitleChange, onSubtitleChange, isEditing }: {
  slide: Slide; accent: string; onTitleChange?: (v: string) => void; onSubtitleChange?: (v: string) => void; isEditing?: boolean;
}) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-16">
      {slide.visualUrl && (
        <img src={slide.visualUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
      )}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(245,197,24,0.08) 0%, transparent 70%)" }} />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: accent, fontSize: "13px", fontWeight: 600 }}>
          ✦ Nano Banana AI Presentation
        </div>
        {isEditing ? (
          <input
            defaultValue={slide.title}
            onBlur={(e) => onTitleChange?.(e.target.value)}
            className="block w-full text-center text-5xl font-bold bg-transparent border-none outline-none text-white mb-4"
            style={{ caretColor: accent }}
          />
        ) : (
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
        )}
        {slide.subtitle && (
          <p className="text-lg text-white/50 font-light">{slide.subtitle}</p>
        )}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="h-px w-16 opacity-40" style={{ background: accent }} />
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <div className="h-px w-16 opacity-40" style={{ background: accent }} />
        </div>
      </div>
    </div>
  );
}

function AgendaSlide({ slide, accent }: { slide: Slide; accent: string }) {
  return (
    <div className="relative w-full h-full flex flex-col px-16 py-10">
      <div className="absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(6,182,212,0.3) 0%, transparent 60%)" }} />
      <h2 className="text-3xl font-bold text-white mb-8 relative z-10">{slide.title}</h2>
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {slide.content.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-xl font-black" style={{ color: accent, opacity: 0.7 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm text-white/80 font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataSlide({ slide, accent }: { slide: Slide; accent: string }) {
  return (
    <div className="relative w-full h-full flex gap-8 px-12 py-10 items-center">
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-white mb-6">{slide.title}</h2>
        <div className="space-y-3">
          {slide.content.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1 h-6 rounded-full flex-shrink-0 mt-0.5" style={{ background: accent }} />
              <span className="text-white/75 text-sm leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
      {slide.chartData && (
        <div className="w-64 flex-shrink-0">
          <div className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wide">
            {slide.chartData.datasets[0]?.label}
          </div>
          <ChartRenderer data={slide.chartData} />
        </div>
      )}
    </div>
  );
}

function ConceptSlide({ slide, accent }: { slide: Slide; accent: string }) {
  const isLayout2 = slide.layoutVariant === 2;
  return (
    <div className="relative w-full h-full flex flex-col px-16 py-10">
      <div className="absolute top-0 right-0 w-48 h-full opacity-10"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}50)` }} />
      {isLayout2 && slide.visualUrl && (
        <div className="absolute right-8 top-8 bottom-8 w-44 rounded-xl overflow-hidden opacity-40">
          <img src={slide.visualUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="relative z-10" style={{ maxWidth: isLayout2 ? "60%" : "100%" }}>
        <div className="w-10 h-1 rounded-full mb-4" style={{ background: accent }} />
        <h2 className="text-3xl font-bold text-white mb-6">{slide.title}</h2>
        <div className="space-y-4">
          {slide.content.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
                <span className="text-xs font-bold" style={{ color: accent }}>{i + 1}</span>
              </div>
              <span className="text-white/80 text-sm leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTASlide({ slide, accent }: { slide: Slide; accent: string }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-16">
      {slide.visualUrl && (
        <img src={slide.visualUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
      )}
      <div className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${accent}10 0%, transparent 70%)` }} />
      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{slide.title}</h2>
        {slide.subtitle && (
          <p className="text-lg mb-8 font-semibold" style={{ color: accent }}>{slide.subtitle}</p>
        )}
        <div className="flex flex-col items-center gap-2">
          {slide.content.map((item, i) => (
            <div key={i} className="text-white/60 text-sm">{item}</div>
          ))}
        </div>
        <div className="mt-8 px-8 py-3 rounded-full inline-block font-bold text-sm"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)`, color: "#0A0A0F" }}>
          Get Started Today →
        </div>
      </div>
    </div>
  );
}

export default function SlideCanvas({ slide, onTitleChange, onSubtitleChange, isEditing = false }: SlideCanvasProps) {
  const bg = SLIDE_GRADIENTS[slide.type] || SLIDE_GRADIENTS.default;
  const accent = ACCENT_COLORS[slide.type] || "#F5C518";

  return (
    <div className="slide-canvas w-full" style={{ background: bg }}>
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 90% 10%, ${accent}08 0%, transparent 50%)` }} />

      {slide.type === "title" && (
        <TitleSlide slide={slide} accent={accent}
          onTitleChange={onTitleChange} onSubtitleChange={onSubtitleChange} isEditing={isEditing} />
      )}
      {slide.type === "agenda" && <AgendaSlide slide={slide} accent={accent} />}
      {slide.type === "data" && <DataSlide slide={slide} accent={accent} />}
      {slide.type === "cta" && <CTASlide slide={slide} accent={accent} />}
      {(slide.type === "concept" || slide.type === "summary" || slide.type === "infographic") && (
        <ConceptSlide slide={slide} accent={accent} />
      )}
      {slide.type === "section" && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-7xl font-black text-white/5 mb-4 select-none">
              {String(slide.order).padStart(2, "0")}
            </div>
            <h2 className="text-4xl font-bold" style={{ color: accent }}>{slide.title}</h2>
          </div>
        </div>
      )}
      {slide.type === "quote" && (
        <div className="w-full h-full flex items-center justify-center px-20">
          <div className="text-center">
            <Quote size={48} className="mx-auto mb-6 opacity-30" style={{ color: accent }} />
            <h2 className="text-3xl font-light text-white italic leading-relaxed">&ldquo;{slide.title}&rdquo;</h2>
            {slide.content[0] && (
              <p className="mt-6 text-white/50 font-medium">— {slide.content[0]}</p>
            )}
          </div>
        </div>
      )}

      {/* Slide order indicator */}
      <div className="absolute bottom-4 right-6 text-white/20 text-xs font-mono">
        {slide.order}
      </div>
    </div>
  );
}
