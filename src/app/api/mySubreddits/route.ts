// src/app/api/mySubreddits/route.ts
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId: session.user.id },
      include: { subreddit: true },
    });

    // Map the subscriptions to return only subreddit data
    const subscribedSubreddits = subscriptions.map((sub) => sub.subreddit);

    return new Response(JSON.stringify(subscribedSubreddits), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching subscribed subreddits:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
