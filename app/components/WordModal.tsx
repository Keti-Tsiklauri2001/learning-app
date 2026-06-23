"use client";

import { useState } from "react"; // Removed useEffect
import Image from "next/image";
import { Word } from "../types/types";

type WordModalProps = {
  word: Word;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSave: (updatedWord: Word) => void;
};

export default function WordModal({
  word,
  onClose,
  onDelete,
  onSave,
}: WordModalProps) {
  // These will now initialize fresh every time a new key is passed from the parent
  const [isEditing, setIsEditing] = useState(false);
  const [editedWord, setEditedWord] = useState<Word>(word);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  function handleCancel() {
    setEditedWord(word);
    setIsEditing(false);
  }

  function handleSave() {
    onSave(editedWord);
    setIsEditing(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 "
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ... Rest of your component markup stays exactly the same ... */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <Image
            src="/images/close-icon.svg"
            alt="close"
            width={25}
            height={25}
            className="cursor-pointer"
          />
        </button>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
              className="text-sm text-blue-600 cursor-pointer"
            >
              {isEditing ? (
                "Cancel"
              ) : (
                <Image
                  src="images/edit-icon.svg"
                  width={20}
                  height={20}
                  alt="edit"
                />
              )}
            </button>
            <Image
              onClick={() => setShowDeleteConfirm(true)}
              alt="delete"
              width={20}
              height={20}
              src="images/delete-icon.svg"
              className="cursor-pointer"
            />
          </div>
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-xl">
              <p className="text-lg font-semibold mb-6 text-center">
                Are you sure you want to delete this word?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => onDelete(editedWord.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
                >
                  Yes
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {isEditing ? (
          <>
            <input
              value={editedWord.word}
              onChange={(e) =>
                setEditedWord({ ...editedWord, word: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-3"
            />
            <textarea
              value={editedWord.meaning}
              onChange={(e) =>
                setEditedWord({ ...editedWord, meaning: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              rows={4}
            />
            <button
              onClick={handleSave}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg cursor-pointer"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">{word.word}</h2>
            <p className="mt-3 text-gray-600">{word.meaning}</p>
          </>
        )}
      </div>
    </div>
  );
}
