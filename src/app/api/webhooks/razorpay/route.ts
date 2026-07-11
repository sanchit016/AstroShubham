import { NextResponse } from "next/server";
import crypto from "crypto";
import { finalizeBooking } from "@/lib/bookingService";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not configured in .env. Proceeding without verification (local dev only).");
    }

    const rawBody = await req.text();

    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("Razorpay webhook signature mismatch!");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const body = JSON.parse(rawBody);
    const event = body.event;

    console.log(`Received Razorpay webhook event: ${event}`);

    // Capture payment.captured or order.paid events
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = body.payload?.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json({ error: "Invalid payload details" }, { status: 400 });
      }

      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      if (orderId && paymentId) {
        console.log(`Razorpay Webhook: Processing capture event for Order ${orderId}, Payment ${paymentId}...`);
        try {
          await finalizeBooking(orderId, paymentId);
        } catch (err: any) {
          console.error("Razorpay Webhook: Error during finalizeBooking:", err.message || err);
          return NextResponse.json({ error: "Processing failed internally" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Razorpay Webhook Error:", err);
    return NextResponse.json({ error: err.message || "Webhook error" }, { status: 500 });
  }
}
