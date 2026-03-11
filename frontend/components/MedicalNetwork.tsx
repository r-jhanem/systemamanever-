import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';

interface MedicalNetworkProps {
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

interface Doctor {
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

const MedicalNetwork: React.FC<MedicalNetworkProps> = ({ onBack }) => {
    const [viewMode, setViewMode] = useState<'facilities' | 'doctors' | 'appointments'>('facilities');
    const [activeFilter, setActiveFilter] = useState<string[]>(['all']);
    const [myAppointments, setMyAppointments] = useState([
        { id: 1, doctorName: 'د. محمد الغامدي', facility: 'مستشفى دلة', date: '2025-03-15', time: '10:00 ص', status: 'confirmed', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300' },
        { id: 2, doctorName: 'د. سارة الأحمد', facility: 'عيادات جوفا', date: '2025-03-18', time: '04:30 م', status: 'confirmed', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' }
    ]);
    const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);
    const [selectedRegion, setSelectedRegion] = useState('الكل');
    const [selectedCountry, setSelectedCountry] = useState('SA');
    const [isRegionSelectionOpen, setIsRegionSelectionOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'distance' | 'rating' | 'newest'>('default');
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('الكل');
    const [isCitySelectionOpen, setIsCitySelectionOpen] = useState(false);
    const [citySearchQuery, setCitySearchQuery] = useState('');

    // Booking State
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingStep, setBookingStep] = useState(1); // 1: Specialty, 2: Doctor, 3: DateTime, 4: Payment, 5: Confirmation, 6: Success
    const [bookingData, setBookingData] = useState({
        specialty: '',
        doctor: null as Doctor | null,
        date: '',
        time: '',
        paymentMethod: ''
    });

    // Countries List
    const countries = [
        { id: 'SA', name: 'المملكة العربية السعودية', icon: '🇸🇦' },
        { id: 'TR', name: 'تركيا', icon: '🇹🇷' },
        { id: 'JO', name: 'الأردن', icon: '🇯🇴' },
        { id: 'EG', name: 'مصر', icon: '🇪🇬' },
        { id: 'AE', name: 'الإمارات', icon: '🇦🇪' },
    ];

    // Regions List with Images
    const regions = [
        { id: 'الكل', name: 'جميع المناطق', country: 'SA', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop' },
        { id: 'المنطقة الوسطى', name: 'المنطقة الوسطى', country: 'SA', image: 'https://takafulalarabia.com/resources/Gallery/141603029867_servers.png' },
        { id: 'المنطقة الغربية', name: 'المنطقة الغربية', country: 'SA', image: 'https://takafulalarabia.com/resources/Gallery/31603029878_servers.png' },
        { id: 'المنطقة الشرقية', name: 'المنطقة الشرقية', country: 'SA', image: 'https://takafulalarabia.com/resources/Gallery/461603029890_servers.png' },
        { id: 'المنطقة الجنوبية', name: 'المنطقة الجنوبية', country: 'SA', image: 'https://takafulalarabia.com/resources/Gallery/971603029897_servers.png' },
        { id: 'المنطقة الشمالية', name: 'المنطقة الشمالية', country: 'SA', image: 'https://takafulalarabia.com/resources/Gallery/651603029910_servers.png' },
        { id: 'إسطنبول', name: 'إسطنبول', country: 'TR', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop' },
        { id: 'أنقرة', name: 'أنقرة', country: 'TR', image: 'https://images.unsplash.com/photo-1542612140-1658b4317181?q=80&w=2069&auto=format&fit=crop' },
        { id: 'عمان', name: 'عمان', country: 'JO', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=2070&auto=format&fit=crop' },
    ];

    // Cities Data
    const citiesByRegion: { [key: string]: string[] } = {
        'المنطقة الوسطى': ['الرياض', 'الخرج', 'الدرعية', 'المجمعة', 'الدوادمي', 'بريدة', 'عنيزة', 'الرس'],
        'المنطقة الغربية': ['مكة المكرمة', 'جدة', 'الطائف', 'المدينة المنورة', 'ينبع', 'العلا'],
        'المنطقة الشرقية': ['الدمام', 'الخبر', 'الجبيل', 'الأحساء', 'القطيف', 'حفر الباطن', 'الخفجي', 'راس تنورة'],
        'المنطقة الجنوبية': ['أبها', 'خميس مشيط', 'بيشة', 'جازان', 'نجران', 'الباحة'],
        'المنطقة الشمالية': ['تبوك', 'أملج', 'ضبا', 'حائل', 'الحدود الشمالية', 'الجوف'],
    };

    // Category Filters
    const filters = [
        { id: 'all', label: 'الكل', icon: <Icons.Grid size={16} /> },
        { id: 'hospitals', label: 'مستشفيات', icon: <Icons.Building2 size={16} /> },
        { id: 'centers', label: 'مراكز طبية', icon: <Icons.Activity size={16} /> },
        { id: 'dental', label: 'أسنان', icon: <Icons.Smile size={16} /> },
        { id: 'physio', label: 'العلاج الطبيعي والتأهيل', icon: <Icons.HeartPulse size={16} /> },
        { id: 'radiology', label: 'قسم الأشعة', icon: <Icons.Activity size={16} /> },
        { id: 'labs', label: 'قسم المختبرات', icon: <Icons.FlaskConical size={16} /> },
        { id: 'pharmacy', label: 'صيدليات', icon: <Icons.Pill size={16} /> },
    ];

    // Doctor Specialties Filters
    const doctorFilters = [
        { id: 'all', label: 'الكل', icon: <Icons.Grid size={16} /> },
        { id: 'cardio', label: 'قلب وأوعية', icon: <Icons.HeartPulse size={16} /> },
        { id: 'dental', label: 'أسنان', icon: <Icons.Smile size={16} /> },
        { id: 'pediatric', label: 'أطفال', icon: <Icons.User size={16} /> },
        { id: 'internal', label: 'باطنة', icon: <Icons.Activity size={16} /> },
        { id: 'ent', label: 'أنف وأذن', icon: <Icons.Mic size={16} /> },
        { id: 'eyes', label: 'عيون', icon: <Icons.Eye size={16} /> },
        { id: 'ortho', label: 'عظام', icon: <Icons.Bone size={16} /> },
        { id: 'physio', label: 'العلاج الطبيعي والتأهيل', icon: <Icons.Activity size={16} /> },
        { id: 'radiology', label: 'قسم الأشعة', icon: <Icons.Activity size={16} /> },
        { id: 'labs', label: 'قسم المختبرات', icon: <Icons.FlaskConical size={16} /> },
    ];

    // Mock Doctors Data
    const doctors: Doctor[] = [
        {
            id: 101,
            name: 'د. محمد الغامدي',
            specialty: 'cardio',
            subSpecialty: 'استشاري أمراض القلب',
            facility: 'مستشفى دلة',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
            rating: 4.9,
            reviews: 120,
            experience: '15 سنة',
            price: '300 ريال',
            availability: 'متاح اليوم',
            tags: ['استشاري', 'بورد كندي']
        },
        {
            id: 102,
            name: 'د. سارة الأحمد',
            specialty: 'derma',
            subSpecialty: 'أخصائية جلدية وتجميل',
            facility: 'عيادات جوفا',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
            rating: 4.8,
            reviews: 85,
            experience: '8 سنوات',
            price: '250 ريال',
            availability: 'متاح غداً',
            tags: ['فيلر', 'بوتكس', 'ليزر']
        },
        {
            id: 103,
            name: 'د. فهد العنزي',
            specialty: 'dental',
            subSpecialty: 'استشاري زراعة أسنان',
            facility: 'مركز الأسنان المتقدم',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            rating: 4.7,
            reviews: 210,
            experience: '12 سنة',
            price: '150 ريال',
            availability: 'متاح اليوم',
            tags: ['زراعة', 'تقويم']
        },
        {
            id: 104,
            name: 'د. نورة السالم',
            specialty: 'pediatric',
            subSpecialty: 'استشارية طب أطفال',
            facility: 'مستشفى فقيه',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
            rating: 4.9,
            reviews: 340,
            experience: '20 سنة',
            price: '350 ريال',
            availability: 'متاح الأحد',
            tags: ['حديثي الولادة', 'نمو']
        },
        {
            id: 105,
            name: 'د. خالد العتيبي',
            specialty: 'internal',
            subSpecialty: 'أخصائي باطنة وجهاز هضمي',
            facility: 'مستشفى المواساة',
            image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
            rating: 4.5,
            reviews: 95,
            experience: '10 سنوات',
            price: '200 ريال',
            availability: 'متاح اليوم',
            tags: ['مناظير', 'قولون']
        },
        {
            id: 106,
            name: 'د. عبدالله السديري',
            specialty: 'ortho',
            subSpecialty: 'استشاري جراحة العظام',
            facility: 'مستشفى دلة',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
            rating: 4.8,
            reviews: 150,
            experience: '18 سنة',
            price: '350 ريال',
            availability: 'متاح غداً',
            tags: ['إصابات ملاعب', 'مفاصل']
        },
        {
            id: 107,
            name: 'د. مها القحطاني',
            specialty: 'eyes',
            subSpecialty: 'استشارية طب وجراحة العيون',
            facility: 'مستشفى مغربي',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
            rating: 4.9,
            reviews: 200,
            experience: '14 سنة',
            price: '300 ريال',
            availability: 'متاح اليوم',
            tags: ['ليزك', 'ماء أبيض']
        },
        {
            id: 108,
            name: 'د. سعيد الشهراني',
            specialty: 'cardio',
            subSpecialty: 'استشاري قلب وقسطرة',
            facility: 'المستشفى السعودي الألماني',
            image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
            rating: 4.7,
            reviews: 90,
            experience: '11 سنة',
            price: '400 ريال',
            availability: 'متاح الأحد',
            tags: ['قسطرة', 'ضغط']
        },
        {
            id: 109,
            name: 'د. ريم الحربي',
            specialty: 'pediatric',
            subSpecialty: 'أخصائية طب أطفال',
            facility: 'مستشفى الملك فهد',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
            rating: 4.6,
            reviews: 110,
            experience: '7 سنوات',
            price: '150 ريال',
            availability: 'متاح اليوم',
            tags: ['تطعيمات', 'حساسية']
        },
        {
            id: 110,
            name: 'د. عمر باطرفي',
            specialty: 'ent',
            subSpecialty: 'استشاري أنف وأذن وحنجرة',
            facility: 'مستشفى فقيه',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            rating: 4.8,
            reviews: 130,
            experience: '16 سنة',
            price: '280 ريال',
            availability: 'متاح غداً',
            tags: ['جيوب أنفية', 'سمعيات']
        }
    ];

    // Expanded Facilities Database with Map Positions and Details
    const facilities: Facility[] = [
        // --- RIYADH ---
        {
            id: 1,
            name: 'مستشفى دلة',
            category: 'hospitals',
            region: 'الرياض',
            type: 'مستشفى عام',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b9af922?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 1250,
            distance: '2.5 كم',
            numericDistance: 2.5,
            time: '7 دقائق',
            status: 'open',
            tags: ['طوارئ 24/7', 'تأمين شامل'],
            description: 'مستشفى دلة هو أحد أبرز مقدمي الرعاية الصحية في الرياض، يقدم خدمات طبية شاملة بأعلى معايير الجودة.',
            services: ['طوارئ', 'جراحة عامة', 'نساء وولادة', 'أطفال', 'قلب', 'عظام'],
            phone: '920012345',
            mapPosition: { top: '30%', left: '40%' }
        },
        {
            id: 2,
            name: 'مركز ريلاكس للمساج والعلاج',
            category: 'physio',
            region: 'الرياض',
            type: 'علاج طبيعي وتدليك',
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 320,
            distance: '3.1 كم',
            numericDistance: 3.1,
            time: '10 دقائق',
            status: 'open',
            tags: ['مساج علاجي', 'تأهيل رياضي'],
            description: 'مركز متخصص في العلاج الطبيعي والتأهيل والإصابات الرياضية، بالإضافة إلى خدمات التدليك العلاجي والاسترخاء.',
            services: ['علاج طبيعي', 'مساج سويدي', 'مساج أحجار ساخنة', 'تأهيل ما بعد العمليات'],
            mapPosition: { top: '45%', left: '60%' }
        },
        {
            id: 3,
            name: 'صيدلية النهدي',
            category: 'pharmacy',
            region: 'الرياض',
            type: 'صيدلية مجتمعية',
            image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=600',
            rating: 4.5,
            reviews: 2100,
            distance: '0.5 كم',
            numericDistance: 0.5,
            time: 'دقيقتين',
            status: 'open',
            tags: ['توصيل', 'دواء وصحة'],
            description: 'سلسلة صيدليات رائدة توفر الأدوية ومستحضرات التجميل ومنتجات العناية بالأطفال.',
            mapPosition: { top: '55%', left: '30%' }
        },
        {
            id: 4,
            name: 'عيادات جوفا الجلدية',
            category: 'cosmetic',
            region: 'الرياض',
            type: 'جلدية وتجميل',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 450,
            distance: '5.0 كم',
            numericDistance: 5.0,
            time: '12 دقيقة',
            status: 'open',
            tags: ['ليزر', 'فيلر', 'بوتكس'],
            mapPosition: { top: '25%', left: '70%' }
        },
        {
            id: 5,
            name: 'مركز الأسنان المتقدم',
            category: 'dental',
            region: 'الرياض',
            type: 'طب وزراعة الأسنان',
            image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 650,
            distance: '1.2 كم',
            numericDistance: 1.2,
            time: '4 دقائق',
            status: 'closed',
            tags: ['حجز فوري', 'تبييض'],
            mapPosition: { top: '60%', left: '50%' }
        },

        // --- JEDDAH ---
        {
            id: 6,
            name: 'مستشفى فقيه',
            category: 'hospitals',
            region: 'جدة',
            type: 'مستشفى تخصصي',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 1800,
            distance: '4.5 كم',
            numericDistance: 4.5,
            time: '15 دقيقة',
            status: 'open',
            tags: ['قلب', 'أطفال', 'ولادة'],
            mapPosition: { top: '40%', left: '20%' }
        },
        {
            id: 7,
            name: 'مركز جدة للعلاج الطبيعي',
            category: 'physio',
            region: 'جدة',
            type: 'إعادة تأهيل',
            image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600',
            rating: 4.6,
            reviews: 210,
            distance: '6.0 كم',
            numericDistance: 6.0,
            time: '18 دقيقة',
            status: 'open',
            tags: ['إصابات ملاعب', 'ديسك'],
            mapPosition: { top: '50%', left: '15%' }
        },
        {
            id: 8,
            name: 'عيادات كايا',
            category: 'cosmetic',
            region: 'جدة',
            type: 'عناية بالبشرة',
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 500,
            distance: '2.2 كم',
            numericDistance: 2.2,
            time: '6 دقائق',
            status: 'open',
            tags: ['بشرة', 'شعر'],
            mapPosition: { top: '35%', left: '25%' }
        },

        // --- DAMMAM / KHOBAR ---
        {
            id: 9,
            name: 'مستشفى المواساة',
            category: 'hospitals',
            region: 'الدمام',
            type: 'مستشفى عام',
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600',
            rating: 4.6,
            reviews: 980,
            distance: '3.0 كم',
            numericDistance: 3.0,
            time: '8 دقائق',
            status: 'open',
            tags: ['تأمين', 'طوارئ'],
            mapPosition: { top: '20%', left: '80%' }
        },
        {
            id: 10,
            name: 'مركز وقت الاسترخاء',
            category: 'physio',
            region: 'الخبر',
            type: 'سبا وتدليك',
            image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 150,
            distance: '8.5 كم',
            numericDistance: 8.5,
            time: '20 دقيقة',
            status: 'open',
            tags: ['مساج سويدي', 'حجامة'],
            mapPosition: { top: '25%', left: '85%' }
        },
        {
            id: 11,
            name: 'صيدلية الدواء',
            category: 'pharmacy',
            region: 'الدمام',
            type: 'صيدلية',
            image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=600',
            rating: 4.4,
            reviews: 800,
            distance: '1.0 كم',
            numericDistance: 1.0,
            time: '3 دقائق',
            status: 'open',
            tags: ['خدمة 24 ساعة'],
            mapPosition: { top: '15%', left: '75%' }
        },

        // --- MAKKAH / MADINAH ---
        {
            id: 12,
            name: 'مدينة الملك عبدالله الطبية',
            category: 'hospitals',
            region: 'مكة المكرمة',
            type: 'مدينة طبية',
            image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 3000,
            distance: '10 كم',
            numericDistance: 10.0,
            time: '25 دقيقة',
            status: 'open',
            tags: ['حكومي', 'تخصصي'],
            mapPosition: { top: '70%', left: '20%' }
        },
        {
            id: 13,
            name: 'المستشفى السعودي الألماني',
            category: 'hospitals',
            region: 'المدينة المنورة',
            type: 'مستشفى خاص',
            image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 1100,
            distance: '5.5 كم',
            numericDistance: 5.5,
            time: '12 دقيقة',
            status: 'open',
            tags: ['دولي', 'فندقة'],
            mapPosition: { top: '15%', left: '15%' }
        },
        // --- NEW FACILITIES ---
        {
            id: 14,
            name: 'مستشفى مغربي',
            category: 'hospitals',
            region: 'الرياض',
            type: 'مستشفى عيون وأسنان',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
            rating: 4.6,
            reviews: 850,
            distance: '6.2 كم',
            numericDistance: 6.2,
            time: '14 دقيقة',
            status: 'open',
            tags: ['عيون', 'أسنان'],
            description: 'رائدون في طب العيون والأسنان والأذن والأنف والحنجرة في الشرق الأوسط.',
            services: ['ليزك', 'زراعة أسنان', 'جراحة عيون'],
            phone: '920018000',
            mapPosition: { top: '35%', left: '45%' }
        },
        {
            id: 15,
            name: 'مستشفى الملك فهد',
            category: 'hospitals',
            region: 'جدة',
            type: 'مستشفى حكومي',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b9af922?auto=format&fit=crop&q=80&w=600',
            rating: 4.5,
            reviews: 1500,
            distance: '8.0 كم',
            numericDistance: 8.0,
            time: '20 دقيقة',
            status: 'open',
            tags: ['حكومي', 'مرجعي'],
            description: 'مستشفى مرجعي يقدم خدمات طبية متقدمة في مختلف التخصصات.',
            services: ['طوارئ', 'جراحة', 'باطنة'],
            phone: '0126606111',
            mapPosition: { top: '45%', left: '25%' }
        },
        {
            id: 16,
            name: 'مستشفى عسير المركزي',
            category: 'hospitals',
            region: 'أبها',
            type: 'مستشفى مركزي',
            image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
            rating: 4.4,
            reviews: 900,
            distance: '4.0 كم',
            numericDistance: 4.0,
            time: '10 دقائق',
            status: 'open',
            tags: ['حكومي', 'طوارئ'],
            description: 'المستشفى الرئيسي في منطقة عسير، يخدم المنطقة الجنوبية بكافة التخصصات.',
            services: ['طوارئ', 'عناية مركزة', 'جراحة'],
            phone: '0172251111',
            mapPosition: { top: '80%', left: '30%' }
        },
        {
            id: 17,
            name: 'مستشفى الملك سلمان للقوات المسلحة',
            category: 'hospitals',
            region: 'تبوك',
            type: 'مستشفى عسكري',
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 750,
            distance: '5.5 كم',
            numericDistance: 5.5,
            time: '12 دقيقة',
            status: 'open',
            tags: ['عسكري', 'تخصصي'],
            description: 'صرح طبي متميز في المنطقة الشمالية الغربية.',
            services: ['قلب', 'أورام', 'جراحة'],
            phone: '0144411111',
            mapPosition: { top: '10%', left: '20%' }
        }
    ];

    // Filtering & Sorting Logic
    const filteredFacilities = useMemo(() => {
        let result = [];

        if (viewMode === 'doctors') {
            const matchingDoctors = doctors.filter(doctor => {
                const matchCategory = activeFilter.includes('all') || activeFilter.includes(doctor.specialty);
                const matchSearch = searchQuery === '' ||
                    doctor.name.includes(searchQuery) ||
                    doctor.subSpecialty?.includes(searchQuery) ||
                    doctor.facility.includes(searchQuery);
                return matchCategory && matchSearch;
            });
            const facilityNames = new Set(matchingDoctors.map(d => d.facility));
            result = facilities.filter(f => facilityNames.has(f.name));
        } else {
            result = facilities.filter(facility => {
                const matchRegion = selectedRegion === 'الكل' || facility.region === selectedRegion;
                const matchCategory = activeFilter.includes('all') || activeFilter.includes(facility.category);
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
    }, [facilities, selectedRegion, activeFilter, searchQuery, sortBy, viewMode, doctors]);

    const filteredDoctors = useMemo(() => {
        let result = doctors.filter(doctor => {
            const matchCategory = activeFilter.includes('all') || activeFilter.includes(doctor.specialty);
            const matchSearch = searchQuery === '' ||
                doctor.name.includes(searchQuery) ||
                doctor.subSpecialty?.includes(searchQuery) ||
                doctor.facility.includes(searchQuery);
            return matchCategory && matchSearch;
        });

        if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [doctors, activeFilter, searchQuery, sortBy]);

    const handleResetFilters = () => {
        setActiveFilter(['all']);
        setSelectedRegion('الكل');
        setSearchQuery('');
        setSortBy('distance'); // Reset to Nearest
    };

    const toggleFilter = (filterId: string) => {
        if (filterId === 'all') {
            setActiveFilter(['all']);
        } else {
            setActiveFilter(prev => {
                const withoutAll = prev.filter(f => f !== 'all');
                if (withoutAll.includes(filterId)) {
                    const newFilters = withoutAll.filter(f => f !== filterId);
                    return newFilters.length === 0 ? ['all'] : newFilters;
                } else {
                    return [...withoutAll, filterId];
                }
            });
        }
    };

    // --- BOOKING WIZARD LOGIC ---
    const handleStartBooking = () => {
        setIsBookingOpen(true);
        setBookingStep(1);
        setBookingData({
            specialty: '',
            doctor: null,
            date: '',
            time: '',
            paymentMethod: ''
        });
    };

    const handleSelectSpecialty = (spec: string) => {
        setBookingData({ ...bookingData, specialty: spec });
        setBookingStep(2);
    };

    const handleSelectDoctor = (doc: Doctor) => {
        setBookingData({ ...bookingData, doctor: doc });
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
            case 'clinic': return 'الدفع في العيادة';
            case 'points': return 'محفظة نقاط أمان';
            case 'aman_card': return 'بطاقة أمان إيفر';
            case 'digital': return 'دفع إلكتروني';
            case 'installments': return 'تقسيط (Tabby/Tamara)';
            default: return method;
        }
    };

    const renderBookingWizard = () => {
        if (!isBookingOpen || !selectedFacility) return null;

        // Helper: Get specialties available in this facility
        const availableSpecialties = Array.from(new Set(
            doctors.filter(d => d.facility === selectedFacility.name).map(d => d.specialty)
        ));
        // Fallback if no doctors mapped
        const displaySpecialties = availableSpecialties.length > 0 ? availableSpecialties : ['cardio', 'dental', 'derma', 'pediatric', 'internal'];

        // Helper: Get doctors for selected specialty
        const availableDoctors = doctors.filter(d => d.facility === selectedFacility.name && d.specialty === bookingData.specialty);

        // Helper: Generate dates
        const dates = Array.from({ length: 5 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i + 1);
            return d;
        });

        // Helper: Generate times
        const times = ['09:00 ص', '09:30 ص', '10:00 ص', '10:30 ص', '11:00 ص', '04:00 م', '04:30 م', '05:00 م', '05:30 م', '06:00 م'];

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
                                <h4 className="text-xl font-black text-gray-800 mb-2">اختر التخصص</h4>
                                <p className="text-sm text-gray-500 mb-6">التخصصات المتاحة في {selectedFacility.name}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {displaySpecialties.map((spec, idx) => {
                                        const filter = doctorFilters.find(f => f.id === spec);
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

                        {/* Step 2: Doctor */}
                        {bookingStep === 2 && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setBookingStep(1)} className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1 hover:text-[#0C5A5D]">
                                    <Icons.ArrowRight size={14} /> عودة للتخصصات
                                </button>
                                <h4 className="text-xl font-black text-gray-800 mb-2">اختر الطبيب</h4>
                                <p className="text-sm text-gray-500 mb-6">الأطباء المتاحين في هذا التخصص</p>

                                <div className="space-y-3">
                                    {availableDoctors.length > 0 ? availableDoctors.map((doc) => (
                                        <button
                                            key={doc.id}
                                            onClick={() => handleSelectDoctor(doc)}
                                            className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 text-right group"
                                        >
                                            <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-[#0C5A5D] transition-colors" />
                                            <div className="flex-1">
                                                <h5 className="font-bold text-gray-900 text-lg mb-1">{doc.name}</h5>
                                                <p className="text-xs text-gray-500 mb-2">{doc.subSpecialty}</p>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="flex items-center gap-1 text-yellow-500 font-bold"><Icons.Star size={12} className="fill-current" /> {doc.rating}</span>
                                                    <span className="text-[#0C5A5D] font-bold">{doc.price}</span>
                                                </div>
                                            </div>
                                            <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D]" />
                                        </button>
                                    )) : (
                                        <div className="text-center py-10 text-gray-400">
                                            <Icons.UserX size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>لا يوجد أطباء متاحين حالياً في هذا التخصص</p>
                                            <button onClick={() => setBookingStep(1)} className="mt-4 text-[#0C5A5D] font-bold text-sm underline">اختر تخصص آخر</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Date & Time */}
                        {bookingStep === 3 && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setBookingStep(2)} className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1 hover:text-[#0C5A5D]">
                                    <Icons.ArrowRight size={14} /> عودة للأطباء
                                </button>
                                <h4 className="text-xl font-black text-gray-800 mb-2">تاريخ ووقت الموعد</h4>
                                <p className="text-sm text-gray-500 mb-6">المواعيد المتاحة لـ {bookingData.doctor?.name}</p>

                                {/* Calendar Picker */}
                                <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="font-bold text-gray-800">مارس 2025</h5>
                                        <div className="flex gap-1">
                                            <button className="p-1 hover:bg-gray-100 rounded-full"><Icons.ChevronRight size={16} /></button>
                                            <button className="p-1 hover:bg-gray-100 rounded-full"><Icons.ChevronLeft size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                        {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(d => (
                                            <span key={d} className="text-[10px] text-gray-400 font-bold">{d}</span>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Empty cells for start of month */}
                                        {[...Array(6)].map((_, i) => <div key={`empty-${i}`} />)}

                                        {/* Days */}
                                        {[...Array(31)].map((_, i) => {
                                            const day = i + 1;
                                            const dateStr = `2025-03-${day.toString().padStart(2, '0')}`; // Mock date string
                                            const isSelected = bookingData.date.includes(day.toString()); // Simple check
                                            const isToday = day === 15; // Mock today

                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => setBookingData({ ...bookingData, date: `2025-03-${day}`, time: '' })}
                                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected
                                                        ? 'bg-[#0C5A5D] text-white shadow-md'
                                                        : isToday
                                                            ? 'bg-[#0C5A5D]/10 text-[#0C5A5D]'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {day}
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
                                                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${bookingData.time === time
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


                        {/* Step 4: Payment Method */}
                        {bookingStep === 4 && (
                            <div className="animate-fade-in-up">
                                <button onClick={() => setBookingStep(3)} className="text-gray-400 text-xs font-bold mb-4 flex items-center gap-1 hover:text-[#0C5A5D]">
                                    <Icons.ArrowRight size={14} /> عودة للموعد
                                </button>
                                <h4 className="text-xl font-black text-gray-800 mb-2">طريقة الدفع</h4>
                                <p className="text-sm text-gray-500 mb-6">اختر وسيلة الدفع المناسبة لك</p>

                                <div className="space-y-3">
                                    {/* Pay at Clinic */}
                                    <button onClick={() => handleSelectPayment('clinic')} className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 group">
                                        <div className="bg-gray-100 p-3 rounded-xl text-gray-600 group-hover:bg-[#0C5A5D] group-hover:text-white transition-colors">
                                            <Icons.Building2 size={24} />
                                        </div>
                                        <div className="text-right flex-1">
                                            <span className="block font-bold text-gray-900">الدفع في العيادة</span>
                                            <span className="text-xs text-gray-400">نقداً أو شبكة عند الوصول</span>
                                        </div>
                                        <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D]" />
                                    </button>

                                    {/* Aman Points */}
                                    <button onClick={() => handleSelectPayment('points')} className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 group">
                                        <div className="bg-orange-100 p-3 rounded-xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                            <Icons.Wallet size={24} />
                                        </div>
                                        <div className="text-right flex-1">
                                            <span className="block font-bold text-gray-900">محفظة نقاط أمان</span>
                                            <span className="text-xs text-gray-400">استخدم رصيدك المتاح</span>
                                        </div>
                                        <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D]" />
                                    </button>

                                    {/* Aman Ever Card */}
                                    <button onClick={() => handleSelectPayment('aman_card')} className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 group">
                                        <div className="bg-[#0C5A5D]/10 p-3 rounded-xl text-[#0C5A5D] group-hover:bg-[#0C5A5D] group-hover:text-white transition-colors">
                                            <Icons.CreditCard size={24} />
                                        </div>
                                        <div className="text-right flex-1">
                                            <span className="block font-bold text-gray-900">بطاقة أمان إيفر</span>
                                            <span className="text-xs text-gray-400">خصم خاص لحاملي البطاقة</span>
                                        </div>
                                        <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D]" />
                                    </button>

                                    {/* Digital Payments */}
                                    <button onClick={() => handleSelectPayment('digital')} className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 group">
                                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <Icons.Smartphone size={24} />
                                        </div>
                                        <div className="text-right flex-1">
                                            <span className="block font-bold text-gray-900">خدمات الدفع الإلكتروني</span>
                                            <span className="text-xs text-gray-400">Visa, MasterCard, Apple Pay, STC Pay</span>
                                        </div>
                                        <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D]" />
                                    </button>

                                    {/* Installments */}
                                    <button onClick={() => handleSelectPayment('installments')} className="w-full bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#0C5A5D] hover:shadow-md transition-all flex items-center gap-4 group">
                                        <div className="bg-purple-50 p-3 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                            <Icons.Percent size={24} />
                                        </div>
                                        <div className="text-right flex-1">
                                            <span className="block font-bold text-gray-900">خدمات التقسيط</span>
                                            <span className="text-xs text-gray-400">Tabby, Tamara (قسط فاتورتك)</span>
                                        </div>
                                        <Icons.ChevronLeft className="text-gray-300 group-hover:text-[#0C5A5D]" />
                                    </button>
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

                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                                    {/* Doctor Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50">
                                        <img src={bookingData.doctor?.image} alt={bookingData.doctor?.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                        <div>
                                            <h5 className="font-bold text-gray-900">{bookingData.doctor?.name}</h5>
                                            <p className="text-xs text-gray-500">{bookingData.doctor?.subSpecialty}</p>
                                        </div>
                                    </div>

                                    {/* Details List */}
                                    <div className="p-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Icons.Building2 size={16} />
                                                <span className="text-xs font-bold">المنشأة</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">{selectedFacility.name}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Icons.Calendar size={16} />
                                                <span className="text-xs font-bold">التاريخ والوقت</span>
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-sm font-bold text-gray-800">{bookingData.time}</span>
                                                <span className="text-[10px] text-gray-400">{bookingData.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Icons.CreditCard size={16} />
                                                <span className="text-xs font-bold">طريقة الدفع</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">{getPaymentMethodLabel(bookingData.paymentMethod)}</span>
                                        </div>

                                        <div className="border-t border-dashed border-gray-200 pt-4 mt-2 flex justify-between items-center">
                                            <span className="font-bold text-gray-800">إجمالي المبلغ</span>
                                            <span className="text-lg font-black text-[#0C5A5D]">{bookingData.doctor?.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmBooking}
                                    className="w-full bg-[#0C5A5D] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#0C5A5D]/20 hover:bg-[#0a484b] transition-all flex items-center justify-center gap-2"
                                >
                                    <Icons.CheckCircle size={20} />
                                    تأكيد الحجز النهائي
                                </button>
                            </div>
                        )}

                        {/* Step 6: Success */}
                        {bookingStep === 6 && (
                            <div className="flex flex-col items-center justify-center h-full text-center animate-scale-in">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50 animate-bounce-slow">
                                    <Icons.CheckCircle size={48} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800 mb-2">تم حجز الموعد بنجاح!</h2>
                                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                                    تم تأكيد موعدك مع {bookingData.doctor?.name} في {selectedFacility.name} يوم {new Date(bookingData.date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })} الساعة {bookingData.time}.
                                </p>

                                <div className="w-full space-y-3">
                                    <button onClick={() => { setIsBookingOpen(false); setSelectedFacility(null); }} className="w-full bg-[#0C5A5D] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#0C5A5D]/20 hover:bg-[#0a484b] transition-all">
                                        العودة للرئيسية
                                    </button>
                                    <button className="w-full bg-white text-[#0C5A5D] border border-[#0C5A5D] py-4 rounded-2xl font-bold hover:bg-[#0C5A5D]/5 transition-all">
                                        عرض تفاصيل الحجز
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        );
    };

    // --- REGION SELECTION OVERLAY ---
    const renderRegionSelection = () => {
        if (!isRegionSelectionOpen) return null;

        const filteredRegions = regions.filter(r => r.country === selectedCountry || r.id === 'الكل');

        return (
            <div className="fixed inset-0 z-[70] bg-gray-50 flex flex-col animate-fade-in w-full max-w-md mx-auto shadow-2xl">
                {/* Header */}
                <div className="bg-[#0C5A5D] text-white pt-12 pb-6 px-4 rounded-b-[2.5rem] shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => setIsRegionSelectionOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all">
                            <Icons.ArrowRight size={22} />
                        </button>
                        <h2 className="text-xl font-black">اختيار المنطقة</h2>
                        <div className="w-10"></div>
                    </div>

                    {/* Country Tabs */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {countries.map(country => (
                            <button
                                key={country.id}
                                onClick={() => setSelectedCountry(country.id)}
                                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold transition-all flex items-center gap-2 ${selectedCountry === country.id ? 'bg-white text-[#0C5A5D] shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                <span>{country.icon}</span>
                                {country.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pt-6 pb-20">
                    <div className="flex items-center gap-2 mb-6 text-gray-400">
                        <Icons.MapPin size={16} />
                        <span className="text-xs font-bold">جميع المناطق الخاصة بـ {countries.find(c => c.id === selectedCountry)?.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {filteredRegions.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => {
                                    setSelectedRegion(region.id);
                                    if (region.id !== 'الكل' && citiesByRegion[region.id]) {
                                        setIsCitySelectionOpen(true);
                                    } else {
                                        setIsRegionSelectionOpen(false);
                                    }
                                }}
                                className={`relative h-44 rounded-3xl overflow-hidden shadow-sm group active:scale-95 transition-all border-2 ${selectedRegion === region.id ? 'border-[#0C5A5D] shadow-lg ring-4 ring-[#0C5A5D]/10' : 'border-transparent'}`}
                            >
                                <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 right-4 text-white text-right">
                                    <span className="text-xs font-bold block opacity-70">منطقة</span>
                                    <span className="text-sm font-black">{region.name}</span>
                                </div>
                                {selectedRegion === region.id && (
                                    <div className="absolute top-3 left-3 bg-[#0C5A5D] text-white p-1 rounded-full">
                                        <Icons.CheckCircle size={14} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // --- CITY SELECTION OVERLAY ---
    const renderCitySelection = () => {
        if (!isCitySelectionOpen) return null;

        const availableCities = citiesByRegion[selectedRegion] || [];
        const filteredCities = availableCities.filter(city => 
            city.includes(citySearchQuery)
        );

        return (
            <div className="fixed inset-0 z-[80] bg-gray-50 flex flex-col animate-fade-in w-full max-w-md mx-auto shadow-2xl">
                {/* Header Style matching mockup */}
                <div className="bg-gradient-to-b from-[#0C5A5D] to-[#147a7e] text-white pt-12 pb-8 px-5 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <Icons.LogoIcon />
                    </div>
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <button onClick={() => setIsCitySelectionOpen(false)} className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition-all active:scale-95">
                            <Icons.ArrowRight size={22} />
                        </button>
                        <h2 className="text-xl font-black">{selectedRegion}</h2>
                        <div className="w-10"></div>
                    </div>

                    {/* Search Bar in Header */}
                    <div className="bg-white rounded-2xl flex items-center px-4 py-3 shadow-inner relative z-10 text-right" dir="rtl">
                        <Icons.Search className="text-gray-300 ml-3 shrink-0" size={18} />
                        <input 
                            type="text" 
                            placeholder="بحث بواسطة : المدينة" 
                            value={citySearchQuery}
                            onChange={(e) => setCitySearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-gray-800 text-xs font-bold w-full placeholder-gray-300 text-right pr-2"
                        />
                        <button className="bg-[#0C5A5D]/10 p-1.5 rounded-lg text-[#0C5A5D] shrink-0">
                            <Icons.Filter size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pt-8 pb-24">
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => {
                                        setSelectedCity(city);
                                        setIsCitySelectionOpen(false);
                                        setIsRegionSelectionOpen(false);
                                    }}
                                    className={`bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 border-2 ${selectedCity === city ? 'border-[#0C5A5D] bg-[#0C5A5D]/5 shadow-lg ring-4 ring-[#0C5A5D]/5' : 'border-gray-50 shadow-sm hover:shadow-md'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedCity === city ? 'bg-[#0C5A5D] text-white' : 'bg-[#0C5A5D]/5 text-[#0C5A5D]'}`}>
                                        <Icons.MapPin size={24} />
                                    </div>
                                    <span className={`text-sm font-black transition-colors ${selectedCity === city ? 'text-[#0C5A5D]' : 'text-gray-700'}`}>{city}</span>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-20 opacity-50">
                                <Icons.Search size={40} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-sm font-bold">لا توجد مدن تطابق بحثك</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom padding for safety */}
                <div className="fixed bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
            </div>
        );
    };

    // --- FILTER OVERLAY (BOTTOM SHEET) ---
    const renderFilterOverlay = () => {
        if (!isFilterOpen) return null;

        return (
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center animate-fade-in" onClick={() => setIsFilterOpen(false)}>
                <div 
                    className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-12 animate-slide-up shadow-2xl relative" 
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Handle */}
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#0C5A5D]/10 p-2 rounded-xl text-[#0C5A5D]">
                                <Icons.Sliders size={20} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800">تصفية بواسطة :</h3>
                        </div>
                        <button onClick={() => setIsFilterOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-800 transition-colors">
                            <Icons.X size={18} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Country */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">الدولة</label>
                            <div className="relative group">
                                <select 
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full bg-white border border-gray-100 p-4 pr-12 rounded-3xl text-sm font-bold appearance-none shadow-sm focus:border-[#0C5A5D] focus:ring-4 focus:ring-[#0C5A5D]/5 transition-all outline-none"
                                >
                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <Icons.Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0C5A5D]" size={18} />
                                <Icons.ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                        </div>

                        {/* Region */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">المنطقة</label>
                            <div className="relative group">
                                <select 
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="w-full bg-white border border-gray-100 p-4 pr-12 rounded-3xl text-sm font-bold appearance-none shadow-sm focus:border-[#0C5A5D] focus:ring-4 focus:ring-[#0C5A5D]/5 transition-all outline-none"
                                >
                                    <option value="الكل">الكل</option>
                                    {regions.filter(r => r.country === selectedCountry).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                                <Icons.MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0C5A5D]" size={18} />
                                <Icons.ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">المدينة</label>
                            <div className="relative group">
                                <select 
                                    className="w-full bg-white border border-gray-100 p-4 pr-12 rounded-3xl text-sm font-bold appearance-none shadow-sm focus:border-[#0C5A5D] focus:ring-4 focus:ring-[#0C5A5D]/5 transition-all outline-none"
                                >
                                    <option>اختيار المدينة</option>
                                    <option>الرياض</option>
                                    <option>جدة</option>
                                    <option>الدمام</option>
                                </select>
                                <Icons.Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0C5A5D]" size={18} />
                                <Icons.ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                        </div>

                        {/* Closest to me toggle */}
                        <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-[2.5rem] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-xl text-[#0C5A5D] shadow-sm">
                                    <Icons.Activity size={18} />
                                </div>
                                <div>
                                    <span className="block text-sm font-black text-gray-800">الأقرب إلي</span>
                                    <p className="text-[10px] text-gray-400 font-bold">اعرض المنشآت الأقرب إلى موقعي الحالي.</p>
                                </div>
                            </div>
                            <div 
                                onClick={() => setSortBy(sortBy === 'distance' ? 'default' : 'distance')}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${sortBy === 'distance' ? 'bg-[#0C5A5D]' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${sortBy === 'distance' ? '-translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">ترتيب حسب</label>
                            <div className="relative group">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full bg-white border border-gray-100 p-4 pr-12 rounded-3xl text-sm font-bold appearance-none shadow-sm focus:border-[#0C5A5D] focus:ring-4 focus:ring-[#0C5A5D]/5 transition-all outline-none"
                                >
                                    <option value="newest">الأحدث أولاً</option>
                                    <option value="rating">الأعلى تقييماً</option>
                                    <option value="distance">الأقرب مسافة</option>
                                    <option value="default">الافتراضي</option>
                                </select>
                                <Icons.Sliders className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0C5A5D]" size={18} />
                                <Icons.ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                        </div>

                        {/* Specialty */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 mb-2 mr-1">التخصص</label>
                            <div className="relative group">
                                <select 
                                    className="w-full bg-white border border-gray-100 p-4 pr-12 rounded-3xl text-sm font-bold appearance-none shadow-sm focus:border-[#0C5A5D] focus:ring-4 focus:ring-[#0C5A5D]/5 transition-all outline-none"
                                >
                                    <option>اختر التخصص</option>
                                    {doctorFilters.map(cat => <option key={cat.id}>{cat.label}</option>)}
                                </select>
                                <Icons.PlusCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0C5A5D]" size={18} />
                                <Icons.ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-[#0C5A5D] text-white py-4 rounded-3xl font-black mt-8 shadow-lg shadow-[#0C5A5D]/20 active:scale-95 transition-all"
                    >
                        تطبيق الفلاتر
                    </button>
                </div>
            </div>
        );
    };

    // --- DOCTOR DETAILS VIEW COMPONENT ---
    if (selectedDoctor) {
        return (
            <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-fade-in overflow-y-auto w-full max-w-md mx-auto shadow-2xl">
                <div className="relative h-72 w-full bg-gray-100">
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <button
                        onClick={() => setSelectedDoctor(null)}
                        className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all"
                    >
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <div className="absolute bottom-6 right-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#0C5A5D] px-2 py-0.5 rounded text-xs font-bold">{selectedDoctor.subSpecialty}</span>
                            <div className="flex items-center gap-1 bg-yellow-400 text-black px-1.5 py-0.5 rounded text-xs font-bold">
                                <Icons.Star size={10} className="fill-black" /> {selectedDoctor.rating}
                            </div>
                        </div>
                        <h2 className="text-3xl font-black mb-1">{selectedDoctor.name}</h2>
                        <p className="text-sm text-gray-300 flex items-center gap-1">
                            <Icons.Building2 size={14} /> {selectedDoctor.facility}
                        </p>
                    </div>
                </div>

                <div className="flex-1 p-6 -mt-6 bg-white rounded-t-3xl relative z-10">
                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                            <span className="text-[10px] text-gray-400 block mb-1">الخبرة</span>
                            <span className="font-bold text-[#0C5A5D]">{selectedDoctor.experience}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                            <span className="text-[10px] text-gray-400 block mb-1">سعر الكشف</span>
                            <span className="font-bold text-[#0C5A5D]">{selectedDoctor.price}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                            <span className="text-[10px] text-gray-400 block mb-1">الموعد</span>
                            <span className="font-bold text-green-600">{selectedDoctor.availability}</span>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-2">نبذة عن الطبيب</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            طبيب متخصص ذو خبرة واسعة في {selectedDoctor.subSpecialty}، يعمل في {selectedDoctor.facility}. حاصل على تقييمات ممتازة من المرضى.
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-3">التخصصات الدقيقة</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedDoctor.tags.map((tag, idx) => (
                                <span key={idx} className="bg-[#0C5A5D]/5 text-[#0C5A5D] px-3 py-1.5 rounded-xl text-xs font-bold border border-[#0C5A5D]/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Preview */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-20 border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-800">تقييمات المرضى</h3>
                            <span className="text-xs text-[#0C5A5D] font-bold">عرض الكل ({selectedDoctor.reviews})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                A
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-800">أحمد .م</p>
                                <p className="text-[10px] text-gray-500">طبيب ممتاز ومستمع جيد، أنصح به بشدة.</p>
                            </div>
                            <div className="mr-auto flex text-yellow-400">
                                <Icons.Star size={12} className="fill-current" />
                                <Icons.Star size={12} className="fill-current" />
                                <Icons.Star size={12} className="fill-current" />
                                <Icons.Star size={12} className="fill-current" />
                                <Icons.Star size={12} className="fill-current" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Floating Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 shadow-lg z-20 w-full max-w-md mx-auto">
                    <button
                        onClick={() => {
                            setSelectedFacility(facilities.find(f => f.name === selectedDoctor.facility) || null);
                            setBookingData({ ...bookingData, doctor: selectedDoctor, specialty: selectedDoctor.specialty });
                            setIsBookingOpen(true);
                            setBookingStep(3); // Skip to Date/Time since doctor is selected
                        }}
                        className="flex-1 bg-[#0C5A5D] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a484b] transition-colors shadow-lg shadow-[#0C5A5D]/20"
                    >
                        <Icons.Calendar size={18} /> حجز موعد
                    </button>
                    <button className="flex-1 bg-white border border-[#0C5A5D] text-[#0C5A5D] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0C5A5D]/5 transition-colors">
                        <Icons.MessageCircle size={18} /> استشارة نصية
                    </button>
                </div>
                {renderRegionSelection()}
                {renderBookingWizard()}
            </div>
        );
    }

    // --- FACILITY DETAILS VIEW COMPONENT ---
    if (selectedFacility) {
        return (
            <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-fade-in overflow-y-auto w-full max-w-md mx-auto shadow-2xl">
                <div className="relative h-64 w-full">
                    <img src={selectedFacility.image} alt={selectedFacility.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <button
                        onClick={() => setSelectedFacility(null)}
                        className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all"
                    >
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <div className="absolute bottom-4 right-4 text-white">
                        <h2 className="text-2xl font-black mb-1">{selectedFacility.name}</h2>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="bg-[#0C5A5D] px-2 py-0.5 rounded text-xs">{selectedFacility.type}</span>
                            <span className="flex items-center gap-1"><Icons.MapPin size={12} /> {selectedFacility.region}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 -mt-6 bg-white rounded-t-3xl relative z-10">
                    {/* Status & Rating Bar */}
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${selectedFacility.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${selectedFacility.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                {selectedFacility.status === 'open' ? 'مفتوح الآن' : 'مغلق'}
                            </div>
                            <div className="text-xs text-gray-500 font-bold flex items-center gap-1">
                                <Icons.Clock size={14} /> {selectedFacility.time}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-black text-gray-800">{selectedFacility.rating}</span>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Icons.Star key={i} size={14} className={i < Math.floor(selectedFacility.rating) ? "fill-current" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400">({selectedFacility.reviews})</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-2">عن المنشأة</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedFacility.description || 'لا يوجد وصف متاح حالياً لهذه المنشأة.'}
                        </p>
                    </div>

                    {/* Services */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-3">الخدمات المتوفرة</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedFacility.services ? selectedFacility.services.map((service, idx) => (
                                <span key={idx} className="bg-gray-50 text-[#0C5A5D] px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100">
                                    {service}
                                </span>
                            )) : (
                                selectedFacility.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100">
                                        {tag}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-20 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2.5 rounded-xl text-[#0C5A5D] shadow-sm">
                                <Icons.MapPin size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">المسافة</p>
                                <p className="text-xs text-gray-500">{selectedFacility.distance} من موقعك</p>
                            </div>
                        </div>
                        <button className="text-[#0C5A5D] text-xs font-bold hover:underline">عرض الخريطة</button>
                    </div>

                </div>

                {/* Floating Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 shadow-lg z-20 w-full max-w-md mx-auto">
                    <button
                        onClick={handleStartBooking}
                        className="flex-1 bg-[#0C5A5D] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a484b] transition-colors shadow-lg shadow-[#0C5A5D]/20"
                    >
                        <Icons.Calendar size={18} /> حجز موعد
                    </button>
                    <button className="flex-1 bg-white border border-[#0C5A5D] text-[#0C5A5D] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0C5A5D]/5 transition-colors">
                        <Icons.Phone size={18} /> اتصال
                    </button>
                </div>
                {renderRegionSelection()}
                {renderBookingWizard()}
            </div>
        );
    }

    // --- MAIN NETWORK VIEW ---
    return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col animate-fade-in w-full max-w-md mx-auto shadow-2xl">
            {/* Header & Map Container */}
            <div className="relative h-[38vh] bg-gray-200 w-full overflow-hidden">
                {/* Header Controls */}
                <div className="absolute top-0 left-0 right-0 p-4 z-20 flex flex-col gap-3 bg-gradient-to-b from-black/60 to-transparent pt-12">
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={onBack}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-gray-700 hover:bg-white transition-colors"
                        >
                            <Icons.ArrowLeft size={22} />
                        </button>

                        {/* Search Bar - Replaces placeholder icon */}
                        <div className="flex-1 mx-3 bg-white/95 backdrop-blur-sm h-11 rounded-full flex items-center justify-between shadow-lg pr-3 pl-1.5 transition-all">
                            <div className="flex items-center flex-1 min-w-0">
                                <Icons.Search className="text-gray-400 ml-2 shrink-0" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={viewMode === 'facilities' ? "ابحث عن مستشفى..." : "ابحث عن طبيب..."}
                                    className="w-full bg-transparent text-xs font-bold text-gray-800 placeholder-gray-500 focus:outline-none min-w-0"
                                />
                            </div>
                            <button 
                                onClick={() => setIsFilterOpen(true)}
                                className="bg-[#0C5A5D] text-white p-2 rounded-full hover:bg-[#0a484b] transition-colors shadow-sm active:scale-95 shrink-0"
                            >
                                <Icons.Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md flex gap-1">
                            <button
                                onClick={() => { setViewMode('facilities'); setActiveFilter('all'); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'facilities' ? 'bg-[#0C5A5D] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Icons.MapPin size={14} /> المنشآت
                            </button>
                            <button
                                onClick={() => { setViewMode('doctors'); setActiveFilter('all'); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'doctors' ? 'bg-[#0C5A5D] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Icons.User size={14} /> الأطباء
                            </button>
                            <button
                                onClick={() => { setViewMode('appointments'); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'appointments' ? 'bg-[#0C5A5D] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Icons.Calendar size={14} /> مواعيدي
                            </button>
                        </div>
                    </div>
                </div>

                {/* Interactive Map */}
                <div className="w-full h-full relative bg-[#e5e7eb]">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/000/153/588/original/vector-roadmap-location-map.jpg"
                        alt="Map View"
                        className="w-full h-full object-cover opacity-70 grayscale-[30%]"
                    />

                    {/* User Location Pulse */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-32 h-32 bg-[#0C5A5D]/10 rounded-full animate-ping"></div>
                            <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white z-10">
                                <Icons.User size={20} className="text-[#0C5A5D] fill-current" />
                            </div>
                            <div className="absolute -top-10 bg-white px-2 py-1 rounded shadow text-[10px] font-bold whitespace-nowrap">موقعك الحالي</div>
                        </div>
                    </div>

                    {/* Render Interactive Pins */}
                    {viewMode === 'facilities' ? (
                        filteredFacilities.map((facility) => (
                            <button
                                key={facility.id}
                                onClick={() => setSelectedFacility(facility)}
                                className="absolute transform -translate-x-1/2 -translate-y-full group z-0 hover:z-20 transition-all duration-300"
                                style={{ top: facility.mapPosition.top, left: facility.mapPosition.left }}
                            >
                                <div className="relative flex flex-col items-center">
                                    <div className={`bg-white p-1.5 rounded-full shadow-lg border-2 hover:scale-125 transition-transform ${selectedFacility?.id === facility.id ? 'border-[#0C5A5D] scale-125 z-30' : 'border-gray-400'}`}>
                                        {facility.category === 'hospitals' && <Icons.Building2 size={16} className="text-blue-500" />}
                                        {facility.category === 'pharmacy' && <Icons.Pill size={16} className="text-green-500" />}
                                        {facility.category === 'dental' && <Icons.Smile size={16} className="text-purple-500" />}
                                        {facility.category === 'physio' && <Icons.HeartPulse size={16} className="text-red-500" />}
                                        {facility.category === 'cosmetic' && <Icons.Sparkles size={16} className="text-pink-500" />}
                                        {!['hospitals', 'pharmacy', 'dental', 'physio', 'cosmetic'].includes(facility.category) && <Icons.MapPin size={16} className="text-[#0C5A5D]" />}
                                    </div>
                                    {/* Pin Tooltip */}
                                    <div className="bg-white px-2 py-1 rounded-md shadow-md mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full whitespace-nowrap pointer-events-none">
                                        <span className="text-[10px] font-bold text-gray-800 block">{facility.name}</span>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        filteredDoctors.map((doctor) => {
                            const facility = facilities.find(f => f.name === doctor.facility);
                            if (!facility) return null;
                            // Add slight random offset to prevent perfect overlap
                            const offsetTop = (doctor.id % 5) * 2;
                            const offsetLeft = (doctor.id % 3) * 2;

                            return (
                                <button
                                    key={doctor.id}
                                    onClick={() => setSelectedDoctor(doctor)}
                                    className="absolute transform -translate-x-1/2 -translate-y-full group z-0 hover:z-20 transition-all duration-300"
                                    style={{
                                        top: `calc(${facility.mapPosition.top} + ${offsetTop}px)`,
                                        left: `calc(${facility.mapPosition.left} + ${offsetLeft}px)`
                                    }}
                                >
                                    <div className="relative flex flex-col items-center">
                                        <div className="bg-white p-1 rounded-full shadow-lg border-2 border-[#0C5A5D] hover:scale-125 transition-transform overflow-hidden w-8 h-8">
                                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        {/* Pin Tooltip */}
                                        <div className="bg-white px-2 py-1 rounded-md shadow-md mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full whitespace-nowrap pointer-events-none z-50">
                                            <span className="text-[10px] font-bold text-gray-800 block">{doctor.name}</span>
                                            <span className="text-[8px] text-gray-500 block">{doctor.specialty}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Bottom Sheet / List Content */}
            <div className="flex-1 bg-gray-50 -mt-6 rounded-t-[2.5rem] relative z-10 flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.15)]">

                {/* Handle Bar */}
                <div className="w-full flex justify-center pt-4 pb-2">
                    <div className="w-14 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                {/* Region Selector */}
                <div className="px-5 py-2">
                    <button
                        onClick={() => setIsRegionSelectionOpen(true)}
                        className="w-full bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative group hover:border-[#0C5A5D]/30 transition-colors text-right"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="bg-[#0C5A5D]/10 p-2 rounded-xl text-[#0C5A5D]">
                                <Icons.MapPin size={20} />
                            </div>
                            <div className="flex-1 relative">
                                <span className="text-[10px] text-gray-400 block font-bold mb-0.5">المنطقة المختارة</span>
                                <span className="w-full bg-transparent font-black text-gray-800 text-sm py-1 block">
                                    {regions.find(r => r.id === selectedRegion)?.name || 'جميع المناطق'}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-1.5 rounded-lg">
                            <Icons.ChevronLeft size={16} className="-rotate-90 text-gray-500" />
                        </div>
                    </button>
                </div>

                {/* Categories / Filters */}
                <div className="px-5 mb-2">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 pt-1">
                        {(viewMode === 'facilities' ? filters : doctorFilters).map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => toggleFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap text-xs font-bold transition-all border ${activeFilter.includes(filter.id)
                                    ? 'bg-[#0C5A5D] text-white border-[#0C5A5D] shadow-md shadow-[#0C5A5D]/20 scale-105'
                                    : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                                    }`}
                            >
                                {filter.icon}
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Header & Sort Options */}
                <div className="px-6 pb-3 flex justify-between items-center border-b border-gray-100 mx-5 mb-3">
                    <span className="text-xs font-bold text-gray-400">
                        نتائج: <span className="text-gray-800">{viewMode === 'facilities' ? filteredFacilities.length : filteredDoctors.length}</span>
                    </span>

                    <div className="flex gap-2">
                        {/* Sort by Newest */}
                        <button
                            onClick={() => setSortBy(sortBy === 'newest' ? 'default' : 'newest')}
                            className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors ${sortBy === 'newest'
                                ? 'bg-[#0C5A5D] text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Icons.Clock size={12} /> الأحدث
                        </button>

                        {/* Sort by Distance - Only for Facilities */}
                        {viewMode === 'facilities' && (
                            <button
                                onClick={() => setSortBy('distance')}
                                className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors ${sortBy === 'distance'
                                    ? 'bg-[#0C5A5D] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Icons.MapPin size={12} /> الأقرب
                            </button>
                        )}

                        {/* Sort by Rating */}
                        <button
                            onClick={() => setSortBy('rating')}
                            className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-colors ${sortBy === 'rating'
                                ? 'bg-yellow-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Icons.Star size={12} /> التقييم
                        </button>
                    </div>
                </div>

                {/* Facilities / Doctors List */}
                <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4 custom-scrollbar">
                    {viewMode === 'facilities' ? (
                        filteredFacilities.length > 0 ? (
                            filteredFacilities.map((facility) => (
                                <div
                                    key={facility.id}
                                    onClick={() => setSelectedFacility(facility)}
                                    className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 relative group overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                                >

                                    {/* Status Badge Absolute */}
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold z-10 shadow-sm ${facility.status === 'open'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-red-100 text-red-600 border border-red-200'
                                        }`}>
                                        {facility.status === 'open' ? 'مفتوح الآن' : 'مغلق'}
                                    </div>

                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-100 relative">
                                            <img src={facility.image} alt={facility.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 py-1">
                                            <h3 className="text-base font-black text-gray-900 leading-tight mb-1">{facility.name}</h3>
                                            <p className="text-xs text-gray-500 font-bold mb-2 flex items-center gap-1">
                                                <span className="text-[#0C5A5D]">{facility.type}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>{facility.region}</span>
                                            </p>

                                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold mb-3">
                                                <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100 text-yellow-700">
                                                    <span className="text-sm pt-0.5">{facility.rating}</span>
                                                    <Icons.Star size={10} className="fill-yellow-500 text-yellow-500" />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Icons.MapPin size={12} className="text-gray-300" />
                                                    {facility.distance}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Icons.Clock size={12} className="text-gray-300" />
                                                    {facility.time}
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1">
                                                {facility.tags.map((tag, i) => (
                                                    <span key={i} className="bg-gray-50 text-gray-400 px-2 py-0.5 rounded-md text-[9px] font-bold border border-gray-100">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="mt-4 pt-3 border-t border-gray-50 grid grid-cols-4 gap-1.5">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStartBooking(); }}
                                            className="bg-[#0C5A5D] hover:bg-[#0a484b] text-white py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-sm shadow-[#0C5A5D]/10"
                                        >
                                            <Icons.Calendar size={14} className="text-cyan-200" />
                                            <span className="text-[9px] font-bold">حجز</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearchQuery(facility.name);
                                                setViewMode('doctors');
                                            }}
                                            className="bg-white border border-[#0C5A5D]/20 text-[#0C5A5D] hover:bg-[#0C5A5D]/5 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                                        >
                                            <Icons.Stethoscope size={14} />
                                            <span className="text-[9px] font-bold">استشارةعاجلة</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearchQuery(facility.name);
                                                setViewMode('doctors');
                                            }}
                                            className="bg-white border border-[#0C5A5D]/20 text-[#0C5A5D] hover:bg-[#0C5A5D]/5 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                                        >
                                            <Icons.Users size={14} />
                                            <span className="text-[9px] font-bold">الأطباء</span>
                                        </button>
                                        <button className="bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95">
                                            <Icons.MapPin size={14} />
                                            <span className="text-[9px] font-bold">اتجاه</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center opacity-70">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                    <Icons.Search size={32} />
                                </div>
                                <h3 className="text-gray-800 font-bold text-base">لا توجد منشآت مطابقة</h3>
                                <p className="text-xs text-gray-500 mt-2 max-w-[200px]">حاول تغيير الفلتر أو المنطقة للبحث في نطاق أوسع</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-4 text-[#0C5A5D] font-bold text-xs underline"
                                >
                                    إعادة تعيين الفلاتر
                                </button>
                            </div>
                        )
                    ) : (
                        // DOCTORS LIST
                        filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    onClick={() => setSelectedDoctor(doctor)}
                                    className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 relative group overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 relative">
                                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-base font-black text-gray-900 leading-tight mb-1">{doctor.name}</h3>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100 text-yellow-700 text-[10px] font-bold">
                                                    <span className="pt-0.5">{doctor.rating}</span>
                                                    <Icons.Star size={10} className="fill-yellow-500 text-yellow-500" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#0C5A5D] font-bold mb-1">{doctor.subSpecialty}</p>
                                            <p className="text-[10px] text-gray-400 font-bold mb-2 flex items-center gap-1">
                                                <Icons.Building2 size={10} /> {doctor.facility}
                                            </p>

                                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Icons.Clock size={12} className="text-green-500" />
                                                    {doctor.availability}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Icons.CreditCard size={12} className="text-gray-300" />
                                                    {doctor.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="mt-2 pt-3 border-t border-gray-50 grid grid-cols-2 gap-2">
                                        <button className="bg-[#0C5A5D] hover:bg-[#0a484b] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#0C5A5D]/20 active:scale-95">
                                            <Icons.Calendar size={14} className="text-cyan-200" />
                                            حجز موعد
                                        </button>
                                        <button className="bg-white border border-[#0C5A5D] text-[#0C5A5D] hover:bg-[#0C5A5D]/5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-95">
                                            <Icons.MessageCircle size={14} />
                                            استشارة
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center opacity-70">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                    <Icons.UserX size={32} />
                                </div>
                                <h3 className="text-gray-800 font-bold text-base">لا يوجد أطباء مطابقين</h3>
                                <p className="text-xs text-gray-500 mt-2 max-w-[200px]">حاول تغيير التخصص أو البحث باسم آخر</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-4 text-[#0C5A5D] font-bold text-xs underline"
                                >
                                    إعادة تعيين الفلاتر
                                </button>
                            </div>
                        )
                    )}

                    {/* APPOINTMENTS LIST */}
                    {viewMode === 'appointments' && (
                        <div className="space-y-4 pt-2">
                            {myAppointments.length > 0 ? (
                                myAppointments.map((apt) => (
                                    <div key={apt.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 relative group overflow-hidden">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                                                <img src={apt.image} alt={apt.doctorName} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 py-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-base font-black text-gray-900 leading-tight mb-1">{apt.doctorName}</h3>
                                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold">مؤكد</span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-bold mb-2 flex items-center gap-1">
                                                    <Icons.Building2 size={12} /> {apt.facility}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-[#0C5A5D] font-bold">
                                                    <div className="flex items-center gap-1">
                                                        <Icons.Calendar size={14} /> {apt.date}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Icons.Clock size={14} /> {apt.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                                            <button className="flex-1 bg-[#0C5A5D] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#0a484b] transition-colors">
                                                تفاصيل الموعد
                                            </button>
                                            <button
                                                onClick={() => setAppointmentToCancel(apt.id)}
                                                className="px-4 bg-red-50 text-red-600 border border-red-100 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center opacity-70">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <Icons.Calendar size={32} />
                                    </div>
                                    <h3 className="text-gray-800 font-bold text-base">لا توجد مواعيد قادمة</h3>
                                    <p className="text-xs text-gray-500 mt-2">يمكنك حجز موعد جديد من قائمة الأطباء</p>
                                    <button
                                        onClick={() => setViewMode('doctors')}
                                        className="mt-4 text-[#0C5A5D] font-bold text-xs underline"
                                    >
                                        احجز موعد الآن
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* CANCEL CONFIRMATION MODAL */}
            {appointmentToCancel && (
                <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <Icons.AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-center text-gray-900 mb-2">هل أنت متأكد؟</h3>
                        <p className="text-center text-gray-500 text-sm mb-6">
                            هل تريد حقاً إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setMyAppointments(prev => prev.filter(a => a.id !== appointmentToCancel));
                                    setAppointmentToCancel(null);
                                }}
                                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                            >
                                نعم، إلغاء الموعد
                            </button>
                            <button
                                onClick={() => setAppointmentToCancel(null)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                تراجع
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {renderRegionSelection()}
            {renderCitySelection()}
            {renderFilterOverlay()}
            {renderBookingWizard()}
        </div>
    );
};

export default MedicalNetwork;