"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches WebGL / Three.js runtime errors and renders a static
 * gradient-glow fallback so the hero section stays visually
 * complete even when the GPU context is unavailable.
 */
export default class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Only log — don't rethrow. The scene is decorative.
    console.warn("[SceneErrorBoundary] 3D scene failed, showing fallback:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative h-full w-full overflow-hidden" aria-hidden>
          {/* Static gradient glow that mirrors the 3D scene's palette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgb(var(--neon)/0.12)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgb(var(--neon2)/0.1)_0%,transparent_55%)]" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[80px]" />
        </div>
      );
    }
    return this.props.children;
  }
}
