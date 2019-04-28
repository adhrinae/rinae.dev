---
title: This Month I Learned - 2019년 4월
tags:
  - TIL
  - React
  - Reading
  - Programming
description: '2019년 4월동안 익혔던 / 읽었던 것들 정리'
---

- 한동안 열심히 벼르다가 못하고 있던 블로그 개편을 주말동안 도전해봤습니다. [한재엽님의 템플릿](https://github.com/JaeYeopHan/gatsby-starter-bee)을 활용하여 개인적으로 아쉬웠던 몇몇 부분의 스타일을 보강하고, 태그 기반의 정렬을 적용했습니다.  
- 또한 Netlify로 배포 플랫폼을 옮겼는데, 기존 Github pages에 있던 페이지는 자연스럽게 마이그레이션하기 힘들 것 같아서 어떻게 처리해야할지 조금 고민됩니다.  
- 기존 블로그의 형태는 [템플릿으로 저장소를 남겨두었으니](https://github.com/adhrinae/gatsby-blog-template-rinae) 참고하실 분은 참고하시기 바랍니다.  
- 개발중인 프로젝트에 [Hook API](https://reactjs.org/docs/hooks-reference.html)를 적용하면서 React Hook 관련 문서를 많이 읽다 보니 이번에는 프론트엔드 섹션도 따로 분리해봤습니다.  

## 읽을거리 - 일반

- [제품을 의도대로 사용하지 않는 고객 | The Strategist](http://thestrategist.io/misbehaving-customers/) - 우리는 다양한 사용자 스토리를 생각해보고, 제품의 사용자를 특정지으면서 개발자가 제품을 만든 의도대로 사용을 할 것이라는 착각에 사로잡히곤 한다. 하지만 얼마나 그럴싸한 UI나 기능을 만든다 하더라도 그걸 활용하는 것은 전적으로 고객의 몫이다. 그리고 그런 고객들을 보고 우리가 어떤 제품을 만드는지, 앞으로 어떤 방향으로 나아갈 가능성이 있는지 고민해볼 필요도 있다.
- [습관은 자신의 참 모습을 보여주는 창이다](http://newspeppermint.com/2019/04/02/m-habitus/) - "오늘날 우리는 습관을 그저 평범한 일상의 규칙적 행동이나 성향 정도로만 생각합니다. 하지만 습관은 우리 자신이 누구인지를 정의하고, 우리의 도덕성을 결정합니다. 만약 흄의 의견을 따른다면, 습관은 세상을 움직이는 힘입니다. 습관에 대한 이런 과거의 관점은 흔한 자기계발 서적보다 우리에게 습관에 대한 더 많은 것을 가르쳐 줍니다. 이들은 우리가 매일 습관적으로 하는 행동이 그저 더 나은 삶을 위해 완전히 바꾸어야 할 진부한 일상이 아니라, 우리 자신의 진정한 모습을 보여주는 기회임을 말해주는 것입니다."

## 읽을거리 - 개발자

- [후배 개발자에게 - 2019년](https://brunch.co.kr/@javajigi/4) - 자바지기 박재성님이 작성하신 후배 개발자들을 위한 글. 내가 개발자가 되자마자 이 글을 봤으면 더 높은 경지에 이르렀을까? 싶을 정도로 구구절절 내가 좋다고 생각하는 말씀만 담겨있다. 가끔 개발자로 성장하는 방법에 대한 질문을 받을 때가 있는데, 나 자신도 부족하거니와 아직 풍부한 경험을 해 보지 못해 머릿속에서 정리가 잘 되지 않았던 부분들이 있었다. 하지만 이젠 이 글만 추천해주어도 될 것 같다.
- [초등학교 덧셈 알고리즘을 코드로 써보기 · /_ the devil is in the detail _/](http://minjang.github.io/2019/03/02/convert-math-addition-algorithm-to-code/) - [LeetCode에 제공되는 문제를 기반으로](https://leetcode.com/problems/add-strings/) '좋은 코딩 문제란 무엇인가' 를 먼저 고찰하고 풀어보면서 일반적으로 어떤 실수를 범할 수 있는지, 어떤 접근방법이 있는지 짚어주는 글. 바로 풀었을 때 감이 잘 오지 않았는데, 처음에는 문자 배열 단위로 끊어서 처리해보려다가 잘 되지 않았으나, `carry` (올림) 개념을 보고 조금 힌트를 얻었다.
- [코드스쿼드 - 마스터즈 코스에서 함께할 수 있는 💻 CS23 커리큘럼 그래프입니다.추천하는 탐색 방법은... | Facebook](https://www.facebook.com/102864260182667/posts/598493207286434?sfns=mo) - 내가 개발자로서 계속 꾸준히 쌓아가야 할 컴퓨터공학 지식이 무엇이 있을까 고민을 계속 하고 있었는데, 여기서 나온 그림이 내 고민을 가볍게 해결해주는 듯 했다. 부족하다고 생각하는 부분부터 차근차근 채워나가야지.
- [책리뷰 밑바닥부터 만드는 컴퓨팅 시스템 | BSIDESOFT co.](https://www.bsidesoft.com/8032) - 지금은 '프로그래머 수학으로 생각하다' 라는 책을 천천히 읽고 있는데 다음에 어떤 CS 기본을 다루는 책을 읽을까 하다가 이 책의 추천을 발견했다. 망설임 없이 다음 책으로 봐야겠다.

## 프론트엔드 - 일반

- [Intent to stop using `null` in my JS code · Issue #7 · sindresorhus/meta · GitHub](https://github.com/sindresorhus/meta/issues/7) - JS 코드에서 최대한 `null` 대신 `undefiend` 를 사용하겠다는 이야기. JSON이나 외부 API 등 `null` 이 존재할 수 밖에 없는 경우를 제외하면 `undefined` 가 훨씬 명료하다는 의견에 동의한다. 앞으로 이런 스타일로 작성을 해 볼까 싶다.
- [CSS Reference  |  Tools for Web Developers  |  Google Developers](https://developers.google.com/web/tools/chrome-devtools/css/reference#coverage) - 크롬 개발자 도구를 열어 현재 페이지의 CSS 커버리지를 확인하는 방법

## 프론트엔드 - 리액트

- [GitHub - ghengeveld/react-async: 🍾 Flexible promise-based React data loader](https://github.com/ghengeveld/react-async) - 리액트로 비동기 데이터 호출을 하기 편리하도록 만들어진 라이브러리. `useAsync` 같은 Hook도 추가되었다. [`useAsync` 코드만 잠깐 살펴보았는데](https://github.com/ghengeveld/react-async/blob/master/src/useAsync.js) 내부 코드가 깔끔하게 되어있는데다가 몇가지 내가 익숙하지 않은 부분만 제외하면 최대한 명료하게 되어있는 것으로 보인다. 또한 다른 사용자들이 라이브러리를 쓸 때 어떤 방식으로 `unsupported` 처리를 하는지 힌트를 얻기도 했다. 하지만 컴포넌트에 패칭 로직이 직접 들어가게 되면 분리하기 어렵지 않을까?
- [React Portals with Hooks | Jay Freestone](https://www.jayfreestone.com/writing/react-portals-with-hooks/) - `ReactDOM.createPortal` 을 사용할 때 Hook을 사용해서 더 간결하고 선언적인 코드를 만드는 과정을 보여주는 글. 덕분에 기존 컴포넌트 및 portal 관련 HOC를 훨씬 가독성있게 고칠 수 있었다.
- [Debouncing with React Hooks - DEV Community 👩‍💻👨‍💻](https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci) - `useDebounce` Hook을 만드는 예제
- [The Future of Meta Tag Management for Modern React Development](https://open.nytimes.com/the-future-of-meta-tag-management-for-modern-react-development-ec26a7dc9183) - `react-helmet` 패키지가 관리되지 않고 오동작하길래 대안을 살펴보다보니 `react-helmet-async` 라는게 있어서 도입해보니 잘 되었다. 패키지 제작자가 이전의 상태와 현재의 대안을 제시하는 글을 정리해서 올려주었다.
- [React Hooks: Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks) - Compound Components를 Hook 과 함께 어떻게 구현할 수 있나 했더니 Context API를 활용하는 거였다. 이 글을 본 김에 `ts-react-parcel` 보일러플레이트도 적절히 수정해주었다. 타입스크립트로 타입을 매기는게 좀 빡빡하긴 했는데 조금씩 작업하다보니 요령도 생겼다.
- [A Complete Guide to useEffect — Overreacted](https://overreacted.io/a-complete-guide-to-useeffect/) - 이번에 `typescript-eslint` 로 린트를 변경하면서 Hook 관련 린트도 추가했는데 예상하지 못했던 경고가 많이 나왔다. 그래서 그 문제를 해결해보고자 `useEffect` 에 대해 더 자세히 살펴보기로 했는데 그 중에 [리액트의 공식 FAQ 문서와](https://reactjs.org/docs/hooks-faq.html) 저 링크의 글이 가장 자세히 설명되어있었다. 한번 번역하면서 제대로 파악할 기회가 있었으면 좋겠다.

## 오픈 소스 프로젝트

- [GitHub - codex-team/editor.js: A block-styled editor with clean JSON output](https://github.com/codex-team/editor.js) - 홟발히 개발되고 있는 웹용 위지윅 에디터. 보아하니 퓨어 타입스크립트 + CSS로 이루어져있는 듯 하다. 문서화도 굉장히 잘 되어있고 소스코드의 가독성이 좋아서 틈틈이 보는 재미가 있다.
- [GitHub - sindresorhus/ky: 🌳 Tiny & elegant HTTP client based on window.fetch](https://github.com/sindresorhus/ky) - `fetch` API 기반 HTTP 클라이언트 라이브러리. `axios` 가 보통 가장 우선적으로 꼽히는 라이브러리고 기능이 더 많긴 하지만, 결정적인 차이가 있다면 `axios` 는 `XMLHttpRequest` 객체 기반으로 밑바닥부터 만들었기 때문에 조금 더 묵직한 반면, `ky` 는 `fetch` API 기반 추상화 라이브러리이기 때문에 훨씬 코드 양이 적고 `fetch` API 지원만 되는 브라우저라면 편안히 쓸 수 있다. 다만 글로벌 옵션같은게 따로 없어보여서 지금 `axios` 를 사용하고 있는 부분을 바로 교체하긴 힘들겠다.
- [GitHub - elbywan/wretch: A tiny wrapper built around fetch with an intuitive syntax.](https://github.com/elbywan/wretch) - 지난번에 적었던 `ky` 라는 라이브러리의 [이슈 코멘트에서 '왜 또 새로운 라이브러리냐?' 같은 질문이 있었고](https://github.com/sindresorhus/ky/issues/10#issuecomment-420174555) 질문을 한 사람이 예를 들면서 이 라이브러리를 제시했다. `wretch` 쪽이 기능적인 면에선 좀더 우세해 보인다. 어차피 axios를 생으로 쓰는 것을 벗어나 프로젝트에 사용할 적절한 래퍼를 만들거면 이 라이브러리도 고려를 해봐야겠다.
- [GitHub - jefflau/jest-fetch-mock: Jest mock for the fetch polyfill](https://github.com/jefflau/jest-fetch-mock) - `axios` 도 다양하고 잘 만들어진 Mock Adapter 가 있다만, `fetch` 할 때는 어떤 방식으로 테스트에 모킹을 할까 고민하다 이 라이브러리가 잘 동작했다. 만약 `fetch` 를 사용하고 있고 Jest로 테스트를 작성하고 있다면 단연코 바로 추천하고 싶다.

## 도구

- [Perflink | JS Benchmarks](https://perf.link) - JSPerf보다 훨씬 미려한 디자인으로 벤치마킹을 해볼 수 있는 사이트
- [GitHub - mifi/lossless-cut: Save space by quickly and losslessly trimming video and audio files](https://github.com/mifi/lossless-cut) - 이전에 간단한 비디오 트리밍에 유료 소프트웨어 체험판 써본다고 난리를 친적이 있었는데, 이거 있으면 간단한 동영상 자르기정도는 충분히 해결할 수 있겠다.

