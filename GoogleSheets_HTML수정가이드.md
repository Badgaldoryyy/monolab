# 🔧 Google Sheets 연동 - HTML 수정 가이드

## 📋 필요한 수정 사항

Google Sheets로 제품을 관리하려면 HTML에 몇 가지 요소를 추가해야 합니다.

---

## 1️⃣ Product Modal 수정

### **위치**: index.html에서 `<!-- Product Modal -->` 찾기

### **수정 전:**
```html
<div class="modal-body">
    <img id="modalProductImage" src="" alt="Product">
    
    <!-- 색상 선택 -->
    <div class="color-selection">
        <h3>Дүрсний өнгө сонгох</h3>
        <div class="color-options">
            <!-- 하드코딩된 색상들 -->
        </div>
    </div>
    
    <!-- 커스텀 필드 -->
    <div class="custom-fields">
        <!-- 하드코딩된 필드들 -->
    </div>
</div>
```

### **수정 후:**
```html
<div class="modal-body">
    <img id="modalProductImage" src="" alt="Product">
    
    <!-- 아기 모양 색상 선택 (동적으로 렌더링) -->
    <div id="shapeColorsSection" class="color-selection" style="display: none;">
        <h3>Дүрсний өнгө сонгох</h3>
        <div id="shapeColorsContainer" class="color-options">
            <!-- JavaScript로 동적 생성 -->
        </div>
    </div>
    
    <!-- 텍스트 색상 선택 (동적으로 렌더링) -->
    <div id="textColorsSection" class="color-selection" style="display: none;">
        <h3>Текстийн өнгө сонгох</h3>
        <div id="textColorsContainer" class="color-options">
            <!-- JavaScript로 동적 생성 -->
        </div>
    </div>
    
    <!-- 커스텀 필드 (동적으로 렌더링) -->
    <div id="customFieldsSection" class="custom-fields" style="display: none;">
        <h3>Захиалгат мэдээлэл</h3>
        <div id="customFieldsContainer" class="form-row">
            <!-- JavaScript로 동적 생성 -->
        </div>
    </div>
    
    <!-- 수량 선택 -->
    <div class="quantity-selector">
        <label>Тоо ширхэг:</label>
        <button type="button" onclick="decreaseQty()">-</button>
        <input type="number" id="quantity" value="1" min="1">
        <button type="button" onclick="increaseQty()">+</button>
    </div>
    
    <!-- 버튼 -->
    <button class="btn btn-primary btn-full" onclick="addToCartFromSheets()">
        Сагсанд нэмэх
    </button>
    <button class="btn btn-secondary btn-full" onclick="orderNowFromSheets()">
        Шууд захиалах
    </button>
    
    <!-- 주의사항 -->
    <div class="warning-box">
        <!-- 기존 주의사항 유지 -->
    </div>
</div>
```

---

## 2️⃣ Products Grid 수정

### **위치**: index.html에서 `<!-- Featured Products -->` 찾기

### **수정 전:**
```html
<div class="products-grid">
    <!-- 하드코딩된 제품 카드들 -->
    <div class="product-card">
        ...
    </div>
</div>
```

### **수정 후:**
```html
<div class="products-grid">
    <!-- JavaScript가 Google Sheets에서 동적으로 생성 -->
    <!-- 로딩 중 표시 (선택사항) -->
    <div class="loading-message" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i>
        <p style="margin-top: 1rem;">Бүтээгдэхүүн ачаалж байна...</p>
    </div>
</div>
```

---

## 3️⃣ JavaScript 파일 업데이트

### **js/script.js 파일 맨 위에 추가:**

1. `GoogleSheets_연동코드.js` 파일 내용 전체 복사
2. `js/script.js` 파일 맨 위에 붙여넣기
3. `GOOGLE_SHEETS_URL` 변수에 Apps Script URL 입력

```javascript
// 맨 위에 추가
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// ... 나머지 Google Sheets 연동 코드 ...

// 기존 코드는 그대로 유지
```

---

## 4️⃣ CSS 추가 (선택사항)

### **css/style.css 파일에 추가:**

```css
/* 로딩 메시지 */
.loading-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
}

.loading-message i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 동적 색상 옵션 */
#shapeColorsContainer,
#textColorsContainer {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
}

/* 동적 커스텀 필드 */
#customFieldsContainer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-dark);
}

.form-group input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
}
```

---

## 5️⃣ 전체 통합 체크리스트

### ✅ **Google Sheets 설정:**
- [ ] Products 시트 생성 및 데이터 입력
- [ ] Colors 시트 생성 및 색상 데이터 입력
- [ ] CustomFields 시트 생성 및 필드 정의
- [ ] Apps Script 코드 복사 및 배포
- [ ] Web App URL 복사

### ✅ **HTML 수정:**
- [ ] Product Modal에 동적 컨테이너 추가
- [ ] 버튼 onclick 함수명 변경
- [ ] Products Grid 로딩 메시지 추가

### ✅ **JavaScript 수정:**
- [ ] GoogleSheets_연동코드.js 내용을 js/script.js 맨 위에 추가
- [ ] GOOGLE_SHEETS_URL 변수에 URL 입력
- [ ] 기존 장바구니 시스템과 연동 확인

### ✅ **CSS 추가:**
- [ ] 로딩 애니메이션 스타일
- [ ] 동적 컨테이너 스타일

### ✅ **테스트:**
- [ ] 페이지 로드 시 제품 표시 확인
- [ ] 제품 클릭 시 색상 옵션 확인
- [ ] 커스텀 필드 표시 확인
- [ ] 장바구니 추가 테스트
- [ ] 주문 프로세스 테스트

---

## 🎯 간단 버전 vs 완전 버전

### **간단 버전 (기존 제품 유지 + Sheets 추가):**
- 기존 HTML은 그대로 두고
- Google Sheets 제품을 **추가**로 표시
- 안전하지만 중복 관리 필요

### **완전 버전 (Sheets로 완전 전환):**
- 기존 하드코딩 제거
- 모든 제품을 Sheets에서 관리
- 깔끔하지만 초기 설정 필요

---

## 💡 추천 순서

1. **먼저 Google Sheets + Apps Script 설정 완료**
2. **간단 버전으로 테스트** (기존 제품은 그대로 두고 Sheets 추가)
3. **정상 작동 확인 후 완전 버전으로 전환**

---

## 🆘 도움이 필요하면

제가 직접 수정해드릴 수 있습니다!

1. Google Sheets 설정
2. HTML 수정
3. JavaScript 통합
4. 테스트

---

**다음 단계:**  
실제 파일을 수정해드릴까요? 🚀
