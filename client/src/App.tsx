import "./App.css"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import WhyQalaThuto from "./components/WhyQalaThuto"
import CTA from "./components/CTA"
import Footer from "./components/Footer"

import About from "./pages/About"
import Contact from "./pages/Contact"
import Employers from "./pages/Employers"
import Opportunities from "./pages/Opportunities"
import OpportunityDetails from "./pages/OpportunityDetails"

import Candidates from "./pages/Candidates"
import CandidateProfile from "./pages/CandidateProfile"
import MyApplications from "./pages/MyApplications"

import SignUp from "./pages/SignUp"
import EmployerSignUp from "./pages/EmployerSignUp"
import Login from "./pages/Login"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function Home() {
  return (
    <>
      <Hero />
      <WhyQalaThuto />
      <CTA />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/employers" element={<Employers />} />

        <Route path="/opportunities" element={<Opportunities />} />

        <Route path="/candidates" element={<Candidates />} />

        <Route
          path="/candidate-profile"
          element={<CandidateProfile />}
        />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/employer-signup"
          element={<EmployerSignUp />}
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/opportunities/:id"
          element={<OpportunityDetails />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App