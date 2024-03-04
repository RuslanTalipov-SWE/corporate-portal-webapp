"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

interface DeletePostButtonProps {
  postId: string;
}
const DeletePost = ({ postId }: DeletePostButtonProps) => {
  const router = useRouter();
  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async (postId: string) => {
      console.log(" ~ file: DeletePost.tsx:17 ~ mutationFn: ~ postId:", postId);

      const payload: any = {
        postId,
      };
      const { data } = await axios.delete(
        "/api/subreddit/post/delete/${postId}",
        payload
      );
      return data;
      // const { data } = await axios.delete("/api/subreddit/post/delete");
      // return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Post wasn't deleted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <Button isLoading={isLoading} onClick={() => deletePost(postId)}>
      Delete
    </Button>
  );
};
export default DeletePost;
