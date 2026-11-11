import 'server-only';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Sends a transactional email through Brevo. Returns false (never throws) if not configured or on failure. */
export async function sendBrevoEmail(opts: { to: string; subject: string; html: string; replyTo?: { email: string; name?: string } }): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.MAIL_FROM;
  if (!apiKey || !fromEmail) return false;
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { email: fromEmail, name: process.env.MAIL_FROM_NAME || 'St. Joseph Fish Brokerage Inc.' },
        to: [{ email: opts.to }],
        replyTo: opts.replyTo,
        subject: opts.subject,
        htmlContent: opts.html,
      }),
    });
    if (!res.ok) console.error('[brevo]', res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error('[brevo]', err);
    return false;
  }
}

export function inquiryEmailHtml(fields: Record<string, string>, attachmentLinks: { name: string; url: string }[]): string {
  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 12px;color:#111827;font-size:14px;white-space:pre-wrap">${esc(v || '—')}</td></tr>`)
    .join('');
  const files = attachmentLinks.length
    ? `<p style="margin:16px 0 4px;font-weight:600">Attachments (links valid for 7 days)</p><ul>${attachmentLinks.map((a) => `<li><a href="${esc(a.url)}">${esc(a.name)}</a></li>`).join('')}</ul>`
    : '';
  return `<div style="font-family:Arial,sans-serif;max-width:640px">
    <h2 style="color:#ea580c;margin:0 0 12px">New website inquiry</h2>
    <table style="border-collapse:collapse;width:100%;background:#fafafa;border-radius:8px">${rows}</table>
    ${files}
    <p style="color:#9ca3af;font-size:12px;margin-top:20px">Saved in Supabase → table "inquiries". Reply directly to this email to answer the sender.</p>
  </div>`;
}
