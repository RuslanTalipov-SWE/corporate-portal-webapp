// src/app/api/subreddits.ts
import { db } from "@/lib/db"; // Import your database instance

export async function GET() {
  try {
    const subreddits = await db.subreddit.findMany(); // Fetch all subreddits from your database
    return new Response(JSON.stringify(subreddits), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching subreddits:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
