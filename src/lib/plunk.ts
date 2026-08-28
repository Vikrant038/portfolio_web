/**
 * Plunk - transactional email for the contact form.
 * Sends via Plunk's REST API (https://docs.useplunk.com/introduction).
 * Needs a PLUNK_API_KEY in the environment; without it the API route logs
 * the message instead so the demo keeps working.
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

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
  from?: string;
}

export async function sendEmail(opts: SendEmailOptions) {
  const apiKey = process.env.PLUNK_API_KEY;
  if (!apiKey) {
    console.log("[plunk] PLUNK_API_KEY not set - skipping send:", opts.subject);
    return { ok: true, mock: true };
  }

  const from =
    opts.from ??
    `${SITE_CONFIG.name} Portfolio <${process.env.PLUNK_FROM ?? "no-reply@vikrantyadav.dev"}>`;

  const res = await plunkSend({
    to: opts.to,
    from,
    subject: opts.subject,
    body: opts.body,
    html: opts.html,
  });

  return { ok: true, data: res };
}

export async function sendContactEmail(payload: ContactPayload) {
  const apiKey = process.env.PLUNK_API_KEY;

  if (!apiKey) {
    console.log(
      "[contact] PLUNK_API_KEY not set - skipping send:",
      JSON.stringify(payload)
    );
    return { ok: true, mock: true };
  }

  const recipient =
    process.env.CONTACT_EMAIL ??
    process.env.PLUNK_RECIPIENT ??
    SITE_CONFIG.email;
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
      <p style="color:#9b9ba8;font-size:12px">Sent via vikrant-yadav.vercel.app</p>
    </div>`;

  await plunkSend({
    to: recipient,
    from: `Vikrant Yadav Portfolio <${process.env.PLUNK_FROM ?? "no-reply@vikrantyadav.dev"}>`,
    subject,
    body,
    html,
  });

  // auto-reply to the visitor
  try {
    await plunkSend({
      to: payload.email,
      from: `Vikrant Yadav <${process.env.PLUNK_FROM ?? "no-reply@vikrantyadav.dev"}>`,
      subject: "Thanks for reaching out ✦",
      body: `Hi ${payload.name},\n\nThanks for your message - I read everything personally and will get back to you promptly.\n\nBest,\nVikrant`,
      subscribed: false,
    });
  } catch {
    /* auto-reply failure shouldn't fail the main send */
  }

  // optional instant notification (Slack / generic webhook)
  const webhook = process.env.NOTIFY_WEBHOOK_URL;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `✉️ New portfolio message from ${payload.name} <${payload.email}>${
          payload.projectType ? ` - ${payload.projectType}` : ""
        }${payload.budget ? `, ${payload.budget}` : ""}`,
      }),
    }).catch(() => {});
  }

  return { ok: true, mock: false };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
