import "./ForBusinesses.css";

function ForBusinesses() {
  return (
    <section id="businesses">
      <div className="businesses-header">
        <p className="section-label">FOR BUSINESSES</p>

        <h2>
          Build your talent
          <br />
          pipeline with us.
        </h2>

        <p>
          Qala Thuto helps businesses find, screen, and connect with young
          South African talent for learnerships, internships, and
          entry-level opportunities.
        </p>

        <button className="businesses-button">
          Partner With Us
        </button>
      </div>

      <div className="businesses-services">
        <div className="business-service">
          <span>01</span>

          <h3>Tell us what you need</h3>

          <p>
            Share your requirements, available opportunities, and the type of
            talent your organisation is looking for.
          </p>
        </div>

        <div className="business-service">
          <span>02</span>

          <h3>We build your pipeline</h3>

          <p>
            We actively source and screen suitable candidates based on your
            specific requirements.
          </p>
        </div>

        <div className="business-service">
          <span>03</span>

          <h3>Meet your candidates</h3>

          <p>
            We connect qualified candidates with your organisation so you can
            focus on selecting the right people for your opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForBusinesses;