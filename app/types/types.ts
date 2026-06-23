export type Word = {
  id: number;
  word: string;
  meaning: string;
  date: `${number}-${number}-${number}`; // optional strict format
  time: string; // e.g. "13:15"
};
