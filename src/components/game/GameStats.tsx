"use client";

import { Timer, Star, Move } from "lucide-react";

type GameStatsProps = {
  time: number;
  moves: number;
  gridSize: number;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const calculateStars = (moves: number, gridSize: number) => {
  const pairs = (gridSize * gridSize) / 2;
  const optimalMoves = pairs;
  
  if (moves <= optimalMoves + Math.floor(pairs * 0.25)) return 3;
  if (moves <= optimalMoves + Math.floor(pairs * 0.75)) return 2;
  return 1;
};

export function GameStats({ time, moves, gridSize }: GameStatsProps) {
  const stars = calculateStars(moves, gridSize);

  return (
    <div className="flex justify-between items-center bg-muted/50 p-2 rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-lg">
          <Timer className="h-5 w-5 text-primary" />
          <span>{formatTime(time)}</span>
        </div>
        <div className="flex items-center gap-2 text-lg">
          <Move className="h-5 w-5 text-primary" />
          <span>{moves} Moves</span>
        </div>
      </div>
      <div className="flex items-center">
        {[...Array(3)].map((_, i) => (
          <Star
            key={i}
            className={`h-6 w-6 ${i < stars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    </div>
  );
}
