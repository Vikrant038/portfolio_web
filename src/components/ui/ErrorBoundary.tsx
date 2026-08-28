"use client";

import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: ReactNode;
  name?: string;
  fallback?: ReactNode | ((error: Error | null, reset: () => void) => ReactNode);
  className?: string;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Canonical React Error Boundary component for catching client-side
 * runtime errors across sections, forms, and canvas scenes.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary] Error in ${this.props.name ?? "Component"}:`,
      error,
      errorInfo
    );
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.reset);
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-label={`Error in ${this.props.name ?? "section"}`}
          className={cn(
            "glass mx-auto my-6 max-w-lg rounded-3xl p-8 text-center",
            this.props.className
          )}
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-400/10 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-serif text-lg font-bold text-paper">
            Unable to display {this.props.name ?? "this section"}
          </h3>
          <p className="mt-2 text-xs text-mist">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="neo mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-paper transition-colors hover:text-neon active:neo-inset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
