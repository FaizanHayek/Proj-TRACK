import React, { useState, useEffect } from "react";
import { UserProfile, Project } from "./types";
import LoginScreen from "./components/LoginScreen";
import DashboardHeader from "./components/DashboardHeader";
import ProjectTable from "./components/ProjectTable";
import TotalsSection from "./components/TotalsSection";
import { Sparkles, BarChart2, DollarSign, Wallet, ShieldCheck, Heart, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Store user profiles
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : null;
  });

  // Default seed data matching the detailed user requirement descriptions
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      {
        id: "seed-abc-cement",
        name: "ABC Cement Opportunity",
        potentialRevenue: 2000000,
        revenueEarned: 500000,
        createdAt: Date.now() - 300000,
      },
      {
        id: "seed-xyz-railways",
        name: "XYZ Railways JV",
        potentialRevenue: 5000000,
        revenueEarned: 1500000,
        createdAt: Date.now() - 200000,
      },
      {
        id: "seed-air-spring",
        name: "Air Spring Tech Licensing",
        potentialRevenue: 10000000,
        revenueEarned: 0,
        createdAt: Date.now() - 100000,
      },
    ];
  });

  // Dark Mode states - dark by default as requested
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const theme = localStorage.getItem("theme");
    return theme ? theme === "dark" : true;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  // Sync theme to root element and body
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (isDarkMode) {
      root.classList.add("dark");
      body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      body.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Listen for browser backward/forward navigation (popstate events)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.screen === "dashboard") {
        // Restore profile from localstorage if available
        const stored = localStorage.getItem("userProfile");
        if (stored) {
          try {
            setProfile(JSON.parse(stored));
          } catch (e) {
            setProfile(null);
          }
        }
      } else {
        // Go back to the login screen
        setProfile(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Bootstrap initial history state if not already defined
    if (window.history.state === null) {
      window.history.replaceState({ screen: "login" }, "");
    }

    // Handle fresh boot when profile is already present
    if (profile) {
      if (!window.history.state || window.history.state.screen !== "dashboard") {
        window.history.pushState({ screen: "dashboard" }, "");
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Sync profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem("userProfile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("userProfile");
    }
  }, [profile]);

  // Sync projects to localStorage on change instantly
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleLogin = (userProfile: UserProfile) => {
    setProfile(userProfile);
    // Push state so that the Back gesture/button brings the user back to the login page
    if (!window.history.state || window.history.state.screen !== "dashboard") {
      window.history.pushState({ screen: "dashboard" }, "");
    }
  };

  const handleLogout = () => {
    if (window.history.state && window.history.state.screen === "dashboard") {
      window.history.back();
    } else {
      setProfile(null);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Add Project opportunity
  const handleAddProject = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
    const newProject: Project = {
      id,
      name: "",
      potentialRevenue: 0,
      revenueEarned: 0,
      createdAt: Date.now(),
    };
    // Prepend to array to show instantly on top
    setProjects((prev) => [newProject, ...prev]);
    setNewlyCreatedId(id);

    // Timeout to clear focus helper flag
    setTimeout(() => {
      setNewlyCreatedId(null);
    }, 1200);
  };

  // Modify local fields with automatic calculation triggers
  const handleUpdateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          // Ensure negative numbers are prevented
          if (updated.potentialRevenue < 0) updated.potentialRevenue = 0;
          if (updated.revenueEarned < 0) updated.revenueEarned = 0;
          return updated;
        }
        return p;
      })
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Reorder projects natively
  const handleReorderProjects = (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[currentIndex];
    updated[currentIndex] = updated[targetIndex];
    updated[targetIndex] = temp;
    setProjects(updated);
  };

  return (
    <div
      className={`min-h-screen py-6 px-3 sm:py-10 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden ${
        isDarkMode
          ? "bg-[#0b141a] text-[#e9edef] wa-wallpaper-dark"
          : "bg-[#efeae2] text-[#111b21] wa-wallpaper-light"
      }`}
      id="app-root-container"
    >
      {/* WhatsApp Iconic Top Header Band */}
      <div className={`absolute top-0 left-0 right-0 h-[140px] pointer-events-none -z-10 transition-colors ${
        isDarkMode ? "bg-[#111b21]" : "bg-[#008069]"
      }`} />

      <main className="max-w-7xl mx-auto space-y-4 sm:space-y-5 relative">
        <AnimatePresence mode="wait">
          {!profile ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex justify-center items-center min-h-[75vh]"
            >
              <LoginScreen onLogin={handleLogin} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Dynamic Header */}
              <DashboardHeader
                profile={profile}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                onLogout={handleLogout}
              />

              {/* Core interactive tracking panel - Bento rounded box */}
              <div
                className={`p-4 sm:p-6 md:p-8 rounded-3xl border transition-all ${
                  isDarkMode
                    ? "bg-[#111b21] border-[#222e35] shadow-2xl"
                    : "bg-white border-[#e9edef] shadow-md"
                }`}
                id="main-dashboard-canvas"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className={`p-2.5 rounded-2xl shadow-sm ${
                    isDarkMode ? "bg-[#202c33] text-[#00a884]" : "bg-[#efeae2] text-[#008069]"
                  }`}>
                    <BarChart2 className="w-5 h-5 stroke-[2.5]" />
                  </span>
                  <div>
                    <h1 className="text-lg font-black tracking-tight font-sans uppercase">Projects Tracker</h1>
                  </div>
                </div>

                <ProjectTable
                  projects={projects}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onReorderProjects={handleReorderProjects}
                  onAddProject={handleAddProject}
                  newlyCreatedId={newlyCreatedId}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Shared Sticky Totals */}
              <TotalsSection projects={projects} isDarkMode={isDarkMode} />

              {/* Glowing Phone-Green WA Floating Action Button (FAB) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddProject}
                className={`fixed bottom-36 sm:bottom-12 right-6 md:right-10 z-[40] w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                  isDarkMode
                    ? "bg-[#00a884] text-white fab-glow hover:bg-[#00c298]"
                    : "bg-[#008069] text-white fab-glow-light hover:bg-[#005c4b]"
                }`}
                title="Create a new opportunity"
              >
                <Plus className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Footer (Clean, dynamic) */}
        <footer className={`pt-6 pb-2 text-center text-xs opacity-50 ${isDarkMode ? "text-[#8696a0]" : "text-slate-500"}`}>
          <div className="flex justify-center items-center gap-1">
            <span>Proj-TRACK</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-black tracking-widest uppercase text-[10px]">
              MADE WITH <Heart className="w-3 h-3 text-red-500 fill-red-500" /> BY FAIZAN HAYEK
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
