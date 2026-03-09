"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";

interface CalendarEvent {
  id: string;
  title: string;
  startHour: number;
  dayOfWeek: number; // 0=Mon … 6=Sun
  color: string;
  emoji: string;
  link?: string;
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8 – 22
const PALETTE = ["#FF5C1A", "#34C759", "#007AFF", "#5856D6", "#FF2D55", "#FF9500", "#FFD600", "#5AC8FA"];

const SEED_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "풋살 팟", startHour: 10, dayOfWeek: 5, color: "#FF5C1A", emoji: "⚽", link: "/play/1" },
  { id: "e2", title: "기독교 상담학", startHour: 19, dayOfWeek: 1, color: "#34C759", emoji: "📖", link: "/learn/2" },
  { id: "e3", title: "성수 독서 모임", startHour: 15, dayOfWeek: 6, color: "#FF9500", emoji: "📚", link: "/play/3" },
  { id: "e4", title: "한강 러닝", startHour: 19, dayOfWeek: 2, color: "#007AFF", emoji: "🏃", link: "/play/5" },
  { id: "e5", title: "NIV 영어 성경", startHour: 20, dayOfWeek: 3, color: "#5856D6", emoji: "🌏", link: "/learn/8" },
  { id: "e6", title: "분당 찬양 모임", startHour: 20, dayOfWeek: 2, color: "#FF2D55", emoji: "🎵", link: "/play/9" },
  { id: "e7", title: "보드게임 친교", startHour: 13, dayOfWeek: 6, color: "#5AC8FA", emoji: "🎲", link: "/play/7" },
  { id: "e8", title: "새벽 QT", startHour: 8, dayOfWeek: 0, color: "#FFD600", emoji: "🌅" },
  { id: "e9", title: "새벽 QT", startHour: 8, dayOfWeek: 2, color: "#FFD600", emoji: "🌅" },
  { id: "e10", title: "새벽 QT", startHour: 8, dayOfWeek: 4, color: "#FFD600", emoji: "🌅" },
  { id: "e11", title: "재정 세미나", startHour: 10, dayOfWeek: 5, color: "#5856D6", emoji: "💰", link: "/learn/6" },
];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CalendarPage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date(2026, 2, 6)));
  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS);
  const [addModal, setAddModal] = useState<{ day: number; hour: number } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#FF5C1A");

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

  const getEventsAt = (day: number, hour: number) =>
    events.filter(e => e.dayOfWeek === day && e.startHour === hour);

  const handleAdd = () => {
    if (!newTitle.trim() || !addModal) return;
    setEvents(prev => [...prev, {
      id: `u-${Date.now()}`, title: newTitle.trim(),
      startHour: addModal.hour, dayOfWeek: addModal.day,
      color: newColor, emoji: "📌",
    }]);
    setNewTitle("");
    setAddModal(null);
  };

  const today = new Date(2026, 2, 6);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px 80px" }}>
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.1em" }}>SOCIAL CALENDAR</span>
              <h1 style={{ fontSize: "32px", fontWeight: 900, marginTop: "4px" }}>나의 소셜 캘린더</h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>빈 칸을 클릭해 일정을 추가하세요</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button onClick={() => goWeek(-1)} style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: "1px solid #F2F4F7", background: "#fff", fontSize: "18px", cursor: "pointer", fontWeight: 700,
              }}>‹</button>
              <span style={{ fontSize: "15px", fontWeight: 700, minWidth: "130px", textAlign: "center" }}>
                {weekStart.getFullYear()}년 {weekStart.getMonth() + 1}월
              </span>
              <button onClick={() => goWeek(1)} style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: "1px solid #F2F4F7", background: "#fff", fontSize: "18px", cursor: "pointer", fontWeight: 700,
              }}>›</button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #F2F4F7" }}>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)", backgroundColor: "#F8FAFC" }}>
              <div style={{ borderRight: "1px solid #F2F4F7" }} />
              {weekDays.map((d, i) => {
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <div key={i} style={{
                    padding: "14px 0", textAlign: "center",
                    borderRight: i < 6 ? "1px solid #F2F4F7" : "none",
                  }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: i >= 5 ? "#FF5C1A" : "#94A3B8", marginBottom: "6px" }}>
                      {DAYS[i]}
                    </p>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%", margin: "0 auto",
                      backgroundColor: isToday ? "#FF5C1A" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: isToday ? "#fff" : "#0D2B4E" }}>
                        {d.getDate()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time rows */}
            <div style={{ maxHeight: "580px", overflowY: "auto" }}>
              {HOURS.map(hour => (
                <div key={hour} style={{
                  display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)",
                  borderTop: "1px solid #F2F4F7", minHeight: "60px",
                }}>
                  <div style={{
                    padding: "8px 10px 0", fontSize: "11px", fontWeight: 600, color: "#CBD5E1",
                    borderRight: "1px solid #F2F4F7", textAlign: "right", alignSelf: "flex-start",
                  }}>
                    {String(hour).padStart(2, "0")}:00
                  </div>
                  {[0, 1, 2, 3, 4, 5, 6].map(day => {
                    const cellEvents = getEventsAt(day, hour);
                    return (
                      <div key={day}
                        onClick={() => cellEvents.length === 0 && setAddModal({ day, hour })}
                        style={{
                          borderRight: day < 6 ? "1px solid #F2F4F7" : "none",
                          padding: "4px 4px",
                          cursor: cellEvents.length === 0 ? "pointer" : "default",
                          minHeight: "60px",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={e => {
                          if (cellEvents.length === 0)
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F8FAFC";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                        }}
                      >
                        {cellEvents.map(ev =>
                          ev.link ? (
                            <Link key={ev.id} href={ev.link} style={{ textDecoration: "none" }}
                              onClick={e => e.stopPropagation()}>
                              <div style={{
                                backgroundColor: ev.color + "18",
                                borderLeft: `3px solid ${ev.color}`,
                                borderRadius: "6px", padding: "4px 6px", marginBottom: "2px",
                              }}>
                                <p style={{
                                  fontSize: "11px", fontWeight: 700, color: ev.color,
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                }}>
                                  {ev.emoji} {ev.title}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <div key={ev.id} style={{
                              backgroundColor: ev.color + "18",
                              borderLeft: `3px solid ${ev.color}`,
                              borderRadius: "6px", padding: "4px 6px", marginBottom: "2px",
                            }}>
                              <p style={{
                                fontSize: "11px", fontWeight: 700, color: ev.color,
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              }}>
                                {ev.emoji} {ev.title}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px", alignItems: "center" }}>
            {[
              { color: "#FF5C1A", label: "모임" },
              { color: "#34C759", label: "클래스" },
              { color: "#FFD600", label: "개인 일정" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: item.color }} />
                <span style={{ fontSize: "12px", color: "#64748B" }}>{item.label}</span>
              </div>
            ))}
            <span style={{ fontSize: "12px", color: "#CBD5E1" }}>· 빈 칸 클릭으로 일정 추가</span>
          </div>
        </motion.div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {addModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAddModal(null)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 200 }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: "fixed", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff", borderRadius: "24px",
                padding: "32px", width: "360px", zIndex: 201,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "4px" }}>일정 추가</h3>
              <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "20px" }}>
                {DAYS[addModal.day]}요일 {String(addModal.hour).padStart(2, "0")}:00
              </p>
              <input
                autoFocus
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="일정 제목을 입력하세요"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid #F2F4F7", fontSize: "14px", outline: "none",
                  boxSizing: "border-box", marginBottom: "16px",
                }}
              />
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", marginBottom: "10px" }}>색상</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                {PALETTE.map(c => (
                  <button key={c} onClick={() => setNewColor(c)} style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    border: c === newColor ? "3px solid #0D2B4E" : "2px solid transparent",
                    backgroundColor: c, cursor: "pointer", padding: 0,
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setAddModal(null)} style={{
                  flex: 1, padding: "13px", borderRadius: "12px", border: "1px solid #F2F4F7",
                  background: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", color: "#64748B",
                }}>
                  취소
                </button>
                <button onClick={handleAdd} style={{
                  flex: 1, padding: "13px", borderRadius: "12px", border: "none",
                  backgroundColor: "#0D2B4E", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                }}>
                  추가
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
