import { describe, it, expect } from 'vitest';
import { filterLibraryItems } from './filterLibraryItems';
import { LibraryItem, SearchFilters } from '../types';

// Test data
const mockItems: LibraryItem[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Literature',
    format: 'book',
    status: 'available',
    description: 'A classic novel',
    publishedDate: '1925-04-10',
    location: 'Fiction Section A',
    isbn: '9780743273565',
    pages: 180,
    language: 'English',
    coverImage: 'https://example.com/image1.jpg'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Literature',
    format: 'book',
    status: 'checked-out',
    description: 'A gripping tale',
    publishedDate: '1960-07-11',
    location: 'Fiction Section B',
    isbn: '9780061120084',
    pages: 281,
    language: 'English',
    coverImage: 'https://example.com/image2.jpg'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian Fiction',
    format: 'book',
    status: 'available',
    description: 'A dystopian novel',
    publishedDate: '1949-06-08',
    location: 'Fiction Section C',
    isbn: '9780451524935',
    pages: 328,
    language: 'English',
    coverImage: 'https://example.com/image3.jpg'
  },
  {
    id: '4',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    format: 'audiobook',
    status: 'available',
    description: 'An epic fantasy',
    publishedDate: '1954-07-29',
    location: 'Audiobook Section',
    isbn: '9780395489314',
    pages: 423,
    language: 'English'
  },
  {
    id: '5',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    format: 'book',
    status: 'on-hold',
    description: 'A science fiction novel',
    publishedDate: '1965-08-01',
    location: 'Sci-Fi Section A',
    isbn: '9780441172719',
    pages: 412,
    language: 'English',
    coverImage: 'https://example.com/image5.jpg'
  }
];

describe('filterLibraryItems', () => {
  describe('Search Term Filtering', () => {
    it('should return all items when search term is empty', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(5);
      expect(result).toEqual(mockItems);
    });

    it('should filter by title (case-insensitive)', () => {
      const filters: SearchFilters = {
        searchTerm: 'gatsby',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Great Gatsby');
    });

    it('should filter by title with uppercase search term', () => {
      const filters: SearchFilters = {
        searchTerm: 'GATSBY',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Great Gatsby');
    });

    it('should filter by author (case-insensitive)', () => {
      const filters: SearchFilters = {
        searchTerm: 'orwell',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].author).toBe('George Orwell');
    });

    it('should filter by genre (case-insensitive)', () => {
      const filters: SearchFilters = {
        searchTerm: 'classic',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(2);
      expect(result.map(item => item.title)).toContain('The Great Gatsby');
      expect(result.map(item => item.title)).toContain('To Kill a Mockingbird');
    });

    it('should match partial search terms in title', () => {
      const filters: SearchFilters = {
        searchTerm: 'kill',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('To Kill a Mockingbird');
    });

    it('should match partial search terms in author name', () => {
      const filters: SearchFilters = {
        searchTerm: 'Tolkien',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].author).toBe('J.R.R. Tolkien');
    });

    it('should return empty array when no items match search term', () => {
      const filters: SearchFilters = {
        searchTerm: 'nonexistent',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Format Filtering', () => {
    it('should return all items when format filter is empty', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter by book format', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: 'book',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(4);
      expect(result.every(item => item.format === 'book')).toBe(true);
    });

    it('should filter by audiobook format', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: 'audiobook',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].format).toBe('audiobook');
      expect(result[0].title).toBe('The Lord of the Rings');
    });

    it('should return empty array when no items match format', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: 'dvd',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Genre Filtering', () => {
    it('should return all items when genre filter is empty', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter by exact genre match', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: 'Classic Literature',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.genre === 'Classic Literature')).toBe(true);
    });

    it('should filter by Fantasy genre', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: 'Fantasy',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].genre).toBe('Fantasy');
    });

    it('should return empty array when no items match genre', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: 'Mystery',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Availability Filtering', () => {
    it('should return all items when availability filter is empty', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(5);
    });

    it('should filter by available status', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: 'available'
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(3);
      expect(result.every(item => item.status === 'available')).toBe(true);
    });

    it('should filter by checked-out status', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: 'checked-out'
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('checked-out');
      expect(result[0].title).toBe('To Kill a Mockingbird');
    });

    it('should filter by on-hold status', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: 'on-hold'
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('on-hold');
      expect(result[0].title).toBe('Dune');
    });

    it('should return empty array when no items match availability', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: 'reserved'
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Combined Filters', () => {
    it('should filter by search term and format', () => {
      const filters: SearchFilters = {
        searchTerm: 'tolkien',
        format: 'audiobook',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Lord of the Rings');
      expect(result[0].format).toBe('audiobook');
    });

    it('should filter by format and genre', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: 'book',
        genre: 'Classic Literature',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(2);
      expect(result.every(item => item.format === 'book' && item.genre === 'Classic Literature')).toBe(true);
    });

    it('should filter by genre and availability', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: 'Classic Literature',
        availability: 'available'
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Great Gatsby');
      expect(result[0].genre).toBe('Classic Literature');
      expect(result[0].status).toBe('available');
    });

    it('should filter by all filters combined', () => {
      const filters: SearchFilters = {
        searchTerm: 'gatsby',
        format: 'book',
        genre: 'Classic Literature',
        availability: 'available'
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Great Gatsby');
    });

    it('should return empty array when combined filters match no items', () => {
      const filters: SearchFilters = {
        searchTerm: 'gatsby',
        format: 'audiobook',
        genre: 'Classic Literature',
        availability: 'available'
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const filters: SearchFilters = {
        searchTerm: '',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems([], filters);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle special characters in search term', () => {
      const filters: SearchFilters = {
        searchTerm: '1984',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('1984');
    });

    it('should handle whitespace in search term (searches for exact substring)', () => {
      const filters: SearchFilters = {
        searchTerm: 'gatsby',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Great Gatsby');
    });

    it('should handle partial word matches in titles', () => {
      const filters: SearchFilters = {
        searchTerm: 'lord',
        format: '',
        genre: '',
        availability: ''
      };
      const result = filterLibraryItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Lord of the Rings');
    });
  });
});

