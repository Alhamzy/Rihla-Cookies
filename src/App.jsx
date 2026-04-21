import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import Globe from 'react-globe.gl'
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
const navLinks = [
  { to: '/', label: 'Weekly Flavors' },
  { to: '/order', label: 'Order Now' },
  { to: '/story', label: 'Our Story' },
  { to: '/world-tour', label: 'World Tour' }
]

const weeklyCards = [
  { regionClass: 'region-red', badgeClass: 'badge-red', landmarkClass: 'landmark-red', landmark: 'castle', badgeIcon: 'directions_bus', region: 'United Kingdom', title: 'Strawberry Shorty', text: 'Strawberries and clotted cream, inspired by the Royal Gardens.', image: 'assets/strawberry.jpg', alt: 'Strawberry Cookie' },
  { regionClass: 'region-blue', badgeClass: 'badge-blue', landmarkClass: 'landmark-blue', landmark: 'robot', badgeIcon: 'apartment', region: 'New York, USA', title: 'The New Yorker', text: 'Classic chunky chocolate chip with toasted walnuts and sea salt.', image: 'assets/new-yorker.jpg', alt: 'Chocolate Chip Cookie' },
  { regionClass: 'region-gold', badgeClass: 'badge-gold', landmarkClass: 'landmark-gold', landmark: 'mosque', badgeIcon: 'sailing', region: 'Muscat, Oman', title: 'The Majlis Gold', text: 'Saffron infused butter cookie with cardamom and pistachio.', image: 'assets/oman.jpg', alt: 'Saffron Cookie' }
]

const orderItems = {
  'earl-grey': { id: 'earl-grey', name: 'Earl Grey Chunk', region: 'London, UK', price: 4.5 },
  'big-apple': { id: 'big-apple', name: 'The Big Apple Levain', region: 'New York, USA', price: 5.5 },
  'saffron-jewel': { id: 'saffron-jewel', name: 'The Saffron Jewel', region: 'Muscat, Oman', price: 6.0 }
}

const storyLocations = [
  { name: 'New York', lat: 40.7128, lng: -74.006, target: 'nyc-story', color: '#0061a3', flavor: 'The New Yorker', blurb: 'Dark chocolate, sea salt, and toasted pretzel crunch.' },
  { name: 'London', lat: 51.5074, lng: -0.1278, target: 'london-story', color: '#b6171e', flavor: 'Strawberry Shorty', blurb: 'Strawberries, cream, and a tea-time softness.' },
  { name: 'Muscat', lat: 23.588, lng: 58.3829, target: 'muscat-story', color: '#7c5800', flavor: 'Majlis Gold', blurb: 'Saffron, cardamom, and warm Omani hospitality.' }
]


function SiteShell({ children, active }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <>
      <header className="site-header">
        <nav className={`nav-shell nav-shell-stacked ${mobileNavOpen ? 'mobile-nav-open' : ''}`}>
          <button className="mobile-nav-toggle" type="button" aria-expanded={mobileNavOpen} aria-controls="site-mobile-nav" aria-label="Open navigation" onClick={() => setMobileNavOpen((open) => !open)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="brand brand-stacked"><img className="brand-logo-en" src="assets/rihla-logo-en.jpg" alt="Rihla" /><span className="brand-arabic"><img className="brand-logo-ar" src="assets/rihla-logo-ar.jpg" alt="رحلة" /></span></div>
          <div className="nav-links">
            {navLinks.slice(0, 3).map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive || active === link.to ? 'active' : ''}>{link.label}</NavLink>
            ))}
          </div>
          <div className="nav-actions">
            <Link className="primary-nav-btn" to="/order">Order Now</Link>
            <button className="passport-nav" type="button"><span className="material-symbols-outlined">confirmation_number</span><span>Passport</span></button>
          </div>
          <div className="mobile-nav-panel" id="site-mobile-nav">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileNavOpen(false)}>{link.label}</Link>
            ))}
          </div>
        </nav>
      </header>
      {children}
    </>
  )
}

function HomePage() {
  const [heroKey, setHeroKey] = useState(heroKeys[0])
  const [autoplayStopped, setAutoplayStopped] = useState(false)
  const activeHero = useMemo(() => heroConfigs[heroKey], [heroKey])

  useEffect(() => {
    if (autoplayStopped) return undefined
    const interval = window.setInterval(() => {
      setHeroKey((current) => heroKeys[(heroKeys.indexOf(current) + 1) % heroKeys.length])
    }, 5000)
    return () => window.clearInterval(interval)
  }, [autoplayStopped])

  return (
    <>
      <div className="homepage-stamp-bg" aria-hidden="true"></div>
      <SiteShell active="/">
        <main>
          <section className="hero-proto page-width">
            <div className="hero-copy-proto hero-slide-copy">
              <span className="hero-pill">{activeHero.pill}</span>
              <h1>{activeHero.titleStart}<em>{activeHero.titleEmphasis}</em>{activeHero.titleEnd}</h1>
              <p>{activeHero.text}</p>
              <div className="hero-cta-row">
                <button className="cta-primary" type="button">Board the Flight</button>
                <button className="cta-secondary" type="button">View Menu</button>
              </div>
              <div className="hero-toggle hero-gallery-dots">
                {heroKeys.map((key) => (
                  <button key={key} className={`hero-toggle-btn ${heroKey === key ? 'active' : ''}`} type="button" onClick={() => { setAutoplayStopped(true); setHeroKey(key) }}></button>
                ))}
              </div>
            </div>
            <div className="hero-art-proto hero-slide-art">
              <div className="hero-orb"></div>
              <img className="hero-main-image" src={activeHero.image} alt={activeHero.alt} />
              <div className="hero-city-stamp"><span className="material-symbols-outlined hero-city-stamp-icon">confirmation_number</span><p>{activeHero.stampLabel}</p><strong>{activeHero.stampName}</strong></div>
              <div className="hero-float-card"><div className="hero-float-title"><span className="material-symbols-outlined">star</span><strong>{activeHero.badgeTitle}</strong></div><p>{activeHero.badgeText}</p></div>
            </div>
          </section>
          <section className="rotation-proto"><div className="page-width"><div className="section-top-row"><div><h2>Weekly Rotation</h2><p>Our globe-trotting oven lands in these destinations this week. Get them before the flight departs.</p></div><div className="status-row"><div className="status-pill live"><span className="dot"></span>Live Now</div><div className="status-pill">Ends in 3 Days</div></div></div><div className="rotation-grid">{weeklyCards.map((card) => <article className="rotation-card" key={card.title}><div className={`landmark ${card.landmarkClass}`}><span className="material-symbols-outlined">{card.landmark}</span></div><span className={`region-chip ${card.regionClass}`}>{card.region}</span><h3>{card.title}</h3><p>{card.text}</p><div className="cookie-stage"><img src={card.image} alt={card.alt} /><div className={`mini-badge ${card.badgeClass}`}><span className="material-symbols-outlined">{card.badgeIcon}</span></div></div><button className="add-box-btn" type="button">Add to Box <span className="material-symbols-outlined">add</span></button></article>)}</div></div></section>
          <section className="passport-proto"><div className="page-width"><div className="passport-panel-proto"><div className="passport-copy-proto"><h2>Track Your Passport</h2><p>Every cookie is a stamp. Every dozen is a reward. Collect stamps from every destination to unlock limited-edition boxes and early flight access.</p><div className="passport-progress-wrap"><div className="progress-head"><span>Frequent Flyer Progress</span><span>8 / 12 Stamps</span></div><div className="passport-progress-bar"><div className="passport-progress-fill"></div><span className="material-symbols-outlined plane-mark">flight</span></div></div><button className="cta-primary large" type="button">Open Your Passport</button></div><div className="passport-card-proto"><div className="passport-card-top"><span className="passport-tag">Rihla Voyager</span><span className="material-symbols-outlined">confirmation_number</span></div><h3>The Editorial Passport</h3><p>Stamped from Muscat to Manhattan. A loyalty ritual for frequent flavor flyers.</p><div className="passport-dots"><span className="filled"></span><span className="filled"></span><span className="filled"></span><span className="filled"></span><span className="filled"></span><span className="filled"></span><span className="filled"></span><span className="filled"></span><span></span><span></span><span></span><span></span></div></div></div></div></section>
        </main>
        <Footer />
      </SiteShell>
    </>
  )
}

function OrderPage() {
  const [selectedPack, setSelectedPack] = useState(4)
  const [orderBag, setOrderBag] = useState(['earl-grey', 'saffron-jewel'])
  const counts = orderBag.reduce((acc, id) => ({ ...acc, [id]: (acc[id] || 0) + 1 }), {})
  const subtotal = orderBag.reduce((sum, id) => sum + (orderItems[id]?.price || 0), 0)
  const currentCount = orderBag.length % selectedPack
  const displayCount = currentCount === 0 && orderBag.length > 0 ? selectedPack : currentCount
  const buildOrderMessage = () => {
    const lines = Object.entries(counts).map(([id, qty]) => {
      const item = orderItems[id]
      return `- ${item.name} x${qty} (${item.region}) - $${(item.price * qty).toFixed(2)}`
    })
    return `Hi Rihla Cookies, I want to place an order.%0A%0APack size: ${selectedPack}%0ATotal cookies selected: ${orderBag.length}%0A%0AOrder summary:%0A${lines.join('%0A')}%0A%0ASubtotal: $${subtotal.toFixed(2)}`
  }
  return <SiteShell active="/order"><main className="order-proto-main page-width"><header className="page-intro"><p>The Editorial Passport</p><h1>Start Your Journey</h1></header><div className="order-layout-proto"><section className="order-list-proto">{[
    { id: 'earl-grey', image: 'assets/strawberry.jpg', tag: 'London', tagClass: 'red', landmark: 'castle', landmarkClass: 'red', title: 'The Earl Grey Chunk', text: 'Bergamot infused dough with 70% dark chocolate shards and a hint of English lavender.', price: '$4.50' },
    { id: 'big-apple', image: 'assets/new-yorker.jpg', tag: 'NYC', tagClass: 'blue', landmark: 'robot', landmarkClass: 'blue', title: 'The Big Apple Levain', text: 'A massive 6oz cookie with toasted walnuts, semi-sweet chips, and a gooey molten center.', price: '$5.50', reverse: true },
    { id: 'saffron-jewel', image: 'assets/oman.jpg', tag: 'Muscat', tagClass: 'gold', landmark: 'mosque', landmarkClass: 'gold', title: 'The Saffron Jewel', text: 'Omani saffron, white chocolate, and crushed pistachios finished with local honey drizzle.', price: '$6.00' }
  ].map((item) => <article key={item.id} className={`order-item-card ${item.reverse ? 'reverse' : ''}`}><div className={`order-item-image ${item.reverse ? 'right' : 'left'}`}><img src={item.image} alt={item.title} /><span className={`region-tag ${item.tagClass}`}>{item.tag}</span></div><div className="order-item-copy"><div className={`float-landmark ${item.reverse ? 'left' : 'right'} ${item.landmarkClass}`}><span className="material-symbols-outlined">{item.landmark}</span></div><h3>{item.title}</h3><p>{item.text}</p><div className="order-line"><strong>{item.price}</strong><button type="button" className="add-order-btn" onClick={() => setOrderBag((bag) => [...bag, item.id])}>Add to Box</button></div></div></article>)}</section><aside className="order-sidebar-proto"><div className="box-card-proto"><h2>Your Box <span className="material-symbols-outlined">luggage</span></h2><div className="pack-grid">{[4,6,12].map((pack) => <button key={pack} className={`pack-btn ${selectedPack === pack ? 'active' : ''}`} type="button" onClick={() => setSelectedPack(pack)}><span>{pack}</span><small>Pack</small></button>)}</div><div className="box-progress"><div className="box-progress-head"><span>Box Progress</span><strong>{displayCount}/{selectedPack} Selected</strong></div><div className="box-progress-bar"><div id="box-progress-fill" style={{ width: `${(displayCount / selectedPack) * 100}%` }}></div><span className="material-symbols-outlined">cookie</span></div></div><div className="box-items">{Object.entries(counts).map(([id, qty]) => <div key={id} className="box-item-row"><div><strong>{orderItems[id].name}{qty > 1 ? ` x${qty}` : ''}</strong><p>{orderItems[id].region}</p></div><button type="button" className="remove-order-btn" onClick={() => setOrderBag((bag) => { const next = [...bag]; next.splice(next.lastIndexOf(id), 1); return next })}>close</button></div>)}</div><div className="box-total"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><button className="cta-primary full review-btn" type="button"><span className="review-label">Review Box</span> <span className="material-symbols-outlined">arrow_forward</span></button><div className="social-order-links"><a href={`https://wa.me/?text=${buildOrderMessage()}`} target="_blank" rel="noreferrer">Continue to WhatsApp</a><a href="https://ig.me/m/rihlacookies" target="_blank" rel="noreferrer">Continue to Instagram</a></div></div><div className="red-passport-card"><h4>The Editorial Passport</h4><p>Earn stamps with every regional cookie you try. 10 stamps = 1 Gold Tin Box.</p><a href="#">Learn more</a><span className="material-symbols-outlined big-ticket">confirmation_number</span></div></aside></div></main><Footer /></SiteShell>
}

function StoryMap() {
  const globeRef = useRef(null)
  const [activeCity, setActiveCity] = useState(storyLocations[0])

  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.45
    globe.pointOfView({ lat: 22, lng: 8, altitude: 2.1 }, 0)
  }, [])

  const focusCity = (city) => {
    setActiveCity(city)
    const globe = globeRef.current
    if (globe) {
      globe.controls().autoRotate = false
      globe.pointOfView({ lat: city.lat, lng: city.lng, altitude: 1.5 }, 1200)
    }
  }

  const viewFlavor = () => {
    const node = document.getElementById(activeCity.target)
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="rihla-globe-wrap">
      <div className="rihla-globe-panel">
        <Globe
          ref={globeRef}
          width={980}
          height={420}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere={true}
          atmosphereColor="#f2e9dc"
          atmosphereAltitude={0.14}
          pointsData={storyLocations}
          pointLat={(d) => d.lat}
          pointLng={(d) => d.lng}
          pointColor={(d) => d.color}
          pointAltitude={0.12}
          pointRadius={0.55}
          pointResolution={18}
          onPointClick={focusCity}
          onPointHover={(point) => point && setActiveCity(point)}
        />
      </div>
      <aside className="globe-city-card">
        <p className="globe-city-kicker">Flavor City</p>
        <h3>{activeCity.name}</h3>
        <strong>{activeCity.flavor}</strong>
        <p>{activeCity.blurb}</p>
        <button className="cta-primary" type="button" onClick={viewFlavor}>View Flavor</button>
      </aside>
    </div>
  )
}

function StoryPage() {
  return <SiteShell active="/story"><main className="story-proto-main"><section className="story-hero-proto page-width"><span className="story-pill">The Editorial Passport</span><h1>The Flavor Map.</h1><p>Every recipe is a stamped entry in our journal, a fusion of heritage techniques and the sensory memories of global travel. Our cookies aren't just baked, they are curated.</p><StoryMap /></section><section className="story-band soft" id="london-story"><div className="page-width story-editorial-grid"><div className="story-copy"><span className="mini-label red">Tea Time Rituals</span><h2>London's Tea Time.</h2><p>Informed by the crisp mornings of Covent Garden and the refined ritual of high tea. We took the classic British shortbread and reimagined it with a heart of macerated strawberries and a delicate clotted cream frosting.</p></div><div className="story-triptych london-triptych"><div className="story-city-card city-london-top"><img src="assets/london-city-1.jpg" alt="London city" /></div><img className="story-cookie-card" src="assets/strawberry.jpg" alt="Strawberry cookie" /><div className="story-city-card city-london-bottom"><img src="assets/london-city-2.jpg" alt="London street" /><span>MARYLEBONE MOOD</span></div></div></div></section><section className="story-band" id="nyc-story"><div className="page-width story-editorial-grid"><div className="story-copy"><span className="mini-label blue">Concrete Dreams</span><h2>The Streets of Manhattan.</h2><p>Inspired by the everything, everywhere energy of the Lower East Side. This is The New Yorker, a heavy oversized cookie featuring dark chocolate chunks, sea salt, and a toasted pretzel crunch that mirrors the city's beautiful chaos.</p></div><div className="story-triptych manhattan-triptych"><div className="story-city-card city-ny-top"><img src="assets/nyc-city-1.jpg" alt="New York city" /></div><img className="story-cookie-card" src="assets/new-yorker.jpg" alt="New Yorker cookie" /><div className="story-city-card city-ny-bottom"><img src="assets/nyc-city-2.jpg" alt="New York skyline" /><span>EMPIRE STATE OF MIND</span></div></div></div></section><section className="story-band gold-wash" id="muscat-story"><div className="page-width story-editorial-grid"><div className="story-copy"><span className="mini-label gold">Desert Warmth</span><h2>The Heart of Muscat.</h2><p>Our origin story. This cookie captures the hospitality of the Omani Majlis. We use premium saffron threads and hand-ground cardamom, folded into a dough that is soft as the dunes of the Sharqiya Sands.</p></div><div className="story-triptych muscat-triptych"><div className="story-city-card city-muscat-top"><img src="assets/muscat-city-1.jpg" alt="Muscat architecture" /></div><img className="story-cookie-card" src="assets/oman.jpg" alt="Majlis Gold cookie" /><div className="story-city-card city-muscat-bottom"><img src="assets/muscat-city-2.jpg" alt="Muscat mood" /><span>GOLDEN MAJLIS</span></div></div></div></section><section className="journey-band page-width"><h4>Our Journey So Far</h4><div className="journey-line"><div className="journey-fill"></div><div className="journey-plane"><span className="material-symbols-outlined">flight</span></div><span className="journey-mark left">Muscat (2018)</span><span className="journey-mark center">London (2021)</span><span className="journey-mark right">New York (Now)</span></div><button className="cta-primary" type="button">Start Your Journey</button></section></main><Footer /></SiteShell>
}

function WorldTourPage() {
  return <SiteShell active="/world-tour"><main className="tour-proto-main"><section className="tour-hero-proto page-width wide-pad"><div className="tour-copy-proto"><span>Departing Weekly</span><h1>The World Tour <em>Edition</em></h1><p>Every week is a new global flight. We curate artisanal cookies inspired by the world's most iconic flavors, bringing the terminal to your table.</p><button className="cta-primary" type="button">Board the Flight</button></div><div className="tour-suitcase-wrap"><div className="tour-suitcase-glow"></div><div className="tour-suitcase-image"></div></div></section><section className="manifest-band"><div className="page-width"><div className="manifest-head"><div><h2>Flight Manifest</h2><p>Batch No. 402 — Current Destinations</p></div><div className="manifest-status"><span className="material-symbols-outlined">flight_takeoff</span><span>Status: In Transit</span></div></div><div className="manifest-grid-proto"><article><div className="manifest-top"><span className="region-chip region-red light">London</span><span className="material-symbols-outlined red">castle</span></div><img src="assets/strawberry.jpg" alt="London cookie" /><h3>The Earl Grey Shortbread</h3><p>Bergamot-infused dough with a touch of Cornish sea salt and a lemon glaze finish.</p></article><article><div className="manifest-top"><span className="region-chip region-blue light">New York</span><span className="material-symbols-outlined blue">robot</span></div><img src="assets/new-yorker.jpg" alt="New York cookie" /><h3>The Manhattan Chunk</h3><p>A heavy-weight walnut and dark chocolate masterpiece inspired by Levain's legendary bakes.</p></article><article className="bordered-gold"><div className="manifest-top"><span className="region-chip region-gold light">Muscat</span><span className="material-symbols-outlined gold">sailing</span></div><img src="assets/oman.jpg" alt="Muscat cookie" /><h3>The Saffron Halwa</h3><p>Omani dates, toasted sesame, and a heart of saffron-infused honey. Our signature heritage bake.</p></article></div></div></section><section className="passport-reward-band page-width"><div className="passport-book-wrap"><div className="passport-book"><div className="passport-book-inner"><div className="passport-seal"><span className="material-symbols-outlined">public</span></div><h4>Passport of Flavor</h4><div className="passport-dot-grid"><span className="filled"></span><span className="filled"></span><span></span><span></span><span></span><span></span></div><p>Holder: Rihla Voyager</p></div><div className="gold-reward-box"><span className="material-symbols-outlined">inventory_2</span><strong>The Gold Tin Box Reward</strong></div></div></div><div className="passport-reward-copy"><span className="mini-label gold">Loyalty Miles</span><h2>Earn Your Stamps, Claim the Gold.</h2><p>Every World Tour box comes with a physical passport stamp. Collect 10 stamps from different flights to unlock our limited edition Gold Tin Box.</p><ul><li><span className="material-symbols-outlined">check</span>1 Box = 1 Official Stamp</li><li><span className="material-symbols-outlined">check</span>Valid on all International Flavors</li><li><span className="material-symbols-outlined">check</span>Exclusive Voyager Status at 10 Stamps</li></ul></div></section><section className="next-gate-band"><div className="page-width"><div className="next-gate-head"><h2>Next Week's Gate</h2><p>Estimated Departure: Monday, 09:00 AM</p></div><div className="next-gate-grid"><div>Paris</div><div>Tokyo</div><div>Rome</div><div>Secret Stop</div></div></div></section><section className="takeoff-band page-width"><div className="takeoff-icon"><span className="material-symbols-outlined">confirmation_number</span></div><h2>Ready for Takeoff?</h2><p>Limited batches per week. Once the flight is closed, these flavors return to the archive. Don't let your tastebuds miss the connection.</p><div className="hero-cta-row"><button className="cta-primary" type="button">Board the Flight</button><button className="cta-secondary" type="button">View Schedule</button></div></section></main><Footer tour /></SiteShell>
}

function Footer({ tour = false }) {
  if (tour) return <footer className="tour-footer-proto"><div className="page-width tour-footer-inner"><div className="footer-brand upper">Rihla Cookies</div><div className="tour-footer-links"><a href="#">Shipping Policy</a><a href="#">Global Terms</a><a href="#">Sustainability</a><a href="#">Wholesale</a></div><p>© 2024 Rihla Cookies. Curated by The Nomadic Patisserie.</p></div></footer>
  return <footer className="footer-proto"><div className="page-width footer-inner"><div><div className="footer-brand">Rihla Cookies</div><p>© 2024 Rihla Cookies. The Editorial Passport.</p></div><div className="footer-links"><a href="#">Passport Loyalty</a><a href="#">Instagram</a><a href="#">Shipping Info</a><a href="#">Contact</a></div></div></footer>
}

function App() {
  return <BrowserRouter basename="/Rihla-Cookies"><Routes><Route path="/" element={<HomePage />} /><Route path="/order" element={<OrderPage />} /><Route path="/story" element={<StoryPage />} /><Route path="/world-tour" element={<WorldTourPage />} /></Routes></BrowserRouter>
}

export default App
