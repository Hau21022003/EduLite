"use client";

import { useState } from "react";

export default function TextToSpeechPage() {
  const [text, setText] = useState("Hello, I am a speaking app!");

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ Text-to-Speech!");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // giọng tiếng Anh
    utterance.rate = 1; // tốc độ đọc (0.5 - 2)
    utterance.pitch = 1; // cao độ giọng (0 - 2)

    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-[300px] p-2 border rounded"
      />

      <button
        onClick={speak}
        className="px-6 py-2 bg-green-600 text-white rounded-lg"
      >
        🔊 Speak
      </button>
    </main>
  );
}
