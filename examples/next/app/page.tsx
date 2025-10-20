export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>402Kit Next.js Example</h1>
      <p>This example demonstrates 402Kit with Next.js App Router.</p>

      <h2>Endpoints</h2>
      <ul>
        <li>
          <a href="/api/protected" target="_blank">
            /api/protected
          </a>{' '}
          - Protected endpoint (requires payment)
        </li>
      </ul>

      <h2>Try it</h2>
      <pre
        style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}
      >
        {`curl http://localhost:3000/api/protected`}
      </pre>

      <p>You'll receive a 402 Payment Required response with a challenge.</p>
    </main>
  );
}
