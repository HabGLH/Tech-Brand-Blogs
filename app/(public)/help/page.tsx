export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-[rgb(var(--text-primary))] mb-4">
        Help Center
      </h1>
      <p className="text-[rgb(var(--text-muted))] leading-relaxed mb-4">
        Common topics:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[rgb(var(--text-muted))]">
        <li>Account login and password reset</li>
        <li>Writing and editing posts</li>
        <li>Likes, comments, and profile settings</li>
      </ul>
    </div>
  );
}
