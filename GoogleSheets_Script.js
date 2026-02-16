/**
 * ========================================
 * MONOLAB 제품 관리 - Google Apps Script
 * ========================================
 * 
 * 설정 방법:
 * 1. Google Sheets 열기
 * 2. 메뉴: 확장 프로그램 → Apps Script
 * 3. 이 코드 전체 복사 → 붙여넣기
 * 4. 저장 (Ctrl+S)
 * 5. 배포 → 새 배포 → 유형: 웹 앱
 * 6. 액세스 권한: "모든 사용자"
 * 7. URL 복사
 * 
 * ========================================
 */

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // 첫 번째 줄은 헤더
  const headers = data[0];
  const products = [];
  
  // 두 번째 줄부터 데이터
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const product = {};
    
    for (let j = 0; j < headers.length; j++) {
      product[headers[j]] = row[j];
    }
    
    // active가 TRUE인 제품만 포함
    if (product.active === true || product.active === 'TRUE') {
      products.push(product);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ products: products }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ========================================
 * Google Sheets 구조:
 * ========================================
 * 
 * 열 이름:
 * - id: 제품 ID (숫자, 1, 2, 3...)
 * - code: 제품 코드 (C003, C101...)
 * - name: 제품명 (몽골어)
 * - description: 설명 (몽골어)
 * - price: 가격 (숫자만, 40000)
 * - image_url: 이미지 URL
 * - colors: 색상 옵션 (예: "Саарал,Бэйж,Цагаан")
 * - production_days: 제작 기간 (예: "1-3 өдөр")
 * - active: 활성화 여부 (TRUE/FALSE)
 * 
 * ========================================
 * 
 * 예시:
 * 
 * | id | code | name | description | price | image_url | colors | production_days | active |
 * |----|------|------|-------------|-------|-----------|--------|-----------------|--------|
 * | 1  | C003 | Хүүхдийн дурсгал | 설명 | 40000 | https://... | Олон өнгө | 1-3 өдөр | TRUE |
 * | 2  | C101 | Түлхүүр өлгүүр | 설명 | 8000 | https://... | Олон өнгө | 1-3 өдөр | TRUE |
 * 
 * ========================================
 */
