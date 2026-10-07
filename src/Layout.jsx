import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { Search, Sun, Moon, ArrowUpRight, X } from "lucide-react";
import BackToHome from "./components/BackToHome";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [credits, setCredits] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const nextDark = storedTheme ? storedTheme === "dark" : true;
    setDarkMode(nextDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoggedIn(!!u);
      if (!u) {
        setShowProfilePrompt(false);
        setUserAvatar(null);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const data = snap.data();
          const avatar = data.uploadedImg || data.avatar || null;
          setUserAvatar(avatar);
          localStorage.setItem("userProfile", JSON.stringify(data));
          if (!data.username && !localStorage.getItem("profilePromptDismissed")) {
            setShowProfilePrompt(true);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
      setCredits(Number(localStorage.getItem("timeCredits") || 0));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadLocal = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("userProfile") || "null");
        setUserAvatar(saved?.uploadedImg || saved?.avatar || null);
        setCredits(Number(localStorage.getItem("timeCredits") || 0));
      } catch {
        setUserAvatar(null);
      }
    };
    loadLocal();
    window.addEventListener("storage", loadLocal);
    document.addEventListener("creditsUpdated", loadLocal);
    return () => {
      window.removeEventListener("storage", loadLocal);
      document.removeEventListener("creditsUpdated", loadLocal);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userProfile");
      setLoggedIn(false);
      setUserAvatar(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    if (!q) return;
    navigate(`/browse?q=${encodeURIComponent(q)}`);
    setSearchText("");
    setShowSearch(false);
  };

  const tabs = [
    { name: "DISCOVER", to: "/browse" },
    { name: "PROFILE", to: "/profile" },
    { name: "MESSAGES", to: "/messages" },
    { name: "ADD SKILL", to: "/add-skill" },
  ];

  const isActive = (to) => location.pathname === to || (to === "/browse" && location.pathname.startsWith("/skill/"));

  return (
    <div className="app-shell">
      <main className="app-main">
        {location.pathname !== '/' && (
          <header className="site-header">
            <Link to="/" className="site-brand" aria-label="SkillSwap home">
              <span>SKILL</span><span className="site-brand-mark">SWAP</span>
            </Link>

            <nav className="site-nav" aria-label="Primary navigation">
              {tabs.map((tab) => (
                <Link key={tab.to} to={tab.to} className={isActive(tab.to) ? "active" : ""}>
                  {tab.name}
                </Link>
              ))}
            </nav>

            <div className="site-actions">
              <button className="site-action" onClick={() => setShowSearch((v) => !v)} aria-label="Search">
                <Search size={15} strokeWidth={2.2} />
              </button>
              {loggedIn && <span className="site-action hidden sm:inline">{credits} CR</span>}
              {loggedIn ? (
                <>
                  <button className="site-action" onClick={handleLogout}>LOG OUT</button>
                  {userAvatar && <AvatarDropdown userAvatar={userAvatar} />}
                </>
              ) : (
                <Link to="/login" className="site-action">LOG IN</Link>
              )}
              <button className="site-action" onClick={() => setDarkMode((v) => !v)} aria-label="Toggle theme">
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            {showSearch && (
              <form className="search-popover" onSubmit={handleSearchSubmit}>
                <input autoFocus value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="SEARCH SKILLS" />
                <button type="submit">GO <ArrowUpRight size={13} /></button>
                <button type="button" onClick={() => setShowSearch(false)} aria-label="Close search" style={{background:"transparent",color:"inherit",padding:"8px"}}><X size={15}/></button>
              </form>
            )}
          </header>
        )}

        {showProfilePrompt && (
          <div className="fixed right-5 top-16 z-[80] panel p-4 w-[290px] shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="eyebrow">PROFILE / 01</div>
                <h3 className="mt-1 text-lg font-black uppercase tracking-tight">Finish your profile</h3>
              </div>
              <button className="site-action" onClick={() => { setShowProfilePrompt(false); localStorage.setItem("profilePromptDismissed", "true"); }}>×</button>
            </div>
            <p className="muted text-xs leading-relaxed mt-3">Add a username and bio so other people know who they are swapping skills with.</p>
            <Link className="btn btn-green mt-4 w-full" to="/profile" onClick={() => { setShowProfilePrompt(false); localStorage.setItem("profilePromptDismissed", "true"); }}>Create profile <ArrowUpRight size={14}/></Link>
          </div>
        )}

        {location.pathname === '/' ? (
          <Outlet />
        ) : (
          <div className="page-wrap">
            {/* Minimal inline Back to Home — not fixed, not overlapping, theme-matched */}
            <div className="back-home-row">
              <BackToHome />
            </div>
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}

function AvatarDropdown({ userAvatar }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("SKILLSWAP MEMBER");
  const [credits, setCredits] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("userProfile") || "null");
      if (saved?.username) setUserName(saved.username);
      setCredits(Number(localStorage.getItem("timeCredits") || 0));
    } catch {}
  }, [open]);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <img src={userAvatar} alt="Profile" className="avatar-dot" onClick={() => setOpen((v) => !v)} />
      {open && (
        <div className="absolute right-0 top-11 z-[100] panel p-4 w-48">
          <div className="text-xs font-black uppercase truncate">{userName}</div>
          <div className="muted text-[10px] mt-1 uppercase">{credits} time credits</div>
        </div>
      )}
    </div>
  );
}
