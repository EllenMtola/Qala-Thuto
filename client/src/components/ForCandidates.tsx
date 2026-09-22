import { Link } from "react-router-dom"
import "./ForCandidates.css"

function ForCandidates() {
  return (
    <section id="candidates" className="candidates-section">

      <div className="candidates-container">

        {/* Main content */}
        <div className="candidates-content">

          <p className="section-label">
            FOR CANDIDATES
          </p>

          <h2>
            Your next opportunity
            <span> starts here.</span>
          </h2>

          <p className="candidates-description">
            Whether you are looking for a learnership, internship,
            or your first job, Qala Thuto helps you discover
            opportunities that match your goals and skills.
          </p>

          <Link
            to="/opportunities"
            className="candidates-button"
          >
            Find Opportunities
            <span>→</span>
          </Link>

        </div>


        {/* Features */}
        <div className="candidates-features">

          <article className="candidate-feature">

            <div className="candidate-feature-number">
              01
            </div>

            <div>
              <h3>Discover</h3>

              <p>
                Find learnerships, internships, and entry-level
                opportunities from businesses looking for young talent.
              </p>
            </div>

          </article>


          <article className="candidate-feature">

            <div className="candidate-feature-number">
              02
            </div>

            <div>
              <h3>Apply</h3>

              <p>
                Build your candidate profile and apply for
                opportunities that match your skills and interests.
              </p>
            </div>

          </article>


          <article className="candidate-feature">

            <div className="candidate-feature-number">
              03
            </div>

            <div>
              <h3>Grow</h3>

              <p>
                Gain valuable experience, develop your skills,
                and take the next step towards your career.
              </p>
            </div>

          </article>

        </div>

      </div>

    </section>
  )
}

export default ForCandidates
