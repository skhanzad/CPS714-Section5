import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <section className="card">
      <h1>Welcome to LibraLite</h1>
      <p>Manage your library membership online with our modern portal.</p>
      <div className="actions">
        <Link to="/apply" className="button primary">Apply for a Card</Link>
        <Link to="/login" className="button">Member Login</Link>
        <Link to="/account" className="button">View My Account</Link>
      </div>
      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Browse & Tools</h3>
        <div className="actions">
          <Link to="/catalog" className="button">Browse Catalog</Link>
          <Link to="/calculator" className="button">Late Fee Calculator</Link>
        </div>
      </div>
      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Staff</h3>
        <Link to="/staff" className="button">Staff Checkout/Check-in</Link>
      </div>
      <p className="helper" style={{ marginTop: '1.5rem' }}>
        Already applied? <Link to="/pending">Check your application status</Link>
      </p>
    </section>
  );
};

export default LandingPage;
