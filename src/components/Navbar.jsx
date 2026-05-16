import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen, PlusCircle, History, Settings } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: History, label: "History", path: "/history" },
  { icon: PlusCircle, label: "Add", path: "/notes/new" },
  { icon: BookOpen, label: "Study", path: "/history" },
  { icon: Settings, label: "Settings", path: "/settings" },
];
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (item) => {
    if (item.path) navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[#E7E5E4] bottom-nav z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isAdd = item.label === "Add";

          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="flex flex-col items-center gap-1 min-w-[56px] active:scale-95 transition-transform"
            >
              {isAdd ? (
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg -mt-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? "text-[#F95E08]" : "text-[#78716C]"
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F95E08]"
                    />
                  )}
                </div>
              )}
              {!isAdd && (
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? "text-[#F95E08]" : "text-[#78716C]"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
