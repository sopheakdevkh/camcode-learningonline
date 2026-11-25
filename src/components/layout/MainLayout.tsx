import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicFooter } from './PublicFooter';
import { PublicHeader } from './PublicHeader';

const AUTH_PATHS = new Set(['/login', '/register', '/forgot-password', '/reset-password']);

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const hideChrome = AUTH_PATHS.has(pathname);

  return (
    <>
      <div aria-hidden="true" className="grid-floor" />
      <div className="landing-page relative min-h-screen flex flex-col text-[var(--text-main)]">
        <div aria-hidden="true" className="bg-environment" />
        {!hideChrome && <PublicHeader />}
        <main className="relative z-10 w-full flex-1">
          <Outlet />
        </main>
        {!hideChrome && <PublicFooter />}
      </div>
    </>
  );
};
