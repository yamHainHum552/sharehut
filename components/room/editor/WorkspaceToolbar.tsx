"use client";

import { FileText, Folder, Pencil } from "lucide-react";

type Mode = "text" | "files" | "draw";

export default function WorkspaceToolbar({
  mode,
  setMode,
  mobile = false,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  mobile?: boolean;
}) {
  const tabs = [
    { value: "text", label: "Text", icon: <FileText size={18} /> },
    { value: "files", label: "Files", icon: <Folder size={18} /> },
    { value: "draw", label: "Draw", icon: <Pencil size={18} /> },
  ];

  /* ---------------- Mobile Bottom Tabs ---------------- */

  if (mobile) {
    return (
      <div className="flex justify-around items-center py-3">
        {tabs.map((tab) => {
          const isActive = mode === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setMode(tab.value)}
              className={`
                flex flex-col items-center justify-center gap-1
                text-xs font-medium transition
                ${
                  isActive
                    ? "text-purple-400"
                    : "text-neutral-500 hover:text-white"
                }
              `}
            >
              <div
                className={`
                  p-2 rounded-lg transition
                  ${isActive ? "bg-purple-600/20" : "bg-transparent"}
                `}
              >
                {tab.icon}
              </div>
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  /* ---------------- Desktop Tabs ---------------- */

  return (
    <div className="relative inline-flex p-1 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl shadow-inner">
      {tabs.map((tab) => {
        const isActive = mode === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => setMode(tab.value)}
            className={`
              relative z-10 flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isActive ? "text-white" : "text-neutral-400 hover:text-white"}
            `}
          >
            {tab.icon}
            {tab.label}

            {isActive && (
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg -z-10 shadow-md" />
            )}
          </button>
        );
      })}
    </div>
  );
}
