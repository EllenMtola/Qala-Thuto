import { Link } from "react-router-dom"
import "./Candidates.css"

function Candidates() {
  return (
    <main className="candidates-page">

      {/* Hero */}
      <section className="candidates-hero">

        <div className="candidates-hero-content">

          <span className="candidates-eyebrow">
            FOR CANDIDATES
          </span>

          <h1>
            Start Your Career
            <span> With Qala Thuto.</span>
          </h1>

          <p>
            Discover learnerships, internships and entry-level
            opportunities that can help you take the next step
            in your career.
          </p>

          <div className="candidates-hero-actions">

            <Link
              to="/signup"
              className="primary-candidates-button"
            >
              Create Your Account
              <span>→</span>
            </Link>

            <Link
              to="/opportunities"
              className="secondary-candidates-button"
            >
              Explore Opportunities
            </Link>

          </div>

        </div>

      </section>


      {/* What you can do */}
      <section className="candidate-actions">

        <div className="candidates-container">

          <div className="candidate-section-heading">

            <span className="section-label">
              GET STARTED
            </span>

            <h2>
              Everything you need to
              <span> move forward.</span>
            </h2>

            <p>
              Qala Thuto helps you create your profile,
              discover opportunities and take the next step
              towards your career.
            </p>

          </div>


          <div className="candidate-action-grid">

            <article className="candidate-action-card">

              <div className="candidate-action-number">
                01
              </div>

              <div className="candidate-action-icon">
                👤
              </div>

              <h3>Create Your Profile</h3>

              <p>
                Build a profile that tells employers about your
                education, skills, experience and career goals.
              </p>

            </article>


            <article className="candidate-action-card">

              <div className="candidate-action-number">
                02
              </div>

              <div className="candidate-action-icon">
                🔎
              </div>

              <h3>Find Opportunities</h3>

              <p>
                Explore opportunities that match your interests,
                qualifications and career goals.
              </p>

            </article>


            <article className="candidate-action-card">

              <div className="candidate-action-number">
                03
              </div>

              <div className="candidate-action-icon">
                📄
              </div>

              <h3>Apply</h3>

              <p>
                Apply for opportunities directly through
                Qala Thuto and put your skills forward.
              </p>

            </article>


            <article className="candidate-action-card">

              <div className="candidate-action-number">
                04
              </div>

              <div className="candidate-action-icon">
                📈
              </div>

              <h3>Track Your Applications</h3>

              <p>
                Keep track of the opportunities you've applied
                for and monitor your application progress.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* How it works */}
      <section className="candidate-process">

        <div className="candidates-container">

          <div className="candidate-section-heading centered">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              From profile to
              <span> opportunity.</span>
            </h2>

          </div>


          <div className="candidate-process-grid">

            <div className="process-step">

              <div className="process-number">
                1
              </div>

              <h3>Sign Up</h3>

              <p>
                Create your free Qala Thuto account.
              </p>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                2
              </div>

              <h3>Build Your Profile</h3>

              <p>
                Add your education, skills and experience.
              </p>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                3
              </div>

              <h3>Discover & Apply</h3>

              <p>
                Find opportunities and submit your applications.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="candidate-final-cta">

        <div className="candidate-final-content">

          <span className="candidates-eyebrow">
            YOUR FUTURE STARTS HERE
          </span>

          <h2>
            Ready to take the
            <span> next step?</span>
          </h2>

          <p>
            Create your Qala Thuto profile and start discovering
            opportunities today.
          </p>

          <Link
            to="/signup"
            className="primary-candidates-button"
          >
            Create Your Account
            <span>→</span>
          </Link>

        </div>

      </section>

    </main>
  )
}

export default Candidates
