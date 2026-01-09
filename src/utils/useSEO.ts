/**
 * SEO Hook
 *
 * Updates document title and meta description for React 19.
 * Lightweight alternative to react-helmet for basic SEO needs.
 */

import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
}

const DEFAULT_TITLE = 'BigFlightDeals - Solo Budget Travel & Cheap Flight Alerts';
const DEFAULT_DESCRIPTION = 'Your travel buddy for solo budget adventures and real cheap flights. Get honest flight deals, smart packing tips, and the exact tools for solo travel.';

/**
 * Update document head with SEO meta tags.
 */
export const useSEO = ({ title, description, keywords }: SEOProps): void => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update meta keywords if provided
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = DEFAULT_TITLE;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', DEFAULT_DESCRIPTION);
      }
    };
  }, [title, description, keywords]);
};
