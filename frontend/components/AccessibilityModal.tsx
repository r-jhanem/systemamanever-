import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Apply text size
    const root = document.documentElement;
    if (textSize === 'normal') root.style.fontSize = '16px';
    if (textSize === 'large') root.style.fontSize = '18px';
    if (textSize === 'xl') root.style.fontSize = '20px';

    // Apply high contrast
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [textSize, highContrast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="a11y-title">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-50 p-2 rounded-full text-[#0C5A5D]">
                <Icons.Eye size={24} aria-hidden="true" />
            </div>
            <h2 id="a11y-title" className="text-xl font-bold text-gray-900">إعدادات الوصول</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" aria-label="إغلاق الإعدادات">
            <Icons.X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Text Size */}
          <div role="group" aria-labelledby="text-size-label">
            <div className="flex items-center gap-2 mb-3">
                <Icons.Type size={16} className="text-gray-500" aria-hidden="true"/>
                <label id="text-size-label" className="block text-sm font-bold text-gray-700">حجم النص</label>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button 
                onClick={() => setTextSize('normal')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${textSize === 'normal' ? 'bg-white shadow text-[#0C5A5D] ring-1 ring-[#0C5A5D]/10' : 'text-gray-500 hover:text-gray-700'}`}
                aria-pressed={textSize === 'normal'}
              >
                عادي
              </button>
              <button 
                onClick={() => setTextSize('large')}
                className={`flex-1 py-3 rounded-lg text-base font-bold transition-all ${textSize === 'large' ? 'bg-white shadow text-[#0C5A5D] ring-1 ring-[#0C5A5D]/10' : 'text-gray-500 hover:text-gray-700'}`}
                aria-pressed={textSize === 'large'}
              >
                كبير
              </button>
              <button 
                onClick={() => setTextSize('xl')}
                className={`flex-1 py-3 rounded-lg text-lg font-bold transition-all ${textSize === 'xl' ? 'bg-white shadow text-[#0C5A5D] ring-1 ring-[#0C5A5D]/10' : 'text-gray-500 hover:text-gray-700'}`}
                aria-pressed={textSize === 'xl'}
              >
                أكبر
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-[#0C5A5D]/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                 <Icons.Sun size={20} className="text-orange-500 fill-orange-500" aria-hidden="true" />
              </div>
              <div>
                  <span className="font-bold text-gray-800 block text-sm">تباين عالي</span>
                  <span className="text-[10px] text-gray-500">تحسين وضوح الألوان</span>
              </div>
            </div>
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C5A5D] ${highContrast ? 'bg-[#0C5A5D]' : 'bg-gray-300'}`}
              aria-label={highContrast ? 'إيقاف وضع التباين العالي' : 'تفعيل وضع التباين العالي'}
              aria-pressed={highContrast}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${highContrast ? 'left-1 translate-x-0' : 'left-6 translate-x-0'}`}></div>
            </button>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400">تم تصميم هذه الخيارات لتسهيل استخدام التطبيق لجميع الفئات</p>
        </div>

      </div>
    </div>
  );
};

export default AccessibilityModal;