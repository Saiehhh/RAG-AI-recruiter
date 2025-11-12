import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Describe your ideal candidate..."
        className="w-full pl-5 pr-14 py-3 bg-[#F5F0E4] border border-[#E0DACE] rounded-lg focus:ring-2 focus:ring-[#A67B5B] focus:border-[#A67B5B] outline-none transition-all duration-300 placeholder-[#A67B5B]/70 text-lg text-[#5D4037]"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#A67B5B] hover:bg-[#8D6E63] disabled:bg-[#a1988a] disabled:cursor-not-allowed text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FDF6E3] focus:ring-[#A67B5B] shadow-sm hover:shadow-md"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;