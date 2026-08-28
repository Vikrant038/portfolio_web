"use client";

import React, { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches crashes in the multi-step contact form (Zod validation,
 * Supabase upload, unexpected render errors) and shows a retry
 * UI. The left-column contact info remains visible because this
 * boundary wraps only the <form>, not the entire Contact section.
 */
export default class FormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[FormErrorBoundary] Contact form crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="glass rounded-3xl p-8 text-center"
          role="alert"
          aria-label="Form error"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-400/10 text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-serif text-lg font-bold text-paper">
            Something went wrong
          </h3>
          <p className="mt-2 text-sm text-mist">
            The form encountered an unexpected error.
            You can try again or reach out directly via email.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="neo mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:text-neon active:neo-inset"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
