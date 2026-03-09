"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { mockPosts } from "@/lib/mockData";

const TAG_GRADIENTS: Record<string, string> = {
  "자녀양육":    "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
  "기독교세계관": "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
  "글로벌인재":  "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
  "대안학교":   "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
  "찬양":      "linear-gradient(135deg, #F9CA24 0%, #F0932B 100%)",
  "재정":      "linear-gradient(135deg, #30336B 0%, #4A4DBF 100%)",
  "영어":      "linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)",
  "클래스":    "linear-gradient(135deg, #FD79A8 0%, #E84393 100%)",
};
const DEFAULT_GRADIENT = "linear-gradient(135deg, #0D2B4E 0%, #34A5FF 100%)";

const TAG_COLORS: Record<string, string> = {
  "자녀양육": "#FF9A9E", "기독교세계관": "#667EEA", "글로벌인재": "#43E97B",
  "대안학교": "#4FACFE", "찬양": "#F0932B", "재정": "#4A4DBF", "영어": "#A29BFE",
  "클래스": "#E84393",
};

const FEATURED_TAGS = ["자녀양육", "기독교세계관", "글로벌인재", "대안학교"];
const ALL_TABS = ["전체", "추천", ...FEATURED_TAGS, "찬양", "재정", "영어", "클래스"];

export default function LearnList() {
  const posts = mockPosts.filter((p) => p.type === "learn");
  const [activeTab, setActiveTab] = useState("전체");

  const filtered =
    activeTab === "전체" ? posts :
    activeTab === "추천" ? posts.filter((p) => FEATURED_TAGS.includes(p.tag)) :
    posts.filter((p) => p.tag === activeTab);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px 80px" }}>
        <BackButton />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 900, color: "#34C759", letterSpacing: "0.1em" }}>CLASS</span>
          <h1 style={{ fontSize: "36px", fontWeight: 900, marginTop: "4px", marginBottom: "8px", letterSpacing: "-0.03em" }}>클래스</h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "32px" }}>
            신앙과 실력을 함께 키우는 전문 크리스천 클래스
          </p>

          {/* Featured Banner */}
          <div style={{
            borderRadius: "24px", padding: "32px 40px", marginBottom: "36px",
            background: "linear-gradient(135deg, #0D2B4E 0%, #1A4A7A 100%)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.12em" }}>FEATURED</span>
              <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#fff", marginTop: "6px", marginBottom: "8px" }}>
                기독교 교육 전문 과정 4종 오픈
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                자녀양육 · 세계관 · 글로벌인재 · 대안학교 — 체계적인 신앙 교육을 시작하세요
              </p>
            </div>
            <button
              onClick={() => setActiveTab("추천")}
              style={{
                padding: "12px 28px", borderRadius: "100px",
                backgroundColor: "#FF5C1A", color: "#fff", border: "none",
                fontSize: "14px", fontWeight: 700, cursor: "pointer", flexShrink: 0,
              }}
            >
              추천 보기 →
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
            {ALL_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  border: activeTab === tab ? "2px solid #34C759" : "1px solid #F2F4F7",
                  backgroundColor: activeTab === tab ? "#E8F9EE" : "#fff",
                  color: activeTab === tab ? "#34C759" : "#64748B",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Card Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {filtered.map((post, i) => {
            const gradient = TAG_GRADIENTS[post.tag] || DEFAULT_GRADIENT;
            const accentColor = TAG_COLORS[post.tag] || "#34C759";
            const isFeatured = FEATURED_TAGS.includes(post.tag);
            const pct = Math.round((post.currentParticipants / post.maxParticipants) * 100);

            return (
              <Link key={post.id} href={`/learn/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }} whileHover={{ y: -8 }}
                  style={{
                    borderRadius: "20px", overflow: "hidden", backgroundColor: "#fff",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid #F2F4F7",
                    cursor: "pointer", transition: "box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
                >
                  {/* Card Header */}
                  <div style={{ height: "180px", background: gradient, display: "flex", alignItems: "flex-end", padding: "20px 24px", position: "relative" }}>
                    {isFeatured && (
                      <span style={{
                        position: "absolute", top: "16px", right: "16px",
                        fontSize: "10px", fontWeight: 900, color: "#fff",
                        backgroundColor: "rgba(255,255,255,0.25)", padding: "4px 10px", borderRadius: "100px",
                        backdropFilter: "blur(8px)",
                      }}>
                        ★ 전문 과정
                      </span>
                    )}
                    <span style={{ fontSize: "52px", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>
                      {post.emoji}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 700, color: accentColor,
                        backgroundColor: `${accentColor}20`, padding: "3px 10px", borderRadius: "100px",
                      }}>
                        {post.tag}
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: 700,
                        color: post.status === "마감임박" ? "#FF9500" : post.status === "마감" ? "#94A3B8" : "#34C759",
                      }}>
                        {post.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.4, color: "#0D2B4E", marginBottom: "8px" }}>
                      {post.title}
                    </h4>
                    <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.5, marginBottom: "14px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {post.description}
                    </p>

                    {/* Instructor */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#0D2B4E",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 900, color: "#fff", flexShrink: 0,
                      }}>
                        {post.host.name[0]}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#0D2B4E" }}>{post.host.name}</span>
                      {post.host.isVerified && <span style={{ fontSize: "11px", color: "#34C759", fontWeight: 700 }}>✓ 인증</span>}
                    </div>

                    {/* Progress */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>
                        <span>📅 {post.date}</span>
                        <span style={{ fontWeight: 700 }}>{post.currentParticipants}/{post.maxParticipants}명 ({pct}%)</span>
                      </div>
                      <div style={{ height: "4px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "100px", backgroundColor: accentColor, width: `${pct}%`, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
