import { Link, useOutletContext } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import BounceBox from '../components/BounceBox';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import type { OutletContext } from '../components/Layout';

const HeroScene = lazy(() => import('../components/HeroScene'));

export default function Home() {
  useDocumentTitle('MUBI — Home');
  const { dismissPreloader } = useOutletContext<OutletContext>();

  return (
    <>
      <section id="hero" className="hero">
        <Suspense fallback={<div id="hero-canvas" className="hero-canvas" />}>
          <HeroScene onReady={dismissPreloader} />
        </Suspense>
        <BounceBox />

        <div className="hud-top-left hud-mono">STACK: MEAN · MERN · LARAVEL</div>
        <div className="hud-top-right hud-mono">STATUS: SHIPPING FAST</div>
        <div className="hud-bottom-left hud-mono">PICK A PAGE →</div>
        <div className="hud-bottom-right hud-mono">SCIENCE → MEDICINE PATH</div>
        <div className="hud-center-left hud-mono">
          WEB DEV · APP MAKER <br />
          SOFTWARE DESIGNER
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">BUILD TOOLS. TREAT THE FUTURE.</div>
          <h1 className="hero-title">
            <span className="hero-line hero-line-1">
              MUBI<span className="hero-period">.</span>
            </span>
            <span className="hero-line hero-line-2">WEB DEV</span>
            <span className="hero-line hero-line-3">&amp; BUILDER</span>
          </h1>
          <div className="hero-sub">
            Web developer, software designer, and app maker — science student on a path to
            medicine.
            <br />
            I ship tools fast, and I want to put that stack to work in healthcare.
          </div>
          <div className="hero-actions">
            <Link to="/skills" className="btn btn-yellow" data-hover="">
              SEE MY STACK
            </Link>
            <Link to="/contact" className="btn btn-ghost" data-hover="">
              LET&apos;S BUILD
            </Link>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>WEB DEVELOPER</span>
          <span className="marquee-star">✳</span>
          <span>SOFTWARE DESIGNER</span>
          <span className="marquee-star">✳</span>
          <span>APP MAKER</span>
          <span className="marquee-star">✳</span>
          <span>MEAN / MERN</span>
          <span className="marquee-star">✳</span>
          <span>LARAVEL</span>
          <span className="marquee-star">✳</span>
          <span>FAST SHIPPER</span>
          <span className="marquee-star">✳</span>
          <span>FUTURE MD</span>
          <span className="marquee-star">✳</span>
          <span>WEB DEVELOPER</span>
          <span className="marquee-star">✳</span>
          <span>SOFTWARE DESIGNER</span>
          <span className="marquee-star">✳</span>
          <span>APP MAKER</span>
          <span className="marquee-star">✳</span>
          <span>MEAN / MERN</span>
          <span className="marquee-star">✳</span>
          <span>LARAVEL</span>
          <span className="marquee-star">✳</span>
          <span>FAST SHIPPER</span>
          <span className="marquee-star">✳</span>
          <span>FUTURE MD</span>
          <span className="marquee-star">✳</span>
        </div>
      </div>

      <section className="section home-links">
        <div className="container">
          <div className="section-label mono">NAVIGATE</div>
          <h2 className="section-title">
            Open a <em className="yellow-text">page</em>.
          </h2>
          <div className="page-card-grid">
            <Reveal as={Link} to="/about" className="page-card" data-hover="">
              <span className="mono">01</span>
              <h3>About</h3>
              <p>Who I am — builder, science student, future MD.</p>
            </Reveal>
            <Reveal as={Link} to="/skills" className="page-card" data-hover="">
              <span className="mono">02</span>
              <h3>Skills</h3>
              <p>Tech stack in orbit — frontend to full-stack.</p>
            </Reveal>
            <Reveal as={Link} to="/what-i-do" className="page-card" data-hover="">
              <span className="mono">03</span>
              <h3>What I Do</h3>
              <p>Web apps, full-stack systems, tools that ship.</p>
            </Reveal>
            <Reveal as={Link} to="/work" className="page-card" data-hover="">
              <span className="mono">04</span>
              <h3>Work</h3>
              <p>Selected projects and experiments.</p>
            </Reveal>
            <Reveal as={Link} to="/process" className="page-card" data-hover="">
              <span className="mono">05</span>
              <h3>Process</h3>
              <p>How I design, build, and ship — plus the vision.</p>
            </Reveal>
            <Reveal as={Link} to="/contact" className="page-card" data-hover="">
              <span className="mono">06</span>
              <h3>Contact</h3>
              <p>Got something to build? Reach out.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
