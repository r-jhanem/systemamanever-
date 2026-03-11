import React, { useState } from 'react';
import { Icons } from './Icons';

interface QuickAccessProps {
  onAskDoctor: () => void;
  onOpenNetwork?: () => void; // Prop to open Medical Network view
  onOpenHealthNetwork?: () => void; // Prop to open Health Network view
}

const QuickAccess: React.FC<QuickAccessProps> = ({ onAskDoctor, onOpenNetwork, onOpenHealthNetwork }) => {
  const [activeTab, setActiveTab] = useState<'near' | 'services'>('services');

  // Brand color constant
  const brandColor = 'bg-[#0C5A5D]';

  const buttons = [
    { label: 'حجز موعد', icon: <Icons.Calendar className="w-6 h-6" />, color: brandColor },
    { label: 'استشارة فيديو', icon: <Icons.Video className="w-6 h-6" />, color: brandColor },
    { label: 'رعاية منزلية', icon: <Icons.Home className="w-6 h-6" />, color: brandColor },
    { label: 'الشبكة الطبية', icon: <Icons.Stethoscope className="w-6 h-6" />, color: brandColor, action: onOpenNetwork },
    { label: 'الشبكة الصحية', icon: <Icons.Activity className="w-6 h-6" />, color: brandColor, action: onOpenHealthNetwork },
    { label: 'أسال طبيب', icon: <Icons.Users className="w-6 h-6" />, color: brandColor, action: onAskDoctor },
  ];

  return (
    <div className="px-4 mt-4 relative z-20">
      {/* Tabs - Text Only with Underlines - High Visibility */}
      <div className="flex justify-between gap-3 mb-4 px-1">
        <button 
          onClick={() => setActiveTab('services')}
          className={`text-sm transition-colors border-b-2 pb-1 ${
            activeTab === 'services' 
              ? 'text-[#0C5A5D] font-extrabold border-[#0C5A5D]' 
              : 'text-gray-700 font-bold hover:text-black border-gray-300'
          }`}
        >
          خدمات بالقرب منك
        </button>
        <button 
          onClick={() => {
              setActiveTab('near');
              if (onOpenNetwork) onOpenNetwork(); // Trigger the Network View when clicking "Nearby"
          }}
          className={`text-sm transition-colors border-b-2 pb-1 ${
            activeTab === 'near' 
              ? 'text-[#0C5A5D] font-extrabold border-[#0C5A5D]' 
              : 'text-gray-700 font-bold hover:text-black border-gray-300'
          }`}
        >
          المنشآت القريبة
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className={`${btn.color} hover:opacity-90 text-white p-3 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 h-24 transition-transform active:scale-95`}
          >
            <div className="bg-white/20 p-2 rounded-full">
              {btn.icon}
            </div>
            <span className="text-[11px] md:text-xs font-bold text-center leading-tight">
              {btn.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;