import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import PostFeed from "../PostFeed";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

const CustomFeed = async () => {
  const session = await getServerSession(authOptions);

  // only rendered if session exists, so this will not happen
  if (!session) return notFound();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      community: true,
    },
  });

  // Получение списка постов
  const posts = await db.post.findMany({
    // Условие поиска - фильтрации по сообществам, на которые подписан пользователь
    where: {
      community: {
        name: {
          in: followedCommunities.map((sub) => sub.community.name),
        },
      },
    },
    // Сортировка найденных постов по дате создания в убывающем порядке,
    // чтобы новые посты отображались первыми
    orderBy: {
      createdAt: "desc",
    },
    // Включение в результат запроса дополнительных данных о постах
    include: {
      votes: true, // информация о голосах для каждого поста
      author: true, // информация об авторе каждого поста
      comments: true, // комментарии к постам
      community: true, // информация о сообществе, к которому относится пост
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
