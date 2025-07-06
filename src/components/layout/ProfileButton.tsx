
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useUserData } from "@/hooks/use-user-data";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ProfileButton() {
  const { username } = useUserData();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="ghost" className="relative h-10 w-10 rounded-full">
          <Link href="/profile">
            <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
                <AvatarImage src="https://files.catbox.moe/hk5usq.jpg" alt={username} />
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
          <p>View Profile</p>
      </TooltipContent>
    </Tooltip>
  );
}
