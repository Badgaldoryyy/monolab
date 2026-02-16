/**
 * ========================================
 * MONOLAB - Google Sheets 연동 JavaScript
 * ========================================
 * 
 * 이 파일을 js/script.js 맨 위에 추가하세요
 * 
 * ========================================
 */

// ============================================
// Google Sheets API URL 설정
// ============================================
// TODO: Apps Script 배포 후 여기에 URL 붙여넣기
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// ============================================
// 전역 변수
// ============================================
let allProducts = [];
let allColors = [];
let allCustomFields = [];

// ============================================
// 페이지 로드 시 실행
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromSheets();
});

// ============================================
// Google Sheets에서 데이터 로드
// ============================================
async function loadDataFromSheets() {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const data = await response.json();
        
        allProducts = data.products || [];
        allColors = data.colors || [];
        allCustomFields = data.customFields || [];
        
        console.log('✅ 데이터 로드 성공:', {
            제품: allProducts.length,
            색상: allColors.length,
            필드: allCustomFields.length
        });
        
        // 제품 렌더링
        renderProductsByCategory();
        
    } catch (error) {
        console.error('❌ 데이터 로드 실패:', error);
        // 에러 시 기본 제품 표시 (기존 HTML 사용)
    }
}

// ============================================
// 카테고리별 제품 렌더링
// ============================================
function renderProductsByCategory() {
    // 카테고리별로 제품 분류
    const categories = {
        gift: { icon: '🎁', name: 'Бэлэг дурсгал', products: [] },
        accessory: { icon: '👜', name: 'Цүнх хэрэгсэл', products: [] },
        decor: { icon: '🏠', name: 'Интерьер чимэглэл', products: [] },
        seasonal: { icon: '📅', name: 'Улирлын бүтээгдэхүүн', products: [] }
    };
    
    // 제품 분류
    allProducts.forEach(product => {
        const category = product.category || 'gift';
        if (categories[category]) {
            categories[category].products.push(product);
        }
    });
    
    // Featured Products 섹션 렌더링
    renderFeaturedProducts();
}

// ============================================
// Featured Products 렌더링
// ============================================
function renderFeaturedProducts() {
    const container = document.querySelector('.products-grid');
    if (!container) return;
    
    // 활성화된 제품만 표시
    const activeProducts = allProducts.filter(p => p.active);
    
    container.innerHTML = activeProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
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
                    <span><i class="fas fa-palette"></i> Олон өнгө</span>
                </div>
                <button class="btn btn-primary btn-full" onclick="openProductModalFromSheets(${product.id})">
                    Дэлгэрэнгүй харах
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// 제품 모달 열기 (Google Sheets 버전)
// ============================================
function openProductModalFromSheets(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) {
        console.error('제품을 찾을 수 없습니다:', productId);
        return;
    }
    
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalProductImage');
    
    // 이미지 설정
    modalImage.src = product.image_url;
    
    // 색상 옵션 렌더링
    renderColorOptions(product);
    
    // 커스텀 필드 렌더링
    renderCustomFields(product);
    
    // 폼 리셋
    resetProductForm();
    
    // 모달 표시
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 현재 제품 정보 저장 (장바구니 추가용)
    modal.dataset.currentProduct = JSON.stringify(product);
}

// ============================================
// 색상 옵션 렌더링
// ============================================
function renderColorOptions(product) {
    // 아기 모양 색상
    const shapeColorsContainer = document.getElementById('shapeColorsContainer');
    const shapeColorsSection = document.getElementById('shapeColorsSection');
    
    if (product.shape_colors && product.shape_colors !== 'none') {
        const shapeColors = product.shape_colors === 'all' 
            ? allColors 
            : allColors.filter(c => product.shape_colors.split(',').includes(c.color_code));
        
        if (shapeColors.length > 0) {
            shapeColorsContainer.innerHTML = shapeColors.map(color => `
                <div class="color-option">
                    <input type="radio" id="shape_${color.color_code}" name="babyColor" value="${color.color_name_mn}">
                    <label for="shape_${color.color_code}">
                        <div class="color-swatch" style="background-color: ${color.color_hex}"></div>
                        <span class="color-name">${color.color_name_mn}</span>
                    </label>
                </div>
            `).join('');
            shapeColorsSection.style.display = 'block';
        } else {
            shapeColorsSection.style.display = 'none';
        }
    } else {
        shapeColorsSection.style.display = 'none';
    }
    
    // 텍스트 색상
    const textColorsContainer = document.getElementById('textColorsContainer');
    const textColorsSection = document.getElementById('textColorsSection');
    
    if (product.text_colors && product.text_colors !== 'none') {
        const textColors = product.text_colors === 'all' 
            ? allColors 
            : allColors.filter(c => product.text_colors.split(',').includes(c.color_code));
        
        if (textColors.length > 0) {
            textColorsContainer.innerHTML = textColors.map(color => `
                <div class="color-option">
                    <input type="radio" id="text_${color.color_code}" name="textColor" value="${color.color_name_mn}">
                    <label for="text_${color.color_code}">
                        <div class="color-swatch" style="background-color: ${color.color_hex}"></div>
                        <span class="color-name">${color.color_name_mn}</span>
                    </label>
                </div>
            `).join('');
            textColorsSection.style.display = 'block';
        } else {
            textColorsSection.style.display = 'none';
        }
    } else {
        textColorsSection.style.display = 'none';
    }
}

// ============================================
// 커스텀 필드 렌더링
// ============================================
function renderCustomFields(product) {
    const container = document.getElementById('customFieldsContainer');
    const section = document.getElementById('customFieldsSection');
    
    if (product.custom_fields && product.custom_fields !== 'none') {
        const fieldCodes = product.custom_fields.split(',');
        const fields = allCustomFields.filter(f => fieldCodes.includes(f.field_code));
        
        if (fields.length > 0) {
            container.innerHTML = fields.map(field => `
                <div class="form-group">
                    <label for="${field.field_code}">
                        ${field.field_name_mn}
                        ${field.required ? '<span style="color: red;">*</span>' : ''}
                    </label>
                    <input 
                        type="${field.field_type}" 
                        id="${field.field_code}" 
                        name="${field.field_code}"
                        placeholder="${field.placeholder || ''}"
                        ${field.required ? 'required' : ''}
                    >
                </div>
            `).join('');
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    } else {
        section.style.display = 'none';
    }
}

// ============================================
// 폼 리셋
// ============================================
function resetProductForm() {
    // 라디오 버튼 리셋
    document.querySelectorAll('#productModal input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // 커스텀 필드 리셋
    document.querySelectorAll('#customFieldsContainer input').forEach(input => {
        input.value = '';
    });
    
    // 수량 리셋
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.value = 1;
    }
}

// ============================================
// 장바구니에 추가 (Google Sheets 버전)
// ============================================
function addToCartFromSheets() {
    const modal = document.getElementById('productModal');
    const product = JSON.parse(modal.dataset.currentProduct);
    
    // 색상 검증
    let babyColor = null;
    let textColor = null;
    
    if (product.shape_colors && product.shape_colors !== 'none') {
        const selectedBabyColor = document.querySelector('input[name="babyColor"]:checked');
        if (!selectedBabyColor) {
            alert('Дүрсний өнгө сонгоно уу!');
            return;
        }
        babyColor = selectedBabyColor.value;
    }
    
    if (product.text_colors && product.text_colors !== 'none') {
        const selectedTextColor = document.querySelector('input[name="textColor"]:checked');
        if (!selectedTextColor) {
            alert('Текстийн өнгө сонгоно уу!');
            return;
        }
        textColor = selectedTextColor.value;
    }
    
    // 커스텀 필드 수집 및 검증
    const customization = {};
    if (product.custom_fields && product.custom_fields !== 'none') {
        const fieldCodes = product.custom_fields.split(',');
        const fields = allCustomFields.filter(f => fieldCodes.includes(f.field_code));
        
        for (const field of fields) {
            const input = document.getElementById(field.field_code);
            const value = input ? input.value.trim() : '';
            
            if (field.required && !value) {
                alert(`${field.field_name_mn} оруулна уу!`);
                return;
            }
            
            customization[field.field_code] = {
                label: field.field_name_mn,
                value: value
            };
        }
    }
    
    // 수량
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    // 장바구니 아이템 생성
    const cartItem = {
        id: Date.now(),
        productCode: product.code,
        productName: product.name,
        price: parseInt(product.price),
        quantity: quantity,
        babyColor: babyColor,
        textColor: textColor,
        customization: customization,
        image: product.image_url
    };
    
    // 기존 장바구니 함수 사용
    if (typeof cart !== 'undefined') {
        cart.push(cartItem);
        saveCart();
        
        // 모달 닫기
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // 성공 메시지
        showSuccessMessage('Сагсанд нэмэгдлээ!');
    } else {
        console.error('장바구니 시스템을 찾을 수 없습니다.');
    }
}

// ============================================
// 즉시 주문 (Google Sheets 버전)
// ============================================
function orderNowFromSheets() {
    // 장바구니에 추가
    addToCartFromSheets();
    
    // 주문 모달 열기
    setTimeout(() => {
        if (typeof openOrderModal === 'function') {
            openOrderModal();
        }
    }, 300);
}

// ============================================
// 유틸리티: 성공 메시지 표시
// ============================================
function showSuccessMessage(message) {
    // 간단한 알림 (기존 시스템 사용 또는 alert)
    if (typeof showTempMessage === 'function') {
        showTempMessage(message);
    } else {
        alert(message);
    }
}

// ============================================
// 콘솔에 데이터 확인용 함수
// ============================================
function checkSheetsData() {
    console.log('📦 제품:', allProducts);
    console.log('🎨 색상:', allColors);
    console.log('📝 커스텀 필드:', allCustomFields);
}

/**
 * ========================================
 * 사용 방법:
 * ========================================
 * 
 * 1. 이 파일을 js/script.js 맨 위에 복사
 * 2. GOOGLE_SHEETS_URL 변수에 Apps Script URL 입력
 * 3. 기존 openProductModal(1) 함수를 
 *    openProductModalFromSheets(1)로 변경
 * 4. 기존 addToCart() 함수를 
 *    addToCartFromSheets()로 변경
 * 5. 기존 orderNow() 함수를 
 *    orderNowFromSheets()로 변경
 * 
 * ========================================
 */
