import 'server-only';

import { emailBaseUrl, emailBox, emailButton, emailFieldTable, emailLayout, emailNote, escHtml } from './email-layout';

type SendOpts = { to: string; subject: string; html: string; replyTo?: { email: string; name?: string } };

const fromName = () => process.env.MAIL_FROM_NAME || 'St. Joseph Fish Brokerage Inc.';

/**
 * Sends a transactional email. Uses Resend when RESEND_API_KEY is set, otherwise Brevo (BREVO_API_KEY).
 * Returns false (never throws) if nothing is configured or sending fails — callers treat email as best effort.
 */
export async function sendEmail(opts: SendOpts): Promise<boolean> {
  const fromEmail = process.env.MAIL_FROM;
  if (!fromEmail) return false;
  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: `${fromName()} <${fromEmail}>`,
          to: [opts.to],
          subject: opts.subject,
          html: opts.html,
          ...(opts.replyTo ? { reply_to: opts.replyTo.email } : {}),
        }),
      });
      if (!res.ok) console.error('[resend]', res.status, await res.text());
      return res.ok;
    }
    if (process.env.BREVO_API_KEY) {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName() },
          to: [{ email: opts.to }],
          replyTo: opts.replyTo,
          subject: opts.subject,
          htmlContent: opts.html,
        }),
      });
      if (!res.ok) console.error('[brevo]', res.status, await res.text());
      return res.ok;
    }
    return false;
  } catch (err) {
    console.error('[email]', err);
    return false;
  }
}

/** @deprecated kept so older imports keep working — use sendEmail. */
export const sendBrevoEmail = sendEmail;

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
