"use client";

export default function Spinner({
  size = "md",
  color = "text-gold-500",
  strokeWidth = 3,
  className = "",
}) {
  // Size mapping
  const sizes = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  // Animation style (can be moved to CSS if preferred)
  const spinAnimation = {
    animation: "spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite",
  };

  return (
    <div
      role="status"
      className={`inline-flex items-center justify-center ${className}`}
      aria-label="Loading"
    >
      <svg
        className={`${sizes[size]} ${color}`}
        style={spinAnimation}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray="60"
          strokeDashoffset="50"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
