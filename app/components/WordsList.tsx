"use client";

import { useEffect, useState } from "react";
import { Word } from "../types/types";
import WordModal from "./WordModal"; // Adjust path if your files are configured differently

export default function WordsList() {
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  // Fetch words from local JSON file
  useEffect(() => {
    fetch("/data/words.json")
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);

  // Update a word in the list when edited via modal
  function handleSaveWord(updatedWord: Word) {
    setWords((prevWords) =>
      prevWords.map((w) => (w.id === updatedWord.id ? updatedWord : w)),
    );
    setSelectedWord(null); // Close the modal after saving
  }

  // Remove a word from the list when deleted via modal
  function handleDeleteWord(id: number) {
    setWords((prevWords) => prevWords.filter((w) => w.id !== id));
    setSelectedWord(null); // Close the modal after deleting
  }

  return (
    <div className="p-4">
      {/* GRID DISPLAY OF WORDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((w: Word) => (
          <div
            key={w.id}
            onClick={() => setSelectedWord(w)} // Clicking a card opens the modal
            className="bg-white rounded-xl p-4 shadow border border-gray-200 cursor-pointer hover:border-gray-400 hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-bold text-gray-900">{w.word}</h2>
            <p className="text-gray-600 mt-2 line-clamp-2">{w.meaning}</p>
          </div>
        ))}
      </div>

      {/* WORD MODAL DETACHED CONTROLLER */}
      {selectedWord && (
        <WordModal
          key={selectedWord.id} // Prevents "cascading render" state sync error
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onDelete={handleDeleteWord}
          onSave={handleSaveWord}
        />
      )}
    </div>
  );
}
