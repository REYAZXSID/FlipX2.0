
"use client"

import { cn } from "@/lib/utils"
import type { Card as CardType } from "@/lib/game-constants"
import { Card } from "./Card"

type GameBoardProps = {
  cards: CardType[]
  flippedIndices: number[]
  matchedPairs: string[]
  onCardClick: (index: number) => void
  gridSize: number
  isHintActive: boolean
  cardBackClass: string
}

export function GameBoard({
  cards,
  flippedIndices,
  matchedPairs,
  onCardClick,
  gridSize,
  isHintActive,
  cardBackClass,
}: GameBoardProps) {
  return (
    <div
      className={cn(
        "grid gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/50 rounded-lg shadow-inner",
        `grid-cols-${gridSize}`
      )}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          content={card.content}
          isFlipped={isHintActive || flippedIndices.includes(index) || matchedPairs.includes(card.type)}
          isMatched={matchedPairs.includes(card.type)}
          onClick={() => onCardClick(index)}
          isImageType={card.image}
          hint={card.hint}
          cardBackClass={cardBackClass}
        />
      ))}
    </div>
  )
}
