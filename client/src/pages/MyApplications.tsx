import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type Application = {
  id: string
  opportunity_id: string
  status: string
  applied_at: string
  opportunity:
    | {
        title: string
        company: string
        type: string
        location: string
      }
    | {
        title: string
        company: string
        type: string
        location: string
      }[]
    | null
}

function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Please log in to view your applications.")
        window.location.href = "/login"
        return
      }

      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .select("*")
        .eq("user_id", user.id)

      console.log("LOGGED IN USER:", user)
      console.log("USER ID:", user.id)
      console.log("CANDIDATE DATA:", candidate)
      console.log("CANDIDATE ERROR:", candidateError)

      if (candidateError || !candidate || candidate.length === 0) {
        console.error("CANDIDATE ERROR:", candidateError)
        alert(
          "Candidate profile could not be found. Check the browser console."
        )
        setLoading(false)
        return
      }

      const candidateId = candidate[0].id

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          opportunity_id,
          status,
          applied_at,
          opportunity:opportunities (
            title,
            company,
            type,
            location
          )
        `)
        .eq("candidate_id", candidateId)
        .order("applied_at", { ascending: false })

      if (error) {
        console.error("APPLICATIONS ERROR:", error)
        setLoading(false)
        return
      }

      setApplications(data || [])
      setLoading(false)
    }

    loadApplications()
  }, [])

  if (loading) {
    return (
      <main>
        <h1>My Applications</h1>
        <p>Loading applications...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>You haven't applied for any opportunities yet.</p>
      ) : (
        <section>
          {applications.map((application) => {
            const opportunity = Array.isArray(application.opportunity)
              ? application.opportunity[0]
              : application.opportunity

            return (
              <article key={application.id}>
                <h2>
                  {opportunity?.title || "Opportunity"}
                </h2>

                <p>
                  <strong>Company:</strong>{" "}
                  {opportunity?.company || "Unknown company"}
                </p>

                <p>
                  <strong>Type:</strong>{" "}
                  {opportunity?.type || "Not specified"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {opportunity?.location || "Not specified"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </p>

                <p>
                  <strong>Applied:</strong>{" "}
                  {new Date(
                    application.applied_at
                  ).toLocaleDateString()}
                </p>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}

export default MyApplications