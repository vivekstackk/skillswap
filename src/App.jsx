import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import BrowseSkills from "./pages/BrowseSkills";
import SkillDetail from "./pages/SkillDetail";
import AddSkill from "./pages/AddSkill";
import RecordLecture from "./pages/RecordLecture";
import Messages from "./pages/Messages";
import { auth, db } from "./firebaseClient";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let unsubscribe = () => {};
    let mounted = true;
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        if (!mounted) return;
        unsubscribe = onAuthStateChanged(auth, async (u) => {
          setUser(u);
          if (u) {
            try {
              await getDoc(doc(db, "users", u.uid));
            } catch (error) {
              console.error("Error fetching profile:", error);
            }
          }
        });
      })
      .catch((error) => {
        console.error("Firebase persistence error:", error);
        if (mounted) unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
      });
    return () => { mounted = false; unsubscribe(); };
  }, []);

  useEffect(() => {
    const handleCreditsChange = () => document.dispatchEvent(new Event("creditsUpdated"));
    window.addEventListener("storage", handleCreditsChange);
    return () => window.removeEventListener("storage", handleCreditsChange);
  }, []);

  if (user === undefined) return <div className="min-h-screen bg-[#050505]" />;

  const protectedRoute = (element) => user ? element : <Navigate to="/login" replace />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={protectedRoute(<Profile />)} />
          <Route path="browse" element={protectedRoute(<BrowseSkills />)} />
          <Route path="skill/:id" element={protectedRoute(<SkillDetail />)} />
          <Route path="add-skill" element={protectedRoute(<AddSkill />)} />
          <Route path="record" element={protectedRoute(<RecordLecture />)} />
          <Route path="messages" element={protectedRoute(<Messages />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
