"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Hero from "../components/Hero";
import LearningModules, { MODULES, ModuleData } from "../components/LearningModules";
import GamificationHub from "../components/GamificationHub";
import ConfettiCanvas from "../components/ConfettiCanvas";
import { Compass, Waves, Award, Sparkles, BookOpen, ShoppingBag, Eye, EyeOff, RotateCcw, AlertTriangle, User } from "lucide-react";
import { playBubblePop, playUnlockFanfare, playFailureBuzz } from "../components/AudioSynthesizer";
import PomodoroTimer from "../components/PomodoroTimer";
import { UserProfile, UserButton } from "@clerk/nextjs";

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
}

const ALL_BADGES: Badge[] = [
  {
    id: "ocean-guardian",
    name: "Ocean Guardian",
    description: "Read and completed all three educational learning modules",
    emoji: "🛡️",
    color: "from-teal-400 to-emerald-500",
  },
  {
    id: "trivia-champ",
    name: "Trivia Champ",
    description: "Scored 40+ points in the Timed Quiz Challenge",
    emoji: "🏆",
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: "memory-master",
    name: "Memory Master",
    description: "Matched all marine creature pairs in the Memory Game",
    emoji: "🧠",
    color: "from-sky-400 to-blue-500",
  },
];

interface ThemeShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  colorName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  className: string;
}

const THEME_SHOP_ITEMS: ThemeShopItem[] = [
  {
    id: "teal",
    name: "Ocean Classic",
    description: "The default beautiful teal color of Ocean Guardian.",
    cost: 0,
    colorName: "Teal & Sky",
    primaryColor: "bg-[#0d9488]",
    secondaryColor: "bg-[#0ea5e9]",
    accentColor: "bg-[#f43f5e]",
    className: "theme-teal",
  },
  {
    id: "blue",
    name: "Deep Sea",
    description: "Immerse yourself in deep royal blue water colors.",
    cost: 100,
    colorName: "Deep Blue & Cyan",
    primaryColor: "bg-[#2563eb]",
    secondaryColor: "bg-[#06b6d4]",
    accentColor: "bg-[#f43f5e]",
    className: "theme-blue",
  },
  {
    id: "pink",
    name: "Coral Reef",
    description: "Bright hot pinks and rose tones inspired by living coral reefs.",
    cost: 150,
    colorName: "Coral Pink & Rose",
    primaryColor: "bg-[#db2777]",
    secondaryColor: "bg-[#f43f5e]",
    accentColor: "bg-[#0d9488]",
    className: "theme-pink",
  },
  {
    id: "green",
    name: "Kelp Forest",
    description: "Rich emerald greens matching beautiful, vibrant underwater kelp forests.",
    cost: 200,
    colorName: "Emerald & Mint",
    primaryColor: "bg-[#059669]",
    secondaryColor: "bg-[#10b981]",
    accentColor: "bg-[#f59e0b]",
    className: "theme-green",
  },
  {
    id: "sunset",
    name: "Sunset Bay",
    description: "Warm amber and golden tones of the sun setting over the coastal waters.",
    cost: 250,
    colorName: "Amber & Gold",
    primaryColor: "bg-[#d97706]",
    secondaryColor: "bg-[#f59e0b]",
    accentColor: "bg-[#db2777]",
    className: "theme-sunset",
  },
  {
    id: "custom",
    name: "Custom Creator",
    description: "Design your own custom color scheme! Select primary, secondary, and accent colors.",
    cost: 500,
    colorName: "Your Design",
    primaryColor: "bg-theme-primary",
    secondaryColor: "bg-theme-secondary",
    accentColor: "bg-theme-accent",
    className: "theme-custom",
  },
];

function blendHexColor(hex: string, targetHex: string, weight: number): string {
  const h1 = hex.startsWith("#") ? hex : "#" + hex;
  const h2 = targetHex.startsWith("#") ? targetHex : "#" + targetHex;

  const r1 = parseInt(h1.substring(1, 3), 16) || 0;
  const g1 = parseInt(h1.substring(3, 5), 16) || 0;
  const b1 = parseInt(h1.substring(5, 7), 16) || 0;

  const r2 = parseInt(h2.substring(1, 3), 16) || 0;
  const g2 = parseInt(h2.substring(3, 5), 16) || 0;
  const b2 = parseInt(h2.substring(5, 7), 16) || 0;

  const R = Math.max(0, Math.min(255, Math.round(r1 * (1 - weight) + r2 * weight)));
  const G = Math.max(0, Math.min(255, Math.round(g1 * (1 - weight) + g2 * weight)));
  const B = Math.max(0, Math.min(255, Math.round(b1 * (1 - weight) + b2 * weight)));

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "games" | "badges" | "shop" | "profile">("dashboard");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [points, setPoints] = useState(0);
  const [modules, setModules] = useState<ModuleData[]>(MODULES);
  const [unlockedModules, setUnlockedModules] = useState<string[]>(["module-1"]);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pointsAnimate, setPointsAnimate] = useState(false);

  const [activeTheme, setActiveTheme] = useState<string>("teal");
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(["teal"]);
  const [shakingThemeId, setShakingThemeId] = useState<string | null>(null);

  // Custom colors state
  const [customPrimary, setCustomPrimary] = useState<string>("#a21caf"); // default violet
  const [customSecondary, setCustomSecondary] = useState<string>("#2563eb"); // default blue
  const [customAccent, setCustomAccent] = useState<string>("#f43f5e"); // default rose

  const [isSyncing, setIsSyncing] = useState(true);
  const isLoadedRef = React.useRef(false);

  useEffect(() => {
    async function init() {
      try {
        await fetch('/api/user/sync', { method: 'POST' });
        
        const [progressRes, modulesRes] = await Promise.all([
          fetch('/api/user/progress'),
          fetch('/api/modules')
        ]);
        
        const progress = await progressRes.json();
        const mods = await modulesRes.json();
        
        if (!progress.error) {
          setPoints(Math.max(Number(progress.points), 0));
          setActiveTheme(progress.activeTheme || "teal");
          setUnlockedThemes(progress.unlockedThemes?.length ? progress.unlockedThemes : ["teal"]);
          setUnlockedModules(progress.unlockedModules?.length ? progress.unlockedModules : ["module-1"]);
          setCompletedModules(progress.completedModules || []);
          setEarnedBadges(progress.earnedBadges || []);
          
          if (progress.customColors) {
            setCustomPrimary(progress.customColors.primary || "#a21caf");
            setCustomSecondary(progress.customColors.secondary || "#2563eb");
            setCustomAccent(progress.customColors.accent || "#f43f5e");
          }
        }
        
        if (!mods.error && mods.length > 0) {
          setModules(mods);
        }
      } catch (err) {
        console.error("Failed to load Supabase data:", err);
      } finally {
        setIsSyncing(false);
        isLoadedRef.current = true;
      }
    }
    init();
  }, []);

  // Synchronize active theme and custom variables to document.body for root styling visibility
  useEffect(() => {
    if (typeof window === "undefined" || !document?.body) return;

    // Clean old theme classes
    const classes = Array.from(document.body.classList);
    classes.forEach((c) => {
      if (c.startsWith("theme-")) {
        document.body.classList.remove(c);
      }
    });

    // Add current active theme
    document.body.classList.add(`theme-${activeTheme}`);

    // Inject custom colors as body style properties if custom theme is equipped
    if (activeTheme === "custom") {
      const primaryHover = blendHexColor(customPrimary, "#000000", 0.15);
      const primaryLight = blendHexColor(customPrimary, "#ffffff", 0.95);
      const primaryDark = blendHexColor(customPrimary, "#000000", 0.4);
      const accentHover = blendHexColor(customAccent, "#000000", 0.15);
      const navy = blendHexColor(customPrimary, "#000000", 0.8);
      const bgFrom = blendHexColor(customSecondary, "#ffffff", 0.9);
      const bgTo = blendHexColor(customPrimary, "#ffffff", 0.95);

      document.body.style.setProperty("--theme-primary", customPrimary);
      document.body.style.setProperty("--color-theme-primary", customPrimary);
      document.body.style.setProperty("--theme-primary-hover", primaryHover);
      document.body.style.setProperty("--color-theme-primary-hover", primaryHover);
      document.body.style.setProperty("--theme-primary-light", primaryLight);
      document.body.style.setProperty("--color-theme-primary-light", primaryLight);
      document.body.style.setProperty("--theme-primary-dark", primaryDark);
      document.body.style.setProperty("--color-theme-primary-dark", primaryDark);
      document.body.style.setProperty("--theme-secondary", customSecondary);
      document.body.style.setProperty("--color-theme-secondary", customSecondary);
      document.body.style.setProperty("--theme-accent", customAccent);
      document.body.style.setProperty("--color-theme-accent", customAccent);
      document.body.style.setProperty("--theme-accent-hover", accentHover);
      document.body.style.setProperty("--color-theme-accent-hover", accentHover);
      document.body.style.setProperty("--theme-navy", navy);
      document.body.style.setProperty("--color-theme-navy", navy);
      document.body.style.setProperty("--theme-bg-gradient-from", bgFrom);
      document.body.style.setProperty("--color-theme-bg-gradient-from", bgFrom);
      document.body.style.setProperty("--theme-bg-gradient-to", bgTo);
      document.body.style.setProperty("--color-theme-bg-gradient-to", bgTo);
    } else {
      // Clear custom properties when using pre-defined themes
      const properties = [
        "--theme-primary",
        "--color-theme-primary",
        "--theme-primary-hover",
        "--color-theme-primary-hover",
        "--theme-primary-light",
        "--color-theme-primary-light",
        "--theme-primary-dark",
        "--color-theme-primary-dark",
        "--theme-secondary",
        "--color-theme-secondary",
        "--theme-accent",
        "--color-theme-accent",
        "--theme-accent-hover",
        "--color-theme-accent-hover",
        "--theme-navy",
        "--color-theme-navy",
        "--theme-bg-gradient-from",
        "--color-theme-bg-gradient-from",
        "--theme-bg-gradient-to",
        "--color-theme-bg-gradient-to",
      ];
      properties.forEach((prop) => document.body.style.removeProperty(prop));
    }
  }, [activeTheme, customPrimary, customSecondary, customAccent]);

  // Removed localStorage sync effects

  // Auto-award Ocean Guardian badge when all modules are completed
  useEffect(() => {
    if (
      modules.length > 0 && 
      modules.every(m => completedModules.includes(m.id)) &&
      !earnedBadges.includes("ocean-guardian")
    ) {
      setTimeout(() => {
        earnBadge("ocean-guardian");
        addPoints(50);
      }, 500);
    }
  }, [completedModules, earnedBadges]);

  const addPoints = async (amount: number) => {
    setPoints((prev) => prev + amount);
    setPointsAnimate(true);
    setTimeout(() => setPointsAnimate(false), 1000);
    await fetch('/api/user/action', { method: 'POST', body: JSON.stringify({ action: 'update_points', payload: { amount } }) });
  };

  const earnBadge = async (badgeId: string) => {
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges((prev) => [...prev, badgeId]);
      setShowConfetti(true);
      await fetch('/api/user/action', { method: 'POST', body: JSON.stringify({ action: 'award_badge', payload: { badgeId } }) });
    }
  };

  const unlockModule = async (moduleId: string) => {
    const currentIndex = modules.findIndex(m => m.id === moduleId);
    const nextModule = currentIndex >= 0 && currentIndex < modules.length - 1 ? modules[currentIndex + 1].id : "";

    if (nextModule && !unlockedModules.includes(nextModule)) {
      setUnlockedModules((prev) => [...prev, nextModule]);
      addPoints(20);
      await fetch('/api/user/action', { method: 'POST', body: JSON.stringify({ action: 'unlock_module', payload: { moduleId: nextModule } }) });
    }
  };

  const completeModule = async (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules((prev) => [...prev, moduleId]);
      addPoints(50);
      await fetch('/api/user/action', { method: 'POST', body: JSON.stringify({ action: 'complete_module', payload: { moduleId } }) });
    }
  };

  const handleTabClick = (tab: "dashboard" | "games" | "badges" | "shop" | "profile") => {
    playBubblePop();
    setActiveTab(tab);
  };

  const triggerConfettiEffect = () => {
    setShowConfetti(true);
  };

  const handleUnlockTheme = async (itemId: string, cost: number) => {
    if (points >= cost) {
      setPoints((prev) => prev - cost);
      setUnlockedThemes((prev) => [...prev, itemId]);
      playUnlockFanfare();
      setShowConfetti(true);
      await fetch('/api/user/action', { method: 'POST', body: JSON.stringify({ action: 'buy_theme', payload: { themeId: itemId, cost } }) });
    } else {
      playFailureBuzz();
      setShakingThemeId(itemId);
      setTimeout(() => setShakingThemeId(null), 500);
    }
  };

  const handleEquipTheme = async (itemId: string) => {
    playBubblePop();
    setActiveTheme(itemId);
    await fetch('/api/user/action', { method: 'POST', body: JSON.stringify({ action: 'set_theme', payload: { themeId: itemId } }) });
  };

  const handleCustomColorChange = async (type: "primary" | "secondary" | "accent", value: string) => {
    if (type === "primary") setCustomPrimary(value);
    if (type === "secondary") setCustomSecondary(value);
    if (type === "accent") setCustomAccent(value);
    
    // For custom colors, debounce API call using a timeout
    const colors = {
      primary: type === "primary" ? value : customPrimary,
      secondary: type === "secondary" ? value : customSecondary,
      accent: type === "accent" ? value : customAccent
    };
    await fetch('/api/user/action', { method: 'POST', body: JSON.stringify({ action: 'update_custom_colors', payload: { colors } }) });
  };

  const toggleFocusMode = () => {
    playBubblePop();
    setIsFocusMode(!isFocusMode);
    if (!isFocusMode && activeTab !== "dashboard") {
      setActiveTab("dashboard");
    }
  };

  const resetJourney = async () => {
    if (window.confirm("Are you sure you want to completely reset your progress? This will erase your points, badges, unlocked themes, and module completion. This cannot be undone.")) {
      await fetch('/api/user/reset', { method: 'POST' });
      window.location.reload();
    }
  };

  // Generate dynamic styles if custom theme is equipped
  const customThemeStyles = activeTheme === "custom" ? {
    "--theme-primary": customPrimary,
    "--color-theme-primary": customPrimary,
    "--theme-primary-hover": blendHexColor(customPrimary, "#000000", 0.15),
    "--color-theme-primary-hover": blendHexColor(customPrimary, "#000000", 0.15),
    "--theme-primary-light": blendHexColor(customPrimary, "#ffffff", 0.95),
    "--color-theme-primary-light": blendHexColor(customPrimary, "#ffffff", 0.95),
    "--theme-primary-dark": blendHexColor(customPrimary, "#000000", 0.4),
    "--color-theme-primary-dark": blendHexColor(customPrimary, "#000000", 0.4),
    "--theme-secondary": customSecondary,
    "--color-theme-secondary": customSecondary,
    "--theme-accent": customAccent,
    "--color-theme-accent": customAccent,
    "--theme-accent-hover": blendHexColor(customAccent, "#000000", 0.15),
    "--color-theme-accent-hover": blendHexColor(customAccent, "#000000", 0.15),
    "--theme-navy": blendHexColor(customPrimary, "#000000", 0.8),
    "--color-theme-navy": blendHexColor(customPrimary, "#000000", 0.8),
    "--theme-bg-gradient-from": blendHexColor(customSecondary, "#ffffff", 0.9),
    "--color-theme-bg-gradient-from": blendHexColor(customSecondary, "#ffffff", 0.9),
    "--theme-bg-gradient-to": blendHexColor(customPrimary, "#ffffff", 0.95),
    "--color-theme-bg-gradient-to": blendHexColor(customPrimary, "#ffffff", 0.95),
  } as React.CSSProperties : undefined;

  return (
    <div 
      className={`theme-${activeTheme} flex flex-col min-h-screen ${isFocusMode ? 'bg-slate-50' : 'bg-gradient-to-b from-theme-bg-gradient-from to-theme-bg-gradient-to'}`}
      style={customThemeStyles}
    >
      {/* Dynamic Confetti Overlay */}
      <ConfettiCanvas active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-theme-primary/10 px-6 py-4 flex items-center justify-between shadow-xs">
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-md shadow-theme-primary/20">
            <Waves className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-theme-primary-dark to-theme-secondary bg-clip-text text-transparent">
            Ocean Guardian
          </span>
        </Link>

          {/* Center Tabs for Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 bg-theme-primary-light p-1.5 rounded-2xl border border-theme-primary/10">
            <button
              onClick={() => handleTabClick("dashboard")}
              className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all ${
                activeTab === "dashboard"
                  ? "bg-theme-primary text-white shadow-xs"
                  : "text-theme-primary-dark hover:bg-theme-primary-light"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lessons</span>
            </button>
            {!isFocusMode && (
              <>
                <button
                  onClick={() => handleTabClick("games")}
                  className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all ${
                    activeTab === "games"
                      ? "bg-theme-primary text-white shadow-xs"
                      : "text-theme-primary-dark hover:bg-theme-primary-light"
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Game Center</span>
                </button>
                <button
                  onClick={() => handleTabClick("badges")}
                  className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all ${
                    activeTab === "badges"
                      ? "bg-theme-primary text-white shadow-xs"
                      : "text-theme-primary-dark hover:bg-theme-primary-light"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Achievements</span>
                  {earnedBadges.length > 0 && (
                    <span className="ml-1 bg-amber-400 text-slate-900 text-xs px-2 py-0.5 rounded-full font-black animate-pulse">
                      {earnedBadges.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabClick("shop")}
                  className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all ${
                    activeTab === "shop"
                      ? "bg-theme-primary text-white shadow-xs"
                      : "text-theme-primary-dark hover:bg-theme-primary-light"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ocean Shop</span>
                </button>
                <button
                  onClick={() => handleTabClick("profile")}
                  className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all ${
                    activeTab === "profile"
                      ? "bg-theme-primary text-white shadow-xs"
                      : "text-theme-primary-dark hover:bg-theme-primary-light"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Header Widget: Points and Badges */}
          <div className="flex items-center gap-4">
            <PomodoroTimer />
            
            <button
              onClick={toggleFocusMode}
              className={`hidden md:flex items-center gap-1.5 py-1.5 px-3 rounded-xl border ${isFocusMode ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-inner' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'} transition-all text-xs font-bold`}
              title="Toggle Focus Mode"
            >
              {isFocusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Focus Mode</span>
            </button>

            <div
              className={`flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-200/50 py-2 px-3.5 rounded-2xl font-black text-sm transition-transform duration-300 shadow-xs ${
                pointsAnimate ? "scale-115 rotate-2" : ""
              }`}
            >
              <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{points} Points</span>
            </div>
            <div className="flex items-center justify-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
              <UserButton />
            </div>
          </div>
        </header>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col justify-center">

        {activeTab === "dashboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <LearningModules
              modules={modules}
              unlockedModules={unlockedModules}
              completedModules={completedModules}
              onCompleteModule={completeModule}
              onUnlockModule={unlockModule}
              triggerConfetti={triggerConfettiEffect}
            />
          </div>
        )}

        {activeTab === "games" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <GamificationHub
              onEarnBadge={earnBadge}
              triggerConfetti={triggerConfettiEffect}
              badges={earnedBadges}
              points={points}
              onAddPoints={addPoints}
            />
          </div>
        )}

        {activeTab === "badges" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-3xl mx-auto w-full px-6 py-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2">My Guardian Profile</h2>
              <p className="text-slate-500 font-bold text-sm">
                Unlock badges by reading lessons, completing quizzes, and matching memory card pairs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ALL_BADGES.map((b) => {
                const isEarned = earnedBadges.includes(b.id);
                
                const handleBadgeClick = () => {
                  if (isEarned) {
                    playUnlockFanfare();
                    setShowConfetti(true);
                  } else {
                    playBubblePop();
                  }
                };

                return (
                  <div
                    key={b.id}
                    onClick={handleBadgeClick}
                    className={`relative rounded-3xl p-6 border-2 flex flex-col items-center text-center transition-all select-none ${
                      isEarned
                        ? "border-theme-primary/20 bg-white shadow-md hover:border-theme-primary hover:shadow-lg hover:shadow-theme-primary/10 cursor-pointer hover:-translate-y-1 active:scale-95"
                        : "border-slate-100 bg-slate-100/50 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {/* Badge Icon bubble */}
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 bg-gradient-to-br shadow-md ${
                        isEarned ? b.color + " animate-pulse" : "from-slate-200 to-slate-300"
                      }`}
                    >
                      {isEarned ? b.emoji : "🔒"}
                    </div>

                    <h4 className="text-lg font-black text-slate-800 mb-1">{b.name}</h4>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-2">
                      {b.description}
                    </p>

                    {isEarned ? (
                      <div className="flex flex-col gap-1 items-center mt-auto">
                        <div className="bg-theme-primary/10 text-theme-primary-dark text-[9px] uppercase font-black px-2 py-0.5 rounded-full">
                          Earned
                        </div>
                        <span className="text-[10px] text-theme-primary font-bold mt-1 animate-bounce">
                          Click for fanfare! 🫧
                        </span>
                      </div>
                    ) : (
                      <div className="bg-slate-200 text-slate-500 text-[9px] uppercase font-black px-2 py-0.5 rounded-full mt-auto">
                        Locked
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Platform statistics */}
            <div className="mt-12 p-6 rounded-3xl bg-theme-primary/5 border-2 border-theme-primary/10 flex flex-col md:flex-row items-center justify-around gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-theme-primary-dark">{points}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Score</p>
              </div>
              <div className="h-px w-10 md:h-10 md:w-px bg-theme-primary/10" />
              <div>
                <p className="text-3xl font-black text-theme-primary-dark">
                  {completedModules.length} / {modules.length}
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Modules Done</p>
              </div>
              <div className="h-px w-10 md:h-10 md:w-px bg-theme-primary/10" />
              <div>
                <p className="text-3xl font-black text-theme-primary-dark">
                  {earnedBadges.length} / 3
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Badges Unlocked</p>
              </div>
            </div>

            {/* Danger Zone: OCD Reset Feature */}
            <div className="mt-8 pt-8 border-t border-slate-200 max-w-xl mx-auto flex flex-col items-center text-center">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Clean Slate</h3>
              <p className="text-xs font-semibold text-slate-500 mb-4 max-w-sm">
                Need a fresh start? This will securely erase all your local progress, points, and unlocked badges.
              </p>
              <button 
                onClick={resetJourney}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl font-bold text-sm transition-colors border border-rose-200/50"
              >
                <AlertTriangle className="w-4 h-4" />
                Reset My Journey
              </button>
            </div>
          </div>
        )}

        {activeTab === "shop" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto w-full px-6 py-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Ocean Theme Shop 🏪</h2>
              <p className="text-slate-500 font-bold text-sm max-w-lg mx-auto leading-relaxed">
                Unlock custom cosmetic colors for Ocean Guardian using the points you earn! Equip your favorite layout color to make learning fun.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {THEME_SHOP_ITEMS.map((item) => {
                const isUnlocked = unlockedThemes.includes(item.id);
                const isEquipped = activeTheme === item.id;
                const canAfford = points >= item.cost;
                const isCustom = item.id === "custom";
                
                return (
                  <div
                    key={item.id}
                    className={`relative rounded-3xl p-6 border-2 flex flex-col justify-between transition-all select-none bg-white ${
                      isEquipped
                        ? "border-theme-primary shadow-lg ring-2 ring-theme-primary/10"
                        : isUnlocked
                        ? "border-slate-200 hover:border-theme-primary/45 hover:shadow-md cursor-pointer hover:-translate-y-1 active:scale-95"
                        : "border-slate-200"
                    } ${shakingThemeId === item.id ? "animate-shake border-rose-400 bg-rose-50/20" : ""}`}
                    onClick={() => {
                      if (isUnlocked && !isEquipped) {
                        handleEquipTheme(item.id);
                      }
                    }}
                  >
                    <div>
                      {/* Color Preview Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex -space-x-2">
                          <div 
                            className={`w-8 h-8 rounded-full border-2 border-white shadow-xs ${isCustom ? "" : item.primaryColor}`}
                            style={isCustom ? { backgroundColor: customPrimary } : undefined}
                          />
                          <div 
                            className={`w-8 h-8 rounded-full border-2 border-white shadow-xs ${isCustom ? "" : item.secondaryColor}`}
                            style={isCustom ? { backgroundColor: customSecondary } : undefined}
                          />
                          <div 
                            className={`w-8 h-8 rounded-full border-2 border-white shadow-xs ${isCustom ? "" : item.accentColor}`}
                            style={isCustom ? { backgroundColor: customAccent } : undefined}
                          />
                        </div>
                        <span className="text-xs font-black bg-slate-100 text-slate-500 py-1 px-2.5 rounded-full uppercase tracking-wider">
                          {item.colorName}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-black text-slate-800 mb-1 flex items-center gap-2">
                        {item.name}
                        {isEquipped && (
                          <span className="bg-theme-primary text-white text-[9px] uppercase font-black px-2 py-0.5 rounded-full">
                            Equipped
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Color Pickers for Custom Theme */}
                      {isCustom && isUnlocked && (
                        <div 
                          className="mt-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col gap-3" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                            Choose Theme Colors:
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tight">Primary</label>
                              <input
                                type="color"
                                value={customPrimary}
                                onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shadow-2xs bg-transparent"
                              />
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tight">Secondary</label>
                              <input
                                type="color"
                                value={customSecondary}
                                onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shadow-2xs bg-transparent"
                              />
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tight">Accent</label>
                              <input
                                type="color"
                                value={customAccent}
                                onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shadow-2xs bg-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
 
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
                        <span className="text-lg font-black text-amber-600 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500" />
                          {item.cost === 0 ? "FREE" : `${item.cost} pts`}
                        </span>
                      </div>
 
                      {isEquipped ? (
                        <button
                          disabled
                          className="px-5 py-2.5 rounded-xl bg-theme-primary text-white font-extrabold text-xs shadow-xs"
                        >
                          Equipped
                        </button>
                      ) : isUnlocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipTheme(item.id);
                          }}
                          className="px-5 py-2.5 rounded-xl border-2 border-theme-primary text-theme-primary hover:bg-theme-primary-light font-extrabold text-xs transition-all active:scale-95"
                        >
                          Use Theme
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlockTheme(item.id, item.cost);
                          }}
                          disabled={!canAfford}
                          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                            canAfford
                              ? "bg-slate-800 hover:bg-slate-700 text-white shadow-xs"
                              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Unlock Theme</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="flex justify-center items-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <UserProfile routing="hash" />
          </div>
        )}
      </main>

      {/* Mobile Sticky Navigation Footer */}
        <footer className="md:hidden sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-theme-primary/10 grid grid-cols-5 py-2 px-1 text-center shadow-md">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 ${
              activeTab === "dashboard" ? "text-theme-primary font-black" : "text-slate-400"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Lessons</span>
          </button>
          <button
            onClick={() => handleTabClick("games")}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 ${
              activeTab === "games" ? "text-theme-primary font-black" : "text-slate-400"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Games</span>
          </button>
          <button
            onClick={() => handleTabClick("badges")}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 ${
              activeTab === "badges" ? "text-theme-primary font-black" : "text-slate-400"
            }`}
          >
            <div className="relative">
              <Award className="w-5 h-5" />
              {earnedBadges.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-900 text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black">
                  {earnedBadges.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Badges</span>
          </button>
          <button
            onClick={() => handleTabClick("shop")}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 ${
              activeTab === "shop" ? "text-theme-primary font-black" : "text-slate-400"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Shop</span>
          </button>
          <button
            onClick={() => handleTabClick("profile")}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 ${
              activeTab === "profile" ? "text-theme-primary font-black" : "text-slate-400"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Profile</span>
          </button>
        </footer>
    </div>
  );
}
