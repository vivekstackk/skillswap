import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="site-nav" aria-label="Navigation">
      <Link to="/browse">DISCOVER</Link>
      <Link to="/profile">PROFILE</Link>
      <Link to="/messages">MESSAGES</Link>
      <Link to="/add-skill">ADD SKILL</Link>
    </nav>
  );
}
