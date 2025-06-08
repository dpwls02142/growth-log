---
title: pages
category: projects-realworld-02. 코드 읽기
categoryPath: projects\realworld\02. 코드 읽기
date: '2025-06-08'
---
# pages  
저번 디렉토리 구조를 살펴볼 때도 봤지만   
next.js는 pages 디렉토리 아래에 둔 하위 디렉토리를 알아서 url 경로로 지정해준다.  
## article  
### 읽어보기  
article은 ArticlePreview 컴포넌트를 눌렀을 때 이동되는 Article의 상세 페이지다.

<img src="/images/projects/realworld/02. 코드 읽기/Pasted image 20250608125542.png" alt="Pasted image 20250608125542" width="400">  
코드를 한 줄 한 줄 읽어보자.

일단 ArticlePage라는 함수로 initialArticle이라는 Props를 받는다.  
```tsx  
const ArticlePage = (initialArticle) => {  
```  
초창부터 궁금한 점이 생겼다.   
왜 { }로 감싸서 구조분해할당을 사용하지 않는거지?  
하고 밑을 쭉 봤는데 

굳이 initialArticle을 분해해서 사용할 필요가 없기 때문에   
구조분해할당을 사용하지 않은 것 같다.

하지만 현재 프로젝트에서 타입스크립트를 사용하고 있으니   
데이터 타입을 명확히 하고 어떤 props를 받는지 한눈에 알 수 있게 하기 위해  
{ }로 감싸주는게 좋을 것 같다고 생각했다.

그러고 useRouter를 활용해 현재 페이지의 라우팅 정보에 접근한다.    
pid로 받아오고 있으니 쿼리값도 pid로 받아온다.   
```ts  
  const router = useRouter();  
  const { query: { pid }, } = router;  
```  
근데 내가 저번에 아티클 페이지의 엔드포인트를 slug 형태로 인코딩하는식으로 바꿨었다.  
고로 pid 값도 slug로 바꾸는게 좋을 것 같아 comment와 함께 query 값을 고쳐줬다.

그 후 fetchedArticle에 useSWR로 데이터를 패칭해서 가져온 걸 저장한다.  
useSWR은 캐싱과 재검증, 에러 처리 등을 자동으로 해준다.  
~~자세한건 추후 SWR과 tanstack을 비교할 때 공부해보는걸로..~~  
`initialData`로 서버사이드에서 가져온 데이터를 초기값으로 설정해준다.  
```ts  
const { data: fetchedArticle } = useSWR(  
  `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(pid))}`,  
  fetcher,  
  { initialData: initialArticle },  
);  
```

그러고 article에 fetchedArticle이나 initalArticle 중에서 가능한 데이터를 선택해 추출한다.  
```ts  
const { article }: Article = fetchedArticle || initialArticle;  
```  
근데 여기서 또 궁금했던 것..   
현재는 **전체 객체를 Article 타입으로 지정하고 있는데   
실제로는 article 속성만 Article 타입이어야 한다.**

그니까 지금은 `fetchedArticle || initialArticle`  
이 전체를 Article 타입으로 설정하고 있다.

근데 fetchedArticle이나 initialArticle 둘 중에   
실제로 갖고온 속성만 Article 타입으로 갖고와야하지 않는가.

그래서 따로 articleData에 먼저 비교하고 거기서 받아온걸 article에 넣었다.  
```ts  
  const articleData = fetchedArticle || initialArticle;  
  const { article } = articleData;  
```

그 후엔 렌더링하고, getInitialProps로 초기데이터를 가져오는 부분이 적혀있다.

즉 article 페이지를 세 문장으로 설명하자면  
1. 서버에서 getInitialProps로 initialArticle을 생성하고  
2. 클라이언트에서 페이지가 렌더링되면  
3. useSWR이 fetchedArticle로 최신 데이터를 요청해서 가져와 렌더링한다.

### 분리하기  
근데 지금 ArticlePage 한 함수 안에 라우팅도 있고, 데이터 페칭도 있고, 처리도 있고, 렌더링도 하고 책임이 너무 몰려있다는 생각이 들었다.

Hook을 분리해야 될까 라는 생각이 들었는데,  
물론 구현 상세가 노출되어 맥락이 많지만   
다른 컴포넌트에서 이 컴포넌트를 사용할 가능성이 있는가?   
라고 물으면 아닌 것 같아서 따로 분리하지 않고 원래대로 냅뒀다

다만 렌더링은 너무 길게 읽힌다는 느낌이 있어 컴포넌트로 분리해서 추상화했다.   
하지만 이렇게 하면 **시선을 이동해서 다시 읽어야 한다는** 단점이 있긴 한데..   
나는 이게 더 읽기 좋은 것 같다고 느껴져서 이렇게 했다.   
구현 상세가 그렇게까지 드러난 로직들은 아니지만,   
컴포넌트로 분리해서 쓰는게 낫다고 생각해서 이렇게 한 거고..   
사실 정답이 없는 문제라 어려운 것 같다.

맨 처음에는  
ArticleBanner와 ArticleContent, TagList, CommentSection으로 하나하나 나눴었다.

근데 이러다 든 생각이 어차피 ArticleContent와 TagList는 하나의 집합으로 되어있는데  
<img src="/images/projects/realworld/02. 코드 읽기/Pasted image 20250608154418.png" alt="Pasted image 20250608154418" width="400">  
굳이 이걸 다 하나하나 나눌 필요가 있는가란 생각이 들었다.  
책임을 너무 세분화한다는 생각이 들었기 때문이다.   
그래서 ArticleBody로 한 번에 통합시켰다.

그러고 다시 쭉 읽어보는데 뭔가 마음에 안 들었다.   
왜지 라고 생각해보는데 화살표함수를 사용해서 그런 것 같았다.   
굳이 화살표 함수를 사용할 필요도 없을 뿐더러   
나는 일반함수를 쓰는게 읽기가 더 좋아서 좋아하기 때문에 일반함수로 고쳐줬다.  
### 최종 코드  
```tsx  
import marked from 'marked';  
import { useRouter } from 'next/router';  
import React from 'react';  
import useSWR from 'swr';

import ArticleMeta from '../../features/article/ArticleMeta';  
import CommentList from '../../features/comment/CommentList';  
import ArticleAPI from '../../lib/api/article';  
import { Article } from '../../lib/types/articleType';  
import { SERVER_BASE_URL } from '../../lib/utils/constant';  
import fetcher from '../../lib/utils/fetcher';

interface ArticleBannerProps {  
  title: string;  
  article: Article;  
}

interface ArticleBodyProps {  
  htmlContent: { __html: string };  
  tags: string[];  
}

interface ArticlePageProps {  
  initialArticle: { article: Article };  
}

function ArticleBanner({ title, article }: ArticleBannerProps) {  
  return (  
    <div className="banner">  
      <div className="container">  
        <h1>{title}</h1>  
        <ArticleMeta article={article} />  
      </div>  
    </div>  
  );  
}

function ArticleBody({ htmlContent, tags }: ArticleBodyProps) {  
  return (  
    <div className="row article-content">  
      <div className="col-xs-12">  
        <div dangerouslySetInnerHTML={htmlContent} />  
        <ul className="tag-list">  
          {tags.map((tag) => (  
            <li key={tag} className="tag-default tag-pill tag-outline">  
              {tag}  
            </li>  
          ))}  
        </ul>  
      </div>  
    </div>  
  );  
}

function CommentsSection() {  
  return (  
    <div className="row">  
      <div className="col-xs-12 col-md-8 offset-md-2">  
        <CommentList />  
      </div>  
    </div>  
  );  
}

function ArticlePage({ initialArticle }: ArticlePageProps) {  
  const router = useRouter();  
  const { query: { slug }, } = router;

  const { data: fetchedArticle } = useSWR(  
    `${SERVER_BASE_URL}/articles/${encodeURIComponent(String(slug))}`,  
    fetcher,  
    { initialData: initialArticle },  
  );

  const articleData = fetchedArticle || initialArticle;  
  const { article } = articleData;

  const htmlContent = {  
    __html: marked(article.body, { sanitize: true }),  
  };

  return (  
    <div className="article-page">  
      <ArticleBanner title={article.title} article={article} />

      <div className="container page">  
        <ArticleBody htmlContent={htmlContent} tags={article.tagList} />

        <hr />  
        <div className="article-actions" />

        <CommentsSection />  
      </div>  
    </div>  
  );  
}

ArticlePage.getInitialProps = async ({ query: { slug } }) => {  
  const { data } = await ArticleAPI.get(slug);  
  return data;  
};

export default ArticlePage;

```

## editor

## profile

## user
