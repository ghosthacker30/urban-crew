import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageCurrencyProvider } from '@/context/LanguageCurrencyContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChatAssistant from '@/components/AIChatAssistant';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Urban Brew Café | Fresh Coffee. Fresh Moments.',
  description: 'Experience luxury coffee and artisanal delicacies at Urban Brew Café. Explore our organic menu, reserve tables, and order online for gourmet moments.',
  keywords: 'coffee, cafe, premium coffee, espresso, latte art, reservation, bakery, croissants, urban brew, luxury cafe',
  authors: [{ name: 'Urban Brew Team' }],
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-primary-cream dark:bg-[#1C110E] text-primary-dark dark:text-primary-cream font-sans transition-colors duration-300">
        <ThemeProvider>
          <LanguageCurrencyProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-20">{children}</main>
                <Footer />
                <AIChatAssistant />
              </div>
            </CartProvider>
          </LanguageCurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
