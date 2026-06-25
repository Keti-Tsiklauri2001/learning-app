"use client";

type DeleteDeckModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  deckName: string;
};

export default function DeleteDeckModal({
  onConfirm,
  onCancel,
  deckName,
}: DeleteDeckModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 w-full max-w-md shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div>
          <h3 className="text-lg font-bold text-red-600">
            Delete Language Deck?
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Are you sure you want to permanently discard{" "}
            <span className="font-semibold text-gray-900">{deckName}</span>?
            This will wipe out all tracking indexes located inside.
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            className="text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-lg font-medium transition"
          >
            No, Keep It
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white text-sm px-4 py-2 rounded-lg font-medium transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
