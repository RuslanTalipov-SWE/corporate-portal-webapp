"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ButtonDelete } from "../ui/ButtonDelete";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DeleteCommentButtonProps {
  commentId: string;
}

const DeleteComment = ({ commentId }: DeleteCommentButtonProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: deleteComment, isLoading } = useMutation({
    mutationFn: async (commentId: string) => {
      console.log(
        " ~ file: DeleteComment.tsx ~ mutationFn: ~ commentId:",
        commentId
      );

      await axios.delete(`/api/community/post/comment/delete/${commentId}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Comment wasn't deleted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // window.location.reload();
      router.refresh();
      return toast({
        description: "Комментарий успешно удален",
      });
    },
  });

  if (session?.user?.role === "ADMIN") {
    return (
      <ButtonDelete
        isLoading={isLoading}
        onClick={() => deleteComment(commentId)}
      >
        Удалить
      </ButtonDelete>
    );
  }
  return null;
};

export default DeleteComment;
