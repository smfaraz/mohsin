import React from 'react';
import { Award, Users, Globe, Heart } from 'lucide-react';
import { APP_NAME } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-medical-light py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-medical-text mb-4">Empowering Healthcare at Home</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {APP_NAME} bridges the gap between hospital-grade medical technology and patient care at home.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
                src="https://picsum.photos/id/1062/600/400" 
                alt="Medical Team" 
                className="rounded-2xl shadow-lg border-4 border-white"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-gray-800">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Mohsin Surgicals in Nampally, Hyderabad is a top player in the category Surgical Equipment Dealers in the Hyderabad. This well-known establishment acts as a one-stop destination servicing customers both local and from other parts of Hyderabad.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform connects you directly with top-tier manufacturers, cutting out middlemen to ensure you get authentic devices at fair prices. Whether you are a caregiver for an elderly parent or a clinic administrator, we are committed to supporting your care journey.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-medical-dark text-white py-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                    <Award size={32} className="mx-auto text-medical-primary" />
                    <div className="text-3xl font-bold">10k+</div>
                    <div className="text-sm opacity-80">Products Sold</div>
                </div>
                <div className="space-y-2">
                    <Users size={32} className="mx-auto text-medical-primary" />
                    <div className="text-3xl font-bold">5000+</div>
                    <div className="text-sm opacity-80">Happy Customers</div>
                </div>
                <div className="space-y-2">
                    <Globe size={32} className="mx-auto text-medical-primary" />
                    <div className="text-3xl font-bold">100+</div>
                    <div className="text-sm opacity-80">Cities Covered</div>
                </div>
                <div className="space-y-2">
                    <Heart size={32} className="mx-auto text-medical-primary" />
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm opacity-80">Support Available</div>
                </div>
            </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-heading font-bold text-gray-800 mb-12">Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="group">
                    <div className="relative overflow-hidden rounded-xl mb-4 max-w-xs mx-auto">
                        <img src={`https://picsum.photos/id/${100 + i}/300/350`} alt="Team Member" className="w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bold text-lg">Dr. Alex Morgan</h3>
                    <p className="text-medical-primary text-sm font-medium">Co-Founder & CMO</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;