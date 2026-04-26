import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTodos } from "../app/hooks/useTodos";

describe("useTodos", () => {
  it("initialises with sample todos", () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos.length).toBeGreaterThan(0);
  });

  describe("addTodo", () => {
    it("adds a todo to the correct tab", () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo("Buy milk", "", "private"));
      const added = result.current.todos.find((t) => t.text === "Buy milk");
      expect(added).toBeDefined();
      expect(added?.tab).toBe("private");
      expect(added?.done).toBe(false);
    });

    it("trims whitespace from todo text", () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo("  Trimmed  ", "", "work"));
      const added = result.current.todos.find((t) => t.text === "Trimmed");
      expect(added).toBeDefined();
    });

    it("does not add a todo when text is blank", () => {
      const { result } = renderHook(() => useTodos());
      const before = result.current.todos.length;
      act(() => result.current.addTodo("   ", "", "work"));
      expect(result.current.todos.length).toBe(before);
    });

    it("stores the deadline as provided", () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo("Task", "2026-12-31", "work"));
      const added = result.current.todos.find((t) => t.text === "Task");
      expect(added?.deadline).toBe("2026-12-31");
    });
  });

  describe("removeTodo", () => {
    it("removes only the todo with the given id", () => {
      const { result } = renderHook(() => useTodos());
      const target = result.current.todos[0];
      act(() => result.current.removeTodo(target.id));
      expect(result.current.todos.find((t) => t.id === target.id)).toBeUndefined();
    });

    it("leaves other todos intact", () => {
      const { result } = renderHook(() => useTodos());
      const before = result.current.todos.length;
      act(() => result.current.removeTodo(result.current.todos[0].id));
      expect(result.current.todos.length).toBe(before - 1);
    });
  });

  describe("toggleDone", () => {
    it("marks an undone todo as done", () => {
      const { result } = renderHook(() => useTodos());
      const target = result.current.todos.find((t) => !t.done)!;
      act(() => result.current.toggleDone(target.id));
      expect(result.current.todos.find((t) => t.id === target.id)?.done).toBe(true);
    });

    it("marks a done todo as undone", () => {
      const { result } = renderHook(() => useTodos());
      const target = result.current.todos[0];
      act(() => result.current.toggleDone(target.id)); // done
      act(() => result.current.toggleDone(target.id)); // undone
      expect(result.current.todos.find((t) => t.id === target.id)?.done).toBe(false);
    });

    it("does not affect other todos", () => {
      const { result } = renderHook(() => useTodos());
      const [first, second] = result.current.todos;
      act(() => result.current.toggleDone(first.id));
      expect(result.current.todos.find((t) => t.id === second.id)?.done).toBe(second.done);
    });
  });

  describe("clearCompleted", () => {
    it("removes done todos from the given tab", () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo("Done work task", "", "work"));
      const added = result.current.todos.find((t) => t.text === "Done work task")!;
      act(() => result.current.toggleDone(added.id));
      act(() => result.current.clearCompleted("work"));
      expect(result.current.todos.find((t) => t.id === added.id)).toBeUndefined();
    });

    it("keeps undone todos from the same tab", () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo("Keep me", "", "work"));
      act(() => result.current.clearCompleted("work"));
      expect(result.current.todos.find((t) => t.text === "Keep me")).toBeDefined();
    });

    it("does not touch todos from a different tab", () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo("Private done", "", "private"));
      const added = result.current.todos.find((t) => t.text === "Private done")!;
      act(() => result.current.toggleDone(added.id));
      act(() => result.current.clearCompleted("work")); // clear work, not private
      expect(result.current.todos.find((t) => t.id === added.id)).toBeDefined();
    });
  });
});
