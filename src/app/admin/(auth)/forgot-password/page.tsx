import type { Metadata } from 'next';
import ForgotForm from './ForgotForm';

export const metadata: Metadata = { title: 'Reset password' };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-xl font-extrabold text-slate-900">Reset your password</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">Enter your admin email and we&apos;ll send you a link to set a new password.</p>
      <ForgotForm />
    </>
  );
}
