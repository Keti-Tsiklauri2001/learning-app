"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import CreateDeckModal from "../components/CreateDeckModal";

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
  const router = useRouter(); // Initialize router
  const [decks, setDecks] = useState<LanguageDeck[]>([]);

  // UI Modal Controls
  const [isCreating, setIsCreating] = useState(false);
  // const [isEditing, setIsEditing] = useState<number | null>(null);
  // const [deckToDelete, setDeckToDelete] = useState<LanguageDeck | null>(null);
  const [deckNameInput, setDeckNameInput] = useState("");

  useEffect(() => {
    const savedIndex = localStorage.getItem("deck_index");

    if (savedIndex) {
      try {
        const parsedIndex: LanguageDeck[] = JSON.parse(savedIndex);
        const hydratedDecks = parsedIndex.map((d) => {
          const rawWords = localStorage.getItem(`deck/${d.deck.toLowerCase()}`);
          const wordsArray: Word[] = rawWords ? JSON.parse(rawWords) : [];
          return { ...d, words: wordsArray };
        });
        setDecks(hydratedDecks);
      } catch (e) {
        console.error("Failed to parse localized tracking indexes:", e);
      }
    } else {
      fetch("/words.json")
        .then((res) => (res.ok ? res.json() : []))
        .then((data: LanguageDeck[]) => {
          const indexArray: Omit<LanguageDeck, "words">[] = [];

          data.forEach((item) => {
            const normalizedKey = `deck/${item.deck.toLowerCase()}`;
            localStorage.setItem(
              normalizedKey,
              JSON.stringify(item.words || []),
            );
            indexArray.push({ id: item.id, deck: item.deck });
          });

          localStorage.setItem("deck_index", JSON.stringify(indexArray));
          setDecks(data);
        })
        .catch((err) => console.error("Error fetching baseline records:", err));
    }
  }, []);

  const updateAndPersistDecks = (updatedSet: LanguageDeck[]) => {
    setDecks(updatedSet);
    const indexArray = updatedSet.map(({ id, deck }) => ({ id, deck }));
    localStorage.setItem("deck_index", JSON.stringify(indexArray));
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckNameInput.trim()) return;

    const cleanName = deckNameInput.trim();
    const targetStorageKey = `deck/${cleanName.toLowerCase()}`;

    if (localStorage.getItem(targetStorageKey)) {
      alert("A deck with this name already exists!");
      return;
    }

    localStorage.setItem(targetStorageKey, JSON.stringify([]));

    const newDeck: LanguageDeck = {
      id: Date.now(),
      deck: cleanName,
      words: [],
    };

    updateAndPersistDecks([...decks, newDeck]);
    setDeckNameInput("");
    setIsCreating(false);
  };

  // const handleRenameDeck = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const targetDeck = decks.find((d) => d.id === isEditing);
  //   if (!deckNameInput.trim() || !targetDeck || isEditing === null) return;

  //   const oldCleanName = targetDeck.deck.toLowerCase();
  //   const newCleanName = deckNameInput.trim();
  //   const newStorageKey = `deck/${newCleanName.toLowerCase()}`;

  //   const existingWordsData =
  //     localStorage.getItem(`deck/${oldCleanName}`) || "[]";
  //   localStorage.setItem(newStorageKey, existingWordsData);
  //   localStorage.removeItem(`deck/${oldCleanName}`);

  //   const updated = decks.map((d) =>
  //     d.id === isEditing ? { ...d, deck: newCleanName } : d,
  //   );

  //   updateAndPersistDecks(updated);
  //   setIsEditing(null);
  //   setDeckNameInput("");
  // };

  // const confirmDeleteDeck = () => {
  //   if (!deckToDelete) return;

  //   const targetKeyName = `deck/${deckToDelete.deck.toLowerCase()}`;
  //   localStorage.removeItem(targetKeyName);

  //   const updated = decks.filter((d) => d.id !== deckToDelete.id);
  //   updateAndPersistDecks(updated);
  //   setDeckToDelete(null);
  // };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ACTION HEADER BAR */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">
            Language Decks
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Select a workspace deck to view or start custom quiz reviews.
          </p>
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

      {/* INTERACTIVE GRID DISPATCHER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div
            key={deck.id}
            // CHANGED: Use programmatic navigation on the outer wrapper container instead of Link component
            onClick={() => {
              router.push(
                `/${encodeURIComponent(deck.deck?.toLowerCase() || "")}`,
              );
            }}
            className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between min-h-[140px] cursor-pointer"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                {deck.deck}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                📦 {deck.words?.length || 0} vocabulary entries
              </p>
            </div>

            {/* ACTION FOOTER BAR */}
            <div
              className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity mt-4 pt-2 border-t border-gray-50"
              onClick={(e) => {
                // This now effectively blocks execution context bubbles up to outer div!
                e.stopPropagation();
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* OVERLAY MANAGEMENT MODALS */}
      {isCreating && (
        <CreateDeckModal
          handleCreateDeck={handleCreateDeck}
          deckNameInput={deckNameInput}
          setDeckNameInput={setDeckNameInput}
          setIsCreating={setIsCreating}
        />
      )}
    </div>
  );
}
