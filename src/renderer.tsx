import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* SEO Meta Tags */}
        <title>Farm2World - 농수산물 글로벌 판매 대행 플랫폼</title>
        <meta name="description" content="한 번의 등록으로 전 세계 10개 이상의 플랫폼에 농수산물을 자동 업로드. AI 기반 가격 추천, 자동 번역, 에스크로 결제까지." />
        <meta name="keywords" content="농수산물, 글로벌 판매, 수출, Amazon, Shopee, Lazada, 농민, 소상공인, B2B, 전자상거래" />
        <meta name="author" content="Farm2World" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Farm2World - 농수산물 글로벌 판매 대행 플랫폼" />
        <meta property="og:description" content="한 번의 등록으로 전 세계 10개 이상의 플랫폼에 농수산물을 자동 업로드" />
        <meta property="og:url" content="https://p2p.io.kr" />
        <meta property="og:site_name" content="Farm2World" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="zh_CN" />
        <meta property="og:locale:alternate" content="ja_JP" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Farm2World - 농수산물 글로벌 판매 대행 플랫폼" />
        <meta name="twitter:description" content="한 번의 등록으로 전 세계 10개 이상의 플랫폼에 농수산물을 자동 업로드" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌾</text></svg>" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://p2p.io.kr" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        
        {/* Mobile Optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50">{children}
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
