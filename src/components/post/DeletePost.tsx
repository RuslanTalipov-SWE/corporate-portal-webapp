// src/components/post/DeletePost.tsx
"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ButtonDelete } from "../ui/ButtonDelete";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
  postId: string;
}
const DeletePost = ({ postId }: DeletePostButtonProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async (postId: string) => {
      console.log({
        timestamp: new Date().toISOString(),
        file: "DeletePost.tsx",
        action: "mutationFn",
        postId,
      });

      console.log(`Пользователь ${session.user.id} удалил пост ID: ${postId}`);

      await axios.delete(`/api/community/post/delete/${postId}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Post wasn't deleted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // window.location.reload();
      router.refresh();
      toast({
        description: "Пост успешно удален",
      });
    },
  });

  if (session?.user?.role === "ADMIN") {
    return (
      <ButtonDelete isLoading={isLoading} onClick={() => deletePost(postId)}>
        Удалить
      </ButtonDelete>
    );
  }
  return null;
};

export default DeletePost;
