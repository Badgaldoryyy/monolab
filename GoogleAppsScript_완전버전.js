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
 * 7. URL 복사 → js/script.js에 붙여넣기
 * 
 * ========================================
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Products 시트에서 제품 데이터 가져오기
  const productsSheet = ss.getSheetByName('Products');
  const productsData = productsSheet.getDataRange().getValues();
  const productsHeaders = productsData[0];
  const products = [];
  
  for (let i = 1; i < productsData.length; i++) {
    const row = productsData[i];
    const product = {};
    
    for (let j = 0; j < productsHeaders.length; j++) {
      product[productsHeaders[j]] = row[j];
    }
    
    // active가 TRUE인 제품만 포함
    if (product.active === true || product.active === 'TRUE' || product.active === 'true') {
      products.push(product);
    }
  }
  
  // Colors 시트에서 색상 데이터 가져오기
  const colorsSheet = ss.getSheetByName('Colors');
  const colorsData = colorsSheet.getDataRange().getValues();
  const colorsHeaders = colorsData[0];
  const colors = [];
  
  for (let i = 1; i < colorsData.length; i++) {
    const row = colorsData[i];
    const color = {};
    
    for (let j = 0; j < colorsHeaders.length; j++) {
      color[colorsHeaders[j]] = row[j];
    }
    
    // active가 TRUE인 색상만 포함
    if (color.active === true || color.active === 'TRUE' || color.active === 'true') {
      colors.push(color);
    }
  }
  
  // CustomFields 시트에서 커스텀 필드 데이터 가져오기
  const fieldsSheet = ss.getSheetByName('CustomFields');
  const fieldsData = fieldsSheet.getDataRange().getValues();
  const fieldsHeaders = fieldsData[0];
  const customFields = [];
  
  for (let i = 1; i < fieldsData.length; i++) {
    const row = fieldsData[i];
    const field = {};
    
    for (let j = 0; j < fieldsHeaders.length; j++) {
      field[fieldsHeaders[j]] = row[j];
    }
    
    customFields.push(field);
  }
  
  const result = {
    products: products,
    colors: colors,
    customFields: customFields
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ========================================
 * Google Sheets 구조 안내
 * ========================================
 * 
 * 시트 3개 필요:
 * 1. Products - 제품 정보
 * 2. Colors - 색상 목록
 * 3. CustomFields - 커스텀 필드 설정
 * 
 * ========================================
 */
