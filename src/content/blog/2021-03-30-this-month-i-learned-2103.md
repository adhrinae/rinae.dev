---
title: "This month I Learned - 2021년 3월"
postSlug: "this-month-i-learned-2103"
description: "2021년 3월동안 익혔던 / 읽었던 것들 정리"
pubDatetime: 2021-03-30
tags:
  - TIL
---

## General

- [평가방법 OKR, KPI, MBO 뭐가 다른거에요?](https://brunch.co.kr/@ywkim36/41)
  - 조직에 OKR이 적용되고 있지만, 내가 어떻게 받아들이고 적용해야 할지는 아직 명확하지 않다고 느끼고 있었다. 이 글은 KPI와 OKR의 핵심을 쉽게 설명하고 있어서 OKR을 이해하는데 조금 더 도움이 되었다.
  - 각각의 비교는 그렇다 치고, 이 글에서 특히 중요한 부분이라는 느낌을 받은 것이 ‘액션 아이템을 정하기에 앞서 명확한 목표치를 설정해야 한다’ 라는 부분이었다. 그리고 그 목표를 향해 올바른 방향을 가고 있느냐를 중점적으로 본다면 OKR이고, 목표 달성율이라는 수치에 더욱 초점을 맞추면 KPI가 되는 것으로 보였다.
- [지원자도 회사를 평가합니다. 이렇게요.](https://brunch.co.kr/@goodgdg/142)
  - 면접관으로서 지원자를 보면서 회사나 팀에 대한 질문을 받다 보면 반짝이는 질문을 받지 못할 때가 많았다. 내가 하나부터 열까지 미리 알려줄 수는 없는 노릇이고, 질답을 통해서 전달해줄 수 있는 정보도 있다보니 지원자가 나에게 질문을 할 때 가능하면 상세할 수록 좋다고 생각한다.
  - 이 글 안에도 일부 내용이 있지만 예전부터 내가 지원자라면 꼭 질문하는 것이 **"평가는 어떻게 이루어지는가"** 와 **"업무 분배 및 진행은 어떻게 되는가"** 였다. 조직 구성과 팀이 돌아가는 형태를 조금 더 자세히 알아보기 위해서이다.
  - 거기에 더해 회사 및 제품에 대해 더 상세히 알고자 하는 질문과 회사나 팀의 근래 고민거리를 물어보는 질문은 꽤 좋은 질문이라고 생각한다.
- [애자일 이야기 : 더 많은 일을 하면서 더 빨리 하기](http://agile.egloos.com/1762301)
  - 하나의 거대한 목표를 이루기 위해 작은 스케일의 빠른 방식으로 이루어보고 이를 반복하면서 확장시키는 기법에 대해 안내한다.
  - **"처음부터 크고 어려운 일을 하는 것은 학습 곡선이 가파르고 비용이 큽니다. 하지만 작고 쉬운 것을 먼저하고 나면 애초의 그 가파른 곡선이 낮은 언덕으로 바뀌어 있습니다. 총 비용을 따져서 오히려 이득인 경우가 많습니다."**

## Developer

- [GitHub - TheAlgorithms/Rust: All Algorithms implemented in Rust](https://github.com/TheAlgorithms/Rust)
  - 보통 새로운 언어를 깔짝대면서 익힐 때 도전해보는게 알고리즘 문제를 새 언어로 풀어보는 것이다. 아직 러스트까지는 손이 닿지 않았지만, 교육 목적으로 많이 언급되는 자료구조와 알고리즘의 구현 전략이 러스트로 작성되어있어 참고할만 하다.

## JS / TS

- [Get Ready For ESM. JavaScript Modules will soon be a… | by Sindre Sorhus | Jan, 2021 | 🦄 Sindre Sorhus’ blog](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77)
  - Swift, Node.js를 주요 기술 스택으로 개발하는 유명 풀 타임 오픈소스 개발자 Sindre Sorhus가 올해 초부터 ‘자신이 제공하는 오픈소스 프로젝트 중 깃헙 스타 1천이 넘은 패키지는 ESM으로 제공하겠다’ 라고 이야기했다.
  - 우연히 다른 모듈의 소스코드를 살펴보다가 발견했던 내용인데, CommonJS를 사용하는 사람이라면 바로 이전의 메이저 버전을 사용해야 한다.
  - Node.js 12부터 공식적으로 ESM을 지원하고 있으니(10버전 LTS는 2021년 4월에 종료 예정), 좀 더 급진적으로 ESM으로만 패키지를 배포하여 전반적인 생태계 이동에 보탬을 하겠다는 내용의 글이다.
  - 그러면 브라우저도 아니고 Node.js 패키지에 ESM이 도입 되면 무엇이 좋냐인데, 그 내용은 [이 트윗에 있다.](https://twitter.com/sindresorhus/status/1349312503835054080?s=20)
- [async 이터레이터와 제너레이터](https://ko.javascript.info/async-iterators-generators)
  - 나는 제네레이터를 직접 사용하여 어떤 모듈을 구현하거나 아니면 이를 사용할 일이 거의 없다. 예전에 redux-saga 다룰때는 유용한 녀석이라고 생각했지만 그때 뿐이고. 아니면 mobx에서도 비동기 액션을 수행할 때 async/await 대신에 제네레이터 문법을 활용하는 정도이다. [(참고로 이렇게 활용되고 있다.)](https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/api/flow.ts)
  - 그런데 다른 채팅을 하다가 제네레이터와 상태 머신의 활용에 대한 이야기가 나왔다. 잘 활용하시는 분들이야 잘 활용하시겠지만 내가 아는 수준에서는 제네레이터를 일반적으로 어떻게 활용해야할지, 또한 이를 통해 상태 머신을 어떻게 구현해야할까 고민하다 아래와 같은 참고 링크를 찾기도 하고 얻기도 했다.
  - [Finite State Machines and JS. Writing correct software is hard… | by Evan Brass | Medium](https://evan-brass.medium.com/finite-state-machines-and-js-c9b55fc3f8f9)
  - [Let’s Program Like It’s 1999 | Lee Byron](https://www.youtube.com/watch?v=vG8WpLr6y_U&t=1861s)

## Frontend

- [What the heck, z-index??](https://www.joshwcomeau.com/css/stacking-contexts/)
  - `z-index` 야 CSS를 다루다 보면 한두번(혹은 그 이상) 고통받게 되는 속성 중 하나이다. 사실 "쌓임 맥락" 에 대해 이해하면 그래도 디버깅한다고 고생할 일이 조금 줄어들긴 하는데, 이를 명쾌하게 설명할만한 글이 아직까진 적다고 생각했다.
  - 하지만 이 글은 포토샵의 레이어, 그리고 레이어의 그룹 등 훨씬 더 이해하기 쉬운 설명과 바로 동작시켜보고 수정할 수 있는 예제가 임베딩되어있어 `z-index` 의 동작 원리와 유의할 점을 훨씬 쉽게 파악할 수 있어서 좋다.
- [fetch와 Cross-Origin 요청](https://ko.javascript.info/fetch-crossorigin)
  - 프론트 개발하다보면 CORS 문제를 잊을만하면 한 번씩 겪는다. 초보 개발자들은 이 문제를 많이 겪을 것이다. 면접 문제로도 종종 등장할 정도이다.
  - 그런데 막상 설명을 위해서는 당장 적용하는 해결 방법 이외에 알아야하는 복잡한 사항이 좀 많다. 그리고 바로 이해도 되지 않는다. 예를 들어 HTTP 헤더에 대한 내용이라던가 preflight 요청이라던가, 내가 처음 CORS의 개념에 대해 접할 때 아주 복잡하다고 생각했던 내용들이다. 그리고 MDN의 자료만으로는 이해하는 것이 너무 어려웠다.
  - 그래도 이 글에서는 왜 CORS가 필요하며, "안전한 요청"의 정의와 구성이 무엇이며, Fetch API를 통해 어떻게 안전한 요청을 할 수 있을지 차근차근 잘 안내해주고 있다.
- [GitHub - single-spa/single-spa: The router for easy microfrontends](https://github.com/single-spa/single-spa)
  - [craco 플러그인 중 하나를 보다 보니](https://github.com/hasanayan/craco-plugin-single-spa-application) 플러그인 이름이 이상하게(?) 느껴졌다. SPA도 아니고 Single SPA는 또 뭐야? 궁금해서 찾아보니 있는 개념이다. 예전에 [마이크로 프론트엔드 아키텍쳐](https://micro-frontends.org)라는 개념을 접했던 것이 기억나는데, 그 개념을 현실적으로 적용할 수 있게 도와주는 프로젝트로 보인다.
- [효율적인 프런트엔드 에러 핸들링 | JBEE.io](https://jbee.io/react/error-declarative-handling-0/)
  - 이전에 에러 처리를 어떻게 하면 좋을지 고민해본 적이 있다. 그런데 그 글은 고민의 초입 단계에서 멈추었고 내가 생각했던 해결책도 결국 그리 좋지 않아서 실무 코드에 새로운 레거시만 남기게 되었다.
  - 이 글은 전반적으로 ‘에러란 무엇인가?’ 에 대해 다시 한번 고찰하고, 거기서 우리가 어떻게 사용자 중심의 에러 처리를 할 수 있을지 다양한 접근 방식을 제공한다. 그리고 결과적으로 리액트 애플리케이션을 개발하면서 컴포넌트 단위부터 글로벌 에러까지 선언적으로 에러를 다룰 수 있을지도 안내한다.
  - 한 가지 살짝 아쉬운게 있다면 아직 리액트의 experimental 기능인 Suspense(for data fetching)과 `swr`, `react-query` 같은 특정 라이브러리를 활용한 개발 방법론에 연관이 약간 깊다는 점이다. 좀 더 레거시(?) 한 코드를 다루는 사람들 입장에서는 어떻게 다루어야 할지도 설명이 되면 좋을텐데 조금 더 추상화된 개념을 설명하는 느낌이었다. 그래서 글에서 제공하는 실제 사용 예를 적용할 때 조금 혼란을 겪는 케이스도 있겠다는 생각이 들었다.

## React

- [Using React with D3.js](https://wattenberger.com/blog/react-and-d3)
  - 데이터 시각화 도구 하면 D3가 많이 언급된다. 내가 아직 데이터 시각화 관련 업무를 해 본적은 없지만 언젠가 다뤄보고 싶다는 생각은 해왔기 때문에, 포스팅을 보자마자 재미있게 읽어보았다.
  - 첫 인상은 'You might not need jQuery' 같은 글인줄 알았다. 왜냐면 svg 그리기를 D3로 구현할 때와 리액트만으로 구현하는 것을 비교하여 보여주었기 때문이다. 그 기본을 넘고 나면 D3를 리액트 컴포넌트 안에서 어떻게 활용하면 좋은지 여러 방식의 예제와 함께 설명해준다.
  - 포스팅 자체가 인터렉티브하게 되어있어서 보는 즐거움은 배가 되었다. 이런 방식의 블로그 포스트를 볼때마다 즐겁고 내용이 잘 들어온다. (아주 가끔 정신없어서 정보를 습득하기 어려운 경우도 있지만)

## OSS

- [GitHub - ota-meshi/eslint-plugin-regexp: ESLint plugin for finding regex mistakes and style guide violations.](https://github.com/ota-meshi/eslint-plugin-regexp)
  - 웹스톰에서 정규표현식을 입력하다보면 IDE 자체 린터를 통해 불필요한 정규표현식 문법은 조절할 것을 안내하곤 했다.
  - 가끔은 이게 개발 환경에 통합되어있는 린터가 아니라 IDE의 고유 기능이라는게 아쉬웠는데, 아예 이렇게 ESLint를 통해 통합하여 더 효율적이고 실수하기 적은 정규표현식을 작성하는데 도움이 될 수 있다는게 신기하다.
  - 문서 페이지의 예제도 모나코 에디터에 바로 해당 플러그인이 적용되어 VSCode에서 린트 에러를 보듯이 볼 수 있어서 좋다.

## Tools

- [Hoppscotch - Open source API development ecosystem](https://hoppscotch.io/)
  - 브라우저에서 Postman마냥 API 요청을 던져볼 수 있는 도구
  - 그 외에도 다양한 기능을 제공하는데, 깔쌈한 UI가 마음에 든다.
