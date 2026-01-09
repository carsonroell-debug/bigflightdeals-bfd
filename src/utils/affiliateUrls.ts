/**
 * Affiliate URL Utilities
 * 
 * Builds tracked affiliate URLs for fallback scenarios when widget fails to load.
 */

/**
 * Builds an affiliate search URL or returns null if no referral URL is configured.
 * 
 * @returns URL string if referral URL is available, null otherwise
 */
export const buildAffiliateSearchUrl = (
  originCode?: string,
  destinationCode?: string
): string | null => {
  // Try to use referral URL from env first (most reliable)
  const referralUrl = import.meta.env.VITE_TRAVELPAYOUTS_REFERRAL_URL;
  if (referralUrl) {
    // If we have origin/destination, try to append them
    if (originCode && destinationCode) {
      try {
        const url = new URL(referralUrl);
        url.searchParams.set('origin', originCode);
        url.searchParams.set('destination', destinationCode);
        return url.toString();
      } catch {
        // If URL parsing fails, return as-is
        return referralUrl;
      }
    }
    return referralUrl;
  }

  // No referral URL configured - return null
  // Caller should handle this by scrolling to homepage widget section
  return null;
};
