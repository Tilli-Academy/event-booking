import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STATS = [
  { value: "500+", label: "Events Completed" },
  { value: "200+", label: "Happy Clients" },
  { value: "7+", label: "Event Categories" },
  { value: "50+", label: "Venues Covered" },
];

const STEPS = [
  { number: "1", title: "Browse", description: "Explore our wide range of event services tailored for every occasion." },
  { number: "2", title: "Book", description: "Pick your date, add any special requests, and submit your booking." },
  { number: "3", title: "Celebrate", description: "We handle the details so you can enjoy a flawless event." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", text: "They made our wedding absolutely magical. Every detail was taken care of perfectly.", event: "Marriage Event" },
  { name: "Rahul Mehta", text: "The birthday party for my daughter was beyond our expectations. Highly recommended!", event: "Child 1st Birthday" },
  { name: "Anjali Verma", text: "Professional, punctual, and creative. Our engagement ceremony was flawless.", event: "Engagement Event" },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page home-page">
      <div className="container">
        {/* Hero */}
        <div className="hero">
          <h1>Make Every Event Unforgettable</h1>
          <p>
            From intimate birthdays to grand weddings, we bring your vision to
            life with meticulous planning, stunning decor, and seamless
            execution.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary">
              Explore Services
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline">
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <section className="stats-section">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="section">
          <div className="page-header">
            <h1>How It Works</h1>
            <p>Book your dream event in three simple steps</p>
          </div>
          <div className="grid grid-3">
            {STEPS.map((step) => (
              <div key={step.number} className="card step-card">
                <div className="card-body">
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why choose us */}
        <section className="section why-section">
          <div className="page-header">
            <h1>Why Choose Us</h1>
            <p>What sets EventBooking apart</p>
          </div>
          <div className="grid grid-3">
            <div className="card">
              <div className="card-body">
                <h3>Experienced Team</h3>
                <p>Our planners bring years of expertise to every event, big or small.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3>Transparent Pricing</h3>
                <p>No hidden costs. See upfront pricing for every service before you book.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3>End-to-End Support</h3>
                <p>From initial planning to day-of coordination, we handle it all.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section">
          <div className="page-header">
            <h1>What Our Clients Say</h1>
            <p>Real stories from real celebrations</p>
          </div>
          <div className="grid grid-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card testimonial-card">
                <div className="card-body">
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <strong>{t.name}</strong>
                    <span>{t.event}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Ready to Plan Your Next Event?</h2>
          <p>Let us handle the details while you enjoy the moments that matter.</p>
          <Link to="/services" className="btn btn-primary">
            View Our Services
          </Link>
        </section>
      </div>
    </div>
  );
}
