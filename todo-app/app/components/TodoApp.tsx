"use client";

import { useState } from "react";

type Tab = "work" | "private";

interface TodoItem {
  id: string;
  text: string;
  deadline: string;
  done: boolean;
  tab: Tab;
}

function formatDeadline(deadline: string): { label: string; urgent: boolean; overdue: boolean } {
  if (!deadline) return { label: "", urgent: false, overdue: false };
  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: `Overdue by ${Math.abs(diffDays)}d`, urgent: false, overdue: true };
  if (diffDays === 0) return { label: "Due today", urgent: true, overdue: false };
  if (diffDays === 1) return { label: "Due tomorrow", urgent: true, overdue: false };
  return { label: `Due in ${diffDays}d`, urgent: false, overdue: false };
}

export default function TodoApp() {
  const [activeTab, setActiveTab] = useState<Tab>("work");
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Prepare Q2 report", deadline: tomorrowDate(), done: false, tab: "work" },
    { id: "2", text: "Review PRs", deadline: "", done: false, tab: "work" },
    { id: "3", text: "Call dentist", deadline: todayDate(), done: false, tab: "private" },
  ]);
  const [inputText, setInputText] = useState("");
  const [inputDeadline, setInputDeadline] = useState("");

  const visibleTodos = todos.filter((t) => t.tab === activeTab);
  const workCount = todos.filter((t) => t.tab === "work" && !t.done).length;
  const privateCount = todos.filter((t) => t.tab === "private" && !t.done).length;

  function addTodo() {
    const text = inputText.trim();
    if (!text) return;
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text,
      deadline: inputDeadline,
      done: false,
      tab: activeTab,
    };
    setTodos((prev) => [...prev, newItem]);
    setInputText("");
    setInputDeadline("");
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleDone(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Todos</h1>
          <p className="text-slate-500 text-sm mt-1">Stay on top of your tasks</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <TabButton
              label="Work"
              count={workCount}
              active={activeTab === "work"}
              color="blue"
              onClick={() => setActiveTab("work")}
            />
            <TabButton
              label="Private"
              count={privateCount}
              active={activeTab === "private"}
              color="purple"
              onClick={() => setActiveTab("private")}
            />
          </div>

          {/* Add form */}
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new task…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                className="flex-1 text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="date"
                value={inputDeadline}
                onChange={(e) => setInputDeadline(e.target.value)}
                className="text-sm rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addTodo}
                disabled={!inputText.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Todo list */}
          <ul className="divide-y divide-slate-50">
            {visibleTodos.length === 0 && (
              <li className="py-12 text-center text-slate-400 text-sm">
                No tasks yet. Add one above!
              </li>
            )}
            {visibleTodos.map((todo) => {
              const dl = formatDeadline(todo.deadline);
              return (
                <li
                  key={todo.id}
                  className={`flex items-center gap-3 px-4 py-3 group hover:bg-slate-50 transition-colors ${todo.done ? "opacity-50" : ""}`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleDone(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                      ${todo.done
                        ? "bg-green-400 border-green-400"
                        : "border-slate-300 hover:border-green-400"}`}
                    aria-label={todo.done ? "Mark undone" : "Mark done"}
                  >
                    {todo.done && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  {/* Text + deadline */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-slate-800 truncate ${todo.done ? "line-through" : ""}`}>
                      {todo.text}
                    </p>
                    {dl.label && (
                      <span
                        className={`text-xs font-medium mt-0.5 inline-block
                          ${dl.overdue ? "text-red-500" : dl.urgent ? "text-amber-500" : "text-slate-400"}`}
                      >
                        {dl.label}
                      </span>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                    aria-label="Remove task"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer summary */}
          {visibleTodos.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                {visibleTodos.filter((t) => t.done).length} / {visibleTodos.length} done
              </span>
              <button
                onClick={() => setTodos((prev) => prev.filter((t) => t.tab !== activeTab || !t.done))}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Clear completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  label,
  count,
  active,
  color,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  color: "blue" | "purple";
  onClick: () => void;
}) {
  const activeClass =
    color === "blue"
      ? "border-b-2 border-blue-500 text-blue-600"
      : "border-b-2 border-purple-500 text-purple-600";
  const badgeClass =
    color === "blue"
      ? "bg-blue-100 text-blue-600"
      : "bg-purple-100 text-purple-600";

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
        ${active ? activeClass : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"}`}
    >
      {label}
      {count > 0 && (
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${active ? badgeClass : "bg-slate-100 text-slate-400"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

function tomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
