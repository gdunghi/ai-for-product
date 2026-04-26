import { test, expect } from "@playwright/test";
import { TodoPage } from "./pages/TodoPage";

test.describe("Todo App", () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.goto();
  });

  // ─── Page load ────────────────────────────────────────────────────────────

  test("shows the app title on load", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "My Todos" })).toBeVisible();
  });

  test("shows Work and Private tabs on load", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Work" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Private" })).toBeVisible();
  });

  test("opens on the Work tab and shows sample tasks", async () => {
    await todo.expectTaskVisible("Prepare Q2 report");
    await todo.expectTaskVisible("Review PRs");
  });

  // ─── Tab switching ────────────────────────────────────────────────────────

  test("switching to Private tab shows private tasks", async () => {
    await todo.switchToTab("Private");
    await todo.expectTaskVisible("Call dentist");
  });

  test("switching tabs hides tasks from the other tab", async () => {
    await todo.switchToTab("Private");
    await todo.expectTaskNotVisible("Prepare Q2 report");
  });

  // ─── Adding tasks ─────────────────────────────────────────────────────────

  test("adds a new task to the Work tab", async () => {
    await todo.addTask("Write release notes");
    await todo.expectTaskVisible("Write release notes");
  });

  test("adds a new task to the Private tab", async () => {
    await todo.switchToTab("Private");
    await todo.addTask("Book flights");
    await todo.expectTaskVisible("Book flights");
  });

  test("added task only appears in the correct tab", async () => {
    await todo.addTask("Work-only task");
    await todo.switchToTab("Private");
    await todo.expectTaskNotVisible("Work-only task");
  });

  test("adds a task with a deadline", async () => {
    await todo.addTask("File tax return", "2026-06-30");
    await todo.expectTaskVisible("File tax return");
    await todo.expectTaskVisible("Due in");
  });

  test("clears the input after adding a task", async ({ page }) => {
    await todo.addTask("Temporary task");
    await expect(page.getByPlaceholder("Add a new task…")).toHaveValue("");
  });

  test("adds a task by pressing Enter", async () => {
    await todo.addTaskByPressingEnter("Enter key task");
    await todo.expectTaskVisible("Enter key task");
  });

  test("disables Add button when input is empty", async () => {
    await todo.expectAddButtonDisabled();
  });

  // ─── Completing tasks ─────────────────────────────────────────────────────

  test("marks a task as done", async () => {
    await todo.markDone("Review PRs");
    await todo.expectTaskDone("Review PRs");
  });

  test("toggling done twice returns task to undone", async () => {
    await todo.toggleTask("Review PRs");
    await todo.toggleTask("Review PRs");
    const row = todo.taskByText("Review PRs");
    await expect(row.locator("p")).not.toHaveClass(/line-through/);
  });

  test("footer count updates when a task is marked done", async () => {
    await todo.markDone("Review PRs");
    await todo.expectFooterCount(1, 2);
  });

  // ─── Removing tasks ───────────────────────────────────────────────────────

  test("removes a task", async () => {
    await todo.removeTask("Review PRs");
    await todo.expectTaskNotVisible("Review PRs");
  });

  test("removing a task does not affect other tasks", async () => {
    await todo.removeTask("Review PRs");
    await todo.expectTaskVisible("Prepare Q2 report");
  });

  // ─── Clear completed ──────────────────────────────────────────────────────

  test("clear completed removes all done tasks in the current tab", async () => {
    await todo.markDone("Review PRs");
    await todo.clearCompleted();
    await todo.expectTaskNotVisible("Review PRs");
  });

  test("clear completed keeps undone tasks", async () => {
    await todo.markDone("Review PRs");
    await todo.clearCompleted();
    await todo.expectTaskVisible("Prepare Q2 report");
  });

  test("clear completed does not touch tasks in the other tab", async () => {
    await todo.markDone("Review PRs");
    await todo.clearCompleted();
    await todo.switchToTab("Private");
    await todo.expectTaskVisible("Call dentist");
  });
});
