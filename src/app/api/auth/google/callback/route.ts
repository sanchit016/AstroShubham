import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Client ID or Secret is missing in your .env file." },
        { status: 500 }
      );
    }

    // Exchange authorization code for refresh token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("Token Exchange Error:", tokenData);
      return NextResponse.json(tokenData, { status: 500 });
    }

    const { refresh_token, access_token } = tokenData;

    if (!refresh_token) {
      return new NextResponse(
        `<html>
          <body style="font-family: sans-serif; background: #09090b; color: #fff; padding: 3rem; text-align: center;">
            <h1 style="color: #ef4444;">Warning: Refresh Token Missing</h1>
            <p style="color: #a1a1aa; max-width: 500px; margin: 1rem auto;">
              Google did not return a refresh token. This happens because your account is already logged in.
            </p>
            <p style="margin-top: 2rem;">
              <a href="/api/auth/google" style="color: #fff; background: #27272a; padding: 0.6rem 1.2rem; border-radius: 4px; text-decoration: none; font-weight: bold;">
                Try Re-Authenticating (Click Here)
              </a>
            </p>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Log the refresh token clearly in the terminal for the user/developer
    console.log("\n==================================================");
    console.log("GOOGLE_REFRESH_TOKEN OBTAINED SUCCESSFULLY!");
    console.log("==================================================");
    console.log(refresh_token);
    console.log("==================================================\n");

    // Render a gorgeous HTML page displaying the token for copy-paste
    return new NextResponse(
      `<html>
        <body style="font-family: system-ui, sans-serif; background: #09090b; color: #f4f4f5; padding: 4rem 2rem; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <div style="border: 1px solid rgba(255,255,255,0.06); background: #141416; padding: 2.5rem; border-radius: 8px;">
            <h1 style="font-size: 1.5rem; font-weight: 500; color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #10b981;">✓</span> Google Calendar Connected
            </h1>
            <p style="color: #a1a1aa; font-size: 0.95rem; margin-bottom: 1.5rem;">
              Your long-lived Google Refresh Token has been generated. Copy the token below and paste it into your <strong>.env</strong> file.
            </p>
            
            <div style="margin-bottom: 2rem;">
              <label style="font-size: 0.75rem; text-transform: uppercase; color: #71717a; display: block; margin-bottom: 0.4rem; font-weight: bold;">
                Add this line to your .env file:
              </label>
              <textarea readonly onClick="this.select()" style="width: 100%; height: 80px; background: #09090b; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 0.75rem; color: #fff; font-family: monospace; font-size: 0.85rem; resize: none; outline: none; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">GOOGLE_REFRESH_TOKEN="${refresh_token}"</textarea>
              <span style="font-size: 0.75rem; color: #71717a; margin-top: 0.2rem; display: block;">
                (Click the box to highlight and copy)
              </span>
            </div>

            <div style="font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 1.2rem; color: #a1a1aa;">
              <strong>Next Step:</strong> Save the <code>.env</code> file, restart the development server, and your site will be fully synced with Google Calendar!
            </div>
          </div>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
