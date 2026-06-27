import { useEffect, useRef } from 'react'
import "../../constants/styles/About.css"
import { Header } from './Header'

const About = () => {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    path.style.transition = 'stroke-dashoffset 2s ease-in-out'
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0'
    })
  }, [])

  return (
    <div>
        <Header home={true} /> 
    <div className="about-root">

      {/* Hero */}
      <section className="about-hero">
        <p className="about-eyebrow">About Ameer AI</p>
        <div className="about-hero-grid">
          <div>
            <h1>
              Built for the<br />
              <span>real journey,</span><br />
              not the highlight reel.
            </h1>
            <p>
              Ameer AI was built around a simple frustration: planning a trip meant
              juggling five tabs, two spreadsheets, and a lot of guesswork. We fixed that.
            </p>
          </div>

          <div className="about-svg-wrap">
            <svg viewBox="0 0 500 260">
              {[0,1,2,3,4,5].map(row =>
                [0,1,2,3,4,5,6,7,8,9].map(col => (
                  <circle key={`${row}-${col}`} cx={col * 55 + 10} cy={row * 48 + 10} r={1.5} fill="#E5E7EB" />
                ))
              )}
              <path
                ref={pathRef}
                d="M 30 200 C 80 200, 100 80, 180 80 S 280 160, 350 100 S 430 40, 470 60"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={30} cy={200} r={7} fill="#0D0D0D" />
              <circle cx={30} cy={200} r={3} fill="#fff" />
              <circle cx={470} cy={60} r={7} fill="#0EA5E9" />
              <circle cx={470} cy={60} r={3} fill="#fff" />
              <text x={18} y={220} fontSize={11} fill="#6B7280" fontFamily="Inter, sans-serif">Origin</text>
              <text x={445} y={80} fontSize={11} fill="#6B7280" fontFamily="Inter, sans-serif">Destination</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="about-divider-wrap">
        <div className="about-divider" />
      </div>

      {/* Stats strip */}
      <section className="about-stats">
        <div className="about-stats-grid">
          {[
            { value: 'Any Route', label: 'Compare transport modes side by side' },
            { value: 'Real Costs', label: 'Fuel, transit, hotels — nothing hidden' },
            { value: 'Your Budget', label: 'Set a number, get a plan that fits it' },
          ].map(({ value, label }) => (
            <div key={value}>
              <p className="about-stat-value">{value}</p>
              <p className="about-stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="about-story">
        <div>
          <p className="about-story-label">The Story</p>
        </div>
        <div className="about-story-body">
          <p>
            Travel planning is broken. Not because the tools don't exist — there are
            hundreds of them — but because none of them talk to each other. You find
            the flight, then the hotel, then the rental car, then realize the math
            doesn't work and start over.
          </p>
          <p>
            Ameer AI pulls it into one place. Tell us where you are, where you're going,
            and what you have to spend. We handle the comparison, the cost breakdown,
            and the advice — so you can focus on actually going somewhere.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values-inner">
          <p className="about-values-eyebrow">What we care about</p>
          <div className="about-values-grid">
            {[
              { title: 'Honest estimates', body: 'We show you what a trip will actually cost — tolls, parking, transit transfers included. No bait-and-switch after you click.' },
              { title: 'Every kind of traveller', body: 'Road-tripper, backpacker, family of five. Ameer AI adapts to how you move, not the other way around.' },
              { title: 'Speed over friction', body: 'From origin to route options in seconds. The less time you spend planning, the more time you spend going.' },
            ].map(({ title, body }) => (
              <div key={title} className="about-value-card">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <h2>Ready to plan smarter?</h2>
          <p>Enter your route and budget. Ameer does the rest.</p>
          <a href="/" className="about-cta-btn">Find best route →</a>
        </div>
      </section>

    </div>
    </div>
  )
}

export default About