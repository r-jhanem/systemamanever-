import React from 'react';
import { Icons } from './Icons';

interface TopBannerProps {
  onOpenAccessibility: () => void;
}

const TopBanner: React.FC<TopBannerProps> = ({ onOpenAccessibility }) => {
  return (
    <div className="bg-[#0C5A5D] text-white py-2 px-4 shadow-sm flex justify-between items-center relative z-20">
      <div className="flex-1 text-center pr-8">
        <span className="text-[10px] md:text-xs opacity-80 pl-1">مرخصة تجارياً برقم:</span>
        <span className="font-bold font-mono text-cyan-100 text-xs md:text-sm">4031295464</span>
      </div>
      
      <button 
        onClick={onOpenAccessibility}
        className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors text-cyan-50 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="إعدادات الوصول"
      >
        <Icons.Eye size={16} />
      </button>
    </div>
  );
};

export default TopBanner;