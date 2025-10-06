import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api, type MemberLoginPayload, type MemberSessionResponse } from '../lib/api';

const LoginPage = () => {
  const [session, setSession] = useState<MemberSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<MemberLoginPayload>();

  const onSubmit = async (values: MemberLoginPayload) => {
    setError(null);
    try {
      const response = await api.login(values);
      setSession(response);
    } catch (err) {
      setSession(null);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <section className="card">
      <h1>Member Login</h1>
      <p className="helper">Enter your library card number and PIN to access your account.</p>

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <label>
          Library Card Number
          <input {...register('libraryCardNumber', { required: true })} placeholder="LIB-000000" />
        </label>
        <label>
          PIN
          <input type="password" {...register('pin', { required: true })} placeholder="••••" />
        </label>
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {session && (
        <div className="success">
          <p>Welcome back, {session.member.firstName}!</p>
          <p>Status: {session.member.status}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default LoginPage;
