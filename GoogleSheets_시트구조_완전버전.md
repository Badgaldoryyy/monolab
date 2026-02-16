# 📊 Google Sheets 완전 설정 가이드 (커스터마이징 버전)

## 🎯 이 가이드로 할 수 있는 것:

✅ 제품 추가/수정/삭제 (엑셀처럼)  
✅ 카테고리별 분류  
✅ 색상 선택 옵션 관리  
✅ 커스텀 입력 필드 관리 (제품마다 다르게)  
✅ 필요 없는 필드 자동 숨김  
✅ 코드 수정 없이 모든 것 관리  

---

## 📋 1단계: Google Sheets 만들기

### **1. 새 Google Sheets 만들기**
- https://sheets.google.com
- "새로 만들기" 클릭
- 제목: "MONOLAB 제품 관리"

### **2. 시트 3개 만들기**

왼쪽 하단에서 시트 추가:
1. **Products** (제품 정보)
2. **Colors** (색상 목록)
3. **CustomFields** (커스텀 필드)

---

## 📄 2단계: Products 시트 설정

### **첫 번째 줄 (헤더):**

```
A열: id
B열: code
C열: name
D열: description
E열: price
F열: image_url
G열: category
H열: production_days
I열: badge
J열: shape_colors
K열: text_colors
L열: custom_fields
M열: active
```

### **데이터 예시:**

| id | code | name | description | price | image_url | category | production_days | badge | shape_colors | text_colors | custom_fields | active |
|----|------|------|-------------|-------|-----------|----------|-----------------|-------|--------------|-------------|---------------|--------|
| 1 | C003 | Хүүхдийн дурсгал | Танай хүүхдийн төрсөн өдрийн мэдээллийг захиалгат хэвлэсэн онцгой дурсгал | 40000 | https://www.genspark.ai/api/files/s/s45aRmVk | gift | 1-3 өдөр | Шинэ | gray,beige,white | black,blue,purple,green,pink,red,yellow,orange | baby_name,birth_date,weight,height,birth_time | TRUE |
| 2 | C101 | Түлхүүр өлгүүр | 3D хэвлэсэн захиалгат түлхүүр өлгүүр | 8000 | https://example.com/keyring.jpg | accessory | 1-3 өдөр | Хит | all | none | text_custom | TRUE |

### **열 설명:**

- **id**: 제품 ID (숫자, 1, 2, 3...)
- **code**: 제품 코드 (C003, C101...)
- **name**: 제품명 (몽골어)
- **description**: 설명 (몽골어)
- **price**: 가격 (숫자만, 쉼표 없이)
- **image_url**: 이미지 URL
- **category**: 카테고리 (gift, accessory, decor, seasonal)
- **production_days**: 제작 기간 (예: "1-3 өдөр")
- **badge**: 배지 (Шинэ, Хит, 또는 비워두기)
- **shape_colors**: 아기 모양 색상 (쉼표로 구분, 예: gray,beige,white 또는 all 또는 none)
- **text_colors**: 텍스트 색상 (쉼표로 구분, 예: black,blue,red 또는 all 또는 none)
- **custom_fields**: 커스텀 필드 (쉼표로 구분, 예: baby_name,birth_date 또는 none)
- **active**: 활성화 (TRUE/FALSE)

---

## 🎨 3단계: Colors 시트 설정

### **첫 번째 줄 (헤더):**

```
A열: id
B열: color_code
C열: color_name_mn
D열: color_hex
E열: pla_code
F열: active
```

### **데이터 (처음에 준 컬러 목록):**

| id | color_code | color_name_mn | color_hex | pla_code | active |
|----|------------|---------------|-----------|----------|--------|
| 1 | white | Цагаан | #FFFFFF | 11100 | TRUE |
| 2 | beige | Бэйж | #F5F5DC | 11401 | TRUE |
| 3 | gray | Саарал | #808080 | 11180 | TRUE |
| 4 | black | Хар | #000000 | 11101 | TRUE |
| 5 | blue | Цэнхэр | #0000FF | 11600 | TRUE |
| 6 | sky_blue | Тэнгэр цэнхэр | #87CEEB | 11401 | TRUE |
| 7 | navy | Хар цэнхэр | #000080 | 11602 | TRUE |
| 8 | purple | Ягаан | #800080 | 11700 | TRUE |
| 9 | lilac | Нил ягаан | #C8A2C8 | 11701 | TRUE |
| 10 | pink | Ягаан | #FFC0CB | 11201 | TRUE |
| 11 | red | Улаан | #FF0000 | 11200 | TRUE |
| 12 | orange | Улбар шар | #FFA500 | 11300 | TRUE |
| 13 | yellow | Шар | #FFFF00 | 11400 | TRUE |
| 14 | green | Ногоон | #008000 | 11400 | TRUE |
| 15 | olive | Чидун ногоон | #808000 | 11501 | TRUE |
| 16 | brown | Бор | #A52A2A | 11600 | TRUE |
| 17 | light_brown | Цайвар бор | #D2691E | 11801 | TRUE |

### **열 설명:**

- **id**: 색상 ID
- **color_code**: 영어 코드 (프로그램용)
- **color_name_mn**: 몽골어 이름 (화면 표시용)
- **color_hex**: 색상 코드 (#RRGGBB)
- **pla_code**: PLA 재질 코드
- **active**: 사용 가능 여부 (TRUE/FALSE)

---

## 📝 4단계: CustomFields 시트 설정

### **첫 번째 줄 (헤더):**

```
A열: field_code
B열: field_name_mn
C열: field_type
D열: placeholder
E열: required
```

### **데이터 예시:**

| field_code | field_name_mn | field_type | placeholder | required |
|------------|---------------|------------|-------------|----------|
| baby_name | Хүүхдийн нэр | text | Нэр оруулна уу | TRUE |
| birth_date | Төрсөн огноо | date | | TRUE |
| weight | Жин (кг) | number | 3.5 | TRUE |
| height | Өндөр (см) | number | 50 | TRUE |
| birth_time | Төрсөн цаг | time | | TRUE |
| text_custom | Бичих текст | text | Текст оруулна уу | TRUE |
| name_custom | Нэр | text | Нэр оруулна уу | TRUE |
| phone_custom | Утасны дугаар | tel | 99001122 | FALSE |

### **열 설명:**

- **field_code**: 필드 코드 (영어, 프로그램용)
- **field_name_mn**: 몽골어 라벨 (화면 표시)
- **field_type**: 입력 타입 (text, number, date, time, tel, email)
- **placeholder**: 힌트 텍스트
- **required**: 필수 여부 (TRUE/FALSE)

---

## 📊 카테고리 코드

Products 시트의 **category** 열에 사용:

```
gift      → 🎁 Бэлэг дурсгал (기념품/선물)
accessory → 👜 Цүнх хэрэгсэл (가방 액세서리)
decor     → 🏠 Интерьер чимэглэл (인테리어)
seasonal  → 📅 Улирлын бүтээгдэхүүн (계절 상품)
```

---

## 🎯 색상 설정 방법

### **1. 모든 색상 허용:**
```
shape_colors: all
text_colors: all
```

### **2. 특정 색상만:**
```
shape_colors: gray,beige,white
text_colors: black,blue,red
```

### **3. 색상 선택 없음:**
```
shape_colors: none
text_colors: none
```

---

## 📝 커스텀 필드 설정 방법

### **1. 아기 제품 (모든 필드):**
```
custom_fields: baby_name,birth_date,weight,height,birth_time
```

### **2. 텍스트만 입력:**
```
custom_fields: text_custom
```

### **3. 이름만 입력:**
```
custom_fields: name_custom
```

### **4. 커스텀 없음:**
```
custom_fields: none
```

---

## 🎁 제품 추가 예시

### **예시 1: 아기 기념품 (현재 제품)**

| 열 | 값 |
|----|---|
| id | 1 |
| code | C003 |
| name | Хүүхдийн дурсгал |
| description | 설명 |
| price | 40000 |
| image_url | https://... |
| category | gift |
| production_days | 1-3 өдөр |
| badge | Шинэ |
| shape_colors | gray,beige,white |
| text_colors | black,blue,purple,green,pink,red,yellow,orange |
| custom_fields | baby_name,birth_date,weight,height,birth_time |
| active | TRUE |

---

### **예시 2: 키링 (단순 제품)**

| 열 | 값 |
|----|---|
| id | 2 |
| code | C101 |
| name | Түлхүүр өлгүүр |
| description | 3D хэвлэсэн түлхүүр өлгүүр |
| price | 8000 |
| image_url | https://... |
| category | accessory |
| production_days | 1-3 өдөр |
| badge | Хит |
| shape_colors | all |
| text_colors | none |
| custom_fields | none |
| active | TRUE |

---

### **예시 3: 명판 (텍스트 입력)**

| 열 | 값 |
|----|---|
| id | 3 |
| code | C102 |
| name | Хувийн тэмдэг |
| description | Нэр бичигдсэн хувийн тэмдэг |
| price | 15000 |
| image_url | https://... |
| category | gift |
| production_days | 1-3 өдөр |
| badge | |
| shape_colors | blue,red,black |
| text_colors | none |
| custom_fields | name_custom |
| active | TRUE |

---

## 💡 사용 팁

### **제품 임시 숨기기:**
```
active: FALSE
```

### **품절 표시:**
```
badge: Дууссан
```

### **할인 표시:**
```
badge: Хямдрал
```

### **신제품 표시:**
```
badge: Шинэ
```

---

## 🚀 다음 단계

이제 Google Apps Script를 설정하고 웹사이트 코드를 업데이트하겠습니다!

계속 진행할까요? 😊
