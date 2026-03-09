"use client";

import { useState, useSyncExternalStore, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cartStore } from "@/lib/cartStore";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartSidebar";

const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useSyncExternalStore(cartStore.subscribe, cartStore.getCount, cartStore.getCount);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const links = [
    { href: "/", label: "홈", match: "/" },
    { href: "/play", label: "모임 찾기", match: "/play" },
    { href: "/learn", label: "클래스", match: "/learn" },
    { href: "/shop", label: "스토어", match: "/shop" },
    { href: "/action", label: "액션", match: "/action" },
    { href: "/insight", label: "인사이트", match: "/insight" },
  ];

  const isActive = (match: string) =>
    match === "/" ? pathname === "/" : pathname.startsWith(match);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  return (
    <>
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 48px", borderBottom: "1px solid #F2F4F7",
        position: "sticky", top: 0, backgroundColor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)", zIndex: 100,
      }}>
        {/* Left: Logo + Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.03em", textDecoration: "none", color: "#FF5C1A" }}>
            SOLT
          </Link>
          <span style={{
            fontSize: "9px", fontWeight: 700, color: "#0D2B4E", letterSpacing: "0.08em",
            padding: "4px 10px", borderRadius: "100px",
            backgroundColor: "#F8FAFC", border: "1px solid #F2F4F7",
          }}>
            CHRISTIAN LIFESTYLE PLATFORM
          </span>
        </div>

        {/* Center: Links */}
        <div style={{ display: "flex", gap: "32px", fontWeight: 600, fontSize: "14px" }}>
          {links.map((link) => (
            <Link key={link.label} href={link.href}
              style={{
                textDecoration: "none", transition: "color 0.2s",
                color: isActive(link.match) ? "#0D2B4E" : "#CBD5E1",
              }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Search + Cart + Auth + My Page */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.form key="search-form" onSubmit={handleSearch}
                initial={{ opacity: 0, width: 40 }} animate={{ opacity: 1, width: 220 }} exit={{ opacity: 0, width: 40 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "2px solid #0D2B4E", paddingBottom: "2px", overflow: "hidden" }}
              >
                <Search size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="모임, 클래스, 상품 검색..."
                  style={{ flex: 1, border: "none", outline: "none", fontSize: "13px", background: "none", color: "#0D2B4E", minWidth: 0 }}
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}>
                  <X size={15} color="#94A3B8" />
                </button>
              </motion.form>
            ) : (
              <motion.button key="search-btn" onClick={() => setSearchOpen(true)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
                <Search size={18} color="#94A3B8" />
              </motion.button>
            )}
          </AnimatePresence>
          {/* CART_BUTTON_START (임시 비활성화)
          <button
            onClick={() => setCartOpen(true)}
            style={{
              position: "relative", background: "none", border: "none",
              cursor: "pointer", fontSize: "14px", fontWeight: 600,
              color: cartCount > 0 ? "#0D2B4E" : "#CBD5E1",
              padding: "4px 0", display: "flex", alignItems: "center", gap: "4px",
            }}
          >
            Cart
            {cartCount > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "18px", height: "18px", borderRadius: "50%",
                backgroundColor: "#FF5C1A", color: "#fff",
                fontSize: "10px", fontWeight: 900,
              }}>
                {cartCount}
              </span>
            )}
          </button>
          CART_BUTTON_END */}
          <button
            onClick={() => setAuthModal("login")}
            style={{
              fontSize: "13px", fontWeight: 600, color: "#0D2B4E",
              background: "none", border: "1px solid #E2E8F0",
              padding: "8px 20px", borderRadius: "100px", cursor: "pointer",
              transition: "border-color 0.2s",
            }}
          >
            로그인
          </button>
          <button
            onClick={() => setAuthModal("signup")}
            style={{
              fontSize: "13px", fontWeight: 700, color: "#fff",
              backgroundColor: "#FF5C1A", border: "none",
              padding: "8px 20px", borderRadius: "100px", cursor: "pointer",
            }}
          >
            회원가입
          </button>
          <Link href="/profile" style={{
            fontSize: "13px", fontWeight: 600, color: "#94A3B8", textDecoration: "none",
            transition: "color 0.2s",
          }}>
            My Page
          </Link>
        </div>
      </nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {authModal && (
          <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Nav;
