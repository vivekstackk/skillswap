import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebaseClient";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Send, Phone, MessageCircle } from "lucide-react";

export default function Messages() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);
      const snapshot = await getDocs(collection(db, "users"));
      const list = [];
      snapshot.forEach((docSnap) => { const data=docSnap.data(); if(docSnap.id!==u.uid && data.username) list.push({id:docSnap.id,name:data.username,avatar:data.uploadedImg||data.avatar||"/default-avatar.png"}); });
      setFriends(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!selectedChat || !user) return;
    const chatId = user.uid < selectedChat.id ? `${user.uid}_${selectedChat.id}` : `${selectedChat.id}_${user.uid}`;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snap) => setMessages(snap.docs.map((d)=>({id:d.id,...d.data()}))));
    return () => unsub();
  }, [selectedChat, user]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !user || !selectedChat) return;
    const chatId = user.uid < selectedChat.id ? `${user.uid}_${selectedChat.id}` : `${selectedChat.id}_${user.uid}`;
    await addDoc(collection(db, "chats", chatId, "messages"), { text:newMsg.trim(), senderId:user.uid, timestamp:serverTimestamp() });
    setNewMsg("");
  };

  return (
    <section className="section pt-10">
      <div className="mb-7"><div className="eyebrow">COMMUNICATION / DIRECT</div><h1 className="display">Talk it<br/>out.</h1></div>
      <div className="panel chat-shell">
        <aside className="chat-sidebar">
          <div className="chat-head"><div className="eyebrow">PEOPLE / {friends.length}</div><h2 className="text-2xl font-black uppercase mt-2">Your network</h2><p className="muted text-xs mt-2">Pick someone to start a skill conversation.</p></div>
          {friends.map((friend)=><button key={friend.id} className={`friend ${selectedChat?.id===friend.id ? "selected" : ""}`} onClick={()=>setSelectedChat(friend)}><img src={friend.avatar} alt=""/><span className="min-w-0"><strong className="block truncate text-xs uppercase">{friend.name}</strong><small className="block text-[10px] text-white/35 uppercase mt-1">SkillSwap member</small></span></button>)}
          {!friends.length && <div className="p-6 text-xs text-white/40 uppercase leading-relaxed">No other profiles yet. Create your profile and invite people to join.</div>}
        </aside>
        <main className="chat-main">
          <div className="chat-main-head">{selectedChat ? <div className="flex items-center gap-3"><img src={selectedChat.avatar} className="w-9 h-9 rounded-full object-cover"/><div><div className="text-xs font-black uppercase">{selectedChat.name}</div><div className="text-[10px] text-[#9be878] uppercase mt-1">Connected</div></div></div> : <div><div className="eyebrow">MESSAGES</div><div className="muted text-xs mt-1">Select a person from the left.</div></div>}{selectedChat && <button className="btn !px-3 !py-2" onClick={()=>alert("Voice/Video Calling — Coming Soon!")}><Phone size={13}/></button>}</div>
          <div className="chat-messages">
            {!selectedChat ? <div className="m-auto text-center"><MessageCircle size={32} className="mx-auto text-white/20"/><div className="eyebrow mt-4">NO CHAT SELECTED</div><p className="muted text-xs mt-2">Choose a member to begin.</p></div> : messages.length ? messages.map((msg)=><div key={msg.id} className={`bubble ${msg.senderId===user?.uid ? "me" : "them"}`}>{msg.text}</div>) : <div className="m-auto text-center"><div className="eyebrow">FIRST MESSAGE</div><p className="muted text-xs mt-2">Start the conversation.</p></div>}
            <div ref={messagesEndRef}/>
          </div>
          <form className="chat-compose" onSubmit={(e)=>{e.preventDefault();sendMessage();}}><input disabled={!selectedChat} value={newMsg} onChange={(e)=>setNewMsg(e.target.value)} placeholder={selectedChat ? "WRITE A MESSAGE..." : "SELECT A MEMBER FIRST"}/><button className="btn btn-green !px-4" type="submit" disabled={!selectedChat}><Send size={14}/></button></form>
        </main>
      </div>
    </section>
  );
}
