import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <section className="card">
      <h1>Welcome to LibraLite</h1>
      <p>Manage your library membership online with our modern portal.</p>
      <div className="actions">
        <Link to="/apply" className="button primary">Apply for a Card</Link>
        <Link to="/login" className="button">Member Login</Link>
      </div>
      <p className="helper">
        Already applied? <Link to="/pending">Check your application status</Link>
      </p>
    </section>
  );
};

export default LandingPage;
