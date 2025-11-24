import React from 'react';
import { Search } from 'lucide-react';

//Ron: typescript props which the code will recieve from parent component, Catalog
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultsCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, resultsCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/*Ron: renders the search icon from lucide-react */}
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-library-primary focus:border-transparent"
            placeholder="Search by title, author, or genre..."
            //Ron: controlled input whatever search term is in parent 
            value={searchTerm}
            //Ron: uses the react onchange function for the search input is changed it calls the parent onSearchChange() passed down from Catalog  
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Found <span className="font-semibold text-library-primary">{resultsCount}</span> items
        </p>
        <div className="text-xs text-gray-500">
          Try searching for "fantasy", "available", or author names
        </div>
      </div>
    </div>
  );
};

export default SearchBar;