---
title: "This month I Learned - 2020년 5월"
slug: "this-month-i-learned-2005"
description: "2020년 5월동안 익혔던 / 읽었던 것들 정리"
pubDatetime: 2020-05-31
tags:
  - TIL
---

## General

- [How Notion Uses Notion](https://www.notion.so/How-Notion-Uses-Notion-616f41d2f5124f3185cf1c36d267c07e) - 좀 시간을 들여서 읽으려고 체크만 해 놓은 글이다. 말 그대로 "Notion을 만드는 사람들은 어떻게 자신들의 도구를 활용하고 있는가?" 를 알려주는 글이다. 주요 이미지만 훑어봤을 때는 아주 특별한 레이아웃을 사용한다거나 심화 기능을 사용하는 것 처럼 보이진 않았다. 주요 부분만 발췌독하고 느낀 점은 "문서를 어떻게 정리하고 구조화해야할지 많은 고민이 필요하고, 문서를 사용하는 사람들이 필요한 내용을 잘 볼 수 있도록 만드는 것이 중요하다" 는 것이었다.

  - [How to build a wiki for your engineering team](https://www.notion.so/How-to-Build-a-Wiki-for-Your-Engineering-Team-10d7618fd5774825ad4c8bb8d3cdc32c) - 연관된 글로, 노션의 공식 튜토리얼로 개발팀용 위키 만드는 법이 안내되어 있어 이번에 팀의 노션 페이지 개선을 하면서 이 내용을 참고하여 손을 보려고 계획중이다.

- [Bearded Notionner](https://beardednotioneer.com/) - 분명 Notion 이라는 위키(이젠 노트의 범주는 훨씬 벗어났고, 위키라고 부르기에도 할 수 있는게 훨씬 많다고 생각하지만) 애플리케이션은 다양한 기능을 지원하며 그 활용법이 무궁무진하다. 웹 기반 애플리케이션이라는 한계가 있어서 역시 기본적인 노트 앱은 Bear로 쓰고 있지만, 나름 보조 도구로서 잘 활용하고 싶어서 이런저런 시도를 해봐도 드문드문 벽에 부딪히고 만다. 이 페이지는 각종 활용법을 잘 정리하여 기본 사용법부터 고급 사용법까지 다양한 연재를 하고 있어서 노션 활용법에 관심이 있다면 한번 살펴보기를 추천한다.
- [커리어를 완전히 바꾸는 메모 작성법](https://twitter.com/Imseong/status/1239212007779229696) - 하루 30분은 글을 읽고, 이 글에서 중요한 내용을 자신의 언어로 정리하고, 태그와 링크를 활용하여 그 내용의 연결고리를 끊임없이 만들어나가며, 마지막에는 1주일에 한 번은 자신이 익혔던 내용을 복습하는 것을 권장하는 글이다. 이 글에서 제안하는 방법에 비해 나는 복습 주기가 훨씬 길고 애매한 방식으로 정리하고 있었다는 생각이 들어서 다시 한번 "기록하고 익힌다는 것이 어떤 것인지" 를 고찰하게 한다.
- [Spoqa 기술 블로그 | 스포카가 OKR로 목표를 달성하기까지.](https://spoqa.github.io/2020/05/08/okr-to-goal.html) - OKR, 이야기는 여러번 들었고, 글도 몇 번 읽었지만 팀과 회사에서 그리 잘 확용하고 있지 못하다. 그렇다고 회사와 근로자 개개인이 잘 발맞추어 조직이 이루고자 하는 목표(그리고 개인이 이루고자 하는 목표)를 향해 잘 나아가도록 뚜렷한 대안을 가지고 나아가는 것이 아니라서, 이런 목표 설정 및 달성을 위한 프레임워크를 잘 활용하는 것이 중요하다고 생각한다. 조직 규모도 점점 성장하고 협업할 사람이 늘어나고 있는 상황에서 슬기롭게 목표를 설정하고 달성하기 위해 어떤 방식으로 접근할 수 있는지 많은 참고가 되었다.
- [깔끔한 문장을 위해 버려야 할 번역투 표현 톱12 - 테크잇](https://techit.kr/view/?no=20200419174813) - 이런저런 번역을 해 보면서, 4~5년 전 처음 개발에 관련된 포스팅을 번역했을 때 내가 자주 저질렀던 실수들이 생각났다. 분명 링크의 글에서 광고하는 책 안에는 더 좋은 내용들이 있긴 하겠지만, 요약된 글만 보아도 자주 실수하는 번역투 문장을 많이 바로잡을 수 있다.

## Developer

- [Node 프로덕트 퀄리티를 높이는 협업 방법](https://velog.io/@hax0r/Node-%ED%94%84%EB%A1%9C%EB%8D%95%ED%8A%B8-%ED%80%84%EB%A6%AC%ED%8B%B0%EB%A5%BC-%EB%86%92%EC%9D%B4%EB%8A%94-%ED%98%91%EC%97%85-%EB%B0%A9%EB%B2%95-q29zo12w) - 제목은 Node 프로덕트라고 써있지만, 팀 단위로 협업을 할 때 같이 고민해보고 숙지하면 좋은 내용이었다. 대부분은 실행하고 있는 것들이지만, 그 당위성 및 약간 매끄럽지 못한 부분에 대해 고민할 때 참고할만 하겠다. 물론 저런 프로세스로 개발하지 않는 팀이라면 더더욱 한 번쯤 읽고 현재의 개발 과정을 더 나은 방향으로 이끌어볼 수도 있겠다.
- [XP 실천방법 따라해 보기 - Pair programming과 TDD | Lucas's wiki](https://wiki.lucashan.space/essay/story-for-experienced-to-xp-with-wife.html) - 부부 개발자분이 페어 프로그래밍과 TDD 를 짤막하게 실천하본 경험기. TDD 이야기는 적을 지라도 페어 프로그래밍 내용은 잘 모르는분들이 많이 참고할 만 하다. 나도 실제로 페어 프로그래밍을 할 때 본문에 나왔던 내용을 많이 염두에 두고 진행했었다. 특히 중간에 중단 신호를 보낼 때 말로 하기 보다 특정 신호를 주는 식으로 중단했다는 내용이 있었는데, 다음에 써먹어봐야겠다.
- [Refactoring and Design Patterns](https://refactoring.guru) - 한 번쯤은 들어봤을 법한 디자인 패턴과 리팩토링 기법들을 잘 정리해놓은 웹페이지(이북으로도 출간했다고 한다)이다. 어떤 문제가 있고, 그 문제를 해결하기 위하여 어떤 패턴을 도입하게 되었으며, 그 패턴의 도입 방법과 의사 코드 및 실제 주요 언어를 활용한 예제 코드로 된 구현체와 활용 예를 보여준다.
- \[3분 모나드](https://overcurried.com/3분 모나드/) - 나는 이제 제대로 모나드를 설명하는 법을 잊어버렸다. 그 이전에 잘 알고 있냐고 한다면 링크한 글을 쓰신 분이 설명하는 것 만큼 잘 알고 있지도 못하다. 그런 면에서 "쉽게 설명하는 모나드" 최신판인 이 글은 아주 유용하다고 생각한다. 다만, 어느정도 사전 지식 없이 이 글을 접하면 오히려 "모나드를 설명하기 위한 또 다른 모나드 같은 글" 이라는 인상을 받을 수 있기 때문에 아래의 글이 좀 더 이해하기 쉬울 수 있다. 3개의 글 모두 다 읽어보면 좋을 것이다.

  - [어떻게 하면 안전하게 함수를 합성할 수 있을까? | Evan's Tech Blog](https://evan-moon.github.io/2020/01/27/safety-function-composition/)
  - [옵셔널 체이닝과 await은 같습니다](https://velog.io/@krlrhkstk/%EC%98%B5%EC%85%94%EB%84%90-%EC%B2%B4%EC%9D%B4%EB%8B%9D%EA%B3%BC-await%EC%9D%80-%EA%B0%99%EC%8A%B5%EB%8B%88%EB%8B%A4)

- [GitHub - bradtraversy/design-resources-for-developers: Curated list of design and UI resources from stock photos, web templates, CSS frameworks, UI libraries, tools and much more](https://github.com/bradtraversy/design-resources-for-developers) - 개발자를 위한 디자인 리소스 모음. `awesome` 시리즈가 아니어서 내 눈에 쉽게 띄지 않았었다.
- [Soojin Ro - 모바일 개발자에게 scalability란 뭘까.. 란 궁금증을 오래전부터 지니고... | Facebook](https://www.facebook.com/nsoojin.ro/posts/3245101652254251) - 보통 확장성하면 서버를 먼저 생각하게 되는데, '애플리케이션의 확장성' 이라는 것이 무엇일까를 깨닫게 되는 글이었다. (모바일) 애플리케이션의 확장성이란, 회사가 성장하면서 팀이 점점 커져도 사용자 경험과 개발자 경험을 둘 다 잘 챙길 수 있는 지 여부를 의미한다는 글이었다.

## JS / TS

- [타입스크립트에게 내 의도를 이해시키는 방법 - 김혜성 님 - YouTube](https://youtu.be/bfSKqscC8kc) - 2년 넘게 타입스크립트 + React + MobX 를 다루면서 최근에야 내가 저 셋을 하나도 제대로 다루지 못한다고 느끼기 시작했다. MobX 는 더 적절한 활용방법이 있음에도 문서를 더 깊이 읽어볼 생각을 하지 못했고, 타입스크립트는 기본적인 제네릭 정도만 사용하고, 내가 필요한 부분에 적절한 유틸리티 타입을 만들 생각을 하지 못했다. 특히 `infer` 키워드에 대해 '이걸 어떻게 활용해야하나' 하고 고민하다 포기할 때가 많았는데, 이번 혜성님의 발표를 보고 많은 힌트를 얻어서 차근차근 다시 도전해보려 한다.
- [XState 의 기본 익혀보기](https://rinae.dev/posts/learning-xstate) - Egghead 의 공개 강좌 중 XState 의 기본을 잘 다룬 강좌가 있어서 한번 학습하고 내용을 글로 정리해보았다. 여러모로 잘 만들었다고 느꼈고, 상태 머신의 개념에 대해 계속 관심을 가지게 되는 계기가 되었다.
- [Deno 1.0: What you need to know - LogRocket Blog](https://blog.logrocket.com/deno-1-0-what-you-need-to-know/) - [5월 13일 Deno 1.0 버전이 릴리즈되었다.](https://deno.land/v1) 이런저런 기대를 불러일으킨 것 치고는 "타입스크립트 컴파일러가 병목이다" 라는 릴리즈 노트의 대목이 여러모로 집중포화를 맞고 있긴 하지만, 앞으로 어떤 식으로 발전해나갈지 충분히 주목할 만 하다. 항상 유용한 정보를 올려주는 LogRocket 블로그에서 이번에는 Deno 가 기존의 자바스크립트 에코시스템과 어떤 차이를 가지고 있고, 주요 사용법은 어떻게 되는지 가볍게 짚어주는 글이 나왔다.
- [Mastering Async/Await](https://gcback-1.gitbook.io/mastering-async-await-by-valeri-karpov/) - 최근 우연히 `async` 함수의 버그를 고치다가 '이런 방식의 코드를 작성한다면 차라리 `Promise` 를 사용하는 것이 연산의 흐름이 직관적이고 디버깅하기 편할 것 같은데?' 라는 생각을 한 적이 있었다. 그러면서 다른 분과 논의를 하다 `async/await` 이 `Promise` 대비 Syntactic sugar(편의성 문법) 이상의 장점 외에 또 어떤 특징이 있을까? 라는 고민을 하게 되었다. 분명 편의성 문법을 뛰어넘는 여러 가지 장점을 인지하고 있음에도 내 머릿속에 들어있는 개념이 약간 흐릿하게 느껴지기도 하여 자세한 복습을 해야겠다고 느끼던 차에 이 번역글이 올라왔다. 지금은 중간정도 짚어보고 있는데, Promise 를 직접구현해보는 부분이 매우 인상적이고 도움이 되고 있다고 느낀다.

## Frontend

- [Avoid z-indexes whenever possible - JavaScript in Plain English - Medium](https://medium.com/javascript-in-plain-english/avoid-z-indexes-whenever-possible-10d56a68f81) - 가끔씩 `z-index` 를 다루다 보면 [쌓임 맥락](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) 떄문에 헷갈리거나 레이아웃 잡기 어려울 때가 종종 있다. 다양한 상황이 있을 수 있지만 가능하면 DOM 구조 차원에서 `z-index` 가 굳이 필요 없도록 레이아웃을 최대한 구성해놔야 고통받을 일이 많이 줄어드리라 생각한다. 글의 핵심은 "쌓임 맥락은 다루기 매우 복잡하다. 그런데 DOM 구조 속에 엘리먼트를 어떻게 적절하게 배치하느냐에 따라 `z-index` 를 쓸 일 자체가 많이 줄어든다" 이다. 그래도 예제 코드처럼 `header` 태그가 아랫부분에 있는 것은 조금 어색하게 느껴지긴 한다.
- [The Ultimate CSS Grid Tutorial](https://www.freecodecamp.org/news/complete-css-grid-tutorial/) - CSS 그리드를 사용하는데 참고하기 가장 좋은 문서가 무엇이냐고 물을 때, 보통은 [CSS Tricks 의 글을 먼저 떠올렸다.](https://css-tricks.com/snippets/css/complete-guide-grid/) 하지만 CSS Tricks의 글은 각각의 속성이 어떤 역할을 하는지 설명하는데 좀 더 초점이 맞추어져있는 느낌이어서, 실제로 레이아웃을 구성할 때 어떻게 내가 원하는 레이아웃을 만들어야 할지 바로 감을 잡기 어려워보였다. 하지만 이 글은 큼직큼직한 그림과 글을 통해 주요 속성을 설명하고 실용적인 예를 보여주기 때문에 처음 접근할 때 한번 읽어보기 좋은 글이라고 느꼈다.
- [Mobile First — A Book Apart](http://mobile-first.abookapart.com/) - [국내에 "모바일 우선주의" 라는 제목으로 이미 번역서가 있는 책이지만](http://books.webactually.com/모바일-우선주의/), 웹페이지 형태로 무료로 읽을 수 있도록 공개가 되어 있는 책이다. 이 책 자체는 웹을 디자인하는 사람들을 대상으로 쓰여져 있는 것 같다만, 언제부턴가 CSS 를 작성할 때도 Mobile-First 를 고려하라는 이야기가 많이 나오는 것을 떠올려봤을 때 한번 읽어두면 좋겠다고 생각했다.
- [Facebook의 테크스택 재구축 이야기 | GeekNews](https://news.hada.io/topic?id=2049) - 내가 굳이 정리할 필요 없이 링크 내의 GeekNews 글 안에서 내용이 잘 정리되어있다. 대규모의 개발팀에서 글로벌 서비스의 퀄리티를 높이기 위해 얼마나 극한의 엔지니어링을 했는지 설명하는 글을 보며 입을 다물 수 없었다.

## React

- [ReasonML with Next.JS - YouTube](https://www.youtube.com/playlist?list=PLtDL321SUTJiC2BqrSUzoxozH138y4uhM) - [Reason React 0.80 릴리즈](https://reasonml.github.io/reason-react/blog/2020/05/05/080-release) 소식을 다른 채널로 접하고 나서, '이걸 언젠가 재밌게 써먹을 수 있을까? 그런데 어디부터 시작해야하지?' 라는 생각이 들어서 무턱대고 검색을 약간 해 보았는데 이 재생 목록이 적당히 잘 정리된 것 같아서 훑어보고 담아두기로 마음먹었다.
- [GitHub - thebuilder/react-intersection-observer: React component that monitors when an element enters or leaves the browser viewport.](https://github.com/thebuilder/react-intersection-observer) - 특정 엘리먼트가 뷰포트에 보이는지를 확인해야하는 로직이 있었다. 막연하게 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 를 사용하면 된다는 것은 알고 있었지만, 막상 이걸 이용한 유용한 훅을 만드려고 고민하다보니 기존에 잘 만들어진 패키지를 활용하는게 낫겠다는 결론을 냈다. 그러고 발견한 것이 이 패키지인데 구현된 것 부터 사용법 문서까지 다 잘 되어있는 편이라 유용하게 사용할 수 있었다.

## OSS

- [GitHub - mswjs/msw: Seamless REST/GraphQL API mocking library for browser and Node.](https://github.com/mswjs/msw) - 서비스 워커를 활용한 API 모킹용 라이브러리. 이전에 다른 모킹 라이브러리를 눈여겨보고 기록해둔 적이 있긴 했는데, 완전히 브라우저에서도 동작하고 더 간결해보인다는 장점이 있어서 이 라이브러리가 더 유용해보인다.

## Tools

- [CodeStream - The Code Collaboration Tool Built for Remote Teams](https://www.codestream.com) - 가끔 '단지 PR 말고도 코드 리뷰를 더 효과적으로 하는 방법이 없을까?' 하는 고민을 할 때가 있는데 이 도구는 다양한 IDE/코드 에디터/이슈 트래커와 연동하여 코드에 대한 논의 및 리뷰에 적극적으로 활용하기 유용한 도구로 보여 조만간 도입을 고려하고 있다.
