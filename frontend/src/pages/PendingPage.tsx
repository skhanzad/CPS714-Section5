import { useState } from 'react';
import { api, type MemberApplicationResponse } from '../lib/api';

const PendingPage = () => {
  const [applicationId, setApplicationId] = useState('');
  const [status, setStatus] = useState<MemberApplicationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = async () => {
    if (!applicationId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.checkStatus(applicationId.trim());
      setStatus(response);
    } catch (err) {
      setStatus(null);
      setError(err instanceof Error ? err.message : 'Unable to retrieve status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h1>Check Application Status</h1>
      <label>
        Application ID
        <input value={applicationId} onChange={(event) => setApplicationId(event.target.value)} placeholder="APP-XXXX" />
      </label>
      <button className="button primary" onClick={() => void handleCheckStatus()} disabled={loading || !applicationId}>
        {loading ? 'Checking...' : 'Check Status'}
      </button>

      {status && (
        <div className="success">
          <p>Status: {status.status}</p>
          {status.libraryCardNumber && <p>Library Card Number: {status.libraryCardNumber}</p>}
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default PendingPage;
