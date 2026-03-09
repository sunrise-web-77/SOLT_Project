"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "login" | "signup";

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
}

const AuthModal = ({ mode: initialMode, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [church, setChurch] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: "12px",
    border: "1px solid #F2F4F7", outline: "none", fontSize: "14px",
    fontWeight: 500, color: "#0D2B4E", backgroundColor: "#F8FAFC",
    transition: "border-color 0.2s",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(13,43,78,0.3)", backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "400px", backgroundColor: "#fff", borderRadius: "28px",
          padding: "44px 36px", boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{ fontSize: "22px", fontWeight: 900, color: "#FF5C1A" }}>SOLT</p>
          <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#0D2B4E", marginTop: "12px" }}>
            {mode === "login" ? "로그인" : "회원가입"}
          </h2>
          <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px" }}>
            {mode === "login" ? "다시 만나서 반가워요" : "SOLT와 함께 시작해요"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "signup" && (
            <>
              <input
                type="text" placeholder="이름" value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#FF5C1A"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#F2F4F7"; }}
              />
              <input
                type="text" placeholder="소속 교회 (선택)" value={church}
                onChange={(e) => setChurch(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#FF5C1A"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#F2F4F7"; }}
              />
            </>
          )}
          <input
            type="email" placeholder="이메일" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#FF5C1A"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#F2F4F7"; }}
          />
          <input
            type="password" placeholder="비밀번호" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#FF5C1A"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#F2F4F7"; }}
          />

          <button
            type="submit"
            style={{
              marginTop: "8px", padding: "14px", borderRadius: "100px",
              backgroundColor: "#FF5C1A", color: "#fff", fontSize: "15px",
              fontWeight: 700, border: "none", cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {mode === "login" ? "로그인" : "가입하기"}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#94A3B8", marginTop: "20px" }}>
          {mode === "login" ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{
              background: "none", border: "none", color: "#FF5C1A",
              fontWeight: 700, cursor: "pointer", fontSize: "13px",
            }}
          >
            {mode === "login" ? "회원가입" : "로그인"}
          </button>
        </p>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "20px", right: "20px",
            background: "none", border: "none", fontSize: "20px",
            color: "#CBD5E1", cursor: "pointer",
          }}
        >
          &times;
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
