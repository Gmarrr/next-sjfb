/**
 * Single source of truth for how every St. Joseph email looks.
 * Change colors, wording, address or links in EMAIL_BRAND and every email follows.
 *
 * Email clients ignore <style> sheets and modern CSS, so everything is inline styles + tables.
 */

export const EMAIL_BRAND = {
  name: 'St. Joseph Fish Brokerage Inc.',
  shortName: 'St. Joseph',
  tagline: 'Isda sa Hapag ng Bawat Isa.',
  /** Header image at the top of every email (1200×260 works best) */
  bannerPath: '/assets/icons/email-header.jpg',
  /** Main accent (buttons, highlight line, OTP border) */
  orange: '#ea580c',
  orangeLight: '#fb923c',
  /** Header / footer background */
  dark: '#0f172a',
  darkSoft: '#1e293b',
  pageBg: '#f4f4f5',
  text: '#0f172a',
  muted: '#64748b',
  address: 'Bulungan Ave. corner HACCP St., NFPC NBBS, Navotas, Philippines',
  supportEmail: 'marketing@fishbrokers.net',
  phone: '(+63) 946-497-3689',
  socials: [
    { label: 'Facebook', url: 'https://www.facebook.com/stjosephbroker' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@stjosephfishbroke' },
  ],
};

const B = EMAIL_BRAND;

export const escHtml = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Base URL used for images in emails (must be public — emails can't load localhost). */
export const emailBaseUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://next-sjfb.vercel.app').replace(/\/$/, '');

// ── Building blocks ──────────────────────────────────────────────────────────

export const emailP = (html: string) =>
  `<p style="margin:0 0 16px;font-size:14px;color:${B.text};line-height:1.7;">${html}</p>`;

export const emailButton = (label: string, url: string) =>
  `<div style="text-align:center;margin:26px 0;">` +
  `<a href="${url}" style="display:inline-block;background:${B.orange};background-image:linear-gradient(135deg,${B.orange},${B.orangeLight});color:#ffffff;font-size:15px;font-weight:800;padding:14px 38px;border-radius:999px;text-decoration:none;">${label}</a></div>`;

export const emailNote = (label: string, text: string) =>
  `<div style="background:#fff7ed;border:1px solid #fed7aa;border-left:4px solid ${B.orange};border-radius:8px;padding:12px 14px;margin:16px 0;font-size:13px;color:${B.text};line-height:1.65;"><strong>${label}</strong> ${text}</div>`;

export const emailBox = (title: string, inner: string) =>
  `<div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:16px 0;">` +
  `<p style="margin:0 0 10px;font-size:12px;font-weight:800;color:${B.orange};text-transform:uppercase;letter-spacing:.06em;">${title}</p>${inner}</div>`;

export const emailLine = (label: string, value: string) =>
  `<p style="margin:5px 0;font-size:13px;color:${B.text};line-height:1.6;"><strong>${label}:</strong> ${value}</p>`;

/** Big code box (OTP / verification code). */
export const emailCode = (code: string, expires = '15 minutes') =>
  `<div style="margin:24px 0;padding:24px;border:2px solid ${B.orange};border-radius:12px;text-align:center;background:#fff7ed;">` +
  `<p style="margin:0 0 10px;font-size:12px;font-weight:800;color:${B.orange};text-transform:uppercase;letter-spacing:.08em;">One-Time Code</p>` +
  `<div style="font-size:36px;font-weight:800;letter-spacing:12px;color:${B.text};font-family:monospace;line-height:1;">${code}</div>` +
  `<p style="margin:14px 0 0;font-size:12px;color:${B.muted};">This code expires in <strong>${expires}</strong>.</p></div>`;

/** Table of label → value rows (e.g. form submissions). Values are escaped. */
export const emailFieldTable = (fields: Record<string, string>) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;background:#f8fafc;border-radius:10px;">` +
  Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:9px 14px;color:${B.muted};font-size:13px;vertical-align:top;white-space:nowrap;border-bottom:1px solid #e2e8f0;">${escHtml(k)}</td>` +
        `<td style="padding:9px 14px;color:${B.text};font-size:14px;white-space:pre-wrap;border-bottom:1px solid #e2e8f0;">${escHtml(v || '—')}</td></tr>`,
    )
    .join('') +
  `</table>`;

// ── Full layout ──────────────────────────────────────────────────────────────

export function emailLayout(opts: { title?: string; sub?: string; preheader?: string; body: string; baseUrl?: string; footerNote?: string }): string {
  const base = opts.baseUrl ?? emailBaseUrl();
  const logo = `${base}/assets/icons/square-logo.png`;
  const banner = `${base}${B.bannerPath}`;
  const year = new Date().getFullYear();
  const pre = escHtml(opts.preheader || (opts.title ?? '').replace(/<[^>]+>/g, ''));
  const socials = B.socials
    .map((s) => `<a href="${s.url}" style="display:inline-block;margin:0 4px;padding:6px 14px;border:1px solid #fed7aa;border-radius:999px;font-size:12px;font-weight:700;color:${B.orange};text-decoration:none;">${s.label}</a>`)
    .join('');
  const line = `<div style="border-top:1px solid #cbd5e1;height:0;line-height:0;font-size:0;">&nbsp;</div>`;

  const titleRow = opts.title
    ? `<tr><td align="center" style="padding:30px 32px 8px;text-align:center;">
         <h1 style="margin:0;font-size:24px;font-weight:800;color:${B.text};line-height:1.25;">${opts.title}</h1>
         ${opts.sub ? `<p style="margin:8px 0 0;font-size:14px;color:${B.muted};line-height:1.5;">${opts.sub}</p>` : ''}
       </td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${B.name}</title></head>
<body style="margin:0;padding:0;background:${B.pageBg};font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:${B.pageBg};">${pre} &zwnj;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.pageBg};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

        <!-- Banner (public/assets/icons/email-header.jpg — replace that file to change it) -->
        <tr><td style="font-size:0;line-height:0;background:#f5f5f5;">
          <img src="${banner}" alt="${B.name}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
        </td></tr>
        <!-- Accent line -->
        <tr><td style="height:4px;line-height:4px;font-size:0;background:${B.orange};background-image:linear-gradient(90deg,${B.orange},${B.orangeLight},#fbbf24);">&nbsp;</td></tr>

        ${titleRow}

        <!-- Body -->
        <tr><td style="padding:12px 32px 28px;">${opts.body}</td></tr>

        <!-- Footer: line · logo · line -->
        <tr><td style="padding:4px 24px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="40%" valign="middle">${line}</td>
            <td width="20%" align="center" valign="middle" style="padding:0 12px;"><img src="${logo}" alt="${B.shortName}" width="40" height="40" style="display:block;margin:0 auto;width:40px;height:40px;border:0;"></td>
            <td width="40%" valign="middle">${line}</td>
          </tr>
          <tr><td colspan="3" align="center" style="padding:14px 0 4px;text-align:center;">${socials}</td></tr></table>
        </td></tr>
        <tr><td style="height:20px;line-height:20px;font-size:0;">&nbsp;</td></tr>

        <!-- Footer strip -->
        <tr><td align="center" bgcolor="${B.dark}" style="background:${B.dark};padding:16px 24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#cbd5e1;line-height:1.7;">${B.name} &middot; ${B.address}<br>Need help? <a href="mailto:${B.supportEmail}" style="color:${B.orangeLight};text-decoration:none;">${B.supportEmail}</a> &middot; ${B.phone}</p>
          <p style="margin:8px 0 0;font-size:11px;color:#64748b;line-height:1.6;">${opts.footerNote ?? 'This is an automated message &mdash; please do not reply directly.'}<br>&copy; ${year} ${B.name}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}
