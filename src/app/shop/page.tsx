"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { shopItems } from "@/lib/mockData";
import { cartStore } from "@/lib/cartStore";

const BRANDS = ["전체", "SOLT Original", "Grace Letter", "Olive Craft", "Shalom Studio", "Worship Goods"];
const TAGS = ["전체", "문구", "소품", "노트", "리빙", "액세서리", "패션"];

const SORT_OPTIONS = ["추천순", "낮은 가격순", "높은 가격순"];

function FilterChip({ label, active, accent = "#0D2B4E", onClick }: {
  label: string; active: boolean; accent?: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700,
      cursor: "pointer", transition: "all 0.2s", border: "none",
      backgroundColor: active ? accent : "#F8FAFC",
      color: active ? "#fff" : "#64748B",
    }}>
      {label}
    </button>
  );
}

export default function ShopList() {
  const [activeBrand, setActiveBrand] = useState("전체");
  const [activeTag, setActiveTag] = useState("전체");
  const [sortBy, setSortBy] = useState("추천순");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [cartToast, setCartToast] = useState("");

  const filtered = shopItems
    .filter((item) => {
      const brandOk = activeBrand === "전체" || item.brand === activeBrand;
      const tagOk = activeTag === "전체" || item.tag === activeTag;
      return brandOk && tagOk;
    })
    .sort((a, b) => {
      const pa = parseInt(a.price.replace(/[^0-9]/g, ""), 10);
      const pb = parseInt(b.price.replace(/[^0-9]/g, ""), 10);
      if (sortBy === "낮은 가격순") return pa - pb;
      if (sortBy === "높은 가격순") return pb - pa;
      return 0;
    });

  const handleQuickAdd = (e: React.MouseEvent, item: typeof shopItems[0]) => {
    e.preventDefault();
    e.stopPropagation();
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
    cartStore.add({ id: item.id, title: item.title, brand: item.brand, price: item.price, priceNum, emoji: item.emoji });
    setAddedIds((prev) => new Set(prev).add(item.id));
    setCartToast(`✓ '${item.title}' 장바구니에 담았어요`);
    setTimeout(() => setCartToast(""), 2500);
    setTimeout(() => setAddedIds((prev) => { const next = new Set(prev); next.delete(item.id); return next; }), 2000);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <Nav />

      {/* Cart toast */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed", bottom: "88px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#0D2B4E", color: "#fff", padding: "12px 24px",
              borderRadius: "100px", fontSize: "13px", fontWeight: 700, zIndex: 9998,
              whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {cartToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px 80px" }}>
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={{ fontSize: "11px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.15em" }}>SOLT SHOP</span>
          <h1 style={{ fontSize: "36px", fontWeight: 900, marginTop: "6px", marginBottom: "8px", letterSpacing: "-0.03em" }}>셀렉트 스토어</h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "36px" }}>감각적인 크리스천 라이프스타일 굿즈</p>
        </motion.div>

        {/* Filters */}
        <div style={{ backgroundColor: "#F8FAFC", borderRadius: "20px", padding: "24px 28px", marginBottom: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 900, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "10px" }}>브랜드</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {BRANDS.map((brand) => (
                <FilterChip key={brand} label={brand} active={activeBrand === brand}
                  accent="#0D2B4E" onClick={() => setActiveBrand(brand)} />
              ))}
            </div>
          </div>
          <div style={{ height: "1px", backgroundColor: "#EAECF0", margin: "16px 0" }} />
          <div>
            <p style={{ fontSize: "10px", fontWeight: 900, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "10px" }}>카테고리</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {TAGS.map((tag) => (
                <FilterChip key={tag} label={tag} active={activeTag === tag}
                  accent="#FF5C1A" onClick={() => setActiveTag(tag)} />
              ))}
            </div>
          </div>
        </div>

        {/* Results bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: "#64748B", fontWeight: 600 }}>
            <span style={{ color: "#0D2B4E", fontWeight: 900 }}>{filtered.length}</span>개 상품
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            {SORT_OPTIONS.map((opt) => (
              <button key={opt} onClick={() => setSortBy(opt)} style={{
                padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700,
                cursor: "pointer", border: "none", transition: "all 0.15s",
                backgroundColor: sortBy === opt ? "#0D2B4E" : "#F8FAFC",
                color: sortBy === opt ? "#fff" : "#94A3B8",
              }}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛍️</div>
            <p style={{ fontSize: "16px", fontWeight: 700 }}>해당 조건의 상품이 없습니다</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>다른 필터를 선택해보세요</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {filtered.map((item, i) => (
              <Link key={item.id} href={`/shop/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }} whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredId(item.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
                  style={{
                    borderRadius: "24px", overflow: "hidden", backgroundColor: "#fff",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid #F2F4F7",
                    cursor: "pointer", transition: "box-shadow 0.3s", position: "relative",
                  }}
                >
                  {/* Product image */}
                  <div style={{
                    height: "220px", backgroundColor: "#F8FAFC", position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px",
                  }}>
                    <motion.span
                      animate={hoveredId === item.id ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {item.emoji}
                    </motion.span>

                    {/* Quick-add button */}
                    <AnimatePresence>
                      {hoveredId === item.id && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 4 }}
                          onClick={(e) => handleQuickAdd(e, item)}
                          style={{
                            position: "absolute", bottom: "12px", right: "12px",
                            padding: "8px 16px", borderRadius: "100px",
                            backgroundColor: addedIds.has(item.id) ? "#0D2B4E" : "#FF5C1A",
                            color: "#fff", fontSize: "12px", fontWeight: 900,
                            border: "none", cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(255,92,26,0.3)",
                          }}
                        >
                          {addedIds.has(item.id) ? "✓ 담음" : "+ 담기"}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <div style={{ padding: "16px 20px 20px" }}>
                    <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 700, letterSpacing: "0.04em" }}>{item.brand}</p>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, marginTop: "4px", lineHeight: 1.4, letterSpacing: "-0.01em" }}>{item.title}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                      <span style={{ fontSize: "17px", fontWeight: 900, letterSpacing: "-0.02em" }}>{item.price}</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#FF5C1A", backgroundColor: "#FFF5F0", padding: "3px 10px", borderRadius: "100px" }}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
