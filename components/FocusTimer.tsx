
import React, { useState, useEffect, useMemo } from 'react';
import { Square, Plus, Sparkles } from 'lucide-react';
import { Dragon, DragonStage } from '../types';
import { calculateStage } from '../services/utils';
import { DragonIcon } from './DragonVisuals';

interface FocusTimerProps {
  durationMinutes: number;
  onComplete: () => void;
  onCancel: () => void;
  dragon?: Dragon;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ durationMinutes, onComplete, onCancel, dragon }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [totalTime, setTotalTime] = useState(durationMinutes * 60);
  const [actualElapsed, setActualElapsed] = useState(0); 
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    setTimeLeft(durationMinutes * 60);
    setTotalTime(durationMinutes * 60);
  }, [durationMinutes]);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 80; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(seconds => seconds - 1);
        setActualElapsed(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const addTime = (minutes: number) => {
    setTimeLeft(prev => prev + (minutes * 60));
    setTotalTime(prev => prev + (minutes * 60));
  };

  const visualStage = useMemo((): DragonStage => {
    if (!dragon) return 'egg';
    if (dragon.stage === 'ancient') return 'ancient';
    if (dragon.evolutionConfig.type === 'streak') return dragon.stage; 

    const currentMinutes = dragon.totalFocusMinutes + (actualElapsed / 60);
    const thresholds = dragon.evolutionConfig.thresholds;
    return calculateStage(currentMinutes, thresholds);
  }, [dragon, actualElapsed]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="flex flex-col items-center justify-center py-6 animate-in fade-in duration-500 w-full">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Glow Filters */}
        <svg className="w-0 h-0">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* SVG Progress Bar */}
        <svg className="transform -rotate-90 w-full h-full overflow-visible" viewBox="0 0 220 220">
          {/* Background Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#1e293b"
            strokeWidth="12"
            fill="transparent"
            className="opacity-50"
          />
          {/* Progress Path */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="url(#timerGradient)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          {dragon && (
             <div className="mb-3 transition-all duration-500 animate-in zoom-in spin-in-3">
                 <DragonIcon 
                    type={dragon.type} 
                    stage={visualStage} 
                    size={56} 
                    className={`drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] ${visualStage !== dragon.stage ? 'animate-bounce' : ''}`} 
                 />
             </div>
          )}
          <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-wider font-mono drop-shadow-sm">
            {formattedTime}
          </span>
          <span className="text-xs text-emerald-400/80 mt-2 uppercase tracking-[0.2em] font-bold flex items-center gap-1">
            <Sparkles size={10} /> {visualStage}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-xs">
        <button 
          onClick={() => addTime(5)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800/50 hover:bg-slate-700/80 text-emerald-300 rounded-full text-sm font-bold transition-all border border-slate-700 hover:border-emerald-500/30 w-full"
        >
          <Plus size={16} /> Add 5 Minutes
        </button>

        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-transparent hover:bg-red-950/30 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium w-full"
        >
          <Square size={14} fill="currentColor" />
          Give Up
        </button>
      </div>
      
      <p className="mt-6 text-slate-600 text-xs font-medium max-w-xs text-center animate-pulse">
        Training strengthens the bond...
      </p>
    </div>
  );
};

export default FocusTimer;
