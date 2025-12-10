# 🚀 Farm2World 배포 가이드

이 문서는 Farm2World 플랫폼을 Cloudflare Pages에 배포하는 방법을 설명합니다.

---

## 📋 사전 준비사항

### 1. Cloudflare 계정
- Cloudflare 계정이 필요합니다 (무료 플랜 가능)
- https://dash.cloudflare.com 에서 가입

### 2. GitHub 저장소
- 코드가 GitHub에 푸시되어 있어야 합니다
- 저장소는 public 또는 private 모두 가능

### 3. 필요한 도구
- Node.js 18+ 설치
- npm 또는 yarn 설치
- wrangler CLI (자동 설치됨)

---

## 🔧 1단계: Cloudflare API 키 설정

### 방법 1: 자동 설정 (추천)
```bash
# Cloudflare API 키 자동 설정
setup_cloudflare_api_key
```

### 방법 2: 수동 설정
1. Cloudflare Dashboard 접속
2. My Profile → API Tokens
3. "Create Token" 클릭
4. "Edit Cloudflare Workers" 템플릿 선택
5. 토큰 생성 후 복사

```bash
# 환경 변수 설정
export CLOUDFLARE_API_TOKEN="your-api-token-here"

# 또는 wrangler 로그인
npx wrangler login
```

---

## 💾 2단계: D1 데이터베이스 생성

### 프로덕션 데이터베이스 생성
```bash
npx wrangler d1 create farm2world-production
```

출력 예시:
```
✅ Successfully created DB 'farm2world-production'!

binding = "DB"
database_name = "farm2world-production"
database_id = "abc123-def456-ghi789"
```

### wrangler.jsonc 업데이트
`database_id`를 복사하여 `wrangler.jsonc` 파일에 추가:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "farm2world",
  "compatibility_date": "2025-12-10",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "farm2world-production",
      "database_id": "abc123-def456-ghi789"  // 여기에 실제 ID 입력
    }
  ]
}
```

### 프로덕션 데이터베이스 마이그레이션
```bash
npm run db:migrate:prod
```

---

## 🏗️ 3단계: 프로젝트 빌드

### 로컬에서 빌드 테스트
```bash
npm run build
```

성공 시 `dist/` 디렉토리에 다음 파일들이 생성됩니다:
- `_worker.js` (Hono 앱 컴파일 결과)
- `_routes.json` (라우팅 설정)
- `static/` (정적 파일들)

---

## 🚀 4단계: Cloudflare Pages 프로젝트 생성

### Cloudflare Pages 프로젝트 생성
```bash
npx wrangler pages project create farm2world \
  --production-branch main \
  --compatibility-date 2025-12-10
```

---

## 🌐 5단계: 배포 실행

### 첫 배포
```bash
npm run deploy:prod
```

또는 직접 명령:
```bash
npm run build
npx wrangler pages deploy dist --project-name farm2world
```

### 배포 성공 메시지
```
✨ Success! Uploaded 15 files (2.34 sec)

✨ Deployment complete! Take a peek over at https://abc123.farm2world.pages.dev
```

---

## 🔐 6단계: 환경 변수 설정 (선택사항)

### Cloudflare Pages에서 환경 변수 설정

1. Cloudflare Dashboard 접속
2. Workers & Pages → farm2world 선택
3. Settings → Environment Variables
4. 다음 변수 추가:

```bash
# JWT Secret (프로덕션 환경에서는 반드시 변경!)
JWT_SECRET=your-super-secret-key-change-this

# 번역 API 키 (선택사항)
DEEPL_API_KEY=your-deepl-api-key

# 기타 API 키 (선택사항)
GOOGLE_TRANSLATE_API_KEY=your-google-api-key
```

또는 CLI로 설정:
```bash
npx wrangler pages secret put JWT_SECRET --project-name farm2world
```

---

## 🧪 7단계: 배포 테스트

### API 엔드포인트 테스트
```bash
# 상품 목록 조회
curl https://farm2world.pages.dev/api/products?limit=5

# 환율 조회
curl https://farm2world.pages.dev/api/settlements/exchange-rates
```

### 웹 UI 테스트
브라우저에서 접속:
```
https://farm2world.pages.dev
```

테스트 계정으로 로그인:
- 이메일: `farmer1@example.com`
- 비밀번호: (시드 데이터에서 해시된 비밀번호 사용)

---

## 🔄 8단계: 지속적 배포 (CI/CD) 설정

### GitHub Actions 연동

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name farm2world
```

### GitHub Secrets 설정
1. GitHub Repository → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. `CLOUDFLARE_API_TOKEN` 추가

---

## 🌍 9단계: 커스텀 도메인 설정 (선택사항)

### 도메인 연결
```bash
npx wrangler pages domain add yourdomain.com --project-name farm2world
```

### DNS 설정
Cloudflare DNS에 다음 레코드 추가:
```
Type: CNAME
Name: @
Target: farm2world.pages.dev
```

---

## 📊 10단계: 모니터링 및 로그

### Cloudflare Dashboard에서 모니터링
1. Workers & Pages → farm2world
2. Analytics 탭에서 트래픽 확인
3. Logs 탭에서 실시간 로그 확인

### CLI로 로그 확인
```bash
npx wrangler pages deployment tail
```

---

## 🔧 트러블슈팅

### 문제 1: 빌드 실패
```bash
# 캐시 삭제 후 재빌드
rm -rf node_modules dist
npm install
npm run build
```

### 문제 2: D1 데이터베이스 연결 실패
```bash
# database_id 확인
npx wrangler d1 list

# wrangler.jsonc에 올바른 ID 입력되었는지 확인
```

### 문제 3: API 요청 실패 (CORS)
- `src/index.tsx`에서 CORS 미들웨어 확인
- `/api/*` 경로에 CORS가 적용되어 있는지 확인

### 문제 4: 인증 실패
- JWT_SECRET 환경 변수 확인
- 토큰 만료 시간 확인 (기본 24시간)

---

## 📈 성능 최적화

### 1. 캐싱 설정
Cloudflare KV를 활용한 캐싱:
```typescript
// 번역 결과 캐싱
await c.env.CACHE.put(`translation:${key}`, result, { expirationTtl: 86400 });
```

### 2. 이미지 최적화
Cloudflare Images 활용:
```bash
npx wrangler r2 bucket create farm2world-images
```

### 3. CDN 활용
- 정적 파일은 자동으로 Cloudflare CDN에서 제공됨
- 전 세계 300개 이상의 엣지 로케이션

---

## 💰 비용 안내

### Cloudflare 무료 플랜 제한
- Workers: 100,000 요청/일
- D1 Database: 5GB 저장소, 5M reads/일, 100K writes/일
- R2 Storage: 10GB 저장소
- Pages: 무제한 대역폭

### 유료 플랜으로 업그레이드 시
- Workers Paid: $5/월 (10M 요청 포함)
- D1: 초과 사용량에 따라 과금
- R2: $0.015/GB/월

---

## 🔐 보안 체크리스트

- [ ] JWT_SECRET 환경 변수를 프로덕션용으로 변경
- [ ] 비밀번호 해싱 알고리즘 확인 (SHA-256 사용 중)
- [ ] CORS 설정 확인
- [ ] API Rate Limiting 고려 (추후 추가 예정)
- [ ] SQL Injection 방지 확인 (Prepared Statements 사용 중)

---

## 📞 지원

배포 중 문제가 발생하면:

1. **Cloudflare Community**: https://community.cloudflare.com
2. **Hono Discord**: https://discord.gg/hono
3. **GitHub Issues**: [프로젝트 저장소]/issues

---

## ✅ 배포 완료 체크리스트

- [ ] Cloudflare API 키 설정 완료
- [ ] D1 데이터베이스 생성 및 마이그레이션 완료
- [ ] 프로젝트 빌드 성공
- [ ] Cloudflare Pages 프로젝트 생성 완료
- [ ] 첫 배포 성공
- [ ] API 엔드포인트 테스트 통과
- [ ] 웹 UI 접속 및 테스트 통과
- [ ] 환경 변수 설정 완료
- [ ] (선택) CI/CD 설정 완료
- [ ] (선택) 커스텀 도메인 연결 완료

---

축하합니다! 🎉  
Farm2World 플랫폼이 성공적으로 배포되었습니다!
