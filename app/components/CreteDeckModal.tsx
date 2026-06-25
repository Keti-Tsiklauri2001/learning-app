"use client";

type CreateDeckModalProps = {
  handleCreateDeck: (e: React.FormEvent) => void;
  deckNameInput: string;
  setDeckNameInput: React.Dispatch<React.SetStateAction<string>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateDeckModal({
  handleCreateDeck,
  deckNameInput,
  setDeckNameInput,
  setIsCreating,
}: CreateDeckModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleCreateDeck}
        className="bg-white p-6 rounded-2xl border border-gray-100 w-full max-w-md shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">Create New Deck</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Add a new collection review set to group your vocabulary cards.
          </p>
        </div>

        <input
          type="text"
          placeholder="Deck Name (e.g. German, Medical Vocabulary)"
          value={deckNameInput}
          onChange={(e) => setDeckNameInput(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
          autoFocus
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition"
          >
            Create Deck
          </button>
        </div>
      </form>
    </div>
  );
}
