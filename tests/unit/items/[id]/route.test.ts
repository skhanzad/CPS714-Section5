// Section 5, Team 3
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from '@/app/api/items/[id]/route';
import { db } from '@/lib/firebase';
import { NextRequest } from 'next/server';

vi.mock('@/lib/firebase', () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe('Items [id] - GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 if item not found', async () => {
    const mockItemRef = {
      get: vi.fn().mockResolvedValue({ exists: false }),
    };

    const mockCollection = vi.fn().mockReturnValue({
      doc: vi.fn().mockReturnValue(mockItemRef),
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as unknown as typeof db.collection);

    const request = {} as unknown as NextRequest;
    const params = Promise.resolve({ id: 'item123' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Item not found');
  });

  it('returns item if exists', async () => {
    const mockItemData = {
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
    };

    const mockItemRef = {
      get: vi.fn().mockResolvedValue({
        exists: true,
        id: 'item123',
        data: () => mockItemData,
      }),
    };

    const mockCollection = vi.fn().mockReturnValue({
      doc: vi.fn().mockReturnValue(mockItemRef),
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as unknown as typeof db.collection);

    const request = {} as unknown as NextRequest;
    const params = Promise.resolve({ id: 'item123' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('item123');
    expect(data.title).toBe('Test Book');
  });
});
