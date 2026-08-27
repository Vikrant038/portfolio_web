"use client";

import { useEffect, useState } from "react";

const SECTIONS = ["top", "about", "projects", "skills", "experience", "blogs", "contact"];

export function useScrollSpy(ids: string[] = SECTIONS) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    let current = ids[0] ?? "";

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              current = id;
              setActive(id);
              onActive(id);
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    // keep the URL hash in sync (deep-linkable sections)
    const onActive = (id: string) => {
      try {
        const url = new URL(window.location.href);
        if (url.hash !== `#${id}`) {
          url.hash = id === ids[0] ? "" : id;
          window.history.replaceState(null, "", url.toString());
        }
      } catch {
        /* ignore */
      }
    };
    onActive(ids[0] ?? "");

    // fallback: pick the last section scrolled past + handle bottom of page
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      if (atBottom && ids.includes("contact")) {
        if (current !== "contact") {
          current = "contact";
          setActive("contact");
          onActive("contact");
        }
        return;
      }

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          if (current !== id) {
            current = id;
            setActive(id);
            onActive(id);
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

export { SECTIONS };
