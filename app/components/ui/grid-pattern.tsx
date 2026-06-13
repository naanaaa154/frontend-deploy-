import React from "react";
import { cn } from "~/lib/utils";

interface GridPatternBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GridPatternBackground({
  children,
  className,
  ...props
}: GridPatternBackgroundProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)} {...props}>
      <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundImage: `
            radial-gradient(#e5e7eb 1px, transparent 1px),
            radial-gradient(#e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
          maskImage: "linear-gradient(to bottom, white 50%, transparent 90%)",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}