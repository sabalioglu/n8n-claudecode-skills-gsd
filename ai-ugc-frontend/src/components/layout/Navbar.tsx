import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { formatCredits } from '../../lib/utils';
import {
  Sparkles,
  Video,
  LayoutDashboard,
  LogOut,
  CreditCard,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[#2d2d4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI UGC</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/generate"
                className="flex items-center gap-2 px-4 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
              >
                <Video className="w-4 h-4" />
                Generate
              </Link>
              <Link
                to="/videos"
                className="flex items-center gap-2 px-4 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                My Videos
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Credits */}
                <Link
                  to="/credits"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] border border-[#2d2d4a] rounded-lg hover:border-[#3d3d5a] transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span className="text-white font-medium">
                    {formatCredits(profile?.credits || 0)}
                  </span>
                  <span className="text-[#64748b] text-sm">credits</span>
                </Link>

                {/* User Menu */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-[#94a3b8] hover:text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2d2d4a]">
            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/generate"
                className="flex items-center gap-2 px-4 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Video className="w-4 h-4" />
                Generate
              </Link>
              <Link
                to="/videos"
                className="flex items-center gap-2 px-4 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4" />
                My Videos
              </Link>
              <Link
                to="/credits"
                className="flex items-center gap-2 px-4 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CreditCard className="w-4 h-4" />
                Buy Credits ({formatCredits(profile?.credits || 0)})
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
