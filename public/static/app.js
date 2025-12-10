// Farm2World Frontend JavaScript

const API_BASE = '/api';

// Get token from localStorage
function getToken() {
  return localStorage.getItem('farm2world_token');
}

// Set token to localStorage
function setToken(token) {
  localStorage.setItem('farm2world_token', token);
}

// Remove token
function removeToken() {
  localStorage.removeItem('farm2world_token');
}

// API request helper
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Login form handler
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (result.success) {
        setToken(result.data.token);
        alert('로그인 성공!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  });
}

// Register form handler
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const business_name = document.getElementById('business_name').value;

    try {
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          phone, 
          business_name,
          role: 'farmer'
        })
      });

      if (result.success) {
        setToken(result.data.token);
        alert('회원가입 성공!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  });
}

// Product form handler
if (document.getElementById('productForm')) {
  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
      name_ko: document.getElementById('name_ko').value,
      description_ko: document.getElementById('description_ko').value,
      category: document.getElementById('category').value,
      origin_region: document.getElementById('origin_region').value,
      price: parseFloat(document.getElementById('price').value),
      cost_price: parseFloat(document.getElementById('cost_price').value) || null,
      stock_quantity: parseInt(document.getElementById('stock_quantity').value),
      weight: parseFloat(document.getElementById('weight').value) || null,
      weight_unit: document.getElementById('weight_unit').value,
      auto_translate: document.getElementById('auto_translate').checked
    };

    try {
      const result = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });

      if (result.success) {
        alert('상품이 성공적으로 등록되었습니다!\n자동 번역이 완료되었습니다.');
        window.location.href = '/products';
      }
    } catch (error) {
      alert('상품 등록 실패: ' + error.message);
    }
  });
}

// Dashboard data loader
if (window.location.pathname === '/dashboard') {
  async function loadDashboardData() {
    try {
      // Load products count
      const productsResult = await apiRequest('/products?limit=1');
      if (productsResult.success) {
        document.getElementById('totalProducts').textContent = 
          productsResult.data.pagination.total;
      }

      // Load orders count
      const ordersResult = await apiRequest('/orders?status=processing&limit=1');
      if (ordersResult.success) {
        document.getElementById('activeOrders').textContent = 
          ordersResult.data.pagination.total;
      }

      // Load settlements summary
      const settlementsResult = await apiRequest('/settlements/summary');
      if (settlementsResult.success) {
        const monthlyRevenue = settlementsResult.data.total_paid || 0;
        document.getElementById('monthlyRevenue').textContent = 
          '₩' + monthlyRevenue.toLocaleString();
        
        const pendingRevenue = settlementsResult.data.total_pending || 0;
        document.getElementById('pendingSettlements').textContent = 
          '₩' + pendingRevenue.toLocaleString();
      }

      // Load recent orders
      const recentOrdersResult = await apiRequest('/orders?limit=5');
      if (recentOrdersResult.success && recentOrdersResult.data.orders.length > 0) {
        const ordersHtml = recentOrdersResult.data.orders.map(order => `
          <div class="border-b pb-4">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-semibold">${order.order_number}</div>
                <div class="text-sm text-gray-500">${order.customer_name} - ${order.platform_name}</div>
              </div>
              <div class="text-right">
                <div class="font-bold">${order.currency} ${order.total_amount.toLocaleString()}</div>
                <div class="text-sm">
                  <span class="px-2 py-1 rounded text-xs ${getStatusColor(order.status)}">
                    ${getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        `).join('');
        
        document.getElementById('recentOrders').innerHTML = ordersHtml;
      } else {
        document.getElementById('recentOrders').innerHTML = 
          '<div class="text-gray-500 text-center py-4">주문이 없습니다</div>';
      }

    } catch (error) {
      console.error('Dashboard data load error:', error);
    }
  }

  function getStatusColor(status) {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  function getStatusText(status) {
    const texts = {
      pending: '대기',
      confirmed: '확인됨',
      processing: '처리중',
      shipped: '배송중',
      delivered: '완료',
      cancelled: '취소됨'
    };
    return texts[status] || status;
  }

  // Check if user is logged in
  if (!getToken()) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
  } else {
    loadDashboardData();
  }
}

// Auto-logout on 401
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('Unauthorized')) {
    removeToken();
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    window.location.href = '/login';
  }
});
