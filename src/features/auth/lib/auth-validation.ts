export const minimumPasswordLength = 8;

type ValidateAuthInputOptions = {
  confirmPassword: string;
  displayName: string;
  email: string;
  isSignup: boolean;
  password: string;
};

export function validateAuthInput({
  confirmPassword,
  displayName,
  email,
  isSignup,
  password,
}: ValidateAuthInputOptions) {
  if (isSignup && !displayName.trim()) {
    return "Name is required.";
  }

  if (!email) return "Email is required.";

  if (password.length < minimumPasswordLength) {
    return `Password must be at least ${minimumPasswordLength} characters.`;
  }

  if (isSignup && password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}
