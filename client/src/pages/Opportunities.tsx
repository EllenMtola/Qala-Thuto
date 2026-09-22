import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./Opportunities.css"

type Opportunity = {
  id: string
  title: string
  company: string
  type: string
  location: string
  description: string
  requirements: string
  closing_date: string | null
  employer_id: string | null
}

function Opportunities() {
  const navigate = useNavigate()

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")

  const [user, setUser] = useState<any>(null)
  const [employer, setEmployer] = useState<any>(null)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingOpportunity, setEditingOpportunity] =
    useState<Opportunity | null>(null)

  const [title, setTitle] = useState("")
  const [type, setType] = useState("Learnership")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [closingDate, setClosingDate] = useState("")

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data: employerData, error: employerError } =
          await supabase
            .from("employers")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()

        if (employerError) {
          console.error("EMPLOYER ERROR:", employerError)
        }

        setEmployer(employerData)
      }

      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("closing_date", { ascending: true })

      if (error) {
        console.error("OPPORTUNITIES ERROR:", error)
        alert(error.message)
        setLoading(false)
        return
      }

      setOpportunities(data || [])
      setLoading(false)
    }

    loadData()
  }, [])

  async function handleCreateOpportunity(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!user || !employer) {
      setMessage(
        "You must be logged in as an employer to create an opportunity."
      )
      return
    }

    setSaving(true)
    setMessage("")

    const { data, error } = await supabase
      .from("opportunities")
      .insert({
        title,
        company: employer.company_name,
        type,
        location,
        description,
        requirements,
        closing_date: closingDate || null,
        employer_id: employer.id,
      })
      .select()
      .single()

    if (error) {
      console.error("CREATE OPPORTUNITY ERROR:", error)

      setMessage(
        "The opportunity could not be created: " + error.message
      )

      setSaving(false)
      return
    }

    setOpportunities((current) => [...current, data])

    resetForm()
    setShowCreateForm(false)
    setMessage("Opportunity created successfully!")
    setSaving(false)
  }

  function resetForm() {
    setTitle("")
    setType("Learnership")
    setLocation("")
    setDescription("")
    setRequirements("")
    setClosingDate("")
  }

  function startEditing(opportunity: Opportunity) {
    setEditingOpportunity(opportunity)

    setTitle(opportunity.title)
    setType(opportunity.type)
    setLocation(opportunity.location)
    setDescription(opportunity.description)
    setRequirements(opportunity.requirements)
    setClosingDate(opportunity.closing_date || "")

    setShowCreateForm(false)
    setMessage("")
  }

  function cancelEditing() {
    setEditingOpportunity(null)
    resetForm()
    setMessage("")
  }

  async function handleUpdateOpportunity(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!user || !employer || !editingOpportunity) {
      return
    }

    setSaving(true)
    setMessage("")

    const { data, error } = await supabase
      .from("opportunities")
      .update({
        title,
        company: employer.company_name,
        type,
        location,
        description,
        requirements,
        closing_date: closingDate || null,
      })
      .eq("id", editingOpportunity.id)
      .eq("employer_id", employer.id)
      .select()
      .single()

    if (error) {
      console.error("UPDATE OPPORTUNITY ERROR:", error)

      setMessage(
        "The opportunity could not be updated: " + error.message
      )

      setSaving(false)
      return
    }

    setOpportunities((current) =>
      current.map((opportunity) =>
        opportunity.id === editingOpportunity.id
          ? data
          : opportunity
      )
    )

    setEditingOpportunity(null)
    resetForm()

    setMessage("Opportunity updated successfully!")
    setSaving(false)
  }

  async function handleDeleteOpportunity(
    opportunity: Opportunity
  ) {
    if (!employer) {
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${opportunity.title}"?`
    )

    if (!confirmed) {
      return
    }

    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", opportunity.id)
      .eq("employer_id", employer.id)

    if (error) {
      console.error("DELETE OPPORTUNITY ERROR:", error)

      setMessage(
        "The opportunity could not be deleted: " + error.message
      )

      return
    }

    setOpportunities((current) =>
      current.filter((item) => item.id !== opportunity.id)
    )

    setMessage("Opportunity deleted successfully.")
  }

  const myOpportunities = employer
    ? opportunities.filter(
        (opportunity) =>
          opportunity.employer_id === employer.id
      )
    : []

  const filteredOpportunities = opportunities.filter(
    (opportunity) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        opportunity.title.toLowerCase().includes(searchText) ||
        opportunity.company.toLowerCase().includes(searchText) ||
        opportunity.type.toLowerCase().includes(searchText) ||
        opportunity.location.toLowerCase().includes(searchText)

      const matchesType =
        typeFilter === "All" ||
        opportunity.type.toLowerCase() ===
          typeFilter.toLowerCase()

      return matchesSearch && matchesType
    }
  )

  if (loading) {
    return (
      <main className="opportunities-page">
        <section className="opportunities-loading">
          <div className="loading-spinner"></div>
          <h2>Loading opportunities...</h2>
          <p>Finding opportunities for you.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="opportunities-page">

      {/* HERO */}
      <section className="opportunities-header">
        <div>
          <p className="section-label">OPPORTUNITIES</p>

          <h1>
            Find Your Next
            <span> Opportunity.</span>
          </h1>

          <p>
            Discover learnerships, internships and entry-level
            opportunities that can help you build your career.
          </p>
        </div>
      </section>

      {/* EMPLOYER TOOLS */}
      {user && employer && (
        <section className="employer-tools">

          <div className="employer-tools-header">
            <div>
              <p className="section-label">FOR EMPLOYERS</p>

              <h2>Manage Your Opportunities</h2>

              <p>
                Welcome, {employer.company_name}. Create and
                manage opportunities for talented young people.
              </p>
            </div>

            {!showCreateForm && !editingOpportunity && (
              <button
                className="primary-action"
                onClick={() => {
                  setShowCreateForm(true)
                  setMessage("")
                }}
              >
                + Create Opportunity
              </button>
            )}
          </div>

          {/* CREATE FORM */}
          {showCreateForm && (
            <form
              className="opportunity-form"
              onSubmit={handleCreateOpportunity}
            >
              <div className="form-heading">
                <h3>Create New Opportunity</h3>
                <p>Tell candidates about your opportunity.</p>
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label htmlFor="title">
                    Opportunity Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    placeholder="e.g. IT Learnership"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">
                    Opportunity Type
                  </label>

                  <select
                    id="type"
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value)
                    }
                  >
                    <option value="Learnership">
                      Learnership
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Entry-Level Job">
                      Entry-Level Job
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    placeholder="e.g. Johannesburg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="closingDate">
                    Closing Date
                  </label>

                  <input
                    id="closingDate"
                    type="date"
                    value={closingDate}
                    onChange={(event) =>
                      setClosingDate(event.target.value)
                    }
                  />
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={5}
                  placeholder="Describe the opportunity..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="requirements">
                  Requirements
                </label>

                <textarea
                  id="requirements"
                  value={requirements}
                  onChange={(event) =>
                    setRequirements(event.target.value)
                  }
                  rows={5}
                  placeholder="List the requirements..."
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-action"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create Opportunity"}
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => {
                    setShowCreateForm(false)
                    resetForm()
                    setMessage("")
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* EDIT FORM */}
          {editingOpportunity && (
            <form
              className="opportunity-form"
              onSubmit={handleUpdateOpportunity}
            >
              <div className="form-heading">
                <h3>Edit Opportunity</h3>
                <p>Update your opportunity details.</p>
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label htmlFor="editTitle">
                    Opportunity Title
                  </label>

                  <input
                    id="editTitle"
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editType">
                    Opportunity Type
                  </label>

                  <select
                    id="editType"
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value)
                    }
                  >
                    <option value="Learnership">
                      Learnership
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Entry-Level Job">
                      Entry-Level Job
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="editLocation">
                    Location
                  </label>

                  <input
                    id="editLocation"
                    type="text"
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editClosingDate">
                    Closing Date
                  </label>

                  <input
                    id="editClosingDate"
                    type="date"
                    value={closingDate}
                    onChange={(event) =>
                      setClosingDate(event.target.value)
                    }
                  />
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="editDescription">
                  Description
                </label>

                <textarea
                  id="editDescription"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editRequirements">
                  Requirements
                </label>

                <textarea
                  id="editRequirements"
                  value={requirements}
                  onChange={(event) =>
                    setRequirements(event.target.value)
                  }
                  rows={5}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-action"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {message && (
            <div className="opportunity-message">
              {message}
            </div>
          )}

          {/* MY OPPORTUNITIES */}
          <div className="my-opportunities">
            <div className="subsection-heading">
              <h3>My Opportunities</h3>
              <span>{myOpportunities.length}</span>
            </div>

            {myOpportunities.length === 0 ? (
              <div className="empty-state">
                <p>
                  You have not created any opportunities yet.
                </p>
              </div>
            ) : (
              <div className="my-opportunity-list">
                {myOpportunities.map((opportunity) => (
                  <article
                    className="my-opportunity-item"
                    key={opportunity.id}
                  >
                    <div>
                      <span className="opportunity-type">
                        {opportunity.type}
                      </span>

                      <h4>{opportunity.title}</h4>

                      <p>
                        📍 {opportunity.location}
                      </p>

                      {opportunity.closing_date && (
                        <p>
                          Closing:{" "}
                          {opportunity.closing_date}
                        </p>
                      )}
                    </div>

                    <div className="my-opportunity-actions">
                      <button
                        className="edit-button"
                        onClick={() =>
                          startEditing(opportunity)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteOpportunity(
                            opportunity
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SEARCH AND FILTERS */}
      <section className="available-opportunities">

        <div className="available-heading">
          <div>
            <p className="section-label">
              EXPLORE
            </p>

            <h2>Available Opportunities</h2>

            <p>
              Find an opportunity that matches your
              skills, interests and career goals.
            </p>
          </div>

          <span className="opportunity-count">
            {filteredOpportunities.length}{" "}
            {filteredOpportunities.length === 1
              ? "Opportunity"
              : "Opportunities"}
          </span>
        </div>

        <div className="opportunity-filters">

          <input
            className="opportunity-search"
            type="text"
            placeholder="Search by title, company, type or location..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            className="opportunity-filter"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
          >
            <option value="All">
              All Types
            </option>

            <option value="Learnership">
              Learnership
            </option>

            <option value="Internship">
              Internship
            </option>

            <option value="Entry-Level Job">
              Entry-Level Job
            </option>
          </select>

          {(search || typeFilter !== "All") && (
            <button
              className="clear-filter"
              onClick={() => {
                setSearch("")
                setTypeFilter("All")
              }}
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* OPPORTUNITY CARDS */}
        {opportunities.length === 0 ? (
          <div className="empty-opportunities">
            <h3>No opportunities available</h3>
            <p>
              There are currently no opportunities
              available. Please check again later.
            </p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="empty-opportunities">
            <h3>No matching opportunities</h3>
            <p>
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="opportunity-grid">

            {filteredOpportunities.map(
              (opportunity) => (
                <article
                  className="opportunity-card"
                  key={opportunity.id}
                >

                  <div className="opportunity-card-top">
                    <span className="opportunity-type">
                      {opportunity.type}
                    </span>

                    {opportunity.closing_date && (
                      <span className="closing-badge">
                        Closing{" "}
                        {opportunity.closing_date}
                      </span>
                    )}
                  </div>

                  <h3>{opportunity.title}</h3>

                  <p className="opportunity-company">
                    {opportunity.company}
                  </p>

                  <p className="opportunity-location">
                    📍 {opportunity.location}
                  </p>

                  <p className="opportunity-description">
                    {opportunity.description}
                  </p>

                  <button
                    className="opportunity-button"
                    onClick={() =>
                      navigate(
                        `/opportunities/${opportunity.id}`
                      )
                    }
                  >
                    View Opportunity →
                  </button>

                </article>
              )
            )}

          </div>
        )}

      </section>

    </main>
  )
}

export default Opportunities