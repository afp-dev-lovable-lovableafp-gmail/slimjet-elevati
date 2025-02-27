
"use client";

import { HelmetProvider as ReactHelmetProvider, Helmet } from "react-helmet-async";
import { type ReactNode } from "react";

interface HelmetProviderProps {
  children: ReactNode;
}

export function HelmetProvider({ children }: HelmetProviderProps) {
  return <ReactHelmetProvider>{children}</ReactHelmetProvider>;
}

export { Helmet };
