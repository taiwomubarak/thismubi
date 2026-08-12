import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import SkillsOrbit from '../components/SkillsOrbit';
import Footer from '../components/Footer';

export default function Skills() {
  useDocumentTitle('Skills — MUBI');

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <div className="section-label mono">02 / TECH STACK</div>
          <h1 className="page-title">
            Skills in <em className="yellow-text">orbit</em>.
          </h1>
          <p className="page-lead">Language icons orbit the core like electrons. Hover a node to pause.</p>
        </div>
      </header>

      <main>
        <section className="section skills">
          <div className="container">
            <SkillsOrbit />

            <ul className="skills-legend mono reveal" aria-label="Skill rings">
              <li>
                <span className="legend-dot legend-inner" /> Inner — Frontend
              </li>
              <li>
                <span className="legend-dot legend-mid" /> Mid — Frameworks
              </li>
              <li>
                <span className="legend-dot legend-outer" /> Outer — Backend / Stacks
              </li>
            </ul>

            <div className="page-actions reveal" style={{ justifyContent: 'center', marginTop: '2.5rem' }}>
              <Link to="/what-i-do" className="btn btn-yellow" data-hover="">
                WHAT I DO
              </Link>
              <Link to="/work" className="btn btn-ghost" data-hover="">
                SEE WORK
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
