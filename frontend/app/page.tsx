"use client";
import { useState } from "react";

export default function Home() {
  const [sentence, setSentence] = useState("");

  const handleInputChange = (event) => {
    setSentence(event.target.value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enter a Sentence</h1>
      <input
        type="text"
        value={sentence}
        onChange={handleInputChange}
        placeholder="Type your sentence here..."
        className="w-full p-2 border rounded"
      />
      {sentence && (
        <div className="mt-4">
          <p className="font-medium">You entered:</p>
          <p className="text-lg">{sentence}</p>
        </div>
      )}
    </div>
  );
}
