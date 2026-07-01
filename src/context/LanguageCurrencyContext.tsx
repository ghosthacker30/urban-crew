'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'it';
export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

interface CurrencyConfig {
  symbol: string;
  rate: number; // conversion rate from USD
}

export const currencies: Record<Currency, CurrencyConfig> = {
  USD: { symbol: '$', rate: 1.0 },
  INR: { symbol: '₹', rate: 83.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
};

// Simplified translation dictionaries for key UI text
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About Us',
    menu: 'Menu',
    offers: 'Offers',
    reservations: 'Reservations',
    gallery: 'Gallery',
    events: 'Events',
    blog: 'Blog',
    contact: 'Contact',
    careers: 'Careers',
    cart: 'Cart',
    admin: 'Admin Panel',
    // Hero
    heroTitle: 'Fresh Coffee. Fresh Moments.',
    heroSubtitle: 'Sip into luxury with our masterfully roasted single-origin coffees and artisanal pastries. Experience the perfect blend of warmth and flavor in every cup.',
    orderNow: 'Order Now',
    reserveTable: 'Reserve Table',
    viewMenu: 'View Menu',
    // Cart/Order labels
    addToCart: 'Add to Cart',
    addedToCart: 'Added!',
    wishlist: 'Wishlist',
    customize: 'Customize',
    checkout: 'Proceed to Checkout',
    subtotal: 'Subtotal',
    tax: 'Tax',
    delivery: 'Delivery Charge',
    total: 'Total',
  },
  es: {
    // Navigation
    home: 'Inicio',
    about: 'Nosotros',
    menu: 'Menú',
    offers: 'Ofertas',
    reservations: 'Reservas',
    gallery: 'Galería',
    events: 'Eventos',
    blog: 'Blog',
    contact: 'Contacto',
    careers: 'Carreras',
    cart: 'Carrito',
    admin: 'Administrador',
    // Hero
    heroTitle: 'Café Fresco. Momentos Frescos.',
    heroSubtitle: 'Sumérgete en el lujo con nuestros cafés de origen único tostados con maestría y repostería artesanal. Experimenta la mezcla perfecta de calidez y sabor.',
    orderNow: 'Pedir Ahora',
    reserveTable: 'Reservar Mesa',
    viewMenu: 'Ver Menú',
    // Cart/Order labels
    addToCart: 'Añadir al Carrito',
    addedToCart: '¡Añadido!',
    wishlist: 'Lista de deseos',
    customize: 'Personalizar',
    checkout: 'Proceder al Pago',
    subtotal: 'Subtotal',
    tax: 'Impuesto',
    delivery: 'Costo de envío',
    total: 'Total',
  },
  it: {
    // Navigation
    home: 'Home',
    about: 'Chi Siamo',
    menu: 'Menu',
    offers: 'Offerte',
    reservations: 'Prenotazioni',
    gallery: 'Galleria',
    events: 'Eventi',
    blog: 'Blog',
    contact: 'Contatti',
    careers: 'Carriere',
    cart: 'Carrello',
    admin: 'Amministratore',
    // Hero
    heroTitle: 'Caffè Fresco. Momenti Freschi.',
    heroSubtitle: 'Sorseggia il lusso con i nostri caffè monorigine tostati a regola d\'arte e i nostri dolci artigianali. Sperimenta la miscela perfetta in ogni tazza.',
    orderNow: 'Ordina Ora',
    reserveTable: 'Prenota Tavolo',
    viewMenu: 'Vedi Menu',
    // Cart/Order labels
    addToCart: 'Aggiungi al Carrello',
    addedToCart: 'Aggiunto!',
    wishlist: 'Lista dei Desideri',
    customize: 'Personalizza',
    checkout: 'Procedi al Pagamento',
    subtotal: 'Subtotale',
    tax: 'Tasse',
    delivery: 'Spese di Consegna',
    total: 'Totale',
  },
};

interface LanguageCurrencyContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (cur: Currency) => void;
  t: (key: string) => string;
  formatPrice: (usdPrice: number) => string;
}

const LanguageCurrencyContext = createContext<LanguageCurrencyContextType | undefined>(undefined);

export function LanguageCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [currency, setCurrencyState] = useState<Currency>('INR');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    const savedCurr = localStorage.getItem('currency') as Currency | null;
    if (savedLang) setLanguageState(savedLang);
    if (savedCurr) setCurrencyState(savedCurr);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    localStorage.setItem('currency', cur);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const formatPrice = (usdPrice: number): string => {
    const config = currencies[currency];
    const convertedPrice = usdPrice * config.rate;
    // Formatter based on currency
    const decimalPlaces = currency === 'INR' ? 0 : 2;
    return `${config.symbol}${convertedPrice.toFixed(decimalPlaces)}`;
  };

  return (
    <LanguageCurrencyContext.Provider value={{ language, currency, setLanguage, setCurrency, t, formatPrice }}>
      {children}
    </LanguageCurrencyContext.Provider>
  );
}

export function useLanguageCurrency() {
  const context = useContext(LanguageCurrencyContext);
  if (!context) {
    throw new Error('useLanguageCurrency must be used within a LanguageCurrencyProvider');
  }
  return context;
}
