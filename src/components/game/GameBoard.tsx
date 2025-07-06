
"use client"

import { cn } from "@/lib/utils"
import { Card as CardType, CustomCardBack } from "@/lib/game-constants"
import { Card } from "./Card"

type GameBoardProps = {
  cards: CardType[]
  flippedIndices: number[]
  matchedPairs: string[]
  onCardClick: (index: number) => void
  gridSize: number
  isHintActive: boolean
  cardBackClass: string
  customCardBacks: CustomCardBack[]
}

export function GameBoard({
  cards,
  flippedIndices,
  matchedPairs,
  onCardClick,
  gridSize,
  isHintActive,
  cardBackClass,
  customCardBacks
}: GameBoardProps) {
  const customCardBackContent = customCardBacks.find(c => c.className === cardBackClass)?.content;
  
  return (
    <div
      className={cn(
        "grid gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/50 rounded-lg shadow-inner",
        `grid-cols-${gridSize}`
      )}
    >
      {cards.map((card, index) => (
        <div key={index} className="animate-deal-in" style={{ animationDelay: `${index * 30}ms`, opacity: 0, animationFillMode: 'forwards' }}>
            <Card
              content={card.content}
              isFlipped={isHintActive || flippedIndices.includes(index) || matchedPairs.includes(card.type)}
              isMatched={matchedPairs.includes(card.type)}
              onClick={() => onCardClick(index)}
              isImageType={card.image}
              hint={card.hint}
              cardBackClass={cardBackClass}
              customCardBackContent={customCardBackContent}
            />
        </div>
      ))}
    </div>
  )
}
