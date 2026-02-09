import { Search, X } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar por código, nombre o descripción..."
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
