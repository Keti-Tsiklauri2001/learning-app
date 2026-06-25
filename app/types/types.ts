export type Word = {
  id: number;
  word: string;
  meaning: string;
  date: string;
  time: string;
};
export type Deck = {
  id: number;
  deck: string;
  words: Word[];
};
