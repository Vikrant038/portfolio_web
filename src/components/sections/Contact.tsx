"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Send,
  Mail,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Twitter,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Paperclip,
  X,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import AmbientGlow from "@/components/ui/AmbientGlow";
import FormErrorBoundary from "@/components/sections/contact/FormErrorBoundary";
import { getSupabase } from "@/lib/supabase";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/lib/storage";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "luxe-contact-draft";

const schema = z.object({
  name: z.string().min(2, "Please tell me your name (2+ characters)"),
  email: z.string().email("That email doesn't look right"),
  message: z
    .string()
    .min(10, "Give me a little more detail (10+ characters)")
    .max(2000, "Keep it under 2000 characters"),
});

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

import { SITE_CONFIG } from "@/lib/constants";

const PROJECT_TYPES = [
  "AI / LLM automation",
  "RAG / chatbot",
  "Data pipeline / dashboard",
  "Internship / full-time role",
  "Something else",
];

const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $40k", "$40k+"];
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"];

const SOCIALS = [
  { icon: Github, label: "GitHub", href: SITE_CONFIG.socials.github },
  { icon: Linkedin, label: "LinkedIn", href: SITE_CONFIG.socials.linkedin },
  { icon: Twitter, label: "X / Twitter", href: SITE_CONFIG.socials.twitter },
  { icon: Mail, label: "Email", href: `mailto:${SITE_CONFIG.email}` },
];

export default function Contact() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    projectType: PROJECT_TYPES[0],
    budget: BUDGETS[1],
    timeline: TIMELINES[1],
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [blurred, setBlurred] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // draft autosave + restore
  useEffect(() => {
    const raw = getStorageItem<Record<string, unknown> | null>(DRAFT_KEY, null);
    if (raw) setValues((v) => ({ ...v, ...raw }));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStorageItem(DRAFT_KEY, values);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [values]);

  function validateField(
    key: "name" | "email" | "message",
    value: string
  ): string | undefined {
    const partial = schema.pick({ [key]: true } as any).safeParse({ [key]: value });
    return partial.success ? undefined : partial.error.issues[0]?.message;
  }

  function handleBlur(key: "name" | "email" | "message") {
    setBlurred((b) => ({ ...b, [key]: true }));
    const err = validateField(key, values[key]);
    setErrors((e) => ({ ...e, [key]: err }));
  }

  const detailsValid =
    !errors.name && !errors.email && !errors.message &&
    values.name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(values.email) &&
    values.message.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof FieldErrors] = issue.message;
      }
      setErrors(next);
      setStep(2);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const source =
        typeof window !== "undefined" ? window.location.pathname : "/";

      // optional brief upload → Supabase Storage (public "briefs" bucket)
      let attachmentUrl = "";
      if (file) {
        setUploading(true);
        const supabase = getSupabase();
        if (supabase) {
          const path = `briefs/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
          const { data, error } = await supabase.storage
            .from("briefs")
            .upload(path, file);
          if (!error && data) {
            const { data: pub } = supabase.storage.from("briefs").getPublicUrl(path);
            attachmentUrl = pub.publicUrl;
          } else {
            toast.warning("Couldn't upload the file - sending without it.");
          }
        } else {
          toast.warning("File uploads need Supabase configured - sending without it.");
        }
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          message: attachmentUrl
            ? `${parsed.data.message}\n\nBrief: ${attachmentUrl}`
            : parsed.data.message,
          projectType: values.projectType,
          budget: values.budget,
          timeline: values.timeline,
          source,
        }),
      });
      const data = await res.json().catch(() => ({} as Record<string, unknown>));
      if (!res.ok) throw new Error((data.error as string | undefined) ?? `Request failed (${res.status})`);
      if (data.emailSent) {
        toast.success("Message sent! Email delivered to Vikrant.", { duration: 5000 });
      } else {
        toast.success("Message received & saved to database!", { duration: 5000 });
      }
      setFile(null);
      setValues({
        name: "",
        email: "",
        message: "",
        projectType: PROJECT_TYPES[0],
        budget: BUDGETS[1],
        timeline: TIMELINES[1],
      });
      removeStorageItem(DRAFT_KEY);
      setStep(0);
      setBlurred({});
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  const steps = useMemo(
    () => [
      { title: "Project type", subtitle: "What are we building?" },
      { title: "Budget & timeline", subtitle: "Scope it loosely." },
      { title: "Details", subtitle: "Name, email, message." },
    ],
    []
  );

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <AmbientGlow color="neon2" className="left-1/2 top-1/3 -translate-x-1/2" size={460} opacity={0.06} />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch or"
          highlight="discuss a project."
          ghost="06"
        />

        <div className="grid items-center gap-10 lg:grid-cols-5 lg:gap-14">
          {/* left - orb + info */}
          <Reveal className="lg:col-span-2">
            <div className="relative mx-auto flex max-w-sm flex-col items-center text-center">
              <div className="relative mb-10 grid h-52 w-52 place-items-center">
                <span className="absolute inset-0 rounded-full border border-neon/20" />
                <span className="absolute inset-4 rounded-full border border-neon/25" />
                <span className="absolute inset-0 animate-pulse-ring rounded-full border border-neon/40" />
                <span className="absolute inset-0 animate-pulse-ring rounded-full border border-neon2/40 [animation-delay:1.3s]" />
                <div className="absolute inset-0 animate-spin [animation-duration:14s]">
                  <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-neon shadow-[0_0_16px_rgb(var(--neon)/1)]" />
                </div>
                <div className="absolute inset-0 animate-spin [animation-direction:reverse] [animation-duration:20s]">
                  <span className="absolute -bottom-1 left-1/4 h-2 w-2 rounded-full bg-gold shadow-[0_0_14px_rgb(var(--gold)/1)]" />
                </div>
                <div className="grid h-32 w-32 animate-floaty place-items-center rounded-full border border-neon/40 bg-gradient-to-br from-neon/[0.14] to-neon2/[0.14] backdrop-blur-2xl shadow-[0_0_60px_-12px_rgb(var(--neon)/0.8)]">
                  <Send className="h-10 w-10 text-neon drop-shadow-[0_0_14px_rgb(var(--neon)/1)]" />
                </div>
              </div>

              <div className="w-full space-y-3 text-left">
                {[
                  { icon: Mail, label: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                  { icon: MapPin, label: SITE_CONFIG.location },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="glass flex items-center gap-4 rounded-2xl px-5 py-3.5"
                  >
                    <span className="grid h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 place-items-center rounded-xl bg-neon/[0.08] text-neon">
                      <r.icon size={18} />
                    </span>
                    {r.href ? (
                      <a href={r.href} className="text-sm font-medium text-paper hover:text-neon transition-colors">
                        {r.label}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-paper">
                        {r.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="neo grid h-12 w-12 place-items-center rounded-full bg-ink text-mist transition-all duration-300 hover:-translate-y-1 hover:text-neon hover:shadow-[0_0_26px_-6px_rgb(var(--neon)/0.7)] active:neo-inset active:translate-y-0"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* right - multi-step form */}
          <Reveal delay={0.15} className="lg:col-span-3">
            <FormErrorBoundary>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass relative overflow-hidden rounded-3xl p-7 shadow-glass sm:p-10"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[70px]"
                style={{ background: "rgb(var(--neon) / 0.08)" }}
              />

              {/* step indicator */}
              <div className="mb-8 flex items-center gap-2">
                {steps.map((s, i) => (
                  <div key={s.title} className="flex flex-1 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => i < step && setStep(i)}
                      className={cn(
                        "grid h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition-all",
                        i < step
                          ? "border-neon bg-neon/15 text-neon"
                          : i === step
                            ? "border-neon bg-neon/10 text-neon"
                            : "border-white/10 text-mist"
                      )}
                      aria-label={s.title}
                    >
                      {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </button>
                    <span
                      className={cn(
                        "hidden text-[11px] font-semibold sm:block",
                        i === step ? "text-paper" : "text-mist/70"
                      )}
                    >
                      {s.title}
                    </span>
                    {i < steps.length - 1 && (
                      <span
                        className={cn(
                          "h-px flex-1",
                          i < step ? "bg-neon/60" : "bg-white/10"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="relative">
                {/* step 0 - project type */}
                {step === 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PROJECT_TYPES.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setValues((v) => ({ ...v, projectType: t }))}
                        className={cn(
                          "rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-300",
                          values.projectType === t
                            ? "border-neon/50 bg-neon/[0.08] text-paper shadow-[0_0_24px_-8px_rgb(var(--neon)/0.5)]"
                            : "border-white/10 bg-white/[0.03] text-mist hover:border-white/20 hover:text-paper"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {/* step 1 - budget + timeline */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-mist">
                        Budget
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {BUDGETS.map((b) => (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setValues((v) => ({ ...v, budget: b }))}
                            className={cn(
                              "rounded-2xl border px-3 py-3.5 text-[12.5px] font-medium transition-all duration-300",
                              values.budget === b
                                ? "border-neon/50 bg-neon/[0.08] text-paper"
                                : "border-white/10 bg-white/[0.03] text-mist hover:text-paper"
                            )}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-mist">
                        Timeline
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {TIMELINES.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setValues((v) => ({ ...v, timeline: t }))}
                            className={cn(
                              "rounded-2xl border px-3 py-3.5 text-[12.5px] font-medium transition-all duration-300",
                              values.timeline === t
                                ? "border-neon/50 bg-neon/[0.08] text-paper"
                                : "border-white/10 bg-white/[0.03] text-mist hover:text-paper"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* step 2 - details */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          inputMode="text"
                          autoComplete="name"
                          autoCapitalize="words"
                          placeholder="Your name"
                          className="glass-input"
                          value={values.name}
                          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                          onBlur={() => handleBlur("name")}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? "name-err" : undefined}
                        />
                        <p id="name-err" role="alert" className="mt-2 min-h-4 text-xs text-rose-400">
                          {errors.name && blurred.name ? errors.name : ""}
                        </p>
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          placeholder="your.email@example.com"
                          className="glass-input"
                          value={values.email}
                          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                          onBlur={() => handleBlur("email")}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? "email-err" : undefined}
                        />
                        <p id="email-err" role="alert" className="mt-2 min-h-4 text-xs text-rose-400">
                          {errors.email && blurred.email ? errors.email : ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      {/* brief attachment */}
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
                        Brief attachment (optional)
                      </label>
                      <label className="glass flex cursor-pointer items-center gap-3 rounded-2xl px-5 py-3.5 transition-colors hover:border-neon/30">
                        <Paperclip className="h-4 w-4 shrink-0 text-neon" />
                        <span className="flex-1 truncate text-[13px] text-mist">
                          {file ? file.name : "Attach a PDF or image…"}
                        </span>
                        {uploading && <Loader2 className="h-4 w-4 animate-spin text-neon" />}
                        {file && !uploading && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(null);
                            }}
                            aria-label="Remove attachment"
                            className="text-mist hover:text-rose-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      <div className="mb-2 mt-4 flex items-center justify-between">
                        <label htmlFor="message" className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
                          Message
                        </label>
                        <span className="text-[10px] text-mist/60">
                          {values.message.length} / 2000
                        </span>
                      </div>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Tell me about your project, timeline and budget…"
                        className="glass-input resize-none"
                        value={values.message}
                        onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                        onBlur={() => handleBlur("message")}
                        maxLength={2000}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "message-err" : undefined}
                      />
                      <p id="message-err" role="alert" className="mt-2 min-h-4 text-xs text-rose-400">
                        {errors.message && blurred.message ? errors.message : ""}
                      </p>
                    </div>
                  </div>
                )}

                {/* honeypot */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  aria-hidden="true"
                />
              </div>

              {/* nav buttons */}
              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <NeumorphicButton
                    variant="ghost"
                    icon={<ArrowLeft className="h-4 w-4" />}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    Back
                  </NeumorphicButton>
                ) : (
                  <span />
                )}

                {step < 2 ? (
                  <NeumorphicButton
                    icon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue
                  </NeumorphicButton>
                ) : (
                  <NeumorphicButton
                    type="submit"
                    icon={
                      submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )
                    }
                  >
                    {submitting ? "Sending…" : "Send Message"}
                  </NeumorphicButton>
                )}
              </div>
            </form>
            </FormErrorBoundary>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
