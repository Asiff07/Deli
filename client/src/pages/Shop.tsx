import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { Search, Heart, Star, Columns, Eye, Check, X, ShieldCheck, ThumbsUp, MessageSquare, Download } from 'lucide-react';
import axios from 'axios';
import { Product, ProductVariant, Review } from '@lumen-x-deli/shared';

interface ShopProps {
  setPage: (page: string) => void;
  addToCartGlobal: (item: any) => void;
}

export const Shop: React.FC<ShopProps> = ({ setPage, addToCartGlobal }) => {
  const { toggleWishlist, isInWishlist, user } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [category, setCategory] = useState<'ALL' | 'LAMP' | 'DRONE'>('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPageNum] = useState(1);

  // Compare states
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Detailed Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReviews, setModalReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch products from database API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const catQuery = category !== 'ALL' ? `&category=${category}` : '';
      const searchQuery = search ? `&search=${search}` : '';
      const sortQuery = sort ? `&sort=${sort}` : '';
      const res = await axios.get(`/api/v1/products?page=${page}&limit=6${catQuery}${searchQuery}${sortQuery}`);
      if (res.data?.data) {
        setProducts(res.data.data.products);
        setTotalCount(res.data.data.pagination.total);
        setTotalPages(res.data.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNum(1);
    fetchProducts();
  };

  // Compare functions
  const handleToggleCompare = (product: Product) => {
    const exists = compareList.some((p) => p.id === product.id);
    if (exists) {
      setCompareList(compareList.filter((p) => p.id !== product.id));
    } else {
      if (compareList.length >= 3) return; // Max 3 items
      setCompareList([...compareList, product]);
    }
  };

  // Open details modal
  const handleOpenProduct = async (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    setActiveImageIndex(0);
    setReviewComment('');
    setReviewError('');
    try {
      const res = await axios.get(`/api/v1/reviews/product/${product.id}`);
      if (res.data?.data) {
        setModalReviews(res.data.data.reviews);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  // Star Review submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProduct) return;
    setReviewLoading(true);
    setReviewError('');

    try {
      const res = await axios.post(`/api/v1/reviews/product/${selectedProduct.id}`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.data?.data?.review) {
        setModalReviews([res.data.data.review, ...modalReviews]);
        setReviewComment('');
        // Re-fetch products aggregate metrics
        fetchProducts();
      }
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Vote Review helpful
  const handleVoteHelpful = async (reviewId: string) => {
    try {
      const res = await axios.post(`/api/v1/reviews/${reviewId}/helpful`);
      if (res.data?.data?.review) {
        setModalReviews(modalReviews.map((r) => r.id === reviewId ? { ...r, helpfulVotes: res.data.data.review.helpfulVotes } : r));
      }
    } catch (err) {
      console.error('Error voting helpful:', err);
    }
  };

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-16 px-6 md:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Title */}
        <div className="text-left">
          <span className="text-[10px] text-neon-cyan tracking-widest font-semibold uppercase">Synthesis Store</span>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-white mt-1">PRODUCT CATALOG</h1>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass-panel p-4 rounded-xl border border-white/5">
          {/* Category Tabs */}
          <div className="flex gap-2 w-full md:w-auto">
            {(['ALL', 'LAMP', 'DRONE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPageNum(1); }}
                className={`flex-1 md:flex-none px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  category === cat
                    ? 'bg-white text-black font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'ALL' ? 'ALL PRODUCTS' : cat === 'LAMP' ? 'LAMPS' : 'DRONE PARTS'}
              </button>
            ))}
          </div>

          {/* Search & Sort Panel */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search specs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan"
              />
              <Search className="absolute left-3.5 top-3.5 text-white/30" size={13} />
            </form>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPageNum(1); }}
              className="bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-2 text-xs text-white/70 focus:outline-none focus:border-neon-cyan w-full md:w-auto cursor-pointer"
            >
              <option value="">Sort by (Default)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Reviews: High Rating</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-white/40 tracking-wider">Loading physical catalog assets...</div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center text-xs text-white/30 tracking-wider">No matching physical inventory matches search filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const inWish = isInWishlist(product.id);
              const inCompare = compareList.some((p) => p.id === product.id);

              return (
                <div key={product.id} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
                  {/* Heart / Wishlist Trigger */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-4 right-4 p-2 rounded-full border border-white/5 transition-all z-10 cursor-pointer ${
                      inWish ? 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose' : 'bg-black/40 text-white/50 hover:text-white'
                    }`}
                  >
                    <Heart size={14} className={inWish ? 'fill-neon-rose' : ''} />
                  </button>

                  <div onClick={() => handleOpenProduct(product)} className="cursor-pointer">
                    {/* Hover zoom image container */}
                    <div className="w-full h-48 rounded-lg overflow-hidden relative mb-4 border border-white/5">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white/80 border border-white/5 px-2 py-0.5 text-[9px] rounded font-semibold tracking-wider">
                        {product.category}
                      </span>
                    </div>

                    <h3 className={`font-display font-bold text-sm text-white transition-colors truncate ${
                      product.category === 'LAMP' ? 'group-hover:text-neon-yellow' : 'group-hover:text-neon-cyan'
                    }`}>
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-white/40 line-clamp-2 mt-1 leading-relaxed min-h-[32px]">
                      {product.description}
                    </p>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mt-3">
                      <Star size={11} className="fill-neon-yellow text-neon-yellow" />
                      <span className="text-[10px] text-white font-semibold">{product.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-white/30">({product.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-5">
                    <span className="text-sm font-bold text-white">₹{product.basePrice.toFixed(0)}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* Compare Checkbox */}
                      <button
                        onClick={() => handleToggleCompare(product)}
                        className={`p-2 rounded-full border text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                          inCompare 
                            ? (product.category === 'LAMP' ? 'bg-neon-yellow/10 border-neon-yellow/30 text-neon-yellow' : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan') 
                            : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <Columns size={12} />
                        {inCompare ? 'Compared' : 'Compare'}
                      </button>

                      <button
                        onClick={() => handleOpenProduct(product)}
                        className={`text-black transition-all px-4 py-1.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          product.category === 'LAMP' ? 'bg-white hover:bg-neon-yellow' : 'bg-white hover:bg-neon-cyan'
                        }`}
                      >
                        VIEW SPECS
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Simple Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPageNum(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs disabled:opacity-30 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs text-white/50 px-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPageNum(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs disabled:opacity-30 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* 5. COMPARE BOTTOM DRAWER PANEL */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full glass-panel border-t border-white/10 z-40 p-4 animate-slide-up shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neon-cyan font-bold tracking-widest flex items-center gap-1.5">
                <Columns size={12} />
                COMPARE MATRIX ({compareList.length}/3)
              </span>
              <button 
                onClick={() => setCompareList([])} 
                className="text-white/40 hover:text-white text-xs flex items-center gap-1"
              >
                Clear Matrix <X size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareList.map((prod) => (
                <div key={prod.id} className="p-3 bg-white/3 rounded-lg border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded border border-white/10" />
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold truncate text-white">{prod.name}</h4>
                      <p className="text-[10px] text-neon-cyan font-bold">₹{prod.basePrice.toFixed(0)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleCompare(prod)} 
                    className="text-white/35 hover:text-neon-rose p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Compare Spec Grid Popover Trigger */}
            <button
              onClick={() => {
                alert(`Compare Specs:\\n\\n${compareList.map(p => `[${p.name}] Price: ₹${p.basePrice} | Category: ${p.category} | Rating: ${p.rating}`).join('\\n')}`);
              }}
              className="liquid-glass-cyan text-center py-2 rounded-full text-[10px] font-bold tracking-wide cursor-pointer"
            >
              INSPECT GRID OVERLAYS
            </button>
          </div>
        </div>
      )}

      {/* 6. PRODUCT DETAILS MODAL VIEW (PRODUCT PAGE OVERLAY) */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-8 font-sans">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md" />
          
          <div className="w-full max-w-5xl glass-panel rounded-2xl border border-white/10 z-10 overflow-y-auto max-h-[90vh] flex flex-col md:flex-row relative">
            <button 
              onClick={() => setModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white/50 hover:text-white rounded-full z-20 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Left: Product Image Gallery */}
            <div className="w-full md:w-1/2 p-6 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between gap-6">
              <div className="w-full h-[320px] md:h-[400px] rounded-xl overflow-hidden relative border border-white/5 bg-black/25 flex items-center justify-center">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <span className="absolute bottom-3 left-3 bg-black/60 text-white/80 border border-white/5 px-2 py-0.5 text-[9px] rounded font-semibold tracking-wider">
                  IMAGE {activeImageIndex + 1} OF {selectedProduct.images.length}
                </span>
              </div>

              {/* Thumbnails Selector */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none justify-center">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border transition-all cursor-pointer bg-black/35 ${
                        activeImageIndex === idx 
                          ? (selectedProduct.category === 'LAMP' ? 'border-neon-yellow' : 'border-neon-cyan')
                          : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/20'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Specifications, CAD, Reviews */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6 overflow-y-auto max-h-[90vh] md:max-h-[800px]">
              <div>
                <span className="text-[9px] text-neon-cyan font-bold tracking-widest uppercase">{selectedProduct.category} COLLECTION</span>
                <h2 className="font-display font-bold text-xl md:text-2xl text-white mt-1">{selectedProduct.name}</h2>
                
                <p className="text-xs text-white/50 mt-3 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Specs Table */}
                <div className="mt-5">
                  <h4 className="text-[10px] text-white font-bold tracking-wider mb-2 border-b border-white/5 pb-1">TECHNICAL SPECIFICATIONS</h4>
                  <div className="flex flex-col gap-1.5 text-[11px]">
                    {Object.entries(selectedProduct.specs as Record<string, string>).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-white/3">
                        <span className="text-white/40">{k}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>



                {/* Star review Feed */}
                <div className="mt-8">
                  <h4 className="text-[10px] text-white font-bold tracking-wider mb-4 border-b border-white/5 pb-1 uppercase">
                    Operator Reviews ({modalReviews.length})
                  </h4>

                  {/* Add review form */}
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2 p-3 bg-white/3 rounded-lg border border-white/5 mb-6 text-xs">
                      <span className="font-bold text-[10px]">WRITE A BRIEF REVIEW</span>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-white/60 text-[10px]">Star rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewRating(s)}
                              className="text-neon-yellow"
                            >
                              <Star size={13} className={reviewRating >= s ? 'fill-neon-yellow' : ''} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        placeholder="Detail performance logs (min 10 characters)..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan min-h-[60px]"
                      />

                      {reviewError && <p className="text-[9px] text-neon-rose font-medium">{reviewError}</p>}
                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="bg-white text-black py-1.5 rounded font-bold text-[9px] hover:bg-neon-cyan transition-colors self-end px-4 cursor-pointer"
                      >
                        {reviewLoading ? 'Submitting...' : 'POST REVIEW'}
                      </button>
                    </form>
                  ) : (
                    <p className="text-[10px] text-white/30 mb-6 bg-white/3 p-2 rounded text-center border border-white/5">
                      Sign in to submit your product experience reviews.
                    </p>
                  )}

                  {/* Review thread list */}
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
                    {modalReviews.length === 0 ? (
                      <p className="text-[10px] text-white/30 text-center py-4">No reviews posted yet.</p>
                    ) : (
                      modalReviews.map((rev) => (
                        <div key={rev.id} className="border-b border-white/5 pb-3 flex flex-col gap-1.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-white">{rev.userName}</span>
                              {rev.isVerifiedPurchase && (
                                <span className="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 px-1 py-0.5 rounded text-[8px] flex items-center gap-0.5 font-bold">
                                  <ShieldCheck size={8} /> VERIFIED BUYER
                                </span>
                              )}
                            </div>
                            <div className="flex gap-0.5">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} size={9} className="fill-neon-yellow text-neon-yellow" />
                              ))}
                            </div>
                          </div>

                          <p className="text-white/60 leading-relaxed italic">"{rev.comment}"</p>

                          <div className="flex items-center gap-4 text-[9px] text-white/30 mt-1">
                            <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                            <button
                              onClick={() => handleVoteHelpful(rev.id)}
                              className="hover:text-neon-cyan flex items-center gap-1 cursor-pointer"
                            >
                              <ThumbsUp size={10} /> Helpful ({rev.helpfulVotes})
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Purchase CTA Section */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/40 block">Unit base price</span>
                  <span className="text-base font-bold text-white">₹{selectedProduct.basePrice.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  {selectedProduct.isCustomizable && (
                    <button
                      onClick={() => {
                        setPage('builder');
                        setModalOpen(false);
                      }}
                      className="border border-neon-magenta/30 hover:border-neon-magenta text-white hover:bg-neon-magenta/5 px-4 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Bespoke Designer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      addToCartGlobal({
                        productId: selectedProduct.id,
                        name: selectedProduct.name,
                        price: selectedProduct.basePrice,
                        image: selectedProduct.images[0],
                        specs: `${selectedProduct.category} base build`,
                      });
                      alert(`${selectedProduct.name} added to cart.`);
                    }}
                    className="liquid-glass-cyan px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Shop;
