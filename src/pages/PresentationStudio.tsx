import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getPresentations, savePresentation } from "@/lib/aiService";
import { exportToPPTX } from "@/lib/pptExport";
import type { Presentation } from "@/types/presentation";
import { useSlideEditor } from "@/hooks/useSlideEditor";
import PresentationSidebar from "@/components/PresentationSidebar";
import SlideCanvas from "@/components/SlideCanvas";
import AIRefinementPanel from "@/components/AIRefinementPanel";
import PresentationToolbar from "@/components/PresentationToolbar";
import ExportDialog from "@/components/ExportDialog";
import { Loader2, Zap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

function getDemoPresentation(): Presentation {
  const { generatePresentation } = require("@/lib/aiService");
  return {
    id: "demo",
    title: "The Future of AI-Powered Work",
    subtitle: "A Nano Banana AI Demo Presentation",
    theme: "futuristic",
    mode: "ted",
    inputType: "prompt",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalSlides: 8,
    estimatedDuration: 12,
    coachScore: {
      overall: 92,
      readability: 95,
      visualBalance: 88,
      storytelling: 94,
      engagement: 91,
      pacing: 93,
      suggestions: [
        "Consider adding a compelling personal story to slide 2",
        "Slide 5 could benefit from a data visualization",
        "The conclusion could be more emotionally resonant",
        "Try varying sentence length for better rhythm",
      ],
    },
    slides: [
      {
        id: "s1", order: 1, type: "title", title: "The Future of AI-Powered Work",
        subtitle: "How Intelligent Systems Will Transform Every Industry · 2025",
        content: [], speakerNotes: "Welcome everyone. Take a moment to let the title breathe. Make strong eye contact. Pause 3 seconds.", animationType: "cinematic", layoutVariant: 1, accentColor: "#F5C518", backgroundColor: "#050510",
        visualUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1280&h=720&fit=crop",
      },
      {
        id: "s2", order: 2, type: "agenda", title: "Our Journey Today",
        content: ["The AI Revolution is Here", "Real-World Transformations", "Key Industries Affected", "The Human-AI Partnership", "Ethical Considerations", "Opportunities Ahead", "Call to Action"],
        speakerNotes: "Walk through agenda briefly. Emphasize the 'journey' metaphor. Set expectations for an interactive session.", animationType: "stagger", layoutVariant: 1, accentColor: "#06B6D4", backgroundColor: "#071428",
      },
      {
        id: "s3", order: 3, type: "concept", title: "The AI Revolution is Already Here",
        content: ["120M+ jobs will be transformed by AI by 2025", "80% of businesses now use AI in some form", "Productivity gains of 40% reported in AI-enabled teams", "The question is no longer IF, but HOW FAST"],
        speakerNotes: "Lead with the statistic that surprises them most. Use a personal anecdote if possible. Build tension before offering hope.", animationType: "slide", layoutVariant: 2, accentColor: "#F5C518", backgroundColor: "#0A0A0F",
        visualUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&h=720&fit=crop",
      },
      {
        id: "s4", order: 4, type: "data", title: "AI Adoption is Accelerating",
        content: ["Enterprise AI investment grew 300% in 2024", "AI startups raised $67B in funding last year", "ROI from AI projects: average 3.7x return", "Time-to-value decreased from 18 months to 4 months"],
        speakerNotes: "Let the chart speak first. Then narrate the trend. Use 'What this means for YOU' framing.", animationType: "zoom", layoutVariant: 1, accentColor: "#10B981", backgroundColor: "#071428",
        chartData: { type: "bar", labels: ["2020", "2021", "2022", "2023", "2024"], datasets: [{ label: "AI Investment ($B)", data: [12, 24, 38, 52, 67] }] },
      },
      {
        id: "s5", order: 5, type: "concept", title: "Industries Being Transformed",
        content: ["Healthcare: AI diagnostics achieving 99.1% accuracy", "Finance: 70% of trades now AI-assisted", "Education: Personalized learning for 500M+ students", "Manufacturing: Predictive maintenance saving $630B annually"],
        speakerNotes: "Tell one specific story from each industry. The healthcare story tends to resonate most emotionally.", animationType: "stagger", layoutVariant: 1, accentColor: "#8B5CF6", backgroundColor: "#0A0A0F",
      },
      {
        id: "s6", order: 6, type: "infographic", title: "The Human-AI Partnership Model",
        content: ["Humans provide: Creativity, Empathy, Context, Ethics", "AI provides: Scale, Speed, Pattern Recognition, Consistency", "Together: Capabilities neither could achieve alone", "The goal is augmentation, not replacement"],
        speakerNotes: "This is the emotional pivot point. Reassure the audience. Emphasize partnership over competition.", animationType: "fade", layoutVariant: 2, accentColor: "#F5C518", backgroundColor: "#100A00",
      },
      {
        id: "s7", order: 7, type: "summary", title: "The Opportunity Window is Open",
        content: ["First-movers will define the next decade of their industries", "Skills gap creates enormous talent opportunity", "AI literacy is the new business literacy", "Those who act now will lead — those who wait will follow"],
        speakerNotes: "Build urgency here. This is where you call the audience to action mentally. Plant the seed before the final CTA.", animationType: "cinematic", layoutVariant: 1, accentColor: "#F5C518", backgroundColor: "#100A00",
      },
      {
        id: "s8", order: 8, type: "cta", title: "The Future Belongs to the Curious",
        subtitle: "Start your AI transformation journey today",
        content: ["hello@nanobanana.ai", "nanobanana.ai/start", "@NanoBananaAI"],
        speakerNotes: "End with energy and conviction. Thank the audience. Invite questions. Leave them inspired and ready to act.", animationType: "cinematic", layoutVariant: 1, accentColor: "#F5C518", backgroundColor: "#050510",
        visualUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1280&h=720&fit=crop",
      },
    ],
  };
}

export default function PresentationStudio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showPresent, setShowPresent] = useState(false);
  const [presentSlide, setPresentSlide] = useState(0);

  const {
    presentation,
    setPresentation,
    activeSlide,
    activeSlideIndex,
    setActiveSlideIndex,
    isRefining,
    showNotes,
    setShowNotes,
    showCoach,
    setShowCoach,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
    applyRefinement,
    updateSlideText,
    updateSlideNotes,
  } = useSlideEditor(null);

  useEffect(() => {
    async function loadPresentation() {
      setLoading(true);
      try {
        if (id === "demo") {
          const demo = getDemoPresentation();
          setPresentation(demo);
        } else {
          const all = getPresentations();
          const found = all.find((p) => p.id === id);
          if (found) setPresentation(found);
          else navigate("/library");
        }
      } finally {
        setLoading(false);
      }
    }
    loadPresentation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0F" }}>
        <div className="text-center">
          <img src={logoImg} alt="" className="w-16 h-16 object-contain mx-auto mb-4 animate-spin-slow" />
          <div className="text-white/50 text-sm">Loading presentation…</div>
        </div>
      </div>
    );
  }

  if (!presentation) return null;

  // Fullscreen present mode
  if (showPresent) {
    const slide = presentation.slides[presentSlide];
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0A0A0F" }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "Space") setPresentSlide((i) => Math.min(i + 1, presentation.slides.length - 1));
          if (e.key === "ArrowLeft") setPresentSlide((i) => Math.max(i - 1, 0));
          if (e.key === "Escape") setShowPresent(false);
        }}
        tabIndex={0}>
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <span className="text-white/30 text-sm">{presentSlide + 1} / {presentation.slides.length}</span>
          <button onClick={() => setShowPresent(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-white/50 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            Exit
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div style={{ width: "90vw", maxWidth: "1200px" }}>
            <SlideCanvas slide={slide} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 pb-8">
          <button onClick={() => setPresentSlide((i) => Math.max(i - 1, 0))}
            disabled={presentSlide === 0}
            className="px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-30 transition-all"
            style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
            ← Previous
          </button>
          <div className="flex gap-1">
            {presentation.slides.map((_, i) => (
              <button key={i} onClick={() => setPresentSlide(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === presentSlide ? "#F5C518" : "rgba(255,255,255,0.2)" }} />
            ))}
          </div>
          <button onClick={() => setPresentSlide((i) => Math.min(i + 1, presentation.slides.length - 1))}
            disabled={presentSlide === presentation.slides.length - 1}
            className="px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-30 transition-all"
            style={{ background: "rgba(245,197,24,0.15)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.3)" }}>
            Next →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#0A0A0F", paddingTop: "64px" }}>
      {/* Toolbar */}
      <PresentationToolbar
        presentation={presentation}
        showNotes={showNotes}
        showCoach={showCoach}
        zoom={zoom}
        onToggleNotes={() => setShowNotes(!showNotes)}
        onToggleCoach={() => setShowCoach(!showCoach)}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
        onExport={() => setShowExport(true)}
        onPresent={() => { setPresentSlide(activeSlideIndex); setShowPresent(true); }}
      />

      {/* Main Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Slide List */}
        <PresentationSidebar
          presentation={presentation}
          activeSlideIndex={activeSlideIndex}
          onSelectSlide={setActiveSlideIndex}
          onDuplicateSlide={duplicateSlide}
          onDeleteSlide={deleteSlide}
          onReorderSlides={reorderSlides}
        />

        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden"
          style={{ background: "#070710" }}>
          <div className="flex-1 flex items-center justify-center overflow-auto p-8">
            {activeSlide ? (
              <div style={{
                width: `${Math.min(900, 900 * zoom)}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease",
              }}>
                <SlideCanvas
                  slide={activeSlide}
                  isEditing={true}
                  onTitleChange={(val) => updateSlideText("title", val)}
                  onSubtitleChange={(val) => updateSlideText("subtitle", val)}
                />
              </div>
            ) : (
              <div className="text-center text-white/20">
                <div className="text-6xl mb-4">🎴</div>
                <div className="text-sm">Select a slide to edit</div>
              </div>
            )}
          </div>

          {/* Speaker Notes */}
          {showNotes && activeSlide && (
            <div className="flex-shrink-0 border-t px-6 py-4" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0A0A12", maxHeight: "160px" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#8B5CF6" }} />
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wide">Speaker Notes</span>
              </div>
              <textarea
                className="w-full bg-transparent text-sm text-white/60 resize-none border-none outline-none leading-relaxed font-body"
                rows={3}
                placeholder="Add speaker notes for this slide…"
                value={activeSlide.speakerNotes}
                onChange={(e) => updateSlideNotes(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Right Panel: AI Refinement */}
        <AIRefinementPanel
          slide={activeSlide}
          isRefining={isRefining}
          onRefine={applyRefinement}
          presentation={presentation}
          showCoach={showCoach}
        />
      </div>

      {/* Export Dialog */}
      {showExport && (
        <ExportDialog
          presentation={presentation}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
