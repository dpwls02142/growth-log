---
title: chap4
category: programming interview expose
categoryPath: programming interview expose
date: '2025-07-29'
---
# chap4  
## Linked Lists  
- 연결 리스트는 C와 C++의 포인터 개념과 밀접하게 연결되어있다.

::: tip  
읽기 전 알아두면 좋을 지식  
empty VS null  
empty는 데이터가 있지만 비어있는 상태  
null은 포인터가 어떤 주소값도 가리키지 않는 상태

Key Difference:  
The fundamental difference is that NULL signifies the absence of a valid memory address for a pointer, while an "empty string" is a valid string with a length of zero, residing at a valid memory address. Attempting to dereference a NULL pointer leads to undefined behavior, whereas operating on an empty string is a valid operation.  
:::

## Kinds of linked list  
### singly linked lists  
- 리스트 종류 중 단일 연결 리스트가 인터뷰에서 가장 많이 나온다  
- 고로 면접관이 linked list라고 말했을 땐 일반적으로 singly linked lists를 의미한다  
- 리스트의 각 데이터 요소는 마지막 데이터를 제외하고 다음 요소를 가리키는 링크(next pointers, references)로 연결되어 있다.  
- <mark>첫번째 요소는 리스트의 head</mark>라 하고, <mark>마지막 요소는 리스트의 tail</mark>이라 한다  
	- 이 때 tail의 링크는 null 상태다  
		- 왜?냐고 묻는다면.. 꼬리잡기 게임하는데 맨 마지막 사람에 붙어있는 사람이 있는가? 없지 않는가  
- singly linked list는 오직 다음 요소를 가리키는 포인터로만 이뤄져있기 때문에 앞방향으로만 순회 할 수 있다.  
- 따라서 리스트를 완전히 순회하려면 반드시 첫번째 요소부터 시작해야된다.  
- c에서 가장 간단한 singly linked lists는 자기 자신의 타입을 가리키는 포인터 하나만을 멤버로 갖는 struct다.  
```c  
typedef struct ListElement{  
	struct ListElement *next;  
} ListElement;  
```  
- 그치만 위 구조체엔 데이터가 없기 때문에 (포인터만 존재함) 좀 더 유용한 구조체는 포인터 외에 적어도 하나의 데이터 멤버를 포함한다.  
```c  
typedef struct IntElement{  
	struct IntElement *next;  
	int data;  
} IntElement;  
```  
- 포인터(next)를 구조체 맨 앞에 두면 리스트를 처리하는 일반 함수들을 더 쉽게 작성할 수 있다  
	- 왜냐면 각 요소가 어떤 데이터를 갖고 있든, 포인터를 일반적인 리스트 요소 타입으로 형변환하여 다룰 수 있기 때문이다.  
	- 그니까 위의 저 두 개 코드만 놓고 봤을 때 IntElement를 ListElement로 casting해서 쓸 수 있다. 이러면 리스트를 순회할 때 노드 타입이 intger인지, string인지 몰라도 only next 포인터만 보고 이동할 수 있다.  
- c++에선 struct 말고 class로도 정의할 수 있다.  
```cpp  
class IntElement{  
	// 생성자  
	public:  
		IntElement( int value ) : next( NULL ), data( value ) {}  
	// 소멸자  
	~IntElement() {}  
	// 다음 노드를 반환하는 getter  
	IntElement *getNext() const {return next;}  
	// 현재 데이터를 반환하는 getter  
	int value() const {return data;}  
	// 다음 노드를 설정하는 setter  
	void setNext(IntElement *elem) {next = elem;}  
	// 현재 데이터를 설정하는 setter  
	void setValue(int value) {data = value;}  
	private:  
		IntElement *next;  
		int data;  
}
```

::: details  
- 생성자: 객체 초기화  
- 소멸자: 객체 소멸시 자동 호출  
- getter: 변수값 읽기  
- setter: 변수값 바꾸기  
- 멤버 변수: 내부 상태 저장 (외부에서 직접 건드리지 못하게 캡슐화)  
:::

- 하지만 class 보단 template으로 정의하는게 더 합리적이다.  
	- 왜? class로 정의하면 int만 저장할 수 있는데, template으로 만들면 다른 타입의 데이터를 저장할 수 있기 때문에.  
```cpp  
template <class T>  
class ListElement {  
	public:  
		ListElement( const T &value ): next( NULL ), data( value ) {}  
	ListElement() {}  
	ListElement *getNext() const { return next; }  
	const T& value() const { return data; }  
	void setNext( ListElement *elem ) { next = elem; }  
	void setValue( const T &value ) { data = value; }  
	private:  
		ListElement *next;  
		T data;  
};  
```

### doubly linked lists  
- doubly linked lists(이중 연결 리스트)는 singly linked list의 어려움을 해결해준다  
	- 왜냐면 각 데이터가 이전 요소와 다음 요소를 가리키는 포인터를 모두 갖고있기 때문이다  
	- 이렇게 해서 얻는게 뭔데?  
		- 리스트를 양방향(앞으로도, 뒤로도)으로 순회할 수 있다.  
		- singly linked는 했지만 doubly는 양방향. 애초에 이름도 doubly잖아  
- 그래서 doubly는 singly와 다르게 head엔 이전 링크가 null이고 tail은 다음 링크가 null이다.  
- 근데 면접에서 doubly는 잘 안 물어본다. 왜냐면 얘로 문제를 해결하면 singly보다 쉬워지는 경우가 많기 때문이다.

### circular linked lists  
- circular linked lists(환형 연결 리스트)는 singly나 doubly 형태로 존재할 수 있으며 시작과 끝이 없다. -> head와 tail이 존재하지 않는다.

### Basic Linked List Operations  
#### Tracking the head element  
- singly에선 head 요소를 반드시 추적해야한다. 안 그러면 리스트 전체를 잃어버리게 된다.  
	- 왜? singly는 링크가 순차적으로 연결되어 있기 때문에 무조건 앞에서부터 요소를 갖고올 수 있삼  
- 이 때 리스트 전체를 잃어버릴 수 있다는건 가비지 컬렉션이 되거나, 메모리 누수(leak)가 일어날 수 있다. 고로  
1. 맨 앞에 새로운 요소를 삽입하거나  
2. 맨 앞의 요소를 제거 했을 때  
- head 포인터를 반드시 업뎃해줘야 된다!

- 잘못된 코드  
	- 왜? head 포인터의 복사본만 바꾸므로 리스트 자체 값을 바꾸지 못한다.  
```c  
bool insertInFront(IntElement *head, int data){  
    IntElement *newElem = malloc(sizeof(IntElement));  
    if (!newElem) return false;  
    newElem->data = data;  
    newElem->next = head;  
    head = newElem;  
    return true;  
}
```

- 올바른 코드  
	- 왜? head의 포인터 주소를 받아서 실제 head 메모리 주소값을 업데이트 한다  
```c  
bool insertInFront(IntElement **head, int data){  
    IntElement *newElem = malloc(sizeof(IntElement));  
    if (!newElem) return false;  
    newElem->data = data;  
    newElem->next = *head;  
    *head = newElem;  
    return true;  
}
```

#### Traversing a List  
- singly에서 맨 앞(첫번째) 요소 말고 다른 요소를 작업하고 싶으면 <mark>항상 리스트의 끝에 도달했는지 확인</mark>해야 한다.  
- 왜냐면 찾으려는 요소가 리스트에 존재하지 않을 경우 null을 참조하며 null reference exception error가 발생하기 때문이다.  
- 고로 exption을 throw하거나 null을 반환하게 만들어야 한다.

#### Inserting and Deleting Elements  
- singly에서 모든 연결은 포인터로만 유지되기에 리스트 중간에 요소를 삽입하거나 삭제하고 싶다면 바로 앞 요소의 포인트러를 수정해야 된다.  
- 만약 삭제해야 될 요소만 주어지고, 그 앞의 요소는 주어지지 않았다면 head 부터 순회해서 삭제해야 될 앞의 요소를 직접 찾아야 한다.  
- 특히 삭제 대상이 head일 경우엔 별도로 처리해야 된다. (별도로 처리를 안 할 시 두번째 요소의 포인터가 사라지기 때문이다.)  
```c  
bool deleteElement(IntElement **head, IntElement *deleteMe){  
    IntElement *elem;  
    if (!head || !*head || !deleteMe) // null 포인터 확인  
        return false;

    elem = *head;

    // head를 삭제할 경우  
    if (deleteMe == *head){  
        *head = elem->next;  
        free(deleteMe);  
        return true;  
    }

    // 리스트 순회하며 이전 요소 찾기  
    while(elem){  
        if(elem->next == deleteMe){  
            elem->next = deleteMe->next;  
            free(deleteMe);  
            return true;  
        }  
        elem = elem->next;  
    }

    // 삭제할 요소를 못 찾은 경우  
    return false;  
}
```

- garbage collection이 없는 c나 c++과 같은 언어에선 리스트에서 어떤 요소를 삭제할 때 메모리 해제를 무조건 해줘야 된다.  
- 이 때 포인터를 먼저 다음 노드로 넘기면 현재 노드의 포인터를 잃어버려서 메모리 해제를 못할 수가 있다.  
- 그렇다고 메모리 해제를 먼저하면 다음 노드를 가리킬 수가 없어 순회가 불가능해지기에  
- 두 개의 포인터를 사용해주면 된다.

## Stack Implementation (w. linked lists)  
- 스택은 Last In First Out 구조로 가장 마지막에 삽입된 요소가 가장 먼저 제거되는 구조다. 마치 접시를 쌓고 빼는 것과 유사하다.  
- 보통 삽입 연산은 push, 제거 연산은 pop이라 한다.  
- 스택은 보통 함수를 호출 할 때 local variable과 return의 address를 관리한다든가, 프로그래밍 언어를 parsh할 때 쓰인다.  
- 스택을 구현하는 방법은 크게 dynamic array를 사용하는 방법과 linked lists를 사용하는 방법 두 가지로 나뉜다.  
- 동적 배열로 구현했을 땐 배열이 꽉 찬 경우 새로운 메모리를 할당하고 기존 데이터를 복사해야하므로 성능상 단점이 있다.  
- 반면 연결리스트는 요소를 할당할 때 동적으로 하나씩 할당하기에 연결리스트로 스택을 구현하는 편이 좋다.  
- 스택은 데이터를 저장하는 구조이므로 먼저 각 요소를 나타내는 element struct를 정의해야 한다.  
```c  
typedef struct Element{  
	struct Element *next;  
	void *data;  
} Element;  
```  
- push와 pop을 구현할 때 인자는 스택 자체를 인자로 받아야한다. 즉 포인터를 가리키는 포인터를 인자로 넘겨야 함수 내부에서 top 포인터가 바꼈을 때 변화가 호출한 쪽에도 반영된다.  
- push 함수는 데이터를 인자로 받아 새 노드를 생성하고, 이 노드를 기존 스택의 맨 앞에 붙인다. 메모리 할당에 실패할 수도 있으니 이에 대한 오류 처리`if (!elem) return False;` 를 하고 성공 여부는 bool type으로 반환하는 게 좋다.  
```c  
bool push(Element **stack, void *data) {  
	Element *elem = malloc(sizeof(Element));  
	if (!elem) return False;  
	elem->data = data; // 데이터 설정  
	elem->next = *stack; // 새 노드의 next는 기존의 top  
	*stack = elem;  
	return true;  
}
```  
- pop 함수는 스택에서 가장 맨 위에 있는 데이터를 제거하고 그 데이터를 반환해야 된다. 그런데 C에서 함수는 하나의 값만 반환할 수 있기에 데이터와 성공 여부를 동시에 반환하려면 한 쪽을 포인터 인자로 넘겨야한다.  
```c  
bool pop(Element **stack, void **data) {  
    Element *elem;  
    if (!(elem = *stack)) return false;  
    *data = elem->data;  
    *stack = elem->next;  
    free(elem);  
    return true;  
}
```  
- 스택을 create 하고 delete하는 함수는 다음과 같다. createStack은 스택을 초기화 하는 역할을 하며, 단순히 스택의 포인터를 NULL로 설정한다. deleteStack은 모든 노드를 하나씩 해제한다. pop을 스택이 빌 때까지 반복적으로 호출하는 방법도 있지만, 직접 연결 리스트를 순회하며 메모리를 해제하는 방식이 더 효율적이다.  
```c  
bool createStack(Element **stack){  
	*stack = NULL;  
	return true;  
}

bool deleteStack(Element **stack){  
	Element *next;  
	while (*stack){  
		next = (*stack)->next;  
		free(*stack);  
		*stack = next;  
	}  
	return true;  
}
```

## Maintain Linked List Tail Pointer  
- linked list에서 head와 tail의 포인터를 항상 정확하게 유지하면서 linked list 요소를 delete하거나 insert하기  
### delete  
```c  
bool delete( Element *elem ){  
    // 1. 삭제할 요소(elem)가 유효한지 확인  
    /* 만약 elem이 NULL이라면 아무것도 가리킬게 없다는 상태(삭제 할 게 없음)니까   
     * false 반환  
     */  
    if(!elem) return false;

    // 2. 삭제할 요소가 리스트의 맨 앞인 경우  
    if( elem == head ){  
        // 1. 먼저 head를 삭제할 요소의 다음 요소로 옮긴다  
        // 예를 들어 A -> B -> C 에서 A를 지우면 head는 B를 가리키게 된다  
        head = elem->next;  
        // 2. 그 후 이제 A는 필요 없으니 메모리에서 해제한다  
        free(elem);  
        /*  
         * 리스트에 요소가 하나만 있는데 그 요소를 삭제한 경우  
         * (예: A만 있었는데 A를 삭제하면 리스트가 아예 비어버릴거임)  
         * 즉 head가 NULL일 땐 리스트가 비어있다는 뜻이므로 tail도 NULL로 만든다  
         */  
        if(!head) tail = NULL;  
        return true;  
    }

    // 3. 삭제할 요소가 리스트의 중간 또는 맨 뒤인 경우  
    Element *curPos = head;  
    while( curPos ){ // curPos가 NULL이 아닐 때까지 (리스트 끝까지) 반복  
        // curPos의 다음 요소가 삭제하려는 elem인지 확인  
        if( curPos->next == elem ){  
            curPos->next = elem->next;  
            free(elem);  
            /*  
             * 삭제한 요소가 리스트의 맨 뒤인 경우  
             * (예: A -> B -> C 에서 C를 삭제하면 B가 새로운 맨 뒤가 됨)  
             * 만약 방금 삭제한 요소가 마지막이었다면  
             * curPos가 새로운 tail이 돼야한다.  
             */  
            if( curPos->next == NULL ) tail = curPos;  
            return true;  
        }  
        curPos = curPos->next;  
    }  
    // 리스트 전체를 다 뒤졌는데도 삭제하려는 요소를 찾지 못했다면 해당 값이 애초당시 리스트에 없다는거니 false 반환  
    return false;  
}
```  
### insert  
```c  
bool insertAfter( Element *elem, int data ){  
    Element *newElem = malloc( sizeof(Element) );  
    if( !newElem ) return false;  
    newElem->data = data;

    // 리스트의 맨 앞에 elem 삽입하는 경우  
    if( !elem ){  
        // 새 요소의 다음을 현재 head로 설정  
        newElem->next = head;  
        head = newElem;  
        /*  
         * 빈 리스트에 첫 요소를 삽입하는 경우엔  
         * tail도 새 요소를 가리키게 만든다  
         */  
        if( !tail ) tail = newElem;  
        return true;  
    }

    // elem이 NULL이 아니고 특정 요소 뒤에 삽입하는 경우  
    Element *curPos = head;  
    while( curPos ){  
        if( curPos == elem ){  
            /*   
            * 예를 들어 A -> B -> C 에서 B 뒤에 X를 넣으려면  
            * 새 요소(X)의 다음을 B의 다음(C)으로 연결하고,  
            * B의 다음을 새 요소(X)로 연결  
            */   
            newElem->next = curPos->next; // X -> C  
            curPos->next = newElem;       // B -> X

            /*  
             * 리스트의 맨 뒤에 삽입하는 경우  
             * 새 요소가 새로운 tail이 되어야 한다  
             */  
            if( !(newElem->next) ) tail = newElem;  
            return true;  
        }  
        curPos = curPos->next;  
    }  
    free( newElem );  
    return false;  
}
```

