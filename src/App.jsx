import { useEffect, useMemo, useState } from 'react'
import './index.css'

const heroConfigs = {
  nyc: {
    pill: 'World Tour Edition',
    titleStart: 'A World of ',
    titleEmphasis: 'Flavor',
    titleEnd: ' in Every Bite',
    text: "Curated gourmet cookies inspired by the heritage, spices, and stories of the world's most iconic cities.",
    image: 'assets/new-yorker.jpg',
    alt: 'New Yorker cookie',
    badgeTitle: 'Top Rated',
    badgeText: 'Voted "Most Authentic" by the Global Baker\'s Guild 2023.',
    stampLabel: 'Stamp #08',
    stampName: 'New York'
  },
  strawberry: {
    pill: 'London This Week',
    titleStart: 'A World of ',
    titleEmphasis: 'Berry',
    titleEnd: ' Softness in Every Bite',
    text: 'Bright strawberry notes, creaminess, and a softer travel-journal mood inspired by London tea rituals.',
    image: 'assets/strawberry.jpg',
    alt: 'Strawberry Shorty cookie',
    badgeTitle: 'Fresh Drop',
    badgeText: "This week's softest, fruit-forward arrival from the rotation.",
    stampLabel: 'Stamp #07',
    stampName: 'London Berry'
  },
  oman: {
    pill: 'Muscat This Week',
    titleStart: 'A World of ',
    titleEmphasis: 'Golden',
    titleEnd: ' Warmth in Every Bite',
    text: 'Saffron, pistachio, and cardamom layered into a warmer hero moment inspired by the Majlis Gold profile.',
    image: 'assets/oman.jpg',
    alt: 'Majlis Gold cookie',
    badgeTitle: 'House Favorite',
    badgeText: 'An Omani signature with saffron warmth and a richer, heritage-led profile.',
    stampLabel: 'Stamp #09',
    stampName: 'Muscat'
  }
}

const heroKeys = ['nyc', 'strawberry', 'oman']

const weeklyCards = [
  {
    regionClass: 'region-red',
    badgeClass: 'badge-red',
    landmarkClass: 'landmark-red',
    landmark: 'castle',
    badgeIcon: 'directions_bus',
    region: 'United Kingdom',
    title: 'Strawberry Shorty',
    text: 'Strawberries and clotted cream, inspired by the Royal Gardens.',
    image: 'assets/strawberry.jpg',
    alt: 'Strawberry Cookie'
  },
  {
    regionClass: 'region-blue',
    badgeClass: 'badge-blue',
    landmarkClass: 'landmark-blue',
    landmark: 'robot',
    badgeIcon: 'apartment',
    region: 'New York, USA',
    title: 'The New Yorker',
    text: 'Classic chunky chocolate chip with toasted walnuts and sea salt.',
    image: 'assets/new-yorker.jpg',
    alt: 'Chocolate Chip Cookie'
  },
  {
    regionClass: 'region-gold',
    badgeClass: 'badge-gold',
    landmarkClass: 'landmark-gold',
    landmark: 'mosque',
    badgeIcon: 'sailing',
    region: 'Muscat, Oman',
    title: 'The Majlis Gold',
    text: 'Saffron infused butter cookie with cardamom and pistachio.',
    image: 'assets/oman.jpg',
    alt: 'Saffron Cookie'
  }
]

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [heroKey, setHeroKey] = useState(heroKeys[0])
  const [autoplayStopped, setAutoplayStopped] = useState(false)
  const activeHero = useMemo(() => heroConfigs[heroKey], [heroKey])

  useEffect(() => {
    if (autoplayStopped) return undefined
    const interval = window.setInterval(() => {
      setHeroKey((current) => {
        const currentIndex = heroKeys.indexOf(current)
        return heroKeys[(currentIndex + 1) % heroKeys.length]
      })
    }, 5000)

    return () => window.clearInterval(interval)
  }, [autoplayStopped])

  useEffect(() => {
    const closeMenu = () => setMobileNavOpen(false)
    window.addEventListener('resize', closeMenu)
    return () => window.removeEventListener('resize', closeMenu)
  }, [])

  const handleHeroSelect = (key) => {
    setAutoplayStopped(true)
    setHeroKey(key)
  }

  return (
    <>
      <div className="homepage-stamp-bg" aria-hidden="true"></div>
      <header className="site-header">
        <nav className={`nav-shell nav-shell-stacked ${mobileNavOpen ? 'mobile-nav-open' : ''}`}>
          <button className="mobile-nav-toggle" type="button" aria-expanded={mobileNavOpen} aria-controls="site-mobile-nav" aria-label="Open navigation" onClick={() => setMobileNavOpen((open) => !open)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="brand brand-stacked"><img className="brand-logo-en" src="assets/rihla-logo-en.jpg" alt="Rihla" /><span className="brand-arabic"><img className="brand-logo-ar" src="assets/rihla-logo-ar.jpg" alt="رحلة" /></span></div>
          <div className="nav-links">
            <a className="active" href="index.html">Weekly Flavors</a>
            <a href="order.html">Order Now</a>
            <a href="story.html">Our Story</a>
          </div>
          <div className="nav-actions">
            <a className="primary-nav-btn" href="order.html">Order Now</a>
            <button className="passport-nav" type="button">
              <span className="material-symbols-outlined">confirmation_number</span>
              <span>Passport</span>
            </button>
          </div>
          <div className="mobile-nav-panel" id="site-mobile-nav">
            <a href="index.html">Weekly Flavors</a>
            <a href="order.html">Order Now</a>
            <a href="story.html">Our Story</a>
            <a href="world-tour.html">World Tour</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-proto page-width">
          <div className="hero-copy-proto hero-slide-copy" id="hero-copy-wrap">
            <span className="hero-pill" id="hero-pill">{activeHero.pill}</span>
            <h1 id="hero-title">{activeHero.titleStart}<em>{activeHero.titleEmphasis}</em>{activeHero.titleEnd}</h1>
            <p id="hero-text">{activeHero.text}</p>
            <div className="hero-cta-row">
              <button className="cta-primary" type="button">Board the Flight</button>
              <button className="cta-secondary" type="button">View Menu</button>
            </div>
            <div className="hero-toggle hero-gallery-dots" data-live>
              {heroKeys.map((key) => (
                <button key={key} className={`hero-toggle-btn ${heroKey === key ? 'active' : ''}`} type="button" data-hero={key} aria-label={`Show ${heroConfigs[key].stampName} slide`} onClick={() => handleHeroSelect(key)}></button>
              ))}
            </div>
          </div>

          <div className="hero-art-proto hero-slide-art" id="hero-art-wrap">
            <div className="hero-orb"></div>
            <img className="hero-main-image" id="hero-image" src={activeHero.image} alt={activeHero.alt} />
            <div className="hero-city-stamp" id="hero-city-stamp">
              <span className="material-symbols-outlined hero-city-stamp-icon">confirmation_number</span>
              <p id="hero-city-stamp-label">{activeHero.stampLabel}</p>
              <strong id="hero-city-stamp-name">{activeHero.stampName}</strong>
            </div>
            <div className="hero-float-card">
              <div className="hero-float-title">
                <span className="material-symbols-outlined">star</span>
                <strong id="hero-badge-title">{activeHero.badgeTitle}</strong>
              </div>
              <p id="hero-badge-text">{activeHero.badgeText}</p>
            </div>
          </div>
        </section>

        <section className="rotation-proto">
          <div className="page-width">
            <div className="section-top-row">
              <div>
                <h2>Weekly Rotation</h2>
                <p>Our globe-trotting oven lands in these destinations this week. Get them before the flight departs.</p>
              </div>
              <div className="status-row">
                <div className="status-pill live"><span className="dot"></span>Live Now</div>
                <div className="status-pill">Ends in 3 Days</div>
              </div>
            </div>

            <div className="rotation-grid">
              {weeklyCards.map((card) => (
                <article className="rotation-card" key={card.title}>
                  <div className={`landmark ${card.landmarkClass}`}><span className="material-symbols-outlined">{card.landmark}</span></div>
                  <span className={`region-chip ${card.regionClass}`}>{card.region}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <div className="cookie-stage">
                    <img src={card.image} alt={card.alt} />
                    <div className={`mini-badge ${card.badgeClass}`}><span className="material-symbols-outlined">{card.badgeIcon}</span></div>
                  </div>
                  <button className="add-box-btn" type="button">Add to Box <span className="material-symbols-outlined">add</span></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="passport-proto">
          <div className="page-width">
            <div className="passport-panel-proto">
              <div className="passport-copy-proto">
                <h2>Track Your Passport</h2>
                <p>Every cookie is a stamp. Every dozen is a reward. Collect stamps from every destination to unlock limited-edition boxes and early flight access.</p>

                <div className="passport-progress-wrap">
                  <div className="progress-head">
                    <span>Frequent Flyer Progress</span>
                    <span>8 / 12 Stamps</span>
                  </div>
                  <div className="passport-progress-bar">
                    <div className="passport-progress-fill"></div>
                    <span className="material-symbols-outlined plane-mark">flight</span>
                  </div>
                </div>

                <button className="cta-primary large" type="button">Open Your Passport</button>
              </div>

              <div className="passport-card-proto">
                <div className="passport-card-top">
                  <span className="passport-tag">Rihla Voyager</span>
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <h3>The Editorial Passport</h3>
                <p>Stamped from Muscat to Manhattan. A loyalty ritual for frequent flavor flyers.</p>
                <div className="passport-dots">
                  <span className="filled"></span>
                  <span className="filled"></span>
                  <span className="filled"></span>
                  <span className="filled"></span>
                  <span className="filled"></span>
                  <span className="filled"></span>
                  <span className="filled"></span>
                  <span className="filled"></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-proto">
        <div className="page-width footer-inner">
          <div>
            <div className="footer-brand">Rihla Cookies</div>
            <p>© 2024 Rihla Cookies. The Editorial Passport.</p>
          </div>
          <div className="footer-links">
            <a href="#">Passport Loyalty</a>
            <a href="#">Instagram</a>
            <a href="#">Shipping Info</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
