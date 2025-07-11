---
title: "데이터베이스, api"
category: projects-clone coding-01. 초기세팅
categoryPath: projects\clone coding\01. 초기세팅
date: "2025-07-11"
---

# 데이터베이스, api

## 데이터베이스 구조 잡기

- Product
  - product id (기본키)
  - seller id (외래키), 1:n
  - product name: 상품 이름
  - base price: 기본 금액
  - isActive: 현재 구매할 수 있/없는 상품인지
  - createdAt: 상품 올린 날
  - updateAt: 상품 업데이트 한 날
- Product Inventory
  - inventroy id (기본키)
  - product id (외래키), 1:n
  - current stock: 현재 남은 수량
  - lastUpdated: 마지막 업뎃

::: warning  
product.updateAt: 상품 제목이나 가격 등이 마지막으로 수정된 시점  
productInventory.lastUpdate: 상품 재고가 마지막으로 수정된 시점  
:::

- Product Option
  - option id (기본키)
  - product id (외래키) 1:n
  - option value (색상인지, 사이즈인지 ... etc)
  - option name (value에 맞는 name)
  - additional Price (옵션에 따른 추가 금액, nullable)
  - stock quantity: 재고 수량
    - product inventory의 current stock과 product option의 stock quantity 차이
      - product inventory의 current stock: 빨간 티셔츠 재고 100개
      - product option의 stock quantity: 빨간 티셔츠 L 사이즈 60개, M 사이즈 40개

::: warning  
실제 프로덕트라면 option value와 name을 json 형태로 관리하는게 좋을 것 같음  
:::

- Product Discount
  - discount id (기본키)
  - product id (외래키), 1:n
  - discount type: daily deal인지, brand deal인지, 그냥 일반 세일 상품인지
  - discount rate: 할인율 (min:1 max:99, nullable)
  - discountedPrice: 할인 가격 (basePrice \* (1 - discountRate / 100))
    - 할인율만 저장하면 매번 렌더링 될 때 할인가를 계산해야함
  - startDate: 세일 시작 날짜
  - endDate: 세일 끝난 날짜
- Product Image
  - image id (기본키)
  - product id (외래키), 1:n
  - image url: 이미지 url
  - image type: 썸네일 or 상세설명 페이지
- Cart
  - cart id (기본키)
  - customer id (외래키)
- Cart product
  - Cart Item id (기본키)
  - Cart id (외래키)
  - option id (외래키)
  - quantity (수량 몇 개인지)
  - isSelectedCheckbox (장바구니 선택 체크 했는지, 안 했는지 / 기본값: true)
  - addedAt (장바구니에 추가한 날짜)
- Customer
  - customer id (기본키)
  - customer name
- Review
  - review id (기본키)
  - customer id (외래키) 1:n
  - product id (외래키) 1:n
  - review detail: 리뷰 설명
  - image url: 리뷰 이미지
  - review score: 별점 (min:1 max:5)
  - createdAt: 리뷰 생성한 날짜
  - review favorte (리뷰 좋아요 개수, nullable)

::: warning  
좋아요 누른 유저 정보까지 저장해야하지만 현재는 counting만 처리  
:::

- Seller
  - seller id (기본키)
  - seller name

<img src="/images/projects/clone coding/01. 초기세팅/Pasted image 20250711093432.png" alt="Pasted image 20250711093432" width="600">

::: warning  
customer와 seller에는 더 많은 컬럼이 필요하지만, 현재 클론할 페이지에서 사용될 데이터만 구조를 생각함.  
:::

## faker.js 사용하기

1. 데이터 개수

- 매직넘버로 선언 후 length에 맞게 array 돌리기
- 수량 수정하고 싶으면 매직넘버만 수정하면 됨
  - 상품 개수: 20개
  - 할인 상품 개수: 10개
  - 판매자: 10명
  - 고객: 5명

2. primary key
   - integer VS faker.js의 uuid 메서드
   - id는 string type으로 변경
3. 날짜
   - 날짜 유효성 검사했던 로직 적기

## server-json

1. package.json scripts에 `"json-server{실행할 명령어}: json-server --watch {db경로} --port {포트번호}"`
2. 그 후 `pnpm json-server{1번에서 설정한 명령어}` 하면 1번에서 설정한 포트 번호로 백엔드 주소 생성  
   <img src="/images/projects/clone coding/01. 초기세팅/Pasted image 20250711102439.png" alt="Pasted image 20250711102439" width="300">
