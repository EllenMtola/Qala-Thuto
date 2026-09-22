import { useState } from "react"
import { supabase } from "../lib/supabase"
import "./Contact.css"

function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setSubmitting(true)

    const { error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          phone,
          reason,
          message,
        },
      ])

    if (error) {
      console.error("CONTACT ERROR:", error)
      alert("There was a problem sending your message.")
      setSubmitting(false)
      return
    }

    alert("Your message has been sent successfully!")

    setName("")
    setEmail("")
    setPhone("")
    setReason("")
    setMessage("")

    setSubmitting(false)
  }

  return (
    <main className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-content">

          <span className="contact-eyebrow">
            EDUCATION | OPPORTUNITIES | BRIGHTER FUTURES
          </span>

          <h1>
            Let's <span>Connect.</span>
          </h1>

          <p>
            Have a question, want to partner with Qala Thuto,
            or need help finding an opportunity? We'd love to hear from you.
          </p>

        </div>
      </section>


      {/* Contact area */}
      <section className="contact-section">
        <div className="contact-container">

          {/* Left side */}
          <div className="contact-info">

            <span className="section-label">
              GET IN TOUCH
            </span>

            <h2>
              We're here to
              <span> help.</span>
            </h2>

            <p className="contact-intro">
              Whether you're looking for an opportunity, searching
              for young talent, or interested in partnering with us,
              send us a message and our team will get back to you.
            </p>


            <div className="contact-details">

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  ✉
                </div>

                <div>
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:qalathuto@gmail.com">
                      qalathuto@gmail.com
                    </a>
                  </p>
                </div>
              </div>


              <div className="contact-detail">
                <div className="contact-detail-icon">
                  ☎
                </div>

                <div>
                  <h3>Phone</h3>
                  <p>
                    <a href="tel:0733376939">
                      073 337 6939
                    </a>
                  </p>
                </div>
              </div>


              <div className="contact-detail">
                <div className="contact-detail-icon">
                  💬
                </div>

                <div>
                  <h3>WhatsApp</h3>
                  <p>
                    <a
                      href="https://wa.me/27733376939"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      073 337 6939
                    </a>
                  </p>
                </div>
              </div>


              <div className="contact-detail">
                <div className="contact-detail-icon">
                  📍
                </div>

                <div>
                  <h3>Location</h3>
                  <p>South Africa</p>
                </div>
              </div>

            </div>

          </div>


          {/* Form */}
          <div className="contact-form-card">

            <div className="form-header">
              <h2>Contact Qala Thuto</h2>

              <p>
                Fill in the form below and we'll be in touch.
              </p>
            </div>


            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

              </div>


              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="reason">
                    I am contacting you about
                  </label>

                  <select
                    id="reason"
                    name="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  >
                    <option value="">
                      Select an option
                    </option>

                    <option value="opportunity">
                      Finding an opportunity
                    </option>

                    <option value="employer">
                      Hiring young talent
                    </option>

                    <option value="partnership">
                      Partnership
                    </option>

                    <option value="general">
                      General enquiry
                    </option>
                  </select>
                </div>

              </div>


              <div className="form-group">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>


              <button
                type="submit"
                className="contact-submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

            </form>

          </div>

        </div>
      </section>


      {/* Why contact us */}
      <section className="contact-audience">

        <div className="contact-container">

          <div className="contact-heading centered">

            <span className="section-label">
              WHO WE HELP
            </span>

            <h2>
              Let's create
              <span> opportunities together.</span>
            </h2>

            <p>
              Qala Thuto brings young people, businesses and
              opportunity providers together.
            </p>

          </div>


          <div className="audience-grid">

            <article className="audience-card">

              <div className="audience-icon">
                🎓
              </div>

              <h3>For Candidates</h3>

              <p>
                Ask us about opportunities, applications and
                getting started with Qala Thuto.
              </p>

            </article>


            <article className="audience-card">

              <div className="audience-icon">
                💼
              </div>

              <h3>For Employers</h3>

              <p>
                Talk to us about your hiring needs and how we can
                help you find young talent.
              </p>

            </article>


            <article className="audience-card">

              <div className="audience-icon">
                🤝
              </div>

              <h3>For Partners</h3>

              <p>
                Interested in working with Qala Thuto?
                Let's build opportunities together.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="contact-cta">

        <div className="contact-cta-content">

          <span className="contact-eyebrow">
            YOUR FUTURE STARTS HERE
          </span>

          <h2>
            Ready to take the
            <span> next step?</span>
          </h2>

          <p>
            Explore opportunities and discover where your
            next opportunity could take you.
          </p>

          <a
            href="/opportunities"
            className="contact-cta-button"
          >
            Explore Opportunities
          </a>

        </div>

      </section>

    </main>
  )
}

export default Contact