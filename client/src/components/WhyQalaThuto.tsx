import "./WhyQalaThuto.css";

function WhyQalaThuto() {
  return (
    <section id="why-qala-thuto">
      <div className="why-header">
        <p className="section-label">WHY QALA THUTO?</p>

        <h2>
          Learn. Connect.
          <br />
          Grow.
        </h2>

        <p>
          We connect young people with opportunities that help them build
          skills, gain experience and take the next step toward their future.
        </p>
      </div>

      <div className="why-grid">

        <div className="why-card">
          <span className="why-icon">01</span>

          <h3>Learn</h3>

          <p>
            Build valuable skills through learnerships, internships and
            opportunities designed to help you grow.
          </p>
        </div>

        <div className="why-card">
          <span className="why-icon">02</span>

          <h3>Connect</h3>

          <p>
            Discover opportunities and connect with organisations looking for
            motivated young talent.
          </p>
        </div>

        <div className="why-card">
          <span className="why-icon">03</span>

          <h3>Grow</h3>

          <p>
            Gain experience, develop your career and take the next step toward
            a brighter future.
          </p>
        </div>

      </div>
    </section>
  );
}

export default WhyQalaThuto;