import { useState } from "react";
import type { Presentation } from "@/types/presentation";
import SlidePreview from "@/components/SlidePreview";
import { Plus, ChevronUp, ChevronDown, Copy, Trash2, GripVertical } from "lucide-react";

interface PresentationSidebarProps {
  presentation: Presentation;
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onReorderSlides: (from: number, to: number) => void;
}

export default function PresentationSidebar({
  presentation,
  activeSlideIndex,
  onSelectSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onReorderSlides,
}: PresentationSidebarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      onReorderSlides(draggingIndex, index);
    }
    setDraggingIndex(null);
  }

  return (
    <div className="w-56 flex-shrink-0 flex flex-col h-full"
      style={{ background: "rgba(10,10,15,0.8)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <div className="text-xs font-semibold text-white/70">Slides</div>
          <div className="text-xs text-white/30">{presentation.slides.length} total</div>
        </div>
        <button className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
          style={{ background: "rgba(245,197,24,0.15)", color: "#F5C518" }}
          title="Add slide">
          <Plus size={13} />
        </button>
      </div>

      {/* Slide List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`group relative rounded-lg cursor-pointer transition-all ${draggingIndex === index ? "opacity-40" : ""}`}
            style={{
              padding: "6px",
              background: activeSlideIndex === index ? "rgba(245,197,24,0.08)" : "transparent",
              border: `1px solid ${activeSlideIndex === index ? "rgba(245,197,24,0.3)" : "transparent"}`,
            }}
            onClick={() => onSelectSlide(index)}
          >
            {/* Drag handle */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity"
              style={{ color: "white" }}>
              <GripVertical size={12} />
            </div>

            <div className="flex gap-2 items-start pl-3">
              {/* Slide number */}
              <span className="text-[10px] font-bold text-white/30 mt-1 w-4 flex-shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Thumbnail */}
              <div className="flex-1" style={{ width: "120px", maxWidth: "120px" }}>
                <SlidePreview
                  slide={slide}
                  isActive={activeSlideIndex === index}
                />
              </div>
            </div>

            {/* Slide type label */}
            <div className="px-3 pt-1.5">
              <div className="text-[9px] text-white/40 truncate">{slide.title}</div>
            </div>

            {/* Action buttons */}
            {hoveredIndex === index && (
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicateSlide(index); }}
                  className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                  title="Duplicate">
                  <Copy size={9} color="white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteSlide(index); }}
                  className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                  style={{ background: "rgba(239,68,68,0.2)" }}
                  title="Delete">
                  <Trash2 size={9} color="#ef4444" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-xs text-white/30">
          ~{presentation.estimatedDuration} min presentation
        </div>
      </div>
    </div>
  );
}
