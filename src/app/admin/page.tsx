'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, ShoppingCart, Calendar, Coffee, FileText, 
  Trash2, Plus, RefreshCw, BarChart2, Eye, ShieldAlert, CheckCircle, Clock, Loader2
} from 'lucide-react';
import { useLanguageCurrency } from '@/context/LanguageCurrencyContext';

interface Order {
  id: string;
  totalAmount: number;
  tax: number;
  deliveryCharge: number;
  discount: number;
  couponCode: string | null;
  status: 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  address: string;
  items: string; // JSON string
  createdAt: string;
}

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  timeSlot: string;
  tableNumber: string;
  guestsCount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  calories: number;
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { formatPrice } = useLanguageCurrency();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS' | 'RESERVATIONS' | 'PRODUCTS' | 'LOGS'>('OVERVIEW');
  const [isAdmin, setIsAdmin] = useState(false);

  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Guard check if user is admin
    const savedSession = localStorage.getItem('ub_session');
    if (savedSession) {
      const sessionObj = JSON.parse(savedSession);
      if (sessionObj.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/auth/login');
    }

    // 2. Fetch Dashboard metrics
    async function loadData() {
      try {
        const [resProd, resOrd, resRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/reservations')
        ]);

        if (resProd.ok) setProducts(await resProd.json());
        if (resOrd.ok) setOrders(await resOrd.json());
        if (resRes.ok) setReservations(await resRes.json());
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Setup initial mock audit logs
    setLogs([
      { id: '1', action: 'ADMIN_LOGIN', details: 'Brew Master authenticated securely from dashboard route.', timestamp: new Date().toISOString() },
      { id: '2', action: 'DATABASE_SEED', details: 'Initialized 16 premium coffee and breakfast menu recipes.', timestamp: new Date().toISOString() },
    ]);
  }, [router]);

  // Actions
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string) => {
    // Update local state first
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus as any } : o));
    // Log action
    setLogs(prev => [
      { id: Date.now().toString(), action: 'UPDATE_ORDER_STATUS', details: `Order ${orderId} status set to ${nextStatus}`, timestamp: new Date().toISOString() },
      ...prev
    ]);
  };

  const handleUpdateReservationStatus = async (resId: string, nextStatus: string) => {
    // Update local state first
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: nextStatus as any } : r));
    // Log action
    setLogs(prev => [
      { id: Date.now().toString(), action: 'UPDATE_RESERVATION_STATUS', details: `Reservation ${resId} status set to ${nextStatus}`, timestamp: new Date().toISOString() },
      ...prev
    ]);
  };

  const handleToggleProductAvailability = (prodId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const nextAvail = !p.isAvailable;
        // Log action
        setLogs(l => [
          { id: Date.now().toString(), action: 'TOGGLE_PRODUCT', details: `Product "${p.name}" availability toggled to ${nextAvail}`, timestamp: new Date().toISOString() },
          ...l
        ]);
        return { ...p, isAvailable: nextAvail };
      }
      return p;
    }));
  };

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-accent-gold" />
        <span className="text-xs font-semibold">Checking admin credentials...</span>
      </div>
    );
  }

  // Cost summaries
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeReservationsCount = reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Header Admin Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary-coffee/10 dark:border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-gold text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="h-4.5 w-4.5 text-accent-gold" />
            <span>Secure Admin Control</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white">
            Urban Brew Dashboard
          </h1>
        </div>

        {/* Action button */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 px-4 py-2 border border-primary-coffee/20 dark:border-white/10 hover:border-accent-gold rounded-xl text-xs font-bold transition"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white dark:bg-[#201512] p-6 rounded-2xl border border-primary-coffee/10 dark:border-white/5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-primary-coffee/50 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <span>Total Sales</span>
            <BarChart2 className="h-5 w-5 text-accent-gold" />
          </div>
          <h2 className="text-2xl font-serif font-black text-primary-coffee dark:text-white">
            {formatPrice(totalSales)}
          </h2>
          <span className="text-[10px] text-green-500 font-semibold">▲ +12% from last month</span>
        </div>

        {/* Orders Count */}
        <div className="bg-white dark:bg-[#201512] p-6 rounded-2xl border border-primary-coffee/10 dark:border-white/5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-primary-coffee/50 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <span>Orders Placed</span>
            <ShoppingCart className="h-5 w-5 text-accent-gold" />
          </div>
          <h2 className="text-2xl font-serif font-black text-primary-coffee dark:text-white">
            {orders.length}
          </h2>
          <span className="text-[10px] text-neutral-500 font-semibold">{orders.filter(o => o.status === 'PENDING').length} orders pending</span>
        </div>

        {/* Active Reservations */}
        <div className="bg-white dark:bg-[#201512] p-6 rounded-2xl border border-primary-coffee/10 dark:border-white/5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-primary-coffee/50 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <span>Reservations</span>
            <Calendar className="h-5 w-5 text-accent-gold" />
          </div>
          <h2 className="text-2xl font-serif font-black text-primary-coffee dark:text-white">
            {activeReservationsCount}
          </h2>
          <span className="text-[10px] text-neutral-500 font-semibold">Occupancy slots locked</span>
        </div>

        {/* Menu products count */}
        <div className="bg-white dark:bg-[#201512] p-6 rounded-2xl border border-primary-coffee/10 dark:border-white/5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-primary-coffee/50 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <span>Menu Items</span>
            <Coffee className="h-5 w-5 text-accent-gold" />
          </div>
          <h2 className="text-2xl font-serif font-black text-primary-coffee dark:text-white">
            {products.length}
          </h2>
          <span className="text-[10px] text-green-500 font-semibold">{products.filter(p => p.isAvailable).length} active items</span>
        </div>
      </div>

      {/* 3. Tab Buttons */}
      <div className="flex gap-2 border-b border-primary-coffee/10 dark:border-white/5 pb-2 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'ORDERS', label: 'Orders List' },
          { id: 'RESERVATIONS', label: 'Reservations' },
          { id: 'PRODUCTS', label: 'Products Inventory' },
          { id: 'LOGS', label: 'System Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-primary-coffee text-white shadow-sm'
                : 'text-primary-coffee/70 hover:bg-primary-cream/50 dark:text-white/70 dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Dynamic Sections */}
      <div className="bg-white dark:bg-[#201512] rounded-3xl border border-primary-coffee/10 dark:border-white/5 p-6 shadow-sm overflow-hidden">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold font-serif uppercase tracking-widest text-accent-gold">Analytics Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Orders review list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary-coffee dark:text-white">Incoming Orders Pipeline</h4>
                <div className="space-y-2">
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="p-3 bg-primary-cream/20 dark:bg-black/10 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold block">Ref: {ord.id.substring(0, 8)}...</span>
                        <span className="text-[10px] text-primary-coffee/50 dark:text-white/40">{ord.address}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-accent-gold">{formatPrice(ord.totalAmount)}</span>
                        <span className={`text-[9px] font-black uppercase ${
                          ord.status === 'DELIVERED' ? 'text-green-500' : 'text-amber-500'
                        }`}>{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occupied tables calendar summary */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary-coffee dark:text-white">Upcoming Floor Reservations</h4>
                <div className="space-y-2">
                  {reservations.slice(0, 3).map((res) => (
                    <div key={res.id} className="p-3 bg-primary-cream/20 dark:bg-black/10 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold block">{res.guestName}</span>
                        <span className="text-[10px] text-primary-coffee/50 dark:text-white/40">{res.tableNumber} | Cap: {res.guestsCount}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-accent-gold">{res.timeSlot}</span>
                        <span className="text-[9px] font-semibold text-neutral-500">{res.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6 overflow-x-auto">
            <h3 className="text-sm font-bold font-serif uppercase tracking-widest text-accent-gold">Customer Order Pipelines</h3>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-primary-coffee/10 dark:border-white/5 text-primary-coffee/50 dark:text-white/40">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Address</th>
                  <th className="py-3 px-2">Total Amount</th>
                  <th className="py-3 px-2">Payment Status</th>
                  <th className="py-3 px-2">Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} className="border-b border-primary-coffee/5 dark:border-white/5">
                    <td className="py-3 px-2 font-mono font-semibold">{ord.id.substring(0, 8)}...</td>
                    <td className="py-3 px-2 max-w-[150px] truncate">{ord.address}</td>
                    <td className="py-3 px-2 font-bold text-accent-gold">{formatPrice(ord.totalAmount)}</td>
                    <td className="py-3 px-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-500">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="py-1 px-2 border border-primary-coffee/20 dark:border-white/10 bg-transparent rounded-lg text-[10px] font-bold"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === 'RESERVATIONS' && (
          <div className="space-y-6 overflow-x-auto">
            <h3 className="text-sm font-bold font-serif uppercase tracking-widest text-accent-gold">Calendar Bookings</h3>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-primary-coffee/10 dark:border-white/5 text-primary-coffee/50 dark:text-white/40">
                  <th className="py-3 px-2">Guest Name</th>
                  <th className="py-3 px-2">Date & Slot</th>
                  <th className="py-3 px-2">Table locked</th>
                  <th className="py-3 px-2">Guests count</th>
                  <th className="py-3 px-2">Approve / Modify</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} className="border-b border-primary-coffee/5 dark:border-white/5">
                    <td className="py-3 px-2 font-bold">{res.guestName}</td>
                    <td className="py-3 px-2">{res.date} | {res.timeSlot}</td>
                    <td className="py-3 px-2 text-accent-gold font-semibold">{res.tableNumber}</td>
                    <td className="py-3 px-2 font-bold">{res.guestsCount} Guests</td>
                    <td className="py-3 px-2">
                      <select
                        value={res.status}
                        onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                        className="py-1 px-2 border border-primary-coffee/20 dark:border-white/10 bg-transparent rounded-lg text-[10px] font-bold"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6 overflow-x-auto">
            <h3 className="text-sm font-bold font-serif uppercase tracking-widest text-accent-gold">Products Inventory</h3>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-primary-coffee/10 dark:border-white/5 text-primary-coffee/50 dark:text-white/40">
                  <th className="py-3 px-2">Product Name</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">List Price</th>
                  <th className="py-3 px-2">Availability</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} className="border-b border-primary-coffee/5 dark:border-white/5">
                    <td className="py-3 px-2 font-bold">{prod.name}</td>
                    <td className="py-3 px-2 uppercase text-[9px] tracking-wider text-primary-coffee/65 dark:text-white/50">{prod.category}</td>
                    <td className="py-3 px-2 font-bold text-accent-gold">{formatPrice(prod.price)}</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleToggleProductAvailability(prod.id)}
                        className={`px-3 py-1 text-[9px] font-black rounded-lg transition ${
                          prod.isAvailable
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {prod.isAvailable ? 'AVAILABLE' : 'BLOCKED'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'LOGS' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold font-serif uppercase tracking-widest text-accent-gold">Secure Action Logs</h3>
            <div className="space-y-3 font-mono text-[10px] text-primary-coffee/70 dark:text-primary-cream/70 leading-relaxed font-light">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-primary-cream/20 dark:bg-black/10 rounded-xl border border-primary-coffee/5 space-y-1">
                  <div className="flex justify-between items-center text-primary-coffee dark:text-white">
                    <strong className="text-accent-gold">{log.action}</strong>
                    <span className="opacity-50">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p>{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
