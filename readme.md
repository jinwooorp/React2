# 202430132 진현우

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

Nextjs 는```<Link>``` 컴포넌트와 연결된 경로를 자동으로 사용자 뷰 포트에 미리 가져온다 

```<a>``` 태그를 사용하면 프리페칭을 하지 않는다

경로의 어느정도를 프리페칭할지는 정적,동적 경로인지에 따라 다르다.

정적 경로: 전체 경로가 프리페칭됨

동적 경로: 프리페치를 건너뛰거나, loading.tsx 가 있는 경우 경로가 부분적으로 프리페칭된다.

Next는 동적 라우팅을 건너뛰거나 부분적으로 프리페칭을 함으로 사용자가 방문하지 않을 수도 있는 경로에 대한 **서버의 불필요한 작업을 방지한다**

그러나 네이비게이션 전에 서버 응답을 기다리면 사용자에게 앱이 응답하지 않는 다는 인상을 줄 수 있다

동적 경로에 대한 네비게이션 환경을 개선하려면 스트리밍을 사용할 수 있다.

#### 1-3  Streaming

스트리밍을 사용하면 서버가 **전체 경로가 렌더링될 때까지 기다리지 않고, 동적 경로의 일부가 준비되는 즉시 클라이언트에 전송**할 수 있다

즉 페이지의 일부가 로딩 중이더라도 사용자는 더 빨리 콘텐츠를 볼 수 있다.

동적 경로의 경우, 부분적으로 미리 가져올 수 있다는 뜻이다.

스트리밍을 쓸려면 

라우팅 폴더에 ***loading.tsx*** 파일을 생성한

next는 내부적으로 page.tsx 콘텐츠를 ```<Suspense>``` 경계로 자동 래핑함

```<Suspense>``` 를 사용하여  중첩된 컴포넌트로 

loading의 이점

즉각적인 네비게이션과 시각적 피드백을 줌

#### 웹 성능 지표

TTFB(Time To First Byte)

FCP(First Contentfull s)s

TTI

#### 1-4 Client-side transition

일반적으로 서버 렌더링 페이지로 이동하면 전체 페이지가 로드가 된다.

이로 인해 state가 삭제되고, 스크롤 위치가 재설정되며, 상호작용이 차단된다.

Next는 ```<Link>``` 컴포넌트를 사용하는 Client-side transition을 통해 이를 방지한다



### route 방식 비교

#### page router
```bash
디렉토리 루트 : pages/

pages/about.js -> /about 으로 간다

대표기능: 동적 라우트,getStaticProps 등
```

#### apsp router
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

``` pnpm create next-app@latest [ProjectName]  ``` 

or 

``` pnpm create next-app@latest [ProjectName] --yes ```

### route

next는 기본적으로 파일 시스템 라우팅을 사용하는데,