"use client";

import { cn } from "@/lib/utils";

export default function SectionHeading({
  kicker,
  icon: Icon,
  title,
  highlight,
  description,
  action,
  as: Tag = "h2",
  className,
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {kicker && (
          <span className="storefront-kicker">
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {kicker}
          </span>
        )}
        <Tag className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 md:text-[2.75rem]">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-gradient">{highlight}</span>
            </>
          )}
        </Tag>
        {description && (
          <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
