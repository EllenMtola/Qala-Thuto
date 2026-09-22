import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./Employers.css"

function Employers() {
  const navigate = useNavigate()

  const [user, setUser] = useState<any>(null)
  const [employer, setEmployer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [applications, setApplications] = useState<any[]>([])
const [applicationsLoading, setApplicationsLoading] = useState(false)

  useEffect(() => {
    async function loadEmployer() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("employers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        console.error("EMPLOYER PROFILE ERROR:", error)
      }
setEmployer(data)

if (data) {
  await loadApplications(data.id)
}

setLoading(false)
    }

    loadEmployer()
  }, [])
async function loadApplications(employerId: string) {
  setApplicationsLoading(true)

  const { data, error } = await supabase
    .from("applications")
    .select(`
  id,
  status,
  applied_at,
  opportunity_id,
  candidate_id,
  opportunities!inner (
        id,
        title,
        company,
        employer_id
      ),
      candidates!inner (
        full_name,
        email,
        phone,
        education,
        field_of_study,
        skills,
        career_goal,
        cv_url
      )
    `)
    .eq("opportunities.employer_id", employerId)
    .order("applied_at", { ascending: false })

  if (error) {
    console.error(
      "EMPLOYER APPLICATIONS ERROR:",
      error
    )

    setApplications([])
    setApplicationsLoading(false)
    return
  }

  setApplications(data || [])
  console.log("EMPLOYER APPLICATION DATA:", data)
  setApplicationsLoading(false)
}
  async function handleSaveProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!user) {
      return
    }

    setSaving(true)
    setMessage("")

    const { data, error } = await supabase
      .from("employers")
      .update({
        company_name: employer.company_name,
        email: employer.email,
        phone: employer.phone || null,
        industry: employer.industry || null,
        company_description:
          employer.company_description || null,
        website: employer.website || null,
        location: employer.location || null,
      })
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error(
        "EMPLOYER PROFILE UPDATE ERROR:",
        error
      )

      setMessage(
        "Your company profile could not be updated."
      )

      setSaving(false)
      return
    }

    setEmployer(data)
    setEditing(false)
    setMessage(
      "Company profile updated successfully."
    )

    setSaving(false)
  }

  function handleChange(
    field: string,
    value: string
  ) {
    setEmployer((current: any) => ({
      ...current,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <main>
        <section>
          <h1>Loading Employer Dashboard...</h1>
        </section>
      </main>
    )
  }

  if (user && employer) {
    return (
      <main>
        <section>
          <h1>
            Welcome, {employer.company_name}
          </h1>

          <p>
            Manage your company profile and connect
            with candidates through Qala Thuto.
          </p>
        </section>

        <section>
          <h2>Company Profile</h2>

          {!editing ? (
            <div>
              <p>
                <strong>Company Name:</strong>{" "}
                {employer.company_name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {employer.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {employer.phone || "Not provided"}
              </p>

              <p>
                <strong>Industry:</strong>{" "}
                {employer.industry || "Not provided"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {employer.location || "Not provided"}
              </p>

              <p>
                <strong>Website:</strong>{" "}
                {employer.website || "Not provided"}
              </p>

              <p>
                <strong>Company Description:</strong>
              </p>

              <p>
                {employer.company_description ||
                  "No company description provided."}
              </p>

              <button
                onClick={() => {
                  setEditing(true)
                  setMessage("")
                }}
              >
                Edit Company Profile
              </button>

              {message && <p>{message}</p>}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div>
                <label htmlFor="companyName">
                  Company Name
                </label>

                <br />

                <input
                  id="companyName"
                  type="text"
                  value={employer.company_name || ""}
                  onChange={(event) =>
                    handleChange(
                      "company_name",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <br />

              <div>
                <label htmlFor="companyEmail">
                  Company Email
                </label>

                <br />

                <input
                  id="companyEmail"
                  type="email"
                  value={employer.email || ""}
                  onChange={(event) =>
                    handleChange(
                      "email",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <br />

              <div>
                <label htmlFor="phone">
                  Phone Number
                </label>

                <br />

                <input
                  id="phone"
                  type="tel"
                  value={employer.phone || ""}
                  onChange={(event) =>
                    handleChange(
                      "phone",
                      event.target.value
                    )
                  }
                />
              </div>

              <br />

              <div>
                <label htmlFor="industry">
                  Industry
                </label>

                <br />

                <input
                  id="industry"
                  type="text"
                  value={employer.industry || ""}
                  onChange={(event) =>
                    handleChange(
                      "industry",
                      event.target.value
                    )
                  }
                />
              </div>

              <br />

              <div>
                <label htmlFor="location">
                  Location
                </label>

                <br />

                <input
                  id="location"
                  type="text"
                  value={employer.location || ""}
                  onChange={(event) =>
                    handleChange(
                      "location",
                      event.target.value
                    )
                  }
                />
              </div>

              <br />

              <div>
                <label htmlFor="website">
                  Website
                </label>

                <br />

                <input
                  id="website"
                  type="url"
                  value={employer.website || ""}
                  onChange={(event) =>
                    handleChange(
                      "website",
                      event.target.value
                    )
                  }
                />
              </div>

              <br />

              <div>
                <label htmlFor="companyDescription">
                  Company Description
                </label>

                <br />

                <textarea
                  id="companyDescription"
                  value={
                    employer.company_description || ""
                  }
                  onChange={(event) =>
                    handleChange(
                      "company_description",
                      event.target.value
                    )
                  }
                  rows={5}
                />
              </div>

              <br />

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              {" "}

              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setMessage("")
                }}
                disabled={saving}
              >
                Cancel
              </button>

              {message && <p>{message}</p>}
            </form>
          )}
        </section>

        <section>
          <h2>Employer Actions</h2>

          <button
            onClick={() =>
              navigate("/opportunities")
            }
          >
            View Opportunities
          </button>
        </section>

        <section>
  <h2>Applications</h2>

  <p>
    Review candidates who have applied to your
    opportunities.
  </p>

  {applicationsLoading ? (
    <p>Loading applications...</p>
  ) : applications.length === 0 ? (
    <p>
      No candidates have applied to your
      opportunities yet.
    </p>
  ) : (
    <div>
      {applications.map((application) => (
        <article key={application.id}>
          <h3>
            {application.candidates?.full_name ||
              "Candidate"}
          </h3>

          <p>
            <strong>Opportunity:</strong>{" "}
            {application.opportunities?.title}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {application.status}
          </p>

          <p>
            <strong>Applied:</strong>{" "}
            {application.applied_at
              ? new Date(
                  application.applied_at
                ).toLocaleDateString()
              : "Not available"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {application.candidates?.email ||
              "Not provided"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {application.candidates?.phone ||
              "Not provided"}
          </p>

          <p>
            <strong>Education:</strong>{" "}
            {application.candidates?.education ||
              "Not provided"}
          </p>

          <p>
            <strong>Field of Study:</strong>{" "}
            {application.candidates?.field_of_study ||
              "Not provided"}
          </p>

          <p>
            <strong>Skills:</strong>{" "}
            {application.candidates?.skills ||
              "Not provided"}
          </p>

          <p>
            <strong>Career Goal:</strong>{" "}
            {application.candidates?.career_goal ||
              "Not provided"}
          </p>

          {application.candidates?.cv_url && (
            <p>
              <a
                href={application.candidates.cv_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Candidate CV
              </a>
            </p>
          )}

          <hr />
        </article>
      ))}
    </div>
  )}
</section>

      </main>
    )
  }

  return (
  <main className="employers-page">

    {/* HERO SECTION */}
    <section className="employers-hero">

      <span className="employers-label">
        FOR EMPLOYERS
      </span>

      <h1>
        Find the Right Talent
        <br />
        for Your Business.
      </h1>

      <p>
        Connect with motivated young South Africans
        through learnerships, internships and
        entry-level employment opportunities.
      </p>

      <button
        className="employers-hero-btn"
        onClick={() => navigate("/employer-signup")}
      >
        Get Started as an Employer →
      </button>

    </section>


    {/* INTRODUCTION SECTION */}
    <section className="employers-intro">

      <span className="employers-section-label">
        GROW WITH QALA THUTO
      </span>

      <h2>
        Build Your Team with the Right Talent
      </h2>

      <p>
        Qala Thuto helps businesses find, screen
        and connect with motivated young South
        Africans who are ready to learn, grow
        and contribute to your organisation.
      </p>

    </section>


    {/* HOW IT WORKS SECTION */}
    <section className="employers-how">

      <div className="employers-section-heading">

        <span className="employers-section-label">
          HOW IT WORKS
        </span>

        <h2>
          Your Hiring Journey, Simplified
        </h2>

        <p>
          From sharing your requirements to
          connecting with potential candidates.
        </p>

      </div>


      <div className="employers-steps">

        <article className="employers-step-card">

          <span className="employers-step-number">
            01
          </span>

          <h3>
            Tell Us What You Need
          </h3>

          <p>
            Share your available positions,
            requirements and the skills
            you're looking for.
          </p>

        </article>


        <article className="employers-step-card">

          <span className="employers-step-number">
            02
          </span>

          <h3>
            Connect with Talent
          </h3>

          <p>
            Discover candidates interested
            in learnerships, internships and
            entry-level opportunities.
          </p>

        </article>


        <article className="employers-step-card">

          <span className="employers-step-number">
            03
          </span>

          <h3>
            Review Applications
          </h3>

          <p>
            Access candidate applications
            and review their qualifications,
            skills and experience.
          </p>

        </article>


        <article className="employers-step-card">

          <span className="employers-step-number">
            04
          </span>

          <h3>
            Grow Your Team
          </h3>

          <p>
            Connect with suitable candidates
            and take the next step in
            your recruitment journey.
          </p>

        </article>

      </div>

    </section>


    {/* CALL TO ACTION */}
    <section className="employers-cta">

      <span className="employers-section-label">
        LET'S BUILD THE FUTURE
      </span>

      <h2>
        Ready to Discover New Talent?
      </h2>

      <p>
        Join Qala Thuto and connect your
        business with South Africa's
        emerging workforce.
      </p>

      <button
        className="employers-cta-btn"
        onClick={() => navigate("/employer-signup")}
      >
        Create Employer Account →
      </button>

    </section>

  </main>
  )
}

export default Employers