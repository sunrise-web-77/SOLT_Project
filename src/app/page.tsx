"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Users, GraduationCap, ShoppingBag, Flame, Newspaper } from "lucide-react";
import Nav from "@/components/Nav";
import { mockPosts, shopItems } from "@/lib/mockData";

/* ── helpers ── */
const inter = "'Inter', 'Noto Sans KR', sans-serif";

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

/* ── icon bubble ── */
const Bubble = ({ bg, children }: { bg: string; children: React.ReactNode }) => (
  <div style={{
    width: 60, height: 60, borderRadius: "50%", background: bg, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    {children}
  </div>
);

/* ── data ── */
const navCards = [
  { label: "Play",    sub: "모임",     icon: <Bubble bg="linear-gradient(135deg,#EBF5FF,#C8E5FF)"><Users         size={28} color="#007AFF" strokeWidth={2} /></Bubble>, desc: "같은 믿음, 같은 관심사로 모이는 모임",    href: "/play" },
  { label: "Learn",   sub: "클래스",   icon: <Bubble bg="linear-gradient(135deg,#E8F9EE,#C3F0D4)"><GraduationCap size={28} color="#34C759" strokeWidth={2} /></Bubble>, desc: "신앙과 실력을 함께 키우는 클래스",          href: "/learn" },
  { label: "Shop",    sub: "스토어",   icon: <Bubble bg="linear-gradient(135deg,#FFF0EB,#FFD8C8)"><ShoppingBag   size={28} color="#FF5C1A" strokeWidth={2} /></Bubble>, desc: "감각적인 크리스천 라이프스타일 굿즈",      href: "/shop" },
  { label: "Action",  sub: "액션",     icon: <Bubble bg="linear-gradient(135deg,#FFF5E6,#FFE4B8)"><Flame         size={28} color="#FF9500" strokeWidth={2} /></Bubble>, desc: "후원·봉사·캠페인으로 세상을 바꿔요",      href: "/action" },
  { label: "Insight", sub: "인사이트", icon: <Bubble bg="linear-gradient(135deg,#F0EFFF,#DCD9FF)"><Newspaper     size={28} color="#5856D6" strokeWidth={2} /></Bubble>, desc: "교계 트렌드와 선교지 이야기",              href: "/insight" },
];

const matePrograms = [
  {
    id: "m1", emoji: "💑", color: "#FF5C1A", bg: "linear-gradient(135deg,#FFF0EB,#FFD8C8)",
    badge: "인기", title: "1:1 크리스천 소개팅",
    desc: "같은 신앙을 가진 청년과의 진지한 1:1 만남.\n본인 인증 필수, 교역자 추천 우대.",
    stat: "32쌍 매칭 완료",
  },
  {
    id: "m2", emoji: "🎉", color: "#5856D6", bg: "linear-gradient(135deg,#F0EFFF,#DCD9FF)",
    badge: "NEW", title: "교회 간 단체 미팅",
    desc: "5:5 교회 간 단체 미팅.\n서로의 교회 문화와 신앙 이야기를 나눠요.",
    stat: "12팀 모집 중",
  },
  {
    id: "m3", emoji: "☕", color: "#34C759", bg: "linear-gradient(135deg,#E8F9EE,#C3F0D4)",
    badge: "D-7", title: "크리스천 청년 밋업",
    desc: "부담 없이 시작하는 소셜 파티.\n같은 믿음의 새로운 친구를 만나요.",
    stat: "48명 신청 중",
  },
];

const partnerChurches = [
  "사랑의교회", "온누리교회", "분당우리교회", "영락교회",
  "소망교회", "강남중앙침례교회", "동안교회", "주님의교회",
];

const pods = mockPosts.filter((p) => p.type === "play").slice(0, 4);
const classes = mockPosts.filter((p) => p.type === "learn").slice(0, 4);

export default function Home() {
  const [contact, setContact] = useState({ category: "도움 요청 문의", name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setContact({ category: "도움 요청 문의", name: "", email: "", message: "" }); }, 3000);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E", fontFamily: inter }}>
      <Nav />

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <section style={{
        padding: "140px 60px 120px", textAlign: "center", backgroundColor: "#ffffff",
        position: "relative", overflow: "hidden",
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{
            display: "inline-block", fontSize: "10px", fontWeight: 700, color: "#94A3B8",
            letterSpacing: "0.14em", padding: "6px 18px", borderRadius: "100px",
            backgroundColor: "#F8FAFC", border: "1px solid #F2F4F7", marginBottom: "32px",
          }}>
            CHRISTIAN LIFESTYLE PLATFORM
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
          style={{ fontSize: "96px", fontWeight: 900, color: "#0D2B4E", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "32px" }}
        >
          SOLT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            fontSize: "18px", fontWeight: 500, lineHeight: 1.8, color: "#64748B",
            fontStyle: "italic", maxWidth: "480px", margin: "0 auto 10px",
          }}
        >
          &ldquo;You are the light of the world. A town built on a hill cannot be hidden.&rdquo;
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ fontSize: "13px", fontWeight: 600, color: "#94A3B8", marginBottom: "24px" }}
        >
          Matthew 5:14
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 48px" }}
        >
          빛과 소금으로 살아가는 아름다운 하나님의 세계,<br />함께 만들어가는 SOLT에서 당신의 일상이 달라집니다.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link href="/play" style={{
            display: "inline-block", backgroundColor: "#0D2B4E", color: "#fff",
            padding: "16px 40px", borderRadius: "100px", fontSize: "16px", fontWeight: 700,
            textDecoration: "none", transition: "transform 0.2s",
          }}>
            시작하기
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          MARQUEE BAR
      ═══════════════════════════════════ */}
      <div style={{ backgroundColor: "#0D2B4E", padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ display: "inline-block" }}
        >
          {Array(3).fill(null).map((_, k) => (
            <span key={k} style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", marginRight: "60px" }}>
              PLAY · LEARN · SHOP · ACTION · INSIGHT · SOLT MATE · SOLT ☀️{" "}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════
          CATEGORY CARDS
      ═══════════════════════════════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 48px" }}>
        <FadeUp>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#FF5C1A", letterSpacing: "0.14em", marginBottom: "8px" }}>EXPLORE</p>
          <h2 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "48px" }}>다섯 개의 세계</h2>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
          {navCards.map((c, i) => (
            <FadeUp key={c.label} delay={i * 0.08}>
              <Link href={c.href} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ y: -10 }}
                  style={{
                    borderRadius: "40px", aspectRatio: "1/1", backgroundColor: "#F9FAFB",
                    cursor: "pointer", transition: "box-shadow 0.3s, background-color 0.3s, border 0.3s",
                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                    padding: "28px",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.backgroundColor = "#ffffff";
                    el.style.boxShadow = "0 20px 50px rgba(255,140,0,0.12)";
                    el.style.border = "1px solid rgba(255,140,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.backgroundColor = "#F9FAFB";
                    el.style.boxShadow = "none";
                    el.style.border = "none";
                  }}
                >
                  <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "60px" }}>
                    {c.icon}
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#FF5C1A", letterSpacing: "0.08em" }}>{c.sub}</p>
                  <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#0D2B4E", marginTop: "4px" }}>{c.label}</h3>
                  <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px", lineHeight: 1.5, textAlign: "center", wordBreak: "keep-all" }}>
                    {c.desc}
                  </p>
                </motion.div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          POD CARDS (Play)
      ═══════════════════════════════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px 100px" }}>
        <FadeUp>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#007AFF", letterSpacing: "0.14em" }}>SOLT POT</p>
              <h2 style={{ fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>지금 모집 중인 팟</h2>
            </div>
            <Link href="/play" style={{ fontSize: "14px", fontWeight: 600, color: "#94A3B8", textDecoration: "none" }}>전체 보기 →</Link>
          </div>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {pods.map((post, i) => (
            <FadeUp key={post.id} delay={i * 0.06}>
              <Link href={`/play/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <motion.div
                  whileHover={{ y: -6 }}
                  style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "#fff", border: "1px solid #F2F4F7", cursor: "pointer", transition: "box-shadow 0.3s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div style={{ height: "140px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{
                      position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 700,
                      color: "#fff", backgroundColor: post.status === "마감" ? "#94A3B8" : post.status === "마감임박" ? "#FF9500" : "#007AFF",
                      padding: "4px 10px", borderRadius: "100px",
                    }}>
                      {post.status}
                    </span>
                    <span style={{ fontSize: "36px" }}>{post.emoji}</span>
                  </div>
                  <div style={{ padding: "16px 20px 20px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#007AFF" }}>{post.tag}</p>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, marginTop: "4px", lineHeight: 1.4 }}>{post.title}</h4>
                    <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px" }}>{post.date} · {post.location}</p>
                    <div style={{ marginTop: "12px" }}>
                      <div style={{ height: "4px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "100px",
                          backgroundColor: post.status === "마감" ? "#CBD5E1" : "#007AFF",
                          width: `${(post.currentParticipants / post.maxParticipants) * 100}%`,
                        }} />
                      </div>
                      <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px", textAlign: "right" }}>
                        {post.currentParticipants}/{post.maxParticipants}명
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          CLASS CARDS (Learn)
      ═══════════════════════════════════ */}
      <section style={{ backgroundColor: "#F8FAFC", padding: "100px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <FadeUp>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#34C759", letterSpacing: "0.14em" }}>CLASS</p>
                <h2 style={{ fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>이번 주 인기 클래스</h2>
              </div>
              <Link href="/learn" style={{ fontSize: "14px", fontWeight: 600, color: "#94A3B8", textDecoration: "none" }}>전체 보기 →</Link>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {classes.map((post, i) => (
              <FadeUp key={post.id} delay={i * 0.06}>
                <Link href={`/learn/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "#fff", cursor: "pointer", transition: "box-shadow 0.3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                  >
                    <div style={{ height: "120px", background: "linear-gradient(135deg, #34C759 0%, #6FE08A 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "36px" }}>{post.emoji}</span>
                    </div>
                    <div style={{ padding: "16px 20px 20px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "#34C759" }}>{post.tag}</p>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, marginTop: "4px", lineHeight: 1.4 }}>{post.title}</h4>
                      <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px" }}>
                        {post.host.name} 강사{post.host.isVerified && <span style={{ color: "#34C759", marginLeft: "4px" }}>✓</span>}
                      </p>
                      <p style={{ fontSize: "12px", color: "#CBD5E1", marginTop: "4px" }}>{post.date}</p>
                    </div>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SHOP CURATION
      ═══════════════════════════════════ */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 48px" }}>
        <FadeUp>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#FF5C1A", letterSpacing: "0.14em" }}>SOLT SHOP</p>
              <h2 style={{ fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>이번 주 큐레이션</h2>
            </div>
            <Link href="/shop" style={{ fontSize: "14px", fontWeight: 600, color: "#94A3B8", textDecoration: "none" }}>전체 보기 →</Link>
          </div>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px" }}>
          {shopItems.map((item, i) => (
            <FadeUp key={item.id} delay={i * 0.05}>
              <Link href={`/shop/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <motion.div
                  whileHover={{ y: -6 }}
                  style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "#fff", border: "1px solid #F2F4F7", cursor: "pointer", transition: "box-shadow 0.3s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div style={{ height: "130px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                    {item.emoji}
                  </div>
                  <div style={{ padding: "14px 16px 16px" }}>
                    <p style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700 }}>{item.brand}</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, marginTop: "4px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 900 }}>{item.price}</span>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#FF5C1A", backgroundColor: "#FFF5F0", padding: "2px 8px", borderRadius: "100px" }}>{item.tag}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          SOLT MATE
      ═══════════════════════════════════ */}
      <section style={{ backgroundColor: "#F8FAFC", padding: "100px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <FadeUp>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "12px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#FF5C1A", letterSpacing: "0.14em" }}>SOLT MATE</p>
                <h2 style={{ fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>건강한 크리스천 만남</h2>
                <p style={{ fontSize: "14px", color: "#64748B", marginTop: "8px" }}>
                  신앙 안에서 시작하는 진지하고 아름다운 만남 프로그램
                </p>
              </div>
              <Link href="/play" style={{ fontSize: "14px", fontWeight: 600, color: "#94A3B8", textDecoration: "none" }}>전체 보기 →</Link>
            </div>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "40px" }}>
            {matePrograms.map((prog, i) => (
              <FadeUp key={prog.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  style={{
                    borderRadius: "24px", overflow: "hidden", backgroundColor: "#fff",
                    cursor: "pointer", transition: "box-shadow 0.3s",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ height: "160px", background: prog.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{
                      position: "absolute", top: "16px", left: "16px",
                      fontSize: "11px", fontWeight: 900, color: "#fff",
                      backgroundColor: prog.color, padding: "4px 12px", borderRadius: "100px",
                    }}>
                      {prog.badge}
                    </span>
                    <span style={{ fontSize: "52px" }}>{prog.emoji}</span>
                  </div>
                  <div style={{ padding: "20px 24px 24px" }}>
                    <h4 style={{ fontSize: "17px", fontWeight: 900, color: "#0D2B4E" }}>{prog.title}</h4>
                    <p style={{ fontSize: "13px", color: "#64748B", marginTop: "8px", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                      {prog.desc}
                    </p>
                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: prog.color }}>{prog.stat}</span>
                      <span style={{
                        fontSize: "12px", fontWeight: 700, color: prog.color,
                        backgroundColor: `${prog.color}15`, padding: "6px 16px", borderRadius: "100px",
                      }}>
                        신청하기 →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA
      ═══════════════════════════════════ */}
      <section style={{ padding: "120px 48px", textAlign: "center", background: "linear-gradient(180deg, #ffffff 0%, #F8FAFC 100%)" }}>
        <FadeUp>
          <h3 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "16px" }}>당신의 모임을 시작해보세요</h3>
          <p style={{ fontSize: "16px", color: "#94A3B8", marginBottom: "40px", lineHeight: 1.7 }}>
            축구, 찬양, 독서, 영어… 어떤 주제든 좋아요.<br />
            <span style={{ color: "#FF5C1A" }}>SOLT</span>에서 같은 믿음의 사람들과 연결되세요.
          </p>
          <Link href="/play" style={{
            display: "inline-block", backgroundColor: "#FF5C1A", color: "#fff",
            padding: "16px 44px", borderRadius: "100px", fontSize: "16px", fontWeight: 700, textDecoration: "none",
          }}>
            무료로 시작하기
          </Link>
        </FadeUp>
      </section>

      {/* ═══════════════════════════════════
          PARTNER CHURCHES + CONTACT
      ═══════════════════════════════════ */}
      <section style={{ backgroundColor: "#F8FAFC", padding: "100px 0", borderTop: "1px solid #F2F4F7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

          {/* Partner Churches */}
          <FadeUp>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#FF5C1A", letterSpacing: "0.14em", marginBottom: "8px" }}>PARTNER CHURCHES</p>
            <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "6px" }}>함께하는 교회</h2>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "32px", lineHeight: 1.6 }}>
              전국 크리스천 교회와 함께 SOLT 공동체를 만들어갑니다.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {partnerChurches.map((church) => (
                <div
                  key={church}
                  style={{
                    padding: "14px 8px", borderRadius: "14px", backgroundColor: "#fff",
                    border: "1px solid #F2F4F7", textAlign: "center",
                    fontSize: "12px", fontWeight: 700, color: "#0D2B4E",
                    lineHeight: 1.3,
                  }}
                >
                  {church}
                </div>
              ))}
            </div>
            <button style={{
              marginTop: "24px", padding: "12px 28px", borderRadius: "100px",
              border: "1px solid #E2E8F0", backgroundColor: "#fff",
              fontSize: "13px", fontWeight: 700, color: "#0D2B4E",
              cursor: "pointer",
            }}>
              협업 교회 더보기 →
            </button>
          </FadeUp>

          {/* Contact Form */}
          <FadeUp delay={0.1}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#5856D6", letterSpacing: "0.14em", marginBottom: "8px" }}>CONTACT</p>
            <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "6px" }}>문의하기</h2>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "32px" }}>
              협업, 제안, 도움 요청 — 무엇이든 말씀해주세요.
            </p>

            {sent ? (
              <div style={{ padding: "40px 24px", backgroundColor: "#fff", borderRadius: "20px", textAlign: "center", border: "1px solid #F2F4F7" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0D2B4E" }}>문의가 접수되었습니다!</p>
                <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "6px" }}>빠른 시일 내 답변 드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Category */}
                <div style={{ display: "flex", gap: "10px" }}>
                  {["도움 요청 문의", "협업 문의"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setContact((c) => ({ ...c, category: cat }))}
                      style={{
                        flex: 1, padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: 700,
                        cursor: "pointer", transition: "all 0.2s",
                        border: contact.category === cat ? "2px solid #5856D6" : "1px solid #F2F4F7",
                        backgroundColor: contact.category === cat ? "#F0EFFF" : "#fff",
                        color: contact.category === cat ? "#5856D6" : "#64748B",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { key: "name", placeholder: "이름" },
                    { key: "email", placeholder: "이메일" },
                  ].map(({ key, placeholder }) => (
                    <input
                      key={key}
                      type={key === "email" ? "email" : "text"}
                      placeholder={placeholder}
                      required
                      value={contact[key as "name" | "email"]}
                      onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
                      style={{
                        padding: "14px 16px", borderRadius: "12px", fontSize: "14px",
                        border: "1px solid #F2F4F7", backgroundColor: "#fff", outline: "none",
                        color: "#0D2B4E", fontFamily: inter,
                      }}
                    />
                  ))}
                </div>

                {/* Message */}
                <textarea
                  placeholder="문의 내용을 자유롭게 작성해주세요."
                  required
                  rows={5}
                  value={contact.message}
                  onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))}
                  style={{
                    padding: "14px 16px", borderRadius: "12px", fontSize: "14px",
                    border: "1px solid #F2F4F7", backgroundColor: "#fff", outline: "none",
                    color: "#0D2B4E", resize: "vertical", fontFamily: inter,
                    lineHeight: 1.6,
                  }}
                />

                <button
                  type="submit"
                  style={{
                    padding: "16px", borderRadius: "100px", border: "none",
                    backgroundColor: "#5856D6", color: "#fff",
                    fontSize: "15px", fontWeight: 700, cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4543C8"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#5856D6"; }}
                >
                  문의 보내기
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
      ═══════════════════════════════════ */}
      <footer style={{ padding: "80px 48px 60px", borderTop: "1px solid #F2F4F7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "60px" }}>
          <div>
            <p style={{ fontSize: "22px", fontWeight: 900, color: "#FF5C1A" }}>SOLT</p>
            <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "12px", lineHeight: 1.7 }}>
              크리스천 라이프스타일의 중심<br />함께 모여, 배우고, 빛나게.
            </p>
          </div>
          <div style={{ display: "flex", gap: "72px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "16px" }}>서비스</p>
              {[
                { ko: "모임", en: "Play", href: "/play" },
                { ko: "클래스", en: "Learn", href: "/learn" },
                { ko: "스토어", en: "Shop", href: "/shop" },
                { ko: "액션", en: "Action", href: "/action" },
                { ko: "인사이트", en: null, href: "/insight" },
                { ko: "SOLT Mate", en: null, href: "/play" },
              ].map((s) => (
                <Link key={s.ko} href={s.href} style={{ display: "block", fontSize: "13px", color: "#64748B", marginBottom: "10px", textDecoration: "none" }}>
                  {s.ko}{s.en && <span style={{ color: "#FF5C1A" }}> ({s.en})</span>}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "16px" }}>회사</p>
              {["이용약관", "개인정보처리방침", "문의하기"].map((s) => (
                <p key={s} style={{ fontSize: "13px", color: "#64748B", marginBottom: "10px", cursor: "pointer" }}>{s}</p>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #F2F4F7", marginTop: "48px", paddingTop: "24px" }}>
          <p style={{ fontSize: "12px", color: "#CBD5E1" }}>&copy; 2026 <span style={{ color: "#FF5C1A" }}>SOLT</span>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
