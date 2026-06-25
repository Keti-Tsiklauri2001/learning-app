"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Word } from "../types/types";

// Explicit local interface matching your exact data structure
interface LanguageDeck {
  id: number;
  deck: string; // "English", "Spanish", etc.
  words: Word[];
}

type TimeFilter = "1h" | "2h" | "1d" | "1w" | "all";

export default function QuizPage() {
  const params = useParams();

  // Resolves the standard Next.js dynamic routing parameter (e.g., /quiz/[deckname])
  const deckNameParam =
    typeof params.deckname === "string"
      ? decodeURIComponent(params.deckname).toLowerCase()
      : "";

  const [decks, setDecks] = useState<LanguageDeck[]>([]);

  // Game Configuration States
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("1d");
  const [count, setCount] = useState<number>(10);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  // Active Gameplay States
  const [quizCards, setQuizCards] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 1. LOAD DATA FROM LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem("decks");
    if (saved) {
      try {
        setDecks(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing decks from localStorage:", err);
      }
    }
  }, []);

  // 2. EXTRACT ACTIVE DECK USING THE CORRECT 'deck' PROPERTY
  // 2. EXTRACT ACTIVE DECK USING THE CORRECT 'deck' PROPERTY
  const activeDeck = useMemo(() => {
    return decks.find((d) => d?.deck && d.deck.toLowerCase() === deckNameParam);
  }, [decks, deckNameParam]);

  // 3. COMPILE AND IMMUTABLY FREEZE PLAYING CARDS ON ROUND START
  const startQuizEngine = () => {
    if (!activeDeck?.words || activeDeck.words.length === 0) return;

    // Fixed 2026 baseline to match evaluation timelines seamlessly
    const now = new Date("2026-06-25T14:30:00");
    const hour = 1000 * 60 * 60;
    const day = hour * 24;

    // Filter by timeframe
    const filtered = activeDeck.words.filter((card) => {
      const cardDate = new Date(`${card.date}T${card.time}`);
      const diff = now.getTime() - cardDate.getTime();

      switch (timeFilter) {
        case "1h":
          return diff >= 0 && diff <= hour;
        case "2h":
          return diff >= 0 && diff <= hour * 2;
        case "1d":
          return diff >= 0 && diff <= day;
        case "1w":
          return diff >= 0 && diff <= day * 7;
        case "all":
        default:
          return true;
      }
    });

    // Shuffle and slice to prevent mid-game state dependency shifting
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selectedSessionCards = shuffled.slice(
      0,
      count === -1 ? shuffled.length : count,
    );

    setQuizCards(selectedSessionCards);
    setCurrentIndex(0);
    setScore(0);
    setIsQuizStarted(true);
  };

  const currentCard = quizCards[currentIndex];

  // 4. GENERATE 4 DISTINCT MULTIPLE CHOICE OPTIONS
  const options = useMemo(() => {
    if (!currentCard || !activeDeck) return [];

    // Extract all potential wrong meanings from the active workspace deck
    const wrongOptionsPool = activeDeck.words
      .filter((c) => c.meaning !== currentCard.meaning)
      .map((c) => c.meaning);

    // Prevent duplicate options being selected
    const uniqueWrong = Array.from(new Set(wrongOptionsPool))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return [...uniqueWrong, currentCard.meaning].sort(
      () => Math.random() - 0.5,
    );
  }, [currentCard, activeDeck]);

  // 5. EVALUATE SELECTION
  function handleAnswer(answer: string) {
    if (selectedAnswer) return; // Input lock to prevent multi-clicking
    setSelectedAnswer(answer);

    if (answer === currentCard.meaning) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentIndex((i) => i + 1);
    }, 800);
  }

  // --- RENDERING ROUTER ---

  // SCREEN A: PRE-GAME CONFIGURATION WINDOW
  if (!isQuizStarted) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Quiz Settings</h1>
        <p className="text-gray-500 text-xs mb-6">
          Deck Workspace:{" "}
          <span className="text-blue-600 font-semibold uppercase">
            {activeDeck?.deck || deckNameParam}
          </span>
        </p>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Time Restriction Filter
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="w-full p-2.5 border border-gray-300 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="1h">Added within past 1 Hour</option>
              <option value="2h">Added within past 2 Hours</option>
              <option value="1d">Added within past 24 Hours</option>
              <option value="1w">Added within past 7 Days</option>
              <option value="all">Include Entire Deck History</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Question Volume Size
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-2.5 border border-gray-300 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value={10}>Max 10 items</option>
              <option value={20}>Max 20 items</option>
              <option value={50}>Max 50 items</option>
              <option value={-1}>Review Everything</option>
            </select>
          </div>

          <button
            onClick={startQuizEngine}
            disabled={!activeDeck || activeDeck.words.length === 0}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium p-3 rounded-xl shadow-sm transition cursor-pointer"
          >
            {!activeDeck || activeDeck.words.length === 0
              ? "No Words Available to Study"
              : "Start Session"}
          </button>
        </div>
      </div>
    );
  }

  // SCREEN B: EVALUATION RESULT METRICS SUMMARY
  if (quizCards.length === 0 || currentIndex >= quizCards.length) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
        <h1 className="text-3xl font-black text-gray-900">Quiz Finished 🎉</h1>
        <p className="text-gray-500 text-sm mt-2">
          Evaluation session has concluded perfectly.
        </p>

        <div className="my-6 p-4 bg-gray-50 rounded-xl inline-block border min-w-[140px]">
          <span className="text-xs text-gray-400 block font-mono uppercase tracking-wider">
            Final Score
          </span>
          <span className="text-3xl font-extrabold text-blue-600">{score}</span>
          <span className="text-gray-400 font-medium">
            {" "}
            / {quizCards.length}
          </span>
        </div>

        <button
          onClick={() => setIsQuizStarted(false)}
          className="block w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold p-3 rounded-xl transition cursor-pointer"
        >
          Configure Another Round
        </button>
      </div>
    );
  }

  // SCREEN C: ACTIVE INTERACTIVE QUIZ INTERFACE
  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      {/* PROGRESS TRACKER */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Question {currentIndex + 1} of {quizCards.length}
        </span>
        <h2 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
          {currentCard.word}
        </h2>
      </div>

      {/* OPTIONS SELECTION GRID */}
      <div className="grid gap-3">
        {options.map((opt, i) => {
          const isSelected = selectedAnswer === opt;
          const isCorrectAnswer = opt === currentCard.meaning;

          let btnStyle =
            "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-400";

          if (selectedAnswer) {
            if (isCorrectAnswer) {
              btnStyle =
                "bg-green-600 border-green-600 text-white shadow-md shadow-green-100";
            } else if (isSelected) {
              btnStyle =
                "bg-red-600 border-red-600 text-white shadow-md shadow-red-100";
            } else {
              btnStyle = "bg-white border-gray-100 text-gray-300 opacity-60";
            }
          }

          return (
            <button
              key={i}
              disabled={!!selectedAnswer}
              onClick={() => handleAnswer(opt)}
              className={`w-full p-4 text-left border rounded-xl font-medium text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* COMPACT DASHBOARD FOOTER */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-semibold text-gray-400 font-mono">
        <span>Deck: {activeDeck?.deck}</span>
        <span>Running Score: {score}</span>
      </div>
    </div>
  );
}
