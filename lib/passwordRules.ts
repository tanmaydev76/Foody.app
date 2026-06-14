export interface PasswordCheck {
  label: string;
  pass: boolean;
}

export function getPasswordChecks(pw: string): PasswordCheck[] {
  return [
    { label: 'At least 8 characters',        pass: pw.length >= 8 },
    { label: 'One uppercase letter (A–Z)',    pass: /[A-Z]/.test(pw) },
    { label: 'One number (0–9)',              pass: /[0-9]/.test(pw) },
    { label: 'One special character (!@#…)', pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
  ];
}

export function isPasswordStrong(pw: string): boolean {
  return getPasswordChecks(pw).every((c) => c.pass);
}

export function passwordStrengthScore(pw: string): number {
  return getPasswordChecks(pw).filter((c) => c.pass).length;
}
