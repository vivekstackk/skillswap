import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import videoIcon from "../assets/video-24.png";
import notesIcon from "../assets/notes-24.png";
import { Plus, Trash2, Eye, Video, FileText, ArrowUpRight } from "lucide-react";

export default function AddSkill() {
  const [skill, setSkill] = useState({ name:"", description:"", category:"", lectures:[], published:false });
  const [lectureType, setLectureType] = useState("video");
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.recordedVideo && typeof location.state.recordedIndex === "number") {
      const {recordedVideo, recordedIndex}=location.state;
      setSkill(prev=>{const updated=[...prev.lectures];while(updated.length<=recordedIndex)updated.push({title:`Lecture ${updated.length+1}`,content:""});updated[recordedIndex]={...updated[recordedIndex],content:recordedVideo};return {...prev,lectures:updated};});
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const addLecture=()=>setSkill(prev=>({...prev,lectures:[...prev.lectures,{title:`Lecture ${prev.lectures.length+1}`,content:""}]}));
  const removeLecture=(index)=>setSkill(prev=>({...prev,lectures:prev.lectures.filter((_,i)=>i!==index).map((l,i)=>({...l,title:`Lecture ${i+1}`}))}));
  const handleLectureChange=(index,field,value)=>setSkill(prev=>{const updated=[...prev.lectures];updated[index]={...updated[index],[field]:value};return {...prev,lectures:updated};});
  const calculateCredits=(lectures)=>lectures.length*5+(lectures.some(l=>l.content?.startsWith("blob:"))?10:0);

  const handleSave=async()=>{
    if(!skill.name.trim()){alert("Enter skill name!");return;}
    setSaving(true);
    try{
      const credits=calculateCredits(skill.lectures);const prevCredits=Number(localStorage.getItem("timeCredits")||0);localStorage.setItem("timeCredits",prevCredits+credits);document.dispatchEvent(new Event("creditsUpdated"));
      const toast=document.createElement("div");toast.className="toast";toast.textContent=`Published setup saved · +${credits} time credits`;document.body.appendChild(toast);setTimeout(()=>toast.remove(),3200);
      setSkill({name:"",description:"",category:"",lectures:[],published:false});
    }catch(err){console.error(err);alert("Something went wrong.");}finally{setSaving(false);}
  };

  const goToRecord=(index)=>{if(index>=skill.lectures.length)setSkill(prev=>{const updated=[...prev.lectures];while(updated.length<=index)updated.push({title:`Lecture ${updated.length+1}`,content:""});return {...prev,lectures:updated};});navigate("/record",{state:{recordedIndex:index}});};

  return (
    <section className="section pt-10">
      <div className="mb-9 flex items-end justify-between gap-6"><div><div className="eyebrow">CREATE / SHARE WHAT YOU KNOW</div><h1 className="display">Publish<br/>a skill.</h1></div><div className="hidden md:block muted max-w-sm text-sm leading-relaxed">Turn your knowledge into a small learning experience. Add lessons, record a lecture, then publish it for other members.</div></div>
      <div className="add-grid">
        <div className="panel p-6 md:p-8">
          <div className="eyebrow">01 / SKILL INFO</div>
          <div className="mt-7 space-y-5">
            <label><span className="form-label">Skill name</span><input className="form-input" value={skill.name} onChange={e=>setSkill({...skill,name:e.target.value})} placeholder="e.g. Video Editing"/></label>
            <label><span className="form-label">Description</span><textarea className="form-textarea" rows={7} value={skill.description} onChange={e=>setSkill({...skill,description:e.target.value})} placeholder="What will someone be able to do after learning this?"/></label>
            <label><span className="form-label">Category</span><input className="form-input" value={skill.category} onChange={e=>setSkill({...skill,category:e.target.value})} placeholder="DESIGN / CODING / MUSIC / ..."/></label>
          </div>
          <div className="border-t border-white/10 mt-7 pt-5">
            <div className="form-label">Lesson format</div>
            <div className="grid grid-cols-2 gap-2">
              <button className={`btn ${lectureType==="video"?"btn-green":""}`} onClick={()=>setLectureType("video")}><img src={videoIcon} className="w-4 h-4" alt=""/> Video</button>
              <button className={`btn ${lectureType==="text"?"btn-green":""}`} onClick={()=>setLectureType("text")}><img src={notesIcon} className="w-4 h-4" alt=""/> Text</button>
            </div>
          </div>
          <label className="flex items-center gap-3 mt-6 text-xs uppercase font-black"><input type="checkbox" checked={skill.published} onChange={e=>setSkill({...skill,published:e.target.checked})} className="accent-[#9be878]"/> Publish this skill for everyone</label>
          <div className="flex gap-2 mt-8"><button className="btn flex-1" onClick={()=>setPreviewOpen(true)}><Eye size={14}/> Preview</button><button className="btn btn-green flex-1" disabled={saving} onClick={handleSave}>{saving?"SAVING...":"SAVE SKILL"}<ArrowUpRight size={14}/></button></div>
        </div>

        <div className="panel">
          <div className="p-6 md:p-8 flex items-end justify-between gap-4"><div><div className="eyebrow">02 / CURRICULUM</div><h2 className="text-3xl md:text-5xl font-black uppercase tracking-[-.07em] mt-2">Your lessons.</h2></div><button className="btn btn-green" onClick={addLecture}><Plus size={14}/> Add</button></div>
          {skill.lectures.length===0 ? <div className="border-t border-white/10 p-12 text-center"><FileText className="mx-auto text-white/20" size={34}/><div className="eyebrow mt-4">EMPTY / 00</div><p className="muted text-xs mt-2">Add your first lesson to start building the skill.</p></div> : skill.lectures.map((lec,index)=><div className="lecture-editor" key={index}>
            <div className="flex justify-between items-center gap-4 mb-4"><div><div className="text-[10px] font-mono text-white/35">{String(index+1).padStart(2,"0")}</div><input className="bg-transparent border-0 outline-0 uppercase font-black text-lg w-full text-white" value={lec.title} onChange={e=>handleLectureChange(index,"title",e.target.value)}/></div><button className="text-red-400 hover:text-red-300" onClick={()=>removeLecture(index)} title="Remove"><Trash2 size={15}/></button></div>
            {lectureType==="video" ? lec.content ? <video controls src={lec.content} className="w-full aspect-video object-cover bg-black"/> : <div className="space-y-3"><button onClick={()=>goToRecord(index)} className="btn btn-green w-full"><Video size={14}/> Record lecture</button><input className="form-input" placeholder="Or paste a YouTube link" value={lec.content} onChange={e=>handleLectureChange(index,"content",e.target.value)}/></div> : <textarea className="form-textarea" placeholder="Write the tutorial..." value={lec.content} onChange={e=>handleLectureChange(index,"content",e.target.value)}/>}</div>)}
        </div>
      </div>

      {previewOpen && <div className="modal-backdrop" onClick={()=>setPreviewOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><div className="eyebrow">PREVIEW / SKILL</div><h2 className="text-4xl font-black uppercase mt-2">{skill.name||"Untitled skill"}</h2></div><button className="btn" onClick={()=>setPreviewOpen(false)}>Close</button></div><p className="muted text-sm mt-5">{skill.description||"No description yet."}</p><div className="mt-7">{skill.lectures.length===0?<div className="panel p-8 text-center muted text-xs uppercase">No lessons yet.</div>:skill.lectures.map((lec,i)=><div key={i} className="panel p-4 mb-3"><div className="eyebrow">{String(i+1).padStart(2,"0")}</div><h3 className="font-black uppercase mt-1">{lec.title}</h3>{lec.content?.startsWith("blob:")?<video src={lec.content} controls className="w-full max-h-[420px] mt-4"/>:<p className="muted text-xs mt-3">{lec.content||"No lesson content yet."}</p>}</div>)}</div></div></div>}
    </section>
  );
}
