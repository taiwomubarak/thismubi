import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Footer from '../components/Footer';

export default function Process() {
  useDocumentTitle('Process — MUBI');

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <div className="section-label mono">05 / PROCESS</div>
          <h1 className="page-title">
            How I <em className="yellow-text">ship</em>.
          </h1>
          <p className="page-lead">A simple loop — listen, design, build, ship.</p>
        </div>
      </header>

      <main>
        <section className="section process">
          <div className="container">
            <div className="process-grid">
              <div className="process-step reveal">
                <span className="process-num mono">01</span>
                <h3>Listen</h3>
                <p>
                  Understand the problem, the users, and the outcome — then cut everything that
                  doesn&apos;t help.
                </p>
              </div>
              <div className="process-step reveal">
                <span className="process-num mono">02</span>
                <h3>Design</h3>
                <p>Map the product and interface first. Clear structure beats fancy noise.</p>
              </div>
              <div className="process-step reveal">
                <span className="process-num mono">03</span>
                <h3>Build</h3>
                <p>
                  Pick the right stack — React, Vue, Laravel, MERN — and move. Working code over
                  waiting.
                </p>
              </div>
              <div className="process-step reveal">
                <span className="process-num mono">04</span>
                <h3>Ship</h3>
                <p>Polish, deploy, iterate. Tools only matter when people can use them.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section vision">
          <div className="container vision-inner">
            <div className="section-label mono reveal">VISION</div>
            <h2 className="section-title reveal">
              Big in life.
              <br />
              Useful in <em className="yellow-text">medicine</em>.
            </h2>
            <p className="section-text reveal">
              I&apos;m studying science and aiming for a doctor&apos;s course. Long-term, I want to
              bring technological knowledge into medicine — to reach patients, support treatment, and
              help understand and work with drugs through better software and systems.
            </p>
            <p className="section-text reveal">
              Coding is not a side hobby. It&apos;s the skill set I&apos;ll carry into healthcare.
            </p>
            <div className="page-actions reveal">
              <Link to="/contact" className="btn btn-yellow" data-hover="">
                LET&apos;S TALK
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
