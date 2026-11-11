# St. Joseph Fish Brokerage — Company Website

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, with content in **Supabase** and hosting on **Vercel**.
Ported from the PHP site (`sjfbi-js`) — front pages only. The shop, cart, checkout, accounts, rider and admin
sections were intentionally left out.

| Page | Route | Content source |
|---|---|---|
| Home | `/` | static + latest 3 blogs + markets (Supabase) |
| About | `/about` | static |
| Services | `/services` (`?market=navotas` deep-links a tab) | `markets`, `market_members` |
| Sustainability | `/sustainability` | static |
| Events | `/events`, `/events/[slug]` | `events` + year photo marquee (static files) |
| Blogs | `/blogs`, `/blogs/[slug]` | `blogs` |
| Contact | `/contact` (`?tab=career` opens Careers) | form → `/api/contact` → `inquiries` table + Brevo email |
| **Admin panel** | `/admin` (login at `/admin/login`) | manages everything above |

Old PHP URLs (`/about.php`, `/event`, `/shop`, `/item/...`) redirect to the new pages (see `next.config.ts`).

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local     # then fill in the values (see step 2)
npm run dev                    # http://localhost:3000
```

The site renders even before Supabase is set up — dynamic sections just show empty states.

## 2. Set up Supabase

1. Create a project at <https://supabase.com> (region: Southeast Asia / Singapore).
2. **SQL Editor → New query** → paste `supabase/schema.sql` → **Run**.
   This creates the tables, Row Level Security policies and two storage buckets:
   - `media` (public) — event / blog / market / team photos
   - `inquiry-attachments` (private) — contact form uploads
3. Run `supabase/admin.sql` the same way (admin accounts, editable page content, write permissions).
4. Run `supabase/realtime.sql` (turns on live updates — see *Live updates* below).
5. **Project Settings → API** → copy into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` public key
   - `SUPABASE_SERVICE_ROLE_KEY` — `service_role` key (**secret** — server only, never commit it)

### Bring over your existing content (one time)

```bash
# add the MIGRATE_* values to .env.local first (old MySQL login + path to the PHP project)
npm run migrate
```

`scripts/migrate-from-mysql.mjs` copies events (with gallery), blogs, markets (+ product names) and team
members from MySQL, and uploads their images to the `media` bucket. Images are read from your local
`sjfbi-js/uploads` folder, falling back to the live site. It is safe to re-run.

> Your MySQL host must allow remote connections from your computer. If it doesn't, run the script on a machine
> that can reach the database, or export tables as CSV and import them in Supabase → Table Editor.

Then run **`supabase/seed_events_2023_2026.sql`** in the SQL Editor. It adds the 2023–2026 company events
(Kick-Off, Valentine's, Team Building, Halloween, Year-End, Anniversary) linked to the photos already in
`public/assets/images/EventsYYYY`. Events without photos are added as drafts. Existing slugs are skipped,
so run it **after** the migration.

## 3. Deploy to Vercel

1. Push this folder to a new GitHub repo (`.env.local` is git-ignored).
2. <https://vercel.com/new> → import the repo → framework is detected as **Next.js**.
3. **Environment Variables** — add these (Production + Preview):

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase (secret) |
   | `NEXT_PUBLIC_SITE_URL` | `https://fishbrokers.net` |
   | `BREVO_API_KEY` | your Brevo key |
   | `MAIL_FROM` | a sender verified in Brevo, e.g. `marketing@fishbrokers.net` |
   | `MAIL_FROM_NAME` | `St. Joseph Fish Brokerage Inc.` |
   | `ADMIN_EMAIL` | where inquiry notifications go |

   Do **not** add the `MIGRATE_*` values to Vercel.
4. **Deploy**. Then **Settings → Domains** → add `fishbrokers.net` and `www.fishbrokers.net` and update DNS at
   your domain registrar as Vercel instructs.

## 4. Admin panel

### Create the first admin (once)
1. Supabase → **Authentication → Users → Add user** → your email + a password, tick **Auto Confirm User**.
2. SQL Editor → run (with your email):
   ```sql
   insert into public.admin_users (user_id, email, full_name, role)
   select id, email, 'Site Owner', 'owner' from auth.users where email = 'you@fishbrokers.net'
   on conflict (user_id) do update set role = 'owner';
   ```
3. Go to **`/admin/login`** and sign in. Add other staff from **Admin Users**.

Supabase → **Authentication → URL Configuration**: set *Site URL* to `https://fishbrokers.net` and add
`https://fishbrokers.net/admin/auth/callback` (and `http://localhost:3000/admin/auth/callback`) to *Redirect URLs*
so "Forgot password" emails work.

### What the admin can manage

| Section | What it does |
|---|---|
| **Dashboard** | Counts, latest messages, quick links |
| **Events** | Create/edit/delete events, main photo + gallery uploads, rich-text description, draft/published, RSVP, SEO |
| **Blogs** | Posts with a rich-text editor (headings, lists, links, inline images), featured image, publish date, SEO |
| **Ports & Teams** | Services-page ports: details, highlights, products, photos, Google Map, accent color, order, team members with photos |
| **Page Content** | Every text and photo on Home, About, Services, Sustainability, Events page (incl. the yearly photo rows), Contact (incl. Careers tab), header/footer contact info, and the Privacy Policy & Terms |
| **Messages** | Contact-form inbox: status (new/read/replied/archived), attachments, reply by email, delete |
| **Subscribers** | Event-update sign-ups, remove, CSV export |
| **Admin Users** *(owner)* | Add staff with a temporary password, owner/editor roles, remove access |
| **My Account** | Change display name and password |

Roles: **owner** = everything; **editor** = everything except managing admin accounts.
Security is enforced in the database (Row Level Security), not only in the UI.

Changes appear on the public site immediately after saving. Photos are resized in the browser before upload.
In title fields, wrap words in `[square brackets]` to highlight them in orange; press Enter for a line break.
"Reset to original" on any Page Content section restores the original website text.

You can still use Supabase → Table Editor directly if you ever need to.

## Live updates, skeletons & page transitions

- **Websocket (Supabase Realtime)** — every page keeps one websocket open to Supabase.
  - Public pages refresh their data in place when events, blogs, ports, team members or page content change
    (`src/components/layout/LiveRefresh.tsx` → `/api/revalidate` clears the page cache, then the page refreshes).
  - The admin panel shows a **Live** pill, pops a toast + bell count when a new contact message or subscriber
    arrives, and refreshes lists/dashboard automatically (it never refreshes while you're editing a form).
  - Requires `supabase/realtime.sql` to have been run once. Hook: `src/lib/realtime.ts`.
- **Skeletons** — every public and admin route has a `loading.tsx` that shows a shimmering placeholder instantly
  (`src/components/ui/Skeleton.tsx`, `src/components/admin/Skeletons.tsx`).
- **Progress bar** — an orange bar at the top starts the moment a link is clicked
  (`src/components/layout/NavigationProgress.tsx`).

`npm run dev` compiles each page the first time you open it, so the first click can take a few seconds.
The deployed site (`npm run build && npm start`, or Vercel) is pre-built and prefetches links, so it's much faster.

## Project structure

```
src/app/(site)/     public pages (share the header/footer layout)
src/app/admin/      admin panel: (auth) login pages, (panel) protected screens
src/app/api/        contact form + subscribe endpoints
src/components/     public sections, layout, and components/admin (forms, uploader, editor)
src/lib/            Supabase clients, queries, content schema + defaults, admin server actions
src/middleware.ts   protects /admin and refreshes the login session
supabase/           schema.sql, admin.sql, realtime.sql, seed_events_2023_2026.sql
scripts/            migrate-from-mysql.mjs
public/assets/      images (optimised) and the hero video (H.264, 20 MB)
```

## Notes

- Fonts (Lexend, Playfair Display) are self-hosted via `@fontsource`, so there is no runtime call to Google Fonts.
- The Privacy Policy and Terms text are copied unchanged from the old site and still mention online orders and
  payments — have them updated now that the site no longer sells online.
- Google Tag Manager (`GTM-T2JQR66S`) is kept in `src/app/layout.tsx`.
