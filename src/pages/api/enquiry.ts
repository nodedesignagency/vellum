// Receives the contact form and emails it to the studio through Resend (resend.com).
// Runs as a Vercel function. Until RESEND_API_KEY, ENQUIRY_TO and ENQUIRY_FROM are set in Vercel,
// it answers 503 and the form tells the visitor it is not connected yet.
import type { APIRoute } from 'astro';
import { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } from 'astro:env/server';

export const prerender = false;

const clean = (v: FormDataEntryValue | null, max = 2000) => String(v ?? '').trim().slice(0, max);
const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, reason: 'bad-request' }, 400);
  }

  // Spam trap: people never see this field, bots fill it in. Pretend it worked.
  if (clean(data.get('website'))) return json({ ok: true }, 200);

  const email = clean(data.get('email'), 200);
  const first = clean(data.get('first'), 100);
  if (!email || !first || !/^\S+@\S+\.\S+$/.test(email)) return json({ ok: false, reason: 'invalid' }, 400);

  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) return json({ ok: false, reason: 'not-connected' }, 503);

  const last = clean(data.get('last'), 100);
  const lines = [
    `Name: ${[first, last].filter(Boolean).join(' ')}`,
    `Email: ${email}`,
    `Practice or company: ${clean(data.get('firm'), 200) || 'Not given'}`,
    `Project type: ${clean(data.get('type'), 50) || 'Not given'}`,
    `Stage: ${clean(data.get('stage'), 50) || 'Not given'}`,
    '',
    clean(data.get('message'), 5000) || 'No message.',
  ];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: ENQUIRY_FROM,
      to: ENQUIRY_TO.split(',').map((s) => s.trim()),
      reply_to: email,
      subject: `Website enquiry from ${[first, last].filter(Boolean).join(' ')}`,
      text: lines.join('\n'),
    }),
  }).catch(() => null);

  return res?.ok ? json({ ok: true }, 200) : json({ ok: false, reason: 'send-failed' }, 502);
};
