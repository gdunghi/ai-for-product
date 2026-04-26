export interface DeadlineStatus {
  label: string;
  urgent: boolean;
  overdue: boolean;
}

export function formatDeadline(deadline: string): DeadlineStatus {
  if (!deadline) return { label: "", urgent: false, overdue: false };

  const diffDays = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return { label: `Overdue by ${Math.abs(diffDays)}d`, urgent: false, overdue: true };
  if (diffDays === 0) return { label: "Due today", urgent: true, overdue: false };
  if (diffDays === 1) return { label: "Due tomorrow", urgent: true, overdue: false };
  return { label: `Due in ${diffDays}d`, urgent: false, overdue: false };
}
