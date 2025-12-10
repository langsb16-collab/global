import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import type { Env } from './types'

// Import routes
import auth from './routes/auth'
import products from './routes/products'
import orders from './routes/orders'
import settlements from './routes/settlements'

const app = new Hono<{ Bindings: Env }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// API Routes
app.route('/api/auth', auth)
app.route('/api/products', products)
app.route('/api/orders', orders)
app.route('/api/settlements', settlements)

// Frontend routes
app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div>
      <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <h1 class="text-5xl font-bold mb-4">🌾 Farm2World</h1>
          <p class="text-2xl mb-2">농수산물 글로벌 판매 대행 플랫폼</p>
          <p class="text-lg opacity-90">한 번의 등록으로 전 세계 10개 이상의 플랫폼에 상품을 자동 업로드</p>
          <div class="mt-8 space-x-4">
            <a href="/dashboard" class="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 inline-block">
              시작하기
            </a>
            <a href="/login" class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-green-600 inline-block">
              로그인
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-center mb-12">주요 기능</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="text-4xl mb-4">🌐</div>
            <h3 class="text-xl font-bold mb-2">자동 다국어 번역</h3>
            <p class="text-gray-600">한국어로 입력하면 영어, 중국어, 일본어로 자동 번역</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="text-4xl mb-4">🚀</div>
            <h3 class="text-xl font-bold mb-2">10개 플랫폼 동시 업로드</h3>
            <p class="text-gray-600">Amazon, Shopee, Lazada, Etsy 등에 자동 등록</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-bold mb-2">자동 정산 시스템</h3>
            <p class="text-gray-600">환율, 수수료 자동 계산 및 통합 정산</p>
          </div>
        </div>

        <div class="mt-16 bg-blue-50 p-8 rounded-lg">
          <h2 class="text-3xl font-bold mb-4">지원 플랫폼</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded text-center font-semibold">Amazon</div>
            <div class="bg-white p-4 rounded text-center font-semibold">Shopee</div>
            <div class="bg-white p-4 rounded text-center font-semibold">Lazada</div>
            <div class="bg-white p-4 rounded text-center font-semibold">Etsy</div>
            <div class="bg-white p-4 rounded text-center font-semibold">Alibaba</div>
            <div class="bg-white p-4 rounded text-center font-semibold">Rakuten</div>
            <div class="bg-white p-4 rounded text-center font-semibold">Coupang</div>
            <div class="bg-white p-4 rounded text-center font-semibold">Yami</div>
          </div>
        </div>
      </div>
    </div>
  )
})

app.get('/login', (c) => {
  return c.render(
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-center mb-8">로그인</h1>
        
        <form id="loginForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">이메일</label>
            <input type="email" id="email" required 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
              placeholder="your@email.com" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">비밀번호</label>
            <input type="password" id="password" required 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
              placeholder="••••••••" />
          </div>
          
          <button type="submit" 
            class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
            로그인
          </button>
        </form>
        
        <p class="text-center mt-4 text-sm">
          계정이 없으신가요? <a href="/register" class="text-blue-600 font-semibold">회원가입</a>
        </p>
      </div>
    </div>
  )
})

app.get('/register', (c) => {
  return c.render(
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-center mb-8">회원가입</h1>
        
        <form id="registerForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">이메일</label>
            <input type="email" id="email" required 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">비밀번호</label>
            <input type="password" id="password" required 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">이름</label>
            <input type="text" id="name" required 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">전화번호</label>
            <input type="tel" id="phone" 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">사업자명</label>
            <input type="text" id="business_name" 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <button type="submit" 
            class="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">
            가입하기
          </button>
        </form>
        
        <p class="text-center mt-4 text-sm">
          이미 계정이 있으신가요? <a href="/login" class="text-blue-600 font-semibold">로그인</a>
        </p>
      </div>
    </div>
  )
})

app.get('/dashboard', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-green-600">Farm2World</h1>
            <div class="space-x-4">
              <a href="/dashboard" class="text-gray-700 hover:text-green-600">대시보드</a>
              <a href="/products" class="text-gray-700 hover:text-green-600">상품관리</a>
              <a href="/orders" class="text-gray-700 hover:text-green-600">주문관리</a>
              <a href="/settlements" class="text-gray-700 hover:text-green-600">정산</a>
              <a href="/" class="text-gray-700 hover:text-green-600">로그아웃</a>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold mb-8">대시보드</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-sm text-gray-500 mb-2">총 상품</div>
            <div class="text-3xl font-bold" id="totalProducts">-</div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-sm text-gray-500 mb-2">진행중 주문</div>
            <div class="text-3xl font-bold text-blue-600" id="activeOrders">-</div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-sm text-gray-500 mb-2">이번 달 매출</div>
            <div class="text-3xl font-bold text-green-600" id="monthlyRevenue">-</div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-sm text-gray-500 mb-2">대기중 정산</div>
            <div class="text-3xl font-bold text-orange-600" id="pendingSettlements">-</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow mb-8">
          <h3 class="text-xl font-bold mb-4">빠른 시작</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/products/new" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 text-center">
              <div class="text-3xl mb-2">➕</div>
              <div class="font-semibold">새 상품 등록</div>
            </a>
            
            <a href="/products" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-center">
              <div class="text-3xl mb-2">📦</div>
              <div class="font-semibold">상품 관리</div>
            </a>
            
            <a href="/orders" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 text-center">
              <div class="text-3xl mb-2">📋</div>
              <div class="font-semibold">주문 확인</div>
            </a>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-xl font-bold mb-4">최근 주문</h3>
          <div id="recentOrders" class="space-y-4">
            <div class="text-gray-500 text-center py-4">로딩 중...</div>
          </div>
        </div>
      </div>
    </div>
  )
})

app.get('/products/new', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-green-600">Farm2World</h1>
            <div class="space-x-4">
              <a href="/dashboard" class="text-gray-700 hover:text-green-600">대시보드</a>
              <a href="/products" class="text-gray-700 hover:text-green-600">상품관리</a>
              <a href="/orders" class="text-gray-700 hover:text-green-600">주문관리</a>
              <a href="/settlements" class="text-gray-700 hover:text-green-600">정산</a>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold mb-8">새 상품 등록</h2>
        
        <div class="bg-white p-8 rounded-lg shadow">
          <form id="productForm" class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-2">상품명 (한국어) *</label>
              <input type="text" id="name_ko" required 
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" 
                placeholder="예: 프리미엄 김" />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">상품 설명 (한국어) *</label>
              <textarea id="description_ko" required rows="4"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" 
                placeholder="상품에 대한 자세한 설명을 입력하세요. 자동으로 영어, 중국어, 일본어로 번역됩니다."></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">카테고리 *</label>
                <select id="category" required 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="">선택하세요</option>
                  <option value="seafood">수산물</option>
                  <option value="grain">곡물</option>
                  <option value="vegetable">채소</option>
                  <option value="fruit">과일</option>
                  <option value="condiment">양념/장류</option>
                  <option value="processed">가공식품</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">원산지 지역</label>
                <input type="text" id="origin_region" 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="예: 전라남도 완도" />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">판매가 (KRW) *</label>
                <input type="number" id="price" required min="0"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="15000" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">원가 (KRW)</label>
                <input type="number" id="cost_price" min="0"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="8000" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">재고 수량 *</label>
                <input type="number" id="stock_quantity" required min="0"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="100" />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">중량</label>
                <input type="number" id="weight" step="0.01" min="0"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="0.5" />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">단위</label>
                <select id="weight_unit" 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
            
            <div class="flex items-center">
              <input type="checkbox" id="auto_translate" checked 
                class="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
              <label for="auto_translate" class="ml-2 text-sm">
                자동 번역 활성화 (영어, 중국어, 일본어)
              </label>
            </div>
            
            <div class="flex space-x-4">
              <button type="submit" 
                class="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                상품 등록
              </button>
              <a href="/products" 
                class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 text-center">
                취소
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

export default app
