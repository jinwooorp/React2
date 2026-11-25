# 202430132 진현우

## 1125

### Generic

fetch(url).then((r) => r.json())의 타입 추론은 대체로
any나 unknown으로 추론이 된다

문제는 위와 같이 추론될 경우 이 함수를 사용하는 쪽에서 데이터의 실제 구조를 알 수 없게 된다.

타입 안정성이 낮아져 런타임 오류로 이어질 가능성이 높아진다.

이를 해결하기 위해 typescript에서는 Generic을 제공한다.

타입을 매개변수처럼 사용하여 컴포넌트를 정의할 때 특정 타입에 종속되지 않도록 만드는 방법이다.

타입을 동적으로 지정하여 동일한 로직을 다양한 타입에 대해 재사용할 수 있다.

타입 안정성을 유지하면서, 유연한 코드를 작성할 수 있게 된다.

### Promise<...>란 무엇인가?

- Next.js 15.1부터 주요 내부 API들이 비동기(Promise 기반) 구조로 변경되었습니다.

- 내부 API(예: params, searchParams, headers, cookies)가 즉시 사용 가능한 값이 아니라 비동기적으로 처리되며 Promise를 반환하게 됩니다.

- 즉 Promise<...>는 비동기 연산의 결과를 나타내는 객체 타입으로, 연산이 즉시 완료되지 않고 미래의 어느 시점에서 결과가 결정될 때 이를 표현한다는 의미입니다.

- Promise<{ id: string }>는 미래에 { id: string } 객체를 반환하겠다는 약속입니다.

- 즉, 서버 컴포넌트로부터 Promise<{ id: string }> 객체를 받았다면, 클라이언트 컴포넌트에서는 use Hook을 사용해서 개별 데이터에 접근합니다.

- Next.js 15.1 이전과 이후의 변화입니다.

| 항목      | 15.0 이하             | 15.1 이상                             |
| --------- | --------------------- | ------------------------------------- |
| 구조      | { id: string }        | Promise<{ id: string }>               |
| 사용 방식 | params.id로 바로 접근 | const { id } = await params 사용 필요 |
| 특징      | 동기 객체             | 비동기 객체 (await 필수)              |

### Fetch의 이해

#### .then((res) => ...)

- fetch()가 반환한 Promise 객체가 .then() 메서드를 가지고 있습니다.
- Promise 객체가 resolve(성공)되면 .then()의 callback 함수가 실행됩니다.
- 여기서 res는 서버에서 반환된 Promise 객체입니다.
- Promise 객체는 status, header, body 등 HTTP 응답 전체를 포함합니다.
- res.ok는 상태 코드가 200~299인지 불리언(Boolean)으로 알려줍니다.
- res.status는 숫자로 알려줍니다. (예: 200, 404)
- fetch와 마찬가지로 예외 처리는 별도로 해야 합니다.

```js
function getPosts() {
  return fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
    res.json(),
  );
}
```

#### res.json()

res.json()은 이 Response 객체의 본문(body)을 JSON으로 파싱하는 비동기 함수입니다.

내부적으로 문자열 형태의 Response body를 읽고, JSON.parse()를 수행하여 자바스크립트 객체로 변환합니다.

이 함수도 Promise를 반환하기 때문에 다시 then() 체이닝을 통해 파싱된 데이터를 사용할 수 있습니다.

파싱이 완료되면 resolve(성공)되고, 파싱에 실패(유효하지 않은 JSON)하면 reject(거부)됩니다.

Response body는 한 번만 읽을 수 있습니다. res.json() 또는 res.text() 등 하나만 사용이 가능합니다.

내부적으로는 response stream → text → JSON.parse(text)처럼 동작합니다.

JSON 파싱 에러의 예외 처리가 필요합니다.

# Fetch의 이해

설명을 정리하면 다음과 같습니다.

| 구성 요소 | 소속                | 설명                                          | 예시                   |
| --------- | ------------------- | --------------------------------------------- | ---------------------- |
| `fetch()` | 전역 함수 (Web API) | HTTP 요청을 보내고 Promise<Response>를 반환   | `fetch(url)`           |
| `.then()` | Promise 메서드      | Promise가 완료되면 callback 실행              | `fetch(url).then(...)` |
| `.json()` | Response 메서드     | Body를 JSON으로 변환하는 또 다른 Promise 반환 | `res.json()`           |

```js
import Posts from "@/components/posts";
import { Suspense } from "react";

function getPosts() {
  return fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
    res.json(),
  );
}

export default function Page() {
  // Don't await the data fetching function
  // await를 사용하지 않고 Promise를 반환합니다.
  const posts = getPosts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  );
}
```

### Suspense Component

비동기 작업 중에 ui의 일부를 일시적으로 대채ui(fallback)로 보여주어 사용자 경험을 향상시키는 react 기능

### 핵심기능

비동기 작업이 완료될 때 까지 해당 컴포넌트 트리 랜더링을 일시 중단함

작업이 완료되면 실제 ui를 출력

비동기 로딩 중 보여 줄 fallback UI(로딩 인디케이터 등)를 지정할 수 있습니다.

import하여 사용합니다. import { Suspense } from 'react'

Suspense 내부에 여러 개의 컴포넌트가 있을 경우, 내부 컴포넌트 중 하나라도 로딩 중이면 fallback UI가 표시되고, 모든 작업이 완료되면 한 번에 실제 UI가 노출됩니다.

이 기능을 활용하면 여러 비동기 컴포넌트를 독립적으로 대기하거나, 병렬 로딩 상태를 효과적으로 관리할 수 있습니다.

## 1118

### 알아두면 좋은 점

### Fetching Data (데이터 가져오기) > 1-1. 서버 컴포넌트

1-1. 서버 컴포넌트

- 서버 컴포넌트에서 데이터를 fetch하는 방법은 두 가지가 있습니다.

1. fetch API
2. ORM 또는 데이터베이스

[ 1. fetch API 사용 ]

- 데이터를 가져오려면 fetch API를 사용하여 컴포넌트를 비동기식 함수로 변환하고 다음 fetch의 호출을 기다립니다. 예를 들어:

fetch 응답은 기본적으로 캐싱되지 않는다

그러나 nextjs 는 라우팅 페이지를 미리 렌더링 하고, 성능 향상을 위해 출력을 캐싱됩니다.

2 orm 또는 데이터베이스 사용

서버 컴포넌트는 서버에서 렌더링 되기 때문에 ormd이나 데이터베이스 클라이언트를 사용해서 안전하게 데이터베이스 퀴리를 실행할 수 있다.

컴포넌트를 비동기 함수로 변환하고 호출을 기다린다.

1-2 클라이언트 컴포넌트

클라이언트 컴포넌트ㅔ서 데이터를 fetch 하는 방법은 두 가지가 있다.

1. React의 use Hook
2. SWR OR React 쿼리 같은 통신 라이브러리

use Hook을 사용한 스트리밍 데이터

react의 use Hook을 사용하여 서버에서 클라이언트 데이터를 스트리밍합니다.

서버 컴포넌트에서 데이터를 먼저 fetch하고 그 결과(promise)를 클라이언트 컴포넌트에 prop으로 전달한다.

서버 컴포넌트는 async가 가능하기 떄문에 await fetch()도 사용 가능하다

하지만 클라이언트 컴포넌트에서 async가 불가능하기 떄문에 직접 fetch가 불가능 하다.
(렌더링 중 fetch 금지)

이런 이유 때문에 서버에서 fetch한 결과를 prop으로 넘기고, 클라이언트에서는 use(promise)를 써서 데이터를 가져온다.

### 외부(서드 파티) component

라이브러리 작성자를 위한 조언

- component 라이브러리를 빌드하는 경우, client 전용 기능에 의존하는 진입점에 "use client" 지시문을 추가합니다.

- 이렇게 하면 사용자가 래퍼를 만들 필요 없이 component를 server component로 가져올 수 있습니다.

일부 번들러는 “use client” 지시어를 제거할 수 있습니다.

React Wrap Balancer 및 Vercel Analytics 저장소에서 “use client” 지시어를 포함하도록 esbuild를 구성하는 방법의 예를 확인할 수 있습니다.

## 1111

### Context provider의 동작 순서

동작 순서(버튼 클릭 시 흐름)

1. 사용자가 ThemeStatus의 버튼 클릭.

2. toggleTheme() 호출. (ThemeStatus가 Provider의 함수를 호출)

3. Provider 내부의 setTheme이 실행되어 theme 상태가 변경.

4. 상태 변경으로 Provider와 그 하위 컴포넌트들이 리렌더링되어 theme 값이 최신으로 반영됨.

5. useEffect가 실행되어 document.documentElement.dataset.theme 값도 갱신. (글로벌 스타일 반영)

### Context provider 순서도 형식으로 정리

1. 앱 시작 / RootLayout 렌더

- RootLayout이 렌더되고 ThemeProvider로 children을 감쌈.
- (파일: layout.tsx → ThemeProvider 사용)

2. Context 생성 (초기화)

- ThemeContext = createContext(...)가 정의되어 있음(기본값 제공).
- (파일: src/components/theme-provider.tsx)

3. Provider 인스턴스 생성

- ThemeProvider 컴포넌트가 실행되어 내부 state(theme, setTheme) 생성(useState).
- Provider의 value = { theme, toggleTheme }로 설정.
- (파일: src/components/theme-provider.tsx)

4. 하위 트리 렌더링

- Provider로 감싼 children(페이지/컴포넌트)이 렌더됨. 이 하위 트리는 Context에 접근 가능.
- (파일: layout.tsx → children)

5. Consumer 사용: ThemeStatus 렌더

- ThemeStatus가 렌더되어 useContext(ThemeContext)로 { theme, toggleTheme }를 가져옴.
- (파일: src/components/theme-status.tsx)

6. 사용자 상호작용: 버튼 클릭

- 사용자가 ThemeStatus의 버튼을 클릭하면 toggleTheme() 호출.
- (파일: theme-status.tsx 클릭 → ThemeProvider의 toggleTheme 실행)

7. 상태 변경 내부 처리

- ThemeProvider의 toggleTheme가 setTheme을 호출하여 theme 상태를 변경(예: 'light' → 'dark').
- (파일: theme-provider.tsx)

8. 부수효과 실행 (useEffect)

- theme 변경으로 ThemeProvider의 useEffect가 실행되어 document.documentElement.dataset.theme = theme로 설정.
- (파일: theme-provider.tsx → useEffect)

9. 리렌더링 전파

- state 변경으로 Provider와 그 하위 Consumer들이 최신 value를 받아 리렌더링됨.
- ThemeStatus는 새 theme 값을 받아 UI(아이콘/텍스트)를 갱신함.

10. 결과: 레이아웃/스타일 반영

- data-theme 속성 변경을 바탕으로 CSS([data-theme="dark"] 등)가 적용되면 실제 시각적 테마 변경이 화면에 반영됨.
- (파일: 전역 CSS 또는 별도 스타일 파일)

## 1104

### context

next에서는 context는 react의 context API를 사용하여 컴포넌트 사이에 데이터를 공유하는 매커니즘을 의미한다

부모 컴포넌트에서 자식 컴포넌트로 직접 props를 전달하지 않고도, 특정 데이터를 공유할 수 있다.

### 특징

_전역 상태 관리_

애플리케이션 전체에서 공유해야 하는 데이터를 중앙 집중적으로 관리할 수 있다.

_props drilling 문제 해결_

컴포넌트에서 바로 데이터를 가져올 수 있어서, 코드의 가독성을 높히고 유지보수가 용이해진다.

_react 컴포넌트 사용_

## 1028

### JS bundle 크기 줄이기

client JavaScript 번들의 크기를 줄이려면 UI의 큰 부분을 client component로 표시하는 대신 특정 대화형 component에 "use client"를 추가합니다.

예를 들어, 다음 예제의 `<Layout>` component는 로고와 탐색 링크와 같은 정적 요소가 대부분이지만 대화형 검색창이 포함되어 있습니다.

`<Search/>`는 대화형이기 때문에 client component가 되어야 하지만, 나머지 layout은 server component로 유지될 수 있습니다.

## 1007

### client component 사용

파일의 맨 위, 즉 import문 위에 use client 지시문을 추가해서 client component를 생성할 수 있다.

use client는 server와 client 모듈 트리 사이의 경계를 선언하는데 사용

### 서버 컴포넌트의 작동

next는 server에서 react의 api를 사용해서 랜더링을 조정함
랜더링 작업은 개별 라우팅 세그먼트 별 묶음으로 나뉨(chunk)

RSC라는 특이한 데이터로 렌더링 됨

클라이언트 컴포넌트와 RSC payload는 html을 미리 렌더링 하는데 사용한다

#### RSC(React Server Component)란

렌더링 된 react components 트리를 직렬화 하여 표현한 컴팩트한 형태

client 에서 react가 브라우저 dom을 업데이트 하는데 사용

#### client component 작동

1. html을 사용자에게 경로(라우팅 페이지)의 비대화형(정적)미리보기를 즉시 보여주는데 사용

2. RSC 페이로드는 client와 server component 트리를 조정하는데 사용됩니다.

3. js는 client component를 hydration을 하고, 애플리케이션을 대화혀응로 만드는 데 사용함

###### hydration

hydration 은 이벤트 핸들러를 dom에 연결하여 정적 html을 인터랙티브하게 만든는 react의 프로세스 입니다.

### isLiking state

중복 클릭 방지

ui 피드백
상태 안정화

### Pessimistic update

이벤트 발생 시 먼저 서버에 요청을 보내고, 서버에서 응답응ㄹ 받은 후에 클라이언트ui를 업데이트

- 장점
  서버의 응답을 기반으로 하기 떄문에 데이터의 일관성이 보장된다
  오류가 발생할 가능성이 낮고, 잘못된 정보가 표시될 염려가 없다.

- 단점
  서버의 응답을 기다리는 거라, 응답이 늦어지면 사용자 경험이 저하됨
  특히 네트워크 지연이 발생할 경우 체감속도가 느려짐

### optimistic update

사용자 이벤트가 발생하면 서버 응답ㅇ을 기다리지 않고 클라이언트의 ui를 즉시 변경함

서버의 응답이 없으면 ui를 원래대로 되돌린다.

네트워크 지연 동안에도 앱이 빠르게 반응하다

### server or client component를 언제 사용하는가

client 환경과 server 환경은 서로 다른 기능을 가지고 있다.

사용하는 사례에 따라 각각의 환경에서 필요한 로직을 실행할 수 있다.

**client**

```bash
state 및 event handler 예 onClick, onChange
lifecycle logic 예 useEffect
브라우저 전용 api 예 localStroage, window, Navigator.geolocation
사용자 전용 hook
```

**server**

```bash
서버의 데이터베이스 혹은 api에서 data를 가져오는 경우
api key, token 및 기타 보안 데이터를 client에 노출하지 않고 사용
브라우저로 전송되는 javascript의 양을 줄이고 싶을 떄
콘텐츠가 포함된 첫 번째 페인트(first contentful paint-fcp)를 개선, 콘텐츠를 client에 점진적으로 스트리밍
```

### hydration이 완료되지 않음

Link 는 클라이턴트 컴포넌트이기 떄문에 라우팅 페이지를 프리페치하기 전에 하이드레이션 합니다.

초기 방문 시 대용량 자바스크립트 번들로 인해 하이드레이션이 지연되어 프리페칭이 바로 시작하지 않을 수 있다.

react는 선택전 hydration을 통해 이를 완화하며, 다음과 같은 방법으로 이를 더욱 개선할 수 있다.

@next/bundle-analyzer 플러그인을 사용하면 대규모 종속성을 제거하여, 번들 크기를 식별하고 줄일 수 있다.

가능하다면 클라이언트에서 서버로 로직을 이동한다.

좀 더 자세한 내용은 서버 및 클라이언트 컴포넌트 문서를 참조하자

### 프리페칭 비활성화

대량의 링크 목록을 렌더링할 때 불필요한 리소스 사용을 방지함

그러나 비활성화 하면 단점이 있다

정적 라우팅은 사용자가 링크를 클릭할 때만 가져옴

동적 라우팅은 클라이언트가 해당 경로로 이동하기 전에 서버에서 먼저 렌더링 되야함

프리페치를 완전히 비활성화하지 않고 리소스 사용량은 줄이려면, 마우스 호버 시에만 프리페치 하면 된다.

이러하면 뷰 포트의 모든 링크가 아닌 사용자가 방문할 가능성이 높은 경로로만 프리페치가 제한된다

```ts
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function ManualPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const poll = () => {
      if (!cancelled) router.prefetch(href, { onInvalidate: poll })
    }
    poll()
    return () => {
      cancelled = true
    }
  }, [href, router])

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        router.push(href)
      }}
    >
      {children}
    </a>
  )
}
```

```ts
'use client'

import Link, { LinkProps } from 'next/link'

function NoPrefetchLink({
  prefetch,
  ...rest
}: LinkProps & { children: React.ReactNode }) {
  return <Link {...rest} prefetch={false} />
}
```

### 느린 네트워크

네트워크가 느리거나 불안정한 경우, 사용자가 링크를 클릭하기 전에 프리페칭이 완료되지 않을 수 있음

이것으로 정적 경로와 동적 경로 모두에 영향을 미칠 수 있다

이경우 loding.tsx를 사용한다

### await 없어도 async를 붙이는 이유

1. 일관성 유지

같은 프로젝트 안에서 어떤 페이지는 async, 어떤 페이지는 function이면 혼란스럽다

2. 확장성

지금은 더미 데이터를 쓰지만, 나중에 db나 api에서 데이터를 가져올 때 await fetch
같은 코드가 들어갈 수 있기 때문에 미리 async를 붙여 두면 수정할 필요가 없다

3. react server component 호환성

server component는 Promise를 반환할 수 있어야 하고, Next.js는 내부적으로 async 함수 패턴에 맞춰 최적화된 렌더링 파이프라인을 갖고 있어서 async가 붙어 있어도 불필요한 오버헤드가 거의 없다.

### generationStaticParams

자체는 slug 배열만 순회함

빌드 프로세서가 이 배열을 순회 -> 각 slug에 대해 page.tsx 실행

## 0930

### 네비게이션 작동 방식

Server Rendering

Prefetching

Streaming

Client-side transitions(클라이언트 측 전환)

#### 1-1 Server Rendering

서버 렌더링은 발생 시점에 따라 2가지 유형이 있다.

정적 렌더링은 빌드 시점이나 재검증 중에 발생, 결과는 cache 된다.

동적 렌더링은 클라이언트 요총에 대한 응답으로 **요청 시점에 발생**

단점이 있다면 클라이언트가 새 경로를 표시하기 전 서버의 응답을 기다려야 한다.

**Next에서는 사용자가 방문할 가능성이 높은 경로를 미리 가져온다(Prefetching), 클라이언트 측 변환(Client-side transition)을 수행 하므로 지연 문제를 해결**

### 알아두면 좋은 것

최초 방문 시 html이 생성됨

일반적인 react는 CSR만 사용하면 첫 페이지 방문 신 빈 html + javascript 파일만 주고 브라우저가 js를 실행해야 렌더링이 된다

허나 Next.js에서는

사용자가 특정 url을 처음 방문하면 해당 페이지의 html을 미리 생성 후 브라우저에 전달함

따라서 브라우저는 js실행 전에도 즉시 보이는 html 뼈대와 + 콘텐츠를 표시할 수 있다.

이후 hydration 과정을 거쳐 상호작용이 가능해짐

초기방문 시에 html을 생성하기에 ux가 좋아지고 seo에도 좋다.

#### 1-2 Prefetching

사용자가 해당경로로 이동하기 전에 백그라운드에서 해당경로를 로드하는 프로세스다.

사용자가 링크를 클릭하기 전 다음 경로룰 렌더링하는데 필요한 데이터가 클라이언트측에 이미 준비되어 있기 때문에 애플리케이션에서 경로 간 이동이 즉각적으로 느껴짐

Nextjs 는`<Link>` 컴포넌트와 연결된 경로를 자동으로 사용자 뷰 포트에 미리 가져온다

`<a>` 태그를 사용하면 프리페칭을 하지 않는다

경로의 어느정도를 프리페칭할지는 정적,동적 경로인지에 따라 다르다.

정적 경로: 전체 경로가 프리페칭됨

동적 경로: 프리페치를 건너뛰거나, loading.tsx 가 있는 경우 경로가 부분적으로 프리페칭된다.

Next는 동적 라우팅을 건너뛰거나 부분적으로 프리페칭을 함으로 사용자가 방문하지 않을 수도 있는 경로에 대한 **서버의 불필요한 작업을 방지한다**

그러나 네이비게이션 전에 서버 응답을 기다리면 사용자에게 앱이 응답하지 않는 다는 인상을 줄 수 있다

동적 경로에 대한 네비게이션 환경을 개선하려면 스트리밍을 사용할 수 있다.

#### 1-3 Streaming

스트리밍을 사용하면 서버가 **전체 경로가 렌더링될 때까지 기다리지 않고, 동적 경로의 일부가 준비되는 즉시 클라이언트에 전송**할 수 있다

즉 페이지의 일부가 로딩 중이더라도 사용자는 더 빨리 콘텐츠를 볼 수 있다.

동적 경로의 경우, 부분적으로 미리 가져올 수 있다는 뜻이다.

스트리밍을 쓸려면

라우팅 폴더에 **_loading.tsx_** 파일을 생성한

next는 내부적으로 page.tsx 콘텐츠를 `<Suspense>` 경계로 자동 래핑함

`<Suspense>` 를 사용하여 중첩된 컴포넌트로

loading의 이점

즉각적인 네비게이션과 시각적 피드백을 줌

#### 웹 성능 지표

TTFB(Time To First Byte)

FCP(First Contentfull s)s

TTI

#### 1-4 Client-side transition

일반적으로 서버 렌더링 페이지로 이동하면 전체 페이지가 로드가 된다.

이로 인해 state가 삭제되고, 스크롤 위치가 재설정되며, 상호작용이 차단된다.

Next는 `<Link>` 컴포넌트를 사용하는 Client-side transition을 통해 이를 방지한다

### route 방식 비교

#### page router

```bash
디렉토리 루트 : pages/

pages/about.js -> /about 으로 간다

대표기능: 동적 라우트,getStaticProps 등
```

#### app router

```bash
디렉토리 루트 : app

app/about/page.tsx -> /about

대표기능: 레이아웃 중첩, 서버 컴포넌트, 병렬 라우트 등등
```

##### 프로젝트 별 추천 방식

```bash
새 프로젝트 시작: App Router

기존 프로젝트 유지보수: pages/

React 처럼 수동 라우팅이 필요한 경우: React + react-router-dom
```

## 0923

asd

### slug

사이트의 특정 페이지를 쉽게 읽을 수 있는 형태로 식별하는 url의 일부

문서 경로의 [slug] 부분은 불러올 데이터의 key를 말한다.

slug는 반드시 slug일 필요는 없으며, foo 라고 했다면 데이터의 반드시 foo key(field)가 있어야 한다.

### nested route

폴더를 계속 중첩해서 중첩된 경로를 만들 수 있다.

블로그 개시

### Link Component

Link 태그는 HTML a 태그 요소를 확장하여 프리페칭(prefetching)과 라우트 간 클라이언트 사이드 내비게이션 기능을 제공하는 React 컴포넌트이다.

nextjs에서 라우트 간 이동을 위햐 주로 사용되는 방법이다.

```ts
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

다음과 같이 쓸 수 있다.

![alt text](image.png)

## 0916

### layout과 template

정적 페이지는 layout
동적 페이지는 template에 작성한다

라우팅 페이지만 src디렉토리에 있으면 무방하며
다른 파일들은 밖에 있어도 괜찮다

### 프로젝트 실행

`pnpm create next-app@latest [ProjectName] `

or

`pnpm create next-app@latest [ProjectName] --yes`

### route

next는 기본적으로 파일 시스템 라우팅을 사용하는데,
