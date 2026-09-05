/**
 * Multi-provider transactional email service (Resend, Plunk, Webhook).
 * Supports PLUNK_API_KEY, RESEND_API_KEY, and NOTIFY_WEBHOOK_URL.
 */
import { SITE_CONFIG } from "@/lib/constants";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  source?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
  from?: string;
}

async function sendViaResend(opts: { to: string; subject: string; html?: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  const from = process.env.RESEND_FROM ?? `${SITE_CONFIG.name} <onboarding@resend.dev>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html || `<p style="white-space:pre-wrap">${opts.text}</p>`,
      text: opts.text,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[resend] error", res.status, errText);
    throw new Error(`Resend responded ${res.status}`);
  }
  return res.json();
}

async function plunkSend(body: Record<string, unknown>) {
  const apiKey = process.env.PLUNK_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.useplunk.com/v1/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[plunk] error", res.status, text);
    throw new Error(`Plunk responded ${res.status}`);
  }
  return res.json();
}

export async function sendEmail(opts: SendEmailOptions) {
  // 1. Try Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      const data = await sendViaResend({
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.body,
      });
      if (data) return { ok: true, data };
    } catch (err) {
      console.error("[email] Resend failed:", err);
    }
  }

  // 2. Try Plunk if configured
  if (process.env.PLUNK_API_KEY) {
    try {
      const data = await plunkSend({
        to: opts.to,
        subject: opts.subject,
        body: opts.html || opts.body,
        name: SITE_CONFIG.name,
      });
      if (data) return { ok: true, data };
    } catch (err) {
      console.error("[email] Plunk failed:", err);
    }
  }

  // Fallback - log to console
  console.log("[email] No active email provider configured (or send failed) - logged:", opts.subject);
  return { ok: true, mock: true };
}

export async function sendContactEmail(payload: ContactPayload) {
  // Main recipient email: strictly Vikrant's main account
  const recipient =
    process.env.CONTACT_EMAIL ??
    process.env.RESEND_RECIPIENT ??
    process.env.PLUNK_RECIPIENT ??
    SITE_CONFIG.email; // yadavvikrant3006@gmail.com

  const subject = `New portfolio message from ${payload.name}`;
  const meta = [
    payload.projectType && `Project type: ${payload.projectType}`,
    payload.budget && `Budget: ${payload.budget}`,
    payload.timeline && `Timeline: ${payload.timeline}`,
    payload.source && `Source: ${payload.source}`,
  ]
    .filter(Boolean)
    .join("\n");

  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    meta,
    "",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;padding:24px;background:#0b0b12;color:#f2f2f5;border-radius:16px">
      <h2 style="margin:0 0 4px;color:#ff8f40">New message from the portfolio</h2>
      <p style="margin:0 0 16px;color:#9b9ba8">${escapeHtml(payload.email)}</p>
      ${meta ? `<p style="margin:0 0 16px;color:#2dd4cd;font-size:13px">${escapeHtml(meta)}</p>` : ""}
      <p style="line-height:1.6;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
      <hr style="border-color:rgba(255,255,255,0.1);margin:20px 0"/>
      <p style="color:#9b9ba8;font-size:12px">Sent to ${escapeHtml(recipient)} via vikrant-yadav.vercel.app</p>
    </div>`;

  let sent = false;

  // 1. Try Resend (Primary Provider -> Main account)
  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend({
        to: recipient,
        subject,
        html,
        text: body,
      });
      sent = true;
    } catch (err) {
      console.error("[contact] Resend delivery failed:", err);
    }
  }

  // 2. Try Plunk (Secondary/Fallback Provider -> Main account only)
  if (!sent && process.env.PLUNK_API_KEY) {
    try {
      await plunkSend({
        to: recipient,
        subject,
        body: html,
        name: SITE_CONFIG.name,
      });
      sent = true;
    } catch (err) {
      console.error("[contact] Plunk delivery failed:", err);
    }
  }

  // 3. Webhook notification (Slack / Discord / Zapier)
  const webhook = process.env.NOTIFY_WEBHOOK_URL;
  if (webhook) {
    try {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `✉️ New portfolio message from ${payload.name} <${payload.email}>\n${payload.projectType ? `Project: ${payload.projectType}\n` : ""}${payload.message}`,
        }),
      }).catch(() => {});
    } catch {
      /* ignore webhook errors */
    }
  }

  // 4. Auto-reply to visitor if email was sent
  if (sent) {
    try {
      if (process.env.RESEND_API_KEY) {
        await sendViaResend({
          to: payload.email,
          subject: "Thanks for reaching out ✦",
          text: `Hi ${payload.name},\n\nThanks for reaching out! I've received your message and will get back to you promptly.\n\nBest,\nVikrant`,
        });
      } else if (process.env.PLUNK_API_KEY) {
        await plunkSend({
          to: payload.email,
          subject: "Thanks for reaching out ✦",
          body: `Hi ${payload.name},\n\nThanks for reaching out! I've received your message and will get back to you promptly.\n\nBest,\nVikrant`,
          name: SITE_CONFIG.name,
        });
      }
    } catch {
      /* auto-reply failure shouldn't fail the main send */
    }
  }

  if (!sent && !process.env.RESEND_API_KEY && !process.env.PLUNK_API_KEY) {
    console.log("[contact] No email provider configured - lead captured locally:", payload);
    return { ok: true, mock: true };
  }

  return { ok: true, mock: !sent };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

