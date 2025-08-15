const SkeletonCard = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
    <div className="animate-pulse flex flex-col space-y-4">
      <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-md"></div>
      <div className="space-y-2">
        <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
        <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
