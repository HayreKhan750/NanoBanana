import { Link, useLocation } from "react-router-dom";
import { Zap, Plus, Library, ChevronRight } from "lucide-react";
import logoImg from "@/assets/logo.png";

export default function Header() {
  const location = useLocation();
  const isStudio = location.pathname.startsWith("/studio");
  const isGenerate = location.pathname === "/generate";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-3 flex-1">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.3)" }}>
            <img src={logoImg} alt="Nano Banana" className="w-7 h-7 object-contain" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-none" style={{ color: "#F5C518" }}>Nano Banana</div>
            <div className="text-xs text-white/40 leading-none mt-0.5">AI Presentation Studio</div>
          </div>
        </Link>

        {isStudio && (
          <div className="flex items-center gap-1 ml-4 text-white/30 text-sm">
            <ChevronRight size={14} />
            <span className="text-white/60 font-medium">Studio</span>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-2">
        <Link to="/library"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === "/library" ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/05"}`}>
          <Library size={15} />
          <span className="hidden sm:inline">Library</span>
        </Link>

        {!isGenerate && (
          <Link to="/generate"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold btn-banana">
            <Plus size={15} />
            <span>New Presentation</span>
            <Zap size={13} />
          </Link>
        )}
      </nav>
    </header>
  );
}
