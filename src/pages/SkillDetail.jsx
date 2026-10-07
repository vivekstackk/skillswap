import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { skills as mockSkills, avatars } from "../data/skillsData";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";

export default function SkillDetail() {
  const { id } = useParams();
  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const snap = await getDoc(doc(db, "skills", id));
        if (snap.exists()) {
          const data = snap.data();
          setSkillData({ id, name: data.authorName || data.name, skill: data.name || data.skill, description: data.description, lectures: data.lectures || [], creditsRequired: data.creditsRequired || 0 });
        } else setSkillData(mockSkills.find((s) => s.id === parseInt(id)) || null);
      } catch {
        setSkillData(mockSkills.find((s) => s.id === parseInt(id)) || null);
      } finally { setLoading(false); }
    };
    fetchSkill();
  }, [id]);

  const handleConnect = () => {
    if (connecting || !skillData) return;
    setConnecting(true);
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = `Connection request sent to ${skillData.name}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); setConnecting(false); }, 3000);
  };

  const getYouTubeId = (url = "") => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  if (loading) return <div className="section text-center"><div className="eyebrow">LOADING / 01</div><h1 className="display">LOADING<br/>SKILL.</h1></div>;
  if (!skillData) return <div className="section text-center"><div className="eyebrow">404 / SKILL</div><h1 className="display">NOT<br/>FOUND.</h1><Link to="/browse" className="btn btn-green mt-8">Back to library</Link></div>;

  const avatar = avatars[(Number(id) || 0) % avatars.length];
  const lectures = skillData.lectures || [];

  return (
    <section className="detail-layout">
      <div className="flex justify-between items-center mb-12">
        <Link to="/browse" className="btn"><ArrowLeft size={14}/> Back to library</Link>
        <button onClick={handleConnect} disabled={connecting} className="btn btn-green">{connecting ? "REQUEST SENT" : "CONNECT WITH CREATOR"} <ArrowUpRight size={14}/></button>
      </div>

      <div className="detail-top">
        <div>
          <div className="eyebrow">SKILL / {String(skillData.creditsRequired || 0).padStart(2,"0")} TIME CREDITS</div>
          <h1 className="detail-title mt-3">{skillData.skill}</h1>
          <div className="flex items-center gap-3 mt-8">
            <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
            <div><div className="text-xs font-black uppercase">{skillData.name}</div><div className="text-[10px] text-white/45 uppercase mt-1">Skill creator</div></div>
          </div>
          <p className="muted max-w-xl mt-7 text-sm leading-relaxed">{skillData.description}</p>
        </div>
        <div className="detail-media">
          {lectures[0]?.url ? <img src={`https://img.youtube.com/vi/${getYouTubeId(lectures[0].url) || ""}/hqdefault.jpg`} alt="Skill preview" /> : <div className="absolute inset-0 grid place-items-center"><div className="eyebrow">SKILLSWAP / LESSON</div></div>}
          <div className="absolute bottom-4 left-4 pill green">{lectures.length} LESSONS</div>
        </div>
      </div>

      <div className="section pb-0">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div><div className="eyebrow">03 / LESSONS</div><h2 className="text-4xl md:text-6xl font-black uppercase tracking-[-.07em] mt-2">Watch & learn.</h2></div>
          <span className="muted text-xs uppercase">{lectures.length} chapters</span>
        </div>
        <div className="lecture-grid">
          {lectures.map((lec, i) => {
            const vid = getYouTubeId(lec.url);
            const active = activeVideo === i;
            return <article className="lecture-card" key={i}>
              {active && vid ? <iframe src={`https://www.youtube.com/embed/${vid}?autoplay=1`} title={lec.title} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : vid ? <button className="relative block w-full group" onClick={() => setActiveVideo(i)}><img className="lecture-thumb" src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={lec.title}/><span className="absolute inset-0 grid place-items-center bg-black/25 group-hover:bg-black/10 transition"><span className="w-12 h-12 rounded-full bg-[#9be878] text-black grid place-items-center"><Play size={18} fill="currentColor"/></span></span></button> : <div className="aspect-video grid place-items-center bg-[#111]"><span className="eyebrow">TEXT LESSON</span></div>}
              <div className="lecture-body"><div className="text-[10px] text-white/40 font-mono">{String(i+1).padStart(2,"0")}</div><h3 className="uppercase font-black text-lg mt-2">{lec.title}</h3></div>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
