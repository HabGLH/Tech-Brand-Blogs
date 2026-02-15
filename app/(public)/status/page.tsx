export default function StatusPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-[rgb(var(--text-primary))] mb-4">
        System Status
      </h1>
      <p className="text-[rgb(var(--text-muted))] leading-relaxed">
        All core systems are operational. If you notice an issue, contact
        support with steps to reproduce.
      </p>
    </div>
  );
}
