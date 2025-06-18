---
title: Form
category: projects-realworld-04. 마이그레이션
categoryPath: projects\realworld\04. 마이그레이션
date: '2025-06-18'
---
# Form

#### 현재 프로젝트에서 form은 어디 페이지에 사용되며 각 특징엔 뭐가 있는가?  
- article 수정/ 생성 (`editor/[slug]`, `editor/new`)  
	- 제목, 설명, 내용, 태그로 총 4개  
	- validateArticle로 제목, 설명, 내용 입력했는지 안했는지 확인  
- login  
	- email, password로 총 2개  
	- backend에서 email과 password가 맞는지 확인  
- register  
	- username, email, password 총 3개  
	- backend에서 username과 email 중복값 없는지랑  
	 password는 6자 이상인지 확인  
- settings  
	- profile image, username, bio, email, password로 총 5개  
	- 여기도 username과 email 중복 검사, password 6자 이상인지 확인

#### form 라이브러리는 언제 쓰는게 좋은가?  
1. <mark>동적 필드가</mark> 필요하거나  
2. <mark>useReducer로 폼을 관리하는데 폼의 동작 또한 무거운 상태</mark>라면 사용하는게 좋음.  
- 왜?  
	- 일단 동적 필드가 뭔지부터 생각해보면,   
	 사용자가 마음대로 필드를 추가/삭제 할 수 있는 걸 동적 필드라고 함.  
	- 예를 들어 쇼핑몰에서 배송지 주소를 추가한다든가,   
	  예비(?) 전화번호를 추가한다든가...   
	  현재 프로젝트에서는 tag form이 동적필드임.  
- 동적필드를 useState 배열로 관리한다면   
  관련 함수가 호출 될 때마다 관련된 모든 필드가 리렌더링 됨.   
  예를 들어 아래와 같은 코드가 있다고 가정해보자.  
```tsx  
const [addresses, setAddresses] = useState([  
  { id: 1, street: '', city: '', zipCode: '' }  
]);

const addAddress = () => {  
  setAddresses(prev => [...prev, {   
    id: Date.now(),   
    street: '',   
    city: '',   
    zipCode: ''   
  }]);  
};

const removeAddress = (id) => {  
  setAddresses(prev => prev.filter(addr => addr.id !== id));  
};

const updateAddress = (id, field, value) => {  
  setAddresses(prev => prev.map(addr =>   
    addr.id === id ? { ...addr, [field]: value } : addr  
  ));  
};

 <div>  
      {addresses.map(address => (  
        <div key={address.id}>  
          <input  
            value={address.street}  
            onChange={(e) =>  
              updateAddress(address.id, 'street', e.target.value)  
            }  
          />  
          <input  
            value={address.city}  
            onChange={(e) =>  
              updateAddress(address.id, 'city', e.target.value)  
            }  
          />  
          <input  
            value={address.zipCode}  
            onChange={(e) =>  
              updateAddress(address.id, 'zipCode', e.target.value)  
            }  
          />  
          <button onClick={() => removeAddress(address.id)}>삭제</button>  
        </div>  
      ))}  
      <button onClick={addAddress}>주소 추가</button>  
</div>  
```  
- 그럼 updateAddress가 호출 될 때마다 전체 addresses 배열이 호출돼서  
  모든 주소 관련 입력필드가 리렌더링됨.   
  즉, 하나만 수정해도 다시 다 렌더링 된다는거임.  
- useReducer를 사용했을 때도 똑같음.  
  useReducer는 객체를 한꺼번에 관리하기 때문에 얘도 렌더링이 한꺼번에 일어남.  
  근데 form의 동작이 무거운데 매번 다시 다 렌더링 되어야한다면 어떻겠음?  
  물론, memoization을 사용해서 불필요한 렌더링을 막을수도 있겠지만  
  이는 오히려 오버헤드를 불러올 수도 있음. [참고 자료](https://medium.com/front-end-weekly/how-to-use-memoization-in-react-6ac93c00418c)  
  

#### 그래서, 이 프로젝트에선 form 관련 라이브러리를 써야하는가?  
- 현재 사용되는 동적필드는 tag form 밖에 없음. useReducer는 editor에서 사용 중이며, quill로 게시글을 입력 받으니 무거운 상태라고 볼 수 있음.  
- 페이지당 사용되는 폼의 개수는 평균 3-4개임.  
- 만약 폼 개수가 많아서 관리해야되는 상태 또한 많다면 성능에 영향을 주겠지만, 지금은 관리하는 상태가 몇 개 없기에, 외부 라이브러리를 도입한다고 해도 성능면에서 정말 미미한 차이밖에 없을 것 같음.  
- 고로 해당 프로젝트에 라이브러리를 적용하는 것 보다, 각 라이브러리의 기본적인 사용 방법을 보는게 더 우선일 것 같다 판단함.

- 그리고 비밀번호 유효성 검사는 동시에 프론트에서도 하는게 좋을 것 같음.  
  왜냐면 기껏 다 입력하고 제출했는데 "여섯자리 이상 입력해주세요" 이러면 열받으니까  
  그 전에 미리 사용자와 소통을 해야하지 않겠는가.   
  고로 유효성 검사는 프론트에서도 처리해주는게 맞다고 생각해 if문으로 처리해줌.

- 근데, 유효성 검사를 할 땐 zod 라이브러리를 설치해서 사용하는게 좋을까?  
	- 일단 <mark>zod 라이브러리가 뭔데</mark>? 라고 한다면, TypeScript 기반의 스키마 유효성 검사 라이브러리임.  
- 만약 zod를 사용하면 아래와 같이 스키마 기반으로 유효성 검사를 할 수 있음.  
```tsx  
import { z } from 'zod';

const schema = z.object({  
  username: z.string().min(3),  
  email: z.string().email(),  
  password: z.string().min(6),  
});  
```  
- 개인적인 생각으론 조건이 복잡하면 쓰는게 좋겠지만,   
  그냥 비밀번호 길이만 검사할 땐 if문으로 하는게 나을 것 같다고 생각함.  
- 만약 뭐 대문자랑 특수문자 무조건 들어가야되고, 소문자 몇번 이상 이렇게 복잡한 조건이 있다면 zod로 처리해주는게 좋을듯.

결론적으로 해당 프로젝트에선 form 관련 외부 라이브러리를 사용하진 않을거임.  
그치만 앞서 봤던 주소 관련 동적 필드를 두 라이브러리로 표현한다면 어케 되는지,   
각 라이브러리의 특징은 뭔지 봐보자.  
## React Hook Form  
### 특징  
- react 전용  
- uncontrolled 방식  
	- ref로 dom을 직접 조작하기에  
	  리렌더링을 최소화하며 필드별 독립적인 업데이트가 가능함  
- 내장된 validation 규칙과 resolver를 통해 zod와 같은 외부 라이브러리와의 연동이 좋음  
### 코드  
```tsx  
import { useForm, useFieldArray } from 'react-hook-form';

const { control, handleSubmit } = useForm({  
  defaultValues: {  
    addresses: [{ street: '', city: '', zipCode: '' }]  
  }  
});

const { fields, append, remove } = useFieldArray({  
  control,  
  name: 'addresses'  
});

{fields.map((field, index) => (  
  <div key={field.id}>  
    <input {...register(`addresses.${index}.street`)} />  
    <input {...register(`addresses.${index}.city`)} />  
    <input {...register(`addresses.${index}.zipCode`)} />  
    <button onClick={() => remove(index)}>삭제</button>  
  </div>  
))}  
<button onClick={() => append({ street: '', city: '', zipCode: '' })}>  
  주소 추가  
</button>  
```

## TanStack Form  
### 특징  
- vue, angular 등 다양한 프레임워크에서도 사용 가능함  
- controlled 방식  
	- js 객체 상태로 모든걸 관리함  
- subscribe 패턴을 활용해 필드 단위로 상태를 구독하는 구조 덕분에   
  최소 단위 리렌더링이 가능함  
### 코드  
```tsx  
import { useForm } from '@tanstack/react-form';

const form = useForm({  
  defaultValues: {  
    addresses: [{ street: '', city: '', zipCode: '' }]  
  }  
});

const addAddress = () => {  
  const currentAddresses = form.getFieldValue('addresses');  
  form.setFieldValue('addresses', [...currentAddresses, { street: '', city: '', zipCode: '' }]);  
};

const removeAddress = (index) => {  
  const currentAddresses = form.getFieldValue('addresses');  
  form.setFieldValue('addresses', currentAddresses.filter((_, i) => i !== index));  
};

<form.Subscribe selector={(state) => state.values.addresses}>  
  {(addresses) => (  
    <>  
      {addresses.map((_, index) => (  
        <div key={index}>  
          <form.Field name={`addresses.${index}.street`}>  
            {(field) => (  
              <input   
                value={field.state.value}  
                onChange={(e) => field.handleChange(e.target.value)}  
              />  
            )}  
          </form.Field>  
          <form.Field name={`addresses.${index}.city`}>  
            {(field) => (  
              <input   
                value={field.state.value}  
                onChange={(e) => field.handleChange(e.target.value)}  
              />  
            )}  
          </form.Field>  
          <button onClick={() => removeAddress(index)}>삭제</button>  
        </div>  
      ))}  
      <button onClick={addAddress}>주소 추가</button>  
    </>  
  )}  
</form.Subscribe>  
```

## 결론  
보다시피 동적 form을 관리할 때 라이브러리를 불러오면 id를 따로 관리할 필요가 없음.  
react hook form은 useFieldArray가 알아서 내부적으로 각 필드에 고유 id를 부여해주고,  
tanstack은 field의 경로를 통해 각 필드를 고유하게 식별하고 있음.  
물론 렌더링 측면에서의 이점도 있지만,   
이렇게 사용하기가 편리하니, 규모가 좀 큰 프로젝트의 경우엔  
form 관련 라이브러리를 사용하는게 좋은 선택이 될 수 있을 것 같음.
