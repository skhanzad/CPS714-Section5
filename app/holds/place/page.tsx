'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { LibraryItem } from '@/types/item';

export default function PlaceHoldPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [libraryCardNumber, setLibraryCardNumber] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionData = localStorage.getItem('library_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const member = session.member;
        if (member) {
          setLibraryCardNumber(member.libraryCardNumber || '');
          setMemberName(`${member.firstName || ''} ${member.lastName || ''}`.trim());
          setMemberEmail(member.email || '');
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      }
    }
    fetchCheckedOutItems();
  }, []);

  const fetchCheckedOutItems = async () => {
    try {
      const response = await fetch('/api/items?isCheckedOut=true');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch items');
      }
      
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
        setError('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to fetch items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceHold = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedItem || !libraryCardNumber || !memberName || !memberEmail) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/holds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: selectedItem,
          libraryCardNumber,
          memberName,
          memberEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place hold');
      }

      setMessage(`Hold placed successfully! You are position ${data.position} in the queue.`);
      setSelectedItem('');
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Place a Hold</h1>

          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handlePlaceHold} className="space-y-4">
            <div>
              <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="memberName"
                value={memberName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="memberEmail"
                value={memberEmail}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">
                Select Item
              </label>
              <select
                id="item"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              >
                <option value="">Choose an item...</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} by {item.author}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="button primary"
            >
              Place Hold
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading checked out items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-center">No checked out items available for holds at this time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Checked Out Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">by {item.author}</p>
                  {item.isbn && (
                    <p className="text-xs text-gray-500 mt-1">ISBN: {item.isbn}</p>
                  )}
                  {item.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(item.dueDate._seconds * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
