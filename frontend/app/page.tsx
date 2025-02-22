"use client";
import { useState, ChangeEvent } from "react";

export default function Home() {
  const [sentence, setSentence] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSentence(event.target.value);
  };

  const handleSubmit = async () => {
    if (!sentence) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence }),
      });

      if (!res.ok) throw new Error("Failed to send sentence.");

      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error sending sentence.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enter a Sentence</h1>
      <input
        type="text"
        value={sentence}
        onChange={handleInputChange}
        placeholder="Type your sentence here..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {response && (
        <div className="mt-4">
          <p className="font-medium">API Response:</p>
          <p className="text-lg">{response}</p>
        </div>
      )}
    </div>
  );
}
