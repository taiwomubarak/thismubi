import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import Footer from '../components/Footer.jsx';

export default function WhatIDo() {
  useDocumentTitle('What I Do — MUBI');

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <div className="section-label mono">03 / WHAT I DO</div>
          <h1 className="page-title">
            What I <em className="yellow-text">ship</em>.
          </h1>
          <p className="page-lead">
            From websites and apps to full-stack systems — designed clean, coded fast.
          </p>
        </div>
      </header>

      <main>
        <section className="section what-i-do">
          <div className="container">
            <div className="services-grid">
              <article className="service-row reveal" data-hover="">
                <span className="service-index mono">01</span>
                <div className="service-body">
                  <h3>Web Development</h3>
                  <p>
                    Responsive sites and web apps with HTML, CSS, JS/TS, React, Vue, and Vite — fast,
                    modern, and maintainable.
                  </p>
                </div>
                <span className="service-tag mono">FRONTEND</span>
              </article>
              <article className="service-row reveal" data-hover="">
                <span className="service-index mono">02</span>
                <div className="service-body">
                  <h3>Full-Stack Apps</h3>
                  <p>
                    MEAN &amp; MERN systems, PHP/Laravel backends, APIs, auth, and databases that hold
                    up under real use.
                  </p>
                </div>
                <span className="service-tag mono">MEAN / MERN</span>
              </article>
              <article className="service-row reveal" data-hover="">
                <span className="service-index mono">03</span>
                <div className="service-body">
                  <h3>Software &amp; App Design</h3>
                  <p>
                    Product thinking and UI that feels intentional — I design the tool, then I build
                    it.
                  </p>
                </div>
                <span className="service-tag mono">DESIGN</span>
              </article>
              <article className="service-row reveal" data-hover="">
                <span className="service-index mono">04</span>
                <div className="service-body">
                  <h3>Tools That Ship</h3>
                  <p>
                    Python scripts, admin panels, dashboards, and small products shipped quick —
                    useful over perfect.
                  </p>
                </div>
                <span className="service-tag mono">PYTHON</span>
              </article>
            </div>
            <div className="page-actions reveal" style={{ marginTop: '3rem' }}>
              <Link to="/work" className="btn btn-yellow" data-hover="">
                SEE WORK
              </Link>
              <Link to="/contact" className="btn btn-ghost" data-hover="">
                HIRE ME
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
