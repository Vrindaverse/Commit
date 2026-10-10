'use client';

export function CardSkeleton() {
  return (
    <div className="neo-card p-5 animate-pulse">
      <div className="h-4 bg-[#F0ECE4] rounded w-3/4 mb-3" />
      <div className="h-3 bg-[#F0ECE4] rounded w-1/2 mb-2" />
      <div className="h-3 bg-[#F0ECE4] rounded w-2/3" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-[#F0ECE4] rounded-xl w-48 mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
