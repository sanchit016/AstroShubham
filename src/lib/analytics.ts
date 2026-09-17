// Unified Analytics & Conversion Tracking Helper for GA4, Google Ads, and Meta Pixel

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    // 1. Google Analytics 4 / Google Ads (gtag)
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, params);
    }

    // 2. Meta Pixel (fbq)
    if (typeof (window as any).fbq === "function") {
      if (eventName === "begin_checkout") {
        (window as any).fbq("track", "InitiateCheckout", {
          content_name: params?.item_name,
          value: params?.value,
          currency: params?.currency,
        });
      } else if (eventName === "purchase") {
        (window as any).fbq("track", "Purchase", {
          content_name: params?.item_name,
          value: params?.value,
          currency: params?.currency,
        });
      } else if (eventName === "view_item") {
        (window as any).fbq("track", "ViewContent", {
          content_name: params?.item_name,
          value: params?.value,
          currency: params?.currency,
        });
      } else {
        (window as any).fbq("trackCustom", eventName, params);
      }
    }
  } catch (err) {
    console.warn("Analytics tracking warning:", err);
  }
}
