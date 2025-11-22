'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Application } from '@/types/application';

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/applications');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch applications');
      }

      setApplications(data.applications || []);
      setShowModal(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    if (!confirm('Are you sure you want to approve this application?')) {
      return;
    }

    setApproving(applicationId);
    setError('');
    try {
      const response = await fetch(`/api/applications/${applicationId}/approve`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve application');
      }

      await fetchApplications();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to approve application');
    } finally {
      setApproving(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setApplications([]);
    setError('');
  };

  return (
    <>
      <section className="card">
        <h1>Welcome to LibraLite</h1>
        <p>Manage your library membership online with our modern portal.</p>
        <div className="actions">
          <Link href="/apply" className="button primary">Apply for a Card</Link>
          <Link href="/login" className="button">Member Login</Link>
          <Link href="/hold-shelf" className="button">Hold Shelf</Link>
          <Link href="/returns" className="button">Process Returns</Link>
        </div>
        <p className="helper">
          Already applied? <Link href="/pending">Check your application status</Link>
        </p>
        
        <div className="mt-6 border-t pt-6">
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="button primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {loading ? 'Loading...' : 'View All Applications'}
          </button>
          {error && !showModal && (
            <div className="text-red-600 text-sm mt-2">{error}</div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Library Card Applications</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {applications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No applications found.</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className={`border rounded-lg p-4 ${
                        app.status === 'approved'
                          ? 'border-green-300 bg-green-50'
                          : app.status === 'pending'
                          ? 'border-yellow-300 bg-yellow-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {app.firstName} {app.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Email:</span> {app.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {app.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Address:</span> {app.address}
                          </p>
                          {app.libraryCardNumber && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Library Card Number:</span>{' '}
                              <span className="font-mono bg-white px-2 py-1 rounded">
                                {app.libraryCardNumber}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              app.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                          {app.status === 'pending' && (
                            <button
                              onClick={() => handleApprove(app.id)}
                              disabled={approving === app.id}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approving === app.id ? 'Approving...' : 'Approve'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3 pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Application ID</p>
                          <p className="font-mono text-xs">{app.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Applied On</p>
                          <p className="font-medium">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
