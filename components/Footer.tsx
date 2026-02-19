import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from '../context/CartContext';
import { CONTACT_EMAIL, CONTACT_PHONE, APP_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-white">{APP_NAME}</h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for hospital-grade medical equipment. Dedicated to improving patient care at home and in clinics.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/mohsin.surgicals.7#" className="hover:text-medical-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-medical-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-medical-primary transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-medical-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-medical-primary transition-colors">Contact Support</Link></li>
              <li><Link to="/policy?type=returns" className="hover:text-medical-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="/policy?type=returns" className="hover:text-medical-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/contact" className="hover:text-medical-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/products?category=Oxygen%20Concentrator" className="hover:text-medical-primary transition-colors">Oxygen Concentrators</Link></li>
              <li><Link to="/products?category=BiPAP" className="hover:text-medical-primary transition-colors">CPAP & BiPAP</Link></li>
              <li><Link to="/products?category=Wheelchair" className="hover:text-medical-primary transition-colors">Wheelchairs</Link></li>
              <li><Link to="/products?category=Patient%20Monitor" className="hover:text-medical-primary transition-colors">Patient Monitors</Link></li>
              <li><Link to="/products?category=Nebulizer" className="hover:text-medical-primary transition-colors">Nebulizers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-medical-primary mt-1" />
                <span>5-8-107/1, Nampally Station Rd,<br/>Mahesh Nagar, Abids,<br/>Hyderabad, Telangana 500001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-medical-primary" />
                <span>{CONTACT_PHONE}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-medical-primary" />
                <span>{CONTACT_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
                <div className="flex items-center gap-6 text-xs text-gray-500">
                    <Link to="/policy?type=privacy" className="hover:text-white">Privacy Policy</Link>
                    <Link to="/policy?type=terms" className="hover:text-white">Terms of Service</Link>
                    <span>GST: 36ABCDE1234F1Z5</span>
                </div>
            </div>
            <p className="text-xs text-gray-600 text-center mt-6 max-w-3xl mx-auto">
                Disclaimer: The information provided on this site is for educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;