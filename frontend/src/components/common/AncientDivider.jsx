import React from 'react';

export const AncientDivider = ({ title, symbol = "•", className = "" }) => {
  return (
    <div className={`flex items-center justify-center my-6 space-x-3 select-none ${className}`}>
      <div className="h-[1px] flex-1 max-w-[100px] bg-white/10" />
      {title ? (
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
          {title}
        </span>
      ) : (
        <span className="text-xs text-amber-400 font-bold">{symbol}</span>
      )}
      <div className="h-[1px] flex-1 max-w-[100px] bg-white/10" />
    </div>
  );
};

export default AncientDivider;
