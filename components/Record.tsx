import React from 'react';
import { Song } from '../types';
import { motion } from 'framer-motion';

interface RecordProps {
  song?: Song;
  isSpinning?: boolean;
  className?: string;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, song: Song) => void;
  isInteractive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Record: React.FC<RecordProps> = ({ 
  song, 
  isSpinning = false, 
  className = "", 
  onDragStart,
  isInteractive = true,
  size = 'md'
}) => {
  
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-72 h-72 md:w-[22rem] md:h-[22rem]'
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (song && onDragStart) {
      onDragStart(e, song);
    }
  };

  const coverArt = song?.artworkUrl100 || "https://picsum.photos/200";

  return (
    <motion.div
      className={`relative rounded-full shadow-2xl flex items-center justify-center select-none ${sizeClasses[size]} ${className} ${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      draggable={isInteractive && !!song}
      onDragStart={handleDragStart}
      animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
      transition={isSpinning ? { repeat: Infinity, duration: 3, ease: "linear" } : { duration: 0.5 }}
      whileHover={isInteractive ? { scale: 1.05 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
    >
      {/* Vinyl Texture - Grooves */}
      <div className="absolute inset-0 rounded-full bg-[#111] border-4 border-[#0a0a0a] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] overflow-hidden">
        {/* Simulated light reflection on grooves */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30" />
        <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(#222_0px,#111_2px,#111_4px)] opacity-80" />
      </div>

      {/* Label / Cover Art */}
      <div className="relative w-[40%] h-[40%] rounded-full overflow-hidden border-4 border-[#1a1a1a] shadow-inner z-10 bg-neutral-800">
        {song ? (
           <img src={coverArt} alt={song.trackName} className="w-full h-full object-cover" draggable={false} />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-[#d9534f]">
             <span className="text-[0.5rem] text-white font-bold">NO DISC</span>
           </div>
        )}
        {/* Center Spindle Hole */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#0a0a0a] rounded-full shadow-inner border border-gray-700" />
      </div>
      
      {/* Song Title Tooltip (Simple) for search results */}
      {isInteractive && song && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
          {song.trackName.substring(0, 20)}...
        </div>
      )}
    </motion.div>
  );
};
