import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, ChevronRight, MapPin } from 'lucide-react';
import axios from 'axios';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setPage: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, setPage }) => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, user } = useCartStore();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping'>('cart');
  
  // Shipping form state
  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setPage('auth');
      onClose();
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Map items for the API format
      const itemsPayload = cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        customBuildId: item.customBuildId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await axios.post('/api/v1/orders', {
        items: itemsPayload,
        shippingAddress: address,
      });

      // Redirect to Stripe checkout page (or mock simulation success url)
      if (res.data?.data?.checkoutUrl) {
        window.location.href = res.data.data.checkoutUrl;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Error initiating checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-neon-cyan" />
              <span className="font-display font-semibold text-lg text-white">Your Cart</span>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <ShoppingBag size={48} className="text-white/10" />
                <span className="text-sm text-white/40">Your shopping cart is currently empty.</span>
                <button
                  onClick={() => { setPage('shop'); onClose(); }}
                  className="liquid-glass-cyan px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide"
                >
                  Browse Catalog
                </button>
              </div>
            ) : checkoutStep === 'cart' ? (
              // Step 1: Cart Items List
              <div className="flex flex-col gap-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-white/3 rounded-lg border border-white/5 items-center justify-between">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover border border-white/5" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-white/40 truncate">{item.specs}</p>
                      <p className="text-xs text-neon-cyan font-bold mt-1">₹{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId, item.customBuildId)}
                        className="text-white/30 hover:text-neon-rose transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="flex items-center border border-white/10 rounded-full px-2 py-1 gap-2 bg-black/40">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId, item.customBuildId)}
                          className="text-white/60 hover:text-neon-cyan"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-[11px] text-white font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId, item.customBuildId)}
                          className="text-white/60 hover:text-neon-cyan"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Step 2: Shipping Form
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-white font-semibold mb-2">
                  <MapPin size={14} className="text-neon-cyan" />
                  <span>Shipping Address Details</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white/60 text-[10px]">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    required
                    className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white/60 text-[10px]">Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white/60 text-[10px]">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleInputChange}
                    className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-[10px]">City</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      required
                      className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-[10px]">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      required
                      className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-[10px]">Postal/Zip Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleInputChange}
                      required
                      className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-[10px]">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+15550199"
                      value={address.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-2 border border-neon-rose/25 bg-neon-rose/5 rounded text-[10px] text-neon-rose font-medium mt-2">
                    {error}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Footer Billing Block */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-[#030303]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/50 font-medium">Order Subtotal</span>
                <span className="text-base text-white font-bold">₹{getCartTotal().toFixed(2)}</span>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => {
                    if (!user) {
                      setPage('auth');
                      onClose();
                    } else {
                      setCheckoutStep('shipping');
                    }
                  }}
                  className="w-full liquid-glass-cyan py-3 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Proceed to Shipping
                  <ChevronRight size={14} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="w-1/3 border border-white/10 text-white/60 hover:text-white py-3 rounded-full text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={loading}
                    className="flex-1 liquid-glass-magenta py-3 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      'Preparing checkout...'
                    ) : (
                      <>
                        <CreditCard size={14} />
                        Checkout (₹
                        {getCartTotal().toFixed(0)})
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartDrawer;
