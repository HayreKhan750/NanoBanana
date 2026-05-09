import { Link } from "react-router-dom";
import { Zap, Sparkles, ChevronRight, Play, Star, ArrowRight, FileText, Youtube, Mic, Globe, MessageSquare, BarChart2, Download, Brain } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import studioPreview from "@/assets/studio-preview.jpg";
import logoImg from "@/assets/logo.png";
import { STYLE_PRESETS } from "@/constants/presets";

const STATS = [
  { value: "10x", label: "Faster than manual slides" },
  { value: "50+", label: "Style presets" },
  { value: "15", label: "Presentation modes" },
  { value: "∞", label: "Creative possibilities" },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI Storytelling Engine",
    description: "Emotionally structured narratives with logical flow, pacing control, and audience engagement optimization.",
    color: "#F5C518",
  },
  {
    icon: Sparkles,
    title: "Cinematic Visual Generation",
    description: "AI-generated illustrations, infographics, and diagrams tailored to each slide's theme and purpose.",
    color: "#8B5CF6",
  },
  {
    icon: BarChart2,
    title: "Data Visualization AI",
    description: "Upload CSV, Excel or JSON — instantly converted to beautiful animated charts and infographics.",
    color: "#06B6D4",
  },
  {
    icon: MessageSquare,
    title: "Speaker Notes AI",
    description: "Auto-generated presenter notes with timing cues, emphasis markers, and audience engagement prompts.",
    color: "#10B981",
  },
  {
    icon: Download,
    title: "Professional Export",
    description: "Export as PPTX, PDF, PNG slides, or HTML presentations with full layout and theme preservation.",
    color: "#F97316",
  },
  {
    icon: Zap,
    title: "Real-Time Editing",
    description: "Drag-and-drop slide editor with AI refinement, instant previews, and auto-save functionality.",
    color: "#EC4899",
  },
];

const INPUT_SHOWCASE = [
  { icon: MessageSquare, label: "Text Prompt", color: "#F5C518" },
  { icon: FileText, label: "PDF / DOCX", color: "#06B6D4" },
  { icon: Youtube, label: "YouTube URL", color: "#EF4444" },
  { icon: Globe, label: "Website URL", color: "#10B981" },
  { icon: Mic, label: "Voice Input", color: "#8B5CF6" },
  { icon: FileText, label: "Research Paper", color: "#F97316" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F" }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.8) 70%, #0A0A0F 100%)" }} />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#F5C518" }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: "#8B5CF6" }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center animate-float"
              style={{ background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.3)", boxShadow: "0 0 30px rgba(245,197,24,0.2)" }}>
              <img src={logoImg} alt="Nano Banana" className="w-10 h-10 object-contain" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.25)", color: "#F5C518" }}>
            <Sparkles size={13} />
            <span className="text-sm font-semibold">Next-Gen AI Presentation Studio</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
            <span className="block">Nano Banana</span>
            <span className="block gradient-text-banana">AI Presentation</span>
            <span className="block text-white/90">Studio</span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12 font-body">
            Generate cinematic, emotionally-structured presentations from prompts, PDFs, YouTube videos, voice recordings, and more. Not just slides — storytelling experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/generate"
              className="btn-banana flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold">
              <Zap size={20} />
              Generate Free Presentation
              <ArrowRight size={18} />
            </Link>
            <Link to="/studio/demo"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}>
              <Play size={16} />
              View Demo Presentation
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black gradient-text-banana mb-1">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Preview */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">The Ultimate Presentation Studio</h2>
            <p className="text-white/40 text-lg">Real-time editing, AI refinement, and cinematic slide rendering</p>
          </div>
          <div className="rounded-3xl overflow-hidden relative"
            style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)" }}>
            <img src={studioPreview} alt="Nano Banana Studio" className="w-full object-cover" style={{ maxHeight: "500px" }} />
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(180deg, rgba(10,10,15,0.1) 0%, rgba(10,10,15,0.5) 100%)" }}>
              <Link to="/generate"
                className="btn-banana flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold">
                <Play size={20} />
                Launch Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Input Types */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Any Input. One Click. Perfect Slides.</h2>
            <p className="text-white/40 text-lg">10 different input types. One unified AI engine.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {INPUT_SHOWCASE.map((input) => (
              <div key={input.label} className="glass-panel glass-panel-hover p-5 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${input.color}15`, border: `1px solid ${input.color}30` }}>
                  <input.icon size={20} style={{ color: input.color }} />
                </div>
                <div className="text-sm font-semibold text-white/80">{input.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for <span className="gradient-text-banana">Cinematic Impact</span></h2>
            <p className="text-white/40 text-lg">Every feature designed to elevate your presentation game</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="glass-panel glass-panel-hover p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}25` }}>
                  <feature.icon size={22} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Presets Showcase */}
      <section className="py-24 px-6" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">15 Cinematic Style Presets</h2>
            <p className="text-white/40 text-lg">From Startup Pitch Deck to TED Talk — every style covered</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {STYLE_PRESETS.map((preset) => (
              <div key={preset.id} className="glass-panel glass-panel-hover p-4 text-center cursor-pointer">
                <div className="h-16 rounded-lg mb-3 flex items-center justify-center text-2xl"
                  style={{ background: `linear-gradient(135deg, ${preset.backgroundColor}, ${preset.primaryColor}30)`, border: `1px solid ${preset.primaryColor}20` }}>
                  {preset.emoji}
                </div>
                <div className="text-xs font-semibold text-white/80">{preset.name}</div>
                <div className="text-[10px] text-white/30 mt-0.5">{preset.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(245,197,24,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src={logoImg} alt="" className="w-10 h-10 object-contain animate-float" />
          </div>
          <h2 className="text-5xl font-black text-white mb-6">
            Start Creating <span className="gradient-text-banana">Cinematic</span> Presentations
          </h2>
          <p className="text-white/45 text-xl mb-10 leading-relaxed">
            Join thousands of creators using Nano Banana AI to transform ideas into stunning presentations.
          </p>
          <Link to="/generate"
            className="btn-banana inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-black">
            <Zap size={24} />
            Generate Your First Presentation
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src={logoImg} alt="" className="w-6 h-6 object-contain" />
          <span className="text-sm font-bold text-white/50">Nano Banana AI Presentation Studio</span>
        </div>
        <p className="text-xs text-white/20">Powered by advanced AI · Crafted for cinematic storytelling</p>
      </footer>
    </div>
  );
}
