# 📊 Google Sheets로 제품 관리하기 (완전 가이드)

## 🎯 왜 Google Sheets 방식이 최고인가?

### ✅ **장점:**
- 📝 **엑셀처럼 쉬움** - 코드 몰라도 됨
- 🔄 **실시간 업데이트** - 시트만 수정하면 웹사이트 자동 반영
- 📱 **어디서나 수정** - 스마트폰에서도 가능
- 👥 **협업 가능** - 여러 사람이 함께 관리
- 💰 **완전 무료** - Google 계정만 있으면 됨

### ❌ **단점:**
- 초기 설정 필요 (한 번만, 30분)

---

## 🚀 설정 방법 (단계별)

### **1단계: Google Sheets 만들기**

1. Google Sheets 접속: https://sheets.google.com
2. **새로 만들기** 클릭
3. 제목: "MONOLAB 제품 관리"

---

### **2단계: 표 만들기**

**첫 번째 줄 (헤더):**

```
A열    B열   C열    D열          E열    F열        G열      H열               I열
id  | code | name | description | price | image_url | colors | production_days | active
```

**두 번째 줄부터 (제품 데이터):**

| id | code | name | description | price | image_url | colors | production_days | active |
|----|------|------|-------------|-------|-----------|--------|-----------------|--------|
| 1 | C003 | Хүүхдийн дурсгал | Танай хүүхдийн төрсөн өдрийн мэдээллийг захиалгат хэвлэсэн онцгой дурсгал | 40000 | https://www.genspark.ai/api/files/s/s45aRmVk?token=... | Олон өнгө | 1-3 өдөр | TRUE |
| 2 | C101 | Түлхүүр өлгүүр | 3D хэвлэсэн захиалгат түлхүүр өлгүүр | 8000 | https://example.com/keyring.jpg | Олон өнгө | 1-3 өдөр | TRUE |

---

### **3단계: Apps Script 설정**

1. Google Sheets 메뉴: **확장 프로그램** → **Apps Script**
2. 새 창이 열림
3. `GoogleSheets_Script.js` 파일 내용 **전체 복사**
4. Apps Script 창에 **붙여넣기** (기존 코드 삭제하고)
5. **저장** (Ctrl+S)
6. 프로젝트 이름: "MONOLAB Products API"

---

### **4단계: 웹 앱으로 배포**

1. Apps Script 화면에서 **배포** → **새 배포**
2. 톱니바퀴 아이콘 → **웹 앱** 선택
3. 설정:
   - **실행 계정**: 나
   - **액세스 권한**: **모든 사용자**
4. **배포** 클릭
5. **웹 앱 URL 복사** (예: https://script.google.com/macros/s/ABC123.../exec)

---

### **5단계: 웹사이트에 연결**

1. `js/script.js` 파일 열기
2. 파일 맨 위에 이 코드 추가:

```javascript
// Google Sheets API URL (여기에 복사한 URL 붙여넣기)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/복사한URL/exec';

// 페이지 로드 시 제품 불러오기
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromSheets();
});

// Google Sheets에서 제품 로드
async function loadProductsFromSheets() {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const data = await response.json();
        renderProducts(data.products);
    } catch (error) {
        console.error('제품 로드 실패:', error);
    }
}

// 제품 렌더링
function renderProducts(products) {
    const container = document.querySelector('.products-grid');
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
                <div class="product-badge">Шинэ</div>
            </div>
            <div class="product-info">
                <div class="product-code">${product.code}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price">${parseInt(product.price).toLocaleString()}₮</span>
                </div>
                <div class="product-meta">
                    <span><i class="fas fa-clock"></i> ${product.production_days}</span>
                    <span><i class="fas fa-palette"></i> ${product.colors}</span>
                </div>
                <button class="btn btn-primary btn-full" onclick="openProductModal(${product.id})">
                    Дэлгэрэнгүй харах
                </button>
            </div>
        </div>
    `).join('');
}
```

---

## ✅ **완료! 이제 사용법**

### **새 제품 추가:**

1. Google Sheets 열기
2. 새 줄 추가
3. 정보 입력:

```
id: 3
code: C102
name: Гар утасны хавчаар
description: 3D хэвлэсэн гар утасны хавчаар
price: 12000
image_url: https://example.com/phone-holder.jpg
colors: Олон өнгө
production_days: 1-3 өдөр
active: TRUE
```

4. **저장** (자동 저장)
5. 웹사이트 새로고침 → **제품 자동 표시!**

---

### **제품 수정:**

- 가격 변경? → price 열 수정
- 이름 변경? → name 열 수정
- 품절? → active를 FALSE로

---

### **제품 삭제:**

- active 열을 **FALSE**로 변경 (완전 삭제 아님, 숨김)

---

## 📱 **스마트폰에서도 가능**

1. Google Sheets 앱 설치
2. "MONOLAB 제품 관리" 시트 열기
3. 제품 추가/수정
4. 저장 → 웹사이트 자동 업데이트

---

## 🎨 **실제 사용 예시**

### **월요일:**
```
새 제품 3개 추가
→ Google Sheets에 3줄 추가
→ 5분 완료
```

### **화요일:**
```
가격 인하 이벤트
→ price 열만 수정
→ 1분 완료
```

### **수요일:**
```
품절 제품 숨기기
→ active를 FALSE로
→ 10초 완료
```

---

## ⚠️ **주의사항**

### **헤더(첫 줄) 절대 수정 금지:**
```
❌ 'name' → 'product_name' (이름 변경 금지)
❌ 열 순서 변경 금지
❌ 열 삭제 금지
```

### **데이터 형식:**
- **id**: 숫자만 (1, 2, 3...)
- **price**: 숫자만 (40000, 쉼표 없이)
- **active**: TRUE 또는 FALSE (대문자)

---

## 💰 **비용 비교**

| 방식 | 월 비용 | 제품 추가 | 난이도 |
|------|---------|----------|--------|
| 몽골 서비스 | 88,000₮ | 쉬움 | ⭐ |
| **Google Sheets** | **0₮** | **엑셀처럼** | **⭐⭐** |
| 직접 HTML 수정 | 0₮ | 복사/붙여넣기 | ⭐⭐⭐ |

---

## 🆘 **문제 해결**

### **제품이 안 보여요**
1. Google Sheets URL이 올바른지 확인
2. 브라우저 개발자 도구(F12) → Console 확인
3. CORS 에러? → Apps Script 배포 다시 확인

### **제품이 업데이트 안 돼요**
1. Google Sheets 저장했는지 확인
2. 강력 새로고침: Ctrl+Shift+R
3. 배포 버전 확인 (새 배포 필요할 수도)

---

## 🎯 **결론**

### **Google Sheets 방식 = 최고의 선택**

✅ **코딩 몰라도 됨**  
✅ **엑셀처럼 쉬움**  
✅ **완전 무료**  
✅ **스마트폰에서도 가능**  
✅ **실시간 업데이트**  

---

**설정 도와드릴까요?** 😊  
같이 단계별로 해보면 30분이면 완료됩니다!

시작할까요? 🚀
