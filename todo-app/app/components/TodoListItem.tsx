import { TodoItem } from "../types";
import { formatDeadline } from "../lib/deadline";

interface TodoListItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function TodoListItem({ todo, onToggle, onRemove }: TodoListItemProps) {
  const dl = formatDeadline(todo.deadline);
  const deadlineColor = dl.overdue ? "text-red-500" : dl.urgent ? "text-amber-500" : "text-slate-400";

  return (
    <li className={`flex items-center gap-3 px-4 py-3 group hover:bg-slate-50 transition-colors ${todo.done ? "opacity-50" : ""}`}>
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
          ${todo.done ? "bg-green-400 border-green-400" : "border-slate-300 hover:border-green-400"}`}
        aria-label={todo.done ? "Mark undone" : "Mark done"}
      >
        {todo.done && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm text-slate-800 truncate ${todo.done ? "line-through" : ""}`}>
          {todo.text}
        </p>
        {dl.label && (
          <span className={`text-xs font-medium mt-0.5 inline-block ${deadlineColor}`}>
            {dl.label}
          </span>
        )}
      </div>

      {/* Always visible on touch; hover-only on pointer devices */}
      <button
        onClick={() => onRemove(todo.id)}
        className="p-1 text-slate-300 hover:text-red-400 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Remove task"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
