// PayPal Orders API v2 client wrapper (lightweight REST implementation, mirrors googleCalendar.ts).
// Handles USD/CAD checkout since Razorpay only settles INR for this account.

const PAYPAL_MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
const API_BASE =
  PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

function getCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal environment variables are not configured in your .env file.");
  }
  return { clientId, clientSecret };
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret } = getCredentials();

  const response = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch PayPal access token: ${data.error_description || JSON.stringify(data)}`);
  }
  return data.access_token;
}

export const paypal = {
  mode: PAYPAL_MODE,
  clientId: process.env.PAYPAL_CLIENT_ID || "",

  isConfigured: () => {
    return !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
  },

  // Creates a PayPal order for the given amount (major units, e.g. dollars) and currency.
  createOrder: async (amount: number, currency: string, referenceId: string): Promise<{ id: string }> => {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: referenceId,
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
      }),
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to create PayPal order: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  },

  // Captures a previously created & buyer-approved PayPal order. Returns the capture id on success.
  captureOrder: async (orderId: string): Promise<{ status: string; captureId: string | null }> => {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to capture PayPal order: ${data.message || JSON.stringify(data)}`);
    }

    const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;
    return { status: data.status, captureId };
  },
};
