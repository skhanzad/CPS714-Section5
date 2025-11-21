'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api, type MemberApplicationPayload, type MemberApplicationResponse } from '@/lib/api';

export default function ApplyPage() {
  const [submission, setSubmission] = useState<MemberApplicationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<MemberApplicationPayload>();

  const onSubmit = async (values: MemberApplicationPayload) => {
    setError(null);
    try {
      const response = await api.apply(values);
      setSubmission(response);
    } catch (err) {
      setSubmission(null);
      setError(err instanceof Error ? err.message : 'Unable to submit application');
    }
  };

  return (
    <section className="card">
      <h1>Library Card Application</h1>
      <p className="helper">Submit your details to apply. A librarian will review your application.</p>

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <label>
          First Name
          <input {...register('firstName', { required: true })} placeholder="Jane" />
        </label>
        <label>
          Last Name
          <input {...register('lastName', { required: true })} placeholder="Doe" />
        </label>
        <label>
          Email
          <input type="email" {...register('email', { required: true })} placeholder="jane.doe@example.com" />
        </label>
        <label>
          Phone Number
          <input {...register('phone', { required: true })} placeholder="555-123-4567" />
        </label>
        <label>
          Address
          <textarea rows={3} {...register('address', { required: true })} placeholder="742 Evergreen Terrace" />
        </label>
        <label>
          Choose a 4-digit PIN
          <input
            type="password"
            {...register('pin', { required: true, minLength: 4, maxLength: 6 })}
            placeholder="••••"
          />
        </label>
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {submission && (
        <div className="success">
          <p>Application received! Your reference ID is <strong>{submission.id}</strong>.</p>
          <p>We will email you once a librarian completes the review.</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}
