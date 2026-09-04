import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="storefront-panel h-72 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-50"></div>

      <div className="storefront-panel-soft h-36 rounded-[1.75rem] bg-slate-100"></div>

      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="storefront-panel-soft h-40 rounded-[1.75rem] bg-slate-100"
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
