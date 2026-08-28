"use client";

import type { ReactNode } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface Props {
  children: ReactNode;
  name?: string;
}

export default function SectionErrorBoundary({ children, name }: Props) {
  return <ErrorBoundary name={name ?? "section"}>{children}</ErrorBoundary>;
}
