import "./About.css"

function About() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            EDUCATION | OPPORTUNITIES | BRIGHTER FUTURES
          </span>

          <h1>
            About <span>Qala Thuto.</span>
          </h1>

          <p>
            Connecting young South Africans with opportunities
            that help them learn, grow and build their future.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro">
        <div className="about-container">
          <div className="about-intro-text">
            <span className="section-label">WHO WE ARE</span>

            <h2>
              Creating a bridge between
              <span> talent and opportunity.</span>
            </h2>

            <p>
              Qala Thuto is a youth talent and opportunity platform
              connecting young South Africans with learnerships,
              internships and entry-level employment opportunities.
            </p>

            <p>
              We believe that young people should have easier access
              to meaningful opportunities, while businesses should
              have a simpler way to discover and develop emerging talent.
            </p>
          </div>

          <div className="about-intro-card">
            <div className="about-card-icon">✦</div>

            <h3>Our Mission</h3>

            <p>
              To make it easier for young people to access meaningful
              career opportunities while helping businesses discover
              and develop new talent.
            </p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="about-problem">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="section-label">THE CHALLENGE</span>

            <h2>
              Bridging the gap between
              <span> potential and opportunity.</span>
            </h2>

            <p>
              Too many young people have the potential, qualifications
              and willingness to work, but struggle to find opportunities
              that match their skills and experience.
            </p>
          </div>

          <div className="problem-grid">
            <article className="problem-card">
              <div className="problem-number">01</div>

              <h3>Young People</h3>

              <p>
                Finding the right opportunity can be difficult,
                especially when starting out without extensive
                work experience.
              </p>
            </article>

            <article className="problem-card">
              <div className="problem-number">02</div>

              <h3>Businesses</h3>

              <p>
                Businesses need motivated young talent but can
                struggle to find, screen and connect with suitable
                candidates.
              </p>
            </article>

            <article className="problem-card">
              <div className="problem-number">03</div>

              <h3>The Opportunity Gap</h3>

              <p>
                Qala Thuto exists to help bridge this gap by bringing
                young talent and opportunity closer together.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="about-services">
        <div className="about-container">
          <div className="about-section-heading centered">
            <span className="section-label">WHAT WE DO</span>

            <h2>
              Opportunities that help you
              <span> move forward.</span>
            </h2>

            <p>
              We connect the people, businesses and opportunities
              that can help create brighter career futures.
            </p>
          </div>

          <div className="services-grid">

            <article className="service-card">
              <div className="service-icon">🎓</div>

              <h3>For Young People</h3>

              <p>
                Discover learnerships, internships and entry-level
                opportunities designed to help you gain experience
                and build your career.
              </p>
            </article>

            <article className="service-card">
              <div className="service-icon">💼</div>

              <h3>For Businesses</h3>

              <p>
                Connect with emerging talent and discover young
                people whose skills and potential match your needs.
              </p>
            </article>

            <article className="service-card">
              <div className="service-icon">🤝</div>

              <h3>For Opportunity Providers</h3>

              <p>
                Help your opportunities reach young South Africans
                who are actively looking for ways to learn and grow.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="about-vision">
        <div className="about-vision-content">
          <span className="about-eyebrow">
            OUR VISION
          </span>

          <h2>
            A brighter future starts with
            <span> opportunity.</span>
          </h2>

          <p>
            A South Africa where every young person has a fair chance
            to access opportunity, develop their skills and build a
            meaningful career.
          </p>
        </div>
      </section>

    </main>
  )
}

export default About
