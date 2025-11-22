import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/hold-shelf/route';
import { db } from '@/lib/firebase';

vi.mock('@/lib/firebase', () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe('Hold Shelf API - POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if itemId is missing', async () => {
    const request = {
      json: async () => ({}),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Item ID is required');
  });

  it('should return 404 if item does not exist', async () => {
    const mockItemRef = {
      get: vi.fn().mockResolvedValue({ exists: false }),
    };

    const mockCollection = vi.fn().mockReturnValue({
      doc: vi.fn().mockReturnValue(mockItemRef),
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as any);

    const request = {
      json: async () => ({ itemId: 'item123' }),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Item not found');
  });

  it('should return 404 if no active holds for item', async () => {
    const mockItemRef = {
      get: vi.fn().mockResolvedValue({
        exists: true,
        data: () => ({ title: 'Test Book' }),
      }),
    };

    const mockReservationsQuery = {
      get: vi.fn().mockResolvedValue({ empty: true }),
    };

    const mockCollection = vi.fn((collectionName: string) => {
      if (collectionName === 'items') {
        return {
          doc: vi.fn().mockReturnValue(mockItemRef),
        };
      }
      if (collectionName === 'reservations') {
        return {
          where: vi.fn().mockReturnThis(),
          orderBy: vi.fn().mockReturnValue(mockReservationsQuery),
        };
      }
      return {};
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as any);

    const request = {
      json: async () => ({ itemId: 'item123' }),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('No active holds for this item');
  });
});

describe('Hold Shelf API - GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all hold shelf items', async () => {
    const mockHoldShelfItems = [
      { id: 'hold1', itemTitle: 'Book 1', libraryCardNumber: 'LIB001' },
      { id: 'hold2', itemTitle: 'Book 2', libraryCardNumber: 'LIB002' },
    ];

    const mockQuery = {
      get: vi.fn().mockResolvedValue({
        docs: mockHoldShelfItems.map(item => ({
          id: item.id,
          data: () => ({ itemTitle: item.itemTitle, libraryCardNumber: item.libraryCardNumber }),
        })),
      }),
    };

    const mockCollection = vi.fn().mockReturnValue({
      orderBy: vi.fn().mockReturnValue(mockQuery),
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as any);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as any;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
  });
});
