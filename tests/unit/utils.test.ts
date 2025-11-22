import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getQueuePosition } from '@/lib/utils';
import { db } from '@/lib/firebase';

vi.mock('@/lib/firebase', () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe('Utils - getQueuePosition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct queue position', async () => {
    const mockHolds = [
      { id: 'hold1', data: () => ({ itemId: 'item123', status: 'active', placedAt: new Date('2024-01-01') }) },
      { id: 'hold2', data: () => ({ itemId: 'item123', status: 'active', placedAt: new Date('2024-01-02') }) },
      { id: 'hold3', data: () => ({ itemId: 'item123', status: 'active', placedAt: new Date('2024-01-03') }) },
    ];

    const mockQuery = {
      get: vi.fn().mockResolvedValue({
        docs: mockHolds,
      }),
    };

    const mockCollection = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnValue(mockQuery),
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as unknown as typeof db.collection);

    const position = await getQueuePosition('item123', 'hold2');

    expect(position).toBe(2);
    expect(mockCollection).toHaveBeenCalledWith('holds');
  });
});


