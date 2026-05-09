import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, FileText, Youtube, Globe, Mic, BookOpen,
  ChevronRight, ChevronLeft, Upload, Sparkles, Loader2,
  BarChart2, FileCode, AlignLeft, Zap
} from "lucide-react";
import type { InputType, StylePreset, PresentationMode, GenerationConfig } from "@/types/presentation";
import { INPUT_TYPES, PRESENTATION_MODES } from "@/constants/presets";
import { STYLE_PRESETS } from "@/constants/presets";
import { usePresentationGeneration } from "@/hooks/usePresentationGeneration";
import logoImg from "@/assets/logo.png";

const INPUT_ICONS: Record<string, React.ElementType> = {
  prompt: MessageSquare, topic: AlignLeft, pdf: FileText, docx: FileCode,
  research: BookOpen, youtube: Youtube, website: Globe, voice: Mic,
  transcript: FileText, markdown: FileCode,
};

type Step = 1 | 2 | 3;

export default function GeneratePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selectedInput, setSelectedInput] = useState<InputType>("prompt");
  const [selectedPreset, setSelectedPreset] = useState<StylePreset>("startup");
  const [selectedMode, setSelectedMode] = useState<PresentationMode>("standard");
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");
  const [slideCount, setSlideCount] = useState(12);
  const [tone, setTone] = useState<GenerationConfig["tone"]>("professional");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { isGenerating, progress, stage, generate } = usePresentationGeneration();

  const needsUrl = selectedInput === "youtube" || selectedInput === "website";
  const needsFile = ["pdf", "docx", "research", "voice", "transcript", "markdown"].includes(selectedInput);
  const needsPrompt = ["prompt", "topic"].includes(selectedInput);

  async function handleGenerate() {
    const config: GenerationConfig = {
      inputType: selectedInput,
      prompt: prompt || url,
      youtubeUrl: selectedInput === "youtube" ? url : undefined,
      websiteUrl: selectedInput === "website" ? url : undefined,
      stylePreset: selectedPreset,
      presentationMode: selectedMode,
      slideCount,
      includeCharts,
      includeSpeakerNotes,
      includeAnimations: true,
      tone,
      language: "en",
    };

    const pres = await generate(config);
    if (pres) navigate(`/studio/${pres.id}`);
  }

  const isStep1Valid = needsPrompt ? prompt.trim().length > 3 : needsUrl ? url.trim().length > 5 : needsFile ? !!fileName : true;

  return (
    <div className="min-h-screen pt-16 pb-12 px-6" style={{ background: "#0A0A0F" }}>
      {/* Generation overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}>
          <div className="glass-panel p-10 max-w-md w-full text-center"
            style={{ background: "#0F0F1A" }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.3)" }}>
              <img src={logoImg} alt="" className="w-12 h-12 object-contain animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">AI is crafting your presentation</h2>
            <p className="text-white/40 text-sm mb-8">{stage}</p>

            <div className="progress-bar mb-3">
              <div className="progress-fill" style={{ width: `${progress}%`, transition: "width 0.4s ease" }} />
            </div>
            <div className="flex justify-between text-xs text-white/30">
              <span>Generating…</span>
              <span>{progress}%</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {["Analyzing input", "Building structure", "Creating visuals"].map((s, i) => (
                <div key={s} className="text-center">
                  <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center"
                    style={{ background: progress > i * 33 ? "rgba(245,197,24,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${progress > i * 33 ? "rgba(245,197,24,0.5)" : "rgba(255,255,255,0.1)"}` }}>
                    {progress > i * 33 + 33 ? (
                      <span className="text-[8px]" style={{ color: "#F5C518" }}>✓</span>
                    ) : progress > i * 33 ? (
                      <Loader2 size={8} style={{ color: "#F5C518" }} className="animate-spin" />
                    ) : null}
                  </div>
                  <div className="text-[9px] text-white/30">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)", color: "#F5C518" }}>
            <Sparkles size={13} />
            <span className="text-sm font-medium">New Presentation</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">What's your story?</h1>
          <p className="text-white/40 text-lg">Tell the AI what you want to present — from any source</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => s < step || (s === 2 && isStep1Valid) ? setStep(s) : undefined}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: step === s ? "#F5C518" : step > s ? "rgba(245,197,24,0.2)" : "rgba(255,255,255,0.06)",
                  color: step === s ? "#0A0A0F" : step > s ? "#F5C518" : "rgba(255,255,255,0.3)",
                  border: step > s ? "1px solid rgba(245,197,24,0.4)" : "none",
                }}>
                {step > s ? "✓" : s}
              </button>
              <span className="text-xs text-white/30 hidden sm:block">
                {s === 1 ? "Input" : s === 2 ? "Style" : "Generate"}
              </span>
              {s < 3 && <ChevronRight size={14} className="text-white/20" />}
            </div>
          ))}
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {/* Input Type Grid */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">Select Input Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {INPUT_TYPES.map((input) => {
                  const Icon = INPUT_ICONS[input.id] || MessageSquare;
                  const isSelected = selectedInput === input.id;
                  return (
                    <button key={input.id} onClick={() => setSelectedInput(input.id as InputType)}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        background: isSelected ? "rgba(245,197,24,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isSelected ? "rgba(245,197,24,0.4)" : "rgba(255,255,255,0.08)"}`,
                        boxShadow: isSelected ? "0 0 20px rgba(245,197,24,0.08)" : "none",
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                        style={{ background: isSelected ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.06)" }}>
                        <Icon size={15} style={{ color: isSelected ? "#F5C518" : "rgba(255,255,255,0.5)" }} />
                      </div>
                      <div className="text-xs font-semibold text-white/80">{input.label}</div>
                      <div className="text-[10px] text-white/30 mt-0.5 leading-tight">{input.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input area */}
            {needsPrompt && (
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-3">
                  {selectedInput === "topic" ? "Enter your topic" : "Describe your presentation"}
                </label>
                <textarea
                  className="studio-input w-full px-4 py-4 text-sm resize-none"
                  rows={5}
                  placeholder={selectedInput === "topic"
                    ? "e.g. The future of renewable energy in Sub-Saharan Africa"
                    : "e.g. Create a compelling investor pitch deck for a B2B SaaS startup that automates legal document review using AI. Target: Series A investors. Key metrics: 340% YoY growth, $1.2M ARR."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-white/25">Be specific for better results</span>
                  <span className="text-xs text-white/25">{prompt.length} chars</span>
                </div>
              </div>
            )}

            {needsUrl && (
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-3">
                  {selectedInput === "youtube" ? "YouTube Video URL" : "Website URL"}
                </label>
                <input
                  type="url"
                  className="studio-input w-full px-4 py-3 text-sm"
                  placeholder={selectedInput === "youtube" ? "https://youtube.com/watch?v=..." : "https://example.com/article"}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            {needsFile && (
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-3">Upload File</label>
                <div
                  className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
                  onClick={() => fileRef.current?.click()}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,197,24,0.3)"; e.currentTarget.style.background = "rgba(245,197,24,0.03)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                  <Upload size={32} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.2)" }} />
                  {fileName ? (
                    <p className="text-sm font-semibold" style={{ color: "#F5C518" }}>{fileName}</p>
                  ) : (
                    <>
                      <p className="text-sm text-white/50 font-medium">Drop your file here or click to browse</p>
                      <p className="text-xs text-white/25 mt-1">PDF, DOCX, TXT, MD, MP3, WAV · Max 50MB</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" className="hidden"
                    accept={INPUT_TYPES.find((t) => t.id === selectedInput)?.accept || "*"}
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="btn-banana flex items-center gap-2 px-8 py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed">
                Continue to Style
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Style */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            {/* Style Presets */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">Presentation Style</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {STYLE_PRESETS.map((preset) => (
                  <button key={preset.id} onClick={() => setSelectedPreset(preset.id)}
                    className={`preset-card text-center ${selectedPreset === preset.id ? "selected" : ""}`}>
                    <div className="h-12 rounded-lg mb-2 flex items-center justify-center text-xl"
                      style={{ background: `linear-gradient(135deg, ${preset.backgroundColor}, ${preset.primaryColor}40)` }}>
                      {preset.emoji}
                    </div>
                    <div className="text-[10px] font-semibold text-white/70 truncate">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Presentation Mode */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">Presentation Mode</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESENTATION_MODES.map((mode) => (
                  <button key={mode.id} onClick={() => setSelectedMode(mode.id as PresentationMode)}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      background: selectedMode === mode.id ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selectedMode === mode.id ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <div className="text-xl mb-1">{mode.icon}</div>
                    <div className="text-xs font-semibold text-white/80">{mode.label}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-3">Number of Slides</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={5} max={30} step={1} value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="flex-1" style={{ accentColor: "#F5C518" }} />
                  <span className="text-lg font-bold text-white w-8 text-center">{slideCount}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-3">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["professional", "casual", "academic", "creative"] as const).map((t) => (
                    <button key={t} onClick={() => setTone(t)}
                      className="py-2 rounded-lg text-xs font-medium capitalize transition-all"
                      style={{
                        background: tone === t ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                        color: tone === t ? "#06B6D4" : "rgba(255,255,255,0.5)",
                        border: `1px solid ${tone === t ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-3">Options</label>
                <div className="space-y-2">
                  {[
                    { label: "Include Charts", value: includeCharts, onChange: setIncludeCharts },
                    { label: "Speaker Notes", value: includeSpeakerNotes, onChange: setIncludeSpeakerNotes },
                  ].map((opt) => (
                    <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => opt.onChange(!opt.value)}
                        className="w-10 h-5 rounded-full relative transition-all cursor-pointer flex-shrink-0"
                        style={{ background: opt.value ? "#F5C518" : "rgba(255,255,255,0.1)" }}>
                        <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                          style={{ left: opt.value ? "calc(100% - 18px)" : "2px" }} />
                      </div>
                      <span className="text-sm text-white/60">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(3)}
                className="btn-banana flex items-center gap-2 px-8 py-3 rounded-xl font-bold">
                Preview & Generate <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Generate */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Ready to Generate</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Input Type", value: INPUT_TYPES.find((t) => t.id === selectedInput)?.label },
                  { label: "Style", value: `${STYLE_PRESETS.find((p) => p.id === selectedPreset)?.emoji} ${STYLE_PRESETS.find((p) => p.id === selectedPreset)?.name}` },
                  { label: "Mode", value: PRESENTATION_MODES.find((m) => m.id === selectedMode)?.label },
                  { label: "Slides", value: `${slideCount} slides · ~${Math.ceil(slideCount * 1.5)} min` },
                  { label: "Tone", value: tone.charAt(0).toUpperCase() + tone.slice(1) },
                  { label: "Extras", value: [includeCharts && "Charts", includeSpeakerNotes && "Speaker Notes"].filter(Boolean).join(", ") || "None" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-sm text-white/40">{item.label}</span>
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              {prompt && (
                <div className="px-4 py-3 rounded-xl mb-8"
                  style={{ background: "rgba(245,197,24,0.05)", border: "1px solid rgba(245,197,24,0.15)" }}>
                  <div className="text-xs font-semibold text-yellow-500/70 mb-1 uppercase tracking-wide">Your Prompt</div>
                  <p className="text-sm text-white/60 italic">"{prompt.length > 150 ? prompt.substring(0, 150) + "..." : prompt}"</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                className="w-full btn-banana flex items-center justify-center gap-3 py-5 rounded-2xl text-xl font-black">
                <Zap size={24} />
                Generate Presentation with AI
                <Sparkles size={20} />
              </button>
            </div>

            <button onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all mx-auto"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <ChevronLeft size={16} /> Edit Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
