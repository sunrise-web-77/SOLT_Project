type Listener = () => void;

export interface ChallengeProgress {
  challengeId: string;
  progress: number; // 0–100
  joinedAt: string;
  checkInCount: number;
}

export interface EarnedBadge {
  id: string;
  challengeId: string;
  challengeTitle: string;
  label: string;
  emoji: string;
  earnedAt: string;
}

let joined: Record<string, ChallengeProgress> = {};
let badges: EarnedBadge[] = [];
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((fn) => fn());

export const challengeStore = {
  getJoined: () => joined,
  getBadges: () => badges,

  join: (challengeId: string) => {
    if (joined[challengeId]) return;
    joined = {
      ...joined,
      [challengeId]: {
        challengeId,
        progress: 0,
        joinedAt: new Date().toLocaleDateString("ko-KR"),
        checkInCount: 0,
      },
    };
    notify();
  },

  checkIn: (challengeId: string, totalDays: number, challengeTitle: string) => {
    const cp = joined[challengeId];
    if (!cp) return;
    const newCount = cp.checkInCount + 1;
    const newProgress = Math.min(100, Math.round((newCount / totalDays) * 100));
    joined = { ...joined, [challengeId]: { ...cp, checkInCount: newCount, progress: newProgress } };

    const addBadge = (suffix: string, label: string, emoji: string) => {
      if (!badges.find((b) => b.id === `${challengeId}-${suffix}`)) {
        badges = [
          ...badges,
          { id: `${challengeId}-${suffix}`, challengeId, challengeTitle, label, emoji, earnedAt: new Date().toLocaleDateString("ko-KR") },
        ];
      }
    };

    if (newCount >= 7) addBadge("w1", "첫 7일 달성", "🥉");
    if (newCount >= Math.floor(totalDays / 2)) addBadge("half", "절반 달성", "🥈");
    if (newProgress >= 100) addBadge("done", "챌린지 완주", "🏆");

    notify();
  },

  subscribe: (fn: Listener) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
