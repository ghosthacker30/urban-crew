'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, Tag, ArrowRight } from 'lucide-react';
import { useCart, Coupon } from '@/context/CartContext';
import { useLanguageCurrency } from '@/context/LanguageCurrencyContext';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    deliveryMethod, 
    setDeliveryMethod,
    coupon, 
    applyCoupon,
    getCartSubtotal,
    getDiscountAmount,
    getTaxAmount,
    getDeliveryCharge,
    getCartTotal
  } = useCart();
  const { formatPrice, t } = useLanguageCurrency();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const validCoupons: Record<string, Omit<Coupon, 'code'>> = {
    'BREW20': { discountType: 'PERCENTAGE', value: 20, minPurchase: 15 },
    'WELCOME10': { discountType: 'FIXED', value: 10, minPurchase: 25 },
    'GOLDENHOUR': { discountType: 'PERCENTAGE', value: 15, minPurchase: 10 },
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code in validCoupons) {
      const details = validCoupons[code];
      const subtotal = getCartSubtotal();
      if (subtotal < details.minPurchase) {
        setCouponError(`Min purchase of ${formatPrice(details.minPurchase)} required.`);
        return;
      }
      
      const success = applyCoupon({ code, ...details });
      if (success) {
        setCouponSuccess(`Coupon ${code} applied successfully!`);
        setCouponCode('');
      } else {
        setCouponError('Could not apply coupon.');
      }
    } else {
      setCouponError('Invalid coupon code.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Cart Summary</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white flex items-center justify-center gap-3">
          <ShoppingBag className="h-8 w-8 text-accent-gold" />
          <span>Review Your Order</span>
        </h1>
        <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#201512] rounded-3xl border border-primary-coffee/10 dark:border-white/5 space-y-6 max-w-xl mx-auto shadow-sm">
          <div className="p-4 bg-primary-cream dark:bg-white/5 rounded-full inline-block">
            <ShoppingBag className="h-12 w-12 text-primary-coffee/50 dark:text-white/30" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif">Your cart is empty</h2>
            <p className="text-xs text-primary-coffee/60 dark:text-white/45 max-w-xs mx-auto mt-2 leading-relaxed">
              Explore our single-origin coffees, chocolate desserts, and croissants to begin.
            </p>
          </div>
          <Link 
            href="/menu"
            className="px-6 py-2.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-xs rounded-full transition shadow"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#201512] rounded-3xl border border-primary-coffee/10 dark:border-white/5 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-base font-bold font-serif border-b border-primary-coffee/10 dark:border-white/5 pb-4">
                Selected Items ({cart.reduce((tot, item) => tot + item.quantity, 0)})
              </h3>

              <div className="space-y-4">
                {cart.map((item, index) => {
                  const customizationKey = `${item.customization.size}-${item.customization.milk}-${item.customization.sweetness}`;
                  return (
                    <div 
                      key={`${item.id}-${customizationKey}-${index}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-primary-cream/20 dark:bg-white/5 rounded-2xl border border-primary-coffee/10 dark:border-white/5 gap-4"
                    >
                      <div className="flex gap-4 items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-primary-coffee dark:text-white font-serif">
                            {item.name}
                          </h4>
                          <div className="text-[10px] text-primary-coffee/60 dark:text-white/40 mt-1 flex gap-3 font-semibold">
                            <span>Size: {item.customization.size}</span>
                            <span>Milk: {item.customization.milk}</span>
                            <span>Sweet: {item.customization.sweetness}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="flex items-center border border-primary-coffee/20 dark:border-white/10 rounded-full py-0.5 px-2 bg-white dark:bg-black/20">
                          <button 
                            onClick={() => updateQuantity(item.id, customizationKey, item.quantity - 1)}
                            className="p-1 hover:text-accent-gold"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="mx-3 text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, customizationKey, item.quantity + 1)}
                            className="p-1 hover:text-accent-gold"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold font-serif text-accent-gold w-16 text-right">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        <button 
                          onClick={() => removeFromCart(item.id, customizationKey)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: Checkout Breakdown */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#201512] rounded-3xl border border-primary-coffee/10 dark:border-white/5 p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Delivery method */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Delivery Choice</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setDeliveryMethod('DELIVERY')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      deliveryMethod === 'DELIVERY'
                        ? 'bg-primary-coffee border-primary-coffee text-white'
                        : 'bg-transparent text-primary-coffee dark:text-white border-primary-coffee/20 dark:border-white/10'
                    }`}
                  >
                    Delivery
                  </button>
                  <button 
                    onClick={() => setDeliveryMethod('PICKUP')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      deliveryMethod === 'PICKUP'
                        ? 'bg-primary-coffee border-primary-coffee text-white'
                        : 'bg-transparent text-primary-coffee dark:text-white border-primary-coffee/20 dark:border-white/10'
                    }`}
                  >
                    Pickup
                  </button>
                </div>
              </div>

              {/* Coupon code */}
              <div className="space-y-2 pt-2 border-t border-primary-coffee/10 dark:border-white/5">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Coupon Promos</label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="BREW20, WELCOME10"
                    className="flex-grow text-xs font-medium p-2 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                  />
                  <button type="submit" className="px-4 py-2 bg-primary-coffee hover:bg-primary-coffee/95 text-white text-xs font-bold rounded-xl transition">
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
                {coupon && (
                  <div className="flex justify-between items-center bg-green-500/10 text-green-500 p-2 rounded-xl text-xs font-semibold">
                    <span>Applied: {coupon.code}</span>
                    <button type="button" onClick={() => applyCoupon(null)} className="underline text-[10px] hover:text-green-400">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Summary prices */}
              <div className="space-y-3 pt-4 border-t border-primary-coffee/10 dark:border-white/5 text-xs text-primary-coffee/70 dark:text-white/60 font-medium">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(getCartSubtotal())}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-500 font-semibold">
                    <span>Discount ({coupon.code})</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('tax')} (8%)</span>
                  <span>{formatPrice(getTaxAmount())}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('delivery')}</span>
                  <span>{getDeliveryCharge() === 0 ? 'FREE' : formatPrice(getDeliveryCharge())}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary-coffee dark:text-white pt-3 border-t border-primary-coffee/10 dark:border-white/5">
                  <span>{t('total')}</span>
                  <span className="text-accent-gold font-serif text-base">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              {/* Proceed */}
              <Link 
                href="/checkout"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-xs rounded-xl transition shadow shadow-accent-gold/25"
              >
                <CreditCard className="h-4 w-4" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
