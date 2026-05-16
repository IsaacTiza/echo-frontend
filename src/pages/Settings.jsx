import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Shield, ChevronRight, Zap } from "lucide-react";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";

const Settings = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const dailyUsage = user?.dailyUsage || 0;
  const dailyLimit = 10;
  const remaining = dailyLimit - dailyUsage;
  const usagePercent = (dailyUsage / dailyLimit) * 100;

  return (
    <div className="min-h-dvh bg-[#F5F5F4] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-6">
        <h1 className="text-xl font-bold text-[#1C1B19]">Settings</h1>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-5 flex items-center gap-4 card-shadow"
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1C1B19] text-lg truncate">
              {user?.name}
            </p>
            <p className="text-sm text-[#78716C] truncate">{user?.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <p className="text-xs text-[#78716C] capitalize">
                {user?.provider} account
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-5 card-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1C1B19]">AI Credits</p>
              <p className="text-xs text-[#78716C]">Resets every midnight</p>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="w-full h-3 bg-[#F5F5F4] rounded-full mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`h-full rounded-full ${
                usagePercent >= 80 ? "bg-[#EF4444]" : "gradient-primary"
              }`}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-[#78716C]">
              {dailyUsage} of {dailyLimit} used today
            </p>
            <p
              className={`text-sm font-bold ${
                remaining === 0 ? "text-[#EF4444]" : "text-[#F95E08]"
              }`}
            >
              {remaining} left
            </p>
          </div>

          {remaining === 0 && (
            <div className="mt-3 bg-[#FEF2F2] rounded-xl p-3">
              <p className="text-xs text-[#EF4444] font-medium">
                Daily limit reached. Credits refill at midnight.
              </p>
            </div>
          )}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl overflow-hidden card-shadow"
        >
          {[
            {
              icon: User,
              label: "Account",
              sub: "Manage your account details",
              action: null,
            },
            {
              icon: Shield,
              label: "Privacy Policy",
              sub: "How we handle your data",
              action: null,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-4 px-5 py-4 border-b border-[#F5F5F4] last:border-0 active:bg-[#F5F5F4] transition-colors"
              >
                <div className="w-10 h-10 bg-[#F5F5F4] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#78716C]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[#1C1B19] text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-[#78716C]">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#78716C]" />
              </button>
            );
          })}
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-5 card-shadow"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#78716C]">Version</p>
            <p className="text-sm font-semibold text-[#1C1B19]">1.0.0</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-[#78716C]">Made with</p>
            <p className="text-sm font-semibold text-[#1C1B19]">
              ❤️ for students
            </p>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-[#FEF2F2] py-4 rounded-2xl active:scale-95 transition-transform"
        >
          <LogOut className="w-5 h-5 text-[#EF4444]" />
          <span className="font-bold text-[#EF4444]">Sign Out</span>
        </motion.button>
      </div>
      <Navbar />
    </div>
  );
};

export default Settings;
