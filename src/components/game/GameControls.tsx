"use client";

import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Lightbulb,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type GameControlsProps = {
  onRestart: () => void;
  onPause: () => void;
  isPaused: boolean;
  toggleSound: () => void;
  isSoundEnabled: boolean;
  toggleTheme: () => void;
  theme: string | undefined;
  onShowHint: () => void;
  hintsLeft: number;
  canUseHint: boolean;
};

export function GameControls({
  onRestart,
  onPause,
  isPaused,
  toggleSound,
  isSoundEnabled,
  toggleTheme,
  theme,
  onShowHint,
  hintsLeft,
  canUseHint,
}: GameControlsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onShowHint} disabled={!canUseHint}>
              <Lightbulb className="h-4 w-4" />
              <span className="sr-only">Hint</span>
              {hintsLeft > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">{hintsLeft}</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show Hint ({hintsLeft} left)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onRestart}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Restart Game</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Restart Game</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onPause}>
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              <span className="sr-only">{isPaused ? "Resume" : "Pause"} Game</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPaused ? "Resume" : "Pause"} Game</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={toggleSound}>
              {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="sr-only">Toggle Sound</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Sound</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
