import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://promoterproperty.com';
const DEFAULT_TITLE = 'Promoter Property - Buy, Sell & Rent Real Estate, Flats & Luxury Villas';
const DEFAULT_DESCRIPTION = 'Discover verified real estate listings, luxury apartments, villas, commercial plots, and ready-to-move homes at Promoter Property. Contact verified builders and brokers directly.';
const DEFAULT_KEYWORDS = 'real estate, property for sale, buy flat, luxury villas, commercial plots, promoter property, ready to move in, apartments';
const DEFAULT_IMAGE = 'https://promoterproperty.com/assets/images/logo/logo-black.png';

const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath = '',
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  robots = 'index, follow',
  schemaJson = null
}) => {
  const fullTitle = title ? `${title} | Promoter Property` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords || DEFAULT_KEYWORDS;
  
  // Determine path: use passed canonicalPath or fallback to window location pathname
  let targetPath = canonicalPath;
  if (!targetPath && typeof window !== 'undefined' && window.location) {
    targetPath = window.location.pathname;
  }
  if (!targetPath) {
    targetPath = '/';
  }

  // Remove trailing slash if path is longer than 1 character (e.g., /about-us/ -> /about-us)
  if (targetPath.length > 1 && targetPath.endsWith('/')) {
    targetPath = targetPath.slice(0, -1);
  }

  // Format canonical URL cleanly
  const canonicalUrl = targetPath.startsWith('http')
    ? targetPath
    : `${BASE_URL}${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;

  const metaOgTitle = ogTitle || fullTitle;
  const metaOgDesc = ogDescription || metaDescription;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph / Facebook Tags */}
      <meta property="og:site_name" content="Promoter Property" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={metaOgTitle} />
      <meta name="twitter:description" content={metaOgDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) injection */}
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
