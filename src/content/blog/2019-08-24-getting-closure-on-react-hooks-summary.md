---
title: "'Getting Closure on React Hooks' 정리"
slug: "getting-closure-on-react-hooks-summary"
pubDatetime: 2019-08-24
tags:
  - React
description: "JSConf.Asia 2019에서 발표된 React Hooks를 직접 구현해보는 세션 정리"
---

- [JSConf.Asia 2019](https://2019.jsconf.asia) 에서 [Shwan Wang](https://twitter.com/swyx)이 발표한 세션 정리
- 원본 영상은 React Hooks의 기본 개념이 있는 사용자를 대상으로 직접 Hook을 구현하면서 동작하는 방식(발표자는 멘탈 모델이라고 표현)을 직관적으로 이해하기 위해 작성되었다.

---

- [들어가며](#%eb%93%a4%ec%96%b4%ea%b0%80%eb%a9%b0)
- [Hooks 바닥부터 작성해 보기](#hooks-%eb%b0%94%eb%8b%a5%eb%b6%80%ed%84%b0-%ec%9e%91%ec%84%b1%ed%95%b4-%eb%b3%b4%ea%b8%b0)
  - [클로저 활용](#%ed%81%b4%eb%a1%9c%ec%a0%80-%ed%99%9c%ec%9a%a9)
  - [useState 만들기](#usestate-%eb%a7%8c%eb%93%a4%ea%b8%b0)
  - [컴포넌트에 붙여보기](#%ec%bb%b4%ed%8f%ac%eb%84%8c%ed%8a%b8%ec%97%90-%eb%b6%99%ec%97%ac%eb%b3%b4%ea%b8%b0)
  - [여러 개의 훅을 사용하기](#%ec%97%ac%eb%9f%ac-%ea%b0%9c%ec%9d%98-%ed%9b%85%ec%9d%84-%ec%82%ac%ec%9a%a9%ed%95%98%ea%b8%b0)
  - [useEffect 구현하기](#useeffect-%ea%b5%ac%ed%98%84%ed%95%98%ea%b8%b0)
- [마치며](#%eb%a7%88%ec%b9%98%eb%a9%b0)

---

## 들어가며

다양한 명화를 소개하면서 시작. [이미지의 배반](https://ko.wikipedia.org/wiki/이미지의_배반) 그림을 보여주면서 우리가 가지고 있는 관념과 그 안에 내재된 의미를 파헤쳐보자는 식으로 발표를 풀어나가기 시작한 것 같다.

React Hook(이하 훅) 에 대한 간단한 소개(리액트 문서를 보라고 했다), 그리고 어떤 문제를 해결하기 위해 나타났는지, 해결하고자 하는 문제 중 클래스 컴포넌트도 있다고 하면서 간단하게 넘어간다.

그리고 본 발표의 메인 주제 중 하나인 클로저(Closures)를 간단히 되짚어보았다. 클로저를 이해하고 있지 못하다면 다양한 설명 글이 있지만, ['속 깊은 자바스크립트' 책의 설명](https://unikys.tistory.com/309)을 추천하고 싶다. [이 글](https://meetup.toast.com/posts/86)도 괜찮다.

> _"[Closure] makes it possible for a function to have "private" variables"_ - W3Schools

이 구절이 W3Schools가 유일하게 유익한 부분이었다고 한다. 왜 그런지는 [W3Schools의 악명](https://qr.ae/TWr0iO)에 대해 들어본 사람이라면 알 것이다. 혹시 몰랐다면 지금이라도 필요한 검색 결과를 W3Schools에서 보기보다 [MDN](https://developer.mozilla.org/ko/)에서 살펴보기를 권한다.

## Hooks 바닥부터 작성해 보기

### 클로저 활용

클로저를 활용하여 훅을 바닥부터 작성해보는 시간을 가져본다. 먼저 클로저를 활용한 간단한 `add` 함수를 만들어 보는 것 부터.

```js
function getAdd() {
  let foo = 1;
  return function () {
    foo += 1;
    return foo;
  };
}

const add = getAdd();
console.log(add()); // 2
console.log(add()); // 3
console.log(add()); // 4
console.log(add()); // 5
```

### useState 만들기

이 원리를 이용해 `useState` 라는 함수를 만들어본다.

```js
function useState(initVal) {
  let _val = initVal;
  const state = _val;
  const setState = newVal => {
    _val = newVal;
  };
  return [state, setState];
}

const [count, setCount] = useState(1);
console.log(count); // 1
setCount(2);
console.log(count); // 1 (?)
```

하지만 아직 count의 값 변화는 우리가 리액트를 쓸 때처럼 즉각적으로 바뀌지 않는다. `count` 는 한번 가져오고 끝난 값이기 때문이다. 만약에 `const state = _val` 부분을 함수 형태로 바꾸어 주고, 값을 쓰는게 아니라 호출해주는 식으로 바꾼다면 호출할 때마다 값을 가져오기 때문에 `setCount` 가 반영된 값을 가져올 수 있다.

```js
// useState 안에서
// ...
const state = () => _val;
// ...

const [count, setCount] = useState(1);
console.log(count()); // 1
setCount(2);
console.log(count()); // 2
```

### 컴포넌트에 붙여보기

이런 원리를 사용해서 미니 리액트를 만들어보자. 모듈 패턴을 이용하여 `React` 라는 네임스페이스에 아까 만들어놨던 `useState` 를 집어넣고 사용해보기로 한다. 그리고 DOM을 사용하는 것은 아니지만 가상의 컴포넌트를 만들어 `useState` 훅을 가져다 쓰는 시나리오를 만들어본다.

가상의 컴포넌트를 랜더링하는 행위는 `render` 라는 함수로 대체하기로 한다.

```js
const React = (function () {
  function useState(initVal) {
    let _val = initVal;
    const state = _val;
    const setState = newVal => {
      _val = newVal;
    };
    return [state, setState];
  }

  function render(Component) {
    const C = Component();
    C.render();
    return C;
  }

  return { useState, render };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  return {
    render: () => console.log(count),
    click: () => setCount(count + 1),
  };
}

// 아직까진 중간 과정이므로 제대로 동작하지 않는다.
var App = React.render(Component);
App.click();
var App = React.render(Component);
```

여기서 `count` 가 제대로 동작하게 만들기 위해 `_val` 로 쓰고 있던 변수를 `React` 내부로 끌어올려본다. 그러면 랜더링 이후 클릭을 해도 잘 동작한다.

```js
const React = (function () {
  let _val;
  function useState(initVal) {
    const state = _val || initVal;
    // ...
  }
  // ...
})();

var App = React.render(Component); // 1
App.click();
var App = React.render(Component); // 2
App.click();
var App = React.render(Component); // 3
App.click();
var App = React.render(Component); // 4
```

### 여러 개의 훅을 사용하기

하지만 실제 훅을 사용하게 된다면 한 컴포넌트 안에서 여러 상태를 관리하기 위해 여러 훅을 만들어 쓰는 경우가 많다. 그런데 `_val` 하나에 의존하는 지금 상태에서 컴포넌트 안에 `useState` 를 두번 호출하게 된다면?

```js
function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState("apple");
  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: word => setText(word),
  };
}

var App = React.render(Component); // {count: 1, text: 'apple'}
App.click();
var App = React.render(Component); // {count: 2, text: 2}
App.type("banana");
var App = React.render(Component); // {count: 'banana', text: 'banana'}
```

보다시피 중간에 값이 덮어씌워지게 된다. 이 값을 좀 더 손쉽게 관리하려면 각 값 별로 배열에 담아 다루면 된다. 훅을 담아 둔 배열과 현재 어떤 훅이 어떤 인덱스를 바라보고 있는지 관리해주는 약간의 요령이 필요하다.

```js
const React = (function () {
  let hooks = [];
  let idx = 0;
  function useState(initVal) {
    const state = hooks[idx] || initVal;
    const _idx = idx; // 이 훅이 사용해야 하는 인덱스를 가둬둔다.
    const setState = newVal => {
      hooks[_idx] = newVal;
    };
    idx++; // 다음 훅은 다른 인덱스를 사용하도록 한다.
    return [state, setState];
  }

  function render(Component) {
    idx = 0; // 랜더링 시 훅의 인덱스를 초기화한다.
    const C = Component();
    C.render();
    return C;
  }

  return { useState, render };
})();
```

이런 원리로 훅을 관리하고 있다면 공식 문서에 있는 [훅의 규칙](https://ko.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level)이 왜 있는지 깨닫게 된다. 조건부로 훅이 호출되거나 루프 안에서 훅이 호출되어야 하는 경우 등이 있다면 인덱스의 순서를 보장할 수 없고, 상태의 관리도 보장할 수 없게 된다. 여담이지만 만약 조건부로 훅을 호출하는 방법을 고민중이라면, [이 글](https://inventingwithmonster.io/20190207-break-the-rules-of-react-hooks/)이 약간이나마 도움이 되리라 생각한다.

### useEffect 구현하기

`useState` 는 아주 기본적인 단위에 불과하다. 실제로 리액트에서 상태의 변화에 따라 사이드 이펙트(부가 효과)를 실행하기 위해서는 `useEffect` 가 필요하다.

```js
function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState("apple");

  // 랜더링 시 최초에 한 번만 실행된다.
  // 배열 안에 관찰하고자 하는 상태를 전달하면 그 상태에 반응하여 콜백이 실행된다.
  React.useEffect(() => {
    console.log("side effect");
  }, []);
  // ...
}
```

위에 선언해둔 `React` 모듈 안에 `useEffect` 함수를 정의한다. 두 번째 인자로 넣어둔 의존 값의 배열(dependency array)을 관찰하면서 값이 변했다면 콜백을 실행하고, 그렇지 않다면 실행하지 않게 만들면 된다.

```js
function useEffect(cb, depArray) {
  const oldDeps = hooks[idx]; // 이미 저장되어있던 의존 값 배열이 있는지 본다.
  let hasChanged = true;
  if (oldDeps) {
    // 의존 값 배열의 값 중에서 차이가 발생했는지 확인한다.
    // 실제로 리액트 구현체도 `Object.is` 로 값을 비교한다. 정확한 동작은 MDN 참고.
    hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
  }
  // 값이 바뀌었으니 콜백을 실행한다.
  if (hasChanged) {
    cb();
  }
  // useEffect도 훅의 일부분이다. hooks 배열에 넣어서 관리해준다.
  hooks[idx] = depArray;
  idx++;
}
```

완성된 `useEffect` 를 위의 `useState`, `render` 처럼 `React` 모듈 안에 넣어주고 사용하기만 하면 된다. 여기까지가 종합적인 구현부이다. 발표자는 따로 JSX 랜더링을 위한 `createElement` 등의 함수를 준비해 와서 DOM이 랜더링 되는 모습도 보여준다. 완성본은 [여기를 참고](https://codesandbox.io/s/izqhl)하면 된다. 하나의 미니 리액트를 만들어둔 셈이기 때문에 `utils.js` 부분을 주의 깊게 보는 것도 나름 도움이 된다. 추가로 DOM의 업데이트가 어떻게 반영되는지 설명하기 위해 가볍게 구현된 `workLoop` 함수도 있다.

## 마치며

JSX 부분을 제외하고 불과 수십 줄로(정확히는 29줄이라고 한다) 훅을 사용할 수 있는 리액트 구현체를 만들었다. 하지만 발표자는 여러 번에 걸쳐 'THIS IS **NOT** REACT' 라고 강조한다. 이 것으로 충분해 보이는데 왜 더욱 긴 코드로 작성되어있는 리액트를 가져다 쓰는걸까? 그 답은 같은 발표자가 [작년에 다른 곳에서 발표했던 내용](https://youtu.be/nyFHR0dDZo0)에 있다고 한다.

이 구현체를 본 것만으로도 왜 리액트 코어 팀이 클래스 컴포넌트를 벗어나 훅을 사용할 수 있게 업데이트 했는지 많은 이해가 되었고, 더 나아가 리액트를 순수 자바스크립트에 가깝게 사용하면서 버그가 발생할 일이 적고 가독성 있는 코드를 작성하기 쉬워지리라는 생각을 했다. 훅을 비롯하여 계속 발전하고 있는 리액트가 기대되는 발표였다.
