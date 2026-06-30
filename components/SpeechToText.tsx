"use client";

import { useEffect } from "react";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

export const SpeechToText = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser does not support speech recognition");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = async () => {
    resetTranscript(); // clear old text
    await SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: "en-IN",
    });
  };

  useEffect(() => {
    if (!listening) {
      console.log("Mic stopped");
    }
  }, [listening]);

  useEffect(() => {
    console.log("Listening:", listening);
  }, [listening]);

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  console.log(transcript);
  
  return (
    <main className="flex items-center justify-center text-white">
      <div className="w-full max-w-2xl p-6 rounded-2xl shadow-2xl bg-gray-900 border border-gray-700">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          🎤 Speech to Text App
        </h1>

        {/* Status */}
        <div className="text-center mb-4">
          <span
            className={`px-4 py-1 rounded-full text-sm ${
              listening ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {listening ? "Listening..." : "Not Listening"}
          </span>
        </div>

        {/* Transcript Box */}
        <div className="bg-gray-800 p-4 rounded-lg h-40 overflow-y-auto mb-4 border border-gray-600">
          {transcript || "Start speaking to see text..."}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={startListening}
            className="bg-green-600 cursor-pointer hover:bg-green-700 px-4 py-2 rounded-lg transition"
          >
            Start 🎙️
          </button>

          <button
            onClick={stopListening}
            className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 px-4 py-2 rounded-lg transition"
          >
            Stop ⏹️
          </button>

          <button
            onClick={resetTranscript}
            className="bg-red-600 cursor-pointer hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Reset 🔄
          </button>
        </div>
      </div>
    </main>
  );
};


