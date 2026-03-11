import React from 'react';
import { Icons } from './Icons';

const PromoCard: React.FC = () => {
  // Updated features list with strong marketing phrases
  const features = [
    { text: 'تغطية شاملة صحي وتجميلي', icon: <Icons.ShieldCheck className="w-4 h-4" /> },
    { text: 'إصدار فوري بدون موافقات', icon: <Icons.Zap className="w-4 h-4" /> },
    { text: 'خصومات تصل 80%', icon: <Icons.Percent className="w-4 h-4" /> },
    { text: 'كاش باك فوري', icon: <Icons.Gem className="w-4 h-4" /> },
    { text: 'استخدام لا محدود', icon: <Icons.Activity className="w-4 h-4" /> },
    { text: 'حجز بضغطة زر', icon: <Icons.Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="px-4 pb-12 pt-4">
      {/* Main Card */}
      <div className="bg-slate-800 rounded-[2.5rem] p-5 relative overflow-hidden text-white shadow-xl border-t-4 border-yellow-400 mb-4 group transition-transform duration-500 hover:scale-[1.01]">
        
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0C5A5D]/30 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-5 relative z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Icons.Crown size={14} className="fill-slate-900" />
                العضوية الذهبية
            </div>
            <div className="text-left">
                <h3 className="text-lg font-bold text-gray-100">بطاقة أمان</h3>
                <h4 className="text-[#2cbcc9] font-black text-3xl tracking-tight">إيفر</h4>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-2xl border border-slate-600 backdrop-blur-sm">
                 <Icons.CreditCard size={32} className="text-[#2cbcc9]" />
            </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 relative z-10">
            {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 group/item">
                    <div className="text-yellow-400 shrink-0 transition-transform group-hover/item:scale-110">{feat.icon}</div>
                    <span className="text-[10px] md:text-xs font-medium text-gray-300 group-hover/item:text-white transition-colors">{feat.text}</span>
                </div>
            ))}
        </div>

        {/* CTA Button */}
        <button className="w-full bg-gradient-to-r from-white to-gray-100 text-slate-900 font-bold py-3.5 px-2 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:shadow-md relative z-10 group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
             <span className="relative text-[10px] md:text-xs text-center leading-tight">عند تفعيل اشتراك اليوم ، ستحصل على رصيد خدمات (كاش باك) بقيمة 1000 ريال</span>
             <Icons.ArrowLeft size={16} className="relative group-hover:-translate-x-1 transition-transform shrink-0" />
        </button>
      </div>

      {/* Marketing Banners (Row) */}
      <div className="flex gap-3">
          {/* Banner 1: Discounts */}
          <div className="flex-1 bg-gradient-to-br from-[#0C5A5D] to-[#083d40] rounded-2xl p-3 relative overflow-hidden shadow-lg border border-[#2cbcc9]/20 group cursor-pointer hover:-translate-y-1 transition-transform">
              <div className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Icons.Percent size={80} />
              </div>
              <div className="relative z-10">
                  <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                      <Icons.Tag className="text-white" size={16} />
                  </div>
                  <h4 className="text-white font-bold text-xs mb-1">خصومات خيالية</h4>
                  <p className="text-[9px] text-cyan-100 leading-tight">توفير يصل إلى 80% في أرقى المراكز</p>
              </div>
          </div>

          {/* Banner 2: Credit */}
          <div className="flex-1 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-3 relative overflow-hidden shadow-lg border border-orange-400/20 group cursor-pointer hover:-translate-y-1 transition-transform">
               <div className="absolute -left-2 -top-2 text-white/10 animate-pulse">
                  <Icons.Sparkles size={60} />
              </div>
              <div className="relative z-10">
                  <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm">
                      <Icons.Gem className="text-white" size={16} />
                  </div>
                  <h4 className="text-white font-bold text-xs mb-1">1,000 رصيد فوراً</h4>
                  <p className="text-[9px] text-yellow-50 leading-tight">اشترك الآن واستلم الرصيد في محفظتك!</p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default PromoCard;