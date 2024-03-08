"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ButtonDelete } from "../ui/ButtonDelete";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DeleteSubredditButtonProps {
  subredditId: string;
}
const DeleteSubreddit = ({ subredditId }: DeleteSubredditButtonProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: deleteSubreddit, isLoading } = useMutation({
    mutationFn: async (subredditId: string) => {
      console.log(
        " ~ file: DeleteSubreddit.tsx ~ mutationFn: ~ subredditId:",
        subredditId
      );

      await axios.delete(`/api/subreddit/delete/${subredditId}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Subreddit wasn't deleted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push("/");

      return toast({
        description: "Сообщество успешно удалено",
      });
    },
  });

  if (session?.user?.role === "ADMIN") {
    return (
      <ButtonDelete
        isLoading={isLoading}
        onClick={() => deleteSubreddit(subredditId)}
      >
        Delete
      </ButtonDelete>
    );
  }
  return null;
};

export default DeleteSubreddit;
