import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removePolishChars(elem: string): string {
  const regExp: RegExp = /ą|ć|ę|ł|ń|ó|ś|ź|ż/gi;
  return elem.replace(regExp, function (match: string): string {
    switch (match.toLowerCase()) {
      case "ą":
        return "a";
      case "ć":
        return "c";
      case "ę":
        return "e";
      case "ł":
        return "l";
      case "ń":
        return "n";
      case "ó":
        return "o";
      case "ś":
        return "s";
      case "ź":
      case "ż":
        return "z";
      default:
        return match;
    }
  });
}
