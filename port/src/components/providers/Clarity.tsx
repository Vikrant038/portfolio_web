"use client";

import { useEffect, useState } from "react";
import clarity from "@microsoft/clarity";
import { readConsent } from "@/components/ui/ConsentBanner";

export default function Clarity() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => {
      if (readConsent() === "accepted") setAllowed(true);
    };
    check();
    window.addEventListener("storage", check);
    window.addEventListener("luxe:consent", check as EventListener);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("luxe:consent", check as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const id =
      process.env.NEXT_PUBLIC_CLARITY_ID ?? process.env.CLARITY_ID ?? "";
    if (!id) return;
    clarity.init(id);
  }, [allowed]);

  return null;
}
