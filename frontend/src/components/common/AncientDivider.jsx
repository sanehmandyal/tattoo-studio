import React from 'react';

export const AncientDivider = ({ title, symbol = "🔱", className = "" }) => {
  return (
    <div className={`flex items-center justify-center my-6 space-x-4 select-none ${className}`}>
      {/* Left Antique Line with Diamond Tip */}
      <div className="flex items-center flex-1 max-w-[140px]">
        <div className="w-1.5 h-1.5 rotate-45 bg-studio-bronze/60" />
        <div className="h-[1px] w-full bg-gradient-to-r from-studio-bronze/60 to-transparent" />
      </div>

      {/* Center Sacred Symbol or Mantra Badge */}
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-studio-card/80 border border-studio-bronze/30 text-studio-bronzeLight shadow-inner">
        <span className="text-xs font-serif text-studio-gold">❖</span>
        {title ? (
          <span className="text-[10px] uppercase font-display tracking-[0.25em] font-bold text-studio-textMain">
            {title}
          </span>
        ) : (
          <span className="text-sm text-studio-bronze">{symbol}</span>
        )}
        <span className="text-xs font-serif text-studio-gold">❖</span>
      </div>

      {/* Right Antique Line with Diamond Tip */}
      <div className="flex items-center flex-1 max-w-[140px]">
        <div className="h-[1px] w-full bg-gradient-to-l from-studio-bronze/60 to-transparent" />
        <div className="w-1.5 h-1.5 rotate-45 bg-studio-bronze/60" />
      </div>
    </div>
  );
};

export default AncientDivider;
