"use client";

import { Download, MapPin, GraduationCap, Coffee, Award, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import Tilt from "@/components/ui/Tilt";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { cn, downloadResume } from "@/lib/utils";

const FACTS = [
  { icon: MapPin, label: "Based in", value: "New Delhi, India · Remote Worldwide" },
  { icon: GraduationCap, label: "Education", value: "BS Data Science & Applications, IIT Madras" },
  { icon: Coffee, label: "Currently", value: "Building a multi-agent orchestrator & a Corrective RAG assistant" },
];

const CERTS = ["Oracle Generative AI Professional", "Oracle Data Science", "McKinsey Forward Program"];

export default function About() {
  const { scrollTo } = useSmoothScroll();
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <div className="section-shell">
        <SectionHeading
          eyebrow="About me"
          title="Engineering with"
          highlight="systems focus."
          ghost="01"
        />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* left - stylized monogram frame */}
          <Reveal className="relative mx-auto w-full max-w-md">
            <Tilt max={10} className="group relative">
              <div className="glass relative aspect-square overflow-hidden rounded-[2.5rem] shadow-glass">
                <div className="cyber-grid absolute inset-0 opacity-30" />
                <div
                  className="absolute -right-10 -top-10 h-52 w-52 rounded-full blur-[70px]"
                  style={{ background: "rgb(var(--neon) / 0.12)" }}
                />
                <div
                  className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full blur-[70px]"
                  style={{ background: "rgb(var(--neon2) / 0.12)" }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
                  {/* colorful line-art - connected nodes in the brand palette */}
                  <svg
                    viewBox="0 0 360 250"
                    className="w-full max-w-[300px] animate-floaty sm:max-w-[320px]"
                    role="img"
                    aria-label="Abstract line art of connected nodes in tangerine, lagoon and gold"
                  >
                    {/* nodes */}
                    <g fill="rgb(var(--neon))">
                      <circle cx="60" cy="55" r="5">
                        <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="60" cy="195" r="4" />
                      <circle cx="180" cy="40" r="6">
                        <animate attributeName="r" values="6;9;6" dur="4s" repeatCount="indefinite" />
                      </circle>
                    </g>
                    <g fill="rgb(var(--neon2))">
                      <circle cx="300" cy="70" r="5" />
                      <circle cx="300" cy="185" r="4" />
                      <circle cx="180" cy="215" r="6">
                        <animate attributeName="r" values="6;4;6" dur="3.5s" repeatCount="indefinite" />
                      </circle>
                    </g>
                    <circle cx="180" cy="120" r="3" fill="rgb(var(--gold))">
                      <animate attributeName="r" values="3;6;3" dur="2.8s" repeatCount="indefinite" />
                    </circle>

                    {/* connections */}
                    <g stroke="rgb(var(--neon))" strokeWidth="1.8" fill="none">
                      <line x1="60" y1="55" x2="180" y2="120" strokeOpacity="0.85" />
                      <line x1="60" y1="195" x2="180" y2="120" strokeOpacity="0.6" />
                      <line x1="180" y1="40" x2="180" y2="120" strokeOpacity="0.9">
                        <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
                      </line>
                      <line x1="60" y1="55" x2="60" y2="195" strokeOpacity="0.35" strokeDasharray="4 6">
                        <animate attributeName="stroke-dashoffset" values="0;-100" dur="6s" repeatCount="indefinite" />
                      </line>
                    </g>
                    <g stroke="rgb(var(--neon2))" strokeWidth="1.8" fill="none">
                      <line x1="300" y1="70" x2="180" y2="120" strokeOpacity="0.85" />
                      <line x1="300" y1="185" x2="180" y2="120" strokeOpacity="0.55" />
                      <line x1="180" y1="215" x2="180" y2="120" strokeOpacity="0.9">
                        <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                      </line>
                      <line x1="300" y1="70" x2="300" y2="185" strokeOpacity="0.35" strokeDasharray="4 6">
                        <animate attributeName="stroke-dashoffset" values="-100;0" dur="6s" repeatCount="indefinite" />
                      </line>
                    </g>
                    <g stroke="rgb(var(--gold))" strokeWidth="1.8" fill="none">
                      <line x1="180" y1="120" x2="180" y2="215" strokeOpacity="0.5" strokeDasharray="3 5">
                        <animate attributeName="stroke-dashoffset" values="0;96" dur="5s" repeatCount="indefinite" />
                      </line>
                      <line x1="180" y1="40" x2="300" y2="70" strokeOpacity="0.6" />
                      <line x1="60" y1="195" x2="180" y2="215" strokeOpacity="0.6" />
                      <line x1="300" y1="185" x2="180" y2="215" strokeOpacity="0.45" strokeDasharray="4 5">
                        <animate attributeName="stroke-dashoffset" values="-90;0" dur="7s" repeatCount="indefinite" />
                      </line>
                    </g>
                    {/* soft halo behind the constellation */}
                    <circle cx="180" cy="120" r="90" fill="none" stroke="rgb(var(--neon) / 0.14)" strokeWidth="1" />
                    <circle cx="180" cy="120" r="60" fill="none" stroke="rgb(var(--neon2) / 0.16)" strokeWidth="1" strokeDasharray="2 6">
                      <animate attributeName="stroke-dashoffset" values="0;-32" dur="4s" repeatCount="indefinite" />
                    </circle>
                  </svg>

                  <div>
                    <p className="font-serif text-2xl text-paper">Vikrant Yadav</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-neon">
                      AI Systems Engineer
                    </p>
                  </div>
                </div>
              </div>
            </Tilt>
          </Reveal>

          {/* right - story */}
          <div>
            <Reveal delay={0.1}>
              <p className="font-serif text-lg italic leading-relaxed text-paper/90 sm:text-xl">
                “Most 'people problems' are actually system problems - I'd rather
                spend a day building something that saves an hour a day than
                spend that hour, every day, forever.”
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 text-[15px] leading-relaxed text-mist">
                Over a <span className="font-semibold text-paper">7-month internship</span> at
                Deep Thought Analytics, I went from cleaning spreadsheets as a
                Business Analyst Intern to leading a 6-person team as Team Lead
                - shipping 6+ AI automation tools along the way, one of which cut
                a 15–18 hour/week task down to ~30 minutes.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 text-[15.5px] leading-relaxed text-mist sm:text-[16.5px] sm:leading-7">
                My specialty is <span className="text-neon font-semibold">systems thinking</span>: when a
                workflow is slow or fragile, I redesign it so it doesn't need
                grinding through anymore. Right now I'm building a multi-agent
                orchestration system and a production-grade Corrective RAG assistant
                for complex immigration &amp; study workflows, engineered with hybrid retrieval and self-grading relevance gates.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-8 grid gap-3 sm:grid-cols-1">
                {FACTS.map((f) => (
                  <div
                    key={f.label}
                    className="glass flex items-center gap-4 rounded-2xl px-5 py-3.5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon/[0.08] text-neon">
                      <f.icon size={18} />
                    </span>
                    <div>
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-mist">
                        {f.label}
                      </p>
                      <p className="text-[14.5px] font-medium text-paper">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <NeumorphicButton
                  icon={<Download size={16} />}
                  onClick={downloadResume}
                >
                  Download Resume
                </NeumorphicButton>
                <a
                  href="/career"
                  className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-mist transition-colors hover:text-paper"
                >
                  View career page
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            {/* certifications */}
            <Reveal delay={0.5}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/10 text-gold">
                  <Award size={16} />
                </span>
                {CERTS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-gold/25 bg-gold/[0.07] px-3.5 py-1.5 text-[11px] font-semibold text-gold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
