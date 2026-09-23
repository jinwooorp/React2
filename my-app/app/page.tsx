import Link from "next/link";

export default function Home() {
  
  return(
  <div className="flex flex-col flex-1 items-center justify-center">
    <h1>root page</h1>
    <Link href={{
        pathname: '/blog',
        query: { name: 'page' },
      }}
    >Go to Blog </Link>
    
    <Link href={{
        pathname: '/products',
        query: { name: 'page' },
      }}
    >Go to Products </Link>
  </div>);
  
}
