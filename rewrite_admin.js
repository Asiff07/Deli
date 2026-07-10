const fs = require('fs');

let content = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

// We will inject framer-motion import if not present
if (!content.includes('framer-motion')) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';"
  );
}

// Replace the return statement
// We find the index of "if (!user || !['ADMIN', 'EDITOR', 'CUSTOMER_SUPPORT'].includes(user.role)) {"
const authCheckIndex = content.indexOf("if (!user || !['ADMIN'");
if (authCheckIndex === -1) throw new Error("Could not find auth check");

// Keep everything before the auth check
let newContent = content.substring(0, authCheckIndex);

// Add the new modern UI
newContent += `  if (!user || !['ADMIN', 'EDITOR', 'CUSTOMER_SUPPORT'].includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-neon-rose gap-4 font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-neon-rose/20 blur-[120px] rounded-full pointer-events-none" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 z-10 glass-panel p-8 rounded-2xl border border-neon-rose/20">
          <AlertTriangle size={48} className="text-neon-rose" />
          <span className="font-display font-bold text-lg tracking-wider text-white">RESTRICTED ACCESS</span>
          <span className="text-white/60 text-sm">Credentials check failed.</span>
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
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-16 px-6 md:px-12 font-sans relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-neon-cyan/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-neon-rose/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Modern Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-28 flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-rose/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                <Shield size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold tracking-widest uppercase text-sm">Admin Control</span>
                <span className="text-[10px] text-neon-cyan">v2.0.4 - SECURE</span>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((tab) => {
                const isAct = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key as any); setSelectedTicket(null); setActionSuccess(''); }}
                    className={\`group relative w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all duration-300 overflow-hidden \${
                      isAct ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                    }\`}
                  >
                    {isAct && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-transparent border-l-2 border-neon-cyan z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <tab.icon size={16} className={\`relative z-10 transition-colors duration-300 \${isAct ? 'text-neon-cyan' : 'group-hover:text-white'}\`} />
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
              className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 min-h-[600px] shadow-2xl relative overflow-hidden"
            >
              {/* Subtle grid pattern background */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

              {actionSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl text-xs text-neon-cyan flex items-center gap-2">
                  <Check size={14} /> {actionSuccess}
                </motion.div>
              )}

              {/* TAB 1: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="flex flex-col gap-8 relative z-10 text-left">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-display font-bold text-2xl tracking-wide">SYSTEM INTELLIGENCE</h2>
                    <p className="text-white/40 text-xs">Real-time metrics and order flow analysis.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', val: \`₹\${metrics.totalRevenue.toFixed(0)}\`, color: 'text-neon-cyan', icon: ArrowUpRight },
                      { label: 'Active Pilots', val: metrics.users, color: 'text-white', icon: Users },
                      { label: 'Total Checkouts', val: metrics.orders, color: 'text-white', icon: PackageOpen },
                      { label: 'Support Queue', val: metrics.openTickets, color: 'text-neon-rose', icon: AlertTriangle },
                    ].map((metric, idx) => (
                      <div key={idx} className="group p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-2 hover:border-white/20 transition-all duration-300">
                        <div className="flex justify-between items-center text-white/40">
                          <span className="text-[10px] font-bold tracking-widest uppercase">{metric.label}</span>
                          <metric.icon size={12} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <span className={\`text-2xl font-display font-bold \${metric.color}\`}>{metric.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-4">
                    <h3 className="font-display text-sm font-bold tracking-widest uppercase text-white/70">Recent Intake</h3>
                    {recentOrders.length === 0 ? (
                      <div className="p-8 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-xs text-white/30">
                        No recent purchases recorded in the network.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {recentOrders.map((ord, idx) => (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={ord.id} className="p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white/80">
                                #{ord.id.substring(ord.id.length - 4)}
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-white">{ord.user?.name}</span>
                                <span className="text-white/40">{ord.user?.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="font-display font-bold text-lg text-neon-cyan">₹{ord.total.toFixed(0)}</span>
                              <span className={\`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider \${
                                ord.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/70'
                              }\`}>{ord.status}</span>
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
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-display font-bold text-2xl tracking-wide">WAREHOUSE STOCK</h2>
                      <p className="text-white/40 text-xs">Manage product variants and configurations.</p>
                    </div>
                    <button 
                      onClick={handleOpenAddProduct}
                      className="group bg-white text-black text-[10px] font-bold px-5 py-2.5 rounded-full hover:bg-neon-cyan transition-all flex items-center gap-2"
                    >
                      <span className="group-hover:rotate-90 transition-transform duration-300">+</span> NEW ASSET
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {products.map((prod, idx) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={prod.id} className="p-5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                              {prod.images?.[0] ? <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" /> : <PackageOpen className="w-full h-full p-3 text-white/20" />}
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-display font-bold text-sm tracking-wide text-white uppercase">{prod.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="bg-white/10 px-2 py-0.5 text-[9px] rounded-sm font-semibold tracking-widest text-white/70 uppercase">
                                  {prod.category}
                                </span>
                                <span className="text-xs text-neon-cyan font-bold">₹{prod.basePrice.toFixed(0)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white transition-colors"
                            >
                              CONFIGURE
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-4 py-1.5 rounded-full bg-neon-rose/10 hover:bg-neon-rose/20 text-[10px] font-bold text-neon-rose transition-colors"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>

                        {/* Variant Stock */}
                        <div className="flex flex-col gap-2 bg-black/40 rounded-xl p-3 border border-white/5">
                          {prod.variants?.map((v: any) => {
                            const isLow = v.stock < 15;
                            return (
                              <div key={v.id} className="flex justify-between items-center text-xs py-2 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-white/80">{v.name}</span>
                                  <span className="text-white/30 text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded">{v.sku}</span>
                                  {isLow && (
                                    <span className="text-neon-yellow flex items-center gap-1 text-[9px] font-bold tracking-widest bg-neon-yellow/10 px-2 py-0.5 rounded-full">
                                      <AlertTriangle size={10} /> LOW STOCK
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className="font-display font-bold text-white bg-white/5 px-3 py-1 rounded-lg">{v.stock} UNITS</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      placeholder="+ qty"
                                      value={stockUpdates[v.id] || ''}
                                      onChange={(e) => setStockUpdates({ ...stockUpdates, [v.id]: parseInt(e.target.value) || 0 })}
                                      className="w-16 bg-black border border-white/10 rounded-lg px-2 py-1.5 text-center text-white focus:border-neon-cyan focus:outline-none text-[10px]"
                                    />
                                    <button
                                      onClick={() => handleStockAdjust(v.id, v.stock)}
                                      className="bg-white/10 text-white p-1.5 rounded-lg hover:bg-neon-cyan hover:text-black transition-colors"
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
                  <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                    <h2 className="font-display font-bold text-2xl tracking-wide">LOGISTICS LOGS</h2>
                    <p className="text-white/40 text-xs">Manage fulfillments and order pipelines.</p>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="p-8 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-xs text-white/30">
                      No active fulfillments in queue.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((ord, idx) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={ord.id} className="p-5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-white tracking-widest">#{ord.id.substring(ord.id.length - 8).toUpperCase()}</span>
                              <span className={\`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest \${
                                ord.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-neon-rose/10 text-neon-rose'
                              }\`}>
                                {ord.paymentStatus}
                              </span>
                            </div>
                            <span className="text-white/60 text-xs font-medium">Revenue: <strong className="text-neon-cyan text-sm">₹{ord.total.toFixed(0)}</strong></span>
                            <span className="text-white/40 text-[10px]">Destination: {ord.shippingAddress?.fullName} | {ord.shippingAddress?.phone}</span>
                          </div>

                          <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex flex-col gap-1 w-full md:w-48">
                              <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Update Pipeline</label>
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan cursor-pointer transition-colors hover:border-white/20"
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
                  <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                    <h2 className="font-display font-bold text-2xl tracking-wide">SUPPORT CHANNELS</h2>
                    <p className="text-white/40 text-xs">Resolve pilot queries and support pipelines.</p>
                  </div>

                  {selectedTicket ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-5 bg-black/40 border border-white/10 p-6 rounded-2xl">
                      <button onClick={() => setSelectedTicket(null)} className="text-white/40 hover:text-white text-xs self-start flex items-center gap-2 transition-colors">
                        ← RETURN TO QUEUE
                      </button>

                      <div className="border-b border-white/10 pb-4">
                        <h4 className="font-display font-bold text-xl text-white tracking-wide">{selectedTicket.subject}</h4>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded font-medium">{selectedTicket.category}</span>
                          <span className="text-white/40">From: {selectedTicket.email}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 min-h-[300px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedTicket.messages?.map((msg: any, idx: number) => {
                          const isAgentMsg = ['ADMIN', 'CUSTOMER_SUPPORT'].includes(msg.senderRole);
                          return (
                            <div 
                              key={idx} 
                              className={\`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed flex flex-col gap-1.5 shadow-lg \${
                                isAgentMsg 
                                  ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 self-end rounded-tr-sm' 
                                  : 'bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 border border-neon-cyan/20 self-start rounded-tl-sm'
                              }\`}
                            >
                              <span className="font-bold text-[9px] text-white/50 tracking-widest uppercase">{msg.senderName} • {msg.senderRole}</span>
                              <p className="text-white/90 text-sm">{msg.message}</p>
                            </div>
                          );
                        })}
                      </div>

                      <form onSubmit={handleTicketMessageSubmit} className="flex gap-3 mt-2 border-t border-white/10 pt-4">
                        <input
                          type="text"
                          placeholder="Transmit resolution sequence..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          required
                          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-white text-black hover:bg-neon-cyan transition-colors px-6 rounded-xl flex items-center justify-center font-bold tracking-widest text-xs"
                        >
                          TRANSMIT
                        </button>
                      </form>
                    </motion.div>
                  ) : tickets.length === 0 ? (
                    <div className="p-8 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-xs text-white/30">
                      No anomalies reported. Channels clear.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tickets.map((t, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          key={t.id} 
                          onClick={() => setSelectedTicket(t)}
                          className="p-5 bg-black/40 hover:bg-white/5 rounded-2xl border border-white/5 cursor-pointer transition-all flex flex-col gap-3 group shadow-lg"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-bold text-white text-sm tracking-wide group-hover:text-neon-cyan transition-colors">{t.subject}</h4>
                            <span className={\`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border \${
                              t.status === 'OPEN' ? 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose' : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
                            }\`}>
                              {t.status}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 text-[10px] text-white/40">
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
                  <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                    <h2 className="font-display font-bold text-2xl tracking-wide">CMS ARCHITECTURE</h2>
                    <p className="text-white/40 text-xs">Modify global text strings and parameters.</p>
                  </div>
                  
                  {cmsSaveSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl text-sm text-neon-cyan font-medium flex items-center gap-2">
                      <Check size={16} /> {cmsSaveSuccess}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(cmsConfig).map(([key, val], idx) => (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} key={key} className="p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-5 shadow-lg">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <span className="font-display font-bold text-sm text-white tracking-widest">{key}</span>
                          <button
                            onClick={() => handleSaveCMSKey(key, cmsConfig[key])}
                            className="bg-white/10 hover:bg-white text-white hover:text-black text-[10px] font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-2"
                          >
                            <Save size={12} /> SYNC
                          </button>
                        </div>

                        {typeof val === 'object' && !Array.isArray(val) ? (
                          <div className="flex flex-col gap-4 text-xs">
                            {Object.keys(val).map((field) => (
                              <div key={field} className="flex flex-col gap-1.5">
                                <label className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{field}</label>
                                <textarea
                                  value={cmsConfig[key]?.[field] || ''}
                                  onChange={(e) => {
                                    const updatedObj = { ...cmsConfig[key], [field]: e.target.value };
                                    setCmsConfig({ ...cmsConfig, [key]: updatedObj });
                                  }}
                                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-neon-cyan min-h-[40px] resize-y"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-white/5 rounded-xl border border-dashed border-white/10 text-[10px] text-white/40">
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
              className="w-full max-w-2xl bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 z-10 relative shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="flex flex-col">
                  <h3 className="font-display font-bold text-2xl text-white tracking-wide">
                    {editingProduct ? 'RECONFIGURE ASSET' : 'INITIALIZE NEW ASSET'}
                  </h3>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Product Data Matrix</span>
                </div>
                <button onClick={() => setProductFormOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors text-white/60">
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleProductFormSubmit} className="flex flex-col gap-5 text-sm text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Asset Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Lumen Organic Halo Shade"
                    value={pForm.name}
                    onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Category Class</label>
                    <select 
                      value={pForm.category}
                      onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                    >
                      <option value="LAMP">LAMP (Luminaires)</option>
                      <option value="DRONE">DRONE (Aeronautics)</option>
                      <option value="BLUETOOTH_CAR">BLUETOOTH CAR (RC Vehicles)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Base Value (₹)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="7500"
                      value={pForm.basePrice}
                      onChange={(e) => setPForm({ ...pForm, basePrice: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Technical Description</label>
                  <textarea 
                    required
                    placeholder="Summarize product specifications and material attributes..."
                    value={pForm.description}
                    onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan min-h-[100px] resize-y"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Visual Asset Upload</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl py-6 bg-black hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all cursor-pointer relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden" 
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={18} className="text-white/40 group-hover:text-neon-cyan" />
                      </div>
                      <span className="text-[11px] text-white/50 font-medium tracking-wide">
                        {uploadingFile ? 'ENCRYPTING & UPLOADING ASSET...' : 'CLICK TO BROWSE SECURE STORAGE'}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Asset URLs (Fallback/Multiple)</label>
                  <textarea 
                    placeholder="https://... image1.jpg, https://... image2.jpg"
                    value={pForm.images}
                    onChange={(e) => setPForm({ ...pForm, images: e.target.value })}
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan min-h-[60px] text-xs font-mono"
                  />
                </div>

                {!editingProduct && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Initial Warehouse Stock Allocation</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 50"
                      value={pForm.initialStock}
                      onChange={(e) => setPForm({ ...pForm, initialStock: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                )}

                <div className="flex gap-4 justify-end mt-6 pt-6 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setProductFormOpen(false)}
                    className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    ABORT
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-white text-black hover:bg-neon-cyan transition-all rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
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
`;

fs.writeFileSync('client/src/pages/AdminDashboard.tsx', newContent);
console.log('Admin UI updated.');
