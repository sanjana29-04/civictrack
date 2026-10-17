import React from 'react';

const logoImg = '/snapfix-logo.png';

interface Props {
  variant?: 'full' | 'icon' | 'nav' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const SnapFixLogo: React.FC<Props> = ({
  variant = 'nav',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Direct full artwork badge as uploaded by the user
  if (variant === 'badge' || variant === 'full') {
    const sizeMap = {
      sm: 'h-10',
      md: 'h-14',
      lg: 'h-20',
      xl: 'h-32',
    };
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <img
          src={logoImg}
          alt="SnapFix - Fixing Our India Together"
          className={`${sizeMap[size]} w-auto object-contain filter drop-shadow-md hover:scale-102 transition-transform`}
        />
      </div>
    );
  }

  // Pure icon emblem (Pin + Map + Wrench + Road)
  if (variant === 'icon') {
    const sizeMap = {
      sm: 'w-9 h-9',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    };
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-white shadow-md shadow-emerald-500/10 flex items-center justify-center p-1 border border-slate-100 ${sizeMap[size]} ${className}`}>
        <img
          src={logoImg}
          alt="SnapFix Emblem"
          className="w-full h-full object-contain filter drop-shadow-xs"
        />
      </div>
    );
  }

  // 'nav' variant: Official logo graphic in navbar + interactive flair
  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Official SnapFix Logo Emblem */}
      <div className="h-11 w-11 rounded-xl bg-white p-1 border border-slate-200/90 shadow-xs shadow-emerald-500/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shrink-0">
        <img
          src={logoImg}
          alt="SnapFix Emblem"
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-xl font-extrabold text-navy-950 tracking-tight font-display">
            Snap<span className="text-emerald-600">Fix</span>
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-white to-emerald-500/20 text-slate-800 border border-slate-200/80 shadow-2xs">
            🇮🇳 India
          </span>
        </div>
        {showTagline && (
          <span className="block text-[10px] font-bold text-slate-500 tracking-wide mt-0.5 flex items-center gap-1">
            <span>Fixing Our India Together</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        )}
      </div>
    </div>
  );
};
