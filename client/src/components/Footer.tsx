import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer id="footer">

      <div className="footer-main">

        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            Qala Thuto
          </Link>

          <p>
            Education, opportunities and brighter futures for young people.
          </p>

          <p className="footer-tagline">
            Learn. Connect. Grow.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h3>Explore</h3>

            <Link to="/">Home</Link>
            <Link to="/opportunities">Opportunities</Link>
            <Link to="/candidates">For Candidates</Link>
            <Link to="/employers">For Employers</Link>
          </div>

          <div>
            <h3>Get Started</h3>

            <Link to="/signup">Candidate Sign Up</Link>
            <Link to="/employer-signup">Employer Sign Up</Link>
            <Link to="/login">Login</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 Qala Thuto. All rights reserved.
        </p>

        <p>
          Education | Opportunities | Brighter Futures
        </p>

      </div>

    </footer>
  );
}

export default Footer;