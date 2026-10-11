import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

export default function Layout({ children }) {
  const { user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="os-layout">
      {/* Universal Sidebar */}
      <Sidebar 
        user={user}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="os-main-content">
        {/* Optional Universal Topbar could go here, or handled per-page */}
        {children}
      </main>

      {/* Global Modals */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  );
}
