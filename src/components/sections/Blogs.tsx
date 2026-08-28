"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Tag, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";
import FilterTabs from "@/components/ui/FilterTabs";
import Modal from "@/components/ui/Modal";
import AmbientGlow from "@/components/ui/AmbientGlow";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import { ARTICLES, type Article } from "@/data/articles";

const BLOG_TABS = [
  { key: "all" as const, label: "All Articles" },
  { key: "systems" as const, label: "Systems Architecture" },
  { key: "ai" as const, label: "AI & LLMs" },
  { key: "ops" as const, label: "Leadership & FinOps" },
];

export default function Blogs() {
  const [filter, setFilter] = useState<"all" | "systems" | "ai" | "ops">("all");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const filtered =
    filter === "all"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === filter);

  return (
    <section id="blogs" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <AmbientGlow className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={500} />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Technical Notes"
          title="Systems breakdowns &"
          highlight="engineering notes."
          ghost="05"
        />

        {/* category filters */}
        <FilterTabs
          tabs={BLOG_TABS}
          active={filter}
          onChange={setFilter}
          layoutId="blogs-filter-pill"
          className="justify-start sm:justify-center mb-8"
        />

        {/* articles grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((art, i) => (
            <Reveal key={art.id} delay={i * 0.08}>
              <GlassCard
                glow="var(--neon)"
                rounded="2xl"
                onClick={() => setActiveArticle(art)}
                className="group flex h-full flex-col justify-between p-6 sm:p-7 cursor-pointer select-none transition-all duration-300 hover:border-neon/40"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-neon">
                      <Tag className="h-3 w-3" />
                      {art.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-mist">
                      <Clock className="h-3 w-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold leading-snug text-paper transition-colors duration-300 group-hover:text-neon sm:text-[22px]">
                    {art.title}
                  </h3>
                  <p className="mt-1 text-xs italic text-mist">
                    {art.subtitle}
                  </p>

                  <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-mist">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/[0.08] pt-4">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {art.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-mist"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <NeumorphicButton
                    size="sm"
                    className="w-full justify-between mt-4"
                    icon={<ChevronRight className="h-4 w-4 text-neon transition-transform duration-300 group-hover:translate-x-1" />}
                  >
                    Read teardown
                  </NeumorphicButton>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* article read modal */}
      <Modal
        isOpen={Boolean(activeArticle)}
        onClose={() => setActiveArticle(null)}
        title={activeArticle?.title}
        ariaLabel={activeArticle?.title}
        maxWidth="2xl"
        contentClassName="p-6 sm:p-9 pt-10 sm:pt-9"
        showCloseButton={true}
      >
        {activeArticle && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon">
              <BookOpen className="h-4 w-4" />
              {activeArticle.categoryLabel} · {activeArticle.readTime}
            </div>

            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-paper sm:text-3xl">
              {activeArticle.title}
            </h2>
            <p className="mt-1 text-sm italic text-mist">
              {activeArticle.subtitle}
            </p>

            {/* key takeaways */}
            <div className="glass mt-6 rounded-2xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                ✦ Core Engineering Takeaways
              </p>
              <ul className="mt-3 space-y-2 text-xs text-paper/90">
                {activeArticle.takeaways.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* article body */}
            <div className="mt-6 space-y-4 text-[14.5px] leading-relaxed text-mist">
              {activeArticle.fullBody.split("\n\n").map((chunk, cIdx) => {
                const trimmed = chunk.trim();
                if (trimmed.startsWith("### ")) {
                  return (
                    <h4
                      key={cIdx}
                      className="font-serif text-lg font-bold text-gold mt-6 mb-2"
                    >
                      {trimmed.replace(/^###\s*/, "")}
                    </h4>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h3
                      key={cIdx}
                      className="font-serif text-xl font-bold text-paper mt-6 mb-2"
                    >
                      {trimmed.replace(/^##\s*/, "")}
                    </h3>
                  );
                }
                const lines = trimmed.split("\n");
                if (
                  lines.length > 1 &&
                  lines.every((l) => /^\d+\.\s+/.test(l) || l.startsWith("- "))
                ) {
                  return (
                    <ul key={cIdx} className="my-3 space-y-2 pl-1 text-[14px] text-mist">
                      {lines.map((l, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                          <span>
                            {l
                              .replace(/^\d+\.\s+|^-\s+/, "")
                              .replace(/\*\*/g, "")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={cIdx} className="leading-relaxed">
                    {trimmed.replace(/\*\*/g, "").replace(/^###\s*/, "")}
                  </p>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
              <div className="flex flex-wrap gap-2">
                {activeArticle.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-mist"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="neo rounded-xl bg-ink px-5 py-2.5 text-xs font-semibold text-paper hover:text-neon"
              >
                Done reading
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
