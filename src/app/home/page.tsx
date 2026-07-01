'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Coffee, Sparkles, MapPin, Phone, Clock, ArrowRight, 
  Star, ChevronRight, Award, Compass, Loader2
} from 'lucide-react';
import ProductCard, { ProductType } from '@/components/ProductCard';
import { useLanguageCurrency } from '@/context/LanguageCurrencyContext';

// Hardcoded products for fallback if database query fails or is empty initially
const fallbackProducts: ProductType[] = [
  {
    id: 'f1',
    name: 'Gold Flaked Espresso',
    price: 1.5,
    description: 'Our signature double shot of espresso topped with subtle 24k edible gold flakes. Elegant, rich, and highly aromatic, made from premium organic single-origin Arabica beans.',
    calories: 5,
    ingredients: 'Double shot espresso, 24k gold flakes, spring water',
    nutritionInfo: JSON.stringify({ carbs: '0g', fat: '0.2g', protein: '0.3g' }),
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f2',
    name: 'Urban Brew Cappuccino',
    price: 1.8,
    description: 'Perfect balance of rich espresso, steamed milk, and velvety smooth micro-foam, decorated with delicate award-winning barista leaf art.',
    calories: 120,
    ingredients: 'Organic espresso, Whole milk, Cocoa powder dusting',
    nutritionInfo: JSON.stringify({ carbs: '9g', fat: '5g', protein: '6g' }),
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'f3',
    name: 'Cold Brew Nitro Reserve',
    price: 2.0,
    description: 'Slow-steeped for 20 hours and infused with nitrogen. Pours a beautiful cascading head, offering a naturally sweet and creamy finish.',
    calories: 5,
    ingredients: 'Nitro cold brew, Filtered water',
    nutritionInfo: JSON.stringify({ carbs: '0g', fat: '0g', protein: '0.4g' }),
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f4',
    name: 'Iced Rose Pistachio Latte',
    price: 2.2,
    description: 'Premium espresso served over ice with cream, natural organic rosewater, crushed slow-roasted pistachios, and sweetened with light agave.',
    calories: 220,
    ingredients: 'Espresso, Milk, Rose extract, Crushed pistachios, Agave',
    nutritionInfo: JSON.stringify({ carbs: '24g', fat: '8g', protein: '7g' }),
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  }
];

export default function HomePage() {
  const router = useRouter();
  const { formatPrice } = useLanguageCurrency();

  const [authorized, setAuthorized] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 1. Enforce Authentication Redirect Check
  useEffect(() => {
    const session = localStorage.getItem('ub_session');
    if (!session) {
      router.push('/auth/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // 2. Load featured products from DB API
  useEffect(() => {
    if (!authorized) return;

    async function loadFeatured() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Filter to take top 4 highest rated products
          const sorted = data.sort((a: any, b: any) => b.rating - a.rating).slice(0, 4);
          setFeaturedProducts(sorted.length > 0 ? sorted : fallbackProducts);
        } else {
          setFeaturedProducts(fallbackProducts);
        }
      } catch (err) {
        console.warn('API error fetching featured products. Using fallbacks.', err);
        setFeaturedProducts(fallbackProducts);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadFeatured();
  }, [authorized]);

  // If not authenticated, show premium luxury spinner matching brand themes
  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#150c0a] text-white space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-accent-gold" />
        <span className="text-xs uppercase tracking-widest text-primary-cream/60 font-bold">Verifying Session...</span>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20 pt-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#150c0a] overflow-hidden rounded-b-[40px]">
        {/* Parallax background coffee image overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-35 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#150c0a]/70 via-[#150c0a]/90 to-[#1C110E]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-gold/15 border border-accent-gold/30 rounded-full text-accent-gold text-xs font-bold uppercase tracking-widest animate-bounce">
            <Sparkles className="h-3.5 w-3.5" />
            Voted #1 Coffee Brand of the Year
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white leading-none">
            Fresh Coffee.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-[#E1B83D] to-white">
              Fresh Moments.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-primary-cream/80 font-light leading-relaxed">
            Sip into luxury with our masterfully roasted single-origin coffees and artisanal pastries. Experience the perfect blend of warmth and flavor in every cup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/menu" 
              className="w-full sm:w-auto px-8 py-3.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-sm rounded-full transition shadow-xl hover:scale-105"
            >
              Order Now
            </Link>
            <Link 
              href="/reservations" 
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 hover:border-white text-white font-bold text-sm rounded-full transition hover:bg-white/5"
            >
              Reserve Table
            </Link>
          </div>
        </div>

        {/* Diagonal Wave Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[2px]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-primary-cream dark:fill-[#1C110E]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.43,83.1,22.81,151.13,38.21,222.42,47.16,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Guest Favorites</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white">
            Popular Coffee Crafts
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="h-60 flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-accent-gold" />
            <span className="text-xs font-medium text-primary-coffee/60 dark:text-white/40">Loading best-sellers...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/menu" 
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-primary-coffee dark:text-accent-gold hover:underline"
          >
            <span>View Full Menu</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 3. ROASTING PROCESS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">From Bean to Cup</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white">
            Our Roasting Mastercraft
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#201512] rounded-3xl overflow-hidden border border-primary-coffee/10 dark:border-white/5 shadow-sm group">
            <div className="h-64 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop" 
                alt="Organic Coffee Farm Sourcing" 
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 bg-primary-dark/80 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Step 1: Sourcing
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-serif font-bold text-base text-primary-coffee dark:text-white">100% Organic Micro-lots</h3>
              <p className="text-xs text-primary-coffee/75 dark:text-primary-cream/65 leading-relaxed font-light">
                We select volcanic soil farms situated above 1,800m elevations, guaranteeing dense beans rich with natural chocolatey profiles.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#201512] rounded-3xl overflow-hidden border border-primary-coffee/10 dark:border-white/5 shadow-sm group">
            <div className="h-64 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop" 
                alt="Precision Drum Roasting" 
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 bg-primary-dark/80 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Step 2: Roasting
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-serif font-bold text-base text-primary-coffee dark:text-white">Drum Roasting weekly</h3>
              <p className="text-xs text-primary-coffee/75 dark:text-primary-cream/65 leading-relaxed font-light">
                Beans are small-batch roasted weekly at exact thermal curves to caramelize organic sugars and eliminate acidic, bitter notes.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#201512] rounded-3xl overflow-hidden border border-primary-coffee/10 dark:border-white/5 shadow-sm group">
            <div className="h-64 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop" 
                alt="Artisanal Barista Pour" 
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 bg-primary-dark/80 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Step 3: Brewing
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-serif font-bold text-base text-primary-coffee dark:text-white">Award-Winning Latte Art</h3>
              <p className="text-xs text-primary-coffee/75 dark:text-primary-cream/65 leading-relaxed font-light">
                Our baristas brew to exact water-flow pressure weights and pour smooth micro-foamed rosettes into every luxury cup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-primary-coffee/5 dark:bg-black/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Our Philosophy</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white">
              Why Urban Brew is Different
            </h2>
            <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Award,
                title: 'Single-Origin Selection',
                desc: 'We import coffee directly from single-family micro-lots in Colombia, Ethiopia, and Sumatra. High elevations and volcanic soils give our drinks unique flavor profiles.'
              },
              {
                Icon: Compass,
                title: 'Barista Craftsmanship',
                desc: 'Every barista undergoes a rigorous 80-hour training course in milk texture physics, espresso water flow ratios, and custom flavor design.'
              },
              {
                Icon: Coffee,
                title: 'Roasting Precision',
                desc: 'We roast our coffee beans weekly in small batches at precise temperatures to bring out the natural berry, chocolate, and floral notes without bitterness.'
              }
            ].map((value, i) => (
              <div 
                key={i}
                className="p-8 bg-white dark:bg-[#201512] rounded-2xl border border-primary-coffee/10 dark:border-white/5 hover:border-accent-gold/40 transition shadow-sm text-center space-y-4 group"
              >
                <div className="p-4 bg-primary-cream dark:bg-white/5 inline-block rounded-full text-accent-gold group-hover:scale-110 transition duration-300">
                  <value.Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold font-serif text-primary-coffee dark:text-white">
                  {value.title}
                </h3>
                <p className="text-xs text-primary-coffee/70 dark:text-primary-cream/65 leading-relaxed font-light">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Testimonials</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white font-serif">
            What Coffee Lovers Say
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: 'Arjun Mehta',
              rating: 5,
              text: 'The Nitro Cold Brew is absolutely phenomenal! Smoother than silk with notes of blueberry. The ambiance of Urban Brew feels like a luxury resort in the middle of a busy city.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
            },
            {
              name: 'Sofia Rossi',
              rating: 5,
              text: 'Barista Tiramisu and Gold Flaked Espresso are a match made in heaven. The visual table reservations dashboard makes choosing window spots so easy. Recommended!',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
            }
          ].map((item, i) => (
            <div 
              key={i}
              className="p-6 sm:p-8 bg-white dark:bg-[#201512] rounded-2xl border border-primary-coffee/10 dark:border-white/5 flex gap-4 items-start shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'; }}
                className="w-14 h-14 rounded-full object-cover shrink-0 border border-accent-gold"
              />
              <div className="space-y-2">
                <div className="flex gap-1 text-accent-gold text-xs">
                  {Array.from({ length: item.rating }).map((_, st) => (
                    <Star key={st} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-primary-coffee/80 dark:text-primary-cream/70 italic leading-relaxed font-light">
                  "{item.text}"
                </p>
                <span className="block text-xs font-bold font-serif text-primary-coffee dark:text-white">
                  — {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INSTAGRAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Urban Brew Moments</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white font-serif">
            Instagram Feed
          </h2>
          <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop',
          ].map((url, index) => (
            <div key={index} className="h-60 overflow-hidden rounded-xl group relative cursor-pointer">
              <img 
                src={url} 
                alt="Instagram coffee feed" 
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                @urbanbrewcafe
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GOOGLE MAPS PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-dark dark:bg-[#201512] rounded-3xl overflow-hidden shadow-xl border border-white/5 flex flex-col lg:flex-row">
          <div className="lg:w-2/5 p-8 sm:p-12 space-y-6 text-white flex flex-col justify-center">
            <h3 className="font-serif text-2xl font-bold tracking-wide">Visit Our Sanctuary</h3>
            <p className="text-xs text-primary-cream/65 leading-relaxed font-light">
              Unwind in our modern, minimal salon. Grab a corner booth for meetings, a window-side couples stool, or sit at the master-bar with our roasters.
            </p>
            <div className="space-y-4 text-xs font-light">
              <div className="flex items-center gap-3.5">
                <MapPin className="h-5 w-5 text-accent-gold" />
                <span>456 Premium Brew Avenue, Luxury District</span>
              </div>
              <div className="flex items-center gap-3.5">
                <Phone className="h-5 w-5 text-accent-gold" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-3.5">
                <Clock className="h-5 w-5 text-accent-gold" />
                <span>Mon - Sun: 7:00 AM - 11:00 PM</span>
              </div>
            </div>
            <div className="pt-4">
              <Link 
                href="/reservations" 
                className="px-6 py-2.5 bg-accent-gold text-primary-dark font-black text-xs rounded-full hover:bg-accent-gold/90 transition inline-flex items-center gap-2"
              >
                <span>Reserve Table Spot</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:w-3/5 h-80 lg:h-auto min-h-[350px] relative bg-[#f1efe8]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617540458694!2d-73.98785312344795!3d40.74844047138908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              className="w-full h-full border-none filter grayscale contrast-125 dark:invert"
              loading="lazy"
              title="Google Map Locator"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
