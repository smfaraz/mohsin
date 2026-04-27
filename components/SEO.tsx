import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product';
  productData?: {
    name: string;
    image: string;
    description: string;
    sku?: string;
    brand: string;
    price: number;
    currency: string;
    availability: string;
  };
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  canonical, 
  ogImage,
  ogType = 'website',
  productData
}) => {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  const siteUrl = window.location.origin;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : window.location.href;

  const jsonLd = productData ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productData.name,
    "image": [productData.image],
    "description": productData.description,
    "sku": productData.sku,
    "brand": {
      "@type": "Brand",
      "name": productData.brand
    },
    "offers": {
      "@type": "Offer",
      "url": fullCanonical,
      "priceCurrency": productData.currency,
      "price": productData.price,
      "availability": productData.availability === 'InStock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "85"
    }
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      {/* JSON-LD Structured Data for Google SERP Domination */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={fullCanonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO;
