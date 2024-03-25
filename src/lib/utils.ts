import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "только что",
  xSeconds: "только что",
  halfAMinute: "только что",
  lessThanXMinutes: "{{count}}мин",
  xMinutes: "{{count}}мин",
  aboutXHours: "{{count}}ч",
  xHours: "{{count}}ч",
  xDays: "{{count}}дн",
  aboutXWeeks: "{{count}}нед",
  xWeeks: "{{count}}нед",
  aboutXMonths: "{{count}}мес",
  xMonths: "{{count}}мес",
  aboutXYears: "{{count}}лет",
  xYears: "{{count}}лет",
  overXYears: "{{count}}лет",
  almostXYears: "{{count}}лет",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "только что") return result;
      return result + " назад";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}
