import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import ToFeedButton from "@/components/ToFeedButton";
import { buttonVariants } from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

import DeleteSubreddit from "@/components/subreddit/DeleteSubreddit";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = await getServerSession(authOptions);

  const subreddit = await db.subreddit.findFirst({
    where: { name: decodeURI(slug) },
    include: {
      Creator: true, // Fetch the creator's information
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: decodeURI(slug),
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: decodeURI(slug),
      },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <ToFeedButton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          {/* info sidebar */}
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="bg-customColor px-6 py-4">
              <p className="font-semibold py-3 text-white">О сообществе</p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="font-semibold text-sm py-1 text-gray-700">
                  {subreddit.description}
                </p>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Создано</dt>
                <dd className="text-gray-700">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, "d.MM.yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Подписчиков</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-700">{memberCount}</div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user?.id ? (
                <div className="flex justify-between py-3">
                  <dt className="text-gray-500">Вы создали это сообщество</dt>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between py-3">
                    <dt className="text-gray-500">Модератор:</dt>
                    <dd className="text-gray-700">
                      {subreddit.Creator?.username}
                    </dd>
                  </div>
                  <div className="text-right mb-6">
                    <dd className="text-gray-700">
                      {subreddit.Creator?.email}
                    </dd>
                  </div>
                </div>
              )}

              {subreddit.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mb-6",
                })}
                href={`r/${slug}/submit`}
              >
                Создать пост
              </Link>
              {/* Delete Post Button */}
              <DeleteSubreddit subredditId={subreddit.id} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
