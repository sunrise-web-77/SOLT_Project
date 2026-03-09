"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav";
import BackButton from "@/components/BackButton";
import { insightArticles, bannerItems, shopItems, mockPosts } from "@/lib/mockData";

// ── Article body texts ─────────────────────────────────────────
const ARTICLE_BODY: Record<string, string> = {
  ia1: `서아프리카 말리 현지에서 사역 중인 선교사 김성호 선교사(51세)로부터 긴급 기도 제목이 전달됐다.

"지난 주 우리 팀이 마을 예배를 드리던 중 이슬람 과격 세력의 위협을 받았습니다. 현지 성도 3명이 협박을 받았고, 예배 처소도 불안한 상황입니다. 무엇보다 겁에 질린 성도들이 모임을 포기하지 않도록, 믿음을 붙들 수 있도록 기도 부탁드립니다."

이 지역은 2024년부터 이슬람 극단주의의 영향이 급격히 확대되며 크리스천 공동체가 직접적인 위협에 놓여 있다. 현지 교회는 지하에서 예배를 이어가고 있으며, 한국 교계의 기도와 지원이 절실한 상황이다.

SOLT는 이 소식을 전달하며 전국 크리스천들의 중보기도를 요청한다.

기도 제목:
1. 현지 성도들의 안전과 믿음 견고함
2. 선교사 팀의 보호와 지혜
3. 현지 정부의 종교 자유 보장
4. 위협 세력을 향한 하나님의 역사

"두려워하지 말라 내가 너와 함께 함이라" (이사야 41:10)`,

  ia2: `한국갤럽과 목회데이터연구소가 공동 발표한 '2025 한국 교회 출석 현황 조사'에 따르면, 20-34세 청년 출석률이 전년 대비 3.2%p 상승한 것으로 나타났다.

5년 전 팬데믹 이후 급격히 하락했던 청년 출석률이 처음으로 반등 조짐을 보이는 것이다. 연구진은 이 변화의 배경으로 세 가지를 꼽았다.

첫째, 소그룹 중심의 커뮤니티 회복이다. 대형 예배 중심에서 6-12명 단위의 친밀한 소그룹으로 무게중심이 이동했다.

둘째, 라이프스타일 신앙의 부상이다. 예배당 밖에서도 신앙을 표현하는 방식 — 찬양 모임, 크리스천 러닝 크루, 성경적 독서 모임 등 — 이 MZ세대의 공감을 얻고 있다.

셋째, SOLT와 같은 플랫폼의 역할이다. 신앙 기반 커뮤니티 앱 사용자 중 82%가 "플랫폼을 통해 교회 밖 신앙 공동체를 경험했다"고 답했다.

연구진은 "이 흐름이 지속되려면 공동체의 진정성과 신뢰 회복이 핵심"이라고 강조했다.`,

  ia3: `팀 켈러(Timothy Keller, 1950-2023)는 뉴욕 맨해튼 한복판에서 리디머교회(Redeemer Presbyterian Church)를 세운 목사이자, 복음 중심주의의 가장 탁월한 변호자 중 한 명이었다.

그가 한국 교회에 남긴 가장 큰 유산은 무엇인가? 세 가지를 꼽을 수 있다.

첫째, 도시 선교 신학이다. 켈러는 "교회는 도심부를 피해선 안 된다"고 주장했다. 한국의 젊은 크리스천들이 강남·홍대·성수로 이주하며 그 지역에서 신앙 공동체를 세우려는 흐름은 켈러의 신학과 맞닿아 있다.

둘째, 복음 중심의 설교다. 켈러는 모든 본문이 그리스도를 가리키고 있음을 보여주었다. 율법 본문에서도, 지혜서에서도, 역사서에서도 복음을 발견하는 설교 방식은 한국 교계의 설교학에 깊은 영향을 주었다.

셋째, 회의적인 사람과의 대화다. 그의 저서 『하나님을 믿지 않는 이유』는 신앙을 버린 이들과 처음부터 대화를 시작하는 방법을 알려주었다.

그의 죽음 이후에도, 한국에서 켈러를 읽는 독자는 줄지 않고 있다.`,

  ia4: `1517년 10월 31일, 비텐베르크 대학의 신학 교수 마틴 루터(Martin Luther)는 95개조 반박문을 성문에 못 박았다. 그 행위는 단순한 학문적 논쟁이 아니라, 중세 기독교 체계 전체를 뒤흔드는 도화선이 되었다.

루터가 던진 핵심 질문: "죄의 용서는 교회의 제도를 통해 오는가, 아니면 오직 하나님의 은혜로 오는가?"

오직 믿음으로(Sola Fide), 오직 은혜로(Sola Gratia), 오직 성경으로(Sola Scriptura).

2026년의 교회에 이 질문은 여전히 유효하다. 우리는 예배 형식, 건물, 프로그램, 프로필을 통해 의를 얻으려 하지 않는가? 루터의 외침은 제도 밖에서 하나님을 직접 만나려는 모든 신앙인을 향한 초대장이기도 하다.

"두렵고 떨림으로 너희 구원을 이루라" — 빌립보서 2:12. 루터는 이 구원이 자력으로 이루는 것이 아님을 누구보다 잘 알았다.`,

  ia5: `데이비드 폴리슨(David Powlison)의 『묵상, 하나님의 음성 듣기』는 기도와 말씀 묵상의 교차점을 다룬 실천신학의 정수다.

저자는 묵상(contemplatio)을 단순한 심리적 이완이나 정보 습득과 구별한다. 참된 묵상은 하나님의 성품이 내 마음속으로 흘러들어오는 과정이다.

책의 핵심 통찰 세 가지:

1. 성경은 '읽는' 책이 아니라 '듣는' 책이다. 우리가 묵상할 때, 성령은 죽은 문자를 살아 있는 음성으로 바꾸신다.
2. 기도는 반응이다. 말씀을 먼저 듣고, 그것에 반응하는 것이 기도다. 기도가 먼저가 아니다.
3. 일관성이 깊이를 만든다. 하루 한 구절을 30분 붙들고 씨름하는 것이, 다섯 장을 훑어 읽는 것보다 깊은 변화를 일으킨다.

이 책은 큐티 저널과 함께 읽기를 강권한다. 읽고, 적고, 기도하라.`,

  ia6: `J.I. 패커(James Innell Packer, 1926-2020)의 『하나님을 아는 지식(Knowing God)』은 1973년 출간 이후 전 세계적으로 수백만 부가 판매된 기독교 고전이다.

반세기가 지난 2026년에 이 책을 읽어야 하는 이유는 무엇인가?

패커는 묻는다: "당신은 하나님에 대한 지식(knowledge about God)을 가지고 있는가, 아니면 하나님을 아는 지식(knowing God)을 가지고 있는가?" 이 두 가지는 전혀 다르다.

하나님에 대한 지식은 정보다. 하나님을 아는 지식은 관계다. 오늘날 우리는 신학 팟캐스트, 유튜브 설교, 온라인 큐티로 '정보'는 넘친다. 그런데 관계는 더 깊어지고 있는가?

패커의 문장 하나를 붙들고 한 주를 살아보라: "하나님을 아는 것은 인간이 할 수 있는 가장 위대한 일이다."

고전은 낡지 않는다. 우리가 새로워질 때마다 고전은 새 목소리로 말한다.`,

  ia7: `크리스천 MZ세대가 '건전한 놀이 문화'의 주역으로 떠오르고 있다. 음주 문화를 거부하고, 신앙 기반의 모임을 직접 조직하는 청년들이 늘어나는 추세다.

SOLT 플랫폼 조사에 따르면 20-30대 크리스천의 72%가 "Non-Alcoholic 모임을 선호한다"고 답했으며, 이는 전년 대비 18%p 증가한 수치다.

이들이 만드는 모임의 특징:

1. 찬양, 독서, 러닝, 요리 등 취미 기반 활동
2. 신앙을 전면에 내세우기보다 자연스럽게 녹여내는 방식
3. 온라인과 오프라인을 자유롭게 넘나드는 하이브리드 형태

전문가들은 이를 "크리스천 라이프스타일의 새로운 패러다임"으로 분석한다. 이화여대 기독교학과 윤석호 교수는 "신앙이 삶의 모든 영역에 자연스럽게 스며드는 생활 신학의 실천"이라고 평가했다.`,

  ia8: `크리스천은 직장에서 무엇으로 살아야 하는가? 성과인가, 관계인가, 증거인가?

직장선교네트워크 김지수 대표는 20년간 기업 현장에서 신앙인으로 살아온 경험을 이렇게 요약한다: "직장은 선교지가 아니라, 삶터다."

선교지로 보면 동료가 '전도 대상'이 된다. 하지만 삶터로 보면 동료는 '함께 일하는 사람'이 된다. 이 차이가 관계의 질을 바꾼다.

실천 원칙 세 가지:

1. 탁월함이 먼저다. 신앙인임을 밝히기 전에, 일 잘하는 사람이 되라. 평판이 곧 증거다.
2. 경계를 지켜라. 회식 문화, 윤리적 압박, 피로 속에서 자신의 가치관을 지키는 것 — 이것이 가장 강력한 신앙의 표현이다.
3. 기도를 숨기지 말라. 부담스럽지 않게, 그러나 자연스럽게. "점심시간에 잠깐 기도하고 올게요"라는 한 마디가 대화를 시작한다.

"그런즉 너희가 먹든지 마시든지 무엇을 하든지 다 하나님의 영광을 위하여 하라" — 고린도전서 10:31`,
};

const LEGACY_CONTENT: Record<string, string> = {
  b1: `서아프리카 말리 현지에서 사역 중인 선교사 김성호 선교사로부터 긴급 기도 제목이 전달됐다.\n\n"지난 주 우리 팀이 마을 예배를 드리던 중 이슬람 과격 세력의 위협을 받았습니다."\n\n기도 제목:\n1. 현지 성도들의 안전\n2. 선교사 팀의 보호\n3. 종교 자유 보장`,
  b2: `2026 전국 청년 연합 집회가 오는 3월 15일 여의도 순복음교회에서 개최된다.\n\n이번 집회는 전국 150여 교단과 400여 교회가 연합해 기획한 청년 연합 집회다.\n\n참가 신청은 SOLT 앱을 통해 가능하며, 선착순 마감 예정이다.`,
  b3: `크리스천 MZ세대가 '건전한 놀이 문화'의 주역으로 떠오르고 있다.\n\nSOLT 플랫폼 조사에 따르면 72%가 Non-Alcoholic 모임을 선호한다.\n\n전문가들은 이를 "크리스천 라이프스타일의 새로운 패러다임"으로 분석한다.`,
};

interface Comment { id: string; author: string; content: string; date: string; likes: number; }

const SEED_COMMENTS: Record<string, Comment[]> = {
  ia1: [
    { id: "c1", author: "이성훈", content: "함께 기도하겠습니다. 선교사님과 성도들을 위해 중보할게요.", date: "2026.03.01", likes: 24 },
    { id: "c2", author: "박지원", content: "이런 소식을 빠르게 전해주셔서 감사해요. 기도 제목 저장해둡니다.", date: "2026.03.02", likes: 12 },
  ],
  ia3: [{ id: "c3", author: "한민준", content: "켈러의 책 읽고 많이 변화됐어요. 좋은 글 감사합니다.", date: "2026.02.20", likes: 31 }],
  ia5: [{ id: "c4", author: "오지영", content: "큐티 저널이랑 함께 읽으니 정말 도움됩니다!", date: "2026.02.25", likes: 18 }],
  ia7: [
    { id: "c5", author: "최수연", content: "SOLT 모임이 딱 이런 문화 아닌가요? 잘 하고 있어요 :)", date: "2026.03.03", likes: 20 },
  ],
  b1: [{ id: "bc1", author: "이성훈", content: "함께 기도하겠습니다.", date: "2026.03.01", likes: 24 }],
  b2: [{ id: "bc3", author: "김태현", content: "신청 완료했습니다!", date: "2026.02.28", likes: 18 }],
  b3: [{ id: "bc5", author: "한민준", content: "공감되는 기사입니다.", date: "2026.03.03", likes: 31 }],
};

const CAT_COLORS: Record<string, string> = {
  news: "#0D2B4E", theology: "#1E40AF", book: "#7C3AED", lifestyle: "#FF5C1A",
};

// ── Paragraph renderer ────────────────────────────────────────
function renderParagraphs(
  body: string,
  relatedBook: typeof shopItems[0] | null,
  relatedLearn: typeof mockPosts[0] | null,
  color: string,
) {
  const chunks = body.split(/\n\n+/).filter(Boolean);
  const nodes: React.ReactNode[] = [];

  chunks.forEach((chunk, i) => {
    // Insert related book card after paragraph 2
    if (i === 2 && relatedBook) {
      nodes.push(<InlineBookCard key="book-card" book={relatedBook} />);
    }
    // Insert related learn card after paragraph 4
    if (i === 4 && relatedLearn) {
      nodes.push(<InlineLearnCard key="learn-card" post={relatedLearn} />);
    }

    // Detect numbered list block
    const lines = chunk.split("\n");
    const isNumberedList = lines.some((l) => /^\d+\.\s/.test(l.trim()));

    if (isNumberedList) {
      nodes.push(
        <ol key={i} style={{
          margin: "0 0 28px", paddingLeft: "0", listStyle: "none",
          display: "flex", flexDirection: "column", gap: "12px",
        }}>
          {lines.filter(Boolean).map((line, li) => {
            const match = line.match(/^(\d+)\.\s(.+)/);
            if (!match) return null;
            return (
              <li key={li} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{
                  flexShrink: 0, width: "26px", height: "26px", borderRadius: "50%",
                  backgroundColor: color, color: "#fff", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 900, marginTop: "2px",
                }}>
                  {match[1]}
                </span>
                <span style={{ fontSize: "17px", lineHeight: 1.85, color: "#2D3748", flex: 1 }}>
                  {match[2]}
                </span>
              </li>
            );
          })}
        </ol>
      );
      return;
    }

    // Pull quote (starts with quote char)
    if (chunk.startsWith('"') || chunk.startsWith('\u201c') || chunk.startsWith('"')) {
      nodes.push(
        <blockquote key={i} style={{
          margin: "0 0 36px", padding: "24px 28px",
          borderLeft: `4px solid ${color}`,
          backgroundColor: `${color}08`,
          borderRadius: "0 16px 16px 0",
        }}>
          <p style={{
            fontSize: "19px", fontWeight: 500, lineHeight: 1.85,
            color: "#0D2B4E", letterSpacing: "-0.01em", fontStyle: "italic", margin: 0,
          }}>
            {chunk}
          </p>
        </blockquote>
      );
      return;
    }

    // First paragraph — slightly larger
    if (i === 0) {
      nodes.push(
        <p key={i} style={{
          fontSize: "18px", lineHeight: 2.0, color: "#1A202C",
          letterSpacing: "-0.008em", margin: "0 0 28px", fontWeight: 400,
        }}>
          {chunk}
        </p>
      );
      return;
    }

    // Regular paragraph
    nodes.push(
      <p key={i} style={{
        fontSize: "17px", lineHeight: 2.05, color: "#2D3748",
        letterSpacing: "-0.005em", margin: "0 0 28px",
      }}>
        {chunk}
      </p>
    );
  });

  return nodes;
}

function InlineBookCard({ book }: { book: typeof shopItems[0] }) {
  return (
    <Link href="/shop" style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "16px", margin: "0 0 36px",
        padding: "18px 22px", borderRadius: "20px",
        background: "linear-gradient(135deg, #FFF5F0, #FFF8F5)",
        border: "1px solid #FFD4C2", cursor: "pointer", transition: "transform 0.2s",
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
      >
        <div style={{
          width: "52px", height: "52px", borderRadius: "14px", backgroundColor: "#FFF",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", flexShrink: 0, boxShadow: "0 2px 8px rgba(255,92,26,0.12)",
        }}>
          {book.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 900, color: "#FF5C1A", letterSpacing: "0.1em", marginBottom: "3px" }}>
            SOLT SHOP · 관련 상품
          </p>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#0D2B4E", marginBottom: "2px" }}>{book.title}</p>
          <p style={{ fontSize: "12px", color: "#94A3B8" }}>{book.brand} · {book.price}</p>
        </div>
        <span style={{ fontSize: "13px", color: "#FF5C1A", fontWeight: 700, flexShrink: 0 }}>보러 가기 →</span>
      </div>
    </Link>
  );
}

function InlineLearnCard({ post }: { post: typeof mockPosts[0] }) {
  return (
    <Link href={`/learn/${post.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "16px", margin: "0 0 36px",
        padding: "18px 22px", borderRadius: "20px",
        background: "linear-gradient(135deg, #F0FBF4, #F5FFF8)",
        border: "1px solid #B3E6C0", cursor: "pointer", transition: "transform 0.2s",
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
      >
        <div style={{
          width: "52px", height: "52px", borderRadius: "14px", backgroundColor: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", flexShrink: 0, boxShadow: "0 2px 8px rgba(52,199,89,0.12)",
        }}>
          {post.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 900, color: "#34C759", letterSpacing: "0.1em", marginBottom: "3px" }}>
            SOLT LEARN · 관련 클래스
          </p>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#0D2B4E", marginBottom: "2px" }}>{post.title}</p>
          <p style={{ fontSize: "12px", color: "#94A3B8" }}>{post.host.name} · {post.date}</p>
        </div>
        <span style={{ fontSize: "13px", color: "#34C759", fontWeight: 700, flexShrink: 0 }}>클래스 보기 →</span>
      </div>
    </Link>
  );
}

export default function InsightDetail() {
  const { id } = useParams<{ id: string }>();
  const [progress, setProgress] = useState(0);
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS[id as string] || []);
  const [draft, setDraft] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [prayCount, setPrayCount] = useState(0);
  const [prayed, setPrayed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const newArticle = insightArticles.find((a) => a.id === id);
  const legacyArticle = bannerItems.find((b) => b.id === id);

  if (!newArticle && !legacyArticle) {
    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <Nav />
        <div style={{ padding: "80px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#94A3B8" }}>게시물을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setComments((prev) => [{
      id: `cm-${Date.now()}`, author: "나", content: draft,
      date: new Date().toLocaleDateString("ko-KR"), likes: 0,
    }, ...prev]);
    setDraft("");
  };

  const toggleLike = (cmId: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cmId)) {
        next.delete(cmId); setComments((c) => c.map((cm) => cm.id === cmId ? { ...cm, likes: cm.likes - 1 } : cm));
      } else {
        next.add(cmId); setComments((c) => c.map((cm) => cm.id === cmId ? { ...cm, likes: cm.likes + 1 } : cm));
      }
      return next;
    });
  };

  // ── New article ──
  if (newArticle) {
    const color = CAT_COLORS[newArticle.category] ?? "#0D2B4E";
    const body = ARTICLE_BODY[newArticle.id] ?? newArticle.subtitle;
    const relatedBook = newArticle.relatedBookId ? shopItems.find((s) => s.id === newArticle.relatedBookId) ?? null : null;
    const relatedLearn = newArticle.relatedLearnId ? mockPosts.find((p) => p.id === newArticle.relatedLearnId) ?? null : null;

    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
        {/* Reading progress bar */}
        <div style={{
          position: "fixed", top: 0, left: 0, height: "3px", zIndex: 9999,
          width: `${progress}%`, backgroundColor: color, transition: "width 0.1s linear",
        }} />

        <Nav />

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 40px 100px" }}>
          <BackButton />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Category badges */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              <span style={{
                padding: "5px 14px", borderRadius: "100px", fontSize: "10px", fontWeight: 900,
                letterSpacing: "0.1em", backgroundColor: `${color}15`, color,
              }}>
                {newArticle.categoryLabel}
              </span>
              <span style={{
                padding: "5px 14px", borderRadius: "100px", fontSize: "10px", fontWeight: 900,
                letterSpacing: "0.1em", backgroundColor: "#F8FAFC", color: "#64748B",
              }}>
                {newArticle.label}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: "34px", fontWeight: 900, lineHeight: 1.3,
              whiteSpace: "pre-line", marginBottom: "16px", letterSpacing: "-0.03em",
            }}>
              {newArticle.title}
            </h1>
            <p style={{ fontSize: "17px", color: "#64748B", lineHeight: 1.75, marginBottom: "32px", letterSpacing: "-0.01em" }}>
              {newArticle.subtitle}
            </p>

            {/* Author block */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 22px", borderRadius: "16px", backgroundColor: "#F8FAFC", marginBottom: "32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "50%", backgroundColor: color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "17px", fontWeight: 900, color: "#fff",
                }}>
                  {newArticle.author.name[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>{newArticle.author.name}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>{newArticle.author.title}</p>
                </div>
              </div>
              <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>{newArticle.readTime}분 읽기</span>
            </div>

            {/* Keywords */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "40px" }}>
              {newArticle.keywords.map((kw) => (
                <span key={kw} style={{
                  padding: "5px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700,
                  backgroundColor: `${color}10`, color,
                }}>
                  #{kw}
                </span>
              ))}
            </div>

            {/* Article body */}
            <div style={{ borderTop: "1px solid #F2F4F7", paddingTop: "40px", marginBottom: "48px" }}>
              {renderParagraphs(body, relatedBook ?? null, relatedLearn ?? null, color)}
            </div>

            {/* Action row */}
            <div style={{ display: "flex", gap: "10px", paddingBottom: "36px", borderBottom: "1px solid #F2F4F7", marginBottom: "36px" }}>
              <button
                onClick={() => { setPrayed((p) => !p); setPrayCount((c) => prayed ? c - 1 : c + 1); }}
                style={{
                  padding: "10px 22px", borderRadius: "100px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 700, transition: "all 0.2s",
                  backgroundColor: prayed ? "#0D2B4E" : "#F8FAFC",
                  color: prayed ? "#fff" : "#64748B",
                }}
              >
                {prayed ? "🙏 기도중" : "🙏 기도합니다"}{prayCount > 0 ? ` ${prayCount}` : ""}
              </button>
              <button style={{
                padding: "10px 22px", borderRadius: "100px", border: "1px solid #F2F4F7",
                backgroundColor: "#fff", fontSize: "13px", fontWeight: 700, color: "#64748B", cursor: "pointer",
              }}>
                ↗ 공유하기
              </button>
            </div>

            <CommentSection comments={comments} draft={draft} likedIds={likedIds}
              onDraftChange={setDraft} onSubmit={handleComment} onToggleLike={toggleLike} />
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Legacy bannerItem ──
  const article = legacyArticle!;
  const bgColor = article.category === "insight" ? "#0D2B4E" : "#FF5C1A";
  const content = LEGACY_CONTENT[id as string] ?? article.subtitle;

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0D2B4E" }}>
      <div style={{ position: "fixed", top: 0, left: 0, height: "3px", zIndex: 9999, width: `${progress}%`, backgroundColor: bgColor }} />
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 40px 80px" }}>
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ borderRadius: "24px", backgroundColor: bgColor, padding: "40px", marginBottom: "40px" }}>
            <span style={{
              display: "inline-block", backgroundColor: "rgba(255,255,255,0.2)", color: "#fff",
              padding: "5px 14px", borderRadius: "100px", fontSize: "11px", fontWeight: 900,
              letterSpacing: "0.06em", marginBottom: "16px",
            }}>
              {article.label}
            </span>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", lineHeight: 1.35, whiteSpace: "pre-line", letterSpacing: "-0.03em" }}>
              {article.title}
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", marginTop: "12px" }}>
              {article.subtitle}
            </p>
          </div>
          <div style={{ borderTop: "1px solid #F2F4F7", paddingTop: "36px", marginBottom: "40px" }}>
            {content.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ fontSize: "17px", lineHeight: 2.0, color: "#2D3748", marginBottom: "24px", letterSpacing: "-0.005em" }}>
                {p}
              </p>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", paddingBottom: "36px", borderBottom: "1px solid #F2F4F7", marginBottom: "36px" }}>
            {["🙏 기도합니다", "↗ 공유하기"].map((label) => (
              <button key={label} style={{
                padding: "10px 22px", borderRadius: "100px", border: "1px solid #F2F4F7",
                backgroundColor: "#fff", fontSize: "13px", fontWeight: 700, color: "#64748B", cursor: "pointer",
              }}>
                {label}
              </button>
            ))}
          </div>
          <CommentSection comments={comments} draft={draft} likedIds={likedIds}
            onDraftChange={setDraft} onSubmit={handleComment} onToggleLike={toggleLike} />
        </motion.div>
      </div>
    </div>
  );
}

// ── Comment section ────────────────────────────────────────────
interface CommentSectionProps {
  comments: Comment[]; draft: string; likedIds: Set<string>;
  onDraftChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleLike: (id: string) => void;
}

function CommentSection({ comments, draft, likedIds, onDraftChange, onSubmit, onToggleLike }: CommentSectionProps) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.02em" }}>댓글</h2>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#94A3B8" }}>{comments.length}</span>
      </div>
      <form onSubmit={onSubmit} style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#FF5C1A",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 900, color: "#fff", flexShrink: 0, marginTop: "2px",
          }}>
            나
          </div>
          <div style={{ flex: 1 }}>
            <textarea placeholder="댓글을 작성해주세요..." rows={3} required
              value={draft} onChange={(e) => onDraftChange(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: "14px",
                border: "1px solid #F2F4F7", fontSize: "14px", lineHeight: 1.65, resize: "none",
                outline: "none", backgroundColor: "#F8FAFC", boxSizing: "border-box", fontFamily: "inherit",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button type="submit" style={{
                padding: "9px 22px", borderRadius: "100px", border: "none",
                backgroundColor: "#0D2B4E", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
              }}>
                등록
              </button>
            </div>
          </div>
        </div>
      </form>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {comments.length === 0 && (
          <p style={{ fontSize: "14px", color: "#94A3B8", textAlign: "center", padding: "32px 0" }}>첫 댓글을 남겨보세요</p>
        )}
        {comments.map((cm) => (
          <motion.div key={cm.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#0D2B4E",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 900, color: "#fff", flexShrink: 0,
            }}>
              {cm.author[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700 }}>{cm.author}</span>
                <span style={{ fontSize: "11px", color: "#CBD5E1" }}>{cm.date}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.75, letterSpacing: "-0.005em" }}>{cm.content}</p>
              <button onClick={() => onToggleLike(cm.id)} style={{
                marginTop: "8px", background: "none", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: 700, padding: 0,
                color: likedIds.has(cm.id) ? "#FF5C1A" : "#94A3B8",
              }}>
                ♥ {cm.likes}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
