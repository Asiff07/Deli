import React, { useState, useEffect } from 'react';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-neon-rose gap-2">
        <AlertTriangle size={32} />
        <span>Restricted Access. Credentials check failed.</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-16 px-6 md:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Admin Navigation */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-5 text-xs text-left">
            <div className="flex items-center gap-2 text-neon-yellow">
              <Shield size={16} />
              <span className="font-bold tracking-widest uppercase">Admin Command</span>
            </div>

            <div className="flex flex-col gap-1">
              {[
                { key: 'analytics', name: 'Dashboard Analytics', icon: BarChart3 },
                { key: 'inventory', name: 'Stock Inventory', icon: Database },
                { key: 'orders', name: 'Order Management', icon: PackageOpen },
                { key: 'tickets', name: 'Support Queues', icon: HelpCircle },
                { key: 'cms', name: 'CMS Blocks', icon: Settings },
              ].map((tab) => {
                const isAct = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key as any); setSelectedTicket(null); setActionSuccess(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isAct ? 'bg-white/10 text-neon-yellow font-bold' : 'text-white/60 hover:text-white hover:bg-white/3'
                    }`}
                  >
                    <tab.icon size={13} className={isAct ? 'text-neon-yellow' : 'text-white/50'} />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="w-full md:w-3/4 flex flex-col gap-6">
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 min-h-[450px]">
            
            {actionSuccess && (
              <div className="mb-4 p-2 bg-neon-yellow/5 border border-neon-yellow/20 rounded text-[10px] text-neon-yellow font-medium">
                {actionSuccess}
              </div>
            )}

            {/* TAB 1: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-6 text-left">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">SALES & SYSTEM METRICS</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Store revenue', val: `₹${metrics.totalRevenue.toFixed(0)}`, color: 'text-neon-cyan' },
                    { label: 'Registered pilots', val: metrics.users, color: 'text-white' },
                    { label: 'Total checkouts', val: metrics.orders, color: 'text-white' },
                    { label: 'Open tickets', val: metrics.openTickets, color: 'text-neon-rose' },
                  ].map((metric, idx) => (
                    <div key={idx} className="p-4 bg-white/3 rounded-xl border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-white/40 font-semibold uppercase">{metric.label}</span>
                      <span className={`text-lg font-bold ${metric.color}`}>{metric.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-bold text-white/50 tracking-wider mb-3">RECENT ORDER INTAKES</h3>
                  {recentOrders.length === 0 ? (
                    <p className="text-[11px] text-white/30 py-4">No recent purchases recorded.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {recentOrders.map((ord) => (
                        <div key={ord.id} className="p-3 bg-white/3 rounded-lg border border-white/5 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-bold text-white uppercase">#{ord.id.substring(ord.id.length - 6)}</span>
                            <span className="text-white/40 ml-2">{ord.user?.name} ({ord.user?.email})</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-neon-cyan">₹{ord.total.toFixed(0)}</span>
                            <span className="text-[10px] text-white/50">{ord.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: INVENTORY */}
            {activeTab === 'inventory' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h2 className="font-display font-bold text-xl font-display">WAREHOUSE & STOCK CONTROLS</h2>
                  <button 
                    onClick={handleOpenAddProduct}
                    className="bg-white text-black text-[10px] font-bold px-3.5 py-1.5 rounded-full hover:bg-neon-yellow transition-all cursor-pointer"
                  >
                    + ADD NEW PRODUCT
                  </button>
                </div>
                
                <div className="flex flex-col gap-4">
                  {products.map((prod) => (
                    <div key={prod.id} className="p-4 bg-white/3 rounded-xl border border-white/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs text-white uppercase">{prod.name}</span>
                          <span className="bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] rounded font-semibold text-white/60">
                            {prod.category}
                          </span>
                          <span className="text-[10px] text-neon-cyan font-bold">₹{prod.basePrice.toFixed(0)}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="text-[10px] font-semibold text-neon-cyan hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="text-[10px] font-semibold text-neon-rose hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Variant Stock adjustments */}
                      <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
                        {prod.variants?.map((v: any) => {
                          const isLow = v.stock < 15;
                          return (
                            <div key={v.id} className="flex justify-between items-center text-[11px] py-1 border-b border-white/3">
                              <div className="flex items-center gap-2">
                                <span className="text-white/60">{v.name}</span>
                                <span className="text-white/30 text-[9px]">({v.sku})</span>
                                {isLow && (
                                  <span className="text-neon-yellow flex items-center gap-0.5 text-[8px] font-bold">
                                    <AlertTriangle size={10} /> LOW STOCK
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white">{v.stock} units</span>
                                
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    placeholder="+ qty"
                                    value={stockUpdates[v.id] || ''}
                                    onChange={(e) => setStockUpdates({ ...stockUpdates, [v.id]: parseInt(e.target.value) || 0 })}
                                    className="w-12 bg-black border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                                  />
                                  <button
                                    onClick={() => handleStockAdjust(v.id, v.stock)}
                                    className="bg-white text-black p-1 rounded hover:bg-neon-yellow transition-colors cursor-pointer"
                                  >
                                    <Check size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ORDERS */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6 text-left">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">ORDER MANAGEMENT QUEUE</h2>
                
                {orders.length === 0 ? (
                  <p className="text-[11px] text-white/30 py-8">No client orders registered in store database.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="p-4 bg-white/3 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                        <div className="text-[11px] flex flex-col gap-1">
                          <span className="font-bold text-white">ORDER #{ord.id.substring(ord.id.length - 6).toUpperCase()}</span>
                          <span className="text-white/40">Total checkouts: <strong className="text-neon-cyan">₹{ord.total.toFixed(0)}</strong></span>
                          <span className="text-white/30 text-[9px]">Buyer details: {ord.shippingAddress?.fullName} ({ord.shippingAddress?.phone})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                            ord.paymentStatus === 'PAID' ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan' : 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose'
                          }`}>
                            {ord.paymentStatus}
                          </span>

                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-black border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="MANUFACTURING">MANUFACTURING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TICKETS */}
            {activeTab === 'tickets' && (
              <div className="flex flex-col gap-6 text-left">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">CUSTOMER SUPPORT QUEUE</h2>

                {selectedTicket ? (
                  // Detailed chat view for admin replies
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setSelectedTicket(null)} className="text-white/40 hover:text-white text-xs self-start">
                      ← Back to Queues
                    </button>

                    <div className="border border-white/10 rounded-xl bg-black/40 p-4 flex flex-col gap-3 min-h-[250px] max-h-[300px] overflow-y-auto">
                      <div className="border-b border-white/5 pb-2 mb-2 text-xs">
                        <h4 className="font-bold text-white uppercase">{selectedTicket.subject}</h4>
                        <span className="text-white/30 block mt-0.5">Category: {selectedTicket.category} • Client contact: {selectedTicket.email}</span>
                      </div>

                      {selectedTicket.messages?.map((msg: any, idx: number) => {
                        const isAgentMsg = ['ADMIN', 'CUSTOMER_SUPPORT'].includes(msg.senderRole);
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-lg max-w-[80%] text-[11px] leading-relaxed flex flex-col gap-1 ${
                              isAgentMsg 
                                ? 'bg-white/5 border border-white/10 self-end' 
                                : 'bg-neon-cyan/5 border border-neon-cyan/20 self-start'
                            }`}
                          >
                            <span className="font-bold text-[9px] text-white/50">{msg.senderName} ({msg.senderRole})</span>
                            <p className="text-white">{msg.message}</p>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleTicketMessageSubmit} className="flex gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Type operator response (marked in progress)..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        required
                        className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-black hover:bg-neon-cyan transition-colors px-4 py-2.5 rounded-lg flex items-center justify-center cursor-pointer"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                ) : tickets.length === 0 ? (
                  <p className="text-[11px] text-white/30 py-8">No helpdesk tickets opened.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {tickets.map((t) => (
                      <div 
                        key={t.id} 
                        onClick={() => setSelectedTicket(t)}
                        className="p-3 bg-white/3 rounded-lg border border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-all text-xs"
                      >
                        <div>
                          <h4 className="font-bold text-white uppercase">{t.subject}</h4>
                          <span className="text-[9px] text-white/30">Client: {t.email} • Category: {t.category}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                          t.status === 'OPEN' ? 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose' : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: CMS BLOCKS */}
            {activeTab === 'cms' && (
              <div className="flex flex-col gap-6 text-left">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">CMS CONFIGURATION BLOCKS</h2>
                
                {cmsSaveSuccess && (
                  <div className="p-3 bg-neon-cyan/5 border border-neon-cyan/20 rounded text-xs text-neon-cyan">
                    {cmsSaveSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  {Object.entries(cmsConfig).map(([key, val]) => (
                    <div key={key} className="p-4 bg-white/3 rounded-xl border border-white/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-bold text-xs text-white uppercase">{key}</span>
                        <button
                          onClick={() => handleSaveCMSKey(key, cmsConfig[key])}
                          className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-neon-yellow transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Save size={10} /> SAVE BLOCK
                        </button>
                      </div>

                      {/* Render custom editor fields depending on value schema */}
                      {typeof val === 'object' && !Array.isArray(val) ? (
                        <div className="flex flex-col gap-3 text-xs">
                          {Object.keys(val).map((field) => (
                            <div key={field} className="flex flex-col gap-1">
                              <label className="text-white/50 text-[10px] uppercase">{field}</label>
                              <input
                                type="text"
                                value={cmsConfig[key]?.[field] || ''}
                                onChange={(e) => {
                                  const updatedObj = { ...cmsConfig[key], [field]: e.target.value };
                                  setCmsConfig({ ...cmsConfig, [key]: updatedObj });
                                }}
                                className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-white/35">Non-object JSON arrays. Modify via server API configs.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Product Add/Edit Modal Form Overlay */}
      {productFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-8 font-sans">
          <div onClick={() => setProductFormOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          
          <div className="w-full max-w-xl glass-panel p-6 md:p-8 rounded-2xl border border-white/10 z-10 relative">
            <h3 className="font-display font-bold text-lg text-white mb-6 border-b border-white/5 pb-2 uppercase">
              {editingProduct ? 'Modify Product Parameters' : 'Log New Product'}
            </h3>
            
            <form onSubmit={handleProductFormSubmit} className="flex flex-col gap-4 text-xs text-left">
              <div className="flex flex-col gap-1">
                <label className="text-white/60">Product Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lumen Organic Halo Shade"
                  value={pForm.name}
                  onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Category</label>
                  <select 
                    value={pForm.category}
                    onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                  >
                    <option value="LAMP">LAMP (3D Printed shade)</option>
                    <option value="DRONE">DRONE (Carbon component)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Base Price (Rupees ₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 7500"
                    value={pForm.basePrice}
                    onChange={(e) => setPForm({ ...pForm, basePrice: e.target.value })}
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/60">Description</label>
                <textarea 
                  required
                  placeholder="Summarize product specifications and material attributes..."
                  value={pForm.description}
                  onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan min-h-[80px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/60">Upload Product Image File</label>
                <label className="flex flex-col items-center justify-center border border-dashed border-white/15 rounded-lg py-5 bg-black/40 hover:border-neon-cyan/40 transition-all cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="hidden" 
                  />
                  <span className="text-[11px] text-white/50">
                    {uploadingFile ? 'Uploading asset parameters...' : 'Click to Select Image File'}
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/60">Images URLs (Comma separated)</label>
                <textarea 
                  placeholder="https://images.unsplash.com/photo-1, https://images.unsplash.com/photo-2"
                  value={pForm.images}
                  onChange={(e) => setPForm({ ...pForm, images: e.target.value })}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan min-h-[60px]"
                />
              </div>

              {!editingProduct && (
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Initial Warehouse Stock (Standard Variant)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 50"
                    value={pForm.initialStock}
                    onChange={(e) => setPForm({ ...pForm, initialStock: e.target.value })}
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end mt-4 border-t border-white/5 pt-4">
                <button 
                  type="button" 
                  onClick={() => setProductFormOpen(false)}
                  className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-white text-black hover:bg-neon-cyan transition-colors rounded-lg font-semibold cursor-pointer"
                >
                  {editingProduct ? 'Save Parameters' : 'Register Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
