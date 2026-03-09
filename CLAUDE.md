# SOLT Project Rules

## Overview
SOLT는 크리스천 라이프스타일 커뮤니티 플랫폼입니다.
- 슬로건: "크리스천 라이프스타일의 중심, SOLT"
- 5대 핵심 축: Play(소모임), Learn(클래스), Shop(커머스), Event(정보), Insight(뉴스/선교)
- 6번째 축: Action(긴급구호/봉사 투명 게이지)
- 핵심 가치: 신뢰(본인인증), 건전함(No Alcohol), 투명성(Action 결과 공유)

## Data Model
- **Post**: id, type(play|learn), title, description, date, location, maxParticipants, currentParticipants, tag, status, emoji, host
- **BannerItem**: id, category(insight|event), label, title, subtitle, accent
- **ShopItem**: id, title, brand, price, tag, emoji
- **ActionItem**: id, title, description, currentAmount, goalAmount, unit, dday
- **FeedTab**: "전체" | "솔트 팟(Play)" | "클래스(Learn)"
- Mock 데이터: `src/lib/mockData.ts`

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Inline styles + Tailwind CSS v4
- **Font**: Noto Sans KR (300, 400, 500, 700, 900)
- **Animation**: Framer Motion (useInView, AnimatePresence, layout)
- **Package Manager**: npm

## Design System (강제 고정)

### 절대 규칙
- 배경: 무조건 #FFFFFF (순백색). 네이비 배경 절대 금지
- 최상단 컨테이너에 `style={{ backgroundColor: '#ffffff' }}` 명시 필수
- body에 `background-color: #ffffff !important` 적용

### Colors
- **Background**: #FFFFFF (Pure White), 섹션 구분 #F8FAFC, Divider #F2F4F7
- **SOLT Navy**: #0D2B4E — 텍스트, 로고, 탭 active, CTA 버튼(네이비)
- **SOLT Orange**: #FF5C1A — 포인트 버튼, 모집중 뱃지, 태그, D-day
- **SOLT Yellow**: #FFD600 — 히어로 "빛" 텍스트, 마감임박 뱃지 배경
- **Text**: #0D2B4E(주), #64748B(서브), #94A3B8(보조)

### Layout (29CM + 오늘의집)
- 섹션 간 간격: 88px
- 카드 라운드: 20px (rounded-[20px])
- 버튼/뱃지: rounded-full (100px)
- 카드 shadow: 0 2px 16px rgba(0,0,0,0.04), hover시 0 8px 30px rgba(0,0,0,0.08)
- hover 인터랙션: whileHover={{ y: -8 }} 또는 y: -6
- 탭: 오늘의집 스타일 하단 3px 언더라인
- Divider: height 8px, backgroundColor #F2F4F7

### Page Structure
1. Navigation — 29CM 스타일 (로고 좌, 메뉴 중앙, CTA 우)
2. Hero — 화이트 배경, 네이비 텍스트, 오렌지 "빛" 강조
3. Insight & Event — 슬라이드 배너 (dot pagination)
4. Play & Learn — 탭 전환 + 카드 그리드 (프로그레스 바)
5. Shop — 29CM 가로 스크롤 큐레이션
6. Action — 투명 게이지 (오렌지 프로그레스, 달성률 %)
7. CTA — 연회색 배경, 네이비 버튼
8. Footer — 2컬럼 링크

## Coding Conventions

### File Structure
```
src/
  app/           # App Router pages & layouts
  components/    # Reusable UI components (필요시 분리)
  lib/           # Mock data, utilities
  types/         # TypeScript type definitions
```

### Rules
- 함수형 컴포넌트 + arrow function
- Props는 interface로 정의
- 인라인 스타일 우선 (배경색 꼬임 방지), Tailwind 보조
- 다크모드 미지원 (밝은 테마 only)
- 과도한 추상화 금지 — 심플하게 유지

### Git
- 커밋 메시지: 한국어 허용, 간결하게
- 브랜치: feature/, fix/, refactor/ 접두사 사용
