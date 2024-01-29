"use client"
import LandingContent from "@/components/landing-content"
import LandingHero from "@/components/landing-hero"
import LandingNavbar from "@/components/landing-navbar"

const LandingPage = () => {
    return(
        <div className="h-full bg-[#111827] overflow-auto">
           <LandingNavbar/>
           <LandingHero/>
           <LandingContent/>
        </div>
    )
}

export default LandingPage