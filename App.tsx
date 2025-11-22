import React, { useState, useCallback } from 'react';
import { searchMusic } from './services/itunesService';
import { Song } from './types';
import { Turntable } from './components/Turntable';
import { Search } from './components/Search';
import { Record } from './components/Record';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (term: string) => {
    setIsLoading(true);
    const results = await searchMusic(term);
    setSearchResults(results);
    setIsLoading(false);
  };

  const handleDrop = (song: Song) => {
    setCurrentSong(song);
  };

  const handleRecordDragStart = (e: React.DragEvent<HTMLDivElement>, song: Song) => {
    e.dataTransfer.setData('application/json', JSON.stringify(song));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#1a120b] relative selection:bg-yellow-900 selection:text-white">
      {/* Background Texture (Dark Wood) */}
      <div 
        className="fixed inset-0 z-0"
        style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=2670&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6) contrast(1.2)'
        }}
      />
      {/* Noise Overlay for retro feel */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col lg:flex-row h-screen gap-8">
        
        {/* Left Side: Turntable Station */}
        <section className="flex-1 flex flex-col items-center justify-center lg:h-full min-h-[500px]">
             <div className="w-full max-w-3xl">
                 <Turntable 
                    currentSong={currentSong} 
                    onSongEnd={() => console.log("Song finished")} 
                    onDrop={handleDrop}
                 />
             </div>
             <p className="mt-12 text-white/30 text-sm font-mono text-center hidden lg:block">
                &copy; 2024 Retro Vinyl Player. Built with React.
             </p>
        </section>

        {/* Right Side: Search & Collection */}
        <section className="flex-1 flex flex-col items-center lg:items-start lg:h-full lg:overflow-y-auto no-scrollbar pb-20">
            <div className="sticky top-0 z-50 w-full pt-4 pb-12">
                 <Search onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Scattered Records Area */}
            <div className="relative w-full min-h-[400px] flex flex-wrap justify-center gap-8 content-start px-4">
                <AnimatePresence>
                    {searchResults.length === 0 && !isLoading && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="text-white/40 text-center mt-10 font-serif italic text-lg"
                        >
                            Search for your favorite artists to find some records...
                        </motion.div>
                    )}
                    
                    {searchResults.map((song, index) => (
                        <motion.div
                            key={song.trackId}
                            initial={{ opacity: 0, scale: 0, rotate: Math.random() * 40 - 20 }}
                            animate={{ opacity: 1, scale: 1, rotate: Math.random() * 20 - 10 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: index * 0.1, type: "spring" }}
                            className="relative"
                            style={{ zIndex: 10 - index }} // simple stacking
                        >
                            <Record 
                                song={song} 
                                onDragStart={handleRecordDragStart} 
                                isInteractive={true}
                                size="md"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
      </main>
    </div>
  );
}

export default App;
