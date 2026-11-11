import { Sk, SkLines, SkPage } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading About…">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-5">
          <Sk className="h-8 w-56 rounded-full" />
          <Sk className="h-11 w-11/12" /><Sk className="h-11 w-3/4" /><Sk className="h-11 w-1/2" />
          <SkLines lines={3} className="max-w-lg" />
          <div className="flex flex-wrap gap-2">{['w-28', 'w-44', 'w-20', 'w-36'].map((w) => <Sk key={w} className={`h-7 ${w} rounded-full`} />)}</div>
          <div className="flex gap-3"><Sk className="h-11 w-36 rounded-xl" /><Sk className="h-11 w-32 rounded-xl" /></div>
        </div>
        <div className="relative min-h-[420px] lg:min-h-[560px]">
          <Sk className="absolute top-0 right-0 w-[80%] h-[260px] rounded-2xl" />
          <Sk className="absolute bottom-4 left-0 w-[55%] h-[230px] rounded-2xl" />
          <Sk className="absolute bottom-0 right-[2%] size-32 rounded-2xl" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-14">
        <div className="space-y-4"><Sk className="h-8 w-32 rounded-full" /><Sk className="h-9 w-3/4" /><SkLines lines={6} /></div>
        <Sk className="h-[380px] rounded-2xl" />
      </section>
    </SkPage>
  );
}
