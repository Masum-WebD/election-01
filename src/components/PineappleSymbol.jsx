import React, { useState } from 'react';

/**
 * High-definition vector SVG or Custom Uploaded Image representation of 
 * Election Symbol ("মার্কা").
 */
export default function PineappleSymbol({ 
  className = "w-16 h-16", 
  isMonochrome = false,
  showStamp = false,
  customImage = null,
  symbolName = "মার্কা"
}) {
  const [imageError, setImageError] = useState(false);

  // If custom uploaded image is provided and hasn't errored out, render it
  if (customImage && !imageError) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <img 
          src={customImage} 
          alt={symbolName} 
          className={`w-full h-full object-contain drop-shadow-md select-none ${isMonochrome ? 'filter grayscale contrast-150' : ''}`}
          onError={() => setImageError(true)}
        />
        {showStamp && (
          <div className="absolute -bottom-2 -right-3 transform rotate-[-12deg] bg-red-600 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-lg border border-white flex items-center gap-1 select-none animate-bounce">
            <span className="text-sm font-extrabold">✓</span>
            <span>ভোট দিন</span>
          </div>
        )}
      </div>
    );
  }

  const leafColor = isMonochrome ? "#222222" : "#15803d";
  const leafHighlight = isMonochrome ? "#444444" : "#22c55e";
  const bodyGradientStart = isMonochrome ? "#555555" : "#f59e0b";
  const bodyGradientEnd = isMonochrome ? "#222222" : "#b45309";
  const gridStroke = isMonochrome ? "#ffffff" : "#fef3c7";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 120" 
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={isMonochrome ? "pineBodyBw" : "pineBodyColor"} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bodyGradientStart} />
            <stop offset="100%" stopColor={bodyGradientEnd} />
          </linearGradient>

          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25"/>
          </filter>
        </defs>

        {/* Crown leaves */}
        <g id="crown">
          {/* Back leaves */}
          <path d="M50 42 C45 22 35 12 28 6 C38 18 43 32 46 42 Z" fill={leafColor} />
          <path d="M50 42 C55 22 65 12 72 6 C62 18 57 32 54 42 Z" fill={leafColor} />
          
          {/* Middle leaves */}
          <path d="M50 40 C42 16 26 14 18 18 C30 26 40 34 46 41 Z" fill={leafHighlight} />
          <path d="M50 40 C58 16 74 14 82 18 C70 26 60 34 54 41 Z" fill={leafHighlight} />

          {/* Center top leaf */}
          <path d="M50 40 C46 14 50 4 50 2 C50 4 54 14 50 40 Z" fill={leafHighlight} />
          <path d="M50 42 C48 24 50 14 50 12 C50 14 52 24 50 42 Z" fill={leafColor} />
        </g>

        {/* Pineapple Oval Body */}
        <g id="body" filter="url(#shadow)">
          <path 
            d="M 50 36 
               C 28 36, 22 52, 22 75 
               C 22 96, 32 112, 50 112 
               C 68 112, 78 96, 78 75 
               C 78 52, 72 36, 50 36 Z" 
            fill={`url(#${isMonochrome ? "pineBodyBw" : "pineBodyColor"})`}
            stroke={isMonochrome ? "#000000" : "#92400e"}
            strokeWidth="2.5"
          />

          {/* Diagonal Hatching / Scales */}
          <g stroke={gridStroke} strokeWidth="1.6" strokeLinecap="round" opacity={isMonochrome ? "0.85" : "0.75"}>
            <line x1="33" y1="46" x2="67" y2="80" />
            <line x1="26" y1="58" x2="74" y2="92" />
            <line x1="24" y1="72" x2="68" y2="105" />
            <line x1="30" y1="88" x2="56" y2="110" />

            <line x1="67" y1="46" x2="33" y2="80" />
            <line x1="74" y1="58" x2="26" y2="92" />
            <line x1="76" y1="72" x2="32" y2="105" />
            <line x1="70" y1="88" x2="44" y2="110" />
          </g>

          {/* Scale Diamond Nodes / Eyes */}
          <g fill={isMonochrome ? "#000000" : "#78350f"}>
            <circle cx="50" cy="53" r="2.2" />
            <circle cx="38" cy="65" r="2.2" />
            <circle cx="62" cy="65" r="2.2" />
            <circle cx="50" cy="77" r="2.4" />
            <circle cx="34" cy="80" r="2.2" />
            <circle cx="66" cy="80" r="2.2" />
            <circle cx="50" cy="95" r="2.4" />
            <circle cx="40" cy="103" r="2" />
            <circle cx="60" cy="103" r="2" />
          </g>
        </g>
      </svg>

      {/* Official Voting Stamp Overlay */}
      {showStamp && (
        <div className="absolute -bottom-2 -right-3 transform rotate-[-12deg] bg-red-600 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-lg border border-white flex items-center gap-1 select-none animate-bounce">
          <span className="text-sm font-extrabold">✓</span>
          <span>ভোট দিন</span>
        </div>
      )}
    </div>
  );
}
