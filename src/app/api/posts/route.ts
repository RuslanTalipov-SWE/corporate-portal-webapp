// src/app/api/posts/route.ts
// Импорт необходимых модулей и настроек
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  // Парсинг URL запроса
  const url = new URL(req.url);

  // Получение сессии пользователя для определения его подписок
  const session = await getServerSession(authOptions);

  let followedCommunitiesIds: string[] = [];

  // Если пользователь аутентифицирован, получаем ID сообществ, на которые он подписан
  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        community: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map((sub) => sub.community.id);
  }

  try {
    // Валидация и извлечение параметров запроса
    const { limit, page, communityName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        communityName: z.string().nullish().optional(),
      })
      .parse({
        communityName: url.searchParams.get("communityName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    // Формирование условия фильтрации постов
    let whereClause = {};

    if (communityName) {
      whereClause = {
        community: {
          name: communityName,
        },
      };
    } else if (session) {
      whereClause = {
        community: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    // Получение списка постов с учетом фильтрации и пагинации
    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: "desc",
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    // Возвращение списка постов
    return new Response(JSON.stringify(posts));
  } catch (error) {
    // Обработка ошибок при запросе постов
    return new Response("Не удалось загрузить посты", { status: 500 });
  }
}

/*Пагинация в данном коде работает на основе двух параметров запроса: limit и page.
 Эти параметры используются для управления количеством отображаемых постов и
их разбиением на страницы в новостной ленте.
•	limit: Определяет максимальное количество постов, которые должны быть
 показаны на одной странице новостной ленты.
•	page: Указывает на номер текущей страницы, на которую пользователь хочет
перейти или которую он просматривает в данный момент.
Механизм работы пагинации:
1.	Расчет пропускаемых записей (skip): Чтобы определить, с какого поста
 начинать выборку для текущей страницы, используется формула
 (parseInt(page) - 1) * parseInt(limit). Это позволяет "пропустить" 
все посты предыдущих страниц и начать выборку с первого поста текущей страницы. 
Например, если page равно 2 и limit равно 10, то пропускаются первые 10 постов ((2-1) * 10), 
и выборка начинается с 11-го поста.
2.	Ограничение количества выбираемых записей (take): Параметр limit
 прямо указывает на количество постов, которое должно быть извлечено из
 базы данных для отображения на текущей странице. Таким образом, если limit равно 10, 
то для каждой страницы будет извлекаться максимум 10 постов.
В результате, используя параметры limit и page в запросе, API динамически подгружает 
соответствующий набор постов для каждой страницы новостной ленты, обеспечивая бесконечную прокрутку. 
Пользователь может продолжать прокручивать страницу, и при достижении конца текущего списка постов, 
будут запрашиваться данные для следующей страницы, что создает иллюзию непрерывного потока контента.*/
