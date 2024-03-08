import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

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
    await db.comment.updateMany({
      where: {
        postId: params.id,
      },
      data: {
        replyToId: null,
      },
    });

    // do the delete
    await db.post.delete({
      where: {
        id: params.id,
      },
    });

    return new Response("0K");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response("Could not delete post, please try again later.", {
      status: 500,
      // Optionally include more error details if appropriate
      // body: JSON.stringify({ error: error.message }),
    });
  }
}
