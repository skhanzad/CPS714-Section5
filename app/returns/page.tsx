'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Item } from '@/types/item';

export default function ReturnsPage() {
  const [checkedOutItems, setCheckedOutItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCheckedOutItems();
  }, []);

  const fetchCheckedOutItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/items?isCheckedOut=true');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch checked out items');
      }
      
      if (Array.isArray(data)) {
        setCheckedOutItems(data);
      } else {
        setCheckedOutItems([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch checked out items');
      setCheckedOutItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (item: Item) => {
    if (!confirm(`Process return for "${item.title}"?`)) {
      return;
    }

    setProcessingId(item.id);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/items/${item.id}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process return');
      }

      setMessage(data.message);
      
      await fetchCheckedOutItems();
    } catch (err: any) {
      setError(err.message || 'Failed to process return');
    } finally {
      setProcessingId(null);
    }
  };

  const isOverdue = (dueDate?: { _seconds: number; _nanoseconds: number }) => {
    if (!dueDate) return false;
    const dueDateMs = dueDate._seconds * 1000;
    return new Date(dueDateMs) < new Date();
  };

  const getDaysUntilDue = (dueDate?: { _seconds: number; _nanoseconds: number }) => {
    if (!dueDate) return null;
    const dueDateMs = dueDate._seconds * 1000;
    const days = Math.ceil((dueDateMs - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Process Returns</h1>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Currently Checked Out Items ({checkedOutItems.length})
          </h2>

          {loading ? (
            <p className="text-gray-600 text-center py-8">Loading...</p>
          ) : checkedOutItems.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No items currently checked out.
            </p>
          ) : (
            <div className="space-y-4">
              {checkedOutItems.map((item) => {
                const overdue = isOverdue(item.dueDate);
                const daysUntilDue = getDaysUntilDue(item.dueDate);

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 ${
                      overdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          by {item.author}
                        </p>
                        {item.isbn && (
                          <p className="text-xs text-gray-500 mt-1">
                            ISBN: {item.isbn}
                          </p>
                        )}
                        {item.currentBorrowerId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Borrower: {item.currentBorrowerId}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {overdue ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            OVERDUE
                          </span>
                        ) : daysUntilDue !== null && daysUntilDue <= 3 ? (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Checked Out
                          </span>
                        )}
                      </div>
                    </div>

                    {item.dueDate && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Due Date:</span>{' '}
                          {new Date(item.dueDate._seconds * 1000).toLocaleDateString()} at{' '}
                          {new Date(item.dueDate._seconds * 1000).toLocaleTimeString()}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleReturn(item)}
                      disabled={processingId === item.id}
                      className="button primary disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ width: '100%' }}
                    >
                      {processingId === item.id ? 'Processing...' : 'Process Return'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
