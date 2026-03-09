"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { mockPosts } from "@/lib/mockData";
import { calendarStore } from "@/lib/calendarStore";
import { Post } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────
type MainTab = "팟" | "메이트";

interface MateProfile {
  id: string; name: string; age: number;
  ageGroup: "20대 초반" | "20대 후반" | "30대 초반" | "30대 후반";
  gender: "남" | "여";
  church: string; verified: boolean;
  mannerScore: number; // 0–5
  interests: string[]; distance: string; emoji: string; intro: string;
}

// ── Static data ────────────────────────────────────────────────────────────
const REGIONS = ["전체", "서울", "경기", "인천", "온라인"];
const CATEGORIES = ["전체", "운동", "러닝", "독서", "찬양", "봉사", "친교", "영어", "재정", "클래스"];
const MATE_INTERESTS = ["전체", "러닝", "독서", "찬양", "풋살", "요리", "필라테스", "영어", "봉사", "재정", "등산", "기타"];
const AGE_GROUPS = ["전체", "20대 초반", "20대 후반", "30대 초반", "30대 후반"] as const;
const CHAT_TOPICS = ["신앙 나눔", "독서 토론", "기도 제목", "찬양 추천", "성경 공부", "삶의 이야기"];
const CONTACT_METHODS = ["카카오톡", "인스타그램", "전화번호", "이메일"];

const mateProfiles: MateProfile[] = [
  { id: "mp1", name: "이수빈", age: 27, ageGroup: "20대 후반", gender: "여",
    church: "사랑의교회", verified: true, mannerScore: 4.9,
    interests: ["러닝", "독서", "찬양"], distance: "2.1km", emoji: "🌸",
    intro: "매일 큐티하는 것이 습관이에요. 함께 달리고 말씀 나눌 친구를 찾아요!" },
  { id: "mp2", name: "김민준", age: 29, ageGroup: "20대 후반", gender: "남",
    church: "온누리교회", verified: true, mannerScore: 4.8,
    interests: ["풋살", "기타", "요리"], distance: "3.5km", emoji: "⚽",
    intro: "주일 찬양팀에서 기타 치고 있어요. 신앙 안에서 진지한 만남을 원해요." },
  { id: "mp3", name: "박지현", age: 24, ageGroup: "20대 초반", gender: "여",
    church: "지구촌교회", verified: true, mannerScore: 4.7,
    interests: ["필라테스", "영어", "봉사"], distance: "1.8km", emoji: "💪",
    intro: "해외 선교에 관심이 많아요. 글로벌한 크리스천 친구와 교제하고 싶어요." },
  { id: "mp4", name: "최태준", age: 31, ageGroup: "30대 초반", gender: "남",
    church: "분당우리교회", verified: false, mannerScore: 4.6,
    interests: ["재정", "독서", "등산"], distance: "4.2km", emoji: "📚",
    intro: "기독교 재정 스터디 모임 운영 중이에요. 함께 성장할 동역자를 찾습니다." },
  { id: "mp5", name: "정소연", age: 32, ageGroup: "30대 초반", gender: "여",
    church: "사랑의교회", verified: true, mannerScore: 5.0,
    interests: ["봉사", "요리", "찬양"], distance: "0.9km", emoji: "🌿",
    intro: "봉사팀에서 10년째 활동 중이에요. 함께 섬기며 성장할 파트너를 찾아요." },
  { id: "mp6", name: "한승호", age: 28, ageGroup: "20대 후반", gender: "남",
    church: "예수전도단", verified: true, mannerScore: 4.8,
    interests: ["러닝", "영어", "봉사"], distance: "2.8km", emoji: "🌍",
    intro: "글로벌 선교를 꿈꾸고 있어요. 영어와 러닝으로 시작하는 만남 환영해요." },
];

interface MateProgram {
  id: string; emoji: string; color: string; bg: string; badge: string;
  title: string; desc: string; tags: string[];
  // 실시간 현황
  maxSlots: number; maleCount: number; femaleCount: number;
  hasGenderBalance: boolean;
  // 일정 (캘린더 연동용)
  dateLabel: string; timeLabel: string; location: string;
  dayOfWeek: number; startHour: number; // calendarStore 용
}

const matePrograms: MateProgram[] = [
  { id: "m1", emoji: "💑", color: "#FF5C1A", bg: "linear-gradient(135deg,#FFF0EB,#FFD8C8)",
    badge: "인기", title: "1:1 크리스천 소개팅",
    desc: "같은 신앙을 가진 청년과의 진지한 1:1 만남.\n본인 인증 필수, 교역자 추천 우대.",
    tags: ["20대", "30대", "진지한 만남"],
    maxSlots: 20, maleCount: 8, femaleCount: 10, hasGenderBalance: true,
    dateLabel: "3/22 (토)", timeLabel: "14:00", location: "강남 SOLT 라운지",
    dayOfWeek: 5, startHour: 14 },
  { id: "m2", emoji: "🎉", color: "#5856D6", bg: "linear-gradient(135deg,#F0EFFF,#DCD9FF)",
    badge: "NEW", title: "교회 간 단체 미팅",
    desc: "5:5 교회 간 미팅. 서로의 교회 문화와\n신앙 이야기를 나눠요. 식사 + 게임 포함.",
    tags: ["단체", "교류", "5:5"],
    maxSlots: 30, maleCount: 12, femaleCount: 9, hasGenderBalance: true,
    dateLabel: "3/29 (토)", timeLabel: "18:00", location: "홍대 크리스천 라운지",
    dayOfWeek: 5, startHour: 18 },
  { id: "m3", emoji: "☕", color: "#34C759", bg: "linear-gradient(135deg,#E8F9EE,#C3F0D4)",
    badge: "D-7", title: "크리스천 청년 밋업",
    desc: "부담 없이 시작하는 소셜 파티.\n같은 믿음의 새로운 친구를 만나요.",
    tags: ["네트워킹", "20대", "친목"],
    maxSlots: 60, maleCount: 28, femaleCount: 24, hasGenderBalance: false,
    dateLabel: "3/15 (토)", timeLabel: "15:00", location: "이태원 루프탑 카페",
    dayOfWeek: 5, startHour: 15 },
  { id: "m4", emoji: "🌸", color: "#FF9500", bg: "linear-gradient(135deg,#FFF5E6,#FFE4B8)",
    badge: "모집중", title: "봄 피크닉 단체 미팅",
    desc: "3월 말, 한강 피크닉에서 자연스러운\n만남을 시작해요. 7:7 규모.",
    tags: ["야외", "봄", "7:7"],
    maxSlots: 42, maleCount: 7, femaleCount: 14, hasGenderBalance: true,
    dateLabel: "3/30 (일)", timeLabel: "13:00", location: "여의도 한강공원",
    dayOfWeek: 6, startHour: 13 },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function MannerTemp({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 4.9 ? "#FF5C1A" : score >= 4.7 ? "#FF9500" : score >= 4.5 ? "#FFD600" : "#34C759";
  const label = score >= 4.9 ? "최고예요" : score >= 4.7 ? "좋아요" : score >= 4.5 ? "괜찮아요" : "보통이에요";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "6px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: "100px", backgroundColor: color, transition: "width 0.6s" }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color, minWidth: "28px" }}>{score.toFixed(1)}</span>
      <span style={{ fontSize: "11px", color: "#94A3B8" }}>{label}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────
export default function PlayList() {
  // 팟 tab
  const [mainTab, setMainTab] = useState<MainTab>("팟");
  const [region, setRegion] = useState("전체");
  const [category, setCategory] = useState("전체");
  const [showCreate, setShowCreate] = useState(false);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({
    title: "", description: "", date: "", location: "",
    region: "서울", tag: "운동", maxParticipants: 10,
  });

  // Mate filters
  const [filterGender, setFilterGender] = useState<"전체" | "남" | "여">("전체");
  const [filterAge, setFilterAge] = useState<typeof AGE_GROUPS[number]>("전체");
  const [filterChurch, setFilterChurch] = useState("전체");
  const [filterInterest, setFilterInterest] = useState("전체");

  // Mate interaction state
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [chatIds, setChatIds] = useState<Set<string>>(new Set()); // accepted chats

  // Modals
  const [profileDetail, setProfileDetail] = useState<MateProfile | null>(null);
  const [guideModal, setGuideModal] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<MateProfile | null>(null);
  const [matchToast, setMatchToast] = useState<string | null>(null);
  const [chatModal, setChatModal] = useState<MateProfile | null>(null);
  const [chatTopic, setChatTopic] = useState<string[]>([]);
  const [chatMsg, setChatMsg] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const [scheduleModal, setScheduleModal] = useState<MateProfile | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("14:00");
  const [schedulePlace, setSchedulePlace] = useState("");
  const [scheduleDone, setScheduleDone] = useState(false);
  const [calAdded, setCalAdded] = useState(false);

  // Program application
  const [programModal, setProgramModal] = useState<MateProgram | null>(null);
  const [appliedPrograms, setAppliedPrograms] = useState<Set<string>>(new Set());
  const [applyName, setApplyName] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applyChurch, setApplyChurch] = useState("");
  const [applyErrors, setApplyErrors] = useState<Record<string, string>>({});
  const [applyDone, setApplyDone] = useState(false);
  const [programToast, setProgramToast] = useState(false);

  // Unique churches for filter
  const allChurches = useMemo(() => {
    const churches = Array.from(new Set(mateProfiles.map(p => p.church)));
    return ["전체", ...churches];
  }, []);

  // Filtered profiles
  const filteredMates = useMemo(() => mateProfiles.filter(p => {
    if (filterGender !== "전체" && p.gender !== filterGender) return false;
    if (filterAge !== "전체" && p.ageGroup !== filterAge) return false;
    if (filterChurch !== "전체" && p.church !== filterChurch) return false;
    if (filterInterest !== "전체" && !p.interests.includes(filterInterest)) return false;
    return true;
  }), [filterGender, filterAge, filterChurch, filterInterest]);

  // Body scroll lock
  const anyModal = showCreate || !!profileDetail || guideModal || !!chatModal || !!scheduleModal || !!programModal;
  useEffect(() => {
    document.body.style.overflow = anyModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [anyModal]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!matchToast) return;
    const t = setTimeout(() => setMatchToast(null), 3000);
    return () => clearTimeout(t);
  }, [matchToast]);

  // 팟 handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      id: `my-${Date.now()}`, type: "play", status: "모집중",
      title: newPost.title, description: newPost.description,
      date: newPost.date, location: newPost.location, region: newPost.region,
      tag: newPost.tag, maxParticipants: Number(newPost.maxParticipants),
      currentParticipants: 0, emoji: "🎯",
      host: { id: "me", name: "나", isVerified: false },
    };
    setMyPosts(prev => [post, ...prev]);
    setShowCreate(false);
    setNewPost({ title: "", description: "", date: "", location: "", region: "서울", tag: "운동", maxParticipants: 10 });
  };

  const playPosts = [...myPosts, ...mockPosts.filter(p => p.type === "play")];
  const filtered = playPosts.filter(p => {
    const regionMatch = region === "전체" || p.region === region;
    const categoryMatch = category === "전체" || p.tag === category;
    return regionMatch && categoryMatch;
  });

  // Mate handlers
  const handleMatchRequest = (profile: MateProfile) => {
    if (matchedIds.has(profile.id)) return;
    setPendingMatch(profile);
    setGuideModal(true);
  };

  const confirmMatch = () => {
    if (!pendingMatch) return;
    setMatchedIds(prev => new Set([...prev, pendingMatch.id]));
    setMatchToast(`${pendingMatch.name}님께 매칭 신청을 보냈어요!`);
    setGuideModal(false);
    setProfileDetail(null);
    setPendingMatch(null);
  };

  const openProgramModal = (prog: MateProgram) => {
    setProgramModal(prog);
    setApplyName(""); setApplyPhone(""); setApplyChurch("");
    setApplyErrors({}); setApplyDone(false);
  };

  const handleProgramApply = () => {
    if (!programModal) return;
    const errs: Record<string, string> = {};
    if (!applyName.trim()) errs.name = "이름을 입력해주세요";
    if (!applyPhone.trim()) errs.phone = "연락처를 입력해주세요";
    if (!applyChurch.trim()) errs.church = "소속 교회를 입력해주세요";
    if (Object.keys(errs).length > 0) { setApplyErrors(errs); return; }
    // Calendar sync
    calendarStore.add({
      title: programModal.title, emoji: programModal.emoji,
      color: programModal.color,
      dayOfWeek: programModal.dayOfWeek, startHour: programModal.startHour,
      sourceId: `prog-${programModal.id}`,
    });
    setAppliedPrograms(prev => new Set([...prev, programModal.id]));
    setApplyDone(true);
    setProgramToast(true);
    setTimeout(() => setProgramToast(false), 4000);
  };

  const handleScheduleAdd = () => {
    if (!scheduleModal || !scheduleDate) return;
    const [year, month, day] = scheduleDate.split("-").map(Number);
    const [hourStr] = scheduleTime.split(":");
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const mapped = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    calendarStore.add({
      title: `${scheduleModal.name}님과 미팅`,
      emoji: "💑", color: "#FF5C1A",
      dayOfWeek: mapped, startHour: parseInt(hourStr),
      sourceId: `mate-${scheduleModal.id}-${scheduleDate}`,
    });
    setCalAdded(true);
    setTimeout(() => {
      setScheduleModal(null);
      setScheduleDone(false);
      setCalAdded(false);
      setScheduleDate("");
      setSchedulePlace("");
    }, 2000);
  };

  // Styles
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 28px", borderRadius: "100px", fontSize: "15px", fontWeight: 700,
    cursor: "pointer", transition: "all 0.2s", border: "none",
    backgroundColor: active ? "#0D2B4E" : "#F8FAFC",
    color: active ? "#fff" : "#94A3B8",
  });

  const chipStyle = (active: boolean, color = "#FF5C1A"): React.CSSProperties => ({
    padding: "7px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s",
    border: active ? `2px solid ${color}` : "1px solid #F2F4F7",
    backgroundColor: active ? `${color}18` : "#fff",
    color: active ? color : "#64748B",
    whiteSpace: "nowrap" as const,
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: "14px",
    border: "1px solid #F2F4F7", fontSize: "14px", outline: "none",
    boxSizing: "border-box", backgroundColor: "#FAFAFA",
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px 100px" }}>
        <BackButton />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.1em" }}>SOLT POT</span>
          <h1 style={{ fontSize: "36px", fontWeight: 900, marginTop: "4px", marginBottom: "8px", letterSpacing: "-0.03em" }}>솔트 팟</h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "32px" }}>같은 믿음, 같은 취미. 함께 모여 즐기는 모임</p>

          {/* Main Tab Switch */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
            <div style={{ display: "flex", gap: "8px", padding: "6px", backgroundColor: "#F8FAFC", borderRadius: "100px" }}>
              {(["팟", "메이트"] as MainTab[]).map(tab => (
                <button key={tab} style={tabStyle(mainTab === tab)} onClick={() => setMainTab(tab)}>
                  {tab === "팟" ? "🏃 솔트 팟" : "💑 SOLT Mate"}
                </button>
              ))}
            </div>
            {mainTab === "팟" && (
              <button onClick={() => setShowCreate(true)} style={{
                padding: "12px 22px", borderRadius: "100px", border: "none",
                backgroundColor: "#FF5C1A", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
              }}>
                + 모임 만들기
              </button>
            )}
          </div>
        </motion.div>

        {/* ── 솔트 팟 탭 ─────────────────────────────────────────── */}
        {mainTab === "팟" && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "10px" }}>📍 지역</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {REGIONS.map(r => <button key={r} style={chipStyle(region === r, "#007AFF")} onClick={() => setRegion(r)}>{r}</button>)}
                </div>
              </div>
              <div style={{ marginBottom: "36px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "10px" }}>🏷 카테고리</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {CATEGORIES.map(c => <button key={c} style={chipStyle(category === c, "#FF5C1A")} onClick={() => setCategory(c)}>{c}</button>)}
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px", fontWeight: 600 }}>
                {filtered.length}개 모임
                {region !== "전체" && <span style={{ color: "#007AFF" }}> · {region}</span>}
                {category !== "전체" && <span style={{ color: "#FF5C1A" }}> · {category}</span>}
              </p>
            </motion.div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <p style={{ fontSize: "16px", fontWeight: 700 }}>해당 조건의 모임이 없어요</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {filtered.map((post, i) => (
                  <Link key={post.id} href={`/play/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }} whileHover={{ y: -8 }}
                      style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid #F2F4F7", cursor: "pointer" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
                    >
                      <div style={{ height: "180px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <span style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: post.status === "마감" ? "#94A3B8" : post.status === "마감임박" ? "#FFD600" : "#FF5C1A", color: post.status === "마감임박" ? "#0D2B4E" : "#fff", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700 }}>{post.status}</span>
                        <span style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "#fff", color: "#007AFF", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, border: "1px solid #EBF5FF" }}>📍 {post.region}</span>
                        <span style={{ fontSize: "40px" }}>{post.emoji}</span>
                      </div>
                      <div style={{ padding: "20px 24px 24px" }}>
                        <span style={{ color: "#FF5C1A", fontSize: "11px", fontWeight: 700 }}>#{post.tag}</span>
                        <h4 style={{ fontSize: "17px", fontWeight: 700, marginTop: "6px", lineHeight: 1.4 }}>{post.title}</h4>
                        <p style={{ fontSize: "13px", color: "#64748B", marginTop: "8px" }}>📅 {post.date} · 📍 {post.location}</p>
                        <div style={{ marginTop: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                            <span>👥 참여</span><span>{post.currentParticipants}/{post.maxParticipants}명</span>
                          </div>
                          <div style={{ height: "6px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: "100px", backgroundColor: post.status === "마감" ? "#CBD5E1" : "#FF5C1A", width: `${(post.currentParticipants / post.maxParticipants) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SOLT Mate 탭 ─────────────────────────────────────────── */}
        {mainTab === "메이트" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Hero */}
            <div style={{
              borderRadius: "28px", padding: "44px 52px", marginBottom: "36px",
              background: "linear-gradient(135deg, #FFF4F0 0%, #F0EFFF 100%)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              border: "1px solid #F2E8FF",
            }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.14em" }}>SOLT MATE</span>
                <h2 style={{ fontSize: "30px", fontWeight: 900, marginTop: "8px", marginBottom: "12px", letterSpacing: "-0.03em" }}>건강한 크리스천 만남</h2>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.75 }}>
                  신앙 안에서 시작하는 진지하고 아름다운 만남.<br />
                  No Alcohol · 본인 인증 · 교역자 추천으로 신뢰를 보장합니다.
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
                  {[{ icon: "🔒", l: "본인 인증 필수" }, { icon: "🚫", l: "No Alcohol" }, { icon: "✝️", l: "신앙 인증" }, { icon: "🤝", l: "교역자 추천" }].map(b => (
                    <span key={b.l} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", borderRadius: "100px", backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid #F2F4F7", fontSize: "12px", fontWeight: 700, color: "#0D2B4E" }}>
                      {b.icon} {b.l}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: "80px", flexShrink: 0, marginLeft: "32px" }}>💌</div>
            </div>

            {/* ── Filters ── */}
            <div style={{ backgroundColor: "#F8FAFC", borderRadius: "20px", padding: "24px 28px", marginBottom: "36px", border: "1px solid #F2F4F7" }}>
              <p style={{ fontSize: "13px", fontWeight: 900, marginBottom: "20px", color: "#0D2B4E" }}>필터로 찾기</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Gender */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", minWidth: "52px" }}>성별</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(["전체", "남", "여"] as const).map(g => (
                      <button key={g} style={chipStyle(filterGender === g, "#5856D6")} onClick={() => setFilterGender(g)}>{g}</button>
                    ))}
                  </div>
                </div>
                {/* Age */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", minWidth: "52px" }}>나이대</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {AGE_GROUPS.map(a => (
                      <button key={a} style={chipStyle(filterAge === a, "#007AFF")} onClick={() => setFilterAge(a)}>{a}</button>
                    ))}
                  </div>
                </div>
                {/* Church */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", minWidth: "52px" }}>교회</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {allChurches.map(c => (
                      <button key={c} style={chipStyle(filterChurch === c, "#34C759")} onClick={() => setFilterChurch(c)}>{c}</button>
                    ))}
                  </div>
                </div>
                {/* Interest */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", minWidth: "52px" }}>관심사</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {MATE_INTERESTS.map(i => (
                      <button key={i} style={chipStyle(filterInterest === i, "#FF5C1A")} onClick={() => setFilterInterest(i)}>{i}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Profile Cards ── */}
            <div style={{ marginBottom: "60px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 900 }}>지금 활동 중인 솔트 메이트</h2>
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>{filteredMates.length}명</span>
              </div>

              {filteredMates.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 0", color: "#94A3B8" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                  <p style={{ fontSize: "15px", fontWeight: 700 }}>조건에 맞는 메이트가 없어요</p>
                  <p style={{ fontSize: "13px", marginTop: "6px" }}>필터를 바꿔보세요</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                  {filteredMates.map((profile, i) => {
                    const isMatched = matchedIds.has(profile.id);
                    return (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        style={{
                          borderRadius: "24px", backgroundColor: "#fff",
                          boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid #F2F4F7",
                          padding: "28px", position: "relative", overflow: "hidden",
                        }}
                      >
                        {/* Verified watermark */}
                        {profile.verified && (
                          <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                            <span style={{ fontSize: "10px", fontWeight: 900, color: "#34C759", backgroundColor: "#E8F9EE", padding: "4px 10px", borderRadius: "100px" }}>
                              ✓ 교회 인증
                            </span>
                          </div>
                        )}

                        {/* Avatar + basic info */}
                        <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
                          <div style={{
                            width: "60px", height: "60px", borderRadius: "20px", flexShrink: 0,
                            background: profile.gender === "여"
                              ? "linear-gradient(135deg,#FF9A9E,#FAD0C4)"
                              : "linear-gradient(135deg,#A1C4FD,#C2E9FB)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
                          }}>
                            {profile.emoji}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "17px", fontWeight: 900 }}>{profile.name}</span>
                              <span style={{ fontSize: "13px", color: "#94A3B8" }}>{profile.age}세 · {profile.gender}</span>
                            </div>
                            <p style={{ fontSize: "12px", color: "#64748B", marginTop: "3px" }}>⛪ {profile.church}</p>
                            <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>📍 {profile.distance}</p>
                          </div>
                        </div>

                        {/* Manner temperature */}
                        <div style={{ marginBottom: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8" }}>매너 온도</span>
                          </div>
                          <MannerTemp score={profile.mannerScore} />
                        </div>

                        {/* Intro */}
                        <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65, marginBottom: "14px" }}>
                          {profile.intro}
                        </p>

                        {/* Interest chips */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                          {profile.interests.map(tag => (
                            <span key={tag} style={{ fontSize: "11px", fontWeight: 700, color: "#FF5C1A", backgroundColor: "#FFF0EB", padding: "4px 10px", borderRadius: "100px" }}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => setProfileDetail(profile)}
                            style={{
                              flex: 1, padding: "11px", borderRadius: "100px",
                              border: "1.5px solid #E2E8F0", backgroundColor: "#fff",
                              color: "#0D2B4E", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                            }}>
                            프로필 보기
                          </button>
                          <button
                            onClick={() => handleMatchRequest(profile)}
                            style={{
                              flex: 1, padding: "11px", borderRadius: "100px", border: "none",
                              backgroundColor: isMatched ? "#E8F9EE" : "#FF5C1A",
                              color: isMatched ? "#34C759" : "#fff",
                              fontSize: "13px", fontWeight: 700,
                              cursor: isMatched ? "default" : "pointer",
                              transition: "all 0.3s",
                            }}>
                            {isMatched ? "✓ 신청 완료" : "매칭 신청"}
                          </button>
                        </div>

                        {/* Chat button if matched */}
                        {isMatched && (
                          <button
                            onClick={() => { setChatModal(profile); setChatTopic([]); setChatMsg(""); setChatSent(chatIds.has(profile.id)); }}
                            style={{
                              width: "100%", marginTop: "8px", padding: "10px", borderRadius: "100px",
                              border: "none", backgroundColor: chatIds.has(profile.id) ? "#F0EFFF" : "#F8FAFC",
                              color: chatIds.has(profile.id) ? "#5856D6" : "#0D2B4E",
                              fontSize: "13px", fontWeight: 700, cursor: "pointer",
                            }}>
                            {chatIds.has(profile.id) ? "💬 대화방 입장" : "💬 대화 신청"}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Programs ── */}
            <h2 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "20px" }}>솔트 메이트 프로그램</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {matePrograms.map((prog, i) => {
                const totalApplied = prog.maleCount + prog.femaleCount;
                const remaining = prog.maxSlots - totalApplied;
                const malePct = Math.round((prog.maleCount / totalApplied) * 100);
                const isApplied = appliedPrograms.has(prog.id);
                const isFull = remaining <= 0;
                const isAlmostFull = remaining > 0 && remaining <= 5;
                const statusLabel = isFull ? "마감" : isAlmostFull ? "마감 임박" : `남은 자리 ${remaining}명`;
                const statusColor = isFull ? "#94A3B8" : isAlmostFull ? "#FF2D55" : "#34C759";
                return (
                  <motion.div key={prog.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ borderRadius: "24px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid #F2F4F7" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 20px rgba(0,0,0,0.06)"; }}
                  >
                    {/* Card hero */}
                    <div style={{ height: "160px", background: prog.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <span style={{ position: "absolute", top: "16px", left: "16px", fontSize: "11px", fontWeight: 900, color: "#fff", backgroundColor: prog.color, padding: "4px 12px", borderRadius: "100px" }}>{prog.badge}</span>
                      {/* Status badge */}
                      <span style={{
                        position: "absolute", top: "16px", right: "16px",
                        fontSize: "10px", fontWeight: 900, color: statusColor,
                        backgroundColor: `${statusColor}18`, padding: "4px 10px", borderRadius: "100px",
                        border: `1px solid ${statusColor}30`,
                      }}>
                        {isFull ? "● 마감" : isAlmostFull ? "🔥 마감임박" : `● ${statusLabel}`}
                      </span>
                      <span style={{ fontSize: "52px" }}>{prog.emoji}</span>
                    </div>

                    <div style={{ padding: "20px 24px 24px" }}>
                      <h4 style={{ fontSize: "17px", fontWeight: 900, marginBottom: "6px" }}>{prog.title}</h4>

                      {/* Date/Location info */}
                      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>📅 {prog.dateLabel} {prog.timeLabel}</span>
                        <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>📍 {prog.location}</span>
                      </div>

                      <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: "14px" }}>{prog.desc}</p>

                      {/* Tags */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {prog.tags.map(tag => (
                          <span key={tag} style={{ fontSize: "11px", fontWeight: 700, color: prog.color, backgroundColor: `${prog.color}15`, padding: "3px 10px", borderRadius: "100px" }}>{tag}</span>
                        ))}
                      </div>

                      {/* Slot progress */}
                      <div style={{ marginBottom: prog.hasGenderBalance ? "12px" : "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8" }}>모집 현황</span>
                          <span style={{ fontSize: "11px", fontWeight: 900, color: isFull ? "#94A3B8" : isAlmostFull ? "#FF2D55" : "#34C759" }}>
                            {totalApplied}/{prog.maxSlots}명
                          </span>
                        </div>
                        <div style={{ height: "6px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
                          <div style={{ width: `${Math.min((totalApplied / prog.maxSlots) * 100, 100)}%`, height: "100%", borderRadius: "100px", backgroundColor: isFull ? "#CBD5E1" : isAlmostFull ? "#FF2D55" : prog.color, transition: "width 0.6s" }} />
                        </div>
                      </div>

                      {/* Gender ratio bar */}
                      {prog.hasGenderBalance && (
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#007AFF" }}>남 {prog.maleCount}명 ({malePct}%)</span>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF2D55" }}>여 {prog.femaleCount}명 ({100 - malePct}%)</span>
                          </div>
                          <div style={{ height: "8px", borderRadius: "100px", overflow: "hidden", display: "flex" }}>
                            <div style={{ width: `${malePct}%`, backgroundColor: "#007AFF", transition: "width 0.6s" }} />
                            <div style={{ width: `${100 - malePct}%`, backgroundColor: "#FF2D55" }} />
                          </div>
                          <p style={{ fontSize: "10px", color: Math.abs(malePct - 50) <= 10 ? "#34C759" : "#FF9500", fontWeight: 700, marginTop: "4px", textAlign: "center" }}>
                            {Math.abs(malePct - 50) <= 10 ? "✓ 성비 균형" : "⚡ 성비 조율 중"}
                          </p>
                        </div>
                      )}

                      {/* Apply button */}
                      <button
                        onClick={() => !isApplied && !isFull && openProgramModal(prog)}
                        disabled={isApplied || isFull}
                        style={{
                          width: "100%", padding: "13px", borderRadius: "100px", border: "none",
                          backgroundColor: isApplied ? "#E8F9EE" : isFull ? "#F2F4F7" : prog.color,
                          color: isApplied ? "#34C759" : isFull ? "#94A3B8" : "#fff",
                          fontSize: "14px", fontWeight: 700,
                          cursor: isApplied || isFull ? "default" : "pointer",
                          transition: "all 0.2s",
                        }}>
                        {isApplied ? "✓ 신청 완료" : isFull ? "모집 마감" : "신청하기"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* ══ PROGRAM APPLICATION MODAL ══════════════════════════════════════ */}
      <AnimatePresence>
        {programModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: "24px" }}
            onClick={() => !applyDone && setProgramModal(null)}
          >
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: "#fff", borderRadius: "28px", padding: "0", maxWidth: "480px", width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.18)", overflow: "hidden" }}
            >
              {/* Modal header */}
              <div style={{ padding: "0", background: programModal.bg }}>
                <div style={{ padding: "32px 32px 28px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "44px" }}>{programModal.emoji}</div>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 900, color: programModal.color, letterSpacing: "0.1em", marginBottom: "4px" }}>SOLT MATE PROGRAM</p>
                    <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#0D2B4E" }}>{programModal.title}</h3>
                    <p style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>📅 {programModal.dateLabel} {programModal.timeLabel} · 📍 {programModal.location}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: "28px 32px 32px" }}>
                {applyDone ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}
                      style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#E8F9EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px" }}>
                      ✓
                    </motion.div>
                    <p style={{ fontSize: "18px", fontWeight: 900, marginBottom: "10px" }}>신청 완료!</p>
                    <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.7, marginBottom: "8px" }}>
                      프로그램 신청이 완료되었습니다.<br />
                      담당자가 곧 연락드릴 예정입니다.
                    </p>
                    <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "#FFF5F0", marginBottom: "24px" }}>
                      <p style={{ fontSize: "12px", color: "#FF5C1A", fontWeight: 700 }}>📅 일정이 마이페이지 캘린더에 자동 등록됐어요!</p>
                    </div>
                    <button onClick={() => setProgramModal(null)}
                      style={{ padding: "13px 36px", borderRadius: "100px", border: "none", backgroundColor: "#0D2B4E", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                      확인
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: "14px", fontWeight: 900, marginBottom: "18px" }}>신청자 정보 입력</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                      {/* Name */}
                      <div>
                        <input placeholder="이름 *" value={applyName}
                          onChange={e => { setApplyName(e.target.value); setApplyErrors(er => ({ ...er, name: "" })); }}
                          style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#FAFAFA", border: `1.5px solid ${applyErrors.name ? "#FF2D55" : "#F2F4F7"}`, color: "#0D2B4E" }}
                        />
                        {applyErrors.name && <p style={{ fontSize: "11px", color: "#FF2D55", marginTop: "4px", marginLeft: "4px" }}>{applyErrors.name}</p>}
                      </div>
                      {/* Phone */}
                      <div>
                        <input placeholder="연락처 (010-0000-0000) *" value={applyPhone}
                          onChange={e => { setApplyPhone(e.target.value); setApplyErrors(er => ({ ...er, phone: "" })); }}
                          style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#FAFAFA", border: `1.5px solid ${applyErrors.phone ? "#FF2D55" : "#F2F4F7"}`, color: "#0D2B4E" }}
                        />
                        {applyErrors.phone && <p style={{ fontSize: "11px", color: "#FF2D55", marginTop: "4px", marginLeft: "4px" }}>{applyErrors.phone}</p>}
                      </div>
                      {/* Church */}
                      <div>
                        <input placeholder="소속 교회 *" value={applyChurch}
                          onChange={e => { setApplyChurch(e.target.value); setApplyErrors(er => ({ ...er, church: "" })); }}
                          style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#FAFAFA", border: `1.5px solid ${applyErrors.church ? "#FF2D55" : "#F2F4F7"}`, color: "#0D2B4E" }}
                        />
                        {applyErrors.church && <p style={{ fontSize: "11px", color: "#FF2D55", marginTop: "4px", marginLeft: "4px" }}>{applyErrors.church}</p>}
                      </div>
                    </div>

                    {/* Info notice */}
                    <div style={{ padding: "14px 16px", borderRadius: "14px", backgroundColor: "#F8FAFC", marginBottom: "20px" }}>
                      <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.6 }}>
                        ✓ 신청 완료 시 일정이 마이페이지 캘린더에 자동 등록됩니다.<br />
                        ✓ 담당자 확인 후 48시간 내 연락드립니다.
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => setProgramModal(null)}
                        style={{ flex: 1, padding: "14px", borderRadius: "100px", border: "1px solid #F2F4F7", backgroundColor: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", color: "#64748B" }}>
                        취소
                      </button>
                      <button onClick={handleProgramApply}
                        style={{ flex: 2, padding: "14px", borderRadius: "100px", border: "none", backgroundColor: programModal.color, color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                        신청 완료하기
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PROGRAM TOAST ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {programToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{ position: "fixed", bottom: "96px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#0D2B4E", color: "#fff", padding: "14px 24px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#34C759" }}>✓</span>
            프로그램 신청이 완료되었습니다. 담당자가 곧 연락드릴 예정입니다.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ TOAST ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {matchToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#0D2B4E", color: "#fff", padding: "14px 28px",
              borderRadius: "100px", fontSize: "14px", fontWeight: 700,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 500, whiteSpace: "nowrap",
            }}>
            ✓ {matchToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ COMMUNITY GUIDE MODAL ══════════════════════════════════════════ */}
      <AnimatePresence>
        {guideModal && pendingMatch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: "24px" }}
            onClick={() => { setGuideModal(false); setPendingMatch(null); }}
          >
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: "#fff", borderRadius: "28px", padding: "40px 36px", maxWidth: "480px", width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
            >
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🤝</div>
                <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "8px" }}>건강한 만남을 위한<br />커뮤니티 가이드</h3>
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>{pendingMatch.name}님께 매칭 신청 전 아래 가이드를 확인해주세요</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                {[
                  { icon: "🚫", title: "No Alcohol", desc: "SOLT 메이트는 음주 없는 건강한 만남을 지향합니다." },
                  { icon: "📍", title: "공공장소 첫 만남", desc: "처음 만남은 반드시 공공장소(카페, 식당 등)에서 가져주세요." },
                  { icon: "🛡️", title: "개인정보 보호", desc: "상대방의 연락처를 동의 없이 공유하거나 유포하지 마세요." },
                  { icon: "🙏", title: "존중과 배려", desc: "상대방이 거절 의사를 밝히면 즉시 수용하고 배려해주세요." },
                  { icon: "⚠️", title: "부적절 신고", desc: "불편한 상황 발생 시 언제든지 SOLT에 신고할 수 있습니다." },
                ].map(g => (
                  <div key={g.title} style={{ display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "14px", backgroundColor: "#F8FAFC" }}>
                    <span style={{ fontSize: "18px", flexShrink: 0 }}>{g.icon}</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>{g.title}</p>
                      <p style={{ fontSize: "12px", color: "#64748B" }}>{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => { setGuideModal(false); setPendingMatch(null); }}
                  style={{ flex: 1, padding: "14px", borderRadius: "100px", border: "1px solid #F2F4F7", backgroundColor: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", color: "#64748B" }}>
                  취소
                </button>
                <button onClick={confirmMatch}
                  style={{ flex: 1, padding: "14px", borderRadius: "100px", border: "none", backgroundColor: "#FF5C1A", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                  동의하고 신청하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PROFILE DETAIL MODAL ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {profileDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: "24px" }}
            onClick={() => setProfileDetail(null)}
          >
            <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: "#fff", borderRadius: "28px", padding: "0", maxWidth: "480px", width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
            >
              {/* Header */}
              <div style={{
                padding: "36px 32px 28px", textAlign: "center",
                background: profileDetail.gender === "여"
                  ? "linear-gradient(135deg,#FFF0EB,#FFE4F0)"
                  : "linear-gradient(135deg,#EBF5FF,#E0EEFF)",
                borderRadius: "28px 28px 0 0", position: "relative",
              }}>
                <button onClick={() => setProfileDetail(null)}
                  style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "14px", cursor: "pointer", color: "#64748B" }}>
                  ✕
                </button>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "24px", margin: "0 auto 16px",
                  background: profileDetail.gender === "여" ? "linear-gradient(135deg,#FF9A9E,#FAD0C4)" : "linear-gradient(135deg,#A1C4FD,#C2E9FB)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px",
                }}>
                  {profileDetail.emoji}
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "4px" }}>
                  {profileDetail.name}
                  {profileDetail.verified && <span style={{ fontSize: "12px", fontWeight: 700, color: "#34C759", backgroundColor: "#E8F9EE", padding: "3px 10px", borderRadius: "100px", marginLeft: "8px" }}>✓ 교회 인증</span>}
                </h3>
                <p style={{ fontSize: "14px", color: "#64748B" }}>{profileDetail.age}세 · {profileDetail.gender} · {profileDetail.ageGroup}</p>
                <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>⛪ {profileDetail.church} · 📍 {profileDetail.distance}</p>
              </div>

              <div style={{ padding: "28px 32px 32px" }}>
                {/* Manner temp */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "10px" }}>매너 온도</p>
                  <MannerTemp score={profileDetail.mannerScore} />
                </div>

                {/* Intro */}
                <div style={{ padding: "18px 20px", borderRadius: "16px", backgroundColor: "#F8FAFC", marginBottom: "20px" }}>
                  <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.7 }}>{profileDetail.intro}</p>
                </div>

                {/* Interests */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "10px" }}>관심사</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {profileDetail.interests.map(tag => (
                      <span key={tag} style={{ fontSize: "13px", fontWeight: 700, color: "#FF5C1A", backgroundColor: "#FFF0EB", padding: "6px 14px", borderRadius: "100px" }}>#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Calendar add */}
                <button onClick={() => { setProfileDetail(null); setScheduleModal(profileDetail); setScheduleDone(false); setCalAdded(false); }}
                  style={{ width: "100%", padding: "13px", borderRadius: "100px", border: "1.5px dashed #E2E8F0", backgroundColor: "#F8FAFC", color: "#64748B", fontSize: "13px", fontWeight: 700, cursor: "pointer", marginBottom: "12px" }}>
                  📅 만남 일정 캘린더에 추가
                </button>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { setChatModal(profileDetail); setChatTopic([]); setChatMsg(""); setChatSent(chatIds.has(profileDetail.id)); setProfileDetail(null); }}
                    style={{ flex: 1, padding: "14px", borderRadius: "100px", border: "1.5px solid #E2E8F0", backgroundColor: "#fff", color: "#0D2B4E", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                    💬 대화 신청
                  </button>
                  <button onClick={() => { handleMatchRequest(profileDetail); }}
                    style={{
                      flex: 1, padding: "14px", borderRadius: "100px", border: "none",
                      backgroundColor: matchedIds.has(profileDetail.id) ? "#E8F9EE" : "#FF5C1A",
                      color: matchedIds.has(profileDetail.id) ? "#34C759" : "#fff",
                      fontSize: "14px", fontWeight: 700,
                      cursor: matchedIds.has(profileDetail.id) ? "default" : "pointer",
                    }}>
                    {matchedIds.has(profileDetail.id) ? "✓ 신청 완료" : "매칭 신청"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ CHAT MODAL ═════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {chatModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 500 }}
            onClick={() => setChatModal(null)}
          >
            <motion.div initial={{ y: 320 }} animate={{ y: 0 }} exit={{ y: 320 }} transition={{ type: "spring", damping: 26 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: "#fff", borderRadius: "28px 28px 0 0", padding: "32px 28px 52px", width: "100%", maxWidth: "720px", maxHeight: "88vh", overflowY: "auto" }}
            >
              <div style={{ width: "40px", height: "4px", borderRadius: "100px", backgroundColor: "#E2E8F0", margin: "0 auto 24px" }} />

              {/* If already sent / open chat room */}
              {chatIds.has(chatModal.id) ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "linear-gradient(135deg,#FF5C1A,#FF9500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{chatModal.emoji}</div>
                    <div>
                      <p style={{ fontSize: "16px", fontWeight: 900 }}>{chatModal.name}</p>
                      <p style={{ fontSize: "12px", color: "#34C759", fontWeight: 700 }}>● 대화 중</p>
                    </div>
                  </div>
                  {/* Mock conversation */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ backgroundColor: "#FF5C1A", color: "#fff", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", fontSize: "14px", maxWidth: "70%" }}>안녕하세요! 반갑습니다 😊</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg,#FF5C1A,#FF9500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{chatModal.emoji}</div>
                      <div style={{ backgroundColor: "#F8FAFC", padding: "12px 16px", borderRadius: "18px 18px 18px 4px", fontSize: "14px", maxWidth: "70%", color: "#0D2B4E" }}>안녕하세요! 저도 반갑습니다. 어떤 이야기 나눠볼까요? 🙏</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input placeholder="메시지 입력..." style={{ ...inputStyle, flex: 1 }} readOnly />
                    <button style={{ padding: "12px 20px", borderRadius: "100px", border: "none", backgroundColor: "#FF5C1A", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>전송</button>
                  </div>
                </div>
              ) : chatSent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
                  <p style={{ fontSize: "20px", fontWeight: 900, marginBottom: "8px" }}>대화 신청 완료!</p>
                  <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>{chatModal.name}님이 수락하면 대화를 시작할 수 있어요.</p>
                  <button onClick={() => { setChatIds(prev => new Set([...prev, chatModal.id])); setChatSent(false); }}
                    style={{ padding: "12px 28px", borderRadius: "100px", border: "none", backgroundColor: "#5856D6", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                    수락됨 (시뮬레이션)
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "6px" }}>💬 대화 신청</h3>
                  <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "24px" }}>{chatModal.name}님과 어떤 주제로 대화하고 싶으신가요?</p>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "10px" }}>대화 주제 선택 (복수 가능)</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                    {CHAT_TOPICS.map(t => (
                      <button key={t} onClick={() => setChatTopic(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                        style={{ padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer", border: chatTopic.includes(t) ? "2px solid #FF5C1A" : "1px solid #F2F4F7", backgroundColor: chatTopic.includes(t) ? "#FFF0EB" : "#fff", color: chatTopic.includes(t) ? "#FF5C1A" : "#64748B" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "10px" }}>첫 인사 메시지</p>
                  <textarea rows={3} placeholder={`${chatModal.name}님께 첫 인사를 남겨보세요...`}
                    value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                    style={{ ...inputStyle, resize: "none", lineHeight: 1.6, marginBottom: "20px", height: "auto" }}
                  />
                  <button
                    onClick={() => { if (chatTopic.length > 0 && chatMsg.trim()) setChatSent(true); }}
                    disabled={chatTopic.length === 0 || !chatMsg.trim()}
                    style={{ width: "100%", padding: "16px", borderRadius: "100px", border: "none", backgroundColor: chatTopic.length > 0 && chatMsg.trim() ? "#FF5C1A" : "#E2E8F0", color: chatTopic.length > 0 && chatMsg.trim() ? "#fff" : "#94A3B8", fontSize: "16px", fontWeight: 700, cursor: chatTopic.length > 0 && chatMsg.trim() ? "pointer" : "not-allowed" }}>
                    대화 신청 보내기
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SCHEDULE / CALENDAR MODAL ══════════════════════════════════════ */}
      <AnimatePresence>
        {scheduleModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: "24px" }}
            onClick={() => setScheduleModal(null)}
          >
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: "#fff", borderRadius: "28px", padding: "36px 32px", maxWidth: "440px", width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
            >
              {calAdded ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
                  <p style={{ fontSize: "20px", fontWeight: 900, marginBottom: "8px" }}>캘린더에 추가됐어요!</p>
                  <p style={{ fontSize: "14px", color: "#64748B" }}>마이페이지 캘린더에서 확인하세요</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "6px" }}>📅 만남 일정 추가</h3>
                  <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "24px" }}>{scheduleModal.name}님과의 약속을 캘린더에 등록해요</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "8px" }}>날짜 *</p>
                      <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                        style={{ ...inputStyle }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "8px" }}>시간</p>
                      <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                        style={{ ...inputStyle }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "8px" }}>장소 (선택)</p>
                      <input placeholder="예: 강남역 스타벅스" value={schedulePlace} onChange={e => setSchedulePlace(e.target.value)}
                        style={{ ...inputStyle }} />
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: "14px", backgroundColor: "#FFF0EB", marginBottom: "20px" }}>
                    <p style={{ fontSize: "12px", color: "#FF5C1A", fontWeight: 700 }}>💡 등록 후 마이페이지 → 캘린더 탭에서 확인할 수 있어요</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setScheduleModal(null)}
                      style={{ flex: 1, padding: "14px", borderRadius: "100px", border: "1px solid #F2F4F7", backgroundColor: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", color: "#64748B" }}>
                      취소
                    </button>
                    <button onClick={handleScheduleAdd} disabled={!scheduleDate}
                      style={{ flex: 1, padding: "14px", borderRadius: "100px", border: "none", backgroundColor: scheduleDate ? "#FF5C1A" : "#E2E8F0", color: scheduleDate ? "#fff" : "#94A3B8", fontSize: "14px", fontWeight: 700, cursor: scheduleDate ? "pointer" : "not-allowed" }}>
                      캘린더에 추가
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ CREATE MEETING MODAL ════════════════════════════════════════════ */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(13,43,78,0.4)", backdropFilter: "blur(6px)" }} onClick={() => setShowCreate(false)} />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ position: "relative", zIndex: 1, marginTop: "auto", backgroundColor: "#fff", borderRadius: "28px 28px 0 0", padding: "32px 32px 48px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}
          >
            <div style={{ width: "40px", height: "4px", borderRadius: "100px", backgroundColor: "#E2E8F0", margin: "0 auto 24px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 900 }}>모임 만들기</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#94A3B8" }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "8px" }}>모임 이름 *</label>
                <input required placeholder="예: 토요일 강남 풋살 팟" value={newPost.title}
                  onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                  style={{ ...inputStyle }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "8px" }}>소개 *</label>
                <textarea required rows={3} placeholder="어떤 모임인지 간단히 소개해주세요." value={newPost.description}
                  onChange={e => setNewPost(p => ({ ...p, description: e.target.value }))}
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.6, height: "auto" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "8px" }}>일시 *</label>
                  <input required placeholder="3/15 (토) 14:00" value={newPost.date}
                    onChange={e => setNewPost(p => ({ ...p, date: e.target.value }))}
                    style={{ ...inputStyle }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "8px" }}>장소 *</label>
                  <input required placeholder="강남역 근처" value={newPost.location}
                    onChange={e => setNewPost(p => ({ ...p, location: e.target.value }))}
                    style={{ ...inputStyle }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "8px" }}>지역</label>
                  <select value={newPost.region} onChange={e => setNewPost(p => ({ ...p, region: e.target.value }))}
                    style={{ ...inputStyle }}>
                    {REGIONS.filter(r => r !== "전체").map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "8px" }}>카테고리</label>
                  <select value={newPost.tag} onChange={e => setNewPost(p => ({ ...p, tag: e.target.value }))}
                    style={{ ...inputStyle }}>
                    {CATEGORIES.filter(c => c !== "전체").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", display: "block", marginBottom: "8px" }}>최대 인원</label>
                  <input type="number" min={2} max={100} value={newPost.maxParticipants}
                    onChange={e => setNewPost(p => ({ ...p, maxParticipants: Number(e.target.value) }))}
                    style={{ ...inputStyle }} />
                </div>
              </div>
              <button type="submit" style={{ padding: "16px", borderRadius: "100px", border: "none", backgroundColor: "#FF5C1A", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", marginTop: "8px" }}>
                모임 개설하기
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
