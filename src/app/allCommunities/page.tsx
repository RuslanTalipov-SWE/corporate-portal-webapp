"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";

interface Community {
  id: number;
  name: string;
  slug: string;
}

const AllCommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    fetch("/api/allCommunities")
      .then((response) => response.json())
      .then((data) => setCommunities(data))
      .catch((error) => console.error("Error fetching communities:", error));
  }, []);

  const sortedCommunities = communities.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Все сообщества</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <ul className="list-disc pl-5">
          {sortedCommunities.map((community) => (
            <li key={community.id}>
              <Link href={`/r/${community.name}`}>{community.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AllCommunitiesPage;
