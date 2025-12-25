// Farm2World Frontend JavaScript with Multi-language Support

const API_BASE = '/api';

// Multi-language translations
const translations = {
  'ko': {
    name: '한국어',
    flag: '🇰🇷',
    menu: {
      dashboard: '대시보드',
      products: '상품관리',
      orders: '주문관리',
      settlements: '정산',
      logout: '로그아웃'
    },
    home: {
      title: 'Farm2World',
      subtitle: '농수산물 글로벌 판매 대행 플랫폼',
      description: '한 번의 등록으로 전 세계 10개 이상의 플랫폼에 상품을 자동 업로드',
      getStarted: '시작하기',
      login: '로그인'
    },
    features: {
      title: '주요 기능',
      autoTranslation: '자동 다국어 번역',
      autoTranslationDesc: '한국어로 입력하면 영어, 중국어, 일본어로 자동 번역',
      multiPlatform: '10개 플랫폼 동시 업로드',
      multiPlatformDesc: 'Amazon, Shopee, Lazada, Etsy 등에 자동 등록',
      settlement: '자동 정산 시스템',
      settlementDesc: '환율, 수수료 자동 계산 및 통합 정산'
    },
    platforms: {
      title: '지원 플랫폼'
    },
    stats: {
      totalProducts: '총 상품',
      activeOrders: '진행중 주문',
      monthlyRevenue: '이번 달 매출',
      pendingSettlements: '대기중 정산'
    },
    quickActions: {
      title: '빠른 시작',
      newProduct: '새 상품 등록',
      manageProducts: '상품 관리',
      checkOrders: '주문 확인'
    },
    recentOrders: {
      title: '최근 주문'
    },
    auth: {
      loginTitle: '로그인',
      registerTitle: '회원가입',
      email: '이메일',
      password: '비밀번호',
      name: '이름',
      phone: '전화번호',
      businessName: '사업자명',
      loginButton: '로그인',
      registerButton: '가입하기',
      noAccount: '계정이 없으신가요?',
      hasAccount: '이미 계정이 있으신가요?'
    },
    product: {
      title: '새 상품 등록',
      name: '상품명 (한국어)',
      description: '상품 설명 (한국어)',
      category: '카테고리',
      selectCategory: '선택하세요',
      seafood: '수산물',
      grain: '곡물',
      vegetable: '채소',
      fruit: '과일',
      condiment: '양념/장류',
      processed: '가공식품',
      origin: '원산지 지역',
      price: '판매가 (KRW)',
      costPrice: '원가 (KRW)',
      stock: '재고 수량',
      weight: '중량',
      unit: '단위',
      autoTranslate: '자동 번역 활성화',
      autoTranslateDesc: '(영어, 중국어, 일본어)',
      submit: '상품 등록',
      cancel: '취소'
    }
  },
  'ja': {
    name: '日本語',
    flag: '🇯🇵',
    menu: {
      dashboard: 'ダッシュボード',
      products: '商品管理',
      orders: '注文管理',
      settlements: '決済',
      logout: 'ログアウト'
    },
    home: {
      title: 'Farm2World',
      subtitle: '農水産物グローバル販売代行プラットフォーム',
      description: '一度の登録で世界10以上のプラットフォームに商品を自動アップロード',
      getStarted: '始める',
      login: 'ログイン'
    },
    features: {
      title: '主な機能',
      autoTranslation: '自動多言語翻訳',
      autoTranslationDesc: '韓国語で入力すると英語、中国語、日本語に自動翻訳',
      multiPlatform: '10プラットフォーム同時アップロード',
      multiPlatformDesc: 'Amazon、Shopee、Lazada、Etsyなどに自動登録',
      settlement: '自動決済システム',
      settlementDesc: '為替レート、手数料自動計算及び統合決済'
    },
    platforms: {
      title: '対応プラットフォーム'
    },
    stats: {
      totalProducts: '総商品数',
      activeOrders: '進行中の注文',
      monthlyRevenue: '今月の売上',
      pendingSettlements: '保留中の決済'
    },
    quickActions: {
      title: 'クイックスタート',
      newProduct: '新規商品登録',
      manageProducts: '商品管理',
      checkOrders: '注文確認'
    },
    recentOrders: {
      title: '最近の注文'
    },
    auth: {
      loginTitle: 'ログイン',
      registerTitle: '会員登録',
      email: 'メール',
      password: 'パスワード',
      name: '名前',
      phone: '電話番号',
      businessName: '事業者名',
      loginButton: 'ログイン',
      registerButton: '登録',
      noAccount: 'アカウントをお持ちでないですか？',
      hasAccount: 'すでにアカウントをお持ちですか？'
    },
    product: {
      title: '新規商品登録',
      name: '商品名（韓国語）',
      description: '商品説明（韓国語）',
      category: 'カテゴリー',
      selectCategory: '選択してください',
      seafood: '水産物',
      grain: '穀物',
      vegetable: '野菜',
      fruit: '果物',
      condiment: '調味料/醤類',
      processed: '加工食品',
      origin: '原産地地域',
      price: '販売価格（KRW）',
      costPrice: '原価（KRW）',
      stock: '在庫数量',
      weight: '重量',
      unit: '単位',
      autoTranslate: '自動翻訳を有効にする',
      autoTranslateDesc: '（英語、中国語、日本語）',
      submit: '商品登録',
      cancel: 'キャンセル'
    }
  },
  'zh-CN': {
    name: '中文（简体）',
    flag: '🇨🇳',
    menu: {
      dashboard: '仪表板',
      products: '商品管理',
      orders: '订单管理',
      settlements: '结算',
      logout: '登出'
    },
    home: {
      title: 'Farm2World',
      subtitle: '农水产品全球销售代理平台',
      description: '一次注册即可自动上传到全球10多个平台',
      getStarted: '开始',
      login: '登录'
    },
    features: {
      title: '主要功能',
      autoTranslation: '自动多语言翻译',
      autoTranslationDesc: '用韩语输入后自动翻译成英语、中文、日语',
      multiPlatform: '10个平台同时上传',
      multiPlatformDesc: '自动注册到Amazon、Shopee、Lazada、Etsy等',
      settlement: '自动结算系统',
      settlementDesc: '汇率、手续费自动计算及综合结算'
    },
    platforms: {
      title: '支持平台'
    },
    stats: {
      totalProducts: '总商品数',
      activeOrders: '进行中订单',
      monthlyRevenue: '本月销售额',
      pendingSettlements: '待结算'
    },
    quickActions: {
      title: '快速开始',
      newProduct: '新商品注册',
      manageProducts: '商品管理',
      checkOrders: '订单确认'
    },
    recentOrders: {
      title: '最近订单'
    },
    auth: {
      loginTitle: '登录',
      registerTitle: '注册',
      email: '邮箱',
      password: '密码',
      name: '姓名',
      phone: '电话号码',
      businessName: '企业名称',
      loginButton: '登录',
      registerButton: '注册',
      noAccount: '还没有账号？',
      hasAccount: '已有账号？'
    },
    product: {
      title: '新商品注册',
      name: '商品名称（韩语）',
      description: '商品说明（韩语）',
      category: '分类',
      selectCategory: '请选择',
      seafood: '水产品',
      grain: '谷物',
      vegetable: '蔬菜',
      fruit: '水果',
      condiment: '调味料/酱类',
      processed: '加工食品',
      origin: '原产地地区',
      price: '销售价格（KRW）',
      costPrice: '成本价（KRW）',
      stock: '库存数量',
      weight: '重量',
      unit: '单位',
      autoTranslate: '启用自动翻译',
      autoTranslateDesc: '（英语、中文、日语）',
      submit: '注册商品',
      cancel: '取消'
    }
  },
  'zh-HK': {
    name: '中文（繁體-廣東話）',
    flag: '🇭🇰',
    menu: {
      dashboard: '儀表板',
      products: '商品管理',
      orders: '訂單管理',
      settlements: '結算',
      logout: '登出'
    },
    home: {
      title: 'Farm2World',
      subtitle: '農水產品全球銷售代理平台',
      description: '一次註冊即可自動上傳到全球10多個平台',
      getStarted: '開始',
      login: '登入'
    },
    features: {
      title: '主要功能',
      autoTranslation: '自動多語言翻譯',
      autoTranslationDesc: '用韓語輸入後自動翻譯成英語、中文、日語',
      multiPlatform: '10個平台同時上傳',
      multiPlatformDesc: '自動註冊到Amazon、Shopee、Lazada、Etsy等',
      settlement: '自動結算系統',
      settlementDesc: '匯率、手續費自動計算及綜合結算'
    },
    platforms: {
      title: '支援平台'
    },
    stats: {
      totalProducts: '總商品數',
      activeOrders: '進行中訂單',
      monthlyRevenue: '本月銷售額',
      pendingSettlements: '待結算'
    },
    quickActions: {
      title: '快速開始',
      newProduct: '新商品註冊',
      manageProducts: '商品管理',
      checkOrders: '訂單確認'
    },
    recentOrders: {
      title: '最近訂單'
    },
    auth: {
      loginTitle: '登入',
      registerTitle: '註冊',
      email: '電郵',
      password: '密碼',
      name: '姓名',
      phone: '電話號碼',
      businessName: '企業名稱',
      loginButton: '登入',
      registerButton: '註冊',
      noAccount: '還沒有賬號？',
      hasAccount: '已有賬號？'
    },
    product: {
      title: '新商品註冊',
      name: '商品名稱（韓語）',
      description: '商品說明（韓語）',
      category: '分類',
      selectCategory: '請選擇',
      seafood: '水產品',
      grain: '穀物',
      vegetable: '蔬菜',
      fruit: '水果',
      condiment: '調味料/醬類',
      processed: '加工食品',
      origin: '原產地地區',
      price: '銷售價格（KRW）',
      costPrice: '成本價（KRW）',
      stock: '庫存數量',
      weight: '重量',
      unit: '單位',
      autoTranslate: '啟用自動翻譯',
      autoTranslateDesc: '（英語、中文、日語）',
      submit: '註冊商品',
      cancel: '取消'
    }
  },
  'en': {
    name: 'English',
    flag: '🇺🇸',
    menu: {
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      settlements: 'Settlements',
      logout: 'Logout'
    },
    home: {
      title: 'Farm2World',
      subtitle: 'Global Agricultural Products Sales Platform',
      description: 'Upload your products to 10+ global platforms with one registration',
      getStarted: 'Get Started',
      login: 'Login'
    },
    features: {
      title: 'Key Features',
      autoTranslation: 'Auto Multi-language Translation',
      autoTranslationDesc: 'Automatic translation to English, Chinese, Japanese',
      multiPlatform: 'Upload to 10+ Platforms',
      multiPlatformDesc: 'Auto registration to Amazon, Shopee, Lazada, Etsy, etc.',
      settlement: 'Auto Settlement System',
      settlementDesc: 'Automatic exchange rate & fee calculation'
    },
    platforms: {
      title: 'Supported Platforms'
    },
    stats: {
      totalProducts: 'Total Products',
      activeOrders: 'Active Orders',
      monthlyRevenue: 'Monthly Revenue',
      pendingSettlements: 'Pending Settlements'
    },
    quickActions: {
      title: 'Quick Actions',
      newProduct: 'New Product',
      manageProducts: 'Manage Products',
      checkOrders: 'Check Orders'
    },
    recentOrders: {
      title: 'Recent Orders'
    },
    auth: {
      loginTitle: 'Login',
      registerTitle: 'Sign Up',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
      businessName: 'Business Name',
      loginButton: 'Login',
      registerButton: 'Sign Up',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?'
    },
    product: {
      title: 'New Product Registration',
      name: 'Product Name (Korean)',
      description: 'Product Description (Korean)',
      category: 'Category',
      selectCategory: 'Please select',
      seafood: 'Seafood',
      grain: 'Grain',
      vegetable: 'Vegetable',
      fruit: 'Fruit',
      condiment: 'Condiment/Sauce',
      processed: 'Processed Food',
      origin: 'Origin Region',
      price: 'Price (KRW)',
      costPrice: 'Cost Price (KRW)',
      stock: 'Stock Quantity',
      weight: 'Weight',
      unit: 'Unit',
      autoTranslate: 'Enable Auto Translation',
      autoTranslateDesc: '(English, Chinese, Japanese)',
      submit: 'Register Product',
      cancel: 'Cancel'
    }
  },
  'vi': {
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    menu: {
      dashboard: 'Bảng điều khiển',
      products: 'Quản lý sản phẩm',
      orders: 'Quản lý đơn hàng',
      settlements: 'Thanh toán',
      logout: 'Đăng xuất'
    },
    home: {
      title: 'Farm2World',
      subtitle: 'Nền tảng bán hàng nông sản toàn cầu',
      description: 'Đăng ký một lần để tự động tải lên 10+ nền tảng toàn cầu',
      getStarted: 'Bắt đầu',
      login: 'Đăng nhập'
    },
    features: {
      title: 'Tính năng chính',
      autoTranslation: 'Dịch tự động đa ngôn ngữ',
      autoTranslationDesc: 'Tự động dịch sang tiếng Anh, Trung, Nhật',
      multiPlatform: 'Tải lên 10+ nền tảng',
      multiPlatformDesc: 'Tự động đăng ký Amazon, Shopee, Lazada, Etsy',
      settlement: 'Hệ thống thanh toán tự động',
      settlementDesc: 'Tự động tính tỷ giá và phí'
    },
    platforms: {
      title: 'Nền tảng hỗ trợ'
    },
    stats: {
      totalProducts: 'Tổng sản phẩm',
      activeOrders: 'Đơn hàng đang xử lý',
      monthlyRevenue: 'Doanh thu tháng này',
      pendingSettlements: 'Thanh toán chờ xử lý'
    },
    quickActions: {
      title: 'Thao tác nhanh',
      newProduct: 'Đăng ký sản phẩm mới',
      manageProducts: 'Quản lý sản phẩm',
      checkOrders: 'Kiểm tra đơn hàng'
    },
    recentOrders: {
      title: 'Đơn hàng gần đây'
    },
    auth: {
      loginTitle: 'Đăng nhập',
      registerTitle: 'Đăng ký',
      email: 'Email',
      password: 'Mật khẩu',
      name: 'Tên',
      phone: 'Số điện thoại',
      businessName: 'Tên doanh nghiệp',
      loginButton: 'Đăng nhập',
      registerButton: 'Đăng ký',
      noAccount: 'Chưa có tài khoản?',
      hasAccount: 'Đã có tài khoản?'
    },
    product: {
      title: 'Đăng ký sản phẩm mới',
      name: 'Tên sản phẩm (Tiếng Hàn)',
      description: 'Mô tả sản phẩm (Tiếng Hàn)',
      category: 'Danh mục',
      selectCategory: 'Vui lòng chọn',
      seafood: 'Hải sản',
      grain: 'Ngũ cốc',
      vegetable: 'Rau củ',
      fruit: 'Trái cây',
      condiment: 'Gia vị/Tương',
      processed: 'Thực phẩm chế biến',
      origin: 'Vùng xuất xứ',
      price: 'Giá bán (KRW)',
      costPrice: 'Giá vốn (KRW)',
      stock: 'Số lượng tồn kho',
      weight: 'Trọng lượng',
      unit: 'Đơn vị',
      autoTranslate: 'Bật dịch tự động',
      autoTranslateDesc: '(Tiếng Anh, Trung, Nhật)',
      submit: 'Đăng ký sản phẩm',
      cancel: 'Hủy'
    }
  },
  'th': {
    name: 'ภาษาไทย',
    flag: '🇹🇭',
    menu: {
      dashboard: 'แดชบอร์ด',
      products: 'จัดการสินค้า',
      orders: 'จัดการคำสั่งซื้อ',
      settlements: 'การชำระเงิน',
      logout: 'ออกจากระบบ'
    },
    home: {
      title: 'Farm2World',
      subtitle: 'แพลตฟอร์มขายสินค้าเกษตรทั่วโลก',
      description: 'ลงทะเบียนครั้งเดียว อัปโหลดอัตโนมัติไปยัง 10+ แพลตฟอร์มทั่วโลก',
      getStarted: 'เริ่มต้น',
      login: 'เข้าสู่ระบบ'
    },
    features: {
      title: 'คุณสมบัติหลัก',
      autoTranslation: 'แปลภาษาอัตโนมัติ',
      autoTranslationDesc: 'แปลอัตโนมัติเป็นอังกฤษ จีน ญี่ปุ่น',
      multiPlatform: 'อัปโหลดไปยัง 10+ แพลตฟอร์ม',
      multiPlatformDesc: 'ลงทะเบียนอัตโนมัติกับ Amazon, Shopee, Lazada, Etsy',
      settlement: 'ระบบชำระเงินอัตโนมัติ',
      settlementDesc: 'คำนวณอัตราแลกเปลี่ยนและค่าธรรมเนียมอัตโนมัติ'
    },
    platforms: {
      title: 'แพลตฟอร์มที่รองรับ'
    },
    stats: {
      totalProducts: 'สินค้าทั้งหมด',
      activeOrders: 'คำสั่งซื้อที่กำลังดำเนินการ',
      monthlyRevenue: 'ยอดขายเดือนนี้',
      pendingSettlements: 'การชำระเงินที่รอดำเนินการ'
    },
    quickActions: {
      title: 'การดำเนินการด่วน',
      newProduct: 'ลงทะเบียนสินค้าใหม่',
      manageProducts: 'จัดการสินค้า',
      checkOrders: 'ตรวจสอบคำสั่งซื้อ'
    },
    recentOrders: {
      title: 'คำสั่งซื้อล่าสุด'
    },
    auth: {
      loginTitle: 'เข้าสู่ระบบ',
      registerTitle: 'ลงทะเบียน',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      name: 'ชื่อ',
      phone: 'หมายเลขโทรศัพท์',
      businessName: 'ชื่อธุรกิจ',
      loginButton: 'เข้าสู่ระบบ',
      registerButton: 'ลงทะเบียน',
      noAccount: 'ยังไม่มีบัญชี?',
      hasAccount: 'มีบัญชีแล้ว?'
    },
    product: {
      title: 'ลงทะเบียนสินค้าใหม่',
      name: 'ชื่อสินค้า (ภาษาเกาหลี)',
      description: 'รายละเอียดสินค้า (ภาษาเกาหลี)',
      category: 'หมวดหมู่',
      selectCategory: 'กรุณาเลือก',
      seafood: 'อาหารทะเล',
      grain: 'ธัญพืช',
      vegetable: 'ผัก',
      fruit: 'ผลไม้',
      condiment: 'เครื่องปรุง/ซอส',
      processed: 'อาหารแปรรูป',
      origin: 'ภูมิภาคต้นกำเนิด',
      price: 'ราคาขาย (KRW)',
      costPrice: 'ราคาทุน (KRW)',
      stock: 'จำนวนสต็อก',
      weight: 'น้ำหนัก',
      unit: 'หน่วย',
      autoTranslate: 'เปิดใช้งานการแปลอัตโนมัติ',
      autoTranslateDesc: '(อังกฤษ, จีน, ญี่ปุ่น)',
      submit: 'ลงทะเบียนสินค้า',
      cancel: 'ยกเลิก'
    }
  },
  'id': {
    name: 'Bahasa Indonesia',
    flag: '🇮🇩',
    menu: {
      dashboard: 'Dasbor',
      products: 'Kelola Produk',
      orders: 'Kelola Pesanan',
      settlements: 'Pembayaran',
      logout: 'Keluar'
    },
    home: {
      title: 'Farm2World',
      subtitle: 'Platform Penjualan Produk Pertanian Global',
      description: 'Daftar sekali untuk mengunggah otomatis ke 10+ platform global',
      getStarted: 'Mulai',
      login: 'Masuk'
    },
    features: {
      title: 'Fitur Utama',
      autoTranslation: 'Terjemahan Otomatis Multi-bahasa',
      autoTranslationDesc: 'Terjemahan otomatis ke Inggris, Cina, Jepang',
      multiPlatform: 'Unggah ke 10+ Platform',
      multiPlatformDesc: 'Pendaftaran otomatis ke Amazon, Shopee, Lazada, Etsy',
      settlement: 'Sistem Pembayaran Otomatis',
      settlementDesc: 'Perhitungan kurs dan biaya otomatis'
    },
    platforms: {
      title: 'Platform yang Didukung'
    },
    stats: {
      totalProducts: 'Total Produk',
      activeOrders: 'Pesanan Aktif',
      monthlyRevenue: 'Pendapatan Bulan Ini',
      pendingSettlements: 'Pembayaran Tertunda'
    },
    quickActions: {
      title: 'Tindakan Cepat',
      newProduct: 'Daftar Produk Baru',
      manageProducts: 'Kelola Produk',
      checkOrders: 'Periksa Pesanan'
    },
    recentOrders: {
      title: 'Pesanan Terbaru'
    },
    auth: {
      loginTitle: 'Masuk',
      registerTitle: 'Daftar',
      email: 'Email',
      password: 'Kata Sandi',
      name: 'Nama',
      phone: 'Nomor Telepon',
      businessName: 'Nama Bisnis',
      loginButton: 'Masuk',
      registerButton: 'Daftar',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?'
    },
    product: {
      title: 'Pendaftaran Produk Baru',
      name: 'Nama Produk (Korea)',
      description: 'Deskripsi Produk (Korea)',
      category: 'Kategori',
      selectCategory: 'Silakan pilih',
      seafood: 'Makanan Laut',
      grain: 'Biji-bijian',
      vegetable: 'Sayuran',
      fruit: 'Buah',
      condiment: 'Bumbu/Saus',
      processed: 'Makanan Olahan',
      origin: 'Daerah Asal',
      price: 'Harga Jual (KRW)',
      costPrice: 'Harga Pokok (KRW)',
      stock: 'Jumlah Stok',
      weight: 'Berat',
      unit: 'Unit',
      autoTranslate: 'Aktifkan Terjemahan Otomatis',
      autoTranslateDesc: '(Inggris, Cina, Jepang)',
      submit: 'Daftar Produk',
      cancel: 'Batal'
    }
  },
  'ar': {
    name: 'العربية',
    flag: '🇸🇦',
    menu: {
      dashboard: 'لوحة التحكم',
      products: 'إدارة المنتجات',
      orders: 'إدارة الطلبات',
      settlements: 'التسويات',
      logout: 'تسجيل الخروج'
    },
    home: {
      title: 'Farm2World',
      subtitle: 'منصة مبيعات المنتجات الزراعية العالمية',
      description: 'سجل مرة واحدة للتحميل التلقائي إلى أكثر من 10 منصات عالمية',
      getStarted: 'ابدأ',
      login: 'تسجيل الدخول'
    },
    features: {
      title: 'الميزات الرئيسية',
      autoTranslation: 'ترجمة تلقائية متعددة اللغات',
      autoTranslationDesc: 'ترجمة تلقائية إلى الإنجليزية والصينية واليابانية',
      multiPlatform: 'التحميل إلى أكثر من 10 منصات',
      multiPlatformDesc: 'تسجيل تلقائي في Amazon و Shopee و Lazada و Etsy',
      settlement: 'نظام تسوية تلقائي',
      settlementDesc: 'حساب تلقائي لسعر الصرف والرسوم'
    },
    platforms: {
      title: 'المنصات المدعومة'
    },
    stats: {
      totalProducts: 'إجمالي المنتجات',
      activeOrders: 'الطلبات النشطة',
      monthlyRevenue: 'الإيرادات الشهرية',
      pendingSettlements: 'التسويات المعلقة'
    },
    quickActions: {
      title: 'إجراءات سريعة',
      newProduct: 'تسجيل منتج جديد',
      manageProducts: 'إدارة المنتجات',
      checkOrders: 'التحقق من الطلبات'
    },
    recentOrders: {
      title: 'الطلبات الأخيرة'
    },
    auth: {
      loginTitle: 'تسجيل الدخول',
      registerTitle: 'التسجيل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      businessName: 'اسم العمل',
      loginButton: 'تسجيل الدخول',
      registerButton: 'التسجيل',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'هل لديك حساب بالفعل؟'
    },
    product: {
      title: 'تسجيل منتج جديد',
      name: 'اسم المنتج (كوري)',
      description: 'وصف المنتج (كوري)',
      category: 'الفئة',
      selectCategory: 'يرجى الاختيار',
      seafood: 'المأكولات البحرية',
      grain: 'الحبوب',
      vegetable: 'الخضروات',
      fruit: 'الفواكه',
      condiment: 'التوابل/الصلصات',
      processed: 'الأطعمة المصنعة',
      origin: 'منطقة المنشأ',
      price: 'سعر البيع (KRW)',
      costPrice: 'سعر التكلفة (KRW)',
      stock: 'كمية المخزون',
      weight: 'الوزن',
      unit: 'الوحدة',
      autoTranslate: 'تفعيل الترجمة التلقائية',
      autoTranslateDesc: '(الإنجليزية، الصينية، اليابانية)',
      submit: 'تسجيل المنتج',
      cancel: 'إلغاء'
    }
  },
  'hi': {
    name: 'हिन्दी',
    flag: '🇮🇳',
    menu: {
      dashboard: 'डैशबोर्ड',
      products: 'उत्पाद प्रबंधन',
      orders: 'ऑर्डर प्रबंधन',
      settlements: 'निपटान',
      logout: 'लॉग आउट'
    },
    home: {
      title: 'Farm2World',
      subtitle: 'वैश्विक कृषि उत्पाद बिक्री मंच',
      description: 'एक बार पंजीकरण करें और 10+ वैश्विक प्लेटफार्मों पर स्वचालित रूप से अपलोड करें',
      getStarted: 'शुरू करें',
      login: 'लॉग इन करें'
    },
    features: {
      title: 'मुख्य विशेषताएं',
      autoTranslation: 'स्वचालित बहुभाषी अनुवाद',
      autoTranslationDesc: 'अंग्रेजी, चीनी, जापानी में स्वचालित अनुवाद',
      multiPlatform: '10+ प्लेटफार्मों पर अपलोड',
      multiPlatformDesc: 'Amazon, Shopee, Lazada, Etsy में स्वचालित पंजीकरण',
      settlement: 'स्वचालित निपटान प्रणाली',
      settlementDesc: 'विनिमय दर और शुल्क की स्वचालित गणना'
    },
    platforms: {
      title: 'समर्थित प्लेटफॉर्म'
    },
    stats: {
      totalProducts: 'कुल उत्पाद',
      activeOrders: 'सक्रिय ऑर्डर',
      monthlyRevenue: 'मासिक राजस्व',
      pendingSettlements: 'लंबित निपटान'
    },
    quickActions: {
      title: 'त्वरित क्रियाएं',
      newProduct: 'नया उत्पाद पंजीकृत करें',
      manageProducts: 'उत्पाद प्रबंधित करें',
      checkOrders: 'ऑर्डर जांचें'
    },
    recentOrders: {
      title: 'हाल के ऑर्डर'
    },
    auth: {
      loginTitle: 'लॉग इन करें',
      registerTitle: 'पंजीकरण करें',
      email: 'ईमेल',
      password: 'पासवर्ड',
      name: 'नाम',
      phone: 'फोन नंबर',
      businessName: 'व्यवसाय का नाम',
      loginButton: 'लॉग इन करें',
      registerButton: 'पंजीकरण करें',
      noAccount: 'खाता नहीं है?',
      hasAccount: 'पहले से खाता है?'
    },
    product: {
      title: 'नया उत्पाद पंजीकरण',
      name: 'उत्पाद का नाम (कोरियाई)',
      description: 'उत्पाद विवरण (कोरियाई)',
      category: 'श्रेणी',
      selectCategory: 'कृपया चुनें',
      seafood: 'समुद्री भोजन',
      grain: 'अनाज',
      vegetable: 'सब्जी',
      fruit: 'फल',
      condiment: 'मसाला/सॉस',
      processed: 'प्रोसेस्ड फूड',
      origin: 'मूल क्षेत्र',
      price: 'विक्रय मूल्य (KRW)',
      costPrice: 'लागत मूल्य (KRW)',
      stock: 'स्टॉक मात्रा',
      weight: 'वजन',
      unit: 'इकाई',
      autoTranslate: 'स्वचालित अनुवाद सक्षम करें',
      autoTranslateDesc: '(अंग्रेजी, चीनी, जापानी)',
      submit: 'उत्पाद पंजीकृत करें',
      cancel: 'रद्द करें'
    }
  }
};

// Current language
let currentLang = localStorage.getItem('farm2world_lang') || 'ko';

// Get translation
function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  return value;
}

// Change language
function changeLang(lang) {
  currentLang = lang;
  localStorage.setItem('farm2world_lang', lang);
  location.reload();
}

// Create language selector dropdown
function createLanguageSelector() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  const langSelector = document.createElement('div');
  langSelector.className = 'relative inline-block';
  langSelector.innerHTML = `
    <button id="langButton" class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50">
      <span class="text-xl">${translations[currentLang].flag}</span>
      <span class="text-sm font-medium">${translations[currentLang].name}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <div id="langDropdown" class="hidden absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
      ${Object.keys(translations).map(lang => `
        <button onclick="changeLang('${lang}')" class="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 ${lang === currentLang ? 'bg-green-50' : ''}">
          <span class="text-2xl">${translations[lang].flag}</span>
          <span class="text-sm font-medium">${translations[lang].name}</span>
          ${lang === currentLang ? '<svg class="w-5 h-5 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' : ''}
        </button>
      `).join('')}
    </div>
  `;
  
  const navRight = nav.querySelector('.space-x-4') || nav.querySelector('.flex');
  if (navRight) {
    navRight.appendChild(langSelector);
  }
  
  // Toggle dropdown
  document.getElementById('langButton')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('langDropdown')?.classList.toggle('hidden');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    document.getElementById('langDropdown')?.classList.add('hidden');
  });
}

// Initialize language selector on page load
document.addEventListener('DOMContentLoaded', () => {
  createLanguageSelector();
});

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
        alert(t('auth.loginButton') + ' ' + t('home.getStarted') + '!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert(t('auth.loginButton') + ' failed: ' + error.message);
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
        alert(t('auth.registerButton') + ' ' + t('home.getStarted') + '!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert(t('auth.registerButton') + ' failed: ' + error.message);
    }
  });
}

// Product form handler
if (document.getElementById('productForm')) {
  // AI Price Suggestion
  document.getElementById('category')?.addEventListener('change', async (e) => {
    const category = e.target.value;
    const productName = document.getElementById('name_ko').value;
    const costPrice = parseFloat(document.getElementById('cost_price').value) || 0;
    
    if (category && productName) {
      try {
        const result = await apiRequest('/ai/suggest-price', {
          method: 'POST',
          body: JSON.stringify({ category, productName, costPrice })
        });
        
        if (result.success) {
          const suggestedPrice = result.pricing.suggestedPrice;
          document.getElementById('price').value = suggestedPrice;
          
          // Show suggestion tooltip
          showPriceSuggestion(result.pricing);
        }
      } catch (error) {
        console.error('Price suggestion error:', error);
      }
    }
  });
  
  // HS Code Suggestion
  document.getElementById('category')?.addEventListener('change', async (e) => {
    const category = e.target.value;
    const productName = document.getElementById('name_ko').value;
    
    if (category) {
      try {
        const result = await apiRequest('/ai/suggest-hs-code', {
          method: 'POST',
          body: JSON.stringify({ category, productName })
        });
        
        if (result.success) {
          // Display HS Code suggestion
          showHSCodeSuggestion(result);
        }
      } catch (error) {
        console.error('HS Code suggestion error:', error);
      }
    }
  });
  
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
        alert(t('product.submit') + ' ' + t('home.getStarted') + '!');
        window.location.href = '/products';
      }
    } catch (error) {
      alert(t('product.submit') + ' failed: ' + error.message);
    }
  });
  
  function showPriceSuggestion(pricing) {
    const priceInput = document.getElementById('price');
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm z-10';
    tooltip.innerHTML = `
      <div class="font-semibold mb-1">💡 AI ${t('features.autoTranslation')}</div>
      <div>${t('product.price')}: ₩${pricing.suggestedPrice.toLocaleString()}</div>
      <div class="text-xs text-gray-600 mt-1">${pricing.reasoning}</div>
    `;
    
    priceInput.parentElement.style.position = 'relative';
    priceInput.parentElement.appendChild(tooltip);
    
    setTimeout(() => tooltip.remove(), 5000);
  }
  
  function showHSCodeSuggestion(hsData) {
    const categorySelect = document.getElementById('category');
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm z-10';
    tooltip.innerHTML = `
      <div class="font-semibold mb-1">📋 HS Code ${t('features.autoTranslation')}</div>
      <div>${hsData.hsCode} - ${hsData.description}</div>
      <div class="text-xs text-gray-600 mt-1">${t('stats.pendingSettlements')}: ${(hsData.confidence * 100).toFixed(0)}%</div>
    `;
    
    categorySelect.parentElement.style.position = 'relative';
    categorySelect.parentElement.appendChild(tooltip);
    
    setTimeout(() => tooltip.remove(), 5000);
  }
}

// Dashboard data loader
if (window.location.pathname === '/dashboard') {
  async function loadDashboardData() {
    try {
      // Get user ID from token (for demo, using hardcoded value 1)
      const userId = 1; // In production, decode from JWT
      
      // Load dashboard stats
      const statsResult = await apiRequest(`/dashboard/stats?userId=${userId}`);
      if (statsResult.success) {
        const stats = statsResult.stats;
        document.getElementById('totalProducts').textContent = stats.products.total;
        document.getElementById('activeOrders').textContent = stats.orders.active;
        document.getElementById('monthlyRevenue').textContent = 
          '₩' + Math.round(stats.revenue.monthly).toLocaleString();
        document.getElementById('pendingSettlements').textContent = 
          '₩' + Math.round(stats.revenue.pendingSettlement).toLocaleString();
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
          `<div class="text-gray-500 text-center py-4">${t('recentOrders.title')}</div>`;
      }

      // Load inventory alerts
      loadInventoryAlerts(userId);

    } catch (error) {
      console.error('Dashboard data load error:', error);
    }
  }

  async function loadInventoryAlerts(userId) {
    try {
      const result = await apiRequest('/notifications/check-inventory');
      if (result.success && result.alerts.length > 0) {
        const alertsHtml = result.alerts.map(alert => `
          <div class="p-3 rounded ${alert.type === 'out_of_stock' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}">
            <div class="font-semibold text-sm">${alert.productName}</div>
            <div class="text-xs mt-1">${t('product.stock')}: ${alert.stockQuantity}</div>
          </div>
        `).join('');
        
        // Create alerts section if it doesn't exist
        const dashboardElement = document.querySelector('.max-w-7xl');
        if (dashboardElement && !document.getElementById('inventoryAlerts')) {
          const alertSection = document.createElement('div');
          alertSection.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow mb-8">
              <h3 class="text-xl font-bold mb-4">⚠️ ${t('product.stock')}</h3>
              <div id="inventoryAlerts" class="space-y-2">${alertsHtml}</div>
            </div>
          `;
          dashboardElement.insertBefore(alertSection, dashboardElement.children[2]);
        }
      }
    } catch (error) {
      console.error('Inventory alerts error:', error);
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
      'ko': {
        pending: '대기',
        confirmed: '확인됨',
        processing: '처리중',
        shipped: '배송중',
        delivered: '완료',
        cancelled: '취소됨'
      },
      'en': {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      },
      'ja': {
        pending: '待機中',
        confirmed: '確認済み',
        processing: '処理中',
        shipped: '配送中',
        delivered: '完了',
        cancelled: 'キャンセル'
      },
      'zh-CN': {
        pending: '待处理',
        confirmed: '已确认',
        processing: '处理中',
        shipped: '已发货',
        delivered: '已完成',
        cancelled: '已取消'
      }
    };
    return texts[currentLang]?.[status] || status;
  }

  // Check if user is logged in
  if (!getToken()) {
    alert(t('auth.loginTitle'));
    window.location.href = '/login';
  } else {
    loadDashboardData();
  }
}

// Auto-logout on 401
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('Unauthorized')) {
    removeToken();
    alert(t('menu.logout'));
    window.location.href = '/login';
  }
});
