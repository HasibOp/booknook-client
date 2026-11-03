export const PASSWORD_MIN_LENGTH = 6;

export const passwordRules = [
  { id: "upper", label: "One uppercase letter (A-Z)", test: (value: string) => /[A-Z]/.test(value) },
  { id: "lower", label: "One lowercase letter (a-z)", test: (value: string) => /[a-z]/.test(value) },
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (value: string) => value.length >= PASSWORD_MIN_LENGTH,
  },
];

export function validatePassword(value: string) {
  if (!/[A-Z]/.test(value)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(value)) return "Password must have a lowercase letter";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
  }
  return true;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
