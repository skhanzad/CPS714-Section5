'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Hold, HoldWithItem } from '@/types/hold';

export default function MyReservationsPage() {
  const [holds, setHolds] = useState<HoldWithItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionData = localStorage.getItem('library_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const libraryCardNumber = session.member?.libraryCardNumber;
        if (libraryCardNumber) {
          fetchHolds(libraryCardNumber);
        } else {
          setError('No member information found. Please log in again.');
          setLoading(false);
        }
      } catch (err) {
        setError('Invalid session. Please log in again.');
        setLoading(false);
      }
    } else {
      setError('Please log in to view your reservations.');
      setLoading(false);
    }
  }, []);

  const fetchHolds = async (libraryCardNumber: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/holds?libraryCardNumber=${libraryCardNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reservations');
      }

      const holdsArray = Array.isArray(data) ? data : [];

      const activeHolds = holdsArray.filter(
        (hold: Hold) => hold.status === 'active' || hold.status === 'ready'
      );

      const holdsWithItems = await Promise.all(
        activeHolds.map(async (hold: Hold) => {
          try {
            const itemResponse = await fetch(`/api/items/${hold.itemId}`);
            const itemData = await itemResponse.json();
            if (itemResponse.ok) {
              return { ...hold, itemDetails: itemData };
            }
            return hold;
          } catch {
            return hold;
          }
        })
      );

      setHolds(holdsWithItems);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservations');
      setHolds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelHold = async (holdId: string) => {
    if (!confirm('Are you sure you want to cancel this hold?')) {
      return;
    }

    try {
      const response = await fetch(`/api/holds/${holdId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel hold');
      }

      const sessionData = localStorage.getItem('library_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        const libraryCardNumber = session.member?.libraryCardNumber;
        if (libraryCardNumber) {
          fetchHolds(libraryCardNumber);
        }
      }
    } catch (err) {
      setError('Failed to cancel hold');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Reservations</h1>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
              {error}
              {error.includes('log in') && (
                <div className="mt-2">
                  <Link href="/login" className="text-red-900 font-medium hover:underline">
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-center py-8">Loading your reservations...</p>
          </div>
        ) : !error && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {holds.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You have no active reservations.</p>
                <Link 
                  href="/holds/place" 
                  className="button primary"
                >
                  Place a Hold
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Active Holds ({holds.length})
                </h2>
                {holds.map((hold) => (
                  <div
                    key={hold.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {hold.itemDetails?.title || 'Loading...'}
                        </h3>
                        {hold.itemDetails && (
                          <p className="text-sm text-gray-600">
                            by {hold.itemDetails.author}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          hold.status
                        )}`}
                      >
                        {hold.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {hold.status === 'active' && (
                        <p className="font-medium text-blue-600">
                          Position in queue: #{hold.position}
                        </p>
                      )}
                      {hold.status === 'ready' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="font-medium text-green-800 mb-1">
                            ✓ Your item is ready for pickup!
                          </p>
                          {hold.expiresAt && (
                            <p className="text-sm text-green-700">
                              Pick up by: {new Date(hold.expiresAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                      <p>
                        Placed on: {new Date(hold.placedAt).toLocaleDateString()} at{' '}
                        {new Date(hold.placedAt).toLocaleTimeString()}
                      </p>
                      {hold.readyAt && (
                        <p>
                          Ready since: {new Date(hold.readyAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {hold.status === 'active' && (
                      <button
                        onClick={() => handleCancelHold(hold.id)}
                        className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Cancel Hold
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
