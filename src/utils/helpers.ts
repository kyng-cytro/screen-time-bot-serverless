import dayjs from "dayjs";
import { Movies, Shows } from "../types";
import { GREETINGS } from "../constants";
import { InputMediaBuilder } from "grammy";

export const randomGreeting = () => {
  return titleCase({
    str: GREETINGS[Math.floor(Math.random() * GREETINGS.length)]!,
  });
};

export const titleCase = ({ str }: { str: string }) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const trimSummary = ({
  summary,
  chars = 200,
}: {
  summary: string;
  chars?: number;
}) => {
  return summary.slice(0, chars) + (summary.length > chars ? ".." : summary);
};

export const formatDate = ({
  date,
  format = "MMMM d, YYYY",
}: {
  date?: string;
  format?: string;
}) => {
  if (!date) return dayjs().format(format);
  return dayjs(date).format(format);
};

export const generatePHPSESSID = ({ length = 26 }: { length?: number }) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let phpsessid = "";
  for (let i = 0; i < length; i++) {
    phpsessid += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return phpsessid;
};

export const movieUrlTransform = ({ url }: { url: string }) => {
  const urlWithoutSearchParams = url.split("?")[0];
  const urlWithoutResizeAndId = urlWithoutSearchParams
    .replace(/\/resize\/.*?\//, "/")
    .replace(/\/[a-z0-9]+$/, "");
  return urlWithoutResizeAndId;
};

export const chunkalize = ({
  data,
  chunkSize = 4,
}: {
  data: Movies | Shows;
  chunkSize?: number;
}) => {
  const chunks = Array.from(
    { length: Math.ceil(data.length / chunkSize) },
    (_, i) => data.slice(i * chunkSize, i * chunkSize + chunkSize),
  );
  return chunks;
};

export const createCaption = ({ chunk }: { chunk: Shows | Movies }) => {
  return chunk.reduce((caption, show) => {
    return (
      caption +
      `\n\n*${show.title}*\n${show.summary}\n_${show.date}_\n[👀 Read More](${show.link})`
    );
  }, "");
};

export const createMediaGroup = ({
  chunk,
  caption,
}: {
  chunk: Shows | Movies;
  caption: string;
}) => {
  return chunk.map((show, id) =>
    InputMediaBuilder.photo(show.image, {
      caption: id === 0 ? caption : "",
      parse_mode: "Markdown",
    }),
  );
};
