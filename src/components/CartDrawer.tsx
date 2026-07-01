'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard, Tag, ArrowRight } from 'lucide-react';
import { useCart, Coupon } from '@/context/CartContext';
import { useLanguageCurrency } from '@/context/LanguageCurrencyContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
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

  // Sample static coupons validation matching DB seed
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

  const handleRemoveCoupon = () => {
    applyCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#201512] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-4 py-6 bg-primary-dark text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-accent-gold" />
              <h2 className="text-lg font-serif font-bold tracking-wide">
                Your Brew Cart ({cart.reduce((tot, item) => tot + item.quantity, 0)})
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-white/10 rounded-full transition text-white/80 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Delivery Method Selector */}
          <div className="px-4 py-3 bg-primary-cream/60 dark:bg-black/20 border-b border-primary-coffee/10 dark:border-white/5 flex gap-2">
            <button
              onClick={() => setDeliveryMethod('DELIVERY')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                deliveryMethod === 'DELIVERY'
                  ? 'bg-primary-coffee text-white border-primary-coffee'
                  : 'bg-transparent text-primary-coffee border-primary-coffee/30 dark:text-white dark:border-white/20'
              }`}
            >
              Delivery (Home)
            </button>
            <button
              onClick={() => setDeliveryMethod('PICKUP')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                deliveryMethod === 'PICKUP'
                  ? 'bg-primary-coffee text-white border-primary-coffee'
                  : 'bg-transparent text-primary-coffee border-primary-coffee/30 dark:text-white dark:border-white/20'
              }`}
            >
              Self-Pickup
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-primary-cream dark:bg-white/5 rounded-full">
                  <ShoppingBag className="h-12 w-12 text-primary-coffee/50 dark:text-white/30" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif">Your cart is empty</h3>
                  <p className="text-sm text-primary-coffee/60 dark:text-white/50 mt-1">
                    Add fresh brews and delicious bakeries to start your moments.
                  </p>
                </div>
                <Link
                  href="/menu"
                  onClick={onClose}
                  className="px-6 py-2 bg-accent-gold text-primary-dark text-sm font-bold rounded-full transition hover:bg-accent-gold/90"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              cart.map((item, index) => {
                const customizationKey = `${item.customization.size}-${item.customization.milk}-${item.customization.sweetness}`;
                return (
                  <div 
                    key={`${item.id}-${customizationKey}-${index}`}
                    className="flex items-start space-x-4 p-3 bg-primary-cream/30 dark:bg-white/5 rounded-xl border border-primary-coffee/10 dark:border-white/5 hover:border-accent-gold/30 transition-all duration-300"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg bg-primary-cream"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-primary-coffee dark:text-white font-serif">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(item.id, customizationKey)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-[10px] text-primary-coffee/60 dark:text-white/45 mt-1 space-y-0.5">
                        <p>Size: <span className="font-semibold">{item.customization.size}</span></p>
                        <p>Milk: <span className="font-semibold">{item.customization.milk}</span></p>
                        <p>Sweetness: <span className="font-semibold">{item.customization.sweetness}</span></p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs font-bold text-accent-gold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <div className="flex items-center border border-primary-coffee/20 dark:border-white/10 rounded-full py-0.5 px-2 bg-white dark:bg-black/20">
                          <button 
                            onClick={() => updateQuantity(item.id, customizationKey, item.quantity - 1)}
                            className="p-0.5 hover:text-accent-gold"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="mx-2 text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, customizationKey, item.quantity + 1)}
                            className="p-0.5 hover:text-accent-gold"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations */}
          {cart.length > 0 && (
            <div className="border-t border-primary-coffee/10 dark:border-white/5 px-4 py-6 bg-primary-cream/20 dark:bg-black/30 space-y-4">
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-grow">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-primary-coffee/40 dark:text-white/30" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter BREW20 or WELCOME10"
                    className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-white dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary-coffee hover:bg-primary-coffee/90 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
              {couponSuccess && (
                <div className="flex justify-between items-center bg-green-500/10 text-green-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <span>{couponSuccess}</span>
                  <button type="button" onClick={handleRemoveCoupon} className="underline text-[10px] hover:text-green-400 ml-2">
                    Remove
                  </button>
                </div>
              )}

              {/* Cost breakdown */}
              <div className="space-y-1.5 text-xs text-primary-coffee/70 dark:text-white/60 font-medium">
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
                <div className="flex justify-between text-sm font-bold text-primary-coffee dark:text-white pt-2 border-t border-primary-coffee/10 dark:border-white/5">
                  <span>{t('total')}</span>
                  <span className="text-accent-gold font-serif text-base">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              {/* Checkout link */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-bold text-sm rounded-xl transition shadow-md hover:scale-[1.01]"
              >
                <CreditCard className="h-4 w-4" />
                <span>{t('checkout')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
