import React from 'react';
import { Icons } from './Icons';

const UrgentFab: React.FC = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 pointer-events-none max-w-md mx-auto z-40 h-0">
      <div className="absolute bottom-24 left-4 pointer-events-auto">
        <button className="group bg-[#0C5A5D] hover:bg-[#09484b] text-white rounded-full shadow-[0_4px_20px_rgba(12,90,93,0.4)] flex items-center p-1 transition-all duration-500 ease-in-out border-2 border-white animate-bounce-slow hover:animate-none">
          
          {/* Icon Circle */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm">
            <Icons.Zap className="w-7 h-7 text-[#0C5A5D] fill-current" />
          </div>

          {/* Curtain Text Effect */}
          <div className="max-w-0 overflow-hidden group-hover:max-w-[140px] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
            <div className="pr-3 pl-4 flex flex-col items-start whitespace-nowrap leading-tight">
              <span className="text-[10px] font-bold text-gray-200">خدمة فورية</span>
              <span className="text-sm font-extrabold text-yellow-400">استشارة عاجلة</span>
            </div>
          </div>

        </button>
      </div>
    </div>
  );
};

export default UrgentFab;