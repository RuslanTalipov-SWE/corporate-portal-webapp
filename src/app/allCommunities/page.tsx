"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Community {
  id: number;
  name: string;
  slug: string;
  description: string;
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-bold text-3xl md:text-4xl text-center mb-6">
        Все сообщества
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedCommunities.map((community) => (
          <Link href={`/r/${community.name}`} legacyBehavior key={community.id}>
            <a className="block bg-white rounded-lg shadow overflow-hidden hover:bg-gray-100 transition-colors">
              <div className="p-5">
                <h2 className="font-semibold text-xl mb-2">{community.name}</h2>
                <p className="text-gray-700 text-sm">{community.description}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCommunitiesPage;
