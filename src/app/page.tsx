"use client";

import { useState } from "react";
import VideoEditor from "@/components/VideoEditor";
import GameEditor from "@/components/GameEditor";

type EditorMode = "video" | "game";

export default function Home() {
  const [mode, setMode] = useState<EditorMode>("video");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              AI Editing Studio
            </span>
          </div>

          {/* Mode tabs */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => setMode("video")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "video"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🎬 Video Editing
            </button>
            <button
              onClick={() => setMode("game")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "game"
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🎮 Game Editing
            </button>
          </div>

          <div className="text-xs text-gray-500 hidden sm:block">
            Powered by AI
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {mode === "video" ? <VideoEditor /> : <GameEditor />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        AI Editing Studio — Upload your files, describe your vision, and let AI
        do the rest.
      </footer>
    </div>
  );
}
