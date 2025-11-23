import { useState } from 'react';

const LateFeeCalculatorPage = () => {
  const [itemType, setItemType] = useState<'book' | 'dvd' | 'magazine' | 'other'>('book');
  const [checkoutDate, setCheckoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [hypotheticalReturnDate, setHypotheticalReturnDate] = useState('');
  const [result, setResult] = useState<{
    dueDate: string;
    daysOverdue: number;
    lateFee: number;
    isOverdue: boolean;
  } | null>(null);

  const calculateDueDate = (type: string, checkout: Date): Date => {
    const dueDate = new Date(checkout);
    switch (type) {
      case 'book':
        dueDate.setDate(dueDate.getDate() + 21); // 3 weeks
        break;
      case 'dvd':
        dueDate.setDate(dueDate.getDate() + 7); // 1 week
        break;
      case 'magazine':
        dueDate.setDate(dueDate.getDate() + 14); // 2 weeks
        break;
      default:
        dueDate.setDate(dueDate.getDate() + 14); // default 2 weeks
    }
    return dueDate;
  };

  const calculateLateFee = (dueDate: Date, returnDate: Date): number => {
    if (returnDate <= dueDate) {
      return 0;
    }
    const daysOverdue = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const feePerDay = 0.50; // $0.50 per day
    return Math.round(daysOverdue * feePerDay * 100) / 100;
  };

  const handleCalculate = () => {
    if (!checkoutDate) {
      alert('Please select a checkout date');
      return;
    }

    const checkout = new Date(checkoutDate);
    const dueDate = calculateDueDate(itemType, checkout);
    const returnDate = hypotheticalReturnDate 
      ? new Date(hypotheticalReturnDate)
      : new Date(); // Use today if no return date specified

    const daysOverdue = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = returnDate > dueDate;
    const lateFee = calculateLateFee(dueDate, returnDate);

    setResult({
      dueDate: dueDate.toISOString().split('T')[0],
      daysOverdue: isOverdue ? daysOverdue : 0,
      lateFee,
      isOverdue
    });
  };

  const getLoanPeriod = (type: string) => {
    switch (type) {
      case 'book':
        return '3 weeks (21 days)';
      case 'dvd':
        return '1 week (7 days)';
      case 'magazine':
        return '2 weeks (14 days)';
      default:
        return '2 weeks (14 days)';
    }
  };

  return (
    <section className="card" style={{ maxWidth: '600px' }}>
      <h1>Late Fee Calculator</h1>
      <p className="helper">Calculate what the late fee would be if you return an item on a specific date.</p>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        <label>
          Item Type
          <select value={itemType} onChange={(e) => setItemType(e.target.value as typeof itemType)}>
            <option value="book">Book (3 weeks)</option>
            <option value="dvd">DVD (1 week)</option>
            <option value="magazine">Magazine (2 weeks)</option>
            <option value="other">Other (2 weeks)</option>
          </select>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>
            Loan period: {getLoanPeriod(itemType)}
          </div>
        </label>

        <label>
          Checkout Date
          <input
            type="date"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </label>

        <label>
          Hypothetical Return Date (leave empty for today)
          <input
            type="date"
            value={hypotheticalReturnDate}
            onChange={(e) => setHypotheticalReturnDate(e.target.value)}
            min={checkoutDate}
          />
          <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>
            If left empty, will calculate based on today's date
          </div>
        </label>

        <button className="button primary" onClick={handleCalculate}>
          Calculate Late Fee
        </button>
      </div>

      {result && (
        <div style={{
          padding: '1.5rem',
          borderRadius: '8px',
          background: result.isOverdue ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${result.isOverdue ? '#fecaca' : '#bbf7d0'}`
        }}>
          <h3 style={{ marginTop: 0, color: result.isOverdue ? '#b91c1c' : '#047857' }}>
            {result.isOverdue ? 'Item Would Be Overdue' : 'Item Would Be Returned On Time'}
          </h3>
          
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            <div>
              <strong>Due Date:</strong> {new Date(result.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            {result.isOverdue ? (
              <>
                <div>
                  <strong>Days Overdue:</strong> {result.daysOverdue} day{result.daysOverdue !== 1 ? 's' : ''}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#b91c1c',
                  marginTop: '0.5rem'
                }}>
                  Late Fee: ${result.lateFee.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
                  Fee calculation: {result.daysOverdue} days × $0.50/day = ${result.lateFee.toFixed(2)}
                </div>
              </>
            ) : (
              <div style={{ color: '#047857', fontWeight: 600 }}>
                No late fee would be charged. Item is returned on time!
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f1f5f9',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#475569'
      }}>
        <h4 style={{ marginTop: 0 }}>Late Fee Policy</h4>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Late fee: $0.50 per day</li>
          <li>Fees are calculated from the day after the due date</li>
          <li>Fees are rounded to 2 decimal places</li>
        </ul>
      </div>
    </section>
  );
};

export default LateFeeCalculatorPage;

