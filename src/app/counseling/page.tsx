"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";

// ── Types ────────────────────────────────────────────────────────
interface Expert {
  id: string; name: string; title: string; emoji: string; bio: string;
  specialties: string[]; avail: string[]; rating: number; reviews: number;
  color: string; bg: string; price: string; type: string;
}

// ── Data ─────────────────────────────────────────────────────────
const DIAG_QUESTIONS = [
  { id: 1, text: "요즘 밤에 잠을 잘 자고 있나요?",           low: "전혀 못 잠", high: "매우 잘 잠" },
  { id: 2, text: "일상에서 기쁨이나 즐거움을 느끼나요?",     low: "전혀 없음",  high: "충분히 느낌" },
  { id: 3, text: "하나님과의 관계가 친밀하다고 느끼나요?",   low: "멀게 느낌",  high: "매우 친밀함" },
  { id: 4, text: "미래에 대한 방향이 분명하게 보이나요?",    low: "전혀 안 보임", high: "명확히 보임" },
  { id: 5, text: "가까운 사람들과의 관계가 편안한가요?",     low: "매우 불편함", high: "매우 편안함" },
];

function getDiagResult(score: number) {
  if (score >= 21) return { label: "마음이 건강합니다", color: "#34C759", emoji: "☀️", desc: "지금 당신의 마음은 안정적입니다. 이 상태를 잘 유지해가세요.", recommend: false };
  if (score >= 15) return { label: "약간의 관심이 필요해요", color: "#FF9500", emoji: "🌤", desc: "일부 영역에서 피로감이 쌓이고 있어요. 전문가와 한번 이야기 나눠보는 것도 좋아요.", recommend: false };
  if (score >= 9)  return { label: "전문가 도움을 권해요", color: "#FF5C1A", emoji: "🌧", desc: "당신의 마음이 많이 지쳐있어요. 혼자 감당하려 하지 말고, 전문가와 함께해봐요.", recommend: true };
  return                  { label: "빠른 상담이 필요해요",  color: "#FF2D55", emoji: "⛈", desc: "지금 많이 힘드시죠? 괜찮아요, 도움을 요청하는 것이 용기입니다.", recommend: true };
}

const WORRY_CATEGORIES = [
  { id: "faith",    label: "신앙",  emoji: "✝️", color: "#5856D6" },
  { id: "career",   label: "진로",  emoji: "🌱", color: "#34C759" },
  { id: "mental",   label: "심리",  emoji: "🧠", color: "#FF9500" },
  { id: "relation", label: "관계",  emoji: "🤝", color: "#007AFF" },
  { id: "family",   label: "가족",  emoji: "🏠", color: "#FF2D55" },
  { id: "other",    label: "기타",  emoji: "💬", color: "#94A3B8" },
];

const EXPERTS: Expert[] = [
  {
    id: "e1", name: "이지은", title: "기독 심리상담사", emoji: "🧑‍⚕️", type: "심리상담",
    bio: "10년 경력의 기독 심리상담사. 불안, 우울, 신앙 위기를 전문적으로 다룹니다. 청년 상담 경험 300회 이상.",
    specialties: ["불안·우울", "신앙 위기", "자존감"],
    avail: ["월", "수", "금"], rating: 4.9, reviews: 128,
    color: "#5856D6", bg: "linear-gradient(135deg,#F0EEFF,#DCD9FF)", price: "60,000원/회",
  },
  {
    id: "e2", name: "박성민", title: "기독 심리상담사", emoji: "👨‍⚕️", type: "심리상담",
    bio: "관계 회복과 트라우마 치유 전문. 남성 청년 대상 경험 다수. 가족 상담 병행 가능.",
    specialties: ["관계 갈등", "가족 문제", "정체성"],
    avail: ["화", "목"], rating: 4.8, reviews: 94,
    color: "#007AFF", bg: "linear-gradient(135deg,#EBF5FF,#C8E5FF)", price: "60,000원/회",
  },
  {
    id: "e3", name: "최다운", title: "청년 진로 코치", emoji: "🌿", type: "진로·소명",
    bio: "소명과 진로를 함께 탐색하는 코치. 취업, 사역, 창업 경로 코칭 전문. MBTI 공인 강사.",
    specialties: ["소명 발견", "진로 설계", "직업 전환"],
    avail: ["수", "금", "토"], rating: 4.9, reviews: 76,
    color: "#34C759", bg: "linear-gradient(135deg,#E8FFF0,#C3F0D4)", price: "50,000원/회",
  },
  {
    id: "e4", name: "한아름", title: "선교·사역 코치", emoji: "🕊️", type: "선교·사역",
    bio: "선교와 사역 방향 설정을 돕는 전문 코치. 단기선교·사역자 훈련 전문. 해외 사역 경험 10년.",
    specialties: ["선교 훈련", "사역 방향", "소명 확인"],
    avail: ["월", "화", "수"], rating: 4.7, reviews: 52,
    color: "#FF9500", bg: "linear-gradient(135deg,#FFF5E6,#FFE4B8)", price: "50,000원/회",
  },
];

const EXPERT_FILTERS = ["전체", "심리상담", "진로·소명", "선교·사역"];

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div style={{ display: "flex", gap: "1px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ fontSize: `${size}px`, color: s <= Math.round(rating) ? "#FFD600" : "#E2E8F0" }}>★</span>
    ))}
  </div>
);

// ── Component ─────────────────────────────────────────────────────
export default function CounselingPage() {
  // Diagnosis state
  const [diagStep, setDiagStep] = useState<"intro" | "quiz" | "result">("intro");
  const [diagAnswers, setDiagAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);

  // Worry form state
  const [worryCat, setWorryCat] = useState("");
  const [worryTitle, setWorryTitle] = useState("");
  const [worryDetail, setWorryDetail] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [worrySent, setWorrySent] = useState(false);

  // Expert filter
  const [expertFilter, setExpertFilter] = useState("전체");

  const handleAnswer = (score: number) => {
    const newAnswers = [...diagAnswers, score];
    if (currentQ + 1 < DIAG_QUESTIONS.length) {
      setDiagAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
    } else {
      setDiagAnswers(newAnswers);
      setDiagStep("result");
    }
  };

  const resetDiag = () => {
    setDiagStep("intro");
    setDiagAnswers([]);
    setCurrentQ(0);
  };

  const handleWorrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryCat || !worryDetail.trim()) return;
    setWorrySent(true);
    setTimeout(() => {
      setWorrySent(false);
      setWorryCat(""); setWorryTitle(""); setWorryDetail(""); setContactValue("");
    }, 5000);
  };

  const diagScore = diagAnswers.reduce((a, b) => a + b, 0);
  const diagResult = getDiagResult(diagScore);
  const filteredExperts = expertFilter === "전체" ? EXPERTS : EXPERTS.filter((e) => e.type === expertFilter);

  const scrollToForm = () => document.getElementById("counseling-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px 120px" }}>
        <BackButton />

        {/* ── Hero ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ paddingTop: "32px", paddingBottom: "52px" }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF2D55", letterSpacing: "0.15em" }}>SOLT COUNSELING</span>
          <h1 style={{ fontSize: "40px", fontWeight: 900, marginTop: "10px", marginBottom: "14px", letterSpacing: "-0.04em", lineHeight: 1.15 }}>
            마음과 진로의 회복을<br />위한 1:1 연결
          </h1>
          <p style={{ fontSize: "16px", color: "#64748B", lineHeight: 1.8, maxWidth: "460px", marginBottom: "32px" }}>
            믿음 안에서 나를 돌아보는 시간.<br />혼자 감당하지 않아도 돼요.
          </p>
          {/* Step pills */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { num: "①", label: "마음 상태 점검", color: "#FF2D55" },
              { num: "②", label: "전문가 매칭",    color: "#5856D6" },
              { num: "③", label: "상담 신청",      color: "#34C759" },
            ].map(({ num, label, color }) => (
              <div key={num} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 16px", backgroundColor: "#fff",
                borderRadius: "100px", border: "1px solid #F2F4F7",
              }}>
                <span style={{
                  width: "20px", height: "20px", borderRadius: "50%", backgroundColor: color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>{num}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div style={{ height: "1px", backgroundColor: "#F2F4F7", marginBottom: "56px" }} />

        {/* ── ① 마음 상태 점검 ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginBottom: "72px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{
              width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#FF2D55",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 900, color: "#fff",
            }}>①</span>
            <h2 style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em" }}>마음 상태 점검</h2>
          </div>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "24px" }}>
            5가지 질문으로 지금 나의 마음 상태를 확인해봐요.
          </p>

          <AnimatePresence mode="wait">
            {/* Intro */}
            {diagStep === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "44px 40px", border: "1px solid #F5E8EE", textAlign: "center" }}
              >
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>🌤</div>
                <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "8px" }}>나의 마음 날씨 점검</h3>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.8, marginBottom: "28px", maxWidth: "360px", margin: "0 auto 28px" }}>
                  5가지 질문에 솔직하게 답해주세요.<br />약 2분이면 완료됩니다.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setDiagStep("quiz")}
                  style={{
                    padding: "14px 44px", borderRadius: "100px", border: "none",
                    backgroundColor: "#FF2D55", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(255,45,85,0.25)",
                  }}
                >
                  점검 시작하기
                </motion.button>
              </motion.div>
            )}

            {/* Quiz */}
            {diagStep === "quiz" && (
              <motion.div key={`q-${currentQ}`}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "40px", border: "1px solid #F2F4F7" }}
              >
                {/* Progress bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8" }}>
                    {currentQ + 1} / {DIAG_QUESTIONS.length}
                  </span>
                  <div style={{ width: "160px", height: "4px", backgroundColor: "#F2F4F7", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "100px", backgroundColor: "#FF2D55",
                      width: `${((currentQ + 1) / DIAG_QUESTIONS.length) * 100}%`,
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.55, marginBottom: "32px" }}>
                  {DIAG_QUESTIONS[currentQ].text}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[1, 2, 3, 4, 5].map((score) => {
                    const labels: Record<number, string> = {
                      1: `1점 — ${DIAG_QUESTIONS[currentQ].low}`,
                      2: "2점",
                      3: "3점 — 보통이에요",
                      4: "4점",
                      5: `5점 — ${DIAG_QUESTIONS[currentQ].high}`,
                    };
                    return (
                      <motion.button key={score}
                        whileHover={{ x: 6 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(score)}
                        style={{
                          padding: "15px 20px", borderRadius: "14px",
                          border: "1px solid #F2F4F7", backgroundColor: "#FAFAF8",
                          fontSize: "14px", fontWeight: 600, color: "#0D2B4E",
                          cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "#FFF0F5";
                          (e.currentTarget as HTMLElement).style.borderColor = "#FF2D55";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "#FAFAF8";
                          (e.currentTarget as HTMLElement).style.borderColor = "#F2F4F7";
                        }}
                      >
                        {labels[score]}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Result */}
            {diagStep === "result" && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                style={{
                  backgroundColor: "#fff", borderRadius: "24px", padding: "44px 40px",
                  border: `1px solid ${diagResult.color}30`, textAlign: "center",
                }}
              >
                <div style={{ fontSize: "56px", marginBottom: "12px" }}>{diagResult.emoji}</div>
                <span style={{
                  display: "inline-block", fontSize: "12px", fontWeight: 700,
                  color: diagResult.color, backgroundColor: `${diagResult.color}15`,
                  padding: "4px 16px", borderRadius: "100px", marginBottom: "12px",
                }}>
                  총 {diagScore}점 / 25점
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "12px", color: diagResult.color }}>
                  {diagResult.label}
                </h3>
                <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.85, maxWidth: "400px", margin: "0 auto 28px" }}>
                  {diagResult.desc}
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {diagResult.recommend && (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={scrollToForm}
                      style={{
                        padding: "12px 28px", borderRadius: "100px", border: "none",
                        backgroundColor: diagResult.color, color: "#fff",
                        fontSize: "14px", fontWeight: 700, cursor: "pointer",
                        boxShadow: `0 4px 16px ${diagResult.color}40`,
                      }}
                    >
                      상담 신청하기
                    </motion.button>
                  )}
                  <button onClick={resetDiag}
                    style={{
                      padding: "12px 28px", borderRadius: "100px",
                      border: "1px solid #E2E8F0", backgroundColor: "#fff",
                      fontSize: "14px", fontWeight: 700, color: "#64748B", cursor: "pointer",
                    }}
                  >
                    다시 점검하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── Section divider ───────────────────────────────────── */}
        <div style={{ height: "8px", backgroundColor: "#F2F4F7", margin: "0 -24px 72px" }} />

        {/* ── ② 전문가 매칭 ────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginBottom: "72px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{
              width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#5856D6",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 900, color: "#fff",
            }}>②</span>
            <h2 style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em" }}>전문가 매칭</h2>
          </div>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px" }}>나에게 맞는 상담사 또는 코치를 찾아봐요.</p>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            {EXPERT_FILTERS.map((f) => (
              <button key={f} onClick={() => setExpertFilter(f)}
                style={{
                  padding: "8px 18px", borderRadius: "100px", fontSize: "12px", fontWeight: 700,
                  cursor: "pointer", border: "none", transition: "all 0.2s",
                  backgroundColor: expertFilter === f ? "#5856D6" : "#F8FAFC",
                  color: expertFilter === f ? "#fff" : "#64748B",
                }}
              >{f}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredExperts.map((expert) => (
              <motion.div key={expert.id} whileHover={{ y: -3 }}
                style={{
                  backgroundColor: "#fff", borderRadius: "20px", padding: "24px 28px",
                  border: "1px solid #F2F4F7", cursor: "pointer", transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.07)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "20px", flexShrink: 0,
                    background: expert.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
                  }}>
                    {expert.emoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: 700, color: expert.color, letterSpacing: "0.04em" }}>{expert.title}</p>
                        <h3 style={{ fontSize: "18px", fontWeight: 900, marginTop: "2px" }}>{expert.name} 선생님</h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                          <Stars rating={expert.rating} size={13} />
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FF9500", marginLeft: "2px" }}>{expert.rating}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>후기 {expert.reviews}건</span>
                      </div>
                    </div>

                    <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.75 }}>{expert.bio}</p>

                    {/* Specialty tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                      {expert.specialties.map((s) => (
                        <span key={s} style={{
                          fontSize: "10px", fontWeight: 700, color: expert.color,
                          backgroundColor: `${expert.color}15`, padding: "3px 10px", borderRadius: "100px",
                        }}>{s}</span>
                      ))}
                    </div>

                    {/* Availability + CTA */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                        {expert.avail.map((day) => (
                          <span key={day} style={{
                            fontSize: "11px", fontWeight: 700, color: "#64748B",
                            backgroundColor: "#F8FAFC", padding: "4px 10px", borderRadius: "8px",
                          }}>{day}요일</span>
                        ))}
                        <span style={{ fontSize: "11px", color: "#CBD5E1" }}>상담 가능</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#0D2B4E" }}>{expert.price}</span>
                        <motion.button
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={scrollToForm}
                          style={{
                            padding: "9px 20px", borderRadius: "100px", border: "none",
                            backgroundColor: expert.color, color: "#fff",
                            fontSize: "12px", fontWeight: 700, cursor: "pointer",
                            boxShadow: `0 3px 10px ${expert.color}30`,
                          }}
                        >
                          상담 예약하기
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Section divider ───────────────────────────────────── */}
        <div style={{ height: "8px", backgroundColor: "#F2F4F7", margin: "0 -24px 72px" }} />

        {/* ── ③ 상담 신청서 ────────────────────────────────────── */}
        <motion.section
          id="counseling-form"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{
              width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#34C759",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 900, color: "#fff",
            }}>③</span>
            <h2 style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em" }}>상담 신청하기</h2>
          </div>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "28px" }}>
            당신의 고민을 들려주세요. 72시간 내로 전문가가 연락드립니다.
          </p>

          <AnimatePresence mode="wait">
            {worrySent ? (
              <motion.div key="sent"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                style={{
                  backgroundColor: "#fff", borderRadius: "24px", padding: "64px 40px",
                  textAlign: "center", border: "1px solid #E8FFF0",
                }}
              >
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>🙏</div>
                <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "8px" }}>상담 신청이 접수됐습니다</h3>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.85 }}>
                  72시간 내로 담당 전문가가<br />연락드릴 예정입니다.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleWorrySubmit}
                style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "36px 40px", border: "1px solid #F2F4F7" }}
              >
                {/* Category selector */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0D2B4E", marginBottom: "12px" }}>
                    고민의 카테고리 <span style={{ color: "#FF2D55" }}>*</span>
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {WORRY_CATEGORIES.map((cat) => (
                      <button key={cat.id} type="button" onClick={() => setWorryCat(cat.id)}
                        style={{
                          padding: "10px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700,
                          cursor: "pointer", border: "none", transition: "all 0.2s",
                          backgroundColor: worryCat === cat.id ? cat.color : "#F8FAFC",
                          color: worryCat === cat.id ? "#fff" : "#64748B",
                          display: "flex", alignItems: "center", gap: "6px",
                        }}
                      >
                        <span>{cat.emoji}</span>{cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title (optional) */}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0D2B4E", marginBottom: "8px" }}>제목 (선택)</p>
                  <input
                    type="text"
                    placeholder="고민을 한 줄로 요약해주세요 (선택사항)"
                    value={worryTitle}
                    onChange={(e) => setWorryTitle(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", borderRadius: "14px",
                      border: "1px solid #F2F4F7", fontSize: "14px", outline: "none",
                      backgroundColor: "#FAFAF8", color: "#0D2B4E", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#34C759"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#F2F4F7"; }}
                  />
                </div>

                {/* Detail textarea */}
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0D2B4E", marginBottom: "8px" }}>
                    고민 내용 <span style={{ color: "#FF2D55" }}>*</span>
                  </p>
                  <textarea
                    placeholder="지금 느끼는 감정, 상황, 어떤 도움이 필요한지를 자유롭게 적어주세요. 모든 내용은 담당 전문가에게만 전달됩니다."
                    rows={6} required
                    value={worryDetail}
                    onChange={(e) => setWorryDetail(e.target.value)}
                    style={{
                      width: "100%", padding: "16px 18px", borderRadius: "14px",
                      border: "1px solid #F2F4F7", fontSize: "14px", lineHeight: 1.8,
                      color: "#0D2B4E", resize: "vertical", outline: "none",
                      backgroundColor: "#FAFAF8", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#34C759"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#F2F4F7"; }}
                  />
                </div>

                {/* Contact method */}
                <div style={{ marginBottom: "28px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0D2B4E", marginBottom: "10px" }}>연락 방법</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    {[{ id: "email", label: "이메일" }, { id: "phone", label: "전화" }, { id: "kakao", label: "카카오톡" }].map((m) => (
                      <button key={m.id} type="button" onClick={() => setContactMethod(m.id)}
                        style={{
                          padding: "9px 20px", borderRadius: "100px", fontSize: "12px", fontWeight: 700,
                          cursor: "pointer", border: "none", transition: "all 0.15s",
                          backgroundColor: contactMethod === m.id ? "#0D2B4E" : "#F8FAFC",
                          color: contactMethod === m.id ? "#fff" : "#64748B",
                        }}
                      >{m.label}</button>
                    ))}
                  </div>
                  <input
                    type={contactMethod === "email" ? "email" : "text"}
                    placeholder={
                      contactMethod === "email" ? "이메일 주소를 입력해주세요" :
                      contactMethod === "phone" ? "전화번호를 입력해주세요" :
                      "카카오톡 아이디를 입력해주세요"
                    }
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", borderRadius: "14px",
                      border: "1px solid #F2F4F7", fontSize: "14px", outline: "none",
                      backgroundColor: "#FAFAF8", color: "#0D2B4E", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0D2B4E"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#F2F4F7"; }}
                  />
                </div>

                {/* Submit */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "12px", color: "#CBD5E1" }}>🔒 작성 내용은 담당 전문가에게만 전달됩니다</p>
                  <motion.button
                    type="submit"
                    whileHover={worryCat && worryDetail.trim() ? { scale: 1.03 } : {}}
                    whileTap={worryCat && worryDetail.trim() ? { scale: 0.97 } : {}}
                    disabled={!worryCat || !worryDetail.trim()}
                    style={{
                      padding: "14px 36px", borderRadius: "100px", border: "none",
                      fontSize: "15px", fontWeight: 700,
                      backgroundColor: worryCat && worryDetail.trim() ? "#34C759" : "#E2E8F0",
                      color: worryCat && worryDetail.trim() ? "#fff" : "#94A3B8",
                      cursor: worryCat && worryDetail.trim() ? "pointer" : "not-allowed",
                      transition: "background-color 0.2s",
                      boxShadow: worryCat && worryDetail.trim() ? "0 4px 16px rgba(52,199,89,0.3)" : "none",
                    }}
                  >
                    상담 신청하기
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
}
