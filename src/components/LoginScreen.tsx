import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Sparkles, User, Camera, Image as ImageIcon } from "lucide-react";
import { UserProfile } from "../types";

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
}

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka&backgroundColor=ffdf00,ffb6c1,ff7f50",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Nala&backgroundColor=b6e3f4,c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiki&backgroundColor=ffb6c1",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sugar&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Tech&backgroundColor=c0aede,d1d4f9"
];

const PRESET_LABEL = [
  "🚀 Cyber",
  "💎 Pixel",
  "🤖 Bot",
  "🎨 Artist",
  "🔥 Spark",
  "⚡ Neon"
];

const MOTIVATIONAL_VIBES = [
  "Let's go bag that bread! 💸",
  "Manifesting 10 Crore weeks! ✨",
  "No rules, just cashflow! ⚡",
  "Work less, collect more: actual goal. 🎯",
  "Revenue goes straight UP. 📈"
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [dragActive, setDragActive] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [vibeIndex, setVibeIndex] = useState(0);

  // Rotate motivational Gen-Z vibes on avatar change
  const handleAvatarSelect = (url: string) => {
    setAvatar(url);
    setVibeIndex((prev) => (prev + 1) % MOTIVATIONAL_VIBES.length);
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorStatus("Upload a real image bestie!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorStatus("Whoa, that file is huge. Under 2MB pls!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatar(e.target.result as string);
        setErrorStatus("");
        setVibeIndex((prev) => (prev + 1) % MOTIVATIONAL_VIBES.length);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorStatus("Tell us your name so we can summon your cash dashboard! ✨");
      return;
    }
    onLogin({
      name: name.trim(),
      avatar: avatar
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto relative px-2"
      id="login-container"
    >
      {/* Eccentric WhatsApp inspired absolute elements with smart floating animations */}
      <motion.span 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -top-6 -right-2 text-4xl select-none z-10 block"
      >
        💬
      </motion.span>
      
      <motion.span 
        animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute -bottom-6 -left-4 text-4xl select-none z-10 block"
      >
        🟢
      </motion.span>
      
      <motion.span 
        animate={{ x: [0, 6, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute top-1/2 -right-8 text-3xl select-none opacity-40 block"
      >
        ✔✔
      </motion.span>


      <div className="relative overflow-hidden rounded-[2rem] p-8 shadow-2xl text-white border border-[#222e35] bg-[#111b21]">
        
        {/* Glow Effects in Background */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#00a884]/10 rounded-full blur-[65px]" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-[#005c4b]/15 rounded-full blur-[65px]" />

        {/* Decorative Tag */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#005c4b]/30 text-[#00a884] border border-[#00a884]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00a884] animate-spin" style={{ animationDuration: '4s' }} />
            PROJ-TRACK ONLINE
          </span>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tighter text-[#00a884] mb-2 font-mono">
            Proj-TRACK
          </h1>
          <p className="text-[10px] text-[#8696a0] font-bold uppercase tracking-widest mb-3">
            Your Private Revenue Command Center
          </p>
          <div className="inline-block py-1 px-3 bg-[#202c33] rounded-xl text-xs font-mono text-[#8696a0] border border-[#222e35]">
            "{MOTIVATIONAL_VIBES[vibeIndex]}"
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Section */}
          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-[#8696a0] tracking-widest uppercase ml-1 text-center">
              DRAG & DROP YOUR PROFILE AVATAR 📸
            </label>

            <div className="flex flex-col items-center gap-4">
              {/* Active Profile Preview */}
              <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#00a884] to-[#005c4b] blur opacity-70 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-[#202c33] flex items-center justify-center">
                  <img
                    src={avatar}
                    alt="Active Profile avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatar(PRESET_AVATARS[0])}
                  />
                  <div
                    className="absolute inset-0 bg-[#0b141a]/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black text-white flex-col gap-1 uppercase tracking-widest"
                  >
                    <Camera className="w-4 h-4 text-[#00a884]" />
                    UPDATE
                  </div>
                </div>
              </div>

              {/* Drag/Drop and Preset options */}
              <div className="w-full">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-4 transition-all ${
                    dragActive
                      ? "border-[#00a884] bg-[#00a884]/5 scale-[1.02]"
                      : "border-[#222e35] hover:border-[#00a884]/40 bg-[#202c33]/30"
                  }`}
                >
                  <div className="text-center mb-3">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="inline-flex items-center gap-1.5 text-xs text-[#00a884] hover:text-[#00c298] font-bold underline decoration-dotted transition-colors"
                    >
                      <Upload className="w-3.5 text-[#00a884]" />
                      Custom photo upload
                    </button>
                    <span className="text-xs text-[#8696a0]"> or drag it here</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Pre-made vibrant Avatars Grid */}
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => handleAvatarSelect(url)}
                        title={PRESET_LABEL[i]}
                        className={`relative rounded-xl overflow-hidden aspect-square border transition-all hover:scale-105 active:scale-95 bg-[#202c33] ${
                          avatar === url ? "border-[#00a884] ring-2 ring-[#00a884]/20" : "border-[#222e35] saturate-[0.8] hover:saturate-100"
                        }`}
                      >
                        <img src={url} alt={PRESET_LABEL[i]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="user-name-input" className="block text-[10px] font-black text-[#8696a0] tracking-widest uppercase ml-1">
              Who is entering this workspace? 💼
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00a884]">
                <User className="w-4 h-4" />
              </span>
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter client manager name..."
                className="w-full pl-11 pr-4 py-3.5 bg-[#202c33] border border-[#222e35] rounded-2xl text-white font-bold placeholder-[#8696a0]/40 focus:outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884] transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorStatus && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs font-bold text-rose-400 text-center"
              >
                {errorStatus}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Login Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-5 rounded-2xl bg-[#00a884] hover:bg-[#00c298] font-black tracking-widest uppercase text-[#111b21] hover:text-[#0b141a] shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 text-xs"
          >
            LAUNCH TRACKER 🚀
          </motion.button>

        </form>
      </div>
    </motion.div>
  );
}
