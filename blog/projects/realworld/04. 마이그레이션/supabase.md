---
title: supabase
category: projects-realworld-04. 마이그레이션
categoryPath: projects\realworld\04. 마이그레이션
date: '2025-06-17'
---
# supabase  
Supabase는 Firebase의 오픈소스 대안으로 불리는 백엔드 서비스다.   
PostgreSQL 데이터베이스를 기반으로 실시간 기능, 인증, 스토리지 등을 제공한다.  

### supabase를 선택한 이유  
Firebase와 비교했을 때 Supabase의 가장 큰 장점은   
SQL 데이터베이스를 사용한다는 점이다. 

Firebase의 NoSQL과 달리   
관계형 데이터베이스의 복잡한 쿼리와 조인을 활용할 수 있어   
유연한 데이터 모델링이 가능하다.

물론 RealWorld 서비스의 기본 엔드포인트는 <br>
여러 조건을 동시에 필터링 하는 경우는 거의 없기에 <br>
firebase를 사용해도 충분할 것 같기도하다.

하지만 Supabase가 개발자 친화적인 UI를 제공하고 <br>
성능 면에서도 더 우수하다는 평가를 받고 있어서, [참고 자료](https://github.com/supabase/benchmarks/issues/8) <br>
한 번 경험해보고 싶었다.

고로 배포를 위해 <mark>docker 환경에서 실행하던 백엔드를 supabase로 옮겨 사용</mark>했다.  

## 발생한 문제점  
문제점까진 아닌 것들도 있지만...  

### 이메일 인증 문제  
테스트 과정에서 실제 이메일 주소 대신   
여러 개의 테스트용 이메일을 사용해야 했는데,   
기본적으로 이메일 인증이 활성화되어 있어 불편했다.

그래서 supabase 설정에서  
- authentication < sign in / providers < email < confirm email  
<img src="/images/projects/realworld/04. 마이그레이션/Pasted image 20250617191414.png" alt="Pasted image 20250617191414" width="400">  
네모 박스를 친 속성을 비활성화 해줬다.

### TabList 문제  
루트 페이지의 Your Feed, Global Feed 탭과   
프로필 페이지의 My Articles, Fav Articles 탭에서   
활성 상태가 제대로 표시되지 않는 문제가 있었다. 

원본 코드를 보니 NavLink 컴포넌트를 사용했던데,   
가만보니 components 디렉토리에 CustomLink 컴포넌트도 있어서   
두 컴포넌트의 차이점을 찾아봤다.

CustomLink는 단순한 링크 래퍼 컴포넌트인 반면,  
NavLink는 네비게이션 전용 컴포넌트라   
useRouter를 사용해서 현재 URL과 링크의 as 속성을 비교했다.

즉, NavLink는 "주소가 완전히 똑같은가?"를 확인하는데  
profile과 root 페이지에선   
"favorite이 있는가?", "follow가 있는가?"와 같은   
복잡한 엔드포인트 조건을 확인해야 한다.

그래서 CustomLink 컴포넌트로 바꾸고 직접 조건을 주는 형태로 변경했다.

### 406 에러  
프로필 페이지에서 다른 사람의 프로필을 볼 때는 문제가 없었지만,   
자신의 프로필을 볼 때 406 에러가 발생했다. 

406 에러는 서버가 요청에 대해 적절한 응답 형식을 제공할 수 없을 때 발생하는건데..  
흠 코드를 보니 자신의 프로필일때도 팔로우 상태를 조회하려고 해서 발생한 문제였다. 

따라서 user api에다  
자신의 프로필을 스스로 조회할 땐  
follow 상태를 비활성화해줬다.
