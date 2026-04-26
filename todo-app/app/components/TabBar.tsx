import { Tab } from "../types";

interface TabConfig {
  id: Tab;
  label: string;
  activeClass: string;
  badgeClass: string;
}

// Adding a new tab = one entry here, no component logic changes (OCP)
const TAB_CONFIGS: TabConfig[] = [
  {
    id: "work",
    label: "Work",
    activeClass: "border-b-2 border-blue-500 text-blue-600",
    badgeClass: "bg-blue-100 text-blue-600",
  },
  {
    id: "private",
    label: "Private",
    activeClass: "border-b-2 border-purple-500 text-purple-600",
    badgeClass: "bg-purple-100 text-purple-600",
  },
];

interface TabBarProps {
  activeTab: Tab;
  counts: Record<Tab, number>;
  onTabChange: (tab: Tab) => void;
}

export default function TabBar({ activeTab, counts, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-slate-100">
      {TAB_CONFIGS.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          count={counts[tab.id]}
          active={activeTab === tab.id}
          activeClass={tab.activeClass}
          badgeClass={tab.badgeClass}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
}

interface TabButtonProps {
  label: string;
  count: number;
  active: boolean;
  activeClass: string;
  badgeClass: string;
  onClick: () => void;
}

function TabButton({ label, count, active, activeClass, badgeClass, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 min-h-[48px] py-3 text-sm font-medium transition-colors
        ${active ? activeClass : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"}`}
    >
      {label}
      {count > 0 && (
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${active ? badgeClass : "bg-slate-100 text-slate-400"}`}>
          {count}
        </span>
      )}
    </button>
  );
}
