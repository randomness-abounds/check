
import React from 'react';
import { Flame, Droplets, Mountain, Wind, Sparkles } from 'lucide-react';
import { DragonType, DragonStage } from '../types';

// --- BABY ASSETS ---

const BabyIgnis = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 4px 8px rgba(239, 68, 68, 0.3))' }}>
    <defs>
        <linearGradient id="ignis-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" /> 
            <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="ignis-belly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
         <linearGradient id="flame-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <clipPath id="ignis-body-clip">
           <ellipse cx="100" cy="135" rx="55" ry="48" />
        </clipPath>
    </defs>
    
    <g className="animate-bounce-subtle">
        {/* Tail */}
        <path d="M140 150 Q 185 165 180 125" stroke="#ef4444" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M175 125 Q 185 110 195 125 T 180 140 Z" fill="url(#flame-grad)" />

        {/* Tiny Wings */}
        <path d="M45 105 Q 15 85 10 105 T 40 125 Z" fill="#ef4444" opacity="0.8" transform="rotate(-15 45 105)" />
        <path d="M155 105 Q 185 85 190 105 T 160 125 Z" fill="#ef4444" opacity="0.8" transform="rotate(15 155 105)" />

        {/* Body Base */}
        <ellipse cx="100" cy="135" rx="55" ry="48" fill="url(#ignis-body)" />
        
        {/* Belly */}
        <g clipPath="url(#ignis-body-clip)">
            <ellipse cx="100" cy="160" rx="42" ry="32" fill="url(#ignis-belly)" opacity="0.9" />
        </g>

        {/* Feet */}
        <circle cx="75" cy="175" r="12" fill="#b91c1c" />
        <circle cx="125" cy="175" r="12" fill="#b91c1c" />

        {/* Head */}
        <circle cx="100" cy="75" r="48" fill="url(#ignis-body)" />
        
        {/* Eyes */}
        <g transform="translate(0, 5)">
            <circle cx="80" cy="70" r="10" fill="#1e293b" />
            <circle cx="120" cy="70" r="10" fill="#1e293b" />
            <circle cx="84" cy="66" r="4" fill="white" />
            <circle cx="124" cy="66" r="4" fill="white" />
        </g>
        
        {/* Horns */}
        <path d="M75 35 Q 65 20 55 30" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M125 35 Q 135 20 145 30" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Flame Tuft */}
        <path d="M100 35 Q 110 5 100 -5 Q 90 5 100 35" fill="url(#flame-grad)" className="animate-pulse" />
        
        {/* Arms */}
        <ellipse cx="65" cy="125" rx="10" ry="7" fill="#f87171" transform="rotate(-20 65 125)" />
        <ellipse cx="135" cy="125" rx="10" ry="7" fill="#f87171" transform="rotate(20 135 125)" />
    </g>
  </svg>
);

const BabyAqua = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 4px 8px rgba(59, 130, 246, 0.3))' }}>
    <defs>
        <linearGradient id="aqua-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" /> 
            <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="aqua-belly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <clipPath id="aqua-body-clip">
           <ellipse cx="100" cy="135" rx="55" ry="48" />
        </clipPath>
    </defs>
    
    <g className="animate-bounce-subtle">
        {/* Tail */}
        <path d="M145 155 Q 180 180 190 150 Q 200 120 170 140" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />

        {/* Body Base */}
        <ellipse cx="100" cy="135" rx="55" ry="48" fill="url(#aqua-body)" />
        
        {/* Belly */}
        <g clipPath="url(#aqua-body-clip)">
            <ellipse cx="100" cy="155" rx="45" ry="35" fill="url(#aqua-belly)" opacity="0.8" />
        </g>

        {/* Fin Ears */}
        <path d="M55 55 Q 30 40 25 70 T 55 85 Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
        <path d="M145 55 Q 170 40 175 70 T 145 85 Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />

        {/* Head */}
        <circle cx="100" cy="75" r="48" fill="url(#aqua-body)" />
        
        {/* Eyes */}
        <g transform="translate(0, 5)">
            <circle cx="80" cy="70" r="10" fill="#1e293b" />
            <circle cx="120" cy="70" r="10" fill="#1e293b" />
            <circle cx="84" cy="66" r="4" fill="white" />
            <circle cx="124" cy="66" r="4" fill="white" />
        </g>
        
        {/* Bubbles */}
        <circle cx="160" cy="40" r="6" fill="white" opacity="0.4" className="animate-pulse" />
        <circle cx="175" cy="60" r="4" fill="white" opacity="0.2" className="animate-pulse" />

        {/* Arms/Flippers */}
        <ellipse cx="60" cy="120" rx="14" ry="8" fill="#60a5fa" transform="rotate(-40 60 120)" />
        <ellipse cx="140" cy="120" rx="14" ry="8" fill="#60a5fa" transform="rotate(40 140 120)" />
        
        {/* Shine on head */}
        <ellipse cx="85" cy="55" rx="10" ry="15" fill="white" opacity="0.2" transform="rotate(-30 85 55)" />
    </g>
  </svg>
);

const BabyTerra = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}>
    <defs>
        <linearGradient id="terra-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" /> 
            <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="terra-belly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
         <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>
        <clipPath id="body-clip">
           <ellipse cx="100" cy="135" rx="55" ry="48" />
        </clipPath>
    </defs>
    
    <g className="animate-bounce-subtle">
        {/* Tail */}
        <path d="M140 150 Q 180 160 185 130 Q 190 100 160 120" fill="#059669" stroke="#047857" strokeWidth="3" />

        {/* Tiny Wings */}
        <path d="M50 100 Q 20 80 15 100 T 45 120 Z" fill="#6ee7b7" stroke="#059669" strokeWidth="2" transform="rotate(-10 50 100)" />
        <path d="M150 100 Q 180 80 185 100 T 155 120 Z" fill="#6ee7b7" stroke="#059669" strokeWidth="2" transform="rotate(10 150 100)" />

        {/* Body Base */}
        <ellipse cx="100" cy="135" rx="55" ry="48" fill="url(#terra-body)" />
        
        {/* Belly Patches (Clipped) */}
        <g clipPath="url(#body-clip)">
            <ellipse cx="100" cy="160" rx="40" ry="30" fill="url(#terra-belly)" opacity="0.9" />
        </g>

        {/* Feet */}
        <ellipse cx="70" cy="170" rx="14" ry="10" fill="#047857" />
        <ellipse cx="130" cy="170" rx="14" ry="10" fill="#047857" />
        <path d="M65 170 L65 175 M70 170 L70 175 M75 170 L75 175" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
        <path d="M125 170 L125 175 M130 170 L130 175 M135 170 L135 175" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />

        {/* Head */}
        <circle cx="100" cy="75" r="48" fill="url(#terra-body)" />
        
        {/* Face Details */}
        <ellipse cx="100" cy="95" rx="20" ry="12" fill="#047857" opacity="0.1" /> {/* Snout shadow */}
        
        {/* Eyes */}
        <g transform="translate(0, 5)">
            <circle cx="80" cy="70" r="9" fill="#020617" />
            <circle cx="120" cy="70" r="9" fill="#020617" />
            <circle cx="83" cy="67" r="3.5" fill="white" />
            <circle cx="123" cy="67" r="3.5" fill="white" />
            <circle cx="77" cy="73" r="1.5" fill="white" opacity="0.5" />
            <circle cx="117" cy="73" r="1.5" fill="white" opacity="0.5" />
        </g>
        
        {/* Cheeks */}
        <circle cx="70" cy="90" r="6" fill="#fca5a5" opacity="0.5" />
        <circle cx="130" cy="90" r="6" fill="#fca5a5" opacity="0.5" />

        {/* Head Sprout */}
        <path d="M100 35 Q 90 15 70 25" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M100 35 Q 110 15 130 25" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M100 30 L 100 5 Q 85 -5 100 5 Q 115 -5 100 5 Z" fill="url(#leaf-grad)" transform="rotate(-5 100 30)" />
        
        {/* Arms */}
        <ellipse cx="65" cy="125" rx="12" ry="8" fill="#34d399" transform="rotate(-30 65 125)" />
        <ellipse cx="135" cy="125" rx="12" ry="8" fill="#34d399" transform="rotate(30 135 125)" />
    </g>
  </svg>
);

// --- TEEN ASSETS ---

const TeenIgnis = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 6px 12px rgba(239, 68, 68, 0.4))' }}>
    <defs>
      <linearGradient id="teen-ignis-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="teen-ignis-flame" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <g className="animate-bounce-subtle">
      {/* Tail - Longer and sharper */}
      <path d="M140 140 Q 190 180 190 120 T 170 80" stroke="#ef4444" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M165 75 Q 175 55 190 75 T 165 95 Z" fill="url(#teen-ignis-flame)" className="animate-pulse" />

      {/* Larger Wings */}
      <path d="M60 80 Q 20 40 10 90 T 50 110 Z" fill="#991b1b" opacity="0.9" />
      <path d="M140 80 Q 180 40 190 90 T 150 110 Z" fill="#991b1b" opacity="0.9" />

      {/* Body - More athletic */}
      <ellipse cx="100" cy="120" rx="60" ry="55" fill="url(#teen-ignis-body)" />
      <ellipse cx="100" cy="140" rx="40" ry="25" fill="#fca5a5" opacity="0.3" />

      {/* Head - More angular */}
      <path d="M70 70 Q 100 20 130 70 L 120 100 Q 100 110 80 100 Z" fill="url(#teen-ignis-body)" />
      
      {/* Eyes - Determined */}
      <circle cx="85" cy="70" r="8" fill="#1e293b" />
      <circle cx="115" cy="70" r="8" fill="#1e293b" />
      <circle cx="87" cy="67" r="3" fill="white" />
      <circle cx="117" cy="67" r="3" fill="white" />

      {/* Horns - Larger and pointed */}
      <path d="M80 35 Q 70 5 50 20" stroke="#f59e0b" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M120 35 Q 130 5 150 20" stroke="#f59e0b" strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* Fiery Crest */}
      <path d="M100 40 Q 115 10 100 -10 Q 85 10 100 40" fill="url(#teen-ignis-flame)" className="animate-pulse" />
      <path d="M90 45 Q 95 25 85 15" stroke="url(#teen-ignis-flame)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M110 45 Q 105 25 115 15" stroke="url(#teen-ignis-flame)" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Sharp Arms */}
      <path d="M60 110 Q 40 130 50 150" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M140 110 Q 160 130 150 150" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

const TeenAqua = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 6px 12px rgba(59, 130, 246, 0.4))' }}>
    <defs>
      <linearGradient id="teen-aqua-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="teen-aqua-fin" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <g className="animate-bounce-subtle">
      {/* Serpentine Tail */}
      <path d="M140 120 Q 190 140 180 90 Q 170 40 130 30" stroke="url(#teen-aqua-body)" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M125 30 Q 110 10 135 -5 T 150 25 Z" fill="url(#teen-aqua-fin)" opacity="0.8" />

      {/* Fluid Body */}
      <ellipse cx="100" cy="110" rx="70" ry="50" fill="url(#teen-aqua-body)" />
      <ellipse cx="100" cy="120" rx="45" ry="20" fill="#bfdbfe" opacity="0.3" />

      {/* Elegant Head */}
      <ellipse cx="80" cy="70" rx="45" ry="35" fill="url(#teen-aqua-body)" transform="rotate(-10 80 70)" />
      
      {/* Determining Eyes */}
      <circle cx="70" cy="65" r="7" fill="#1e293b" />
      <circle cx="95" cy="70" r="7" fill="#1e293b" />
      <circle cx="72" cy="62" r="3" fill="white" />
      <circle cx="97" cy="67" r="3" fill="white" />

      {/* Large Fins/Ears */}
      <path d="M50 50 Q 10 20 20 80 T 50 70" fill="url(#teen-aqua-fin)" stroke="#1d4ed8" strokeWidth="2" />
      <path d="M110 60 Q 140 30 150 80 T 120 90" fill="url(#teen-aqua-fin)" stroke="#1d4ed8" strokeWidth="2" />

      {/* Dorsal Fin */}
      <path d="M100 60 Q 120 30 140 60 Z" fill="url(#teen-aqua-fin)" opacity="0.6" />

      {/* Bubble Accents */}
      <circle cx="160" cy="120" r="8" fill="white" opacity="0.4" className="animate-pulse" />
      <circle cx="175" cy="140" r="5" fill="white" opacity="0.2" className="animate-pulse" />

      {/* Flippers */}
      <path d="M60 120 Q 30 140 40 165" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M140 120 Q 170 140 160 165" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

const TeenTerra = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 6px 12px rgba(5, 150, 105, 0.4))' }}>
    <defs>
      <linearGradient id="teen-terra-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
      <linearGradient id="teen-terra-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#3f6212" />
      </linearGradient>
    </defs>
    <g className="animate-bounce-subtle">
      {/* Thick Tail */}
      <path d="M130 130 Q 180 150 170 100 Q 160 60 140 80" stroke="#059669" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M135 75 L 160 55 Q 170 70 150 85 Z" fill="url(#teen-terra-leaf)" />

      {/* Sturdy Body */}
      <rect x="50" y="80" width="100" height="90" rx="40" fill="url(#teen-terra-body)" />
      <path d="M70 130 L 130 130 Q 130 160 100 160 T 70 130" fill="#6ee7b7" opacity="0.2" />

      {/* Rugged Head */}
      <path d="M60 70 Q 100 20 140 70 Q 140 100 100 110 T 60 70" fill="url(#teen-terra-body)" />
      
      {/* Calm, Strong Eyes */}
      <circle cx="85" cy="70" r="8" fill="#1e293b" />
      <circle cx="115" cy="70" r="8" fill="#1e293b" />
      <circle cx="87" cy="65" r="3" fill="white" />
      <circle cx="117" cy="65" r="3" fill="white" />

      {/* Branchy Horns */}
      <path d="M85 35 Q 75 10 50 15" stroke="#78350f" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M115 35 Q 125 10 150 15" stroke="#78350f" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Lush Sprout */}
      <path d="M100 35 L 100 10 Q 80 0 100 0 Q 120 0 100 10" fill="url(#teen-terra-leaf)" />
      <path d="M90 30 Q 80 15 65 20" stroke="url(#teen-terra-leaf)" strokeWidth="4" fill="none" />
      <path d="M110 30 Q 120 15 135 20" stroke="url(#teen-terra-leaf)" strokeWidth="4" fill="none" />

      {/* Strong Feet */}
      <rect x="60" y="160" width="25" height="20" rx="5" fill="#064e3b" />
      <rect x="115" y="160" width="25" height="20" rx="5" fill="#064e3b" />

      {/* Rocky Armor Bits */}
      <circle cx="65" cy="100" r="6" fill="#334155" opacity="0.5" />
      <circle cx="135" cy="110" r="5" fill="#334155" opacity="0.5" />
      <circle cx="100" cy="150" r="4" fill="#334155" opacity="0.5" />
    </g>
  </svg>
);

// --- ADULT ASSETS ---

const AdultIgnis = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 8px 16px rgba(239, 68, 68, 0.5))' }}>
    <defs>
      <linearGradient id="adult-ignis-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
      <linearGradient id="adult-ignis-wing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#991b1b" />
        <stop offset="100%" stopColor="#450a0a" />
      </linearGradient>
      <linearGradient id="adult-ignis-flame" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
    </defs>
    <g className="animate-bounce-subtle">
      {/* Massive Wings */}
      <path d="M40 90 Q -20 20 80 50 T 60 110 Z" fill="url(#adult-ignis-wing)" />
      <path d="M160 90 Q 220 20 120 50 T 140 110 Z" fill="url(#adult-ignis-wing)" />
      
      {/* Powerful Tail */}
      <path d="M120 150 Q 190 200 190 130 T 160 80 Q 150 60 170 40" stroke="url(#adult-ignis-body)" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M170 35 Q 185 15 200 35 T 170 55 Z" fill="url(#adult-ignis-flame)" className="animate-pulse" />

      {/* Heavy Body */}
      <path d="M50 140 Q 100 170 150 140 L 140 100 Q 100 90 60 100 Z" fill="url(#adult-ignis-body)" />
      <path d="M70 130 Q 100 150 130 130" stroke="#fca5a5" strokeWidth="4" opacity="0.3" fill="none" strokeLinecap="round" />

      {/* Majestic Head */}
      <path d="M60 70 Q 100 0 140 70 L 125 100 Q 100 115 75 100 Z" fill="url(#adult-ignis-body)" />
      
      {/* Fierce Eyes */}
      <circle cx="85" cy="65" r="9" fill="#1e293b" />
      <circle cx="115" cy="65" r="9" fill="#1e293b" />
      <circle cx="88" cy="62" r="3" fill="#fbbf24" />
      <circle cx="118" cy="62" r="3" fill="#fbbf24" />

      {/* Crowned Horns */}
      <path d="M75 30 Q 60 -10 30 10" stroke="#fbbf24" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M125 30 Q 140 -10 170 10" stroke="#fbbf24" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M90 25 L 100 5 L 110 25 Z" fill="#fbbf24" />

      {/* Raging Crest */}
      <path d="M100 35 Q 120 0 100 -25 Q 80 0 100 35" fill="url(#adult-ignis-flame)" className="animate-pulse" />
      
      {/* Claws */}
      <path d="M65 155 Q 55 175 65 185" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M135 155 Q 145 175 135 185" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

const AdultAqua = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 8px 16px rgba(59, 130, 246, 0.5))' }}>
    <defs>
      <linearGradient id="adult-aqua-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="adult-aqua-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <g className="animate-bounce-subtle">
      {/* Serpentine Loops */}
      <path d="M150 150 Q 200 180 180 120 Q 160 60 100 50 Q 40 40 20 80 Q 0 120 40 140" stroke="url(#adult-aqua-body)" strokeWidth="24" fill="none" strokeLinecap="round" />
      
      {/* Fin Details along back */}
      <path d="M80 50 Q 90 20 100 50" fill="#93c5fd" opacity="0.6" />
      <path d="M120 55 Q 130 30 140 55" fill="#93c5fd" opacity="0.6" />

      {/* Masterful Head */}
      <path d="M40 80 Q 70 30 110 80 Q 110 110 70 120 T 40 80" fill="url(#adult-aqua-body)" />
      
      {/* Wise Eyes */}
      <circle cx="75" cy="75" r="8" fill="#1e293b" />
      <circle cx="100" cy="85" r="8" fill="#1e293b" />
      <circle cx="77" cy="72" r="3" fill="#60a5fa" />
      <circle cx="102" cy="82" r="3" fill="#60a5fa" />

      {/* Flowing Whiskers */}
      <path d="M60 95 Q 40 115 10 105" stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-pulse" />
      <path d="M90 105 Q 110 125 130 115" stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-pulse" />

      {/* Large Crest Fins */}
      <path d="M60 40 Q 20 0 10 60" fill="url(#adult-aqua-glow)" opacity="0.7" />
      <path d="M120 60 Q 160 30 170 80" fill="url(#adult-aqua-glow)" opacity="0.7" />

      {/* Tail Fin */}
      <path d="M180 115 L 200 95 Q 210 120 195 145 Z" fill="url(#adult-aqua-glow)" opacity="0.9" />

      {/* Flippers */}
      <path d="M50 135 Q 20 160 30 185" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M140 145 Q 170 170 160 195" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round" fill="none" />
      
      {/* Floating Bubbles */}
      <circle cx="170" cy="40" r="10" fill="white" opacity="0.3" className="animate-pulse" />
      <circle cx="185" cy="65" r="6" fill="white" opacity="0.1" className="animate-pulse" />
    </g>
  </svg>
);

const AdultTerra = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(0px 8px 16px rgba(6, 78, 59, 0.5))' }}>
    <defs>
      <linearGradient id="adult-terra-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
      <linearGradient id="adult-terra-rock" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <g className="animate-bounce-subtle">
      {/* Mountainous Tail */}
      <path d="M130 150 Q 190 180 190 120 Q 190 70 150 60" stroke="url(#adult-terra-body)" strokeWidth="28" fill="none" strokeLinecap="round" />
      <path d="M165 65 L 185 45 Q 200 65 175 85 Z" fill="#166534" />
      
      {/* Colossal Body */}
      <rect x="40" y="90" width="120" height="100" rx="30" fill="url(#adult-terra-body)" />
      
      {/* Rock Plates on Back */}
      <rect x="60" y="80" width="30" height="20" rx="5" fill="url(#adult-terra-rock)" transform="rotate(-15 60 80)" />
      <rect x="100" y="75" width="40" height="25" rx="8" fill="url(#adult-terra-rock)" transform="rotate(10 100 75)" />

      {/* Ancient Head */}
      <path d="M60 70 Q 100 -10 140 70 Q 140 110 100 120 T 60 70" fill="url(#adult-terra-body)" />
      
      {/* Steady Glowing Eyes */}
      <circle cx="85" cy="70" r="10" fill="#1e293b" />
      <circle cx="115" cy="70" r="10" fill="#1e293b" />
      <circle cx="87" cy="68" r="4" fill="#4ade80" className="animate-pulse" />
      <circle cx="117" cy="68" r="4" fill="#4ade80" className="animate-pulse" />

      {/* Massive Oak Horns */}
      <path d="M80 30 Q 60 -20 20 -10" stroke="#451a03" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M120 30 Q 140 -20 180 -10" stroke="#451a03" strokeWidth="12" fill="none" strokeLinecap="round" />
      
      {/* Foliage on Horns */}
      <circle cx="20" cy="-10" r="15" fill="#166534" opacity="0.8" />
      <circle cx="180" cy="-10" r="15" fill="#166534" opacity="0.8" />

      {/* Mossy Beard */}
      <path d="M80 115 Q 100 140 120 115 Z" fill="#15803d" opacity="0.6" />

      {/* Pillar Legs */}
      <rect x="50" y="170" width="35" height="30" rx="10" fill="#022c22" />
      <rect x="115" y="170" width="35" height="30" rx="10" fill="#022c22" />
      
      {/* Stone Details */}
      <circle cx="70" cy="120" r="8" fill="#475569" opacity="0.4" />
      <circle cx="130" cy="130" r="6" fill="#475569" opacity="0.4" />
    </g>
  </svg>
);

// --- EGG ASSETS ---

// Custom Egg Component with patterns based on type
export const DragonEgg = ({ type, size = 64, className = "" }: { type: DragonType, size?: number, className?: string }) => {
  const getGradient = () => {
    switch (type) {
      case 'fire': return { from: '#fca5a5', to: '#ef4444', pattern: '#b91c1c' };
      case 'water': return { from: '#93c5fd', to: '#3b82f6', pattern: '#1d4ed8' };
      case 'earth': return { from: '#86efac', to: '#10b981', pattern: '#047857' };
      case 'air': return { from: '#bae6fd', to: '#0ea5e9', pattern: '#0369a1' };
      case 'void': return { from: '#d8b4fe', to: '#8b5cf6', pattern: '#5b21b6' };
      default: return { from: '#cbd5e1', to: '#64748b', pattern: '#334155' };
    }
  };

  const colors = getGradient();

  // RICH EARTH EGG IMPLEMENTATION
  if (type === 'earth') {
    return (
      <svg width={size} height={size * 1.4} viewBox="0 0 200 240" className={className} style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }}>
        <defs>
          <radialGradient id="earth-shine" cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#134e4a" />
          </radialGradient>
          <linearGradient id="gold-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#fde047" />
             <stop offset="50%" stopColor="#d97706" />
             <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="pedestal-top" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#e7e5e4" />
             <stop offset="100%" stopColor="#a8a29e" />
          </linearGradient>
          <linearGradient id="pedestal-side" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#d6d3d1" />
             <stop offset="100%" stopColor="#78716c" />
          </linearGradient>
        </defs>
        
        <g transform="translate(0, 190)">
           <path d="M10 25 L190 25 L180 35 L20 35 Z" fill="#000" opacity="0.4" filter="blur(4px)"/>
           <rect x="20" y="20" width="160" height="20" fill="url(#pedestal-side)" stroke="#57534e" strokeWidth="1"/>
           <path d="M30 25 Q 35 28 32 35 M 160 35 Q 155 30 162 25" stroke="#44403c" strokeWidth="1" fill="none" opacity="0.6"/>
           <path d="M10 20 L190 20 L170 0 L30 0 Z" fill="url(#pedestal-top)" stroke="#57534e" strokeWidth="1"/>
           <path d="M40 5 L 60 15 M 140 10 L 150 5" stroke="#78716c" strokeWidth="1" opacity="0.4"/>
        </g>

        <g transform="translate(0, -10)">
           <path d="M100 10 C 160 10, 185 80, 185 130 C 185 190, 150 215, 100 215 C 50 215, 15 190, 15 130 C 15 80, 40 10, 100 10 Z" 
                 fill="url(#earth-shine)" stroke="#0f766e" strokeWidth="2"/>
           
           <g stroke="url(#gold-stroke)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M100 10 C 110 50, 140 90, 185 130" />
              <path d="M100 10 C 90 50, 60 90, 15 130" />
              <path d="M40 60 L 160 60" />
              <path d="M25 100 L 175 100" />
              <path d="M25 160 L 175 160" />
              <path d="M60 10 L 25 100" />
              <path d="M140 10 L 175 100" />
              <path d="M25 100 L 70 160" />
              <path d="M175 100 L 130 160" />
              <path d="M70 160 L 100 215" />
              <path d="M130 160 L 100 215" />
              <g strokeWidth="2" opacity="0.9">
                <path d="M70 35 Q 80 25 90 35 T 100 45" />
                <path d="M130 35 Q 120 25 110 35 T 100 45" />
                <path d="M45 80 Q 55 70 65 80 T 75 90" />
                <path d="M155 80 Q 145 70 135 80 T 125 90" />
                <path d="M50 130 Q 60 120 70 130 T 80 140" />
                <path d="M150 130 Q 140 120 130 130 T 120 140" />
                <path d="M85 180 Q 95 170 100 180 T 115 190" />
              </g>
              <rect x="85" y="115" width="30" height="30" transform="rotate(45 100 130)" strokeWidth="3" />
              <circle cx="100" cy="130" r="5" fill="#fde047" stroke="none" />
           </g>

           <path d="M70 30 Q 80 20 90 30" stroke="white" strokeWidth="4" opacity="0.3" strokeLinecap="round" transform="rotate(-45 100 100)" />
           <ellipse cx="60" cy="60" rx="20" ry="30" fill="white" opacity="0.1" transform="rotate(-30 60 60)" />
        </g>
      </svg>
    );
  }

  // DEFAULT EGG IMPLEMENTATION
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" className={className} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}>
      <defs>
        <linearGradient id={`egg-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
        <pattern id={`pattern-${type}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
           {type === 'fire' && <path d="M10 0L20 20H0L10 0Z" fill={colors.pattern} fillOpacity="0.2"/>}
           {type === 'water' && <circle cx="10" cy="10" r="5" fill={colors.pattern} fillOpacity="0.2"/>}
           {type === 'air' && <path d="M0 10 Q10 0 20 10 T40 10" stroke={colors.pattern} strokeOpacity="0.3" fill="none" strokeWidth="2"/>}
           {type === 'void' && <path d="M10 0 L20 10 L10 20 L0 10 Z" fill={colors.pattern} fillOpacity="0.2"/>}
        </pattern>
      </defs>
      <ellipse cx="50" cy="60" rx="45" ry="58" fill={`url(#egg-grad-${type})`} />
      <ellipse cx="50" cy="60" rx="45" ry="58" fill={`url(#pattern-${type})`} />
      <ellipse cx="35" cy="35" rx="15" ry="25" fill="white" fillOpacity="0.2" transform="rotate(-20 35 35)" />
    </svg>
  );
};

export const DragonIcon = ({ type, stage, size = 24, className = "", imageUrl }: { type: DragonType, stage: DragonStage, size?: number, className?: string, imageUrl?: string }) => {
  const props = { size, className };
  
  if (imageUrl) {
      return (
          <div className={`${className} relative rounded-xl overflow-hidden`} style={{ width: size, height: size }}>
              <img src={imageUrl} alt={stage} className="w-full h-full object-cover" />
          </div>
      );
  }
  
  if (stage === 'egg') {
    return <DragonEgg type={type} size={size} className={className} />;
  }

  // Handle High-Detail Baby Visuals
  if (stage === 'baby') {
      if (type === 'earth') return <BabyTerra size={size} className={className} />;
      if (type === 'fire') return <BabyIgnis size={size} className={className} />;
      if (type === 'water') return <BabyAqua size={size} className={className} />;
  }

  // Handle High-Detail Teen Visuals
  if (stage === 'teen') {
      if (type === 'earth') return <TeenTerra size={size} className={className} />;
      if (type === 'fire') return <TeenIgnis size={size} className={className} />;
      if (type === 'water') return <TeenAqua size={size} className={className} />;
  }

  // Handle High-Detail Adult Visuals
  if (stage === 'adult') {
      if (type === 'earth') return <AdultTerra size={size} className={className} />;
      if (type === 'fire') return <AdultIgnis size={size} className={className} />;
      if (type === 'water') return <AdultAqua size={size} className={className} />;
  }

  switch (type) {
    case 'fire': return <Flame {...props} />;
    case 'water': return <Droplets {...props} />;
    case 'earth': return <Mountain {...props} />;
    case 'air': return <Wind {...props} />;
    case 'void': return <Sparkles {...props} />;
  }
};
