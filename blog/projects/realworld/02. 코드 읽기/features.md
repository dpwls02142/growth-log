---
title: features
category: projects-realworld-02. 코드 읽기
categoryPath: projects\realworld\02. 코드 읽기
date: '2025-06-11'
---
# features
## article  
### ArticleAction  
처음엔 pages/article나 ArticleMeta에서 해당 기능을 함께 처리할까 고민했다.   
하지만 이 기능들은 오직 "수정"과 "삭제"라는 아티클 액션만 책임지기 때문에   
지금처럼 별도 컴포넌트로 분리하는 게 더 낫다고 판단했다.

다 좋은데   
1. confirm에 나타나는 메시지는   
   함수 위에서 따로 상수로 빼서 관리하는게 좋을 것 같다고 생각했다.  
   [이 글](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-readability.html)을 읽어보니 이를 "매직 넘버"라고 부른다고 한다.  
   흠 근데 넘버는 아니니까 나는 매직 스트링인가 ㅋㅋ  >> 헐 진짜네
     
   근데 댓글을 읽다보니 성능에도 이면이 있는 것 같아 흥미로웠다.  
   생각해보니 함수 내부에 있으면 컴포넌트가 리렌더링 될 때마다  
   새로운 객체가 생성될테니까 매번 새로 만들어서 사용 후에 알아서 청소해줄거다. (GC)  
   근데 사용자한테 삭제 할래 말래 confirm 떴을 때 만약에 no 하고 또 no하고  
   계속 이러면 매번 메모리에서 같은 문구인데도 불구하고 문자열을 생성하고 또 하고  
   무한 반복 할 거 아닌가.   
   그래서 변하지 않는 문자열이라면 함수 밖에서 상수로 빼서 쓰는게 좋다.  
     
2. 조건 한 번 분리시키기  
```tsx  
const canModify = isLoggedIn && currentUser?.username === article?.author?.username;  
```  
지금 수정할 수 있는지 없는지 상태를 볼 때  
1. login한 상태인지 보고,   
   현재 로그인 한 유저의 이름과 아티클 작성자의 이름을 비교해  
   이가 동일하면 수정할 수 있다고 판단한다.  
     
   지금처럼 그냥 한꺼번에 적어도 되지만  
   위에 isArticleOwner를 추가해서  
   아티클 작성자와 현재 사용자가 동일한 지 보고  
   canModify로 체크하도록 변경했다.  
     
2. 그러다 갑자기 든 생각  
   삭제도 할 수 있는데 왜 변수명이 canModify인거지  
   Modify는 수정만 할 때 쓰이지 않나? 라는 생각이 들었다.  
   그렇다고 canModifyOrDelete 라고 짓기엔 너무 변수명이 길어지고..  
   하다가 canManage 라고 짓는게 괜찮을 것 같다고 생각해 변수명을 이렇게 바꿔줬다.   
=> 이 때 [참고하면 좋을 것 같은 글](https://ux.stackexchange.com/questions/43174/update-vs-modify-vs-change-create-vs-add-delete-vs-remove)을 발견했다  
     
4. 근데 이러면 중복 닉네임이 있을 때 어떡하지?  
   아 그래서 보통 사이트를 이용하면 중복 닉네임 생성이 막히고  
   primray key로 관리 되는건가? 라는 생각이 들었다  
   근데 userName 보단 고유한 user id로 관리하는게 좋지 않나  
### ArticleList  
아티클 리스트는 말 그대로 아티클 프리뷰를 리스트 형태로 바꿔주는 컴포넌트다.  
그리고 페이지네이션을 계산하는 컴포넌트였다.

음 여기선 페이지네이션 계산 로직 때문에 숫자가 특히 더 사용돼서  
똑같이 상수로 함수 위에 빼서 썼다.

그리고 쿼리에 따른 케이스문을 처리할 때 !! 연산자를 사용하고 있어서   
<img src="/images/projects/realworld/02. 코드 읽기/Pasted image 20250611144510.png" alt="Pasted image 20250611144510" width="400">  
굳이 왜하는건지 궁금했는데 타입스크립트를 사용하고 있으니까   
boolean값을 반환 받기 위해 사용한 것 같았다.

그리고 switch case문으로 각 라우터 경로를 처리해줬는데  
조건이 다 복합 조건이니까   
함수로 따로 빼서 if 문으로 처리했다.

마지막으로 useSWR은 초기에 빈 값을 넘기기 때문에  
한 번 빈 배열로 체크하고 넘기도록 바꿨다.

### ArticlePreview  
<img src="/images/projects/realworld/02. 코드 읽기/Pasted image 20250611160347.png" alt="Pasted image 20250611160347" width="500">  
preview는 Article 객체를 받아오기 때문에  
preview.slug를 써서 article의 slug 값을 꺼내 올 수 있는데

handleClickFavorite에서 매개변수로 slug값을 굳이 넘겨 받아와야 되나?   
라는 생각이 들어서 매개변수는 제거했다.  
<img src="/images/projects/realworld/02. 코드 읽기/Pasted image 20250611160423.png" alt="Pasted image 20250611160423" width="500">  
<img src="/images/projects/realworld/02. 코드 읽기/Pasted image 20250611160627.png" alt="Pasted image 20250611160627" width="500">


또한 아티클이 없으면 ArticleList에서 처리해주고 있는데  
왜 여기서도 처리하고 있는거지 라는 생각이 들어서 관련 if문은 삭제했다.

그리고 ArticleMeta 컴포넌트가 있는데 여기서 중복되게 하드코딩으로 사용하고 있었다.  
보니까 아티클 프리뷰에선 edit과 delete 컴포넌트가 보이면 안돼서 그런 것 같았다.  
근데 아티클메타에 boolean 매개변수를 추가해서 props로 관리하는게 좋을 것 같다고 생각했다. 버튼 노출 유무만 다르니까...  
그래서 ArticleMeta에 showAction의 boolean props를 넘겨   
조건부로 렌더링하도록 변경했다.  
## comment  
딱히 수정해보고 싶은 곳이 안 보였다.  
Comment 컴포넌트만 ArticleAction처럼   
isCommentOwner랑 canManage로 분기를 한 번 더 나눴다.  
## home  
### TabList  
기존에는 아래처럼 중복되어 분기가 처리됐다.  
```  
만약 로그인 안했으면  
  - Global Feed 탭  
  - 태그 있으면 태그 탭

만약 로그인 했으면  
  - Your Feed 탭  
  - Global Feed 탭  
  - 태그 있으면 태그 탭  
```  
근데 Global Feed와 Feed Tab은 항상 보여지는 값이니  
두 값은 default로 보여주고 Your Feed만 로그인 했을 때 생기도록 분기를 바꿨다.

그리고 Maybe 컴포넌트를 사용해서   
탭리스트가 있어야 되는지 없어야 되는지를 판별했는데   
조건이 간단해서 `&&` 연산자로 대체했다.  
## profile

### Login, Register, Settings Form  
form에서 다 각각 다른 핸들러로 관리하고 있었다.   
예컨데 로그인에선 이메일 따로 패스워드 따로 이렇게.  
그래서 하나의 input 핸들러로 통합해서 사용했다. 

그리고 모든 핸들러에 useCallback을 사용하고 있었는데  
렌더링 비용이 크지 않은 단순한 핸들러에는   
굳이 사용할 필요가 없다고 생각해 제거했다.

