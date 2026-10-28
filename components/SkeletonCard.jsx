"use client";

export function SkeletonCard() {
  return (
    <div className="storefront-panel-soft overflow-hidden rounded-[1.75rem] p-3">
      <div className="skeleton-shimmer aspect-[4/4.4] rounded-[1.25rem]" />
      <div className="space-y-3 p-2 pt-4">
        <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
        <div className="skeleton-shimmer h-4 w-4/5 rounded-full" />
        <div className="skeleton-shimmer h-4 w-1/2 rounded-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton-shimmer h-6 w-1/3 rounded-full" />
          <div className="skeleton-shimmer h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
