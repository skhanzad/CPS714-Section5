import React from 'react';
import { LibraryItem } from '../types';
import { X, Book, MapPin, Calendar, User, Tag, Clock } from 'lucide-react';

interface BookDetailsProps {
  item: LibraryItem | null;
  onClose: () => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ item, onClose }) => {
  if (!item) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'checked-out': return 'text-red-600 bg-red-100';
      case 'on-hold': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900 pr-8">{item.title}</h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {item.coverImage && (
              <div className="flex-shrink-0">
                <img 
                  src={item.coverImage} 
                  alt={item.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="h-5 w-5 text-library-primary" />
                  <div>
                    <div className="text-sm text-gray-500">Author</div>
                    <div className="font-medium">{item.author}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Tag className="h-5 w-5 text-library-primary" />
                  <div>
                    <div className="text-sm text-gray-500">Genre</div>
                    <div className="font-medium">{item.genre}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Book className="h-5 w-5 text-library-primary" />
                  <div>
                    <div className="text-sm text-gray-500">Format</div>
                    <div className="font-medium capitalize">{item.format}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-library-primary" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">{item.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-library-primary" />
                  <div>
                    <div className="text-sm text-gray-500">Published</div>
                    <div className="font-medium">
                      {new Date(item.publishedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="h-5 w-5 text-library-primary" />
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className={`font-medium px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              </div>
              
              {item.isbn && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">ISBN</div>
                  <div className="font-mono text-gray-700">{item.isbn}</div>
                </div>
              )}
              
              {item.pages && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Pages</div>
                  <div className="font-medium text-gray-700">{item.pages} pages</div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>
          
          <div className="mt-6 flex gap-3">
            {item.status === 'available' && (
              <button className="bg-library-primary hover:bg-library-secondary text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                Reserve This Item
              </button>
            )}
            <button className="border border-library-primary text-library-primary hover:bg-library-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              Add to Reading List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;