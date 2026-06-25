"use client";

type EditDeckModalProps = {
  handleRenameDeck: (e: React.FormEvent) => void;
  deckNameInput: string;
  setDeckNameInput: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function EditDeckModal({
  handleRenameDeck,
  deckNameInput,
  setDeckNameInput,
  setIsEditing,
}: EditDeckModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleRenameDeck}
        className="bg-white p-6 rounded-2xl border border-gray-100 w-full max-w-md shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">Rename Deck</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify the contextual reference tag for this set.
          </p>
        </div>

        <input
          type="text"
          value={deckNameInput}
          onChange={(e) => setDeckNameInput(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
          autoFocus
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setIsEditing(null)}
            className="text-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-200 text-sm px-4 py-2 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#03a43b] cursor-pointer hover:bg-[#036732] text-white text-sm px-4 py-2 rounded-lg font-medium transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
