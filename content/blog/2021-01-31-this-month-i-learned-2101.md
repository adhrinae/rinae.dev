---
title: This month I Learned - 2021년 1월
slug: this-month-i-learned-2101
description: 2021년 1월동안 익혔던 / 읽었던 것들 정리
date: 2021-01-31
tags:
- TIL
---

## Developer

- [엔지니어링 매니저를 위한 추천 도서 | GeekNews](https://news.hada.io/topic?id=3560)
  - 어쩌다 보니 나를 포함한 두 명이서 한 팀이 되어있고, 장기적으로 이 팀을 이끌어야 하는 입장이 되었다.
  - 지난 번 팀의 팀장님께 '개발 7년차, 매니저 1일차' 도서를 선물해드린 적이 있었는데, 이제 나도 그 책을 봐야할 때가 된걸까...

## JS / TS

- [Typescript Helper Types · GitHub](https://gist.github.com/ClickerMonkey/a081b990b9b14215141fb6248cef4dc4)
  - 타입스크립트 헬퍼 타입 모음집. 조금 어려운 부분도 있지만, 상대적으로 쉽고 실용적으로 접근할 수 있는 타입들도 있으니 한번 쭉 읽고 따라쳐보고 활용해볼만 하다고 느꼈다.
- [Joe Fallon's Blog | TypeScript try/catch/finally and Custom Errors](https://joefallon.net/2018/09/typescript-try-catch-finally-and-custom-errors/)
  - 일단 제목에는 타입스크립트가 언급되어있긴 한데 자바스크립트로 에러를 처리하는 법 모범 사례(Best Practice)를 안내하고 있다.
  - 에러를 캐치할 때 타입 정보를 제대로 캐낼 것
  - `Error` 객체(혹은 이를 상속한 객체)를 활용하고 그 외의 단일값은 최대한 지양할 것
  - `finally` 구문에서 리소스 해제
  - 에러를 특정할 것. [ts-custom-error](https://www.npmjs.com/package/ts-custom-error) 같은 패키지가 도움이 된다.
  - 에러를 삼키지 말 것 (`catch` 블락에서 먹어버리는 행위)
  - `throw` 를 goto 문으로 쓰지 말 것
  - `catch` 문을 로깅 후 다시 에러를 던지는 용도로 사용하지 말 것 (로그 중복 호출됨)
- [Do Not Catch Exceptions in TypeScript | by Tomáš Veselý | Medium](https://medium.com/@VeselyCodes/do-not-catch-exceptions-in-typescript-241c411c0cb5)
  - 바로 위의 링크를 읽고 정리했던 이유는 일단 이 글을 읽으면서 생각을 좀더 확실히 하기 위해서였다. 이전에 포스팅으로 ['에러 처리를 어떻게 하면 좋을까'](https://rinae.dev/posts/how-to-handle-errors-2) 하고 고민을 해본 흔적은 있으나 명확한 결론은 내지 못한 채 코드의 유지보수성은 나락으로 떨어져갔다.
  - 결국 중간 과정으로 어중간하게 `Either(Result)` 모나드를 활용하는 듯한 코드가 나오자, 이럴거면 이런 방식으로 에러를 처리하기 위한 당위성을 명확히 정리하여 팀 내부에 공유하고 필요한 도구를 도입하여 에러 처리 방식을 개선하자는 생각을 냈다.
  - 이 글의 핵심은 '기대할 수 있는 에러(Expected Error)' 는 던지지 말고 다른 방식으로 처리하자는 것이다. 위의 에러 처리 모범 사례 글에서 커스텀 에러가 언급되긴 했지만, 이런저런 문제가 있다는 것이다. 특히 "에러를 뱉을 수 있는 함수가 정확히 무엇을 뱉는가?" 를 특정하기 어렵다. `throw` 문으로 던져지는 에러는 리턴 타입이 아니고, 타입스크립트 타입으로 정의할 수 없기 때문이다.
  - 그래서 `value`, `error` 가 있는 `Result` 타입 이야기를 꺼낸 것이고, 이 글에서는 실제로는 써먹기 어려운 아주 낮은 수준의 예제를 제공하고 있지만 충분히 타입스크립트로 명시적인 에러 처리를 위한 아이디어는 얻을 수 있었다.
  - 덕분에 [neverthrow](https://github.com/supermacro/neverthrow) 라는 라이브러리를 알게 되어 활용할 수 있게 되었다. 3년 전에 썼었던 Either 모나드 구현체에 비하면 아주 높은 수준으로 발전되어 있고 문서화도 잘 되어있어서 적극적으로 수용해보려 한다.

## Frontend

- [The trick to viewport units on mobile | CSS-Tricks](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)
  - 업무에서 모바일 대응을 할 일은 거의 없지만, 모바일로 접속한 사용자를 위해 프로토타입 재생을 위한 전용 페이지가 있다. 그런데 이전부터 iOS 사파리로 접속했을 때 앱으로 여는 것을 유도하는 버튼의 위치가 하단 툴바에 가려지는 문제 때문에 궁여지책으로 `document.documentElement.clientHeight` 을 처음 페이지 로딩 시 고정값으로 쓰고 있었다. 이렇게 하면 사용자가 직접 툴바를 없애는 동작을 실행할 시 레이아웃이 또 깨지기 때문에 제대로 된 해결책을 적용하지 못한 셈이었다.
  - 그렇게 돌아만 가는 식으로 오랫동안 방치하던 페이지를, 이번에 landscape 지원을 하면서 다시 이런저런 수정을 가할 일이 생겼다. 구현은 팀 동료분이 하고 계시긴 하지만, 관련된 레이아웃을 잡는데 도움이 되도록 같이 조사를 조금 하다보니 괜찮은 글을 발견했다. `window.innerHeight` 을 잡아내서 임의의 CSS 변수로 할당하고, 그 변수가 `100vh` 보다 약간 낮지만 연관된 수치가 되도록 조정을 하는 것이다. 그리고 `calc` 함수를 이용하여 계산하도록 하는 것이다.
  - 아마 회사에서 모바일 애플리케이션에 들어가는 웹뷰를 작업하시는 분들이나 모바일 웹사이트 대응을 많이 해야 하는 분들은 이미 경험을 통해 충분히 숙지하고 있을만한 해결책이라고 생각된다.
  - [연관된 글로 이 글도 매우 유용한데](https://allthingssmitty.com/2020/05/11/css-fix-for-100vh-in-mobile-webkit/) 사파리 웹킷에만 적용되는 속성인 `-webkit-fill-available` 을 이용하여 사파리의 툴바 문제는 그럭저럭 해결할 수 있다 하더라도 다른 브라우저의 레이아웃에 맞추는 것은 어차피 윗글의 설명대로 해야 될 것이다.
- [The State of CSS 2020: Trend Report](https://2020.stateofcss.com/en-US/report/)
  - TailwindCSS의 높은 관심과 올라가고 있는 사용률 (하지만 아직 적용되고 있는 정도는 높지 않음)
  - Sass는 높은 만족도와 사용율을 보이고 있음, 주로 많이 사용되면서 만족도가 높은 것은 (PostCSS, Styled Components, BEM, Sass)
  - CSS-in-JS에서는 Styled Components, CSS Modules가 많은 인지도 및 사용층 확보, 그 뒤를 이어 Styled JSX
  - CSS 자체도 많이 변화하고 있으며 Grid 등의 인지도 및 사용율은 꽤 높음. `preferes-reduced-motion`(사용율 15%), `preferes-color-scheme`(사용율 18%) 새 미디어 쿼리도 잘 활용되고 있음
  - 새로운(발전하고 있는) CSS에 대한 만족도는 대체로 73.9%로 매우 높음(만족 62.1% + 매우 만족 11.8%). 매우 불만족하는 사용자층은 1%에 불과함
- [Programmatic file downloads in the browser - LogRocket Blog](https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/)
  - 특정 페이지에 접속할 때 비밀번호를 입력하여 들어간 다음, 패스워드 입력에 성공한 컨텐츠를 다운로드 받을 때 아무런 보안 제약이 없는 `<a href>` 태그를 클릭만 하는 것이 아니라 `fetch` 를 통해 GET 요청을 서버와 주고받는 식으로 파일을 다운로드 받는 기능을 구현해야 했다.
  - 언제나 대체로 유용한 정보를 제공하는 LogRocket 블로그 답게 내가 필요한 정보 뿐 아니라 '브라우저에서 파일을 받는 방법' 이라는 것을 A부터 Z까지 잘 짚어서 알려준다. 저기서 나는 응답을 `blob` 객체로 만든 다음 `URL.createObjectURL` 함수에 넘기는 방식을 활용했다.
- [CSS-in-JS에서 CSS-in-CSS로 바꿔야 하는 이유 | bono blog](https://blueshw.github.io/2020/09/14/why-css-in-css/)
  - 사실 이 글은 너무 피상적인 부분에 대해서 다루고 있다고 생각해서 내용이 일부만 공감이 갔다. 하지만 필력이 무척 마음에 들었다. 글쓴 분의 블로그의 다른 글과, 브런치에 연재중인 에세이를 틈 나는대로 읽어보고 싶다는 생각이 들 정도였다.
  - CSS-in-JS 상태계는 여러 세대로 나뉘어 계속 다음 세대가 나올 수록 발전하고 있다. 그 도약은 상상을 초월할 수준이다. 또한 다양한 형태의 최적화 방법론이 도입되고 있으므로, 더 깊이 알아볼 필요가 있다고 느꼈다. 
- [html - How to hide the eye from a password input in MS Edge and IE - Stack Overflow](https://stackoverflow.com/a/61450596)
  - Edge 브라우저를 검수할때 깊게 들여다보지 않다 보니 패스워드 입력 필드에서 별도로 reveal 버튼이 나오는 줄 몰랐었다.
  - 이미 패스워드 입력용 컴포넌트에 reveal 버튼을 만들어두었기 때문에 불필요한 중복 기능이므로 지우려고 보니까 이런 답변이 있었다.
  - 본문의 속성을 IE 및 레거시 엣지 브라우저에서만 있는 이슈처럼 되어있는데 최신 버전 엣지 브라우저에서도 나타나는 문제더라.
- [GitHub - felipefialho/frontend-challenges: Listing some playful open-source's challenges of jobs to test your knowledge](https://github.com/felipefialho/frontend-challenges)
  - 오픈소스로 공개되어있는 채용 사전 과제들 링크 모음
  - 주로 영어와 포르투갈어로 된 저장소 링크가 많다. 포르투갈어(브라질 회사)의 링크가 많다는게 조금 놀라웠다.
  - 각 과제는 주로 Readme 파일 하나만 제공되며, 구현해야 하는 내용에 대해 상세한 명세가 적혀있다. 이 명세에 제시된 기술 스택으로 본인 나름의 풀이를 시도해보는 것이 꽤 재미있는 도전이 될 것이다.
  - 몇개 훑어보면서 단연 눈에 띄는게 있다면 [공개된 iTunes API 를 이용하여 Top 100 앨범을 나열하는 웹사이트를 만드는 과제](https://github.com/exzeo/FrontEndChallenge)였다. 필수 구현사항을 제시하고, 각 레벨별로 이러이러하게 구현한다면 Novice, Intermediate, Expert 레벨일 것이라고 추가 기준을 세워주는 부분이 마음에 들었다.

## React

- [AddyOsmani.com - React Server Components](https://addyosmani.com/blog/react-server-components/)
  - 2020년 연말에 발표되었던 React Server Components가 기존의 SSR과 어떤 방식으로 다르게 구성되고 활용될 수 있는지 소개하는 글.
  - 기존의 SSR을 대체한다는 개념이 아니라 새로운 접근 + 보완적인 방식이라고 한다. 그래서 Next.js 같은 메타프레임워크와 앞으로 어떻게 결합될지 추이가 기대된다.
  - [번역본도 게시되었다.](https://ui.toast.com/weekly-pick/ko_20210119)

## Tools

- [애플이 만든 무료앱 중 최강! Numbers 활용법! 비용없이 아이폰 아이패드 맥 협업, 교육, 프로젝트 자료 만들기](https://www.youtube.com/watch?v=_FXeDkCSb9k)
  - 스프레드 시트 도구로만 생각하고 있던 Numbers, 어차피 실무에서 스프레드시트를 쓸 일이 있으면 구글 스프레드시트를 많이 쓴데다 Excel과의 호환성이 그리 보장되는 것도 아니라고 생각해서 쓸 일이 없던 도구였다.
  - 그런데 시트 자체를 밀어버리고 내가 편리하게 사용할 수 있는 문서 도구로 활용하는 팁이 아주 유용했다. 한 문서 안에 탭도 지원되는 다양한 형태의 문서가 되는 것이다. 거기다 iCloud를 이용한 협업 기능으로 웹에서도 앱과 같은 수준의 문서 편집이 된다.
  - 내가 아주 가끔 마인드맵을 그리고 싶을 때 사용 빈도에 비해 마인드맵 도구의 가격이 아쉬웠는데, 그런 아쉬움을 덜고 전문 앱보다는 약간 아쉬운 수준이라 해도 훌륭한 수준의 도식을 그려낼 수 있는 도구로 활용할 수 있겠다.
- [GitHub - Caldis/Mos: 一个用于在 MacOS 上平滑你的鼠标滚动效果或单独设置滚动方向的小工具, 让你的滚轮爽如触控板  |  A lightweight tool used to smooth scrolling and set scroll direction independently for your mouse on MacOS](https://github.com/Caldis/Mos)
  - 왼손에는 트랙패드, 오른손은 마우스를 쓰고 있는데 마우스의 스크롤링은 트랙패드의 스크롤링에 비해 뚝뚝 끊기는 느낌이 있긴 해도 원래 그러려니하고 별로 신경쓰지 않았다.
  - 하지만 회사 동료분이 '스크롤이 부드러워진다' 라면서 [Smoothscroll](https://www.smoothscroll.net/mac/)을 추천해주시면서 마우스의 스크롤링이 거슬리기 시작했다. 혹시나 싶어 검색해보니 다행히도 꽤 괜찮은 오픈소스 대체제가 있었다.
- [Simply Piano](https://www.joytunes.com/simply-piano)
  - 피아노 연습용 앱. 우연히 트위터 피드에서 사용 후기를 올리신 분이 있어서 발견했다. 연주하고 있는 악기의 음을 인식하여 곡 연습을 진행할 수도 있고, 난이도에 따라 다양한 코스로 커스터마이징을 할 수 있다.
  - 이런 앱이 있어서 얻을 수 있는 장점은 꾸준한 연습을 하는데 있어 동기부여가 되고, 나의 발전 상황을 좀 더 손쉽게 파악할 수 있다는 것이다. 취미로 피아노 연습을 하는 것에 동기부여가 조금 떨어지고 있던 나에게 활력소가 되어주리라 기대하고 사용해본다.
- [CV - Mindful professional profiles](https://read.cv)
  - 깔끔하고 공유하기 쉬운 형태로 이력서를 작성할 수 있는 사이트. 작성 뿐 아니라 같은 프로젝트를 참여했던 구성원들을 태그하거나 할 수 있어서 자연스럽게 Collaborative Profile 을 만들 수 있다고 주장한다.
  - 이력서 슬슬 갱신할 때가 되었다고 생각했는데 이걸 이용해서 더 가벼운 마음으로 작성해볼 수 있겠다.
- [‎Input Source Pro on the Mac App Store](https://apps.apple.com/us/app/input-source-pro/id1537056428)
  - 요즘 입력기 전환땜에 삽질하는 이유중에 하나가 '내가 무슨 입력기로 타이핑하고 있었더라?' 였는데, 그 고민은 이거로 해결.
  - 이전에 isHud라는 앱이 꽤 유용했는데 업데이트도 안되고 입력기 전환할 때 안내가 너무 큰 느낌이라 부담스럽기도 했는데 이게 딱 좋다.
