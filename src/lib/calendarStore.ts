export interface CalendarEvent {
  id: string;
  title: string;
  startHour: number;
  dayOfWeek: number; // 0=Mon … 6=Sun
  color: string;
  emoji: string;
  sourceId?: string; // prevents duplicate sync
}

const SEED: CalendarEvent[] = [
  { id: "ce1", title: "풋살 팟",   startHour: 10, dayOfWeek: 5, color: "#FF5C1A", emoji: "⚽", sourceId: "1" },
  { id: "ce2", title: "독서 모임", startHour: 15, dayOfWeek: 6, color: "#FF9500", emoji: "📚", sourceId: "3" },
  { id: "ce3", title: "한강 러닝", startHour: 19, dayOfWeek: 2, color: "#007AFF", emoji: "🏃", sourceId: "5" },
  { id: "ce4", title: "새벽 QT",   startHour: 8,  dayOfWeek: 0, color: "#FFD600", emoji: "🌅" },
  { id: "ce5", title: "새벽 QT",   startHour: 8,  dayOfWeek: 2, color: "#FFD600", emoji: "🌅" },
  { id: "ce6", title: "새벽 QT",   startHour: 8,  dayOfWeek: 4, color: "#FFD600", emoji: "🌅" },
  { id: "ce7", title: "찬양팀 연습", startHour: 14, dayOfWeek: 5, color: "#5856D6", emoji: "🎸" },
];

let events: CalendarEvent[] = [...SEED];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(fn => fn());

const DAY_MAP: Record<string, number> = { 월: 0, 화: 1, 수: 2, 목: 3, 금: 4, 토: 5, 일: 6 };

/** Parse date strings like "3/7 (토) 10:00" or "매주 수 19:00" */
export function parseDateToEvent(
  dateStr: string,
  title: string,
  emoji: string,
  color: string,
  sourceId: string,
): Omit<CalendarEvent, "id"> | null {
  const weekly = dateStr.match(/매주\s*([월화수목금토일])\s*(\d+)/);
  if (weekly) {
    return { title, emoji, color, sourceId, dayOfWeek: DAY_MAP[weekly[1]], startHour: parseInt(weekly[2]) };
  }
  const specific = dateStr.match(/\(([월화수목금토일])\)\s*(\d+)/);
  if (specific) {
    return { title, emoji, color, sourceId, dayOfWeek: DAY_MAP[specific[1]], startHour: parseInt(specific[2]) };
  }
  return null;
}

export const calendarStore = {
  getEvents: () => events,

  /** Returns true if newly added, false if duplicate sourceId */
  add: (event: Omit<CalendarEvent, "id">): boolean => {
    if (event.sourceId && events.find(e => e.sourceId === event.sourceId)) return false;
    events = [...events, { ...event, id: `sync-${Date.now()}` }];
    notify();
    return true;
  },

  remove: (id: string) => {
    events = events.filter(e => e.id !== id);
    notify();
  },

  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
