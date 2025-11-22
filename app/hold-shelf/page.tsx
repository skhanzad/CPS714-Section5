'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { LibraryItem } from '@/types/item';
import type { HoldShelfItem } from '@/types/holdShelf';

export default function HoldShelfPage() {
  const [holdShelfItems, setHoldShelfItems] = useState<HoldShelfItem[]>([]);
  const [availableItems, setAvailableItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const shelfResponse = await fetch('/api/hold-shelf');
      const shelfData = await shelfResponse.json();
      
      if (!shelfResponse.ok) {
        throw new Error(shelfData.error || 'Failed to fetch hold shelf items');
      }
      
      if (Array.isArray(shelfData)) {
        setHoldShelfItems(shelfData);
      } else {
        setHoldShelfItems([]);
      }

      const itemsResponse = await fetch('/api/items');
      const itemsData = await itemsResponse.json();
      
      if (!itemsResponse.ok) {
        throw new Error(itemsData.error || 'Failed to fetch items');
      }
      
      if (Array.isArray(itemsData)) {
        setAvailableItems(itemsData);
      } else {
        setAvailableItems([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setHoldShelfItems([]);
      setAvailableItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOnShelf = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedItem) {
      setError('Please select an item');
      return;
    }

    try {
      const response = await fetch('/api/hold-shelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: selectedItem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place item on hold shelf');
      }

      setMessage(data.message);
      setSelectedItem('');
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCheckout = async (holdShelfItem: HoldShelfItem) => {
    if (!confirm(`Check out "${holdShelfItem.itemTitle}" to ${holdShelfItem.memberName}?`)) {
      return;
    }

    try {
      await fetch(`/api/holds/${holdShelfItem.holdId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'fulfilled',
        }),
      });

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      await fetch(`/api/items/${holdShelfItem.itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCheckedOut: true,
          currentBorrowerId: holdShelfItem.libraryCardNumber,
          dueDate: dueDate.toISOString(),
        }),
      });

      setMessage(`Item checked out successfully to ${holdShelfItem.memberName}`);
      fetchData();
    } catch (err) {
      setError('Failed to check out item');
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hold Shelf Management</h1>

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

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Manually Place Item on Hold Shelf
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Use this to manually place an item on hold shelf. For regular returns, use the{' '}
            <Link href="/returns" className="text-blue-600 hover:underline font-medium">
              Returns page
            </Link>{' '}
            which automatically handles items with or without holds.
          </p>
          <form onSubmit={handlePlaceOnShelf} className="flex gap-2">
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            >
              <option value="">Select a returned item...</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} by {item.author}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="button primary"
            >
              Place on Shelf
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Items on Hold Shelf ({holdShelfItems.length})
          </h2>

          {loading ? (
            <p className="text-gray-600 text-center py-8">Loading...</p>
          ) : holdShelfItems.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No items currently on the hold shelf.
            </p>
          ) : (
            <div className="space-y-4">
              {holdShelfItems.map((item) => {
                const daysLeft = getDaysUntilExpiry(item.expiresAt);
                const expired = isExpired(item.expiresAt);

                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 ${
                      expired ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.itemTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">For:</span> {item.memberName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Library Card: {item.libraryCardNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        {expired ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            EXPIRED
                          </span>
                        ) : daysLeft <= 2 ? (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Placed on Shelf</p>
                        <p className="font-medium">
                          {new Date(item.placedOnShelfAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expires</p>
                        <p className="font-medium">
                          {new Date(item.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckout(item)}
                      className="button primary"
                      style={{ width: '100%' }}
                    >
                      Check Out to Member
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
