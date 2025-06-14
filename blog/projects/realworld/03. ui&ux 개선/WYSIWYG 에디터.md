---
title: WYSIWYG 에디터
category: projects-realworld-03. ui&ux 개선
categoryPath: projects\realworld\03. ui&ux 개선
date: '2025-06-14'
---
# WYSIWYG 에디터

현재 아티클을 작성하려 editor 페이지에 들어가면,  
body 부분에 이런 placeholder가 적혀있다.  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614152225.png" alt="Pasted image 20250614152225" width="400">

> Write Your Article <mark>**(in markdown)**</mark>

마크다운으로 아티클을 입력하라니..  
물론, 마크다운이 익숙한 사람도 많지만  
익숙하지 못한 사람도 많다.

아래 사진의 네이버 블로그 에디터나,   
다른 여타 블로그 에디터들처럼  
툴바에서 헤더나 서체를 설정해   
글을 작성하는 방법은 없을까?

<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614152402.png" alt="Pasted image 20250614152402" width="400">

> 위즈위그(WYSIWYG) 에디터를 활용해 글을 입력 받으면 된다.

위지위그란,  
What You See Is What You Get의 약자로  
내가 적은 글 그대로  
페이지에서 글을 볼 수 있다는 의미를 갖고있다.

따라서 워드도 위지위그의 일종이며,  
이러한 위즈위그 에디터의 종류는 다양하다.  
React Quill이나, tiptap, lexical 등...

## [React Quill](https://quilljs.com/docs/quickstart)  
일단 먼저 React Quill 라이브러리를 활용해  
에디터의 body 폼에 적용해봤다.

참고로 quill이란,  
아래 사진처럼 깃으로 만든 필기구를 의미 한다고 한다.  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614160717.png" alt="Pasted image 20250614160717" width="300">

적용 결과는 다음과 같다.  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614160435.png" alt="Pasted image 20250614160435" width="400">

<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614144232.png" alt="Pasted image 20250614144232" width="400">  
~~적용 방법은 공식 문서에서 더 자세히 설명해주니 스킵..~~

보다시피 잘 적용된 모습을 볼 수 있당

원래는 아티클 페이지에서 mark를 활용해 마크다운을 한 번 렌더링했는데  
해당 라이브러리를 도입하며 바로 html을 받아오기 때문에   
아티클에 있는 mark 관련 코드는 제외했다.

또한 초기엔 quill 라이브러리를 바로 named import해서 불러왔는데,  
`document is not defined `오류가 발생했다.

왜일까? 생각해보니  
`editor/new` 페이지는 static하지만  
`ediotr/[slug]` 페이지는 서버사이드에서 실행되고 있다.  
quill 라이브러리는 클라이언트에서만 실행된다.

따라서 quill 라이브러리가 포함된 body 폼은  
dynamic으로 불러와 ssr에서 제외되도록 했다.

## 근데..  
잘 작동은 하는데,  
quill 라이브러리를 그대로 쓸까?  
아니면 다른 라이브러리도 써볼까? 고민이 됐다.

다른 분들은 요새 뭘 쓰는지 궁금해서 ,  
레딧에서 찾아봤는데  
확장이 쉽다는 이유로 대부분 Lexical을 사용하고 있는걸로 보였다.

- https://www.reddit.com/r/nextjs/comments/1f840u7/which_wysiwyg_editor_is_best_for_next_js_and/ 

그 다음으로 많이 나온건 tiptab이다.  
흠 그럼 이 라이브러리들과 quill 라이브러리는 어떤 차이가 있는걸까?

## 차이점 비교하기

찾아보니 이런 사이트가 있어서

- https://npm-compare.com/lexical,quill,tiptap

각종 다양한 npm 라이브러리들을 한 눈에 비교할 수 있었다.  
~~완전 조은 사이트~~

다운로드율로 보면 quill > lexical > tiptab 순이다.  
아무래도 quill이 가장 보편화? 되어있고 나온지 오래돼서 그런 것 같다.

tiptab은 ProseMirror를 기반으로 구축되었다고 한다.  
[prosemirror](https://prosemirror.net/)는 리치텍스트 라이브러리를 구축하는 데 필요한   
모든 구성 요소를 갖춘 전체 플랫폼이라 할 수 있다.

한마디로 내가 0부터 위지위그를 만드려면   
엣지케이스가 많아서 개발하기 힘든데,  
prosemirror로 좀 편하게 개발을 할 수 있다는 ㅇㅅㅇ  
또한 번들 크기도 엄청 작다고 한다.

음 근데 지금 위지위그 에디터를 만드는 시간은 아니니,  
뭔가 버그나 기능적으로는 각각 어떤 차이가 있는지 궁금했다.

아래 자료들을 봐보니,

- https://www.indiehackers.com/post/which-editor-tiptap-quill-lexical-ba00e4d05d  
- https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025

요새 대부분의 사람들이 tiptap이나 lexical을 사용하는 이유는  
공동 작업이 안되기 때문인 것 같았다.

근데 나는 지금 공동 작업에 쓰일 일도 없고...  
오로지 아티클만 작성하는건데 굳이 라이브러리를 다른걸 써야될까?  
싶어 결론적으론 quill을 사용하기로 했다.


