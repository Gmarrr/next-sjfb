// ════════════════════════════════════════════════════════════════════════════
// Editable page content.
// Each section = one row in the Supabase `site_content` table (key → JSON).
// `defaults` hold the original website text, so the site looks right before anything is edited,
// and any field left empty in the admin falls back to its default.
//
// Text conventions for title fields (shown as help text in the admin):
//   [word]   → highlighted in the orange gradient
//   new line → line break
// ════════════════════════════════════════════════════════════════════════════
import { DEFAULT_PRIVACY_HTML, DEFAULT_TERMS_HTML } from './legal-defaults';
import { YEAR_GALLERY, YEAR_ORDER } from './gallery-defaults';

export type FieldType = 'text' | 'textarea' | 'title' | 'richtext' | 'image' | 'images' | 'video' | 'strings' | 'list' | 'url';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  /** For type 'list': the fields of each item */
  fields?: Field[];
  /** Storage folder for uploads */
  folder?: string;
}

export interface SectionGroup { title: string; fields: Field[] }
export interface SectionDef { key: SectionKey; title: string; description: string; path: string; groups: SectionGroup[] }

const TITLE_HELP = 'Wrap words in [square brackets] to highlight them. Press Enter for a line break.';

// ── Defaults (the original website copy) ─────────────────────────────────────
export const DEFAULTS = {
  site: {
    logo: '/assets/icons/square-logo.png',
    headerCta: 'Get in Touch',
    tagline: 'Isda sa Hapag ng Bawat Isa.',
    address: 'Bulungan Ave. corner HACCP St., NFPC NBBS, Navotas, Philippines',
    phone: '(+63) 946-497-3689',
    email: 'stjosephbrokerage23@gmail.com',
    marketingEmail: 'marketing@fishbrokers.net',
    hrEmail: 'hrd@fishbrokers.net',
    hours: 'Open Mon – Sat · 8:00 AM – 6:00 PM',
    facebookUrl: 'https://www.facebook.com/stjosephbroker',
    tiktokUrl: 'https://www.tiktok.com/@stjosephfishbroke',
    footerNote: 'Made with care in Navotas City, Philippines',
  },

  home: {
    heroChip: 'Navotas Fish Port — Live Operations',
    heroEyebrow: 'Established 1979 — Philippines',
    heroTitle: 'Isda sa\nHapag ng\nBawat isa.',
    heroText: 'St. Joseph Fish Brokerage Inc. connects verified Filipino fishermen to institutional markets nationwide — with transparency, integrity, and nearly five decades of trust.',
    heroPoster: '/assets/images/contents/hero_banner1.jpg',
    heroVideo: '/assets/videos/Company-Branding.mp4',
    stats: [
      { value: '47+', label: 'Years in Operation', sub: 'Since 1979' },
      { value: '1000+', label: 'Verified Fishermen', sub: 'Direct network' },
      { value: '4', label: 'Port Locations', sub: 'Luzon & Mindanao' },
      { value: '100K+++', label: 'Kilos Daily', sub: 'Fresh, not frozen' },
    ],
    exploreEyebrow: 'Since 1979 · St. Joseph Fish Brokerage Inc.',
    exploreTitle: 'The Largest Fish Brokerage\nNetwork in the [Philippines]',
    exploreText: 'Connecting Filipino fishermen with buyers, wholesalers, restaurants, and retailers — delivering fresh seafood with full traceability, fair pricing, and nationwide reach.',
    explorePills: [
      { value: '1000+', label: 'Verified Suppliers' },
      { value: 'PH', label: 'Nationwide Coverage' },
      { value: 'Daily', label: 'Fresh Catch Sourced' },
    ],
    explorePhotos: [1, 2, 3, 4, 5, 6].map((n) => `/assets/images/contents/home_${n}.jpg`),
    overviewBadge: 'Company Overview',
    overviewTitle: 'More Than a Fish Broker —\n[A Partner in Philippine Seafood]',
    overviewText: '<p>With over <strong>47 years</strong> of operations spanning <strong>Navotas</strong>, <strong>Malabon</strong>, <strong>Lucena</strong>, <strong>Davao</strong>, and growing, we serve as the critical link between hardworking Filipino fishermen and the buyers who depend on fresh, traceable seafood every day.</p>',
    portsBadge: 'Port Operations',
    portsTitle: 'Ports. [One National Network.]',
    blogsBadge: 'Latest Insights',
    blogsTitle: 'Blogs / News & Updates',
    ctaBadge: 'Partner With Us',
    ctaTitle: 'Ready to Work With the\n[Philippines’ Largest Fish Broker?]',
    ctaImage: '/assets/images/contents/hero_banner2.jpg',
  },

  about: {
    heroBadge: 'Established 1979 · Philippines',
    heroTitle: 'The [Story] Behind the\nPhilippines’ Most Trusted\nFish Broker',
    heroText: 'St. Joseph Fish Brokerage, Inc. (SJFB) has been connecting Filipino fishermen with buyers, traders, and markets for over four decades — built on integrity, hard work, and a deep love for the Philippine seafood industry.',
    heroPills: ['40+ Years Experience', 'Navotas · Malabon · Lucena · Davao', '26 Stalls', 'Fresh produced Seafood'],
    collagePhotos: [2, 4, 1, 5, 3].map((n) => `/assets/images/contents/about_${n}.jpg`),
    storyBadge: 'Our Story',
    storyYear: '1979',
    storyTitle: 'A Legacy Built on [Hard Work]',
    storyText: '<p><strong>St. Joseph Fish Brokerage, Inc. (SJFB)</strong> is a trusted fish brokerage and seafood trading company in the Philippines, with over four decades of industry experience. Operating in major fish ports such as Navotas Fish Port Complex, Malabon Bayan Market, Lucena Fish Port Complex, and Davao Fish Port Complex, SJFB provides reliable <a href="/services">fish brokerage services</a> to traders, suppliers, and buyers nationwide.</p><p>Founded as a family-owned business and officially established in 1979, SJFB continues to grow through integrity, strong partnerships, and a deep commitment to the Philippine seafood industry.</p>',
    todayText: '40+ years later — still hand-picking every batch ourselves.',
    storyPhoto: '/assets/images/contents/about_6.jpg',
    mosaicBadge: 'Behind the Scenes',
    mosaicTitle: 'A Look Inside [SJFB]',
    mosaicPhotos: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => `/assets/images/contents/about_${n}.jpg`),
    coreBadge: 'What We Stand For',
    coreTitle: 'Our [Core Values]',
    coreSubtitle: 'The principles that guide every decision we make.',
    coreValues: [
      { key: 'I AM', value: 'Integrity', desc: 'Doing the right thing at all times, even when no one is watching. We uphold honesty and strong moral principles in every action we take, ensuring that our word is our bond in the global marketplace.' },
      { key: 'I MAKE IT HAPPEN', value: 'Commitment', desc: 'We take ownership and responsibility to deliver results. Our dedication drives us to turn promises into reality, overcoming challenges with determination and perseverance.' },
      { key: 'BIG LOVE', value: 'Passion', desc: 'We pour our hearts into everything we do. This passion fuels our creativity, energy, and dedication to serving our customers and community with genuine care and enthusiasm.' },
      { key: 'THE POWER OF ONE', value: 'Teamwork', desc: 'Every individual contributes to our collective success. We believe that one person can make a difference, and together, we can achieve extraordinary things through collaboration and teamwork.' },
      { key: 'I LIVE MY MARK', value: 'Excellence', desc: 'We strive to leave a positive legacy in everything we do. Our actions today create lasting impact for tomorrow, inspiring others through our example of excellence and integrity.' },
      { key: 'I CAN', value: 'Trust', desc: 'We embrace a can-do attitude that turns challenges into opportunities. With confidence and capability, we believe in our ability to grow, adapt, and succeed in any situation.' },
    ],
  },

  services: {
    heroEyebrow: 'Our Footprint',
    heroTitle: 'Servicing Markets\nAcross the Philippines',
    heroText: 'From the massive Navotas Fish Port in Metro Manila to the deep-sea tuna docks of Davao Toril, St. Joseph Fish Brokerage Inc. is where Filipino seafood moves — reliably, fairly, and freshly.',
    heroPills: [
      { icon: '🗺️', label: '4 Major Ports' },
      { icon: '🏪', label: '26 Market Stalls' },
      { icon: '🤝', label: '1000+ Fishing Partners' },
    ],
    whyEyebrow: 'Why Partner With Us',
    whyTitle: 'What Sets Us Apart',
    why: [
      { icon: '⚖️', title: 'Fair Pricing Always', desc: 'We do not manipulate market prices. Fishermen and buyers both receive transparent, competitive rates on every transaction.' },
      { icon: '🕐', title: '24-Hour Port Operations', desc: 'Our Navotas and Malabon teams operate before dawn to receive fresh landings — so your stock arrives at peak freshness.' },
      { icon: '📋', title: 'Full Documentation', desc: 'Every lot comes with complete paperwork: origin, weight, price, and transport chain — traceable end to end.' },
      { icon: '🇵🇭', title: 'Nationwide Reach', desc: 'From Metro Manila to Mindanao, our network ensures consistent supply across the Philippine seafood ecosystem.' },
      { icon: '🤝', title: 'Long-Term Relationships', desc: 'Many of our partners have been with us for over a decade. Trust is the foundation of everything.' },
      { icon: '📈', title: 'Volume Flexibility', desc: "Whether you're ordering 20 kg or 2 tons, we accommodate all order sizes with equal care." },
    ],
    ctaTitle: 'Ready to source fresh Philippine seafood?',
    ctaText: "Contact our team at any of our markets or send us a message — we'll connect you with the right catch.",
    ctaButton: 'Get in Touch',
  },

  sustainability: {
    heroEyebrow: 'Our Commitment',
    heroTitle: 'Sustaining the Sea,\n[Sustaining Lives]',
    heroText: "At St. Joseph Fish Brokerage Inc., sustainability isn't a policy — it's how we've always done business.",
    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=85',
    introEyebrow: 'Who We Are',
    introTitle: 'More Than a Fish Broker — A Partner in the Philippine Seafood Ecosystem',
    introText: '<p>With operations spanning <strong>Navotas</strong>, <strong>Malabon</strong>, <strong>Lucena</strong>, <strong>Davao</strong>, and growing, we serve as the critical link between hardworking Filipino fishermen and the buyers who depend on fresh, traceable seafood.</p>',
    pillarsEyebrow: 'Our Framework',
    pillarsTitle: 'Four Pillars of Sustainable Practice',
    pillarsText: 'Each pillar represents a core area where we measure, improve, and remain accountable.',
    pillars: [
      { title: 'Responsible Brokerage', desc: 'Ethical trading, regulatory compliance, and full traceability from catch to buyer.' },
      { title: 'People & Culture', desc: 'Fair wages, safe conditions, inclusive culture, and continuous employee growth.' },
      { title: 'Community & Livelihoods', desc: 'Direct support for fishing families, local suppliers, and coastal communities.' },
      { title: 'Environmental Stewardship', desc: 'Mindful operations, waste reduction, and support for marine conservation efforts.' },
    ],
    p1Title: 'Responsible Fish Brokerage',
    p1Text: 'As a licensed fish broker, we ensure every transaction is fair, transparent, and legally compliant. Our reputation across three decades is built on integrity.',
    p1Image: '/assets/images/contents/home_4.jpg',
    p1Items: [
      { title: 'Fair-price guarantee', desc: 'fishermen receive market-competitive rates with no hidden deductions' },
      { title: 'Full regulatory compliance', desc: 'licensed under BFAR, FDA-registered, HACCP compliant' },
      { title: 'Supply chain transparency', desc: 'traceable documentation from catch origin to end buyer' },
      { title: 'Anti-illegal fishing stance', desc: 'we verify all suppliers and refuse products from illegal sources' },
    ],
    p2Title: 'People & Culture',
    p2Text: 'Our people are the backbone of St. Joseph. Every team member is treated with dignity, compensated fairly, and given the tools to grow.',
    p2Image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    p2Items: [
      { title: 'Happy / Great Place to Work', desc: 'PPE provided to all port-side staff; regular safety audits at all locations.' },
      { title: 'Competitive Renumeration', desc: 'Salaries regional minimum wage; 13th month, SSS, PhilHealth, Pag-IBIG covered.' },
      { title: 'Career and Personal Development', desc: 'In-house training, fisheries knowledge programs, and internal promotion pathways.' },
      { title: 'Inclusive Culture', desc: 'Equal opportunity employer — we value diversity in gender, background, and experience.' },
    ],
    p3Title: 'Community & Livelihoods',
    p3Text: "Fishing communities around Navotas, Malabon, Lucena and Davao aren't just our supply chain — they are our neighbors and partners.",
    p3Image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    p3Items: [
      { title: 'Priority local sourcing', desc: '95%+ of supply comes from registered small-scale and artisanal fishermen' },
      { title: 'Advance payment program', desc: 'helps fishermen cover fuel and equipment costs before catch' },
      { title: 'Community scholarships', desc: 'supporting education for children of long-term supplier families' },
      { title: 'Market access programs', desc: "connecting small suppliers to institutional buyers they couldn't reach alone" },
    ],
    p4Title: 'Environmental Stewardship',
    p4Text: "The ocean is not a resource to exploit — it's a living system that sustains millions of Filipinos.",
    p4Image: 'https://www.undp.org/sites/g/files/zskgke326/files/2024-11/ecothailand.jpg',
    p4Items: [
      { title: 'Closed Season Compliance', desc: 'We halt trading of regulated species during mandated closed seasons.' },
      { title: 'Zero-Waste Drive', desc: 'Fish scraps and unsold portions redirect to fishmeal processors — nothing wasted.' },
      { title: 'Biodiversity Awareness', desc: 'Staff trained to refuse endangered or undersize catches per BFAR guidelines.' },
      { title: 'Cold Chain Partnership', desc: 'Optimized ice and refrigeration logistics reduce spoilage and energy use.' },
    ],
    ctaEyebrow: 'Work With Us',
    ctaTitle: 'Building a Sustainable Future — Together',
    ctaText: "Whether you're a buyer, a cooperative, or a business partner — St. Joseph is ready.",
    ctaImage: '/assets/images/contents/hero_banner2.jpg',
  },

  events_page: {
    heroBadge: 'Life at St. Joseph',
    heroTitle: 'Events & Activities',
    heroText: 'Upcoming gatherings, past celebrations, and the moments that bring our St. Joseph family — and our industry community — together.',
    eventsEyebrow: 'Mark Your Calendar',
    eventsTitle: 'Events',
    eventsText: 'Join us at our next gatherings — open to employees, partners, and the public depending on the event.',
    activitiesTitle: 'Company Activities',
    activitiesText: 'We invest in our people through regular team building, training, wellness programs, and community-driven CSR initiatives that reflect our values as a company.',
    activities: [
      { title: 'Team Building Events', desc: 'Cross-department activities that build collaboration and trust.' },
      { title: 'Training & Workshops', desc: 'Skills development for handling, quality control, and customer service.' },
      { title: 'Wellness Programs', desc: 'Sports fests and mental health days for a balanced work life.' },
    ],
    externalTitle: 'External Participation',
    externalText: "We actively engage with the broader seafood industry through conferences, expos, and speaking engagements — strengthening our network and sharing what we've learned.",
    galleryTitle: 'Photo Gallery',
    galleryText: 'Hover over a row to pause and explore — click any photo for a closer look.',
    gallery: YEAR_ORDER.map((year) => ({ year, images: YEAR_GALLERY[year] })),
    subscribeTitle: 'Never Miss an Event',
    subscribeText: 'Subscribe to get notified about events, CSR activities, and industry engagements from St. Joseph Fish Brokerage Inc.',
  },

  contact: {
    heroEyebrow: 'Reach Out',
    heroTitle: "Let's Talk Fish",
    heroText: "Whether you're a buyer looking for fresh supply, a fisherman wanting a trusted broker, or someone ready to build a career with us — we're here and ready.",
    formTitle: 'Send Us a Message',
    formText: 'For orders, partnership inquiries, supplier registration, or general questions.',
    locations: [
      { name: 'Navotas Fish Port Complex', address: 'North Bay Blvd South, Navotas City', hours: 'Open Daily, Back Office (8:30 AM - 6:00 PM) till Friday | Markets (6:00 PM - 2:30 AM) till Sunday' },
      { name: 'Malabon Consignacion', address: 'Malabon City, Metro Manila', hours: 'Open daily, 6:00 PM - 2:30 PM' },
      { name: 'Davao Toril Fish Port', address: 'Toril District, Davao City', hours: 'Open daily, 8:30 AM - 6:00 PM' },
    ],
    phone: '(02) 8397-4929',
    facebookUrl: 'https://facebook.com/stjosephfishbrokerage',
    responseTimes: [
      { label: 'General Inquiries', time: '1–2 days' },
      { label: 'Bulk/Partnership Orders', time: 'Same day' },
      { label: 'Career Applications', time: '5–7 days' },
    ],
    careerTagline: 'Built on Trust. | Strengthened by People. | Defined by Legacy.',
    whoWeAre: [
      'A [stable] and [resilient] organization',
      'Employees who are [pioneers] — many have stayed with us for [over 30 years]',
      '[No layoffs] even during the pandemic, because we value people beyond circumstances',
      'A workplace where careers last, with many employees proudly retiring at ages [60–65]',
      'A company that believes in recognizing potential and [promoting from within]',
    ],
    wantToBe: [
      'A [fun] and [engaging] place to work',
      'A workplace that feels like a [second home] — supportive, warm, and welcoming',
      'A culture where people [grow, belong], and [thrive] together',
    ],
    promiseTitle: 'Where [Careers] Last. Where [People Belong].',
    promiseText: 'Stability is not just our message — it is our track record.',
    hiringTitle: "We're always looking for people who stay.",
    hiringText: "We don't have a long list of open roles posted here — that's on purpose. We hire in small numbers, when we know a role is a real, lasting fit, not just a seat to fill.",
    hiringStats: [
      { value: '30+', label: 'years, our longest-tenured teammates' },
      { value: '0', label: 'layoffs, even through the pandemic' },
      { value: '60–65', label: 'the age many of our team retire at, with us' },
    ],
    hiringCta: "If that sounds like the kind of place you want to build a career, not just take a job, send us your resume and a short note about what you're looking for. Our HR team reads every message personally.",
    perks: ['Good minimum compensation + benefits', 'SSS, PhilHealth, Pag-IBIG covered', '13th month pay + performance bonuses', 'Career growth within our growing network', 'Stable, family-oriented workplace culture', 'Meals / allowances for port-side roles'],
  },

  legal: {
    effectiveDate: 'June 24, 2026',
    privacyHtml: DEFAULT_PRIVACY_HTML,
    termsHtml: DEFAULT_TERMS_HTML,
  },
};

export type SectionKey = keyof typeof DEFAULTS;
export type Content<K extends SectionKey> = (typeof DEFAULTS)[K];

// ── Admin form layout for each section ───────────────────────────────────────
const t = (name: string, label: string, help?: string): Field => ({ name, label, type: 'text', help });
const ta = (name: string, label: string, help?: string): Field => ({ name, label, type: 'textarea', help });
const title = (name: string, label: string): Field => ({ name, label, type: 'title', help: TITLE_HELP });
const rich = (name: string, label: string): Field => ({ name, label, type: 'richtext' });
const img = (name: string, label: string, folder = 'pages'): Field => ({ name, label, type: 'image', folder });
const imgs = (name: string, label: string, help?: string, folder = 'pages'): Field => ({ name, label, type: 'images', folder, help });
const strs = (name: string, label: string, help?: string): Field => ({ name, label, type: 'strings', help });
const list = (name: string, label: string, fields: Field[], help?: string): Field => ({ name, label, type: 'list', fields, help });

export const SECTIONS: SectionDef[] = [
  {
    key: 'site', title: 'Header, Footer & Contact Info', path: '/', description: 'Logo, contact details and social links used across every page.',
    groups: [
      { title: 'Header', fields: [img('logo', 'Logo', 'branding'), t('headerCta', 'Header button text')] },
      { title: 'Contact details', fields: [t('address', 'Address'), t('phone', 'Phone'), t('email', 'Footer email'), t('marketingEmail', 'Marketing email', 'Used for the email icon, privacy contact and form fallback.'), t('hrEmail', 'HR email (job applications)'), t('hours', 'Office hours')] },
      { title: 'Footer & social', fields: [t('tagline', 'Footer tagline'), { name: 'facebookUrl', label: 'Facebook URL', type: 'url' }, { name: 'tiktokUrl', label: 'TikTok URL', type: 'url' }, t('footerNote', 'Bottom-right note')] },
    ],
  },
  {
    key: 'home', title: 'Home Page', path: '/', description: 'Hero video, stats, photo collage, overview and call-to-action.',
    groups: [
      { title: 'Hero', fields: [t('heroChip', 'Top-right chip'), t('heroEyebrow', 'Small text above title'), title('heroTitle', 'Title'), ta('heroText', 'Intro text'), { name: 'heroVideo', label: 'Background video (MP4)', type: 'video', folder: 'videos', help: 'Keep it under ~20 MB, H.264 MP4.' }, img('heroPoster', 'Poster image (shown while the video loads)')] },
      { title: 'Stats strip', fields: [list('stats', 'Stats', [t('value', 'Number'), t('label', 'Label'), t('sub', 'Small text')])] },
      { title: 'Photo collage', fields: [t('exploreEyebrow', 'Eyebrow'), title('exploreTitle', 'Title'), ta('exploreText', 'Text (mobile view)'), list('explorePills', 'Pills', [t('value', 'Value'), t('label', 'Label')]), imgs('explorePhotos', 'Photos', 'Exactly 6 photos look best.')] },
      { title: 'Company overview', fields: [t('overviewBadge', 'Badge'), title('overviewTitle', 'Title'), rich('overviewText', 'Text')] },
      { title: 'Ports & blogs', fields: [t('portsBadge', 'Ports badge'), title('portsTitle', 'Ports title', ), t('blogsBadge', 'Blogs badge'), t('blogsTitle', 'Blogs title')] },
      { title: 'Call to action', fields: [t('ctaBadge', 'Badge'), title('ctaTitle', 'Title'), img('ctaImage', 'Background image')] },
    ],
  },
  {
    key: 'about', title: 'About Page', path: '/about', description: 'Company story, photo collage, behind-the-scenes mosaic and core values.',
    groups: [
      { title: 'Hero', fields: [t('heroBadge', 'Badge'), title('heroTitle', 'Title'), ta('heroText', 'Intro text'), strs('heroPills', 'Quick-fact pills'), imgs('collagePhotos', 'Collage photos', '5 photos: large, portrait, small, small, round.')] },
      { title: 'Our story', fields: [t('storyBadge', 'Badge'), t('storyYear', 'Year'), title('storyTitle', 'Title'), rich('storyText', 'Story'), t('todayText', '“Today” line'), img('storyPhoto', 'Photo')] },
      { title: 'Behind the scenes', fields: [t('mosaicBadge', 'Badge'), title('mosaicTitle', 'Title'), imgs('mosaicPhotos', 'Mosaic photos', 'Shown in rows of 3, 2, 3, 2… (10 photos look best).')] },
      { title: 'Core values', fields: [t('coreBadge', 'Badge'), title('coreTitle', 'Title'), t('coreSubtitle', 'Subtitle'), list('coreValues', 'Values', [t('key', 'Name (e.g. I AM)'), t('value', 'Value (e.g. Integrity)'), ta('desc', 'Description')])] },
    ],
  },
  {
    key: 'services', title: 'Services Page', path: '/services', description: 'Hero, “What Sets Us Apart” and call-to-action. Ports are managed under Ports & Teams.',
    groups: [
      { title: 'Hero', fields: [t('heroEyebrow', 'Eyebrow'), title('heroTitle', 'Title'), ta('heroText', 'Text'), list('heroPills', 'Pills', [t('icon', 'Emoji'), t('label', 'Label')])] },
      { title: 'What sets us apart', fields: [t('whyEyebrow', 'Eyebrow'), t('whyTitle', 'Title'), list('why', 'Cards', [t('icon', 'Emoji'), t('title', 'Title'), ta('desc', 'Description')])] },
      { title: 'Call to action', fields: [t('ctaTitle', 'Title'), ta('ctaText', 'Text'), t('ctaButton', 'Button text')] },
    ],
  },
  {
    key: 'sustainability', title: 'Sustainability Page', path: '/sustainability', description: 'Hero, the four pillars and their detail sections.',
    groups: [
      { title: 'Hero', fields: [t('heroEyebrow', 'Eyebrow'), title('heroTitle', 'Title'), ta('heroText', 'Text'), img('heroImage', 'Background image')] },
      { title: 'Intro', fields: [t('introEyebrow', 'Eyebrow'), t('introTitle', 'Title'), rich('introText', 'Text')] },
      { title: 'Pillar cards', fields: [t('pillarsEyebrow', 'Eyebrow'), t('pillarsTitle', 'Title'), ta('pillarsText', 'Text'), list('pillars', 'Cards (4)', [t('title', 'Title'), ta('desc', 'Description')])] },
      ...[1, 2, 3, 4].map((n) => ({
        title: `Pillar ${n} section`,
        fields: [t(`p${n}Title`, 'Title'), ta(`p${n}Text`, 'Text'), img(`p${n}Image`, 'Photo'), list(`p${n}Items`, 'Points', [t('title', 'Title'), ta('desc', 'Description')])],
      })),
      { title: 'Call to action', fields: [t('ctaEyebrow', 'Eyebrow'), t('ctaTitle', 'Title'), ta('ctaText', 'Text'), img('ctaImage', 'Background image')] },
    ],
  },
  {
    key: 'events_page', title: 'Events Page', path: '/events', description: 'Page text and the year-by-year photo gallery. Individual events are managed under Events.',
    groups: [
      { title: 'Hero', fields: [t('heroBadge', 'Badge'), t('heroTitle', 'Title'), ta('heroText', 'Text')] },
      { title: 'Events list', fields: [t('eventsEyebrow', 'Eyebrow'), t('eventsTitle', 'Title'), ta('eventsText', 'Text')] },
      { title: 'Company activities', fields: [t('activitiesTitle', 'Title'), ta('activitiesText', 'Text'), list('activities', 'Activities', [t('title', 'Title'), ta('desc', 'Description')]), t('externalTitle', 'External participation title'), ta('externalText', 'External participation text')] },
      { title: 'Photo gallery (scrolling rows)', fields: [t('galleryTitle', 'Title'), ta('galleryText', 'Text'), list('gallery', 'Years', [t('year', 'Year'), { name: 'images', label: 'Photos', type: 'images', folder: 'gallery' }], 'One scrolling row per year, in this order.')] },
      { title: 'Subscribe box', fields: [t('subscribeTitle', 'Title'), ta('subscribeText', 'Text')] },
    ],
  },
  {
    key: 'contact', title: 'Contact Page', path: '/contact', description: 'Hero, locations, contact details and the Careers tab.',
    groups: [
      { title: 'Hero & form', fields: [t('heroEyebrow', 'Eyebrow'), title('heroTitle', 'Title'), ta('heroText', 'Text'), t('formTitle', 'Form title'), ta('formText', 'Form text')] },
      { title: 'Sidebar', fields: [list('locations', 'Market locations', [t('name', 'Name'), t('address', 'Address'), ta('hours', 'Hours')]), t('phone', 'Landline'), { name: 'facebookUrl', label: 'Facebook page URL', type: 'url' }, list('responseTimes', 'Response times', [t('label', 'Type'), t('time', 'Time')])] },
      { title: 'Careers tab', fields: [t('careerTagline', 'Tagline', 'Separate the three parts with |'), strs('whoWeAre', 'Who we are', 'Wrap words in [brackets] to make them bold.'), strs('wantToBe', 'What we want to be', 'Wrap words in [brackets] to make them bold.'), title('promiseTitle', 'Brand promise title'), t('promiseText', 'Brand promise text'), t('hiringTitle', 'Hiring title'), ta('hiringText', 'Hiring text'), list('hiringStats', 'Hiring stats', [t('value', 'Number'), t('label', 'Label')]), ta('hiringCta', 'Text above the email button'), strs('perks', 'Why work with us (sidebar)')] },
    ],
  },
  {
    key: 'legal', title: 'Privacy Policy & Terms', path: '/', description: 'Shown in the footer pop-ups.',
    groups: [
      { title: 'Legal', fields: [t('effectiveDate', 'Effective date'), rich('privacyHtml', 'Privacy Policy'), rich('termsHtml', 'Terms & Conditions')] },
    ],
  },
];

export const sectionByKey = (key: string) => SECTIONS.find((s) => s.key === key);
