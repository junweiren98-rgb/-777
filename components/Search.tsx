import React, { useState } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

export const Search: React.FC<SearchProps> = ({ onSearch, isLoading }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-8 rotate-1 transition-transform hover:rotate-0 duration-300 z-30">
        {/* Paper Effect */}
        <div className="absolute inset-0 bg-[#d2b48c] shadow-lg transform skew-y-1 rounded-sm border border-[#bfa07a]" style={{
             backgroundImage: `url("https://www.transparenttextures.com/patterns/crinkled-paper.png")`, // Subtle texture overlay pattern if available, generic link
             filter: 'contrast(1.1) brightness(0.95)'
        }}></div>
        
        {/* Tape pieces */}
        <div className="absolute -top-3 left-10 w-24 h-8 bg-white/40 backdrop-blur-sm transform -rotate-2 shadow-sm"></div>
        <div className="absolute -bottom-3 right-10 w-24 h-8 bg-white/40 backdrop-blur-sm transform rotate-2 shadow-sm"></div>

        <form onSubmit={handleSubmit} className="relative p-6 flex flex-col gap-3">
            <h2 className="text-2xl text-[#5c4b37] font-bold text-center mb-1 tracking-widest" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Music Library
            </h2>
            
            <div className="flex items-end gap-2 border-b-2 border-[#8c735a] pb-2">
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search for artists..."
                    className="flex-1 bg-transparent border-none outline-none text-[#3e3225] text-xl placeholder-[#8c735a]/70"
                    style={{ fontFamily: "'Patrick Hand', cursive" }}
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#8b4513] text-[#d2b48c] px-4 py-1 rounded-sm hover:bg-[#6f360e] transition-colors shadow-md transform active:scale-95 font-bold tracking-widest text-sm uppercase disabled:opacity-50"
                    style={{ fontFamily: "'Courier Prime', monospace" }}
                >
                    {isLoading ? 'Digging...' : 'Find'}
                </button>
            </div>
            <p className="text-center text-[#8c735a] text-sm italic" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                "Drag records to the player..."
            </p>
        </form>
    </div>
  );
};
