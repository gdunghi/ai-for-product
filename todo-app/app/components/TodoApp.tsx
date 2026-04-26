"use client";

import { useState } from "react";
import { Tab } from "../types";
import { useTodos } from "../hooks/useTodos";
import TabBar from "./TabBar";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";
import TodoFooter from "./TodoFooter";

export default function TodoApp() {
  const [activeTab, setActiveTab] = useState<Tab>("work");
  const { todos, addTodo, removeTodo, toggleDone, clearCompleted } = useTodos();

  const visibleTodos = todos.filter((t) => t.tab === activeTab);
  const counts: Record<Tab, number> = {
    work: todos.filter((t) => t.tab === "work" && !t.done).length,
    private: todos.filter((t) => t.tab === "private" && !t.done).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center pt-8 sm:pt-16 px-4 pb-8">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Todos</h1>
          <p className="text-slate-500 text-sm mt-1">Stay on top of your tasks</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <TabBar activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />
          <AddTodoForm onAdd={(text, deadline) => addTodo(text, deadline, activeTab)} />
          <TodoList todos={visibleTodos} onToggle={toggleDone} onRemove={removeTodo} />
          <TodoFooter todos={visibleTodos} onClearCompleted={() => clearCompleted(activeTab)} />
        </div>
      </div>
    </div>
  );
}
