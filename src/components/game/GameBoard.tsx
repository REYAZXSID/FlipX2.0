
"use client"

import { cn } from "@/lib/utils"
import { Card as CardType } from "@/lib/game-constants"
import { Card } from "./Card"

type GameBoardProps = {
  cards: CardType[]
  flippedIndices: number[]
  matchedPairs: string[]
  mismatchedIndices: number[]
  onCardClick: (index: number) => void
  gridSize: number
  isHintActive: boolean
  cardBackClass: string
  customCardBackContent?: string
  isPeeking?: boolean
  isScrambling?: boolean
}

export function GameBoard({
  cards,
  flippedIndices,
  matchedPairs,
  mismatchedIndices,
  onCardClick,
  gridSize,
  isHintActive,
  cardBackClass,
  customCardBackContent,
  isPeeking,
  isScrambling
}: GameBoardProps) {
  return (
    <div
      className={cn(
        "grid gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/50 rounded-lg shadow-inner",
        `grid-cols-${gridSize}`,
        isScrambling && "animate-shake"
      )}
    >
      {cards.map((card, index) => (
        <div key={index} className="animate-deal-in" style={{ animationDelay: `${index * 30}ms`, opacity: 0, animationFillMode: 'forwards' }}>
            <Card
              content={card.content}
              isFlipped={isHintActive || isPeeking || flippedIndices.includes(index) || matchedPairs.includes(card.type)}
              isMatched={matchedPairs.includes(card.type)}
              isMismatched={mismatchedIndices.includes(index)}
              onClick={() => onCardClick(index)}
              isImageType={card.image}
              hint={card.hint}
              cardBackClass={cardBackClass}
              customCardBackContent={customCardBackContent}
              isBomb={card.isBomb}
            />
        </div>
      ))}
    </div>
  )
}
