export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-[rgb(var(--text-primary))] mb-4">
        Contact
      </h1>
      <p className="text-[rgb(var(--text-muted))] leading-relaxed mb-4">
        For support, partnerships, or editorial questions, contact our team.
      </p>
      <ul className="space-y-2 text-[rgb(var(--text-muted))]">
        <li>Email: support@blogly.local</li>
        <li>Business: hello@blogly.local</li>
      </ul>
    </div>
  );
}

