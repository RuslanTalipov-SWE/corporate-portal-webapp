import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

// Recursive function to delete a comment and all its nested replies
async function deleteCommentAndReplies(commentId: string, prisma) {
  // Find replies to the comment
  const replies = await prisma.comment.findMany({
    where: { replyToId: commentId },
  });

  // Recursively delete each reply
  for (const reply of replies) {
    await deleteCommentAndReplies(reply.id, prisma);
  }

  // After deleting all replies, delete the comment itself
  await prisma.comment.delete({
    where: { id: commentId },
  });
}

async function deleteCommentsForPost(postId: string, prisma) {
  // Find all top-level comments for the post (comments without a replyToId)
  const topLevelComments = await prisma.comment.findMany({
    where: { postId, replyToId: null },
  });

  // Use the recursive function to delete each top-level comment and its replies
  for (const comment of topLevelComments) {
    await deleteCommentAndReplies(comment.id, prisma);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.$transaction(async (prisma) => {
      // Delete all subscriptions related to the subreddit
      await prisma.subscription.deleteMany({
        where: {
          subredditId: params.id,
        },
      });

      // Get all posts in the subreddit
      const posts = await prisma.post.findMany({
        where: { subredditId: params.id },
        select: { id: true },
      });

      // For each post, delete its comments, handling nested comments
      for (const post of posts) {
        await deleteCommentsForPost(post.id, prisma);
      }

      // Then, delete the posts in the subreddit
      await prisma.post.deleteMany({
        where: {
          subredditId: params.id,
        },
      });

      // Finally, delete the subreddit itself
      await prisma.subreddit.delete({
        where: {
          id: params.id,
        },
      });
    });

    return new Response(
      JSON.stringify({ message: "Subreddit deleted successfully" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Deletion error:", error as Error); // Asserting the error type for logging

    // Now you can safely access the error.message property
    const errorMessage = (error as Error).message;
    return new Response(
      JSON.stringify({
        message: "Could not delete subreddit, please try again later.",
        error: errorMessage,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

//   } catch (error) {
//     console.error("Deletion error:", error); // Log the error for debugging
//     return new Response(
//       JSON.stringify({
//         message: "Could not delete subreddit, please try again later.",
//         error: error.message,
//       }),
//       {
//         headers: { "Content-Type": "application/json" },
//         status: 500,
//       }
//     );
//   }
// }
