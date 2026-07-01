'use client';

import React, { useState } from 'react';
import { Heart, ShoppingCart, Info, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguageCurrency } from '@/context/LanguageCurrencyContext';

export interface ProductType {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  calories: number;
  ingredients: string;
  nutritionInfo: string; // JSON string
  category: string;
  isAvailable: boolean;
  rating: number;
}

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { formatPrice, t } = useLanguageCurrency();
  const [showDetails, setShowDetails] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);

  // Customization choices
  const [size, setSize] = useState<'Regular' | 'Large' | 'Grande'>('Regular');
  const [milk, setMilk] = useState<'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'Soy Milk'>('Whole Milk');
  const [sweetness, setSweetness] = useState<'None' | 'Less' | 'Standard' | 'Extra'>('Standard');

  const isLiked = wishlist.includes(product.id);

  const handleQuickAdd = () => {
    // Add with default options
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      customization: { size: 'Regular', milk: 'Whole Milk', sweetness: 'Standard' }
    });
    triggerAddedEffect();
  };

  const handleCustomizedAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price + (size === 'Large' ? 0.75 : size === 'Grande' ? 1.50 : 0) + (milk !== 'Whole Milk' ? 0.50 : 0),
      image: product.image,
      customization: { size, milk, sweetness }
    });
    setShowCustomizer(false);
    triggerAddedEffect();
  };

  const triggerAddedEffect = () => {
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 2000);
  };

  const nutritionMap = JSON.parse(product.nutritionInfo || '{}');

  return (
    <>
      <div className="luxury-card-gradient border border-primary-coffee/10 dark:border-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col group relative">
        
        {/* Organic Tag */}
        {product.price >= 6.0 && (
          <span className="absolute top-3 left-3 bg-accent-gold text-primary-dark text-[9px] font-black tracking-widest uppercase py-1 px-2 rounded-full z-10 flex items-center gap-1 shadow">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Organic
          </span>
        )}

        {/* Thumbnail Image */}
        <div className="relative h-48 overflow-hidden shrink-0 bg-primary-cream">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop'; }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Action overlay buttons */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
            <button 
              onClick={() => setShowDetails(true)}
              className="p-2.5 bg-white text-primary-dark rounded-full hover:bg-accent-gold transition shadow-md"
              title="Nutrition details"
            >
              <Info className="h-4.5 w-4.5" />
            </button>
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`p-2.5 rounded-full shadow-md transition ${
                isLiked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-primary-dark hover:bg-red-500 hover:text-white'
              }`}
              title="Add to wishlist"
            >
              <Heart className="h-4.5 w-4.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-coffee/60 dark:text-accent-gold/80">
                {product.category}
              </span>
              <div className="flex items-center text-xs font-bold text-accent-gold">
                ★ {product.rating.toFixed(1)}
              </div>
            </div>
            
            <h3 className="text-base font-bold text-primary-coffee dark:text-white font-serif leading-tight">
              {product.name}
            </h3>
            
            <p className="text-xs text-primary-coffee/70 dark:text-primary-cream/65 leading-relaxed font-light line-clamp-2">
              {product.description}
            </p>

            <span className="inline-block text-[10px] bg-primary-coffee/10 dark:bg-white/5 px-2.5 py-0.5 rounded-full text-primary-coffee dark:text-white font-semibold">
              {product.calories} kcal
            </span>
          </div>

          {/* Pricing & Cart Action */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-primary-coffee/10 dark:border-white/5">
            <span className="text-base font-extrabold text-primary-coffee dark:text-white font-serif">
              {formatPrice(product.price)}
            </span>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setShowCustomizer(true)}
                className="px-3 py-1.5 border border-primary-coffee/20 dark:border-white/20 hover:border-accent-gold text-[10px] font-bold rounded-lg transition"
              >
                {t('customize')}
              </button>
              
              <button
                onClick={handleQuickAdd}
                className={`p-2 rounded-lg transition shadow-md flex items-center justify-center ${
                  addedEffect
                    ? 'bg-green-600 text-white'
                    : 'bg-accent-gold text-primary-dark hover:bg-accent-gold/90 hover:scale-105'
                }`}
                title="Quick add"
              >
                {addedEffect ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details/Nutrition Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetails(false)} />
          <div className="bg-white dark:bg-[#201512] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-primary-coffee/10 dark:border-white/5 animate-in zoom-in-95 duration-300">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-serif font-bold text-primary-coffee dark:text-white">{product.name}</h4>
                <button 
                  onClick={() => setShowDetails(false)} 
                  className="p-1 hover:bg-primary-cream dark:hover:bg-white/5 rounded-full transition"
                >
                  <Heart className="h-5 w-5 rotate-45 text-red-500 fill-current" />
                </button>
              </div>

              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-xl" />

              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-widest text-accent-gold">Ingredients</h5>
                <p className="text-xs leading-relaxed text-primary-coffee/85 dark:text-white/80 font-light">{product.ingredients}</p>
              </div>

              <div className="space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-widest text-accent-gold">Nutrition Facts</h5>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-primary-cream/40 dark:bg-white/5 rounded-lg border border-primary-coffee/5">
                    <span className="block font-bold text-accent-gold">{product.calories}</span>
                    <span className="text-[9px] text-primary-coffee/60 dark:text-white/40">Calories</span>
                  </div>
                  <div className="p-2 bg-primary-cream/40 dark:bg-white/5 rounded-lg border border-primary-coffee/5">
                    <span className="block font-bold">{nutritionMap.carbs || '0g'}</span>
                    <span className="text-[9px] text-primary-coffee/60 dark:text-white/40">Carbs</span>
                  </div>
                  <div className="p-2 bg-primary-cream/40 dark:bg-white/5 rounded-lg border border-primary-coffee/5">
                    <span className="block font-bold">{nutritionMap.fat || '0g'}</span>
                    <span className="text-[9px] text-primary-coffee/60 dark:text-white/40">Fat</span>
                  </div>
                  <div className="p-2 bg-primary-cream/40 dark:bg-white/5 rounded-lg border border-primary-coffee/5">
                    <span className="block font-bold">{nutritionMap.protein || '0g'}</span>
                    <span className="text-[9px] text-primary-coffee/60 dark:text-white/40">Protein</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="w-full py-2 bg-primary-coffee text-white font-bold text-xs rounded-xl hover:bg-primary-coffee/90 transition pt-2.5 pb-2.5"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Drink Modal */}
      {showCustomizer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomizer(false)} />
          <div className="bg-white dark:bg-[#201512] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-primary-coffee/10 dark:border-white/5 animate-in zoom-in-95 duration-300">
            
            <div className="bg-primary-dark text-white p-5 flex items-center justify-between">
              <h4 className="font-serif font-bold text-base">Customize Beverage</h4>
              <button onClick={() => setShowCustomizer(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Cup Size */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-accent-gold">1. Cup Size</label>
                <div className="flex gap-2">
                  {[
                    { label: 'Regular', desc: 'Standard shot' },
                    { label: 'Large', desc: 'Double shot (+0.75)' },
                    { label: 'Grande', desc: 'Triple shot (+1.50)' }
                  ].map((sz) => (
                    <button
                      key={sz.label}
                      onClick={() => setSize(sz.label as any)}
                      className={`flex-1 p-2 text-center border rounded-xl transition ${
                        size === sz.label 
                          ? 'border-accent-gold bg-accent-gold/10 text-primary-coffee dark:text-white font-bold'
                          : 'border-primary-coffee/20 dark:border-white/10 text-xs text-primary-coffee/60 dark:text-white/45'
                      }`}
                    >
                      <span className="block text-xs font-extrabold">{sz.label}</span>
                      <span className="block text-[9px] opacity-75">{sz.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-accent-gold">2. Milk Replacement</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Whole Milk', desc: 'Default' },
                    { label: 'Oat Milk', desc: 'Vegan (+0.50)' },
                    { label: 'Almond Milk', desc: 'Vegan (+0.50)' },
                    { label: 'Soy Milk', desc: 'Vegan (+0.50)' }
                  ].map((mk) => (
                    <button
                      key={mk.label}
                      onClick={() => setMilk(mk.label as any)}
                      className={`p-2 border rounded-xl text-left transition ${
                        milk === mk.label 
                          ? 'border-accent-gold bg-accent-gold/10 text-primary-coffee dark:text-white font-bold'
                          : 'border-primary-coffee/20 dark:border-white/10 text-xs text-primary-coffee/60 dark:text-white/45'
                      }`}
                    >
                      <span className="block text-xs font-extrabold">{mk.label}</span>
                      <span className="block text-[9px] opacity-75">{mk.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-accent-gold">3. Sweetness Level</label>
                <div className="flex gap-2">
                  {['None', 'Less', 'Standard', 'Extra'].map((sw) => (
                    <button
                      key={sw}
                      onClick={() => setSweetness(sw as any)}
                      className={`flex-grow p-2 text-center border rounded-xl transition text-xs font-bold ${
                        sweetness === sw
                          ? 'border-accent-gold bg-accent-gold/10 text-primary-coffee dark:text-white'
                          : 'border-primary-coffee/20 dark:border-white/10 text-primary-coffee/60 dark:text-white/45'
                      }`}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-primary-coffee/10 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-primary-coffee/60 dark:text-white/40 uppercase font-semibold">Total Price</span>
                  <span className="text-lg font-serif font-black text-accent-gold">
                    {formatPrice(product.price + (size === 'Large' ? 0.75 : size === 'Grande' ? 1.50 : 0) + (milk !== 'Whole Milk' ? 0.50 : 0))}
                  </span>
                </div>
                <button
                  onClick={handleCustomizedAdd}
                  className="px-6 py-2.5 bg-accent-gold text-primary-dark font-black text-xs rounded-xl hover:bg-accent-gold/90 transition shadow-md"
                >
                  Add Custom Brew
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
