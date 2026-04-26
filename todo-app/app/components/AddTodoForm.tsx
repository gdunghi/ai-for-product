"use client";

import { useState } from "react";

interface AddTodoFormProps {
  onAdd: (text: string, deadline: string) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  function handleAdd() {
    if (!text.trim()) return;
    onAdd(text, deadline);
    setText("");
    setDeadline("");
  }

  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Add a new task…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 text-sm rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 sm:flex-none text-sm rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="whitespace-nowrap bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
