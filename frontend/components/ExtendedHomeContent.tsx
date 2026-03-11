import React, { useState, useRef } from 'react';
import { Icons } from './Icons';

const SectionHeader: React.FC<{ title: string; subtitle?: string; linkText?: string; icon?: React.ReactNode }> = ({ title, subtitle, linkText = "عرض الكل", icon }) => (
  <div className="flex justify-between items-end px-4 mb-4 mt-8">
    <div className="flex flex-col">
        <div className="flex items-center gap-2">
            {icon && <div className="text-[#0C5A5D]" aria-hidden="true">{icon}</div>}
            <h3 className="text-[#0C5A5D] font-bold text-lg leading-none">{title}</h3>
        </div>
        {subtitle && <p className="text-[10px] text-gray-500 mt-1.5 font-medium leading-tight max-w-[260px]">{subtitle}</p>}
    </div>
    <button className="text-gray-400 text-xs font-medium hover:text-[#0C5A5D] transition-colors flex items-center gap-1 group self-center mb-0.5">
      {linkText} 
      <div className="bg-gray-100 rounded-full p-0.5 group-hover:bg-[#0C5A5D]/10 transition-colors">
        <Icons.Search size={10} className="transform rotate-90 text-gray-500 group-hover:text-[#0C5A5D]" aria-hidden="true" />
      </div>
    </button>
  </div>
);

// --- 1. Quick Services (Infinite Carousel - Optimized) ---
const QuickServicesSection = () => {
    const services = [
        { name: 'حجز موعد', icon: <Icons.Calendar className="text-blue-500" />, bg: 'bg-blue-50' },
        { name: 'استشارة اونلاين', icon: <Icons.Video className="text-purple-500" />, bg: 'bg-purple-50' },
        { name: 'متجر أمان', icon: <Icons.ShoppingBag className="text-pink-500" />, bg: 'bg-pink-50' },
        { name: 'رعاية منزلية', icon: <Icons.Home className="text-teal-500" />, bg: 'bg-teal-50' },
        { name: 'رعاية أطفال', icon: <Icons.Baby className="text-orange-400" />, bg: 'bg-orange-50' },
        { name: 'تطعيمات', icon: <Icons.Syringe className="text-red-500" />, bg: 'bg-red-50' },
        { name: 'علاج طبيعي', icon: <Icons.Activity className="text-green-500" />, bg: 'bg-green-50' },
        { name: 'تحاليل مخبرية', icon: <Icons.FileText className="text-indigo-500" />, bg: 'bg-indigo-50' },
        { name: 'تحاليل السكر', icon: <Icons.HeartPulse className="text-rose-500" />, bg: 'bg-rose-50' },
        { name: 'تمريض', icon: <Icons.User className="text-cyan-600" />, bg: 'bg-cyan-50' },
        { name: 'صيدلية', icon: <Icons.Pill className="text-emerald-500" />, bg: 'bg-emerald-50' },
        { name: 'حاسبة الحمل', icon: <Icons.Baby className="text-fuchsia-500" />, bg: 'bg-fuchsia-50' },
        { name: 'تغذية', icon: <Icons.CheckCircle className="text-lime-600" />, bg: 'bg-lime-50' },
    ];

    const carouselServices = [...services, ...services];

    return (
        <div className="mb-8 overflow-hidden">
            <style>{`
                @keyframes scrollLinear {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-services {
                    display: flex;
                    width: max-content;
                    animation: scrollLinear 60s linear infinite;
                }
                .animate-scroll-services:hover {
                    animation-play-state: paused;
                }
            `}</style>
            
            <div className="flex justify-between items-center px-4 mb-4 mt-2">
                <div className="flex items-center gap-2">
                    <Icons.Zap className="text-yellow-500 fill-yellow-500" size={20} aria-hidden="true" />
                    <h3 className="text-[#0C5A5D] font-black text-xl">الخدمات السريعة</h3>
                </div>
            </div>

            <div className="relative w-full overflow-hidden" dir="ltr">
                 <div className="animate-scroll-services py-2">
                    {carouselServices.map((svc, idx) => (
                        <div key={`${idx}-${svc.name}`} className="flex flex-col items-center gap-2 w-[85px] mx-2 group cursor-pointer flex-shrink-0" dir="rtl">
                            <div className={`w-16 h-16 ${svc.bg} rounded-[1.2rem] flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300`}>
                                {React.cloneElement(svc.icon as React.ReactElement<any>, { size: 28, 'aria-hidden': 'true' })}
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{svc.name}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

// --- REFACTORED: Doctors Available 24/7 (Infinite Scroll + Details) ---
const FeaturedPromoGrid = () => {
    const providers = [
        {
            id: 1,
            name: 'د. سارة الشمري',
            specialty: 'استشارية جلدية وتجميل',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
            location: 'الرياض',
            hospital: 'مستشفى دلة'
        },
        {
            id: 2,
            name: 'د. فهد القحطاني',
            specialty: 'طبيب أسرة',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop',
            location: 'جدة',
            hospital: 'عيادات أمان'
        },
        {
            id: 3,
            name: 'د. نورة العلي',
            specialty: 'طب أطفال',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop',
            location: 'الدمام',
            hospital: 'مجمع المواساة'
        },
        {
            id: 4,
            name: 'د. خالد الزهراني',
            specialty: 'طبيب قلب',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
            location: 'الرياض',
            hospital: 'المستشفى التخصصي'
        }
    ];

    // Duplicate for infinite scroll
    const carouselProviders = [...providers, ...providers];

    return (
        <div className="mb-8">
            <style>{`
                @keyframes scrollDoctors {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-doctors {
                    animation: scrollDoctors 40s linear infinite;
                }
                .animate-scroll-doctors:hover {
                    animation-play-state: paused;
                }
            `}</style>
            
            <SectionHeader 
                title="أطباء متاحون 24 ساعه" 
                subtitle="حجز بضغطة زر: رتب مواعيدك واستشاراتك الطبية بذكاء وسهولة."
                icon={<Icons.Clock size={20} className="text-[#0C5A5D]" />} 
                linkText="عرض الكل" 
            />
            
            <div className="overflow-hidden relative -mx-4" dir="ltr">
                 <div className="flex animate-scroll-doctors w-max py-2 pl-4">
                    {carouselProviders.map((doc, idx) => (
                        <div key={`${doc.id}-${idx}`} className="w-[280px] mx-2 flex-shrink-0" dir="rtl">
                            <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all duration-300 relative overflow-hidden h-full">
                                {/* Online Indicator */}
                                <div className="absolute top-4 left-4 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 z-20">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-bold text-green-700">متاح الآن</span>
                                </div>

                                <div className="flex items-start gap-3 mb-4 z-10">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100 bg-gray-50">
                                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{doc.name}</h4>
                                        <p className="text-[#0C5A5D] text-xs font-medium mb-1">{doc.specialty}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 p-1 rounded-md w-max mt-1">
                                            <Icons.Building2 size={10} className="text-gray-400" />
                                            {doc.hospital}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-2 z-10 pt-2 border-t border-gray-50">
                                    <div className="flex items-center justify-between mb-1">
                                         <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <Icons.MapPin size={10} />
                                            {doc.location}
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100">
                                            <span className="font-bold text-[10px] text-yellow-700">{doc.rating}</span>
                                            <Icons.Star size={8} className="text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-white border border-[#0C5A5D] text-[#0C5A5D] text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-[#0C5A5D]/5 transition-colors">
                                            <Icons.FileText size={12} />
                                            ملف الطبيب
                                        </button>
                                        <button className="flex-1 bg-[#0C5A5D] text-white text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-[#0a484b] transition-colors shadow-lg shadow-[#0C5A5D]/10">
                                            <Icons.Calendar size={12} />
                                            حجز موعد
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 2. Aman Wallet (With New Marketing Icons) ---
const AmanWalletSection = () => {
    return (
        <div className="mb-8">
            <SectionHeader title="محفظة نقاط أمان" icon={<Icons.Wallet size={20} />} />
            
            <div className="px-4 space-y-3">
                {/* Main Wallet Card */}
                <div className="bg-[#0C5A5D] rounded-[1.5rem] p-5 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-white/5">
                        <Icons.Sparkles size={100} aria-hidden="true" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <Icons.Sparkles size={20} className="text-cyan-300 animate-pulse" aria-hidden="true" />
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-md">
                            <span className="font-bold text-sm tracking-wider">AMAN PREMIUM</span>
                            <Icons.Crown size={14} className="text-yellow-400 fill-yellow-400" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="flex justify-between items-end relative z-10">
                         <div className="text-center">
                             <div className="flex items-center justify-center gap-1 text-cyan-200 text-xs font-medium mb-1">
                                 <Icons.Wallet size={12} aria-hidden="true" />
                                 الكاش باك
                             </div>
                             <div className="font-bold text-2xl">0.00 <span className="text-xs">ريال</span></div>
                         </div>
                         <div className="h-8 w-px bg-white/20"></div>
                         <div className="text-center">
                             <div className="flex items-center justify-center gap-1 text-yellow-200 text-xs font-medium mb-1">
                                 <Icons.Gem size={12} aria-hidden="true" />
                                 النقاط
                             </div>
                             <div className="font-bold text-2xl">0 <span className="text-xs">نقطة</span></div>
                         </div>
                    </div>
                </div>

                {/* Grid for Notifications & Marketing */}
                <div className="grid grid-cols-2 gap-3">
                    
                    {/* Existing Notification - Updated Text and Icon */}
                    <div className="bg-white rounded-[1.2rem] p-3 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-[#0C5A5D]"></div>
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-gray-800 text-xs">نقاط مجانية</h4>
                             <div className="bg-orange-100 p-1 rounded-full">
                                <Icons.Gift size={14} className="text-orange-500" />
                             </div>
                        </div>
                        <p className="text-[9px] text-gray-500 mb-2 leading-tight">اشترك الان واحصل على <span className="font-bold text-[#0C5A5D]">500 نقطة</span> فورا الى محفظتك</p>
                        <button className="w-full bg-gray-50 hover:bg-[#0C5A5D] hover:text-white text-[#0C5A5D] text-[10px] font-bold py-1.5 rounded-lg transition-colors">
                            تفعيل
                        </button>
                    </div>

                    {/* New Marketing Banner - Updated Text */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[1.2rem] p-3 shadow-sm border border-indigo-100 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                        <div className="absolute -left-2 -bottom-2 text-indigo-500/10">
                            <Icons.Star size={50} />
                        </div>
                        <div className="flex justify-between items-start mb-2 relative z-10">
                             <h4 className="font-bold text-indigo-900 text-xs">كاش باك فوري</h4>
                             <div className="bg-white p-1 rounded-full shadow-sm">
                                 <Icons.Gem size={14} className="text-indigo-600" />
                             </div>
                        </div>
                        <p className="text-[9px] text-indigo-800 mb-2 relative z-10 leading-tight">
                            ادفع ويرجع لك رصيد.. محفظتك دايم مليانة!
                        </p>
                        <button className="w-full bg-indigo-600 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors relative z-10">
                            اشحن الآن
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- NEW: Wallet Offers Section (Based on Image - Infinite Scroll with 5 items) ---
const WalletOffersSection = () => {
    const offers = [
        {
            id: 1,
            title: 'جلسة ليزر كاملة',
            category: 'تجميل',
            oldPrice: 1200,
            price: 599,
            discount: '50%',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b0570?q=80&w=300&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'فحص شامل للجسم',
            category: 'تحاليل',
            oldPrice: 800,
            price: 399,
            discount: '50%',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=300&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'فحص فيتامين د',
            category: 'مختبرات',
            oldPrice: 300,
            price: 99,
            discount: '67%',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 4,
            title: 'تنظيف أسنان',
            category: 'أسنان',
            oldPrice: 350,
            price: 149,
            discount: '57%',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 5,
            title: 'جلسة هيدرافيشل',
            category: 'بشرة',
            oldPrice: 600,
            price: 299,
            discount: '50%',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=300'
        }
    ];

    const carouselOffers = [...offers, ...offers];

    return (
        <div className="mb-8 px-4">
             <style>{`
                .animate-scroll-slow-wallet {
                    animation: scrollLinear 40s linear infinite;
                }
            `}</style>
            <div className="flex justify-between items-start mb-4">
                <div>
                   <div className="flex items-center gap-2 mb-0.5">
                     <Icons.ShoppingBag className="text-[#0C5A5D]" size={22} />
                     <h3 className="text-[#0C5A5D] font-black text-xl">عروض حصرية</h3>
                   </div>
                   <p className="text-[11px] text-gray-500 font-bold mr-1 leading-tight max-w-[200px]">
                       متجرنا المتكامل يجمع لك أرقى المراكز والمنتجات في مكان واحد.
                   </p>
                </div>
                <div className="flex flex-col items-end">
                    <button className="text-[#0C5A5D] text-xs font-bold hover:bg-[#0C5A5D]/5 px-2 py-1 rounded-lg transition-colors">عرض الكل</button>
                    <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-bold mt-1">خصومات تصل 80%</span>
                </div>
            </div>

            <div className="overflow-hidden relative -mx-4" dir="ltr">
                 <div className="flex animate-scroll-slow-wallet w-max">
                    {carouselOffers.map((offer, idx) => (
                        <div key={`${offer.id}-${idx}`} className="w-[180px] mx-2 flex-shrink-0" dir="rtl">
                            <div className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all duration-300 h-full">
                                <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
                                     <img 
                                        src={offer.image} 
                                        alt={offer.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                     />
                                     <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                         خصم {offer.discount}
                                     </div>
                                     <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                         <span className="text-[10px] font-bold text-gray-800 pt-0.5">{offer.rating}</span>
                                         <Icons.Star size={10} className="text-yellow-400 fill-yellow-400" />
                                     </div>
                                </div>

                                <div className="flex flex-col flex-1">
                                    <span className="text-[10px] text-gray-400 mb-1">{offer.category}</span>
                                    <h4 className="font-bold text-sm text-gray-800 leading-tight mb-2 h-10 line-clamp-2">{offer.title}</h4>
                                    
                                    <div className="mt-auto">
                                        <div className="flex flex-col items-end mb-3">
                                             <span className="text-[10px] text-gray-400 line-through">{offer.oldPrice} ريال</span>
                                             <span className="text-[#0C5A5D] font-black text-xl leading-none">{offer.price} <span className="text-[10px] font-medium">ريال</span></span>
                                        </div>
                                        
                                        <button className="w-full bg-[#0C5A5D] text-white text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#09484b] active:scale-95 transition-all shadow-lg shadow-[#0C5A5D]/20">
                                            أضف للسلة <Icons.ShoppingCart size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- NEW: Best Providers Section (Hospitals & Centers) ---
const BestProvidersSection = () => {
    const providers = [
        {
            id: 1,
            title: 'مستشفى المملكة',
            type: 'مستشفى',
            location: 'الرياض - حي الربيع',
            rating: 4.9,
            features: '24/7 طوارئ',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=300&auto=format&fit=crop'
        },
        {
            id: 2,
            title: 'عيادات جوفا',
            type: 'جلدية وتجميل',
            location: 'الرياض - التخصصي',
            rating: 4.8,
            features: 'أحدث الأجهزة',
            image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=300&auto=format&fit=crop'
        },
        {
            id: 3,
            title: 'مجمع التداوي الطبي',
            type: 'مجمع عام',
            location: 'الدمام',
            rating: 4.7,
            features: 'شامل التأمين',
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=300&auto=format&fit=crop'
        },
        {
            id: 4,
            title: 'مركز سما لطب الأسنان',
            type: 'أسنان',
            location: 'جدة - الروضة',
            rating: 4.9,
            features: 'طاقم استشاري',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=300&auto=format&fit=crop'
        },
        {
            id: 5,
            title: 'المختبر الإقليمي',
            type: 'مختبرات',
            location: 'القصيم',
            rating: 4.8,
            features: 'نتائج فورية',
            image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=300&auto=format&fit=crop'
        }
    ];

    const carouselProviders = [...providers, ...providers];

    return (
        <div className="mb-8 px-4">
             {/* Use same animation as Wallet Section */}
             <style>{`
                .animate-scroll-slow-wallet {
                    animation: scrollLinear 40s linear infinite;
                }
            `}</style>
            
            <div className="flex justify-between items-start mb-4">
                <div>
                   <div className="flex items-center gap-2 mb-0.5">
                     <Icons.Award className="text-[#0C5A5D]" size={22} />
                     <h3 className="text-[#0C5A5D] font-black text-xl">أفضل مقدمي الخدمات</h3>
                   </div>
                   <p className="text-[11px] text-gray-500 font-bold mr-1 leading-tight max-w-[240px]">
                       أفضل المستشفيات والمراكز الصحية الأعلى تقييماً والتي تقدم خدمات عالية الجودة.
                   </p>
                </div>
                <div className="flex flex-col items-end">
                    <button className="text-[#0C5A5D] text-xs font-bold hover:bg-[#0C5A5D]/5 px-2 py-1 rounded-lg transition-colors">عرض الكل</button>
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md font-bold mt-1">جودة مضمونة</span>
                </div>
            </div>

            <div className="overflow-hidden relative -mx-4" dir="ltr">
                 <div className="flex animate-scroll-slow-wallet w-max">
                    {carouselProviders.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="w-[180px] mx-2 flex-shrink-0" dir="rtl">
                            <div className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all duration-300 h-full">
                                <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
                                     <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                     />
                                     <div className="absolute top-2 right-2 bg-[#0C5A5D] text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                         {item.type}
                                     </div>
                                     <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                         <span className="text-[10px] font-bold text-gray-800 pt-0.5">{item.rating}</span>
                                         <Icons.Star size={10} className="text-yellow-400 fill-yellow-400" />
                                     </div>
                                </div>

                                <div className="flex flex-col flex-1">
                                    <span className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                                        <Icons.MapPin size={10} /> {item.location}
                                    </span>
                                    <h4 className="font-bold text-sm text-gray-800 leading-tight mb-2 h-10 line-clamp-2">{item.title}</h4>
                                    
                                    <div className="mt-auto">
                                        <div className="flex flex-col items-start mb-3">
                                             <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{item.features}</span>
                                        </div>
                                        
                                        <button className="w-full bg-white border border-[#0C5A5D] text-[#0C5A5D] text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0C5A5D] hover:text-white transition-all shadow-sm">
                                            تصفح الخدمات
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 3. Strongest Offers (Style & Animation from Most Ordered) ---
const OffersSection = () => {
    const offers = [
        { 
          title: 'تنظيف وتلميع الأسنان', 
          category: 'أسنان',
          oldPrice: 350, 
          price: 99, 
          discount: '70%', 
          rating: 4.8,
          img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=300',
        },
        { 
          title: 'جلسة ليزر للجسم كامل', 
          category: 'تجميل',
          oldPrice: 1200, 
          price: 299, 
          discount: '75%', 
          rating: 4.9,
          img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300',
        },
        { 
          title: 'فحص شامل + فيتامينات', 
          category: 'مختبرات',
          oldPrice: 800, 
          price: 199, 
          discount: '75%', 
          rating: 4.7,
          img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300',
        },
        { 
          title: 'بوتكس تجاعيد الوجه', 
          category: 'تجميل',
          oldPrice: 1500, 
          price: 699, 
          discount: '55%', 
          rating: 4.8,
          img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=300',
        },
        { 
          title: 'متابعة الحمل (زيارة)', 
          category: 'نساء',
          oldPrice: 400, 
          price: 150, 
          discount: '60%', 
          rating: 4.9,
          img: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=300',
        },
        { 
          title: 'تقويم أسنان (دفعة أولى)', 
          category: 'أسنان',
          oldPrice: 1500, 
          price: 500, 
          discount: '66%', 
          rating: 4.6,
          img: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=300',
        },
    ];

    const carouselOffers = [...offers, ...offers];

    return (
      <div className="mb-8 px-4">
        <style>{`
            .animate-scroll-slow {
                animation: scrollLinear 60s linear infinite;
            }
        `}</style>
        
        <SectionHeader title="أقوى العروض والخصومات" icon={<Icons.Tag size={18} />} subtitle="خصومات خيالية: توفير يصل إلى 80% في أرقى المراكز." />
        
        <div className="overflow-hidden relative -mx-4" dir="ltr">
             <div className="flex animate-scroll-slow w-max">
                 {carouselOffers.map((item, idx) => (
                     <div key={`${idx}-${item.title}`} className="w-[170px] mx-2 flex-shrink-0" dir="rtl">
                         <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col h-full relative group hover:shadow-md transition-shadow">
                            {/* Image Area */}
                            <div className="relative h-32 rounded-2xl overflow-hidden mb-3 bg-gray-50">
                                 <img 
                                    src={item.img} 
                                    alt={item.title} 
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                 />
                                 <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                     وفر {item.discount}
                                 </div>
                                 <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                     <span className="text-[9px] font-bold">{item.rating}</span>
                                     <Icons.Star size={8} className="text-yellow-400 fill-yellow-400" aria-hidden="true" />
                                 </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1">
                                <span className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                                    <Icons.Tag size={10} /> {item.category}
                                </span>
                                <h4 className="font-bold text-sm text-gray-800 leading-tight mb-2 line-clamp-2 h-10">{item.title}</h4>
                                
                                <div className="mt-auto border-t border-gray-50 pt-2">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-[10px] text-gray-400 line-through block">{item.oldPrice}</span>
                                            <span className="text-[#0C5A5D] font-extrabold text-lg">{item.price} <span className="text-[10px] font-normal">ريال</span></span>
                                        </div>
                                        <button className="bg-[#0C5A5D] text-white p-2 rounded-xl shadow-lg shadow-[#0C5A5D]/20 hover:bg-[#09484b] hover:scale-105 transition-all active:scale-95">
                                            <Icons.ShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    );
};

// --- 4. Most Ordered (Vertical Cards, Infinite Scroll) ---
const MostOrderedSection = () => {
    const items = [
        {
            title: 'جلسة ليزر كاملة',
            category: 'تجميل',
            price: 599,
            oldPrice: 1200,
            discount: '50%',
            rating: 4.9,
            img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=300&auto=format&fit=crop'
        },
        {
            title: 'فحص شامل للجسم',
            category: 'تحاليل',
            price: 399,
            oldPrice: 800,
            discount: '50%',
            rating: 4.8,
            img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=300&auto=format&fit=crop'
        },
        {
            title: 'عناية بالبشرة',
            category: 'بشرة',
            price: 199,
            oldPrice: 300,
            discount: '34%',
            rating: 4.6,
            img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=300&auto=format&fit=crop'
        },
        {
            title: 'تبييض أسنان زووم',
            category: 'أسنان',
            price: '499',
            oldPrice: '1000',
            discount: '50%',
            rating: 4.9,
            img: 'https://images.unsplash.com/photo-1588776814546-1ffcf4722e12?q=80&w=300&auto=format&fit=crop'
        },
        {
            title: 'فيتامينات وريدية',
            category: 'صحة',
            price: '299',
            oldPrice: '600',
            discount: '50%',
            rating: 4.8,
            img: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=300&auto=format&fit=crop'
        },
        {
            title: 'تمريض منزلي (يومي)',
            category: 'رعاية',
            price: '350',
            oldPrice: '500',
            discount: '30%',
            rating: 4.9,
            img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=300&auto=format&fit=crop'
        }
    ];

    const carouselItems = [...items, ...items];

    return (
        <div className="mb-8 px-4">
             <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2">
                     <Icons.TrendingUp className="text-orange-500 fill-orange-500" size={20} aria-hidden="true" />
                     <h3 className="text-[#0C5A5D] font-black text-xl">الأكثر مبيعاً في متجر أمان</h3>
                 </div>
             </div>

             <div className="overflow-hidden relative -mx-4" dir="ltr">
                 <div className="flex animate-scroll-slow w-max">
                     {carouselItems.map((item, idx) => (
                         <div key={`${idx}-${item.title}`} className="w-[160px] mx-2 flex-shrink-0" dir="rtl">
                             <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col h-full relative group">
                                <div className="relative h-28 rounded-2xl overflow-hidden mb-3 bg-gray-100">
                                     <img 
                                        src={item.img} 
                                        alt={item.title} 
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                     />
                                     <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                         خصم {item.discount}
                                     </div>
                                     <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                         <span className="text-[9px] font-bold">{item.rating}</span>
                                         <Icons.Star size={8} className="text-yellow-400 fill-yellow-400" aria-hidden="true" />
                                     </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-[10px] text-gray-400 mb-1">{item.category}</span>
                                    <h4 className="font-bold text-sm text-gray-800 leading-tight mb-2 line-clamp-2 h-10">{item.title}</h4>
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[#0C5A5D] font-extrabold text-lg">{item.price} <span className="text-[10px] font-normal">ريال</span></span>
                                            {item.oldPrice && <span className="text-[10px] text-gray-400 line-through">{item.oldPrice}</span>}
                                        </div>
                                        <button className="w-full bg-[#fff5eb] hover:bg-[#ffe0c2] text-orange-600 rounded-xl py-2 flex items-center justify-center transition-colors shadow-sm" aria-label={`أضف ${item.title} للسلة`}>
                                            <Icons.PlusCircle size={20} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
};

const ExtendedHomeContent: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // 5. Aman Packages (Refined as requested)
  const amanTiers = [
    { 
      name: 'الباقة الفردية', 
      price: '299', 
      period: 'عام', 
      target: 'الأكثر توفيراً', 
      isPopular: false,
      benefits: [
          'حجز موعد واستشارات طبية',
          'رعاية منزلية بخصومات',
          'رصيد كاش باك 1500 ريال',
          'تغطية شاملة طبياً وصحياً',
          'متجر أمان بخصم 50%'
      ],
      promo: null
    },
    { 
      name: 'الباقة المتميزة', 
      price: '399', 
      period: 'عام', 
      target: 'الأكثر مبيعاً', 
      isPopular: true,
      benefits: [
          '5 استشارات مجانية',
          'رصيد كاش باك 3000 ريال',
          'تنظيف أسنان (مرتين)',
          'خصم خاص للمختبرات',
          'توصيل مجاني للمنتجات'
      ],
      promo: 'خيار الخبراء'
    },
    { 
      name: 'الباقة الذهبية', 
      price: '799', 
      period: 'عام', 
      target: 'الأكثر طلباً', 
      isPopular: false,
      benefits: [
          'استشارات لا محدودة',
          'رصيد كاش باك 5000 ريال',
          'تنظيف أسنان وتبييض',
          'رعاية منزلية VIP',
          'مدير حساب خاص'
      ],
      promo: null
    },
    { 
      name: 'الباقة العائلية', 
      price: '999', 
      period: 'عام', 
      target: 'للعائلة (4 أفراد)', 
      isPopular: false,
      benefits: [
          'تغطية لـ 4 أفراد',
          'رصيد كاش باك 6000 ريال',
          'تنظيف أسنان لكل فرد',
          'زيارات منزلية مجانية',
          'خصم إضافي للمجموعات'
      ],
      promo: null
    }
  ];

  // 6. Calculators (Improved Icons/Images)
  const calculators = [
    { name: 'حاسبة الحمل', icon: <Icons.Baby size={28} />, color: 'bg-pink-100 text-pink-600', sub: 'موعد الولادة' },
    { name: 'كتلة الجسم', icon: <Icons.Activity size={28} />, color: 'bg-blue-100 text-blue-600', sub: 'الوزن المثالي' },
    { name: 'الماء اليومي', icon: <Icons.HeartPulse size={28} />, color: 'bg-cyan-100 text-cyan-600', sub: 'احتياجك' },
    { name: 'السعرات', icon: <Icons.Flame size={28} />, color: 'bg-orange-100 text-orange-600', sub: 'نظام غذائي' },
  ];

  return (
    <div className="pb-8 space-y-2 relative">
      
      {/* 1. Quick Services (Infinite Carousel) */}
      <QuickServicesSection />
      
      {/* 1.5 NEW Featured Promo Grid (Best Providers) */}
      <FeaturedPromoGrid />

      {/* 2. Aman Wallet (With Promo) */}
      <AmanWalletSection />
      
      {/* 2.5 Wallet Offers Section (New) */}
      <WalletOffersSection />

      {/* 2.6 Best Providers Section (NEW ADDITION) */}
      <BestProvidersSection />
      
      {/* 3. Offers Section (Vertical Cards, Infinite Scroll) */}
      <OffersSection />

      {/* 4. Most Ordered (Vertical Cards, Infinite Scroll) */}
      <MostOrderedSection />

      {/* 5. Ever Aman Packages (Marketing Highlights - Redesigned to match White Card Style) */}
      <div>
        <SectionHeader title="باقات أمان إيفر" linkText="اختر باقتك" icon={<Icons.ShieldCheck size={18} />} />
        <div className="px-4 grid grid-cols-1 gap-6">
           {amanTiers.map((tier, idx) => (
             <div key={idx} className="bg-white rounded-[2rem] shadow-lg overflow-hidden border border-gray-100 flex flex-col transform transition-transform duration-300 hover:scale-[1.01] relative group h-full">
               
               {/* Featured Badge (Starburst style similar to image) */}
               {tier.isPopular && (
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 z-20">
                         <div className="relative">
                             <Icons.Sun className="text-yellow-400 fill-yellow-400 w-16 h-16 animate-pulse" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <Icons.ThumbsUp className="text-white w-6 h-6 mb-1" strokeWidth={3} />
                             </div>
                         </div>
                    </div>
               )}

               {/* Header */}
               <div className={`pt-8 pb-4 px-6 text-center relative ${tier.isPopular ? 'mt-4' : ''}`}>
                   <h3 className="text-2xl font-black text-[#0C5A5D] mb-2 drop-shadow-sm">{tier.name}</h3>
                   <p className="text-sm font-bold text-gray-500 bg-gray-50 inline-block px-4 py-1 rounded-full border border-gray-100">{tier.target}</p>
               </div>
               
               {/* List */}
               <div className="px-8 pb-8 flex-1">
                   <ul className="space-y-4">
                       {tier.benefits.map((benefit, i) => (
                           <li key={i} className="flex items-center justify-between group/item">
                               <span className="text-sm font-bold text-gray-700 text-right group-hover/item:text-[#0C5A5D] transition-colors">{benefit}</span>
                               {/* Gold/Yellow Checkmark Circle */}
                               <div className="w-5 h-5 rounded-full border-[1.5px] border-[#d4af37] flex items-center justify-center shrink-0 bg-yellow-50">
                                    <Icons.Check className="w-3 h-3 text-[#d4af37]" strokeWidth={4} />
                               </div>
                           </li>
                       ))}
                   </ul>

                   {/* Extra Promo Icon (if exists) */}
                   {tier.promo && (
                        <div className="mt-6 flex justify-center">
                           <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-5 py-2 rounded-full border border-yellow-200 flex items-center gap-2 shadow-sm">
                               <Icons.Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
                               <span className="text-xs font-bold text-yellow-700">{tier.promo}</span>
                           </div>
                        </div>
                   )}
               </div>

               {/* Price Footer (Solid Color) */}
               <div className="bg-[#0C5A5D] py-5 px-6 flex items-center justify-center gap-2 relative overflow-hidden mt-auto group-hover:bg-[#0a484b] transition-colors">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 transform -skew-x-12"></div>
                   
                   <span className="text-3xl font-black text-white relative z-10">{tier.price}</span>
                   {tier.price !== 'تواصل' && tier.price !== 'مجاناً' && (
                       <div className="flex flex-col text-right text-cyan-100 relative z-10 leading-none">
                           <span className="text-[10px] font-bold">ريال</span>
                           <span className="text-[10px] opacity-80">/{tier.period}</span>
                       </div>
                   )}
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* 6. Health Calculators (Enhanced Visuals) */}
      <div className="mt-8">
        <SectionHeader title="حسابات الجسم الصحية" icon={<Icons.Calculator size={18} />} />
        <div className="px-4 grid grid-cols-2 gap-3">
          {calculators.map((calc, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveCalculator(calc.name)}
              className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:border-[#0C5A5D] hover:shadow-md transition-all active:scale-95 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 ${calc.color}`}>
                 {React.cloneElement(calc.icon as React.ReactElement<any>, {'aria-hidden': 'true'})}
              </div>
              <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-[#0C5A5D] transition-colors">{calc.name}</span>
                  <span className="text-[10px] text-gray-400">{calc.sub}</span>
              </div>
              <Icons.ChevronLeft size={16} className="mr-auto text-gray-300 group-hover:text-[#0C5A5D]" />
            </button>
          ))}
        </div>
      </div>

      {/* Simple Calculator Modal */}
      {activeCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="calc-title">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl relative overflow-hidden animate-scale-in border border-gray-100">
            <button 
              onClick={() => setActiveCalculator(null)}
              className="absolute top-4 left-4 text-gray-400 hover:text-red-500 bg-gray-100 rounded-full p-1.5 transition-colors"
              aria-label="إغلاق الحاسبة"
            >
              <Icons.X size={20} aria-hidden="true" />
            </button>
            
            <div className="flex flex-col items-center mb-6 mt-2">
              <div className="bg-cyan-100 p-3 rounded-full text-[#0C5A5D] mb-3 shadow-inner ring-4 ring-cyan-50">
                 <Icons.Calculator size={32} aria-hidden="true" />
              </div>
              <h3 id="calc-title" className="text-xl font-bold text-gray-900">{activeCalculator}</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                 <label htmlFor="input1" className="text-sm font-bold text-gray-900">القيمة الأولى</label>
                 <input 
                    id="input1"
                    type="number" 
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:border-[#0C5A5D] focus:ring-2 focus:ring-[#0C5A5D]/20 transition-all shadow-sm" 
                 />
              </div>
              
              <button 
                onClick={() => setActiveCalculator(null)}
                className="w-full bg-[#0C5A5D] text-white text-lg font-bold py-3.5 rounded-xl shadow-lg mt-6 hover:bg-[#0a484b] active:scale-95 transition-all"
              >
                احسب الآن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExtendedHomeContent;