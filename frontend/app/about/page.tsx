import { ShieldCheck, Sparkles, ServerCog } from 'lucide-react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">About this demo</p>
        <h1 className="mt-4 text-3xl font-semibold text-black">Built to be easy to follow.</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Two modes. One input. Clear results.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-3xl p-5">
          <ShieldCheck className="h-6 w-6 text-black" />
          <h2 className="mt-3 text-lg font-semibold text-black">Protected</h2>
          <p className="mt-2 text-sm text-slate-600">Checks input and blocks attacks.</p>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <Sparkles className="h-6 w-6 text-black" />
          <h2 className="mt-3 text-lg font-semibold text-black">Vulnerable</h2>
          <p className="mt-2 text-sm text-slate-600">Lets risky input through for demo.</p>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <ServerCog className="h-6 w-6 text-black" />
          <h2 className="mt-3 text-lg font-semibold text-black">Setup</h2>
          <p className="mt-2 text-sm text-slate-600">FastAPI backend, Next.js frontend.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel rounded-[2rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Model analysis</p>
          <h2 className="mt-3 text-xl font-semibold text-black">Confusion matrix</h2>
          <p className="mt-2 text-sm text-slate-600">Loaded directly from the workspace artifact and served through FastAPI.</p>
          <img
            src={`${apiBaseUrl}/artifacts/confusion-matrix`}
            alt="Confusion matrix"
            className="mt-4 w-full rounded-2xl border border-black/10 bg-white object-cover"
          />
        </section>

        <section className="glass-panel rounded-[2rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Explainability</p>
          <h2 className="mt-3 text-xl font-semibold text-black">SHAP SQLi analysis</h2>
          <p className="mt-2 text-sm text-slate-600">Useful for showing why the engine flagged injection-like patterns.</p>
          <img
            src={`${apiBaseUrl}/artifacts/shap-sqli`}
            alt="SHAP SQLi analysis"
            className="mt-4 w-full rounded-2xl border border-black/10 bg-white object-cover"
          />
        </section>
      </div>
    </div>
  );
}
