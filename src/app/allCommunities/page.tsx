"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Все сообщества</h1>
      <ul className="list-disc pl-5">
        {sortedCommunities.map((community) => (
          <li key={community.id}>
            {/* Updated usage of Link component */}
            <Link href={`/r/${community.name}`}>{community.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllCommunitiesPage;
