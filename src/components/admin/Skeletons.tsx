import { Sk, SkLines, SkPage } from '@/components/ui/Skeleton';

const Header = ({ button = true }: { button?: boolean }) => (
  <div className="flex items-end justify-between gap-3 mb-6">
    <div className="space-y-2"><Sk className="h-7 w-48" /><Sk className="h-4 w-80 max-w-[70vw]" /></div>
    {button && <Sk className="h-9 w-28 rounded-lg" />}
  </div>
);

export function DashboardSkeleton() {
  return (
    <SkPage label="Loading dashboard…">
      <Header button={false} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5"><Sk className="size-9 rounded-xl" /><Sk className="h-7 w-14" /><Sk className="h-3.5 w-24" /></div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <Sk className="h-5 w-40" />
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="flex items-center gap-3"><Sk className="size-2 rounded-full" /><div className="flex-1 space-y-1.5"><Sk className="h-3.5 w-2/3" /><Sk className="h-3 w-1/3" /></div><Sk className="h-5 w-14 rounded-full" /></div>)}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3"><Sk className="h-5 w-32" />{[0, 1, 2, 3].map((i) => <Sk key={i} className="h-14 rounded-xl" />)}</div>
      </div>
    </SkPage>
  );
}

export function ListSkeleton({ rows = 8, filters = true }: { rows?: number; filters?: boolean }) {
  return (
    <SkPage label="Loading list…">
      <Header />
      {filters && <div className="flex gap-2 mb-4"><Sk className="h-9 w-72 rounded-lg" /><Sk className="h-9 w-56 rounded-lg" /></div>}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100"><Sk className="h-3 w-40" /></div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Sk className="size-12 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2"><Sk className="h-4 w-1/2" /><Sk className="h-3 w-1/4" /></div>
              <Sk className="h-5 w-16 rounded-full hidden sm:block" /><Sk className="h-4 w-20 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </SkPage>
  );
}

export function FormSkeleton({ sidebar = true }: { sidebar?: boolean }) {
  const card = (fields: number, key: number) => (
    <div key={key} className="rounded-2xl border border-slate-200 bg-white">
      <div className="px-5 py-4 border-b border-slate-100"><Sk className="h-4 w-36" /></div>
      <div className="p-5 space-y-4">{Array.from({ length: fields }, (_, i) => <div key={i} className="space-y-1.5"><Sk className="h-3 w-24" /><Sk className="h-9" /></div>)}</div>
    </div>
  );
  return (
    <SkPage label="Loading form…">
      <Sk className="h-3 w-20 mb-3" />
      <Header button={false} />
      <div className={`grid ${sidebar ? 'lg:grid-cols-3' : ''} gap-5 items-start`}>
        <div className={`${sidebar ? 'lg:col-span-2' : ''} space-y-5`}>
          {card(4, 0)}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3"><Sk className="h-4 w-28" /><div className="grid grid-cols-4 gap-2.5">{[0, 1, 2, 3].map((i) => <Sk key={i} className="aspect-square" />)}</div><Sk className="h-24 rounded-xl" /></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3"><Sk className="h-9" /><SkLines lines={5} /></div>
        </div>
        {sidebar && <div className="space-y-5">{card(2, 1)}{card(3, 2)}</div>}
      </div>
    </SkPage>
  );
}

export function CardsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <SkPage label="Loading…">
      <Header button={false} />
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: count }, (_, i) => <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5"><Sk className="h-5 w-1/2" /><SkLines lines={2} /><Sk className="h-3 w-24 mt-2" /></div>)}
      </div>
    </SkPage>
  );
}
