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

export default function PlayDetail() {
  const { id } = useParams();
  const post = mockPosts.find((p) => p.id === id && p.type === "play");
  const [participants, setParticipants] = useState(post?.currentParticipants ?? 0);
  const [joined, setJoined] = useState(false);
  const [calStatus, setCalStatus] = useState<CalStatus>("idle");
  const max = post?.maxParticipants ?? 0;
  const isFull = participants >= max;

  if (!post) {
    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
        <Nav />
        <div style={{ padding: "80px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#94A3B8" }}>모임을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const handleJoin = () => {
    if (joined) { setParticipants(p => p - 1); setJoined(false); }
    else if (!isFull) { setParticipants(p => p + 1); setJoined(true); }
  };

  const handleAddToCalendar = () => {
    const parsed = parseDateToEvent(post.date, post.title, post.emoji, "#FF5C1A", post.id);
    const added = calendarStore.add(
      parsed ?? { title: post.title, emoji: post.emoji, color: "#FF5C1A", dayOfWeek: 5, startHour: 10, sourceId: post.id }
    );
    setCalStatus(added ? "added" : "duplicate");
    setTimeout(() => setCalStatus("idle"), 2500);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <BackButton />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "48px" }}>{post.emoji}</span>
            <div>
              <span style={{
                display: "inline-block", backgroundColor: "#FF5C1A", color: "#fff",
                padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700,
              }}>SOLT POT</span>
              <span style={{
                display: "inline-block", marginLeft: "8px",
                backgroundColor: isFull ? "#94A3B8" : participants / max > 0.8 ? "#FFD600" : "#E8F5E8",
                color: isFull ? "#fff" : participants / max > 0.8 ? "#0D2B4E" : "#16a34a",
                padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700,
              }}>
                {isFull ? "마감" : participants / max > 0.8 ? "마감임박" : "모집중"}
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.3, marginBottom: "16px" }}>{post.title}</h1>
          <p style={{ fontSize: "16px", color: "#64748B", lineHeight: 1.7, marginBottom: "32px" }}>{post.description}</p>

          {/* Info grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
            padding: "24px", borderRadius: "16px", backgroundColor: "#F8FAFC", marginBottom: "32px",
          }}>
            {[
              { label: "📅 일시", value: post.date },
              { label: "📍 장소", value: post.location },
              { label: "👤 호스트", value: null, hostId: post.host.id, hostName: post.host.name, hostVerified: post.host.isVerified },
              { label: "🏷️ 태그", value: `#${post.tag}` },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 700, marginBottom: "4px" }}>{item.label}</p>
                <p style={{ fontSize: "15px", fontWeight: 700 }}>
                  {"hostId" in item ? (
                    <Link href={`/profile/${item.hostId}`} style={{ color: "#0D2B4E", textDecoration: "none", borderBottom: "1px solid #E2E8F0" }}>
                      {item.hostName}{item.hostVerified ? " ✓" : ""}
                    </Link>
                  ) : item.label.includes("태그") ? (
                    <span style={{ color: "#FF5C1A" }}>{item.value}</span>
                  ) : item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Participation gauge */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700 }}>참여 현황</span>
              <span style={{ fontSize: "14px", fontWeight: 900 }}>
                {participants}<span style={{ color: "#94A3B8" }}>/{max}명</span>
              </span>
            </div>
            <div style={{ height: "10px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${(participants / max) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{ height: "100%", borderRadius: "100px", backgroundColor: isFull ? "#94A3B8" : "#FF5C1A" }}
              />
            </div>
          </div>

          {/* Join button */}
          <motion.button
            whileHover={!isFull || joined ? { scale: 1.02 } : {}}
            whileTap={!isFull || joined ? { scale: 0.98 } : {}}
            onClick={handleJoin}
            disabled={isFull && !joined}
            style={{
              width: "100%", padding: "18px", borderRadius: "100px", border: "none",
              fontSize: "18px", fontWeight: 900, cursor: isFull && !joined ? "not-allowed" : "pointer",
              backgroundColor: joined ? "#0D2B4E" : isFull ? "#E2E8F0" : "#FF5C1A",
              color: isFull && !joined ? "#94A3B8" : "#fff",
              transition: "background-color 0.2s",
            }}
          >
            {joined ? "✓ 참여 중 (취소하려면 클릭)" : isFull ? "정원이 마감되었습니다" : "참여하기"}
          </motion.button>

          {/* Add to calendar */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleAddToCalendar}
            style={{
              width: "100%", padding: "16px", borderRadius: "100px", border: "none",
              marginTop: "12px",
              backgroundColor: calStatus === "added" ? "#34C759" : calStatus === "duplicate" ? "#94A3B8" : "#F8FAFC",
              color: calStatus === "idle" ? "#0D2B4E" : "#fff",
              fontSize: "15px", fontWeight: 700, cursor: "pointer", transition: "all 0.3s",
            }}
          >
            {calStatus === "added" ? "✓ 내 캘린더에 추가됐어요!" : calStatus === "duplicate" ? "이미 캘린더에 있어요" : "📅 내 캘린더에 추가하기"}
          </motion.button>

          {post.host.isVerified && (
            <p style={{ textAlign: "center", fontSize: "12px", color: "#94A3B8", marginTop: "14px" }}>
              ✓ 본인인증 완료 호스트가 운영하는 모임입니다
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
