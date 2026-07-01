'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Coffee, ShoppingBag, User, Globe, Menu, X, Sun, Moon, LogOut, ShieldCheck, Heart 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguageCurrency, Language, Currency } from '@/context/LanguageCurrencyContext';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, currency, setLanguage, setCurrency, t } = useLanguageCurrency();
  const { cart, wishlist } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [userSession, setUserSession] = useState<{ name: string; role: 'USER' | 'ADMIN'; email: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ub_session');
    if (savedUser) {
      setUserSession(JSON.parse(savedUser));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ub_session');
    setUserSession(null);
    setUserDropdownOpen(false);
    window.location.reload();
  };

  const navLinks = [
    { name: t('home'), href: '/home' },
    { name: t('about'), href: '/about' },
    { name: t('menu'), href: '/menu' },
    { name: t('offers'), href: '/offers' },
    { name: t('reservations'), href: '/reservations' },
    { name: t('gallery'), href: '/gallery' },
    { name: t('blog'), href: '/blog' },
    { name: t('contact'), href: '/contact' },
  ];

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-[#150c0a]/90 dark:bg-[#110908]/90 backdrop-blur-md border-accent-gold/15 py-3.5 shadow-md' 
          : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group lg:-ml-3">
              <div className="h-8.5 w-8.5 bg-accent-gold/15 border border-accent-gold/40 rounded-full flex items-center justify-center group-hover:bg-accent-gold group-hover:rotate-12 transition-all duration-500 shadow-inner">
                <Coffee className="h-4 w-4 text-accent-gold group-hover:text-primary-dark transition-colors" />
              </div>
              <span className="font-serif text-xs sm:text-sm font-black tracking-[0.22em] text-primary-cream uppercase flex items-center">
                Urban<span className="text-accent-gold font-sans font-light lowercase tracking-wider pl-0.5">brew</span>
                <span className="text-accent-gold text-[7px] font-sans align-super ml-0.5 font-bold">®</span>
              </span>
            </Link>

            {/* Desktop Nav - Minimal visual pills */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`text-[10px] uppercase font-bold tracking-widest px-3.5 py-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-accent-gold text-primary-dark shadow-sm' 
                        : 'text-primary-cream/70 hover:text-accent-gold hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions / Icons */}
            <div className="hidden lg:flex items-center space-x-4 text-primary-cream">
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2 text-primary-cream/70 hover:text-accent-gold hover:bg-white/5 rounded-xl transition"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-accent-gold" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {/* Settings Dropdown (Unified Language & Currency) */}
              <div className="relative">
                <button 
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold tracking-wider border border-white/10 hover:border-accent-gold/45 transition"
                >
                  <Globe className="h-4 w-4 text-accent-gold" />
                  <span className="uppercase">{language} / {currency}</span>
                </button>
                
                {settingsOpen && (
                  <div className="absolute right-0 mt-2.5 w-48 bg-[#1a100e] border border-accent-gold/20 rounded-2xl shadow-xl py-3 z-50 text-xs space-y-3 p-3">
                    {/* Language Segment */}
                    <div className="space-y-1">
                      <span className="block text-[8px] font-black uppercase text-accent-gold tracking-widest px-2">Language</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['en', 'es', 'it'] as Language[]).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => { setLanguage(lang); setSettingsOpen(false); }}
                            className={`py-1 text-center rounded-lg font-bold transition text-[9px] uppercase ${
                              language === lang 
                                ? 'bg-accent-gold text-primary-dark' 
                                : 'bg-white/5 hover:bg-white/10 text-white'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Currency Segment */}
                    <div className="space-y-1">
                      <span className="block text-[8px] font-black uppercase text-accent-gold tracking-widest px-2">Currency</span>
                      <div className="grid grid-cols-2 gap-1">
                        {(['USD', 'INR', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                          <button
                            key={curr}
                            onClick={() => { setCurrency(curr); setSettingsOpen(false); }}
                            className={`py-1 text-center rounded-lg font-bold transition text-[9px] ${
                              currency === curr 
                                ? 'bg-accent-gold text-primary-dark' 
                                : 'bg-white/5 hover:bg-white/10 text-white'
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist Link */}
              <Link 
                href="/menu?filter=wishlist" 
                className="relative p-2 text-primary-cream/70 hover:text-accent-gold hover:bg-white/5 rounded-xl transition"
                title="Wishlist"
              >
                <Heart className="h-4.5 w-4.5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center animate-bounce">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Toggle */}
              <button 
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 bg-accent-gold/15 border border-accent-gold/40 hover:bg-accent-gold text-accent-gold hover:text-primary-dark rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <ShoppingBag className="h-4.5 w-4.5 shrink-0" />
                <span className="text-[10px] font-black tracking-widest uppercase">Cart</span>
                {totalCartItems > 0 && (
                  <span className="bg-primary-dark text-accent-gold rounded-full text-[9px] font-extrabold h-4.5 w-4.5 flex items-center justify-center border border-accent-gold">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Auth Panel */}
              <div className="relative">
                {userSession ? (
                  <>
                    <button 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-1.5 py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-gold/45 rounded-xl transition"
                    >
                      <User className="h-4 w-4 text-accent-gold" />
                      <span className="text-[10px] font-semibold max-w-[80px] truncate uppercase tracking-wider">{userSession.name}</span>
                    </button>
                    
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#1a100e] border border-accent-gold/20 rounded-2xl shadow-xl py-1 z-50 text-xs">
                        {userSession.role === 'ADMIN' && (
                          <Link 
                            href="/admin" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2.5 hover:bg-accent-gold hover:text-primary-dark text-white font-medium"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            <span>{t('admin')}</span>
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 hover:bg-red-650 hover:text-white text-red-400 flex items-center space-x-2 font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href="/auth/login"
                    className="flex items-center space-x-1.5 bg-accent-gold text-primary-dark py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition shadow-sm hover:scale-[1.02]"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Actions / Toggle Menu */}
            <div className="flex lg:hidden items-center space-x-3 text-primary-cream">
              <button 
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-1.5 bg-accent-gold text-primary-dark rounded-full shadow"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-dark text-accent-gold rounded-full text-[8px] font-bold h-4 w-4 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 bg-white/5 border border-white/10 hover:border-accent-gold rounded-xl transition"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#150c0a] border-t border-white/5 animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-3 pb-6 space-y-1.5 sm:px-3 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 hover:text-accent-gold ${
                    pathname === link.href ? 'text-accent-gold bg-white/5' : 'text-primary-cream/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/5 flex justify-center items-center space-x-6">
                <button onClick={toggleTheme} className="p-2 hover:bg-white/5 rounded-xl">
                  {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-accent-gold" /> : <Moon className="h-4.5 w-4.5 text-white" />}
                </button>
                
                {userSession ? (
                  <>
                    {userSession.role === 'ADMIN' && (
                      <Link 
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center space-x-1 px-3.5 py-1.5 bg-accent-gold text-primary-dark rounded-xl text-[10px] font-bold uppercase tracking-wider"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3.5 py-1.5 bg-red-600/80 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center space-x-1 px-4 py-1.5 bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}
