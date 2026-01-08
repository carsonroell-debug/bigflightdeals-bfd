/**
 * Widget Injection Utilities
 * 
 * Shared logic for injecting Travelpayouts/Aviasales widget into containers.
 * Used by both FlightWidget (full-page) and MissionModal (modal).
 */

const TRAVELPAYOUTS_WIDGET_SNIPPET = `
<script async src="https://tpwdgt.com/content?currency=usd&trs=387747&shmarker=605276&show_hotels=true&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100" charset="utf-8"></script>
`;

/**
 * Modifies the widget snippet to include origin and destination parameters.
 */
export const modifyWidgetSnippetWithRoute = (
  snippet: string,
  originCode: string,
  destinationCode: string
): string => {
  const scriptSrcMatch = snippet.match(/src="([^"]+)"/);
  if (!scriptSrcMatch || !scriptSrcMatch[1]) {
    console.warn('[widgetInjection] Could not extract script src from snippet');
    return snippet;
  }

  const originalUrl = scriptSrcMatch[1];
  
  try {
    const url = new URL(originalUrl);
    url.searchParams.set('origin', originCode);
    url.searchParams.set('destination', destinationCode);
    const modifiedSnippet = snippet.replace(scriptSrcMatch[1], url.toString());
    return modifiedSnippet;
  } catch (error) {
    console.warn('[widgetInjection] Failed to modify widget URL:', error);
    return snippet;
  }
};

/**
 * Injects the widget into a container element.
 * Clears existing content, injects snippet, and executes scripts.
 */
export const injectWidget = (
  container: HTMLDivElement,
  originCode?: string,
  destinationCode?: string
): void => {
  if (!container) {
    console.warn('[widgetInjection] Container is null, cannot inject widget');
    return;
  }

  // Clear any existing content
  container.innerHTML = '';

  // Get the widget snippet, modified with route if provided
  let widgetSnippet = TRAVELPAYOUTS_WIDGET_SNIPPET;
  if (originCode && destinationCode) {
    widgetSnippet = modifyWidgetSnippetWithRoute(
      TRAVELPAYOUTS_WIDGET_SNIPPET,
      originCode,
      destinationCode
    );
    console.log('[widgetInjection] Widget URL modified with route:', {
      origin: originCode,
      destination: destinationCode,
    });
  }

  // Inject the widget snippet HTML
  container.innerHTML = widgetSnippet;

  // Find all script tags and re-execute them
  const scriptTags = container.querySelectorAll('script');
  const scriptCount = scriptTags.length;

  if (scriptCount === 0) {
    console.warn('[widgetInjection] No script tags found in widget snippet');
    return;
  }

  console.log(`[widgetInjection] Found ${scriptCount} script tag(s), re-executing...`);

  scriptTags.forEach((oldScript, index) => {
    const newScript = document.createElement('script');

    // Copy all attributes
    Array.from(oldScript.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });

    // Copy inline JavaScript if present
    if (oldScript.textContent) {
      newScript.textContent = oldScript.textContent;
    }

    // Set defaults if not present
    if (!newScript.hasAttribute('async')) {
      newScript.async = true;
    }
    if (!newScript.hasAttribute('charset')) {
      newScript.charset = 'utf-8';
    }

    // Replace to trigger execution
    if (oldScript.parentNode) {
      oldScript.parentNode.replaceChild(newScript, oldScript);
      console.log(`[widgetInjection] Script ${index + 1}/${scriptCount} re-executed`);
    }
  });

  console.log(`[widgetInjection] Widget injection complete. ${scriptCount} script(s) re-executed.`);
};
