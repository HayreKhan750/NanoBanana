import { Link } from "react-router-dom";
import { Home, Zap } from "lucide-react";
import logoImg from "@/assets/logo.png";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0A0A0F" }}>
      <div className="text-center">
        <img src={logoImg} alt="" className="w-16 h-16 object-contain mx-auto mb-6 animate-float" />
        <div className="text-8xl font-black gradient-text-banana mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Slide Not Found</h1>
        <p className="text-white/40 text-lg mb-10 max-w-md mx-auto">
          This page doesn't exist in our presentation. Let's get you back on stage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Home size={16} /> Go Home
          </Link>
          <Link to="/generate"
            className="btn-banana flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
            <Zap size={16} /> Create Presentation
          </Link>
        </div>
      </div>
    </div>
  );
}
