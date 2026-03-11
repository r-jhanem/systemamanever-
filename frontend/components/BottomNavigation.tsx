import React from 'react';
import { Icons } from './Icons';
import { NavItem } from '../types';

const BottomNavigation: React.FC = () => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'الرئيسية', icon: <Icons.Home size={20} />, isActive: true },
    { id: 'cashback', label: 'برنامج الكاش باك', icon: <Icons.Gem size={20} /> },
    { id: 'points', label: 'محفظة النقاط', icon: <Icons.Wallet size={20} /> },
    { id: 'membership', label: 'طلب عضوية', icon: <Icons.PlusCircle size={24} /> }, // Center item
    { id: 'bookings', label: 'الحجوزات', icon: <Icons.Calendar size={20} /> },
    { id: 'store', label: 'المتجر', icon: <Icons.ShoppingBag size={20} /> },
    { id: 'account', label: 'حسابي', icon: <Icons.User size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 max-w-md mx-auto">
      <div className="flex justify-between items-end">
        {navItems.map((item) => {
           const isCenter = item.id === 'membership';
           return (
            <button 
                key={item.id}
                className={`flex flex-col items-center justify-center w-full pb-2 ${isCenter ? '-mt-6' : ''}`}
            >
                {/* Changed active color to #0C5A5D */}
                <div className={`transition-all duration-300 flex flex-col items-center ${
                    item.isActive 
                    ? 'text-[#0C5A5D] scale-110 drop-shadow-sm' 
                    : 'text-gray-400 hover:text-[#0C5A5D] hover:scale-105'
                }`}>
                    <div className={`${
                        isCenter 
                        ? 'bg-[#0C5A5D] text-white p-3 rounded-full shadow-lg border-4 border-gray-100 mb-1' 
                        : 'mb-1'
                    }`}>
                        {item.icon}
                    </div>
                    <span className={`text-[9px] font-bold ${isCenter ? 'text-[#0C5A5D]' : ''} text-center leading-tight px-0.5`}>
                        {item.label}
                    </span>
                    {item.isActive && !isCenter && (
                        <div className="w-1 h-1 bg-[#0C5A5D] rounded-full mt-1"></div>
                    )}
                </div>
            </button>
           );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;