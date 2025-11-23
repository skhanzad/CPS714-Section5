import { useState } from 'react';
import { api, type MemberLoanResponse, type MemberFineResponse } from '../lib/api';

const MyAccountPage = () => {
  const [libraryCardNumber, setLibraryCardNumber] = useState('');
  const [loans, setLoans] = useState<MemberLoanResponse[]>([]);
  const [fines, setFines] = useState<MemberFineResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!libraryCardNumber.trim()) {
      setError('Please enter your library card number');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const [loansData, finesData] = await Promise.all([
        api.getMemberLoans(libraryCardNumber.trim()),
        api.getMemberFines(libraryCardNumber.trim())
      ]);
      setLoans(loansData);
      setFines(finesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch account information');
      setLoans([]);
      setFines([]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-out':
        return '#0d47a1';
      case 'overdue':
        return '#b91c1c';
      case 'returned':
        return '#047857';
      default:
        return '#475569';
    }
  };

  const totalFines = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const totalPotentialFees = loans
    .filter(loan => loan.potentialLateFee && loan.potentialLateFee > 0)
    .reduce((sum, loan) => sum + (loan.potentialLateFee || 0), 0);

  return (
    <section className="card">
      <h1>My Library Account</h1>
      <p className="helper">Enter your library card number to view your loans and fines.</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={libraryCardNumber}
          onChange={(e) => setLibraryCardNumber(e.target.value)}
          placeholder="Library Card Number (e.g., LIB-12345678)"
          style={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleSearch();
            }
          }}
        />
        <button className="button primary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {hasSearched && !loading && !error && (
        <>
          {/* Summary Section */}
          <div style={{ 
            background: '#f1f5f9', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem' 
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Account Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div>
                <strong>Active Loans:</strong> {loans.filter(l => l.status !== 'returned').length}
              </div>
              <div>
                <strong>Total Fines:</strong> ${totalFines.toFixed(2)}
              </div>
              {totalPotentialFees > 0 && (
                <div style={{ gridColumn: '1 / -1', color: '#b91c1c' }}>
                  <strong>Potential Late Fees (if returned today):</strong> ${totalPotentialFees.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Fines Section */}
          {fines.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Outstanding Fines</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {fines.map((fine) => (
                  <div
                    key={fine.id}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '1rem',
                      background: fine.status === 'pending' ? '#fef2f2' : '#f0fdf4'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                          Fine Amount: ${fine.amount.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                          Status: <span style={{ 
                            color: fine.status === 'pending' ? '#b91c1c' : '#047857',
                            fontWeight: 600
                          }}>
                            {fine.status === 'pending' ? 'Pending Payment' : 'Paid'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>
                          Calculated: {formatDate(fine.calculatedDate)}
                          {fine.paidDate && ` • Paid: ${formatDate(fine.paidDate)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loans Section */}
          {loans.length > 0 ? (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Loan History</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {loans.map((loan) => {
                  const daysUntilDue = getDaysUntilDue(loan.dueDate);
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;

                  return (
                    <div
                      key={loan.id}
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '1rem',
                        background: isOverdue ? '#fef2f2' : isDueSoon ? '#fffbeb' : 'white'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                            {loan.item?.title || `Item ${loan.itemId}`}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
                            Type: {loan.item?.itemType || 'Unknown'} • 
                            Status: <span style={{ 
                              color: getStatusColor(loan.status),
                              fontWeight: 600
                            }}>
                              {loan.status === 'checked-out' ? 'Checked Out' : 
                               loan.status === 'overdue' ? 'Overdue' : 'Returned'}
                            </span>
                          </div>
                        </div>
                        {loan.potentialLateFee && loan.potentialLateFee > 0 && (
                          <div style={{ 
                            background: '#fee2e2', 
                            color: '#991b1b', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}>
                            ${loan.potentialLateFee.toFixed(2)} late fee
                          </div>
                        )}
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '0.5rem', 
                        fontSize: '0.875rem',
                        color: '#475569',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid #e2e8f0'
                      }}>
                        <div>
                          <strong>Checked Out:</strong> {formatDate(loan.checkoutDate)}
                        </div>
                        <div>
                          <strong>Due Date:</strong> {formatDate(loan.dueDate)}
                        </div>
                        {loan.returnDate && (
                          <div>
                            <strong>Returned:</strong> {formatDate(loan.returnDate)}
                          </div>
                        )}
                        {!loan.returnDate && (
                          <div style={{ 
                            color: isOverdue ? '#b91c1c' : isDueSoon ? '#d97706' : '#047857',
                            fontWeight: 600
                          }}>
                            {isOverdue 
                              ? `${Math.abs(daysUntilDue)} days overdue`
                              : isDueSoon
                              ? `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`
                              : `${daysUntilDue} days remaining`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
              <p>No loans found for this library card number.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MyAccountPage;

