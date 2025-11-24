import React from 'react';
import { LibraryItem } from '../types';
import { Book, Headphones, Film, BookOpen, MapPin, Calendar } from 'lucide-react';

interface BookCardProps {
  item: LibraryItem;
  onItemClick: (item: LibraryItem) => void;
}

const BookCard: React.FC<BookCardProps> = ({ item, onItemClick }) => {
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'book': return <Book className="h-4 w-4" />;
      case 'audiobook': return <Headphones className="h-4 w-4" />;
      case 'dvd': return <Film className="h-4 w-4" />;
      case 'magazine': return <BookOpen className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'available': { color: 'bg-green-100 text-green-800', text: 'Available' },
      'checked-out': { color: 'bg-red-100 text-red-800', text: 'Checked Out' },
      'on-hold': { color: 'bg-yellow-100 text-yellow-800', text: 'On Hold' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
      onClick={() => onItemClick(item)}
    >
      <div className="flex h-48 bg-gradient-to-br from-library-primary to-library-secondary relative">
        {item.coverImage ? (
          <img 
            src={item.coverImage} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              {getFormatIcon(item.format)}
              <div className="text-sm mt-2 font-medium">{item.format.toUpperCase()}</div>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          {getStatusBadge(item.status)}
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {getFormatIcon(item.format)}
          <span>{item.format}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-library-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">by {item.author}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(item.publishedDate).getFullYear()}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            {item.genre}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            {item.language}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default BookCard;