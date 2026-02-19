import React, { useState } from 'react';
import { FileText, Send, Building, CheckCircle, Loader } from 'lucide-react';
import { Link } from '../context/CartContext';
import { CONTACT_PHONE } from '../constants';

const BulkOrderPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSending(true);
      // Simulate API delay
      setTimeout(() => {
          setIsSending(false);
          setIsSubmitted(true);
      }, 1500);
  };

  return (
    <div className="bg-medical-light/30 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
            
          {/* Info Side */}
          <div className="bg-medical-dark text-white p-8 md:w-1/3 flex flex-col justify-between">
            <div>
                <Building className="mb-4 text-medical-primary" size={48} />
                <h1 className="text-3xl font-heading font-bold mb-4">Institutional Sales</h1>
                <p className="text-blue-100 mb-6">
                    Partner with us for hospital projects, clinic setups, and bulk procurement. We offer special B2B pricing and credit terms.
                </p>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2 opacity-90"><div className="w-1.5 h-1.5 bg-medical-primary rounded-full"></div> GST Invoicing</li>
                    <li className="flex items-center gap-2 opacity-90"><div className="w-1.5 h-1.5 bg-medical-primary rounded-full"></div> Priority Shipping</li>
                    <li className="flex items-center gap-2 opacity-90"><div className="w-1.5 h-1.5 bg-medical-primary rounded-full"></div> Installation Support</li>
                </ul>
            </div>
            <div className="mt-8 text-sm opacity-75">
                Questions? Call {CONTACT_PHONE}
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:w-2/3 relative">
            {isSubmitted ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 animate-fadeIn bg-white">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Quote Request Received!</h2>
                    <p className="text-gray-600 mb-6">We have received your bulk order inquiry. Our institutional sales manager will contact you at the provided number within 24 hours.</p>
                    <Link to="/" className="text-medical-primary font-bold hover:underline">Return to Home</Link>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Request a Quote</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                                <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-medical-primary focus:outline-none bg-gray-50" placeholder="Dr. John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Organization Name</label>
                                <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-medical-primary focus:outline-none bg-gray-50" placeholder="City Hospital" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                                <input type="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-medical-primary focus:outline-none bg-gray-50" placeholder="admin@hospital.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                                <input type="tel" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-medical-primary focus:outline-none bg-gray-50" placeholder="+91 98765 43210" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Requirement Details</label>
                            <textarea required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-medical-primary focus:outline-none bg-gray-50 h-32" placeholder="List products and estimated quantities..."></textarea>
                        </div>

                        <button type="submit" disabled={isSending} className="bg-medical-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-medical-dark transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                             {isSending ? <Loader className="animate-spin" size={18} /> : <><Send size={18} /> Submit Enquiry</>}
                        </button>
                    </form>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderPage;