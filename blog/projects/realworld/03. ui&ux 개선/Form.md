---
title: Form
category: projects-realworld-03. ui&ux 개선
categoryPath: projects\realworld\03. ui&ux 개선
date: '2025-06-14'
---
# Form

## 라벨 추가  
지금 settings나 sign up, sign in이나, editor의 form을 보면  
다 placeholder로만 뭘 작성하라고 나와있지  
라벨이나 그런건 없다.

<table>  
<tr>  
<td><img src="../../../../public/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614165010.png" widht=300></td>  
<td><img src="../../../../public/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614165025.png" widht=300></td>  
<td><img src="../../../../public/images/projects/realworld/03. ui&ux 개선/Pasted image 20250614165200.png" widht=300></td>

</tr>  
</table>

그래서 뭐.. 사실 추가하는건 쉬우니까   
각각의 form에 `<label>` 태그를 추가하고,  
`htmlFor` 속성을 넣어줬다.

`htmlFor` 속성을 추가해 필드의 id와 관련시키면,  
라벨을 눌러도 해당 form에 커서가 이동되어 바로 입력할 수 있다.

## bio, password form  
다음으론 settings에서 bio form만 다른 form들과 다르게  
height가 길어서 rows 속성을 제거하고  
`overflow: 'auto', resize: 'none'` 속성을 추가해  
다른 form들과 통일시켜줬다.

음 그러고 보는데 뭔가 부족하다 싶어서 생각해보니,  
비밀번호 토글 버튼이 없어서 useState를 활용해 추가해줬다.  
## tag form  
현재는 태그 input이  
1. 공백을 입력할 수 있고  
2. 오로지 키보드 입력만으로 태그를 추가할 수 있다.

이게 불편하다고 느껴져서..   
1. 일단 입력받은 값들은 trim으로 공백을 처리하도록 했고  
2. 태그리스트 안에 이미 있는 값을 또 입력했을 경우엔 alert이 뜨도록 했다.  
<img src="/images/projects/realworld/03. ui&ux 개선/2025-06-14191645-ezgif.com-speed.gif" alt="2025-06-14191645-ezgif.com-speed" width="600">
