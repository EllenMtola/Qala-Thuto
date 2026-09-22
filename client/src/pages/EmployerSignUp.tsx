import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./EmployerSignUp.css"

function EmployerSignUp() {
  const navigate = useNavigate()

  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [industry, setIndustry] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignUp(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setMessage("")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: "employer",
          company_name: companyName,
        },
      },
    })

    if (error) {
      console.error("EMPLOYER SIGN UP ERROR:", error)
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (!data.user) {
      setMessage(
        "Account could not be created. Please try again."
      )
      setLoading(false)
      return
    }

    /*
      If email confirmation is enabled,
      Supabase may not return an active session yet.
    */
    if (!data.session) {
      setMessage(
        "Employer account created successfully! Please check your email and confirm your account before continuing."
      )

      setLoading(false)
      return
    }

    const { error: employerError } = await supabase
      .from("employers")
      .insert({
        user_id: data.user.id,
        company_name: companyName,
        email,
        phone: phone || null,
        industry: industry || null,
        company_description:
          companyDescription || null,
        website: website || null,
        location: location || null,
      })

    if (employerError) {
      console.error(
        "EMPLOYER PROFILE ERROR:",
        employerError
      )

      setMessage(
        "Your account was created, but your company profile could not be created. Please try again."
      )

      setLoading(false)
      return
    }

    setMessage(
      "Employer account created successfully!"
    )

    setLoading(false)

    setTimeout(() => {
      navigate("/employers")
    }, 1500)
  }

  return (
    <main className="employer-signup-page">

      {/* Hero */}
      <section className="employer-signup-hero">
        <div className="employer-signup-hero-content">

          <span className="employer-signup-eyebrow">
            FOR EMPLOYERS
          </span>

          <h1>
            Build your team with
            <span> Qala Thuto.</span>
          </h1>

          <p>
            Create your company account and connect with
            motivated young talent looking for their next opportunity.
          </p>

        </div>
      </section>


      {/* Form section */}
      <section className="employer-signup-section">

        <div className="employer-signup-container">

          <div className="employer-signup-intro">

            <span className="section-label">
              EMPLOYER REGISTRATION
            </span>

            <h2>
              Create your
              <span> employer account.</span>
            </h2>

            <p>
              Set up your company profile to connect with
              candidates and manage your opportunities on
              Qala Thuto.
            </p>

            <div className="signup-benefits">

              <div className="signup-benefit">
                <div className="signup-benefit-icon">
                  👥
                </div>

                <div>
                  <h3>Connect with talent</h3>

                  <p>
                    Reach young people looking for meaningful
                    career opportunities.
                  </p>
                </div>
              </div>


              <div className="signup-benefit">
                <div className="signup-benefit-icon">
                  💼
                </div>

                <div>
                  <h3>Manage opportunities</h3>

                  <p>
                    Create and manage opportunities for
                    emerging talent.
                  </p>
                </div>
              </div>


              <div className="signup-benefit">
                <div className="signup-benefit-icon">
                  🚀
                </div>

                <div>
                  <h3>Grow your team</h3>

                  <p>
                    Discover motivated candidates who can
                    contribute to your organisation.
                  </p>
                </div>
              </div>

            </div>

          </div>


          {/* Form card */}
          <div className="employer-signup-card">

            <div className="signup-card-header">

              <h2>Employer Sign Up</h2>

              <p>
                Tell us a little about your company.
              </p>

            </div>


            <form onSubmit={handleSignUp}>

              {/* Company information */}
              <div className="form-section-title">
                <span>01</span>

                <div>
                  <h3>Company Information</h3>

                  <p>
                    Basic information about your organisation.
                  </p>
                </div>
              </div>


              <div className="signup-form-row">

                <div className="signup-form-group">
                  <label htmlFor="companyName">
                    Company Name
                  </label>

                  <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(event) =>
                      setCompanyName(event.target.value)
                    }
                    placeholder="Enter your company name"
                    required
                  />
                </div>


                <div className="signup-form-group">
                  <label htmlFor="industry">
                    Industry
                  </label>

                  <input
                    type="text"
                    id="industry"
                    value={industry}
                    onChange={(event) =>
                      setIndustry(event.target.value)
                    }
                    placeholder="e.g. Technology, Finance"
                  />
                </div>

              </div>


              <div className="signup-form-group">
                <label htmlFor="companyDescription">
                  Company Description
                </label>

                <textarea
                  id="companyDescription"
                  value={companyDescription}
                  onChange={(event) =>
                    setCompanyDescription(event.target.value)
                  }
                  placeholder="Tell candidates about your company"
                  rows={5}
                />
              </div>


              <div className="signup-form-row">

                <div className="signup-form-group">
                  <label htmlFor="website">
                    Website
                  </label>

                  <input
                    type="url"
                    id="website"
                    value={website}
                    onChange={(event) =>
                      setWebsite(event.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </div>


                <div className="signup-form-group">
                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    placeholder="e.g. Johannesburg, South Africa"
                  />
                </div>

              </div>


              {/* Account information */}
              <div className="form-section-title account-section-title">
                <span>02</span>

                <div>
                  <h3>Account Information</h3>

                  <p>
                    These details will be used to access your account.
                  </p>
                </div>
              </div>


              <div className="signup-form-group">
                <label htmlFor="email">
                  Company Email
                </label>

                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="company@example.com"
                  required
                />
              </div>


              <div className="signup-form-row">

                <div className="signup-form-group">
                  <label htmlFor="password">
                    Password
                  </label>

                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Create a password"
                    minLength={6}
                    required
                  />

                  <small>
                    Minimum 6 characters.
                  </small>
                </div>


                <div className="signup-form-group">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="Enter your phone number"
                  />
                </div>

              </div>


              {/* Message */}
              {message && (
                <div
                  className={
                    message.includes("successfully")
                      ? "signup-message success"
                      : "signup-message error"
                  }
                >
                  {message}
                </div>
              )}


              <button
                type="submit"
                className="employer-signup-button"
                disabled={loading}
              >
                {loading
                  ? "Creating Employer Account..."
                  : "Create Employer Account"}
              </button>


              <div className="signup-links">

                <p>
                  Already have an account?{" "}
                  <Link to="/login">
                    Login
                  </Link>
                </p>

                <p>
                  Looking for a job?{" "}
                  <Link to="/signup">
                    Create a candidate account
                  </Link>
                </p>

              </div>

            </form>

          </div>

        </div>

      </section>


      {/* Bottom CTA */}
      <section className="employer-signup-cta">

        <div>

          <span className="employer-signup-eyebrow">
            FIND YOUR NEXT GREAT CANDIDATE
          </span>

          <h2>
            Your next team member
            <span> could be here.</span>
          </h2>

          <p>
            Join Qala Thuto and connect with young South Africans
            ready to learn, grow and contribute.
          </p>

        </div>

      </section>

    </main>
  )
}

export default EmployerSignUp
