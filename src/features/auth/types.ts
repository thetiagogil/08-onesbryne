export type AuthMode = "login" | "signup";

export type AuthFormProps = {
  initialError?: string | null;
  mode: AuthMode;
  next?: string;
};
