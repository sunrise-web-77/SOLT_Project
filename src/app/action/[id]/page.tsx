"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { actionItems } from "@/lib/mockData";
import { calendarStore } from "@/lib/calendarStore";

type CalStatus = "idle" | "added" | "duplicate";

const donationAmounts = [5000, 10000, 30000, 50000, 100000];

export default function ActionDetail() {
  const { id } = useParams();
  const item = actionItems.find((a) => a.id === id);
  const [current, setCurrent] = useState(item?.currentAmount ?? 0);
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [donated, setDonated] = useState(false);
  const [calStatus, setCalStatus] = useState<CalStatus>("idle");

  if (!item) {
    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
        <Nav />
        <div style={{ padding: "80px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#94A3B8" }}>캠페인을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const pct = Math.min(Math.round((current / item.goalAmount) * 100), 100);
  const formatNum = (n: number) => n >= 10000 ? `${(n / 10000).toFixed(0)}만` : n.toLocaleString();

  const handleAddToCalendar = () => {
    if (!item) return;
    const added = calendarStore.add({
      title: item.title, emoji: "🙏", color: "#FF5C1A",
      dayOfWeek: 6, startHour: 10, sourceId: `action-${item.id}`,
    });
    setCalStatus(added ? "added" : "duplicate");
    setTimeout(() => setCalStatus("idle"), 2500);
  };

  const handleDonate = () => {
    if (!selectedAmount) return;
    setCurrent((c) => Math.min(c + selectedAmount, item.goalAmount));
    setDonated(true);
    setTimeout(() => {
      setShowModal(false);
      setDonated(false);
      setSelectedAmount(null);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <BackButton />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* D-day badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{
              backgroundColor: "#FFF5F0", color: "#FF5C1A", padding: "6px 14px",
              borderRadius: "100px", fontSize: "13px", fontWeight: 900,
            }}>
              {item.dday}
            </span>
            <span style={{ fontSize: "32px", fontWeight: 900, color: "#FF5C1A" }}>{pct}%</span>
          </div>

          <h1 style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.3, marginBottom: "12px" }}>
            {item.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#64748B", lineHeight: 1.7, marginBottom: "40px" }}>
            {item.description}
          </p>

          {/* Gauge */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ height: "14px", borderRadius: "100px", backgroundColor: "#F2F4F7", overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8 }}
                style={{ height: "100%", borderRadius: "100px", backgroundColor: "#FF5C1A" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", marginBottom: "40px" }}>
            <span style={{ fontWeight: 900 }}>{formatNum(current)}{item.unit}</span>
            <span style={{ color: "#94A3B8" }}>목표 {formatNum(item.goalAmount)}{item.unit}</span>
          </div>

          {/* Donate button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            style={{
              width: "100%", padding: "18px", borderRadius: "16px", border: "none",
              fontSize: "18px", fontWeight: 900, cursor: "pointer",
              backgroundColor: "#FF5C1A", color: "#fff",
            }}
          >
            후원하기
          </motion.button>

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

          <p style={{ textAlign: "center", fontSize: "12px", color: "#94A3B8", marginTop: "12px" }}>
            모든 후원 내역은 투명하게 공개됩니다
          </p>
        </motion.div>
      </div>

      {/* ── Donation Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200,
            }}
            onClick={() => { setShowModal(false); setSelectedAmount(null); }}
          >
            <motion.div
              initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff", borderRadius: "24px 24px 0 0", padding: "32px 24px 40px",
                width: "100%", maxWidth: "720px",
              }}
            >
              {donated ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ fontSize: "48px", marginBottom: "16px" }}>🙏</p>
                  <p style={{ fontSize: "22px", fontWeight: 900 }}>감사합니다!</p>
                  <p style={{ fontSize: "15px", color: "#64748B", marginTop: "8px" }}>
                    {selectedAmount?.toLocaleString()}원이 후원되었습니다
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "24px" }}>후원 금액 선택</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "24px" }}>
                    {donationAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setSelectedAmount(amt)}
                        style={{
                          padding: "16px", borderRadius: "12px", fontSize: "15px", fontWeight: 700,
                          cursor: "pointer", transition: "all 0.2s",
                          border: selectedAmount === amt ? "2px solid #FF5C1A" : "1px solid #F2F4F7",
                          backgroundColor: selectedAmount === amt ? "#FFF5F0" : "#fff",
                          color: selectedAmount === amt ? "#FF5C1A" : "#0D2B4E",
                        }}
                      >
                        {amt.toLocaleString()}원
                      </button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={selectedAmount ? { scale: 1.02 } : {}}
                    onClick={handleDonate}
                    disabled={!selectedAmount}
                    style={{
                      width: "100%", padding: "18px", borderRadius: "16px", border: "none",
                      fontSize: "18px", fontWeight: 900,
                      cursor: selectedAmount ? "pointer" : "not-allowed",
                      backgroundColor: selectedAmount ? "#FF5C1A" : "#E2E8F0",
                      color: selectedAmount ? "#fff" : "#94A3B8",
                    }}
                  >
                    {selectedAmount ? `${selectedAmount.toLocaleString()}원 후원하기` : "금액을 선택해주세요"}
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
