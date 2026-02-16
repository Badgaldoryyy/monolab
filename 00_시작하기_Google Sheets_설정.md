# 🎉 MONOLAB Google Sheets 연동 완료!

## ✅ 완료된 작업

### **1. HTML 수정 ✅**
- Product Modal을 동적 컨테이너로 변경
- 색상 옵션 동적 렌더링 지원
- 커스텀 필드 동적 렌더링 지원

### **2. JavaScript 통합 ✅**
- Google Sheets API 연동 코드 추가
- 제품/색상/커스텀 필드 데이터 로드
- 장바구니 시스템 연동

### **3. CSS 스타일 ✅**
- 동적 필드용 스타일 추가
- 로딩 애니메이션
- 반응형 디자인

### **4. 템플릿 파일 ✅**
- Products CSV
- Colors CSV
- CustomFields CSV

---

## 🚀 다음 단계: Google Sheets 설정

### **📋 필요한 것:**
1. Google 계정
2. 30분~1시간
3. 제공된 CSV 파일들

---

## 📝 Step 1: Google Sheets 만들기

### **1-1. 새 Google Sheets 생성**
```
1. https://sheets.google.com 접속
2. "새로 만들기" 클릭
3. 제목: "MONOLAB 제품 관리"
```

### **1-2. 시트 3개 만들기**
```
1. 왼쪽 하단 "+" 버튼 클릭
2. 시트 이름 변경:
   - Sheet1 → Products
   - Sheet2 → Colors  
   - Sheet3 → CustomFields
```

---

## 📊 Step 2: 데이터 입력

### **2-1. Products 시트**
```
1. GoogleSheets_Products_Template.csv 파일 열기
2. 모든 내용 복사 (Ctrl+A, Ctrl+C)
3. Products 시트의 A1 셀에 붙여넣기 (Ctrl+V)
```

**결과:**
| id | code | name | description | price | ... |
|----|------|------|-------------|-------|-----|
| 1 | C003 | Хүүхдийн дурсгал | 설명 | 40000 | ... |

### **2-2. Colors 시트**
```
1. GoogleSheets_Colors_Template.csv 파일 열기
2. 모든 내용 복사
3. Colors 시트의 A1 셀에 붙여넣기
```

**결과:**
| id | color_code | color_name_mn | color_hex | pla_code | active |
|----|------------|---------------|-----------|----------|--------|
| 1 | white | Цагаан | #FFFFFF | 11100 | TRUE |
| ... | ... | ... | ... | ... | ... |

### **2-3. CustomFields 시트**
```
1. GoogleSheets_CustomFields_Template.csv 파일 열기
2. 모든 내용 복사
3. CustomFields 시트의 A1 셀에 붙여넣기
```

**결과:**
| field_code | field_name_mn | field_type | placeholder | required |
|------------|---------------|------------|-------------|----------|
| baby_name | Хүүхдийн нэр | text | 예시 | TRUE |
| ... | ... | ... | ... | ... |

---

## ⚙️ Step 3: Apps Script 설정

### **3-1. Apps Script 열기**
```
1. Google Sheets 메뉴: 확장 프로그램 → Apps Script
2. 새 창이 열림
```

### **3-2. 코드 붙여넣기**
```
1. GoogleAppsScript_완전버전.js 파일 열기
2. 모든 내용 복사
3. Apps Script 창의 기존 코드 전체 삭제
4. 복사한 코드 붙여넣기
5. 저장 (Ctrl+S)
6. 프로젝트 이름: "MONOLAB Products API"
```

### **3-3. 웹 앱으로 배포**
```
1. 오른쪽 상단 "배포" 버튼 클릭
2. "새 배포" 선택
3. 톱니바퀴 아이콘 → "웹 앱" 선택
4. 설정:
   - 실행 계정: 나
   - 액세스 권한: "모든 사용자"
5. "배포" 클릭
6. 권한 승인 (Google 계정으로 로그인)
7. "웹 앱 URL" 복사 (중요!)
```

**웹 앱 URL 예시:**
```
https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXX.../exec
```

---

## 🔗 Step 4: 웹사이트 연결

### **4-1. JavaScript 파일 수정**
```
1. js/script.js 파일 열기
2. 맨 위에서 찾기: const GOOGLE_SHEETS_URL = '';
3. 따옴표 안에 복사한 URL 붙여넣기
```

**수정 전:**
```javascript
const GOOGLE_SHEETS_URL = '';
```

**수정 후:**
```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxXXX.../exec';
```

### **4-2. 저장 및 테스트**
```
1. 파일 저장 (Ctrl+S)
2. 웹사이트 열기 (index.html)
3. 브라우저 개발자 도구 열기 (F12)
4. Console 탭 확인
```

**성공 메시지:**
```
📡 Google Sheets에서 데이터를 불러오는 중...
✅ 데이터 로드 성공: {제품: 1개, 색상: 17개, 커스텀필드: 8개}
✅ 1개 제품이 렌더링되었습니다.
```

---

## ✅ 완료 체크리스트

### **Google Sheets 설정:**
- [ ] Google Sheets 생성
- [ ] Products, Colors, CustomFields 시트 생성
- [ ] CSV 데이터 복사/붙여넣기
- [ ] Apps Script 코드 복사
- [ ] 웹 앱으로 배포
- [ ] 웹 앱 URL 복사

### **웹사이트 연결:**
- [ ] js/script.js에 URL 붙여넣기
- [ ] 파일 저장
- [ ] 브라우저 테스트
- [ ] Console 확인 (에러 없는지)

### **기능 테스트:**
- [ ] 제품 카드 정상 표시
- [ ] 제품 클릭 시 모달 열림
- [ ] 색상 옵션 정상 표시
- [ ] 커스텀 필드 정상 표시
- [ ] 장바구니 추가 테스트
- [ ] 주문 프로세스 테스트

---

## 🎯 사용 방법

### **새 제품 추가:**
```
1. Google Sheets → Products 시트 열기
2. 새 줄 추가 (마지막 행 아래)
3. 데이터 입력:
   - id: 2
   - code: C101
   - name: Түлхүүр өлгүүр
   - description: 3D хэвлэсэн түлхүүр өлгүүр
   - price: 8000
   - image_url: https://...
   - category: accessory
   - production_days: 1-3 өдөр
   - badge: (비워두기 또는 "Хит")
   - shape_colors: all
   - text_colors: none
   - custom_fields: none
   - active: TRUE
4. 저장 (자동)
5. 웹사이트 새로고침 → 제품 자동 표시!
```

### **색상 추가/수정:**
```
1. Colors 시트 열기
2. 새 색상 추가 또는 기존 색상 수정
3. active를 FALSE로 하면 숨김
```

### **제품 숨기기:**
```
1. Products 시트에서 해당 제품의 active를 FALSE로 변경
2. 웹사이트 새로고침
```

---

## 🆘 문제 해결

### **제품이 안 보여요**
```
1. F12 → Console 확인
2. 에러 메시지 확인:
   - "HTTP error! status: 403" → 앱 배포 권한 확인
   - "Failed to fetch" → URL 확인
   - "CORS error" → Apps Script 재배포 필요
```

### **"Google Sheets URL이 설정되지 않았습니다"**
```
→ js/script.js의 GOOGLE_SHEETS_URL 변수에 URL 입력 필요
```

### **데이터는 로드되는데 제품이 안 보여요**
```
→ Products 시트의 active 열이 TRUE인지 확인
```

---

## 📱 모바일에서 제품 관리

### **Google Sheets 앱 설치:**
```
1. 앱 스토어에서 "Google Sheets" 검색
2. 설치
3. "MONOLAB 제품 관리" 시트 열기
4. 제품 추가/수정 가능!
```

---

## 🎓 추가 학습 자료

- **GoogleSheets_시트구조_완전버전.md** - 시트 구조 상세 설명
- **GoogleSheets_HTML수정가이드.md** - HTML 수정 방법
- **최종_선택_가이드.md** - 방식 비교 및 선택 가이드

---

## 💬 도움이 필요하면

문제가 발생하면 다음 정보와 함께 문의하세요:

1. Console 에러 메시지 (F12)
2. Google Sheets URL (앞부분만)
3. 어떤 단계에서 문제가 발생했는지

---

**축하합니다! 🎉**  
이제 Google Sheets로 제품을 자유롭게 관리할 수 있습니다!

엑셀처럼 쉽게 제품을 추가/수정/삭제하세요! 😊
