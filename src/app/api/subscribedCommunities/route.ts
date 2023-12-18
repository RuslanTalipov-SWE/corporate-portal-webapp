import { db } from "@/lib/db";
import { NextApiResponse } from "next"; // Import NextApiResponse from 'next'
import { NextApiRequestWithSession } from "@/types/custom-next"; // Import your custom request type

export async function GET(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  try {
    // Access the user ID from the session's user object
    const userId = req.session.user.id; // or `req.session.user.userId`

    const subscribedSubreddits = await db.subscription.findMany({
      where: { userId: userId },
      include: { subreddit: true },
    });

    return res
      .status(200)
      .json(subscribedSubreddits.map((sub) => sub.subreddit));
  } catch (error) {
    console.error("Error fetching subscribed subreddits:", error);
    return res.status(500).send("Internal Server Error");
  }
}
