import { Sk, SkLines, SkPage } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading post…">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Sk className="h-4 w-64 mb-6" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 py-8">
            <Sk className="h-4 w-28" />
            <div className="rounded-[20px] bg-[#145207] p-8 sm:p-10 space-y-4 min-h-[250px]">
              <div className="flex gap-3"><Sk tone="dark" className="h-6 w-20 rounded-full" /><Sk tone="dark" className="h-4 w-32" /></div>
              <Sk tone="dark" className="h-10 w-5/6" /><Sk tone="dark" className="h-10 w-1/2" />
              <Sk tone="dark" className="h-5 w-2/3" />
            </div>
            <Sk className="h-72 rounded-xl" />
            <SkLines lines={8} />
          </div>
          <div className="py-8 space-y-6">
            <div className="flex items-center gap-3 pb-8 border-b border-gray-200"><Sk className="size-10 rounded-full" /><div className="space-y-2"><Sk className="h-3.5 w-28" /><Sk className="h-3 w-16" /></div></div>
            {[0, 1, 2].map((i) => <div key={i} className="flex gap-4"><div className="flex-1 space-y-2"><Sk className="h-4 w-full" /><Sk className="h-3 w-20" /></div><Sk className="size-20 rounded-lg" /></div>)}
          </div>
        </div>
      </div>
    </SkPage>
  );
}
