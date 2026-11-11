import { SkCard, SkHeading, SkPage, Sk } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading blogs…">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Sk className="h-4 w-32 mb-8" />
        <SkHeading />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">{[0, 1, 2, 3, 4, 5].map((i) => <SkCard key={i} imageClass="h-56" />)}</div>
      </section>
    </SkPage>
  );
}
