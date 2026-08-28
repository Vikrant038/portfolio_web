"use client";

import type { ReactNode } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface Props {
  children: ReactNode;
}

export default function FormErrorBoundary({ children }: Props) {
  return <ErrorBoundary name="Contact Form">{children}</ErrorBoundary>;
}
