---
title: "'When to useMemo and useCallback' 를 읽고"
postSlug: "review-when-to-usememo-and-usecallback"
description: "Kent C. Dodds의 'When to useMemo and useCallback' 을 읽고 복습한 개념 정리"
pubDatetime: 2019-06-09
tags:
  - React
  - Programming
---

- 개인용 노트에 적었던 내용을 그대로 옮겨 온 것이라 높임말을 사용하지 않았습니다.
- 댓글로 추가 의견이나 잘못된 내용 지적해주시면 저를 비롯해 이 글을 읽는 다른 분들에게 도움이 됩니다. 🙇🏻‍♂️

---

이전에도 좋은 내용을 많이 올리고 있었지만, Kent C. Dodds가 전업 교육자 선언을 한 이후 더 좋은 리액트 기본에 대한 글이 많이 올라오고 있다. 특히 Hook에 관해서.

이번에 [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)이라는 글을 올려 주었는데, 나도 실무에서 Hook을 점진적으로 적용하면서 두 훅을 쓸 때 공식 문서를 좀 보고 가볍게 원리를 파악해놓고 쭉 쓰고 있었다. 그래서 심층적인 이해를 한 상태로 ‘어느 타이밍에 사용하는 것이 옳은가?’ 라는 생각을 깊게 해 보지 않았다.

따라서 글을 읽고 요약을 하면서 어느 타이밍에 `useMemo`, `useCallback` 을 사용하고, 궁극적으로 이 글이 짚고자 하는 핵심에 대해 복습하고자 한다. 그냥 번역문이 아니라 본문을 읽으면서 요약하며 내 나름의 생각과 느낀 점을 같이 정리해보았다.

## 더 많은 함수 호출, 더 많은 코드는 결국 더 많은 비용을 초래한다

먼저 처음 제시된 예시 코드를 보자

```jsx
function CandyDispenser() {
  const initialCandies = ["snickers", "skittles", "twix", "milky way"];
  const [candies, setCandies] = React.useState(initialCandies);
  const dispense = candy => {
    setCandies(allCandies => allCandies.filter(c => c !== candy));
  };
  return (
    <div>
      <h1>Candy Dispenser</h1>
      <div>
        <div>Available Candy</div>
        {candies.length === 0 ? (
          <button onClick={() => setCandies(initialCandies)}>refill</button>
        ) : (
          <ul>
            {candies.map(candy => (
              <li key={candy}>
                <button onClick={() => dispense(candy)}>grab</button> {candy}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

만약 `dispense` 함수를 `useCallback` 으로 감싸게 된다면 퍼포먼스가 더 나아졌을까? 실제로는 그렇지 않다. `useCallback` 이 퍼포먼스를 개선하고 "인라인 함수는 퍼포먼스에 악영향을 줄 수 있다" 라는 말을 많이 들어봤는데 어떻게 실제로는 더 안좋을 수가 있을까?

여기서 중요한 점 하나를 짚고 가야한다. **실행되는 모든 코드는 각각 한 줄마다 비용이 든다는 것이다.** 실제로 퍼포먼스 개선이 없는 부분에서 `useCallback` 호출, 의존성 배열(`[]`) 을 선언해 주면서 리소스를 더 잡아먹게 되었다. 게다가 함수 자체를 메모이제이션 해 두기 위해 추가로 메모리를 잡아먹게 된다.

한가지 의아한 점은 본문에서는 '두 번째 랜더링 시점에서 그냥 `dispense` 함수는 가비지 컬렉션 된 다음(할당 된 메모리가 비워진 다음) 새로 생성되고, `useCallback` 으로 감싸진 함수는 가비지 컬렉션이 되지 않은 상태에서 새로운 함수가 생성된다고 이야기한다. 보통은 불필요한 재생성을 막기 위해서 `useCallback` 을 쓰는거 아니었나? -> 예제를 직접 쳐보고 코드를 다시 들여다보니 지금 상황에선 `useCallback` 으로 인한 성능 개선이 없어지는게 맞다. 왜냐면 `onClick` 에다 인라인 함수를 넘기고 있기 때문에 매 랜더링 마다 새로운 함수가 prop으로 전달되고, 버튼 컴포넌트는 다시 랜더링이 일어나기 때문이다. 딱히 이 상황에서 더 낫게 개선할 방법도 없다.

## 그렇다면 `useMemo` 는?

실제로 `useCallback(fn, deps)` 는 `useMemo(() => fn, deps)` 와 같다. `useMemo` 는 어느 값이나 메모이제이션을 적용할 수 있다는 특징이 있는데, `deps` 안에 있는 값이 변화했을 때 새로이 값을 연산하여 리턴한다. 위 예제 코드에서 `initialCandies` 가 매번 새로이 생성되는 것을 막고자 `useMemo` 로 감쌀 수 있지만, 실제로 저 값이 한번 선언되고 바뀌지 않을 것이라고 한다면 함수 스코프 안에 선언할 필요가 전혀 없다.

```jsx
const initialCandies = ['snickers', 'skittles', 'twix', 'milky way']
function CandyDispenser() {
  const [candies, setCandies] = React.useState(initialCandies)
  // ...
```

이렇게만 해주면 된다. `useMemo` 를 호출하고, 그 안에 들어갈 함수를 만들어 넘기고, 체크할 의존성으로 빈 배열을 생성하는 행위 모두 초과 비용을 발생시킨다. 결국 코드 최적화 한다고 들인 공에 비해 얻을 수 있는 이득은 미미하며, 이런 고민 할 시간에 제품 자체를 더 좋게 만드는게 **훨씬** 이득이다.

## 먼저 요점을 짚어보자

**퍼포먼스 최적화는 절대 공짜가 아니다. 컴퓨팅 자원이나, 개발자의 자원 등 반드시 어디선가 소모되는 자원이 있으며 언제나 들인 자원에 비해 이득이 되진 않는다.**  
따라서 책임감있게 최적화를 해야 한다.

## 그렇다면 `useMemo` 와 `useCallback` 은 언제 써야할까?

1. 레퍼런스(메모리 값)이 동일한지 비교 - Referential equality
2. 컴퓨터를 활용하는 비싼 연산(ex. 피보나치 수열, 소수 구하기 등)

자바스크립트의 기초를 알고 있다면 `===` 이라는 연산자가 엄격한 비교이며, Primitive 타입은 같은 값이라면 동일하지만 다른 타입의 객체라면 레퍼런스 비교를 한다는 것을 알고 있을 것이다([ECMAScript 명세 참고](http://www.ecma-international.org/ecma-262/5.1/#sec-9.12)). 리액트에서도 리랜더링을 위해 prop이 갱신되었는지 비교할 때 `Object.is` 를 활용한 레퍼런스 비교를 한다.

그리고 레퍼런스 비교는 `useEffect` 의 두번째 인자로 넣어주는 의존성 배열에 들어간 값에도 사용된다. 랜더링이 새로 일어날 때마다 의존성 배열 안에 있는 값을 비교한다. 다른 의존성 배열이 사용되는 Hook에도 동일하게 동작한다. -> `useEffect`, `useLayoutEffect`, `useCallback`, `useMemo`

레퍼런스 비교가 무엇인지 알고, 리액트 컴포넌트가 왜 다시 랜더링되는지를 안다면 어느 타이밍에 `useCallback` 을 써야하는지 명확해진다. 본문에 있던 `DualCounter` 예를 살펴보자.

```jsx
function DualCounter() {
  const [count1, setCount1] = React.useState(0);
  const increment1 = () => setCount1(c => c + 1);

  const [count2, setCount2] = React.useState(0);
  const increment2 = () => setCount2(c => c + 1);

  return (
    <>
      <CountButton count={count1} onClick={increment1} />
      <CountButton count={count2} onClick={increment2} />
    </>
  );
}
```

여기서 두 버튼 중 어떤 것을 누르더라도 두 개의 `CountButton` 은 다시 랜더링된다.

1. 상태 업데이트
2. `DualCounter` 내부의 변수 재생성 (`increment1`, `increment2`)
3. 각각의 `CountButton` 은 다른 버튼의 상태와 전혀 상관 없이 내려받는 함수들이 새로 생성되었기 때문에 다시 랜더링

이 "불필요한 리랜더링" 문제를 해결하려면 `CountButton` 과 `DualCounter` 두 컴포넌트 모두 최적화해야 한다.

```jsx
const CountButton = React.memo(function CountButton({ onClick, count }) {
  return <button onClick={onClick}>{count}</button>;
});

function DualCounter() {
  const [count1, setCount1] = React.useState(0);
  const increment1 = React.useCallback(() => setCount1(c => c + 1), []);

  const [count2, setCount2] = React.useState(0);
  const increment2 = React.useCallback(() => setCount2(c => c + 1), []);

  return (
    <>
      <CountButton count={count1} onClick={increment1} />
      <CountButton count={count2} onClick={increment2} />
    </>
  );
}
```

컴포넌트에 `React.memo` 를 활용하는 기법은 여러 군데에서 유용하게 쓰일 수 있다. 특히 차트, 애니메이션 등 prop이 빠른 단위로 자주 바뀌는데 진짜 랜더링이 다시 일어날 필요가 있을 때만 적용되도록 만들어야 하는 경우에 쓰인다.

하지만 글쓴이는 **대부분의 경우 불필요한 리랜더링을 최적화하는데 시간을 쓸 필요가 없다**라고 주장한다. 리액트는 충분히 빠르기 때문에 이런 최적화 말고도 신경쓸 것이 많다는 것이다. 실제로 이런 식의 최적화를 해야 하는 경우가 그리 자주 있지도 않다고 하고.

또한 `React.memo`, `React.PureComponent` 등의 활용을 할 때는 **반드시 먼저 퍼포먼스 측정을 해볼 것**을 강조하고 있다. "무작정 적용해놨다가 '왜 컴포넌트가 바뀌지 않지?' 하고 한참 삽질하고 나니 굳이 필요 없는 곳에 `React.memo` 를 적용하고 있었다더라" 같은 사례도 분명 있기 때문이다.

매우 비싼 컴퓨팅 연산의 예는 별로 고민할 필요도 없다. 용도를 파악하기 어렵지 않고, 실제로 프론트엔드 애플리케이션을 만들면서 쓰일 일이 그리 많지도 않을 것이기 때문이다.

## 궁극적으로 말하고자 하는 것

모든 추상화와 최적화는 나름의 비용을 치르게 되어 있다. 따라서 진짜로 필요할 떄까지 [AHA(Avoid Hasty Abstractions, 성급한 추상화를 피하는) Programming 원칙](https://kentcdodds.com/blog/aha-programming)을 따르라 권장하고 있다.

**성급한 최적화는 오히려 독이 될 수 있다.** 그런데 내가 성급한 최적화를 하고 있는지 판단하는 중요한 척도가 있다. 바로 퍼포먼스를 측정하는 것이다. 정확한 측정 없이 ‘이 코드가 퍼포먼스에 문제를 일으킬 수 있다’ 고 여겨서 성급한 최적화를 하게 되는 것이다.

또한 팀원 모두 Hook API 사용에 익숙지 않다면 `useCallback`, `useMemo` 등을 사용할 때 또 다른 관리 포인트가 생길 수 있다. 코드가 조금 더 읽기 어려워지고, 의존성 배열을 관리하는 방법을 몰라 엉뚱한 값을 집어넣어두는 실수를 저지를 수도 있다. [Hook을 사용할 때는 반드시 eslint 룰 적용을 권장한다.](https://www.npmjs.com/package/eslint-plugin-react-hooks)

따라서 핵심 비지니스 로직에 집중하여 애플리케이션을 만들되, 특정 컴포넌트가 퍼포먼스 문제를 일으킨다고 판단되면 **명확한 검증을 통해** 판단이 맞는지 확인한 후 최적화 과정을 거치도록 한다.

---

(6월 10일 추가) 페이스북으로 공유했던 글에 댓글로 [이서연님](https://github.com/iamssen)께서 좋은 의견을 남겨주셔서 동의를 얻고 첨부합니다.

> data visualization이나 data grid처럼 극단적인 수준의 rendering performance 처리가 필요하지 않은 이상은 현재 react를 비롯한 대다수의 기술들은 최적화가 사실 별로 필요없죠. 최적화라는게 ui에서는 보통 property invalidation 같은 rendering 지연 처리같은 부분에서 발생했었는데 시대가 흐르면서 아예 framework 자체에 녹아버려서 이젠 별 신경 안써도 되는 사항이 되어버린거라서요. (거꾸로 녹아버려서 최적화의 실체를 이해하기는 더 어려운 시대가 되었죠) 최적화라는걸 신경쓰고 싶다면 react 내부 소스를 까서 rendering이 어떤 sequence로 처리되고 있는지를 이해하는게 결론적으로는 더 나을겁니다. framework 바깥에서의 최적화는 더이상 큰 의미가 없긴 하죠.

> 추가로 이야기하자면 최적화 보다는 발적화를 방지하는게 실제적인 성능 향상에 더 도움이 된다고 보는 편입니다. 옛날에는 framework라는게 별로 없고 자동으로 처리되는게 별로 없어서 최적화라는 개념이 중요했다면, 현 시대는 너무 지나치게 발전한 개념들이 많아져서 기술의 오용에 의한 발적화가 오히려 문제가 된다고 보거든요. 그리고... 우리 세대랑 다르게 개발자 시작부터 해야할게 너무 많다보니 low level api 같은걸 너무 쉽게 건너 뛰는 경향도 많구요. 이건 "어떻게하면 더 나을것인가?" 라는 최적화 보다는 "이 기술을 제대로 사용하고 있는것인가?" 라는 발적화의 문제로 보이죠.
