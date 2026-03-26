import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 120;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused || isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    },
    [isPaused, isGameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isPaused, isGameOver, food, onScoreChange]);

  return (
    <div className="relative w-full max-w-md aspect-square bg-gray-950 border-2 border-cyan-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] overflow-hidden flex items-center justify-center">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
      />

      {/* Game Board */}
      <div 
        className="relative w-full h-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Food */}
        <div
          className="bg-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '2px',
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${
                isHead ? 'bg-cyan-400' : 'bg-cyan-600'
              } rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.6)]`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                margin: '1px',
              }}
            />
          );
        })}
      </div>

      {/* Overlays */}
      {(isPaused || isGameOver) && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          {isGameOver ? (
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-fuchsia-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
                Game Over
              </h2>
              <p className="text-cyan-400 text-xl font-mono">Score: {score}</p>
              <button
                onClick={resetGame}
                className="mt-4 px-6 py-3 bg-cyan-950/50 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2 mx-auto font-mono uppercase tracking-wider"
              >
                <RotateCcw size={20} />
                Restart
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                Neon Snake
              </h2>
              <button
                onClick={() => setIsPaused(false)}
                className="px-8 py-4 bg-fuchsia-950/50 border-2 border-fuchsia-500 text-fuchsia-400 rounded-full hover:bg-fuchsia-900/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all flex items-center gap-3 mx-auto font-bold uppercase tracking-widest text-lg"
              >
                <Play size={24} fill="currentColor" />
                Start
              </button>
              <p className="text-cyan-600/80 text-sm font-mono mt-4">
                Use Arrow Keys or WASD to move.<br/>Space to pause.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
