export interface User {
  id: string;
  name: string;
  profileImage?: string;
  isVerified: boolean;
  church?: string;
  interests: string[];
}

export type PostType = "play" | "learn";
export type PostStatus = "모집중" | "마감임박" | "마감";

export interface Post {
  id: string;
  type: PostType;
  title: string;
  description: string;
  date: string;
  location: string;
  region: string;
  maxParticipants: number;
  currentParticipants: number;
  tag: string;
  status: PostStatus;
  emoji: string;
  host: Pick<User, "id" | "name" | "isVerified">;
}

export interface BannerItem {
  id: string;
  category: "insight" | "event";
  label: string;
  title: string;
  subtitle: string;
  accent: string;
}

export interface ShopItem {
  id: string;
  title: string;
  brand: string;
  price: string;
  tag: string;
  emoji: string;
}

export type ActionCategory = "donation" | "volunteer" | "campaign" | "talent";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  currentAmount: number;
  goalAmount: number;
  unit: string;
  dday: string;
  category: ActionCategory;
  emoji: string;
}

export interface CartItem {
  id: string;
  title: string;
  brand: string;
  price: string;
  priceNum: number;
  emoji: string;
  qty: number;
}

export type FeedTab = "전체" | "솔트 팟(Play)" | "클래스(Learn)";

export type InsightCategory = "news" | "theology" | "book" | "lifestyle";

export interface InsightAuthor {
  name: string;
  title: string;
}

export type ChallengeCategory = "bible" | "prayer" | "morning" | "growth";

export interface FaithChallenge {
  id: string;
  category: ChallengeCategory;
  categoryLabel: string;
  title: string;
  description: string;
  duration: string;
  totalDays: number;
  emoji: string;
  color: string;
  badgeEmoji: string;
  participants: number;
}

export interface InsightArticle {
  id: string;
  category: InsightCategory;
  categoryLabel: string;
  label: string;
  title: string;
  subtitle: string;
  accent: string;
  author: InsightAuthor;
  readTime: number;
  keywords: string[];
  relatedBookId?: string;
  relatedLearnId?: string;
  featured?: boolean;
}

export interface ProfileEssay {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  emoji: string;
  tag: string;
}

export interface BelovedPerson {
  id: string;
  name: string;
  role: string;
  word: string;
}

export interface ProfileData {
  name: string;
  church: string;
  bio: string;
  verse: string;
  verseRef: string;
  essays: ProfileEssay[];
  beloved: BelovedPerson[];
  favoriteGoods: ShopItem[];
}
