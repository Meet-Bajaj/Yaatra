import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <h1 className="mb-2 text-6xl font-bold text-white">404</h1>
      <p className="mb-6 text-lg text-white/50">Page not found</p>
      <Link
        href="/dashboard"
        className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
