"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { insightArticles } from "@/lib/mockData";
import { InsightCategory } from "@/types";
import { calendarStore } from "@/lib/calendarStore";

// ── Public Events data ─────────────────────────────────────────
type EventCategory = "rally" | "concert" | "conference" | "popup" | "lecture";
interface PublicEvent {
  id: string; category: EventCategory; categoryLabel: string;
  title: string; location: string; dateLabel: string;
  dateRaw: string; dday: string; ddayNum: number;
  emoji: string; color: string; poster: string; // emoji-based poster BG
}

const PUBLIC_EVENTS: PublicEvent[] = [
  {
    id: "pe1", category: "rally", categoryLabel: "대형 집회/수련회",
    title: "2026 전국 청년 연합 집회 — 이 세대의 빛",
    location: "여의도 순복음교회", dateLabel: "3월 15일 (토) 10:00",
    dateRaw: "3/15 (토) 10:00", dday: "D-7", ddayNum: 7,
    emoji: "🔥", color: "#FF5C1A", poster: "linear-gradient(135deg,#FF5C1A,#FF9500)",
  },
  {
    id: "pe2", category: "concert", categoryLabel: "찬양 콘서트",
    title: "Hillsong UNITED 내한 공연 — 서울 나이트",
    location: "서울 KSPO DOME", dateLabel: "3월 22일 (토) 18:00",
    dateRaw: "3/22 (토) 18:00", dday: "D-14", ddayNum: 14,
    emoji: "🎸", color: "#5856D6", poster: "linear-gradient(135deg,#5856D6,#007AFF)",
  },
  {
    id: "pe3", category: "conference", categoryLabel: "컨퍼런스",
    title: "2026 세계 선교 컨퍼런스",
    location: "온누리교회 / 전국 동시", dateLabel: "4월 5일 (일) 10:00",
    dateRaw: "4/5 (일) 10:00", dday: "D-28", ddayNum: 28,
    emoji: "🌍", color: "#007AFF", poster: "linear-gradient(135deg,#007AFF,#00C7BE)",
  },
  {
    id: "pe4", category: "popup", categoryLabel: "기독교 팝업/전시",
    title: "성경 필사 & 캘리그라피 팝업 전시",
    location: "성수 SOLT 공간", dateLabel: "3월 14–16일",
    dateRaw: "3/14 (토) 11:00", dday: "D-6", ddayNum: 6,
    emoji: "✍️", color: "#34C759", poster: "linear-gradient(135deg,#34C759,#00C7BE)",
  },
  {
    id: "pe5", category: "lecture", categoryLabel: "목사/신학자 강연",
    title: "이재훈 목사 — '이 시대의 복음' 공개 강의",
    location: "온누리교회 본당", dateLabel: "3월 19일 (목) 19:30",
    dateRaw: "3/19 (목) 19:30", dday: "D-11", ddayNum: 11,
    emoji: "🎙️", color: "#FF9500", poster: "linear-gradient(135deg,#FF9500,#FFD600)",
  },
  {
    id: "pe6", category: "lecture", categoryLabel: "목사/신학자 강연",
    title: "기독교 변증학 입문 — 공개 강연회",
    location: "총신대학교 대강당", dateLabel: "3월 28일 (토) 14:00",
    dateRaw: "3/28 (토) 14:00", dday: "D-20", ddayNum: 20,
    emoji: "📖", color: "#1E40AF", poster: "linear-gradient(135deg,#1E40AF,#5856D6)",
  },
];

const EVENT_CATEGORY_TABS: { key: EventCategory | "all"; label: string }[] = [
  { key: "all",         label: "전체" },
  { key: "rally",       label: "대형 집회/수련회" },
  { key: "concert",     label: "찬양 콘서트" },
  { key: "conference",  label: "컨퍼런스" },
  { key: "popup",       label: "기독교 팝업/전시" },
  { key: "lecture",     label: "목사/신학자 강연" },
];

const DDAY_COLOR = (n: number) => n <= 7 ? "#FF3B30" : n <= 14 ? "#FF9500" : "#34C759";
const DDAY_BG   = (n: number) => n <= 7 ? "#FFF0EE" : n <= 14 ? "#FFF8EE" : "#F0FBF4";
const CAL_DAY_MAP: Record<string, number> = { 월: 0, 화: 1, 수: 2, 목: 3, 금: 4, 토: 5, 일: 6 };

// ── Magazine tabs ──────────────────────────────────────────────
type TabKey = "all" | InsightCategory;
const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "news", label: "교계&사회뉴스" },
  { key: "theology", label: "신학&아카이브" },
  { key: "book", label: "기독교출판&서평" },
  { key: "lifestyle", label: "크리스천라이프스타일" },
];
const CAT_COLORS: Record<string, string> = {
  news: "#0D2B4E", theology: "#1E40AF", book: "#7C3AED", lifestyle: "#FF5C1A",
};

// ── Mission data ───────────────────────────────────────────────
type MissionTab = "field" | "letter" | "prayer";

interface PrayerRequest {
  id: string; title: string; location: string; description: string;
  urgency: "긴급" | "정기" | "감사"; baseCount: number;
  hasEvent?: boolean; eventTitle?: string; eventDate?: string;
  emoji: string; color: string;
}
interface MissionReport {
  id: string; title: string; location: string; date: string;
  excerpt: string; author: string; emoji: string; color: string;
}
interface PrayerLetter {
  id: string; title: string; location: string; date: string;
  excerpt: string; author: string; emoji: string;
}

const PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: "pr1", emoji: "🙏", color: "#FFF5F0",
    title: "서아프리카 말리 성도들의 안전",
    location: "서아프리카 말리", urgency: "긴급", baseCount: 247,
    description: "이슬람 극단주의 세력의 위협 속에서 예배를 이어가는 성도들과 선교사 팀을 위해 기도해주세요.",
  },
  {
    id: "pr2", emoji: "📖", color: "#F0F5FF",
    title: "동남아시아 미전도 종족 성경 번역",
    location: "미얀마·라오스", urgency: "정기", baseCount: 184,
    description: "미전도 종족 마을에 첫 성경 번역팀이 파송됩니다. 언어 장벽을 넘는 지혜를 위해 기도해주세요.",
    hasEvent: true, eventTitle: "동남아 선교 파송 기도회", eventDate: "3/20 (목) 19:00",
  },
  {
    id: "pr3", emoji: "🌿", color: "#F0FFF4",
    title: "중앙아시아 현지 교회 지도자 훈련",
    location: "카자흐스탄", urgency: "정기", baseCount: 132,
    description: "핍박 환경 속에서도 교회를 세워가는 현지 지도자 16명의 훈련 과정을 위해 기도해주세요.",
  },
  {
    id: "pr4", emoji: "🤲", color: "#FFFBF0",
    title: "남미 파벨라 어린이 사역 재정",
    location: "브라질 상파울루", urgency: "긴급", baseCount: 96,
    description: "파벨라 어린이 120명을 섬기는 사역의 다음 달 재정이 필요합니다. 하나님의 공급하심을 구합니다.",
  },
  {
    id: "pr5", emoji: "🌍", color: "#F5F0FF",
    title: "2026 세계 선교 컨퍼런스 준비",
    location: "서울·전국 동시", urgency: "감사", baseCount: 312,
    description: "4월 5일 전국 동시 개최 선교 컨퍼런스를 위해 기도해주세요. 다음세대 선교 헌신자가 일어나길 기도합니다.",
    hasEvent: true, eventTitle: "2026 세계 선교 컨퍼런스", eventDate: "4/5 (일) 10:00",
  },
];

const MISSION_REPORTS: MissionReport[] = [
  {
    id: "mr1", emoji: "⛪", color: "#FFF9E6",
    title: "케냐 마사이족 마을에 세워진 첫 번째 교회당",
    location: "케냐 카지아도", date: "2026.03.01",
    excerpt: "30년간의 기도 끝에, 마사이족 마을 한복판에 작은 교회가 세워졌습니다. 첫 예배에 72명이 모였습니다.",
    author: "박요셉 선교사",
  },
  {
    id: "mr2", emoji: "💧", color: "#E6F4FA",
    title: "인도네시아 수마트라, 무슬림 배경 신자 세례식",
    location: "인도네시아 수마트라", date: "2026.02.22",
    excerpt: "무슬림 가정에서 태어난 17명이 세례를 받았습니다. 가족의 반대를 넘어 믿음을 고백하는 자리였습니다.",
    author: "이다윗 선교사",
  },
  {
    id: "mr3", emoji: "🏥", color: "#E8F8EE",
    title: "에티오피아 난민 캠프 의료 선교 3주 보고",
    location: "에티오피아 아디스아바바", date: "2026.02.15",
    excerpt: "의료팀 12명이 3주간 난민 캠프에서 2,400명을 치료했습니다. 복음과 함께하는 의료 봉사의 현장입니다.",
    author: "한미가엘 선교사팀",
  },
];

const PRAYER_LETTERS: PrayerLetter[] = [
  {
    id: "pl1", emoji: "✉️",
    title: "2026년 3월 기도편지 — 말리에서",
    location: "서아프리카 말리", date: "2026.03.05",
    excerpt: "이번 달 우리 팀은 큰 위기를 넘겼습니다. 하나님이 함께하심을 더 깊이 경험했습니다. 여러분의 기도에 감사드립니다.",
    author: "김성호·이은혜 선교사 가정",
  },
  {
    id: "pl2", emoji: "📜",
    title: "카자흐스탄 현지 교회 사역 보고",
    location: "중앙아시아 카자흐스탄", date: "2026.02.28",
    excerpt: "올해 지도자 훈련 1기가 시작되었습니다. 16명의 현지인 지도자들이 하나님 말씀을 배우는 자리에 앉았습니다.",
    author: "최야곱 선교사",
  },
  {
    id: "pl3", emoji: "💌",
    title: "브라질 파벨라 사역 2월 소식지",
    location: "브라질 상파울루", date: "2026.02.20",
    excerpt: "어린이 120명이 매주 모입니다. 이 아이들이 빛과 소금으로 자라나길 기도해주세요.",
    author: "정루카스·박마리아 선교사",
  },
];

const URGENCY_STYLE: Record<string, { bg: string; color: string }> = {
  긴급: { bg: "#FFF0EE", color: "#FF3B30" },
  정기: { bg: "#EEF1F8", color: "#0D2B4E" },
  감사: { bg: "#F0FBF4", color: "#34C759" },
};

const CAL_DAY: Record<string, number> = { 월: 0, 화: 1, 수: 2, 목: 3, 금: 4, 토: 5, 일: 6 };

// ── Main component ─────────────────────────────────────────────
export default function InsightList() {
  // top-level section tabs
  const [sectionTab, setSectionTab] = useState<"insight" | "events" | "mission">("insight");

  // magazine
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  // mission section
  const [missionTab, setMissionTab] = useState<MissionTab>("prayer");

  // public events
  const [eventTab, setEventTab] = useState<EventCategory | "all">("all");
  const [eventCalIds, setEventCalIds] = useState<Set<string>>(new Set());
  const [eventToast, setEventToast] = useState("");
  const [prayCounts, setPrayCounts] = useState<Record<string, number>>(
    Object.fromEntries(PRAYER_REQUESTS.map((p) => [p.id, p.baseCount]))
  );
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shortPrayerDrafts, setShortPrayerDrafts] = useState<Record<string, string>>({});
  const [shortPrayers, setShortPrayers] = useState<Record<string, { id: string; text: string }[]>>({});
  const [calAddedIds, setCalAddedIds] = useState<Set<string>>(new Set());
  const [calToast, setCalToast] = useState("");

  // magazine filtering
  const filtered = useMemo(() => {
    if (activeTab === "all") return insightArticles;
    return insightArticles.filter((a) => a.category === activeTab);
  }, [activeTab]);
  const featured = filtered.find((a) => a.featured) ?? filtered[0];
  const rest = filtered.filter((a) => a.id !== featured?.id);

  // prayer handlers
  const handlePray = (id: string) => {
    setPrayedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setPrayCounts((c) => ({ ...c, [id]: c[id] - 1 }));
      } else {
        next.add(id);
        setPrayCounts((c) => ({ ...c, [id]: c[id] + 1 }));
      }
      return next;
    });
  };

  const handleShortPrayer = (prId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (shortPrayerDrafts[prId] ?? "").trim();
    if (!text) return;
    setShortPrayers((prev) => ({
      ...prev,
      [prId]: [{ id: `sp-${Date.now()}`, text }, ...(prev[prId] ?? [])],
    }));
    setShortPrayerDrafts((d) => ({ ...d, [prId]: "" }));
  };

  const handleEventCal = (ev: PublicEvent) => {
    const m = ev.dateRaw.match(/\((.)\)/);
    const hourM = ev.dateRaw.match(/(\d{1,2}):(\d{2})/);
    const dayOfWeek = m ? (CAL_DAY_MAP[m[1]] ?? 0) : 0;
    const startHour = hourM ? parseInt(hourM[1]) : 10;
    const added = calendarStore.add({
      title: ev.title.replace(/\s*—.*/, ""), emoji: ev.emoji,
      color: ev.color, dayOfWeek, startHour, sourceId: `event-${ev.id}`,
    });
    if (added) {
      setEventCalIds((prev) => new Set(prev).add(ev.id));
      setEventToast(`✓ '${ev.title.split(" — ")[0]}' 일정이 캘린더에 저장됐어요`);
    } else {
      setEventToast("이미 캘린더에 저장된 일정이에요");
    }
    setTimeout(() => setEventToast(""), 2800);
  };

  const handleAddCal = (pr: PrayerRequest) => {
    if (!pr.eventDate || !pr.eventTitle) return;
    const m = pr.eventDate.match(/\((.)\)/);
    const hourM = pr.eventDate.match(/(\d{1,2}):(\d{2})/);
    const dayOfWeek = m ? (CAL_DAY[m[1]] ?? 0) : 0;
    const startHour = hourM ? parseInt(hourM[1]) : 10;
    const added = calendarStore.add({
      title: pr.eventTitle, emoji: pr.emoji,
      color: "#0D2B4E", dayOfWeek, startHour,
      sourceId: `mission-${pr.id}`,
    });
    if (added) {
      setCalAddedIds((prev) => new Set(prev).add(pr.id));
      setCalToast(`✓ '${pr.eventTitle}' 캘린더에 저장됐어요`);
      setTimeout(() => setCalToast(""), 2800);
    } else {
      setCalToast("이미 캘린더에 저장된 일정이에요");
      setTimeout(() => setCalToast(""), 2200);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />

      {/* Event calendar toast */}
      <AnimatePresence>
        {eventToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed", bottom: "136px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#5856D6", color: "#fff", padding: "12px 24px",
              borderRadius: "100px", fontSize: "13px", fontWeight: 700, zIndex: 9999,
              whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {eventToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar toast */}
      <AnimatePresence>
        {calToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed", bottom: "88px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#0D2B4E", color: "#fff", padding: "12px 24px",
              borderRadius: "100px", fontSize: "13px", fontWeight: 700, zIndex: 9998,
              whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {calToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px 100px" }}>
        <BackButton />

        {/* ── Magazine Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.15em" }}>
            SOLT INSIGHT MAGAZINE
          </span>
          <h1 style={{ fontSize: "40px", fontWeight: 900, marginTop: "6px", marginBottom: "8px", lineHeight: 1.2 }}>
            크리스천 지성의 중심
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B" }}>
            교계뉴스, 신학, 서평, 라이프스타일을 한곳에서
          </p>
        </motion.div>

        {/* ── Top-Level Section Tabs ── */}
        <div style={{ display: "flex", borderBottom: "2px solid #F2F4F7", marginBottom: "40px" }}>
          {([
            { key: "insight" as const, label: "인사이트" },
            { key: "events" as const, label: "공식 행사 일정" },
            { key: "mission" as const, label: "글로벌 미션" },
          ]).map((tab) => (
            <button key={tab.key} onClick={() => setSectionTab(tab.key)} style={{
              padding: "14px 28px", background: "none", border: "none", cursor: "pointer",
              fontSize: "15px", fontWeight: 700, transition: "color 0.2s",
              color: sectionTab === tab.key ? "#0D2B4E" : "#94A3B8",
              borderBottom: sectionTab === tab.key ? "3px solid #0D2B4E" : "3px solid transparent",
              marginBottom: "-2px", whiteSpace: "nowrap",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
        <motion.div key={sectionTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

        {sectionTab === "insight" && (<>
        {/* ── Category Tabs ── */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "40px", scrollbarWidth: "none" }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "9px 20px", borderRadius: "100px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
              backgroundColor: activeTab === tab.key ? "#0D2B4E" : "#F8FAFC",
              color: activeTab === tab.key ? "#fff" : "#64748B",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* Featured Article */}
            {featured && (
              <Link href={`/insight/${featured.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <motion.div whileHover={{ y: -4 }} style={{
                  display: "flex", borderRadius: "24px", overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: "40px",
                  cursor: "pointer", minHeight: "280px",
                }}>
                  <div style={{
                    width: "44%", backgroundColor: CAT_COLORS[featured.category] ?? "#0D2B4E",
                    padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  }}>
                    <span style={{
                      display: "inline-block", backgroundColor: "rgba(255,255,255,0.2)", color: "#fff",
                      padding: "5px 14px", borderRadius: "100px", fontSize: "10px", fontWeight: 900,
                      letterSpacing: "0.1em", marginBottom: "18px", alignSelf: "flex-start",
                    }}>
                      FEATURED · {featured.categoryLabel}
                    </span>
                    <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", lineHeight: 1.4, whiteSpace: "pre-line", margin: 0 }}>
                      {featured.title}
                    </h2>
                  </div>
                  <div style={{
                    flex: 1, backgroundColor: "#fff", padding: "44px 40px",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: "15px", color: "#374151", lineHeight: 1.8, margin: "0 0 20px" }}>
                        {featured.subtitle}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {featured.keywords.map((kw) => (
                          <span key={kw} style={{ padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, backgroundColor: "#F8FAFC", color: "#64748B" }}>
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #F2F4F7" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: CAT_COLORS[featured.category], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 900, color: "#fff" }}>
                          {featured.author.name[0]}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: 700 }}>{featured.author.name}</p>
                          <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>{featured.author.title}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>{featured.readTime}분 읽기</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Article Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {rest.map((article, i) => {
                const color = CAT_COLORS[article.category] ?? "#0D2B4E";
                return (
                  <Link key={article.id} href={`/insight/${article.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
                      style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid #F2F4F7", cursor: "pointer", transition: "box-shadow 0.3s" }}
                    >
                      <div style={{ height: "5px", backgroundColor: color }} />
                      <div style={{ padding: "24px" }}>
                        <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 900, letterSpacing: "0.08em", backgroundColor: `${color}18`, color, marginBottom: "12px" }}>
                          {article.categoryLabel}
                        </span>
                        <h3 style={{ fontSize: "17px", fontWeight: 900, lineHeight: 1.45, whiteSpace: "pre-line", margin: "0 0 10px" }}>
                          {article.title}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65, margin: "0 0 16px" }}>
                          {article.subtitle}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "20px" }}>
                          {article.keywords.slice(0, 3).map((kw) => (
                            <span key={kw} style={{ padding: "3px 9px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, backgroundColor: "#F8FAFC", color: "#94A3B8" }}>
                              #{kw}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #F2F4F7" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900, color: "#fff" }}>
                              {article.author.name[0]}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: "12px", fontWeight: 700 }}>{article.author.name}</p>
                              <p style={{ margin: 0, fontSize: "10px", color: "#94A3B8" }}>{article.author.title}</p>
                            </div>
                          </div>
                          <span style={{ fontSize: "11px", color: "#94A3B8" }}>{article.readTime}분 읽기</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>📭</p>
                <p style={{ fontSize: "15px" }}>아직 게시물이 없습니다</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </>)}

        {sectionTab === "mission" && (<>
        <div>

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "32px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#0D2B4E", letterSpacing: "0.15em" }}>
                🌐 GLOBAL MISSION
              </span>
              <h2 style={{ fontSize: "32px", fontWeight: 900, marginTop: "6px", marginBottom: "6px" }}>
                글로벌 미션
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B" }}>
                전 세계 선교 현장과 함께 기도해주세요
              </p>
            </div>
          </div>

          {/* Mission sub-tabs */}
          <div style={{ display: "flex", gap: "0", marginBottom: "40px", borderBottom: "2px solid #F2F4F7" }}>
            {([
              { key: "prayer" as MissionTab, label: "🙏 오늘의 기도 요청" },
              { key: "field" as MissionTab, label: "🗺 선교지 소식" },
              { key: "letter" as MissionTab, label: "✉️ 기도 편지" },
            ] as const).map((tab) => (
              <button key={tab.key} onClick={() => setMissionTab(tab.key)} style={{
                padding: "12px 24px", background: "none", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: 700, transition: "all 0.2s",
                color: missionTab === tab.key ? "#0D2B4E" : "#94A3B8",
                borderBottom: missionTab === tab.key ? "2px solid #0D2B4E" : "2px solid transparent",
                marginBottom: "-2px",
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={missionTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

              {/* ── 오늘의 기도 요청 ── */}
              {missionTab === "prayer" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {PRAYER_REQUESTS.map((pr) => {
                    const prayed = prayedIds.has(pr.id);
                    const expanded = expandedId === pr.id;
                    const urgStyle = URGENCY_STYLE[pr.urgency];
                    const prayers = shortPrayers[pr.id] ?? [];
                    return (
                      <motion.div key={pr.id} layout
                        style={{
                          borderRadius: "24px", backgroundColor: pr.color,
                          padding: "28px 32px", border: "1px solid rgba(0,0,0,0.04)",
                        }}
                      >
                        {/* Card header */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "14px" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                              <span style={{ fontSize: "20px" }}>{pr.emoji}</span>
                              <span style={{
                                padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 900,
                                backgroundColor: urgStyle.bg, color: urgStyle.color,
                              }}>
                                {pr.urgency}
                              </span>
                              <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600 }}>
                                🌐 {pr.location}
                              </span>
                            </div>
                            <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 8px", lineHeight: 1.4 }}>
                              {pr.title}
                            </h3>
                            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, margin: 0 }}>
                              {pr.description}
                            </p>
                          </div>
                        </div>

                        {/* Prayer count */}
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0D2B4E", marginBottom: "16px" }}>
                          🙏 {prayCounts[pr.id].toLocaleString()}명이 기도했습니다
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            onClick={() => handlePray(pr.id)}
                            style={{
                              padding: "10px 22px", borderRadius: "100px", border: "none",
                              cursor: "pointer", fontSize: "13px", fontWeight: 700, transition: "all 0.2s",
                              backgroundColor: prayed ? "#0D2B4E" : "#fff",
                              color: prayed ? "#fff" : "#0D2B4E",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                          >
                            {prayed ? "🙏 기도했습니다 ✓" : "🙏 기도했습니다"}
                          </button>
                          <button
                            onClick={() => setExpandedId(expanded ? null : pr.id)}
                            style={{
                              padding: "10px 22px", borderRadius: "100px",
                              border: "1px solid rgba(0,0,0,0.08)",
                              cursor: "pointer", fontSize: "13px", fontWeight: 700,
                              backgroundColor: "rgba(255,255,255,0.7)", color: "#64748B", transition: "all 0.2s",
                            }}
                          >
                            ✏️ 한 줄 기도 {prayers.length > 0 ? `(${prayers.length})` : ""}
                          </button>
                          {pr.hasEvent && (
                            <button
                              onClick={() => handleAddCal(pr)}
                              disabled={calAddedIds.has(pr.id)}
                              style={{
                                padding: "10px 22px", borderRadius: "100px",
                                border: "none", cursor: calAddedIds.has(pr.id) ? "default" : "pointer",
                                fontSize: "13px", fontWeight: 700, transition: "all 0.2s",
                                backgroundColor: calAddedIds.has(pr.id) ? "#34C759" : "#fff",
                                color: calAddedIds.has(pr.id) ? "#fff" : "#0D2B4E",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              }}
                            >
                              {calAddedIds.has(pr.id) ? "📅 캘린더 저장 완료" : "📅 캘린더에 저장"}
                            </button>
                          )}
                        </div>

                        {/* One-line prayer input & list */}
                        <AnimatePresence>
                          {expanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                              style={{ overflow: "hidden" }}
                            >
                              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                                <form onSubmit={(e) => handleShortPrayer(pr.id, e)}
                                  style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                  <input
                                    type="text"
                                    placeholder="짧은 기도를 남겨보세요... (예: 주님, 이 땅을 지켜주세요)"
                                    maxLength={60}
                                    value={shortPrayerDrafts[pr.id] ?? ""}
                                    onChange={(e) => setShortPrayerDrafts((d) => ({ ...d, [pr.id]: e.target.value }))}
                                    style={{
                                      flex: 1, padding: "10px 16px", borderRadius: "100px",
                                      border: "1px solid rgba(0,0,0,0.1)", fontSize: "13px",
                                      backgroundColor: "rgba(255,255,255,0.8)", outline: "none",
                                    }}
                                  />
                                  <button type="submit" style={{
                                    padding: "10px 20px", borderRadius: "100px", border: "none",
                                    backgroundColor: "#0D2B4E", color: "#fff", fontSize: "13px",
                                    fontWeight: 700, cursor: "pointer", flexShrink: 0,
                                  }}>
                                    올리기
                                  </button>
                                </form>
                                {prayers.length > 0 && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {prayers.map((sp) => (
                                      <motion.div key={sp.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                        style={{
                                          padding: "10px 16px", borderRadius: "14px",
                                          backgroundColor: "rgba(255,255,255,0.7)",
                                          fontSize: "13px", color: "#374151", fontStyle: "italic",
                                        }}
                                      >
                                        🙏 {sp.text}
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* ── 선교지 소식 ── */}
              {missionTab === "field" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
                  {MISSION_REPORTS.map((mr, i) => (
                    <motion.div key={mr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }} whileHover={{ y: -6 }}
                      style={{
                        borderRadius: "24px", overflow: "hidden", backgroundColor: mr.color,
                        boxShadow: "0 2px 16px rgba(0,0,0,0.06)", cursor: "pointer",
                        border: "1px solid rgba(0,0,0,0.04)", transition: "box-shadow 0.3s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
                    >
                      {/* Photo-style colored top */}
                      <div style={{
                        height: "120px", backgroundColor: "rgba(0,0,0,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "48px",
                      }}>
                        {mr.emoji}
                      </div>
                      <div style={{ padding: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 900, color: "#0D2B4E", letterSpacing: "0.06em" }}>
                            🌐 {mr.location}
                          </span>
                          <span style={{ fontSize: "11px", color: "#CBD5E1" }}>·</span>
                          <span style={{ fontSize: "11px", color: "#94A3B8" }}>{mr.date}</span>
                        </div>
                        <h3 style={{ fontSize: "17px", fontWeight: 900, lineHeight: 1.4, margin: "0 0 10px" }}>
                          {mr.title}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 16px" }}>
                          {mr.excerpt}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "14px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#0D2B4E",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "11px", fontWeight: 900, color: "#fff", flexShrink: 0,
                          }}>
                            {mr.author[0]}
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: 700 }}>{mr.author}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ── 기도 편지 ── */}
              {missionTab === "letter" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {PRAYER_LETTERS.map((pl, i) => (
                    <motion.div key={pl.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}
                      style={{
                        borderRadius: "20px", backgroundColor: "#fff",
                        border: "1px solid #F2F4F7", padding: "24px 28px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)", cursor: "pointer",
                        display: "flex", gap: "20px", alignItems: "flex-start",
                        transition: "box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
                    >
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#F8FAFC",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px", flexShrink: 0,
                      }}>
                        {pl.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#0D2B4E", letterSpacing: "0.04em" }}>
                            🌐 {pl.location}
                          </span>
                          <span style={{ fontSize: "11px", color: "#CBD5E1" }}>·</span>
                          <span style={{ fontSize: "11px", color: "#94A3B8" }}>{pl.date}</span>
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: 900, margin: "0 0 8px", lineHeight: 1.4 }}>
                          {pl.title}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: "0 0 12px" }}>
                          {pl.excerpt}
                        </p>
                        <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>— {pl.author}</span>
                      </div>
                      <div style={{ flexShrink: 0, fontSize: "18px", color: "#CBD5E1" }}>→</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        </>)}

        {sectionTab === "events" && (<>
        <div>

          {/* Section header */}
          <div style={{ marginBottom: "32px" }}>
            <span style={{ fontSize: "11px", fontWeight: 900, color: "#5856D6", letterSpacing: "0.15em" }}>
              PUBLIC EVENTS
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: 900, marginTop: "6px", marginBottom: "8px" }}>
              공적 행사 일정
            </h2>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              집회, 콘서트, 컨퍼런스 — 함께 예배하고 성장하는 현장
            </p>
          </div>

          {/* Event category tabs */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "32px", scrollbarWidth: "none" }}>
            {EVENT_CATEGORY_TABS.map((tab) => (
              <button key={tab.key} onClick={() => setEventTab(tab.key)} style={{
                padding: "8px 18px", borderRadius: "100px", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
                backgroundColor: eventTab === tab.key ? "#0D2B4E" : "#F8FAFC",
                color: eventTab === tab.key ? "#fff" : "#64748B",
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Event cards grid */}
          <AnimatePresence mode="wait">
            <motion.div key={eventTab}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                {PUBLIC_EVENTS
                  .filter((ev) => eventTab === "all" || ev.category === eventTab)
                  .map((ev, i) => {
                    const calAdded = eventCalIds.has(ev.id);
                    return (
                      <motion.div key={ev.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }}
                        style={{
                          borderRadius: "24px", overflow: "hidden", backgroundColor: "#fff",
                          boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F2F4F7",
                          transition: "box-shadow 0.3s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
                      >
                        {/* Poster panel */}
                        <div style={{
                          height: "160px", background: ev.poster,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          position: "relative",
                        }}>
                          <span style={{ fontSize: "56px" }}>{ev.emoji}</span>
                          {/* D-day badge */}
                          <div style={{
                            position: "absolute", top: "14px", right: "14px",
                            padding: "5px 12px", borderRadius: "100px",
                            backgroundColor: DDAY_BG(ev.ddayNum),
                            color: DDAY_COLOR(ev.ddayNum),
                            fontSize: "12px", fontWeight: 900,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                          }}>
                            {ev.dday}
                          </div>
                          {/* Category badge */}
                          <div style={{
                            position: "absolute", bottom: "14px", left: "14px",
                            padding: "4px 12px", borderRadius: "100px",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            color: ev.color, fontSize: "10px", fontWeight: 900, letterSpacing: "0.06em",
                          }}>
                            {ev.categoryLabel}
                          </div>
                        </div>

                        {/* Card body */}
                        <div style={{ padding: "20px 22px 22px" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: 900, lineHeight: 1.4, marginBottom: "12px" }}>
                            {ev.title}
                          </h3>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748B" }}>
                              <span>📅</span>
                              <span style={{ fontWeight: 600 }}>{ev.dateLabel}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748B" }}>
                              <span>📍</span>
                              <span style={{ fontWeight: 600 }}>{ev.location}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <button
                            onClick={() => handleEventCal(ev)}
                            disabled={calAdded}
                            style={{
                              width: "100%", padding: "11px", borderRadius: "100px", border: "none",
                              cursor: calAdded ? "default" : "pointer", fontSize: "13px", fontWeight: 700,
                              transition: "all 0.2s",
                              backgroundColor: calAdded ? "#34C759" : "#0D2B4E",
                              color: "#fff",
                            }}
                          >
                            {calAdded ? "📅 캘린더 저장 완료 ✓" : "📅 캘린더에 저장"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        </>)}

        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
