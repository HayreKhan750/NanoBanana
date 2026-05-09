import { useState, useCallback } from "react";
import type { Presentation, GenerationConfig } from "@/types/presentation";
import { generatePresentation, savePresentation } from "@/lib/aiService";
import { toast } from "sonner";

interface GenerationState {
  isGenerating: boolean;
  progress: number;
  stage: string;
  presentation: Presentation | null;
  error: string | null;
}

const GENERATION_STAGES = [
  { progress: 10, label: "Analyzing your input..." },
  { progress: 25, label: "Extracting key concepts..." },
  { progress: 40, label: "Building slide structure..." },
  { progress: 55, label: "Generating storytelling flow..." },
  { progress: 70, label: "Creating visual layouts..." },
  { progress: 82, label: "Generating AI visuals..." },
  { progress: 92, label: "Composing speaker notes..." },
  { progress: 98, label: "Finalizing presentation..." },
];

export function usePresentationGeneration() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    stage: "",
    presentation: null,
    error: null,
  });

  const generate = useCallback(async (config: GenerationConfig) => {
    setState({ isGenerating: true, progress: 0, stage: "Initializing AI engine...", presentation: null, error: null });

    // Animate through stages
    let stageIndex = 0;
    const interval = setInterval(() => {
      if (stageIndex < GENERATION_STAGES.length) {
        const s = GENERATION_STAGES[stageIndex];
        setState((prev) => ({ ...prev, progress: s.progress, stage: s.label }));
        stageIndex++;
      }
    }, 380);

    try {
      const presentation = await generatePresentation(config);
      clearInterval(interval);

      setState({ isGenerating: false, progress: 100, stage: "Complete!", presentation, error: null });
      savePresentation(presentation);
      toast.success("Presentation generated successfully!", {
        description: `${presentation.slides.length} slides · ${presentation.estimatedDuration} min read`,
      });
      return presentation;
    } catch (err) {
      clearInterval(interval);
      const errorMessage = err instanceof Error ? err.message : "Generation failed";
      setState((prev) => ({ ...prev, isGenerating: false, error: errorMessage }));
      toast.error("Generation failed", { description: errorMessage });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isGenerating: false, progress: 0, stage: "", presentation: null, error: null });
  }, []);

  return { ...state, generate, reset };
}
