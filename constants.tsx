import React from 'react';
import { Product, Testimonial, Category } from './types';
import { 
  Stethoscope, 
  Activity, 
  Wind, 
  Bed, 
  BriefcaseMedical,
  Thermometer,
  Syringe
} from 'lucide-react';

export const APP_NAME = "Mohsin Surgicals";
export const CONTACT_PHONE = "+91 93903 49389";
export const CONTACT_EMAIL = "mohsinsurgicals@gmail.com";

// Placeholder data - Real data is fetched from Shopify
export const PRODUCTS: Product[] = [];

export const CATEGORIES: Category[] = [
  {
    name: "Oxygen Concentrators",
    icon: <BriefcaseMedical size={28} />, // Keeping a fallback icon
    slug: "Oxygen Concentrator",
    // Moved the Base64 string to the image field
    image: "data:image/jpeg;base64,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",
  },
  {
    name: "BiPAP Machines",
    icon: <Activity size={28} />,
    slug: "BiPAP",
    // Moved URL from icon to image
    image: "https://tentabs.in/cdn/shop/products/3_1_01dda184-9651-4130-beb1-dcc3c14dda99.jpg?v=1720075812",
  },
  {
    name: "CPAP Machines",
    icon: <Activity size={28} />,
    slug: "CPAP",
    // Moved URL from icon to image
    image: "https://megamed.in/wp-content/uploads/2023/04/oxymed-auto-cpap-machine-500x500-1.webp",
  },
  { 
    name: "Patient Monitors", 
    icon: <Activity size={28} />, 
    slug: "Patient Monitor",
    image: "https://www.labtron.com/assets/products/LMPPM-A18/17494670661.webp" 
  },
  { 
    name: "Nebulizers", 
    icon: <Wind size={28} />, 
    slug: "Nebulizer",
    image: "https://healthlifebd.com/wp-content/uploads/2024/02/Easy-Compressor-Nebulizer-Machine-1.jpg" 
  },
  { 
    name: "Suction Machines", 
    icon: <Syringe size={28} />, 
    slug: "Suction Machine",
    image: "https://engiomed.ae/wp-content/uploads/2022/04/suction-machine.jpg" 
  },
  { 
    name: "Thermometers", 
    icon: <Thermometer size={28} />, 
    slug: "Thermometer",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    name: "Hospital Furniture", 
    icon: <Bed size={28} />, 
    slug: "Hospital Furniture",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop" 
  },
];

export const BRANDS = [
  { name: "Philips", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Philips_logo_new.svg/2560px-Philips_logo_new.svg.png" },
  { name: "ResMed", logo: "https://1000logos.net/wp-content/uploads/2023/04/Resmed-Logo.png" },
  { name: "BMC", logo: "https://bmc-medical.com/upload/202101/1610613292.png" },
  { name: "Oxymed", logo: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/c4c8e704-5856-4279-873d-98444a7f0e9d.__CR0,0,600,180_PT0_SX600_V1___.png" },
  { name: "BPL", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Bpl_Logo.png" },
  { name: "Nidek", logo: "https://nidekmedical.com/wp-content/uploads/2024/09/nidek-medical-products-logo-website.png" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Dr. A. Sharma",
    role: "Verified Buyer",
    content: "Excellent service. The oxygen concentrator arrived within 24 hours and works perfectly.",
    rating: 5
  },
  {
    id: "2",
    name: "Rajesh K.",
    role: "Customer",
    content: "Great prices compared to other online stores. Will definitely shop here again.",
    rating: 5
  },
  {
    id: "3",
    name: "Priya S.",
    role: "Regular Customer",
    content: "Customer support was very helpful in guiding me to choose the right BiPAP machine.",
    rating: 4
  }
];

export const BLOG_POSTS = [
  { title: "Top 5 Oxygen Concentrators for Home Use", excerpt: "A complete guide to choosing the right machine for your needs.", date: "Oct 12, 2023" },
  { title: "BiPAP vs CPAP: Explained", excerpt: "Understanding the difference between sleep apnea therapies.", date: "Nov 05, 2023" },
  { title: "Home Health Essentials Checklist", excerpt: "Everything you need to set up a safe recovery environment at home.", date: "Dec 01, 2023" },
];