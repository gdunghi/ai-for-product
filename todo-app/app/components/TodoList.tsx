import { TodoItem } from "../types";
import TodoListItem from "./TodoListItem";

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <ul>
        <li className="py-12 text-center text-slate-400 text-sm">No tasks yet. Add one above!</li>
      </ul>
    );
  }

  return (
    <ul className="divide-y divide-slate-50">
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
      ))}
    </ul>
  );
}
