"use client";

import { useEffect, useMemo, useState } from "react";
import { Word } from "../types/types";
import WordModal from "./WordModal";

type RelativeFilter =
  | "all"
  | "1h"
  | "2h"
  | "today"
  | "yesterday"
  | "1w"
  | "2w"
  | "custom";

export default function WordsList() {
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  // FILTER STATES
  const [activeFilter, setActiveFilter] = useState<RelativeFilter>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // FETCH DATA
  useEffect(() => {
    fetch("/words.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load file");
        return res.json();
      })
      .then((data) => setWords(data))
      .catch((err) => console.error(err));
  }, []);

  // Helper: Convert word date + time → real Date object
  function getWordDate(word: Word) {
    return new Date(`${word.date}T${word.time}:00`);
  }

  // FILTER ENGINE
  const filteredWords = useMemo(() => {
    // Relative mock benchmark time to align with your 2026 data timeline
    const now = new Date("2026-06-23T16:30:00");

    const hourMs = 1000 * 60 * 60;
    const dayMs = hourMs * 24;

    return words.filter((word) => {
      const wordDate = getWordDate(word);
      const diffMs = now.getTime() - wordDate.getTime();

      // 1. Handle Custom Manual Range Filter
      if (activeFilter === "custom") {
        if (startDate) {
          const start = new Date(`${startDate}T00:00:00`);
          if (wordDate < start) return false;
        }
        if (endDate) {
          const end = new Date(`${endDate}T23:59:59`);
          if (wordDate > end) return false;
        }
        return true;
      }

      // 2. Handle Relative Timeline Filters
      switch (activeFilter) {
        case "1h":
          return diffMs >= 0 && diffMs <= hourMs;

        case "2h":
          return diffMs >= 0 && diffMs <= hourMs * 2;

        case "today":
          // Check if it's the exact same calendar day as 'now'
          return wordDate.toDateString() === now.toDateString();

        case "yesterday": {
          const yesterday = new Date(now.getTime() - dayMs);
          return wordDate.toDateString() === yesterday.toDateString();
        }

        case "1w":
          return diffMs >= 0 && diffMs <= dayMs * 7;

        case "2w":
          return diffMs >= 0 && diffMs <= dayMs * 14;

        case "all":
        default:
          return true;
      }
    });
  }, [words, activeFilter, startDate, endDate]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* FILTER CONTROLS BAR */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm space-y-4">
        {/* RELATIVE TIME BUTTONS */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
            Relative Timeline Filter
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "all", label: "All Time" },
              { id: "1h", label: "1 Hour" },
              { id: "2h", label: "2 Hours" },
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "1w", label: "1 Week" },
              { id: "2w", label: "2 Weeks" },
              { id: "custom", label: "Custom Range 📅" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id as RelativeFilter)}
                className={`px-3 py-1.5 text-sm font-medium border rounded-lg transition ${
                  activeFilter === btn.id
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* MANUAL DATE RANGE CONTROLS (Only shows if "Custom Range" is clicked) */}
        {activeFilter === "custom" && (
          <div className="pt-3 border-t border-gray-200 flex flex-wrap items-end gap-4 animate-in fade-in duration-200">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Start Day
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                End Day
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs font-semibold text-red-600 hover:underline pb-3"
              >
                Reset Dates
              </button>
            )}
          </div>
        )}
      </div>

      {/* METRICS & ITEM GRID CONTAINER */}
      <div className="text-sm text-gray-500 mb-4 font-medium">
        Found {filteredWords.length} matching tracking index items
      </div>

      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((w) => (
            <div
              key={w.id}
              onClick={() => setSelectedWord(w)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition hover:border-gray-400 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">{w.word}</h2>
                <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                  {w.meaning}
                </p>
              </div>
              <div className="text-xs font-mono text-gray-400 mt-4 pt-2 border-t border-gray-100 flex justify-between">
                <span>📅 {w.date}</span>
                <span>🕒 {w.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-white">
          <p className="text-gray-400">
            No matching indexes align within this evaluation cycle window.
          </p>
        </div>
      )}

      {/* MODAL WORKFLOW */}
      {selectedWord && (
        <WordModal
          key={selectedWord.id}
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onDelete={(id) => {
            setWords((prev) => prev.filter((w) => w.id !== id));
            setSelectedWord(null);
          }}
          onSave={(updatedWord) => {
            setWords((prev) =>
              prev.map((w) => (w.id === updatedWord.id ? updatedWord : w)),
            );
            setSelectedWord(updatedWord);
          }}
        />
      )}
    </div>
  );
}
