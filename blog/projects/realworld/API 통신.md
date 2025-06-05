---
title: API 통신
category: projects-realworld
categoryPath: projects\realworld
date: '2025-06-05'
---
# API 통신

오늘은 백엔드와 어케 통신하고 있는지~ 알아보겠슴다

<img src="/images/projects/realworld/Pasted image 20250605193125.png" alt="Pasted image 20250605193125" width="400">

어제 디렉토리 구조를 봤던 것 처럼   
유틸이나 api 통신 관련 코드는 모두 `lib` 디렉토리 안에 있다.  
## CREATE 오류  
게시글을 눈누난나 작성하고 업로드 하면 400 에러가 발생한다.

>400 에러는 <mark>클라이언트 측에서 보낸 데이터가</mark>  
><mark>서버 데이터 형식과 맞지 않아</mark> 이해할 수 없을 때  
>발생하는 에러다.

그래서 try catch문으로 로그를 찍어봤다.  
보니까 태그를 제외한 필드를 채우지 않고  
업로드 버튼을 누르면 오류가 발생한다는 사실을 알게 됐다.

음 그렇다면 프론트에서도 이 로직을 처리해줘야겠죠?

`pages/editor/new`의 `handlesubmit` 함수에다  
title이나 description, body 중 하나라도 입력하지 않고  
제출할 시 alert이 뜨도록 아래와 같이 코드를 작성했다.  
```ts  
  const handleSubmit = async (e) => {  
    e.preventDefault();

    const missingFields = [];

    if (!posting.title.trim()) {  
      missingFields.push("제목");  
    }

    if (!posting.description.trim()) {  
      missingFields.push("설명");  
    }

    if (!posting.body.trim()) {  
      missingFields.push("본문");  
    }

    if (missingFields.length > 0) {  
      alert(`${missingFields.join(", ")}을(를) 입력해주세요.`);  
      return;  
    }  
      
    // ....  
}
```  
원래는 form에 required 속성을 넣으려고 했지만,  
버튼 타입이 submit이 아니라 button으로 되어 있어서,    
handleSubmit 함수 내에서 직접 입력값 검증과 처리를 했다.

물론, 버튼 타입을 submit으로 바꾸고 preventDefault()를 제거한 뒤,    
form에 required를 추가해도 될 것 같다.

하지만 handlesubmit에서 preventDefault()를 없애면 이 함수가 동작하지 않을거기 때문에  
개인적으로는 지금 방식이 더 유연하다고 생각한다.

특히 입력 검증을 alert으로 처리하는 게 나중에 모달창 디자인을 바꿀 때도  
수월할 것 같아서 이렇게 처리했다.

그리고 원래는 missingFields를 문자열로 초기화했었다.  
근데 이러면 각 하나씩의 오류만 처리할 수 있지 않는가.  
예를 들어 설명은 입력했는데 제목이랑 본문은 입력 안 할수도 있으니까..

그래서 문자열 말고 리스트로 바꿔 push하는 방식으로 수정했다.

`pages/editor/[pid]`에다간 해당 로직을 추가하지 않았는데,  
그 이유는 애초에 edit 페이지로 들어가면 그 전에 입력했던 필드가 차있기 때문에  
라고 생각했는데....

가만 생각하니까 내용을 지우고도 제출할 수 있잖아?! ㅋㅋ  
왜 멋대로 판단했을까..  
`pages/editor/[pid]` 에도 해당 코드를 추가했다.

근데 이러니까 갑자기,

> 두 곳에서 동일한 코드가 반복되니까 유틸에다 따로 빼주는게 좋을까? 

라는 생각이 들었다.

바로 [fundamentals 문서](https://frontend-fundamentals.com/code-quality/code/examples/use-bottom-sheet.html)의 중복 코드 허용하기 챕터 읽어보기 ㅎㅎ

읽고 생각해봤는데 해당 로직은 바뀔 일이 없다고 생각했다.  
즉 form을 여러개 추가해도,   
editor에서 관리할 일이 똑같이 생기기 때문에  
이 로직은 유틸로 따로 빼서 관리하는게 더 좋을 것 같다는 생각을 했다.

그래서 `lib/utils`에 validateArticle을 추가했다.  
```ts  
export interface ArticleFields {  
  title: string;  
  description: string;  
  body: string;  
}

function validateArticle(article: ArticleFields): string | null {  
  const missingFields: string[] = [];

  const title = article.title.trim();  
  const description = article.description.trim();  
  const body = article.body.trim();

  if (!title) {  
    missingFields.push("제목")  
  }  
  if (!description) {  
    missingFields.push("설명")  
  }  
  if (!body) {  
    missingFields.push("본문")  
  }  
  if (missingFields.length > 0) {  
    return `${missingFields.join(", ")}을(를) 입력해주세요.`;  
  }

  return null;  
}

export default validateArticle;  
```  
아까는 그냥 if문 안에서 빈 문자열인지 바로 검사했는데,  
이렇게 따로 변수로 빼서 적어주는게   
읽기가 좋아 보여서 이렇게 적었다.

그리고 if문이 여러개이면서 조건들이 간단하다 보니  
한 줄로 적을까,   
여러줄로 들여써서 적을까도 고민했는데,  
다른 코드 보니까 다 들여써서 적혀있는 컨벤션이 있는 것 같아  
들여써서 적었다.

음 근데 지금 보니까 eslint랑 prettier 설정이 안되어있다.  
오류가 다 고쳐지면 설정해야겠다.

쨌든 그리고 다시 `pages/editor/[pid]`와 `new`로 돌아와서  
Reducer로 받아온 posting 상태를  
validateArticle로 검증했을 때  
만약 뭔가가 있다면 이를 alert으로 출력하게 했다.  
<img src="/images/projects/realworld/Pasted image 20250605150910.png" alt="Pasted image 20250605150910" width="400">  
사진 속에선 변수명이 alertMessage로 되어있는데,  
errorMessage로 고쳤다.

왜냐면.. 개인 취향이긴 하지만  
alert으로 띄우는데 또 alertMessage라고 뜨는게 뭔가 별로라고 생각했다.

그렇다고 message로만 짓기엔 무슨 메시지지? 라는 의문이 생기기에  
errorMessage로 결정했다 ㅎㅎ

error까진 아닌가? 라는 생각이 잠깐 들었지만  
태그 필드 제외한 폼에는 입력 안하면 에러나니까 에러 메시지라는 변수명도 괜찮을 것 같다고 생각했다.

## READ 오류  
home에서   
1. 내 feed(your feed) 탭을 눌렀을 때 아무런 포스팅이 뜨지 않고 그냥 undefined되고,  
2. popular tags는 누를 때마다 콘솔 로그에 404가 찍혔다.  
<img src="/images/projects/realworld/Pasted image 20250605192324.png" alt="Pasted image 20250605192324" width="200">

결국 백엔드 서버를 9년전거를 써서 (헉. 넘 오래됐나)  
그 사이에 바뀐 명세가 많아 오류가 나는걸까 싶어  
백엔드 서버를 바꿔보는 결정을 했다.

도커와 django를 쓰는 형태는 그대로 유지하고  
파이썬 버전만 최신인 레포로 바꿔서 사용했다 ㅎㅎ  
사용 레포: [realworld-django-ninja](https://github.com/c4ffein/realworld-django-ninja)

그러고 다시 해보니까   
원래는 article을 delete할 때도  
500번 오류가 떴다가 404 오류가 떴는데,  
서버를 바꾸니 이 문제가 바로 해결됐다.  
500번은 서버 오류라서 한 방에 해결 된 것 같았다.

하지만 앞서 적은 your feed 탭과 popular tags 문제는 해결되지 않았다 ^..^

보니까 <mark>백엔드에는 follow 쿼리스트링이 없는데</mark> (내가 못 찾은거일 수도)  
프론트에서 my feed를 불러올 때 쿼리스트링 값을  
<mark>`http://localhost:4000/?follow=test` 로 불러오고 있어서</mark>  
프론트 `features/home`의 tablist 중 your feed 부분 쿼리값을 <mark>user로 수정</mark>해줬다.  
```tsx  
    <ul className="nav nav-pills outline-active">  
      <li className="nav-item">  
        <NavLink  
          href={`/?user=${currentUser?.username}`}  
          as={`/?user=${currentUser?.username}`}  
        >  
          Your Feed  
        </NavLink>  
      </li>  
    </ul>  
```  
다시 보니까 백엔드에는 follow에 `"/profiles/{username}/follow"`형태로 되어 있다.

근데 user로 값을 받아오는게 더 직관적인 것 같아서..   
프론트에서 엔드포인트를 수정한쪽으로 사용하기로 했다 ㅎㅎ

tags 문제는 `articles/api` 부분을 보면 아래와 같이 되어 있는데  
```python  
@router.get("/tags", response={200: Any})  
def list_tags(request) -> dict[str, Any]:  
    return {"tags": [t.name for t in Tag.objects.all()]}  
```

`config/urls`의 원래 코드가   
왼쪽 이미지 같이`/api/`라는 공통 경로에 계속 값을 덮어 쓰는 형태라 문제가 발생하는건가? 싶어   
오른쪽과 같이 덮어쓰는게 아니라 병합하여 처리하는 방향으로 수정했다.  
<img src="/images/projects/realworld/Pasted image 20250605190524.png" alt="Pasted image 20250605190524" width="700">  
이러니까 해결 됐던데, 사실 백엔드 쪽은 잘 몰라서   
~~그렇다고 프런트를 잘 아는건 아님~~  
확실히 이것때문에 해결된건지는 잘 모르겠다.

그리고 지금 또 막 해보다가 발견한건데  
title에 한국어가 들어가면 unhandled error를 내뿜었다.

아마 slug 인코딩에서 발생하는 문제라고 생각해  
백엔드의 `app/articles/models` 파일을 봤다.  
역시 인코딩 처리가 따로 없어서 문제가 발생하는거였다.

>slug란, 게시글 제목을 URL에 사용할 수 있도록 변환한 문자열을 말한다.  
>보통 띄어쓰기 대신 -를 쓰고, 특수문자나 공백을 제거해서 URL-safe한 형태로 만든다.  
>지금 내 블로그의 URL도 포스팅 할 때 사용한 한글 제목이 그대로 들어가 있는데, 이게 바로 slug다.

그래서 `python-slugify` 라이브러리를 dockerfile에 설치 후  
<img src="/images/projects/realworld/Pasted image 20250605182002.png" alt="Pasted image 20250605182002" width="400">  
articles의 models에서 인코딩 처리를 해줬다.  
<img src="/images/projects/realworld/Pasted image 20250605180615.png" alt="Pasted image 20250605180615" width="500">

그리고 front에서 slug가 들어가는 부분에 다 [encodeURIComponent](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) 함수를 감싸줬다.

encodeURI 함수 말고 encodeURIComponent 함수를 사용한 이유는,  
encodeURI는 전체 URI을 인코딩하기 때문에  
일부 쿼리 부분(여기선 slug)만 인코딩 하기 위해 <mark>encodeURIComponent 함수를 사용</mark>했다.

이러면 이제 한글 제목을 넣어도 에러를 안 내뿜는다.  
<img src="/images/projects/realworld/Pasted image 20250605184126.png" alt="Pasted image 20250605184126" width="500">

근데 하나하나 감싸며 들었던 생각이,  
변수로 따로 빼서 상위에서 관리하는게 편할 것 같다는 생각이 들었다.

그래서 아래와 같이 article과 withSlug, withToken 변수를 생성해서  
나중에 수정할 부분이 있으면 해당 유틸만 수정하면 되도록 만들었다.  
```tsx  
const article = `${SERVER_BASE_URL}/articles`;  
const withSlug = (slug) => `${article}/${encodeURIComponent(slug)}`;  
const withToken = (token) => ({  
  headers: {  
    Authorization: `Token ${encodeURIComponent(token)}`,  
    "Content-Type": "application/json",  
  },  
});  
```


## 맺음말  
api 명세의 중요성.   
뼈저리게 깨닫습니다.  
다른 부분들이 있어서 좀 힘들었네요

근데 create를 계속 연달아서 하면 409 에러가 발생하는 것 같아요  
같은 요청은 연달아 못하게 만들어야 될 것 같네욤
