export type Tab = "work" | "private";

export interface TodoItem {
  id: string;
  text: string;
  deadline: string;
  done: boolean;
  tab: Tab;
}
