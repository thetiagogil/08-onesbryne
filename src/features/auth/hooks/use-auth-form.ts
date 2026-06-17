"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import { getAuthModeHref } from "@/features/auth/lib/auth-routing";
import { validateAuthInput } from "@/features/auth/lib/auth-validation";
import type { AuthFormProps } from "@/features/auth/types";
import { createClient } from "@/lib/supabase/browser";

export const useAuthForm = ({
  initialError,
  mode,
  next = "/",
}: AuthFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pending, setPending] = useState(false);

  const isSignup = mode === "signup";
  const emailValue = email.trim().toLowerCase();
  const continuePath = useMemo(
    () => `/auth/continue?next=${encodeURIComponent(next)}`,
    [next],
  );
  const alternateHref = getAuthModeHref(isSignup ? "login" : "signup", next);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateAuthInput({
      confirmPassword,
      displayName,
      email: emailValue,
      isSignup,
      password,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const result = isSignup
        ? await supabase.auth.signUp({
            email: emailValue,
            options: {
              data: displayName.trim()
                ? { display_name: displayName.trim() }
                : undefined,
              emailRedirectTo:
                typeof window !== "undefined"
                  ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                      continuePath,
                    )}`
                  : undefined,
            },
            password,
          })
        : await supabase.auth.signInWithPassword({
            email: emailValue,
            password,
          });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (isSignup && !result.data.session) {
        setMessage(`Check ${emailValue} to confirm your account, then log in.`);
        return;
      }

      router.replace(continuePath);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Supabase is not configured.",
      );
    } finally {
      setPending(false);
    }
  };

  return {
    alternateHref,
    confirmPassword,
    displayName,
    email,
    error,
    handleSubmit,
    isSignup,
    message,
    next,
    password,
    pending,
    setConfirmPassword,
    setDisplayName,
    setEmail,
    setPassword,
  };
};
