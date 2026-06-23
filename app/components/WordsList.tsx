"use client";

import { useEffect, useState } from "react";
import { Word } from "../types/types";

export default function WordsList() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch("/data/words.json")
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);
  console.log(1);
  return (
    <div>
      <p>hbh</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((w: Word) => (
          <div
            key={w.id}
            className="bg-white rounded-xl p-4 shadow border border-gray-200 cursor-pointer hover:border-gray-400 hover:shadow-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900">{w.word}</h2>

            <p className="text-gray-600 mt-2">{w.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
