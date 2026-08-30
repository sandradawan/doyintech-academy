export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-cyan uppercase">About</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
        A school from a studio that ships.
      </h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
        <p>
          Doyintech Academy is the teaching arm of DoyinTech — the Nigerian engineering studio
          behind production APIs, property platforms, and business software.
        </p>
        <p>
          The curriculum is the work: HTML, JavaScript, React, APIs, and Git — taught the way we
          review pull requests at DoyinTech.
        </p>
      </div>
      <section className="mt-12 rounded-xl bg-surface p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <h2 className="font-display text-xl font-medium text-fg">Faculty</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Led by Silas Doyin Jonathan, founder of DoyinTech.
        </p>
      </section>
    </main>
  );
}
