"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { myProfile } from "@/lib/mockData";
import { calendarStore } from "@/lib/calendarStore";
import { orderStore } from "@/lib/orderStore";
import { challengeStore } from "@/lib/challengeStore";
import { cartStore } from "@/lib/cartStore";
import { faithChallenges } from "@/lib/mockData";

// ── Types ──────────────────────────────────────────────────────────────────
interface Essay {
  id: string; title: string; content: string; excerpt: string;
  date: string; emoji: string; tag: string;
}
interface SavedVerse { id: string; text: string; ref: string; note?: string; }
interface Song { id: string; title: string; artist: string; youtubeUrl?: string; emoji: string; }

// ── Seed data ───────────────────────────────────────────────────────────────
const ESSAY_TAGS = ["묵상", "선교", "일상", "찬양", "성장", "기도"];
const TAG_EMOJI: Record<string, string> = {
  묵상: "✍️", 선교: "✈️", 일상: "📝", 찬양: "🎵", 성장: "🌱", 기도: "🙏",
};

const SEED_VERSES: SavedVerse[] = [
  { id: "v1", text: "너는 내게 부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 은밀한 일을 네게 보이리라", ref: "예레미야 33:3", note: "대표 말씀" },
  { id: "v2", text: "내가 달려갈 길과 주 예수께 받은 사명 곧 하나님의 은혜의 복음을 증언하는 일을 마치려 함에는 나의 생명조차 조금도 귀한 것으로 여기지 아니하노라", ref: "사도행전 20:24" },
  { id: "v3", text: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다", ref: "시편 119:105" },
  { id: "v4", text: "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라", ref: "사도행전 1:8" },
];

const SEED_SONGS: Song[] = [
  { id: "s1", title: "주 날개 밑", artist: "찬양대", emoji: "🕊️" },
  { id: "s2", title: "내 삶을 드리리", artist: "Hillsong Worship", emoji: "🎸" },
  { id: "s3", title: "주의 이름 높이며", artist: "예수전도단", emoji: "🎵" },
  { id: "s4", title: "Amazing Grace (나 같은 죄인 살리신)", artist: "전통 찬송", emoji: "✝️" },
  { id: "s5", title: "Way Maker", artist: "Sinach", emoji: "🌊" },
  { id: "s6", title: "오 주님 나의 발을", artist: "CCM", emoji: "🙏" },
];

const THUMB_GRADIENTS = [
  "linear-gradient(135deg,#FF5C1A,#FF9500)",
  "linear-gradient(135deg,#5856D6,#007AFF)",
  "linear-gradient(135deg,#34C759,#00C7BE)",
  "linear-gradient(135deg,#FF2D55,#FF5C1A)",
  "linear-gradient(135deg,#007AFF,#5856D6)",
  "linear-gradient(135deg,#FFD600,#FF9500)",
];

const PALETTE = ["#FF5C1A", "#34C759", "#007AFF", "#5856D6", "#FF2D55", "#FF9500", "#FFD600"];
const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8 – 22

function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
  date.setHours(0, 0, 0, 0);
  return date;
}

type MainTab = "글관리" | "말씀" | "캘린더" | "찬양" | "주문" | "챌린지";

// ── Component ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  // Identity
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(myProfile.name);
  const [church, setChurch] = useState(myProfile.church);
  const [bio, setBio] = useState(myProfile.bio);

  // Tabs
  const [tab, setTab] = useState<MainTab>("글관리");

  // Essays
  const [essays, setEssays] = useState<Essay[]>(
    myProfile.essays.map(e => ({ ...e, content: e.excerpt }))
  );
  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState({ tag: "묵상", title: "", content: "" });
  const [viewing, setViewing] = useState<Essay | null>(null);

  // Verses
  const [lifeVerse, setLifeVerse] = useState(myProfile.verse);
  const [lifeVerseRef, setLifeVerseRef] = useState(myProfile.verseRef);
  const [editingVerse, setEditingVerse] = useState(false);
  const [verseDraftText, setVerseDraftText] = useState(myProfile.verse);
  const [verseDraftRef, setVerseDraftRef] = useState(myProfile.verseRef);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>(SEED_VERSES);
  const [addingVerse, setAddingVerse] = useState(false);
  const [newVerse, setNewVerse] = useState({ text: "", ref: "", note: "" });

  // Orders — backed by shared orderStore
  const orders = useSyncExternalStore(orderStore.subscribe, orderStore.getOrders, orderStore.getOrders);
  const challengeJoined = useSyncExternalStore(challengeStore.subscribe, challengeStore.getJoined, challengeStore.getJoined);
  const challengeBadges = useSyncExternalStore(challengeStore.subscribe, challengeStore.getBadges, challengeStore.getBadges);
  const cartItems = useSyncExternalStore(cartStore.subscribe, cartStore.getItems, cartStore.getItems);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  // Calendar — backed by shared calendarStore
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date(2026, 2, 6)));
  const events = useSyncExternalStore(calendarStore.subscribe, calendarStore.getEvents, calendarStore.getEvents);
  const [addCell, setAddCell] = useState<{ day: number; hour: number } | null>(null);
  const [evTitle, setEvTitle] = useState("");
  const [evColor, setEvColor] = useState("#FF5C1A");

  // Worship Playlist
  const [songs, setSongs] = useState<Song[]>(SEED_SONGS);
  const [addingSong, setAddingSong] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", artist: "", youtubeUrl: "" });

  const TODAY = new Date(2026, 2, 6);

  // Lock body scroll when modal open
  const anyModal = showEditor || !!viewing || addingVerse || !!addCell || addingSong;
  useEffect(() => {
    document.body.style.overflow = anyModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [anyModal]);

  // Handlers
  const handlePublish = () => {
    if (!draft.title.trim() || !draft.content.trim()) return;
    setEssays(prev => [{
      id: `e-${Date.now()}`,
      title: draft.title,
      content: draft.content,
      excerpt: draft.content.slice(0, 50) + (draft.content.length > 50 ? "…" : ""),
      date: new Date().toLocaleDateString("ko-KR"),
      emoji: TAG_EMOJI[draft.tag] || "📝",
      tag: draft.tag,
    }, ...prev]);
    setDraft({ tag: "묵상", title: "", content: "" });
    setShowEditor(false);
  };

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
    events.filter(e => e.dayOfWeek === day && e.startHour === hour);

  const handleAddEvent = () => {
    if (!evTitle.trim() || !addCell) return;
    calendarStore.add({
      title: evTitle.trim(), emoji: "📌",
      startHour: addCell.hour, dayOfWeek: addCell.day, color: evColor,
    });
    setEvTitle("");
    setAddCell(null);
  };

  // ── Pill filter ──
  const inputLine: React.CSSProperties = {
    background: "none", border: "none", outline: "none",
    fontFamily: "inherit", color: "inherit", width: "100%",
    borderBottom: "1.5px solid #FF5C1A", padding: "4px 0",
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 40px 120px" }}>
        <BackButton />

        {/* ── IDENTITY ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: "32px", paddingBottom: "40px" }}>
          <div style={{
            width: "88px", height: "88px", borderRadius: "28px", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #FF5C1A, #FF9500)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px", fontWeight: 900, color: "#fff",
          }}>
            {name[0]}
          </div>

          {editing ? (
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ ...inputLine, fontSize: "26px", fontWeight: 900, textAlign: "center", maxWidth: "240px", margin: "0 auto", display: "block" }} />
          ) : (
            <h1 style={{ fontSize: "26px", fontWeight: 900 }}>{name}</h1>
          )}

          {editing ? (
            <input value={church} onChange={e => setChurch(e.target.value)}
              style={{ ...inputLine, fontSize: "13px", fontWeight: 700, textAlign: "center", maxWidth: "200px", margin: "10px auto 0", display: "block" }} />
          ) : (
            <span style={{
              display: "inline-block", marginTop: "10px", fontSize: "12px", fontWeight: 700,
              color: "#fff", backgroundColor: "#0D2B4E", padding: "5px 16px", borderRadius: "100px",
            }}>
              {church}
            </span>
          )}

          {editing ? (
            <input value={bio} onChange={e => setBio(e.target.value)}
              style={{ ...inputLine, fontSize: "14px", textAlign: "center", maxWidth: "320px", margin: "14px auto 0", color: "#94A3B8", display: "block" }} />
          ) : (
            <p style={{ fontSize: "14px", color: "#94A3B8", marginTop: "14px" }}>{bio}</p>
          )}

          <button onClick={() => setEditing(!editing)} style={{
            marginTop: "20px", fontSize: "13px", fontWeight: 700,
            color: editing ? "#fff" : "#0D2B4E",
            backgroundColor: editing ? "#FF5C1A" : "transparent",
            border: editing ? "none" : "1.5px solid #E2E8F0",
            padding: "10px 28px", borderRadius: "100px", cursor: "pointer", transition: "all 0.2s",
          }}>
            {editing ? "저장하기" : "프로필 수정"}
          </button>

          {/* Earned badges row */}
          {challengeBadges.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px", marginTop: "16px" }}>
              {challengeBadges.slice(0, 6).map((b) => (
                <div key={b.id} title={b.label} style={{
                  padding: "4px 12px", borderRadius: "100px",
                  backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
                  fontSize: "12px", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  <span>{b.emoji}</span>
                  <span style={{ fontSize: "11px", color: "#64748B" }}>{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── DASHBOARD STATS ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            {
              label: "이번 주 일정",
              value: events.filter(e => e.dayOfWeek >= 0 && e.dayOfWeek <= 6).length,
              unit: "개",
              emoji: "📅",
              color: "#007AFF",
              bg: "#EEF5FF",
              onClick: () => setTab("캘린더"),
            },
            {
              label: "진행 챌린지",
              value: challengeJoined.length,
              unit: "개",
              emoji: "🏅",
              color: "#34C759",
              bg: "#EDFFF4",
              onClick: () => setTab("챌린지"),
            },
            {
              label: "장바구니",
              value: cartCount,
              unit: "개",
              emoji: "🛍️",
              color: "#FF5C1A",
              bg: "#FFF5F0",
              onClick: () => {},
            },
            {
              label: "획득 배지",
              value: challengeBadges.length,
              unit: "개",
              emoji: "✨",
              color: "#5856D6",
              bg: "#F0EEFF",
              onClick: () => setTab("챌린지"),
            },
          ].map((stat) => (
            <motion.button
              key={stat.label}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={stat.onClick}
              style={{
                backgroundColor: stat.bg, borderRadius: "16px",
                padding: "16px 12px", border: "none", cursor: "pointer",
                textAlign: "center", transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{stat.emoji}</div>
              <div style={{ fontSize: "22px", fontWeight: 900, color: stat.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {stat.value as number}<span style={{ fontSize: "12px", fontWeight: 700 }}>{stat.unit}</span>
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginTop: "4px" }}>{stat.label}</div>
            </motion.button>
          ))}
        </div>

        {/* ── TABS ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", borderBottom: "1px solid #F2F4F7", marginBottom: "36px", overflowX: "auto" }}>
          {(["글관리", "말씀", "캘린더", "찬양", "주문", "챌린지"] as MainTab[]).map((t, i) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: "0 0 auto", padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: tab === t ? 900 : 600,
              color: tab === t ? "#0D2B4E" : "#94A3B8",
              borderBottom: tab === t ? "3px solid #0D2B4E" : "3px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>
              {["내 글관리", "저장한 말씀", "나의 캘린더", "찬양 플리", "주문/활동", "신앙 챌린지"][i]}
              {t === "주문" && orders.length > 0 && (
                <span style={{ marginLeft: "6px", backgroundColor: "#FF5C1A", color: "#fff", fontSize: "10px", fontWeight: 900, borderRadius: "100px", padding: "1px 7px" }}>{orders.length}</span>
              )}
              {t === "챌린지" && Object.keys(challengeJoined).length > 0 && (
                <span style={{ marginLeft: "6px", backgroundColor: "#34C759", color: "#fff", fontSize: "10px", fontWeight: 900, borderRadius: "100px", padding: "1px 7px" }}>{Object.keys(challengeJoined).length}</span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── TAB: 글관리 ──────────────────────────────────────── */}
          {tab === "글관리" && (
            <motion.div key="글관리"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600 }}>총 {essays.length}개의 글</p>
                <button onClick={() => setShowEditor(true)} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 22px", borderRadius: "100px", border: "none",
                  backgroundColor: "#FF5C1A", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                }}>
                  ✏️ 새 글 쓰기
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {essays.length === 0 && (
                  <div style={{ textAlign: "center", padding: "64px 0", color: "#94A3B8" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>✍️</div>
                    <p style={{ fontSize: "15px", fontWeight: 700 }}>아직 작성한 글이 없어요</p>
                    <p style={{ fontSize: "13px", marginTop: "6px" }}>오늘의 묵상을 기록해보세요</p>
                  </div>
                )}
                {essays.map((essay, i) => (
                  <motion.div key={essay.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => setViewing(essay)}
                    style={{
                      padding: "20px 24px", borderRadius: "20px", cursor: "pointer",
                      border: "1px solid #F2F4F7", backgroundColor: "#fff",
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "16px" }}>{essay.emoji}</span>
                        <span style={{
                          fontSize: "10px", fontWeight: 700, color: "#FF5C1A",
                          backgroundColor: "#FFF5F0", padding: "2px 8px", borderRadius: "100px",
                        }}>{essay.tag}</span>
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#0D2B4E", marginBottom: "4px" }}>{essay.title}</p>
                      <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>{essay.excerpt}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "20px" }}>
                      <p style={{ fontSize: "11px", color: "#CBD5E1" }}>{essay.date}</p>
                      <button
                        onClick={e => { e.stopPropagation(); setEssays(prev => prev.filter(es => es.id !== essay.id)); }}
                        style={{
                          marginTop: "8px", background: "none", border: "none", cursor: "pointer",
                          fontSize: "11px", fontWeight: 700, padding: 0, color: "#E2E8F0",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#FF5C1A"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#E2E8F0"}
                      >
                        삭제
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TAB: 말씀 ────────────────────────────────────────── */}
          {tab === "말씀" && (
            <motion.div key="말씀"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {/* Life verse card */}
              <div style={{
                borderRadius: "24px", padding: "40px 44px",
                background: "linear-gradient(135deg, #EBF5FF 0%, #D6E9FF 100%)",
                border: "1px solid rgba(0,0,0,0.04)", marginBottom: "32px",
                position: "relative", overflow: "hidden",
              }}>
                <span style={{
                  position: "absolute", top: 0, left: "16px",
                  fontSize: "110px", fontWeight: 900, color: "rgba(13,43,78,0.05)",
                  lineHeight: 1, userSelect: "none",
                }}>&ldquo;</span>

                <p style={{ fontSize: "10px", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.14em", marginBottom: "20px" }}>
                  LIFE VERSE
                </p>

                {editingVerse ? (
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <textarea value={verseDraftText} onChange={e => setVerseDraftText(e.target.value)} rows={5}
                      style={{
                        width: "100%", padding: "16px 18px", fontSize: "18px", lineHeight: 1.9, fontWeight: 400,
                        border: "1px solid rgba(13,43,78,0.15)", borderRadius: "16px",
                        outline: "none", resize: "none", color: "#0D2B4E",
                        background: "rgba(255,255,255,0.75)", boxSizing: "border-box", marginBottom: "12px",
                      }} />
                    <input value={verseDraftRef} onChange={e => setVerseDraftRef(e.target.value)}
                      placeholder="성경 구절 출처 (예: 예레미야 33:3)"
                      style={{
                        width: "100%", padding: "11px 16px", fontSize: "13px", fontWeight: 700,
                        border: "1px solid rgba(13,43,78,0.15)", borderRadius: "100px",
                        outline: "none", background: "rgba(255,255,255,0.75)",
                        boxSizing: "border-box", marginBottom: "16px",
                      }} />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => { setVerseDraftText(lifeVerse); setVerseDraftRef(lifeVerseRef); setEditingVerse(false); }} style={{
                        flex: 1, padding: "11px", borderRadius: "100px",
                        border: "1px solid rgba(13,43,78,0.15)", background: "transparent",
                        fontSize: "13px", fontWeight: 700, cursor: "pointer", color: "#64748B",
                      }}>취소</button>
                      <button onClick={() => { setLifeVerse(verseDraftText); setLifeVerseRef(verseDraftRef); setEditingVerse(false); }} style={{
                        flex: 1, padding: "11px", borderRadius: "100px", border: "none",
                        background: "#0D2B4E", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                      }}>저장</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <p style={{ fontSize: "19px", fontWeight: 400, lineHeight: 1.95, whiteSpace: "pre-line", color: "#0D2B4E", marginBottom: "24px" }}>
                      {lifeVerse}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "rgba(13,43,78,0.4)" }}>{lifeVerseRef}</p>
                      <button onClick={() => { setVerseDraftText(lifeVerse); setVerseDraftRef(lifeVerseRef); setEditingVerse(true); }} style={{
                        background: "none", border: "1px solid rgba(13,43,78,0.15)", borderRadius: "100px",
                        padding: "7px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#64748B",
                      }}>✏️ 편집</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Saved verses */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ fontSize: "14px", fontWeight: 700 }}>
                  저장한 말씀 <span style={{ color: "#94A3B8", fontWeight: 600, fontSize: "13px" }}>{savedVerses.length}</span>
                </p>
                <button onClick={() => setAddingVerse(true)} style={{
                  padding: "8px 18px", borderRadius: "100px", border: "1.5px solid #0D2B4E",
                  background: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#0D2B4E",
                }}>+ 말씀 추가</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {savedVerses.map((sv, i) => (
                  <motion.div key={sv.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    style={{
                      padding: "22px 24px", borderRadius: "20px", border: "1px solid #F2F4F7",
                      borderLeft: "4px solid #FF5C1A", backgroundColor: "#fff",
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "15px", lineHeight: 1.85, color: "#374151", fontStyle: "italic", marginBottom: "12px" }}>
                        "{sv.text}"
                      </p>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#FF5C1A" }}>{sv.ref}</p>
                      {sv.note && <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>{sv.note}</p>}
                    </div>
                    <button
                      onClick={() => setSavedVerses(prev => prev.filter(v => v.id !== sv.id))}
                      style={{
                        marginLeft: "16px", background: "none", border: "none", cursor: "pointer",
                        fontSize: "11px", fontWeight: 700, padding: 0, color: "#E2E8F0", flexShrink: 0,
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#FF5C1A"}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#E2E8F0"}
                    >삭제</button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TAB: 캘린더 ──────────────────────────────────────── */}
          {tab === "캘린더" && (
            <motion.div key="캘린더"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>빈 칸 클릭으로 추가 · 이벤트 클릭으로 삭제</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => goWeek(-1)} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    border: "1px solid #F2F4F7", background: "#fff", fontSize: "16px", cursor: "pointer", fontWeight: 700,
                  }}>‹</button>
                  <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "80px", textAlign: "center" }}>
                    {weekStart.getFullYear()}년 {weekStart.getMonth() + 1}월
                  </span>
                  <button onClick={() => goWeek(1)} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    border: "1px solid #F2F4F7", background: "#fff", fontSize: "16px", cursor: "pointer", fontWeight: 700,
                  }}>›</button>
                </div>
              </div>

              <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #F2F4F7" }}>
                {/* Day headers */}
                <div style={{ display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)", backgroundColor: "#F8FAFC" }}>
                  <div style={{ borderRight: "1px solid #F2F4F7" }} />
                  {weekDays.map((d, i) => {
                    const isToday = d.toDateString() === TODAY.toDateString();
                    return (
                      <div key={i} style={{
                        padding: "10px 0", textAlign: "center",
                        borderRight: i < 6 ? "1px solid #F2F4F7" : "none",
                      }}>
                        <p style={{ fontSize: "10px", fontWeight: 700, color: i >= 5 ? "#FF5C1A" : "#94A3B8", marginBottom: "4px" }}>
                          {DAYS[i]}
                        </p>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", margin: "0 auto",
                          backgroundColor: isToday ? "#FF5C1A" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: isToday ? "#fff" : "#0D2B4E" }}>
                            {d.getDate()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Time rows */}
                <div style={{ maxHeight: "520px", overflowY: "auto" }}>
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
                          <div key={day}
                            onClick={() => ces.length === 0 && setAddCell({ day, hour })}
                            style={{
                              borderRight: day < 6 ? "1px solid #F2F4F7" : "none",
                              padding: "3px", cursor: ces.length === 0 ? "pointer" : "default",
                              minHeight: "52px", transition: "background-color 0.15s",
                            }}
                            onMouseEnter={e => {
                              if (ces.length === 0)
                                (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F8FAFC";
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                            }}
                          >
                            {ces.map(ev => (
                              <div key={ev.id}
                                onClick={e => { e.stopPropagation(); calendarStore.remove(ev.id); }}
                                title="클릭해서 삭제"
                                style={{
                                  backgroundColor: ev.color + "18", borderLeft: `3px solid ${ev.color}`,
                                  borderRadius: "5px", padding: "3px 5px", marginBottom: "2px", cursor: "pointer",
                                }}
                              >
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
            </motion.div>
          )}
          {/* ── TAB: 찬양 ────────────────────────────────────────── */}
          {tab === "찬양" && (
            <motion.div key="찬양"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {/* Header */}
              <div style={{
                borderRadius: "24px", padding: "36px 32px", marginBottom: "28px",
                background: "linear-gradient(135deg, #1C1C2E 0%, #2D1B5E 60%, #1A1A3E 100%)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: "-30px", right: "-30px",
                  width: "160px", height: "160px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                }} />
                <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.16em", marginBottom: "10px" }}>
                  WORSHIP PLAYLIST
                </p>
                <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#fff", marginBottom: "6px" }}>나의 찬양 플레이리스트</h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{songs.length}곡</p>
              </div>

              {/* Add button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                <button onClick={() => { setAddingSong(true); setNewSong({ title: "", artist: "", youtubeUrl: "" }); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "10px 22px", borderRadius: "100px", border: "none",
                    backgroundColor: "#5856D6", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  }}>
                  + 찬양 추가
                </button>
              </div>

              {/* Song list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {songs.length === 0 && (
                  <div style={{ textAlign: "center", padding: "64px 0", color: "#94A3B8" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎵</div>
                    <p style={{ fontSize: "15px", fontWeight: 700 }}>아직 추가한 찬양이 없어요</p>
                  </div>
                )}
                {songs.map((song, i) => (
                  <motion.div key={song.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px",
                      padding: "12px 16px", borderRadius: "16px",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F8FAFC"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"}
                  >
                    {/* Track number */}
                    <span style={{ width: "24px", textAlign: "right", fontSize: "13px", color: "#CBD5E1", fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>

                    {/* Thumbnail */}
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "10px", flexShrink: 0,
                      background: THUMB_GRADIENTS[i % THUMB_GRADIENTS.length],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px",
                    }}>
                      {song.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#0D2B4E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {song.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>{song.artist}</p>
                    </div>

                    {/* YouTube link */}
                    {song.youtubeUrl && (
                      <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          padding: "6px 12px", borderRadius: "100px",
                          backgroundColor: "#FF0000", color: "#fff",
                          fontSize: "10px", fontWeight: 700, textDecoration: "none", flexShrink: 0,
                        }}>
                        ▶ YouTube
                      </a>
                    )}

                    {/* Delete */}
                    <button onClick={() => setSongs(prev => prev.filter(s => s.id !== song.id))}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "12px", fontWeight: 700, padding: "4px 8px",
                        color: "#E2E8F0", flexShrink: 0, transition: "color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#FF5C1A"}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#E2E8F0"}
                    >삭제</button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TAB: 주문/활동 ─────────────────────────────────── */}
          {tab === "주문" && (
            <motion.div key="주문"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 900 }}>나의 주문 내역</h2>
                {orders.length > 0 && <span style={{ fontSize: "13px", color: "#94A3B8" }}>총 {orders.length}건</span>}
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "72px 0", color: "#94A3B8" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
                  <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>아직 주문 내역이 없어요</p>
                  <p style={{ fontSize: "13px" }}>스토어에서 마음에 드는 상품을 구매해보세요</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orders.map((order, i) => {
                    const statusColor = order.status === "배송완료" ? "#34C759" : order.status === "배송중" ? "#007AFF" : order.status === "배송준비중" ? "#FF9500" : "#FF5C1A";
                    return (
                      <motion.div key={order.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ borderRadius: "20px", border: "1px solid #F2F4F7", backgroundColor: "#fff", overflow: "hidden" }}
                      >
                        {/* Order header */}
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FAFAFA" }}>
                          <div>
                            <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600 }}>주문번호 {order.id.replace("ord-", "")}</p>
                            <p style={{ fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>{order.date}</p>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 900, color: statusColor, backgroundColor: `${statusColor}18`, padding: "4px 12px", borderRadius: "100px" }}>
                            {order.status}
                          </span>
                        </div>

                        {/* Items */}
                        <div style={{ padding: "14px 20px" }}>
                          {order.items.map(item => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                                {item.emoji}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: "13px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                                <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>{item.brand} · {item.qty}개</p>
                              </div>
                              <p style={{ fontSize: "13px", fontWeight: 900, color: "#0D2B4E", flexShrink: 0 }}>{(item.priceNum * item.qty).toLocaleString()}원</p>
                            </div>
                          ))}
                        </div>

                        {/* Order footer */}
                        <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #F8FAFC" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <div style={{ display: "flex", gap: "12px" }}>
                              <span style={{ fontSize: "11px", color: "#94A3B8" }}>결제 · {order.paymentMethod}</span>
                              <span style={{ fontSize: "11px", color: "#94A3B8" }}>배송 · {order.shipping === 0 ? "무료" : `${order.shipping.toLocaleString()}원`}</span>
                            </div>
                            <p style={{ fontSize: "15px", fontWeight: 900, color: "#FF5C1A" }}>{order.total.toLocaleString()}원</p>
                          </div>
                          <p style={{ fontSize: "11px", color: "#CBD5E1" }}>📍 {order.shippingInfo.address} {order.shippingInfo.detail}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB: 챌린지 ──────────────────────────────────────── */}
          {tab === "챌린지" && (
            <motion.div key="챌린지"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {/* Earned badges */}
              {challengeBadges.length > 0 && (
                <div style={{ marginBottom: "36px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "16px" }}>
                    획득한 배지 <span style={{ fontSize: "14px", color: "#94A3B8", fontWeight: 600 }}>{challengeBadges.length}개</span>
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    {challengeBadges.map((b) => (
                      <motion.div key={b.id}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        style={{
                          borderRadius: "20px", padding: "20px 16px", textAlign: "center",
                          background: "linear-gradient(135deg,#F8FAFC,#F0F4F8)",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div style={{ fontSize: "36px", marginBottom: "8px" }}>{b.emoji}</div>
                        <p style={{ fontSize: "12px", fontWeight: 900, color: "#0D2B4E", marginBottom: "4px" }}>{b.label}</p>
                        <p style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "4px", lineHeight: 1.4 }}>{b.challengeTitle.replace("챌린지", "").replace("— ", "")}</p>
                        <p style={{ fontSize: "10px", color: "#CBD5E1" }}>{b.earnedAt}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenge progress */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 900 }}>참여 중인 챌린지</h2>
                <Link href="/action" style={{ textDecoration: "none" }}>
                  <button style={{
                    padding: "8px 18px", borderRadius: "100px", border: "1.5px solid #34C759",
                    background: "transparent", fontSize: "12px", fontWeight: 700, color: "#34C759", cursor: "pointer",
                  }}>
                    챌린지 탐색 →
                  </button>
                </Link>
              </div>

              {Object.keys(challengeJoined).length === 0 ? (
                <div style={{ textAlign: "center", padding: "72px 0", color: "#94A3B8" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌱</div>
                  <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>아직 참여한 챌린지가 없어요</p>
                  <p style={{ fontSize: "13px", marginBottom: "24px" }}>신앙 챌린지에 참여하고 배지를 모아보세요</p>
                  <Link href="/action" style={{ textDecoration: "none" }}>
                    <button style={{
                      padding: "12px 28px", borderRadius: "100px", border: "none",
                      backgroundColor: "#34C759", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                    }}>
                      챌린지 시작하기
                    </button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {faithChallenges
                    .filter((ch) => challengeJoined[ch.id])
                    .map((ch, i) => {
                      const cp = challengeJoined[ch.id];
                      const myBadges = challengeBadges.filter((b) => b.challengeId === ch.id);
                      return (
                        <motion.div key={ch.id}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                          style={{
                            borderRadius: "20px", padding: "24px", border: "1px solid #F2F4F7",
                            backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                            <span style={{ fontSize: "32px" }}>{ch.emoji}</span>
                            <div style={{ flex: 1 }}>
                              <span style={{
                                display: "inline-block", padding: "3px 9px", borderRadius: "100px",
                                fontSize: "10px", fontWeight: 900,
                                backgroundColor: `${ch.color}18`, color: ch.color, marginBottom: "4px",
                              }}>
                                {ch.categoryLabel}
                              </span>
                              <h3 style={{ fontSize: "15px", fontWeight: 900, margin: 0 }}>{ch.title}</h3>
                            </div>
                            {myBadges.length > 0 && (
                              <div style={{ display: "flex", gap: "4px" }}>
                                {myBadges.map((b) => (
                                  <span key={b.id} title={b.label} style={{ fontSize: "18px" }}>{b.emoji}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Progress */}
                          <div style={{ marginBottom: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>
                                {cp.checkInCount}일 달성 / 목표 {ch.totalDays}일
                              </span>
                              <span style={{ fontSize: "13px", fontWeight: 900, color: ch.color }}>{cp.progress}%</span>
                            </div>
                            <div style={{ height: "10px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
                              <motion.div
                                animate={{ width: `${cp.progress}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ height: "100%", borderRadius: "100px", backgroundColor: ch.color }}
                              />
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>참여일: {cp.joinedAt}</span>
                            <button
                              onClick={() => challengeStore.checkIn(ch.id, ch.totalDays, ch.title)}
                              disabled={cp.progress >= 100}
                              style={{
                                padding: "9px 20px", borderRadius: "100px", border: "none",
                                cursor: cp.progress >= 100 ? "default" : "pointer",
                                fontSize: "13px", fontWeight: 700, transition: "all 0.2s",
                                backgroundColor: cp.progress >= 100 ? "#F0FBF4" : ch.color,
                                color: cp.progress >= 100 ? "#34C759" : "#fff",
                              }}
                            >
                              {cp.progress >= 100 ? "🏆 완주 완료!" : "✓ 오늘 체크인"}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ══ MODALS ═══════════════════════════════════════════════════════════ */}

      {/* Write editor */}
      <AnimatePresence>
        {showEditor && (
          <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", flexDirection: "column" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(13,43,78,0.45)", backdropFilter: "blur(6px)" }}
              onClick={() => setShowEditor(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "relative", zIndex: 1, marginTop: "auto",
                backgroundColor: "#fff", borderRadius: "28px 28px 0 0",
                padding: "32px 36px 52px", maxHeight: "88vh", overflowY: "auto",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ width: "40px", height: "4px", borderRadius: "100px", backgroundColor: "#E2E8F0", margin: "0 auto 24px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 900 }}>새 글 쓰기</h2>
                <button onClick={() => setShowEditor(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#94A3B8" }}>✕</button>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "10px" }}>태그</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {ESSAY_TAGS.map(tag => (
                    <button key={tag} onClick={() => setDraft(d => ({ ...d, tag }))} style={{
                      padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                      border: draft.tag === tag ? "2px solid #FF5C1A" : "1px solid #F2F4F7",
                      backgroundColor: draft.tag === tag ? "#FFF5F0" : "#fff",
                      color: draft.tag === tag ? "#FF5C1A" : "#64748B",
                    }}>{tag}</button>
                  ))}
                </div>
              </div>
              <input placeholder="제목" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                style={{
                  width: "100%", padding: "14px 0", fontSize: "22px", fontWeight: 900,
                  border: "none", borderBottom: "2px solid #F2F4F7", outline: "none",
                  marginBottom: "16px", boxSizing: "border-box", color: "#0D2B4E",
                }} />
              <textarea placeholder="오늘의 묵상, 감사한 일, 나누고 싶은 이야기를 자유롭게 써주세요." rows={10}
                value={draft.content} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
                style={{
                  width: "100%", padding: "16px 0", fontSize: "16px", lineHeight: 1.9,
                  border: "none", outline: "none", resize: "none", color: "#374151", boxSizing: "border-box",
                }} />
              <button onClick={handlePublish} disabled={!draft.title.trim() || !draft.content.trim()} style={{
                width: "100%", padding: "16px", borderRadius: "100px", border: "none",
                backgroundColor: draft.title && draft.content ? "#FF5C1A" : "#E2E8F0",
                color: draft.title && draft.content ? "#fff" : "#94A3B8",
                fontSize: "16px", fontWeight: 700,
                cursor: draft.title && draft.content ? "pointer" : "not-allowed",
                marginTop: "20px",
              }}>게시하기</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Essay viewer */}
      <AnimatePresence>
        {viewing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewing(null)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 400 }} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
              style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                backgroundColor: "#fff", borderRadius: "28px", padding: "40px",
                width: "600px", maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto",
                zIndex: 401, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 700, color: "#FF5C1A",
                  backgroundColor: "#FFF5F0", padding: "4px 12px", borderRadius: "100px",
                }}>{viewing.tag}</span>
                <button onClick={() => setViewing(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#94A3B8" }}>✕</button>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "8px" }}>{viewing.title}</h2>
              <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "28px" }}>{viewing.date}</p>
              <p style={{ fontSize: "16px", lineHeight: 1.95, color: "#374151", whiteSpace: "pre-line" }}>{viewing.content}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add verse */}
      <AnimatePresence>
        {addingVerse && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAddingVerse(false)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 400 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                backgroundColor: "#fff", borderRadius: "28px", padding: "36px",
                width: "480px", maxWidth: "90vw", zIndex: 401,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "20px" }}>말씀 추가</h3>
              <textarea placeholder="말씀 본문을 입력하세요" rows={4}
                value={newVerse.text} onChange={e => setNewVerse(v => ({ ...v, text: e.target.value }))}
                style={{
                  width: "100%", padding: "14px 18px", borderRadius: "16px",
                  border: "1px solid #F2F4F7", fontSize: "14px", lineHeight: 1.75,
                  outline: "none", resize: "none", boxSizing: "border-box", marginBottom: "10px",
                }} />
              <input placeholder="출처 (예: 요한복음 3:16)"
                value={newVerse.ref} onChange={e => setNewVerse(v => ({ ...v, ref: e.target.value }))}
                style={{
                  width: "100%", padding: "12px 18px", borderRadius: "100px",
                  border: "1px solid #F2F4F7", fontSize: "13px",
                  outline: "none", boxSizing: "border-box", marginBottom: "10px",
                }} />
              <input placeholder="메모 (선택사항)"
                value={newVerse.note} onChange={e => setNewVerse(v => ({ ...v, note: e.target.value }))}
                style={{
                  width: "100%", padding: "12px 18px", borderRadius: "100px",
                  border: "1px solid #F2F4F7", fontSize: "13px",
                  outline: "none", boxSizing: "border-box", marginBottom: "20px",
                }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setAddingVerse(false)} style={{
                  flex: 1, padding: "14px", borderRadius: "100px", border: "1px solid #F2F4F7",
                  background: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", color: "#64748B",
                }}>취소</button>
                <button onClick={() => {
                  if (!newVerse.text.trim() || !newVerse.ref.trim()) return;
                  setSavedVerses(prev => [{
                    id: `v-${Date.now()}`, text: newVerse.text,
                    ref: newVerse.ref, note: newVerse.note || undefined,
                  }, ...prev]);
                  setNewVerse({ text: "", ref: "", note: "" });
                  setAddingVerse(false);
                }} style={{
                  flex: 1, padding: "14px", borderRadius: "100px", border: "none",
                  backgroundColor: "#0D2B4E", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                }}>저장</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add song */}
      <AnimatePresence>
        {addingSong && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAddingSong(false)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 400 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                backgroundColor: "#fff", borderRadius: "28px", padding: "36px",
                width: "480px", maxWidth: "90vw", zIndex: 401,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "20px" }}>찬양 추가</h3>
              <input placeholder="곡 제목 *" value={newSong.title}
                onChange={e => setNewSong(s => ({ ...s, title: e.target.value }))}
                style={{
                  width: "100%", padding: "12px 18px", borderRadius: "100px",
                  border: "1px solid #F2F4F7", fontSize: "14px",
                  outline: "none", boxSizing: "border-box", marginBottom: "10px",
                }} />
              <input placeholder="아티스트 / 찬양팀 *" value={newSong.artist}
                onChange={e => setNewSong(s => ({ ...s, artist: e.target.value }))}
                style={{
                  width: "100%", padding: "12px 18px", borderRadius: "100px",
                  border: "1px solid #F2F4F7", fontSize: "14px",
                  outline: "none", boxSizing: "border-box", marginBottom: "10px",
                }} />
              <input placeholder="YouTube URL (선택사항)" value={newSong.youtubeUrl}
                onChange={e => setNewSong(s => ({ ...s, youtubeUrl: e.target.value }))}
                style={{
                  width: "100%", padding: "12px 18px", borderRadius: "100px",
                  border: "1px solid #F2F4F7", fontSize: "14px",
                  outline: "none", boxSizing: "border-box", marginBottom: "20px",
                }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setAddingSong(false)} style={{
                  flex: 1, padding: "14px", borderRadius: "100px", border: "1px solid #F2F4F7",
                  background: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", color: "#64748B",
                }}>취소</button>
                <button onClick={() => {
                  if (!newSong.title.trim() || !newSong.artist.trim()) return;
                  setSongs(prev => [...prev, {
                    id: `s-${Date.now()}`, title: newSong.title.trim(),
                    artist: newSong.artist.trim(),
                    youtubeUrl: newSong.youtubeUrl.trim() || undefined,
                    emoji: "🎵",
                  }]);
                  setAddingSong(false);
                }} style={{
                  flex: 1, padding: "14px", borderRadius: "100px", border: "none",
                  backgroundColor: "#5856D6", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                }}>추가</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add calendar event */}
      <AnimatePresence>
        {addCell && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAddCell(null)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 400 }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                backgroundColor: "#fff", borderRadius: "28px", padding: "32px",
                width: "360px", maxWidth: "90vw", zIndex: 401,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "4px" }}>일정 추가</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "20px" }}>
                {DAYS[addCell.day]}요일 {String(addCell.hour).padStart(2, "0")}:00
              </p>
              <input autoFocus value={evTitle} onChange={e => setEvTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddEvent()}
                placeholder="일정 제목"
                style={{
                  width: "100%", padding: "12px 18px", borderRadius: "100px",
                  border: "1px solid #F2F4F7", fontSize: "14px",
                  outline: "none", boxSizing: "border-box", marginBottom: "16px",
                }} />
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "10px" }}>색상</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                {PALETTE.map(c => (
                  <button key={c} onClick={() => setEvColor(c)} style={{
                    width: "26px", height: "26px", borderRadius: "50%", padding: 0,
                    border: c === evColor ? "3px solid #0D2B4E" : "2px solid transparent",
                    backgroundColor: c, cursor: "pointer",
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setAddCell(null)} style={{
                  flex: 1, padding: "14px", borderRadius: "100px", border: "1px solid #F2F4F7",
                  background: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", color: "#64748B",
                }}>취소</button>
                <button onClick={handleAddEvent} style={{
                  flex: 1, padding: "14px", borderRadius: "100px", border: "none",
                  backgroundColor: "#0D2B4E", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                }}>추가</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
