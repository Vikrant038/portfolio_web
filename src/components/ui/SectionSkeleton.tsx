/**
 * Lightweight skeleton placeholder shown while a <Suspense> boundary
 * resolves. Keeps the layout stable so fast-scrolling users don't
 * see content "pop in" and shift.
 */
export default function SectionSkeleton({ height = "400px" }: { height?: string }) {
  return (
    <div
      className="relative py-24 sm:py-32"
      aria-hidden="true"
      style={{ minHeight: height }}
    >
      <div className="section-shell animate-pulse space-y-6">
        {/* Fake heading */}
        <div className="h-4 w-24 rounded-full bg-white/[0.04]" />
        <div className="h-8 w-72 rounded-lg bg-white/[0.04]" />
        {/* Fake content blocks */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-48 rounded-2xl bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
