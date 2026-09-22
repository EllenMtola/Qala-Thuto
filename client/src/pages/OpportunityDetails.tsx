import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./OpportunityDetails.css"

async function applyForOpportunity(opportunityId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    alert("Please log in before applying.")
    window.location.href = "/login"
    return
  }

  const { data: candidate, error: candidateError } =
    await supabase
      .from("candidates")
      .select("id")
      .eq("user_id", user.id)
      .single()

  if (candidateError || !candidate) {
    console.error("CANDIDATE ERROR:", candidateError)
    alert("Your candidate profile could not be found.")
    return
  }

  const { error: applicationError } = await supabase
    .from("applications")
    .insert({
      candidate_id: candidate.id,
      opportunity_id: opportunityId,
      status: "submitted",
      applied_at: new Date().toISOString(),
    })

  if (applicationError) {
    console.error("APPLICATION ERROR:", applicationError)

    if (applicationError.code === "23505") {
      alert("You have already applied for this opportunity.")
    } else {
      alert("There was a problem submitting your application.")
    }

    return
  }

  alert("Application submitted successfully!")
}

type Opportunity = {
  id: string
  title: string
  company: string
  type: string
  location: string
  description: string
  requirements: string
  closing_date: string | null
}

function OpportunityDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [opportunity, setOpportunity] =
    useState<Opportunity | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOpportunity() {
      if (!id) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("OPPORTUNITY ERROR:", error)
        setLoading(false)
        return
      }

      setOpportunity(data)
      setLoading(false)
    }

    loadOpportunity()
  }, [id])

  if (loading) {
    return (
      <main className="opportunity-details-page">
        <section className="details-loading">
          <div className="loading-spinner"></div>
          <h2>Loading opportunity...</h2>
          <p>Please wait while we load the opportunity details.</p>
        </section>
      </main>
    )
  }

  if (!opportunity) {
    return (
      <main className="opportunity-details-page">
        <section className="not-found">
          <p className="section-label">OPPORTUNITY</p>

          <h1>Opportunity Not Found</h1>

          <p>
            We couldn't find this opportunity. It may have
            been removed or is no longer available.
          </p>

          <button
            className="details-button"
            onClick={() => navigate("/opportunities")}
          >
            ← Back to Opportunities
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="opportunity-details-page">

      {/* BACK BUTTON */}
      <div className="details-container">
        <button
          className="back-button"
          onClick={() => navigate("/opportunities")}
        >
          ← Back to Opportunities
        </button>
      </div>

      {/* HEADER */}
      <section className="opportunity-details-hero">
        <div className="details-container">

          <span className="details-type">
            {opportunity.type}
          </span>

          <h1>{opportunity.title}</h1>

          <p className="details-company">
            {opportunity.company}
          </p>

          <div className="details-meta">

            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <div>
                <small>Location</small>
                <strong>{opportunity.location}</strong>
              </div>
            </div>

            <div className="meta-item">
              <span className="meta-icon">💼</span>
              <div>
                <small>Opportunity Type</small>
                <strong>{opportunity.type}</strong>
              </div>
            </div>

            {opportunity.closing_date && (
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <div>
                  <small>Closing Date</small>
                  <strong>
                    {opportunity.closing_date}
                  </strong>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="details-content">
        <div className="details-container details-layout">

          {/* LEFT */}
          <div className="details-main">

            <section className="details-section">
              <p className="section-label">
                ABOUT THE OPPORTUNITY
              </p>

              <h2>About This Opportunity</h2>

              <p className="details-text">
                {opportunity.description}
              </p>
            </section>

            <section className="details-section">
              <p className="section-label">
                WHAT YOU NEED
              </p>

              <h2>Requirements</h2>

              <div className="requirements-box">
                <p className="details-text">
                  {opportunity.requirements}
                </p>
              </div>
            </section>

          </div>

          {/* RIGHT */}
          <aside className="application-card">

            <div className="application-card-top">
              <span>READY TO APPLY?</span>

              <h3>
                Take the next step toward your future.
              </h3>

              <p>
                Make sure you meet the requirements before
                submitting your application.
              </p>
            </div>

            {opportunity.closing_date && (
              <div className="application-deadline">
                <span>APPLICATION DEADLINE</span>

                <strong>
                  {opportunity.closing_date}
                </strong>
              </div>
            )}

            <button
              className="apply-button"
              onClick={() =>
                applyForOpportunity(opportunity.id)
              }
            >
              Apply Now →
            </button>

            <p className="application-note">
              You must have a candidate profile to apply.
            </p>

          </aside>

        </div>
      </section>

    </main>
  )
}

export default OpportunityDetails