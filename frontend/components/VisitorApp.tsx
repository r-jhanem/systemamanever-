import React, { useState } from 'react';
import TopBanner from './TopBanner';
import HeroSection from './HeroSection';
import QuickAccess from './QuickAccess';
import CircularServices from './CircularServices';
import PromoCard from './PromoCard';
import ExtendedHomeContent from './ExtendedHomeContent';
import BottomNavigation from './BottomNavigation';
import AIModal from './AIModal';
import UrgentFab from './UrgentFab';
import AccessibilityModal from './AccessibilityModal';
import MedicalNetwork from './MedicalNetwork';
import { Icons } from './Icons';

interface VisitorAppProps {
  onSwitch: () => void;
}

const VisitorApp: React.FC<VisitorAppProps> = ({ onSwitch }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);

  return (
    <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative mx-auto animate-fade-in">
      
      {/* Full Screen Overlays */}
      {isNetworkOpen && (
        <MedicalNetwork onBack={() => setIsNetworkOpen(false)} />
      )}

      {/* Header with Back Button */}
      <div className="relative">
        <TopBanner onOpenAccessibility={() => setIsAccessibilityOpen(true)} />
        <button 
            onClick={onSwitch}
            className="absolute top-2 left-14 text-white/80 hover:text-white text-[10px] font-bold bg-white/10 px-2 py-1 rounded-md z-30"
        >
            <Icons.ArrowLeft size={12} className="inline ml-1" />
            تغيير الواجهة
        </button>
      </div>
      
      {/* Main Scrollable Content */}
      <main className="pb-20">
        
        <HeroSection />
        
        {/* Main Grid Buttons */}
        <QuickAccess 
            onAskDoctor={() => setIsAIModalOpen(true)} 
            onOpenNetwork={() => setIsNetworkOpen(true)}
        />
        
        {/* Circular Menu */}
        <CircularServices />
        
        {/* Advertisement Card */}
        <PromoCard />

        {/* New Content Sections (Offers, Providers, Packages, etc.) */}
        <ExtendedHomeContent />
        
      </main>

      {/* Floating Urgent Consultation Button */}
      <UrgentFab />

      {/* Bottom Sticky Navigation */}
      <BottomNavigation />

      {/* Gemini AI Modal */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
      
      {/* Accessibility Settings Modal */}
      <AccessibilityModal 
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

    </div>
  );
};

export default VisitorApp;