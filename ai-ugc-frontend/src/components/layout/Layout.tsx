import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#2d2d4a] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#64748b] text-sm">
              &copy; {new Date().getFullYear()} AI UGC. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[#64748b] hover:text-white text-sm transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-[#64748b] hover:text-white text-sm transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-[#64748b] hover:text-white text-sm transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
