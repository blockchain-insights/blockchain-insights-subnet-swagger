import { twMerge } from "tailwind-merge";

export function cn(...classNames) {
  let classNamesToBeReturned = [];

  classNames.filter(Boolean).forEach((className) => {
    if (className) {
      if (typeof className === "string") {
        classNamesToBeReturned.push(className);
      } else {
        const entries = Object.entries(className);

        entries.forEach(([key, value]) => {
          if (value) {
            classNamesToBeReturned.push(key);
          }
        });
      }
    }
  });

  return twMerge(classNamesToBeReturned.join(" "));
}
