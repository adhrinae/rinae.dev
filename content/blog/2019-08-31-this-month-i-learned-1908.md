---
title: This Month I Learned - 2019년 8월
slug: this-month-i-learned-1908
date: 2019-08-31
tags:
  - TIL
  - React
  - Typescript
  - Reading
description: '2019년 8월동안 익혔던 / 읽었던 것들 정리'
---

## General

- [신규입사자를 잘 온보딩 시키는 방법 - How to onboard a new hire | GeekNews](https://news.hada.io/topic?id=233) - 신규입사자를 온보딩 시키는 방법이 아주 잘 정리된 글. 특히 웰컴 노트 예제가 일품이다.
- [친구는 외로움의 보험이 아니다 | Daum 뉴스](https://news.v.daum.net/v/20190825091611561) - 요즘은 홀로 지내는데 '익숙해졌다' 는 표현은 절대 쓸 수 없겠다는 생각을 하고 있다. 그나마 친구들에게 연락을 먼저 받지 못하는 일에 대해서 익숙해 진 것도 얼마 되지 않았다. 어떤 친구를 대할 때 나와 상대의 진심은 어디까지인지 한번쯤은 진지하게 생각해보게 된다.
- [나는 스타벅스를 좋아할 당신이 검소하게 살기를 바란다.](https://brunch.co.kr/@sandcocktail/77) - 이미 어린 나이부터 제테크에 많은 관심을 가진 분도 많고, 수익을 올리고 계신 분도 있을 것이다. 나는 그닥 돈벌이랑은 연이 없긴 하지만 드문드문 내가 은퇴를 하고 난 뒤의 삶에 대해 생각할 때가 있다. 막연히 불안하진 않지만 한 번쯤은 위 글에서 말하는 '노후' 에 대해 생각해보곤 하는데 이 글에서 제시하는 내용과 나의 소비욕 사이에서 적당히 중간을 잡아가면 되지 않을까 생각한다.
- [경력직 채용, 그 태도에 관하여 2 | ㅍㅍㅅㅅ](https://ppss.kr/archives/158806) - '회사를 떠나는 이유는 회사 그 자체 때문이 아니라 사람 때문이다' 라는 이야기가 있다. 경력직 채용이 실패하는 경우는 그 사람 하나하나가 모여 형성한 집단의 잘못된 문화에 있지 않나 하는 생각을 하게 만드는 글이었다.

## Developer

- [A Thorough Introduction to Git's Interactive Patch Mode - DEV Community 👩‍💻👨‍💻](https://dev.to/krnsk0/a-thorough-introduction-to-git-s-interactive-patch-mode-4bl6) - Git Patch 모드를 사용하는 방법. 가능하면 Git CLI로 파일 스테이징을 할 때 `git add -p` 를 쓰려는 습관을 들이고 있는데, 더 자세한 설명이 있으면 좋겠다는 생각을 했었다. 이 글이 모처럼 잘 설명해주고 있어서 차근차근 따라서 해 보기 좋았다.
- [Some of my writing principles - DEV Community 👩‍💻👨‍💻](https://dev.to/ben/some-of-my-writing-principles-k4e) - dev.to의 제작자이자 관리자 Ben Halpern이 기술 관련 글을 작성할 때 유념하는 글 작성 원칙이다. 영어로 된 글이긴 하지만 특별히 영어에 국한하여 생각할 필요도 없고 한글로 쓰더라도 충분히 도움이 될 만한 내용들이다.
- [Advice for Technical Writing | CSS-Tricks](https://css-tricks.com/advice-for-technical-writing/) - 위에 이어 기술에 관련된 글을 작성할 때 필요한 좀 더 구체적인 팁을 나열하고 있다. 이 글은 읽기 그닥 쉽지는 않다. 하지만 영어로 기술 문서를 작성할 일이 있다면 반드시 큰 도움이 될 것이다.
- [쌍무적 계약관계로 성장하는 것에 대해서 | PIGNOSE BARN](https://blog.pigno.se/post/186842352138/%EC%8C%8D%EB%AC%B4%EC%A0%81-%EA%B3%84%EC%95%BD%EA%B4%80%EA%B3%84%EB%A1%9C-%EC%84%B1%EC%9E%A5%ED%95%98%EB%8A%94-%EA%B2%83%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C) - 도제식 교육 같은 방식이 아니고 각자의 도메인에서는 비슷한 레벨에 올라 있으니 서로 다른 직무를 맡고 있는 경우 어떤 식으로 교류를 할 수 있을까? 그리고 그 교류를 통해 어떻게 성장할 수 있을까? 하는 질문에 잘 답해줄 수 있는 글이라고 생각한다.
- [좋은 git commit 메시지를 위한 영어 사전](https://blog.ull.im/engineering/2019/03/10/logs-on-git.html) - 지금도 실무에서 영어로 커밋 메세지를 작성하고 있고, 커밋 메세지 prefix는 [이 가이드라인](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)을 따르고 있긴 하지만, 메세지 본문을 작성할 때 약간 헷갈리는 부분이 있을 때가 있다. 이 글을 참고하여 좀 더 가독성 높은 커밋 메세지를 작성할 수 있겠다.
- [10 simple Linux tips which save 50% of my time in the command line - DEV Community 👩‍💻👨‍💻](https://dev.to/javinpaul/10-simple-linux-tips-which-save-50-of-my-time-in-the-command-line-4moo) - 개발하면서 리눅스(혹은 유닉스 기반의) 환경과 멀리 떨어져있다면 상관 없겠지만, 적어도 나는 그렇지 않다. 요즘이야 오히려 점점 GUI 기반 도구를 즐기고 있지만(특히 Sublime Merge) 언제나 `npm`, `yarn` 외에 쉘 커맨드에 더 익숙해질 필요가 있다고 생각한다. 이 글은 그 중에서도 가벼운 내용이면서 특히 유용한 사용 방법에 대해 설명하고 있다. 파이프 등 이미 알고 있는 것은 몇개 되지 않았기에 유용하게 느껴진 글이었다.

## JS / TS

- [JavaScript: What’s new in ES2019 - Tilde Loop Blog](https://blog.tildeloop.com/posts/javascript-what%E2%80%99s-new-in-es2019) - ES2019 변경 사항 간단 정리. `Array#flat`, `Array#flatMap`, `Object#fromEntries` 추가가 눈에 띈다.
- [GitHub - goldbergyoni/javascript-testing-best-practices: 📗🌐 🚢 Comprehensive and exhaustive JavaScript & Node.js testing best practices (August 2019)](https://github.com/goldbergyoni/javascript-testing-best-practices) - 핸드북 한 권으로 나와도 될 만큼 풍부한 내용의 자바스크립트 & Node.js 테스팅 가이드 및 모범 사례 모음
- [GitHub - xaviergonz/mobx-keystone: A MobX powered state management solution based on data trees with first class support for Typescript, support for snapshots, patches and much more - GitHub](https://github.com/xaviergonz/mobx-keystone) - mobx-state-tree(이하 MST) 의 대안으로 나온 패키지라길래 '뭐지?' 하고 살펴봤더니 MST 메인 컨트리뷰터가 새로 만든 물건이다. 데코레이터를 하드하게 쓰고, 클래스 기반의 문법인게 내 취향이랑 조금 어긋나지만 꽤 좋은 대체제가 될 수 있어보인다.

## Frontend

- [The Guardian digital design style guide](https://design.theguardian.com) - 영국 가디언지의 디자인 시스템. 뉴욕 타임즈, 가디언지 같은 언론사들의 개발 관련 발표나 Github 저장소를 보면 뛰어난 역량을 가진 것으로 보이고, 자연스레 이들이 공개한 디자인 시스템에도 관심이 간다. 저 디자인 시스템을 구현하기 위한 컴포넌트들은 어떤 방식으로 이루어져 있을까?
- [GitHub - lunelson/split-ease: The JavaScript Easing function with a beginning, middle and end](https://github.com/lunelson/split-ease) - 애니메이션에 커스텀 easing(동작 완화, 시작과 끝까지 일관된 속도를 표현하는 것이 아니라 가속도와 증감 등을 주어 사용자에게 자연스럽게 애니메이션을 표현하는 것을 뜻한다)을 쉽게 적용할 수 있게 만들어진 함수 라이브러리.
- [flexbox로 만들 수 있는 10가지 레이아웃](https://d2.naver.com/helloworld/8540176) - VisBug 기여하는 것 때문에 Flexbox에 대해 복습하게 되었는데, 한글로 된 자료중에 아주 잘 정리되어있는 자료라고 생각한다. 보통 ['A Complete Guide to to Flexbox'](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) 같은 유명한 설명글이 있긴 한데 핵심만 쏙 뽑아서 한글로 읽기엔 이 글도 충분.
- [자동으로 박스 레이아웃이 변경되는 스펙](https://www.w3.org/TR/css-display-3/#transformations) - `window.getComputedStyle` 로 DOM의 스타일을 가져와 표시하는 기능을 보다 보니 어떤 요소는 내가 직접 `display: inline-flex` 를 했음에도 불구하고 계산된 스타일에서는 `display: flex` 로 나오는 현상이 있었다. 어림짐작만 하고 있었지만 직접 스펙을 읽어 보니 _blockification_ 혹은 _inlinification_ 이라는 개념이 이미 존재하고 있었다.

## React

- [GitHub - jacobbuck/react-beforeunload: React component and hook which listens to `beforeunload` on the window when mounted.](https://github.com/jacobbuck/react-beforeunload) - 잠깐 `beforeunload` 이벤트에 맞춰 특정 로직이 실행될 수 있도록 훅을 만들어볼까 생각하고 있었는데, 마침 만들어진 패키지가 있어서 어떤 식으로 구현되어있는지 살펴보았다. 간단한 훅 라이브러리를 만들면서 사용자가 고려해야 할 만한 부분은 다 잘 고려하여 만들어졌기 때문에 로직은 단순할지라도 자신의 훅을 만들어 다른 사용자에게 공개하고자 한다면 최소한 여기서 사용하는 방법처럼 기본 타입 체크, `propTypes` 적용등은 해 주는게 좋다.
- [How using component-based design helps us build faster](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/buildingfasterwithcomponents.html) - 컴포넌트 중심의 프론트엔드 개발이 트렌드가 된지 몇 년이 지났다. 트위터도 어느새 리액트 기반으로 클라이언트 개발을 하고 있는데(정확히는 `react-native-web` 을 적극적으로 활용한다고 한다) 이 글은 실질적으로 개발보다는 디자인 쪽에 더 관련이 있다. UI를 만드는 사람으로서 리액트 기반의 개발을 몇 년째 해오면서 오히려 나는 디자인에 더 많은 관심이 생겼다. "어떻게 사용자에게 통합되고 일관된 경험을 제공해줄 수 있는가?" 라는 질문의 답 중 하나가 컴포넌트 기반 개발이라고 생각한다. 아래는 본문 주요 내용 중 한 구절을 번역한 것이다.
  - "컴포넌트 기반의 디자인과 함께라면, 개발 과정은 바퀴를 재발명하는 것 보다 계속 조합하는 행위가 됩니다. 공통의 컴포넌트를 블록 단위로 삼고 사용하는 것은 어떤 것이 중요한지 집중하게 하고, 세부 구현에 집착하느라 수렁에 빠지는 일로부터 자유롭게 만들어 줍니다."
- [Modern React testing, part 1: best practices — Artem Sapegin’s Blog](https://blog.sapegin.me/all/react-testing-1-best-practices/) - 내가 여태 읽었던 리액트 테스팅에 관한 글 중 좋은 내용 + 핵심만 간결하게 잘 정리되어있는 글이다. 리액트 애플리케이션 테스팅의 개념을 궁금해하는 사람에게 먼저 추천해주고 싶다. 실전 테스트를 작성하는 다음 포스팅들도 기대된다.
  - 월말에 포스팅을 위해 링크를 다시 확인해 보니 [2편](https://blog.sapegin.me/all/react-testing-2-jest-and-enzyme/)과 [3편](https://blog.sapegin.me/all/react-testing-3-jest-and-react-testing-library/)도 올라왔다.
- [Scheduling in React | Philipp Spiess](https://philippspiess.com/scheduling-in-react/) - 브라우저의 자바스크립트 메인 스레드는 기본적으로 싱글 스레드이며, 서비스 워커를 사용한다면 별도의 스레드를 운용할 수 있다만 할 수 있는 일에 약간 차이가 있다. "그렇다면 요즘 리액트 코어 팀에서 열심히 개발하고 있다는 동시성(Concurrent) 모드는 어떻게 이루어지게 될까?" 하는 궁금함을 가지고 있다가 다른 분이 추천해주셨던 글이다. UI에서 스케쥴링이 왜 필요한지 간단히 확인해보고, 브라우저 이벤트 루프를 복습한 뒤, (약간 구 버전이긴 하지만) 리액트의 Concurrent 모드를 사용한 예제를 살펴보고 한계점을 짚어본다.
- [General Layout System](https://basarat.com/gls/) - 타입스크립트 구루 중 한명인 [Basarat Ali Syed](https://github.com/basarat)가 최근에 공개한 리액트용 레이아웃 시스템이다. [이전에 이 사람이 만든 TypeStyle이라는 패키지로 유용하게 스타일을 작성했었는데](https://rinae.dev/posts/typestyle-basic), 이 시스템도 TypeStyle을 적극적으로 활용했다. 이 패키지 자체보다 문서에서 설명하는 Spacing, Sizing, Scrolling 에 대한 원칙을 설명한 글이 유용하고 공감되는 부분이 많아서 CSS 레이아웃에 대해 고민하면서 읽어보길 권하고 싶다.

## OSS

- [metatron-discovery 저장소의 Github 스타 어뷰징 사건](https://github.com/metatron-app/metatron-discovery/issues/2405) - 보자마자 어뷰징을 정말 신박한 방식으로 한다고 생각했고 개발자와 마케팅 부서와 손발이 맞지 않아 생긴 문제라고 생각했으나, 프로젝트 오너가 단 댓글을 통해 이 프로젝트를 개발한 사람들도 아무런 문제 의식을 느끼지 못하고 있다는게 밝혀졌다. 스스로의 노력을 엎어버리고 더 나은 방법으로(컨퍼런스에 참여해서 발표를 하거나 기술 문서를 작성하여 알리는 등) 홍보를 하는 것이 아니라 편한 길을 취하려다 오히려 욕을 먹게 된 사례로 보이는데 뻔뻔한 것도 정도가 있다.

## Tools

- [TLDR This - Free automatic text summary tool](https://tldr.hackeryogi.com/?ref=producthunt) - 문서 링크나 텍스트를 입력하면 머신 러닝 기반으로 처리된 5개의 문장으로 요약해서 내보내주는 서비스(무료). 이런 서비스가 더 고도화될 수록 글을 읽기가 더 편해지겠지. 비슷한 서비스로 [I Lazy to Read](https://ilazytoread.herokuapp.com/)도 있다.
- [GitHub - miname/Korean-Spelling-Checker-Workflow: macOS X Automator의 workflow 형태로 작동하는 한국어 맞춤법 검사기.](https://github.com/miname/Korean-Spelling-Checker-Workflow) - macOS 오토메이터를 활용한 한글 맞춤법 검사기 실행 서비스. 이미 [Checkor](https://apps.apple.com/kr/app/%EC%9A%B0%EB%A6%AC%EB%A7%90-%EB%A7%9E%EC%B6%A4%EB%B2%95-%EA%B2%80%EC%82%AC%EA%B8%B0-checkor-desktop/id1238750814?mt=12)를 설치해놓고 드문드문 쓰고 있지만, 이 검사기는 별도의 앱 설치가 아니라 오토메이터를 활용했다는 점, Popclip 익스텐션도 제공한다는 점이 마음에 든다. 비교해가면서 써 봐야겠다.
- [Tree - ツリー状に書く、マークダウンドキュメント。 - Tree](https://tree.md) - 트리 형태로 각각의 마크다운 문서 노드를 작성할 수 있게 되어있는 저작 도구. 아직은 서비스 초기 단계인지 몰라도 딱히 가격 정책같은 내용이 없다. 아주 가끔 마인드 맵을 쓸 때가 있는데, 항상 쓰질 않으니 비용 지불하긴 애매하던 차에 아주 좋은 대안으로 보인다. 마인드 맵 이외에도 다양한 활용 방법이 있을 것이다.
