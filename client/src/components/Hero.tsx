import { Link } from "react-router-dom"

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <p className="hero-label">
          EDUCATION | OPPORTUNITIES | BRIGHTER FUTURES
        </p>

        <h1>
          Your Future
          <span>Starts Here.</span>
        </h1>

        <p className="hero-description">
          Discover learnerships, internships and career opportunities
          designed to help you learn, grow and build your future.
        </p>

        <div className="hero-buttons">

          <Link
            to="/opportunities"
            className="hero-button"
          >
            Explore Opportunities
          </Link>

          <Link
            to="/employers"
            className="hero-button secondary-button"
          >
            For Employers
          </Link>

        </div>

      </div>
    </section>
  )
}

export default Hero