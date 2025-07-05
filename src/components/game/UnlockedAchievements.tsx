"use client";

import type { Achievement } from "@/lib/achievements";

export function UnlockedAchievements({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-center font-semibold text-lg">Achievements Unlocked!</h3>
      <div className="flex flex-col gap-2">
        {achievements.map((ach, index) => (
          <div
            key={ach.id}
            className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg animate-fly-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-shrink-0 bg-yellow-400/20 text-yellow-500 p-2 rounded-full">
                <ach.Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">{ach.name}</p>
              <p className="text-sm text-muted-foreground">{ach.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}