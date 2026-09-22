import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./Login.css"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setMessage("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("LOGIN ERROR:", error)
      setMessage(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (!user) {
      setMessage("Login failed. Please try again.")
      setLoading(false)
      return
    }

    const accountType = user.user_metadata?.account_type

    if (accountType === "employer") {
      const { data: existingEmployer, error: employerCheckError } =
        await supabase
          .from("employers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle()

      if (employerCheckError) {
        console.error(
          "EMPLOYER PROFILE CHECK ERROR:",
          employerCheckError
        )

        setMessage(
          "You are logged in, but we could not check your employer profile."
        )

        setLoading(false)
        return
      }

      if (!existingEmployer) {
        const { error: employerInsertError } = await supabase
          .from("employers")
          .insert({
            user_id: user.id,
            company_name:
              user.user_metadata?.company_name || "Company",
            email: user.email || email,
          })

        if (employerInsertError) {
          console.error(
            "EMPLOYER PROFILE CREATION ERROR:",
            employerInsertError
          )

          setMessage(
            "Your account is active, but your employer profile could not be created."
          )

          setLoading(false)
          return
        }
      }

      setMessage("Employer login successful!")

      setLoading(false)

      setTimeout(() => {
        navigate("/employers")
      }, 1000)

      return
    }

    setMessage("Login successful!")

    setLoading(false)

    setTimeout(() => {
      navigate("/candidate-profile")
    }, 1000)
  }

  return (
    <main className="login-page">

      {/* Left / Hero area */}
      <section className="login-hero">

        <div className="login-hero-content">

          <span className="login-eyebrow">
            EDUCATION | OPPORTUNITIES | BRIGHTER FUTURES
          </span>

          <h1>
            Your Future
            <span> Starts Here.</span>
          </h1>

          <p>
            Login to your Qala Thuto account and continue
            your journey towards new opportunities.
          </p>

          <div className="login-hero-points">

            <div>
              <span>✓</span>
              Discover opportunities
            </div>

            <div>
              <span>✓</span>
              Manage your profile
            </div>

            <div>
              <span>✓</span>
              Build your future
            </div>

          </div>

        </div>

      </section>


      {/* Login card */}
      <section className="login-section">

        <div className="login-card">

          <div className="login-card-header">

            <div className="login-icon">
              🔐
            </div>

            <h2>Welcome Back</h2>

            <p>
              Login to your Qala Thuto account
            </p>

          </div>


          <form onSubmit={handleLogin}>

            <div className="login-form-group">

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


            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>


            {message && (
              <div
                className={`login-message ${
                  message.includes("successful")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}


            <div className="login-divider">
              <span>OR</span>
            </div>


            <p className="signup-text">
              Don't have an account?{" "}

              <Link to="/signup">
                Create an Account
              </Link>
            </p>

          </form>

        </div>

      </section>

    </main>
  )
}

export default Login
