import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebaseClient";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { skills as mockSkills, avatars } from "../data/skillsData";
import { ArrowUpRight, Search } from "lucide-react";

export default function BrowseSkills() {
  const [skills, setSkills] = useState(mockSkills);
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  useEffect(() => setCredits(Number(localStorage.getItem("timeCredits") || 0)), []);

  useEffect(() => {
    const q = query(collection(db, "skills"), where("published", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data(), creditsRequired: d.data().creditsRequired || 5 })));
      } else {
        setSkills(mockSkills.map((s) => ({ ...s, creditsRequired: s.creditsRequired || 5 })));
      }
    }, () => setSkills(mockSkills.map((s) => ({ ...s, creditsRequired: s.creditsRequired || 5 }))));
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return skills;
    return skills.filter((s) => `${s.skill || s.name} ${s.description || ""} ${s.authorName || ""}`.toLowerCase().includes(searchTerm));
  }, [skills, searchTerm]);

  const handleViewSkill = (skill) => {
    const needed = Number(skill.creditsRequired || 0);
    if (credits < needed) {
      const missing = needed - credits;
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = `You need ${missing} more time credits.`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3200);
      return;
    }
    navigate(`/skill/${skill.id}`);
  };

  return (
    <>
      <section className="browse-hero">
        <div>
          <div className="eyebrow">WORK / SKILLS LIBRARY</div>
          <h1 className="display">{searchTerm ? <>RESULTS<br/>FOR “{searchTerm}”</> : <>FIND<br/>A SKILL.</>}</h1>
        </div>
        <div>
          <div className="muted text-sm leading-relaxed mb-6">A growing library of lessons made by people who know how to do the thing. Unlock a skill with time credits.</div>
          <form className="browse-search" onSubmit={(e) => { e.preventDefault(); const q=e.currentTarget.elements.q.value.trim(); navigate(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse"); }}>
            <Search size={16} className="mr-3 text-white/45" />
            <input name="q" defaultValue={searchTerm} placeholder="SEARCH PYTHON, MUSIC, DESIGN..." />
            <button type="submit">SEARCH</button>
          </form>
        </div>
      </section>

      <div className="flex items-center justify-between border-y border-white/10 py-3 mb-5 text-[10px] uppercase font-black">
        <span className="text-white/45">{filtered.length} SKILLS AVAILABLE</span>
        <span className="text-[#9be878]">YOUR BALANCE / {credits} CREDITS</span>
      </div>

      <div className="skill-grid">
        {filtered.length ? filtered.map((skill, idx) => (
          <article key={skill.id || idx} className="skill-card">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <span className="skill-number">{String(idx + 1).padStart(2, "0")}</span>
              <span className="pill green">{skill.creditsRequired || 5} CR</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <img src={avatars[idx % avatars.length]} alt="" className="w-9 h-9 rounded-full object-cover border border-white/20" />
                <div className="text-[10px] uppercase font-black text-white/50">{skill.authorName || skill.name}</div>
              </div>
              <h2 className="skill-title">{skill.skill || skill.name}</h2>
              <p className="skill-description mt-3">{skill.description}</p>
            </div>
            <div className="skill-bottom relative z-10">
              <span>SKILL / OFFERED</span>
              <button className="btn btn-green !px-3 !py-2" onClick={() => handleViewSkill(skill)}>OPEN <ArrowUpRight size={13}/></button>
            </div>
          </article>
        )) : (
          <div className="panel p-12 col-span-full text-center">
            <div className="eyebrow">NO MATCHES</div>
            <h2 className="text-3xl font-black uppercase mt-2">Try another skill.</h2>
          </div>
        )}
      </div>
    </>
  );
}
