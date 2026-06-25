"use client";

import { useEffect, useState } from "react";
import WordsList from "./components/WordsList";
import CreateDeckModal from "./components/CreteDeckModal";
import EditDeckModal from "./components/EditDeckModal";
import DeleteDeckModal from "./components/DeleteDeckModal";

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
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<LanguageDeck | null>(null);
  const [deckNameInput, setDeckNameInput] = useState("");

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
      id: Date.now(),
      deck: deckNameInput,
      words: [],
    };

    setDecks([...decks, newDeck]);
    setDeckNameInput("");
    setIsCreating(false);
  };

  // UPDATE DECK NAME
  const handleRenameDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckNameInput.trim() || isEditing === null) return;

    setDecks(
      decks.map((d) =>
        d.id === isEditing ? { ...d, deck: deckNameInput } : d,
      ),
    );
    setIsEditing(null);
    setDeckNameInput("");
  };

  // CONFIRM DELETE DECK FROM MODAL
  const confirmDeleteDeck = () => {
    if (!deckToDelete) return;
    setDecks(decks.filter((d) => d.id !== deckToDelete.id));
    setDeckToDelete(null);
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
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">
            Language Decks
          </h1>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setDeckNameInput("");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 cursor-pointer rounded-xl shadow-sm transition"
        >
          + Create New Deck
        </button>
      </div>

      {/* DECKS GRID DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => setSelectedDeckId(deck.id)}
            className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                {deck.deck}
              </h3>

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
                onClick={() => setDeckToDelete(deck)}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS MOUNT PORTS */}
      {isCreating && (
        <CreateDeckModal
          handleCreateDeck={handleCreateDeck}
          deckNameInput={deckNameInput}
          setDeckNameInput={setDeckNameInput}
          setIsCreating={setIsCreating}
        />
      )}

      {isEditing !== null && (
        <EditDeckModal
          handleRenameDeck={handleRenameDeck}
          deckNameInput={deckNameInput}
          setDeckNameInput={setDeckNameInput}
          setIsEditing={setIsEditing}
        />
      )}

      {deckToDelete && (
        <DeleteDeckModal
          deckName={deckToDelete.deck}
          onConfirm={confirmDeleteDeck}
          onCancel={() => setDeckToDelete(null)}
        />
      )}
    </div>
  );
}
