---
title: "VisBug 기여 이야기 - 2"
slug: "journey-to-contribute-to-visbug-2"
pubDatetime: 2019-10-05
tags:
  - OSS
  - JavaScript
description: "작은 버그 하나를 해결하면서 겪어본 소통, 테스팅 이야기"
---

- 이슈 링크: [https://github.com/GoogleChromeLabs/ProjectVisBug/issues/384](https://github.com/GoogleChromeLabs/ProjectVisBug/issues/384)
- PR 링크: [https://github.com/GoogleChromeLabs/ProjectVisBug/pull/388](https://github.com/GoogleChromeLabs/ProjectVisBug/pull/388)

지난 번에 간단한 이슈를 해결하고 자신감이 붙어서 새로이 해결할 이슈에 대해서 고민하고 있었다. 마침 최근에 프로젝트 작성자 아담이 대거 이슈를 업데이트 하여 살펴 보니 a11y(접근성) 도구를 켰을 때 SVG는 제대로 수치가 표시되지 않는 버그가 올라와있었다. 마침 접근성을 더 잘 알아보고 싶다는 생각을 하고 있었고, 비교적 신선한 버그라 한번 해결해보기로 마음먹었다.

먼저 얼마나 어려울까 싶어서 한번 코드를 살펴보았다. `accessibility.js` 파일 안에 `determineColorContrast` 라는 함수가 실질적으로 접근성 수치를 계산하는 역할을 맡고 있는데, 이 안에서 콘트라스트를 구하기 위해 비교하는 대상은 `color` 속성과 부모 엘리먼트의 배경 색상이다. `color` 속성은 오로지 텍스트 컬러만을 이야기하는 것이라서 당연히 SVG의 컬러를 구해낼 수 없다.

```js
const determineColorContrast = el => {
  // question: how to know if the current node is actually a black background?
  // question: is there an api for composited values?
  const text = getStyle(el, "color");
  const textSize = getWCAG2TextSize(el);

  let background = getComputedBackgroundColor(el);

  const [aa_contrast, aaa_contrast] = [
    isReadable(background, text, { level: "AA", size: textSize.toLowerCase() }),
    isReadable(background, text, {
      level: "AAA",
      size: textSize.toLowerCase(),
    }),
  ];

  // ...
};
```

그런데 언뜻 보면서 든 의문이 'SVG가 아이콘 스타일로 되어있다면 단일 컬러라서 콘트라스트를 구하기 쉽겠지만, 여러 컬러로 이루어진 이미지 형태의 SVG의 콘트라스트는 어떻게 구하는가?' 였다. 조금 고민을 해 보다 딱히 답이 떠오르지 않아서 Gitter 채팅방에 들어가 문의를 해 보았다.

몇번 아담과 채팅이 오가고 나서 SVG 노드 자체에 대해서는 `fill` 이나 `stroke` 속성이 없으므로 그 안의 컬러를 구할 수도 없거니와, 만약 특정 노드의 밑바닥까지 타고 들어가서 값을 검사해본다는 아이디어가 있을지라도 VisBug의 역할은 아니라는 결론을 얻었다.

1. `determineColorContrast` 함수에서 `fill` 값을 체크하고, 찾았다면 사용한다.
2. 없다면 `stroke` 값을 사용한다.
3. `stroke` 도 없다면 기존에 구현된 대로 `color` 값 기반으로 나머지 로직이 실행되도록 한다.

위 방식의 로직을 구현해보기로 한다.

---

생각보다 어려운 작업은 아니었다. 원래부터 `getStyle(el, attr)` 방식으로 엘리먼트의 속성을 구하는 함수가 추상화되어있었기 때문이다. 다만 세번이나 호출해야한다는게 조금 마음에 들지 않았다.

```js
// before
const text = getStyle(el, "color");
// after
const color =
  getStyle(el, "fill") || getStyle(el, "stroke") || getStyle(el, "color");
```

깔끔하게 한방에 함수 하나 호출하는 방식으로 하려 해도 어차피 `window.getComputedStyle` 을 써야 하기 때문에 그냥 이런 방식으로 해결하기로 했다.

또한 어차피 SVG 노드는 저걸 구해서 계산하는게 의미 없을 것이라는 생각이 들어서 마우스가 위에 올라갈 때 타겟이 SVG라면 아예 툴팁이 나오지 않도록 만드는 방안에 대해서도 생각해봤다.

```js
if (
  isOffBounds(target) ||
  target.nodeName.toUpperCase() === "SVG" ||
  target.nodeName === "VISBUG-ALLYTIP" ||
  target.hasAttribute("data-allytip")
) {
  // ...
}
```

이상하게 `nodeName` 이나, `tagName` 같은거는 기본적으로 다 대문자로 나온다고 알고 있었는데 처음에는 `toUpperCase` 를 호출하지 않았다가 툴팁이 계속 표시되길래 살펴보니까 `svg` 는 소문자로 나오고 있었다. 검색을 해 보니 완전히 모든 노드가 대문자로만 나오는게 아닌가보다.

---

PR을 올리고 몇일 뒤 피드백을 받았다. 다 잘 동작하긴 하는데, Gitter에서 채팅으로 나누었던 피드백 중에 **SVG 노드에 해당하는 툴팁을 아예 감추는 것 보다 다른 텍스트를 보여줄 필요가 없을까?** 하고 묻는게 있었다. 나도 언젠가는 a11y 툴팁으로 표시할만한 정보가 없는 노드의 경우 다른 텍스트를 보여주는 식으로 안내하는게 낫다고 생각하고는 있는데, 이번 이슈나 PR에서 바로 해결해야 할 필요는 없고, 실제로 내가 올린 커밋을 기반으로 glitch에 배포하여 살펴보니 이 정도면 충분하다는 이야기를 들었다.

그리고 어떤 노드에 의도적으로 `fill` 이나 `storke` 속성을 넣은 경우, 실제 CSS 엔진에서는 무시된다 하더라도 툴팁에는 반영이 되는 문제가 있다. 따라서 속성 검사를 하기 전에 노드의 타입을 먼저 체크해야 할 필요가 하나 더 생겼다. 문제는 '어떤 방식으로 이 노드가 위의 속성을 가지기에 적절한 것인 줄 알 수 있을까?' 이다.

조금 검색을 해 보니 `instanceof SVGElement` 로 검사하는 정도면 충분해보였다.

```js
const color =
  el instanceof SVGElement
    ? getStyle(el, "fill") || getStyle(el, "stroke")
    : getStyle(el, "color");
```

설마하고 저렇게 `||` 를 써 봤는데, 콘솔에서 비슷한 다른 로직으로 체크해보니 동작하는 것으로 보인다. 혹시 몰라 다른 SVG 엘리먼트로도 체크해보니 되는 것 같고, 처음 예상한대로 `h2` 같은 엘리먼트에 `fill` 같은 속성을 넣어도 체크하지 않았다. 몇줄의 코드를 작성하고, 영어로 코멘트를 작성하는 일이 생각보다 오래 걸리는데도 즐겁다.

---

장장 몇 줄짜리 코드 수정을 머지하기 위한 대장정은 아직도 끝나지 않았다. 기능은 잘 동작하지만 `color` 라는 변수명을 `foreground` 로 고치면 어떨까? 하는 제안을 받았다. 대부분 접근성의 컨트라스트를 비교하는 다른 도구들도 비교하는 컬러 값은 `background` / `foreground` 로 되어있으니 충분히 합리적이라 생각했다. 이전에는 단순히 텍스트의 컬러만 가져다 썼으니 `color` 라고 할 수도 있었겠지만 이제 아니니까.

후딱 변수명을 변경하는 커밋을 하고 푸시를 했다. 미리 스포일러하자면 여기서 **일부 변수명을 바꿔주지 않아서 에러가 발생하게 되었다. 하지만 나는 미처 그 사실을 파악하지 못했다. 왜냐면 해당 코드에 대한 테스트를 작성하지 않았기 때문이다.** 거기다 변수명만 고치면 되는거니까 다시 개발 모드를 켜서 직접 확인할 생각도 해 보지 못했다. 때마침 아담이 테스트를 작성해보지 않겠냐고 제안했다. 나도 평소에 UI 테스트 코드를 작성하는데 무척 관심이 많았던 사람인지라 여기서도 도전해보기로 했다.

VisBug의 테스트 구성은 생각보다 그리 나쁘진 않은 상태였다. 모든 상황을 커버하지 못하고 있긴 하지만. 테스트 러너로 `ava` 를 사용하고, 실제 환경처럼 사용자 동작을 시뮬레이션 하고 그 결과를 기반으로 단언을 수행하기 위해 `puppeteer` 를 사용하고 있었다. Cypress가 조금 더 익숙하긴 하지만 puppeteer도 나쁘지 않다고 생각한다. (어차피 둘 다 초보 수준)

하지만 방대한 API에 비해 아는 것도 없었고, 테스트 작성법에 대해 [위키](https://github.com/GoogleChromeLabs/ProjectVisBug/wiki/Testing)에 정리된 것은 그리 많진 않았다.

- 어떻게 테스트를 실행하는가: npm 커맨드들이 소개되어 있었다.
- 테스트 구성을 어떻게 했는가, `ava` 와 `puppeteer` 를 왜 선택했는가

첫 번째 내용만 실질적으로 도움이 되었다. 두 번째 내용은 이미 어느정도 알고 있었으니까.

그래서 직접 puppeteer API 문서를 펼쳐놓고 내가 의도한 사용자 동작을 테스트 코드로 작성하기 시작했다. 그 전에 먼저 기존에 작성되어있던 [테스트 코드](https://github.com/GoogleChromeLabs/ProjectVisBug/blob/master/app/features/guides.test.js)
를 참고하기도 했다.

약간 어리버리 하기도 했지만 테스트 코드까지 작성하여 푸시를 하려니까, 작업실에 있던 맥으로 변수명을 `foreground` 로 바꾸는 커밋을 푸시해놓았던게 떠올랐다. 집에서 할 때는 아직 그 커밋이 반영되지 않은 상태였다. 그래서 최신 커밋을 리베이스 하고 **'어차피 변수명만 바꾼 거니까 다시 확인 안해도 잘 돌아가겠지' 하는 안일한 생각으로 푸시를 했다.** 하지만 CI에서 테스트가 실패했다. 평소라면 이런 일이 일어나지 않았을 것이다. 회사 프로젝트에는 이런 일이 있을까봐 pre-push 훅으로 타입 체킹, 린트, 테스트 수행 등이 다 돌아가도록 만들어놨기 때문이다.

그리고 테스트가 실패했다는 피드백이 있어 다시 코드를 확인해봤다. 로컬에서도 테스트가 실패하기 시작하는데 원인을 도저히 파악할 수 없었다. 내가 시뮬레이션 한 대로 마우스가 특정 위치로 움직이면 `visbug-ally` 라는 엘리먼트가 나와야 하는게 의도된 동작이었지만 도저히 나오지 않았다. 그런데 실제로 어떻게 보이지 않는 것인지 파악하기 힘들었다. 왜냐면 `puppeteer` 는 기본적으로 Headless 모드(실제 UI 창 없이 동작)로 동작하기 때문이다. 그래서 실제로 테스트가 수행되는 상황을 눈으로 확인하기 위해 간단한 스크립트를 사용하여 테스트 케이스를 옮겨보았다.

```js
(async () => {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  await page.evaluateHandle(`document.body.setAttribute('testing', true)`);
  await page.evaluateHandle(
    `document.querySelector('vis-bug').$shadow.querySelector('li[data-tool=accessibility]').click()`
  );

  const svgEl = await page.$("svg");
  const { x, y, width, height } = await svgEl.boundingBox();
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  await page.mouse.move(centerX, centerY);
})();
```

저 부분까지 수행되었다면 접근성 정보 툴팁이 나와있어야 했지만 보이지 않았다. 이제 크로미움 브라우저가 떠 있는 상태니까 내가 원하던대로 동작하지 않았다는 것은 명확하게 파악할 수 있었다. 거기다 혹시나 싶은 마음에 콘솔까지 열어볼 수 있으니 금상첨화다.

![Puppeteer visual testing](@assets/images/2019-10-05_01.png)

그리고 실제로 내 실수로 에러가 발생했다는걸 확인할 수 있었다. 바로 문제의 코드를 수정하고, 혹시 내가 puppeteer API를 잘 활용해서 생긴 문제인줄 알고 찾아봤던 다른 코드들 중에서 유용한 팁도 발견하여 그 팁을 기반으로 테스트를 보강하기도 했다. 그 결과가 위의 스크립트이다.

이를테면 puppeteer 의 마우스 API로는 특정 위치로 이동하는데 선택자를 직접적으로 사용할 수 없고 오로지 X, Y 좌표를 이용할 수 있다. (신기하게도 hover API를 쓸 때는 선택자를 지정할 수 있다) 그래서 내가 원하는 위치로 마우스를 이동시키려면 정확한 좌표를 알아야 하는데, 특정 엘리먼트 위로 마우스를 이동하고자 할 때 아래와 같은 방법을 쓸 수 있다.

```js
// puppeteer 환경을 초기화했다 가정하고
// =============================
// 특정 선택자에 맞는 엘리먼트를 선택한다. `document.querySelector` 와 같은 기능을 한다.
const el = await page.$(".class-selector");
// 해당 엘리먼트 박스 정보를 가져올 수 있다. 패딩, 마진 등을 가져오려면 boxModel()을 호출하면 된다.
const { x, y, width, height } = await el.boundingBox();
// 해당 엘리먼트의 중심점을 좌표로 삼고자 한다면
const centerX = x + width / 2;
const centerY = y + height / 2;
// 이제 마우스를 이 엘리먼트의 중심으로 이동시켜보자
await page.mouse.move(centerX, centerY);
```

아담은 이 프로젝트에 기여하면서 처음으로 테스트를 작성하는 나에게 경험이 어땠는지 물었다. 위의 흐름을 따라 가면서 몇 가지 생각을 정리해봤다.

- 위키 내용이 좀 더 초심자에게 유용했으면 좋았을 것이다. 나는 이미 UI 테스팅에 대해 관심도 있었고, 대단한 수준은 아니더라도 코드를 작성한 경험이 있었기 떄문에 프로젝트의 다른 코드를 기반으로 짧은 시간 안에 테스트를 작성해볼 수 있었다.
- 테스트가 동작하는 환경이 익숙하지 않았다. 모든 것이 CLI로 이루어졌기 때문에 실제로 브라우저가 뜨고 테스트 코드에 선언한 방식대로 유저의 동작을 "아주" 빠르게 흉내내면서 그 과정을 살펴볼 수 있는 Cypress랑은 좀 달랐다.
- 그래도 puppeteer의 API를 문서를 읽어보면서 할 수 있는 일이 생각보다 아주 많다는 것을 알았다. 문서를 읽어보면서 이것저것 확인해보는 과정이 꽤 재미있었다.
- UI 테스트 코드 작성에 대해 잘 모르는 사람들은 위키에 테스팅 부분 페이지를 들어가면 어디서 뭘 해야할지 잘 모를 것이다. 나라면 이런 내용을 보강했을 것이다.
  - 테스팅 라이브러리의 API 문서 링크 (`ava`, `puppeteer`)
  - 테스트에 유용하게 사용할 수 있는 헬퍼 함수가 어떤게 정의되어 있고, 어떻게 쓰면 되는지
  - 위의 스니펫처럼 '원하는 엘리먼트에 정확히 접근하는 방법' 같은 팁
  - CLI로는 문제 파악이 되지 않을 때 puppeteer의 헤드리스 모드를 끄고 디버깅하는 법

---

마지막 내용을 추가하고 금방 머지가 될 줄 알았는데 거의 일주일 동안 소식이 없었다. 설마 싶어서 아담에게 멘션 코멘트를 남겨서 혹시 진행된걸 잊어버리진 않았는지 가볍게 찔러주었다. 그러고 다음날이 되니 '알려줘서 고맙다' 면서 드디어 PR이 머지되었다. 처음 PR을 작성한게 12일 전이었으니 실제로 논의를 시작한 것 부터 생각하면 2주일은 족히 걸렸다.

테스팅 제외하고 고작 몇 줄짜리 코드를 기여한 것에 불과했지만, 오폰소스 기여를 하면서 영어로 대화하는 요령 약간, UI 테스팅 작성에 대한 자신감 약간, 문제를 해결하는 과정에서 한번 더 고민하는 법 등 기여 과정에서 소통과 테스팅을 하며 많은 것을 배울 수 있었다.
