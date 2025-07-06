
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserData } from "@/hooks/use-user-data";
import { BadgeCheck, CircleDollarSign, User, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function ProfileButton() {
  const { username, coins } = useUserData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
                <AvatarImage src="https://files.catbox.moe/hk5usq.jpg" alt={username} />
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium leading-none">{username}</p>
                <BadgeCheck className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              Level 1 Player
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5 text-sm text-muted-foreground">
            <span>FlipCoins</span>
            <span className="font-bold text-amber-500 flex items-center gap-1.5">
                <CircleDollarSign className="w-4 h-4" />
                {coins}
            </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
         <DropdownMenuItem asChild>
          <Link href="/achievements" className="cursor-pointer">
            <Trophy className="mr-2 h-4 w-4" />
            <span>Achievements</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
