import type { Presentation } from "@/types/presentation";

// Mocked PPTX/PDF export — simulates file download
export async function exportToPPTX(presentation: Presentation): Promise<void> {
  await new Promise((r) => setTimeout(r, 2000));

  // Generate a simple HTML-based "PPTX" placeholder export
  const slidesHtml = presentation.slides
    .map(
      (slide) => `
      <div class="slide" style="page-break-after: always; padding: 40px; background: #0A0A0F; color: white; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="color: #F5C518; font-size: 2.5rem; margin-bottom: 16px;">${slide.title}</h1>
        ${slide.subtitle ? `<h2 style="color: rgba(255,255,255,0.6); font-size: 1.2rem; margin-bottom: 24px;">${slide.subtitle}</h2>` : ""}
        <ul style="list-style: none; padding: 0;">
          ${slide.content.map((c) => `<li style="padding: 8px 0; color: rgba(255,255,255,0.85); font-size: 1.1rem; border-left: 3px solid #F5C518; padding-left: 16px; margin-bottom: 12px;">${c}</li>`).join("")}
        </ul>
        ${slide.speakerNotes ? `<div style="margin-top: auto; padding-top: 40px; color: rgba(255,255,255,0.4); font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1);">Speaker Notes: ${slide.speakerNotes}</div>` : ""}
      </div>
    `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${presentation.title}</title>
  <style>
    body { margin: 0; font-family: 'Space Grotesk', Arial, sans-serif; background: #0A0A0F; }
    .slide { box-sizing: border-box; }
    @media print { .slide { page-break-after: always; } }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${presentation.title.replace(/\s+/g, "_")}_Nano_Banana.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(presentation: Presentation): Promise<void> {
  await new Promise((r) => setTimeout(r, 1500));
  await exportToPPTX(presentation); // Export as HTML (print to PDF)
}

export async function exportToJSON(presentation: Presentation): Promise<void> {
  const json = JSON.stringify(presentation, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${presentation.title.replace(/\s+/g, "_")}_data.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
