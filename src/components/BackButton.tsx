"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "14px", fontWeight: 700, color: "#0D2B4E",
        background: "none", border: "none", cursor: "pointer",
        marginBottom: "32px",
      }}
    >
      ← 뒤로 가기
    </button>
  );
};

export default BackButton;
