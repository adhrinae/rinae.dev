---
title: "This Month I Learned - 2019년 5월"
postSlug: "this-month-i-learned-05"
pubDatetime: 2019-06-01
tags:
  - TIL
description: "2019년 5월동안 익혔던 / 읽었던 것들 정리"
---

이번 달에는 TIL 문서 정리를 읽자마자 바로바로 하지 못하고 밀린 숙제를 하는 느낌으로 작성했네요.  
5월 한달동안 마음의 여유가 부족했나 봅니다. 읽은 책의 서평이나 별도의 정리도 하지 못해서 아쉽고, 더 잘 공부하고 정리하는 방법을 궁리해봐도 생각보다 뚜렷이 나오지 않아서 아쉽기도 했습니다.

대신 직접 작성한 포스팅과 번역 포스팅을 하나씩(각 포스트별로 1부, 2부) 올려서 약간 뿌듯하네요.

- **에러 처리를 어떻게 하면 좋을까?** - [1부](/posts/how-to-handle-errors-1), [2부](/posts/how-to-handle-errors-2)
- **빠른 개발을 위한 기술** - [1부](/posts/the-fine-art-of-fast-development-kr-1), [2부](/posts/the-fine-art-of-fast-development-kr-2)

---

## 읽을거리/볼 거리 - 일반

- [번역 블로그: 슈퍼셀의 역삼각형 조직 구조: 관리는 줄이고, 성공을 늘리기](https://masterfarseer.blogspot.com/2018/05/blog-post.html?m=1) - 슈퍼셀의 역삼각형 조직 이야기. 슈퍼셀 게임은 하지 않지만 유명세는 알고 있었는데, 성공한 게임들이 어떤 문화속에서 나오는지 조금은 이해하게 되었다. 특히 한 명을 제외한 모든 리더가 부정적으로 생각했던 붐비치의 성공이 흥미롭게 느껴졌다.
- [사람들이 무언가를 다시 하기 싫어하는 이유](http://newspeppermint.com/2019/05/07/m-repeat/) - 나는 당장 넷플릭스를 볼 때도 이미 한번 봐서 익숙한 작품에 손이 먼저 간다. 보통은 경험해보지 않은 것에 손이 먼저 가게 되는 것은 익숙한 것이 지루할 것이라고 생각하기 때문이라 한다. 하지만 오히려 새로운 것을 찾거나 그 결과를 얻기 위해 시간을 쓰는 것 보다 익숙한 것을 다시 접하는게 오히려 효율적일 수도 있다.

## 읽을거리/볼 거리 - 개발자

- [The Power of Composition - Scott Wlaschin - YouTube](https://www.youtube.com/watch?v=WhEkBCWpDas) - 최근에 본 영상 중 함수 합성의 개념을 한 눈에 들어오고 아주 쉽게 설명해준 예라고 한다.
- [Error Handling | Joyent](https://www.joyent.com/node-js/production/design/errors) - 요즘 에러 핸들링 방식에 대해 끊임없이 고민하고 있어서 나의 삽질기에 대한 글을 써볼까 하고 다른 분들에게 의견을 여쭙다가 이 문서 추천을 받았다. Node.js 기반에 약간 이전 스타일로 작성된 코드이긴 해도 _에러란 무엇인가?_ 부터 접근을 하다보니 내가 궁금해 하고, 다지고자 하던 기본에 대해 많이 배울 수 있었다.
- [자바캔(Java Can Do IT) :: 적당히 잘하는 개발자](https://javacan.tistory.com/entry/%EC%A0%81%EB%8B%B9%ED%9E%88-%EC%9E%98%ED%95%98%EB%8A%94-%EA%B0%9C%EB%B0%9C%EC%9E%90?fbclid=IwAR1NMNdYa7fwRwXCa_TkhzeSSLhnXHnzH7fuHFLjnuZOhnk-9-DaaCAFn5g) - 어떤 개발자가 '잘 하는 개발자' 일까? 적어도 이 글에서 말하는 '적당히 잘하는 개발자' 라는 사람은 내 기준에는 충분히 뛰어난 개발자인데다 같이 일하고 싶은 사람이다. 기술적 능력도 물론 중요한 요소이긴 하지만, 결국은 혼자 모든 것을 다 하지 않는 이상 협업이 중요할 수 밖에 없다.
- [프로그래머가 빠지기 쉬운 함정](http://lee-seungjae.github.io/ProgrammersCommonPitfall.html) - 자신의 프로젝트의 기술적 완성도를 높이거나, 주어진 과제를 해결하는 것에 집착하다보면 주변의 상황을 잘 헤아리지 못하는 경우가 있다. 이 글을 읽으면서 나도 반성하는 부분이 있고, 조금 더 현실적인 상황과 프로젝트의 코드 퀄리티 사이의 밸런스를 적절히 맞추고 싶다.
- [The fine art of fast development – Hacker Noon](https://medium.com/@david.gilbertson/the-fine-art-of-fast-development-f3b1abb509da) - 아주 긴 글이지만 그래서 작성자가 친절하게 각 단락마다 짧게 요약을 남겨두었다. 그것만 읽어도 충분할 것 같은데, 자신이 시간을 어떻게 쓰고 있는지 잘 측정하고 여러가지 분산된 활동을 하느라 집중력을 잃기 보다 한가지 작업을 제대로 차곡차곡 진행하는게 좋은 방향이라는 내용이 초반에 담겨있었다.
- [You Are (Probably) Doing Login Systems Wrong · Ticki's blog](http://ticki.github.io/blog/you-are-probably-doing-login-systems-wrong/) - 문득 '로그인을 할 때 클라이언트 사이드 해싱을 해야할까?' 라는 궁금증이 들었다. 첫 회사에서는 당연히 해야한다고 배웠지만 지금은 그렇게 당연하지 않게 느껴졌기 때문이다. 이 글은 그저 참고할 내용일 뿐이고, 결과적으론 HTTPS만 제대로 적용되어 있다면 클라이언트 사이드 해싱은 오히려 요즘 많이 사용하는 패스워드 매니저 애플리케이션의 오동작을 유발할수도 있다는 의견이 있었다.
- [Announcing WSL 2 | Windows Command Line Tools For Developers](https://devblogs.microsoft.com/commandline/announcing-wsl-2/) - MS의 요즘 행보는 정말 대단하다. 이번에는 WSL(Windows Subsystem for Linux)2를 발표하면서 엄청난 성능향상, 새로운 터미널 앱 등 개발자들에게 더 좋은 개발 환경을 제공하기 위해 칼을 갈고 왔다. (왜 이제서야 터미널을 제대로 만든건지 모르겠다만) WSL2가 나오면 다음 개발 머신은 윈도우도 고려해볼많 할까?
- [Ctrl-Alt-Delete: The Planned Obsolescence of Old Coders](https://onezero.medium.com/ctrl-alt-delete-the-planned-obsolescence-of-old-coders-9c5f440ee68) - 나이 든 개발자들이 현역에서 어떤 식으로 물러나게 될까? 점점 개발자의 정년이 늘어나고 있는 추세지만 관리직으로 자연스레 전환되는 형태로 보인다. 하지만 준비되지 않은 상태에서의 단순 보직 전환은 회사나 개인 모두에게 손해만 될 뿐이다. 둘 다 준비를 해야한다.
- [Database의 리플리케이션(Replication)이란?](https://nesoy.github.io/articles/2018-02/Database-Replication) - 지난번에 팀에서 백오피스 설계에 대한 이야기를 옆에서 듣다 보니 데이터베이스의 리플리케이션이라는 단어가 나왔다. 맥락 상 Master-Slave 구조같이 들리는데 정확히 뭘까? 싶어서 찾아보니 개중에 잘 정리되어 있던 글
- [CppCon 2014: Mike Acton "Data-Oriented Design and C++" - YouTube](https://www.youtube.com/watch?v=rX0ItVEVjHc&feature=youtu.be) - 프로그래밍에 대해 새로운 시각을 가져다 준 CppCon 강연이라고 소개되었다. CppCon 유튜브 채널 영상 중 조회수 1위.
- [Sindre Sorhus의 오픈 소스 기여 소회](https://twitter.com/sindresorhus/status/1130791267393163267?s=20) - 최근 수 년에 걸쳐 기여되는 코드의 퀄리티는 몰라도 문제를 해결하고자 할 때 도움이 될 수 있는 최소한의 기본 규칙을 지키지 않고 PR을 올리는 사람이 많은가보다. 결국은 문서화가 중요하고, 다른 사람의 시간을 빼앗을 짓을 하지 말고 미리 체크할거 하고, 테스트 만들고 돌리고, 문서화 하고 제대로 된 제목으로 PR을 올리는게 중요하다는 이야기. [이런 팁도 친히 남겨주었다.](https://twitter.com/sindresorhus/status/1130833503740809216?s=20)
- [쿠버네티스 시작하기 - 쿠버네티스란 무엇인가?](https://subicura.com/2019/05/19/kubernetes-basic-1.html) - k8s는 단어만 많이 들어봤지, 내 직군 특성 상 접할 기회가 지금 시점에선 아예 없다. 그래도 개념정도는 알아두고 싶었는데 너무 어려웠고.. 이번에 김충섭님이 비교적 쉽고 읽을만하게 정리를 잘 해주셨다.
- [docker 2019.pdf - Google 드라이브](https://t.co/yLqQi2RzlQ?amp=1) - 우아한형제들 SRE 이승우님이 공유해주신 도커 알아보기 슬라이드 자료
- [Faster script loading with BinaryAST?](https://blog.cloudflare.com/binary-ast/) - CDN업체로 유명한 Cloudflare에서 페이지 로딩 시 초기 자바스크립트 로딩을 더 빠르게 하기 위해 BinaryAST를 활용한 사례를 보여준다. 먼저 BinaryAST가 무엇이며, 조금 더 구체적인 원리를 설명한 다음 Rust와 결합하는 구조까지 보여주는 글.

## Javascript / Typescript

- [await vs return vs return await - JakeArchibald.com](https://jakearchibald.com/2017/await-vs-return-vs-return-await/) - `async/await` 과 함께 `try/catch` 활용이 다시 되고 있는 추세인데, 정확히 어떤 방식으로 `await` 을 활용해야 하는지 개념을 잡아주는 글. 알고 있던거긴 했는데, `catch` 블록이 없는데 `return await` 을 사용하는 것은 무의미하므로 걸러내기 위한 ESLint 룰이 있다는건 처음 알았다.
- [Advanced functional programming in TypeScript: functional exceptions - codewithstyle.info](https://codewithstyle.info/advanced-functional-programming-typescript-functional-exceptions/) - 타입스크립트로 `Either` 모나드(여기서는 `Result` 라고 부름)를 만드는 방법 소개 - [Error handling in Typescript : typescript](https://www.reddit.com/r/typescript/comments/8l3ar6/error_handling_in_typescript/dzcnh9o?utm_source=share&utm_medium=web2x) - 그와 더불어 자료 조사를 하다가 발견한 레딧인데, 이 코멘트도 조금 다른 방식으로 `Result` 를 구현한 모습을 볼 수 있다.

## 프론트엔드 - 일반

- [최신 브라우저 내부 살펴보기 번역 시리즈](https://d2.naver.com/helloworld/2922312) - [구글 Developer 사이트에 공개되었던 글을 번역한 내용](https://developers.google.com/web/updates/2018/09/inside-browser-part1)
- [Caleb Porzio on Twitter: "🔥😱 Something you probably didn't know HTML/CSS could do. SUPER useful!… "](https://twitter.com/calebporzio/status/1122924167769264130?s=17) - HTML에는 `<details>` 와 `<summary>` 태그가 기본으로 제공되고 이 태그를 활용하여 접었다 펼칠 수 있는 아이템을 만들 수 있다. [(참고 MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) 그리고 여기다가 CSS를 조금만 끼얹으면 자바스크립트를 전혀 쓰지 않고도 모달을 만들 수가 있다는 것을 알려주는 영상.
- [Design for Fingers, Touch, and People, Part 1 :: UXmatters](https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php) - 트위터 타임라인에서 발견된 UX 전문 웹진의 글 중 하나. 거의 논문 급으로 사용자들이 모바일 기기를 어떻게 사용하는 행태를 보이며, 엄지의 동작에 어떻게 신경써야 할지 UX 디자인 전략을 안내해준다. 근데 글이 무척 길어서 손대기 어렵다.
- [Rendering on the Web: Performance Implications of Application Architecture (Google I/O ’19) - YouTube](https://www.youtube.com/watch?time_continue=1578&v=k-A2VfuUROg) - 구글 I/O 영상을 다 챙겨볼 정도는 아닌데 몇 개는 흥미롭기도 하고 추천을 받아서 보았다. 그 중 첫 번째로 SSR(Server side rendering)과 CSR(Client side rendering)의 차이를 자세히 다루는 부분을 바로 핀으로 찍어두었다.
- [WebAssembly for Web Developers (Google I/O ’19) - YouTube](https://youtu.be/njt-Qzw0mVY) - 구글 I/O 영상 두 번째. 웹 개발자를 위한 웹어셈블리 개념 소개 영상이다. 당장 웹어셈블리에 관심이 없는 나도 이 영상의 내용 정도는 한번 봐두는게 좋겠다고 여겨질 정도로 잘 설명을 하는 영상이었다. 어떤 기술이고, 어떤 부분에서 특히 유리하고, 어떻게 적용할 수 있는지 등. 후반부에는 좀 더 디테일한 이야기를 다루는데 그닥 머리에 잘 들어오진 않았다.
- [Build Fast and Smooth Web Apps from Feature Phone to Desktop (Google I/O ’19) - YouTube](https://www.youtube.com/watch?v=w8P5HLxcIO4) - 작은 화면에 상대적으로 더 낮은 성능을 지니고 있는 스마트 피처폰을 위해 빠르고 부드러운 웹 앱을 만들기 위해 거쳤던 여정을 설명한다. 또한 이 와중에 반응형이나 접근성, 지연 로딩같이 절대 그냥 지나갈 수 없는 기본적인 주제들을 설명하는 부분도 나온다.
- [레거시 코드에서 이해하기 쉬운코드로 리팩토링](https://chodragon9.github.io/blog/legacy-code-to-easy-code/) - [조용구님](https://chodragon9.github.io/about/)의 블로그 포스팅. 요즘 좋은 글을 많이 쓰고 공유해주고 계신데, 글 하나하나 좋은 내용이 참 많다. 이번 글을 레거시 프로젝트를 대대적으로 리팩토링하면서 어떤 문제를 파악하고, 더 좋은 형태로 개선하기 위해 현실적인 관점에서 어떤 접근방식에 따라 개선을 하였는지 알려주는 글이다.
- [Edge support · Issue #119 · sindresorhus/ky · GitHub](https://github.com/sindresorhus/ky/issues/119) - 평범하게 ES6+ 기반에 ESModule 문법으로 작성된 라이브러리가 Edge 브라우저에서 동작하지 않길래 뭔가 했더니 이 브라우저는 [객체 리터럴의 전개 연산자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax#%EA%B0%9D%EC%B2%B4_%EB%A6%AC%ED%84%B0%EB%9F%B4%EC%97%90%EC%84%9C%EC%9D%98_%EC%A0%84%EA%B0%9C)(Spread Operator)를 지원하지 않는다. 결국 해결하기 위해 따로 이 녀석만 웹팩 설정에다 `babel-loader` 를 끼얹어서 트랜스파일 되도록 만들어 해결했다. 좀 비효율적이라 아쉽다.
- [프론트엔드 개발자가 겪는 어려움 중 하나에 대한 트윗](https://twitter.com/EBvi/status/1134083041435893760?s=20) - 프론트엔드 개발을 하다 보면 일정, 디자인, 기획 등 다양한 요소에 의해 기껏 만들었던 UI를 갈아엎어야 하는 일이 자주 생긴다. 그 때 스트레스를 받거나 방어적으로 행동하게 되는 요인도 다양하다. 이 트윗 자체 뿐 아니라 인용을 하여 의견을 제안한 다양한 트윗을 보면서 각자의 생각을 정리해보는 것도 도움이 되리라 생각한다. 내 경우는 변경이 일어나는건 문제가 아닌데 합리적인 일정이 주어지지 않으면 스트레스를 받을 때가 많았던 걸로 기억한다. 아니면 변경을 하는데 시간이 오래 걸리게 되는 자신의 실력 미숙에도 스트레스를 받았었다.

## 프론트엔드 - 리액트

- [Building Design Systems With React](https://slides.com/emmawedekind/building-design-systems-with-react) - 이번 리액트 걸즈에서 나왔던 발표. 디자인 시스템이 어떤 것이고 왜 대두되었는지, 리액트로 어떻게 디자인 시스템을 구축할 수 있는지, 디자인 시스템을 구축할 때 신경써야 할 사항(문서화 등)을 짚어주는 슬라이드
- [React Context for State Management from @dceddia on @eggheadio](https://egghead.io/courses/react-context-for-state-management) - 짧고 깔끔한 Context API 강좌. 처음 부분만 봤을때는 '여기 나온 예제 코드를 `useContext` 를 활용하여 고쳐봐야겠다' 생각했는데 강의 후반에 이미 `useContext` 를 사용하는 방법을 소개해준다. 그래도 일부만 소개했기 때문에 전체를 바꿔보는 연습도 매우 좋으리라 생각한다.
- [Always useMemo your context value](https://kentcdodds.com/blog/always-use-memo-your-context-value) - Context API는 다양한 계층에 걸쳐 있는 컴포넌트에 공통된 상태 및 액션을 쓸 수 있도록 만들어주는데 아주 효과적인 API다. 조금만 잘 구성해주면 다른 상태 관리 매니저가 굳이 필요 없을 정도인데, 문제는 최적화를 잘 해주지 못하면 Context가 한번 변할 때 영향을 받는 컨슈머가 실제 자기가 쓰는 값이 변하지 않음에도 불구하고 리랜더링이 일어나서 애플리케이션의 성능이 떨어진다는 문제가 있다. 이 문제를 해결하기 위해 작성자는 Consumer 컴포넌트를 항상 `React.memo` 로 감쌀 것을 권하고 있다.
- [GitHub - imshubhamsingh/file-system-react: File System UI in Web using react](https://github.com/imshubhamsingh/file-system-react) - 리액트로 만들어진 파일 브라우저 웹앱의 목업. 깔쌈하게 잘 만든데다 나름 모달의 Drag&Drop 도 직접 구현했기 때문에 가볍게 소스코드를 구경해볼만 하다.
- [React Code Splitting in 2019 – ITNEXT](https://itnext.io/react-code-splitting-in-2019-9a5d2776c502) - 리액트 애플리케이션에 코드 스플리팅을 아주 잘 설명하는 글이다. 코드 스플리팅이 무엇이며, 왜 하며, 어떻게 할 수 있는지. SSR도 조금 다룬다. 리액트 개발한다면 반드시 읽어볼만한 글이라고 생각한다.
- [How to disable the rule react-hooks/exhaustive-deps? · Issue #6880 · facebook/create-react-app · GitHub](https://github.com/facebook/create-react-app/issues/6880#issuecomment-488158024) - `useEffect` 에서 의존성 배열을 관리하라고 경고를 띄우는 ESLint 룰이 처음엔 굉장히 어색하게 느껴진다. 나를 비롯해 많은 사람들이 여기서 경고를 해소하고자 이런저런 시도를 해보고 있을테고, 이 코멘트와 같이 Dan도 다양한 방식으로 사람들의 이해를 돕기 위해 애쓰고 있다.
- [GitHub - jamiebuilds/unstated-next: 200 bytes to never think about React state management libraries ever again](https://github.com/jamiebuilds/unstated-next) - 선언적이고 간결한 API로 Hook 과 함께 사용할 수 있는 리액트 상태 관리 라이브러리. Redux를 사용하는 것 보다 여러모로 간결함 측면에서 우위가 있다고는 생각하는데, 상태 컨테이너를 여러 개 만들고 한 컴포넌트가 여러 상태 컨테이너를 가져다 쓸 때는 `Provider` 도 중첩해서 써야한다는 약점이 있다. 라이브러리 제작자도 개선을 하고 싶어하지만 리액트 기본 API의 한계가 있나보다.
- [GitHub - shff/my-react-hooks: React/Preact/Orby.js Hooks I used in personal projects, all in public domain form. Copy and paste or do as you wish.](https://github.com/shff/my-react-hooks) - 간단하고 편리하게 구현된 리액트 훅 모음집
- [Ryan Florence의 리액트 Hook ESLint 설정 트윗](https://twitter.com/ryanflorence/status/1130116259125768192) - '나는 개쩌는 리액트 개발자가 아니라서 선뜻 Hook에 발을 들일 수가 없다' 라는 트윗에 라이언이 남긴 답글. 아주 기본적인 린트 설정이지만 이 설정만으로도 충분히 많은 도움을 얻을 수 있긴 하다. 아마 별도의 프로젝트를 설정하는게 아니라 `create-react-app` 을 그대로 쓴다면 이미 적용되어있을 설정이기도 하다.
- [GitHub - bvaughn/react-error-boundary: Simple reusable React error boundary component](https://github.com/bvaughn/react-error-boundary) - 보통 Hook을 쓰게 되면 `componentDidMount` 등의 라이프사이클 메서드를 사용한 에러 처리는 어떻게 해야할지 문제를 겪을 수 있는데(Hook에서 지원하지 않으므로), 이 간단한 컴포넌트를 가져다가 감싸는 것으로 쉽게 처리가 가능해진다.
- [useRect — getBoundingClientRect() React Hook with resize handler](https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846) - 특정 엘리먼트가 반응형으로 너비가 변화하는데, 그 너비를 가지고 다른 차일드 컴포넌트가 랜더링하는 위치를 결정해야 할 일이 생겼다. `getBoundingClientRect` 를 쓰면 되겠지만, 어떻게 그 값을 효율적으로 가져오고 전달할까? 하고 고민하며 Hook을 구상하다 보니 좋은 참고 자료가 있었다.
- [Authentication in React Applications](https://kentcdodds.com/blog/authentication-in-react-applications) - 리액트 애플리케이션에 인증을 붙이고, 인증 여부에 따라 특정 페이지의 접근을 만들기 위해 HOC나 Hook을 쓰게 되는 경우가 있는데, 아예 최상위 컴포넌트에서 인증 여부에 따라 `AutheticatedApp` 혹은 `UnauthenticatedApp` 을 랜더링하는 방식의 접근도 있었다.
- [GitHub - Rocketseat/unform: ReactJS form library to create uncontrolled form structures with nested fields, validations and much more!](https://github.com/Rocketseat/unform) - Formik도 꽤 가볍고 API가 잘 짜여진 라이브러리라고 생각하는데, 그보다 더 심플하면서 사용성 좋은 라이브러리로 보인다. 그리고 이 라이브러리의 예제를 보면서 느낀 건데, 요즘은 유효성 검증을 위해 [Yup](https://github.com/jquense/yup)이라는 라이브러리가 많이 활용되고 있는 걸로 보인다.

## 오픈 소스 프로젝트

- [GitHub - palmerhq/tsdx: Zero-config CLI for TypeScript package development](https://github.com/palmerhq/tsdx) - 타입스크립트로 작성한 코드의 패키지 배포를 쉽게 해주는 툴. Formik 에 사용했던 패키징 방식을 전반적으로 사용할 수 있게 개선했다고 한다. 패키지를 만들고 배포해본 적이 없어서 몰랐지만 은근 타입스크립트로 npm 패키지 만드는게 쉽지는 않았나보다.
- [GitHub - vadimdemedes/pastel: 🎨 Framework for effortlessly building Ink apps](https://github.com/vadimdemedes/pastel) - [ink](https://github.com/vadimdemedes/ink)라는 패키지가 있는데, 리액트를 활용하여 CLI를 만드는 녀석이다. 대체 왜 그런게 있는지 무척 궁금하지만.. 이 패키지는 ink 기반의 CLI 애플리케이션을 손쉽게 만들 수 있도록 도와준다. 리액트에 익숙한데, 필요에 의해 CLI를 구축해야한다면 그리 나쁜 선택은 아닐 것 같다. 하지만 여전히 의문만 남는다.
- [GitHub - koddr/a2hs.js: 📲 A useful modern JavaScript solution that helps your website users to add (install) a progressive web application (PWA) to the Home Screen of their mobile iOS devices.](https://github.com/koddr/a2hs.js) - iOS용 PWA를 손쉽게 만들 수 있도록 도와주는 라이브러리
- [style-guide/OSS.md at master · ridi/style-guide · GitHub](https://github.com/ridi/style-guide/blob/master/OSS.md#open-first-initiative) - 리디북스가 Open first initiative(오픈 소스 라이선스를 우선시하는 정책)을 공개하면서 자사의 스타일 가이드를 하나의 저장소로 열었다. 저장소 내용 자체는 그냥 회사에서 쓰는 컨벤션을 오픈소스로 공개했다는 정도지만, 이 문서에서 소개하는 Open first initiative 정신이 어떤 것인지 좋은 참고자료가 되었다.

## 도구 소개

- [Pock: Display macOS Dock in Touch Bar](https://pock.pigigaldi.com/) - 맥의 터치바를 Dock + ESC 키로 바꿔주는 애플리케이션. 기존에는 BetterTouchTool로 커스터마이징을 조금 해서 쓰고 있었는데, 이정도면 충분히 터치바가 쓸만해진 것 같다. 특히 나 같이 터치바를 기본적으로 숨겨놓고 쓰는 사람들에겐 메우 유용하겠다.
- [Boost Your Coding Fu With VSCode and Vim - Cheatsheet | Barbarian Meets Coding](https://www.barbarianmeetscoding.com/boost-your-coding-fu-with-vscode-and-vim/cheatsheet/) - Vim에 어느정도 익숙해지고 나서, 메인 에디터를 Vim으로 쓰진 않지만 가능한 한 Vim 키바인딩을 지원하는 IDE나 에디터만 사용하고 있다. VSCode는 Vim 확장과 함께 쓰고 있다. 우연히 'Vim 모드에서는 탭 이동을 하는 단축키가 따로 있나?' 하고 찾다가 이 글을 발견했는데, 한번 요령을 익히고 나서는 쓰는 것만 쓰다 보니까 몰랐던 단축키도 있어서 유용했다. 특히 조금이나마 Vim 사용에 관심이 있다면 `vimtutor` 를 한번 해 본 뒤에 이 글을 정독하는 것도 괜찮겠다.
- [Accessibility Insights](https://accessibilityinsights.io) - MS에서 만든 사이트 접근성 검사에 사용하는 브라우저 확장. 가벼운 검사부터 상세한 검사까지 지원하고, 가볍고 빠르다는 장점이 있다.
- [Vim 교정학원 (VIMRC 2019) - YouTube](https://youtu.be/lNWuf48vgV4) - 하나의 트윗에서 시작되어 여러 명이 참여하게 된 Vim 사용자 혹은 입문자들의 모임 및 발표 공간이 마련되었다. 나도 여기서 가볍게 발표 하나를 했고, 같은 취향을 공유하는 분들의 많은 사용기 및 팁을 들을 수 있어서 유익한 시간이었다.
