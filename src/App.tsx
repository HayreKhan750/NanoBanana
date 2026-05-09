import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import LandingPage from "@/pages/LandingPage";
import GeneratePage from "@/pages/GeneratePage";
import PresentationStudio from "@/pages/PresentationStudio";
import LibraryPage from "@/pages/LibraryPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/studio/:id" element={<PresentationStudio />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1A1A2E",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            fontFamily: "Space Grotesk, Inter, sans-serif",
          },
        }}
      />
    </BrowserRouter>
  );
}
