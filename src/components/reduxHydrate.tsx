"use client";

import { ReactNode } from "react";

export default function ReduxHydrate({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col flex-1">
      {children}
    </div>
  );
}

