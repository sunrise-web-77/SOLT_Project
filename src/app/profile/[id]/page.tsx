"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { mockPosts } from "@/lib/mockData";

// ── Mock user data ────────────────────────────────────────────────────────
interface MockUser {
  id: string; name: string; church: string; bio: string;
  verse: string; verseRef: string; joinedDate: string; emoji: string; tags: string[];
}

const MOCK_USERS: Record<string, MockUser> = {
  u1: { id: "u1", name: "준혁", church: "온누리교회", bio: "풋살로 복음을 나누는 사람", verse: "내가 달려갈 길과 주 예수께 받은 사명 곧 하나님의 은혜의 복음을 증언하는 일을 마치려 함에는 나의 생명조차 조금도 귀한 것으로 여기지 아니하노라", verseRef: "사도행전 20:24", joinedDate: "2025.09", emoji: "⚽", tags: ["운동", "전도", "모임리더"] },
  u2: { id: "u2", name: "수빈", church: "사랑의교회", bio: "말씀으로 상담하는 기독교 상담사", verse: "여호와는 나의 목자시니 내게 부족함이 없으리로다", verseRef: "시편 23:1", joinedDate: "2025.10", emoji: "📖", tags: ["상담", "클래스", "멘토"] },
  u3: { id: "u3", name: "민지", church: "충현교회", bio: "책과 커피와 말씀, 그리고 일상", verse: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다", verseRef: "시편 119:105", joinedDate: "2025.08", emoji: "📚", tags: ["독서", "카페", "기록"] },
  u4: { id: "u4", name: "재원", church: "홍대교회", bio: "기타와 찬양으로 예배드리는 청년", verse: "새 노래로 그를 노래하며 즐거운 소리로 아름답게 연주할지어다", verseRef: "시편 33:3", joinedDate: "2025.11", emoji: "🎸", tags: ["찬양", "음악", "워십"] },
  u5: { id: "u5", name: "하은", church: "여의도순복음교회", bio: "새벽 한강에서 주님의 숨결을 느껴요", verse: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요", verseRef: "이사야 40:31", joinedDate: "2025.07", emoji: "🏃", tags: ["러닝", "새벽", "건강"] },
  u6: { id: "u6", name: "성호", church: "분당우리교회", bio: "성경적 재정 원칙으로 청지기 삶을 실천합니다", verse: "네 보물 있는 그곳에는 네 마음도 있느니라", verseRef: "마태복음 6:21", joinedDate: "2025.06", emoji: "💰", tags: ["재정", "세미나", "청지기"] },
  u7: { id: "u7", name: "도현", church: "강남교회", bio: "보드게임으로 예배 후 친교를 만들어요", verse: "보라 형제가 연합하여 동거함이 어찌 그리 선하고 아름다운고", verseRef: "시편 133:1", joinedDate: "2025.12", emoji: "🎲", tags: ["친교", "게임", "공동체"] },
  u8: { id: "u8", name: "예진", church: "은혜와진리교회", bio: "NIV로 영어와 말씀을 동시에 성장", verse: "For the word of God is alive and active.", verseRef: "Hebrews 4:12", joinedDate: "2025.10", emoji: "🌏", tags: ["영어", "클래스", "교육"] },
  u9: { id: "u9", name: "지훈", church: "분당성복교회", bio: "찬양으로 매 주를 마무리하는 삶", verse: "시와 찬미와 신령한 노래들로 서로 화답하며 너희의 마음으로 주께 노래하며 찬송하며", verseRef: "에베소서 5:19", joinedDate: "2025.09", emoji: "🎵", tags: ["찬양", "모임", "경기"] },
  u10: { id: "u10", name: "서연", church: "인천선교교회", bio: "이웃 사랑을 삶으로 실천하는 청년", verse: "네 이웃을 네 자신 같이 사랑하라", verseRef: "마가복음 12:31", joinedDate: "2025.11", emoji: "🤲", tags: ["봉사", "지역사회", "섬김"] },
  c1: { id: "c1", name: "이종훈 목사", church: "빛과진리교회", bio: "20년 목회 경험으로 부모들을 섬깁니다", verse: "마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라", verseRef: "잠언 22:6", joinedDate: "2025.05", emoji: "👨‍👩‍👧", tags: ["자녀양육", "목회", "가정"] },
  c2: { id: "c2", name: "박성진 교수", church: "연합교회", bio: "기독교 세계관을 가르치는 신학자", verse: "이 세상이나 세상에 있는 것들을 사랑하지 말라", verseRef: "요한일서 2:15", joinedDate: "2025.04", emoji: "🌍", tags: ["세계관", "신학", "교육"] },
  c3: { id: "c3", name: "김지수 대표", church: "글로벌선교교회", bio: "크리스천 글로벌 인재 양성에 헌신합니다", verse: "땅 끝까지 이르러 내 증인이 되리라", verseRef: "사도행전 1:8", joinedDate: "2025.03", emoji: "🚀", tags: ["글로벌", "선교", "비즈니스"] },
  c4: { id: "c4", name: "최은영 원장", church: "에덴학교", bio: "기독교 대안교육의 꿈을 이루어가는 교육자", verse: "내 백성이 지식이 없으므로 망하는도다", verseRef: "호세아 4:6", joinedDate: "2025.06", emoji: "🏫", tags: ["대안학교", "교육", "다음세대"] },
};

// ── Mock public essays ────────────────────────────────────────────────────
interface PublicEssay { id: string; title: string; excerpt: string; date: string; emoji: string; tag: string; }

const MOCK_ESSAYS: Record<string, PublicEssay[]> = {
  u1: [
    { id: "pe1", title: "풋살 후에 나누는 교제의 힘", excerpt: "경기 후 함께 나눈 저녁 한 끼가 전도의 문을 열었다.", date: "2026.02.28", emoji: "⚽", tag: "일상" },
    { id: "pe2", title: "운동과 신앙, 둘 다 근력이다", excerpt: "매일 훈련하지 않으면 약해지는 것은 근육만이 아니다.", date: "2026.02.10", emoji: "✍️", tag: "성장" },
  ],
  u2: [
    { id: "pe3", title: "경청이 먼저다", excerpt: "상담에서 배운 가장 중요한 교훈 — 말하기 전에 듣기.", date: "2026.03.01", emoji: "📖", tag: "묵상" },
    { id: "pe4", title: "상처를 안고 예배 드리기", excerpt: "완전하지 않아도 예배드릴 수 있는 이유.", date: "2026.02.18", emoji: "🙏", tag: "기도" },
  ],
  u3: [
    { id: "pe5", title: "이 달의 책: 팀 켈러의 기도", excerpt: "기도를 다시 배우게 된 책 한 권의 이야기.", date: "2026.03.02", emoji: "📚", tag: "묵상" },
  ],
  u4: [
    { id: "pe6", title: "처음으로 찬양팀에 섰던 날", excerpt: "손이 떨렸지만 마음은 뜨거웠다. 그 날의 기억.", date: "2026.02.22", emoji: "🎸", tag: "찬양" },
    { id: "pe7", title: "C코드 하나가 바꾼 예배", excerpt: "기술보다 중요한 것은 예배자의 마음이다.", date: "2026.02.05", emoji: "🎵", tag: "찬양" },
  ],
  u5: [
    { id: "pe8", title: "새벽 5시 한강의 고요함", excerpt: "아무도 없는 한강에서 하나님과 단둘이 뛰었다.", date: "2026.03.03", emoji: "🌅", tag: "일상" },
  ],
};

// ── Calendar events per user ──────────────────────────────────────────────
interface CalEvent { id: string; title: string; startHour: number; dayOfWeek: number; color: string; emoji: string; }

const USER_CAL_EVENTS: Record<string, CalEvent[]> = {
  u1: [
    { id: "c1", title: "풋살 팟", startHour: 10, dayOfWeek: 5, color: "#FF5C1A", emoji: "⚽" },
    { id: "c2", title: "새벽 QT", startHour: 8, dayOfWeek: 1, color: "#FFD600", emoji: "🌅" },
    { id: "c3", title: "새벽 QT", startHour: 8, dayOfWeek: 3, color: "#FFD600", emoji: "🌅" },
  ],
  u2: [
    { id: "c1", title: "기독교 상담학", startHour: 19, dayOfWeek: 1, color: "#34C759", emoji: "📖" },
    { id: "c2", title: "상담 세션", startHour: 14, dayOfWeek: 3, color: "#007AFF", emoji: "💬" },
  ],
  u3: [
    { id: "c1", title: "독서 모임", startHour: 15, dayOfWeek: 6, color: "#FF9500", emoji: "📚" },
    { id: "c2", title: "카페 QT", startHour: 10, dayOfWeek: 0, color: "#FFD600", emoji: "☕" },
  ],
  u4: [
    { id: "c1", title: "찬양 기타 워크숍", startHour: 14, dayOfWeek: 5, color: "#5856D6", emoji: "🎸" },
    { id: "c2", title: "찬양팀 연습", startHour: 19, dayOfWeek: 2, color: "#FF2D55", emoji: "🎵" },
  ],
  u5: [
    { id: "c1", title: "한강 러닝", startHour: 19, dayOfWeek: 2, color: "#007AFF", emoji: "🏃" },
    { id: "c2", title: "새벽 러닝", startHour: 6, dayOfWeek: 0, color: "#34C759", emoji: "🌅" },
  ],
};

// ── Calendar helpers ──────────────────────────────────────────────────────
const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8);
function getWeekStart(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
  date.setHours(0, 0, 0, 0);
  return date;
}

type PublicTab = "소개" | "작성글" | "캘린더";

// ── Component ─────────────────────────────────────────────────────────────
export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const user = MOCK_USERS[id];
  const [tab, setTab] = useState<PublicTab>("소개");
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date(2026, 2, 6)));
  const TODAY = new Date(2026, 2, 6);

  if (!user) {
    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
        <Nav />
        <div style={{ padding: "80px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#94A3B8" }}>사용자를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const hostedPosts = mockPosts.filter(p => p.host.id === id);
  const publicEssays = MOCK_ESSAYS[id] || [];
  const calEvents = USER_CAL_EVENTS[id] || [];

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const goWeek = (dir: number) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + dir * 7);
    setWeekStart(d);
  };

  const eventsAt = (day: number, hour: number) =>
    calEvents.filter(e => e.dayOfWeek === day && e.startHour === hour);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── Profile Header ─── */}
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: "32px" }}>
            <div style={{
              width: "88px", height: "88px", borderRadius: "28px",
              backgroundColor: "#0D2B4E", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "36px", flexShrink: 0,
            }}>
              {user.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 900 }}>{user.name}</h1>
                <span style={{
                  fontSize: "11px", fontWeight: 700, color: "#34C759",
                  backgroundColor: "#E8F9EE", padding: "3px 10px", borderRadius: "100px",
                }}>✓ 인증</span>
              </div>
              <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "8px" }}>{user.church} · {user.joinedDate} 가입</p>
              <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.6 }}>{user.bio}</p>
              <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
                {user.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: "11px", fontWeight: 700, color: "#FF5C1A",
                    backgroundColor: "#FFF5F0", padding: "3px 10px", borderRadius: "100px",
                  }}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "32px" }}>
            {[
              { label: "운영 모임", value: hostedPosts.length },
              { label: "총 참여자", value: hostedPosts.reduce((s, p) => s + p.currentParticipants, 0) },
              { label: "공개 글", value: publicEssays.length },
            ].map(s => (
              <div key={s.label} style={{
                padding: "18px", borderRadius: "16px", backgroundColor: "#F8FAFC", textAlign: "center",
              }}>
                <p style={{ fontSize: "22px", fontWeight: 900 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Tabs ─── */}
          <div style={{ display: "flex", borderBottom: "1px solid #F2F4F7", marginBottom: "32px" }}>
            {(["소개", "작성글", "캘린더"] as PublicTab[]).map((t, i) => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "13px 0", background: "none", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: tab === t ? 900 : 600,
                color: tab === t ? "#0D2B4E" : "#94A3B8",
                borderBottom: tab === t ? "3px solid #0D2B4E" : "3px solid transparent",
                transition: "all 0.2s",
              }}>
                {["소개", "작성 글", "공유 캘린더"][i]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── TAB: 소개 ─── */}
            {tab === "소개" && (
              <motion.div key="소개"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

                {/* Verse */}
                <div style={{
                  backgroundColor: "#F8FAFC", borderRadius: "20px", padding: "28px 32px",
                  borderLeft: "4px solid #FF5C1A", marginBottom: "28px", position: "relative", overflow: "hidden",
                }}>
                  <span style={{
                    position: "absolute", top: 0, left: "12px", fontSize: "80px",
                    color: "rgba(255,92,26,0.06)", lineHeight: 1, userSelect: "none", fontWeight: 900,
                  }}>&ldquo;</span>
                  <p style={{ fontSize: "15px", lineHeight: 1.9, color: "#374151", fontStyle: "italic", marginBottom: "14px", position: "relative", zIndex: 1 }}>
                    "{user.verse}"
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#FF5C1A" }}>{user.verseRef}</p>
                </div>

                {/* Hosted posts */}
                {hostedPosts.length > 0 && (
                  <>
                    <p style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.12em", marginBottom: "14px" }}>
                      운영 중인 모임 & 클래스
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                      {hostedPosts.map(p => (
                        <Link key={p.id}
                          href={`/${p.type === "play" ? "play" : "learn"}/${p.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}>
                          <motion.div whileHover={{ y: -2 }}
                            style={{
                              padding: "16px 20px", borderRadius: "16px", border: "1px solid #F2F4F7",
                              display: "flex", gap: "14px", alignItems: "center", cursor: "pointer",
                              transition: "box-shadow 0.2s",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
                            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                          >
                            <span style={{ fontSize: "26px" }}>{p.emoji}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                                <span style={{
                                  fontSize: "10px", fontWeight: 700,
                                  color: p.type === "play" ? "#FF5C1A" : "#34C759",
                                  backgroundColor: p.type === "play" ? "#FFF5F0" : "#E8F9EE",
                                  padding: "2px 8px", borderRadius: "100px",
                                }}>
                                  {p.type === "play" ? "모임" : "클래스"}
                                </span>
                                <span style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 600 }}>{p.status}</span>
                              </div>
                              <p style={{ fontSize: "14px", fontWeight: 700 }}>{p.title}</p>
                              <p style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{p.date} · {p.location}</p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <p style={{ fontSize: "12px", color: "#94A3B8" }}>{p.currentParticipants}/{p.maxParticipants}명</p>
                              <div style={{ width: "56px", height: "4px", borderRadius: "100px", backgroundColor: "#F2F4F7", marginTop: "6px", overflow: "hidden" }}>
                                <div style={{
                                  height: "100%", borderRadius: "100px", backgroundColor: "#FF5C1A",
                                  width: `${Math.round((p.currentParticipants / p.maxParticipants) * 100)}%`,
                                }} />
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* Message CTA */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%", padding: "16px", borderRadius: "100px", border: "none",
                    backgroundColor: "#0D2B4E", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer",
                  }}>
                  {user.name}님에게 메시지 보내기
                </motion.button>
              </motion.div>
            )}

            {/* ── TAB: 작성글 ─── */}
            {tab === "작성글" && (
              <motion.div key="작성글"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {publicEssays.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 0", color: "#94A3B8" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
                    <p style={{ fontSize: "15px", fontWeight: 700 }}>공개된 글이 없습니다</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {publicEssays.map((essay, i) => (
                      <motion.div key={essay.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        style={{
                          padding: "20px 24px", borderRadius: "20px", border: "1px solid #F2F4F7",
                          display: "flex", gap: "14px", alignItems: "flex-start",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                      >
                        <span style={{ fontSize: "24px", flexShrink: 0 }}>{essay.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span style={{
                              fontSize: "10px", fontWeight: 700, color: "#FF5C1A",
                              backgroundColor: "#FFF5F0", padding: "2px 8px", borderRadius: "100px",
                            }}>{essay.tag}</span>
                            <span style={{ fontSize: "11px", color: "#CBD5E1" }}>{essay.date}</span>
                          </div>
                          <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{essay.title}</p>
                          <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>{essay.excerpt}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── TAB: 캘린더 ─── */}
            {tab === "캘린더" && (
              <motion.div key="캘린더"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <p style={{ fontSize: "13px", color: "#94A3B8" }}>{user.name}님의 공개 시간표</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={() => goWeek(-1)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #F2F4F7", background: "#fff", fontSize: "16px", cursor: "pointer", fontWeight: 700 }}>‹</button>
                    <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "80px", textAlign: "center" }}>
                      {weekStart.getFullYear()}년 {weekStart.getMonth() + 1}월
                    </span>
                    <button onClick={() => goWeek(1)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #F2F4F7", background: "#fff", fontSize: "16px", cursor: "pointer", fontWeight: 700 }}>›</button>
                  </div>
                </div>

                <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #F2F4F7" }}>
                  {/* Day headers */}
                  <div style={{ display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)", backgroundColor: "#F8FAFC" }}>
                    <div style={{ borderRight: "1px solid #F2F4F7" }} />
                    {weekDays.map((d, i) => {
                      const isToday = d.toDateString() === TODAY.toDateString();
                      return (
                        <div key={i} style={{ padding: "10px 0", textAlign: "center", borderRight: i < 6 ? "1px solid #F2F4F7" : "none" }}>
                          <p style={{ fontSize: "10px", fontWeight: 700, color: i >= 5 ? "#FF5C1A" : "#94A3B8", marginBottom: "4px" }}>{DAYS[i]}</p>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "50%", margin: "0 auto",
                            backgroundColor: isToday ? "#FF5C1A" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: isToday ? "#fff" : "#0D2B4E" }}>{d.getDate()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Time rows (read-only) */}
                  <div style={{ maxHeight: "460px", overflowY: "auto" }}>
                    {HOURS.map(hour => (
                      <div key={hour} style={{
                        display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)",
                        borderTop: "1px solid #F2F4F7", minHeight: "52px",
                      }}>
                        <div style={{
                          padding: "6px 8px 0", fontSize: "10px", fontWeight: 600, color: "#CBD5E1",
                          borderRight: "1px solid #F2F4F7", textAlign: "right", alignSelf: "flex-start",
                        }}>
                          {String(hour).padStart(2, "0")}:00
                        </div>
                        {[0, 1, 2, 3, 4, 5, 6].map(day => {
                          const ces = eventsAt(day, hour);
                          return (
                            <div key={day} style={{
                              borderRight: day < 6 ? "1px solid #F2F4F7" : "none",
                              padding: "3px", minHeight: "52px",
                            }}>
                              {ces.map(ev => (
                                <div key={ev.id} style={{
                                  backgroundColor: ev.color + "18", borderLeft: `3px solid ${ev.color}`,
                                  borderRadius: "5px", padding: "3px 5px", marginBottom: "2px",
                                }}>
                                  <p style={{ fontSize: "10px", fontWeight: 700, color: ev.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {ev.emoji} {ev.title}
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: "11px", color: "#CBD5E1", marginTop: "12px" }}>읽기 전용 — 공개된 일정만 표시됩니다</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
