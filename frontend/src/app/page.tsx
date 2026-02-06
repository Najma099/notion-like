"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthModal from "@/components/AuthModel";
import { useAuth } from "@/hooks/useAuth";

// 1. Move the logic into a internal component
function HomeContent() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading) {
      if (user) {
        const destination = searchParams.get("redirect") || "/workspace";
        router.replace(destination);
      } else if (searchParams.has("redirect") || searchParams.get("auth") === "login") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(true);
      }
    }
  }, [user, loading, router, searchParams]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Checking authentication...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <main className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-900 text-center border border-zinc-200 dark:border-zinc-800">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Notion Clone
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Think, write, and plan. All in one place.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-11 rounded-md bg-black text-white font-medium hover:bg-zinc-800 transition-colors"
        >
          Get Started
        </button>
      </main>

      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

// 2. The main page exports the Suspense wrapper
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}