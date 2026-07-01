'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  url: string;
  category: 'Cafe' | 'Brewing' | 'Ingredients' | 'Desserts';
  caption: string;
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Cafe' | 'Brewing' | 'Ingredients' | 'Desserts'>('All');

  const galleryItems: GalleryItem[] = [
    {
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop',
      category: 'Cafe',
      caption: 'Main Salon Flagship Ambiance'
    },
    {
      url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop',
      category: 'Brewing',
      caption: 'Roasting Master Bean Selection'
    },
    {
      url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop',
      category: 'Brewing',
      caption: 'Pouring Velvet Latte Art'
    },
    {
      url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
      category: 'Ingredients',
      caption: 'Organic Roasted Arabica Beans'
    },
    {
      url: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
      category: 'Brewing',
      caption: 'Perfect Crema Espresso Drip'
    },
    {
      url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop',
      category: 'Desserts',
      caption: 'House Tiramisu Dusted in Dark Cocoa'
    },
    {
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
      category: 'Desserts',
      caption: 'Fresh Flaky Butter Croissants'
    },
    {
      url: 'https://images.unsplash.com/photo-1549737328-8b9f385f1797?q=80&w=600&auto=format&fit=crop',
      category: 'Cafe',
      caption: 'Window Seat Couples Corner'
    }
  ];

  const filteredItems = activeTab === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  const tabs: Array<'All' | 'Cafe' | 'Brewing' | 'Ingredients' | 'Desserts'> = [
    'All', 'Cafe', 'Brewing', 'Ingredients', 'Desserts'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. Header Banner */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Visual Experience</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white flex items-center justify-center gap-3">
          <Camera className="h-8 w-8 text-accent-gold" />
          <span>The Brew Gallery</span>
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-primary-coffee/60 dark:text-white/50 font-light">
          A glimpse into the warmth, organic details, and barista rituals at Urban Brew.
        </p>
      </div>

      {/* 2. Selection Tabs */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === tab
                ? 'bg-accent-gold text-primary-dark shadow-md'
                : 'bg-primary-cream/40 dark:bg-white/5 border border-primary-coffee/10 dark:border-white/5 text-primary-coffee/80 dark:text-white/80 hover:bg-primary-cream'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <div 
            key={index} 
            className="group relative h-72 rounded-2xl overflow-hidden shadow-md border border-primary-coffee/10 dark:border-white/5 cursor-pointer bg-primary-cream"
          >
            <img 
              src={item.url} 
              alt={item.caption} 
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Visual overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
              <span className="text-[9px] font-black uppercase text-accent-gold tracking-widest">{item.category}</span>
              <h4 className="text-xs font-bold mt-1 font-serif">{item.caption}</h4>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
