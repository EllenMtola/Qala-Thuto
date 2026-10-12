import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./Navbar.css"

function Navbar() {
  const navigate = useNavigate()

  const [user, setUser] = useState<any>(null)
  const [candidateOpen, setCandidateOpen] = useState(false)
  const [employerOpen, setEmployerOpen] = useState(false)

  const candidateRef = useRef<HTMLDivElement>(null)
  const employerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        candidateRef.current &&
        !candidateRef.current.contains(event.target as Node)
      ) {
        setCandidateOpen(false)
      }

      if (
        employerRef.current &&
        !employerRef.current.contains(event.target as Node)
      ) {
        setEmployerOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate("/login")
  }

  const closeMenus = () => {
    setCandidateOpen(false)
    setEmployerOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenus}>
          <img
            src="/qala-thuto-logo.png"
            alt="Qala Thuto - Education | Opportunities | Brighter Futures"
          />
        </Link>

        {/* Navigation */}
        <div className="navbar-navigation">

{/* Home */}
<Link
  to="/"
  onClick={closeMenus}
  className="nav-link"
>
  Home
</Link>

          {/* Opportunities */}
          <Link
            to="/opportunities"
            onClick={closeMenus}
            className="nav-link"
          >
            Opportunities
          </Link>

          {/* Candidates Dropdown */}
          <div
            ref={candidateRef}
            className="dropdown-wrapper"
          >
            <button
              type="button"
              className={`dropdown-button ${
                candidateOpen ? "dropdown-active" : ""
              }`}
              onClick={() => {
                setCandidateOpen(!candidateOpen)
                setEmployerOpen(false)
              }}
            >
              Candidates
              <span
                className={`dropdown-arrow ${
                  candidateOpen ? "arrow-open" : ""
                }`}
              >
                ▼
              </span>
            </button>
<Link
  to="/forums"
  onClick={closeMenus}
  className="nav-link"
>
  Forums
</Link>
            {candidateOpen && (
              <div className="dropdown-menu">

                <Link
                  to="/candidates"
                  onClick={closeMenus}
                  className="dropdown-link"
                >
                  <span className="dropdown-icon">👥</span>

                  <span>
                    <strong>For Candidates</strong>
                    <small>Find opportunities</small>
                  </span>

                  <span className="dropdown-right-arrow">→</span>
                </Link>

                <Link
                  to="/candidate-profile"
                  onClick={closeMenus}
                  className="dropdown-link"
                >
                  <span className="dropdown-icon">👤</span>

                  <span>
                    <strong>My Profile</strong>
                    <small>Manage your profile</small>
                  </span>

                  <span className="dropdown-right-arrow">→</span>
                </Link>

                <Link
                  to="/my-applications"
                  onClick={closeMenus}
                  className="dropdown-link"
                >
                  <span className="dropdown-icon">📄</span>

                  <span>
                    <strong>My Applications</strong>
                    <small>Track your applications</small>
                  </span>

                  <span className="dropdown-right-arrow">→</span>
                </Link>


              </div>
            )}
          </div>

          {/* Employers Dropdown */}
          <div
            ref={employerRef}
            className="dropdown-wrapper"
          >
            <button
              type="button"
              className={`dropdown-button ${
                employerOpen ? "dropdown-active" : ""
              }`}
              onClick={() => {
                setEmployerOpen(!employerOpen)
                setCandidateOpen(false)
              }}
            >
              Employers
              <span
                className={`dropdown-arrow ${
                  employerOpen ? "arrow-open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {employerOpen && (
              <div className="dropdown-menu">

                <Link
                  to="/employers"
                  onClick={closeMenus}
                  className="dropdown-link"
                >
                  <span className="dropdown-icon">🏢</span>

                  <span>
                    <strong>For Employers</strong>
                    <small>Find talented candidates</small>
                  </span>

                  <span className="dropdown-right-arrow">→</span>
                </Link>

                <Link
                  to="/employer-signup"
                  onClick={closeMenus}
                  className="dropdown-link"
                >
                  <span className="dropdown-icon">➕</span>

                  <span>
                    <strong>Employer Sign Up</strong>
                    <small>Join Qala Thuto</small>
                  </span>

                  <span className="dropdown-right-arrow">→</span>
                </Link>

              </div>
            )}
          </div>

          {/* About */}
          <Link
            to="/about"
            onClick={closeMenus}
            className="nav-link"
          >
            About
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            onClick={closeMenus}
            className="nav-link"
          >
            Contact
          </Link>

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMenus}
              className="login-button"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar