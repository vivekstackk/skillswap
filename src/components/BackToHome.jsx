import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackToHome({ label = "Back to Home" }) {
  return (
    <Link to="/" className="back-home-inline" aria-label="Back to home">
      <ArrowLeft size={12} strokeWidth={2.4} />
      {label}
    </Link>
  );
}
