import 'server-only';

import { emailBaseUrl, emailBox, emailButton, emailFieldTable, emailLayout, emailNote, escHtml } from './email-layout';

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
  const files = attachmentLinks.length
    ? emailBox('Attachments (links valid for 7 days)', attachmentLinks.map((a) => `<p style="margin:4px 0;font-size:13px;"><a href="${escHtml(a.url)}" style="color:#ea580c;">${escHtml(a.name)}</a></p>`).join(''))
    : '';
  return emailLayout({
    title: 'New website inquiry',
    sub: escHtml(fields.Subject ?? ''),
    preheader: `${fields.Name ?? ''}: ${fields.Subject ?? ''}`,
    body:
      emailFieldTable(fields) +
      files +
      emailButton('Open in admin', `${emailBaseUrl()}/admin/inquiries`) +
      emailNote('Tip:', 'Reply to this email to answer the sender directly.'),
    footerNote: 'Sent by the contact form on your website.',
  });
}
