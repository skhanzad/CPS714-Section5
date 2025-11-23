// Section 5, Team 3
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/items/route';
import { db } from '@/lib/firebase';
import { NextRequest } from 'next/server';

vi.mock('@/lib/firebase', () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe('Items - POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if title missing', async () => {
    const request = {
      json: async () => ({ author: 'Test Author' }),
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title and author are required');
  });

  it('returns 400 if author missing', async () => {
    const request = {
      json: async () => ({ title: 'Test Book' }),
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title and author are required');
  });

  it('creates item successfully', async () => {
    const mockItemRef = { id: 'item123' };
    const mockAdd = vi.fn().mockResolvedValue(mockItemRef);

    const mockCollection = vi.fn().mockReturnValue({
      add: mockAdd,
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as unknown as typeof db.collection);

    const request = {
      json: async () => ({
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
      }),
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('item123');
    expect(data.title).toBe('Test Book');
    expect(data.author).toBe('Test Author');
    expect(data.isbn).toBe('1234567890');
    expect(data.isCheckedOut).toBe(false);
  });
});

describe('Items - GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all items', async () => {
    const mockItems = [
      { id: 'item1', title: 'Book 1', author: 'Author 1' },
      { id: 'item2', title: 'Book 2', author: 'Author 2' },
    ];

    const mockQuery = {
      get: vi.fn().mockResolvedValue({
        docs: mockItems.map(item => ({
          id: item.id,
          data: () => ({ title: item.title, author: item.author }),
        })),
      }),
    };

    const mockCollection = vi.fn().mockReturnValue({
      orderBy: vi.fn().mockReturnValue(mockQuery),
    });

    vi.mocked(db.collection).mockImplementation(mockCollection as unknown as typeof db.collection);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as unknown as NextRequest;

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
  });
});
