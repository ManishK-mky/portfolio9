import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link for navigation
import { Menu, BookOpen, MessageCircle, Shuffle } from "lucide-react";

export default function TopRightDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-lg flex items-center gap-2"
      >
        <Menu className="w-5 h-5 text-white" />
        <span className="text-white text-sm">Menu</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg"
        >
          <MenuItem icon={BookOpen} label="Study Materials" to="/study-materials" />
          <MenuItem icon={MessageCircle} label="Chat With AI" to="/chat-ai" />
          <MenuItem icon={Shuffle} label="Random" to="/random" />
        </motion.div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, to }:any) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-white/20 cursor-pointer transition"
    >
      <Icon className="w-5 h-5 text-white" />
      <span className="text-white text-sm">{label}</span>
    </Link>
  );
}
