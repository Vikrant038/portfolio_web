"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[SectionErrorBoundary] Error in ${this.props.name ?? "section"}:`,
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          className="relative py-24 sm:py-32"
          role="alert"
          aria-label={`Error loading ${this.props.name ?? "section"}`}
        >
          <div className="section-shell text-center">
            <p className="text-sm text-mist/60">
              Unable to load this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="neo mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-paper hover:text-neon"
            >
              Try again
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
