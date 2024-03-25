import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

// Recursive function to delete a comment and all its replies
async function deleteCommentAndReplies(commentId: string): Promise<void> {
  // Find all replies to the comment
  const replies = await db.comment.findMany({
    where: {
      replyToId: commentId,
    },
  });

  // Recursively delete each reply
  for (const reply of replies) {
    await deleteCommentAndReplies(reply.id);
  }

  // After deleting all replies, delete the comment itself
  await db.comment.delete({
    where: {
      id: commentId,
    },
  });
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

    /**
     * Need to update and set the replyTold field to null to be able to delete the record.
     * This is because a reply is a self referening comment.
     * (Setting it to null basically means it is a top level comment)
     */
    // await db.comment.updateMany({
    //   where: {
    //     replyToId: params.id,
    //   },
    //   data: {
    //     replyToId: null,
    //   },
    // });

    // // do the delete
    // await db.comment.delete({
    //   where: {
    //     id: params.id,
    //   },
    // });

    // Use the recursive function to delete the comment and its replies
    await deleteCommentAndReplies(params.id);

    return new Response("0K");
  } catch (error) {
    console.error(error);
    return new Response("Could not delete comment, please try again later.", {
      status: 500,
    });
  }
}
