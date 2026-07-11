import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  // We log a warning but don't crash compile-time builds in CI/Vercel
  console.warn("Razorpay environment variables are missing. Payment features will fail.");
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "MOCK_KEY_ID",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "MOCK_KEY_SECRET",
});
