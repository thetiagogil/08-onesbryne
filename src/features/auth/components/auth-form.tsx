"use client";

import { Loader2 } from "lucide-react";

import { AuthFeedback } from "@/features/auth/components/auth-feedback";
import { AuthFormFields } from "@/features/auth/components/auth-form-fields";
import { useAuthForm } from "@/features/auth/hooks/use-auth-form";
import type { AuthFormProps } from "@/features/auth/types";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";

export const AuthForm = ({ initialError, mode, next = "/" }: AuthFormProps) => {
  const authForm = useAuthForm({ initialError, mode, next });

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <PageHeader
        align="center"
        className="text-center"
        description={
          authForm.isSignup
            ? "Create an account to save favourites and keep track of selected pieces."
            : "Access your saved pieces and account details."
        }
        size="compact"
        title={authForm.isSignup ? "Sign up" : "Log in"}
      />

      <form
        aria-busy={authForm.pending}
        className="mt-12 space-y-6"
        onSubmit={authForm.handleSubmit}
      >
        {authForm.error ? (
          <AuthFeedback tone="error">{authForm.error}</AuthFeedback>
        ) : null}
        {authForm.message ? (
          <AuthFeedback tone="success">{authForm.message}</AuthFeedback>
        ) : null}

        <AuthFormFields
          confirmPassword={authForm.confirmPassword}
          displayName={authForm.displayName}
          email={authForm.email}
          isSignup={authForm.isSignup}
          onConfirmPasswordChange={authForm.setConfirmPassword}
          onDisplayNameChange={authForm.setDisplayName}
          onEmailChange={authForm.setEmail}
          onPasswordChange={authForm.setPassword}
          password={authForm.password}
          pending={authForm.pending}
        />

        <Button className="w-full" disabled={authForm.pending} type="submit">
          {authForm.pending ? <Loader2 className="animate-spin" /> : null}
          {authForm.isSignup ? "Sign up" : "Log in"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <EyebrowLink href={authForm.alternateHref}>
          {authForm.isSignup
            ? "Have an account? Log in"
            : "No account? Sign up"}
        </EyebrowLink>
      </div>
    </section>
  );
};
