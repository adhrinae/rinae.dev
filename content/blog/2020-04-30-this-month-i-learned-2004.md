---
title: This Month I Learned - 2020년 04월
slug: this-month-i-learned-2004
date: 2020-04-30
tags:
  - TIL
description: '2020년 4월동안 익혔던 / 읽었던 것들 정리'
---

거의 반 년만에 'This month I Learned' 를 다시 시작해봅니다.  
이제와서 왜 6개월이나 이런 글을 작성하지 않았나 생각보면, 이런저런 어려움이 있어서라기보다 결정적으로 의욕이 부족해서 그랬다고 생각합니다.  
내용이 다소 적어질 수 있더라도 조금씩 다시 기록하고 정리해보려 합니다.

---

## Developer

- [빠르고 정확하게 답변을 받을 수 있는 질문하는 법 | asbubam's blog](https://blog.2dal.com/2020/04/01/%EB%B9%A0%EB%A5%B4%EA%B3%A0-%EC%A0%95%ED%99%95%ED%95%98%EA%B2%8C-%EB%8B%B5%EB%B3%80%EC%9D%84-%EB%B0%9B%EC%9D%84-%EC%88%98-%EC%9E%88%EB%8A%94-%EC%A7%88%EB%AC%B8%ED%95%98%EB%8A%94-%EB%B2%95/) - 내가 작년에 VisBug 기여 관련 발표를 했을 때 같이 담았던 '질문 잘 하는 법' 에 대한 내용에 영감을 얻으셔서 더 자세히 정리하여 블로그 포스팅으로 만들어주셨다. "공개된 채널 활용", "다른 사람에게 공유" 등 내가 언급하지 못했던 내용을 담아주셔서 훨씬 유용하다.
- [개발 조직의 문화와 제품의 개발 속도](https://suhyunbaik.github.io/devops/2020/04/01/dev-culture-and-speed/) - 장애를 대응하는 사례 하나만으로도 이 글에서 소개된 스타트업이 좋은 개발문화를 가지고 있겠다는 짐작이 되었다. 결국 조직은 개인의 책임을 묻지 않고 조직 내부에 어떤 문제가 있는지 빨리 파악하고, 그 문제를 해결하기 위한 최선의 노력을 기울이는게 중요하다고 느꼈다.
- [개발자의 글쓰기, 기술 블로그에 대하여 | JBEE.io](https://jbee.io/essay/writing-of-developers/) - 기술 블로그에 도전(?)하지만 생각처럼 잘 안된다고 느끼는 분들도 있을 것이다. 무엇을 위해 쓰는지, 왜 써야하는지 좀 더 명확하게 인지하고 있다면 기술블로그라는게 그렇데 대단한게 없다는 것을 깨닫게 된다.

## JS / TS

- [Typing functions in TypeScript](https://2ality.com/2020/04/typing-functions-typescript.html)
- [Class-related types in TypeScript](https://2ality.com/2020/02/types-for-classes-typescript.html)
- 위의 둘 모두 기본적인 타입스크립트 타이핑에 대한 내용을 다루는데, 클래스 관련 타입은 요새 쓸 일이 거의 없어서 가볍게 넘어가긴 했지만 함수의 타이핑은 꽤 흥미롭게 봤다. 실제로 함수의 타입을 선언할 때 리턴 타입이 `void` 이면 실제 함수의 구현 시 어떤 타입을 리턴해도 상관 없다는 사실이 흥미로웠다.


## Frontend

- [HTML DOM - Common tasks of managing HTML DOM with vanilla JavaScript](https://htmldom.dev/) - HTML 과 Plain JS 로 다양한 레이아웃이나 동작을 구현하는 스니펫 모음. 하나하나 깨알같이 좋은 내용들이어서 이 중에 좀 어려워보이는 부분들 보고 따라하면서 연습해봐도 되겠다는 생각이 들었다.
- [Aspect Ratio Cells with CSS Grid Layout by Michelle Barker on CodePen](https://codepen.io/michellebarker/post/building-an-aspect-ratio-css-grid-layout) - 요즘 CSS Grid 를 조금씩 사용하고 있는데, 동적으로 늘어나는 컬럼에 맞추어 각각 들어가는 요소들이 정사각형 모양이 되도록 만들고 싶었다. 여러모로 CSS Grid 에서 활용할 수 있는 속성으로 해결을 하고 싶었는데, 이 글을 따라가면 고정된 컬럼 수에 따라 행의 높이를 맞춰줄 수 있을 것으로 보였다. 
  - 궁극적으로는 위의 글에서 사용된 방법을 사용하지 못하고, [다른 링크](https://css-tricks.com/aspect-ratios-grid-items/)의 글을 참고하여 그리드 안에 놓이는 아이템을 감싸는 래퍼를 만들어주는 식으로 구현했다. psuedo-element 에 `padding-bottom` 을 100% 로 설정하는 식의 트릭은 이전에 어렴풋이 본 적이 있지만 이렇게 쓰게 될 줄은 몰랐다.
- [How to securely store JWT tokens. - DEV Community 👩‍💻👨‍💻](https://dev.to/gkoniaris/how-to-securely-store-jwt-tokens-51cf) - 모던 웹 애플리케이션에 JWT 토큰을 사용한 인증이 보편화(?)되면서 사용자 토큰을 어디에 보관해야하는지는 많은 담론이 오고갔다. localStorage vs 쿠키라던가. 이 글은 개중에서도 가장 안정적일 수 있는 토큰 보관 방법을 이야기한다. 글쓴이는 "HTTPS 프로토콜 + `HttpOnly` 플래그 설정 + `SameSite` 플래그 설정" 이 된 서버에 쿠키를 통해 토큰을 전달하면 외부 스크립트 등으로부터 안전하게 토큰을 보호할 수 있다고 이야기한다.
  - 더불어 `SameSite` 쿠키 정책이 최근에 이슈가 되었는데, 좀 더 자세한 설명은 아래 링크에서 읽어볼 수 있다.
  - [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
- [GitHub - pocka/storybook-addon-designs: A Storybook addon that embed Figma, websites, PDF or images in the addon panel.](https://github.com/pocka/storybook-addon-designs) - 스토리북에 Figma, 웹사이트, 이미지, PDF 를 심을 수 있는 애드온. 회사에서 메인 디자인 툴로 Figma 가 사용되고 있기 때문에 활용도가 아주 높은 애드온이 되리라 기대한다... 만 공개 권한 설정에 따라 안보일 것 같아서 어떻게 적용할지는 더 자세히 살펴봐야겠다.


## React

- [GitHub - roman01la/uix: Idiomatic ClojureScript interface to modern React.js](https://github.com/roman01la/uix) - 1년즈음 전에 Clojure(Script) 를 파보려고 시도했다가 포기한 적이 있었는데, 다시 천천히 살펴보기로 마음먹으면서 클로저스크립트로 된 리액트 래퍼를 찾아보았다. [re-frame](https://github.com/day8/re-frame) 이 가장 많이 꼽히는 선택지라 생각했으나, 어느새 클로저스크립트를 활용한 리액트 개발할 때도 여러 라이브러리가 발전하고 있는 상태였다. 그 중에 모던 리액트(컨커런트 모드 등)을 지원하는 라이브러리로 이 라이브러리가 눈에 띄었다.
- [GitHub - diegohaz/awesome-react-context: 😎 A curated list of stuff related to the new React Context API](https://github.com/diegohaz/awesome-react-context) - React Context API 를 활용한 라이브러리, 사용법 중 유용한 것들이 잘 모여있는 리스트.
- [useMemo 를 다시 생각하다](https://reactjs.org/docs/hooks-reference.html#usememo) - 회사 프로젝트에서 컴포넌트가 살아있는 동안에만 유지되는 mobx-state-tree 스토어를 만들고자 해서 그를 위해 `useMemo` 를 사용했었다. 생각해보니 이게 그닥 좋은 방식이 아니었는데, 의도와 다르게 `useMemo` 가 컴포넌트가 생성될 때 외에도 다시 호출되는 경우, 즉 스토어가 다시 생성되는 경우가 생길 수 있고 후일 리액트의 변화에 따라 특정 상황에서는 메모이즈된 값을 일부러 잊고 리랜더링이 일어나는 경우가 생길 수도 있다고 한다. _**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.**_ 라는 말을 새겨두어야겠다.
- [3 ways to autofocus an input in React that ALMOST always work! | Daniel Johnson's blog](https://blog.danieljohnson.io/react-ref-autofocus/) - 예전에 `input` 컴포넌트가 마운트되자마자 바로 포커스 시키는 설정을 할 수 있도록 `useImpartiveHandle` 같은 훅을 써서 ref 를 제어하곤 했었다. 오늘에야 안 것인데 `autoFocus` prop 으로 어지간한 케이스가 다 해결되어 굳이 따로 구현할 필요가 없었다. 추가로 애니메이션 등과 엮여서 input 컴포넌트가 표시되는 타이밍이 늦는 등 `autoFocus` 가 원하는대로 동작하지 않는다면 `useEffect` 를 활용하여 수동으로 제어해줄 수 밖에 없다.
- [GitHub - framer/motion: Open source, production-ready animation and gesture library for React](https://github.com/framer/motion) - 일단은 경쟁사지만... "이집 리액트 잘 하네" 라는 생각을 항상 하게 만드는 Framer 의 리액트 애니메이션 라이브러리이다. `react-spring` 보다 체감상 사용하기 편리하고 잘 동작한다는 느낌이 들었고, 사이드 프로젝트에 간단히 사용해보니 만족스러웠다. 주력 애니메이션 라이브러리로 사용해보는 것을 고려하게 된다.

## OSS

- [GitHub - marp-team/marp: The entrance repository of Markdown presentation ecosystem](https://github.com/marp-team/marp) - `mdx-deck` 비슷한 프로젝트라 여겨지는데, 마크다운으로 프레젠테이션을 만드는 방식을 여러가지 환경으로 제공한다는 커다란 특징이 있다. 프레젠테이션 만들 일 있을때 써먹어봐야겠다.
