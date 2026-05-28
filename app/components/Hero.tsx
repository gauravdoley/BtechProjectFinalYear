"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Waves, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { playBubblePop } from "./AudioSynthesizer";

interface HeroProps {
  onStartLearning: () => void;
}

interface BubbleItem {
  id: number;
  left: string;
  size: string;
  delay: string;
  duration: string;
  popping: boolean;
}

export default function Hero({ onStartLearning }: HeroProps) {
  const router = useRouter();
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  // Generate floating interactive bubbles on client side
  useEffect(() => {
    const bubbleList = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      size: `${Math.random() * 35 + 25}px`, // slightly larger for easier tapping
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 9 + 7}s`,
      popping: false,
    }));
    setBubbles(bubbleList);
  }, []);

  const handleBubbleClick = (id: number) => {
    playBubblePop();
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popping: true } : b))
    );

    // Replace popped bubble with a new one at the bottom after pop animation finishes
    setTimeout(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            return {
              id: id,
              left: `${Math.random() * 95}%`,
              size: `${Math.random() * 35 + 25}px`,
              delay: "0s", // rise immediately
              duration: `${Math.random() * 9 + 7}s`,
              popping: false,
            };
          }
          return b;
        })
      );
    }, 250);
  };

  const handleStart = () => {
    playBubblePop();
    setShowKeyPrompt(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen overflow-hidden px-6 py-12 md:py-20 bg-gradient-to-b from-theme-primary-light/40 via-white/50 to-theme-primary-light/20 text-slate-800">
      {/* Clerk Auth UI */}
      <div className="absolute top-0 right-0 p-6 z-40 flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="px-5 py-2 font-bold text-theme-primary bg-white/80 backdrop-blur-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2 font-bold text-white bg-theme-primary rounded-xl shadow-sm shadow-theme-primary/20 hover:bg-theme-primary-hover transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-sm">
            <UserButton />
          </div>
        </Show>
      </div>

      {/* Admin Key Prompt Modal */}
      {showKeyPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-theme-primary-light flex items-center justify-center text-theme-primary mb-6 shadow-sm border border-theme-primary/10">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Access Portal</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Enter the secret key to access the admin portal, or skip this step to enter the learning platform.
            </p>
            
            <div className="relative mb-8">
              <input 
                type="password" 
                value={adminKey} 
                onChange={(e) => setAdminKey(e.target.value)} 
                placeholder="Enter secret key..."
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-theme-primary focus:outline-none focus:ring-4 focus:ring-theme-primary/10 transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
              />
            </div>
            
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3">
              <button 
                onClick={() => {
                  playBubblePop();
                  setShowKeyPrompt(false);
                  onStartLearning();
                }}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Skip & Play
              </button>
              <button 
                onClick={() => {
                  playBubblePop();
                  if (adminKey === "i am batman") {
                    router.push("/admin");
                  } else {
                    setAdminKey("");
                  }
                }}
                className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-theme-primary shadow-lg shadow-theme-primary/30 hover:bg-theme-primary-hover hover:-translate-y-0.5 transition-all"
              >
                Verify Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clickable Floating Bubbles (Tactile/Calming Sensory Loop) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => handleBubbleClick(b.id)}
            className={`bubble bubble-clickable flex items-center justify-center select-none ${
              b.popping ? "animate-bubble-pop" : ""
            }`}
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.popping ? "0s" : b.delay,
              animationDuration: b.popping ? "0.25s" : b.duration,
            }}
          >
            {/* Specular highlight for a satisfying glossy look */}
            <span className="w-1.5 h-1.5 rounded-full bg-white/45 absolute top-1.5 left-2" />
          </button>
        ))}
      </div>

      {/* Decorative Wave Overlay */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[200%] h-[80px] text-theme-primary/10 wave-animation"
        >
          <path
            d="M0,0 C150,90 350,90 500,40 C650,-10 850,-10 1000,40 C1150,90 1350,90 1500,40 C1650,-10 1850,-10 2000,40 L2000,120 L0,120 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      {/* Main Content (z-20 to be clickable in front of interactive bubbles) */}
      <div className="relative z-20 max-w-5xl w-full flex flex-col items-center text-center my-auto gap-8 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-primary-light text-theme-primary-dark border border-theme-primary/20 shadow-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-theme-primary fill-theme-secondary/50" />
          <span>Dive into the Blue World! Pop the bubbles! 🫧</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Explore the Wonders of the Ocean with <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">Ocean Guardian</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
          Welcome, future Ocean Guardian! Embark on an exciting journey to explore beautiful marine life, understand how the oceans protect our Earth, and learn how to save them from pollution and overfishing.
        </p>

        {/* Play Button CTA */}
        <button
          onClick={handleStart}
          className="group relative flex items-center gap-3 px-8 py-5 rounded-2xl bg-theme-primary text-white font-bold text-lg md:text-xl transition-all duration-300 shadow-lg shadow-theme-primary/30 hover:bg-theme-primary-hover hover:shadow-xl hover:shadow-theme-primary-hover/40 hover:-translate-y-1 active:translate-y-0 pointer-events-auto"
        >
          <span>Start Learning Quest</span>
          <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Feature highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 md:mt-16 text-left pointer-events-auto">
          {/* Card 1 */}
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/75 backdrop-blur-md border border-white/60 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Bite-Sized Modules</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Explore easy-to-understand modules with interactive graphics covering climate, plastic tides, and balanced eco-systems.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/75 backdrop-blur-md border border-white/60 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-xl bg-theme-secondary/10 flex items-center justify-center text-theme-secondary">
              <Waves className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Interactive Games</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Reinforce your knowledge with memory matching card games and quiz trivia designed to test your ocean literacy.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/75 backdrop-blur-md border border-white/60 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-xl bg-theme-accent/10 flex items-center justify-center text-theme-accent">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Earn Secret Codes</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Complete quizzes and modules to obtain special secret keys, unlock advanced levels, and earn legendary Guardian Badges!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

