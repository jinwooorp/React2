export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>=== Blog Layout Header ===</header>

      <main>{children}</main>

      <footer>=== Blog Layout Footer ===</footer>
    </>
  );
}