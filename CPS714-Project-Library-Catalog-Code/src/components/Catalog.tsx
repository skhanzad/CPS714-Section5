import React, { useState, useMemo } from 'react';
import { LibraryItem, SearchFilters } from '../types';
import { mockLibraryItems } from '../data/mockData';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import BookCard from './BookCard';
import BookDetails from './BookDetails';

//Ron: creates a react state variable called filters also sets up the setFilters function defined later 
const Catalog: React.FC = () => {
  //Ron: uses the intial state it wants to follow the searchfilter type defined
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    format: '',
    genre: '',
    availability: ''
  });
  
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredItems = useMemo(() => {
    //Ron: return the mockLibrary array but use react filter() to iterate over it (For all items, include if X...Y= true)
    return mockLibraryItems.filter(item => { 

      //Ron: pertains to search bar only include this item if filters search term is equal to a value of the item in question
      const matchesSearch = filters.searchTerm === '' || 
        //includes used so the search can be anywhere in the string
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.genre.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesFormat = filters.format === '' || item.format === filters.format;
      const matchesGenre = filters.genre === '' || item.genre === filters.genre;
      const matchesAvailability = filters.availability === '' || item.status === filters.availability;

      return matchesSearch && matchesFormat && matchesGenre && matchesAvailability;
    });
  }, [filters]); //Ron: only run the code when filters object is changed

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-library-primary to-library-secondary text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-serif mb-2">Springfield Public Library</h1>
              <p className="text-library-accent text-lg">Digital Catalog & Search Engine</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Data Systems Team</div>
              <div className="text-xs opacity-75">LibraLite Project</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <SearchBar 
          //when refresh happens the value of the search bar stays the same 
          searchTerm={filters.searchTerm}
          //Ron: defines the setFilters function and sets it to the action to be used in the searchbar component
          onSearchChange={(term) => setFilters({...filters, searchTerm: term})}
          //Ron: since the usememo re-runs evertime the filter is changed, the count is auto updated
          resultsCount={filteredItems.length}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar 
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <BookCard 
                    key={item.id}
                    item={item}
                    onItemClick={setSelectedItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Details Modal */}
      <BookDetails 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default Catalog;