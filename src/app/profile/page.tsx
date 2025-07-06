
"use client";

import React from 'react';
import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, ArrowLeft, Gamepad2, Trophy, Coins, Repeat, BarChart2 } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  plays: {
    label: "Plays",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ProfilePage() {
    const { stats, coins } = useUserData();
    
    const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : 0;
    const avgMoves = stats.wins > 0 ? (stats.totalMoves / stats.wins).toFixed(1) : 0;
    
    const themeData = Object.entries(stats.themePlays || {})
        .map(([theme, plays]) => ({ theme, plays }))
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 5);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4">
        <Header />
        <main className="w-full max-w-5xl mx-auto mt-8">
            <div className="flex justify-start w-full mb-6">
                <Button asChild variant="outline">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            
             <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-wide text-primary">Player Profile</h1>
                <p className="text-muted-foreground mt-2">Your journey and stats in FlipFun.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.wins}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Games Played</CardTitle>
                        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{winRate}%</div>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Moves/Win</CardTitle>
                        <Repeat className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgMoves}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Favorite Themes</CardTitle>
                    <CardDescription>Top 5 themes you've played the most.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    {themeData.length > 0 ? (
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                             <BarChart accessibilityLayer data={themeData} layout="vertical" margin={{ left: 10 }}>
                                <YAxis
                                    dataKey="theme"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.length > 12 ? `${value.slice(0,12)}...` : value}
                                    className="capitalize"
                                />
                                <XAxis dataKey="plays" type="number" hide />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="plays" layout="vertical" radius={5} fill="var(--color-plays)" />
                            </BarChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-muted-foreground text-center py-12">Play some games to see your favorite themes here!</p>
                    )}
                </CardContent>
            </Card>

        </main>
      </div>

      <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
        <p className="inline-flex items-center gap-2">
            Build by Sid <Code className="w-4 h-4 text-accent" />
        </p>
      </footer>
    </div>
  );
}
