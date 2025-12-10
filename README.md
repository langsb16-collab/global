# 🌾 Farm2World - 농수산물 글로벌 판매 대행 플랫폼

농민·소상공인을 위한 **글로벌 판매 자동화 플랫폼**  
한 번의 등록으로 전 세계 10개 이상의 플랫폼에 상품을 자동 업로드!

---

## 📋 프로젝트 개요

**Farm2World**는 농수산물과 지역특산품을 해외로 판매하고자 하는 농민·소상공인을 위한 **크롤링 기반 자동 업로드** 및 **글로벌 판매 대행 플랫폼**입니다.

### 🎯 핵심 가치

- **언어 장벽 제거**: 한국어로 입력하면 자동으로 영어, 중국어, 일본어로 번역
- **플랫폼 등록 자동화**: Amazon, Shopee, Lazada 등 10개 플랫폼에 자동 업로드
- **통합 정산 시스템**: 환율 자동 계산 및 수수료 투명 공개
- **원클릭 글로벌 진출**: 복잡한 해외 판매 절차를 단순화

---

## 🚀 현재 구현 완료 기능

### ✅ 백엔드 API (Hono + Cloudflare D1)

#### 1. 사용자 인증 시스템 (`/api/auth`)
- ✅ **회원가입** (`POST /api/auth/register`)
- ✅ **로그인** (`POST /api/auth/login`)
- ✅ **프로필 조회** (`GET /api/auth/me`)
- ✅ JWT 토큰 기반 인증
- ✅ 역할 기반 접근 제어 (farmer, admin, manager)

#### 2. 상품 관리 API (`/api/products`)
- ✅ **상품 목록 조회** (`GET /api/products`)
  - 페이지네이션 지원
  - 상태, 카테고리, 사용자별 필터링
- ✅ **상품 상세 조회** (`GET /api/products/:id`)
  - 이미지 및 플랫폼 연결 정보 포함
- ✅ **상품 등록** (`POST /api/products`)
  - 자동 번역 기능 (한→영/중/일)
  - 상품 정보 자동 다국어 생성
- ✅ **상품 수정** (`PUT /api/products/:id`)
- ✅ **상품 삭제** (`DELETE /api/products/:id`)

#### 3. 주문 관리 API (`/api/orders`)
- ✅ **주문 목록 조회** (`GET /api/orders`)
  - 상태 및 플랫폼별 필터링
  - 사용자별 권한 제어
- ✅ **주문 상세 조회** (`GET /api/orders/:id`)
- ✅ **주문 생성** (`POST /api/orders`)
- ✅ **주문 상태 업데이트** (`PATCH /api/orders/:id/status`)
  - 배송 추적번호 관리
  - 결제 상태 관리

#### 4. 정산 관리 API (`/api/settlements`)
- ✅ **정산 목록 조회** (`GET /api/settlements`)
- ✅ **정산 요약 조회** (`GET /api/settlements/summary`)
  - 총 정산액, 대기 중 정산 등
- ✅ **정산 생성** (`POST /api/settlements`)
  - 플랫폼 수수료 자동 계산 (15%)
  - 거래 수수료 자동 계산 (3%)
  - 환율 자동 적용
- ✅ **환율 조회** (`GET /api/settlements/exchange-rates`)
  - 실시간 환율 API 연동 (exchangerate-api.com)

### ✅ 프론트엔드 UI (Hono JSX + Tailwind CSS)

#### 1. 공개 페이지
- ✅ **홈페이지** (`/`)
  - 플랫폼 소개
  - 주요 기능 안내
  - 지원 플랫폼 목록
- ✅ **로그인** (`/login`)
- ✅ **회원가입** (`/register`)

#### 2. 인증 필요 페이지
- ✅ **대시보드** (`/dashboard`)
  - 총 상품, 진행 중 주문, 월별 매출, 대기 중 정산 표시
  - 최근 주문 목록
  - 빠른 시작 메뉴
- ✅ **상품 등록** (`/products/new`)
  - 다국어 자동 번역 옵션
  - 카테고리별 분류
  - 원산지, 가격, 재고 관리
  - 중량 및 단위 설정

### ✅ 핵심 기능

#### 1. 자동 번역 시스템
- **MyMemory Translation API** 무료 활용
- 한국어 → 영어, 중국어, 일본어 자동 번역
- 상품명 및 설명 동시 번역
- 번역 캐시 테이블로 중복 요청 최소화

#### 2. 환율 자동 계산
- **Exchange Rate API** 실시간 환율 적용
- KRW 기준 8개 주요 통화 지원
  - USD, EUR, JPY, CNY, THB, VND, SGD
- 정산 시 자동 환율 적용
- Fallback 환율 데이터 제공

#### 3. 정산 자동 계산
- 플랫폼 수수료: 15% (기본값, 변경 가능)
- 거래 수수료: 3% (기본값, 변경 가능)
- 배송비: 주문별 개별 설정
- 순수익 = 총 매출 - (플랫폼 수수료 + 거래 수수료 + 배송비)

#### 4. 데이터베이스 스키마
- **users**: 사용자 정보 (농민, 관리자, 매니저)
- **products**: 상품 정보 (다국어 지원)
- **product_images**: 상품 이미지
- **product_platforms**: 플랫폼별 상품 연결 정보
- **orders**: 주문 정보
- **settlements**: 정산 정보
- **translation_cache**: 번역 캐시
- **price_history**: 가격 이력 (경쟁사 가격 추적용)

---

## 🌐 지원 플랫폼

현재 시스템에서 등록 가능한 글로벌 플랫폼:

| 플랫폼 | 지역 | 특징 |
|--------|------|------|
| Amazon | 글로벌 | 세계 최대 이커머스 |
| Shopee | 동남아 | 동남아 1위 쇼핑앱 |
| Lazada | 동남아 | 알리바바 계열 |
| Etsy | 글로벌 | 수제품/특산품 전문 |
| Alibaba | 중국 | B2B 플랫폼 |
| Rakuten | 일본 | 일본 1위 이커머스 |
| Coupang Global | 한국/해외 | K-Food 전문 |
| Yami | 미국 | 미주 동포 시장 |

---

## 📊 API 엔드포인트 요약

### 인증 API
```
POST   /api/auth/register     - 회원가입
POST   /api/auth/login        - 로그인
GET    /api/auth/me           - 내 정보 조회
```

### 상품 API
```
GET    /api/products          - 상품 목록 (페이지네이션)
GET    /api/products/:id      - 상품 상세
POST   /api/products          - 상품 등록 (인증 필요)
PUT    /api/products/:id      - 상품 수정 (인증 필요)
DELETE /api/products/:id      - 상품 삭제 (인증 필요)
```

### 주문 API
```
GET    /api/orders            - 주문 목록 (인증 필요)
GET    /api/orders/:id        - 주문 상세 (인증 필요)
POST   /api/orders            - 주문 생성 (인증 필요)
PATCH  /api/orders/:id/status - 주문 상태 업데이트 (인증 필요)
```

### 정산 API
```
GET    /api/settlements          - 정산 목록 (인증 필요)
GET    /api/settlements/summary  - 정산 요약 (인증 필요)
POST   /api/settlements          - 정산 생성 (인증 필요)
GET    /api/settlements/exchange-rates - 환율 조회
```

---

## 🔧 기술 스택

### Backend
- **Hono**: 초경량 웹 프레임워크
- **Cloudflare Workers**: 엣지 컴퓨팅 플랫폼
- **Cloudflare D1**: 서버리스 SQLite 데이터베이스
- **Cloudflare R2**: 오브젝트 스토리지 (이미지용)
- **Cloudflare KV**: 키-밸류 스토어 (캐싱용)

### Frontend
- **Hono JSX**: 서버 사이드 렌더링
- **Tailwind CSS**: 유틸리티 CSS 프레임워크
- **Vanilla JavaScript**: 경량 클라이언트 로직

### External APIs
- **MyMemory Translation API**: 무료 번역 서비스
- **Exchange Rate API**: 실시간 환율 정보

---

## 🚀 로컬 개발 환경 설정

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd farm2world
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 데이터베이스 초기화
```bash
# 마이그레이션 실행
npm run db:migrate:local

# 시드 데이터 삽입
npm run db:seed
```

### 4. 개발 서버 시작
```bash
# 빌드
npm run build

# PM2로 서버 시작
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

### 5. 접속
```
http://localhost:3000
```

---

## 📦 프로덕션 배포 (Cloudflare Pages)

### 1. Cloudflare API 키 설정
```bash
# setup_cloudflare_api_key 도구 사용
# 또는 Deploy 탭에서 API 키 설정
```

### 2. D1 데이터베이스 생성
```bash
npx wrangler d1 create farm2world-production
```

### 3. wrangler.jsonc 업데이트
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "farm2world-production",
      "database_id": "YOUR_DATABASE_ID"
    }
  ]
}
```

### 4. 프로덕션 마이그레이션
```bash
npm run db:migrate:prod
```

### 5. 빌드 및 배포
```bash
npm run deploy:prod
```

---

## 📱 데모 URL

### 개발 서버
- **URL**: https://3000-il7votzlop0mtaec9jqwt-d0b9e1e2.sandbox.novita.ai
- **API Base**: /api

### 테스트 계정
```
이메일: farmer1@example.com
비밀번호: password (해시 적용 필요)
역할: farmer
```

```
이메일: admin@farm2world.com
비밀번호: password (해시 적용 필요)
역할: admin
```

---

## 🔮 향후 개발 계획

### 우선순위 높음
- [ ] **이미지 업로드 기능** (Cloudflare R2 연동)
- [ ] **플랫폼 자동 업로드** (Amazon SP-API, Shopee API 연동)
- [ ] **실시간 가격 크롤링** (Cloudflare Cron Triggers)
- [ ] **재고 동기화** (플랫폼별 재고 자동 업데이트)

### 우선순위 중간
- [ ] **이메일 알림** (주문/정산 알림)
- [ ] **SMS 알림** (긴급 주문 알림)
- [ ] **엑셀 업로드** (대량 상품 등록)
- [ ] **통계 대시보드** (매출 추이, 인기 상품 분석)

### 우선순위 낮음
- [ ] **AI 상품 설명 생성** (GPT API 활용)
- [ ] **AI 가격 추천** (경쟁사 분석 기반)
- [ ] **배송 추적 통합** (배송사 API 연동)
- [ ] **고객 리뷰 관리** (플랫폼별 리뷰 수집)

---

## 📈 데이터 모델

### Users (사용자)
- 농민, 관리자, 매니저 역할 구분
- 사업자 정보 저장

### Products (상품)
- 다국어 지원 (한/영/중/일)
- 카테고리, 원산지, 가격, 재고 관리
- 상태: pending, approved, rejected, published, unpublished

### Orders (주문)
- 플랫폼별 주문 관리
- 상태: pending, confirmed, processing, shipped, delivered, cancelled, refunded
- 결제 상태: pending, paid, refunded

### Settlements (정산)
- 자동 수수료 계산
- 환율 자동 적용
- 상태: pending, completed, cancelled

---

## 🤝 기여 방법

1. 이 저장소를 Fork합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 📞 문의

- **프로젝트 저장소**: [GitHub Repository]
- **이메일**: contact@farm2world.com
- **웹사이트**: https://farm2world.pages.dev (배포 후)

---

## 🙏 감사의 말

이 프로젝트는 농민과 소상공인의 해외 진출을 돕기 위해 만들어졌습니다.  
전 세계로 K-Food를 알리는 데 기여하고 있습니다! 🇰🇷 → 🌍
