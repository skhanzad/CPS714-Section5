import { useState, useEffect } from 'react';
import { api, type ItemResponse, type LoanWithItemResponse, type CheckinResponse, type MemberResponse } from '../lib/api';

// Default test admin key for testing purposes
const DEFAULT_ADMIN_KEY = 'test-admin-key-123';

const StaffCheckoutPage = () => {
  const [isStaff, setIsStaff] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [itemId, setItemId] = useState('');
  const [loanId, setLoanId] = useState('');
  const [checkinItemId, setCheckinItemId] = useState('');
  const [availableItems, setAvailableItems] = useState<ItemResponse[]>([]);
  const [activeLoans, setActiveLoans] = useState<LoanWithItemResponse[]>([]);
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'checkout' | 'checkin'>('checkout');

  useEffect(() => {
    if (isStaff) {
      void loadData();
    }
  }, [isStaff]);

  const loadData = async () => {
    if (!isStaff) return;
    setLoading(true);
    setError(null);
    try {
      const [items, loans, membersData] = await Promise.all([
        api.getAllItems(DEFAULT_ADMIN_KEY),
        api.getActiveLoans(DEFAULT_ADMIN_KEY),
        api.getMembers(DEFAULT_ADMIN_KEY)
      ]);
      setAvailableItems(items.filter(item => item.isAvailable));
      setActiveLoans(loans);
      setMembers(membersData.members);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const trimmedMemberId = memberId.trim();
    const trimmedItemId = itemId.trim();
    
    if (!trimmedMemberId || !trimmedItemId) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const loan = await api.checkoutItem(DEFAULT_ADMIN_KEY, trimmedMemberId, trimmedItemId);
      setSuccess(`Item checked out successfully! Due date: ${new Date(loan.dueDate).toLocaleDateString()}`);
      setItemId('');
      setMemberId('');
      void loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    const trimmedLoanId = loanId.trim();
    const trimmedItemId = checkinItemId.trim();
    
    if (!trimmedLoanId || !trimmedItemId) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result: CheckinResponse = await api.checkinItem(DEFAULT_ADMIN_KEY, trimmedLoanId, trimmedItemId);
      const fineMsg = result.fine 
        ? ` Late fee of $${result.fine.amount.toFixed(2)} has been applied.`
        : '';
      setSuccess(`Item checked in successfully!${fineMsg}`);
      setLoanId('');
      setCheckinItemId('');
      void loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!isStaff) {
    return (
      <section className="card" style={{ maxWidth: '600px' }}>
        <h1>Staff Checkout/Check-in</h1>
        <p className="helper">This page is for library staff to process checkouts and check-ins.</p>
        <div style={{ marginTop: '2rem' }}>
          <button
            className="button primary"
            onClick={() => setIsStaff(true)}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            I am a staff member
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Staff Checkout/Check-in</h1>
        <button
          className="button"
          onClick={() => setIsStaff(false)}
          style={{ fontSize: '0.875rem' }}
        >
          Exit Staff Mode
        </button>
      </div>

      {isStaff && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <button
              className={`button ${activeTab === 'checkout' ? 'primary' : ''}`}
              onClick={() => setActiveTab('checkout')}
              style={{ border: 'none', borderRadius: '8px 8px 0 0' }}
            >
              Check Out
            </button>
            <button
              className={`button ${activeTab === 'checkin' ? 'primary' : ''}`}
              onClick={() => setActiveTab('checkin')}
              style={{ border: 'none', borderRadius: '8px 8px 0 0' }}
            >
              Check In
            </button>
          </div>

          {activeTab === 'checkout' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Check Out Item</h2>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <label>
                  Library Card Number
                  <select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">Select a member...</option>
                    {members.map((member) => (
                      <option key={member.libraryCardNumber} value={member.libraryCardNumber}>
                        {member.libraryCardNumber} - {member.firstName} {member.lastName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Item ID
                  <input
                    type="text"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    placeholder="Item ID"
                  />
                </label>
                <button
                  className="button primary"
                  onClick={handleCheckout}
                  disabled={loading || !memberId || !itemId}
                >
                  {loading ? 'Processing...' : 'Check Out'}
                </button>
              </div>

              <div>
                <h3>Available Items</h3>
                {loading ? (
                  <p>Loading...</p>
                ) : availableItems.length > 0 ? (
                  <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {availableItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '0.75rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          background: itemId === item.id ? '#e0f2fe' : 'white'
                        }}
                        onClick={() => setItemId(item.id)}
                      >
                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                          ID: {item.id} • Type: {item.itemType}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#475569' }}>No available items</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'checkin' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Check In Item</h2>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <label>
                  Loan ID
                  <input
                    type="text"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                    placeholder="LOAN-..."
                  />
                </label>
                <label>
                  Item ID
                  <input
                    type="text"
                    value={checkinItemId}
                    onChange={(e) => setCheckinItemId(e.target.value)}
                    placeholder="Item ID"
                  />
                </label>
                <button
                  className="button primary"
                  onClick={handleCheckin}
                  disabled={loading || !loanId || !checkinItemId}
                >
                  {loading ? 'Processing...' : 'Check In'}
                </button>
              </div>

              <div>
                <h3>Active Loans</h3>
                {loading ? (
                  <p>Loading...</p>
                ) : activeLoans.length > 0 ? (
                  <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {activeLoans.map((loan) => {
                      const daysUntilDue = getDaysUntilDue(loan.dueDate);
                      const isOverdue = daysUntilDue < 0;
                      return (
                        <div
                          key={loan.id}
                          style={{
                            padding: '0.75rem',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: loanId === loan.id ? '#e0f2fe' : isOverdue ? '#fef2f2' : 'white'
                          }}
                          onClick={() => {
                            setLoanId(loan.id);
                            setCheckinItemId(loan.itemId);
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>
                            {loan.item?.title || `Item ${loan.itemId}`}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                            Loan ID: {loan.id} • Member: {loan.memberId}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: isOverdue ? '#b91c1c' : '#475569' }}>
                            Due: {formatDate(loan.dueDate)} • {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#475569' }}>No active loans</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </section>
  );
};

export default StaffCheckoutPage;

