import React from 'react';
import { Icons } from './Icons';

const CircularServices: React.FC = () => {
  const items = [
    { label: 'برنامج الولاء', subLabel: '(كاش باك)', icon: <Icons.Sparkles />, color: 'bg-cyan-200' },
    { label: 'محفظة النقاط', icon: <Icons.CreditCard />, color: 'bg-cyan-200' },
    { label: 'تحاليل طبية', icon: <Icons.FileText />, color: 'bg-cyan-200' },
  ];

  return (
    <div className="px-4 py-6 relative">
      <div className="flex justify-start gap-4 overflow-x-auto no-scrollbar pb-2">
        {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
                {/* Updated gradient to match brand color #0C5A5D */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0C5A5D] to-[#2cbcc9] shadow-md flex items-center justify-center text-white border-2 border-white ring-2 ring-[#e0f2f4]">
                    {item.icon}
                </div>
                <div className="text-center">
                     <span className="text-xs font-bold text-gray-700 block">{item.label}</span>
                     {item.subLabel && <span className="text-[10px] text-gray-500 block">{item.subLabel}</span>}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CircularServices;