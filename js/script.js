/**
 * ========================================
 * MONOLAB - Google Sheets Integration
 * ========================================
 * Google Sheets에서 제품, 색상, 커스텀 필드 데이터를 로드합니다
 * ========================================
 */

// ============================================
// Google Sheets API URL 설정
// ============================================
// Google Sheets Apps Script 배포 URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwNw6cpIDJikf_5246zbIegptWtZN7redd0ngo9w8wgCQ8GJe9HppJPtErM4dOESpiB/exec';

// ============================================
// 전역 변수
// ============================================
let allProducts = [];
let allColors = [];
let allCustomFields = [];
let useGoogleSheets = false;  // Google Sheets 사용 여부

// ============================================
// 페이지 로드 시 실행
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Google Sheets URL이 설정되어 있으면 데이터 로드
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL !== '') {
        loadDataFromSheets();
    } else {
        console.log('ℹ️ Google Sheets URL이 설정되지 않았습니다. 기본 HTML 제품을 사용합니다.');
        console.log('📝 설정 방법: GoogleSheets_시트구조_완전버전.md 파일을 참고하세요.');
    }
});

// ============================================
// Google Sheets에서 데이터 로드
// ============================================
async function loadDataFromSheets() {
    try {
        console.log('📡 Google Sheets에서 데이터를 불러오는 중...');
        const response = await fetch(GOOGLE_SHEETS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        allProducts = data.products || [];
        allColors = data.colors || [];
        allCustomFields = data.customFields || [];
        
        useGoogleSheets = true;
        
        console.log('✅ 데이터 로드 성공:', {
            제품: allProducts.length + '개',
            색상: allColors.length + '개',
            커스텀필드: allCustomFields.length + '개'
        });
        
        // 제품 렌더링
        renderProductsFromSheets();
        
    } catch (error) {
        console.error('❌ Google Sheets 데이터 로드 실패:', error);
        console.log('ℹ️ 기본 HTML 제품을 사용합니다.');
        useGoogleSheets = false;
    }
}

// ============================================
// Google Sheets 제품 렌더링
// ============================================
function renderProductsFromSheets() {
    const container = document.querySelector('.products-grid');
    if (!container) {
        console.error('❌ .products-grid 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    // 활성화된 제품만 필터링
    const activeProducts = allProducts.filter(p => 
        p.active === true || p.active === 'TRUE' || p.active === 'true'
    );
    
    if (activeProducts.length === 0) {
        console.warn('⚠️ 활성화된 제품이 없습니다.');
        return;
    }
    
    // 제품 카드 HTML 생성
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
                    <span><i class="fas fa-clock"></i> ${product.production_days || '1-3 өдөр'}</span>
                    ${(product.shape_colors && product.shape_colors !== 'none' && product.shape_colors !== '') || (product.text_colors && product.text_colors !== 'none' && product.text_colors !== '') ? '<span><i class="fas fa-palette"></i> Олон өнгө</span>' : ''}
                </div>
                <button class="btn btn-primary btn-full" onclick="openProductModalFromSheets(${product.id})">
                    Дэлгэрэнгүй харах
                </button>
            </div>
        </div>
    `).join('');
    
    console.log(`✅ ${activeProducts.length}개 제품이 렌더링되었습니다.`);
}

// ============================================
// 제품 모달 열기 (Google Sheets 버전)
// ============================================
function openProductModalFromSheets(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) {
        console.error('❌ 제품을 찾을 수 없습니다:', productId);
        alert('제품 정보를 불러올 수 없습니다.');
        return;
    }
    
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalProductImage');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalPrice = document.getElementById('modalProductPrice');
    
    // 기본 정보 설정
    modalImage.src = product.image_url;
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description;
    modalPrice.textContent = parseInt(product.price).toLocaleString() + '₮';
    
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
    
    if (product.shape_colors && product.shape_colors !== 'none' && product.shape_colors !== '') {
        let shapeColors = [];
        
        if (product.shape_colors === 'all') {
            shapeColors = allColors;
        } else {
            const codes = product.shape_colors.split(',').map(c => c.trim());
            shapeColors = allColors.filter(c => codes.includes(c.color_code));
        }
        
        if (shapeColors.length > 0) {
            shapeColorsContainer.innerHTML = shapeColors.map(color => `
                <label class="color-option">
                    <input type="radio" name="babyColor" value="${color.color_name_mn}" required>
                    <span class="color-swatch" style="background-color: ${color.color_hex};${color.color_hex === '#FFFFFF' ? ' border: 1px solid #ddd;' : ''}"></span>
                    <span class="color-name">${color.color_name_mn}</span>
                </label>
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
    
    if (product.text_colors && product.text_colors !== 'none' && product.text_colors !== '') {
        let textColors = [];
        
        if (product.text_colors === 'all') {
            textColors = allColors;
        } else {
            const codes = product.text_colors.split(',').map(c => c.trim());
            textColors = allColors.filter(c => codes.includes(c.color_code));
        }
        
        if (textColors.length > 0) {
            textColorsContainer.innerHTML = textColors.map(color => `
                <label class="color-option-small">
                    <input type="radio" name="textColor" value="${color.color_name_mn}" required>
                    <span class="color-swatch-small" style="background-color: ${color.color_hex};"></span>
                    <span class="color-name-small">${color.color_name_mn}</span>
                </label>
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
    
    if (product.custom_fields && product.custom_fields !== 'none' && product.custom_fields !== '') {
        const fieldCodes = product.custom_fields.split(',').map(c => c.trim());
        const fields = allCustomFields.filter(f => fieldCodes.includes(f.field_code));
        
        if (fields.length > 0) {
            container.innerHTML = fields.map(field => `
                <div class="form-group">
                    <label for="${field.field_code}">
                        ${field.field_name_mn}
                        ${field.required ? '<span style="color: red;">*</span>' : ''}
                    </label>
                    <input 
                        type="${field.field_type || 'text'}" 
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
    const productData = modal.dataset.currentProduct;
    
    if (!productData) {
        console.error('❌ 제품 정보가 없습니다.');
        alert('제품 정보를 불러올 수 없습니다.');
        return;
    }
    
    const product = JSON.parse(productData);
    
    // 색상 검증
    let babyColor = null;
    let textColor = null;
    
    if (product.shape_colors && product.shape_colors !== 'none' && product.shape_colors !== '') {
        const selectedBabyColor = document.querySelector('input[name="babyColor"]:checked');
        if (!selectedBabyColor) {
            alert('Дүрсний өнгө сонгоно уу!');
            return;
        }
        babyColor = selectedBabyColor.value;
    }
    
    if (product.text_colors && product.text_colors !== 'none' && product.text_colors !== '') {
        const selectedTextColor = document.querySelector('input[name="textColor"]:checked');
        if (!selectedTextColor) {
            alert('Текстийн өнгө сонгоно уу!');
            return;
        }
        textColor = selectedTextColor.value;
    }
    
    // 커스텀 필드 수집 및 검증
    const customization = {};
    if (product.custom_fields && product.custom_fields !== 'none' && product.custom_fields !== '') {
        const fieldCodes = product.custom_fields.split(',').map(c => c.trim());
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
    
    // 장바구니에 추가
    cart.push(cartItem);
    saveCart();
    
    // 모달 닫기
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // 성공 메시지
    showTempMessage('Сагсанд нэмэгдлээ!');
}

// ============================================
// 즉시 주문 (Google Sheets 버전)
// ============================================
function orderNowFromSheets() {
    // 장바구니에 추가
    addToCartFromSheets();
    
    // 주문 모달 열기 (장바구니가 비어있지 않으면)
    if (cart.length > 0) {
        setTimeout(() => {
            openOrderModal();
        }, 300);
    }
}

// ============================================
// 유틸리티: 임시 메시지 표시
// ============================================
function showTempMessage(message) {
    // 기존 메시지 제거
    const existing = document.querySelector('.temp-message');
    if (existing) {
        existing.remove();
    }
    
    // 새 메시지 생성
    const msgDiv = document.createElement('div');
    msgDiv.className = 'temp-message';
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2E7D32;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(msgDiv);
    
    // 3초 후 제거
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// ============================================
// 디버깅: 콘솔에서 데이터 확인
// ============================================
function checkSheetsData() {
    console.log('='.repeat(50));
    console.log('📊 MONOLAB Google Sheets 데이터');
    console.log('='.repeat(50));
    console.log('📦 제품 (' + allProducts.length + '개):', allProducts);
    console.log('🎨 색상 (' + allColors.length + '개):', allColors);
    console.log('📝 커스텀 필드 (' + allCustomFields.length + '개):', allCustomFields);
    console.log('='.repeat(50));
}

// ============================================
// Cart Management
// ============================================
// Cart Management
let cart = [];
const DELIVERY_FEE = 6000;

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('monolabCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('monolabCart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Mobile dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Listen for delivery method changes
    const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', updateOrderTotal);
    });
    
    // Handle mobile dropdown clicks
    const navDropdowns = document.querySelectorAll('.nav-dropdown > .nav-link');
    navDropdowns.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
    
    // Active navigation link on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Product Modal
function openProductModal(productId) {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalProductImage');
    
    // Set product image
    modalImage.src = 'https://www.genspark.ai/api/files/s/s45aRmVk?token=Z0FBQUFBQnBrVHFnclNHX0xxUGt4aG1lTUttY0dBdVpGektFa0RLUHlTSGJQTnlMSENtMkJuZ3luS1lKWjdCMG5Xem12YnAxTWRHTFdBQjhWZHo2OHN3MG8tQ2FjMVZ3UDVUbTBMR3d5Tl95U3B6WU4zRDFQU3R4em1vMDR2Qk5EQ0FkX19JdWdWZzVwb2dtUE5zd3pJSHdBRkQwQ0NUbmduazByaGhYR0w4eGRudDY0UDVFVVdaNmRuS1JuektvWjJsYWVmaFNMODROWjV2V2V2ZVZVTGQtZWlmSWc1amdHLVZkS1hWamFjR1lLVjRmZzQ4RWpXbDB0RURPaV9WLXZwbTJIZDVfcnhKMnE5RUNCd0tnMzI4YldodXB0bjBwYVE9PQ';
    
    // Reset form
    document.querySelectorAll('#productModal input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('babyName').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    document.getElementById('birthTime').value = '';
    document.getElementById('quantity').value = 1;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modals
const modalCloses = document.querySelectorAll('.modal-close');
modalCloses.forEach(close => {
    close.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Quantity controls
function increaseQty() {
    const qtyInput = document.getElementById('quantity');
    qtyInput.value = parseInt(qtyInput.value) + 1;
}

function decreaseQty() {
    const qtyInput = document.getElementById('quantity');
    if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
    }
}

// Add to cart
function addToCart() {
    // Validate required fields
    const selectedBabyColor = document.querySelector('input[name="babyColor"]:checked');
    const selectedTextColor = document.querySelector('input[name="textColor"]:checked');
    const babyName = document.getElementById('babyName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const weight = document.getElementById('weight').value.trim();
    const height = document.getElementById('height').value.trim();
    const birthTime = document.getElementById('birthTime').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!selectedBabyColor) {
        alert('Хүүхдийн дүрсний өнгө сонгоно уу!');
        return;
    }
    
    if (!selectedTextColor) {
        alert('Мэдээллийн өнгө сонгоно уу!');
        return;
    }
    
    if (!babyName || !birthDate || !weight || !height || !birthTime) {
        alert('Бүх мэдээллийг бөглөнө үү!');
        return;
    }
    
    // Create cart item
    const cartItem = {
        id: Date.now(),
        productCode: 'C003',
        productName: 'Хүүхдийн дурсгал',
        price: 40000,
        quantity: quantity,
        babyColor: selectedBabyColor.value,
        textColor: selectedTextColor.value,
        customization: {
            name: babyName,
            birthDate: birthDate,
            weight: weight,
            height: height,
            birthTime: birthTime
        },
        image: 'https://www.genspark.ai/api/files/s/s45aRmVk?token=Z0FBQUFBQnBrVHFnclNHX0xxUGt4aG1lTUttY0dBdVpGektFa0RLUHlTSGJQTnlMSENtMkJuZ3luS1lKWjdCMG5Xem12YnAxTWRHTFdBQjhWZHo2OHN3MG8tQ2FjMVZ3UDVUbTBMR3d5Tl95U3B6WU4zRDFQU3R4em1vMDR2Qk5EQ0FkX19JdWdWZzVwb2dtUE5zd3pJSHdBRkQwQ0NUbmduazByaGhYR0w4eGRudDY0UDVFVVdaNmRuS1JuektvWjJsYWVmaFNMODROWjV2V2V2ZVZVTGQtZWlmSWc1amdHLVZkS1hWamFjR1lLVjRmZzQ4RWpXbDB0RURPaV9WLXZwbTJIZDVfcnhKMnE5RUNCd0tnMzI4YldodXB0bjBwYVE9PQ'
    };
    
    cart.push(cartItem);
    saveCart();
    
    // Close product modal
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Show success message
    showSuccessMessage('Бүтээгдэхүүн сагсанд нэмэгдлээ!');
}

// Order now (add to cart and go to checkout)
function orderNow() {
    // Validate required fields
    const selectedBabyColor = document.querySelector('input[name="babyColor"]:checked');
    const selectedTextColor = document.querySelector('input[name="textColor"]:checked');
    const babyName = document.getElementById('babyName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const weight = document.getElementById('weight').value.trim();
    const height = document.getElementById('height').value.trim();
    const birthTime = document.getElementById('birthTime').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!selectedBabyColor) {
        alert('Хүүхдийн дүрсний өнгө сонгоно уу!');
        return;
    }
    
    if (!selectedTextColor) {
        alert('Мэдээллийн өнгө сонгоно уу!');
        return;
    }
    
    if (!babyName || !birthDate || !weight || !height || !birthTime) {
        alert('Бүх мэдээллийг бөглөнө үү!');
        return;
    }
    
    // Create cart item
    const cartItem = {
        id: Date.now(),
        productCode: 'C003',
        productName: 'Хүүхдийн дурсгал',
        price: 40000,
        quantity: quantity,
        babyColor: selectedBabyColor.value,
        textColor: selectedTextColor.value,
        customization: {
            name: babyName,
            birthDate: birthDate,
            weight: weight,
            height: height,
            birthTime: birthTime
        },
        image: 'https://www.genspark.ai/api/files/s/s45aRmVk?token=Z0FBQUFBQnBrVHFnclNHX0xxUGt4aG1lTUttY0dBdVpGektFa0RLUHlTSGJQTnlMSENtMkJuZ3luS1lKWjdCMG5Xem12YnAxTWRHTFdBQjhWZHo2OHN3MG8tQ2FjMVZ3UDVUbTBMR3d5Tl95U3B6WU4zRDFQU3R4em1vMDR2Qk5EQ0FkX19JdWdWZzVwb2dtUE5zd3pJSHdBRkQwQ0NUbmduazByaGhYR0w4eGRudDY0UDVFVVdaNmRuS1JuektvWjJsYWVmaFNMODROWjV2V2V2ZVZVTGQtZWlmSWc1amdHLVZkS1hWamFjR1lLVjRmZzQ4RWpXbDB0RURPaV9WLXZwbTJIZDVfcnhKMnE5RUNCd0tnMzI4YldodXB0bjBwYVE9PQ'
    };
    
    cart.push(cartItem);
    saveCart();
    
    // Close product modal
    document.getElementById('productModal').style.display = 'none';
    
    // Open order modal
    proceedToCheckout();
}

// Open cart modal
document.querySelector('.cart-link').addEventListener('click', (e) => {
    e.preventDefault();
    openCartModal();
});

function openCartModal() {
    const modal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Таны сагс хоосон байна</p>
            </div>
        `;
        document.getElementById('checkoutBtn').style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.productName}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.productName} <span style="color: #8A8376; font-size: 0.85rem;">(${item.productCode})</span></div>
                    <div class="cart-item-info">
                        <strong>Дүрсний өнгө:</strong> ${item.babyColor}<br>
                        <strong>Текстийн өнгө:</strong> ${item.textColor}<br>
                        <strong>Нэр:</strong> ${item.customization.name}<br>
                        <strong>Тоо:</strong> ${item.quantity}
                    </div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()}₮</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        document.getElementById('checkoutBtn').style.display = 'block';
    }
    
    updateCartSummary();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + DELIVERY_FEE;
    
    document.getElementById('cartSubtotal').textContent = subtotal.toLocaleString() + '₮';
    document.getElementById('cartDelivery').textContent = DELIVERY_FEE.toLocaleString() + '₮';
    document.getElementById('cartTotal').textContent = total.toLocaleString() + '₮';
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    openCartModal();
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Таны сагс хоосон байна!');
        return;
    }
    
    // Close cart modal
    document.getElementById('cartModal').style.display = 'none';
    
    // Open order modal
    const orderModal = document.getElementById('orderModal');
    const orderSummary = document.getElementById('orderSummary');
    
    // Populate order summary
    orderSummary.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-title">${item.productName} (${item.productCode}) × ${item.quantity}</div>
            <div class="order-item-details">
                <strong>Дүрсний өнгө:</strong> ${item.babyColor}<br>
                <strong>Текстийн өнгө:</strong> ${item.textColor}<br>
                <strong>Хүүхдийн нэр:</strong> ${item.customization.name}<br>
                <strong>Төрсөн огноо:</strong> ${item.customization.birthDate}<br>
                <strong>Жин:</strong> ${item.customization.weight} кг<br>
                <strong>Өндөр:</strong> ${item.customization.height} см<br>
                <strong>Төрсөн цаг:</strong> ${item.customization.birthTime}
            </div>
            <div style="margin-top: 0.5rem; font-weight: 600;">${(item.price * item.quantity).toLocaleString()}₮</div>
        </div>
    `).join('');
    
    // Update order totals (default: pickup = free)
    updateOrderTotal();
    
    orderModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Update order total based on delivery method
function updateOrderTotal() {
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
    if (!deliveryMethod) return;
    
    const method = deliveryMethod.value;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = method === 'pickup' ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    
    document.getElementById('orderSubtotal').textContent = subtotal.toLocaleString() + '₮';
    document.getElementById('orderDelivery').textContent = deliveryFee === 0 ? 'Үнэгүй' : deliveryFee.toLocaleString() + '₮';
    document.getElementById('orderTotal').textContent = total.toLocaleString() + '₮';
    
    // Show/hide address field
    const addressGroup = document.getElementById('addressGroup');
    const addressField = document.getElementById('customerAddress');
    const pickupWarning = document.getElementById('pickupWarning');
    
    if (method === 'pickup') {
        addressGroup.style.display = 'none';
        addressField.removeAttribute('required');
        if (pickupWarning) pickupWarning.style.display = 'block';
    } else {
        addressGroup.style.display = 'block';
        addressField.setAttribute('required', 'required');
        if (pickupWarning) pickupWarning.style.display = 'none';
    }
}

// Add event listeners for delivery method change
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Listen for delivery method changes
    const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', updateOrderTotal);
    });
});

// Handle order form submission
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const customerNote = document.getElementById('customerNote').value.trim();
    
    // Validate based on delivery method
    if (!customerName || !customerPhone) {
        alert('Бүх шаардлагатай мэдээллийг бөглөнө үү!');
        return;
    }
    
    if (deliveryMethod === 'delivery' && !customerAddress) {
        alert('Хүргэх хаягаа оруулна уу!');
        return;
    }
    
    // Calculate fees
    const deliveryFee = deliveryMethod === 'pickup' ? 0 : DELIVERY_FEE;
    const pickupLocation = 'Соёлж Mall, 2-р давхар, 211 тоот';
    
    // Generate Order Number
    const orderNumber = 'ML' + Date.now().toString().slice(-8);
    
    // Create order summary
    const orderData = {
        orderNumber: orderNumber,
        customer: {
            name: customerName,
            phone: customerPhone,
            address: deliveryMethod === 'pickup' ? pickupLocation : customerAddress,
            note: customerNote
        },
        deliveryMethod: deliveryMethod === 'pickup' ? 'Өөрөө ирж авах' : 'Хүргэлт',
        pickupLocation: deliveryMethod === 'pickup' ? pickupLocation : null,
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: deliveryFee,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee,
        orderDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Log order data (in production, this would be sent to a server or Google Sheets)
    console.log('Захиалга:', orderData);
    
    // Save order to localStorage for record
    const orders = JSON.parse(localStorage.getItem('monolabOrders') || '[]');
    orders.push(orderData);
    localStorage.setItem('monolabOrders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    
    // Close order modal
    document.getElementById('orderModal').style.display = 'none';
    
    // Show success modal
    const successMsg = deliveryMethod === 'pickup' 
        ? `<div style="background: #E8F5E9; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
               <strong style="color: #2E7D32; font-size: 1.2rem;">📋 Захиалгын дугаар: ${orderNumber}</strong>
           </div>
           Таны захиалга амжилттай илгээгдлээ!<br><br>
           <strong style="color: #D32F2F;">⚠️ АНХААРУУЛГА - Заавал уншина уу:</strong><br>
           <div style="background: #FFF3E0; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
               <strong>🏪 Шууд очиж авах боломжгүй!</strong><br>
               Бэлэн болсны дараа мэдэгдэл хүлээн авснаар л очиж авна уу.<br>
               Бэлэн болоогүй бол дэлгүүрт байхгүй!
           </div>
           <strong>Дараагийн алхам:</strong><br>
           <div style="text-align: left; margin: 1rem 0;">
               1️⃣ Дансанд <strong style="color: #1976D2;">${orderData.total.toLocaleString()}₮</strong> шилжүүлнэ үү<br>
               <div style="background: #E3F2FD; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0;">
                   <strong>💳 Данс:</strong> MN30000500 5166068340<br>
                   <strong>📝 Гүйлгээний утга:</strong> <span style="color: #D32F2F; font-weight: bold;">${orderNumber}</span>
               </div>
               2️⃣ Төлбөр баталгаажсаны дараа хэвлэж эхэлнэ (1-3 өдөр)<br>
               3️⃣ Бэлэн болоход <strong style="color: #2E7D32;">танд мэдэгдэл илгээх болно</strong><br>
               4️⃣ Мэдэгдэл хүлээн авсны дараа очиж авна уу
           </div>
           <strong>📍 Авах газар:</strong><br>
           Соёлж Mall, 2-р давхар, 211 тоот`
        : `<div style="background: #E8F5E9; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
               <strong style="color: #2E7D32; font-size: 1.2rem;">📋 Захиалгын дугаар: ${orderNumber}</strong>
           </div>
           Таны захиалга амжилттай илгээгдлээ!<br><br>
           <strong>Дараагийн алхам:</strong><br>
           <div style="text-align: left; margin: 1rem 0;">
               1️⃣ Дансанд <strong style="color: #1976D2;">${orderData.total.toLocaleString()}₮</strong> шилжүүлнэ үү<br>
               <div style="background: #E3F2FD; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0;">
                   <strong>💳 Данс:</strong> MN30000500 5166068340<br>
                   <strong>📝 Гүйлгээний утга:</strong> <span style="color: #D32F2F; font-weight: bold;">${orderNumber}</span>
               </div>
               2️⃣ Төлбөр баталгаажсаны дараа хэвлэж эхэлнэ (1-3 өдөр)<br>
               3️⃣ Бэлэн болоход хүргэлт хийгдэнэ
           </div>`;
    
    document.getElementById('successMessage').innerHTML = successMsg;
    document.getElementById('successModal').style.display = 'block';
    
    // Reset form
    this.reset();
});

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show success message
function showSuccessMessage(message) {
    document.getElementById('successMessage').textContent = message;
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    if (!name || !phone) {
        alert('Нэр болон утасны дугаараа оруулна уу!');
        return;
    }
    
    // Log contact data (in production, this would be sent to a server or email service)
    console.log('Холбоо барих:', { name, phone, message });
    
    showSuccessMessage('Таны мессеж илгээгдлээ! Бид тун удахгүй холбогдох болно.');
    this.reset();
});

// Google Sheets Integration Setup (for future use)
// To enable Google Sheets integration for product management:
// 1. Create a Google Sheet with columns: id, name, description, price, colors, image_url, active
// 2. Use Google Apps Script to create a web app that returns JSON data
// 3. Replace the hardcoded product data with fetch() calls to the Google Sheets API
// 4. Example:
/*
async function loadProductsFromSheet() {
    const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
    try {
        const response = await fetch(SHEET_URL);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            // Product card HTML
        </div>
    `).join('');
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadProductsFromSheet);
*/