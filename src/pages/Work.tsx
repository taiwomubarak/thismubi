import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Footer from '../components/Footer';

export default function Work() {
  useDocumentTitle('Work — MUBI');

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <div className="section-label mono">04 / SELECTED WORK</div>
          <h1 className="page-title">
            Built to <em className="yellow-text">move</em>.
          </h1>
          <p className="page-lead">Projects and experiments that show how I ship.</p>
        </div>
      </header>

      <main>
        <section className="section work">
          <div className="container">
            <div className="work-grid">
              <Link to="/contact" className="work-card reveal" data-hover="">
                <div className="work-card-media">
                  <div className="work-art wa-1">
                    <span className="work-art-label mono">MERN.KIT</span>
                  </div>
                </div>
                <div className="work-card-info">
                  <span className="work-index">001</span>
                  <h3>MERN STARTER KIT</h3>
                  <p>
                    Opinionated full-stack starter — auth, API layer, and a React UI ready to ship
                    from day one.
                  </p>
                  <span className="work-tags mono">MONGODB / EXPRESS / REACT / NODE</span>
                </div>
              </Link>
              <Link to="/contact" className="work-card reveal" data-hover="">
                <div className="work-card-media">
                  <div className="work-art wa-2">
                    <span className="work-art-label mono">LARAVEL.API</span>
                  </div>
                </div>
                <div className="work-card-info">
                  <span className="work-index">002</span>
                  <h3>LARAVEL SERVICE LAYER</h3>
                  <p>
                    Clean PHP/Laravel APIs with auth, queues, and SQL — built for real products, not
                    demos.
                  </p>
                  <span className="work-tags mono">PHP / LARAVEL / SQL</span>
                </div>
              </Link>
              <Link to="/contact" className="work-card reveal" data-hover="">
                <div className="work-card-media">
                  <div className="work-art wa-3">
                    <span className="work-art-label mono">VUE.VITE</span>
                  </div>
                </div>
                <div className="work-card-info">
                  <span className="work-index">003</span>
                  <h3>VUE + VITE DASHBOARD</h3>
                  <p>
                    Admin dashboard with TypeScript, Vite speed, and a UI that stays readable under
                    pressure.
                  </p>
                  <span className="work-tags mono">VUE / VITE / TYPESCRIPT</span>
                </div>
              </Link>
              <Link to="/contact" className="work-card reveal" data-hover="">
                <div className="work-card-media">
                  <div className="work-art wa-4">
                    <span className="work-art-label mono">MED.TOOLS</span>
                  </div>
                </div>
                <div className="work-card-info">
                  <span className="work-index">004</span>
                  <h3>MED-TECH EXPERIMENTS</h3>
                  <p>
                    Early tools exploring how software can support medicine, patient reach, and
                    drug-related workflows.
                  </p>
                  <span className="work-tags mono">PYTHON / JS / HEALTH</span>
                </div>
              </Link>
            </div>
            <div className="work-more reveal">
              <Link to="/contact" className="btn btn-ghost" data-hover="">
                START A PROJECT →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
