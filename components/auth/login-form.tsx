import React from "react";

type LoginFormValues = Record<string, FormDataEntryValue>;

export default function LoginForm({
  onSubmit,
}: {
  onSubmit?: (data: LoginFormValues) => void;
}) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());
    onSubmit?.(formData);
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {" "}
      <div>
        {" "}
        <label className="block text-sm font-medium">Email</label>{" "}
        <input
          name="email"
          type="email"
          required
          className="w-full mt-1 p-2 border rounded"
        />{" "}
      </div>{" "}
      <div>
        {" "}
        <label className="block text-sm font-medium">Password</label>{" "}
        <input
          name="password"
          type="password"
          required
          className="w-full mt-1 p-2 border rounded"
        />{" "}
      </div>{" "}
      <div>
        {" "}
        <button
          type="submit"
          className="px-4 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] rounded"
        >
          {" "}
          Sign in{" "}
        </button>{" "}
      </div>{" "}
    </form>
  );
}
