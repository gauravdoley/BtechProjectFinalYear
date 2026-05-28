"use client";

import React, { useState } from "react";
import { Lock, Unlock, CheckCircle2, ArrowRight, BookOpen, Volume2, Copy, Check } from "lucide-react";
import { playBubblePop, playSuccessChime, playFailureBuzz, playUnlockFanfare } from "./AudioSynthesizer";

// Define the educational module structure
export interface ModuleData {
  id: string;
  title: string;
  subtitle: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readingTime: string;
  description: string;
  unlockCodeRequired?: string; // The code the user MUST enter to unlock this
  unlockedCodeReward: string;  // The code this module reveals on completion
  color: string;               // tailwind color scheme
  borderColor: string;
  bgColor: string;
  accentColor: string;
  content: {
    introduction: string;
    keyPoints: { title: string; desc: string }[];
    funFact: string;
    vocabulary: { word: string; definition: string }[];
    conclusion: string;
  };
}

export const MODULES: ModuleData[] = [
  {
    id: "module-1",
    title: "The Ocean's Heartbeat",
    subtitle: "Global Climate Regulation",
    difficulty: "Beginner",
    readingTime: "3 min read",
    description: "Discover how the ocean acts as Earth's giant air conditioner, absorbing heat and producing the oxygen we breathe.",
    unlockedCodeReward: "CLIMATEHERO",
    color: "teal",
    borderColor: "border-teal-200",
    bgColor: "bg-teal-50/50",
    accentColor: "bg-teal-500",
    content: {
      introduction: "The ocean does far more than provide a home for fish. It acts as the primary life support system of our planet, regulating the weather, generating oxygen, and balancing temperature extremes.",
      keyPoints: [
        {
          title: "Earth's Thermostat",
          desc: "Water holds heat incredibly well. The ocean absorbs over 90% of the excess heat trapped by greenhouse gases, preventing the Earth from warming up too quickly."
        },
        {
          title: "The Carbon Sink",
          desc: "Marine habitats absorb about 30% of the carbon dioxide (CO2) released by human activities, locking it away deep underwater."
        },
        {
          title: "Oxygen Engine",
          desc: "Tiny marine organisms called phytoplankton drift in sunlit waters and use photosynthesis to create energy. In the process, they release massive amounts of oxygen—about 50% of the oxygen in our atmosphere!"
        }
      ],
      funFact: "For every second breath you take, you can thank the ocean! The phytoplankton floating on the surface produce half of the world's oxygen supply.",
      vocabulary: [
        { word: "Phytoplankton", definition: "Microscopic marine plants that drift on the surface of the ocean and generate oxygen." },
        { word: "Carbon Sink", definition: "A natural environment (like the ocean or a forest) that absorbs and stores carbon dioxide from the atmosphere." }
      ],
      conclusion: "Without the ocean's regulating heartbeat, Earth would be too hot and harsh for life as we know it. Protecting the ocean is directly protecting our own climate!"
    }
  },
  {
    id: "module-2",
    title: "The Plastic Tide",
    subtitle: "Marine Pollution & Ecosystems",
    difficulty: "Intermediate",
    readingTime: "4 min read",
    description: "Learn how plastics and chemicals end up in our seas, what microplastics are, and how they harm marine creatures.",
    unlockCodeRequired: "CLIMATEHERO",
    unlockedCodeReward: "CLEANOCEAN",
    color: "sky",
    borderColor: "border-sky-200",
    bgColor: "bg-sky-50/50",
    accentColor: "bg-sky-500",
    content: {
      introduction: "Our oceans are facing an invisible storm. Every year, millions of tons of waste flow into the ocean. From large plastic nets down to microplastics, human litter is changing the chemistry of marine habitats.",
      keyPoints: [
        {
          title: "The Plastic Inflow",
          desc: "Roughly 8 million metric tons of plastic waste enter the ocean every year. That's equivalent to dumping a full garbage truck of trash into the sea every single minute!"
        },
        {
          title: "Microplastics",
          desc: "Plastics do not decompose like organic material. Instead, sunlight and waves break them down into tiny fragments smaller than 5 millimeters, called microplastics, which are easily eaten by fish."
        },
        {
          title: "Ghost Fishing",
          desc: "Discarded fishing nets float endlessly in ocean currents, trapping fish, sea turtles, and dolphins in a destructive loop known as 'ghost fishing'."
        }
      ],
      funFact: "Scientists estimate that by the year 2050, there could be more plastic in the ocean by weight than actual fish if we do not change our habits!",
      vocabulary: [
        { word: "Microplastics", definition: "Very small pieces of plastic debris, measuring less than five millimeters, resulting from the breakdown of consumer items." },
        { word: "Bioaccumulation", definition: "The build-up of chemicals or plastics inside a living organism over time as it eats polluted food." }
      ],
      conclusion: "Every pieces of plastic we reduce, reuse, or recycle keeps trash out of the ocean. By changing our land habits, we can turn back the plastic tide!"
    }
  },
  {
    id: "module-3",
    title: "Balancing the Scale",
    subtitle: "Overfishing & Sustainable Seas",
    difficulty: "Advanced",
    readingTime: "4 min read",
    description: "Understand the delicate food web, how overfishing disrupts marine life, and the strategies we can use to harvest sustainably.",
    unlockCodeRequired: "CLEANOCEAN",
    unlockedCodeReward: "CORALGUARD",
    color: "rose",
    borderColor: "border-rose-200",
    bgColor: "bg-rose-50/50",
    accentColor: "bg-rose-500",
    content: {
      introduction: "Fish are a vital food source for billions of people. However, advanced fishing technology has allowed humans to catch fish faster than their populations can naturally reproduce.",
      keyPoints: [
        {
          title: "Depleting Wild Stocks",
          desc: "According to the UN, over 34% of the world's fish populations are currently classified as overfished, meaning they are being depleted beyond sustainable rates."
        },
        {
          title: "Bycatch",
          desc: "Large industrial nets catch everything in their path. Millions of tons of unwanted marine animals, including sharks, dolphins, and turtles, are caught by accident and discarded."
        },
        {
          title: "Coral Destruction",
          desc: "Fishing methods like bottom trawling drag heavy metal plates and nets across the seafloor, scraping away fragile coral reefs that took thousands of years to grow."
        }
      ],
      funFact: "Marine Protected Areas (MPAs) are like underwater national parks. When fishing is banned in these areas, fish populations bounce back incredibly fast and overflow into nearby waters!",
      vocabulary: [
        { word: "Sustainable Quota", definition: "A limit set on the weight of fish that can be caught within a certain time to ensure the species can survive." },
        { word: "Bycatch", definition: "The accidental capture of non-target marine species during commercial fishing operations." }
      ],
      conclusion: "By choosing sustainably sourced seafood and advocating for marine sanctuaries, we can balance the scales and let ocean life replenish!"
    }
  }
];

interface LearningModulesProps {
  modules: ModuleData[];
  unlockedModules: string[];
  completedModules: string[];
  onCompleteModule: (moduleId: string) => void;
  onUnlockModule: (moduleId: string) => void;
  triggerConfetti: () => void;
}

export default function LearningModules({
  modules,
  unlockedModules,
  completedModules,
  onCompleteModule,
  onUnlockModule,
  triggerConfetti
}: LearningModulesProps) {
  const [activeModule, setActiveModule] = useState<ModuleData | null>(null);
  const [unlockCode, setUnlockCode] = useState<{ [key: string]: string }>({});
  const [unlockError, setUnlockError] = useState<{ [key: string]: string }>({});
  const [shakingModuleId, setShakingModuleId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper to dynamically match modules to active theme's colors
  const getThemeClasses = (moduleId: string) => {
    if (moduleId === "module-1") {
      return {
        borderColor: "border-theme-primary/25",
        accentBg: "bg-theme-primary",
        textAccent: "text-theme-primary",
      };
    }
    if (moduleId === "module-2") {
      return {
        borderColor: "border-theme-secondary/25",
        accentBg: "bg-theme-secondary",
        textAccent: "text-theme-secondary",
      };
    }
    return {
      borderColor: "border-theme-accent/25",
      accentBg: "bg-theme-accent",
      textAccent: "text-theme-accent",
    };
  };

  const handleCardClick = (module: ModuleData) => {
    if (!unlockedModules.includes(module.id)) {
      playFailureBuzz();
      return;
    }
    playBubblePop();
    setActiveModule(module);
  };

  const handleCloseModal = () => {
    playBubblePop();
    setActiveModule(null);
  };

  const handleFinishLesson = (moduleId: string) => {
    playSuccessChime();
    triggerConfetti();
    onCompleteModule(moduleId);
  };

  const handleCodeSubmit = (e: React.FormEvent, module: ModuleData) => {
    e.preventDefault();
    const entered = (unlockCode[module.id] || "").trim().toUpperCase();
    
    if (entered === module.unlockCodeRequired) {
      playUnlockFanfare();
      triggerConfetti();
      onUnlockModule(module.id);
      setUnlockError(prev => ({ ...prev, [module.id]: "" }));
    } else {
      playFailureBuzz();
      setUnlockError(prev => ({ ...prev, [module.id]: "Incorrect code. Try again!" }));
      setShakingModuleId(module.id);
      setTimeout(() => setShakingModuleId(null), 500);
    }
  };

  const modalTheme = activeModule ? getThemeClasses(activeModule.id) : null;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Learning Dashboard</h2>
        <p className="text-slate-600 max-w-xl mx-auto font-medium text-sm md:text-base">
          Read the modules to unlock secret keys. Enter keys to open next levels. Follow the progression to become an Ocean Guardian!
        </p>
      </div>

      {/* Grid of modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modules.map((m) => {
          const isUnlocked = unlockedModules.includes(m.id);
          const isCompleted = completedModules.includes(m.id);
          const themeClasses = getThemeClasses(m.id);
          
          return (
            <div
              key={m.id}
              className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-md ${
                isUnlocked
                  ? `${themeClasses.borderColor} bg-white hover:shadow-xl hover:-translate-y-1`
                  : "border-slate-200 bg-slate-100/50"
              } ${shakingModuleId === m.id ? "animate-shake border-rose-400 bg-rose-50/20" : ""}`}
            >
              {/* Top accent line */}
              <div className={`h-3 w-full transition-colors duration-500 ${isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : isUnlocked ? themeClasses.accentBg : "bg-slate-300"}`} />

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between h-[340px]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors duration-300 ${
                      isUnlocked 
                        ? isCompleted 
                          ? "bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200" 
                          : "bg-theme-primary-light text-theme-primary-dark" 
                        : "bg-slate-200 text-slate-500"
                    }`}>
                      {isCompleted ? <><CheckCircle2 className="w-3 h-3" /> 100% Complete</> : m.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{m.readingTime}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-1 leading-tight">{m.title}</h3>
                  <p className={`text-xs font-bold ${themeClasses.textAccent} mb-3 tracking-wide uppercase`}>{m.subtitle}</p>
                  <p className="text-sm text-slate-600 font-medium line-clamp-4">{m.description}</p>
                </div>

                {/* Card footer / unlock controls */}
                <div className="mt-4">
                  {isUnlocked ? (
                    isCompleted ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-100 justify-center">
                          <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                          <span>Module Mastered!</span>
                        </div>
                        <div className="bg-theme-primary-light border border-theme-primary/15 p-2.5 rounded-xl text-center flex flex-col items-center justify-center">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-theme-primary">Next Stage Unlock Code</p>
                          <div className="flex items-center justify-center gap-2 mt-1 w-full">
                            <span className="text-base font-extrabold text-theme-primary-dark tracking-widest pl-6 select-all">{m.unlockedCodeReward}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(m.unlockedCodeReward)}
                              className="p-1 rounded-md text-theme-primary hover:bg-theme-primary/15 hover:text-theme-primary-dark transition-all active:scale-90"
                              title="Copy to clipboard"
                            >
                              {copiedCode === m.unlockedCodeReward ? (
                                <Check className="w-4 h-4 text-green-600 scale-110 duration-200" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCardClick(m)}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-sm ${themeClasses.accentBg}`}
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Start Reading</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )
                  ) : (
                    <form onSubmit={(e) => handleCodeSubmit(e, m)} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs mb-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked (Requires Code)</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ENTER CODE"
                          value={unlockCode[m.id] || ""}
                          onChange={(e) => setUnlockCode(prev => ({ ...prev, [m.id]: e.target.value }))}
                          className="flex-1 px-3 py-2 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-slate-200 focus:border-theme-primary outline-hidden"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all"
                        >
                          Unlock
                        </button>
                      </div>
                      {unlockError[m.id] && (
                        <p className="text-[10px] text-rose-500 font-bold">{unlockError[m.id]}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Popup for active module */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Modal Header */}
            <div className={`p-6 text-white ${modalTheme?.accentBg}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-extrabold uppercase bg-white/20 px-3 py-1 rounded-full tracking-wider">
                  {activeModule.difficulty} Level
                </span>
                <button
                  onClick={handleCloseModal}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all text-white font-bold text-sm w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-2xl font-black">{activeModule.title}</h3>
              <p className="text-white/80 text-sm font-semibold mt-1">{activeModule.subtitle}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              <p className="text-slate-700 text-base md:text-lg leading-relaxed font-semibold">
                {activeModule.content.introduction}
              </p>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase text-slate-400 tracking-wider">Key Discoveries</h4>
                <div className="grid gap-4">
                  {activeModule.content.keyPoints.map((kp, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${modalTheme?.accentBg}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800 text-base mb-1">{kp.title}</h5>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{kp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Fact Callout */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h5 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-1">Ocean Fact!</h5>
                  <p className="text-sm text-amber-700 font-semibold leading-relaxed">{activeModule.content.funFact}</p>
                </div>
              </div>

              {/* Vocabulary definitions */}
              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase text-slate-400 tracking-wider">Ocean Vocabulary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeModule.content.vocabulary.map((v, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-theme-primary-light/50 border border-theme-primary/10">
                      <p className="font-black text-theme-primary-dark text-sm mb-1">{v.word}</p>
                      <p className="text-xs text-theme-primary font-semibold leading-relaxed">{v.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-slate-600 text-sm leading-relaxed italic font-medium">
                  {activeModule.content.conclusion}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <p className="text-xs text-slate-500 font-bold max-w-[60%]">
                Read all sections carefully to absorb the knowledge!
              </p>
              <button
                onClick={() => {
                  handleFinishLesson(activeModule.id);
                  handleCloseModal();
                }}
                className={`py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-2 ${modalTheme?.accentBg}`}
              >
                <span>Finish Lesson</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
