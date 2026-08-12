import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import Footer from '../components/Footer.jsx';
import Reveal from '../components/Reveal.jsx';

export default function About() {
  useDocumentTitle('About — MUBI');

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <div className="section-label mono">01 / ABOUT</div>
          <h1 className="page-title">
            Code today. <em className="yellow-text">Medicine</em> tomorrow.
          </h1>
          <p className="page-lead">Web developer · software designer · app maker · science student</p>
        </div>
      </header>

      <main>
        <section className="section about">
          <div className="container">
            <div className="about-grid">
              <Reveal className="about-portrait">
                <div className="portrait-frame" id="portrait-frame">
                  <div className="portrait-art">
                    <img
                      src="/assets/owner.png"
                      alt="Mubi"
                      className="portrait-img"
                      id="about-owner-img"
                    />
                    <div className="portrait-yellow-glow" id="portrait-yellow-glow" />
                    <div className="portrait-line pl-1" />
                    <div className="portrait-line pl-2" />
                    <div className="portrait-line pl-3" />
                    <div className="portrait-glow pg-1" />
                    <div className="portrait-glow pg-2" />
                  </div>
                  <div className="portrait-caption mono">FIG.01 — MUBI · BUILDER</div>
                </div>
              </Reveal>
              <div className="about-content">
                <p className="section-text reveal">
                  I&apos;m Mubi — a web developer, software designer, and app maker. I live in the
                  stack: Python, HTML, CSS, JavaScript, TypeScript, PHP, Laravel, React, Vite, Vue —
                  and I&apos;m solid on both MEAN and MERN.
                </p>
                <p className="section-text reveal">
                  I&apos;m a science student aiming for a doctor&apos;s course. My long game is big:
                  use technological knowledge in medicine — to reach people, understand drugs, and
                  build systems that actually help treat and heal.
                </p>
                <p className="section-text reveal">
                  Until then, I ship tools fast. Clean products. Working software. No waiting around.
                </p>
                <div className="about-stats">
                  <div className="stat reveal">
                    <span className="stat-num">FULL</span>
                    <span className="stat-label">
                      STACK
                      <br />
                      BUILDER
                    </span>
                  </div>
                  <div className="stat reveal">
                    <span className="stat-num">FAST</span>
                    <span className="stat-label">
                      TOOL
                      <br />
                      SHIPPER
                    </span>
                  </div>
                  <div className="stat reveal">
                    <span className="stat-num">MD</span>
                    <span className="stat-label">
                      PATH
                      <br />
                      AHEAD
                    </span>
                  </div>
                </div>
                <div className="page-actions reveal">
                  <Link to="/skills" className="btn btn-yellow" data-hover="">
                    VIEW SKILLS
                  </Link>
                  <Link to="/contact" className="btn btn-ghost" data-hover="">
                    CONTACT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        extraLinks={[
          { to: '/skills', label: 'SKILLS' },
          { to: '/contact', label: 'CONTACT →' },
        ]}
      />
    </>
  );
}
