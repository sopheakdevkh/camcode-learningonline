import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FloatingTelegramButton } from './FloatingTelegramButton';
import { PublicFooter } from './PublicFooter';
import { PublicHeader } from './PublicHeader';

const AUTH_PATHS = new Set(['/login', '/register', '/forgot-password', '/reset-password']);

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const hideChrome = AUTH_PATHS.has(pathname);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f6f3ec] dark:bg-[#101412] text-[#141312] dark:text-[#f6f3ec]">
      {!hideChrome && <PublicHeader />}
      <main className="relative z-10 w-full flex-1">
        <Outlet />
      </main>
      {!hideChrome && <PublicFooter />}
      {!hideChrome && <FloatingTelegramButton />}
    </div>
  );
};
