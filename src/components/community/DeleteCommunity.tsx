"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ButtonDelete } from "../ui/ButtonDelete";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DeleteCommunityButtonProps {
  communityId: string;
}
const DeleteCommunity = ({ communityId }: DeleteCommunityButtonProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: deleteCommunity, isLoading } = useMutation({
    mutationFn: async (communityId: string) => {
      console.log(
        " ~ file: DeleteCommunity.tsx ~ mutationFn: ~ communityId:",
        communityId
      );

      await axios.delete(`/api/community/delete/${communityId}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Community wasn't deleted successfully, please try again.",
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
        onClick={() => deleteCommunity(communityId)}
      >
        Удалить
      </ButtonDelete>
    );
  }
  return null;
};

export default DeleteCommunity;
