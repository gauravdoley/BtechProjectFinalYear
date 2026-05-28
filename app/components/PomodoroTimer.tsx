"use client";

import React, { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import { playBubblePop } from "./AudioSynthesizer";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play a soft chime when timer is done
      playBubblePop();
      playBubblePop();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    playBubblePop();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    playBubblePop();
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/60 py-1.5 px-3 rounded-2xl shadow-sm transition-all">
      <div className="flex items-center gap-1.5 text-slate-700">
        <Timer className={`w-4 h-4 ${isActive ? 'text-theme-primary animate-pulse' : 'text-slate-400'}`} />
        <span className="font-mono font-bold text-sm min-w-[3.5rem] tracking-tight">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      
      <div className="flex items-center gap-1 border-l border-slate-300/50 pl-2 ml-1">
        <button 
          onClick={toggleTimer}
          className="p-1 rounded-md text-slate-500 hover:text-theme-primary hover:bg-slate-200 transition-colors"
          title={isActive ? "Pause Focus" : "Start Focus"}
        >
          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button 
          onClick={resetTimer}
          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
