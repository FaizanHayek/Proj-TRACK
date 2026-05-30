import { useEffect, useState } from "react";
import { UserProfile } from "../types";
import { Sun, Moon, LogOut, Calendar, Star, DollarSign } from "lucide-react";
import { motion } from "motion/react";

interface DashboardHeaderProps {
  profile: UserProfile;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const MEMES = [
  "Tracking future Lambos... 🏎️",
  "Code works, money flows. ✨",
  "Money machine goes BRRRRRR! ⚡",
  "CEO of getting paid on time. 🦾"
];

export default function DashboardHeader({
  profile,
  isDarkMode,
  toggleTheme,
  onLogout,
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("YO");
  const [dateStr, setDateStr] = useState("");
  const [memeQuote, setMemeQuote] = useState("");

  useEffect(() => {
    // Choose random humor quote on mount
    setMemeQuote(MEMES[Math.floor(Math.random() * MEMES.length)]);

    // Determine greeting
    const updateGreeting = () => {
      const hr = new Date().getHours();
      if (hr >= 5 && hr < 12) {
        setGreeting("GM ☀️");
      } else if (hr >= 12 && hr < 17) {
        setGreeting("GOOD DAY ⚡");
      } else {
        setGreeting("GN 🌙");
      }
    };

    // Formatted date string
    const updateDate = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      setDateStr(new Date().toLocaleDateString("en-IN", options));
    };

    updateGreeting();
    updateDate();

    const interval = setInterval(() => {
      updateGreeting();
      updateDate();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all ${
        isDarkMode
          ? "bg-[#111b21] border border-[#222e35] text-[#e9edef]"
          : "bg-white border border-[#e9edef] text-[#111b21] shadow-sm"
      }`}
      id="dashboard-header"
    >
      {/* Visual eccentric decorative accents */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-[#00a884]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-[#005c4b]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        
        {/* User Info with Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-[#00a884] opacity-40 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 bg-[#202c33] flex-shrink-0">
              <img
                src={profile.avatar}
                alt={`${profile.name} Avatar`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-base animate-pulse" title="Active">🟢</span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md ${
                isDarkMode ? "bg-[#202c33] text-[#00a884]" : "bg-[#d9fdd3] text-[#008069] border border-[#d9fdd3]"
              }`}>
                {greeting}
              </span>
              <h2 className={`text-xl font-black font-sans tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                {profile.name}
              </h2>
            </div>
            
            {/* Eccentric Meme banner status & Date */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <div className="flex items-center gap-1 text-[11px] opacity-65 font-medium">
                <Calendar className="w-3 h-3 text-[#00a884]" />
                <span className="font-mono">{dateStr}</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[#00a884] font-bold bg-[#005c4b]/10 px-2 py-0.5 rounded-full border border-[#00a884]/20 animate-pulse">
                <span className="w-1 h-1 rounded-full bg-[#00a884] animate-ping" />
                <span>{memeQuote}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls (Theme Toggle & Sign out) */}
        <div className="flex items-center gap-3 self-stretch md:self-center justify-between sm:justify-end">
          
          <div className="sm:hidden flex items-center gap-1.5 text-[10px] text-[#00a884] font-bold bg-[#005c4b]/10 px-2 py-1 rounded-xl border border-[#00a884]/20 max-w-[150px] truncate">
            <span>{memeQuote}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Light/Dark Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl flex items-center justify-center cursor-pointer border transition-all ${
                isDarkMode
                  ? "bg-[#202c33] border-[#222e35] text-amber-400 hover:text-amber-300"
                  : "bg-slate-50 border-slate-200 text-[#008069] hover:bg-slate-100"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle visual theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 animate-pulse" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>

            {/* Change Profile/Logout button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-[11px] font-black border transition-all cursor-pointer uppercase tracking-widest ${
                isDarkMode
                  ? "bg-[#202c33] border-[#222e35] text-slate-200 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
              }`}
              title="Change workspace avatar or profile name"
            >
              <LogOut className="w-3 h-3 text-[#00a884]" />
              <span>Switch Account</span>
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
}
