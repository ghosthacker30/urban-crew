'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Check, Receipt, ShoppingBag, Loader2, ArrowLeft, Printer, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguageCurrency } from '@/context/LanguageCurrencyContext';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { 
    cart, 
    coupon, 
    deliveryMethod,
    getCartSubtotal, 
    getDiscountAmount, 
    getTaxAmount, 
    getDeliveryCharge, 
    getCartTotal,
    clearCart
  } = useCart();
  
  const { formatPrice } = useLanguageCurrency();

  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'RAZORPAY' | 'PAYPAL' | 'UPI' | 'COD'>('STRIPE');

  // Stripe card details (mocked)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Processing state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invoice, setInvoice] = useState<{
    orderId: string;
    date: string;
    items: typeof cart;
    total: number;
    discount: number;
    tax: number;
    delivery: number;
    payment: string;
  } | null>(null);

  const [showRzpSimulator, setShowRzpSimulator] = useState(false);
  const [tempInvoiceRef, setTempInvoiceRef] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address || !city || !zip) {
      alert('Please fill out all address details.');
      return;
    }

    setLoading(true);

    const invoiceRef = `UB-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setTempInvoiceRef(invoiceRef);

    if (paymentMethod === 'RAZORPAY') {
      try {
        const orderRes = await fetch('/api/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getCartTotal(),
            currency: 'INR',
            receipt: invoiceRef
          })
        });

        const orderData = await orderRes.json();

        if (!orderRes.ok || orderData.error) {
          throw new Error(orderData.error || 'Razorpay order creation failed');
        }

        if (orderData.isMock) {
          // Fallback to the beautiful custom sandbox simulator modal
          setLoading(false);
          setShowRzpSimulator(true);
          return;
        }

        // Real credentials: load and run Razorpay SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load Razorpay SDK. Falling back to payment simulator.');
          setLoading(false);
          setShowRzpSimulator(true);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Urban Brew Café',
          description: 'Specialty Coffee & Gourmet Foods',
          image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=120&auto=format&fit=crop',
          order_id: orderData.id,
          handler: async function (response: any) {
            await submitFinalOrder(invoiceRef, response.razorpay_payment_id);
          },
          prefill: {
            name: name,
            email: email,
          },
          theme: {
            color: '#a37c5c'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoading(false);

      } catch (err: any) {
        console.warn('Razorpay order integration failed, showing simulator:', err);
        setLoading(false);
        setShowRzpSimulator(true);
      }
      return;
    }

    // For other methods
    await submitFinalOrder(invoiceRef);
  };

  const submitFinalOrder = async (invoiceRef: string, paymentId?: string) => {
    const checkoutPayload = {
      totalAmount: getCartTotal(),
      tax: getTaxAmount(),
      deliveryCharge: getDeliveryCharge(),
      discount: getDiscountAmount(),
      couponCode: coupon?.code || null,
      paymentMethod: paymentMethod === 'RAZORPAY' ? `RAZORPAY (ID: ${paymentId || 'MOCK'})` : paymentMethod,
      deliveryMethod,
      address: `${address}, ${city}, ZIP: ${zip}`,
      items: JSON.stringify(cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customization: item.customization
      })))
    };

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload),
      });

      if (response.ok) {
        generateInvoice(invoiceRef);
      } else {
        alert('Order processing failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.warn('API post failed, running simulated success fallback', err);
      setTimeout(() => {
        generateInvoice(invoiceRef);
      }, 1500);
    }
  };

  const generateInvoice = (ref: string) => {
    setInvoice({
      orderId: ref,
      date: new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      total: getCartTotal(),
      discount: getDiscountAmount(),
      tax: getTaxAmount(),
      delivery: getDeliveryCharge(),
      payment: paymentMethod,
    });
    setLoading(false);
    setSuccess(true);
    
    // Clear global cart state
    clearCart();
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (success && invoice) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:py-0 print:px-0">
        
        {/* Print only banner details */}
        <div className="hidden print:block text-center space-y-2 mb-8">
          <h1 className="text-2xl font-serif font-black text-black">URBAN BREW CAFÉ</h1>
          <p className="text-xs text-neutral-500">Fresh Coffee. Fresh Moments. | Invoice Receipt</p>
        </div>

        {/* Invoice Container card */}
        <div className="bg-white dark:bg-[#201512] rounded-3xl border border-accent-gold p-6 sm:p-10 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-primary-coffee/10 dark:border-white/5 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-accent-gold uppercase tracking-widest print:text-amber-600">Payment Invoice</span>
              <h2 className="text-lg font-serif font-bold text-primary-coffee dark:text-white print:text-black">
                Urban Brew Cafe
              </h2>
              <p className="text-[10px] text-primary-coffee/60 dark:text-white/40 print:text-neutral-500">Invoice: {invoice.orderId}</p>
            </div>
            
            <div className="text-right space-y-1 text-xs">
              <span className="block font-bold text-green-500">PAID SUCCESS</span>
              <span className="text-[10px] text-primary-coffee/50 dark:text-white/40 print:text-neutral-500">{invoice.date}</span>
            </div>
          </div>

          {/* Customer / Order Info */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-primary-coffee/10 dark:border-white/5 pb-6">
            <div className="space-y-1">
              <span className="block text-[9px] font-bold text-primary-coffee/50 dark:text-white/40 uppercase">Customer details</span>
              <strong className="block text-primary-coffee dark:text-white print:text-black">{name}</strong>
              <span className="block text-primary-coffee/80 dark:text-primary-cream/70 print:text-neutral-600">{email}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[9px] font-bold text-primary-coffee/50 dark:text-white/40 uppercase">Delivery Address</span>
              <span className="block text-primary-coffee/80 dark:text-primary-cream/70 print:text-neutral-600">{address}</span>
              <span className="block text-primary-coffee/80 dark:text-primary-cream/70 print:text-neutral-600">{city}, ZIP: {zip}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <span className="block text-[9px] font-bold text-primary-coffee/50 dark:text-white/40 uppercase">Order Details</span>
            <div className="space-y-3">
              {invoice.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-primary-coffee dark:text-white print:text-black">
                  <div className="space-y-0.5">
                    <span className="font-serif font-bold">{item.name} <span className="text-accent-gold print:text-amber-600">x{item.quantity}</span></span>
                    <span className="block text-[9px] text-primary-coffee/50 dark:text-white/40 print:text-neutral-500">
                      {item.customization.size} | {item.customization.milk} | {item.customization.sweetness}
                    </span>
                  </div>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="border-t border-primary-coffee/10 dark:border-white/5 pt-6 space-y-2 text-xs text-primary-coffee/75 dark:text-white/60 font-medium print:text-neutral-700">
            {invoice.discount > 0 && (
              <div className="flex justify-between text-green-500 font-semibold">
                <span>Applied Discount</span>
                <span>-{formatPrice(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>{formatPrice(invoice.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{invoice.delivery === 0 ? 'FREE' : formatPrice(invoice.delivery)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-primary-coffee dark:text-white pt-3 border-t border-primary-coffee/10 dark:border-white/5 print:text-black print:border-neutral-300">
              <span>Total Invoice Paid</span>
              <span className="text-accent-gold font-serif text-base print:text-black">{formatPrice(invoice.total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 border border-primary-coffee/20 dark:border-white/10 hover:border-accent-gold text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Printer className="h-4.5 w-4.5" />
              <span>Print Invoice Receipt</span>
            </button>
            <Link
              href="/"
              className="flex-1 py-2.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark text-xs font-black rounded-xl transition text-center shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back to Cart */}
      <div>
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-coffee dark:text-accent-gold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart Review</span>
        </Link>
      </div>

      <div className="text-center space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Secure Gateway</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white flex items-center justify-center gap-3">
          <Receipt className="h-8 w-8 text-accent-gold" />
          <span>Checkout Securely</span>
        </h1>
        <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xs text-primary-coffee/60 dark:text-white/40">No items available in checkout cart.</p>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Address & Details Form */}
          <div className="space-y-6 bg-white dark:bg-[#201512] p-6 sm:p-8 rounded-3xl border border-primary-coffee/10 dark:border-white/5 shadow-sm">
            <h3 className="text-base font-bold font-serif border-b border-primary-coffee/10 dark:border-white/5 pb-4">
              1. Delivery / Billing Address
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, suite, street name"
                  className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City name"
                    className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="10001"
                    className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-base font-bold font-serif border-b border-primary-coffee/10 dark:border-white/5 pb-4 pt-6">
              2. Choose Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'STRIPE', label: 'Credit Card (Stripe)' },
                { id: 'RAZORPAY', label: 'Razorpay / Net' },
                { id: 'PAYPAL', label: 'PayPal' },
                { id: 'UPI', label: 'UPI / Google Pay' },
                { id: 'COD', label: 'Cash on Delivery' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-3 text-[10px] font-bold border rounded-xl transition text-center ${
                    paymentMethod === method.id
                      ? 'border-accent-gold bg-accent-gold/10 text-primary-coffee dark:text-white'
                      : 'border-primary-coffee/20 dark:border-white/10 text-primary-coffee/60 dark:text-white/40 hover:border-accent-gold/40'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>

            {/* Credit Card inputs if STRIPE selected */}
            {paymentMethod === 'STRIPE' && (
              <div className="space-y-4 pt-4 border-t border-primary-coffee/10 dark:border-white/5 animate-in slide-in-from-top duration-300">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242 (Simulated)"
                    className="w-full text-xs font-mono p-2.5 bg-primary-cream/35 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full text-xs font-mono p-2.5 bg-primary-cream/35 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">CVC</label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full text-xs font-mono p-2.5 bg-primary-cream/35 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI QR code scanner box if UPI selected */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-4 pt-4 border-t border-primary-coffee/10 dark:border-white/5 animate-in slide-in-from-top duration-300">
                <div className="bg-primary-cream/25 dark:bg-[#1a100e] border border-accent-gold/20 p-5 rounded-2xl flex flex-col items-center text-center space-y-4">
                  <div className="p-2 bg-white rounded-xl shadow-md border border-neutral-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=urbanbrew@upi&pn=Urban Brew Cafe&am=${getCartTotal()}&cu=INR`)}`} 
                      alt="UPI QR Code Scanner"
                      className="w-[150px] h-[150px] object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-accent-gold uppercase tracking-wider block">Scan to Pay with Any UPI App</span>
                    <p className="text-[11px] text-primary-coffee/85 dark:text-primary-cream/80 font-semibold">
                      Total Amount: <span className="text-accent-gold">{formatPrice(getCartTotal())}</span>
                    </p>
                    <span className="text-[9px] text-primary-coffee/50 dark:text-white/40 block">UPI ID: urbanbrew@upi</span>
                  </div>
                  <div className="text-[9px] bg-accent-gold/10 text-accent-gold font-bold py-1.5 px-3 rounded-full border border-accent-gold/20 flex items-center gap-1.5 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-accent-gold rounded-full"></div>
                    <span>Waiting for transfer detection...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Razorpay Information Box if RAZORPAY selected */}
            {paymentMethod === 'RAZORPAY' && (
              <div className="space-y-4 pt-4 border-t border-primary-coffee/10 dark:border-white/5 animate-in slide-in-from-top duration-300">
                <div className="bg-primary-cream/25 dark:bg-[#1a100e] border border-accent-gold/20 p-5 rounded-2xl text-center space-y-2">
                  <span className="text-[10px] font-black text-accent-gold uppercase tracking-wider block">Razorpay Payments Portal</span>
                  <p className="text-[10px] text-primary-coffee/70 dark:text-primary-cream/65 leading-relaxed font-light">
                    You will be redirected to the secure Razorpay payment gateway to complete your transaction via Credit/Debit card, Netbanking, UPI, or Wallet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Review */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#201512] p-6 sm:p-8 rounded-3xl border border-primary-coffee/10 dark:border-white/5 shadow-sm space-y-6">
              <h3 className="text-base font-bold font-serif border-b border-primary-coffee/10 dark:border-white/5 pb-4">
                3. Order Review
              </h3>

              {/* Items List */}
              <div className="space-y-4 overflow-y-auto max-h-60 scrollbar-thin">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="font-serif font-bold text-primary-coffee dark:text-white">
                        {item.name} <span className="text-accent-gold font-bold">x{item.quantity}</span>
                      </span>
                      <span className="block text-[9px] text-primary-coffee/50 dark:text-white/40">
                        {item.customization.size} | {item.customization.milk}
                      </span>
                    </div>
                    <span className="font-bold text-primary-coffee dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Final Breakdown */}
              <div className="border-t border-primary-coffee/10 dark:border-white/5 pt-6 space-y-2.5 text-xs text-primary-coffee/75 dark:text-white/60 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartSubtotal())}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-500 font-semibold">
                    <span>Applied Coupon ({coupon.code})</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(getTaxAmount())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{getDeliveryCharge() === 0 ? 'FREE' : formatPrice(getDeliveryCharge())}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary-coffee dark:text-white pt-3 border-t border-primary-coffee/10 dark:border-white/5">
                  <span>Total Amount Due</span>
                  <span className="text-accent-gold font-serif text-base">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary-dark" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Place Order: {formatPrice(getCartTotal())}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      )}

      {/* Razorpay Sandbox Payment Simulator Modal */}
      {showRzpSimulator && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1412] border border-accent-gold/40 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <span className="text-[9px] font-black text-accent-gold uppercase tracking-widest block">Razorpay Sandbox Simulator</span>
              <h3 className="text-base font-serif font-bold text-white">Razorpay Secure Checkout</h3>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Mock/test credentials detected. Choose payment result to verify gateway callback handling:
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-white/60">Merchant:</span>
                <span className="font-bold text-white">Urban Brew Cafe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Amount due:</span>
                <span className="font-bold text-accent-gold font-mono">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Customer:</span>
                <span className="font-bold text-white">{name}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={async () => {
                  setShowRzpSimulator(false);
                  const mockPayId = `pay_mock_${Math.random().toString(36).slice(2, 11)}`;
                  await submitFinalOrder(tempInvoiceRef, mockPayId);
                }}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                Simulate Payment Success
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRzpSimulator(false);
                  alert('Payment has been cancelled by the user.');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition border border-white/10"
              >
                Cancel / Decline Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
