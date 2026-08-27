"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="career-print-btn">
      Print / Save as PDF
    </button>
  );
}
