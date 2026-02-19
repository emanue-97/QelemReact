import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Theme effect
  useEffect(() => {
    const savedTheme = localStorage.getItem("qelem-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("qelem-theme", newTheme);
  };

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll reveal effect
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = [
              ...entry.target.parentElement.querySelectorAll(".reveal"),
            ];
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add("visible"), idx * 80);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    reveals.forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  // Form validation
  const validateField = (name, value) => {
    if (name === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }
    return value.trim().length > 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on input if field becomes valid
    if (formErrors[name] && validateField(name, value)) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const isValid = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: !isValid }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        errors[key] = true;
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 6000);
      }, 1400);
    }
  };

  const trainers = [
    {
      id: 1,
      name: "Amanuel Bekele",
      initials: "AB",
      title: "Financial Literacy Specialist",
      category: "finance",
      badge: "Top Rated",
      gradient: "linear-gradient(135deg,#C08B18,#8B6010)",
      expertise: ["Financial Planning", "Budgeting", "Tax Compliance"],
      rating: 5.0,
      sessions: 84,
    },
    {
      id: 2,
      name: "Sara Tadesse",
      initials: "ST",
      title: "Digital Marketing Consultant",
      category: "marketing",
      badge: null,
      gradient: "linear-gradient(135deg,#2A7A6E,#1B5E6B)",
      expertise: ["Social Media", "Brand Strategy", "Content Marketing"],
      rating: 4.9,
      sessions: 62,
    },
    {
      id: 3,
      name: "Mikael Girma",
      initials: "MG",
      title: "Operations & Supply Chain Expert",
      category: "operations",
      badge: "New",
      gradient: "linear-gradient(135deg,#4B6CB7,#182848)",
      expertise: ["Logistics", "Process Optimization", "Inventory Management"],
      rating: 4.8,
      sessions: 41,
    },
    {
      id: 4,
      name: "Hana Woldemichael",
      initials: "HW",
      title: "Business Strategy Advisor",
      category: "finance",
      badge: null,
      gradient: "linear-gradient(135deg,#834D9B,#4A2060)",
      expertise: [
        "Business Planning",
        "Investment Readiness",
        "Growth Strategy",
      ],
      rating: 4.9,
      sessions: 78,
    },
    {
      id: 5,
      name: "Dawit Haile",
      initials: "DH",
      title: "Sales & Customer Acquisition Coach",
      category: "marketing",
      badge: "Top Rated",
      gradient: "linear-gradient(135deg,#E05252,#8B1A1A)",
      expertise: ["Sales Strategy", "Customer Retention", "CRM Systems"],
      rating: 5.0,
      sessions: 95,
    },
    {
      id: 6,
      name: "Liya Mekonen",
      initials: "LM",
      title: "HR & Organizational Development",
      category: "operations",
      badge: null,
      gradient: "linear-gradient(135deg,#3CA55C,#1A5E2A)",
      expertise: ["Team Building", "HR Systems", "Leadership"],
      rating: 4.7,
      sessions: 53,
    },
  ];

  const filteredTrainers =
    activeFilter === "all"
      ? trainers
      : trainers.filter((t) => t.category === activeFilter);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      "★".repeat(fullStars) +
      (hasHalfStar ? "☆" : "") +
      "☆".repeat(5 - Math.ceil(rating))
    );
  };

  return (
    <div className="App">
      {/* NAVBAR */}
      <nav
        id="navbar"
        className={navbarScrolled ? "scrolled" : ""}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container">
          <div className="nav-inner">
            <button
              onClick={() => scrollToSection("hero")}
              className="logo"
              aria-label="Qelem Home"
            >
              <div className="logo-mark">Q</div>
              Qelem
            </button>
            // eslint-disable-next-line jsx-a11y/no-redundant-roles
            <ul
              className={`nav-links ${mobileMenuOpen ? "open" : ""}`}
              id="navLinks"
              role="list"
            >
              <li>
                <button onClick={() => scrollToSection("hero")}>Home</button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")}>
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("bdsp")}>
                  BDSP Directory
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("contact")}>
                  Contact Us
                </button>
              </li>
            </ul>
            <div className="nav-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                <svg
                  className="icon-moon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <svg
                  className="icon-sun"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>
              <button
                className="menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" aria-label="Hero">
        <div className="hero-pattern"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">
                <span></span>Launched in Ethiopia
              </div>
              <h1 className="hero-heading">
                Ethiopia's First <em>Skill-Building</em> Marketplace for MSMEs
              </h1>
              <p className="hero-sub">
                Qelem connects small and medium-sized enterprises (MSMEs) with
                trusted experts to unlock growth.
              </p>
              <div className="hero-cta-group">
                <button
                  onClick={() => scrollToSection("services")}
                  className="btn-primary"
                >
                  Explore Services
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollToSection("bdsp")}
                  className="btn-ghost-white"
                >
                  Meet Our Trainers
                </button>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>200+</strong>
                  <span>Expert Trainers</span>
                </div>
                <div className="hero-stat">
                  <strong>50+</strong>
                  <span>Service Categories</span>
                </div>
                <div className="hero-stat">
                  <strong>1,400+</strong>
                  <span>MSMEs Served</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-card">
                <div className="hero-card-top">
                  <div className="hc-avatar">A</div>
                  <div className="hc-info">
                    <strong>Amanuel Bekele</strong>
                    <span>Financial Literacy Expert</span>
                  </div>
                </div>
                <div className="hc-tags">
                  <span className="hc-tag">Finance</span>
                  <span className="hc-tag">Budgeting</span>
                  <span className="hc-tag">Business Planning</span>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="hero-card" style={{ margin: 0 }}>
                  <div
                    style={{
                      fontSize: ".65rem",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      color: "rgba(255,255,255,.45)",
                      marginBottom: "8px",
                      fontWeight: 600,
                    }}
                  >
                    Active Sessions
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "2.2rem",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    38
                  </div>
                  <div
                    style={{
                      fontSize: ".72rem",
                      color: "rgba(255,255,255,.5)",
                      marginTop: "4px",
                    }}
                  >
                    Today
                  </div>
                </div>
                <div className="hero-card" style={{ margin: 0 }}>
                  <div
                    style={{
                      fontSize: ".65rem",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      color: "rgba(255,255,255,.45)",
                      marginBottom: "8px",
                      fontWeight: 600,
                    }}
                  >
                    Rating
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "2.2rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    4.9
                  </div>
                  <div
                    style={{
                      fontSize: ".72rem",
                      color: "rgba(255,255,255,.5)",
                      marginTop: "4px",
                    }}
                  >
                    ★★★★★
                  </div>
                </div>
              </div>
              <div className="hero-card-lg">
                <div className="hcl-label">Business Growth Areas</div>
                <div className="hcl-progress-list">
                  <div className="hcl-prog-item">
                    <div className="hcl-prog-label">
                      <span>Finance & Accounting</span>
                      <span>82%</span>
                    </div>
                    <div className="hcl-bar">
                      <div className="hcl-fill" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                  <div className="hcl-prog-item">
                    <div className="hcl-prog-label">
                      <span>Digital Marketing</span>
                      <span>68%</span>
                    </div>
                    <div className="hcl-bar">
                      <div className="hcl-fill" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <div className="hcl-prog-item">
                    <div className="hcl-prog-label">
                      <span>Operations & Logistics</span>
                      <span>55%</span>
                    </div>
                    <div className="hcl-bar">
                      <div className="hcl-fill" style={{ width: "55%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" aria-labelledby="services-heading">
        <div className="container">
          <div className="services-header reveal">
            <div className="section-label">What We Offer</div>
            <h2 className="section-heading" id="services-heading">
              Everything Your Business
              <br />
              Needs to <span className="text-accent">Grow</span>
            </h2>
            <p className="section-sub">
              Qelem connects businesses with trusted Business Development
              Service Providers (BDSPs) for tailored training in finance,
              marketing, operations, and more.
            </p>
          </div>

          <div className="services-split">
            <div className="services-split-visual reveal">
              <div className="sviz-inner">
                <div className="sviz-icon">🤝</div>
                <div className="sviz-title">
                  Connecting MSMEs with the Right Experts
                </div>
                <div className="sviz-desc">
                  We curate a trusted network of Business Development Service
                  Providers who deliver practical, results-focused training
                  tailored to the Ethiopian market.
                </div>
                <div className="sviz-dots">
                  <div className="sviz-dot active"></div>
                  <div className="sviz-dot"></div>
                  <div className="sviz-dot"></div>
                </div>
              </div>
            </div>
            <div className="why-grid reveal">
              <div className="why-card">
                <div className="why-icon">🎯</div>
                <h4>Tailored Training</h4>
                <p>
                  Practical, business-focused guidance designed specifically for
                  the challenges MSMEs face every day.
                </p>
              </div>
              <div className="why-card">
                <div className="why-icon">💼</div>
                <h4>Business Experts</h4>
                <p>
                  Learn from experienced professionals with proven track records
                  across finance, marketing, and operations.
                </p>
              </div>
              <div className="why-card">
                <div className="why-icon">🔗</div>
                <h4>Direct Connections</h4>
                <p>
                  Get matched with reliable BDSPs, mentors, and peers who align
                  with your business goals.
                </p>
              </div>
              <div className="why-card">
                <div className="why-icon">⚡</div>
                <h4>Training That Works</h4>
                <p>
                  Implement actionable ideas immediately — every session is
                  designed for real-world application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BDSP DIRECTORY */}
      <section id="bdsp" aria-labelledby="bdsp-heading">
        <div className="container">
          <div className="bdsp-header reveal">
            <div>
              <div className="section-label">BDSP Directory</div>
              <h2 className="section-heading" id="bdsp-heading">
                Meet Our <span className="text-accent">Expert Trainers</span>
              </h2>
              <p className="section-sub">
                Handpicked professionals ready to guide your business forward.
              </p>
            </div>
            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter trainers by category"
            >
              <button
                className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-tab ${activeFilter === "finance" ? "active" : ""}`}
                onClick={() => setActiveFilter("finance")}
              >
                Finance
              </button>
              <button
                className={`filter-tab ${activeFilter === "marketing" ? "active" : ""}`}
                onClick={() => setActiveFilter("marketing")}
              >
                Marketing
              </button>
              <button
                className={`filter-tab ${activeFilter === "operations" ? "active" : ""}`}
                onClick={() => setActiveFilter("operations")}
              >
                Operations
              </button>
            </div>
          </div>

          <div className="trainers-grid">
            {filteredTrainers.map((trainer) => (
              <div
                key={trainer.id}
                className="trainer-card reveal"
                data-category={trainer.category}
              >
                <div className="trainer-card-top">
                  {trainer.badge && (
                    <div className="trainer-badge">{trainer.badge}</div>
                  )}
                  <div
                    className="trainer-avatar"
                    style={{ background: trainer.gradient }}
                  >
                    {trainer.initials}
                  </div>
                  <div className="trainer-name">{trainer.name}</div>
                  <div className="trainer-title">{trainer.title}</div>
                </div>
                <div className="trainer-card-body">
                  <div className="expertise-label">Areas of Expertise</div>
                  <div className="expertise-tags">
                    {trainer.expertise.map((exp, i) => (
                      <span key={i} className="expertise-tag">
                        {exp}
                      </span>
                    ))}
                  </div>
                  <div className="trainer-rating">
                    <span className="stars">{renderStars(trainer.rating)}</span>
                    <span>
                      {trainer.rating.toFixed(1)} · {trainer.sessions} sessions
                    </span>
                  </div>
                  <button
                    className="btn-connect"
                    onClick={() => alert(`Connecting with ${trainer.name}...`)}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" aria-labelledby="contact-heading">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info-block reveal">
              <div className="section-label">Contact</div>
              <h2 className="section-heading" id="contact-heading">
                Get in Touch
                <br />
                with <span className="text-accent">Qelem</span>
              </h2>
              <p className="section-sub">
                Have questions about our marketplace or want to join as a BDSP?
                Reach out — we'd love to hear from you.
              </p>
              <div className="contact-details">
                <div className="contact-detail">
                  <div className="cd-icon">✉️</div>
                  <div>
                    <div className="cd-label">Email</div>
                    <div className="cd-value">contact@qelem.com</div>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="cd-icon">📞</div>
                  <div>
                    <div className="cd-label">Phone</div>
                    <div className="cd-value">+251 XXX XXX XXX</div>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="cd-icon">📍</div>
                  <div>
                    <div className="cd-label">Location</div>
                    <div className="cd-value">Addis Ababa, Ethiopia</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal">
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={formErrors.name ? "invalid" : ""}
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={formErrors.email ? "invalid" : ""}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={formErrors.subject ? "invalid" : ""}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your needs..."
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={formErrors.message ? "invalid" : ""}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending…"
                  ) : (
                    <>
                      Send Message
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>
                {showSuccess && (
                  <div className="form-success show" role="alert">
                    ✅ Thanks for reaching out! We'll get back to you within 24
                    hours.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">Qelem</div>
            <p className="footer-copy">
              © 2025 Qelem Marketplace. All rights reserved.
            </p>
            <nav className="footer-links" aria-label="Footer navigation">
              <button onClick={() => scrollToSection("hero")}>Home</button>
              <button onClick={() => scrollToSection("services")}>
                Services
              </button>
              <button onClick={() => scrollToSection("bdsp")}>
                BDSP Directory
              </button>
              <button onClick={() => scrollToSection("contact")}>
                Contact
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
