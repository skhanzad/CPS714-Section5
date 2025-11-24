import { LibraryItem, SearchFilters } from '../types';

/**
 * Filters library items based on search filters
 * @param items - Array of library items to filter
 * @param filters - Search filters object containing searchTerm, format, genre, and availability
 * @returns Filtered array of library items
 */
export function filterLibraryItems(items: LibraryItem[], filters: SearchFilters): LibraryItem[] {
  return items.filter(item => {
    // Search term matching (case-insensitive)
    const matchesSearch = filters.searchTerm === '' || 
      item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.genre.toLowerCase().includes(filters.searchTerm.toLowerCase());

    // Format matching
    const matchesFormat = filters.format === '' || item.format === filters.format;

    // Genre matching
    const matchesGenre = filters.genre === '' || item.genre === filters.genre;

    // Availability matching
    const matchesAvailability = filters.availability === '' || item.status === filters.availability;

    return matchesSearch && matchesFormat && matchesGenre && matchesAvailability;
  });
}

