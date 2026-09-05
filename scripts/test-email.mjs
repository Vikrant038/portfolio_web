/**
 * Test Email Dispatch Utility
 * Usage:
 *   node scripts/test-email.mjs
 * Or pass key directly:
 *   RESEND_API_KEY=re_xxxx node scripts/test-email.mjs
 *   PLUNK_API_KEY=sk_xxxx node scripts/test-email.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

// Simple .env.local loader
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx > 0) {
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const recipient = process.env.CONTACT_EMAIL || "yadavvikrant3006@gmail.com";
const resendKey = process.env.RESEND_API_KEY;
const plunkKey = process.env.PLUNK_API_KEY;

console.log("=========================================");
console.log("   Portfolio Email Dispatch Test");
console.log("=========================================");
console.log("Recipient email:", recipient);
console.log("RESEND_API_KEY :", resendKey ? `Set (${resendKey.slice(0, 7)}...)` : "Not set");
console.log("PLUNK_API_KEY  :", plunkKey ? `Set (${plunkKey.slice(0, 7)}...)` : "Not set");
console.log("-----------------------------------------");

if (!resendKey && !plunkKey) {
  console.log("\n⚠️  No API keys found in environment or .env.local!");
  console.log("To send real emails to your inbox, you need either:");
  console.log("  1. RESEND_API_KEY=re_your_api_key_here  (Recommended, get free from https://resend.com)");
  console.log("  2. PLUNK_API_KEY=sk_your_secret_key_here (Secret Key from https://useplunk.com)\n");
  console.log("Run this command once you have your key:");
  console.log("  RESEND_API_KEY=re_xxxx node scripts/test-email.mjs\n");
  process.exit(1);
}

if (resendKey) {
  console.log("\n[1] Testing Resend API (https://api.resend.com/emails)...");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Test <onboarding@resend.dev>",
        to: [recipient],
        subject: "✦ Test Portfolio Message (Resend Verification)",
        html: `<div style="font-family:sans-serif;padding:20px;background:#0b0b12;color:#f2f2f5;border-radius:12px">
          <h2 style="color:#2dd4cd">Email Integration Verified!</h2>
          <p>Your portfolio contact form email delivery is working correctly via Resend.</p>
          <p style="color:#9b9ba8;font-size:12px">Recipient: ${recipient}</p>
        </div>`,
        text: `Test email verified! Your portfolio contact form is working correctly.\nRecipient: ${recipient}`,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log("✅ SUCCESS! Resend accepted the email. Status:", res.status);
      console.log("   Email ID:", data.id);
      console.log("   Check your inbox at:", recipient);
    } else {
      console.error("❌ Resend error! Status:", res.status);
      console.error("   Message:", data.message || JSON.stringify(data));
    }
  } catch (err) {
    console.error("❌ Resend network error:", err.message);
  }
}

if (plunkKey) {
  console.log("\n[2] Testing Plunk API (https://api.useplunk.com/v1/send)...");
  try {
    const res = await fetch("https://api.useplunk.com/v1/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${plunkKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: recipient,
        subject: "✦ Test Portfolio Message (Plunk Verification)",
        body: "Test email verified! Your portfolio contact form is working correctly via Plunk.",
        name: "Vikrant Yadav Portfolio",
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log("✅ SUCCESS! Plunk accepted the email. Status:", res.status);
      console.log("   Check your inbox at:", recipient);
    } else {
      console.error("❌ Plunk error! Status:", res.status);
      if (res.status === 401) {
        console.error("   Reason: 401 Unauthorized. Your PLUNK_API_KEY is invalid or not a Secret Key.");
        console.error("   Tip: Plunk keys must be Secret Keys (starting with sk_...), not Public Keys.");
      } else {
        console.error("   Details:", data);
      }
    }
  } catch (err) {
    console.error("❌ Plunk network error:", err.message);
  }
}

console.log("\n=========================================\n");