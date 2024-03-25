"use client";
import React, { useState, useEffect } from "react";
import { Menu, Home, Plus, FileStack } from "lucide-react";
import Link from "next/link"; // импорт компонента Link
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

interface Community {
  id: number;
  name: string;
  slug: string;
}

export const MainMenu = () => {
  const [subscribedCommunities, setSubscribedCommunities] = useState<
    Community[]
  >([]);

  useEffect(() => {
    fetch("/api/myCommunities")
      .then((response) => response.json())
      .then((data) => setSubscribedCommunities(data))
      .catch((error) =>
        console.error("Error fetching subscribed communities:", error)
      );
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Menu className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-white max-h-65 overflow-y-auto"
        align="end"
      >
        <DropdownMenuItem asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" /> Главная страница
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/allCommunities" className="flex items-center gap-2">
            <FileStack className="h-4 w-4" /> Все сообщества
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <p className="text-sm text-gray-500">Мои сообщества</p>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="r/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Создать сообщество
          </Link>
        </DropdownMenuItem>

        {subscribedCommunities.map((community) => (
          <DropdownMenuItem asChild key={community.id}>
            <Link
              href={`/r/${community.name || community.name}`}
              className="flex items-center gap-2 text-black hover:text-gray-900"
            >
              {community.name || "Unknown Community"}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainMenu;
