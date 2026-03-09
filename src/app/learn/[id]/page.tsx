"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { mockPosts } from "@/lib/mockData";
import { calendarStore, parseDateToEvent } from "@/lib/calendarStore";

type CalStatus = "idle" | "added" | "duplicate";

const TAG_GRADIENTS: Record<string, string> = {
  "자녀양육":    "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
  "기독교세계관": "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
  "글로벌인재":  "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
  "대안학교":   "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
  "찬양":      "linear-gradient(135deg, #F9CA24 0%, #F0932B 100%)",
  "재정":      "linear-gradient(135deg, #30336B 0%, #4A4DBF 100%)",
  "영어":      "linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)",
};

const CURRICULUM: Record<string, string[]> = {
  "자녀양육":    ["성경이 말하는 부모의 사명", "0-7세 신앙 교육법", "미디어 시대의 자녀 보호", "반항기 자녀와의 소통", "가정예배 어떻게 드릴까", "말씀 중심 훈육 실전"],
  "기독교세계관": ["세계관이란 무엇인가", "성경적 인간관·창조론", "사회·문화 비판적 읽기", "기독교 정치 참여론", "AI·기술 시대의 크리스천", "실천적 대안 찾기"],
  "글로벌인재":  ["소명과 직업", "글로벌 언어·문화 이해", "해외 취업·유학 전략", "선교적 직업관", "글로벌 네트워킹", "현장 멘토링 Q&A"],
  "대안학교":   ["대안교육 패러다임", "성경적 교육 철학", "커리큘럼 설계", "교사 채용 및 양성", "인가 및 법적 절차", "운영 사례 분석"],
  "default":   ["기초 개념 정립", "핵심 원리 이해", "실전 적용 훈련", "심화 및 Q&A"],
};

interface Review { id: string; author: string; rating: number; content: string; date: string; }

const SEED_REVIEWS: Record<string, Review[]> = {
  "c1": [
    { id: "r1", author: "김○○", rating: 5, content: "실제로 아이와의 관계가 달라졌어요. 구체적이고 성경적인 조언들이 큰 도움이 됐습니다.", date: "2026.02.14" },
    { id: "r2", author: "박○○", rating: 5, content: "강사님의 경험담이 너무 현실적이에요. 비슷한 고민을 가진 분들께 강추합니다.", date: "2026.02.20" },
  ],
  "c2": [
    { id: "r3", author: "이○○", rating: 5, content: "뉴스를 보는 시각 자체가 바뀌었습니다. 기독교인이라면 꼭 들어야 할 강의.", date: "2026.02.18" },
    { id: "r4", author: "최○○", rating: 4, content: "내용은 탁월한데 속도가 좀 빨라요. 그래도 전반적으로 매우 유익했습니다.", date: "2026.03.01" },
  ],
  "c3": [{ id: "r5", author: "정○○", rating: 5, content: "직업을 소명으로 바라보는 시각이 완전히 달라졌어요. 인생 강의입니다.", date: "2026.02.25" }],
  "c4": [{ id: "r6", author: "한○○", rating: 5, content: "대안학교를 준비 중인데 실질적인 로드맵을 얻었어요. 진짜 살아있는 강의.", date: "2026.03.02" }],
};

const Stars = ({ rating, size = 18, interactive = false, onRate }: {
  rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void;
}) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} onClick={() => interactive && onRate?.(s)}
        style={{ fontSize: `${size}px`, cursor: interactive ? "pointer" : "default", color: s <= rating ? "#FFD600" : "#E2E8F0", transition: "color 0.1s" }}>
        ★
      </span>
    ))}
  </div>
);

export default function LearnDetail() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find((p) => p.id === id && p.type === "learn");
  const [enrolled, setEnrolled] = useState(false);
  const [calStatus, setCalStatus] = useState<CalStatus>("idle");
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS[id] || []);
  const [draft, setDraft] = useState({ rating: 0, content: "" });

  if (!post) {
    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
        <Nav />
        <div style={{ padding: "80px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#94A3B8" }}>클래스를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const gradient = TAG_GRADIENTS[post.tag] || "linear-gradient(135deg, #0D2B4E 0%, #34A5FF 100%)";
  const curriculum = CURRICULUM[post.tag] || CURRICULUM["default"];
  const pct = Math.round((post.currentParticipants / post.maxParticipants) * 100);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const handleAddToCalendar = () => {
    const parsed = parseDateToEvent(post.date, post.title, post.emoji, "#34C759", post.id);
    const added = calendarStore.add(
      parsed ?? { title: post.title, emoji: post.emoji, color: "#34C759", dayOfWeek: 6, startHour: 10, sourceId: post.id }
    );
    setCalStatus(added ? "added" : "duplicate");
    setTimeout(() => setCalStatus("idle"), 2500);
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.rating === 0 || !draft.content.trim()) return;
    setReviews((prev) => [{
      id: `r-${Date.now()}`, author: "나", rating: draft.rating,
      content: draft.content, date: new Date().toLocaleDateString("ko-KR"),
    }, ...prev]);
    setDraft({ rating: 0, content: "" });
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Hero */}
          <div style={{
            height: "280px", borderRadius: "24px", background: gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "96px", marginBottom: "32px",
          }}>
            {post.emoji}
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "#E8F9EE", color: "#34C759", padding: "4px 12px", borderRadius: "100px" }}>{post.tag}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "#F8FAFC", color: "#64748B", padding: "4px 12px", borderRadius: "100px" }}>{post.status}</span>
            {avgRating && (
              <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "#FFF9E6", color: "#FF9500", padding: "4px 12px", borderRadius: "100px" }}>
                ★ {avgRating} ({reviews.length}개 후기)
              </span>
            )}
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "12px" }}>{post.title}</h1>
          <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.7, marginBottom: "24px" }}>{post.description}</p>

          {/* Instructor */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: "#F8FAFC", borderRadius: "14px", marginBottom: "28px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", backgroundColor: "#0D2B4E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
              {post.host.name[0]}
            </div>
            <div>
              <Link href={`/profile/${post.host.id}`} style={{ textDecoration: "none" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#0D2B4E", borderBottom: "1px solid #E2E8F0", display: "inline" }}>
                  {post.host.name}
                </p>
              </Link>
              <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>
                {post.host.isVerified ? "✓ 인증 강사" : "강사"} · 📅 {post.date} · 📍 {post.location}
              </p>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#F2F4F7", margin: "0 0 28px" }} />

          {/* Curriculum */}
          <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "16px" }}>커리큘럼</h2>
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #F2F4F7", marginBottom: "28px" }}>
            {curriculum.map((lesson, i) => (
              <div key={i} style={{
                padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px",
                borderBottom: i < curriculum.length - 1 ? "1px solid #F8FAFC" : "none",
              }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#0D2B4E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: "14px", color: "#0D2B4E" }}>{lesson}</span>
              </div>
            ))}
          </div>

          {/* Enrollment */}
          <div style={{ padding: "24px", borderRadius: "20px", backgroundColor: "#F8FAFC", marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
              <span style={{ fontWeight: 700 }}>수강 현황</span>
              <span style={{ fontWeight: 900, color: "#34C759" }}>{post.currentParticipants}/{post.maxParticipants}명 ({pct}%)</span>
            </div>
            <div style={{ height: "8px", borderRadius: "100px", backgroundColor: "#E2E8F0", overflow: "hidden", marginBottom: "20px" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: "100px", backgroundColor: "#34C759" }} />
            </div>
            <button onClick={() => setEnrolled(!enrolled)} style={{
              width: "100%", padding: "16px", borderRadius: "100px", border: "none",
              backgroundColor: enrolled ? "#0D2B4E" : "#34C759",
              color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", transition: "background-color 0.3s",
            }}>
              {enrolled ? "✓ 수강 신청 완료" : "수강 신청하기"}
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleAddToCalendar}
              style={{
                width: "100%", padding: "14px", borderRadius: "100px", border: "none",
                marginTop: "10px",
                backgroundColor: calStatus === "added" ? "#34C759" : calStatus === "duplicate" ? "#94A3B8" : "#F8FAFC",
                color: calStatus === "idle" ? "#0D2B4E" : "#fff",
                fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.3s",
              }}
            >
              {calStatus === "added" ? "✓ 내 캘린더에 추가됐어요!" : calStatus === "duplicate" ? "이미 캘린더에 있어요" : "📅 내 캘린더에 추가하기"}
            </motion.button>
          </div>

          <div style={{ height: "1px", backgroundColor: "#F2F4F7", margin: "0 0 28px" }} />

          {/* Reviews */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 900 }}>수강 후기</h2>
            {avgRating && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Stars rating={Math.round(parseFloat(avgRating))} size={15} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#FF9500" }}>{avgRating}</span>
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>({reviews.length})</span>
              </div>
            )}
          </div>

          {/* Review Write */}
          <form onSubmit={handleReview} style={{ backgroundColor: "#F8FAFC", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>별점을 선택해주세요</p>
            <Stars rating={draft.rating} size={28} interactive onRate={(r) => setDraft((d) => ({ ...d, rating: r }))} />
            <textarea
              placeholder="이 클래스에 대한 솔직한 후기를 남겨주세요."
              rows={3} required
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              style={{
                width: "100%", marginTop: "12px", padding: "12px 14px",
                borderRadius: "12px", border: "1px solid #F2F4F7",
                fontSize: "14px", resize: "none", outline: "none",
                backgroundColor: "#fff", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
            <button type="submit" disabled={draft.rating === 0}
              style={{
                marginTop: "10px", padding: "10px 24px", borderRadius: "100px", border: "none",
                backgroundColor: draft.rating > 0 ? "#34C759" : "#E2E8F0",
                color: draft.rating > 0 ? "#fff" : "#94A3B8",
                fontSize: "13px", fontWeight: 700, cursor: draft.rating > 0 ? "pointer" : "not-allowed",
              }}>
              후기 등록
            </button>
          </form>

          {/* Review List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviews.length === 0 && (
              <p style={{ fontSize: "14px", color: "#94A3B8", textAlign: "center", padding: "32px 0" }}>아직 후기가 없어요. 첫 번째 후기를 남겨보세요!</p>
            )}
            {reviews.map((r) => (
              <div key={r.id} style={{ padding: "18px 20px", borderRadius: "16px", backgroundColor: "#fff", border: "1px solid #F2F4F7" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0D2B4E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 900, color: "#fff" }}>
                      {r.author[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 700 }}>{r.author}</p>
                      <Stars rating={r.rating} size={13} />
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#CBD5E1" }}>{r.date}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>{r.content}</p>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
