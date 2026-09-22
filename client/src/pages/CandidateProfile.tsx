import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./CandidateProfile.css"

function CandidateProfile() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [education, setEducation] = useState("")
  const [field, setField] = useState("")
  const [skills, setSkills] = useState("")
  const [careerGoal, setCareerGoal] = useState("")
  const [cvUrl, setCvUrl] = useState("")

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.log("No candidate profile found yet.")

        setEmail(user.email || "")
        setLoading(false)
        return
      }

      console.log("LOADED PROFILE:", data)

      setFullName(data.full_name || "")
      setEmail(data.email || user.email || "")
      setPhone(data.phone || "")
      setEducation(data.education || "")
      setField(data.field_of_study || "")
      setSkills(data.skills || "")
      setCareerGoal(data.career_goal || "")
      setCvUrl(data.cv_url || "")

      setLoading(false)
    }

    loadProfile()
  }, [])

  async function handleViewCV() {
    if (!cvUrl) {
      alert("No CV has been uploaded yet.")
      return
    }

    const { data, error } = await supabase.storage
      .from("cvs")
      .createSignedUrl(cvUrl, 60)

    if (error) {
      console.error("CV VIEW ERROR:", error)
      alert("Unable to open your CV.")
      return
    }

    window.open(data.signedUrl, "_blank")
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    // Capture the form BEFORE any await happens
    const form = event.currentTarget
    const formData = new FormData(form)

    setSaving(true)
    setSubmitted(false)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in to create your profile.")
      setSaving(false)
      return
    }

    const cvFile = formData.get("cv") as File

    let newCvUrl = cvUrl

    if (cvFile && cvFile.size > 0) {
      const fileExtension = cvFile.name.split(".").pop()

      const fileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, cvFile)

      if (uploadError) {
        console.error("CV UPLOAD ERROR:", uploadError)

        alert(uploadError.message)

        setSaving(false)

        return
      }

      newCvUrl = fileName
      setCvUrl(fileName)
    }

    const candidate = {
      user_id: user.id,
      full_name: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      education: formData.get("education") as string,
      field_of_study: formData.get("field") as string,
      skills: formData.get("skills") as string,
      career_goal: formData.get("careerGoal") as string,
      cv_url: newCvUrl,
    }

    const { error: databaseError } = await supabase
      .from("candidates")
      .upsert(candidate, {
        onConflict: "user_id",
      })

    if (databaseError) {
      console.error("DATABASE ERROR:", databaseError)

      alert(databaseError.message)

      setSaving(false)

      return
    }

    setSubmitted(true)
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="profile-loading">
        <div className="loading-spinner"></div>

        <h1>Loading your profile...</h1>

        <p>
          Please wait while we retrieve your information.
        </p>
      </main>
    )
  }

  return (
    <main className="candidate-profile">

      {/* Hero */}
      <section className="profile-hero">

        <div className="profile-hero-content">

          <span className="profile-eyebrow">
            CANDIDATE PROFILE
          </span>

          <h1>
            Build Your
            <span> Future.</span>
          </h1>

          <p>
            Tell us about yourself so we can help connect you
            with opportunities that match your skills, experience
            and career goals.
          </p>

        </div>

      </section>


      {/* Profile form */}
      <section className="profile-section">

        <div className="profile-container">

          <div className="profile-form-card">

            <div className="profile-form-header">

              <div>
                <span className="section-label">
                  YOUR INFORMATION
                </span>

                <h2>
                  Candidate Profile
                </h2>

                <p>
                  Keep your information up to date so employers
                  can better understand your background.
                </p>
              </div>

            </div>


            <form onSubmit={handleSubmit}>

              {/* Personal Information */}
              <div className="profile-form-section">

                <div className="form-section-heading">

                  <div className="form-section-number">
                    01
                  </div>

                  <div>
                    <h3>Personal Information</h3>

                    <p>
                      Basic information employers can use to
                      contact you.
                    </p>
                  </div>

                </div>


                <div className="profile-form-grid">

                  <div className="profile-form-group">

                    <label htmlFor="fullName">
                      Full Name
                    </label>

                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />

                  </div>


                  <div className="profile-form-group">

                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="Enter your email address"
                      required
                    />

                  </div>


                  <div className="profile-form-group">

                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="Enter your phone number"
                      required
                    />

                  </div>

                </div>

              </div>


              {/* Education */}
              <div className="profile-form-section">

                <div className="form-section-heading">

                  <div className="form-section-number">
                    02
                  </div>

                  <div>
                    <h3>Education</h3>

                    <p>
                      Tell employers about your educational
                      background.
                    </p>
                  </div>

                </div>


                <div className="profile-form-grid">

                  <div className="profile-form-group">

                    <label htmlFor="education">
                      Highest Level of Education
                    </label>

                    <select
                      id="education"
                      name="education"
                      value={education}
                      onChange={(event) =>
                        setEducation(event.target.value)
                      }
                      required
                    >
                      <option value="">
                        Select your education
                      </option>

                      <option value="matric">
                        Matric
                      </option>

                      <option value="certificate">
                        Certificate
                      </option>

                      <option value="diploma">
                        Diploma
                      </option>

                      <option value="degree">
                        Degree
                      </option>

                      <option value="other">
                        Other
                      </option>

                    </select>

                  </div>


                  <div className="profile-form-group">

                    <label htmlFor="field">
                      Field of Study
                    </label>

                    <input
                      type="text"
                      id="field"
                      name="field"
                      value={field}
                      onChange={(event) =>
                        setField(event.target.value)
                      }
                      placeholder="e.g. Information Technology"
                      required
                    />

                  </div>

                </div>

              </div>


              {/* Skills and career */}
              <div className="profile-form-section">

                <div className="form-section-heading">

                  <div className="form-section-number">
                    03
                  </div>

                  <div>
                    <h3>Skills & Career Goals</h3>

                    <p>
                      Help us understand what you can do and
                      where you want to go.
                    </p>
                  </div>

                </div>


                <div className="profile-form-group">

                  <label htmlFor="skills">
                    Skills
                  </label>

                  <textarea
                    id="skills"
                    name="skills"
                    rows={5}
                    value={skills}
                    onChange={(event) =>
                      setSkills(event.target.value)
                    }
                    placeholder="List your skills, for example: Communication, Microsoft Office, Coding, Customer Service..."
                    required
                  ></textarea>

                </div>


                <div className="profile-form-group">

                  <label htmlFor="careerGoal">
                    Career Goal
                  </label>

                  <textarea
                    id="careerGoal"
                    name="careerGoal"
                    rows={5}
                    value={careerGoal}
                    onChange={(event) =>
                      setCareerGoal(event.target.value)
                    }
                    placeholder="What type of career are you interested in?"
                    required
                  ></textarea>

                </div>

              </div>


              {/* CV */}
              <div className="profile-form-section">

                <div className="form-section-heading">

                  <div className="form-section-number">
                    04
                  </div>

                  <div>
                    <h3>Your CV</h3>

                    <p>
                      Upload your latest CV so employers can
                      learn more about your experience.
                    </p>
                  </div>

                </div>


                <div className="cv-upload">

                  <div className="cv-upload-icon">
                    ↑
                  </div>

                  <div className="cv-upload-content">

                    <label htmlFor="cv">
                      Upload Your CV
                    </label>

                    <p>
                      PDF, DOC or DOCX files are accepted.
                    </p>

                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                    />

                    {cvUrl && (
                      <div className="cv-status">

                        <strong>
                          ✓ CV already uploaded
                        </strong>

                        <span>
                          Upload a new file only if you
                          want to replace it.
                        </span>

                        <button
                          type="button"
                          onClick={handleViewCV}
                          className="cv-view-button"
                        >
                          View My CV
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </div>


              {/* Save */}
              <div className="profile-submit-area">

                <button
                  type="submit"
                  className="profile-submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving Profile..."
                    : "Save Profile"}
                </button>

                {submitted && (
                  <div className="profile-success">

                    <span>✓</span>

                    <div>

                      <strong>
                        Profile saved successfully!
                      </strong>

                      <p>
                        Your information has been updated.
                      </p>

                    </div>

                  </div>
                )}

              </div>

            </form>

          </div>

        </div>

      </section>


      {/* Bottom CTA */}
      <section className="profile-cta">

        <div className="profile-cta-content">

          <span className="profile-eyebrow">
            KEEP GROWING
          </span>

          <h2>
            Your next opportunity
            <span> could be here.</span>
          </h2>

          <p>
            Keep your profile updated and explore opportunities
            that match your skills and career goals.
          </p>

          <a
            href="/opportunities"
            className="profile-cta-button"
          >
            Explore Opportunities
          </a>

        </div>

      </section>

    </main>
  )
}

export default CandidateProfile