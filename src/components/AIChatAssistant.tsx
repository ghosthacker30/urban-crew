'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Hello! ☕ Welcome to Urban Brew Café. I am your digital barista helper. Ask me about our menu, special promotions, table reservations, or store hours!',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    // Scroll chat window to bottom
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getSimulatedReply = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('popular') || q.includes('featured') || q.includes('best') || q.includes('drink')) {
      return 'Our absolute crowd-favorites are the Gold Flaked Espresso ☕ (topped with actual 24k gold flakes) and the Velvet Flat White. If you prefer cold drinks, I highly recommend our Nitro Cold Brew Reserve or the Iced Rose Pistachio Latte!';
    }
    if (q.includes('hours') || q.includes('time') || q.includes('open') || q.includes('close')) {
      return 'We are open:\nMon - Fri: 7:00 AM - 10:00 PM\nSat - Sun: 8:00 AM - 11:00 PM\nWe hope to see you soon!';
    }
    if (q.includes('reserve') || q.includes('table') || q.includes('book')) {
      return 'You can easily reserve a table online! Head over to our "Reservations" page to choose your date, time-slot, and pick your preferred table layout (like our VIP lounge booths or window-side couples seats).';
    }
    if (q.includes('gluten') || q.includes('vegan') || q.includes('allergy') || q.includes('milk')) {
      return 'We care about your dietary choices! We offer Oat Milk, Almond Milk, and Soy Milk replacements for all coffees. We also have gluten-free option tags listed in our menu, such as our Avocado Super-Smoothie and fresh salads.';
    }
    if (q.includes('address') || q.includes('location') || q.includes('where') || q.includes('map')) {
      return 'We are located at 456 Premium Brew Avenue, Luxury District. You can find our exact interactive location and store navigation maps on the "Contact" page!';
    }
    if (q.includes('discount') || q.includes('coupon') || q.includes('offer') || q.includes('promo')) {
      return 'Yes! We have active discounts for you. Use code "BREW20" in your cart for 20% off (min purchase $15) or "WELCOME10" for a flat $10 discount on orders above $25.';
    }
    if (q.includes('croissant') || q.includes('bakery') || q.includes('eat') || q.includes('food')) {
      return 'Our bakery items are baked fresh at 5:00 AM every morning! The Golden Butter Croissant and Pain au Chocolat are customer favorites. We also serve fresh Truffle Avocado Toast and smoked salmon bagels.';
    }
    if (q.includes('who are you') || q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return 'Hello! I am your Urban Brew Chat Assistant. I can help recommend delicious food, find store locations, or explain how our loyalty points work!';
    }
    
    return "That's an interesting question! I am still learning, but you can find detailed information on our menu, reservation, or about pages. Alternatively, feel free to ring us directly at +1 (555) 234-5678!";
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiReplyText = getSimulatedReply(textToSend);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickOptionClick = (text: string) => {
    handleSendMessage(text);
  };

  const quickOptions = [
    '☕ Popular Drinks?',
    '📅 Book a Table?',
    '🏷️ Active Coupons?',
    '🕒 Store Hours?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white dark:bg-[#201512] rounded-2xl shadow-2xl border border-primary-coffee/20 dark:border-white/10 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-primary-dark p-4 flex items-center justify-between text-white border-b border-primary-coffee/10">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-accent-gold" />
              <div>
                <h3 className="font-bold text-sm">Brew Assistant</h3>
                <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                  Online to serve
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-white/15 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-primary-cream/25 dark:bg-black/10">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded-full shrink-0 ${
                  msg.sender === 'user' ? 'bg-primary-coffee text-white' : 'bg-accent-gold text-primary-dark'
                }`}>
                  {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-primary-coffee text-white rounded-tr-none'
                    : 'bg-white dark:bg-white/5 border border-primary-coffee/10 dark:border-white/5 text-primary-dark dark:text-white rounded-tl-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[8px] text-right mt-1 opacity-50">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="p-2 rounded-full bg-accent-gold text-primary-dark shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white dark:bg-white/5 border border-primary-coffee/10 dark:border-white/5 p-3 rounded-2xl text-xs rounded-tl-none shadow-sm flex items-center space-x-1.5">
                  <Loader2 className="h-3 w-3 animate-spin text-accent-gold" />
                  <span className="text-[10px] text-primary-coffee/60 dark:text-white/45">Brewing response...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ chips */}
          <div className="px-4 py-2 border-t border-primary-coffee/15 dark:border-white/5 bg-primary-cream/10 dark:bg-black/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleQuickOptionClick(opt.substring(2))}
                className="shrink-0 text-[10px] font-bold px-2.5 py-1 bg-white dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 hover:border-accent-gold hover:text-accent-gold rounded-full transition"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
            className="p-3 border-t border-primary-coffee/15 dark:border-white/5 flex gap-2 bg-white dark:bg-[#201512]"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your digital barista..."
              className="flex-grow text-xs px-3 py-2 bg-primary-cream/40 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold text-primary-dark dark:text-white"
            />
            <button 
              type="submit"
              className="p-2 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark rounded-xl transition"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-accent-gold hover:bg-accent-gold/90 text-primary-dark p-3.5 rounded-full shadow-2xl transition hover:scale-105 duration-300 relative group animate-bounce"
        title="Open Chat Assistant"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute right-full mr-3 top-2.5 hidden group-hover:block bg-primary-dark text-white text-[10px] font-bold px-2 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
          Talk to Barista
        </span>
      </button>
    </div>
  );
}
