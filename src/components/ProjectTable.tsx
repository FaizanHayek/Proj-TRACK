import React, { useState } from "react";
import { Project } from "../types";
import { Trash2, ArrowUp, ArrowDown, Search, PlusCircle, Sparkles, Activity, FileSpreadsheet, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectTableProps {
  projects: Project[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onUpdateProject: (id: string, updated: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onReorderProjects: (currentIndex: number, direction: "up" | "down") => void;
  onAddProject: () => void;
  newlyCreatedId: string | null;
  isDarkMode: boolean;
}

// Global helpers for Indian Numbering System formatting
export function formatCurrencyIN(value: number): string {
  if (isNaN(value)) value = 0;
  return "₹" + value.toLocaleString("en-IN");
}

export function formatShorthandIN(value: number): string {
  if (isNaN(value)) value = 0;
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2).replace(/\.00$/, "")} Lakhs`;
  }
  return "₹" + value.toLocaleString("en-IN");
}

export default function ProjectTable({
  projects,
  searchQuery,
  setSearchQuery,
  onUpdateProject,
  onDeleteProject,
  onReorderProjects,
  onAddProject,
  newlyCreatedId,
  isDarkMode,
}: ProjectTableProps) {
  // Local state to keep track of focused fields or show input outlines
  const [activeCell, setActiveCell] = useState<{ id: string; field: string } | null>(null);

  // Filter projects by Name (ClientName/Product Name/Project Name) or shorthand search
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="project-board-section">
      
      {/* Search Header Container with custom elements */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search Bar - glowing and round */}
        <div className="relative flex-1">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            isDarkMode ? "text-[#00a884]" : "text-[#008069]"
          }`}>
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, clients, or chats... 🔍"
            className={`w-full pl-11 pr-16 py-3.5 rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-[#202c33] border border-[#222e35] text-[#e9edef] placeholder-[#8696a0]/80 focus:ring-[#00a884]/20 focus:border-[#00a884]"
                : "bg-[#f0f2f5] border border-[#e9edef] text-[#111b21] placeholder-slate-400 focus:ring-[#008069]/20 focus:border-[#008069]"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-widest cursor-pointer ${
                isDarkMode ? "text-[#00a884] hover:text-[#00c298]" : "text-[#008069] hover:text-[#005c4b]"
              }`}
            >
              Reset
            </button>
          )}
        </div>

        {/* Add Project Button next to search for clean viewport layout */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddProject}
          className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all duration-200 ${
            isDarkMode
              ? "bg-[#00a884] text-[#111b21] hover:bg-[#00c298]"
              : "bg-[#008069] text-white hover:bg-[#005c4b]"
          }`}
          title="Add a new project or custom revenue track"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>New Opportunity</span>
        </motion.button>
      </div>

      {/* Projects Table & List Display */}
      <div
        className={`overflow-hidden rounded-3xl border transition-all ${
          isDarkMode
            ? "bg-[#111b21] border-[#222e35] shadow-2xl"
            : "bg-white border-[#e9edef] shadow-md"
        }`}
      >
        {/* Wide screen Table layout with horizontal scrolling for mobile safety */}
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left border-collapse table-fixed min-w-[720px]">
            <thead>
              <tr
                className={`border-b transition-colors ${
                  isDarkMode
                    ? "bg-[#202c33] border-[#222e35] text-[#8696a0]"
                    : "bg-[#f0f2f5] border-[#e9edef] text-[#54656f]"
                }`}
              >
                {/* Column 0: S.NO. */}
                <th className="py-4 px-4 text-[10px] font-black tracking-widest uppercase text-center w-[8%]">
                  S.NO.
                </th>

                {/* Column 1: Project / Product Name */}
                <th className="py-4 px-6 text-[10px] font-black tracking-widest uppercase w-[34%]">
                  PROJECTS
                </th>
                
                {/* Column 2: Total Potential Revenue */}
                <th className="py-4 px-6 text-[10px] font-black tracking-widest uppercase w-[19%]">
                  POTENTIAL
                </th>
                
                {/* Column 3: Revenue Already Earned */}
                <th className="py-4 px-6 text-[10px] font-black tracking-widest uppercase w-[19%]">
                  SECURED (EARNED)
                </th>
                
                {/* Column 4: Revenue Yet To Be Earned */}
                <th className="py-4 px-6 text-[10px] font-black tracking-widest uppercase w-[20%]">
                  PIPELINE (PENDING)
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-solid transition-colors divide-white/5">
              <AnimatePresence initial={false}>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 px-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <span className="text-4xl animate-bounce">📭</span>
                        <div className="space-y-1">
                          <p className={`text-base font-black uppercase tracking-widest ${isDarkMode ? "text-white/60" : "text-slate-800"}`}>
                            Empty Revenue List
                          </p>
                          <p className={`text-xs ${isDarkMode ? "text-white/30" : "text-slate-400"}`}>
                            {searchQuery
                              ? `No active deals matched "${searchQuery}"`
                              : "No deals registered. Tap 'New Opportunity' above and start manifesting some cashflow!"}
                          </p>
                        </div>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="px-4 py-2 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-[#00FF88] border border-[#00FF88]/20 font-black uppercase tracking-widest"
                          >
                            RESET FILTER
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((project, index) => {
                    const pending = Math.max(0, project.potentialRevenue - project.revenueEarned);
                    const earnedPercent = project.potentialRevenue > 0
                      ? Math.min(100, Math.round((project.revenueEarned / project.potentialRevenue) * 100))
                      : 0;

                    const rowFocused = activeCell?.id === project.id;

                    return (
                      <motion.tr
                        key={project.id}
                        layoutId={`row-${project.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className={`group transition-all ${
                          isDarkMode
                            ? rowFocused 
                              ? "bg-[#2a3942] border-l-4 border-l-[#00a884]"
                              : "hover:bg-[#202c33] bg-transparent border-l-4 border-l-transparent"
                            : rowFocused 
                              ? "bg-emerald-50/75 border-l-4 border-l-[#008069]"
                              : "hover:bg-slate-50 bg-transparent border-l-4 border-l-transparent"
                        }`}
                      >
                        {/* Column 0: S.NO. */}
                        <td className="py-4 px-4 font-mono text-center text-xs font-bold align-middle">
                          <span className={isDarkMode ? "text-[#8696a0]/80" : "text-slate-500"}>
                            {index + 1}
                          </span>
                        </td>

                        {/* Column 1: Project / Product Name with custom icon, sort badges and edit input */}
                        <td className="py-4 px-6 align-middle relative">
                          <div className="flex items-center gap-3">
                            {/* Drag/Reorder buttons - hidden during search to protect array indexes */}
                            {!searchQuery && (
                              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                <button
                                  onClick={() => onReorderProjects(index, "up")}
                                  disabled={index === 0}
                                  className={`p-0.5 rounded hover:bg-white/10 disabled:opacity-20 cursor-pointer ${
                                    isDarkMode ? "text-white/20 hover:text-[#00a884]" : "text-slate-400 hover:text-[#008069]"
                                  }`}
                                  title="Move row up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onReorderProjects(index, "down")}
                                  disabled={index === projects.length - 1}
                                  className={`p-0.5 rounded hover:bg-white/10 disabled:opacity-20 cursor-pointer ${
                                    isDarkMode ? "text-white/20 hover:text-[#00a884]" : "text-slate-400 hover:text-[#008069]"
                                  }`}
                                  title="Move row down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* WhatsApp Iconic Single / Double check indicators */}
                            <div className="relative flex-shrink-0 flex items-center justify-center">
                              {pending === 0 ? (
                                <CheckCheck className="w-5 h-5 text-[#53bdeb] stroke-[2.5] drop-shadow-sm" title="Fully Secured (Completed)" />
                              ) : (
                                <Check className="w-5 h-5 text-[#8696a0] stroke-[2.5]" title="In pipeline (Pending)" />
                              )}
                            </div>

                            {/* Direct Project Input */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={project.name}
                                onChange={(e) => onUpdateProject(project.id, { name: e.target.value })}
                                onFocus={() => setActiveCell({ id: project.id, field: "name" })}
                                onBlur={() => setActiveCell(null)}
                                autoFocus={newlyCreatedId === project.id}
                                placeholder="Enter opportunity title..."
                                className={`w-full bg-transparent px-3 py-2 rounded-xl font-black tracking-tight text-sm placeholder-slate-500/50 focus:outline-none transition-all ${
                                  isDarkMode
                                    ? "text-slate-100 focus:bg-[#202c33]/50 focus:ring-1 focus:ring-[#00a884]"
                                    : "text-slate-900 focus:bg-[#f0f2f5]/45 focus:ring-1 focus:ring-[#008069]"
                                }`}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Total Potential Revenue */}
                        <td className="py-4 px-6 align-middle">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1">
                              <span className={`font-black text-xs ${isDarkMode ? "text-[#8696a0]/60" : "text-slate-400"}`}>₹</span>
                              <input
                                type="number"
                                min="0"
                                value={project.potentialRevenue || ""}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  onUpdateProject(project.id, { potentialRevenue: val });
                                }}
                                onFocus={() => setActiveCell({ id: project.id, field: "potentialRevenue" })}
                                onBlur={() => setActiveCell(null)}
                                placeholder="0"
                                className={`w-full bg-transparent px-2 py-1.5 rounded-xl font-mono text-sm font-bold focus:outline-none transition-all ${
                                  isDarkMode
                                    ? "text-[#e9edef] focus:bg-[#202c33]/40 focus:ring-1 focus:ring-[#00a884]"
                                    : "text-slate-900 focus:bg-[#f0f2f5]/45 focus:ring-1 focus:ring-[#008069]"
                                }`}
                              />
                            </div>
                            
                            {/* Shorthand viewer helpful badge */}
                            <div className="pl-2">
                              <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${
                                isDarkMode ? "bg-[#202c33] text-[#00a884]" : "bg-slate-100 text-[#008069] font-bold"
                              }`}>
                                {formatShorthandIN(project.potentialRevenue)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Column 3: Revenue Already Earned */}
                        <td className="py-4 px-6 align-middle">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1">
                              <span className={`font-black text-xs ${isDarkMode ? "text-[#00a884]" : "text-[#008069]"}`}>₹</span>
                              <input
                                type="number"
                                min="0"
                                value={project.revenueEarned || ""}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  onUpdateProject(project.id, { revenueEarned: val });
                                }}
                                onFocus={() => setActiveCell({ id: project.id, field: "revenueEarned" })}
                                onBlur={() => setActiveCell(null)}
                                placeholder="0"
                                className={`w-full bg-transparent px-2 py-1.5 rounded-xl font-mono text-sm font-bold focus:outline-none transition-all ${
                                  isDarkMode
                                    ? "text-[#00a884] focus:bg-[#202c33]/45 focus:ring-1 focus:ring-[#00a884]"
                                    : "text-[#008069] focus:bg-[#d9fdd3]/50 focus:ring-1 focus:ring-[#008069]"
                                }`}
                              />
                            </div>
                            
                            {/* Shorthand viewer badge with complete percentage visual link */}
                            <div className="pl-2 flex items-center gap-2 flex-wrap">
                              <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${
                                isDarkMode ? "bg-[#005c4b]/30 text-[#00a884]" : "bg-[#d9fdd3] text-[#008069]"
                              }`}>
                                {formatShorthandIN(project.revenueEarned)}
                              </span>
                              {project.potentialRevenue > 0 && (
                                <span className={`text-[9px] font-black uppercase tracking-wider ${
                                  isDarkMode ? "text-[#8696a0]" : "text-slate-500"
                                }`}>
                                  {earnedPercent}%
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Column 4: Calculated Pending Revenue with custom trash icon */}
                        <td className="py-4 px-6 align-middle relative">
                          <div className="flex items-center justify-between gap-3 font-sans">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1 pl-2">
                                <span className={`font-mono text-sm ${
                                  pending > 0 
                                    ? isDarkMode ? "text-rose-400 font-black animate-pulse" : "text-rose-700 font-bold"
                                    : isDarkMode ? "text-[#00a884] font-black" : "text-[#008069] font-bold"
                                }`}>
                                  {formatCurrencyIN(pending)}
                                </span>
                              </div>
                              <div className="pl-2">
                                <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${
                                  pending > 0 
                                    ? isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-100 text-rose-800" 
                                    : isDarkMode ? "bg-[#005c4b]/30 text-[#00a884]" : "bg-[#d9fdd3] text-[#008069]"
                                }`}>
                                  {pending === 0 ? "SECURED ✔✔" : formatShorthandIN(pending)}
                                </span>
                              </div>
                            </div>

                            {/* Row Delete Button */}
                            <button
                              onClick={() => onDeleteProject(project.id)}
                              className={`p-2.5 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                                isDarkMode
                                  ? "text-[#8696a0]/40 hover:text-rose-400 hover:bg-[#202c33]"
                                  : "text-slate-400 hover:text-rose-600 hover:bg-[#f0f2f5]"
                              }`}
                              title={`Delete ${project.name || "unnamed project"}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
