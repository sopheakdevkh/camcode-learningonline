import React from 'react';
import { Outlet } from 'react-router-dom';
import { FloatingTelegramButton } from './FloatingTelegramButton';
import { PublicFooter } from './PublicFooter';
import { PublicHeader } from './PublicHeader';

export const MainLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#f6f3ec] dark:bg-[#101412] text-[#141312] dark:text-[#f6f3ec]">
      <PublicHeader />
      <main className="relative z-10 w-full flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <FloatingTelegramButton />
    </div>
  );
};
