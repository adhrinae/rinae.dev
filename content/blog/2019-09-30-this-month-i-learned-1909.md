---
title: This Month I Learned - 2019년 9월
slug: this-month-i-learned-1909
date: 2019-09-30
tags:
  - TIL
description: '2019년 9월동안 익혔던 / 읽었던 것들 정리'
---

## General

- [북저널리즘 - 젊은 혁신가를 위한 콘텐츠 커뮤니티](https://www.bookjournalism.com/) - 우연히 다른 분의 트윗을 보다가 발견한 서비스. 퍼블리도 이름까지만 알고 있었는데 슥 살펴보니 이 서비스의 컨텐츠가 더 마음에 든다. 하지만 프라임 서비스의 구독료가 아직 심리적으로 거리가 있어서 조금 차근차근 생각해보려 한다.
- [대한민국, 섹스의 실종? : 박노자](https://m.blog.naver.com/PostView.nhn?blogId=vladimir_tikhonov&logNo=221634846528) - 정말 우연히 박노자 교수의 글이 공유되어 읽게 되었다. 이 분 블로그를 마지막으로 방문한 지 거의 10년은 다 되었다는 기분이 드는데. 글을 읽다 보면 단순히 성에 이상한 방식으로 보수적인 나라 분위기 문제도 있지만, 결국 강제로 우리의 삶의 한 부분이 억압되어있다는 사실을 다시 한번 확인할 수 있었다. 뿐만 아니라 본문 초반 내용을 보면서 과일을 챙겨 먹지 않은 지 아주 오래되었다는 사실이 생각나 과일을 주문하게 되었다.
- [How I use Twitter · Felix Krause](https://krausefx.com/blog/how-i-use-twitter) - 트위터는 나의 주된 개발 정보 수집 & 공유 창구이다. 예전엔 일 할거 다 하면서도 하루 평균 수백개의 트윗이 올라오는 타임라인을 따라잡을 수 있었는데, 요즘은 트위터 클라이언트도 잘 안키고 하루에 몇 번 정도만 웹으로 접속하여 타임라인 위에 있는 트윗 조금 보는게 전부가 되어버렸다. 이 글은 Tweetbot 앱을 활용하여 자신이 정말 보고싶은 트윗을 잘 볼수있는 환경을 설정하는 방법을 소개한다.

## Developer

- [Google Engineering Practices Documentation | eng-practices](https://google.github.io/eng-practices/) - 구글의 엔지니어링 원칙 문서. 현재는 코드 리뷰 가이드만 있지만 문서 제목을 보아 다른 내용도 포함되리라 생각한다. 어떻게 변경점을 잘 작성하고, 어떻게 코드를 리뷰하는지 안내하고 있다. 문서가 좀 크게 펼쳐져있으면 더 보기 편하겠다고 생각하는데, 여러 계층으로 이루어져 있어서 살짝 불편하다는 느낌이 든다.
- [Appwrite - Open Source End to End Backend Server](https://appwrite.io/) - 프론트엔드/모바일 앱 개발자를 위한 백엔드 PasS(Platform as a Service). 필요한 인스턴스에 컨테이너 설치하고 SDK 붙여서 쓰기만 하면 되는 것 같은데. 이미 있는 서버가 있다면 Firebase보다 유용하게 쓸 수 있으려나? 컨셉만 봤을 때는 괜찮아보인다.
- [설계의 중요성을 설명하기가 어려웠던 이유 | Huns.me](https://huns.me/posts/2019-09-19-why-is-it-difficult-to-understand-the-importance-of-archictecture) - 최근에도 들은 이야기이지만, 개발자로서 자신이 작성하는 코드와 비지니스를 멀리 떼어놓고 볼 수는 없다. 사업적으로 중요하고 유지보수할 필요성이 낮은 프로젝트라면 그닥 좋지 못한 설계라도 빠르게 만들어 제품을 출시하면 될 것이고, 그렇지 않은 프로젝트라면 장기적으로 비용 효율이 잘 나올 수 있도록 나름 신중을 기할 수도 있다. 하지만 언제나 조직 안에서 일을 하다보면 개발자 입장에서 장기적으로 크게 고통받을 것을 알면서도 비지니스 상황에 맞추어 가다보면 더 올바른 설계는 구축하기 힘들어진다. 결국 데이터가 필요하고, 설득을 해야하고, 어떻게든 시간을 쥐어짜내야 비벼볼 수 있다.

## Frontend

- [Front-end productivity boost: Cypress as your main development browser - DEV Community 👩‍💻👨‍💻](https://dev.to/noriste/front-end-productivity-boost-cypress-as-your-main-development-browser-5cdk) - 최근에 접한 UI 테스팅 관련 글 중 가장 현실적으로 도움이 되는 글이라고 생각한다. 단순히 '이렇게이렇게 테스트를 작성해라' 도 좋겠지만, 아예 '여러분의 메인 개발 브라우저를 Cypress로 사용하여 번거로운 수작업을 자동화하라' 는 방법을 제시한다.
	- [GitHub - NoriSte/ui-testing-best-practices: The largest UI testing best practices list (July 2019) (work in progress)](https://github.com/NoriSte/ui-testing-best-practices) - 위 글의 작성자가 내용을 채우고 있는 UI Testing 모범사례 모음집. 완성이 무척 기대된다.
- [(번역) 미래로 가는 스크롤 | Steady Study](https://spilist.github.io/2018/05/11/scroll-to-the-future) - CSS 속성 중 `scroll-behavior: smooth` 에 대한 트윗을 읽다가, 자바스크립트로 폴리필 비슷하게 처리해줄 수 있는 방법이 없을까? 하고 검색을 해 보니 다양한 스크롤 관련 API와 최적화 기법에 대한 번역글이 있었다. 마지막엔 점진적 개선(Progressive enhancement) 방식으로 스크롤 관련 기능을 구현할 것을 권장하고 있다.
- [The Ultimate Guide to handling JWTs on frontend clients (GraphQL)](https://blog.hasura.io/best-practices-of-using-jwt-with-graphql/#jwt_vs_session) - 제목에는 GraphQL이라는 단어가 있지만, 전혀 신경쓰지 않고 편안히 JWT와 클라이언트 사이드에서 인증 수단 관리하는 법에 대해 알아볼 수 있는 글이었다. 많이들 JWT 이야기를 하고 나도 아무렇지도 않게 쓰고 있지만, 최소한 이 정도 흐름은 이해하고 써야 하지 않을까 하는 생각이 들 정도로 좋은 레퍼런스
- [GitHub - tmdgus0084/apple-dark-mode: How HTML, CSS, and JavaScript support dark mode for iOS and MacOS.](https://github.com/tmdgus0084/apple-dark-mode) - iOS와 macOS의 브라우저 환경에서 다크 모드를 대응하는 방법을 시작부터 끝까지 친절하게 알려주는 문서. 기본은 `prefers-color-scheme` 미디어 쿼리를 체크하는 것이지만, 그 값을 이용하여 어떻게 다크 모드를 지원할지, CSS는 어떻게 불러올지, 사용자 설정은 어떻게 저장할지, 테마 전환 효과를 조금 더 미려하게 표현하려면 어떻게 해야하는지 모두 다루고 있는 좋은 지침서이다.

## React

- [React Hooks API 간단 정리 트윗](https://twitter.com/tylermcginnis/status/1169667360795459584?s=20) - 각각의 기본 훅의 역할이 어떤 것인지 한줄 요약을 아주 잘 해두었다.
- [2019 IBM Developer Day 미우나 고우나 내새끼: Reusable Custom Component 만들기 A…](https://www.slideshare.net/jayjin0427/ibm-yurim2) - 진유림님의 리액트 컴포넌트 설계에 대한 발표. 대상 청자는 리액트 혹은 컴포넌트 기반 프론트엔드 개발에 상대적으로 덜 익숙한 사람인 것으로 느껴졌다. 컴포넌트가 무엇이며 어떤 방식으로 설계를 한다면 도움이 될지 차근차근 설명해주어 좋다.
- [GitHub - JohannesKlauss/react-hotkeys-hook: React hook for using keyboard shortcuts in components.](https://github.com/JohannesKlauss/react-hotkeys-hook) - 심플하지만 강력한 핫키 바인딩 Hook. 문서화 및 동작 설명까지 말끔하다.
- [GitHub - chakra-ui/chakra-ui: ⚡️Simple, Modular & Accessible UI Components for your React Applications](https://github.com/chakra-ui/chakra-ui) - Emotion 기반으로 만든 UI 컴포넌트 모음집. 다크 모드까지 구현되어 있고, 만약에 회사 프로젝트 등에서 재사용 가능한 UI 라이브러리를 구축한다고 하면 이런 스타일을 참고해보면 도움이 많이 되리라 생각한다.
- [GitHub - welldone-software/why-did-you-render: why-did-you-render monkey patches React to notify you about avoidable re-renders.](https://github.com/welldone-software/why-did-you-render) - 리액트 컴포넌트의 리랜더링 요인을 찾기 위해 쓰려던 why-did-you-update가 더 이상 관리되지 않고 있었는데, 마침 계승하는 성격의 프로젝트가 있었다. Hook까지 완벽 지원하고 있어서 쉽게 리랜더링의 원인을 찾을 수 있었다.
- [리액트 프로젝트에서 타입스크립트 사용하기](https://velog.io/@velopert/using-react-with-typescript) - 'velopert(벨로퍼트)' 라는 닉네임으로 유명한 김민준님이 리액트 책에 이어 리액트와 타입스크립트를 함께 사용하는데 도움을 주는 좋은 강좌를 연재해주셨다. 리액트로 기초만 알고 있으면 리액트 개발하는데 필요한 충분한 수준의 타입스크립트 사용법까지 같이 배울 수 있다.

## OSS

- [GitHub - microsoft/web-build-tools: A tool box for large scale web development](https://github.com/microsoft/web-build-tools) - MS에서 큰 스케일의 웹 프로젝트를 만들 때 사용하는 패키지나 빌드 플러그인을 모아놓은 저장소. 안에 있는 패키지 중에서 모노레포 관리용 패키지인 Rush가 특히 눈에 띈다. 또한 타입스크립트 라이브러리의 API 문서화를 도와주는 API Extractor도 있다.
- [GitHub - antoinechalifour/memento: Memento is a development-only tool that caches HTTP calls once they have been executed.](https://github.com/antoinechalifour/memento) - 클라이언트 개발할 때 백엔드 서버가 아직 불안정하거나, 다양한 제약이 있거나, 네트워크가 불안정한 환경에서 일해야 할때 등 외부 서비스의 응답값을 캐싱해둘 수 있는 도구이다. 보통 이런 작업을 수동으로 해놓고 관리할 때가 많은데 이걸 활용해서 Stub을 편하게 만들어 둘 수 있겠다.
- [GitHub - ds300/patch-package: Fix broken node modules instantly  🏃🏽‍♀️💨](https://github.com/ds300/patch-package) - 수많은 `node_modules` 패키지와 함께 프로젝트를 하다 보면, 포크를 해서 PR을 올리거나 직접 특정 부분만 수정한 패키지를 써서 관리하기에 어려움을 겪는 경우가 많다. 특히 PR의 경우 자신의 PR이 머지되고 버전업된 패키지가 배포되기까지 얼마나 걸릴지 알 수도 없다. 이 패키지를 활용하면 자신이 `node_modules` 를 패치해둔 부분을 다른 파일로 별도로 관리하면서 팀원과 공유할 수 있다. 그래서 다른 패키지 업데이트 때문에 `yarn` / `npm` 커맨드 후에도 `node_modules` 안의 모듈이 자신이 패치한 부분을 반영하게 한다.

## Tools

- [Dark Reader](https://darkreader.org/) - 어떤 사이트라도 다크 모드로 만들어주는 브라우저 확장. 보통 이런 유저 스크립트 형식의 확장은 크롬과 파이어폭스만 지원할텐데 사파리도 지원해주어서 반갑다. 유료라는게 아쉽지만, 1회성 구매로 잘 써먹을 수 있어보인다.
- [Can I Email - 이메일에서 HTML태그 사용가능한지 확인 | GeekNews](https://news.hada.io/topic?id=523) - 그냥 브라우저 하위 호환에 대응하는 것 뿐 아니라 이메일 템플릿도 손쉽게 스타일링하기 어려운 분야 중 하나이다. 이 서비스는 [caniuse.com](https://caniuse.com) 처럼 특정 이메일 클라이언트에서 어떤 HTML, CSS 요소를 쓸 수 있는지 보여준다.
- [iOS 13.1, 개인용 자동화 지원 | GeekNews](https://news.hada.io/topic?id=601) - 안드로이드의 Tasker에 비하면 꽤나 먼 길 돌아 왔지만, iOS Shortcut(구 Workflow)도 꽤 많이 발전했다. 막상 지금은 자동화 할만한 것들이 딱히 떠오르지 않아 짜게 식었지만.. 링크를 타고 들어가면 있는 댓글에 각종 숏컷 모음 사이트들을 통해 유용한 숏컷들을 확인해보고 받아서 사용할 수 있다.
