import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import BulkOrderPage from './pages/BulkOrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';


// Scroll to top on route change component
const ScrollToTopOnMount = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTopOnMount />
          <div className="min-h-screen font-sans text-gray-800 bg-white flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/bulk-orders" element={<BulkOrderPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/policy" element={<PolicyPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Sticky WhatsApp Button */}
            <a 
              href="#" 
              className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center"
              aria-label="Chat on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </a>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;