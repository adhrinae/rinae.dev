---
title: "에러 처리를 어떻게 하면 좋을까? - 3"
pubDatetime: 2020-04-04
slug: "how-to-handle-errors-3"
tags:
  - Programming
  - TypeScript
  - React
  - MobX
description: "React + Hooks + MST(mobx-state-tree) 사용 시 데이터와 UI 결합 에 대한 고민 및 아이디어"
---

[(OpenGraph 커버 이미지 출처 - Unsplash @franckinjapan)](https://unsplash.com/photos/Xlx80tr5bEE)  
**2020/04/11 추가:** Codesandbox 임베딩이 접속에 문제를 일으키는 것 같아 직접 링크로 대체했습니다.

**부제: React + Hooks + MST(mobx-state-tree) 사용 시 데이터와 UI 결합 에 대한 고민 및 아이디어**

원래 부제대로 전혀 상관 없어보이는 주제로 조사하고 나름의 답을 내어 글을 작성했으나, 작년에 작성했던 에러 처리에 관한 글과 연관이 있다 생각하여 "기회가 된다면 실제 리액트 애플리케이션에서 에러를 처리하는 사례를 올려보겠다" 라고 언급한 대로 이 글의 제목을 정했습니다.

**주의: 이 글은 개인 연구 기록이므로, 독자가 `리액트 + 타입스크립트 + MobX + mobx-state-tree` 에 기본 이해를 가지고 있다고 가정하고 작성되어있습니다. 그래도 특별히 어려운 부분이 있다고 느껴지신다면 댓글을 남겨주세요.**

---

최근 개발을 해 오면서 어려움을 느끼고 있는 것 중에 하나가 "데이터와 UI 의 결합을 어찌 매끄럽게 코드로 표현하는가" 입니다.

예전에는 Redux(리덕스)의 개발 방법론을 차용한다 했을 때 Container / Presentational 컴포넌트를 의도적으로 분리를 해서 개발을 해 왔지만, Hooks API(이하 훅)가 도입되고 나서 재사용 가능한 상태 주입 정도는 아주 쉽게 커스텀 훅으로 만들고 적용할 수 있게 되었습니다. 하지만 이렇게 커스텀 훅을 만들고 그 상태를 사용하고자 하는 컴포넌트에서 호출했을 경우, `props` 로 내려받아야 할 값들이 컴포넌트 내부에 `useSomething` 같이 훅으로 선언되도록 컴포넌트의 구조가 변경되면서 훅과 컴포넌트의 결합이 생겨버리고 말았습니다. 이로 인해 느꼈던 문제들은 아래와 같습니다.

- 비지니스 로직(혹은 UI 상태)과 UI 자체를 분리하여 테스트하기 어렵다.
  - `props` 만 받아서 구현되는 컴포넌트는 `props` 를 받은대로 UI가 잘 구현되는지만 테스트하면 되기 때문에 테스트 및 모킹 코드를 작성하기 상대적으로 쉽다.
  - 그렇지 않다면 비지니스 로직과 컴포넌트가 항상 결합된 상태로 통합 테스트를 할 수밖에 없는데, 이럴 경우 모든 밑준비(모킹)을 하는데 많은 공수가 들어갈 수 있다.
- 스토리북으로 만들기 어렵다. (특히 커스텀 훅 안에 API 요청 등을 하거나 혹은 MobX 스토어를 품고 있는 경우)

위의 문제 중 "비지니스 로직과 UI 분리가 어렵다" 는 부분이 결국 제일 중요한 포인트라고 봅니다. 설계에 대해 고민하고 학습하면서 **계층과 역할을 효율적으로 분리하는 것이 테스트하기 쉽고, 지속 기능한 개발을 할 수 있는 애플리케이션을 만드는 방법** 이라는 멘탈 모델이 형성되었는데, 컴포넌트를 만들면서 훅을 호출하고, 그 훅을 여러개 호출하면서 믹스인하는 것이 제가 생각하는 "계층과 역할이 잘 분리된 설계" 에서 벗어나고 있다는 느낌이 들고 있기 때문입니다.

그래서 요즘 테스팅에 대해 많이 나오고 있는 이야기가 결국 ["가능하면 통합 테스트를 많이 작성하라"](https://rinae.dev/posts/write-mostly-integration-test-kr) 라는 것이 되는게 아닐까요. 저는 언제부터인가 실무를 하면서 통합 테스트를 작성하는 단계를 그냥 생략하고 전체가 통합된 Cypress 로만 테스트를 작성하게 되었습니다. 상대적으로 다른 테스트 방법론에 비해 느리다는 단점이 있고 CI 에서 돌아가게 설정하는데 많은 불편함이 있다는데 비해 현실적으로 얻을 수 있는 이득은 괜찮은 수준이었습니다.

위의 고민을 조금 더 말끔하게 잡아보고자 [풍부한 경험을 가지고 있는 다른 개발자분께](https://twitter.com/ahastudio) 제 고민에 대한 생각을 여쭈어 보았습니다. 아래 인용은 개인 기록을 위한 대화 중 발췌인지라 대강 맥락만 읽어보시면 됩니다.

> 이 경우는 container와 presentational 컴포넌트 구분이 중요한 것 같아요. 저는 후자 비중이 높은 게 도움이 될 것 같습니다. 그리고 저는 컴포넌트 쪽은 별로 중요하게 안 다루는데, React, Redux에 버그가 있는 게 아니면 잘 되겠지 하고 신뢰하는 편이에요. 비즈니스 로직만 잘 잘라내서 어디서든 잘 쓰게 하자는 걸 추구해요.
>
> 사용자 입장에선 AT(Acceptance Test)가 매우 중요하고(사실상 제일이죠), UT(Unit Test)와 동시에 둘 다 적절히 잡아야 한다고 생각합니다.

테스팅은 지금처럼 Cypress 위주의 테스트 커버리지를 꾸준히 올려본다 치고, 비지니스 로직을 어떻게 잘 발라내고 분리할 수 있을까요? 저 혼자 대략적인 방향성은 정했지만 제일 큰 문제가 '에러를 처리하는 방법' 이었습니다. 혼자 꾸역꾸역 코드를 작성해 온 시간이 길었다 보니, 에러 처리를 우아하게 할 수 있는 방법에 대한 명확한 해결책을 찾지 못한 채 작성하는 코드 양은 늘어만 갔습니다. 이전에 그 고민을 글로 작성해보기도 했지만, 깔끔히 해결 된 것도 아닌지라 분명 더 나은 방법이 있으리라 생각만 하고 있었습니다.

안 쓴지 오래되었지만, 만약에 `redux(리덕스)` + `redux-saga(리덕스 사가)` 를 사용하고 있다면 사가 쪽에서 에러 상태애 대한 사이드 이펙트를 실행하면 될 겁니다. 예를 들어 에러 발생 후 얼럿을 띄운다거나, 라우트를 변경한다던가 하는 부가 동작들을 처리하는 위치를 보이기 쉽게 만들 수 있겠죠.

저는 `mobx-state-tree` 를 사용하면서, 상태 컨테이너에는 최대한 API 서버에서 내려온 데이터와 그 데이터를 다루는 방법(비동기 통신, 변형, 메모이제이션 등)만 다루도록 구성하고 싶었습니다. 그래야 UI(여기서는 리액트)와 비지니스 로직을 분리하여 관리하기 쉬우리라 생각했기 때문입니다. 이렇게 설계한 애플리케이션에서 만약 데이터 요청 중 에러가 나게 된다면, 그 에러를 받아서 처리하는 쪽은 UI가 되어야 한다고 여겼습니다. 따라서 요청 결과 혹은 에러를 어떤 식으로 리턴해주어야 하는가 고민하며 [Golang 의 에러 핸들링 방식을 차용해볼까 하는 생각까지 했었지요.](https://rinae.dev/posts/how-to-handle-errors-1) 알고보니 이 방식은 그다지 추천되는 방식이 아니어서 배제하기로 했습니다.

결국 애플리케이션 내부에서 "'에러가 났다' 라는 것을 누가 알리고, 상황을 컨트롤할 것이냐" 의 문제로 귀결됩니다. 상황을 종합해 보았을 때 상태 컨테이너에서 에러가 발생했을 때 두 가지 중 하나의 방식을 선택해야했습니다.

1. _**에러를 던지고, UI 에서 이를 받아 적절히 처리한다:**_ 지금 설계에서 일관된 처리 방식을 제공해주기 어렵거나 복잡해보였습니다. 각각의 비동기 요청마다 비슷한 코드가 작성되어야 하는 문제가 발생할 수 있죠.
2. _**상태 컨테이너가 에러 상태를 드러내기만 한다:**_ 이럴 경우 일일이 에러를 리턴받을 수 있는 함수에서 바로바로 에러를 처리하는 것이 아니라, 컴포넌트가 에러 상태를 관찰하고 그에 맞게 반응하도록만 구성하면 됩니다.

먼저 1번의 예를 간단히 구현해본다면

```tsx
export default function App() {
  const store = React.useMemo(() => AppStore.create(), []);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const initialize = async () => {
      const [, err] = await store.fetchTodos();
      if (err) {
        setError(err);
      }
    };
    initialize();
  }, [store]);

  return useObserver(() =>
    error.length > 0 ? (
      <h1>{error}</h1>
    ) : (
      <main className="main">
        <h1>Todo List</h1>
        <ul>
          {store.todoItems.map(todo => (
            <li
              className={todo.isDone ? "done" : ""}
              key={todo.id}
              onClick={todo.toggleDone}
            >
              {todo.title}
            </li>
          ))}
        </ul>
      </main>
    )
  );
}
```

[컴포넌트에서 에러 상태를 관리하는 예](https://codesandbox.io/s/handling-error-1-btt2h)

에러를 컴포넌트에게 전달하는 다양한 방법이 있겠지만, 일단 [이전에 작성했었던 글](https://rinae.dev/posts/how-to-handle-errors-1) 대로 `[Success, Failure]` 튜플 형태로 API 요청 결과를 리턴하도록 만들고 그에 따라 에러를 표시했습니다. (위에서 Golang 스타일이 별로라고 언급했던 것은 가볍게 넘어가줍니다.)

이렇게 비동기 액션 쪽에서 성공 혹은 에러를 리턴해주고, 받은 값에 따라 컴포넌트 쪽에서 메세지 출력 혹은 라우팅 변경 등의 별도 작업을 하는 방식으로 접근해볼 수 있습니다. 상태 스토어 쪽에서는 "나는 에러 데이터는 관리하지 않을거야, 받는 쪽에서 알아서 해" 같은 방식으로 소통이 이루어집니다.

2번 방식으로 접근한다면

```tsx
// 스토어
enum FetchingStatus {
  IDLE = "idle",
  PENDING = "pending",
  LOADING = "loading",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

const AppStore = types
  .model("AppStore", {
    todoItems: types.array(TodoItem),
    fetchingStatus: types.optional(
      types.enumeration<FetchingStatus>(Object.values(FetchingStatus)),
      FetchingStatus.IDLE
    ),
    fetchingError: types.optional(
      types.model({
        statusCode: 400,
        message: "",
      }),
      {}
    ),
  })
  .actions(self => {
    function resetFetchingStatus() {
      if (self.fetchingStatus !== FetchingStatus.IDLE) {
        self.fetchingStatus = FetchingStatus.IDLE;
        self.fetchingError = { statusCode: 400, message: "" };
      }
    }

    const fetchTodos = flow(function* () {
      try {
        resetFetchingStatus();
        self.fetchingStatus = FetchingStatus.LOADING;

        const result: TodoItemSnapshotIn[] = yield getTodos();
        self.todoItems.push(...result);

        self.fetchingStatus = FetchingStatus.RESOLVED;
      } catch (e) {
        self.fetchingStatus = FetchingStatus.REJECTED;
        self.fetchingError = {
          statusCode: 500,
          message: e.message,
        };
      }
    });

    return {
      fetchTodos,
    };
  });

// ...
// ...

// 컴포넌트
export default function App() {
  const store = React.useMemo(() => AppStore.create(), []);

  React.useEffect(() => {
    store.fetchTodos();
  }, [store]);

  return useObserver(() => {
    if (store.fetchingStatus === FetchingStatus.LOADING) {
      return <h1>Loading Todo List...</h1>;
    }

    if (store.fetchingStatus === FetchingStatus.REJECTED) {
      return (
        <div>
          <h1>There was a problem while loading your todo list.</h1>
          <pre>{store.fetchingError.message}</pre>
          <button onClick={store.fetchTodos}>Fetch again</button>
        </div>
      );
    }

    return (
      <main className="main">
        <h1>Todo List</h1>
        <ul>
          {store.todoItems.map(todo => (
            <li
              className={todo.isDone ? "done" : ""}
              key={todo.id}
              onClick={todo.toggleDone}
            >
              {todo.title}
            </li>
          ))}
        </ul>
      </main>
    );
  });
}
```

[상태 컨테이너에서 에러 상태를 관리하는 예](https://codesandbox.io/s/handling-error-2-bekqo?file=/src/App.tsx)

컴포넌트가 어차피 `AppStore` 를 가져와 스토어 안의 값을 쓰고 있으니, 여기서 비동기 액션들의 로딩, 에러 상태도 함께 관리하도록 만들었습니다. 데이터를 불러오는 과정의 시작부터 끝까지 필요한 상태를 상태 스토어가 관리할 필요가 있다고 상정한 뒤 나온 결과물이죠.
여기까지 의식의 흐름을 이어가고 나니, 이전에 회사 동료분이 만들어놓은 조합용 스토어가 있다는 사실을 떠올랐습니다. `LoadingStore` 라고 하는데, 아래와 같이 구현되어 있습니다.

```ts
// LoadingStore.ts
import { Instance, types } from "mobx-state-tree";

export const LoadingStore = types
  .model("LoadingStore", {
    pendingRequests: types.map(types.number),
  })
  .views(self => {
    function getNum(key: string): number {
      return self.pendingRequests.get(key) || 0;
    }
    function isLoading(...keys: string[]): boolean {
      return keys.some(key => getNum(key) > 0);
    }
    return {
      getNum,
      isLoading,
    };
  })
  .actions(self => {
    function defaultValue(key: string) {
      if (self.pendingRequests.get(key) === undefined) {
        self.pendingRequests.set(key, 0);
      }
      return self.pendingRequests.get(key);
    }
    function incLoading(key: string) {
      self.pendingRequests.set(key, defaultValue(key) + 1);
    }
    function descLoading(key: string) {
      self.pendingRequests.set(key, defaultValue(key) - 1);
    }
    return {
      incLoading,
      descLoading,
    };
  });
```

위 스토어처럼 로딩이 일어날 때 `pendingRequests` 맵에다 `액션 이름(key) -> 액션 요청 횟수(number)` 형식의 `key -> value` 를 지정해주듯이 `액션 이름(key) -> 액션의 현재 진행 상태(loading, done, error 등)` 으로 데이터 불러오기 상태를 활용할 수 있겠다는 아이디어가 떠올랐습니다.

```ts
// FetchingStore.ts

import { types, Instance } from "mobx-state-tree";

export enum FetchingStatus {
  IDLE = "idle",
  PENDING = "pending",
  LOADING = "loading",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

const FetchingModel = types.model("FetchingModel", {
  actionName: types.identifier,
  status: types.optional(
    types.enumeration<FetchingStatus>(Object.values(FetchingStatus)),
    FetchingStatus.IDLE
  ),
  error: types.optional(
    types.model({
      message: "",
    }),
    {}
  ),
});
interface IFetchingModel extends Instance<typeof FetchingModel> {}

export const FetchingStore = types
  .model("FetchingStore", {
    statusMap: types.map(FetchingModel),
  })
  .views(self => {
    function getActionStatus(actionName: string): IFetchingModel {
      const actionStatus = self.statusMap.get(actionName);
      if (!actionStatus) {
        throw new Error(
          `Could not find action status from actionName: ${actionName}`
        );
      }
      return actionStatus;
    }

    return {
      getActionStatus,
      isLoading(actionName: string) {
        return getActionStatus(actionName).status === FetchingStatus.LOADING;
      },
      hasError(actionName: string) {
        return getActionStatus(actionName).status === FetchingStatus.REJECTED;
      },
      getError(actionName: string) {
        return getActionStatus(actionName).error;
      },
    };
  })
  .actions(self => ({
    initStatus(actionName: string) {
      self.statusMap.put({
        actionName,
      });
    },
    getStatus(actionName: string) {
      return self.getActionStatus(actionName).status;
    },
    setStatus(
      actionName: string,
      status: FetchingStatus,
      error?: { message: string }
    ) {
      const actionStatus = self.getActionStatus(actionName);
      actionStatus.status = status;
      if (error && status === FetchingStatus.REJECTED) {
        actionStatus.error = error;
      }
    },
    resetStatus(actionName: string) {
      const actionStatus = self.getActionStatus(actionName);
      actionStatus.status = FetchingStatus.IDLE;
      actionStatus.error = { message: "" };
    },
  }));

interface IFetchingStore extends Instance<typeof FetchingStore> {}

// MST 의 flow 함수 타입 정의를 그대로 가져옴.
type FlowFunction<R, Args extends any[]> = (
  ...args: Args
) => Generator<any, R | undefined, any>;
export function getFlowWrapper(self: IFetchingStore) {
  return function flowWrapper<R, Args extends any[]>(
    actionName: string,
    f: FlowFunction<R, Args>
  ): FlowFunction<R, Args> {
    self.initStatus(actionName);

    function* wrappedFlow(...args: Args) {
      if (self.isLoading(actionName)) {
        return;
      }
      if (self.getStatus(actionName) !== FetchingStatus.IDLE) {
        self.resetStatus(actionName);
      }
      try {
        self.setStatus(actionName, FetchingStatus.LOADING);
        const returnValue: R | undefined = yield* f(...args);
        self.setStatus(actionName, FetchingStatus.RESOLVED);
        return returnValue;
      } catch (e) {
        self.setStatus(actionName, FetchingStatus.REJECTED, {
          message: e.message,
        });
      }
    }

    Object.defineProperty(wrappedFlow, "name", {
      value: `wrapped-${actionName}`,
      configurable: true,
    });

    return wrappedFlow;
  };
}
```

[다른 상태 컨테이너와 결한 가능한 FetchingStore 를 구현하고 활용한 예](https://codesandbox.io/s/handling-error-3-u0n9m)

대체적으로 머리를 싸매던 문제는 해결되었지만, 아직 명료하지 않은 문제가 남아 있는데, 바로 경합 조건에 대한 문제입니다. 만약 제가 어떤 페이지에 진입하여 3가지 요청을 동시에 했는데 백엔드 서버에 이상이 생겨서 3가지 요청 모두 에러가 발생했거나, 혹은 인증 토큰에 문제가 생겨서 요청 중 2개가 에러가 났을 경우, 이 때 UI는 어떤 식으로 처리되는게 가장 사용자에게 안정적인 형태로 보여질까요?

직관적으로 제일 먼저 들어온 에러를 받아 처리해주고 나머지 요청은 성공은 하되 따로 처리하지 않는 방식으로 만들어봐야겠다고 생각했습니다. 이럴 때 또 처리가 명확하게 느껴지지 않는 케이스는 "동시에 요청한 것 중 어떤 요청은 실패 시 강제 로그아웃을 해야하지만, 어떤 요청은 강제 로그아웃을 해도 되지 않는 경우" 입니다. 이 경우는 현재 개발하고 있는 애플리케이션에서는 발생할 일이 아주 드물 것이라 여겨져서 더 이상 생각하는 것을 그만두었습니다.

또한 `FetchingStore` 의 전신인 `LoadingStore` 부터 시작된 문제이지만, 어떤 액션의 상태를 담아두고 체크하기 위한 key 는 문자열로만 이루어져 있으며, 이 문자열에 대한 타입을 보장하는 것이 깔끔하지 못합니다. 이는 MST의 '런타임 모델 타입 정의를 먼저 선언하는 개념' 때문에 겪는 문제입니다.

타입스크립트의 도움을 받아 예제 코드와 같은 방식으로 액션의 처리 상태를 관리하고 싶다면, 사용할 액션들의 이름을 스토어 파일 안에서 `enum` 으로 선언해두고 그것만 쓰도록 강제하는 규약을 설정하는 것도 괜찮다고 봅니다. 아래의 예는 이런 고민거리를 정리하여 두개의 스토어에서 데이터를 다루고, 로딩 및 에러 상태를 컨트롤하는 법을 나름 설정해본 규약에 따라 정리해본 것입니다.

[위의 구현들을 적절히 활용하는 예](https://codesandbox.io/s/handling-error-4-nmusj)

컴포넌트나 개별 스토어에서 직접 에러를 다루고 싶다면 `FetchingStore` 하단의 `getFlowWrapper` 함수에 있는 `catch` 블록에서 에러를 그대로 받아 `throw` 시켜주면 됩니다.

---

이번 글을 통해 아주 간단한 예를 가지고, API 서버에서 정보를 가져오고 그 사이에 발생할 수 있는 상태 변화 및 에러 처리에 대해 간단한 아이디어 정리를 해 보았습니다. 이미 더 뛰어난 분들은 비슷하거나 더 나은 방법을 적용하고 계실테지만, 저는 여기까지 경험하고 이해하는데 너무 오랜 시간이 걸렸네요. 여기서 `FetchingStore` 를 조금 더 발전시켜나간다면 HTTP 요청을 보내던 도중 컴포넌트가 마운트가 해제되는 등의 변화가 생겼을 때 요청을 자동으로 취소하는 로직을 심어볼 수도 있겠습니다.

다른 분들은 어떤 방식으로 요청 시작부터 성공/에러까지의 상태를 관리하고 계신지 궁금하네요. 좋은 아이디어가 있으시다면 트위터나 댓글로 알려주세요.

## 참고 자료

- [Kent C. Dodds - Stop using isLoading booleans](https://kentcdodds.com/blog/stop-using-isloading-booleans/)
- [한재엽님의 리액트 연재 글 중 - 자체 redux-saga Util 에 관한 내용](https://jbee.io/react/react-2-redux-architecture/#%EC%9E%90%EC%B2%B4-util-%EC%A0%9C%EC%9E%91---redux-saga-util)
- [XState - '유한 상태 기계' 형태의 상태 관리 라이브러리](https://xstate.js.org/)
