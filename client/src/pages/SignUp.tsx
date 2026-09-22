import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./SignUp.css"

function SignUp() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error("SIGN UP ERROR:", error)
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage(
      "Account created successfully! Check your email to confirm your account."
    )

    setLoading(false)

    setTimeout(() => {
      navigate("/candidate-profile")
    }, 2000)
  }

  return (
    <main className="signup-page">

      {/* Hero */}
      <section className="signup-hero">

        <div className="signup-hero-content">

          <span className="signup-eyebrow">
            EDUCATION | OPPORTUNITIES | BRIGHTER FUTURES
          </span>

          <h1>
            Start Your
            <span> Journey.</span>
          </h1>

          <p>
            Create your Qala Thuto account and take the first
            step towards discovering opportunities that can
            help you build your future.
          </p>

          <div className="signup-hero-points">

            <div>
              <span>✓</span>
              Create your candidate profile
            </div>

            <div>
              <span>✓</span>
              Discover career opportunities
            </div>

            <div>
              <span>✓</span>
              Start building your future
            </div>

          </div>

        </div>

      </section>


      {/* Sign up form */}
      <section className="signup-section">

        <div className="signup-card">

          <div className="signup-card-header">

            <div className="signup-icon">
              🚀
            </div>

            <h2>Create Your Account</h2>

            <p>
              Join Qala Thuto and get started today.
            </p>

          </div>


          <form onSubmit={handleSignUp}>

            <div className="signup-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />

            </div>


            <div className="signup-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                required
              />

              <span className="password-hint">
                Password must be at least 6 characters.
              </span>

            </div>


            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>


            {message && (
              <div
                className={`signup-message ${
                  message.includes("successfully")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}


            <div className="signup-divider">
              <span>ALREADY REGISTERED?</span>
            </div>


            <p className="login-text">
              Already have an account?{" "}

              <Link to="/login">
                Login
              </Link>
            </p>

          </form>

        </div>

      </section>

    </main>
  )
}

export default SignUp
