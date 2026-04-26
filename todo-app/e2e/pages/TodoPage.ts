import { type Page, type Locator, expect } from "@playwright/test";

type Tab = "Work" | "Private";

/**
 * Page Object for the Todo app.
 * All selectors live here — tests never touch raw locators.
 */
export class TodoPage {
  private readonly taskInput: Locator;
  private readonly deadlineInput: Locator;
  private readonly addButton: Locator;
  private readonly footer: Locator;

  constructor(private readonly page: Page) {
    this.taskInput = page.getByPlaceholder("Add a new task…");
    this.deadlineInput = page.locator('input[type="date"]');
    this.addButton = page.getByRole("button", { name: "Add" });
    this.footer = page.locator("text=done").last();
  }

  async goto() {
    await this.page.goto("/");
  }

  async switchToTab(tab: Tab) {
    await this.page.getByRole("button", { name: tab }).click();
  }

  async addTask(text: string, deadline?: string) {
    await this.taskInput.fill(text);
    if (deadline) await this.deadlineInput.fill(deadline);
    await this.addButton.click();
  }

  async addTaskByPressingEnter(text: string) {
    await this.taskInput.fill(text);
    await this.taskInput.press("Enter");
  }

  async markDone(text: string) {
    const row = this.rowByText(text);
    await row.getByRole("button", { name: /mark done/i }).click();
  }

  async toggleTask(text: string) {
    const row = this.rowByText(text);
    await row.getByRole("button", { name: /mark (done|undone)/i }).click();
  }

  async removeTask(text: string) {
    const row = this.rowByText(text);
    await row.getByRole("button", { name: /remove task/i }).click();
  }

  async clearCompleted() {
    await this.page.getByRole("button", { name: "Clear completed" }).click();
  }

  taskList() {
    return this.page.locator("ul li");
  }

  taskByText(text: string) {
    return this.page.locator("li").filter({ hasText: text });
  }

  async expectTaskVisible(text: string) {
    await expect(this.taskByText(text)).toBeVisible();
  }

  async expectTaskNotVisible(text: string) {
    await expect(this.taskByText(text)).not.toBeVisible();
  }

  async expectTaskDone(text: string) {
    const row = this.taskByText(text);
    await expect(row.locator("p")).toHaveClass(/line-through/);
  }

  async expectAddButtonDisabled() {
    await expect(this.addButton).toBeDisabled();
  }

  async expectFooterCount(done: number, total: number) {
    await expect(this.page.getByText(`${done} / ${total} done`)).toBeVisible();
  }

  private rowByText(text: string) {
    return this.page.locator("li").filter({ hasText: text });
  }
}
