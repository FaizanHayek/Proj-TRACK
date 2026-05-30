import React from "react";
import { Project } from "../types";
import { TrendingUp, CheckCircle, Clock, Award, Flame, Sparkles } from "lucide-react";
import { formatCurrencyIN, formatShorthandIN } from "./ProjectTable";

interface TotalsSectionProps {
  projects: Project[];
  isDarkMode: boolean;
}

export default function TotalsSection({ projects, isDarkMode }: TotalsSectionProps) {
  // Calculations
  const totalPotential = projects.reduce((acc, curr) => acc + (curr.potentialRevenue || 0), 0);
  const totalEarned = projects.reduce((acc, curr) => acc + (curr.revenueEarned || 0), 0);
  const totalPending = Math.max(0, totalPotential - totalEarned);

  // Conversion rates
  const conversionRate = totalPotential > 0 ? Math.round((totalEarned / totalPotential) * 100) : 0;

  // Eccentric Milestones message
  const getProgressMessage = () => {
    if (totalPotential === 0) return "🌱 Ready to log some massive deals. Click '+' below!";
    if (conversionRate === 100) return "👑 100% SECURED bestie! You absolutely cleared the board! 🏆";
    if (conversionRate >= 75) return "🔥 Almost fully loaded! Stacking them higher and higher!";
    if (conversionRate >= 50) return "🚀 Over half-way there! The bank account is smiling.";
    if (conversionRate > 0) return "Track your needle!";
    return "👀 Potential is high, now let's go secure those payments!";
  };

  return (
    <div
      className={`sticky bottom-0 left-0 right-0 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mt-8 pb-4 pt-4 ${
        isDarkMode 
          ? "bg-gradient-to-t from-[#0b141a] via-[#0b141a]/95 to-[#0b141a]/0" 
          : "bg-gradient-to-t from-[#efeae2] via-[#efeae2]/95 to-[#efeae2]/0"
      }`}
      id="grand-totals-sticky-container"
    >
      <div
        className={`max-w-7xl mx-auto rounded-3xl p-4 border transition-all shadow-2xl backdrop-blur-md ${
          isDarkMode
            ? "bg-[#111b21]/95 border-[#222e35]"
            : "bg-white/95 border-[#e9edef]"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Total 1: Potential Revenue - Styled as received chat bubble */}
          <div
            className={`rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all border ${
              isDarkMode
                ? "bg-[#202c33] border-[#2d3a43]/60 text-slate-100 hover:scale-[1.02]"
                : "bg-white border-[#e9edef] shadow-sm text-[#111b21] hover:scale-[1.02]"
            }`}
          >
            <p
              className={`text-[9.5px] uppercase font-black tracking-widest mb-1.5 flex items-center gap-1 ${
                isDarkMode ? "text-[#8696a0]" : "text-[#54656f]"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              TOTAL POTENTIAL
            </p>
            <h3 className="text-2xl md:text-3xl font-black font-mono tracking-tighter">
              {formatCurrencyIN(totalPotential)}
            </h3>
            <span className="text-[10px] font-black opacity-50 mt-1 uppercase tracking-widest">
              ({formatShorthandIN(totalPotential)})
            </span>
          </div>

          {/* Total 2: Revenue Earned - Styled as WA green sent chat bubble */}
          <div
            className={`rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all border ${
              isDarkMode
                ? "bg-[#005c4b] border-[#00a884]/20 text-[#e9edef] shadow-md shadow-emerald-900/10 font-bold hover:scale-[1.02]"
                : "bg-[#d9fdd3] border-[#a2e0a2]/30 text-[#111b21] font-bold hover:scale-[1.02]"
            }`}
          >
            <p
              className={`text-[9.5px] uppercase font-black tracking-widest mb-1.5 flex items-center gap-1 ${
                isDarkMode ? "text-[#00a884]" : "text-[#008069]"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              BAG SECURED
            </p>
            <h3 className="text-2xl md:text-3xl font-black font-mono tracking-tighter">
              {formatCurrencyIN(totalEarned)}
            </h3>
            <span className="text-[10px] font-black opacity-60 mt-1 uppercase tracking-widest">
              ({formatShorthandIN(totalEarned)})
            </span>
          </div>

          {/* Total 3: Revenue Pending - Styled as neutral chat item */}
          <div
            className={`rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all border ${
              isDarkMode
                ? "bg-[#222e35] border-[#2d3a43]/50 text-slate-350 hover:scale-[1.02]"
                : "bg-slate-50 border-slate-200 text-slate-800 hover:scale-[1.02]"
            }`}
          >
            <p
              className={`text-[9.5px] uppercase font-black tracking-widest mb-1.5 flex items-center gap-1 ${
                isDarkMode ? "text-[#8696a0]" : "text-[#54656f]"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              IN THE PIPELINE
            </p>
            <h3 className="text-2xl md:text-3xl font-black font-mono tracking-tighter">
              {formatCurrencyIN(totalPending)}
            </h3>
            <span className="text-[10px] font-black opacity-60 mt-1 uppercase tracking-widest">
              ({formatShorthandIN(totalPending)})
            </span>
          </div>

        </div>

        {/* Global Progress Bar illustrating total collected vs potential */}
        {totalPotential > 0 && (
          <div className={`mt-4 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t pt-3 ${
            isDarkMode ? "border-dashed border-[#222e35]" : "border-dashed border-slate-200"
          }`}>
            
            {/* Eccentric Milestone Message label */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="text-base">✨</span>
              <span className={`tracking-wide font-sans text-xs ${
                isDarkMode ? "text-[#00a884]" : "text-[#008069]"
              }`}>
                {getProgressMessage()}
              </span>
            </div>

            {/* Gauge slider progress */}
            <div className="flex items-center gap-4 flex-1 sm:max-w-md w-full">
              <div className={`w-full h-2 rounded-full overflow-hidden ${
                isDarkMode ? "bg-[#0b141a]" : "bg-slate-100"
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-[#005c4b] via-[#00a884] to-[#25d366] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${conversionRate}%` }}
                />
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase flex-shrink-0 ${
                isDarkMode ? "text-[#00a884]" : "text-[#008069]"
              }`}>
                {conversionRate}% COLLECTED
              </span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
