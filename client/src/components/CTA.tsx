import { Link } from "react-router-dom";
import "./CTA.css";

function CTA() {
  return (
    <section id="cta">
      <div className="cta-header">
        <p className="section-label">GET STARTED</p>

        <h2>Your future starts here.</h2>

        <p>
          Find opportunities, build your skills and take the next step toward
          a brighter future.
        </p>
      </div>

      <div className="cta-options">

        <div className="cta-card candidate-cta">
          <div>
            <span>FOR CANDIDATES</span>

            <h3>Find your opportunity.</h3>

            <p>
              Explore learnerships, internships and entry-level opportunities
              to help you start building your career.
            </p>
          </div>

          <Link to="/opportunities" className="cta-button">
            Explore Opportunities
          </Link>
        </div>

        <div className="cta-card employer-cta">
          <div>
            <span>FOR EMPLOYERS</span>

            <h3>Find your next talent.</h3>

            <p>
              Connect with motivated young people and build your future talent
              pipeline with Qala Thuto.
            </p>
          </div>

          <Link to="/employer-signup" className="cta-button">
            Partner With Us
          </Link>
        </div>

      </div>
    </section>
  );
}

export default CTA;