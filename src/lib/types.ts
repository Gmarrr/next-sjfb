// Row types for the Supabase tables in supabase/schema.sql.
// Column names match the old MySQL tables so data migrates 1:1.

export interface EventRow {
  event_id: number;
  event_title: string;
  event_slug: string;
  event_status: 'draft' | 'published';
  event_date: string; // YYYY-MM-DD
  event_end_date: string | null;
  event_time: string | null;
  event_location: string | null;
  event_address: string | null;
  event_category: string | null;
  event_audience: string | null;
  event_excerpt: string | null;
  event_content: string | null;
  event_image: string | null;
  event_gallery: string[] | null;
  event_rsvp_url: string | null;
  event_rsvp_deadline: string | null;
  event_meta_title: string | null;
  event_meta_description: string | null;
  event_meta_keywords: string | null;
  event_created_at: string;
}

export interface BlogRow {
  blog_id: number;
  blog_title: string;
  blog_slug: string;
  blog_status: 'draft' | 'published';
  blog_author: string | null;
  blog_excerpt: string | null;
  blog_content: string | null;
  blog_featured_image: string | null;
  blog_published_date: string;
  blog_meta_title: string | null;
  blog_meta_description: string | null;
  blog_meta_keywords: string | null;
}

export interface MarketMember {
  member_id: number;
  market_id: number;
  member_name: string;
  position: string | null;
  image_url: string | null;
  display_order: number;
  is_active?: boolean;
}

export interface MarketRow {
  market_id: number;
  market_key: string;
  market_name: string;
  tag: string | null;
  location_short: string | null;
  location_full: string | null;
  description: string | null;
  highlights: string[] | null;
  stall_count: number | null;
  main_image: string | null;
  gallery_images: string[] | null;
  map_embed: string | null;
  accent_color: string | null;
  products_available: string[] | null;
  display_order: number;
  is_active: boolean;
  market_members?: MarketMember[];
}
