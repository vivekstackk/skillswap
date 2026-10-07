import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider } from "../firebaseClient";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ArrowUpRight, Sparkles, Clock, Users } from "lucide-react";
import BackToHome from "../components/BackToHome";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userEmail", cred.user.email);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("userEmail", result.user.email);
      navigate("/");
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="login-shell">
      {/* LEFT — abstract CSS animation, no video */}
      <div className="login-visual">
        <div className="login-abstract">
          <div className="login-abstract-grid" />
          <div className="login-orb login-orb--1" />
          <div className="login-orb login-orb--2" />
          <div className="login-orb login-orb--3" />
          <div className="login-rings">
            <span />
            <span />
            <span />
          </div>
          <div className="login-float-cards" aria-hidden>
            <div className="lfc lfc--1"><span>PYTHON</span><em>Code &amp; Build</em></div>
            <div className="lfc lfc--2"><span>GUITAR</span><em>Sound &amp; Play</em></div>
            <div className="lfc lfc--3"><span>DESIGN</span><em>Visual &amp; Identity</em></div>
          </div>
          <div className="login-marquee" aria-hidden>
            <div className="login-marquee-track">
              <span>TRADE TIME — NOT MONEY</span><span>LEARN FROM HUMANS</span><span>TEACH WHAT YOU KNOW</span>
              <span>TRADE TIME — NOT MONEY</span><span>LEARN FROM HUMANS</span><span>TEACH WHAT YOU KNOW</span>
            </div>
          </div>
        </div>

        <div className="login-visual-top">
          <span className="login-topline">SKILLSWAP / EST. 2026 — TIME FOR TIME</span>
        </div>

        <div className="login-visual-copy">
          <div className="eyebrow" style={{ color: "#9be878" }}>SKILLSWAP / MEMBERS</div>
          <h1>COME<br />SWAP<span>.</span></h1>
          <p>Trade time, not money. Teach what you know, learn what you need — from real people.</p>
          <div className="login-visual-stats">
            <span><b>25+</b> SKILLS</span>
            <span><b>100%</b> HUMAN</span>
            <span><b>1:1</b> TIME CREDIT</span>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="login-panel">
        <div className="login-card">
          <div className="back-home-row" style={{ borderBottom: "1px solid rgba(255,255,255,.08)", marginBottom: 16, paddingTop: 0 }}>
            <BackToHome />
          </div>
          <Link to="/" className="login-brand">SKILL<span>SWAP</span></Link>
          <div className="eyebrow mt-4">WELCOME BACK</div>
          <h2>Log in.<br />Keep learning.</h2>
          <p className="muted text-sm leading-relaxed mt-3 max-w-sm">Your next useful skill is one conversation away. Sign in to continue swapping.</p>

          <form onSubmit={handleEmailLogin} className="stack">
            <label>
              <span className="form-label">Email</span>
              <input className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required autoComplete="email" />
            </label>
            <label>
              <span className="form-label">Password</span>
              <input className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required autoComplete="current-password" />
            </label>
            {error && <div className="text-xs text-red-400 border border-red-400/30 p-3 leading-relaxed">{error}</div>}
            <button className="btn btn-green w-full !py-3.5 !text-xs" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Log in"} <ArrowUpRight size={14} />
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-black tracking-widest text-white/35 uppercase">OR</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button onClick={handleGoogle} className="btn w-full !py-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="#fff" d="M21.8 12.2c0-.7-.06-1.36-.17-2H12v3.78h5.5c-.24 1.27-.97 2.35-2.07 3.07v2.55h3.35c1.96-1.8 3.09-4.46 3.02-7.4z"/><path fill="#fff" opacity=".7" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.35-2.55A6.9 6.9 0 0 1 12 18.1c-2.63 0-4.86-1.77-5.65-4.16H2.87v2.63A10 10 0 0 0 12 22z"/><path fill="#fff" opacity=".7" d="M6.35 13.94A6.37 6.37 0 0 1 6 12s0-.67.35-1.94V7.43H2.87A10 10 0 0 0 2 12c0 .9.11 1.78.32 2.63l3.35-2.63.68.94z"/><path fill="#fff" opacity=".7" d="M12 5.9c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.84 9.84 0 0 0 12 2a10 10 0 0 0-9.13 5.43l3.48 2.63C7.14 7.67 9.37 5.9 12 5.9z"/></svg>
            Continue with Google <ArrowUpRight size={14} />
          </button>

          <div className="login-features">
            <span><Clock size={13} /> Time credits, not cash</span>
            <span><Users size={13} /> Real humans, no gatekeeping</span>
            <span><Sparkles size={13} /> Teach once, learn forever</span>
          </div>

          <div className="mt-6 text-[10px] uppercase font-black tracking-wide text-white/30 leading-relaxed">By continuing you agree to use SkillSwap respectfully and keep the exchange human.</div>
        </div>
      </div>
    </div>
  );
}
