/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background grid effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            Neon Snake
          </h1>
          <div className="inline-block px-8 py-2 bg-gray-900/80 border border-gray-800 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <p className="text-cyan-400 font-mono text-2xl font-bold tracking-widest">
              SCORE: {score.toString().padStart(4, '0')}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 mt-4">
          {/* Game Container */}
          <div className="w-full max-w-md flex-shrink-0">
            <SnakeGame onScoreChange={setScore} />
          </div>

          {/* Music Player Container */}
          <div className="w-full max-w-md flex-shrink-0">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
}
