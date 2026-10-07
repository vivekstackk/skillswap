import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseClient";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Camera, Check, ArrowUpRight } from "lucide-react";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserEmail(user.email || "");
  }, []);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUsername(data.username || ""); setBio(data.bio || ""); setAvatar(data.avatar || null); setUploadedImg(data.uploadedImg || null);
          localStorage.setItem("userProfile", JSON.stringify(data));
        }
      } catch (e) { console.error("Error loading profile:", e); }
    };
    load();
  }, []);

  const avatars = [
    "https://cdn-icons-png.flaticon.com/512/706/706830.png", "https://cdn-icons-png.flaticon.com/512/706/706816.png", "https://cdn-icons-png.flaticon.com/512/706/706814.png", "https://cdn-icons-png.flaticon.com/512/706/706807.png", "https://cdn-icons-png.flaticon.com/512/706/706890.png", "https://cdn-icons-png.flaticon.com/512/706/706847.png"
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = (event) => { setUploadedImg(event.target.result); setAvatar(null); }; reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) { alert("Please log in first!"); return; }
    const data = { email: userEmail, username, bio, avatar, uploadedImg, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, "users", user.uid), data, { merge: true });
      localStorage.setItem("userProfile", JSON.stringify(data));
      window.dispatchEvent(new Event("storage"));
      setShowPopup(true);
    } catch (error) { console.error(error); alert("Failed to save profile. Please try again."); }
  };

  const image = uploadedImg || avatar;

  return (
    <section className="section pt-10">
      <div className="mb-10"><div className="eyebrow">PROFILE / YOUR SPACE</div><h1 className="display">Make your<br/>mark.</h1><p className="muted max-w-xl text-sm mt-5 leading-relaxed">Tell the community what you know, what you want to learn, and who they are swapping time with.</p></div>
      <div className="profile-grid">
        <div className="panel profile-avatar-panel">
          <div className="relative">
            <label className="block cursor-pointer">
              <div className="profile-avatar bg-[#101010] grid place-items-center overflow-hidden">
                {image ? <img src={image} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="text-white/35" size={48} strokeWidth={1} />}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/>
            </label>
            <div className="absolute right-2 bottom-2 w-10 h-10 bg-[#9be878] text-black grid place-items-center"><Camera size={16}/></div>
          </div>
          <div className="eyebrow mt-7">CHOOSE AN AVATAR</div>
          <div className="avatar-options">{avatars.map((img,i)=><img key={i} src={img} alt={`Avatar ${i+1}`} className={avatar===img ? "selected" : ""} onClick={()=>{setAvatar(img);setUploadedImg(null)}} />)}</div>
          <p className="muted text-[10px] uppercase mt-5">Or upload your own image</p>
        </div>

        <div className="panel profile-form">
          <div className="eyebrow">IDENTITY / 01</div>
          <div className="two-col mt-7">
            <label><span className="form-label">Username</span><input className="form-input" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="your_name"/></label>
            <label><span className="form-label">Email</span><input className="form-input opacity-55" value={userEmail} readOnly/></label>
          </div>
          <label className="block mt-5"><span className="form-label">Short bio</span><textarea className="form-textarea" rows={7} value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="What do you know? What are you curious about?"/></label>
          <div className="border-t border-white/10 mt-7 pt-5 flex items-center justify-between gap-4"><span className="muted text-[10px] uppercase">Your profile is shared with the SkillSwap community.</span><button onClick={handleSave} className="btn btn-green">Save profile <ArrowUpRight size={14}/></button></div>
        </div>
      </div>

      {showPopup && <div className="modal-backdrop"><div className="modal max-w-md text-center"><div className="mx-auto w-14 h-14 rounded-full bg-[#9be878] text-black grid place-items-center"><Check size={24}/></div><div className="eyebrow mt-5">SAVED / 01</div><h2 className="text-3xl font-black uppercase mt-2">Profile updated.</h2><p className="muted text-sm mt-3">Your identity is ready for the next skill swap.</p><button onClick={()=>setShowPopup(false)} className="btn btn-green mt-6 w-full">Done</button></div></div>}
    </section>
  );
}
