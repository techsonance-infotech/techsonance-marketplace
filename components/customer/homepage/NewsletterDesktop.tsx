'use client'
import { Star } from "lucide-react";
import { useState } from "react";

export function NewsletterDesktop({ getField }: { getField: (k: string) => string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setDone(true);
      setEmail("");
      setTimeout(() => setDone(false), 4000);
    }
  };

  return (
    <section className="newsletter_desktop bg-[#0a0b0f] text-white py-24 px-6 lg:px-16 xl:px-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
              Stay Connected
            </p>
            <h2 className="text-4xl font-serif tracking-tight leading-tight mb-4">
              {getField("newsletter_title")}
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-md">
              {getField("newsletter_desc")}
            </p>
          </div>
          <div>
            {done ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Star size={20} className="text-emerald-400" />
                </div>
                <p className="font-semibold text-white">
                  You're in. Welcome to the inner circle.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest rounded-xl whitespace-nowrap"
                  >
                    {getField("newsletter_btn_text") || "Subscribe"}
                  </button>
                </div>
                <p className="text-[11px] text-white/25">
                  By subscribing you agree to our Terms of Use and Privacy
                  Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
