import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-64 bg-gray-200 rounded-lg"></div>

      <div className="h-32 bg-gray-200 rounded-lg"></div>

      <div className="h-48 bg-gray-200 rounded-lg"></div>

      <div className="h-48 bg-gray-200 rounded-lg"></div>

      <div className="h-48 bg-gray-200 rounded-lg"></div>

      <div className="h-48 bg-gray-200 rounded-lg"></div>

      <div className="h-48 bg-gray-200 rounded-lg"></div>
    </div>
  );
};

export default SkeletonLoader;
