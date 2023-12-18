// import { Menu } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/DropdownMenu";

// export const MainMenu = () => {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button>
//           <Menu className="h-6 w-6" />
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="bg-white" align="end">
//         <DropdownMenuItem asChild>
//           <a href="/r/create">Create Community</a>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <a href="/allCommunities">All Communities</a>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <a href="/my-communities">My Communities</a>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

"use client";
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
    fetch("/api/subscribedCommunities") // Corrected API endpoint
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
      <DropdownMenuContent className="bg-white" align="end">
        <DropdownMenuItem asChild>
          <a href="/r/create">Create Community</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/allCommunities">All Communities</a>
        </DropdownMenuItem>

        {/* Collapsible Dropdown for My Communities (requires additional logic) */}
        <DropdownMenuItem asChild>
          <button>My Communities</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainMenu;
