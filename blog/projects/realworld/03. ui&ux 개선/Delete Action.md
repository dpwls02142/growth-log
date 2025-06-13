---
title: Delete Action
category: projects-realworld-03. ui&ux 개선
categoryPath: projects\realworld\03. ui&ux 개선
date: '2025-06-13'
---
# Delete Action  
게시글은 지우기 전에 컨펌창이 한 번 뜨면서  
진짜 지울건지 물어보지만,  
코멘트를 지울 땐 바로 지워진다.

난 개인적으로 한 번 물은 다음에 지우는 걸 좋아한다.  
뭐든 확인 과정이 한 번 더 있는게 좋다랄까..

왜냐면 메일 주소 도메인까지 입력해야되는 필드들 있을 때  
빨리 입력하다가 `gamil` 이렇게 치는 경우가 여럿 있었기에  
입력한 정보가 맞는지 한 번 확인해준다든가,  
지우기 전 확실한건지 확인해주는 과정이 있는걸 좋아한다.

근데 또 어떤 사람은 아니 지울건데 뭘 굳이 또 물어보지? 하면서 싫어하는 사람도 있을거다.

코드는 그냥 articleAction에서 사용한 것 처럼  
`const result = window.confirm(CONFIRM_DELETE_MESSAGE);`  
를 띄우면 되지만,

대부분의 사람들이 모달창에 대해 어떻게 생각하는지 궁금해져서 관련 자료를 찾아봤다.

- https://ux.stackexchange.com/questions/74501/are-there-established-patterns-for-delete-confirmations-other-than-the-typical-m

글을 읽어보니  
지메일에서 메일을 보냈을 때 다른 곳을 안 누르면  
일시적으로 <mark>전송 취소 버튼</mark>이 뜨는 것 처럼

댓글을 삭제했다 하더라도  
<mark>5초간 되돌리기 버튼이 떠있는 게 좋을 것 같다</mark>고 생각했다.

이렇게 판단한 이유는 다음과 같다.  
1. 댓글 삭제 과정은 빈번하게 일어날 수 있기 때문에 오히려 매번 모달로 확인 과정을 거치면 사용자 흐름을 방해할 수 있다고 생각했다.  
2. 또한 댓글 삭제는 아티클과 달리 데이터의 손실 영향이 매우 크지 않다고 생각했다. 물론, 댓글도 성의껏 적을 수 있지만 아티클 보단 그 비중이 크지 않다고 생각했기에..

원래는 setInterval과 setTimeout을 활용해서 한 번에 두 개의 타이머를 설정 후 1초마다 setInterval이 실행되고 그게 5초가 되면 setTimeout이 실행돼서 실제로 삭제되게 하려다가,

react 환경에서 이렇게까지 써야 될 필요가 있을까 싶어  
useEffect를 활용해 처리해줬다.

근데... 또 가만 생각해보니  
한 사람이 댓글을 와다다 적어놓고 와다다 삭제한다면?  
useEffect를 활용한 방식은 50개의 setTimeout이 순차적으로 생성되는 반면,

전자의 방식은 세트로 2개의 타이머가 생성되니 총 20개의 타이머만 생성되고 해제될거다.

그래서 성능상 얼마만큼의 차이가 날까 하고 찾아봤는데,  
현대에선 사용자가 체감할 수 없을 정도로 극미한 것 같았다.

https://stackoverflow.com/questions/6650134/is-setinterval-cpu-intensive

따라서 결론적으론 useEffect를 활용해 되돌리기 기능을 처리했다.

<img src="/images/projects/realworld/03. ui&ux 개선/2025-06-14003502-ezgif.com-speed.gif" alt="2025-06-14003502-ezgif.com-speed" width="600">

