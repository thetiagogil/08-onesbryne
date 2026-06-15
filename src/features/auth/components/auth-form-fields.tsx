import { minimumPasswordLength } from "@/features/auth/lib/auth-validation";
import { FormField } from "@/shared/components/form-field";
import { Input } from "@/shared/components/ui/input";

type AuthFormFieldsProps = {
  confirmPassword: string;
  displayName: string;
  email: string;
  isSignup: boolean;
  onConfirmPasswordChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  password: string;
  pending: boolean;
};

export function AuthFormFields({
  confirmPassword,
  displayName,
  email,
  isSignup,
  onConfirmPasswordChange,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  password,
  pending,
}: AuthFormFieldsProps) {
  return (
    <>
      {isSignup ? (
        <FormField htmlFor="displayName" label="Name" required>
          <Input
            autoComplete="name"
            disabled={pending}
            id="displayName"
            maxLength={80}
            onChange={(event) => onDisplayNameChange(event.target.value)}
            required
            type="text"
            value={displayName}
          />
        </FormField>
      ) : null}

      <FormField htmlFor="email" label="Email" required>
        <Input
          autoComplete="email"
          disabled={pending}
          id="email"
          onChange={(event) => onEmailChange(event.target.value)}
          required
          type="email"
          value={email}
        />
      </FormField>

      <FormField htmlFor="password" label="Password" required>
        <Input
          autoComplete={isSignup ? "new-password" : "current-password"}
          disabled={pending}
          id="password"
          minLength={minimumPasswordLength}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
          type="password"
          value={password}
        />
      </FormField>

      {isSignup ? (
        <FormField htmlFor="confirmPassword" label="Confirm password" required>
          <Input
            autoComplete="new-password"
            disabled={pending}
            id="confirmPassword"
            minLength={minimumPasswordLength}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            required
            type="password"
            value={confirmPassword}
          />
        </FormField>
      ) : null}
    </>
  );
}
