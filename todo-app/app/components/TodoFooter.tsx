import { TodoItem } from "../types";

interface TodoFooterProps {
  todos: TodoItem[];
  onClearCompleted: () => void;
}

export default function TodoFooter({ todos, onClearCompleted }: TodoFooterProps) {
  if (todos.length === 0) return null;

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
      <span className="text-xs text-slate-400">{doneCount} / {todos.length} done</span>
      <button onClick={onClearCompleted} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
        Clear completed
      </button>
    </div>
  );
}
