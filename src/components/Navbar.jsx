import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, PlusCircle, BookOpen, Settings, Sun, Moon } from "lucide-react";
import useThemeStore from "../store/themeStore";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();

  const bg = isDark ? "#2C2B28" : "#FFFFFF";
  const border = isDark ? "#3C3B38" : "#E7E5E4";
  const activeColor = "#F95E08";
  const inactiveColor = isDark ? "#A8A29E" : "#78716C";

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BookOpen, label: "Study", path: "/history" },
    { icon: PlusCircle, label: "Add", path: "/notes/new", isAdd: true },
    { icon: isDark ? Sun : Moon, label: "Theme", path: null, isTheme: true },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNav = (item) => {
    if (item.isTheme) {
      toggleTheme();
      return;
    }
    if (item.path) navigate(item.path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        // maxWidth: 480,
        background: bg,
        borderTop: `1px solid ${border}`,
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "8px 8px 12px",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                minWidth: 56,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {item.isAdd ? (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #F95E08, #FE8118)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -8,
                    boxShadow: "0 4px 12px rgba(249,94,8,0.4)",
                  }}
                >
                  <Icon size={22} color="white" />
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <Icon
                    size={22}
                    color={isActive ? activeColor : inactiveColor}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: activeColor,
                      }}
                    />
                  )}
                </div>
              )}
              {!item.isAdd && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: isActive ? activeColor : inactiveColor,
                  }}
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
