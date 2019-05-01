---
title: 에러 처리를 어떻게 하면 좋을까? - 1
date: 2019-05-01
tags:
  - Programming
  - Javascript
  - Typescript
  - Debugging
description: 에러 처리를 일관된 형태로 하기 위한 고민 이야기, 첫 번째
---

여러분들은 자바스크립트(혹은 타입스크립트)로 에러 처리를 할 때 어떤 방식으로 하시나요? 이 글을 쓰기 앞서 [트위터로 질문을 올리고](https://mobile.twitter.com/adhrinae/status/1123213378212646915) 나름의 답을 얻긴 했습니다만 제가 최근에 고민하던 문제를 해결해보고자 다양한 방법을 시도한 이야기를 풀어보고자 합니다. 그래서 제목이 “에러 처리 하는 방법” 이 아니라 아직도 고민하는 중이라서 의문형인채로 두었습니다. 그리고 특히 비동기 에러 처리에 대한 고민을 적어보고자 합니다.

- **먼저 이 글에 사용될 코드는 대부분 타입스크립트로 작성되었고, 글을 읽는 분들이 async/await, Promise 를 활용한 자바스크립트 사용법을 이해하고 있으리라 간주하고 작성되었습니다.**
- **또한 이 글의 내용은 정답 제시가 아니라 어디까지나 제 개인이 조사하면서 나온 의견에 불과합니다. 더 좋은 의견 제시는 언제나 환영합니다.**

---

## 들어가며

보통 자바스크립트를 배우게 되면 `try/catch` 문법도 배우게 됩니다. `throw new Error(message)` 같은걸 하게 되면 콜스택에서 `catch` 가 걸쳐 있는 블록으로 에러 객체가 전달되겠죠. 콜스택의 어떤 함수에서도 에러를 처리하지 않으면 처리되지 않은 에러로 인해 최악의 경우에는 프로그램이 강제로 종료되고 사용자들은 빈 화면만 마주하게 될 수 있습니다.

더 나아가기에 앞서 이 에러라는 녀석을 조금 더 세분화해서 생각해보기로 합시다.

1. 동작 중에 일어난 에러(Operational error, Unchecked error) - 제대로 작성된 프로그램이지만 런타임에서 미처 모르는 상황에 발생한 에러. 보통은 버그로 간주되지 않으며 대체로 시스템 내부보단 외부 요인에 의해 발생하는 경우가 많다.
2. 프로그램적 에러(Checked error) - 보통은 로직이 잘못되어 생긴 버그로써, 제대로 코드를 고치면 얼마든지 해결할 수 있는 버그. 예를 들자면
   1. `undefined` 값을 읽으려고 했거나
   2. 비동기 함수의 처리를 제대로 하지 않았거나 (콜백, 프로미스 등)
   3. 어떤 함수의 인자로 객체가 들어와야 하는데 문자열을 받았다거나 (타입 에러)

에러라는 단어를 이야기할 때 1번과 2번이 혼용되는 경향이 있는데 2번은 엄연히 수정될 수 있는 버그며, 여기서 이야기하고자 하는 에러는 아닙니다. 1번은 프로그램이 정상적으로 실행되는 범주에 속합니다. 여기서 문제는 에러를 처리하는 코드를 작성하는 것도 결국 프로그램적 에러를 초래할 수 있다는 겁니다. 에러를 제대로 처리하지 못하면 프로그램이 정상적으로 동작하지 못할테고, 이 처리를 하지 않은 프로그래머가 일으킨 버그가 될 수 있는 것이죠.

## 고민의 시작

그래서 그런지 언제부턴가 가능하면 무분별하게 `throw` 문을 사용하는 일을 최대한 줄였습니다. 함수를 호출 할 때 제가 작성한 로직 내부에서 처리 가능한 경우 적절한 형태의 에러 객체를 리턴하여 받아 쓰는 쪽에서 에러를 확인하고 그에 맞는 처리를 하는 식으로 작성해도 충분하기도 했으며, 이 처리를 통합해보고자 함수형 프로그래밍을 살펴보기도 하고, 모나드라는 개념을 익혀보려 애쓰기도 했습니다.

지금은 전혀 다른 프로젝트를 진행하고 있고, 이 프로젝트가 고도화되면서 팀에 참여하는 개발자 모두가 적절히 합의된 형태로, 어떤 형태의 에러도 적절하게 처리할 수 있는 방법이 있어야겠다는 생각이 들기 시작했습니다. 특히 다른 부분은 몰라도 API 서버로부터 요청을 하고 리턴받은 값을 처리할 때 에러 처리하는 방식이 제각각이었습니다.

어떤 사람은 `console.error(err)` 같은 구문만 `catch` 블록에 덜렁 남겨놓기도 했고(`TODO` 코멘트와 함께이긴 했지만 🤔), 어떤 사람은 Promise 객체를 받아 `.catch(err => handleError(err))` 같은 방식의 처리를 하기도 했습니다. 어떤 사람은 아예 에러를 핸들링하는 부분을 넣지 않아서 API 호출한 응답 스테이터스값이 `401` 로 돌아온 것 만으로도 런타임 에러가 발생하여 앱이 멈추기도 했습니다.

나중에는 다른 모듈의 에러 처리를 다루는 방법에 대한 고민을 적어볼 기회가 있겠지만, 이번 시간에는 프론트엔드 애플리케이션에서 백엔드 서버와 통신하고 그 결과에 따른 에러 처리에 대한 고민을 해보겠습니다.

## Fetch API의 일반적인 에러 처리 방법에 양념 추가하기

[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)를 사용한다고 하면 상태 코드 `200~299` 이상의 응답값은 모두 에러로 간주됩니다. 따라서 다음과 같이 코드를 작성하게 됩니다.

```js
class HTTPError extends Error {}

// Promise
fetch('/api/posts' /* options */)
  .then(response => {
    if (response.ok) {
      // 요청이 성공(200~299) 하면
      return response.json()
    } else {
      // 아니면 일단 에러 던지고 보자
      throw new HTTPError(`Response: ${response.statusText}`)
    }
  })
  .then(json => doSomething(json))
  .catch(error => handleError(error))

// async/await
const fetchPosts = async () => {
  try {
    const response = await fetch('/api/posts')
    if (response.ok) {
      const posts = await response.json()
      doSomething(posts)
    } else {
      throw new HTTPError(`Response: ${response.statusText}`)
    }
  } catch (e) {
    handleError(e)
  }
}
```

`catch` 체인에서 별도의 처리를 하지 않았다면 네트워크 에러 정도에만 에러가 잡힐 겁니다. 그러므로 우리가 `catch` 체인에서 에러를 받아 처리를 하고 싶다면 반드시 직접 `throw` 를 해야 합니다.

제가 `try/catch` 사용시 꺼림칙한 부분은 크게 두 가지가 있는데요.

1. `catch (e)` <- 저 `e` 의 타입을 보장할 수 없습니다. 일일이 속성값을 검사하던지 `instanceof` 등을 쓰던지 해서 타입 체크를 해야하죠. (그게 별로 번거롭지 않다면 상관 없습니다)
2. **과거의 나**, 혹은 협업을 하는 다른 개발자가 함수 호출 스택 어딘가에서 또 `try/catch` 를 걸었는데 에러 전파를 하지 않았다고 하면, 어디서 에러가 발생했는지 빠르고 쉽게 잡아내기 어려울 수 있습니다.

**어디까지나 try/catch를 아예 쓰지 말자는 이야기가 아니라 잘 써야한다는 이야기입니다.**

거기다 만약 권한이 없는 사용자가 토큰과 함께 요청을 했고 서버에서는 401 에러와 함께 `SOME_ROLE_REQUIRED` 같은 정확한 에러 메세지를 내려주었다면, `throw` 할 때 명확한 형태의 객체를 만들어서 던져 주어야 하고, 타입스크립트의 경우 `catch` 블락에서 해당 에러의 타입을 보장해주기 위한 타입 가드가 들어가느라 코드가 불필요하게 길어지기도 합니다. 결국 `HTTPError` 를 던지기보단 공통된 에러 처리가 가능한 객체로 내려주면 더 좋을 것 같습니다.

```typescript
interface HTTPResponse<T> {
  isError: boolean
  errorData?: {
    message: string
    statusCode: number
  }
  data?: T
}

// API 서버에서 ok에 해당하는 응답이 아닐 경우
// 응답값에 에러에 대한 정보를 보내주기로 했다고 가정합니다.
const fetchPosts: () => Promise<HTTPResponse<{ posts: any[] }>> = async () => {
  try {
    const response = await fetch('/api/posts')
    if (response.ok) {
      const posts = await response.json()
      return {
        isError: false,
        data: posts,
      }
    } else {
      const errorData = await response.json()
      return {
        isError: true,
        errorData: {
          message: errorData.message,
          statusCode: response.status,
        },
      }
    }
  } catch (e) {
    return {
      isError: true,
      errorData: {
        message: e.message, // 아니면 'Unknown Error' 같은 문자열을 쓸 수도
        statusCode: e.statusCode, // statusCode가 없을 수도 있겠죠
      },
    }
  }
}

// 받아 쓰는 쪽에서는
async function showPosts() {
  const fetchPostsResult = await fetchPosts()
  if (fetchPostsResult.isError) {
    // Handle Error
    handleError(fetchPostResult.errorData)
  } else {
    // Show posts
  }
}
```

이런 방식이라면 네트워크 에러 없이 API 서버에서 응답값이 내려온 경우는 상태 코드에 관계 없이 이미 정의해놓은 인터페이스에 맞는 객체가 리턴된다는 것을 보장할 수 있습니다.

조금 다른 형태로 Golang에서 에러를 처리하는 방식을 약간 차용해서 튜플에다 `[Error, Success]` 를 담아서 리턴하는 방법도 있습니다.

```typescript
type ErrorResp = {
  message: string
  statusCode: number
}
type FetchResponse<R> = [ErrorResp, null] | [null, R]

const fetchPosts: () => Promise<FetchResponse<{ posts: any[] }>> = async () => {
  // try/catch 블록은 생략
  const response = await fetch('/api/posts')
  if (response.ok) {
    const posts = await response.json()
    return [null, posts]
  } else {
    const errorData = await response.json()
    return [{ message: errorData.message, statusCode: response.status }, null]
  }
}

async function showPosts() {
  const [error, posts] = await fetchPosts()
  if (error) {
    handleError(error)
  } else {
    // Show posts
  }
}
```

쓰고 보니 '어떻게든 try/catch 좀 안써보겠다고 발악하는 것 같다' 고 자기반성을 하게 되지만, 근본적인 고민거리는 **에러 발생부터 핸들링까지 프로젝트 안에서 일관된 스타일을 유지하기 좋은 방법은 무엇일까?** 입니다.

다음 편에서는 일관된 처리 과정에 대해 고민했던 과정에 대해 더 이야기 해 보겠습니다.

## 참고 문헌

- [Error Handling | Joyent](https://www.joyent.com/node-js/production/design/errors)
- [JavaScript: Handling errors like Go - DEV Community 👩‍💻👨‍💻](https://dev.to/oieduardorabelo/javascript-handling-errors-like-go-3efk)
