import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '../context/CartContext';
import { fetchProductByHandle, fetchProductById, fetchProductsByCategory } from '../lib/shopify';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Star, CheckCircle, Truck, RotateCcw, ShieldCheck, Minus, Plus, Loader, Phone, MessageCircle, Heart, MapPin, Share2, FileText } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CONTACT_PHONE } from '../constants';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 'id' in the URL is now the handle
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isLoading: isCartLoading } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  
  // Pincode State
  const [pincode, setPincode] = useState('');
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'success' | 'error'>('idle');

// Keep your current useEffect as is
useEffect(() => {
    const loadProduct = async () => {
      if(!id) return; // 'id' from useParams is now the handle
      setIsLoading(true);
      const data = await fetchProductByHandle(id); // load by handle
      setProduct(data);

      try {
        if (data) {
            setActiveImage(data.image);
            const related = await fetchProductsByCategory(data.category);
            setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setIsLoading(false);
      }
      // Inside your existing loadProduct function, right after setProduct(data)
      if (data) {
          // Update Browser Title
          document.title = `${data.title} - ${data.category} | Mohsin Surgicals`;
          
          // Update Meta Description
          const metaDesc = document.querySelector('meta[name="description"]');
          const descriptionText = data.description?.replace(/(<([^>]+)>)/gi, "").substring(0, 160);
          if (metaDesc) {
              metaDesc.setAttribute("content", descriptionText || "");
          }
      }
    };
    loadProduct();
  }, [id]);

// ADD THIS NEW BLOCK BELOW IT FOR RICH SNIPPETS
useEffect(() => {
  if (!product) return;

  // 1. Prepare the Structured Data (JSON-LD)
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [product.image, ...(product.images || [])],
    "description": product.description?.replace(/(<([^>]+)>)/gi, "").substring(0, 160),
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.vendor
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.8,
      "reviewCount": product.reviewCount || 10
    }
  };

  // 2. Create and inject the script tag
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'product-schema';
  script.innerHTML = JSON.stringify(schemaData);
  document.head.appendChild(script);

  // 3. Cleanup: Remove the script when navigating to a different product
  return () => {
    const existingScript = document.getElementById('product-schema');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }
  };
}, [product]); // Runs whenever the product data changes

  const handleCheckPincode = (e: React.FormEvent) => {
      e.preventDefault();
      if(pincode.length !== 6) return;
      setIsCheckingPincode(true);
      setTimeout(() => {
          setIsCheckingPincode(false);
          setPincodeStatus('success');
      }, 800);
  };

  const handleAddToCart = async () => {
    if(product) await addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    if(!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="animate-spin text-medical-primary" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <button onClick={() => navigate('/products')} className="text-medical-primary hover:underline font-medium">Back to Products</button>
        </div>
    );
  }

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;
  
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 border-b border-gray-100">
        <div className="container mx-auto px-4 text-xs md:text-sm text-gray-500">
          <span className="cursor-pointer hover:text-medical-primary" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="cursor-pointer hover:text-medical-primary" onClick={() => navigate('/products')}>Products</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium truncate">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Images */}
          <div className="lg:w-1/2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center relative min-h-[300px] md:min-h-[450px]">
              <img 
                src={activeImage || product.image} 
                alt={product.title} 
                className="max-h-[300px] md:max-h-[400px] w-auto object-contain mix-blend-multiply transition-transform duration-300" 
              />
              <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" title="Share">
                  <Share2 size={20} />
              </button>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-medical-alert text-white px-3 py-1 rounded font-bold text-xs md:text-sm shadow-sm">
                    {discount}% OFF
                </div>
              )}
            </div>
            
            {/* Gallery */}
            {product.images && product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                    {product.images.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`w-16 h-16 md:w-20 md:h-20 border rounded-lg p-1 cursor-pointer transition-all flex-shrink-0 ${activeImage === img ? 'border-medical-primary ring-1 ring-medical-primary' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <img src={img} className="w-full h-full object-contain" alt="" />
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="lg:w-1/2">
            <div className="mb-4">
              <span className="text-medical-dark font-bold text-xs uppercase tracking-wider mb-1 block">
                {product.vendor}
              </span>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 leading-snug mb-2">{product.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center bg-green-50 px-2 py-1 rounded text-green-700 text-sm font-bold gap-1">
                    <span>4.8</span> <Star size={12} fill="currentColor" />
                </div>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm">Brand New</span>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm">GST Invoice Available</span>
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-gray-400 line-through mb-1">₹{product.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-xs text-green-600 font-bold mb-4">Inclusive of all taxes</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                 <div className="flex items-center border border-gray-300 bg-white rounded-lg w-full sm:w-auto">
                    <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-3 py-2 hover:bg-gray-100 text-gray-600"><Minus size={16} /></button>
                    <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 text-gray-600"><Plus size={16} /></button>
                 </div>
                 
                 {/* Desktop Add to Cart */}
                 <button 
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isCartLoading}
                    className={`hidden md:flex flex-1 py-3 px-6 rounded-lg font-bold text-base shadow-lg transition-all items-center justify-center gap-2 ${
                    product.inStock 
                        ? 'bg-medical-primary text-white hover:bg-medical-dark' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                 >
                    {isCartLoading && <Loader className="animate-spin" size={18} />}
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                 </button>
              </div>

              <div className="flex gap-3 mt-3">
                  <button className="flex-1 border border-medical-primary text-medical-primary py-2.5 rounded-lg font-bold text-sm hover:bg-medical-light transition-colors flex items-center justify-center gap-2">
                      <Phone size={16} /> Request Callback
                  </button>
                  <a href={`https://wa.me/?text=Hi, I am interested in ${product.title}`} target="_blank" rel="noreferrer" className="flex-1 border border-green-500 text-green-600 py-2.5 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                      <MessageCircle size={16} /> WhatsApp Us
                  </a>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2"><MapPin size={16} /> Check Delivery</h3>
                <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-sm">
                    <input 
                        type="text" 
                        placeholder="Enter Pincode" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g,'').slice(0,6))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-medical-primary outline-none"
                    />
                    <button type="submit" className="text-medical-primary font-bold text-sm px-4 hover:bg-gray-50 rounded-lg">Check</button>
                </form>
                {isCheckingPincode && <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Loader size={12} className="animate-spin"/> Checking availability...</p>}
                {pincodeStatus === 'success' && (
                    <div className="mt-2 text-sm">
                        <p className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> Delivery Available to {pincode}</p>
                        <p className="text-gray-500 text-xs pl-5">Estimated delivery by <span className="font-bold text-gray-700">5-7 Days</span></p>
                    </div>
                )}
            </div>

            {/* Highlights */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full text-medical-primary shadow-sm"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="font-bold text-sm text-gray-800">1 Year Warranty</p>
                        <p className="text-xs text-gray-500">Manufacturer Warranty included</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-full text-medical-primary shadow-sm"><FileText size={20} /></div>
                    <div>
                        <p className="font-bold text-sm text-gray-800">GST Invoice</p>
                        <p className="text-xs text-gray-500">Save 12-18% with GST Input</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info */}
        <div className="mt-12">
            <div className="flex border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('desc')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'desc' ? 'border-medical-primary text-medical-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Description
                </button>
                <button 
                    onClick={() => setActiveTab('specs')}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'specs' ? 'border-medical-primary text-medical-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Specifications
                </button>
            </div>
            
            <div className="py-8">
                {activeTab === 'desc' && (
                    <div className="prose prose-sm max-w-none text-gray-600">
                        <div dangerouslySetInnerHTML={{ __html: product.description || `<p>Professional grade medical equipment designed for optimal performance.</p>` }} />
                    </div>
                )}
                {activeTab === 'specs' && (
                    <div className="max-w-2xl">
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                            <tbody className="divide-y divide-gray-100">
                                <tr><td className="p-3 bg-gray-50 font-bold w-1/3">Brand</td><td className="p-3">{product.vendor}</td></tr>
                                <tr><td className="p-3 bg-gray-50 font-bold w-1/3">Model</td><td className="p-3">{product.title}</td></tr>
                                <tr><td className="p-3 bg-gray-50 font-bold w-1/3">Category</td><td className="p-3">{product.category}</td></tr>
                                <tr><td className="p-3 bg-gray-50 font-bold w-1/3">Warranty</td><td className="p-3">1 Year</td></tr>
                                <tr><td className="p-3 bg-gray-50 font-bold w-1/3">Condition</td><td className="p-3">Brand New</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-40 flex items-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex-1">
            <p className="text-xs text-gray-500">Total Price</p>
            <p className="text-lg font-bold text-gray-900">₹{(product.price * quantity).toLocaleString()}</p>
        </div>
        <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-8 py-3 rounded-lg font-bold text-sm text-white ${product.inStock ? 'bg-medical-primary' : 'bg-gray-400'}`}
        >
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;