import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';

interface HealthNetworkProps {
    onBack: () => void;
}

interface Facility {
    id: number;
    name: string;
    category: string;
    region: string;
    type: string;
    image: string;
    rating: number;
    reviews: number;
    distance: string;
    numericDistance: number;
    time: string;
    status: 'open' | 'closed';
    tags: string[];
    description?: string;
    services?: string[];
    phone?: string;
    mapPosition: { top: string; left: string };
}

interface Professional {
    id: number;
    name: string;
    specialty: string;
    subSpecialty?: string;
    facility: string;
    image: string;
    rating: number;
    reviews: number;
    experience: string;
    price: string;
    availability: string;
    tags: string[];
}

const HealthNetwork: React.FC<HealthNetworkProps> = ({ onBack }) => {
    const [viewMode, setViewMode] = useState<'facilities' | 'professionals' | 'appointments'>('facilities');
    const [activeFilter, setActiveFilter] = useState('all');
    const [myAppointments, setMyAppointments] = useState([
        { id: 1, professionalName: 'سارة خالد', facility: 'مركز لمسات للجمال', date: '2025-03-20', time: '02:00 م', status: 'confirmed', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=300' },
    ]);
    const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);
    const [selectedRegion, setSelectedRegion] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'distance' | 'rating'>('default');
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

    // Booking State
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        specialty: '',
        professional: null as Professional | null,
        date: '',
        time: '',
        paymentMethod: ''
    });

    // Regions List
    const regions = [
        { id: 'الكل', name: 'جميع المناطق' },
        { id: 'المنطقة الشرقية', name: 'المنطقة الشرقية' },
        { id: 'الرياض', name: 'الر33ياض' },
        { id: 'مكة المكرمة', name: 'مكة المكرمة' },
        { id: 'المدينة المنورة', name: 'المدينة المنورة' },
        { id: 'القصيم', name: 'القصيم' },
        { id: 'عسير', name: 'عسير' },
        { id: 'تبوك', name: 'تبوك' },
        { id: 'حائل', name: 'حائل' },
        { id: 'الحدود الشمالية', name: 'الحدود الشمالية' },
        { id: 'جازان', name: 'جازان' },
        { id: 'نجران', name: 'نجران' },
        { id: 'الباحة', name: 'الباحة' },
        { id: 'الجوف', name: 'الجوف' },
    ];

    // Category Filters (Health Facilities)
    const filters = [
        { id: 'all', label: 'الكل', icon: <Icons.Grid size={16} /> },
        { id: 'beauty_center', label: 'قسم التجميل والليزر', icon: <Icons.Sparkles size={16} /> },
        { id: 'hair_salon', label: 'صالونات', icon: <Icons.Scissors size={16} /> },
        { id: 'gym', label: 'نوادي رياضية', icon: <Icons.Dumbbell size={16} /> },
        { id: 'spa', label: 'سبا ومساج', icon: <Icons.Smile size={16} /> },
        { id: 'rehab', label: 'مراكز تأهيل', icon: <Icons.Activity size={16} /> },
        { id: 'cupping', label: 'حجامة', icon: <Icons.Flame size={16} /> },
    ];

    // Professional Specialties Filters
    const professionalFilters = [
        { id: 'all', label: 'الكل', icon: <Icons.Grid size={16} /> },
        { id: 'cosmetologist', label: 'قسم التجميل والليزر', icon: <Icons.Sparkles size={16} /> },
        { id: 'hair_stylist', label: 'تصفيف شعر', icon: <Icons.Scissors size={16} /> },
        { id: 'trainer', label: 'مدرب شخصي', icon: <Icons.Dumbbell size={16} /> },
        { id: 'therapist', label: 'علاج طبيعي', icon: <Icons.Activity size={16} /> },
        { id: 'nutritionist', label: 'تغذية', icon: <Icons.CheckCircle size={16} /> },
        { id: 'cupping_specialist', label: 'حجامة', icon: <Icons.Flame size={16} /> },
    ];

    // Mock Professionals Data
    const professionals: Professional[] = [
        {
            id: 201,
            name: 'سارة خالد',
            specialty: 'cosmetologist',
            subSpecialty: 'خبيرة مكياج وعناية بالبشرة',
            facility: 'مركز لمسات للجمال',
            image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=300',
            rating: 4.9,
            reviews: 150,
            experience: '5 سنوات',
            price: '200 ريال',
            availability: 'متاح اليوم',
            tags: ['مكياج', 'تنظيف بشرة']
        },
        {
            id: 202,
            name: 'أحمد علي',
            specialty: 'trainer',
            subSpecialty: 'مدرب لياقة بدنية وبناء أجسام',
            facility: 'نادي القوة',
            image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=300',
            rating: 4.8,
            reviews: 90,
            experience: '7 سنوات',
            price: '150 ريال',
            availability: 'متاح غداً',
            tags: ['تخسيس', 'بناء عضلات']
        },
        {
            id: 203,
            name: 'منى السيد',
            specialty: 'hair_stylist',
            subSpecialty: 'مصففة شعر محترفة',
            facility: 'صالون الأناقة',
            image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=300',
            rating: 4.7,
            reviews: 210,
            experience: '10 سنوات',
            price: '100 ريال',
            availability: 'متاح اليوم',
            tags: ['قص', 'صبغة']
        },
        {
            id: 204,
            name: 'د. يوسف حسن',
            specialty: 'therapist',
            subSpecialty: 'أخصائي علاج طبيعي وتأهيل',
            facility: 'مركز التعافي',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
            rating: 4.9,
            reviews: 120,
            experience: '12 سنة',
            price: '250 ريال',
            availability: 'متاح الأحد',
            tags: ['إصابات', 'مساج علاجي']
        },
        {
            id: 205,
            name: 'نورة العتيبي',
            specialty: 'nutritionist',
            subSpecialty: 'أخصائية تغذية علاجية',
            facility: 'عيادات الحياة الصحية',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
            rating: 4.8,
            reviews: 85,
            experience: '6 سنوات',
            price: '180 ريال',
            availability: 'متاح اليوم',
            tags: ['حمية', 'سكري']
        },
        {
            id: 206,
            name: 'عبدالله العمري',
            specialty: 'cupping_specialist',
            subSpecialty: 'أخصائي حجامة نبوية',
            facility: 'مركز الشفاء للحجامة',
            image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
            rating: 4.9,
            reviews: 300,
            experience: '15 سنة',
            price: '120 ريال',
            availability: 'متاح غداً',
            tags: ['حجامة رطبة', 'حجامة جافة']
        }
    ];

    // Mock Facilities Data
    const facilities: Facility[] = [
        {
            id: 1,
            name: 'مركز لمسات للجمال',
            category: 'beauty_center',
            region: 'الرياض',
            type: 'مركز تجميل نسائي',
            image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 450,
            distance: '2.0 كم',
            numericDistance: 2.0,
            time: '5 دقائق',
            status: 'open',
            tags: ['مكياج', 'شعر', 'بشرة'],
            description: 'مركز متكامل للعناية بجمال المرأة، يقدم خدمات المكياج، تصفيف الشعر، والعناية بالبشرة بأحدث التقنيات.',
            services: ['مكياج سهرة', 'صبغات شعر', 'تنظيف بشرة عميق', 'بديكير ومنيكير'],
            phone: '0112223333',
            mapPosition: { top: '30%', left: '40%' }
        },
        {
            id: 2,
            name: 'نادي القوة',
            category: 'gym',
            region: 'مكة المكرمة',
            type: 'نادي رياضي رجالي',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 320,
            distance: '3.5 كم',
            numericDistance: 3.5,
            time: '10 دقائق',
            status: 'open',
            tags: ['حديد', 'لياقة', 'مسبح'],
            description: 'نادي رياضي مجهز بأحدث الأجهزة الرياضية، مع مدربين محترفين ومسبح أولمبي.',
            services: ['اشتراك شهري', 'تدريب شخصي', 'سباحة', 'ساونا'],
            mapPosition: { top: '45%', left: '60%' }
        },
        {
            id: 3,
            name: 'صالون الأناقة',
            category: 'hair_salon',
            region: 'المنطقة الشرقية',
            type: 'صالون نسائي',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
            rating: 4.6,
            reviews: 210,
            distance: '1.5 كم',
            numericDistance: 1.5,
            time: '4 دقائق',
            status: 'open',
            tags: ['قص', 'صبغة', 'تسريحات'],
            description: 'صالون يقدم أحدث قصات الشعر والصبغات العالمية بأيدي خبيرات.',
            mapPosition: { top: '55%', left: '30%' }
        },
        {
            id: 4,
            name: 'مركز التعافي',
            category: 'rehab',
            region: 'الرياض',
            type: 'مركز علاج طبيعي',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 150,
            distance: '5.0 كم',
            numericDistance: 5.0,
            time: '15 دقيقة',
            status: 'open',
            tags: ['تأهيل', 'علاج يدوي'],
            description: 'مركز متخصص في العلاج الطبيعي والتأهيل الحركي بعد الإصابات والعمليات.',
            mapPosition: { top: '25%', left: '70%' }
        },
        {
            id: 5,
            name: 'عيادات الحياة الصحية',
            category: 'beauty_center', // Using beauty_center as generic for nutrition for now or add nutrition center category
            region: 'مكة المكرمة',
            type: 'مركز تغذية ولياقة',
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 180,
            distance: '4.0 كم',
            numericDistance: 4.0,
            time: '12 دقيقة',
            status: 'open',
            tags: ['تغذية', 'تنحيف'],
            description: 'عيادات متخصصة في التغذية العلاجية وبرامج إنقاص الوزن.',
            mapPosition: { top: '60%', left: '50%' }
        },
        {
            id: 6,
            name: 'مركز الشفاء للحجامة',
            category: 'cupping',
            region: 'مكة المكرمة',
            type: 'مركز حجامة',
            image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 500,
            distance: '2.5 كم',
            numericDistance: 2.5,
            time: '8 دقائق',
            status: 'open',
            tags: ['حجامة وقائية', 'حجامة علاجية'],
            description: 'مركز مرخص للحجامة النبوية بأدوات معقمة وطاقم طبي متخصص.',
            mapPosition: { top: '40%', left: '20%' }
        },
        {
            id: 7,
            name: 'سبا الراحة',
            category: 'spa',
            region: 'المنطقة الشرقية',
            type: 'مركز سبا ومساج',
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 250,
            distance: '3.0 كم',
            numericDistance: 3.0,
            time: '9 دقائق',
            status: 'open',
            tags: ['مساج', 'جاكوزي', 'حمام مغربي'],
            description: 'وجهتك المثالية للاسترخاء والتخلص من ضغوط الحياة مع خدمات المساج والسبا.',
            mapPosition: { top: '50%', left: '15%' }
        }
    ];

    // Filtering & Sorting Logic
    const filteredFacilities = useMemo(() => {
        let result = [];

        if (viewMode === 'professionals') {
            const matchingProfessionals = professionals.filter(prof => {
                const matchCategory = activeFilter === 'all' || prof.specialty === activeFilter;
                const matchSearch = searchQuery === '' ||
                    prof.name.includes(searchQuery) ||
                    prof.subSpecialty?.includes(searchQuery) ||
                    prof.facility.includes(searchQuery);
                return matchCategory && matchSearch;
            });
            const facilityNames = new Set(matchingProfessionals.map(p => p.facility));
            result = facilities.filter(f => facilityNames.has(f.name));
        } else {
            result = facilities.filter(facility => {
                const matchRegion = selectedRegion === 'الكل' || facility.region === selectedRegion;
                const matchCategory = activeFilter === 'all' || facility.category === activeFilter;
                const matchSearch = searchQuery === '' ||
                    facility.name.includes(searchQuery) ||
                    facility.type.includes(searchQuery);
                return matchRegion && matchCategory && matchSearch;
            });
        }

        if (sortBy === 'distance') {
            result.sort((a, b) => a.numericDistance - b.numericDistance);
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [facilities, selectedRegion, activeFilter, searchQuery, sortBy, viewMode, professionals]);

    const filteredProfessionals = useMemo(() => {
        let result = professionals.filter(prof => {
            const matchCategory = activeFilter === 'all' || prof.specialty === activeFilter;
            const matchSearch = searchQuery === '' ||
                prof.name.includes(searchQuery) ||
                prof.subSpecialty?.includes(searchQuery) ||
                prof.facility.includes(searchQuery);
            return matchCategory && matchSearch;
        });

        if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [professionals, activeFilter, searchQuery, sortBy]);

    const handleResetFilters = () => {
        setActiveFilter('all');
        setSelectedRegion('الكل');
        setSearchQuery('');
        setSortBy('distance');
    };

    // --- BOOKING WIZARD LOGIC ---
    const handleStartBooking = () => {
        setIsBookingOpen(true);
        setBookingStep(1);
        setBookingData({
            specialty: '',
            professional: null,
            date: '',
            time: '',
            paymentMethod: ''
        });
    };

    const handleSelectSpecialty = (spec: string) => {
        setBookingData({ ...bookingData, specialty: spec });
        setBookingStep(2);
    };

    const handleSelectProfessional = (prof: Professional) => {
        setBookingData({ ...bookingData, professional: prof });
        setBookingStep(3);
    };

    const handleSelectDateTime = (date: string, time: string) => {
        setBookingData({ ...bookingData, date, time });
        setBookingStep(4);
    };

    const handleSelectPayment = (method: string) => {
        setBookingData({ ...bookingData, paymentMethod: method });
        setBookingStep(5);
    };

    const handleConfirmBooking = () => {
        setBookingStep(6);
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'center': return 'الدفع في المركز';
            case 'points': return 'محفظة نقاط أمان';
            case 'aman_card': return 'بطاقة أمان إيفر';
            case 'digital': return 'دفع إلكتروني';
            case 'installments': return 'تقسيط (Tabby/Tamara)';
            default: return method;
        }
    };

    const renderBookingWizard = () => {
        if (!isBookingOpen || !selectedFacility) return null;

        const availableSpecialties = Array.from(new Set(
            professionals.filter(p => p.facility === selectedFacility.name).map(p => p.specialty)
        ));
        const displaySpecialties = availableSpecialties.length > 0 ? availableSpecialties : ['cosmetologist', 'hair_stylist', 'trainer', 'therapist'];

        const availableProfessionals = professionals.filter(p => p.facility === selectedFacility.name && p.specialty === bookingData.specialty);

        const dates = Array.from({ length: 5 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i + 1);
            return d;
        });

        const times = ['09:00 ص', '10:00 ص', '11:00 ص', '04:00 م', '05:00 م', '06:00 م', '07:00 م', '08:00 م'];

        return (
            <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
                <div className="bg-white w-full max-w-md mx-auto h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-[#0C5A5D] p-4 text-white flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-lg">حجز موعد جديد</h3>
                        <button onClick={() => setIsBookingOpen(false)} className="bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition">
                            <Icons.X size={20} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-gray-100 h-1.5 w-full flex" dir="ltr">
                        <div className={`h-full bg-[#0C5A5D] transition-all duration-500 ease-out`} style={{ width: `${(bookingStep / 6) * 100}%` }}></div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

                        {/* Step 1: Specialty */}
                        {bookingStep === 1 && (
                            <div className="animate-fade-in-up">
                                <h4 className="text-xl font-black text-gray-800 mb-2">اختر الخدمة</h4>
                                <p className="text-sm text-gray-500 mb-6">الخدمات المتاحة في {selectedFacility.name}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {displaySpecialties.map((spec, idx) => {
                                        const filter = professionalFilters.find(f => f.id === spec);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelectSpecialty(spec)}
                                                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex flex-col items-center gap-3 group"
                                            >
                                                <div className="bg-gray-50 p-3 rounded-full text-gray-600 group-hover:bg-[#0C5A5D] group-hover:text-white transition-colors">
                                                    {filter?.icon || <Icons.Activity size={24} />}
                                                </div>
                                                <span className="font-bold text-gray-800">{filter?.label || spec}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Professional */}
                        {bookingStep === 2 && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setBookingStep(1)} className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1 hover:text-[#0C5A5D]">
                                    <Icons.ArrowRight size={14} /> عودة للخدمات
                                </button>
                                <h4 className="text-xl font-black text-gray-800 mb-2">اختر الأخصائي</h4>
                                <p className="text-sm text-gray-500 mb-6">الأخصائيين المتاحين في هذا القسم</p>

                                <div className="space-y-3">
                                    {availableProfessionals.length > 0 ? availableProfessionals.map((prof) => (
                                        <button
                                            key={prof.id}
                                            onClick={() => handleSelectProfessional(prof)}
                                            className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 text-right group"
                                        >
                                            <img src={prof.image} alt={prof.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-[#0C5A5D] transition-colors" />
                                            <div className="flex-1">
                                                <h5 className="font-bold text-gray-900 text-lg mb-1">{prof.name}</h5>
                                                <p className="text-xs text-gray-500 mb-2">{prof.subSpecialty}</p>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="flex items-center gap-1 text-yellow-500 font-bold"><Icons.Star size={12} className="fill-current" /> {prof.rating}</span>
                                                    <span className="text-[#0C5A5D] font-bold">{prof.price}</span>
                                                </div>
                                            </div>
                                            <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D]" />
                                        </button>
                                    )) : (
                                        <div className="text-center py-10 text-gray-400">
                                            <Icons.UserX size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>لا يوجد أخصائيين متاحين حالياً في هذا القسم</p>
                                            <button onClick={() => setBookingStep(1)} className="mt-4 text-[#0C5A5D] font-bold text-sm underline">اختر قسم آخر</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Date & Time */}
                        {bookingStep === 3 && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setBookingStep(2)} className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1 hover:text-[#0C5A5D]">
                                    <Icons.ArrowRight size={14} /> عودة للأخصائيين
                                </button>
                                <h4 className="text-xl font-black text-gray-800 mb-2">تاريخ ووقت الموعد</h4>
                                <p className="text-sm text-gray-500 mb-6">المواعيد المتاحة لـ {bookingData.professional?.name}</p>

                                {/* Date Selection */}
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-700 mb-3">الأيام المتاحة</label>
                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                        {dates.map((date, idx) => {
                                            const isSelected = bookingData.date === date.toDateString();
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setBookingData({ ...bookingData, date: date.toDateString(), time: '' })}
                                                    className={`min-w-[80px] p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${isSelected
                                                        ? 'bg-[#0C5A5D] text-white border-[#0C5A5D] shadow-md'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#0C5A5D]'
                                                        }`}
                                                >
                                                    <span className="text-xs opacity-80">{date.toLocaleDateString('ar-EG', { weekday: 'short' })}</span>
                                                    <span className="text-lg font-black">{date.getDate()}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                {bookingData.date && (
                                    <div className="animate-fade-in">
                                        <label className="block text-xs font-bold text-gray-700 mb-3">الأوقات المتاحة</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {times.map((time, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelectDateTime(bookingData.date, time)}
                                                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${bookingData.time === time
                                                        ? 'bg-[#0C5A5D] text-white border-[#0C5A5D] shadow-md'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#0C5A5D]'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Payment */}
                        {bookingStep === 4 && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setBookingStep(3)} className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1 hover:text-[#0C5A5D]">
                                    <Icons.ArrowRight size={14} /> عودة للمواعيد
                                </button>
                                <h4 className="text-xl font-black text-gray-800 mb-2">طريقة الدفع</h4>
                                <p className="text-sm text-gray-500 mb-6">اختر طريقة الدفع المناسبة لك</p>

                                <div className="space-y-3">
                                    {[
                                        { id: 'center', label: 'الدفع في المركز', icon: <Icons.Building2 size={20} /> },
                                        { id: 'points', label: 'محفظة نقاط أمان', icon: <Icons.Wallet size={20} /> },
                                        { id: 'aman_card', label: 'بطاقة أمان إيفر', icon: <Icons.CreditCard size={20} /> },
                                        { id: 'digital', label: 'دفع إلكتروني (Mada/Visa)', icon: <Icons.CreditCard size={20} /> },
                                        { id: 'installments', label: 'تقسيط (Tabby/Tamara)', icon: <Icons.Calendar size={20} /> },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => handleSelectPayment(method.id)}
                                            className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 group"
                                        >
                                            <div className="bg-gray-50 p-3 rounded-xl text-gray-600 group-hover:bg-[#0C5A5D] group-hover:text-white transition-colors">
                                                {method.icon}
                                            </div>
                                            <span className="font-bold text-gray-800">{method.label}</span>
                                            <Icons.ChevronLeft className="mr-auto text-gray-300 group-hover:text-[#0C5A5D]" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Confirmation */}
                        {bookingStep === 5 && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setBookingStep(4)} className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1 hover:text-[#0C5A5D]">
                                    <Icons.ArrowRight size={14} /> عودة للدفع
                                </button>
                                <h4 className="text-xl font-black text-gray-800 mb-2">تأكيد الحجز</h4>
                                <p className="text-sm text-gray-500 mb-6">يرجى مراجعة تفاصيل الحجز قبل التأكيد</p>

                                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4 mb-6">
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 text-sm">الخدمة</span>
                                        <span className="font-bold text-gray-800">{professionalFilters.find(f => f.id === bookingData.specialty)?.label}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 text-sm">الأخصائي</span>
                                        <span className="font-bold text-gray-800">{bookingData.professional?.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 text-sm">التاريخ والوقت</span>
                                        <span className="font-bold text-gray-800" dir="ltr">{bookingData.time} - {bookingData.date}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 text-sm">طريقة الدفع</span>
                                        <span className="font-bold text-gray-800">{getPaymentMethodLabel(bookingData.paymentMethod)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-gray-800 font-bold">الإجمالي</span>
                                        <span className="font-black text-[#0C5A5D] text-lg">{bookingData.professional?.price}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmBooking}
                                    className="w-full bg-[#0C5A5D] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#0C5A5D]/20 hover:bg-[#0a484b] transition-all active:scale-95"
                                >
                                    تأكيد الحجز
                                </button>
                            </div>
                        )}

                        {/* Step 6: Success */}
                        {bookingStep === 6 && (
                            <div className="flex flex-col items-center justify-center h-full text-center animate-scale-in">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <Icons.CheckCircle size={48} className="text-green-600" />
                                </div>
                                <h4 className="text-2xl font-black text-gray-800 mb-2">تم الحجز بنجاح!</h4>
                                <p className="text-gray-500 mb-8 max-w-xs mx-auto">تم تأكيد موعدك مع {bookingData.professional?.name} في {selectedFacility.name}.</p>

                                <div className="bg-gray-50 p-4 rounded-2xl w-full mb-8 border border-gray-100">
                                    <p className="text-sm font-bold text-gray-800 mb-1">رقم الحجز</p>
                                    <p className="text-2xl font-mono font-black text-[#0C5A5D] tracking-widest">#RES-{Math.floor(Math.random() * 10000)}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsBookingOpen(false);
                                        setSelectedFacility(null);
                                        setViewMode('facilities');
                                    }}
                                    className="w-full bg-[#0C5A5D] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#0a484b] transition-all"
                                >
                                    العودة للرئيسية
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="bg-[#0C5A5D] pb-8 pt-6 px-4 rounded-b-[2.5rem] shadow-lg sticky top-0 z-40">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={onBack} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition backdrop-blur-sm">
                        <Icons.ArrowRight size={24} />
                    </button>
                    <h2 className="text-white font-black text-xl">الشبكة الصحية</h2>
                    <div className="w-10"></div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="ابحث عن مركز، نادي، أو أخصائي..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all font-bold"
                    />
                    <Icons.Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                </div>

                {/* View Mode Tabs */}
                <div className="flex bg-[#09484b] p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('facilities')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'facilities' ? 'bg-white text-[#0C5A5D] shadow-sm' : 'text-white/60 hover:text-white'}`}
                    >
                        المنشآت
                    </button>
                    <button
                        onClick={() => setViewMode('professionals')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'professionals' ? 'bg-white text-[#0C5A5D] shadow-sm' : 'text-white/60 hover:text-white'}`}
                    >
                        الأخصائيين
                    </button>
                    <button
                        onClick={() => setViewMode('appointments')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'appointments' ? 'bg-white text-[#0C5A5D] shadow-sm' : 'text-white/60 hover:text-white'}`}
                    >
                        مواعيدي
                    </button>
                </div>
            </div>

            <div className="px-4 py-6 pb-24">

                {/* FILTERS SECTION */}
                {viewMode !== 'appointments' && (
                    <div className="mb-6 space-y-4">
                        {/* Regions */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {regions.map(region => (
                                <button
                                    key={region.id}
                                    onClick={() => setSelectedRegion(region.id)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedRegion === region.id
                                        ? 'bg-[#0C5A5D] text-white border-[#0C5A5D]'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#0C5A5D]'
                                        }`}
                                >
                                    {region.name}
                                </button>
                            ))}
                        </div>

                        {/* Categories/Specialties */}
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {(viewMode === 'facilities' ? filters : professionalFilters).map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl border transition-all ${activeFilter === filter.id
                                        ? 'bg-[#0C5A5D] text-white border-[#0C5A5D] shadow-md transform scale-105'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#0C5A5D]'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-50'}`}>
                                        {filter.icon}
                                    </div>
                                    <span className="text-[10px] font-bold">{filter.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Sort & Results Count */}
                        <div className="flex justify-between items-center px-1">
                            <p className="text-xs font-bold text-gray-500">
                                تم العثور على {viewMode === 'facilities' ? filteredFacilities.length : filteredProfessionals.length} نتيجة
                            </p>
                            <div className="flex gap-2">
                                <button onClick={() => setSortBy('distance')} className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border ${sortBy === 'distance' ? 'bg-[#0C5A5D] text-white border-[#0C5A5D]' : 'bg-white text-gray-500 border-gray-200'}`}>الأقرب</button>
                                <button onClick={() => setSortBy('rating')} className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border ${sortBy === 'rating' ? 'bg-[#0C5A5D] text-white border-[#0C5A5D]' : 'bg-white text-gray-500 border-gray-200'}`}>الأعلى تقييماً</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT LIST */}
                <div className="space-y-4">

                    {/* FACILITIES LIST */}
                    {viewMode === 'facilities' && filteredFacilities.map(facility => (
                        <div
                            key={facility.id}
                            onClick={() => setSelectedFacility(facility)}
                            className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                                <img src={facility.image} alt={facility.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${facility.status === 'open' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {facility.status === 'open' ? 'مفتوح' : 'مغلق'}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">{facility.name}</h3>
                                        <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-md border border-yellow-100">
                                            <Icons.Star size={10} className="fill-yellow-500 text-yellow-500" />
                                            {facility.rating}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mb-2">{facility.type} • {facility.region}</p>
                                    <div className="flex gap-1 flex-wrap">
                                        {facility.tags.map((tag, i) => (
                                            <span key={i} className="text-[9px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                        <span className="flex items-center gap-1"><Icons.MapPin size={12} /> {facility.distance}</span>
                                        <span className="flex items-center gap-1"><Icons.Clock size={12} /> {facility.time}</span>
                                    </div>
                                    <button className="text-[#0C5A5D] text-[10px] font-bold flex items-center gap-1 hover:underline">
                                        التفاصيل <Icons.ChevronLeft size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* PROFESSIONALS LIST */}
                    {viewMode === 'professionals' && filteredProfessionals.map(prof => (
                        <div key={prof.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex gap-4 group hover:shadow-md transition-all">
                            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-gray-50 group-hover:border-[#0C5A5D] transition-colors">
                                <img src={prof.image} alt={prof.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{prof.name}</h3>
                                        <p className="text-[10px] text-[#0C5A5D] font-bold">{prof.subSpecialty}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-md border border-yellow-100">
                                        <Icons.Star size={10} className="fill-yellow-500 text-yellow-500" />
                                        {prof.rating}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mb-2 flex items-center gap-1">
                                    <Icons.Building2 size={10} /> {prof.facility}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[#0C5A5D] font-black text-sm">{prof.price}</span>
                                    <button
                                        onClick={() => {
                                            const facility = facilities.find(f => f.name === prof.facility);
                                            if (facility) {
                                                setSelectedFacility(facility);
                                                setBookingData(prev => ({ ...prev, professional: prof, specialty: prof.specialty }));
                                                setIsBookingOpen(true);
                                                setBookingStep(3); // Skip to Date/Time
                                            }
                                        }}
                                        className="bg-[#0C5A5D] text-white px-4 py-1.5 rounded-xl text-[10px] font-bold shadow-sm hover:bg-[#0a484b] transition-colors"
                                    >
                                        حجز موعد
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* APPOINTMENTS LIST */}
                    {viewMode === 'appointments' && (
                        <div className="space-y-4">
                            {myAppointments.length > 0 ? myAppointments.map(app => (
                                <div key={app.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-[#0C5A5D]"></div>
                                    <div className="flex gap-4">
                                        <img src={app.image} alt={app.professionalName} className="w-16 h-16 rounded-2xl object-cover" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-800 text-sm">{app.professionalName}</h3>
                                                <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">مؤكد</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mb-2">{app.facility}</p>
                                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-700 bg-gray-50 p-2 rounded-lg w-max">
                                                <span className="flex items-center gap-1"><Icons.Calendar size={12} className="text-[#0C5A5D]" /> {app.date}</span>
                                                <span className="w-px h-3 bg-gray-300"></span>
                                                <span className="flex items-center gap-1"><Icons.Clock size={12} className="text-[#0C5A5D]" /> {app.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 bg-[#0C5A5D] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#0a484b] transition-colors">
                                            تفاصيل الموعد
                                        </button>
                                        <button
                                            onClick={() => setAppointmentToCancel(app.id)}
                                            className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <Icons.Calendar size={32} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1">لا توجد مواعيد قادمة</h3>
                                    <p className="text-xs text-gray-500 mb-4">احجز موعدك الأول الآن واستمتع بخدماتنا</p>
                                    <button onClick={() => setViewMode('facilities')} className="text-[#0C5A5D] font-bold text-sm underline">تصفح المراكز</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* FACILITY DETAILS MODAL */}
            {selectedFacility && !isBookingOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
                    <div className="bg-white w-full max-w-md mx-auto h-[90vh] sm:h-[85vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">

                        {/* Image Header */}
                        <div className="h-64 relative shrink-0">
                            <img src={selectedFacility.image} alt={selectedFacility.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <button
                                onClick={() => setSelectedFacility(null)}
                                className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/50 transition"
                            >
                                <Icons.X size={20} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="bg-[#0C5A5D] text-white text-[10px] font-bold px-2 py-1 rounded-lg mb-2 inline-block shadow-sm">
                                            {selectedFacility.type}
                                        </span>
                                        <h2 className="text-2xl font-black mb-1">{selectedFacility.name}</h2>
                                        <p className="text-sm text-gray-200 flex items-center gap-1">
                                            <Icons.MapPin size={14} /> {selectedFacility.region}
                                        </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-center min-w-[60px]">
                                        <span className="block text-xl font-black text-yellow-400">{selectedFacility.rating}</span>
                                        <span className="text-[9px] text-gray-200">تقييم</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {/* Status & Timing */}
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className={`block text-xs font-bold mb-1 ${selectedFacility.status === 'open' ? 'text-green-600' : 'text-red-500'}`}>
                                        {selectedFacility.status === 'open' ? 'مفتوح الآن' : 'مغلق'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">الحالة</span>
                                </div>
                                <div className="flex-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-xs font-bold text-gray-800 mb-1">{selectedFacility.distance}</span>
                                    <span className="text-[10px] text-gray-400">المسافة</span>
                                </div>
                                <div className="flex-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-xs font-bold text-gray-800 mb-1">{selectedFacility.time}</span>
                                    <span className="text-[10px] text-gray-400">الوقت</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-2">عن المركز</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{selectedFacility.description}</p>
                            </div>

                            {/* Services */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-800 mb-3">الخدمات المتوفرة</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFacility.services?.map((service, i) => (
                                        <span key={i} className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Map Preview (Static) */}
                            <div className="h-40 bg-gray-200 rounded-2xl mb-6 relative overflow-hidden border border-gray-300 group cursor-pointer">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/46.6753,24.7136,13,0/600x300?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-gray-800 shadow-sm flex items-center gap-2">
                                        <Icons.MapPin size={14} className="text-[#0C5A5D]" /> عرض الموقع على الخريطة
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
                            <button className="flex-1 bg-gray-100 text-gray-800 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                <Icons.Phone size={18} /> اتصال
                            </button>
                            <button
                                onClick={handleStartBooking}
                                className="flex-[2] bg-[#0C5A5D] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#0a484b] transition-colors shadow-lg shadow-[#0C5A5D]/20 flex items-center justify-center gap-2"
                            >
                                <Icons.Calendar size={18} /> حجز موعد
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BOOKING WIZARD */}
            {renderBookingWizard()}

            {/* CANCELLATION CONFIRMATION MODAL */}
            {appointmentToCancel && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-scale-in">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 border border-red-100">
                            <Icons.AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-center text-gray-800 mb-2">هل أنت متأكد؟</h3>
                        <p className="text-center text-gray-500 text-sm mb-6">هل تريد حقاً إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setAppointmentToCancel(null)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                تراجع
                            </button>
                            <button
                                onClick={() => {
                                    setMyAppointments(prev => prev.filter(a => a.id !== appointmentToCancel));
                                    setAppointmentToCancel(null);
                                }}
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                                نعم، إلغاء الموعد
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HealthNetwork;
