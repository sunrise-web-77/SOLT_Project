"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { mockPosts, shopItems, bannerItems } from "@/lib/mockData";

type Tab = "전체" | "모임" | "클래스" | "스토어" | "인사이트";
const TABS: Tab[] = ["전체", "모임", "클래스", "스토어", "인사이트"];

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 900 }}>{title}</h2>
        <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 700 }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function SearchContent() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [tab, setTab] = useState<Tab>("전체");
  const lower = q.toLowerCase();

  const plays = useMemo(() =>
    q ? mockPosts.filter(p => p.type === "play" && (
      p.title.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower) ||
      p.tag.toLowerCase().includes(lower) || p.location.toLowerCase().includes(lower)
    )) : [], [q, lower]);

  const learns = useMemo(() =>
    q ? mockPosts.filter(p => p.type === "learn" && (
      p.title.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower) || p.tag.toLowerCase().includes(lower)
    )) : [], [q, lower]);

  const shops = useMemo(() =>
    q ? shopItems.filter(s =>
      s.title.toLowerCase().includes(lower) || s.brand.toLowerCase().includes(lower) || s.tag.toLowerCase().includes(lower)
    ) : [], [q, lower]);

  const insights = useMemo(() =>
    q ? bannerItems.filter(b =>
      b.title.toLowerCase().includes(lower) || b.subtitle.toLowerCase().includes(lower)
    ) : [], [q, lower]);

  const total = plays.length + learns.length + shops.length + insights.length;
  const showPlays = tab === "전체" || tab === "모임";
  const showLearns = tab === "전체" || tab === "클래스";
  const showShops = tab === "전체" || tab === "스토어";
  const showInsights = tab === "전체" || tab === "인사이트";

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 40px 80px" }}>
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "4px" }}>
            "<span style={{ color: "#FF5C1A" }}>{q}</span>" 검색 결과
          </h1>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "32px" }}>총 {total}개의 결과</p>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #F2F4F7", marginBottom: "36px" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding: "12px 20px", background: "none", border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: tab === t ? 900 : 600,
                  color: tab === t ? "#0D2B4E" : "#94A3B8",
                  borderBottom: tab === t ? "3px solid #0D2B4E" : "3px solid transparent",
                  transition: "all 0.2s",
                }}>
                {t}
              </button>
            ))}
          </div>

          {total === 0 && q && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p style={{ fontSize: "16px", fontWeight: 700 }}>검색 결과가 없습니다</p>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>다른 키워드로 검색해보세요</p>
            </div>
          )}

          {/* Plays */}
          {showPlays && plays.length > 0 && (
            <Section title="모임" count={plays.length}>
              {plays.map((p, i) => (
                <Link key={p.id} href={`/play/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }}
                    style={{
                      padding: "20px 24px", borderRadius: "16px", border: "1px solid #F2F4F7",
                      backgroundColor: "#fff", marginBottom: "10px", cursor: "pointer",
                      display: "flex", gap: "16px", alignItems: "center",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                  >
                    <div style={{ fontSize: "32px", flexShrink: 0 }}>{p.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF5C1A", backgroundColor: "#FFF5F0", padding: "2px 8px", borderRadius: "100px" }}>{p.tag}</span>
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>{p.status}</span>
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "3px" }}>{p.title}</p>
                      <p style={{ fontSize: "13px", color: "#64748B" }}>{p.date} · {p.location}</p>
                    </div>
                    <p style={{ fontSize: "12px", color: "#94A3B8", flexShrink: 0 }}>{p.currentParticipants}/{p.maxParticipants}명</p>
                  </motion.div>
                </Link>
              ))}
            </Section>
          )}

          {/* Learns */}
          {showLearns && learns.length > 0 && (
            <Section title="클래스" count={learns.length}>
              {learns.map((p, i) => (
                <Link key={p.id} href={`/learn/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }}
                    style={{
                      padding: "20px 24px", borderRadius: "16px", border: "1px solid #F2F4F7",
                      backgroundColor: "#fff", marginBottom: "10px", cursor: "pointer",
                      display: "flex", gap: "16px", alignItems: "center",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                  >
                    <div style={{ fontSize: "32px", flexShrink: 0 }}>{p.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#34C759", backgroundColor: "#E8F9EE", padding: "2px 8px", borderRadius: "100px" }}>{p.tag}</span>
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>{p.status}</span>
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "3px" }}>{p.title}</p>
                      <p style={{ fontSize: "13px", color: "#64748B" }}>{p.host.name} · {p.date}</p>
                    </div>
                    <p style={{ fontSize: "12px", color: "#94A3B8", flexShrink: 0 }}>{p.currentParticipants}/{p.maxParticipants}명</p>
                  </motion.div>
                </Link>
              ))}
            </Section>
          )}

          {/* Shop */}
          {showShops && shops.length > 0 && (
            <Section title="스토어" count={shops.length}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                {shops.map((s, i) => (
                  <Link key={s.id} href={`/shop/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }} whileHover={{ y: -4 }}
                      style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #F2F4F7", cursor: "pointer" }}
                    >
                      <div style={{ height: "140px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                        {s.emoji}
                      </div>
                      <div style={{ padding: "12px 16px 16px" }}>
                        <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 700 }}>{s.brand}</p>
                        <p style={{ fontSize: "14px", fontWeight: 700, marginTop: "4px", lineHeight: 1.4 }}>{s.title}</p>
                        <p style={{ fontSize: "15px", fontWeight: 900, marginTop: "8px" }}>{s.price}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {/* Insights */}
          {showInsights && insights.length > 0 && (
            <Section title="인사이트" count={insights.length}>
              {insights.map((b, i) => (
                <Link key={b.id} href={`/insight/${b.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }}
                    style={{
                      padding: "20px 24px", borderRadius: "16px", border: "1px solid #F2F4F7",
                      backgroundColor: "#fff", marginBottom: "10px", cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                  >
                    <span style={{
                      fontSize: "11px", fontWeight: 700, color: b.accent,
                      backgroundColor: b.accent + "22", padding: "3px 10px", borderRadius: "100px",
                    }}>
                      {b.label}
                    </span>
                    <p style={{ fontSize: "15px", fontWeight: 700, marginTop: "8px", whiteSpace: "pre-line" }}>{b.title}</p>
                    <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>{b.subtitle}</p>
                  </motion.div>
                </Link>
              ))}
            </Section>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#fff", minHeight: "100vh" }} />}>
      <SearchContent />
    </Suspense>
  );
}
