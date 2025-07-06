
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Gamepad2, Trophy, Coins, Repeat, BarChart2, Edit, Check, X as XIcon, BadgeCheck, User } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Footer } from '@/components/layout/Footer';

const chartConfig = {
  plays: {
    label: "Plays",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ProfilePage() {
    const { username, setUsername, stats, coins } = useUserData();
    const [isEditing, setIsEditing] = useState(false);
    const [nameInput, setNameInput] = useState(username);
    
    const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : "0";
    const avgMoves = stats.wins > 0 ? (stats.totalMoves / stats.wins).toFixed(1) : "0";
    
    const themeData = Object.entries(stats.themePlays || {})
        .map(([theme, plays]) => ({ theme, plays }))
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 5);
        
    const handleSaveName = () => {
        if (nameInput.trim()) {
            setUsername(nameInput.trim());
            setIsEditing(false);
        }
    };
    
    const handleCancelEdit = () => {
        setNameInput(username);
        setIsEditing(false);
    }

    React.useEffect(() => {
        setNameInput(username);
    }, [username]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 sm:p-4 relative overflow-hidden">
      <User className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] text-primary opacity-5 -z-10" />
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
                <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-wide text-primary">Player Profile</h1>
                <p className="text-muted-foreground mt-2">Your journey and stats in FlipFun.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="shadow-lg h-full animate-fly-in">
                        <CardHeader className="items-center text-center p-6 bg-muted/50">
                            <Avatar className="w-32 h-32 border-4 border-card shadow-lg mb-4">
                                <AvatarImage src="https://files.catbox.moe/hk5usq.jpg" alt={username} />
                                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {!isEditing ? (
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-3xl font-headline">{username}</CardTitle>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                        <Edit className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 w-full max-w-xs animate-fly-in">
                                    <Input 
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                        autoFocus
                                        className="text-center text-xl font-bold"
                                    />
                                    <Button variant="ghost" size="icon" onClick={handleSaveName}>
                                        <Check className="h-5 w-5 text-green-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                                        <XIcon className="h-5 w-5 text-red-500" />
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-amber-500 bg-amber-400/10 p-4 rounded-lg">
                                <Coins className="w-8 h-8"/>
                                <span>{coins}</span>
                            </div>
                            <p className="text-muted-foreground text-sm mt-2">Total FlipCoins</p>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-lg animate-fly-in" style={{animationDelay: '100ms'}}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
                                <Trophy className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.wins}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg animate-fly-in" style={{animationDelay: '150ms'}}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Games Played</CardTitle>
                                <Gamepad2 className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg animate-fly-in" style={{animationDelay: '200ms'}}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                                <BarChart2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{winRate}%</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg animate-fly-in" style={{animationDelay: '250ms'}}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Moves/Win</CardTitle>
                                <Repeat className="h-4 w-4 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{avgMoves}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-lg animate-fly-in" style={{animationDelay: '300ms'}}>
                        <CardHeader>
                            <CardTitle>Favorite Themes</CardTitle>
                            <CardDescription>Top 5 themes you've played the most.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {themeData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                    <BarChart accessibilityLayer data={themeData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                        <YAxis
                                            dataKey="theme"
                                            type="category"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.length > 12 ? `${value.slice(0,12)}...` : value}
                                            className="capitalize fill-muted-foreground text-xs"
                                        />
                                        <XAxis dataKey="plays" type="number" hide />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" hideLabel />}
                                        />
                                        <Bar dataKey="plays" layout="vertical" radius={5} fill="var(--color-plays)" barSize={30} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <p className="text-muted-foreground text-center py-12">Play some games to see your favorite themes here!</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
