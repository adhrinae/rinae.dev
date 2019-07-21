---
title: "'Practical Advanced TypeScript' 정리"
slug: practical-advanced-typescript-summary
date: 2019-07-21
tags:
  - Typescript
  - Redux
description: "Egghead의 강좌 'Practical Advanced TypeScript' 내용 정리"
---

- Rares Matei가 Egghead에 올린 코스 [Practical Advanced TypeScript](https://egghead.io/courses/practical-advanced-typescript)를 보고 정리한 글입니다.
- 예제 코드를 따라해보고 싶다면 타입스크립트가 지원되는 개발 환경에서(VSCode 등) 직접 리턴되는 타입 등을 확인해보시길 추천합니다.

---

## 차례 <!-- omit in toc -->

- [Numeric Separator를 사용하여 큰 수를 다루기](#numeric-separator%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%ED%81%B0-%EC%88%98%EB%A5%BC-%EB%8B%A4%EB%A3%A8%EA%B8%B0)
- [더욱 철저한 속성 초기화](#%EB%8D%94%EC%9A%B1-%EC%B2%A0%EC%A0%80%ED%95%9C-%EC%86%8D%EC%84%B1-%EC%B4%88%EA%B8%B0%ED%99%94)
- [in 연산자를 활용한 자동 타입 추론](#in-%EC%97%B0%EC%82%B0%EC%9E%90%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%9E%90%EB%8F%99-%ED%83%80%EC%9E%85-%EC%B6%94%EB%A1%A0)
- [Switch 문에서 자동으로 타입 추론하기](#switch-%EB%AC%B8%EC%97%90%EC%84%9C-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%ED%83%80%EC%9E%85-%EC%B6%94%EB%A1%A0%ED%95%98%EA%B8%B0)
- [Mapped Type을 수정하기](#mapped-type%EC%9D%84-%EC%88%98%EC%A0%95%ED%95%98%EA%B8%B0)
- [타입과 인터페이스의 차이](#%ED%83%80%EC%9E%85%EA%B3%BC-%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4%EC%9D%98-%EC%B0%A8%EC%9D%B4)
- [자기 자신을 참조하는 타입 만들기](#%EC%9E%90%EA%B8%B0-%EC%9E%90%EC%8B%A0%EC%9D%84-%EC%B0%B8%EC%A1%B0%ED%95%98%EB%8A%94-%ED%83%80%EC%9E%85-%EB%A7%8C%EB%93%A4%EA%B8%B0)
- [이터레이터를 이용하여 커스텀 자료 구조의 순회를 단순하게 만들기](#%EC%9D%B4%ED%84%B0%EB%A0%88%EC%9D%B4%ED%84%B0%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-%EC%BB%A4%EC%8A%A4%ED%85%80-%EC%9E%90%EB%A3%8C-%EA%B5%AC%EC%A1%B0%EC%9D%98-%EC%88%9C%ED%9A%8C%EB%A5%BC-%EB%8B%A8%EC%88%9C%ED%95%98%EA%B2%8C-%EB%A7%8C%EB%93%A4%EA%B8%B0)
- [unknown 타입 활용하기](#unknown-%ED%83%80%EC%9E%85-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0)
- [조건부 타입을 사용하여 함수의 타입을 동적으로 할당하기](#%EC%A1%B0%EA%B1%B4%EB%B6%80-%ED%83%80%EC%9E%85%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%ED%95%A8%EC%88%98%EC%9D%98-%ED%83%80%EC%9E%85%EC%9D%84-%EB%8F%99%EC%A0%81%EC%9C%BC%EB%A1%9C-%ED%95%A0%EB%8B%B9%ED%95%98%EA%B8%B0)
- [조건부 타입을 활용하여 재사용할 수 있는 평탄한 타입(Flatten Type) 만들기](#%EC%A1%B0%EA%B1%B4%EB%B6%80-%ED%83%80%EC%9E%85%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%98%EC%97%AC-%EC%9E%AC%EC%82%AC%EC%9A%A9%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8A%94-%ED%8F%89%ED%83%84%ED%95%9C-%ED%83%80%EC%9E%85flatten-type-%EB%A7%8C%EB%93%A4%EA%B8%B0)
- [제네릭 함수 타입이 어떤 타입으로 리턴되는지 추측하기](#%EC%A0%9C%EB%84%A4%EB%A6%AD-%ED%95%A8%EC%88%98-%ED%83%80%EC%9E%85%EC%9D%B4-%EC%96%B4%EB%96%A4-%ED%83%80%EC%9E%85%EC%9C%BC%EB%A1%9C-%EB%A6%AC%ED%84%B4%EB%90%98%EB%8A%94%EC%A7%80-%EC%B6%94%EC%B8%A1%ED%95%98%EA%B8%B0)
- [중첩된 객체의 모든 속성을 read-only 타입으로 만들기](#%EC%A4%91%EC%B2%A9%EB%90%9C-%EA%B0%9D%EC%B2%B4%EC%9D%98-%EB%AA%A8%EB%93%A0-%EC%86%8D%EC%84%B1%EC%9D%84-read-only-%ED%83%80%EC%9E%85%EC%9C%BC%EB%A1%9C-%EB%A7%8C%EB%93%A4%EA%B8%B0)
- [데코레이터를 사용하여 클래스의 속성을 동적으로 초기화하기](#%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%ED%81%B4%EB%9E%98%EC%8A%A4%EC%9D%98-%EC%86%8D%EC%84%B1%EC%9D%84-%EB%8F%99%EC%A0%81%EC%9C%BC%EB%A1%9C-%EC%B4%88%EA%B8%B0%ED%99%94%ED%95%98%EA%B8%B0)

---

## Numeric Separator를 사용하여 큰 수를 다루기

Numeric Separator는 [TC39 Stage 3에 있는 제안 중 하나다.](https://tc39.github.io/proposal-numeric-separator/) 이미 타입스크립트에는 사용 가능한 기능이기 때문에 소개된 것으로 보인다.

사용하기 위해서 `number` 타입의 숫자에 구분을 하고 싶은 부분에 `_` (언더스코어)를 넣으면 된다.

```ts
// 대한민국의 인구 수 51,709,098명
const koreanPop = 51709098

// with numeric seprator
const koreanPop = 51_709_098
```

이렇게 하면 큰 수를 표현할 때 가독성을 높일 수 있다. 딱히 어느 자리에 언더스코어를 둘 지는 고려할 필요가 없다. TS 컴파일러를 통해 나오는 자바스크립트 파일에는 언더스코어가 제거되어 있을 것이다. 소수점에도 찍을 수 있지만 가독성이 떨어질 수도 있기 때문에 개발자가 선택하기에 따라 달렸다.

아래와 같이 `AmountInput` 이라는 클래스를 정의할 때 큰 숫자 단위를 구분지어 사용할 수 있게 되었다.

```ts
class AmountInput {
  private static MAX_AMOUNT_ALLOWED = 99_999_999
  amount: number = 0

  showTooltip() {
    // 툴팁을 표시
    setTimeout(() => {
      // 툴팁 닫기
    }, 2_500)
  }

  // 백만 단위로 표시
  formatMillion() {
    return this.amount / 1_000_000 + 'M'
  }
}
```

## 더욱 철저한 속성 초기화

`Library` 라는 클래스를 만들었고 이 클래스에는 `string` 의 배열인 `titles` 라는 속성이 있다.

```ts
class Library {
  titles: string[]

  constructor() {}
}
const library = new Library()
```

이렇게 `Library` 의 인스턴스를 만들어서 사용할 수 있겠지만, 만약에 제대로 속성을 초기화하지 않은 상태에서 `library.titles` 를 가져다 쓰려고 하면 에러가 날 것이다.

타입스크립트 2.7 버전부터 `strictPropertyInitialization` 라는 컴파일러 옵션이 제공된다. 이 옵션을 활성화하려면 `strictNullCheck` 도 같이 활성화되어 있어야 한다.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strictPropertyInitialization": true,
    "strictNullChecks": true
  }
}
```

이 옵션이 활성화된 상태에서 같은 코드를 들여다보면 컴파일러가 에러를 표시할 것이다. 진짜로 기본값을 입력하지 않을 것이라면 `titles: string[] | undefined` 같은 식으로 타입을 정의하고 받아 쓰는 쪽에서 타입 가드를 할 필요가 있다. 아니면 제대로 `constructor` 쪽에서 `titles` 를 정의해주는게 나을 수 있다.

```ts
class Library {
  titles: string[]

  constructor(underRenovation: boolean) {
    if (!underRenovation) {
      this.titles = ['What if?', 'Flow']
    } else {
      this.titles = []
    }
  }
}
```

의존성 주입 등으로 인해 런타임에서 `titles` 가 결정되고, 컴파일러가 이 사실을 신경 쓸 필요가 없다면 느낌표(`!`)를 속성 뒤에 붙여서 명시적으로 '이 속성은 지금 신경쓰지 않아도 된다' 라고 표시할 수도 있다.

```ts
class Library {
  titles!: string[]

  constructor() {}
}
```

## in 연산자를 활용한 자동 타입 추론

처음 타입스크립트를 사용할 때 착각하던 부분이 있었는데, 유니언 타입의 활용 방식이었다. 예를 들어 아래와 같이 `Admin`, `User` 타입이 있다고 할 때 함수 인자의 타입을 유니언으로 지정해주면 어떤 경우에도 두 속성을 다 잘 처리해줄 줄 알았다.

```ts
interface Admin {
  id: string;
  role: string;
}

interface User {
  id: string;
  email: string;
}

function redirect(user: Admin | User) {
  if (/* 사용자가 어드민이라면 */) {
  }
}
```

저 `if` 문에서 구분을 어떻게 할 지가 문제다. 직접 타입을 지정해주었다 해도 컴파일러는 바로 알아듣지 못한다.

```ts
function routeToAdminPage(role: Admin['role']) {}
function routeToHomePage(email: User['email']) {}

function redirect(user: Admin | User) {
  if ((user as Admin).role !== undefined) {
    routeToAdminPage(user.role) // 에러
  } else {
    routeToHomePage(user.email) // 역시 에러
  }
}
```

번거롭지만 타입 가드 함수를 만들어주어야 한다.

```ts
function redirect(user: Admin | User) {
  if (isAdmin(user)) {
    routeToAdminPage(user.role)
  } else {
    routeToHomePage(user.email)
  }
}

function isAdmin(user: Admin | User): user is Admin {
  return (user as Admin).role !== undefined
}
```

하지만 많이 쓰이지 않는데도 일일이 타입 가드를 정의하는 것도 좀 귀찮은 일이다. [원래 자바스크립트에는 `in` 이라는 연산자가 있다.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) `prop in object` 같은 방식으로 사용하면 "이 `object` 에 `prop` 이라는 속성이 있는가?" 여부를 `boolean` 값으로 리턴한다. 타입스크립트에서 조건문에 `in` 연산자를 활용하면 자연스럽게 타입 가드를 해 준다.

```ts
function redirect(user: Admin | User) {
  if ('role' in user) {
    routeToAdminPage(user.role) // 이 부분에서 자동완성 할 때는 `role` 속성밖에 나오지 않음
  } else {
    routeToHomePage(user.email) // 여기서는 `email` 만 나옴
  }
}
```

## Switch 문에서 자동으로 타입 추론하기

리액트와 Redux, useReducer 훅을 사용할 때 액션에 타입을 정의하여 좀 더 확실하게 리듀서를 정의할 수 있다. 강좌에서는 더욱 완벽하게 액션 타입을 정의하는 법을 보여준다. 예를 들어 아래와 같이 `todoReducer` 와 리듀서에 사용되는 액션을 만들어보았다.

```ts
// index.ts
interface TodoState {
  todos: string[]
}

function todoReducer(state: TodoState = { todos: [] }, action: Action) {
  switch (action.type) {
    case 'Add':
      return {
        todos: [...state.todos, action.payload], // payload 부분에서 에러
      }
    case 'Remove All':
      return {
        todos: [],
      }
    // ...
  }
}

// todo.actions.ts
export interface Action {
  type: string
}

export class Add implements Action {
  readonly type: string = 'Add'
  constructor(public payload: string) {}
}

export class RemoveAll implements Action {
  readonly type: string = 'Remove All'
}
```

하지만 타입스크립트 컴파일러는 `case 'Add'` 를 거쳐 왔음에도 `payload` 라는 속성이 있다는 사실을 받아들이지 못한다. 보통은 이런 경우 `Action` 이라는 인터페이스를 확장하겠지만, `payload` 에 들어올 수 있는 타입의 추론이 또 문제가 된다.

여기서 재밌는 사실이 있는데, `readonly type: string = 'Add'` 같이 되어있는 부분에서 `string` 이라고 타입 선언을 제거해주면 `type` 이라는 속성은 `'Add'` 라는 상수 타입이 된다.

```ts
export class Add implements Action {
  readonly type = 'Add' // (property) Add.type: 'Add'
  constructor(public payload: string) {}
}
```

여기서 `readonly` 를 빼면 다시 `string` 타입으로 바뀐다. 왜냐면 `readonly` 는 바뀔 일이 없는 속성이지만, 그게 아니라면 외부의 요인에 의해 바뀔 수 있기 때문이다. 그럼 이제 상수 타입을 활용하여 액션을 확장해보자.

```ts
export class Add implements Action {
  readonly type = 'Add'
  constructor(public payload: string) {}
}

export class RemoveAll implements Action {
  readonly type = 'Remove All'
}

export type TodoActions = Add | RemoveAll

// ...
function todoReducer(state: TodoState = { todos: [] }, action: TodoActions) {
  // ...
}
```

이 상태에서는 `switch` 문 분기마다 `action` 의 타입이 정확하게 추론된다. 반사이익으로 `TodoActions` 에 새로운 타입이 추가되었다고 할 때 `switch` 문에서 제대로 다 다루지 않거나 하면 오류가 나타난다.

강좌에서는 언급되지 않았으나 `enum` 을 활용하는게 더 낫다. 아래의 구현체를 참고해보자.

```ts
interface ITodoState {
  todos: string[]
}

enum TodoActionType {
  Add = 'Add',
  RemoveAll = 'Remove All',
  RemoveOne = 'Remove One',
}

export interface Action {
  type: TodoActionType
}

export class Add implements Action {
  readonly type = TodoActionType.Add
  constructor(public payload: string) {}
}

export class RemoveAll implements Action {
  readonly type = TodoActionType.RemoveAll
}

export class RemoveOne implements Action {
  readonly type = TodoActionType.RemoveOne
}

type TodoActions = Add | RemoveAll | RemoveOne

function todoReducer(
  action: TodoActions,
  state: ITodoState = { todos: [] }
): ITodoState {
  switch (action.type) {
    case TodoActionType.Add: {
      return {
        todos: [...state.todos, action.payload],
      }
    }
    case TodoActionType.RemoveAll: {
      return {
        todos: [],
      }
    }
    default: {
      // 에러
      // 위의 switch 문을 다 거쳐서 남은 `action` 은 RemoveOne인데 `never` 가 될 수 없다.
      const x: never = action
    }
  }
  return state
}
```

## Mapped Type을 수정하기

타입스크립트에서 [Mapped Type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)의 활용 용도는 무궁무진하다. 대개 하나의 객체가 어떤 속성의 집합으로 이루어질 수 있는지 쉽게 정의할 수 있다.

아래와 같이 `Pet` 이라는 타입을 정의하고 그 모든 속성이 `readonly` 인 `ReadonlyPet` 으로 확장할 수도 있다.

```ts
interface Pet {
  name: string
  age: number
}

type ReadonlyPet = { readonly [K in keyof Pet]: Pet[K] }

const pet: Pet = { name: 'Happy', age: 10 }
const readonlyPet: ReadonlyPet = { name: 'Cerberus', age: 1000 }

pet.age = 15
readonlyPet.age = 200 // readonly 속성을 수정하려고 하기 때문에 에러
```

`Pet` 에 새로운 옵셔널 속성을 추가하되 `ReadonlyPet` 에서는 모든 속성이 반드시 있어야 한다고 정의하려면 어떻게 해야 할까? Mapped Type을 정의할 때 특수하게 `+`, `?` 연산자를 사용하여 특정 심볼을 더하거나 제거할 수 있다.

```ts
interface Pet {
  name: string
  age: number
  favoritePark?: string
}

type ReadonlyPet = { readonly [K in keyof Pet]-?: Pet[K] } // `-?` 부분 주목

// 이제 favoritePark 속성이 없다고 에러가 난다.
const readonlyPet: ReadonlyPet = { name: 'Cerberus', age: 1000 }
```

`+` 연산자는 특별할 것은 없지만 읽는 사람에게 '이 속성을 추가한다' 는 것을 더 명시적으로 보여줄 수는 있을 것이다.

```ts
type ReadonlyPet =
  +readonly [K in keyof Pet]-?: Pet[K];
};
```

## 타입과 인터페이스의 차이

아마 타입스크립트를 익히면서 초반에 혼란스럽다고 느낄 수 있는 주제다.  
검색을 해 보면 타입과 인터페이스의 차이가 무엇이냐고 많은 질문과 답이 있지만 확 와닿는 뚜렷한 답은 없다고 느꼈는데 이 강좌는 대체적으로 잘 설명되어 있다.

내용이 꽤 길어서 후반의 정리 부분을 인용하면

> 두 가지 모두 무언가 구조를 정의할 때 사용할 수 있습니다. 서로 다른 타입과 결합도 가능합니다(interface - `extends`, type - `&`).
>
> 두 형태의 타입 정의 방식을 교차해서 사용할 수도 있습니다. type이 interface나 다른 type과 함께 결합될 수도 있고, 클래스에 `extends`, `implements` 를 쓸 때 interface뿐 아니라 type도 가져올 수 있습니다. 하지만 유니언 타입은 `extends`, `implements` 에 사용될 수 없습니다.
>
> type은 같은 파일 안에서 두 번 선언 될 수 없지만, interface는 중복 선언될 경우 타입 결합과 동일하게 동작합니다. 이 원리를 활용하여 라이브러리의 타입을 확장하는데도 사용할 수 있습니다.
>
> 따라서 당신이 라이브러리 작성자라면 공개되는 타입 형태를 interface로 내보내어 사용자들이 필요할 경우 확장하기 쉽게 만들어 주세요.

## 자기 자신을 참조하는 타입 만들기

일반적으로 타입을 정의할 때 하나의 계층, 좀 크면 두개의 계층 정도까지 생각하게 된다.  
그런데 트리나 연결 리스트같은 자료구조라면 사용하기에 따라 아주 깊은 계층까지 형성될 수 있다. 그리고 참조하는 노드의 구조(타입)은 동일하다.

```ts
interface TreeNode<T> {
  value: T
  left: TreeNode<T>
  right: TreeNode<T>
}

interface LinkedListNode<T> {
  value: T
  next: LinkedListNode<T>
}

let node: LinkedListNode<string>
node.next.next.next.next.next.value
```

이 원리를 어떻게 활용할 수 있을까? 리덕스의 개발자 도구나 리덕스의 장점 중 하나인 undo/redo 가 용이하다는 것을 떠올려보면 되겠다. 만약 내가 이전에 사용했던 액션으로 돌아가보고 싶다면? 위에 정의한 것과 비슷하게 `ListNode` 타입을 만들어볼 수 있겠다.

```ts
interface Action {
  type: string
}

interface ListNode<T> {
  value: T
  prev: ListNode<T>
  next: ListNode<T>
}

let action1 = { type: 'LOGIN' }
let action2 = { type: 'LOAD_POSTS' }
let actionNode1: ListNode<Action> = {
  value: action1,
  prev: null,
  next: null,
}
let actionNode2: ListNode<Action> = {
  value: action2,
  prev: actionNode1,
  next: null,
}
actionNode1.next = actionNode2
```

하지만 `.next` 를 마구마구 찍어볼 수 있기 때문에 어느 순간에 `undefined` 가 나올 수 있다. 안전하게 호출하고자 한다면 `do/while` 문 같은것을 활용하여 다음 노드가 있는지 확인하면서 탐색을 할 수 있겠다.

```ts
actionNode1.next = actionNode2

let currentNode = actionNode2

do {
  console.log(currentNode.value)
  currentNode = currentNode.prev
} while (currentNode)
```

물론 더 나은 방법이 있다. 바로 아래에 소개되는 이터레이터를 이용한 방법이다.

## 이터레이터를 이용하여 커스텀 자료 구조의 순회를 단순하게 만들기

먼저 [이터레이터의 기본 개념](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Iterators_and_Generators)을 알고 있어야 한다. 타입스크립트에서는 타입이 지원되는 이터러블 프로토콜을 지원하는 객체를 손쉽게 만들 수 있다. 이번 예제로 되감기 가능한 액션의 모음을 만들기 위해 `BackwardsActionIterator` 라는 클래스를 구현해 보겠다.

```ts
class BackwardActionIterator implements IterableIterator<Action> {
  constructor(private _currentActionNode: ListNode<Action>) {}
}
```

여기까지 해 놓고 IDE나 VSCode 등을 이용하여 자동완성 액션을 수행하면 몇 가지 메서드가 튀어나올 것이다.

![Power of VSCode](./images/2019-07-21.gif)

여기서 우리는 `[Symbol.iterator]` 메서드와 `next` 메서드만 사용한다.

```ts
class BackwardActionIterator implements IterableIterator<Action> {
  constructor(private _currentActionNode: ListNode<Action>) {}

  [Symbol.iterator](): IterableIterator<Action> {
    return this
  }

  next(): IteratorResult<Action> {
    const curr = this._currentActionNode
    // 종료 조건
    if (!curr || !curr.value) {
      return { value: null, done: true }
    }
    // 1. 리스트의 아이템을 이동한다
    this._currentActionNode = curr.prev
    // 2. 값을 리턴해준다
    return { value: curr.value, done: false }
  }
}
```

이렇게 클래스를 생성했다면 임의의 액션과 리스트 아이템을 정의해보자.

```ts
let action1 = { type: 'LOGIN' }
let action2 = { type: 'LOAD_POSTS' }
let action3 = { type: 'DISPLAY_POSTS' }
let action4 = { type: 'LOGOUT' }

let actionNode1: ListNode<Action> = {
  value: action1,
  prev: null,
  next: null,
}
let actionNode2: ListNode<Action> = {
  value: action2,
  prev: actionNode1,
  next: null,
}
actionNode1.next = actionNode2
let actionNode3: ListNode<Action> = {
  value: action3,
  prev: actionNode2,
  next: null,
}
actionNode2.next = actionNode3
let actionNode4: ListNode<Action> = {
  value: action4,
  prev: actionNode3,
  next: null,
}
actionNode3.next = actionNode4
```

아까 만들어둔 이터레이터를 이용한다면 `next` 메서드 호출 뿐 아니라 `for..of`, 전개 연산자같이 이터러블 프로토콜을 사용하는 조작은 모두 사용할 수 있다. 다만 컴파일 할때는 타겟을 ES6 이상으로 해 주어야 한다. 하위 호환성을 챙기려면 바벨과 함께 사용해야 한다.

```ts
const backwardActionsList = new BackwardActionIterator(actionNode4)

for (const action of backwardActionsList) {
  console.log(action)
}
/** 결과
 * { type: 'LOGOUT' }
 * { type: 'DISPLAY_POSTS' }
 * { type: 'LOAD_POSTS' }
 * { type: 'LOGIN' }
 */
```

## unknown 타입 활용하기

점진적으로 타입스크립트를 도입하는 환경이나 어떤 값이든 될 수 있는 변수의 타입을 정의할 때 `any` 타입을 많이 사용하게 된다. 하지만 이후 컴파일러가 이 변수에 대한 타입 체킹을 전혀 하지 않기 때문에 문제가 될 수 있는데, 타입스크립트 3.0부터 추가된 `unknown` 타입이 많은 문제를 해결해줄 수 있다.

자세한 내용은 강좌에서도 소개하고 있지만 이미 잘 정리된 글이 있어서 두 링크를 첨부한다.

- [타입스크립트 3.0 - Huiseoul Engineering](https://engineering.huiseoul.com/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-3-0-99e5d45ec439) 의 'unknown 타입' 부분
- [The unknown Type in TypeScript — Marius Schulz](https://mariusschulz.com/blog/the-unknown-type-in-typescript)

꼭 알아두어야 할 핵심은 어떤 변수에 `unknown` 타입을 할당한 경우 그 변수는 반드시 어떤 타입인지 타입 가드를 거치거나 타입 지정을 해 주어야 오롯이 지정된 타입으로 사용할 수 있다는 것이다.

## 조건부 타입을 사용하여 함수의 타입을 동적으로 할당하기

타입스크립트 2.8버전부터 등장한 조건부 타입 덕분에 제네릭을 활용하여 동적으로 다양한 타입을 정의하는 것이 아주 쉬워졌다. 문법은 삼항 연산자와 비슷하다.

```ts
interface StringContainer {
  value: string
  format(): string
  split(): string[]
}

interface NumberContainer {
  value: number
  nearestPrime: number
  round(): number
}

interface Item<T> {
  id: T
  container: T extends string ? StringContainer : NumberContainer
}

let item: Item<string> = {
  id: "a23d",
  container: null
}

item.container.
// 여기까지 찍어보면 타입스크립트 개발 환경에서는 StringContainer 타입에 맞는 자동완성이 나온다.
```

`Item` 타입의 `container` 부분을 보면 삼항연산자처럼 동작하는 부분을 볼 수 있고, 그 사용 방법은 꽤 직관적으로 보이리라 생각한다. 다른 프로젝트의 소스 코드를 읽다 보면 한 타입 안에 조건부 타입이 많이 사용되어 조금 읽기 힘든 경우도 있지만 대체로 이렇게 사용된다.

강좌에서도 언급된 부분이지만, 이 방식을 활용하여 특정 타입을 걸러내는 식으로도 사용할 수 있다. 조건에 맞지 않는 타입은 `never` 타입이 되도록 만들면 된다. `never` 타입이 유니언 타입 안에 있으면 자동으로 무시되기 때문이다.

```ts
type ArrayOnly<T> = T extends any[] ? T : never
type StringOrNumbers = ArrayOnly<string | number | string[] | number[]>
```

이런식으로 하면 `StringOrNumbers` 의 타입은 `string[] | number[]` 가 된다.

덕분에 [함수 오버로딩](https://www.typescriptlang.org/docs/handbook/functions.html#overloads)을 편하게 할 수 있다. 오버로딩이란 하나의 함수가 인자의 갯수나 타입에 따라 다른 타입을 리턴하는 것을 정의하는 건데, 조건부 타입을 사용한다면 서로 다른 갯수의 함수 오버로딩은 힘들겠지만 다른 타입의 인자가 들어왔을 때의 처리가 수월해진다.

아래와 같이 `ItemService` 가 정의되어 있고, `getItem` 이 `Book` 이나 `Tv` 를 리턴할 수 있다고 하자. 지금 저 제네릭 정의만으로는 원하는 결과를 얻기가 힘들다. 말 그대로 아무 타입이나 들어올 수 있기 때문에 타입 안정성을 확보할 수 없다.

```ts
interface Book {
  id: string
  tableOfContents: string[]
}

interface Tv {
  id: number
  diagonal: number
}

interface ItemService {
  getItem<T>(id: T): Book | Tv
}
```

`getItem` 에 들어오는 제네릭은 `string` 이나 `number` 여야 할 것이고, 그에 따라 다른 타입을 내보내게 만들면 된다.

```ts
interface ItemService {
  getItem<T extends string | number>(id: T): T extends string ? Book : Tv
}

let itemService: IItemService

const book = itemService.getItem('10')
const tv = itemService.getItem(10)
const wrong = itemService.getItem(false) // 에러
```

[조건부 타입에 대해 자세히 설명된 글은 이 링크를 참고](https://mariusschulz.com/blog/conditional-types-in-typescript)

## 조건부 타입을 활용하여 재사용할 수 있는 평탄한 타입(Flatten Type) 만들기

개인적으로 많이 쓸 일은 없을 것 같지만... 이 강좌에서는 배열이나 객체 같은 컬렉션에 있는 각 요소들의 타입을 유니언으로 만드는 것을 평탄한 타입이라 정의하고 있다.

```ts
const someNumbers = [2, 1];
const someObject = {
  id: 21,
  name: 'John',
};
const someBoolean = true;

type NumbersArrayFlattened // -> number
type SomeObjectFlattened   // -> number | string
type SomeBooleanFlattened  // -> boolean
```

3개의 타입을 각각 구현해보자. 먼저 위의 두 개 까지는 쉽다.

```ts
type FlattenArray<T extends any[]> = T[number]
type FlattenObject<T extends object> = T[keyof T]

type NumbersArrayFlattened = FlattenArray<typeof someNumbers> // -> number
type SomeObjectFlattened = FlattenObject<typeof someObject> // -> number | string
```

`FlattenArray`, `FlattenObject` 가 비슷해보이지만 본질적으로 다른 이유는 JS의 배열도 일종의 객체지만 key를 `number` 타입으로만 쓰는 특수한 객체라는 것이다.  
만약에 `FlattenObject<typeof someNumbers>` 타입을 만들어보고 무슨 타입이 나오는지 확인해보면, 배열 안에 있는 요소 뿐 아니라 배열에서 쓸 수 있는 모든 메서드의 타입의 모음이 유니언 타입으로 나타날 것이다.

정말 만일의 경우지만 `SomeBooleanFlattened` 같은 타입이 필요할 때는 어떻게 해야할까? 위의 두 가지 방법은 쓸 수가 없다. 그냥 자기 자신을 리턴하게만 만들면 되기 때문이다.

여기까지 이야기했음에도 소제목과 다르게 조건부 타입에 대한 이야기가 나오지 않았지만, 슬슬 조건부 타입이 등장할 차례가 되었다. 조건부 타입을 활용하면 저 3가지 조건을 모두 충족하는 타입 `Flatten` 하나를 만들 수 있다.

```ts
type Flatten<T> = T extends any[]
  ? T[number]
  : T extends object
  ? T[keyof T]
  : T

type NumbersArrayFlattened = Flatten<typeof someNumbers> // -> number
type SomeObjectFlattened = Flatten<typeof someObject> // -> number | string
type SomeBooleanFlattened = Flatten<typeof someBoolean> // -> boolean
```

조건부 타입은 삼항 연산자의 연산 방식과 비슷하게 동작하기 때문에 중첩하여 사용할 수 있다. 따라서 두 가지 이상의 조건을 결합하여 타입을 계산하게 만들 수 있다.

## 제네릭 함수 타입이 어떤 타입으로 리턴되는지 추측하기

타입스크립트의 타입 추론 엔진은 아주 괜찮다. 특히 함수의 경우 일일이 리턴 타입을 명시하지 않아도 어지간한 경우에는 자동으로 추론이 되어서 사용할 수가 있다. 아래의 `generateId` 라는 함수에 `+ 5` 가 될 지 `+ "5"` 가 될지에 따라 리턴 타입은 알아서 바뀐다.

```ts
function generateId(seed: number) {
  return seed + 5 // 숫자를 반환
  //  return seed + "5"; -> 문자열을 반환
}
```

그런데 만약 `generateId` 의 리턴값만 가져다 써야 하는 특정한 함수가 있다고 해 보자. 혹시라도 `generateId` 의 리턴값이 바뀌게 될 경우 일일이 찾아서 같이 바꾸어 주어야 할까?

```ts
function generateId(seed: number) {
  return seed + 5
}

lookupEntity(generateId(10)) // 에러

// id의 인자 타입을 number로 바꿔주면 당장은 동작하겠다만
// generateId의 리턴 타입이 바뀌게 되면 일일이 대응해주어야 하나?
function lookupEntity(id: string) {
  // id값으로 엔티티를 쿼리한다
}
```

여기서 [`infer` 키워드](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)가 유용하게 사용된다. 키워드를 사용하여 '해당 타입의 추론을 하라'고 타입스크립트 엔진에게 시키는 것이다. 아래의 `ReturnType` 을 보자. 이 타입은 원래 타입스크립트 2.8버전부터 기본으로 들어있기 때문에 직접 구현할 필요는 없다.

```ts
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : any
```

함수 타입 `F` 의 리턴 타입을 추론할 수 있다면 추론된 `R` 이라는 타입을 리턴하고, 할 수 없다면 `any` 를 리턴하게 만드는 타입이다. 좀 더 빡빡한 타입 정의를 하고자 한다면 `any` 를 `never` 로 만들 수도 있겠다.

그러면 이제 이 타입을 사용하여 `lookupEntity` 함수의 인자 타입을 다시 지정해보자.

```ts
// ...
type Id = ReturnType<typeof generateId>
lookupEntity(generateId(10)) // 이제 에러 안난다

// generateId의 리턴 타입에 따라 id의 타입도 바뀐다
function lookupEntity(id: Id) {
  // id값으로 엔티티를 쿼리한다
}
```

다른 사용 예로 프라미스(Promise) 객체 안에 있는 값의 타입을 편하게 꺼내려 할 때도 `infer` 키워드를 사용하면 런타임에서 결정되는 타입을 손쉽게 정의할 수 있다.

```ts
type UnpackPromiseArray<P> = P extends Promise<infer K>[] ? K : any

const arr = [Promise.resolve(true)]

type ExpectedBoolean = UnpackPromiseArray<typeof arr> // -> boolean
```

응용을 해 보자면 [이 소스코드](https://github.com/hallettj/redux-instant/blob/master/src/index.ts#L14-L18)가 어느정도 참고할만하다고 생각한다. 아래는 소스코드의 주석을 번역한 것이다.

```ts
/**
 * `Payload<H>` 는 핸들러 `H` 타입에 있는 페이로드 타입을 추론한다.
 * 만약 핸들러가 페이로드 인자(두 번째 인자)가 없는 경우 리턴 타입은 `undefined` 를 리턴하고
 * 페이로드가 있다면 페이로드의 타입을 추론하여 리턴한다.
 */
export type Handler<S, P> = (state: S, payload: P) => S
type Payload<H> = H extends (s: any) => any
  ? undefined // 페이로드가 인자에 포함되지 않은 경우
  : H extends Handler<any, infer Payload> // `H` 타입이 `Handler` 타입이 아닌 경우 에러를 표시한다
  ? Payload
  : never
```

## 중첩된 객체의 모든 속성을 read-only 타입으로 만들기

리덕스(Redux)를 사용하다 보면 `state` 는 불변(이뮤터블) 객체여야 한다. 그렇다면 같이 일하는 팀원이나 내가 만든 리덕스 관련 라이브러리를 사용하는 사람이 이 값을 실수로 재할당하는 일이 없으면 좋을 것이다. (물론 타입스크립트 사용자여야겠지만)

아래 예제와 같이 타입 및 리듀서가 정의되어 있다고 하자. 지금 상태에서는 사용자가 코드 아랫부분같이 직접 객체를 변경해도 타입스크립트가 아무런 경고를 표시하지 않는다.

```ts
interface Email {
  from: string
  to: string[]
  body: string
}

interface Todo {
  isCompleted: boolean
  text: string
  linkedEmail: Email
}

interface RootState {
  userId: string
  showCompletedOnly: boolean
  todoTypes: string[]
  todos: Todo[]
  iconGrid: string[][]
}

function rootReducer(action: any, state: RootState): RootState {
  // case action 1...
  // case action 2...
  return state
}

let state: RootState

// 아래의 코드는 아무런 경고가 뜨지 않는다.
state.showCompletedOnly = true
state.userId = 'newId'
state.todoTypes = []
state.todoTypes[0] = 'diff type'
state.todos[1].linkedEmail.body = 'hi'
state.todos[1].linkedEmail.to[1] = 'john'
```

처음에는 "`Readonly<IRootState>` 하면 되지 않나? 그러면 모든 속성이 `readonly` 가 될 거잖아" 라고 생각할 수 있다. 하지만 해당 속성 안에 또 배열이나 다른 객체가 들어있는 경우는 에러가 표시되지 않는다.

```ts
type ReadonlyRootState = Readonly<RootState>
let state: ReadonlyRootState

// 위의 세 줄 까지만 에러가 뜬다.
state.showCompletedOnly = true
state.userId = 'newId'
state.todoTypes = []
// 여기부터는 에러가 뜨지 않는다.
state.todoTypes[0] = 'diff type'
state.todos[1].linkedEmail.body = 'hi'
state.todos[1].linkedEmail.to[1] = 'john'
```

결국 객체의 속성을 모두 순회 탐색하면서 `readonly` 를 해 주는 재귀 형태의 타입을 정의해보기로 한다.

```ts
type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }
type ReadonlyRootState = DeepReadonly<RootState>

let state: ReadonlyRootState

// 이제 모든 부분에서 에러가 표시된다.
state.showCompletedOnly = true
state.userId = 'newId'
state.todoTypes = []
state.todoTypes[0] = 'diff type'
state.todos[1].linkedEmail.body = 'hi'
state.todos[1].linkedEmail.to[1] = 'john'
```

강좌에서는 `DeepReadonly` 가 적용될 경우 아래와 같이 `map` 함수를 사용할 때도 에러가 표시된다고 하는데, 타입스크립트 3.5.2 버전 기준으로 실험해봤을 때 에러가 표시되지 않았다. [3.4버전부터 `ReadonlyArray` 타입이 개선된 것으로 보인다.](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#improvements-for-readonlyarray-and-readonly-tuples)

```ts
state.todoTypes.map(todo => todo.toUpperCase())
```

따라서 강좌의 내용을 정리할 필요가 없어졌지만, 한번 어떤 방식으로 `DeepReadonly` 타입을 개선했는지 살펴보자.  
먼저 맨 처음 정의했던 `DeepReadonly` 는 `DeepReadonlyObject` 로 수정한다. 객체만 적용하겠다는 뜻이다. 그리고 조건부 타입을 활용하여 객체가 아니라 배열일 경우에만 특별한 처리를 해 준다.

```ts
type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }
type DeepReadonly<T> = T extends (infer E)[]
  ? ReadonlyArray<DeepReadonlyObject<E>>
  : T extends object
  ? DeepReadonlyObject<T>
  : T
type ReadonlyRootState = DeepReadonlyObject<RootState>

let state: ReadonlyRootState
```

하지만 이 `DeepReadonly` 구현체는 이중 배열일 경우 제대로 처리가 되지 않는다. 제네릭 안에 또 처리를 해주면 되겠지만 매번 이렇게 중첩을 해 줄수도 없는 노릇이다.  
따라서 참고만 하되 가능하면 3.4 버전 이상의 타입스크립트를 활용하는게 좋을 것으로 보인다. 또한 리덕스로 상태 트리를 만들 때 가능하면 중첩 단계를 최소화하자.

## 데코레이터를 사용하여 클래스의 속성을 동적으로 초기화하기

이 강좌는 데코레이터 중에서도 [속성 데코레이터](https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators)를 다루고 있다. 데코레이터를 어떻게 만드는지 문서를 간단히 참고해보는 것을 추천한다.  
또한 공식 문서에서는 `reflect-metadata` 를 활용하고 있다. 데코레이터 제안이 Stage 2에 머물러 있긴 하지만, 정식으로 채용되면 자연스럽게 `Reflect.metadata` 도 사용 가능하기 때문이다.

API 서버에서 데이터를 가져오는 역할을 담당하는 서비스 계층의 클래스를 만들었다고 생각해보자. 예를 들어 `TodoService` 를 하나 만들었는데, 이 때 클래스 속성에 바로 기본값으로 `fetch` 를 넣어버릴 수도 있다.

```ts
interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

class TodoService {
  todos: Promise<Todo[]> = fetch('...')
}

const todoService = new TodoService()
```

이상적으로 일일이 `fetch` 를 호출하기보다 미들웨어를 맡아서 어떤 속성이든 손쉽게 `fetch` 요청을 처리하고 싶을 것이다. 그래서 `@GetTodos` 데코레이터를 만들어보기로 한다.

```ts
function GetTodos(target: any, propertyKey: string) {}

class TodoService {
  @GetTodos
  todos: Promise<Todo[]>
}
```

저 데코레이터 자체가 호출되는 타이밍을 미리 알아두면 좋은데 데코레이터는 일종의 생성자 역할만 할 뿐이고, 인스턴스가 만들어질 때 호출되는 것이 아니라 파일이 로드되자마자 저 클래스에 적용되는 것이다. 따라서 저 데코레이터가 적용 된 인스턴스가 만들어지는 것은 훨씬 뒤이다.

`target` 은 해당 객체 인스턴스이고, `propertyKey` 는 속성의 이름이다. 여기다 `Object.defineProperty` 를 활용하여 원하는대로 속성의 동작을 바꿔볼 수 있다.

```ts
function GetTodos(target: any, propertyKey: string) {
  const fetchData = () => fetch('targetUrl').then(response => response.json())

  Object.defineProperty(target, propertyKey, {
    get: function() {
      return fetchData()
    },
  })
}
```

이제 `todoService.todos` 를 "가져올 때마다" API 서버에서 데이터를 가져올 수 있게 되었다.

```ts
class TodoService {
  @GetTodos
  todos: Promise<Todo[]>
}

const todoService = new TodoService()
todoService.todos.then(todos => {
  console.log(todos)
})
```

위에서 "가져올 때마다" 를 강조했는데, 너무나 당연하지만 매번 저 속성을 조회할 때마다 API를 호출하는 것은 굉장히 비효율적이다. 처음 호출할 때만 데이터를 가져올 수 있게 만들면 어떨까? 데이터를 언제 어떻게 갱신할지 구체적인 부분에 대한 고민은 이 글에서는 넘어가기로 한다.

```ts
function GetTodos(target: any, propertyKey: string) {
  const hiddenInstanceKey = `_$$${propertyKey}$$_`
  const fetchData = () => {
    console.log('calling fetchData') // fetchData가 여러번 호출되는지 확인해보자
    return fetch('targetUrl').then(response => response.json())
  }

  Object.defineProperty(target, propertyKey, {
    get: function() {
      // 최초 호출 시 `hiddenInstanceKey` 안에 동적 할당
      return this[hiddenInstanceKey] || (this[hiddenInstanceKey] = fetchData())
    },
  })
}

class TodoService {
  @GetTodos
  todos: Promise<Todo[]>
}

const todoService = new TodoService()
todoService.todos.then(todos => {
  console.log(todos)
})
todoService.todos.then(todos => {
  console.log(todos)
})
todoService.todos.then(todos => {
  console.log(todos)
})
```

실제로 저렇게 하고 나서 코드를 돌려 보면 "calling fetchData" 로그는 한 번만 찍히는 것을 확인할 수 있다. `this` 는 해당 인스턴스를 지칭한다. 따라서 `Object.defineProperty` 로 객체를 설정할 때 인스턴스를 활용할 필요가 있다면 화살표 함수를 사용하면 안된다.

이제 재사용성을 높이기 위해 `@GetTodos` 를 `@Get` 으로 바꿔준다. 데코레이터 선언 시 어느 URL로 요청을 할 지 지정하는 것이다.

```ts
function Get(url: string) {
  return function(target: any, propertyKey: string) {
    const hiddenInstanceKey = `_$$${propertyKey}$$_`
    const fetchData = () => fetch(url).then(response => response.json())

    Object.defineProperty(target, propertyKey, {
      get: function() {
        return (
          this[hiddenInstanceKey] || (this[hiddenInstanceKey] = fetchData())
        )
      },
    })
  }
}

class TodoService {
  @Get('https://jsonplaceholder.typicode.com/todos')
  todos: Promise<ITodo[]>
}
```

[데코레이터는 함수 조합처럼 조합이 가능하다.](https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-composition) 호출할 때는 아래에서 위(오른쪽에서 왼쪽)로 호출되지만 생성 시 평가되는 순서는 위에서 아래(왼쪽에서 오른쪽)로 평가된다.

```ts
function f() {
  console.log('f(): evaluated')
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('f(): called')
  }
}

function g() {
  console.log('g(): evaluated')
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('g(): called')
  }
}

class C {
  @f()
  @g()
  method() {}
}
const c = new C()
console.log(c.method())

/**
 * method 호출 결과
 * f(): evaluated
 * g(): evaluated
 * g(): called
 * f(): called
 */
```

이 원리를 활용하여 `@Get` 데코레이터의 첫 번째 결과만 가져오는 `@First` 라는 데코레이터를 만들어보자. 참고로 타입스크립트에서 기본으로 데코레이터 타입을 내장하고 있기 때문에 타입 안정성을 가져가고 싶다면 활용해 보는 것도 좋다.

```ts
const Get: (url: string) => PropertyDecorator = url => {
  return function fetchDecorator(target: any, propertyKey: string) {
    const hiddenInstanceKey = `_$$${propertyKey}$$_`
    const fetchData = () => fetch(url).then(response => response.json())

    Object.defineProperty(target, propertyKey, {
      get() {
        return (
          /**
           * 데코레이터를 조합 할 때는 이상하게도 `Object.defineProperty` 안에서 `this` 가 제대로 동작하지 않았다(undefined로 표시됨).
           * 강좌의 예제에서는 `this` 가 잘 동작했지만, 이번에는 `target` 만 사용하여도 동작하고, 같은 객체를 사용하리라 생각하기 때문에 변경했다.
           */
          target[hiddenInstanceKey] || (target[hiddenInstanceKey] = fetchData())
        )
      },
      configurable: true,
    })
  }
}

const First: () => PropertyDecorator = () => {
  return function(target: any, propertyKey: string) {
    const hiddenInstanceKey = `_$$${propertyKey}$$_`
    // `@Get` 데코레이터를 통해 먼저 재정의되었던 `get` 을 가져온다.
    const prevInit = Object.getOwnPropertyDescriptor(target, propertyKey).get
    const getFirst = () => prevInit().then(response => response[0])

    Object.defineProperty(target, propertyKey, {
      get() {
        return (
          target[hiddenInstanceKey] || (target[hiddenInstanceKey] = getFirst())
        )
      },
      configurable: true,
    })
  }
}

class TodoService {
  @First()
  @Get('https://jsonplaceholder.typicode.com/todos')
  todos: Promise<Todo[]>
}
```

이제 `todoService.todos.then(/* ... */)` 을 하게 되면 맨 처음 한개의 아이템만 가져오게 된다. API 호출할 때는 다 가져오겠지만...
