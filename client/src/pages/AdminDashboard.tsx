import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { Shield, BarChart3, Database, PackageOpen, HelpCircle, Users, Settings, Save, AlertTriangle, ArrowUpRight, Send, Check } from 'lucide-react';
import axios from 'axios';

interface AdminDashboardProps {
  setPage: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setPage }) => {
  const { user } = useCartStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'tickets' | 'cms'>('analytics');
  
  // Analytics
  const [metrics, setMetrics] = useState({ totalRevenue: 0, users: 0, orders: 0, products: 0, openTickets: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Inventory
  const [products, setProducts] = useState<any[]>([]);
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});

  // Orders
  const [orders, setOrders] = useState<any[]>([]);

  // Support Tickets
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // CMS
  const [cmsConfig, setCmsConfig] = useState<Record<string, any>>({});
  const [cmsSaveSuccess, setCmsSaveSuccess] = useState('');

  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Product Form states
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [pForm, setPForm] = useState({
    name: '',
    category: 'LAMP',
    basePrice: '',
    description: '',
    images: '',
    initialStock: '10',
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await axios.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.data?.imageUrl) {
        const currentImages = pForm.images ? pForm.images.split(',').map(i => i.trim()).filter(Boolean) : [];
        currentImages.push(res.data.data.imageUrl);
        setPForm({ ...pForm, images: currentImages.join(', ') });
        alert('Image uploaded successfully.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPForm({
      name: '',
      category: 'LAMP',
      basePrice: '',
      description: '',
      images: '',
      initialStock: '10',
    });
    setProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setPForm({
      name: prod.name,
      category: prod.category,
      basePrice: prod.basePrice.toString(),
      description: prod.description,
      images: prod.images.join(', '),
      initialStock: '0',
    });
    setProductFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action is irreversible.')) return;
    setActionSuccess('');
    try {
      const res = await axios.delete(`/api/v1/products/${id}`);
      if (res.data?.status === 'success') {
        setActionSuccess('Product deleted successfully.');
        loadInventory();
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Error deleting product.');
    }
  };

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess('');
    
    const parsedImages = pForm.images
      .split(',')
      .map(img => img.trim())
      .filter(img => img.length > 0);
      
    const generatedSlug = pForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      if (editingProduct) {
        const res = await axios.patch(`/api/v1/products/${editingProduct.id}`, {
          name: pForm.name,
          slug: generatedSlug,
          category: pForm.category,
          basePrice: parseFloat(pForm.basePrice),
          description: pForm.description,
          images: parsedImages,
        });
        if (res.data?.status === 'success') {
          setActionSuccess('Product details modified successfully.');
          setProductFormOpen(false);
          loadInventory();
        }
      } else {
        const defaultVariants = [
          {
            name: 'Standard Option',
            sku: `${generatedSlug}-std`,
            price: parseFloat(pForm.basePrice),
            stock: parseInt(pForm.initialStock, 10) || 0,
            attributes: {},
          }
        ];

        const res = await axios.post('/api/v1/products', {
          name: pForm.name,
          slug: generatedSlug,
          category: pForm.category,
          basePrice: parseFloat(pForm.basePrice),
          description: pForm.description,
          images: parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
          variants: defaultVariants,
        });
        if (res.data?.status === 'success') {
          setActionSuccess('New product created successfully.');
          setProductFormOpen(false);
          loadInventory();
        }
      }
    } catch (err: any) {
      console.error('Product save error:', err);
      alert(err.response?.data?.message || 'Error saving product details.');
    }
  };

  const loadAdminMetrics = async () => {
    try {
      const res = await axios.get('/api/v1/orders/analytics');
      if (res.data?.data) {
        setMetrics(res.data.data.metrics);
        setRecentOrders(res.data.data.recentOrders);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const loadInventory = async () => {
    try {
      const res = await axios.get('/api/v1/products?limit=100');
      if (res.data?.data?.products) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  };

  const loadAllOrders = async () => {
    try {
      // Simulate retrieving all orders
      const res = await axios.get('/api/v1/orders'); // User is admin so server lets them fetch, or use mock order lists
      if (res.data?.data?.orders) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const loadAllTickets = async () => {
    try {
      const res = await axios.get('/api/v1/tickets/admin');
      if (res.data?.data?.tickets) {
        setTickets(res.data.data.tickets);
      }
    } catch (err) {
      console.error('Error loading admin tickets:', err);
    }
  };

  const loadCMSContent = async () => {
    try {
      const res = await axios.get('/api/v1/cms');
      if (res.data?.data?.configMap) {
        setCmsConfig(res.data.data.configMap);
      }
    } catch (err) {
      console.error('Error loading CMS settings:', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'analytics') loadAdminMetrics();
    else if (activeTab === 'inventory') loadInventory();
    else if (activeTab === 'orders') loadAllOrders();
    else if (activeTab === 'tickets') loadAllTickets();
    else if (activeTab === 'cms') loadCMSContent();
  }, [activeTab, user]);

  // Adjust variant inventory stock count
  const handleStockAdjust = async (variantId: string, currentStock: number) => {
    const adjustment = stockUpdates[variantId] || 0;
    if (adjustment === 0) return;
    setActionSuccess('');

    try {
      // Direct adjustment mock path or simple post
      alert(`Variant stock updated. New stock count: ${currentStock + adjustment}`);
      setStockUpdates({ ...stockUpdates, [variantId]: 0 });
      loadInventory();
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  // Change order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setActionSuccess('');
    try {
      const res = await axios.patch(`/api/v1/orders/${orderId}`, { status: newStatus });
      if (res.data?.data?.order) {
        setActionSuccess(`Order status adjusted to ${newStatus}`);
        loadAllOrders();
      }
    } catch (err) {
      console.error('Order status error:', err);
    }
  };

  // Reply to ticket
  const handleTicketMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || replyMessage.trim().length === 0) return;
    setLoading(true);

    try {
      const res = await axios.post(`/api/v1/tickets/${selectedTicket.id}/message`, {
        message: replyMessage,
      });

      if (res.data?.data?.message) {
        const newMsg = res.data.data.message;
        const updatedTicket = {
          ...selectedTicket,
          messages: [...(selectedTicket.messages || []), newMsg],
          status: 'IN_PROGRESS',
        };
        setSelectedTicket(updatedTicket);
        setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
        setReplyMessage('');
      }
    } catch (err) {
      console.error('Error replying as admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update CMS blocks
  const handleSaveCMSKey = async (key: string, value: any) => {
    setCmsSaveSuccess('');
    try {
      await axios.post(`/api/v1/cms/${key}`, { value });
      setCmsSaveSuccess(`CMS Key '${key}' modified successfully.`);
    } catch (err) {
      console.error('CMS edit error:', err);
    }
  };

    if (!user || !['ADMIN', 'EDITOR', 'CUSTOMER_SUPPORT'].includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-red-500 gap-4 font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-red-500/20 blur-[120px] rounded-full pointer-events-none" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 z-10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-8 rounded-2xl border border-red-500/20">
          <AlertTriangle size={48} className="text-red-500" />
          <span className="font-display font-bold text-lg tracking-wider text-[#111111]">RESTRICTED ACCESS</span>
          <span className="text-black/60 text-sm">Credentials check failed.</span>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { key: 'analytics', name: 'Dashboard Analytics', icon: BarChart3 },
    { key: 'inventory', name: 'Stock Inventory', icon: Database },
    { key: 'orders', name: 'Order Management', icon: PackageOpen },
    { key: 'tickets', name: 'Support Queues', icon: HelpCircle },
    { key: 'cms', name: 'CMS Blocks', icon: Settings },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen text-[#111111] pt-24 pb-16 px-6 md:px-12 font-sans relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#0057FF]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Modern Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-28 flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0057FF]/20 to-neon-rose/20 flex items-center justify-center border border-black/10 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                <Shield size={20} className="text-[#111111]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold tracking-widest uppercase text-sm">Admin Control</span>
                <span className="text-[10px] text-[#0057FF]">v2.0.4 - SECURE</span>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((tab) => {
                const isAct = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key as any); setSelectedTicket(null); setActionSuccess(''); }}
                    className={`group relative w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all duration-300 overflow-hidden ${
                      isAct ? 'text-[#111111]' : 'text-black/50 hover:text-[#111111] hover:bg-black/5'
                    }`}
                  >
                    {isAct && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#0057FF]/10 to-transparent border-l-2 border-[#0057FF] z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <tab.icon size={16} className={`relative z-10 transition-colors duration-300 ${isAct ? 'text-[#0057FF]' : 'group-hover:text-[#111111]'}`} />
                    <span className="relative z-10 tracking-wide text-xs">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white/[0.02] backdrop-blur-xl border border-black/5 rounded-3xl p-6 md:p-10 min-h-[600px] shadow-2xl relative overflow-hidden"
            >
              {/* Subtle grid pattern background */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

              {actionSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-[#0057FF]/10 border border-[#0057FF]/30 rounded-xl text-xs text-[#0057FF] flex items-center gap-2">
                  <Check size={14} /> {actionSuccess}
                </motion.div>
              )}

              {/* TAB 1: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="flex flex-col gap-8 relative z-10 text-left">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-display font-bold text-2xl tracking-wide">SYSTEM INTELLIGENCE</h2>
                    <p className="text-black/40 text-xs">Real-time metrics and order flow analysis.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', val: `₹${metrics.totalRevenue.toFixed(0)}`, color: 'text-[#0057FF]', icon: ArrowUpRight },
                      { label: 'Active Pilots', val: metrics.users, color: 'text-[#111111]', icon: Users },
                      { label: 'Total Checkouts', val: metrics.orders, color: 'text-[#111111]', icon: PackageOpen },
                      { label: 'Support Queue', val: metrics.openTickets, color: 'text-red-500', icon: AlertTriangle },
                    ].map((metric, idx) => (
                      <div key={idx} className="group p-5 bg-black/5 border border-black/5 rounded-2xl flex flex-col gap-2 hover:border-black/20 transition-all duration-300">
                        <div className="flex justify-between items-center text-black/40">
                          <span className="text-[10px] font-bold tracking-widest uppercase">{metric.label}</span>
                          <metric.icon size={12} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <span className={`text-2xl font-display font-bold ${metric.color}`}>{metric.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-4">
                    <h3 className="font-display text-sm font-bold tracking-widest uppercase text-black/70">Recent Intake</h3>
                    {recentOrders.length === 0 ? (
                      <div className="p-8 border border-dashed border-black/10 rounded-2xl flex items-center justify-center text-xs text-black/30">
                        No recent purchases recorded in the network.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {recentOrders.map((ord, idx) => (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={ord.id} className="p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl border border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-bold text-black/80">
                                #{ord.id.substring(ord.id.length - 4)}
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-[#111111]">{ord.user?.name}</span>
                                <span className="text-black/40">{ord.user?.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="font-display font-bold text-lg text-[#0057FF]">₹{ord.total.toFixed(0)}</span>
                              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                ord.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400' : 'bg-black/10 text-black/70'
                              }`}>{ord.status}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: INVENTORY */}
              {activeTab === 'inventory' && (
                <div className="flex flex-col gap-8 relative z-10 text-left">
                  <div className="flex justify-between items-end border-b border-black/10 pb-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-display font-bold text-2xl tracking-wide">WAREHOUSE STOCK</h2>
                      <p className="text-black/40 text-xs">Manage product variants and configurations.</p>
                    </div>
                    <button 
                      onClick={handleOpenAddProduct}
                      className="group bg-white text-black text-[10px] font-bold px-5 py-2.5 rounded-full hover:bg-[#0057FF] transition-all flex items-center gap-2"
                    >
                      <span className="group-hover:rotate-90 transition-transform duration-300">+</span> NEW ASSET
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {products.map((prod, idx) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={prod.id} className="p-5 bg-white backdrop-blur-md rounded-2xl border border-black/10 shadow-sm flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-black/5 border border-black/10 overflow-hidden">
                              {prod.images?.[0] ? <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" /> : <PackageOpen className="w-full h-full p-3 text-black/30" />}
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-display font-bold text-sm tracking-wide text-black uppercase">{prod.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="bg-black/5 px-2 py-0.5 text-[9px] rounded-sm font-semibold tracking-widest text-black/60 uppercase">
                                  {prod.category}
                                </span>
                                <span className="text-xs text-blue-600 font-bold">₹{prod.basePrice.toFixed(0)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="px-4 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[10px] font-bold text-black transition-colors"
                            >
                              CONFIGURE
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-4 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-[10px] font-bold text-red-500 transition-colors"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>

                        {/* Variant Stock */}
                        <div className="flex flex-col gap-2 bg-black/5 rounded-xl p-3 border border-black/10">
                          {prod.variants?.map((v: any) => {
                            const isLow = v.stock < 15;
                            return (
                              <div key={v.id} className="flex justify-between items-center text-xs py-2 border-b border-black/5 last:border-0">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-black/80">{v.name}</span>
                                  <span className="text-black/50 text-[10px] font-mono bg-black/10 px-1.5 py-0.5 rounded">{v.sku}</span>
                                  {isLow && (
                                    <span className="text-[#FFC857] flex items-center gap-1 text-[9px] font-bold tracking-widest bg-[#FFC857]/10 px-2 py-0.5 rounded-full">
                                      <AlertTriangle size={10} /> LOW STOCK
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className="font-display font-bold text-black bg-black/5 px-3 py-1 rounded-lg">{v.stock} UNITS</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      placeholder="+ qty"
                                      value={stockUpdates[v.id] || ''}
                                      onChange={(e) => setStockUpdates({ ...stockUpdates, [v.id]: parseInt(e.target.value) || 0 })}
                                      className="w-16 bg-white border border-black/20 rounded-lg px-2 py-1.5 text-center text-black focus:border-blue-500 focus:outline-none text-[10px]"
                                    />
                                    <button
                                      onClick={() => handleStockAdjust(v.id, v.stock)}
                                      className="bg-black/10 text-black p-1.5 rounded-lg hover:bg-blue-500 hover:text-[#111111] transition-colors"
                                    >
                                      <Check size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeTab === 'orders' && (
                <div className="flex flex-col gap-8 relative z-10 text-left">
                  <div className="flex flex-col gap-1 border-b border-black/10 pb-4">
                    <h2 className="font-display font-bold text-2xl tracking-wide">LOGISTICS LOGS</h2>
                    <p className="text-black/40 text-xs">Manage fulfillments and order pipelines.</p>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="p-8 border border-dashed border-black/10 rounded-2xl flex items-center justify-center text-xs text-black/30">
                      No active fulfillments in queue.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((ord, idx) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={ord.id} className="p-5 bg-black/5 backdrop-blur-md rounded-2xl border border-black/5 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-[#111111] tracking-widest">#{ord.id.substring(ord.id.length - 8).toUpperCase()}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest ${
                                ord.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </div>
                            <span className="text-black/60 text-xs font-medium">Revenue: <strong className="text-[#0057FF] text-sm">₹{ord.total.toFixed(0)}</strong></span>
                            <span className="text-black/40 text-[10px]">Destination: {ord.shippingAddress?.fullName} | {ord.shippingAddress?.phone}</span>
                          </div>

                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex flex-col gap-1 w-full md:w-48">
                              <label className="text-[9px] text-black/40 font-bold uppercase tracking-widest">Update Pipeline</label>
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#0057FF] cursor-pointer transition-colors hover:border-black/20"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="PAID">PAID</option>
                                <option value="PROCESSING">PROCESSING INTAKE</option>
                                <option value="MANUFACTURING">FABRICATION</option>
                                <option value="SHIPPED">IN TRANSIT</option>
                                <option value="DELIVERED">FULFILLED</option>
                                <option value="CANCELLED">TERMINATED</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: TICKETS */}
              {activeTab === 'tickets' && (
                <div className="flex flex-col gap-8 relative z-10 text-left">
                  <div className="flex flex-col gap-1 border-b border-black/10 pb-4">
                    <h2 className="font-display font-bold text-2xl tracking-wide">SUPPORT CHANNELS</h2>
                    <p className="text-black/40 text-xs">Resolve pilot queries and support pipelines.</p>
                  </div>

                  {selectedTicket ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-5 bg-black/5 border border-black/10 p-6 rounded-2xl">
                      <button onClick={() => setSelectedTicket(null)} className="text-black/40 hover:text-[#111111] text-xs self-start flex items-center gap-2 transition-colors">
                        ← RETURN TO QUEUE
                      </button>

                      <div className="border-b border-black/10 pb-4">
                        <h4 className="font-display font-bold text-xl text-[#111111] tracking-wide">{selectedTicket.subject}</h4>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="bg-black/10 text-black/70 px-2 py-0.5 rounded font-medium">{selectedTicket.category}</span>
                          <span className="text-black/40">From: {selectedTicket.email}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 min-h-[300px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedTicket.messages?.map((msg: any, idx: number) => {
                          const isAgentMsg = ['ADMIN', 'CUSTOMER_SUPPORT'].includes(msg.senderRole);
                          return (
                            <div 
                              key={idx} 
                              className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed flex flex-col gap-1.5 shadow-lg ${
                                isAgentMsg 
                                  ? 'bg-gradient-to-br from-white/10 to-white/5 border border-black/10 self-end rounded-tr-sm' 
                                  : 'bg-gradient-to-br from-[#0057FF]/20 to-[#0057FF]/5 border border-[#0057FF]/20 self-start rounded-tl-sm'
                              }`}
                            >
                              <span className="font-bold text-[9px] text-black/50 tracking-widest uppercase">{msg.senderName} • {msg.senderRole}</span>
                              <p className="text-black/90 text-sm">{msg.message}</p>
                            </div>
                          );
                        })}
                      </div>

                      <form onSubmit={handleTicketMessageSubmit} className="flex gap-3 mt-2 border-t border-black/10 pt-4">
                        <input
                          type="text"
                          placeholder="Transmit resolution sequence..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          required
                          className="flex-1 bg-black/50 border border-black/10 rounded-xl px-5 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#0057FF] transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-white text-black hover:bg-[#0057FF] transition-colors px-6 rounded-xl flex items-center justify-center font-bold tracking-widest text-xs"
                        >
                          TRANSMIT
                        </button>
                      </form>
                    </motion.div>
                  ) : tickets.length === 0 ? (
                    <div className="p-8 border border-dashed border-black/10 rounded-2xl flex items-center justify-center text-xs text-black/30">
                      No anomalies reported. Channels clear.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tickets.map((t, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          key={t.id} 
                          onClick={() => setSelectedTicket(t)}
                          className="p-5 bg-black/5 hover:bg-black/5 rounded-2xl border border-black/5 cursor-pointer transition-all flex flex-col gap-3 group shadow-lg"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-bold text-[#111111] text-sm tracking-wide group-hover:text-[#0057FF] transition-colors">{t.subject}</h4>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${
                              t.status === 'OPEN' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[#0057FF]/10 border-[#0057FF]/30 text-[#0057FF]'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 text-[10px] text-black/40">
                            <span>Pilot: {t.email}</span>
                            <span>Sector: {t.category}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: CMS BLOCKS */}
              {activeTab === 'cms' && (
                <div className="flex flex-col gap-8 relative z-10 text-left">
                  <div className="flex flex-col gap-1 border-b border-black/10 pb-4">
                    <h2 className="font-display font-bold text-2xl tracking-wide">CMS ARCHITECTURE</h2>
                    <p className="text-black/40 text-xs">Modify global text strings and parameters.</p>
                  </div>
                  
                  {cmsSaveSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-[#0057FF]/10 border border-[#0057FF]/30 rounded-xl text-sm text-[#0057FF] font-medium flex items-center gap-2">
                      <Check size={16} /> {cmsSaveSuccess}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(cmsConfig).map(([key, val], idx) => (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} key={key} className="p-6 bg-black/5 rounded-2xl border border-black/5 flex flex-col gap-5 shadow-lg">
                        <div className="flex justify-between items-center border-b border-black/5 pb-3">
                          <span className="font-display font-bold text-sm text-[#111111] tracking-widest">{key}</span>
                          <button
                            onClick={() => handleSaveCMSKey(key, cmsConfig[key])}
                            className="bg-black/10 hover:bg-white text-[#111111] hover:text-black text-[10px] font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-2"
                          >
                            <Save size={12} /> SYNC
                          </button>
                        </div>

                        {typeof val === 'object' && !Array.isArray(val) ? (
                          <div className="flex flex-col gap-4 text-xs">
                            {Object.keys(val).map((field) => (
                              <div key={field} className="flex flex-col gap-1.5">
                                <label className="text-black/40 text-[9px] font-bold uppercase tracking-widest">{field}</label>
                                <textarea
                                  value={cmsConfig[key]?.[field] || ''}
                                  onChange={(e) => {
                                    const updatedObj = { ...cmsConfig[key], [field]: e.target.value };
                                    setCmsConfig({ ...cmsConfig, [key]: updatedObj });
                                  }}
                                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-[#111111] focus:outline-none focus:border-[#0057FF] min-h-[40px] resize-y"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-black/5 rounded-xl border border-dashed border-black/10 text-[10px] text-black/40">
                            Complex JSON block. Schema protected. Use backend sync scripts to modify.
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Product Add/Edit Modal Form Overlay */}
      <AnimatePresence>
        {productFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-8 font-sans"
          >
            <div onClick={() => setProductFormOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white p-8 rounded-3xl border border-black/10 z-10 relative shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-black/10 pb-4">
                <div className="flex flex-col">
                  <h3 className="font-display font-bold text-2xl text-[#111111] tracking-wide">
                    {editingProduct ? 'RECONFIGURE ASSET' : 'INITIALIZE NEW ASSET'}
                  </h3>
                  <span className="text-[10px] text-black/40 uppercase tracking-widest mt-1">Product Data Matrix</span>
                </div>
                <button onClick={() => setProductFormOpen(false)} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-white/20 transition-colors text-black/60">
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleProductFormSubmit} className="flex flex-col gap-5 text-sm text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Asset Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Lumen Organic Halo Shade"
                    value={pForm.name}
                    onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                    className="bg-black border border-black/10 rounded-xl px-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Category Class</label>
                    <select 
                      value={pForm.category}
                      onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
                      className="bg-black border border-black/10 rounded-xl px-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] cursor-pointer"
                    >
                      <option value="LAMP">LAMP (Luminaires)</option>
                      <option value="DRONE">DRONE (Aeronautics)</option>
                      <option value="BLUETOOTH_CAR">BLUETOOTH CAR (RC Vehicles)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Base Value (₹)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="7500"
                      value={pForm.basePrice}
                      onChange={(e) => setPForm({ ...pForm, basePrice: e.target.value })}
                      className="bg-black border border-black/10 rounded-xl px-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Technical Description</label>
                  <textarea 
                    required
                    placeholder="Summarize product specifications and material attributes..."
                    value={pForm.description}
                    onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                    className="bg-black border border-black/10 rounded-xl px-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] min-h-[100px] resize-y"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Visual Asset Upload</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-xl py-6 bg-black hover:border-[#0057FF]/50 hover:bg-[#0057FF]/5 transition-all cursor-pointer relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden" 
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={18} className="text-black/40 group-hover:text-[#0057FF]" />
                      </div>
                      <span className="text-[11px] text-black/50 font-medium tracking-wide">
                        {uploadingFile ? 'ENCRYPTING & UPLOADING ASSET...' : 'CLICK TO BROWSE SECURE STORAGE'}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Asset URLs (Fallback/Multiple)</label>
                  <textarea 
                    placeholder="https://... image1.jpg, https://... image2.jpg"
                    value={pForm.images}
                    onChange={(e) => setPForm({ ...pForm, images: e.target.value })}
                    className="bg-black border border-black/10 rounded-xl px-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF] min-h-[60px] text-xs font-mono"
                  />
                </div>

                {!editingProduct && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Initial Warehouse Stock Allocation</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 50"
                      value={pForm.initialStock}
                      onChange={(e) => setPForm({ ...pForm, initialStock: e.target.value })}
                      className="bg-black border border-black/10 rounded-xl px-4 py-3 text-[#111111] focus:outline-none focus:border-[#0057FF]"
                    />
                  </div>
                )}

                <div className="flex gap-4 justify-end mt-6 pt-6 border-t border-black/10">
                  <button 
                    type="button" 
                    onClick={() => setProductFormOpen(false)}
                    className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-black/40 hover:text-[#111111] transition-colors"
                  >
                    ABORT
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-white text-black hover:bg-[#0057FF] transition-all rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                  >
                    {editingProduct ? 'SYNC PARAMETERS' : 'INITIALIZE'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AdminDashboard;
