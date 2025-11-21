import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'LibraLite - Library Management',
  description: 'Manage your library membership online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="header">
            <nav className="nav">
              <Link href="/" className="logo">
                LibraLite
              </Link>
              <div className="nav-links">
                <Link href="/apply">Apply</Link>
                <Link href="/login">Login</Link>
                <Link href="/pending">Status</Link>
                <Link href="/hold-shelf">Hold Shelf</Link>
                <Link href="/returns">Returns</Link>
              </div>
            </nav>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">
            <p>&copy; 2025 LibraLite. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
