export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="h-8 skeleton rounded-xl w-48 mb-4" />
      <div className="h-4 skeleton rounded w-64 mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-base">
            <div className="h-44 skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
              <div className="h-3 skeleton rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
