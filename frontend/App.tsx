import React, { useState } from 'react';
import EntryScreen from './components/EntryScreen';
import VisitorApp from './components/VisitorApp';
import SubscriberApp from './components/SubscriberApp';

type AppView = 'entry' | 'visitor' | 'subscriber';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('entry');
  const [userData, setUserData] = useState<any>(null);

  const handleSubscriberLogin = (data: any) => {
    setUserData(data);
    setCurrentView('subscriber');
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-200 font-cairo" dir="rtl">
      
      {currentView === 'entry' && (
        <EntryScreen onSelect={(type, data) => {
            if (type === 'subscriber' && data) {
                handleSubscriberLogin(data);
            } else {
                setCurrentView(type);
            }
        }} />
      )}

      {currentView === 'visitor' && (
        <VisitorApp onSwitch={() => setCurrentView('entry')} />
      )}

      {currentView === 'subscriber' && (
        <SubscriberApp 
            userData={userData} 
            onSwitch={() => setCurrentView('entry')} 
        />
      )}

    </div>
  );
}

export default App;