import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, Heart, Cpu, ShieldCheck, Mail, User as UserIcon, MessageSquare, AlertCircle, FileText, Send } from 'lucide-react';
import axios from 'axios';
import { Order, SupportTicket, CustomBuild } from '@lumen-x-deli/shared';

interface UserDashboardProps {
  setPage: (page: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ setPage }) => {
  const { user, wishlist, setUser } = useCartStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'builds' | 'tickets' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [builds, setBuilds] = useState<CustomBuild[]>([]);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Detailed Ticket message states
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Fetch Dashboard content
  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const [ordersRes, ticketsRes] = await Promise.all([
        axios.get('/api/v1/orders'),
        axios.get('/api/v1/tickets/my'),
      ]);
      if (ordersRes.data?.data) setOrders(ordersRes.data.data.orders);
      if (ticketsRes.data?.data) setTickets(ticketsRes.data.data.tickets);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Update Profile
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    try {
      const res = await axios.patch('/api/v1/auth/profile', { name, avatarUrl });
      if (res.data?.data?.user) {
        setUser(res.data.data.user);
        setProfileSuccess('Profile credentials modified.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  // Submit Ticket reply
  const handleTicketReply = async (e: React.FormEvent) => {
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
        };
        setSelectedTicket(updatedTicket);
        setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
        setReplyMessage('');
      }
    } catch (err) {
      console.error('Ticket reply error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white/50 gap-4">
        <span>Access verification required. Please login first.</span>
        <button onClick={() => setPage('auth')} className="liquid-glass-cyan px-6 py-2 rounded-full font-bold text-xs">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-16 px-6 md:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation Panel */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-6 text-xs">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-neon-cyan font-bold">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-bold text-white text-sm">{user.name}</h3>
                <span className="text-[10px] text-white/40 block mt-0.5">{user.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
              {[
                { key: 'orders', name: 'Order History', icon: ShoppingBag },
                { key: 'wishlist', name: 'Wishlist Catalog', icon: Heart },
                { key: 'tickets', name: 'Support Tickets', icon: MessageSquare },
                { key: 'profile', name: 'Profile Settings', icon: UserIcon },
              ].map((tab) => {
                const isAct = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key as any); setSelectedTicket(null); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isAct ? 'bg-white/10 text-neon-cyan font-bold' : 'text-white/60 hover:text-white hover:bg-white/3'
                    }`}
                  >
                    <tab.icon size={14} className={isAct ? 'text-neon-cyan' : 'text-white/50'} />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Body Display Panel */}
        <div className="w-full md:w-3/4 flex flex-col gap-6">
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 min-h-[450px]">
            
            {/* 1. TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">ORDER HISTORY</h2>
                
                {orders.length === 0 ? (
                  <p className="text-xs text-white/40 py-12 text-center">No orders registered on your user profile. Browse our shop catalog to get started.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="p-4 bg-white/3 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                        <div className="text-xs flex flex-col gap-1 text-left">
                          <span className="font-bold text-white text-[11px]">ORDER #{ord.id.substring(ord.id.length - 6).toUpperCase()}</span>
                          <span className="text-[10px] text-white/30">{new Date(ord.createdAt).toLocaleDateString()}</span>
                          <div className="mt-2 flex flex-col gap-1 text-[11px] text-white/60">
                            {ord.items.map((i, idx) => (
                              <span key={idx}>• {i.name} (x{i.quantity})</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-between text-xs">
                          <span className="font-bold text-neon-cyan">₹{ord.total.toFixed(2)}</span>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border ${
                              ord.paymentStatus === 'PAID' 
                                ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan' 
                                : 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border ${
                              ord.status === 'SHIPPED' || ord.status === 'DELIVERED'
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-neon-magenta/10 border-neon-magenta/30 text-neon-magenta animate-pulse'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. TAB: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="flex flex-col gap-6">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">WISHLIST CATALOG</h2>
                {wishlist.length === 0 ? (
                  <p className="text-xs text-white/40 py-12 text-center">Your wishlist is currently empty. Flag catalog items to track them.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((prod) => (
                      <div key={prod.id} className="p-3 bg-white/3 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded border border-white/10" />
                          <div className="text-xs text-left min-w-0">
                            <h4 className="font-bold truncate text-white">{prod.name}</h4>
                            <p className="text-neon-cyan mt-0.5 font-bold">₹{prod.basePrice.toFixed(0)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPage('shop')}
                          className="bg-white text-black text-[10px] font-bold px-3.5 py-1.5 rounded-full hover:bg-neon-cyan transition-colors"
                        >
                          EXPLORE
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. TAB: TICKETS */}
            {activeTab === 'tickets' && (
              <div className="flex flex-col gap-6">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">HELP TICKET SYSTEM</h2>
                
                {selectedTicket ? (
                  // Detail message logs chat view
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setSelectedTicket(null)} 
                      className="text-white/40 hover:text-white text-xs self-start"
                    >
                      ← Back to Tickets
                    </button>

                    <div className="border border-white/10 rounded-xl bg-black/40 p-4 flex flex-col gap-3 min-h-[300px] max-h-[350px] overflow-y-auto">
                      <div className="border-b border-white/5 pb-2 mb-2">
                        <h4 className="text-xs font-bold text-white uppercase">{selectedTicket.subject}</h4>
                        <span className="text-[9px] text-white/30 block mt-0.5">Category: {selectedTicket.category}</span>
                      </div>

                      {selectedTicket.messages?.map((msg, idx) => {
                        const isUser = msg.senderId === user.id;
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-lg max-w-[80%] text-[11px] leading-relaxed text-left flex flex-col gap-1 ${
                              isUser 
                                ? 'bg-white/5 border border-white/10 self-end' 
                                : 'bg-neon-cyan/5 border border-neon-cyan/20 self-start'
                            }`}
                          >
                            <span className="font-bold text-[9px] text-white/50">{msg.senderName} ({msg.senderRole})</span>
                            <p className="text-white">{msg.message}</p>
                            <span className="text-[8px] text-white/20 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleTicketReply} className="flex gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Type troubleshooting response..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        required
                        className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-black hover:bg-neon-cyan transition-colors px-4 py-2.5 rounded-lg flex items-center justify-center"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                ) : tickets.length === 0 ? (
                  <p className="text-xs text-white/40 py-12 text-center">No active support tickets found. Click Help in footer to open one.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {tickets.map((tick) => (
                      <div 
                        key={tick.id} 
                        onClick={() => setSelectedTicket(tick)}
                        className="p-4 bg-white/3 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-all"
                      >
                        <div className="text-xs flex flex-col gap-1 text-left">
                          <h4 className="font-bold text-white uppercase">{tick.subject}</h4>
                          <span className="text-[9px] text-white/30">Category: {tick.category} • Updated: {new Date(tick.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                          tick.status === 'OPEN'
                            ? 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose'
                            : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
                        }`}>
                          {tick.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. TAB: PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4 text-xs text-left">
                <h2 className="font-display font-bold text-xl border-b border-white/5 pb-2">PROFILE SETTINGS</h2>
                
                {profileSuccess && (
                  <div className="p-3 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg text-xs text-neon-cyan">
                    {profileSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Profile Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full md:w-1/2 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full md:w-2/3 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <button
                  type="submit"
                  className="liquid-glass-cyan py-2.5 rounded-lg text-xs font-semibold tracking-wide self-start px-6 mt-4 cursor-pointer"
                >
                  SAVE MODIFICATIONS
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
export default UserDashboard;
