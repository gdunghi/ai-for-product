"use client";

import { useState } from "react";
import { Tab, TodoItem } from "../types";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function offsetDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const INITIAL_TODOS: TodoItem[] = [
  { id: "1", text: "Prepare Q2 report", deadline: offsetDaysISO(1), done: false, tab: "work" },
  { id: "2", text: "Review PRs", deadline: "", done: false, tab: "work" },
  { id: "3", text: "Call dentist", deadline: todayISO(), done: false, tab: "private" },
];

export interface TodoActions {
  todos: TodoItem[];
  addTodo: (text: string, deadline: string, tab: Tab) => void;
  removeTodo: (id: string) => void;
  toggleDone: (id: string) => void;
  clearCompleted: (tab: Tab) => void;
}

export function useTodos(): TodoActions {
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);

  function addTodo(text: string, deadline: string, tab: Tab) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: trimmed, deadline, done: false, tab },
    ]);
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleDone(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function clearCompleted(tab: Tab) {
    setTodos((prev) => prev.filter((t) => t.tab !== tab || !t.done));
  }

  return { todos, addTodo, removeTodo, toggleDone, clearCompleted };
}
