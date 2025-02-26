
"use client";

import { Helmet } from "react-helmet";
import { type ReactNode } from "react";

interface HelmetProviderProps {
  children: ReactNode;
}

export function HelmetProvider({ children }: HelmetProviderProps) {
  return <>{children}</>;
}

export { Helmet };
