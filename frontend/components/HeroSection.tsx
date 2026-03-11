import React from 'react';
import { Icons } from './Icons';

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full h-60 bg-gray-50 overflow-hidden rounded-b-3xl shadow-md">

      <img
        src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop"
        alt="Medical Banner"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

      {/* Search + Filter */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2">

        {/* Search Bar */}
        <div className="flex items-center flex-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
          <Icons.Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="ابحث عن مستشفى، عيادة..."
            className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-700"
          />
        </div>

        {/* Filter Icon */}
        <button className="bg-[#0C5A5D] text-white p-3 rounded-full shadow-lg hover:bg-[#0a484b] active:scale-90">
          <Icons.Filter className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default HeroSection;