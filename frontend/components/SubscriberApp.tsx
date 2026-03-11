import React, { useState } from 'react';
import { Icons, LogoIcon } from './Icons';
import HeroSection from './HeroSection';
import QuickAccess from './QuickAccess';
import CircularServices from './CircularServices';
import PromoCard from './PromoCard';
import ExtendedHomeContent from './ExtendedHomeContent';
import AIModal from './AIModal';
import MedicalNetwork from './MedicalNetwork';
import HealthNetwork from './HealthNetwork';

interface SubscriberAppProps {
  onSwitch: () => void;
  userData?: {
    name: string;
    idNumber: string;
    phone: string;
    email: string;
    residencyType?: string;
  };
}

const SubscriberApp: React.FC<SubscriberAppProps> = ({ onSwitch, userData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isHealthNetworkOpen, setIsHealthNetworkOpen] = useState(false);
  const [profileSection, setProfileSection] = useState<'info' | 'bookings' | 'activity' | 'rewards' | 'orders' | 'special_offers'>('info');
  
  // Card Selection State
  const [selectedTier, setSelectedTier] = useState<'platinum' | 'golden' | 'bronze'>('platinum');
  const [selectedPackage, setSelectedPackage] = useState('الباقة الذهبية');
  
  // Points Visibility State
  const [showPoints, setShowPoints] = useState(true);
  
  // Points Terms Modal State
  const [isPointsTermsOpen, setIsPointsTermsOpen] = useState(false);

  // Partner Filter State
  const [activePartnerFilter, setActivePartnerFilter] = useState('all');

  // Calculator State
  const [openCalculatorId, setOpenCalculatorId] = useState<number | null>(null);
  const [calculatorAmount, setCalculatorAmount] = useState<string>('');

  // User Data Mock with specific details
  const user = {
    name: userData?.name || 'محمد عبد الله',
    id: userData?.idNumber || '1029384756',
    phone: userData?.phone || '05xxxxxxxx',
    email: userData?.email || 'user@example.com',
    residencyType: userData?.residencyType || 'resident',
    expiry: '25/12/2025',
    points: 2540,
    usedPoints: 1450, // Mock data for used points
    cashback: 450,
    walletBalance: 1250.00,
    referralCode: 'AMAN-992',
    cardNumber: '8990 1234 5678 9010'
  };

  // Mock Transactions for Cashback/Points
  const transactions = [
    { id: 1, title: 'استرجاع - مستشفى دلة', amount: '+150', date: 'اليوم، 10:30 ص', type: 'in', desc: 'كاش باك من خدمة أسنان' },
    { id: 2, title: 'شراء - صيدلية النهدي', amount: '-50', date: 'أمس، 04:15 م', type: 'out', desc: 'شراء أدوية ومستحضرات' },
    { id: 3, title: 'مكافأة انضمام', amount: '+350', date: '01/10/2023', type: 'in', desc: 'هدية الترحيب بالعضوية' },
    { id: 4, title: 'استبدال نقاط', amount: '-100', date: '28/09/2023', type: 'out', desc: 'قسيمة مشتريات' },
  ];

  // --- RENDER FUNCTIONS FOR EACH TAB ---

  const renderHome = () => (
      <div className="-mt-20 relative z-10 animate-fade-in-up space-y-2 pb-24">
        <div className="rounded-3xl overflow-hidden mx-4 shadow-lg mb-4">
            <HeroSection />
        </div>
        <div className="bg-white rounded-t-3xl pt-2 pb-6">
            <QuickAccess 
                onAskDoctor={() => setIsAIModalOpen(true)} 
                onOpenNetwork={() => setIsNetworkOpen(true)}
                onOpenHealthNetwork={() => setIsHealthNetworkOpen(true)}
            />
            <CircularServices />
            <PromoCard />
            <ExtendedHomeContent />
        </div>
      </div>
  );

  const renderCashback = () => (
      <div className="px-4 -mt-20 relative z-10 animate-fade-in-up pb-24">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-[#0C5A5D] to-[#083d40] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[60px] opacity-10"></div>
              <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                          <Icons.Gem size={24} className="text-yellow-300" />
                      </div>
                      <span className="font-bold text-lg">محفظة الكاش باك</span>
                  </div>
                  <button className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition flex items-center gap-1 text-[10px] font-bold">
                      <Icons.FileText size={14} /> الشروط
                  </button>
              </div>
              <div className="text-center py-4 relative z-10">
                  <span className="text-sm text-cyan-100 block mb-1">رصيدك الحالي</span>
                  <div className="text-5xl font-black tracking-tight mb-4">{user.cashback} <span className="text-lg">ريال</span></div>
                  
                  <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white w-full py-3 rounded-xl shadow-lg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                      <Icons.RefreshCw size={18} /> استبدال الكاش باك برصيد خدمات
                  </button>
                  <p className="text-[10px] text-cyan-100 mt-2 opacity-80">يمكنك استخدام الرصيد في: حجز المواعيد، الاستشارات، والمزيد.</p>
              </div>
          </div>

          {/* Generated Coupons Section (Generative Logic Mock) */}
          <div className="mb-6">
               <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2 px-2">
                  <Icons.Sparkles size={18} className="text-yellow-500" /> قسائمك النشطة (تلقائية)
              </h3>
              <div className="space-y-3">
                  {[
                      { hospital: 'مستشفى دلة', amount: '15%', code: 'CASH-DL-99', exp: '24 ساعة' },
                      { hospital: 'صيدلية النهدي', amount: '50 ريال', code: 'CASH-ND-50', exp: 'يومان' }
                  ].map((coupon, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex justify-between items-center relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0C5A5D]"></div>
                          <div className="absolute -left-1.5 top-1/2 -mt-1.5 w-3 h-3 bg-gray-50 rounded-full"></div>
                          <div className="absolute -right-1.5 top-1/2 -mt-1.5 w-3 h-3 bg-gray-50 rounded-full"></div>
                          
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">قسيمة كاش باك فورية</p>
                              <h4 className="font-bold text-gray-800">{coupon.hospital}</h4>
                              <p className="text-[10px] text-[#0C5A5D] mt-1 bg-[#0C5A5D]/5 px-2 py-0.5 rounded-md inline-block">صالح لمدة: {coupon.exp}</p>
                          </div>
                          <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-dashed border-gray-300">
                              <span className="block font-black text-xl text-[#0C5A5D]">{coupon.amount}</span>
                              <span className="text-[9px] font-mono text-gray-500">{coupon.code}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <Icons.Activity size={20} className="text-[#0C5A5D]" /> سجل العمليات
              </h3>
              <div className="space-y-4">
                  {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-2xl ${tx.type === 'in' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                  {tx.type === 'in' ? <Icons.ArrowLeft size={20} className="-rotate-45" /> : <Icons.ArrowLeft size={20} className="rotate-[135deg]" />}
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm text-gray-800">{tx.title}</h4>
                                  <span className="text-xs text-gray-400">{tx.date}</span>
                              </div>
                          </div>
                          <span className={`font-bold text-base ${tx.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                              {tx.amount} ريال
                          </span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderPoints = () => {
    // Rewards Data for Carousel - UPDATED TO MEDICAL/HEALTH ONLY
    const rewardsList = [
        { title: 'رصيد 50 ريال', sub: 'رصيد خدمات', cost: '5000', icon: <Icons.CreditCard />, color: 'text-yellow-600 bg-yellow-50' },
        { title: 'كشف مجاني', sub: 'طب عام', cost: '3500', icon: <Icons.Stethoscope />, color: 'text-blue-600 bg-blue-50' },
        { title: 'فحص فيتامين د', sub: 'مختبرات', cost: '4500', icon: <Icons.Activity />, color: 'text-orange-600 bg-orange-50' },
        { title: 'خصم صيدلية', sub: 'النهدي', cost: '1200', icon: <Icons.Pill />, color: 'text-green-600 bg-green-50' },
        { title: 'جلسة ليزر', sub: 'عيادات تجميل', cost: '15000', icon: <Icons.Zap />, color: 'text-pink-600 bg-pink-50' },
        { title: 'تنظيف أسنان', sub: 'خصم 50%', cost: '2500', icon: <Icons.Smile />, color: 'text-purple-600 bg-purple-50' },
        { title: 'مكافأة كاش', sub: 'تحويل للمحفظة', cost: '10000', icon: <Icons.Gem />, color: 'text-cyan-600 bg-cyan-50' },
    ];
    // Infinite loop array
    const infiniteRewards = [...rewardsList, ...rewardsList];

    // Partners Data with STANDARD RULE: 1 Point per 100 SAR
    const partners = [
        { id: 1, name: 'مستشفى دلة', type: 'hospitals', icon: <Icons.Building2 />, color: 'text-blue-600 bg-blue-50' },
        { id: 2, name: 'صيدلية النهدي', type: 'pharmacies', icon: <Icons.Pill />, color: 'text-green-600 bg-green-50' },
        { id: 3, name: 'عيادات جوفا', type: 'cosmetic', icon: <Icons.Sparkles />, color: 'text-purple-600 bg-purple-50' },
        { id: 4, name: 'مختبرات البرج', type: 'centers', icon: <Icons.Activity />, color: 'text-orange-600 bg-orange-50' },
        { id: 5, name: 'السعودي الألماني', type: 'hospitals', icon: <Icons.Building2 />, color: 'text-cyan-600 bg-cyan-50' },
        { id: 6, name: 'عيادات أدمة', type: 'cosmetic', icon: <Icons.Smile />, color: 'text-pink-600 bg-pink-50' },
    ];

    const partnerFilters = [
        { id: 'all', label: 'الكل' },
        { id: 'hospitals', label: 'مستشفيات' },
        { id: 'centers', label: 'مراكز طبية' },
        { id: 'cosmetic', label: 'تجميل' },
        { id: 'pharmacies', label: 'صيدليات' },
    ];

    const filteredPartners = activePartnerFilter === 'all' 
        ? partners 
        : partners.filter(p => p.type === activePartnerFilter);

    // Calculator Logic
    const handleCalculate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCalculatorAmount(e.target.value);
    };

    const calculatedPoints = Math.floor(Number(calculatorAmount) / 100);
    const calculatedValue = (calculatedPoints * 0.01).toFixed(2);

    return (
    <div className="px-4 -mt-20 relative z-10 animate-fade-in-up pb-24">
        {/* New Enhanced Header Card with Toggle and Stats */}
        <div className="bg-[#0C5A5D] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden mb-8 border border-white/10 group transition-all duration-300 hover:shadow-2xl">
            {/* Background Effects */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-400 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute -left-10 bottom-0 w-32 h-32 bg-cyan-400 rounded-full blur-[60px] opacity-10"></div>
            
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-lg shadow-yellow-500/20">
                        <Icons.Wallet size={24} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-lg leading-none block">محفظة النقاط</span>
                        <span className="text-[10px] text-gray-300">أمان إيفر</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setIsPointsTermsOpen(true)}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm text-[10px] font-bold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        <Icons.FileText size={14} /> الشروط
                    </button>
                    <button 
                      onClick={() => setShowPoints(!showPoints)}
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      title={showPoints ? 'إخفاء النقاط' : 'إظهار النقاط'}
                    >
                        {showPoints ? <Icons.Eye size={18} /> : <Icons.EyeOff size={18} />}
                    </button>
                </div>
            </div>

            {/* Points Display (Toggleable) */}
            <div className="text-center py-2 relative z-10 mb-6 min-h-[100px] flex flex-col justify-center">
                <div className="inline-flex items-baseline justify-center gap-2 mb-2 transition-all duration-300">
                    <span className="text-6xl font-black tracking-tighter drop-shadow-sm font-mono">
                        {showPoints ? user.points.toLocaleString() : '••••'}
                    </span>
                    <span className={`text-sm font-bold text-yellow-400 ${showPoints ? 'opacity-100' : 'opacity-50'}`}>نقطة</span>
                </div>
                
                {showPoints ? (
                     <div className="text-xs font-bold text-cyan-100 bg-[#083d40]/50 inline-block px-4 py-1.5 rounded-lg border border-white/5 mx-auto animate-fade-in">
                        كل 100 نقطة = <span className="text-white mx-1 font-black text-sm">1 ريال</span>
                    </div>
                ) : (
                    <div className="text-xs text-cyan-100/50 mt-2">الرصيد مخفي</div>
                )}
            </div>

            {/* Stats Breakdown Grid */}
            <div className="bg-black/20 rounded-xl p-3 grid grid-cols-2 gap-px relative z-10 border border-white/5 backdrop-blur-md">
                <div className="text-center border-l border-white/10 relative group/stat">
                    <span className="block text-[10px] text-cyan-100 mb-0.5 opacity-80">النقاط المستخدمة</span>
                    <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-base text-white">
                             {showPoints ? user.usedPoints.toLocaleString() : '•••'}
                        </span>
                        {showPoints && <Icons.TrendingUp size={12} className="text-red-300 rotate-180" />}
                    </div>
                </div>
                <div className="text-center relative group/stat">
                    <span className="block text-[10px] text-cyan-100 mb-0.5 opacity-80">الرصيد المتبقي</span>
                    <div className="flex items-center justify-center gap-1">
                         <span className="font-bold text-base text-yellow-400">
                            {showPoints ? user.points.toLocaleString() : '•••'}
                         </span>
                         {showPoints && <Icons.CheckCircle size={12} className="text-green-400" />}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
                 <button className="bg-white text-[#0C5A5D] py-3 rounded-xl text-xs font-bold shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Icons.RefreshCw size={16} /> استبدال الآن
                </button>
                 <button className="bg-[#083d40] text-white border border-white/10 py-3 rounded-xl text-xs font-bold shadow-sm hover:bg-[#062e30] transition-colors flex items-center justify-center gap-2">
                    <Icons.History size={16} /> السجل
                </button>
            </div>
        </div>

        {/* --- PARTNERS & EARNING RULES SECTION --- */}
        <div className="mb-8 animate-fade-in">
             <div className="flex justify-between items-center mb-4 px-1">
                <div>
                     <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                        <div className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600"><Icons.Star size={18} /></div>
                        شركاء النقاط
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium mr-1">لكل 100 ريال مشتريات تحصل على 1 نقطة</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-2">
                {partnerFilters.map(filter => (
                    <button 
                        key={filter.id}
                        onClick={() => setActivePartnerFilter(filter.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            activePartnerFilter === filter.id 
                            ? 'bg-[#0C5A5D] text-white border-[#0C5A5D]' 
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Partners Grid - Reorganized */}
            <div className="grid grid-cols-1 gap-3">
                {filteredPartners.map((partner) => (
                    <div key={partner.id} className="bg-white rounded-[1.2rem] p-4 shadow-sm border border-gray-100 relative overflow-hidden group hover:border-[#0C5A5D]/20 hover:shadow-md transition-all">
                        
                        <div className="flex items-center justify-between">
                            {/* Icon & Name */}
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${partner.color} group-hover:scale-105 transition-transform`}>
                                    {React.cloneElement(partner.icon as React.ReactElement<any>, { size: 24 })}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">{partner.name}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-bold text-white bg-[#0C5A5D] px-2 py-0.5 rounded">1 نقطة</span>
                                        <span className="text-[9px] text-gray-400">لكل 100 ريال</span>
                                    </div>
                                </div>
                            </div>

                            {/* Calculator Toggle Button */}
                            <button 
                                onClick={() => {
                                    if (openCalculatorId === partner.id) {
                                        setOpenCalculatorId(null);
                                        setCalculatorAmount('');
                                    } else {
                                        setOpenCalculatorId(partner.id);
                                        setCalculatorAmount('');
                                    }
                                }}
                                className={`p-2 rounded-xl transition-colors border ${
                                    openCalculatorId === partner.id 
                                    ? 'bg-[#0C5A5D] text-white border-[#0C5A5D]' 
                                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                }`}
                                title="حاسبة النقاط"
                            >
                                <Icons.Calculator size={20} />
                            </button>
                        </div>

                        {/* Interactive Calculator Section */}
                        {openCalculatorId === partner.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                                <label className="text-[10px] font-bold text-gray-500 mb-2 block">ادخل قيمة المشتريات المتوقعة</label>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        type="number" 
                                        value={calculatorAmount}
                                        onChange={handleCalculate}
                                        placeholder="مثال: 500"
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#0C5A5D] transition-colors"
                                    />
                                    <div className="bg-gray-100 flex items-center px-3 rounded-xl text-xs font-bold text-gray-500">
                                        ريال
                                    </div>
                                </div>
                                
                                <div className="bg-[#0C5A5D]/5 rounded-xl p-3 flex items-center justify-between border border-[#0C5A5D]/10">
                                    <div className="text-center flex-1 border-l border-[#0C5A5D]/10">
                                        <span className="text-[9px] text-gray-500 block mb-0.5">ستحصل على</span>
                                        <span className="font-black text-lg text-[#0C5A5D]">{calculatedPoints} <span className="text-[10px]">نقطة</span></span>
                                    </div>
                                    <div className="text-center flex-1">
                                        <span className="text-[9px] text-gray-500 block mb-0.5">قيمتها</span>
                                        <span className="font-black text-lg text-yellow-600">{calculatedValue} <span className="text-[10px]">ريال</span></span>
                                    </div>
                                </div>
                                <p className="text-[9px] text-center text-gray-400 mt-2">* النقطة الواحدة تساوي 0.01 ريال سعودي</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Rewards Catalog (Animated Carousel) */}
        <div className="mb-8">
            <style>{`
                @keyframes scrollRewards {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-rewards {
                    animation: scrollRewards 40s linear infinite;
                }
                .animate-scroll-rewards:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="flex justify-between items-end mb-4 px-2">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <div className="bg-[#0C5A5D]/10 p-1.5 rounded-lg text-[#0C5A5D]"><Icons.Gift size={18} /></div>
                    مكافآت تستحقها
                </h3>
                <span className="text-[10px] text-gray-400 cursor-pointer hover:text-[#0C5A5D] transition-colors">عرض كتالوج المكافآت</span>
            </div>
            
            <div className="overflow-hidden relative -mx-4 pb-4" dir="ltr">
                 <div className="flex animate-scroll-rewards w-max px-4">
                    {infiniteRewards.map((reward, idx) => (
                        <div key={idx} className="w-[150px] mx-2 flex-shrink-0" dir="rtl">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-lg shadow-sm group-hover:scale-110 transition-transform ${reward.color}`}>
                                        {React.cloneElement(reward.icon as React.ReactElement<any>, { size: 24 })}
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-xs mb-0.5">{reward.title}</h4>
                                    <p className="text-[9px] text-gray-400 mb-3">{reward.sub}</p>
                                    <button className="w-full bg-gray-50 text-[#0C5A5D] border border-[#0C5A5D]/20 text-[10px] font-bold py-2 rounded-xl hover:bg-[#0C5A5D] hover:text-white transition-colors">
                                        {reward.cost} نقطة
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Earn More Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[1.5rem] p-5 text-white shadow-lg mb-8 flex items-center justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform">
             <div className="absolute left-0 bottom-0 opacity-10 transform translate-y-1/3 -translate-x-1/4 group-hover:scale-110 transition-transform duration-700">
                 <Icons.Users size={120} />
             </div>
             <div className="relative z-10">
                 <h4 className="font-bold text-base mb-1">ادعُ أصدقاءك واكسب!</h4>
                 <p className="text-xs text-purple-100 opacity-90">احصل على 500 نقطة لكل صديق يسجل</p>
             </div>
             <button className="relative z-10 bg-white/20 hover:bg-white text-white hover:text-purple-600 backdrop-blur-sm text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
                 مشاركة <Icons.Share2 size={14} />
             </button>
        </div>

        {/* Transactions List (Expanded) */}
        <div>
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                     <div className="bg-[#0C5A5D]/10 p-1.5 rounded-lg text-[#0C5A5D]"><Icons.List size={20} /></div>
                     سجل آخر العمليات
                </h3>
            </div>

            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div key={tx.id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all hover:border-[#0C5A5D]/30">
                        <div className="flex items-start gap-4">
                             <div className={`p-4 rounded-2xl ${tx.amount.includes('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'} group-hover:scale-105 transition-transform shadow-sm`}>
                                {tx.amount.includes('+') ? <Icons.TrendingUp size={24} /> : <Icons.ShoppingCart size={24} />}
                             </div>
                            <div>
                                <h4 className="font-black text-sm text-gray-800 mb-1">{tx.title}</h4>
                                <p className="text-[10px] text-gray-400 font-medium mb-1.5">{tx.desc}</p>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-50 w-max px-2 py-0.5 rounded-md">
                                    <Icons.Clock size={10} /> {tx.date}
                                </span>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                             <span className={`font-black text-lg block ${tx.amount.includes('+') ? 'text-green-600' : 'text-red-500'}`}>
                                {tx.amount.replace(' ريال', '')} <span className="text-xs">نقطة</span>
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${tx.amount.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {tx.amount.includes('+') ? 'مكتمل' : 'مخصوم'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-sm hover:border-[#0C5A5D] hover:text-[#0C5A5D] hover:bg-[#0C5A5D]/5 transition-all flex items-center justify-center gap-2">
                عرض السجل الكامل <Icons.ChevronLeft size={16} />
            </button>
        </div>

        {/* Terms Modal */}
        {isPointsTermsOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-scale-in">
                    <button onClick={() => setIsPointsTermsOpen(false)} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <Icons.X size={20} />
                    </button>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3 text-yellow-600 shadow-sm border border-yellow-100">
                            <Icons.FileText size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-800">شروط وأحكام النقاط</h3>
                        <p className="text-xs text-gray-500 mt-1">سياسة استخدام محفظة النقاط</p>
                    </div>
                    <div className="space-y-4 text-sm text-gray-600 overflow-y-auto max-h-[50vh] pl-2 custom-scrollbar">
                        <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="min-w-[4px] bg-[#0C5A5D] rounded-full"></div>
                            <p className="font-medium text-xs leading-relaxed">النقاط المكتسبة صالحة لمدة <span className="font-bold text-gray-800">12 شهراً ميلادياً</span> من تاريخ إضافتها للمحفظة.</p>
                        </div>
                        <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="min-w-[4px] bg-[#0C5A5D] rounded-full"></div>
                            <p className="font-medium text-xs leading-relaxed">لا يمكن استبدال النقاط بمبالغ نقدية (كاش) تحت أي ظرف، وإنما تستخدم كخصومات أو خدمات.</p>
                        </div>
                        <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="min-w-[4px] bg-[#0C5A5D] rounded-full"></div>
                            <p className="font-medium text-xs leading-relaxed">يمكن استخدام النقاط في الخدمات الطبية المقدمة عبر الشبكة أو في متجر أمان إيفر فقط.</p>
                        </div>
                        <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                             <div className="min-w-[4px] bg-[#0C5A5D] rounded-full"></div>
                            <p className="font-medium text-xs leading-relaxed">الحد الأدنى لاستبدال النقاط في العملية الواحدة هو <span className="font-bold text-gray-800">1000 نقطة</span>.</p>
                        </div>
                        <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                             <div className="min-w-[4px] bg-[#0C5A5D] rounded-full"></div>
                            <p className="font-medium text-xs leading-relaxed">في حال إلغاء الخدمة التي تم شراؤها بالنقاط، يتم إعادة النقاط للمحفظة بنفس تاريخ الصلاحية الأصلي.</p>
                        </div>
                    </div>
                    <button onClick={() => setIsPointsTermsOpen(false)} className="w-full bg-[#0C5A5D] text-white py-3.5 rounded-xl font-bold mt-6 hover:bg-[#0a484b] transition-colors shadow-lg shadow-[#0C5A5D]/20">
                        فهمت ذلك، شكراً
                    </button>
                </div>
            </div>
        )}
    </div>
  );
  };

  const renderMyCard = () => {
      // Configuration for Card Tiers
      const getCardStyle = () => {
          switch(selectedTier) {
              case 'bronze': return 'bg-gradient-to-br from-[#7B3F00] via-[#A05A2C] to-[#5D2906] shadow-[#7B3F00]/40';
              // Brighter Gold for Black Text
              case 'golden': return 'bg-gradient-to-br from-[#FDB931] via-[#F9D976] to-[#D4AF37] shadow-[#B8860B]/40';
              case 'platinum': return 'bg-gradient-to-br from-[#0C5A5D] via-[#0f7276] to-[#083d40] shadow-[#0C5A5D]/40';
              default: return 'bg-gray-800';
          }
      };
      
      const getTierLabel = () => {
          switch(selectedTier) {
              case 'bronze': return 'بطاقة برونزية';
              case 'golden': return 'بطاقة ذهبية';
              case 'platinum': return 'بطاقة بلاتينية';
          }
      };

      const packageInfo: any = {
          'الباقة الفردية': 'تشمل فرد واحد',
          'الباقة المتميزة': 'تشمل الزوج والزوجة',
          'الباقة العائلية': 'تشمل 4 أفراد',
          'الباقة الذهبية': 'تشمل فرد واحد'
      };

      const availablePackages = [
          'الباقة الفردية',
          'الباقة المتميزة',
          'الباقة العائلية',
          'الباقة الذهبية'
      ];

      // Dynamic Text Colors based on Tier
      const isGolden = selectedTier === 'golden';
      const textColor = isGolden ? 'text-slate-900' : 'text-white';
      const subTextColor = isGolden ? 'text-slate-800/80' : 'text-white/80';
      const labelColor = isGolden ? 'text-slate-800/60' : 'text-white/70';
      const iconColor = isGolden ? 'text-slate-900' : 'text-white';
      const chipBorder = isGolden ? 'border-slate-900/10' : 'border-yellow-500/50';

      return (
      <div className="px-4 -mt-20 relative z-10 animate-fade-in-up pb-24">
          <div className="mb-6 text-center">
              <h2 className="text-xl font-black text-white drop-shadow-md">بطاقتي الرقمية</h2>
          </div>

          {/* THE DYNAMIC CARD */}
          <div className={`relative w-full aspect-[1.586/1] rounded-[24px] overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] group mb-8 ${getCardStyle()}`}>
              {/* Texture Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              {/* Shine Effect */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none"></div>

              {/* Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                          <Icons.ShieldCheck className={`${iconColor} filter drop-shadow-md`} size={28} />
                          <div className="flex flex-col">
                            <span className={`font-black tracking-widest text-lg ${textColor} text-shadow`}>أمان إيفر</span>
                            <span className={`text-[8px] ${subTextColor} tracking-[0.2em] font-light`}>HEALTHCARE</span>
                          </div>
                      </div>
                      <div className="flex flex-col items-end">
                          <span className={`${textColor} font-black text-sm italic uppercase tracking-wider text-shadow`}>
                              {getTierLabel()}
                          </span>
                           <div className={`mt-1 flex flex-col items-end`}>
                               <span className={`text-[10px] ${isGolden ? 'bg-black/10 text-slate-900' : 'bg-black/20 text-white/90'} px-2 py-0.5 rounded font-medium`}>
                                   {selectedPackage}
                               </span>
                               <span className={`text-[8px] ${subTextColor} mt-0.5`}>
                                   {packageInfo[selectedPackage]}
                               </span>
                           </div>
                      </div>
                  </div>

                  {/* Middle (Chip & QR) */}
                  <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-9 rounded-md bg-gradient-to-br from-yellow-100 to-yellow-400 ${chipBorder} relative overflow-hidden flex items-center justify-center shadow-inner`}>
                               <Icons.Cpu size={24} className="text-yellow-700 opacity-70" />
                          </div>
                          <Icons.Activity className={isGolden ? 'text-slate-900/20' : 'text-white/30'} size={32} />
                      </div>
                      
                      {/* QR Code */}
                      <div className="bg-white p-0.5 rounded-lg shadow-sm opacity-90 overflow-hidden">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${user.cardNumber}`} 
                            alt="QR Code" 
                            className="w-10 h-10 object-contain"
                        />
                      </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-end">
                      <div className={`${textColor} space-y-1`}>
                          <p className={`text-[10px] ${labelColor} uppercase tracking-wider`}>Card Holder</p>
                          <p className={`font-bold text-lg tracking-wide ${textColor} text-shadow`}>{user.name}</p>
                          <p className={`font-mono text-sm ${subTextColor} tracking-widest`}>{user.cardNumber}</p>
                      </div>
                      <div className="text-right">
                          <p className={`text-[8px] ${labelColor} uppercase`}>Valid Thru</p>
                          <p className={`font-mono text-sm font-bold ${textColor}`}>{user.expiry}</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* CARD CONFIGURATION PANEL */}
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0C5A5D] via-yellow-500 to-[#0C5A5D]"></div>
               <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
                   <Icons.Settings size={16} className="text-[#0C5A5D]" />
                   تخصيص البطاقة والاشتراك
               </h3>
               
               {/* Tier Selector */}
               <div className="mb-4">
                   <label className="text-xs text-gray-400 font-bold mb-2 block">نوع البطاقة</label>
                   <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl">
                       <button 
                         onClick={() => setSelectedTier('platinum')}
                         className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${selectedTier === 'platinum' ? 'bg-[#0C5A5D] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                       >
                           بلاتينية
                       </button>
                       <button 
                         onClick={() => setSelectedTier('golden')}
                         className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${selectedTier === 'golden' ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                       >
                           ذهبية
                       </button>
                       <button 
                         onClick={() => setSelectedTier('bronze')}
                         className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${selectedTier === 'bronze' ? 'bg-[#A05A2C] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                       >
                           برونزية
                       </button>
                   </div>
               </div>

               {/* Package Selector */}
                <div>
                   <label className="text-xs text-gray-400 font-bold mb-2 block">نوع الباقة</label>
                   <div className="grid grid-cols-2 gap-2">
                       {availablePackages.map(pkg => (
                           <button 
                             key={pkg}
                             onClick={() => setSelectedPackage(pkg)}
                             className={`py-2 px-2 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-1 ${selectedPackage === pkg ? 'border-[#0C5A5D] bg-[#0C5A5D]/5 text-[#0C5A5D] ring-1 ring-[#0C5A5D]/20' : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                           >
                               <span>{pkg}</span>
                               <span className="text-[8px] opacity-70 font-normal">{packageInfo[pkg]}</span>
                           </button>
                       ))}
                   </div>
               </div>
               
               <button className="w-full mt-4 bg-[#0C5A5D] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#0C5A5D]/20 active:scale-95 transition-all">
                   تأكيد الاشتراك وتحديث البطاقة
               </button>
           </div>

          {/* MY WALLET SECTION (Within Card View) */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0C5A5D]/10 text-[#0C5A5D] flex items-center justify-center">
                      <Icons.Wallet size={24} />
                  </div>
                  <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">رصيد محفظتي</p>
                      <p className="text-2xl font-black text-[#0C5A5D]">{user.walletBalance} <span className="text-xs font-normal">ريال</span></p>
                  </div>
              </div>
              <button className="bg-[#0C5A5D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-[#0a484b] transition-colors">
                  شحن الرصيد
              </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mt-8">
              <button className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all">
                  <div className="bg-red-50 p-3 rounded-full text-red-600">
                      <Icons.FileText size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">تحميل PDF</span>
              </button>
              <button className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                      <Icons.Share2 size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">مشاركة</span>
              </button>
               <button className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all">
                  <div className="bg-gray-800 p-3 rounded-full text-white">
                      <Icons.Grid size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">رمز QR</span>
              </button>
          </div>
      </div>
      );
  };

  const renderStore = () => (
      <div className="-mt-20 relative z-10 animate-fade-in-up pb-24">
          <div className="bg-white rounded-t-3xl pt-6 px-4 pb-20 min-h-[60vh]">
               <div className="flex items-center justify-between mb-6">
                   <h3 className="font-black text-xl text-[#0C5A5D] flex items-center gap-2">
                       <Icons.ShoppingBasket size={24} /> مشترياتي من المتجر
                   </h3>
                   <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                       رصيدك: {user.cashback} ريال
                   </div>
               </div>

               {/* Purchase History List */}
               <div className="space-y-4 mb-8">
                   {[
                       { item: 'فيتامين C فوار', date: '20/01/2024', price: '45 ريال', status: 'مكتمل', statusColor: 'text-green-600 bg-green-50' },
                       { item: 'جهاز قياس الضغط', date: '15/01/2024', price: '250 ريال', status: 'جاري التوصيل', statusColor: 'text-orange-600 bg-orange-50' },
                       { item: 'جلسة ليزر (قسيمة)', date: '10/01/2024', price: '500 ريال', status: 'تم الاستخدام', statusColor: 'text-blue-600 bg-blue-50' }
                   ].map((order, idx) => (
                       <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                   <Icons.ShoppingBag size={20} />
                               </div>
                               <div>
                                   <h4 className="font-bold text-sm text-gray-800">{order.item}</h4>
                                   <p className="text-[10px] text-gray-500">{order.date}</p>
                               </div>
                           </div>
                           <div className="text-left">
                               <span className="block font-bold text-[#0C5A5D] text-sm mb-1">{order.price}</span>
                               <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${order.statusColor}`}>{order.status}</span>
                           </div>
                       </div>
                   ))}
                   <button className="w-full py-3 text-center text-sm font-bold text-[#0C5A5D] bg-[#0C5A5D]/5 rounded-xl hover:bg-[#0C5A5D]/10 transition-colors">
                       عرض كل الطلبات السابقة
                   </button>
               </div>
               
               <div className="mt-8 border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-800">تصفح الأقسام</h4>
                      <button className="text-xs text-[#0C5A5D] font-bold">الذهاب للمتجر</button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {['تجميل', 'أسنان', 'مختبرات', 'أدوية', 'أجهزة طبية', 'فيتامينات'].map((cat, i) => (
                          <button key={i} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 whitespace-nowrap hover:bg-[#0C5A5D] hover:text-white transition-colors">
                              {cat}
                          </button>
                      ))}
                  </div>
               </div>
          </div>
      </div>
  );

  const renderProfile = () => {
    // Tabs Data including the new 'Special Offers'
    const profileTabs = [
        { id: 'info', label: 'البيانات', icon: <Icons.User size={14} /> },
        { id: 'bookings', label: 'الحجوزات', icon: <Icons.Calendar size={14} /> },
        { id: 'activity', label: 'النشاط', icon: <Icons.Activity size={14} /> },
        { id: 'rewards', label: 'المكافآت', icon: <Icons.Gift size={14} /> },
        { id: 'orders', label: 'المتجر', icon: <Icons.ShoppingBag size={14} /> },
        { id: 'special_offers', label: 'عروض خاصة', icon: <Icons.Percent size={14} />, isNew: true },
    ];
    
    // Duplicate for infinite scroll effect
    const infiniteTabs = [...profileTabs, ...profileTabs];

    return (
    <div className="px-4 -mt-24 relative z-10 animate-fade-in-up pb-24">
      
      {/* 1. Main Profile Card */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border border-gray-100 relative overflow-hidden mb-6 group">
          
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-white"></div>
          
          {/* Profile Header */}
          <div className="relative flex flex-col items-center">
             <div className="w-24 h-24 p-1 rounded-full bg-white shadow-xl relative mb-4 mt-2 ring-4 ring-gray-50">
                 <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white">
                     <Icons.User size={40} className="text-gray-400" />
                 </div>
                 <button className="absolute bottom-1 right-1 bg-[#0C5A5D] text-white p-1.5 rounded-full border-4 border-white shadow-sm hover:scale-110 transition-transform">
                     <Icons.Edit size={12} /> 
                 </button>
             </div>
             
             <h2 className="text-xl font-black text-gray-800 mb-1">{user.name}</h2>
             <div className="flex items-center gap-2 bg-[#0C5A5D]/5 px-3 py-1 rounded-full border border-[#0C5A5D]/10 mt-1">
                 <Icons.Crown size={12} className="text-[#0C5A5D]" />
                 <span className="text-[10px] font-bold text-[#0C5A5D]">{selectedPackage}</span>
             </div>
          </div>

          {/* REFERRAL CODE SECTION */}
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="flex justify-between items-center relative z-10">
                  <div>
                      <h4 className="font-bold text-sm mb-1 flex items-center gap-1"><Icons.Gift size={14} /> رمز الإحالة الخاص بك</h4>
                      <p className="text-[10px] text-purple-100">شارك الرمز واربح رصيد خدمات ومكافآت!</p>
                  </div>
                  <div className="bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/30 flex items-center gap-2 cursor-pointer hover:bg-white/30 transition-colors">
                      <span className="font-mono font-bold tracking-wider">{user.referralCode}</span>
                      <Icons.Copy size={14} />
                  </div>
              </div>
          </div>
      </div>

      {/* PROFILE SECTIONS TABS - CAROUSEL ANIMATION */}
      <div className="mb-4 overflow-hidden relative w-full">
           <style>{`
                @keyframes scrollTabs {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-tabs {
                    display: flex;
                    width: max-content;
                    animation: scrollTabs 20s linear infinite;
                }
                .animate-scroll-tabs:hover {
                    animation-play-state: paused;
                }
            `}</style>
          
          <div className="w-full overflow-hidden" dir="ltr">
             <div className="animate-scroll-tabs py-1">
                 {infiniteTabs.map((tab, idx) => (
                      <button 
                          key={`${tab.id}-${idx}`}
                          onClick={() => setProfileSection(tab.id as any)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 mx-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                              profileSection === tab.id 
                              ? 'bg-[#0C5A5D] text-white shadow-md' 
                              : (tab.isNew ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100')
                          }`}
                          dir="rtl"
                      >
                          {tab.icon} {tab.label}
                          {tab.isNew && <span className="bg-white text-red-500 text-[8px] px-1 rounded-sm mr-1 animate-pulse">جديد</span>}
                      </button>
                  ))}
             </div>
          </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      <div className="bg-white rounded-[2rem] p-5 shadow-lg min-h-[300px] border border-gray-50">
          
          {/* 1. INFO SECTION */}
          {profileSection === 'info' && (
              <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center p-3 rounded-2xl border border-gray-100 bg-gray-50">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#0C5A5D] flex items-center justify-center shadow-sm">
                          {user.residencyType === 'visitor' ? <Icons.Globe size={20} /> : <Icons.CreditCard size={20} />}
                      </div>
                      <div className="mr-3 flex-1">
                          <p className="text-[10px] text-gray-400 font-bold mb-0.5">
                              {user.residencyType === 'visitor' ? 'رقم الجواز' : 'رقم الهوية'}
                          </p>
                          <p className="text-sm font-bold text-gray-800 font-mono tracking-wider">{user.id}</p>
                      </div>
                  </div>
                  <div className="flex items-center p-3 rounded-2xl border border-gray-100 bg-gray-50">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#0C5A5D] flex items-center justify-center shadow-sm">
                          <Icons.Smartphone size={20} />
                      </div>
                      <div className="mr-3 flex-1">
                          <p className="text-[10px] text-gray-400 font-bold mb-0.5">رقم الهاتف</p>
                          <p className="text-sm font-bold text-gray-800 font-mono dir-ltr text-right">{user.phone}</p>
                      </div>
                  </div>
                  <div className="flex items-center p-3 rounded-2xl border border-gray-100 bg-gray-50">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#0C5A5D] flex items-center justify-center shadow-sm">
                          <Icons.Mail size={20} />
                      </div>
                      <div className="mr-3 flex-1 overflow-hidden">
                          <p className="text-[10px] text-gray-400 font-bold mb-0.5">البريد الإلكتروني</p>
                          <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                      </div>
                  </div>
              </div>
          )}

          {/* 2. BOOKINGS LOG */}
          {profileSection === 'bookings' && (
              <div className="space-y-4 animate-fade-in">
                   <h3 className="text-sm font-bold text-gray-700">سجل الحجوزات</h3>
                   {[
                       { type: 'موعد عيادة', title: 'عيادة الأسنان', date: '25/01/2024', status: 'مكتمل', color: 'bg-green-100 text-green-700', icon: <Icons.Calendar size={16}/> },
                       { type: 'استشارة', title: 'طب أطفال', date: '01/02/2024', status: 'قادم', color: 'bg-blue-100 text-blue-700', icon: <Icons.Video size={16}/> },
                       { type: 'رعاية منزلية', title: 'تمريض يومي', date: '10/01/2024', status: 'ملغي', color: 'bg-red-100 text-red-700', icon: <Icons.Home size={16}/> },
                   ].map((item, i) => (
                       <div key={i} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0">
                           <div className={`p-3 rounded-full ${item.color.split(' ')[0]}`}>{item.icon}</div>
                           <div className="flex-1">
                               <div className="flex justify-between">
                                   <span className="font-bold text-sm text-gray-800">{item.title}</span>
                                   <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${item.color}`}>{item.status}</span>
                               </div>
                               <p className="text-[10px] text-gray-400 mt-1">{item.type} - {item.date}</p>
                           </div>
                       </div>
                   ))}
              </div>
          )}

          {/* 3. ACTIVITY LOG */}
          {profileSection === 'activity' && (
              <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-gray-700">سجل النشاطات</h3>
                  {[
                       { action: 'تسجيل الدخول', time: 'منذ ساعة', icon: <Icons.LogOut className="rotate-180" size={16}/> },
                       { action: 'تحديث الملف الشخصي', time: 'أمس', icon: <Icons.Edit size={16}/> },
                       { action: 'استخدام كود خصم', time: '20/01/2024', icon: <Icons.Tag size={16}/> },
                   ].map((act, i) => (
                       <div key={i} className="flex items-center gap-3">
                           <div className="bg-gray-100 p-2 rounded-full text-gray-500">{act.icon}</div>
                           <div>
                               <p className="text-xs font-bold text-gray-700">{act.action}</p>
                               <p className="text-[10px] text-gray-400">{act.time}</p>
                           </div>
                       </div>
                   ))}
              </div>
          )}

          {/* 4. REWARDS LOG */}
          {profileSection === 'rewards' && (
              <div className="space-y-4 animate-fade-in">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 mb-4">
                      <h4 className="font-bold text-orange-800 text-xs mb-1">المكافآت المتاحة</h4>
                      <p className="text-[10px] text-orange-600">لديك 3 مكافآت غير مستخدمة</p>
                  </div>
                  {[
                       { title: 'مكافأة الانضمام', val: '500 نقطة', status: 'مستخدمة', icon: <Icons.CheckCircle size={16} className="text-green-500"/> },
                       { title: 'إحالة صديق', val: '100 ريال', status: 'غير مستخدمة', icon: <Icons.Clock size={16} className="text-orange-500"/> },
                       { title: 'قسيمة المتجر', val: 'خصم 20%', status: 'منتهية', icon: <Icons.XCircle size={16} className="text-gray-400"/> },
                   ].map((rew, i) => (
                       <div key={i} className="flex justify-between items-center border p-3 rounded-xl border-gray-50">
                           <div className="flex items-center gap-2">
                               {rew.icon}
                               <div>
                                   <p className="text-xs font-bold text-gray-800">{rew.title}</p>
                                   <p className="text-[10px] text-gray-500">{rew.val}</p>
                               </div>
                           </div>
                           <span className="text-[9px] font-bold text-gray-400">{rew.status}</span>
                       </div>
                   ))}
              </div>
          )}
          
          {/* 5. ORDERS LOG */}
          {profileSection === 'orders' && (
               <div className="space-y-4 animate-fade-in">
                   <h3 className="text-sm font-bold text-gray-700">سجل طلبات المتجر</h3>
                   <div className="text-center py-6">
                       <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                           <Icons.ShoppingBasket className="text-gray-300" size={32} />
                       </div>
                       <p className="text-xs text-gray-500">تم عرض آخر الطلبات في قسم المتجر</p>
                       <button onClick={() => setActiveTab('store')} className="text-[#0C5A5D] text-xs font-bold mt-2">الذهاب للمتجر</button>
                   </div>
               </div>
          )}

          {/* 6. SPECIAL OFFERS (NEW) */}
          {profileSection === 'special_offers' && (
               <div className="space-y-4 animate-fade-in">
                   <div className="flex items-center justify-between mb-2">
                       <h3 className="text-sm font-bold text-[#0C5A5D] flex items-center gap-2">
                           <Icons.Percent size={18} /> العروض الخاصة لك
                       </h3>
                       <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">لفترة محدودة</span>
                   </div>

                   {/* Mock Offers List */}
                   {[
                       { title: 'باقة الفحص الشامل', provider: 'مختبرات البرج', price: '299 ريال', oldPrice: '800 ريال', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200&auto=format&fit=crop', type: 'مختبرات' },
                       { title: 'تنظيف أسنان وتلميع', provider: 'مجمع المهيدب', price: '99 ريال', oldPrice: '350 ريال', img: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=200&auto=format&fit=crop', type: 'أسنان' },
                       { title: 'فيتامينات متعددة', provider: 'متجر أمان', price: '45 ريال', oldPrice: '90 ريال', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop', type: 'متجر' },
                   ].map((offer, idx) => (
                       <div key={idx} className="flex gap-3 border border-gray-100 rounded-2xl p-3 hover:shadow-md transition-shadow relative overflow-hidden group bg-gray-50">
                            {/* Tag */}
                            <div className="absolute top-0 left-0 bg-[#0C5A5D] text-white text-[9px] px-2 py-1 rounded-br-lg font-bold z-10">
                                {offer.type}
                            </div>

                           <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                               <img src={offer.img} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           </div>
                           <div className="flex-1 flex flex-col justify-center">
                               <h4 className="font-bold text-gray-800 text-xs mb-1 line-clamp-2">{offer.title}</h4>
                               <p className="text-[10px] text-gray-500 mb-2">{offer.provider}</p>
                               <div className="flex items-center gap-2">
                                   <span className="font-black text-[#0C5A5D] text-sm">{offer.price}</span>
                                   <span className="text-[10px] text-gray-400 line-through decoration-red-400">{offer.oldPrice}</span>
                               </div>
                           </div>
                           <button className="self-end bg-white text-[#0C5A5D] border border-[#0C5A5D] p-2 rounded-full hover:bg-[#0C5A5D] hover:text-white transition-colors">
                               <Icons.ChevronLeft size={16} />
                           </button>
                       </div>
                   ))}
                   <button className="w-full text-center text-xs text-gray-400 mt-2 font-bold hover:text-[#0C5A5D]">عرض كل العروض</button>
               </div>
          )}

      </div>

       {/* Settings & Menu */}
       <div className="space-y-3 mb-8 mt-6">
            <h3 className="px-2 text-sm font-bold text-gray-400 mb-2">الإعدادات العامة</h3>
            {[
                { label: 'إدارة العائلة والتابعين', icon: <Icons.Users size={20} />, color: 'text-purple-600 bg-purple-50' },
                { label: 'العناوين المحفوظة', icon: <Icons.MapPin size={20} />, color: 'text-green-600 bg-green-50' },
                { label: 'اللغة والإشعارات', icon: <Icons.Globe size={20} />, color: 'text-orange-600 bg-orange-50' },
                { label: 'سياسة الخصوصية', icon: <Icons.ShieldCheck size={20} />, color: 'text-blue-600 bg-blue-50' },
                { label: 'المساعدة والدعم', icon: <Icons.Headphones size={20} />, color: 'text-cyan-600 bg-cyan-50' },
            ].map((item, idx) => (
                <button key={idx} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#0C5A5D] hover:shadow-md transition-all active:scale-95">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>
                        <span className="font-bold text-sm text-gray-700 group-hover:text-gray-900">{item.label}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#0C5A5D] group-hover:text-white transition-colors">
                        <Icons.ChevronLeft size={16} />
                    </div>
                </button>
            ))}

             <button 
                onClick={onSwitch}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between group hover:bg-red-50 hover:border-red-200 transition-all mt-6 active:scale-95"
             >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 group-hover:scale-110 transition-transform">
                        <Icons.LogOut size={20} />
                    </div>
                    <span className="font-bold text-sm text-red-600">تسجيل الخروج</span>
                </div>
            </button>
        </div>
    </div>
  );
  };

  // --- TOP HEADER LOGIC ---
  const getHeaderTitle = () => {
      switch(activeTab) {
          case 'home': return 'الرئيسية';
          case 'cashback': return 'الكاش باك';
          case 'points': return 'محفظة النقاط';
          case 'card': return 'بطاقة أمان';
          case 'store': return 'المتجر';
          case 'profile': return 'الملف الشخصي';
          default: return '';
      }
  };

  return (
    <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative mx-auto animate-fade-in pb-20">
      
      {/* Full Screen Overlays */}
      {isNetworkOpen && (
        <MedicalNetwork onBack={() => setIsNetworkOpen(false)} />
      )}
      {isHealthNetworkOpen && (
        <HealthNetwork onBack={() => setIsHealthNetworkOpen(false)} />
      )}

      {/* 1. Top Header (Subscriber) */}
      <div className="bg-[#0C5A5D] pt-12 pb-24 px-6 rounded-b-[3rem] relative shadow-lg transition-all duration-500 z-0">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                    <Icons.User className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-white font-bold text-lg leading-tight">مرحباً، {user.name.split(' ')[0]}</h2>
                    <span className="text-cyan-100 text-xs font-mono">{getHeaderTitle()}</span>
                </div>
            </div>
            <button onClick={onSwitch} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition text-white">
                <Icons.ArrowLeft size={20} className="rtl:rotate-180" />
            </button>
        </div>
      </div>

      {/* RENDER CONTENT BASED ON TAB */}
      {activeTab === 'home' && renderHome()}
      {activeTab === 'cashback' && renderCashback()}
      {activeTab === 'points' && renderPoints()}
      {activeTab === 'card' && renderMyCard()}
      {activeTab === 'store' && renderStore()}
      {activeTab === 'profile' && renderProfile()}

      {/* Subscriber Bottom Nav - 6 ITEMS ORDERED AS REQUESTED */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-2 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50 max-w-md mx-auto">
            <div className="flex justify-between items-end">
                {[
                    { id: 'home', label: 'الرئيسية', icon: <Icons.Home size={20} /> },
                    { id: 'cashback', label: 'الكاش باك', icon: <Icons.Gem size={20} /> },
                    { id: 'points', label: 'النقاط', icon: <Icons.Wallet size={20} /> },
                    { id: 'card', label: 'بطاقتي', icon: <Icons.CreditCard size={20} /> },
                    { id: 'store', label: 'المتجر', icon: <Icons.ShoppingBag size={20} /> },
                    { id: 'profile', label: 'الملف', icon: <Icons.User size={20} /> },
                ].map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1.5 transition-all w-full`}
                    >
                        <div className={`transition-all duration-300 rounded-xl flex items-center justify-center ${
                            item.id === activeTab 
                            ? 'bg-[#0C5A5D] text-white p-2.5 shadow-lg shadow-[#0C5A5D]/30 -translate-y-2' 
                            : 'text-gray-400 bg-transparent'
                        }`}>
                            {item.icon}
                        </div>
                        <span className={`text-[9px] whitespace-nowrap leading-none transition-all ${
                            item.id === activeTab 
                            ? 'font-black text-[#0C5A5D] scale-110 -translate-y-1' 
                            : 'font-medium text-gray-400'
                        }`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
      </div>
      
      {/* AI Modal */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />

    </div>
  );
};

export default SubscriberApp;