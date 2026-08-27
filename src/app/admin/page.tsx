"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient, type User } from "@supabase/supabase-js";
import {
  Mail,
  Loader2,
  LogOut,
  Check,
  Trash2,
  Lock,
  Inbox,
  MessageSquareQuote,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  project_type?: string;
  budget?: string;
  timeline?: string;
  source?: string;
  created_at: string;
}

interface PendingQuote {
  id: string;
  name: string;
  quote: string;
  created_at: string;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const configured = Boolean(url && anonKey);

export default function AdminPage() {
  const [supabase] = useState(() =>
    url && anonKey ? createClient(url, anonKey) : null
  );
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"leads" | "testimonials">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pending, setPending] = useState<PendingQuote[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const [l, t] = await Promise.all([
      supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("testimonials").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    ]);
    if (!l.error) setLeads(l.data as Lead[]);
    if (!t.error) setPending(t.data as PendingQuote[]);
  }, [supabase]);

  useEffect(() => {
    if (user) void refresh();
  }, [user, refresh]);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    setSentOtp(true);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    setBusy(false);
    if (error) alert(error.message);
  }

  if (!configured || !supabase) {
    return (
      <main className="section-shell flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-neon/10 text-neon">
          <Lock className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-serif text-3xl font-bold text-paper">Admin area</h1>
        <p className="mt-3 max-w-md text-sm text-mist">
          The admin dashboard activates once Supabase is configured. Add{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-neon">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-neon">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to your environment, run{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-neon">
            supabase/seed.sql
          </code>{" "}
          in the SQL editor, and sign in here with your Supabase email.
        </p>
        <Link href="/" className="glass mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-mist transition-colors hover:text-paper">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="section-shell flex min-h-[80vh] flex-col items-center justify-center py-24">
        <div className="glass w-full max-w-sm rounded-3xl p-8">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-neon/10 text-neon">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-center font-serif text-2xl font-bold text-paper">
            Admin sign in
          </h1>
          {!sentOtp ? (
            <form onSubmit={sendOtp} className="mt-6 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass-input"
              />
              <button
                type="submit"
                disabled={busy}
                className="neo flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-sm font-semibold text-paper transition-colors hover:text-neon active:neo-inset disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send magic link code
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="mt-6 space-y-3">
              <p className="text-center text-[12.5px] text-mist">
                Check {email} for a 6-digit code.
              </p>
              <input
                required
                inputMode="numeric"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="6-digit code"
                className="glass-input text-center tracking-[0.4em]"
              />
              <button
                type="submit"
                disabled={busy}
                className="neo flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-sm font-semibold text-paper transition-colors hover:text-neon active:neo-inset disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Verify
              </button>
            </form>
          )}
          <p className="mt-5 text-center text-[11px] text-mist">
            Uses Supabase Auth - requires an email with access in your Supabase
            project (Auth → Users).
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="section-shell py-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neon">
            Admin
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-paper">
            Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-mist">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-mist transition-colors hover:text-paper">
            <ArrowLeft className="h-4 w-4" /> Site
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="neo inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-mist transition-colors hover:text-rose-400 active:neo-inset"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mb-8 flex gap-2">
        {[
          { key: "leads" as const, label: "Leads", icon: Inbox },
          { key: "testimonials" as const, label: "Pending testimonials", icon: MessageSquareQuote },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-colors",
              tab === t.key ? "bg-neon/15 text-neon" : "text-mist hover:text-paper"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.key === "testimonials" && pending.length > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-400 px-1 text-[10px] font-bold text-white">
                {pending.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "leads" ? (
        <div className="space-y-3">
          {leads.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-mist">
              No leads yet - messages submitted through the contact form will
              appear here.
            </p>
          )}
          {leads.map((l) => (
            <article key={l.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-paper">{l.name}</p>
                <p className="text-[11px] text-mist">{new Date(l.created_at).toLocaleString()}</p>
              </div>
              <p className="text-[12px] text-neon">{l.email}</p>
              {(l.project_type || l.budget || l.timeline) && (
                <p className="mt-1 text-[11.5px] text-mist">
                  {[l.project_type, l.budget, l.timeline].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-paper/85">
                {l.message}
              </p>
              {l.source && <p className="mt-2 text-[10.5px] text-mist">Source: {l.source}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pending.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-mist">
              No pending submissions. Visitor feedback arrives here for review.
            </p>
          )}
          {pending.map((t) => (
            <article key={t.id} className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-serif text-[15px] italic text-paper/90">“{t.quote}”</p>
                <p className="mt-2 text-[12px] text-mist">
                  {t.name} · {new Date(t.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await supabase.from("testimonials").update({ status: "approved" }).eq("id", t.id);
                    void refresh();
                  }}
                  className="neo flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-[12.5px] font-semibold text-paper transition-colors hover:text-emerald-400 active:neo-inset"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={async () => {
                    await supabase.from("testimonials").delete().eq("id", t.id);
                    void refresh();
                  }}
                  className="glass flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-mist transition-colors hover:border-rose-400/40 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" /> Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
