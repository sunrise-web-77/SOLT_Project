"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cartStore } from "@/lib/cartStore";
import { orderStore, ShippingInfo } from "@/lib/orderStore";

type Step = "cart" | "checkout" | "done";

const PAYMENT_METHODS = [
  { id: "card", label: "카드 결제", icon: "💳", desc: "신용·체크카드" },
  { id: "transfer", label: "계좌 이체", icon: "🏦", desc: "실시간 계좌이체" },
  { id: "toss", label: "토스페이", icon: "🔵", desc: "토스 간편결제" },
  { id: "kakao", label: "카카오페이", icon: "🟡", desc: "카카오 간편결제" },
];

const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 50000;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: Props) {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getItems, cartStore.getItems);
  const subtotal = useSyncExternalStore(cartStore.subscribe, cartStore.getTotal, cartStore.getTotal);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const [step, setStep] = useState<Step>("cart");
  const [payMethod, setPayMethod] = useState("card");
  const [info, setInfo] = useState<ShippingInfo>({
    name: "", phone: "", zipCode: "", address: "", detail: "",
  });
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const [toast, setToast] = useState(false);

  // Reset step when cart opens
  useEffect(() => {
    if (open) setStep("cart");
  }, [open]);

  // Clear done state after close animation
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStep("cart"), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  const validate = () => {
    const e: Partial<ShippingInfo> = {};
    if (!info.name.trim()) e.name = "이름을 입력해주세요";
    if (!info.phone.trim()) e.phone = "연락처를 입력해주세요";
    if (!info.address.trim()) e.address = "주소를 입력해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    orderStore.place({
      items: [...items],
      subtotal, shipping, total,
      shippingInfo: { ...info },
      paymentMethod: PAYMENT_METHODS.find(p => p.id === payMethod)?.label ?? payMethod,
    });
    cartStore.clear();
    setStep("done");
    setToast(true);
    setInfo({ name: "", phone: "", zipCode: "", address: "", detail: "" });
    setErrors({});
    setTimeout(() => setToast(false), 3500);
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%", padding: "13px 16px", borderRadius: "14px", fontSize: "14px",
    border: `1.5px solid ${hasError ? "#FF2D55" : "#F2F4F7"}`,
    outline: "none", boxSizing: "border-box", backgroundColor: "#FAFAFA",
    color: "#0D2B4E", transition: "border-color 0.2s",
  });

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(13,43,78,0.25)", backdropFilter: "blur(4px)", zIndex: 200 }}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, width: "440px",
                backgroundColor: "#fff", zIndex: 201,
                display: "flex", flexDirection: "column",
                boxShadow: "-8px 0 48px rgba(0,0,0,0.12)",
              }}
            >
              {/* ── Header ── */}
              <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #F2F4F7", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.02em" }}>
                    {step === "cart" ? "장바구니" : step === "checkout" ? "결제하기" : "주문 완료"}
                  </h2>
                  {step === "cart" && (
                    <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "3px" }}>
                      {items.length > 0 ? `${items.reduce((s, i) => s + i.qty, 0)}개 상품` : "담긴 상품이 없어요"}
                    </p>
                  )}
                  {step === "checkout" && (
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {["배송지", "결제수단", "최종확인"].map((s, i) => (
                        <span key={s} style={{ fontSize: "11px", fontWeight: 700, color: i === 0 ? "#FF5C1A" : "#CBD5E1" }}>
                          {i > 0 && "→ "}{s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {step === "checkout" && (
                    <button onClick={() => setStep("cart")} style={{ fontSize: "13px", fontWeight: 700, color: "#64748B", background: "none", border: "1px solid #F2F4F7", borderRadius: "100px", padding: "6px 14px", cursor: "pointer" }}>
                      ← 장바구니
                    </button>
                  )}
                  <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid #F2F4F7", background: "#F8FAFC", cursor: "pointer", fontSize: "16px", color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ✕
                  </button>
                </div>
              </div>

              {/* ── STEP: CART ── */}
              {step === "cart" && (
                <>
                  <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
                    {items.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "72px 0" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
                        <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>아직 비어있어요</p>
                        <p style={{ fontSize: "13px", color: "#94A3B8" }}>스토어에서 마음에 드는 상품을 담아보세요</p>
                      </div>
                    ) : (
                      <>
                        <AnimatePresence>
                          {items.map(item => (
                            <motion.div key={item.id}
                              layout
                              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                              style={{ display: "flex", gap: "14px", padding: "18px 0", borderBottom: "1px solid #F8FAFC", alignItems: "center" }}
                            >
                              <div style={{ width: "64px", height: "64px", borderRadius: "16px", flexShrink: 0, backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>
                                {item.emoji}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700, letterSpacing: "0.06em" }}>{item.brand}</p>
                                <p style={{ fontSize: "14px", fontWeight: 700, marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                                <p style={{ fontSize: "15px", fontWeight: 900, color: "#FF5C1A", marginTop: "4px" }}>
                                  {(item.priceNum * item.qty).toLocaleString()}원
                                </p>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                                {/* Delete */}
                                <button onClick={() => cartStore.remove(item.id)}
                                  style={{ width: "22px", height: "22px", borderRadius: "50%", border: "none", background: "#F2F4F7", cursor: "pointer", fontSize: "10px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  ✕
                                </button>
                                {/* Qty controls */}
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#F8FAFC", borderRadius: "100px", padding: "4px 8px" }}>
                                  <button onClick={() => cartStore.updateQty(item.id, item.qty - 1)}
                                    style={{ width: "26px", height: "26px", borderRadius: "50%", border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D2B4E" }}>
                                    −
                                  </button>
                                  <span style={{ fontSize: "14px", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                                  <button onClick={() => cartStore.updateQty(item.id, item.qty + 1)}
                                    style={{ width: "26px", height: "26px", borderRadius: "50%", border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D2B4E" }}>
                                    +
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Shipping notice */}
                        {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                          <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "14px", backgroundColor: "#FFF5F0", border: "1px solid #FFE4D9" }}>
                            <p style={{ fontSize: "12px", color: "#FF5C1A", fontWeight: 700 }}>
                              🚚 {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}원 더 담으면 무료배송!
                            </p>
                          </div>
                        )}
                        {subtotal >= FREE_SHIPPING_THRESHOLD && (
                          <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "14px", backgroundColor: "#E8F9EE" }}>
                            <p style={{ fontSize: "12px", color: "#34C759", fontWeight: 700 }}>✓ 무료배송 적용됐어요!</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {items.length > 0 && (
                    <div style={{ padding: "20px 28px 36px", borderTop: "1px solid #F2F4F7", flexShrink: 0 }}>
                      {/* Price breakdown */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", color: "#64748B" }}>총 상품 금액</span>
                          <span style={{ fontSize: "13px", fontWeight: 700 }}>{subtotal.toLocaleString()}원</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", color: "#64748B" }}>배송비</span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: shipping === 0 ? "#34C759" : "#0D2B4E" }}>
                            {shipping === 0 ? "무료" : `+${SHIPPING_FEE.toLocaleString()}원`}
                          </span>
                        </div>
                        <div style={{ height: "1px", backgroundColor: "#F2F4F7" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700 }}>최종 결제 금액</span>
                          <span style={{ fontSize: "22px", fontWeight: 900, color: "#FF5C1A" }}>{total.toLocaleString()}원</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={() => setStep("checkout")}
                        style={{ width: "100%", padding: "18px", borderRadius: "100px", backgroundColor: "#FF5C1A", color: "#fff", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
                        결제하기 · {total.toLocaleString()}원
                      </motion.button>
                    </div>
                  )}
                </>
              )}

              {/* ── STEP: CHECKOUT ── */}
              {step === "checkout" && (
                <>
                  <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

                    {/* Shipping address */}
                    <div style={{ marginBottom: "28px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 900, marginBottom: "16px" }}>배송지 정보</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div>
                          <input
                            placeholder="받는 분 이름 *"
                            value={info.name}
                            onChange={e => { setInfo(i => ({ ...i, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })); }}
                            style={inputStyle(!!errors.name)}
                          />
                          {errors.name && <p style={{ fontSize: "11px", color: "#FF2D55", marginTop: "4px", marginLeft: "4px" }}>{errors.name}</p>}
                        </div>
                        <div>
                          <input
                            placeholder="연락처 (010-0000-0000) *"
                            value={info.phone}
                            onChange={e => { setInfo(i => ({ ...i, phone: e.target.value })); setErrors(er => ({ ...er, phone: undefined })); }}
                            style={inputStyle(!!errors.phone)}
                          />
                          {errors.phone && <p style={{ fontSize: "11px", color: "#FF2D55", marginTop: "4px", marginLeft: "4px" }}>{errors.phone}</p>}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            placeholder="우편번호"
                            value={info.zipCode}
                            onChange={e => setInfo(i => ({ ...i, zipCode: e.target.value }))}
                            style={{ ...inputStyle(), width: "120px", flexShrink: 0 }}
                          />
                          <button style={{ flex: 1, padding: "13px", borderRadius: "14px", border: "1.5px solid #E2E8F0", backgroundColor: "#F8FAFC", fontSize: "13px", fontWeight: 700, cursor: "pointer", color: "#64748B" }}>
                            주소 검색
                          </button>
                        </div>
                        <div>
                          <input
                            placeholder="기본 주소 *"
                            value={info.address}
                            onChange={e => { setInfo(i => ({ ...i, address: e.target.value })); setErrors(er => ({ ...er, address: undefined })); }}
                            style={inputStyle(!!errors.address)}
                          />
                          {errors.address && <p style={{ fontSize: "11px", color: "#FF2D55", marginTop: "4px", marginLeft: "4px" }}>{errors.address}</p>}
                        </div>
                        <input
                          placeholder="상세 주소 (동, 호수 등)"
                          value={info.detail}
                          onChange={e => setInfo(i => ({ ...i, detail: e.target.value }))}
                          style={inputStyle()}
                        />
                      </div>
                    </div>

                    {/* Payment method */}
                    <div style={{ marginBottom: "28px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 900, marginBottom: "16px" }}>결제 수단</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {PAYMENT_METHODS.map(pm => (
                          <button key={pm.id} onClick={() => setPayMethod(pm.id)}
                            style={{
                              padding: "16px 14px", borderRadius: "16px", cursor: "pointer", textAlign: "left",
                              border: payMethod === pm.id ? "2px solid #FF5C1A" : "1.5px solid #F2F4F7",
                              backgroundColor: payMethod === pm.id ? "#FFF5F0" : "#FAFAFA",
                              transition: "all 0.15s",
                            }}>
                            <div style={{ fontSize: "22px", marginBottom: "8px" }}>{pm.icon}</div>
                            <p style={{ fontSize: "13px", fontWeight: 900, color: payMethod === pm.id ? "#FF5C1A" : "#0D2B4E" }}>{pm.label}</p>
                            <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>{pm.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order summary */}
                    <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "#F8FAFC", marginBottom: "8px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 900, marginBottom: "14px", color: "#0D2B4E" }}>주문 상품 ({items.reduce((s, i) => s + i.qty, 0)}개)</p>
                      {items.map(item => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px" }}>{item.emoji}</span>
                            <span style={{ fontSize: "13px", color: "#64748B", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>×{item.qty}</span>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 700 }}>{(item.priceNum * item.qty).toLocaleString()}원</span>
                        </div>
                      ))}
                      <div style={{ height: "1px", backgroundColor: "#E2E8F0", margin: "14px 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#94A3B8" }}>상품금액</span>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>{subtotal.toLocaleString()}원</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontSize: "12px", color: "#94A3B8" }}>배송비</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: shipping === 0 ? "#34C759" : "#0D2B4E" }}>{shipping === 0 ? "무료" : `${SHIPPING_FEE.toLocaleString()}원`}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "14px", fontWeight: 900 }}>최종 결제</span>
                        <span style={{ fontSize: "18px", fontWeight: 900, color: "#FF5C1A" }}>{total.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout footer */}
                  <div style={{ padding: "16px 28px 36px", borderTop: "1px solid #F2F4F7", flexShrink: 0 }}>
                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handlePlaceOrder}
                      style={{ width: "100%", padding: "18px", borderRadius: "100px", backgroundColor: "#FF5C1A", color: "#fff", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
                      {total.toLocaleString()}원 결제하기
                    </motion.button>
                    <p style={{ fontSize: "11px", color: "#CBD5E1", textAlign: "center", marginTop: "10px" }}>
                      주문 내용을 확인하였으며, 결제에 동의합니다
                    </p>
                  </div>
                </>
              )}

              {/* ── STEP: DONE ── */}
              {step === "done" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    style={{ width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "#E8F9EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px", marginBottom: "28px" }}
                  >
                    ✓
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>주문 완료!</h3>
                    <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.7, marginBottom: "32px" }}>
                      주문이 정상적으로 접수되었습니다.<br />
                      마이페이지에서 주문 내역을 확인할 수 있어요.
                    </p>
                    <button onClick={onClose}
                      style={{ padding: "14px 36px", borderRadius: "100px", border: "none", backgroundColor: "#0D2B4E", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                      쇼핑 계속하기
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Global Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#0D2B4E", color: "#fff", padding: "14px 28px",
              borderRadius: "100px", fontSize: "14px", fontWeight: 700,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 500, whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
            <span style={{ color: "#34C759" }}>✓</span> 주문이 정상적으로 접수되었습니다
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
