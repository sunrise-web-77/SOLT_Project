"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { shopItems } from "@/lib/mockData";
import { cartStore } from "@/lib/cartStore";

const options: Record<string, string[]> = {
  "문구": ["기본 세트", "프리미엄 세트"],
  "소품": ["원목", "월넛"],
  "노트": ["A5", "B5"],
  "리빙": ["350ml", "500ml"],
  "액세서리": ["실버", "골드"],
  "패션": ["내추럴", "블랙"],
};

interface Review { id: string; author: string; rating: number; content: string; date: string; }

const SEED_REVIEWS: Record<string, Review[]> = {
  s1: [{ id: "r1", author: "이○○", rating: 5, content: "엽서 퀄리티가 너무 좋아요! 지인들 선물로 여러 개 샀습니다.", date: "2026.02.20" }],
  s2: [{ id: "r2", author: "박○○", rating: 5, content: "책상 위에 올려두니 매일 말씀을 묵상하게 되네요. 강추!", date: "2026.02.15" }],
  s3: [{ id: "r3", author: "김○○", rating: 5, content: "큐티가 습관이 됐어요. 노트 디자인도 너무 예쁩니다.", date: "2026.03.01" }],
  s4: [{ id: "r4", author: "최○○", rating: 4, content: "디자인 정말 세련됐고 히브리어 글귀가 인상적이에요.", date: "2026.02.25" }],
  s5: [{ id: "r5", author: "정○○", rating: 5, content: "찬양팀 선물로 샀는데 모두 좋아했어요! 재구매 예정입니다.", date: "2026.03.02" }],
  s6: [{ id: "r6", author: "한○○", rating: 5, content: "에코백인데 퀄리티가 고급스러워요. Salt & Light 문구가 마음에 쏙!", date: "2026.03.03" }],
};

const Stars = ({ rating, size = 18, interactive = false, onRate }: {
  rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void;
}) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} onClick={() => interactive && onRate?.(s)}
        style={{ fontSize: `${size}px`, cursor: interactive ? "pointer" : "default", color: s <= rating ? "#FFD600" : "#E2E8F0", transition: "color 0.1s" }}>
        ★
      </span>
    ))}
  </div>
);

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const item = shopItems.find((s) => s.id === id);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [stickyAdded, setStickyAdded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS[id] || []);
  const [draft, setDraft] = useState({ rating: 0, content: "" });

  if (!item) {
    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
        <Nav />
        <div style={{ padding: "80px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#94A3B8" }}>상품을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const itemOptions = options[item.tag] || ["기본"];

  const handleAddToCart = () => {
    if (!selectedOption) return;
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
    cartStore.add({ id: item.id, title: item.title, brand: item.brand, price: item.price, priceNum, emoji: item.emoji }, qty);
    setAdded(true);
    setStickyAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setTimeout(() => setStickyAdded(false), 2000);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <BackButton />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Product image */}
          <div style={{
            height: "360px", borderRadius: "20px", backgroundColor: "#F8FAFC",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "80px", marginBottom: "32px",
          }}>
            {item.emoji}
          </div>

          {/* Brand & title */}
          <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 700 }}>{item.brand}</span>
          <h1 style={{ fontSize: "28px", fontWeight: 900, marginTop: "4px", marginBottom: "8px" }}>
            {item.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
            <span style={{ fontSize: "24px", fontWeight: 900 }}>{item.price}</span>
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#FF5C1A",
              backgroundColor: "#FFF5F0", padding: "3px 10px", borderRadius: "100px",
            }}>
              {item.tag}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#F2F4F7", marginBottom: "32px" }} />

          {/* Option select */}
          <h3 style={{ fontSize: "15px", fontWeight: 900, marginBottom: "12px" }}>옵션 선택</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            {itemOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedOption(opt)}
                style={{
                  padding: "12px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  border: selectedOption === opt ? "2px solid #FF5C1A" : "1px solid #F2F4F7",
                  backgroundColor: selectedOption === opt ? "#FFF5F0" : "#fff",
                  color: selectedOption === opt ? "#FF5C1A" : "#0D2B4E",
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <h3 style={{ fontSize: "15px", fontWeight: 900, marginBottom: "12px" }}>수량</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{
                width: "40px", height: "40px", borderRadius: "12px", border: "1px solid #F2F4F7",
                backgroundColor: "#fff", fontSize: "18px", cursor: "pointer", fontWeight: 700,
              }}
            >
              −
            </button>
            <span style={{ fontSize: "18px", fontWeight: 900, minWidth: "32px", textAlign: "center" }}>{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              style={{
                width: "40px", height: "40px", borderRadius: "12px", border: "1px solid #F2F4F7",
                backgroundColor: "#fff", fontSize: "18px", cursor: "pointer", fontWeight: 700,
              }}
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart} disabled={!selectedOption}
            style={{
              width: "100%", padding: "18px", borderRadius: "16px", border: "none",
              fontSize: "18px", fontWeight: 900, cursor: selectedOption ? "pointer" : "not-allowed",
              backgroundColor: added ? "#0D2B4E" : selectedOption ? "#FF5C1A" : "#E2E8F0",
              color: selectedOption ? "#fff" : "#94A3B8", transition: "background-color 0.3s",
            }}
          >
            {added ? "✓ 장바구니에 담았습니다!" : selectedOption ? `장바구니 담기 (${qty}개)` : "옵션을 선택해주세요"}
          </motion.button>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#F2F4F7", margin: "40px 0 28px" }} />

          {/* Reviews */}
          {(() => {
            const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
            const handleReview = (e: React.FormEvent) => {
              e.preventDefault();
              if (draft.rating === 0 || !draft.content.trim()) return;
              setReviews((prev) => [{
                id: `r-${Date.now()}`, author: "나", rating: draft.rating,
                content: draft.content, date: new Date().toLocaleDateString("ko-KR"),
              }, ...prev]);
              setDraft({ rating: 0, content: "" });
            };
            return (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 900 }}>상품 후기</h3>
                  {avg && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Stars rating={Math.round(parseFloat(avg))} size={15} />
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#FF9500" }}>{avg}</span>
                      <span style={{ fontSize: "13px", color: "#94A3B8" }}>({reviews.length})</span>
                    </div>
                  )}
                </div>

                {/* Review form */}
                <form onSubmit={handleReview} style={{ backgroundColor: "#F8FAFC", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>별점을 선택해주세요</p>
                  <Stars rating={draft.rating} size={28} interactive onRate={(r) => setDraft((d) => ({ ...d, rating: r }))} />
                  <textarea placeholder="이 상품에 대한 솔직한 후기를 남겨주세요." rows={3} required
                    value={draft.content} onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    style={{ width: "100%", marginTop: "12px", padding: "12px 14px", borderRadius: "12px", border: "1px solid #F2F4F7", fontSize: "14px", resize: "none", outline: "none", backgroundColor: "#fff", boxSizing: "border-box", lineHeight: 1.6 }}
                  />
                  <button type="submit" disabled={draft.rating === 0}
                    style={{ marginTop: "10px", padding: "10px 24px", borderRadius: "100px", border: "none", backgroundColor: draft.rating > 0 ? "#FF5C1A" : "#E2E8F0", color: draft.rating > 0 ? "#fff" : "#94A3B8", fontSize: "13px", fontWeight: 700, cursor: draft.rating > 0 ? "pointer" : "not-allowed" }}>
                    후기 등록
                  </button>
                </form>

                {/* Review list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {reviews.length === 0 && <p style={{ fontSize: "14px", color: "#94A3B8", textAlign: "center", padding: "24px 0" }}>아직 후기가 없어요</p>}
                  {reviews.map((r) => (
                    <div key={r.id} style={{ padding: "16px 20px", borderRadius: "16px", backgroundColor: "#fff", border: "1px solid #F2F4F7" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#0D2B4E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, color: "#fff" }}>{r.author[0]}</div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 700 }}>{r.author}</p>
                            <Stars rating={r.rating} size={13} />
                          </div>
                        </div>
                        <span style={{ fontSize: "11px", color: "#CBD5E1" }}>{r.date}</span>
                      </div>
                      <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>{r.content}</p>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </motion.div>
      </div>

      {/* ── Sticky bottom CTA ─────────────────────────────────────── */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
              backgroundColor: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
              borderTop: "1px solid #F2F4F7",
              padding: "16px 24px 24px",
              display: "flex", alignItems: "center", gap: "16px",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
            }}
          >
            {/* Left: option + price summary */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 700, marginBottom: "2px" }}>
                {selectedOption ? `${selectedOption} · ${qty}개` : "옵션을 선택해주세요"}
              </p>
              <p style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.03em" }}>
                {selectedOption
                  ? `${(parseInt(item.price.replace(/[^0-9]/g, ""), 10) * qty).toLocaleString()}원`
                  : item.price}
              </p>
            </div>

            {/* Right: CTA button */}
            <motion.button
              whileHover={selectedOption ? { scale: 1.03 } : {}}
              whileTap={selectedOption ? { scale: 0.97 } : {}}
              onClick={handleAddToCart}
              disabled={!selectedOption}
              style={{
                padding: "16px 28px", borderRadius: "100px", border: "none",
                fontSize: "15px", fontWeight: 900, letterSpacing: "-0.01em",
                cursor: selectedOption ? "pointer" : "not-allowed",
                backgroundColor: stickyAdded ? "#0D2B4E" : selectedOption ? "#FF5C1A" : "#E2E8F0",
                color: selectedOption ? "#fff" : "#94A3B8",
                transition: "background-color 0.3s",
                whiteSpace: "nowrap",
                boxShadow: selectedOption ? "0 4px 16px rgba(255,92,26,0.3)" : "none",
              }}
            >
              {stickyAdded ? "✓ 담았습니다!" : selectedOption ? "장바구니 담기" : "옵션 선택 필요"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
