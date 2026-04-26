import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDeadline } from "../app/lib/deadline";

// Pin "now" to 2026-04-26T00:00:00Z so all date diffs are deterministic
const FIXED_NOW = new Date("2026-04-26T00:00:00Z").getTime();

beforeEach(() => vi.setSystemTime(FIXED_NOW));
afterEach(() => vi.useRealTimers());

describe("formatDeadline", () => {
  it("returns empty label when deadline is empty string", () => {
    const result = formatDeadline("");
    expect(result).toEqual({ label: "", urgent: false, overdue: false });
  });

  it("marks as overdue when deadline is in the past", () => {
    const result = formatDeadline("2026-04-20");
    expect(result.overdue).toBe(true);
    expect(result.urgent).toBe(false);
    expect(result.label).toMatch(/overdue/i);
    expect(result.label).toContain("6d");
  });

  it("marks as urgent and due today when deadline is today", () => {
    const result = formatDeadline("2026-04-26");
    expect(result.urgent).toBe(true);
    expect(result.overdue).toBe(false);
    expect(result.label).toBe("Due today");
  });

  it("marks as urgent and due tomorrow when deadline is tomorrow", () => {
    const result = formatDeadline("2026-04-27");
    expect(result.urgent).toBe(true);
    expect(result.overdue).toBe(false);
    expect(result.label).toBe("Due tomorrow");
  });

  it("shows days remaining for future deadlines beyond tomorrow", () => {
    const result = formatDeadline("2026-05-06"); // 10 days later
    expect(result.urgent).toBe(false);
    expect(result.overdue).toBe(false);
    expect(result.label).toBe("Due in 10d");
  });
});
