"use client";

import { useEffect } from "react";
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from "web-vitals";

export default function VitalsReporter() {
  useEffect(() => {
    const report = (metric: {
      name: string;
      value: number;
      rating: string;
      id: string;
    }) => {
      fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        }),
        keepalive: true,
      }).catch(() => {});
    };
    onCLS(report);
    onFID(report);
    onFCP(report);
    onLCP(report);
    onTTFB(report);
    onINP(report);
  }, []);

  return null;
}
