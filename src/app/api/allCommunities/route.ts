import { db } from "@/lib/db"; // Import your database instance

export async function GET() {
  try {
    const communities = await db.community.findMany(); // Fetch all communities from your database
    return new Response(JSON.stringify(communities), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
