---
title: 에러 처리를 어떻게 하면 좋을까? - 2
date: 2019-05-04
tags:
  - Programming
  - Javascript
  - Typescript
  - Functional Programming
coverImageUrl: https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1935&q=80
description: 에러 처리를 일관된 형태로 하기 위한 고민 이야기, 두 번째
---

저번 글에 에러 처리의 정의를 짚어보고, Fetch API를 사용하는 예를 들어 자바스크립트 환경에서 발생하는 일반적인 비동기 에러 처리 흐름을 살펴보았습니다. 단순히 `try/catch + throw` 를 사용하는 방식 말고, 에러 여부를 구분할 수 있는 속성을 가진 객체를 리턴하는 방식과 Golang 스타일을 약간 차용하여 `[Error | null, Success | null]` 의 형태가 항상 유지되는 튜플을 리턴하는 방식도 알아보았습니다.

이번 글에서는 추가로 두 가지 개념을 더 설명하겠습니다. 기회가 된다면 그 다음 시간에는 실제 리액트 애플리케이션에서 에러 처리를 하는 시나리오를 적용하는 예를 소개해 보고 싶습니다.

## 타입스크립트로 커스텀 에러 클래스 정의하기

저번 글에서 `catch` 블록에 잡히는 에러 객체의 타입을 보장할 수 없어서 (개인적으로) 불안하다는 이야기를 했습니다. 특히 타입스크립트 환경에서는 더욱 답답하겠죠. 간단한 해결책은 있습니다. 직접 에러 객체를 만들고, [타입 가드](https://basarat.gitbooks.io/typescript/docs/types/typeGuard.html)를 활용하여 에러를 구분해낸다면, 그 다음부터는 타입스크립트 컴파일러의 도움을 받을 수 있습니다.

가장 쉽게 커스텀 에러를 만드는 방법은 `Error` 객체를 상속한 클래스를 만들고 그 에러의 인스턴스를 만들어 쓰는겁니다. 이전 예제에서 `class HTTPError extends Error {}` 구문을 보셨을겁니다. 이 에러에 조금 더 살을 붙여보겠습니다.

```typescript
class HTTPError extends Error {
  constructor(statusCode: number, message?: string) {
    super(message) // 반드시 호출해야함
    this.name = `HTTPError`
    this.statusCode = statusCode
  }
}

const fetchPosts = async () => {
  const response = await fetch(`/api/posts`)
  if (response.ok) {
    return await response.json()
  } else {
    throw new HTTPError(response.status, response.statusText)
  }
}

const renderPosts = async () => {
  try {
    const posts = await fetchPosts()
    // Do something with posts
  } catch (e) {
    console.error(e.statusCode) // <- 컴파일 에러
    if (e instanceof HTTPError) {
      alert(`fetching posts failed, error code is ${e.statusCode}`) // 이건 정상
    }
  }
}
```

이렇게 `instanceof` 를 통과하면 해당 에러 객체의 속성을 좀 더 안전하게 활용할 수 있습니다. 물론 어떻게든 예상하지 못한 에러를 처리하긴 해야겠죠.

그런데 단순히 에러 객체를 만들어서 메세지만 전달하는 수준이 아니라, 에러를 처리하는 로직을 커스텀 에러가 가지도록 만들면 어떨까요? 어차피 `HTTPError` 도 하나의 클래스니까 여기다 메서드를 정의하면 써먹을 수 있지 않을까요?

```typescript
class HTTPError extends Error {
  constructor(
    private statusCode: number,
    private errorData: Record<string, any>,
    message?: string
  ) {
    super(message) // 반드시 호출해야함
    this.name = `HTTPError`
  }

  showAlert() {
    alert(`HTTPError occurred: ${this.errorData.message}`)
  }

  forceLogout() {
    if (this.errorData.needForceLogout) {
      localStorage.removeItem(`__magic__token__`)
      window.history.replace(`/`)
    }
  }
}

try {
  // ...
} catch (e) {
  // ...
  if (e instanceof HTTPError) {
    e.showAlert()
  }
}
```

실제로 저 코드를 타입스크립트 환경에서 실행해 보시면 `showAlert` 이라는 속성이 `undefined` 라고 나오면서 오류가 발생합니다. [타입스크립트의 구현상 한계 때문에 발생하는 것으로 2.1부터 적용된 변경점이라고 합니다.](https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work)

문서에서 소개하는 대로 클래스의 생성자에서 `Object.setPropertyOf` 를 호출해주면 잘 동작합니다만, IE10 이하에서는 동작하지 않는다고 합니다. (이것도 방법이 있긴 합니다만 굳이 고려하지 않겠습니다. 참고 자료에 링크해놓은 `ts-custom-error` 패키지의 소스코드를 참고하시기 바랍니다.)

```typescript
class CustomError extends Error {
  name: string

  constructor(message?: string) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor) // 하는 김에 스택트레이스도 바로잡아줍시다
  }
}

class HTTPError extends CustomError {
  constructor(
    private statusCode: number,
    private errorData: Record<string, any>,
    message?: string
  ) {
    super(message)
    this.name = ‘HTTPError’
  }

  get rawErrorData() {
    return this.errorData
  }

  get codeToErrorMessage() {
    switch (this.statusCode) {
      case 401:
        return `You don’t have a permission.`
      // ...
    }
  }
}

try {
  // ...
} catch (e) {
  if (e instanceof HTTPError) {
    showErrorMessage(e.codeToErrorMessage)
  }
}
```

위의 `CustomError` 클래스를 상속해서 새로운 커스텀 에러를 만들어 활용할 수 있습니다. 만약에 특정 에러에 따라 기본 동작이 있고, 경우에 따라 추가적인 동작을 실행하고 싶다면 적당한 에러 핸들러 함수를 만들어주고 인자로 에러 객체를 넘겨주면 되겠네요.

```typescript
function handleHTTPError(err: Error, handlerFn: (e: HTTPError) => void) {
  if (err instanceof HTTPError) {
    console.error(err.message) // 아니면 에러 로깅 서비스 등으로 전송을 하거나
    handlerFn(e)
  }
}
```

커스텀 에러를 여러개 정의했고, 하나의 `try/catch` 블록에서 여러 타입의 에러 핸들러를 한번의 인자 전달로 처리하고 싶어졌으니 `pipeErrorHandlers` 같은 함수를 만들어보죠.

```typescript
type ErrorHandler<E extends Error> = (e: E) => { moveNextHandler: boolean }
function pipeErrorHandlers(handlerFns: ErrorHandler[]) {
  return (e: Error) => {
    for (const handler of handlerFns) {
      const { moveNextHandler } = handler(e)
      if (!moveNextHandler) {
        break
      }
    }
  }
}
```

어떤 핸들러에서 내가 원하는 에러 처리가 되었으면 뒤의 핸들러에게 처리를 맡길 필요가 없으니까 각각의 핸들러는 타입 가드에 따라 `{ moveNextHandler: boolean }` 을 반환하도록 만들었습니다.

```typescript
try {
  // 에러가 일어날만한 일 시도
} catch (error) {
  pipeErrorHandlers(
    handleSessionError(e => {
      // SessionError의 인스턴스라면 처리하고 끝낸다
    }),
    handleHTTPError(e => {
      // 아니면 HTTPError일 경우 처리하고 끝낸다
    }),
    handleUnexpectedError(e => {
      // 혹시 모르니까 안전장치를 마련해두자
    })
  )(error)
}
```

이런 방식이라면 그나마 타입스크립트의 자동완성의 도움을 받아 커스텀 에러 클래스를 활용할 수 있습니다. `catch` 블록이 거대해지는건 개인적으로 마음에 들진 않는데, 더 좋은 방안은 언제나 댓글로 알려주시면 좋겠습니다. 🙇

## Result(혹은 Either) 모나드

'모나드란 무엇인가?' 같은 거창한 이야기는 여기서 다루진 않겠습니다. 여기서는 간단히(?) **값을 담아둘 수 있고, 특정 규칙으로 통제할 수 있으며, 맵 함수(매퍼-Mapper-라고 부르곘습니다)를 통해 일련의 계산 과정을 서술하는 타입** 이라 정의하겠습니다. 이번에 소개할 `Either` 모나드는 "에러일 수도 있고 아닐 수도 있는 값을 담아두고 서술된 연산 과정에 따라 계산을 하되, 계산 결과에 따라 에러인 경우 값을 꺼낼 때 별도의 처리를 하는" 역할을 합니다.

`Either` 라고 불리는 이유는 **올바른 값** 인 경우에는 `right` (영어로 '맞다' 라고 할 때 그 right입니다), 에러인 경우 무조건 right의 반대니까 `left` 이기 때문이라고 합니다.

예제를 작성하기 위해 자료 조사를 더 하다 보니 몇몇 글에서는 `Result` 라고 표현하더군요. 좀 더 직관적으로 들리기 때문에 앞으로는 `Result` 라고 하겠습니다. 스위프트에서도 `Result` 라고 합니다.

`Result` 에는 `Success` 와 `Failure` 두 종류의 타입이 들어올 수 있습니다. 간단한 코드로 사용 예를 적어보겠습니다.

```typescript
type PostResponse = {
  id: number
  title: string
  author: string
  content: string
  createdAt: string
}[]

const getPosts = async () => {
  try {
    cosnt response = await fetchPosts()
    const posts = await response.json()
    return Result.success<PostResponse, HTTPError>(posts)
  } catch (e) {
    return Result.failure<PostResponse, HTTPError>(new HTTPError(/* args */))
  }
}
```

여기까진 별로 특별할 게 없어 보입니다. 성공 실패에 따라 비슷한데 다른 객체를 내보내는 것은 지난 시간에 Golang스타일 같은거 아닌가? 싶을수도 있죠. `Result` 모나드는 이 데이터를 쓰는 방법이 다릅니다.

```typescript
// 포스트를 가져온 다음
// 만들어진 순서 역순으로 정리를 하고
// `타이틀 - 작가명` 으로 `title` 필드를 수정해준 다음
// 만약 에러가 발생한다면 얼럿을 표시해준다
// 에러가 없다면 그 값을 posts 라는 변수에 할당한다
const posts = await getPosts()
  .map(posts => posts.slice().sort((a, b) => b.createdAt - a.createdAt))
  .map(sortedPosts =>
    posts.map(post => ({
      ...post,
      title: `${post.title} - ${post.authore}`,
    }))
  )
  .get(e => e.showAlert())
```

1. 덕분에 에러가 발생하는 경우를 고려하는 것 보다 핵심 로직을 작성하고 원하는대로 합성하는데 집중할 수 있습니다.
2. 여기서는 다루지 않겠지만, 혹시 있을지 모르는 `null` , `undefined` 값을 안전하게 처리하는데도 사용할 수 있습니다. 빈 값을 체크하는 로직을 코드 중간중간에 넣느라 코드가 지저분해지는 것 보다 내가 처리하고싶은 로직에 집중할 수 있죠.
3. 덕분에 에러를 다른 코드로 퍼트리지 않고 더 안전한 후처리를 보장할 수 있게 되었습니다. `try/catch` 블록을 따로 보느라 뛰어다녀야 하지 않는 것은 덤이고요.

`Result` 에는 `map`, `get` 말고 다른 함수를 구현할 수도 있습니다. 보통 추가하자면 `flatMap` 을 씁니다. 보통 매퍼가 일반 값이 아니라 또 `Result` 모나드를 리턴하는 연산(실패할 수도 있는 연산)을 하는 경우 모나드가 중첩되지 않도록 할 때 사용합니다.

`Result` 구현체는 아래의 codesandbox 예제로 살펴보겠습니다. `Either` 클래스가 어떻게 만들어져있는지 소스코드를 읽어보시고, `helloUser.ts` 파일의 동작을 살펴보시면 됩니다.

이전에 작성해둔거라 `Either` 라고 되어있지만 위에서 설명했다시피 `Either.left === Result.failure` / `Either.right === Result.success` 로 바꿔서 보시면 됩니다.

<iframe src="https://codesandbox.io/embed/31l59o1m9q?fontsize=14&module=%2Fsrc%2FEither.ts&view=editor" title="Either monad in typescript" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

codesandbox의 시나리오대로라면 반반 확률로 실패를 하고 에러를 뿜게 되는데, API서버에 요청하는 역할을 하는 함수가 먼저 `Result` 객체를 리턴합니다. 그리고 View 에 맞게 데이터를 가공해주는 역할을 하는 함수는 정해진 흐름에 따라 데이터를 가공하고, View에서는 에러가 발생했다고 빈 화면이 뜨는 대신 안전하게 처리된 메세지를 볼 수 있게 되었습니다.

---

여태까지 소개한 방법 중에 저는 어떤 방법을 쓰냐구요? 처음엔 Golang 방식을 도입해보려 했다가 지금은 커스텀 에러를 정의하고 올바른 핸들러를 꼭 정의하도록 강제하는 방식을 취하고 있습니다. `Either` 모나드는 작년에 다른 프로젝트에서 활용했었습니다. **진리의 케바케**인 셈이죠.

지금까지 보여드린 정도로는 "어떻게 에러 처리를 할 것인지" 설명이 많이 부족하리라 생각되지만, 저 역시도 공부하는 입장인데다 언제나 더 나은 개념 혹은 활용 방법이 있으리라 믿으면서 끊임없이 수정 가능하기 쉬운 코드를 작성하기 위해 노력하고 있습니다.

이 글을 읽으신 분들이 조금이나마 아이디어를 얻으셨으면 좋곘습니다. 더 좋은 방법 있으면 댓글에 남겨주시거나 공유 하시면서 소개해주시면 더 좋겠네요 😃

## 참고 자료

- [GitHub - adriengibrat/ts-custom-error: Extend native Error to create custom errors](https://github.com/adriengibrat/ts-custom-error)
- [함수형 자바스크립트(루이스 아텐시오 저)](https://rinae.dev/posts/functional-javascript-review)
- [Advanced functional programming in TypeScript: functional exceptions - codewithstyle.info](https://codewithstyle.info/advanced-functional-programming-typescript-functional-exceptions/)
- [Error handling in Typescript | reddit](https://www.reddit.com/r/typescript/comments/8l3ar6/error_handling_in_typescript/dzcnh9o/?utm_source=share&utm_medium=web2x)
- [Optional, throws, Result, 그리고 async/await - NSHipster](https://nshipster.co.kr/optional-throws-result-async-await/) - 스위프트 관련 저널이지만 여기 소개된 개념을 이해하시면 제가 적은 내용보다 더 많은 것을 얻으실 수 있습니다
