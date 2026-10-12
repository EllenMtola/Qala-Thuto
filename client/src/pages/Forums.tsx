import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./Forums.css"

type Forum = {
  id: string
  name: string
  description: string
  study_year: string
}

function Forums() {
  const [forums, setForums] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadForums() {
      const { data, error } = await supabase
        .from("forums")
        .select("*")
        .order("study_year")

      if (error) {
        console.error("FORUM ERROR:", error)
        setLoading(false)
        return
      }

      setForums(data || [])
      setLoading(false)
    }

    loadForums()
  }, [])

  return (
    <main className="forums-page">

      {/* HERO */}
      <section className="forums-hero">
        <div className="forums-hero-content">

          <span className="forums-eyebrow">
            QALA THUTO COMMUNITY
          </span>

          <h1>
            Connect. Share.
            <span> Grow Together.</span>
          </h1>

          <p>
            Join a community of students and graduates where you
            can share experiences, ask questions, discover
            opportunities and support one another.
          </p>

        </div>
      </section>


      {/* FORUMS */}
      <section className="forums-section">
        <div className="forums-container">

          <div className="forums-heading">

            <span>COMMUNITY FORUMS</span>

            <h2>
              Find Your Community
            </h2>

            <p>
              Choose a forum that matches where you are in your
              academic journey, or join the open community.
            </p>

          </div>


          {/* LOADING */}
          {loading ? (
            <div className="forums-loading">
              Loading forums...
            </div>
          ) : (

            <div className="forums-grid">

              {forums.map((forum) => (

                <div
                  className="forum-card"
                  key={forum.id}
                >

                  <div className="forum-card-icon">
                    💬
                  </div>

                  <span className="forum-year">
                    {forum.study_year}
                  </span>

                  <h3>
                    {forum.name}
                  </h3>

                  <p>
                    {forum.description}
                  </p>

                  <Link
                    to={`/forums/${forum.id}`}
                    className="forum-button"
                  >
                    Join Forum
                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>
      </section>

    </main>
  )
}

export default Forums