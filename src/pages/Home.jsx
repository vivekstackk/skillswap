import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const skillProjects = [
  {
    title: "CODING\nFull-Stack",
    categories: ["Tech & Build", "Web & Mobile"],
    color: "#9be878",
    leftImage: "/skills/coding-01.jpeg",
    rightImage: "/skills/graphic-design-01.jpeg",
    link: "/browse?q=coding",
  },
  {
    title: "DANCE\nCreative",
    categories: ["Move & Energy", "Rhythm & Flow"],
    color: "#ff90c8",
    leftImage: "/skills/dance-01.jpeg",
    rightImage: "/skills/dance-02.jpeg",
    link: "/browse?q=dance",
  },
  {
    title: "COOKING\nCraft",
    categories: ["Food & Flavor", "Recipe & Culture"],
    color: "#ffb366",
    leftImage: "/skills/cooking-01.jpeg",
    rightImage: "/skills/fashion-01.jpeg",
    link: "/browse?q=cooking",
  },
  {
    title: "DESIGN\nVisual",
    categories: ["Graphics & Ideas", "Brand & Identity"],
    color: "#99f8ff",
    leftImage: "/skills/graphic-design-02.jpeg",
    rightImage: "/skills/video-editing-01.jpeg",
    link: "/browse?q=design",
  },
  {
    title: "MUSIC\nPerformance",
    categories: ["Sound & Create", "Instrument & Voice"],
    color: "#dcc7ff",
    leftImage: "/skills/music-01.jpeg",
    rightImage: "/skills/painting-01.jpeg",
    link: "/browse?q=music",
  },
  {
    title: "CHESS\nStrategy",
    categories: ["Think & Plan", "Competitive Play"],
    color: "#fff8a5",
    leftImage: "/skills/chess-01.jpeg",
    rightImage: "/skills/photography-01.jpeg",
    link: "/browse?q=chess",
  },
];

export default function Home() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const total = skillProjects.length;
    const lerpFactor = 0.06; // Lower = slower/smoother glide (0.03–0.1)

    // Store current animated values per panel
    const animated = Array.from({ length: total }, () => ({ left: 0, right: 0, contentY: 0, contentOp: 1 }));
    let rafId;

    const getTargets = () => {
      const wrap = wrapRef.current;
      if (!wrap) return null;

      const wrapRect = wrap.getBoundingClientRect();
      const scrolled = -wrapRect.top;
      const totalScroll = wrap.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return null;

      const segmentSize = totalScroll / (total - 1);
      const targets = [];

      for (let i = 0; i < total; i++) {
        const exitStart = i * segmentSize;
        const progress = Math.max(0, Math.min((scrolled - exitStart) / segmentSize, 1));

        if (i < total - 1) {
          targets.push({
            left: -progress * 100,
            right: progress * 100,
            contentY: -progress * 80,
            contentOp: 1 - progress,
          });
        } else {
          targets.push({ left: 0, right: 0, contentY: 0, contentOp: 1 });
        }
      }
      return targets;
    };

    const lerp = (current, target, factor) => current + (target - current) * factor;

    const animate = () => {
      const targets = getTargets();
      if (!targets) { rafId = requestAnimationFrame(animate); return; }

      const wrap = wrapRef.current;
      if (!wrap) return;
      const panels = wrap.querySelectorAll(".gg-panel");

      panels.forEach((panel, i) => {
        const t = targets[i];
        const a = animated[i];

        // Lerp toward targets
        a.left = lerp(a.left, t.left, lerpFactor);
        a.right = lerp(a.right, t.right, lerpFactor);
        a.contentY = lerp(a.contentY, t.contentY, lerpFactor);
        a.contentOp = lerp(a.contentOp, t.contentOp, lerpFactor);

        const leftHalf = panel.querySelector(".gg-split-left");
        const rightHalf = panel.querySelector(".gg-split-right");
        const content = panel.querySelector(".gg-panel-content");

        if (leftHalf) leftHalf.style.transform = `translate3d(0, ${a.left}%, 0)`;
        if (rightHalf) rightHalf.style.transform = `translate3d(0, ${a.right}%, 0)`;
        if (content) {
          content.style.transform = `translate3d(0, ${a.contentY}px, 0)`;
          content.style.opacity = `${Math.max(0, a.contentOp)}`;
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="gg-home">
      <nav className="gg-nav">
        <Link to="/" className="gg-nav-brand">Skill</Link>
        <div className="gg-nav-centre">
          <Link to="/browse">Discover</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/add-skill">Add Skill</Link>
        </div>
        <Link to="/" className="gg-nav-brand">Swap</Link>
      </nav>

      <div className="gg-scroll-wrap" ref={wrapRef}>
        <div className="gg-panels-viewport">
          {skillProjects.map((project, i) => (
            <section
              key={i}
              className="gg-panel"
              style={{
                "--accent": project.color,
                zIndex: skillProjects.length - i,
              }}
            >
              <div className="gg-panel-split">
                <div className="gg-split-left">
                  <img src={project.leftImage} alt="" loading={i < 2 ? "eager" : "lazy"} />
                  <div className="gg-img-darken" />
                </div>
                <div className="gg-split-right">
                  <img src={project.rightImage} alt="" loading={i < 2 ? "eager" : "lazy"} />
                  <div className="gg-img-darken" />
                </div>
              </div>

              <div className="gg-panel-content">
                <div className="gg-panel-cats">
                  {project.categories.map((c, ci) => (
                    <span key={ci}>{c}</span>
                  ))}
                </div>
                <h2 className="gg-panel-title">{project.title}</h2>
                <Link to={project.link} className="gg-panel-cta">
                  <span>Explore Skill</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <Link to={project.link} className="gg-panel-link" aria-label={`View ${project.title}`} />
            </section>
          ))}
        </div>
      </div>

      <div className="gg-footer-brand">
        <span>SKILL</span><span>&</span><span>SWAP</span>
      </div>

      <div className="gg-marquee">
        <div className="gg-marquee-track">
          <span>NO GATEKEEPING</span><span>REAL PEOPLE</span><span>USEFUL SKILLS</span>
          <span>TIME FOR TIME</span><span>TRADE WHAT YOU KNOW</span><span>LEARN FROM ANYONE</span>
          <span>NO GATEKEEPING</span><span>REAL PEOPLE</span><span>USEFUL SKILLS</span>
          <span>TIME FOR TIME</span><span>TRADE WHAT YOU KNOW</span><span>LEARN FROM ANYONE</span>
        </div>
      </div>

      <section className="gg-how-section">
        <div className="gg-how-head">
          <div className="gg-how-eyebrow">HOW IT WORKS</div>
          <h2 className="gg-how-title">Trade what<br/>you know.</h2>
        </div>
        <div className="gg-how-grid">
          <div className="gg-how-card"><div className="gg-how-num">01</div><h3>DISCOVER</h3><p>Browse practical skills from real people — from Python and UI design to cooking, music and creative work.</p></div>
          <div className="gg-how-card"><div className="gg-how-num">02</div><h3>CONNECT</h3><p>Open a skill, watch the lessons and reach out when you find someone whose experience fits what you want to learn.</p></div>
          <div className="gg-how-card"><div className="gg-how-num">03</div><h3>CONTRIBUTE</h3><p>Publish your own knowledge, record lectures and earn time credits you can use to unlock other skills.</p></div>
        </div>
      </section>

      <section className="gg-cta-section">
        <div className="gg-cta-inner">
          <div><div className="gg-how-eyebrow">START HERE</div><h2 className="gg-how-title">Find your<br/>next skill.</h2></div>
          <Link to="/browse" className="gg-cta-btn">Explore the library <ArrowUpRight size={15}/></Link>
        </div>
      </section>

      <footer className="gg-footer">
        <span>SKILLSWAP © 2026</span><span>BUILT FOR CURIOUS PEOPLE</span>
      </footer>
    </div>
  );
}
