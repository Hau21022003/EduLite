"use client";

import { useState, useRef } from "react";

// Khai báo type tạm cho Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start: () => void;
    stop: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
  }
}

export default function Home() {
  const [text, setText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Trình duyệt của bạn không hỗ trợ Web Speech API!");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = "en-US"; // tiếng Anh
    recognition.interimResults = false; // chỉ lấy kết quả cuối
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    // Lưu lại instance để có thể stop sau này
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="flex gap-4">
        <button
          onClick={startListening}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          🎤 Start
        </button>
        <button
          onClick={stopListening}
          className="px-6 py-2 bg-red-600 text-white rounded-lg"
        >
          ⏹ Stop
        </button>
      </div>

      <div className="p-4 border rounded-lg min-h-[50px] w-[300px] text-center">
        {text || "Say something in English..."}
      </div>
    </main>
  );
}
