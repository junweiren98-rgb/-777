import React, { useRef, useEffect, useState } from 'react';
import { Song } from '../types';
import { Record } from './Record';
import { motion } from 'framer-motion';

interface TurntableProps {
  currentSong: Song | null;
  onSongEnd: () => void;
  onDrop: (song: Song) => void;
}

export const Turntable: React.FC<TurntableProps> = ({ currentSong, onSongEnd, onDrop }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    const songData = e.dataTransfer.getData('application/json');
    if (songData) {
      try {
        const song = JSON.parse(songData) as Song;
        onDrop(song);
      } catch (err) {
        console.error("Failed to parse dropped song", err);
      }
    }
  };

  const togglePlay = () => {
    if (currentSong) setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square md:aspect-[4/3] p-4">
        {/* Audio Element */}
        <audio 
            ref={audioRef} 
            src={currentSong?.previewUrl} 
            onEnded={() => { setIsPlaying(false); onSongEnd(); }} 
        />

        {/* Turntable Base */}
        <div 
            className={`relative w-full h-full rounded-xl shadow-2xl border-t border-white/10 transition-all duration-500 overflow-hidden ${isHovering ? 'ring-4 ring-yellow-500/50' : ''}`}
            style={{
                background: `linear-gradient(145deg, #2a2a2a, #1a1a1a)`,
                boxShadow: '20px 20px 60px #0f0f0f, -20px -20px 60px #353535'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Wood grain texture overlay on base */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`}}></div>

            {/* Logo Badge */}
            <div className="absolute top-6 left-6 z-10 bg-yellow-600/20 border border-yellow-600/50 px-3 py-1 rounded">
                <span className="text-yellow-600 font-bold tracking-widest text-xs uppercase" style={{fontFamily: "'Courier Prime', monospace"}}>RetroAudio</span>
            </div>

            {/* Platter Area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[60%] -translate-y-1/2">
                {/* Platter Base */}
                <div className="relative rounded-full bg-[#111] shadow-2xl border-8 border-[#222] w-72 h-72 md:w-[24rem] md:h-[24rem] flex items-center justify-center">
                     {/* Platter Dots (Stroboscope effect) */}
                     <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-gray-700/30 w-full h-full animate-[spin_4s_linear_infinite] opacity-20"></div>
                     
                     {/* Mat */}
                     <div className="w-[95%] h-[95%] rounded-full bg-[#0a0a0a] flex items-center justify-center shadow-inner">
                        {/* The Record */}
                        {currentSong && (
                            <Record 
                                song={currentSong} 
                                isSpinning={isPlaying} 
                                isInteractive={false}
                                size="lg"
                                className="shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                            />
                        )}
                        
                        {/* Spindle */}
                        <div className="absolute w-4 h-4 bg-gray-300 rounded-full shadow-lg z-50 bg-gradient-to-tr from-gray-400 to-white border border-gray-500"></div>
                     </div>
                </div>
            </div>

            {/* Tonearm Assembly */}
            <div className="absolute top-8 right-8 md:right-12 w-32 h-full pointer-events-none z-20">
                {/* Pivot Base */}
                <div className="absolute top-12 right-8 w-24 h-24 rounded-full bg-gradient-to-b from-gray-300 to-gray-500 shadow-xl flex items-center justify-center border-4 border-gray-400">
                    <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 shadow-inner"></div>
                </div>

                {/* The Arm */}
                <motion.div 
                    className="absolute top-[5.5rem] right-[3.5rem] w-6 h-64 origin-top bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 shadow-2xl rounded-full"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isPlaying ? 25 : 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ transformOrigin: "50% 20px" }}
                >
                     {/* Counterweight */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-12 bg-gray-700 rounded-sm border-t border-gray-600"></div>
                    
                    {/* Arm Body Detail */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gray-400/20"></div>

                    {/* Headshell & Cartridge */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-black rounded-b-md transform rotate-[15deg] origin-top flex items-end justify-center">
                        {/* Needle */}
                         <div className="w-1 h-2 bg-red-500 mb-1"></div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-30">
                 {/* Start/Stop Button */}
                 <button 
                    onClick={togglePlay}
                    className={`w-16 h-16 rounded-full border-4 border-gray-600 flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.5),0_5px_10px_rgba(0,0,0,0.5)] transition-all active:translate-y-1 ${isPlaying ? 'bg-green-900' : 'bg-red-900'}`}
                 >
                    <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></div>
                 </button>
                 <span className="text-gray-400 text-[0.6rem] uppercase tracking-widest text-center font-bold">Power</span>
            </div>

             {/* Speed Switch (Decoration) */}
             <div className="absolute bottom-8 left-8 flex flex-col gap-2">
                <div className="w-12 h-20 bg-[#222] rounded border border-gray-700 p-1 relative shadow-inner">
                    <div className="absolute top-1 left-1 right-1 h-8 bg-[#333] rounded border border-gray-600"></div>
                    <span className="absolute top-2 left-0 right-0 text-center text-[0.5rem] text-gray-400">33</span>
                    <span className="absolute bottom-2 left-0 right-0 text-center text-[0.5rem] text-gray-400">45</span>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-8 h-6 bg-gray-400 rounded shadow-lg cursor-pointer"></div>
                </div>
             </div>
        </div>

        {/* Current Song Info Display (LCD style) */}
        {currentSong && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-black border-2 border-gray-700 p-2 rounded shadow-lg w-64 text-center">
                <div className="text-green-500 font-mono text-xs scrolling-text overflow-hidden whitespace-nowrap">
                    NOW PLAYING: {currentSong.trackName} - {currentSong.artistName}
                </div>
            </div>
        )}
    </div>
  );
};
