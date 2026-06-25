"use client";

import { useEffect, useState } from "react";
import WordsList from "./components/WordsList";

interface Word {
  id: number;
  word: string;
  meaning: string;
  date: string;
  time: string;
}

interface LanguageDeck {
  id: number;
  deck: string;
  words: Word[];
}

export default function DecksPage() {
  const [decks, setDecks] = useState<LanguageDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);

  // Modals / Action states
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [deckNameInput, setDeckNameInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Load baseline JSON
  useEffect(() => {
    fetch("/words.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDecks(data))
      .catch((err) => console.error(err));
  }, []);

  // CREATE DECK
  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckNameInput.trim()) return;

    const newDeck: LanguageDeck = {
      id: Date.now(), // safe runtime ID allocation
      deck: deckNameInput,
      words: [],
    };

    setDecks([...decks, newDeck]);
    setDeckNameInput("");
    setIsCreating(false);
  };

  // UPDATE DECK NAME
  const handleRenameDeck = (id: number) => {
    if (!deckNameInput.trim()) return;
    setDecks(
      decks.map((d) => (d.id === id ? { ...d, deck: deckNameInput } : d)),
    );
    setIsEditing(null);
    setDeckNameInput("");
  };

  // DELETE DECK
  const handleDeleteDeck = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents entering the deck route when deleting
    if (confirm("Are you sure you want to delete this language deck?")) {
      setDecks(decks.filter((d) => d.id !== id));
    }
  };

  // If a deck is clicked, render the inner word inspector view
  if (selectedDeckId !== null) {
    const currentDeck = decks.find((d) => d.id === selectedDeckId);
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedDeckId(null)}
          className="mb-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition inline-flex items-center gap-2"
        >
          ← Back to Language Decks
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Deck: <span className="text-blue-600">{currentDeck?.deck}</span>
        </h1>
        <WordsList languageId={selectedDeckId} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Language Decks</h1>
          <p className="text-gray-500 text-sm mt-1">
            Select or manage your collection review sets.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setDeckNameInput("");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          + Create New Deck
        </button>
      </div>

      {/* CREATE FORM OVERLAY / INLINE ENTRY */}
      {isCreating && (
        <form
          onSubmit={handleCreateDeck}
          className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex gap-3 items-center"
        >
          <input
            type="text"
            placeholder="Deck Name (e.g. German, Medical Vocabulary)"
            value={deckNameInput}
            onChange={(e) => setDeckNameInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="text-gray-500 text-sm hover:underline"
          >
            Cancel
          </button>
        </form>
      )}

      {/* DECKS GRID DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => setSelectedDeckId(deck.id)}
            className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div>
              {isEditing === deck.id ? (
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={deckNameInput}
                    onChange={(e) => setDeckNameInput(e.target.value)}
                    className="border p-1 text-sm rounded w-full"
                  />
                  <button
                    onClick={() => handleRenameDeck(deck.id)}
                    className="text-xs text-green-600 font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(null)}
                    className="text-xs text-gray-400"
                  >
                    X
                  </button>
                </div>
              ) : (
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {deck.deck}
                </h3>
              )}
              <p className="text-xs text-gray-400 mt-1 font-mono">
                📦 {deck.words?.length || 0} vocabulary entries
              </p>
            </div>

            {/* ACTION TOOLBAR */}
            <div
              className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity mt-4 pt-2 border-t border-gray-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setIsEditing(deck.id);
                  setDeckNameInput(deck.deck);
                }}
                className="text-xs text-gray-500 hover:text-blue-600 font-medium"
              >
                Rename
              </button>
              <button
                onClick={(e) => handleDeleteDeck(deck.id, e)}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
