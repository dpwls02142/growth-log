---
title: Header
category: projects-realworld-03. ui&ux 개선
categoryPath: projects\realworld\03. ui&ux 개선
date: '2025-06-13'
---
# Header  
현재 헤더를 보면 Global Feed 일 때가 홈이고  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250613210119.png" alt="Pasted image 20250613210119" width="600">

Your Feed 일 때는 Home의 글자색이 회색으로 보이다 호버했을 시 검정색으로 변하고  
누르면 Global Feed 로 이동한다.  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250613210222.png" alt="Pasted image 20250613210222" width="600">


근데 로고를 눌러도 Home으로 이동이 가능하다.

저번 팀프로젝트 때도 비슷한 고민을 했었는데,  
헤더에 nav가 많으면 많을 수록 좋은걸까?  
아니면 되려 사용자에게 헷갈림을 불러올까?

일단 성능적으로 따졌을때는,  
애초에 NextJS에서 같은 페이지에 라우팅을 보내면  
전체 페이지 새로고침이 일어나지 않으며  
컴포넌트만 언마운트되고 다시 마운트되되며 재렌더링이 일어난다.  
또한 JavaScript 번들은 이미 캐시되어 있어서 다시 다운로드되지 않고  
useSWR로 사용자 데이터를 캐싱하고 있으니  
성능상 문제는 거의 없다고 봐도 된다. 

그래서 ux적으로 어떤게 좋을지 관련 글을 찾아봤다.

- https://www.nngroup.com/articles/duplicate-links/

글에 따르면 중복 링크가 좋은 경우는

- **안전망 제공**: 사람들이 첫 번째 링크를 눈치채지 못하더라도, 페이지를 스크롤하면서 두 번째 링크는 눈에 띌 수 있습니다. 이러한 중복은 개인차를 줄이는 데 도움이 됩니다. 어떤 사람은 위쪽에 있는 링크를 보고, 또 어떤 사람은 아래쪽에 있는 링크를 볼 수도 있기 때문입니다. 링크를 여러 곳에 배치하면 더 많은 사용자에게 도달할 가능성이 있습니다.  
- **긴 페이지 처리**: 너무 긴 페이지에서는 맨 위로 다시 스크롤해야 하는 것이 번거롭습니다. 링크에 접근할 수 있는 대안을 제공하면 이러한 불편을 줄일 수 있습니다.  
- **시각적 균형 생성**: 콘텐츠가 부족하거나 아예 없는 상위(탐색용) 페이지에서는 빈 공간이 흔합니다. 이런 어색한 여백을 중복된 링크로 채우면 페이지가 좀 더 균형 잡혀 보입니다.  
- **데이터 기반 행동**: 분석 결과, 링크를 중복해서 제공하면 원하는 목적지 페이지로의 트래픽이 증가하는 경향이 있습니다.

안 좋은 경우는  
- **상호작용 비용 증가**: 링크가 많아질수록 사용자가 처리해야 할 선택지가 늘어나므로 상호작용 비용이 증가합니다. 선택지가 적을수록 판단 속도는 더 빨라집니다.  
- **사용자 주의력 소모**: 추가된 링크는 다른 요소들과 주의를 경쟁하게 되어, 사용자 주의력을 분산시킵니다. 사람들은 화면에 있는 정보조차 제대로 보지 못하는 경우가 많습니다. 하나의 링크에 더 많은 주의를 끌수록 다른 링크에는 덜 주의하게 되며, 이는 큰 기회비용을 초래합니다.  
- **작업 기억에 부담**: 중복된 링크는 사용자가 ‘이 링크를 이미 본 것인지, 새로운 것인지’를 기억해야 하게 만듭니다. 두 링크가 같은 것인지 다른 것인지 헷갈려 하는 경우도 많습니다. 사용성 테스트에서 참가자들이 멈칫하며 어떤 링크를 클릭할지 고민하는 모습을 자주 관찰합니다. 좀 더 적극적인 사용자는 두 링크를 모두 클릭해보지만, 결국 같은 페이지로 이동하는 것을 알고 실망하게 됩니다. 반복적인 링크는 사용자에게 실패 경험을 줄 수 있습니다.  
- **시간 낭비**: 두 링크가 같은 페이지로 이동한다는 사실을 사용자가 알아차리지 못하면, 두 번째 클릭은 시간 낭비가 됩니다. 최악의 경우, 사용자는 같은 목적지 페이지에 두 번 방문한 사실조차 인식하지 못하고 또 한 번 시간을 낭비하게 됩니다. **당신에게는** 사이트의 각 페이지 구분이 명확하더라도, **사용자에게는 그렇지 않습니다**. 우리는 종종 사용자가 같은 페이지를 다시 방문하면서도 이미 방문한 페이지라는 사실을 인지하지 못하는 사례를 목격합니다.

로 나뉜다고 한다.   
~~번역 feat. ChatGPT~~

개인적으로 글만 봤을 때는   
상호작용 비용이 증가되기 때문에  
Home이라는 nav는 없애고 로고만 남기는게 나을 것 같다는 생각이 든다.

근데 정확한 판단이 서지 않기에..  
대부분의 사이트는 헤더의 네비게이션을 어떻게 구성했을까?

먼저 Real World의 근간이 되는 Medium 블로그는 로고만 남겨놨다.  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250613214705.png" alt="Pasted image 20250613214705" width="600">

Medium과 비슷한 Velog도 Velog 로고만 홈으로 이동되게 했다.  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250613212501.png" alt="Pasted image 20250613212501" width="600">

반면 링크드인은 홈과 로고를 둘 다 남겨 루트 페이지로 이동될 수 있게 했다.  
<img src="/images/projects/realworld/03. ui&ux 개선/Pasted image 20250613214500.png" alt="Pasted image 20250613214500" width="600">

흠.. 그냥 정말 케바케 인 것 같다.  
ㅋㅋㅋㅠ

이렇게 캡쳐해보고 실제 이용하면서 든 생각인데,   
보통 사용자의 마우스 커서는 오른쪽에 위치한다.  
근데 로고는 맨 왼쪽 상단에 위치 하지 않는가.  
이 때 마우스 커서를 되려 로고 쪽에 옮기느라 더 불편하다는 생각이 들었다.

그래서 홈은 그냥 살리고,  
되려 헤더의 포지션을 fixed로 냅둬서   
스크롤 시에도 항상 헤더가 상단에 보이게 하는게 좋을 것 같다는 생각이 들어   
그렇게 수정했다.
