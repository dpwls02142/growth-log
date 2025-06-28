---
title: Article 렌더링 속도 개선하기
category: projects-realworld-05. 최적화
categoryPath: projects\realworld\05. 최적화
date: '2025-06-28'
---
# Article 렌더링 속도 개선하기  
4G network 상태임에도 Article List에 있는 Article을 눌러서  
데이터를 페칭해올 때 속도가 <mark>2.5s</mark>로 엄. 청. 느리다. 

<img src="/images/projects/realworld/05. 최적화/Pasted image 20250628105622.png" alt="Pasted image 20250628105622" width="600">

뭐, 누군가는 2.5s가 빠르다고 할 수도 있을텐데   
25년 기준 미국에서 데스크톱 기준 평균 렌더링 속도는 1.7s라고 한다. [참고 자료](https://www.debugbear.com/blog/website-speed-statistics) 

1.7s와 2.5s는 약 1s나 차이가 나는데, 사용자 입장에선 1s도 체감상 엄청 긴 시간이다. 

일단 가장 처음에 든 의문은 다음과 같다.  
## 로컬에서 실행할 땐 빠른데..   
말 그대로 로컬에서 빌드하고 런했을 땐 아티클을 불러오는 속도가 <mark>260ms</mark>로 나타난다.  
260ms와 2.5s는 약 10배 차이가 난다.  
왜 이렇게 차이가 나는걸까?

<img src="/images/projects/realworld/05. 최적화/Pasted image 20250628112324.png" alt="Pasted image 20250628112324" width="600">

일단 잘 보면 로컬 환경에선 `router.ts`에서 직접 라우팅이 된다.   
반면 Vercel로 배포한 프로덕션 환경에서 데이터가 페칭되는 경로를 보면   
`commons.xxx.js`에서 온다고 나와있다.

이는 프로덕션 환경에서   
1. 모든 JavaScript 코드가 번들링되어 청크 파일로 분할되고,   
2. 브라우저가 이러한 번들 파일들을 다운로드하고  
3. 파싱한 후에야   
자바스크립트가 실행되기 때문이다.

그럼 어떻게 해야 프로덕션 환경에서도 로컬처럼 데이터 페칭 속도를 기대할 수 있을까?  
## 개선하기  
### Region 건드리기  
가장 먼저 데이터베이스 서버 region이 물리적으로 넘 멀리 있어서 그런거 아닐까?   
라는 생각에 supabase 설정들을 건드려보기로 했다.

오잉 이미 서울로 잘 설정되어 있다. (머쓱)  
<img src="/images/projects/realworld/05. 최적화/Pasted image 20250628114723.png" alt="Pasted image 20250628114723" width="300">  
찾아보니 애초에 프로젝트를 생성할 때   
수파베이스에서 내 IP 위치상 가까운 곳을 설정 지역으로 추천해준다고 한다.  
하지만 이 때 한 번 설정한 리전은 추후 변경할 수 없다고 한다. [참고](https://supabase.com/docs/guides/troubleshooting/change-project-region-eWJo5Z)

근데 vercel의 region은   
`Washington, D.C., USA (East) - us-east-1 - iad1`으로  
북미 지역에 설정되어 있다.

vercel에서 정적 페이지를 배포할 땐 가장 가까운 엣지(Edge) 서버에서 캐싱하고 서빙하지만, `getServerSideProps`와 같은 서버리스 함수는 특정 리전에서 실행된다.  
현재 개별 article이든, 전체 article list든 SEO를 위해 SSR에서 데이터를 페칭해오고 있다.

우리나라에서 북미까지 비행기 타고 가려면 몇 시간이 걸리는가?

<img src="/images/projects/realworld/05. 최적화/Pasted image 20250628193617.png" alt="Pasted image 20250628193617" width="500">

(feat. 구글맵 경로찾기)

무려 약 13시간 50분이 걸린다.   
물론 데이터는 비행기를 타고 가지 않는다. 광속으로 이동한다.   
하지만 그 먼 거리를 갔다 와야 한다는 건 마찬가지다.

따라서 vercel에서도 supabase의 region과 가장 가까운 인천으로 지역을 설정했다.

변경 방법은 vercel의 project settings에서 functions 하위 항목으로 들어가  
Advanced Settings의 Function Region을 변경해주면 된다.

이것만 했는데도 데이터 페칭 속도가 2.5s에서 813ms로 <mark>**약 67% 단축**</mark>됐다.

<img src="/images/projects/realworld/05. 최적화/Pasted image 20250628174307.png" alt="Pasted image 20250628174307" width="600">

흠 그래도 아직 부족하단 말이다.  
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeZ_g2Au-Y6bNPugwSCskdUaZFb8DX5aFDyA&s" width="150">

### 쿼리 단순화 하기  
쿼리가 복잡하면 그만큼 갖고오는  
컬럼의 수도 늘어나기에 이도 데이터 페칭 속도에 영향을 줄 수밖에 없다.

그러니 ArticleAPI get의 쿼리를 리팩토링해보자.  
보니까 개별 Article을 get해올 때   
enrichArticles 함수를 사용하고 있었다.

enrichArticles 함수에선 즐겨찾기와 사용자 팔로우 정보를 불러오고 있었는데,  
Article의 상세 페이지를 불러올 땐 해당 정보를 사용하지 않기때문에 지워줬다.

불필요한 쿼리를 지우니 페칭 속도가 813ms에서 187ms로 <mark>**약 77%**</mark> 단축 됐다.

<img src="/images/projects/realworld/05. 최적화/Pasted image 20250628190708.png" alt="Pasted image 20250628190708" width="600">

왜 그랬던걸까 생각해보면 enrich 함수가 은근 많은 일을 하고 있다.  
1. `getFollowStatus` 함수에서 `user_followers` 테이블 조회하고  
2. 각 article의 즐겨찾기 정보를 계산한 후에  
3. 배열을 돌며 모든 article에 대한 정보를 추가하고 있다.

쿼리를 하나 추가할 때마다 네트워크 라운드 트립은 한 번씩 더 발생한다.

네트워크 라운드 트립(RTT, Round Trip Time)이란,   
**클라이언트가 서버에 요청을 보내고, 서버가 응답을 돌려보내는 전체 과정에 걸리는 시간**을 말한다.

즉  
- 기존에는 Article 조회 (1 RTT) + 팔로우 상태 조회 (1 RTT) = 총 2 RTT인 반면,  
- 개선 결과는 Article 조회 (1 RTT)만 하기에 총 1 RTT가 걸린다.  
서울-워싱턴 간 RTT가 200ms라면, 쿼리 하나만 줄여도 200ms가 단축되는 것이다.

## 결론  
1. 물리적 거리를 무시하지 말자  
2. 라운드 트립을 줄이자


