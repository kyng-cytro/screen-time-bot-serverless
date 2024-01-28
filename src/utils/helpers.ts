import { GREETINGS } from "../constants";

export const randomGreeting = () => {
  return titleCase(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]!);
};

export const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};
