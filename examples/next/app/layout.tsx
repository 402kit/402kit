export const metadata = {
  title: '402Kit Next.js Example',
  description: 'HTTP 402 Payment Required with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
