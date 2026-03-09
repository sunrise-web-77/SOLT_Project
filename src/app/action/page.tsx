"use client";

import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useSyncExternalStore } from "react";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { actionItems, faithChallenges } from "@/lib/mockData";
import { ActionCategory, ChallengeCategory } from "@/types";
import { challengeStore } from "@/lib/challengeStore";

const ACTION_CATEGORIES: { key: ActionCategory | "all"; label: string; color: string }[] = [
  { key: "all",       label: "전체",      color: "#0D2B4E" },
  { key: "donation",  label: "후원",      color: "#FF5C1A" },
  { key: "volunteer", label: "자원봉사",  color: "#007AFF" },
  { key: "campaign",  label: "캠페인",    color: "#34C759" },
  { key: "talent",    label: "재능기부",  color: "#5856D6" },
];

const CHALLENGE_CATEGORIES: { key: ChallengeCategory | "all"; label: string }[] = [
  { key: "all",     label: "전체" },
  { key: "bible",   label: "성경통독" },
  { key: "prayer",  label: "기도 습관" },
  { key: "morning", label: "미라클 모닝 큐티" },
  { key: "growth",  label: "기독교적 자기계발" },
];

const CATEGORY_LABELS: Record<ActionCategory, string> = {
  donation: "후원", volunteer: "자원봉사", campaign: "캠페인", talent: "재능기부",
};
const CATEGORY_COLORS: Record<ActionCategory, string> = {
  donation: "#FF5C1A", volunteer: "#007AFF", campaign: "#34C759", talent: "#5856D6",
};

export default function ActionList() {
  const [activeTab, setActiveTab] = useState<ActionCategory | "all">("all");
  const [challengeTab, setChallengeTab] = useState<ChallengeCategory | "all">("all");
  const [joinToast, setJoinToast] = useState("");

  const joined = useSyncExternalStore(challengeStore.subscribe, challengeStore.getJoined, challengeStore.getJoined);

  const filtered = activeTab === "all" ? actionItems : actionItems.filter((a) => a.category === activeTab);
  const filteredChallenges = challengeTab === "all"
    ? faithChallenges
    : faithChallenges.filter((c) => c.category === challengeTab);

  const handleJoin = (id: string, title: string) => {
    challengeStore.join(id);
    setJoinToast(`✓ '${title}' 챌린지에 참여했어요!`);
    setTimeout(() => setJoinToast(""), 2800);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />

      {/* Join toast */}
      <AnimatePresence>
        {joinToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed", bottom: "88px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#34C759", color: "#fff", padding: "12px 24px",
              borderRadius: "100px", fontSize: "13px", fontWeight: 700, zIndex: 9998,
              whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {joinToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px 100px" }}>
        <BackButton />

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.1em" }}>ACTION</span>
          <h1 style={{ fontSize: "40px", fontWeight: 900, marginTop: "4px", marginBottom: "8px", letterSpacing: "-0.03em" }}>
            세상을 바꾸는<br />작은 행동
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "12px", lineHeight: 1.7 }}>
            후원, 봉사, 캠페인, 재능기부 — 내가 할 수 있는 방식으로<br />
            하나님의 사랑을 세상에 전합니다.
          </p>
          <div style={{ display: "flex", gap: "32px", marginTop: "24px", marginBottom: "40px", padding: "20px 28px", backgroundColor: "#F8FAFC", borderRadius: "16px" }}>
            {[
              { label: "진행 중인 캠페인", value: `${actionItems.length}개` },
              { label: "누적 참여자",       value: "8,240명" },
              { label: "달성 금액",         value: "₩62,000,000+" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: "22px", fontWeight: 900, color: "#FF5C1A" }}>{s.value}</p>
                <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px", fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {ACTION_CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => setActiveTab(cat.key)} style={{
              padding: "10px 20px", borderRadius: "100px", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s",
              border: activeTab === cat.key ? `2px solid ${cat.color}` : "1px solid #F2F4F7",
              backgroundColor: activeTab === cat.key ? cat.color : "#fff",
              color: activeTab === cat.key ? "#fff" : "#64748B",
            }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {filtered.map((action, i) => {
            const pct = Math.round((action.currentAmount / action.goalAmount) * 100);
            const formatNum = (n: number) => n >= 10000 ? `${(n / 10000).toFixed(0)}만` : n.toLocaleString();
            const accentColor = CATEGORY_COLORS[action.category];
            return (
              <Link key={action.id} href={`/action/${action.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <ActionCard
                  action={action} pct={pct} formatNum={formatNum}
                  delay={i * 0.08} accentColor={accentColor}
                  categoryLabel={CATEGORY_LABELS[action.category]}
                />
              </Link>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════
            FAITH CHALLENGE SECTION
        ════════════════════════════════════════════════ */}
        <div style={{ height: "8px", backgroundColor: "#F2F4F7", margin: "72px -40px 0", borderRadius: "0" }} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ paddingTop: "72px" }}>

          {/* Section header */}
          <div style={{ marginBottom: "32px" }}>
            <span style={{ fontSize: "11px", fontWeight: 900, color: "#34C759", letterSpacing: "0.15em" }}>
              FAITH CHALLENGE
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: 900, marginTop: "6px", marginBottom: "8px" }}>
              신앙 챌린지
            </h2>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              성경통독, 기도 습관, 큐티 — 21일부터 100일까지, 나만의 신앙 루틴을 만들어보세요
            </p>
            <div style={{ display: "flex", gap: "24px", marginTop: "20px", padding: "16px 24px", backgroundColor: "#F0FBF4", borderRadius: "14px" }}>
              {[
                { label: "진행 중인 챌린지", value: `${faithChallenges.length}개` },
                { label: "전체 참여자", value: `${faithChallenges.reduce((s, c) => s + c.participants, 0).toLocaleString()}명` },
                { label: "내 참여 챌린지", value: `${Object.keys(joined).length}개` },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontSize: "18px", fontWeight: 900, color: "#34C759" }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px", fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge category tabs */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "32px", scrollbarWidth: "none" }}>
            {CHALLENGE_CATEGORIES.map((cat) => (
              <button key={cat.key} onClick={() => setChallengeTab(cat.key)} style={{
                padding: "8px 18px", borderRadius: "100px", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
                backgroundColor: challengeTab === cat.key ? "#0D2B4E" : "#F8FAFC",
                color: challengeTab === cat.key ? "#fff" : "#64748B",
              }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Challenge cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {filteredChallenges.map((ch, i) => {
              const isJoined = !!joined[ch.id];
              const cp = joined[ch.id];
              return (
                <motion.div key={ch.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  style={{
                    borderRadius: "24px", backgroundColor: "#fff", overflow: "hidden",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.05)", border: "1px solid #F2F4F7",
                    transition: "box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; }}
                >
                  {/* Card top */}
                  <div style={{
                    padding: "28px 28px 20px", background: `linear-gradient(135deg, ${ch.color}18, ${ch.color}08)`,
                    borderBottom: `3px solid ${ch.color}30`,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "40px" }}>{ch.emoji}</span>
                      <span style={{
                        padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 900,
                        backgroundColor: `${ch.color}20`, color: ch.color,
                      }}>
                        {ch.categoryLabel}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: 900, lineHeight: 1.4, marginBottom: "8px" }}>
                      {ch.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6, marginBottom: "0" }}>
                      {ch.description}
                    </p>
                  </div>

                  {/* Card bottom */}
                  <div style={{ padding: "20px 28px 24px" }}>
                    {/* Meta row */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: "100px", backgroundColor: "#F8FAFC",
                        fontSize: "11px", fontWeight: 700, color: "#64748B",
                      }}>
                        ⏱ {ch.duration}
                      </span>
                      <span style={{
                        padding: "4px 10px", borderRadius: "100px", backgroundColor: "#F8FAFC",
                        fontSize: "11px", fontWeight: 700, color: "#64748B",
                      }}>
                        👥 {ch.participants.toLocaleString()}명 참여
                      </span>
                    </div>

                    {/* Progress bar (if joined) */}
                    {isJoined && cp && (
                      <div style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                            {cp.checkInCount}일 / {ch.totalDays}일 달성
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: 900, color: ch.color }}>{cp.progress}%</span>
                        </div>
                        <div style={{ height: "8px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
                          <motion.div
                            animate={{ width: `${cp.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ height: "100%", borderRadius: "100px", backgroundColor: ch.color }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!isJoined ? (
                        <button
                          onClick={() => handleJoin(ch.id, ch.title)}
                          style={{
                            flex: 1, padding: "12px", borderRadius: "100px", border: "none",
                            backgroundColor: ch.color, color: "#fff", fontSize: "14px",
                            fontWeight: 700, cursor: "pointer",
                          }}
                        >
                          참여하기
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => challengeStore.checkIn(ch.id, ch.totalDays, ch.title)}
                            style={{
                              flex: 1, padding: "12px", borderRadius: "100px", border: "none",
                              backgroundColor: cp && cp.progress >= 100 ? "#34C759" : ch.color,
                              color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            {cp && cp.progress >= 100 ? "🏆 완주!" : "✓ 오늘 체크인"}
                          </button>
                          <Link href="/profile" style={{ textDecoration: "none" }}>
                            <button style={{
                              padding: "12px 16px", borderRadius: "100px",
                              border: "1px solid #F2F4F7", backgroundColor: "#fff",
                              fontSize: "13px", fontWeight: 700, cursor: "pointer", color: "#64748B",
                            }}>
                              내 기록
                            </button>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Badge preview */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "12px", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", color: "#CBD5E1", fontWeight: 700 }}>획득 가능 배지</span>
                      {["🥉", "🥈", "🏆"].map((b) => (
                        <span key={b} style={{ fontSize: "14px" }}>{b}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ActionCard({
  action, pct, formatNum, delay, accentColor, categoryLabel,
}: {
  action: typeof actionItems[number];
  pct: number;
  formatNum: (n: number) => string;
  delay: number;
  accentColor: string;
  categoryLabel: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }} whileHover={{ y: -8 }}
      style={{
        borderRadius: "20px", padding: "28px", backgroundColor: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid #F2F4F7",
        cursor: "pointer", transition: "box-shadow 0.3s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "28px" }}>{action.emoji}</span>
          <span style={{ fontSize: "11px", fontWeight: 900, color: accentColor, backgroundColor: `${accentColor}15`, padding: "3px 10px", borderRadius: "100px" }}>
            {categoryLabel}
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 900, color: "#FF5C1A", backgroundColor: "#FFF5F0", padding: "3px 10px", borderRadius: "100px" }}>
            {action.dday}
          </span>
          <span style={{ fontSize: "22px", fontWeight: 900, color: accentColor }}>{pct}%</span>
        </div>
      </div>
      <h4 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "6px", lineHeight: 1.3 }}>{action.title}</h4>
      <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "20px", lineHeight: 1.6 }}>{action.description}</p>
      <div style={{ height: "8px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden", marginBottom: "10px" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: delay + 0.2 }}
          style={{ height: "100%", borderRadius: "100px", backgroundColor: accentColor }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
        <span style={{ fontWeight: 900, color: accentColor }}>{formatNum(action.currentAmount)}{action.unit}</span>
        <span style={{ color: "#94A3B8" }}>목표 {formatNum(action.goalAmount)}{action.unit}</span>
      </div>
    </motion.div>
  );
}
