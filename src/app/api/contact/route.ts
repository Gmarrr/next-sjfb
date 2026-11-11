import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { inquiryEmailHtml, sendBrevoEmail } from '@/lib/email';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' };
const SENDER_TYPES = ['buyer', 'fisherman', 'processor', 'partner', 'media', 'other'];
const MARKETS = ['', 'navotas', 'malabon', 'davao'];

const str = (fd: FormData, key: string, max: number) => String(fd.get(key) ?? '').trim().slice(0, max);
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return bad('Invalid form submission.');
  }

  // Honeypot: bots fill the hidden "website" field — pretend success, store nothing.
  if (str(fd, 'website', 200)) return NextResponse.json({ ok: true });

  const data = {
    first_name: str(fd, 'firstName', 80),
    last_name: str(fd, 'lastName', 80),
    email: str(fd, 'email', 160),
    contact: str(fd, 'contact', 20),
    sender_type: str(fd, 'sender_type', 30),
    subject: str(fd, 'subject', 160),
    message: str(fd, 'message', 5000),
    market: str(fd, 'market', 30),
  };

  if (!data.first_name || !data.last_name || !data.subject || !data.message) return bad('Please fill in all required fields.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return bad('Please enter a valid email address.');
  if (!/^[0-9+()\s-]{7,20}$/.test(data.contact)) return bad('Please enter a valid contact number.');
  if (!SENDER_TYPES.includes(data.sender_type)) return bad('Please tell us who you are.');
  if (!MARKETS.includes(data.market)) return bad('Invalid market selection.');

  const files = fd.getAll('attachments').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return bad(`You can attach up to ${MAX_FILES} files.`);
  for (const f of files) {
    if (!ALLOWED_TYPES[f.type] || f.size > MAX_FILE_BYTES) return bad(`"${f.name}" must be a JPG, PNG or PDF under 2MB.`);
  }

  const sb = getSupabaseAdmin();
  if (!sb) return bad('The contact form is not configured yet. Please email marketing@fishbrokers.net.', 503);

  // Upload attachments to the private "inquiry-attachments" bucket
  const stamp = new Date().toISOString().slice(0, 10);
  const uploaded: { name: string; path: string }[] = [];
  for (const f of files) {
    const path = `${stamp}/${crypto.randomUUID()}.${ALLOWED_TYPES[f.type]}`;
    const { error } = await sb.storage.from('inquiry-attachments').upload(path, f, { contentType: f.type, upsert: false });
    if (error) {
      console.error('[contact] upload failed', error.message);
      return bad('Could not upload your attachment. Please try again or send without it.', 500);
    }
    uploaded.push({ name: f.name.slice(0, 120), path });
  }

  const { error: insertError } = await sb.from('inquiries').insert({
    form_type: 'inquiry',
    ...data,
    market: data.market || null,
    attachments: uploaded,
    user_agent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
  });
  if (insertError) {
    console.error('[contact] insert failed', insertError.message);
    return bad('Something went wrong saving your message. Please try again.', 500);
  }

  // Email notification (best effort — the inquiry is already saved)
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const links: { name: string; url: string }[] = [];
    for (const u of uploaded) {
      const { data: signed } = await sb.storage.from('inquiry-attachments').createSignedUrl(u.path, 60 * 60 * 24 * 7);
      if (signed?.signedUrl) links.push({ name: u.name, url: signed.signedUrl });
    }
    await sendBrevoEmail({
      to: adminEmail,
      subject: `[Website Inquiry] ${data.subject}`,
      replyTo: { email: data.email, name: `${data.first_name} ${data.last_name}` },
      html: inquiryEmailHtml(
        {
          Name: `${data.first_name} ${data.last_name}`,
          Email: data.email,
          Contact: data.contact,
          'I am a': data.sender_type,
          Market: data.market || 'Any / Not sure',
          Subject: data.subject,
          Message: data.message,
        },
        links,
      ),
    });
  }

  return NextResponse.json({ ok: true });
}
