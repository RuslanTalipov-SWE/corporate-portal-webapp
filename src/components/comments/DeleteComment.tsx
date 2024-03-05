"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ButtonDelete } from "../ui/ButtonDelete";
import { useSession } from "next-auth/react";

interface DeleteCommentButtonProps {
  commentId: string;
}
const DeleteComment = ({ commentId }: DeleteCommentButtonProps) => {
  const { data: session } = useSession();
  const { mutate: deleteComment, isLoading } = useMutation({
    mutationFn: async (commentId: string) => {
      console.log(
        " ~ file: DeleteComment.tsx ~ mutationFn: ~ commentId:",
        commentId
      );

      // Ensure to correct how you pass the payload if needed
      await axios.delete(`/api/subreddit/Comment/delete/${commentId}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Comment wasn't deleted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  if (session?.user?.role === "ADMIN") {
    return (
      <ButtonDelete
        isLoading={isLoading}
        onClick={() => deleteComment(commentId)}
      >
        Delete
      </ButtonDelete>
    );
  }
  return null;
};

export default DeleteComment;
