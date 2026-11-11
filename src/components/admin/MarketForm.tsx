'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveMarket, type MarketInput, type MemberInput } from '@/lib/admin/actions';
import { slugify } from '@/lib/admin/slug';
import { Card, Label, inputCls } from './ui';
import { ImageField, ImagesField } from './ImageField';
import { ObjectListField, StringListField } from './ListFields';
import SaveBar from './SaveBar';
import { useSaveForm } from './useSaveForm';

export default function MarketForm({ initial }: { initial: MarketInput }) {
  const router = useRouter();
  const isNew = !initial.market_id;
  const { data, set, setData, state, dirty, save } = useSaveForm<MarketInput>(initial);
  const [keyTouched, setKeyTouched] = useState(!isNew);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await save(saveMarket, 'Saved — the Services page is updated.');
    if (res.ok && isNew && res.id) router.replace(`/admin/markets/${res.id}?created=1`);
    else if (res.ok) router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Port details">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" required>Name</Label>
                <input id="name" required className={inputCls} value={data.market_name} onChange={(e) => { const v = e.target.value; setData((d) => ({ ...d, market_name: v, market_key: keyTouched ? d.market_key : slugify(v.split(' ')[0] ?? v) })); }} placeholder="Navotas Fish Port Complex" />
              </div>
              <div>
                <Label htmlFor="key" required help="Used in links: /services?market=key">Key</Label>
                <input id="key" required className={inputCls} value={data.market_key} onChange={(e) => { setKeyTouched(true); set('market_key', slugify(e.target.value)); }} placeholder="navotas" />
              </div>
              <div><Label htmlFor="tag" help="Small label on the home page card">Tag</Label><input id="tag" className={inputCls} value={data.tag ?? ''} onChange={(e) => set('tag', e.target.value)} placeholder="Flagship" /></div>
              <div><Label htmlFor="loc">Short location</Label><input id="loc" className={inputCls} value={data.location_short ?? ''} onChange={(e) => set('location_short', e.target.value)} placeholder="Navotas City, Metro Manila" /></div>
            </div>
            <div><Label htmlFor="locf">Full address</Label><input id="locf" className={inputCls} value={data.location_full ?? ''} onChange={(e) => set('location_full', e.target.value)} /></div>
            <div><Label htmlFor="desc">Description</Label><textarea id="desc" rows={4} className={inputCls} value={data.description ?? ''} onChange={(e) => set('description', e.target.value)} /></div>
            <div><Label>Highlights</Label><StringListField value={data.highlights} onChange={(v) => set('highlights', v)} placeholder="Highlight" /></div>
            <div><Label help="Names only (the online shop was removed).">Products always available</Label><StringListField value={data.products_available} onChange={(v) => set('products_available', v)} placeholder="Product" /></div>
          </Card>

          <Card title="Photos">
            <div><Label>Main photo</Label><ImageField folder="markets" value={data.main_image ?? ''} onChange={(v) => set('main_image', v)} /></div>
            <div><Label help="Shown as thumbnails under the main photo.">Gallery</Label><ImagesField folder="markets" value={data.gallery_images} onChange={(v) => set('gallery_images', v)} /></div>
          </Card>

          <Card title="Team members" description="Shown under “Our Team at …” on the Services page, in this order.">
            <ObjectListField<MemberInput & Record<string, unknown>>
              value={data.members as (MemberInput & Record<string, unknown>)[]}
              onChange={(v) => set('members', v)}
              blank={{ member_name: '', position: '', image_url: '', is_active: true }}
              itemTitle={(m) => m.member_name || 'New member'}
              render={(m, upd) => (
                <div className="grid sm:grid-cols-[1fr_1fr] gap-3">
                  <div><Label>Name</Label><input className={inputCls} value={m.member_name} onChange={(e) => upd({ member_name: e.target.value })} /></div>
                  <div><Label>Position</Label><input className={inputCls} value={m.position ?? ''} onChange={(e) => upd({ position: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Photo</Label><ImageField folder="members" value={m.image_url ?? ''} onChange={(v) => upd({ image_url: v })} /></div>
                  <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={m.is_active} onChange={(e) => upd({ is_active: e.target.checked })} className="accent-orange-600" /> Show on website</label>
                </div>
              )}
            />
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6">
          <Card title="Visibility">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={data.is_active} onChange={(e) => set('is_active', e.target.checked)} className="size-4 accent-orange-600" /> Show this port on the website</label>
            <div><Label htmlFor="ord" help="Lower numbers come first.">Display order</Label><input id="ord" type="number" className={inputCls} value={data.display_order} onChange={(e) => set('display_order', Number(e.target.value))} /></div>
          </Card>
          <Card title="Style & numbers">
            <div><Label htmlFor="stalls">Number of stalls</Label><input id="stalls" type="number" min={0} className={inputCls} value={data.stall_count} onChange={(e) => set('stall_count', Number(e.target.value))} /></div>
            <div>
              <Label htmlFor="accent" help="Tab and highlight color on the Services page.">Accent color</Label>
              <div className="flex items-center gap-2">
                <input id="accent" type="color" value={data.accent_color || '#ea580c'} onChange={(e) => set('accent_color', e.target.value)} className="h-9 w-12 rounded border border-slate-200 bg-white p-0.5" />
                <input className={inputCls} value={data.accent_color ?? ''} onChange={(e) => set('accent_color', e.target.value)} />
              </div>
            </div>
          </Card>
          <Card title="Google Map" description="Google Maps → Share → Embed a map → copy HTML, and paste it here.">
            <textarea rows={4} className={`${inputCls} font-mono text-xs`} value={data.map_embed ?? ''} onChange={(e) => set('map_embed', e.target.value)} placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>' />
          </Card>
        </div>
      </div>
      <SaveBar state={state} dirty={dirty} label={isNew ? 'Create port' : 'Save changes'} />
    </form>
  );
}
