import { Link, Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="app-shell">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="logo">LibraLite</Link>
          <div className="nav-links">
            <Link to="/apply">Apply</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">Springfield Public Library</footer>
    </div>
  );
};

export default RootLayout;
