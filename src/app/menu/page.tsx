'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, EyeOff, Loader2 } from 'lucide-react';
import ProductCard, { ProductType } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialFilter = searchParams.get('filter') || '';

  const { wishlist } = useCart();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'price-asc' | 'price-desc'

  const categories = [
    'All',
    'Taccos',
    'Cold Coffee',
    'Tea',
    'Milkshakes',
    'Smoothies',
    'Desserts',
    'Bakery',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Wishlist'
  ];

  // Fetch products from database API
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load menu products API, using static fallbacks', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Update category if URL parameters change
  useEffect(() => {
    if (initialFilter === 'wishlist') {
      setActiveCategory('Wishlist');
    } else if (initialCategory && initialCategory !== 'All') {
      setActiveCategory(initialCategory);
    }
  }, [searchParams]);

  // Filtering Logic
  const filteredProducts = products.filter((prod) => {
    // 1. Search Query Match
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category Match
    if (activeCategory === 'All') {
      return matchesSearch;
    } else if (activeCategory === 'Wishlist') {
      return wishlist.includes(prod.id) && matchesSearch;
    } else {
      return prod.category === activeCategory && matchesSearch;
    }
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return b.rating - a.rating; // default sort by rating
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Artisanal Treats</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white">
          Urban Brew Menu
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-primary-coffee/60 dark:text-white/50 font-light">
          Fresh roasted beans, freshly baked pastries, and luxury dining plates prepared organically daily.
        </p>
      </div>

      {/* 2. Filters & Search Bar Control Panel */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-primary-cream/50 dark:bg-black/20 p-4 rounded-2xl border border-primary-coffee/10 dark:border-white/5">
        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary-coffee/40 dark:text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search espresso, chocolate, cinnamon, croissants..."
            className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex w-full md:w-1/2 justify-end gap-3 items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-coffee/60 dark:text-white/45">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort By</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold py-2 px-3 bg-white dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
          >
            <option value="rating">Highest Rated ★</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 3. Category Horizontal Selection Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-primary-coffee">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeCategory === cat
                ? 'bg-accent-gold text-primary-dark shadow-md'
                : 'bg-primary-cream/40 hover:bg-primary-cream dark:bg-white/5 dark:hover:bg-white/10 border border-primary-coffee/10 dark:border-white/5 text-primary-coffee/80 dark:text-white/80'
            }`}
          >
            {cat} {cat === 'Wishlist' && `(${wishlist.length})`}
          </button>
        ))}
      </div>

      {/* 4. Products Grid */}
      {loading ? (
        <div className="h-80 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-accent-gold" />
          <span className="text-xs font-semibold text-primary-coffee/60 dark:text-white/40">Grinding coffee beans...</span>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="h-80 flex flex-col items-center justify-center text-center space-y-3">
          <EyeOff className="h-12 w-12 text-primary-coffee/30 dark:text-white/20" />
          <h3 className="text-lg font-bold font-serif">No items found</h3>
          <p className="text-xs text-primary-coffee/60 dark:text-white/45 max-w-sm">
            Try adjusting your search criteria or choose another category to discover.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent-gold" />
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
