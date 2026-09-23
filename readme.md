# 202430132 진현우

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