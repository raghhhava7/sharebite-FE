import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = 'ShareBite - Reducing Food Waste Together',
  description = 'Join ShareBite to connect food donors, receivers, and volunteers. Reduce food waste and help your community by sharing surplus food with those in need.',
  keywords = 'food waste, food donation, community sharing, surplus food, food rescue, volunteer, sustainability',
  image = '/sharebite-og-image.jpg',
  url = window.location.href,
  type = 'website',
  author = 'ShareBite Team',
  siteName = 'ShareBite',
  locale = 'en_US',
  twitterCard = 'summary_large_image',
  twitterSite = '@sharebite',
  canonical = window.location.href,
  robots = 'index, follow',
  structuredData = null
}) => {
  const fullTitle = title.includes('ShareBite') ? title : `${title} | ShareBite`;
  const fullImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ShareBite",
    "description": description,
    "url": window.location.origin,
    "logo": `${window.location.origin}/sharebite-logo.png`,
    "sameAs": [
      "https://twitter.com/sharebite",
      "https://facebook.com/sharebite",
      "https://linkedin.com/company/sharebite"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@sharebite.com"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#87A96B" />
      <meta name="msapplication-TileColor" content="#87A96B" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ShareBite" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Helmet>
  );
};

export default SEOHead;