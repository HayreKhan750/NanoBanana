import type { Slide, Presentation, GenerationConfig, CoachScore, SlideType, AnimationType } from "@/types/presentation";
import { STYLE_PRESETS } from "@/constants/presets";

// Mocked AI slide content templates for cinematic generation
const SLIDE_TEMPLATES: Record<string, Partial<Slide>[]> = {
  default: [
    {
      type: "title",
      title: "{TITLE}",
      subtitle: "Crafted with Nano Banana AI · {DATE}",
      content: [],
      speakerNotes: "Welcome the audience warmly. Pause for 3 seconds after the title appears. Make eye contact.",
    },
    {
      type: "agenda",
      title: "What We'll Cover Today",
      content: ["Problem & Opportunity", "Our Solution", "Market Analysis", "Business Model", "Traction & Metrics", "Team", "Ask & Next Steps"],
      speakerNotes: "Walk through the agenda briefly. Set expectations. Keep this slide to 30 seconds.",
    },
    {
      type: "concept",
      title: "The Problem We're Solving",
      content: [
        "Current solutions are fragmented and inefficient",
        "Users lose 6+ hours per week on manual processes",
        "The market lacks an intelligent, unified platform",
        "$2.4B in productivity lost annually due to this gap",
      ],
      speakerNotes: "State the problem clearly and emotionally. Use a real-world story or analogy. Pause after each point.",
    },
    {
      type: "concept",
      title: "Our Solution",
      content: [
        "AI-powered platform that automates the entire workflow",
        "10x faster than existing alternatives",
        "Learns from your data and adapts over time",
        "Seamless integration with your existing tools",
      ],
      speakerNotes: "Introduce the solution with confidence. Show the product if possible. Highlight the key differentiator.",
    },
    {
      type: "data",
      title: "Market Opportunity",
      content: ["Total Addressable Market: $48B", "Serviceable Market: $12B", "Initial Target: $2.4B", "CAGR: 34% through 2027"],
      speakerNotes: "Present data confidently. Use the chart to anchor your numbers. Don't over-explain — let the visuals do the work.",
    },
    {
      type: "infographic",
      title: "How It Works",
      content: ["Step 1: Connect your data sources", "Step 2: AI analyzes and structures", "Step 3: Generate insights instantly", "Step 4: Share and collaborate"],
      speakerNotes: "Walk through each step slowly. Ask audience if they have questions at each stage. Keep energy high.",
    },
    {
      type: "concept",
      title: "Our Competitive Edge",
      content: [
        "Proprietary AI model trained on 50M+ data points",
        "Patent-pending workflow automation engine",
        "99.7% accuracy rate vs 78% industry average",
        "First-mover advantage in the SMB segment",
      ],
      speakerNotes: "Be bold and confident here. Don't apologize for competitors — simply demonstrate superiority.",
    },
    {
      type: "data",
      title: "Traction & Growth",
      content: ["2,400+ active customers", "340% YoY revenue growth", "$1.2M ARR achieved in 8 months", "NPS score of 72 (industry avg: 31)"],
      speakerNotes: "This is your proof point. Let the numbers sink in. Pause after showing growth metrics.",
    },
    {
      type: "concept",
      title: "Business Model",
      content: [
        "SaaS subscription: $99–$499/month per team",
        "Enterprise licenses: Custom pricing",
        "Marketplace add-ons and integrations",
        "Professional services and onboarding",
      ],
      speakerNotes: "Explain the revenue model simply. Focus on the recurring nature of revenue.",
    },
    {
      type: "concept",
      title: "The Team",
      content: [
        "CEO: 15 years in enterprise SaaS, 2 exits",
        "CTO: Ex-Google, MIT AI Lab alumnus",
        "Head of Growth: Scaled 3 startups to $10M ARR",
        "Advisors from Y Combinator, a16z, and OpenAI",
      ],
      speakerNotes: "Highlight credibility and complementary skills. Show that this team can execute on the vision.",
    },
    {
      type: "summary",
      title: "Why Now?",
      content: [
        "AI maturity has reached the inflection point",
        "Remote-first work created the demand",
        "Regulatory shifts favor automation",
        "First-mover window is open for 18 months",
      ],
      speakerNotes: "Build urgency. Explain why this moment is unique. Connect market timing to your fundraise.",
    },
    {
      type: "cta",
      title: "Join Us in Shaping the Future",
      subtitle: "We're raising $3M Seed Round · Q1 2025",
      content: ["contact@company.com", "Deck available on request", "Demo live at product.company.com"],
      speakerNotes: "Close with conviction. Thank the audience. Invite questions. Have your follow-up ready.",
    },
  ],
};

function generateSlideId(): string {
  return `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generatePresentationId(): string {
  return `pres_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getPreset(id: string) {
  return STYLE_PRESETS.find((p) => p.id === id) || STYLE_PRESETS[0];
}

const ANIMATIONS: AnimationType[] = ["fade", "slide", "zoom", "cinematic", "stagger"];

function buildSlides(config: GenerationConfig, title: string): Slide[] {
  const preset = getPreset(config.stylePreset);
  const template = SLIDE_TEMPLATES.default;
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return template.slice(0, config.slideCount).map((tmpl, index) => {
    const slideTitle = (tmpl.title || "Slide").replace("{TITLE}", title).replace("{DATE}", now);
    const slideSubtitle = (tmpl.subtitle || "").replace("{TITLE}", title).replace("{DATE}", now);

    return {
      id: generateSlideId(),
      order: index + 1,
      type: (tmpl.type || "concept") as SlideType,
      title: slideTitle,
      subtitle: slideSubtitle,
      content: tmpl.content || [],
      visualUrl: getSlideVisual(tmpl.type as SlideType, index),
      speakerNotes: config.includeSpeakerNotes ? (tmpl.speakerNotes || "") : "",
      animationType: ANIMATIONS[index % ANIMATIONS.length],
      layoutVariant: (index % 3) + 1,
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      chartData: tmpl.type === "data" ? generateChartData(index) : undefined,
    };
  });
}

function getSlideVisual(type: SlideType | undefined, index: number): string {
  const visuals: Record<string, string[]> = {
    title: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=720&fit=crop&order_by=latest",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1280&h=720&fit=crop",
    ],
    data: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
    ],
    concept: [
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1280&h=720&fit=crop",
    ],
    infographic: [
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1280&h=720&fit=crop",
    ],
    cta: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1280&h=720&fit=crop",
    ],
  };

  const key = type || "concept";
  const arr = visuals[key] || visuals.concept;
  return arr[index % arr.length];
}

function generateChartData(index: number) {
  const charts = [
    {
      type: "bar" as const,
      labels: ["2021", "2022", "2023", "2024", "2025"],
      datasets: [{ label: "Revenue ($M)", data: [0.2, 0.8, 2.1, 5.4, 12.0], color: "#F5C518" }],
    },
    {
      type: "pie" as const,
      labels: ["Enterprise", "SMB", "Startup", "Individual"],
      datasets: [{ label: "Market Share", data: [45, 30, 18, 7], color: "#8B5CF6" }],
    },
    {
      type: "line" as const,
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{ label: "Users (K)", data: [1.2, 2.4, 4.1, 7.8, 12.3, 18.9], color: "#06B6D4" }],
    },
  ];
  return charts[index % charts.length];
}

function generateCoachScore(): CoachScore {
  return {
    overall: 87,
    readability: 92,
    visualBalance: 85,
    storytelling: 88,
    engagement: 84,
    pacing: 90,
    suggestions: [
      "Add more visual contrast to slide 3 for better readability",
      "Consider reducing text density on slide 5",
      "The transition from slide 7 to 8 could be more narrative",
      "Add a hook statement to the opening slide",
      "Include a data visualization on slide 9 for stronger impact",
    ],
  };
}

export function extractTitleFromInput(config: GenerationConfig): string {
  if (config.prompt) {
    const words = config.prompt.trim().split(" ").slice(0, 5).join(" ");
    return words.length > 3 ? words : "AI-Powered Presentation";
  }
  if (config.youtubeUrl) return "YouTube Content Analysis";
  if (config.websiteUrl) return "Web Content Presentation";
  if (config.fileContent) return "Document Analysis";
  return "Professional Presentation";
}

export async function generatePresentation(config: GenerationConfig): Promise<Presentation> {
  // Simulate AI processing time
  await new Promise((r) => setTimeout(r, 3500));

  const title = extractTitleFromInput(config);
  const slides = buildSlides(config, title);
  const preset = getPreset(config.stylePreset);

  const presentation: Presentation = {
    id: generatePresentationId(),
    title,
    subtitle: `Generated with Nano Banana AI · ${preset.name} Theme`,
    theme: config.stylePreset,
    mode: config.presentationMode,
    slides,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inputType: config.inputType,
    totalSlides: slides.length,
    estimatedDuration: Math.ceil(slides.length * 1.5),
    coachScore: generateCoachScore(),
  };

  return presentation;
}

export async function refineSlide(
  slide: Slide,
  action: string
): Promise<Slide> {
  await new Promise((r) => setTimeout(r, 1500));

  const refinements: Record<string, Partial<Slide>> = {
    simplify: {
      content: slide.content.slice(0, 3),
      speakerNotes: "Simplified version — focus on one key message per slide.",
    },
    "add_visuals": {
      visualUrl: `https://images.unsplash.com/photo-${1550000000 + Math.floor(Math.random() * 10000000)}?w=1280&h=720&fit=crop`,
    },
    "improve_story": {
      content: slide.content.map((c) => `→ ${c}`),
      speakerNotes: slide.speakerNotes + "\n\nStorytelling tip: Begin with 'Imagine if...' to hook the audience.",
    },
    "more_professional": {
      subtitle: "Strategic Analysis · Executive Summary",
      speakerNotes: slide.speakerNotes + "\n\nProfessional tip: Use data-backed statements and avoid superlatives.",
    },
    "reduce_text": {
      content: slide.content.slice(0, 2),
    },
  };

  const patch = refinements[action] || {};
  return { ...slide, ...patch, updatedAt: new Date().toISOString() } as Slide;
}

export function getPresentations(): Presentation[] {
  try {
    const raw = localStorage.getItem("nb_presentations");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePresentation(pres: Presentation): void {
  try {
    const all = getPresentations();
    const idx = all.findIndex((p) => p.id === pres.id);
    if (idx >= 0) all[idx] = pres;
    else all.unshift(pres);
    localStorage.setItem("nb_presentations", JSON.stringify(all));
  } catch {
    console.error("Failed to save presentation");
  }
}

export function deletePresentation(id: string): void {
  try {
    const all = getPresentations().filter((p) => p.id !== id);
    localStorage.setItem("nb_presentations", JSON.stringify(all));
  } catch {
    console.error("Failed to delete presentation");
  }
}
