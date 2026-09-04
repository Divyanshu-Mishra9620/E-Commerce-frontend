"use client";

export function SkeletonCard() {
  return (
    <div className="storefront-panel-soft overflow-hidden p-4">
      <div className="animate-pulse space-y-4">
        <div className="aspect-[4/4.5] rounded-[1.25rem] bg-gradient-to-br from-slate-200 to-slate-100"></div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-slate-200"></div>
          <div className="h-4 w-1/2 rounded-full bg-slate-100"></div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-2/5 rounded-full bg-slate-100"></div>
          <div className="h-5 w-1/3 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
