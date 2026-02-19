import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, ShoppingCart, Loader } from 'lucide-react';
import { Link, useNavigate } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, isLoading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
            <ShoppingCart size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any medical supplies yet.</p>
        <button 
            onClick={() => navigate('/products')}
            className="bg-medical-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-medical-dark transition-colors"
        >
            Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
             <h1 className="text-2xl font-heading font-bold text-gray-800">Shopping Cart ({cartCount} items)</h1>
             {isLoading && <Loader className="animate-spin text-medical-primary" size={20} />}
        </div>
        

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 space-y-6">
                {cart.map((item) => (
                  <div key={item.lineItemId || item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.title} className="max-h-20 max-w-20 object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                           <p className="text-xs text-gray-500 mb-1">{item.vendor}</p>
                           <h3 className="font-semibold text-gray-800 line-clamp-2"><Link to={`/products/${item.id}`} className="hover:text-medical-primary">{item.title}</Link></h3>
                           <p className="text-sm text-gray-500 mt-1">{item.specs}</p>
                        </div>
                        <p className="font-bold text-lg text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.lineItemId!, item.quantity - 1)} disabled={isLoading} className="p-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-50"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.lineItemId!, item.quantity + 1)} disabled={isLoading} className="p-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-50"><Plus size={14} /></button>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.lineItemId!)}
                            disabled={isLoading}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 disabled:opacity-50"
                        >
                            <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
                <Link to="/products" className="text-medical-primary font-medium flex items-center gap-2 hover:underline">
                    <ArrowLeft size={16} /> Continue Shopping
                </Link>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹0</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-gray-400 font-medium text-xs">Calculated at next step</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-200 pt-3 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 mb-6">
                <ShieldCheck className="text-medical-dark shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-gray-600">Safe & Secure Checkout via Shopify. 100% Genuine Products Guaranteed.</p>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-medical-dark text-white py-3.5 rounded-lg font-bold shadow-lg shadow-medical-dark/20 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'} <ArrowRight size={18} />
              </button>
              
              <div className="mt-4 flex justify-center gap-2">
                 {/* Mock Payment Icons */}
                 <div className="w-8 h-5 bg-gray-200 rounded"></div>
                 <div className="w-8 h-5 bg-gray-200 rounded"></div>
                 <div className="w-8 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;