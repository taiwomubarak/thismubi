import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import HandshakeGate from '../components/HandshakeGate';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Contact() {
  useDocumentTitle('Contact — MUBI');
  const [lead, setLead] = useState(
    'Drag one soul’s hand to the other. Handshake to unlock contact.',
  );

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <div className="section-label mono">07 / CONTACT</div>
          <h1 className="page-title">
            Meet in the <em className="yellow-text">middle</em>.
          </h1>
          <p className="page-lead" id="handshake-lead">
            {lead}
          </p>
        </div>
      </header>

      <main>
        <section className="section contact-page">
          <div className="container">
            <HandshakeGate onLeadChange={setLead}>
              <div className="contact-unlocked-banner mono reveal">
                <span>HANDSHAKE COMPLETE</span>
                <span className="yellow-text">· CHANNEL OPEN</span>
              </div>

              <ContactForm />

              <a
                href="mailto:taiwomubarak63@gmail.com"
                className="footer-email reveal"
                data-hover=""
              >
                TAIWOMUBARAK63@GMAIL.COM
              </a>
              <div className="footer-socials reveal">
                <a href="#" className="footer-link mono" data-hover="">
                  GITHUB
                </a>
                <a href="#" className="footer-link mono" data-hover="">
                  LINKEDIN
                </a>
                <a href="#" className="footer-link mono" data-hover="">
                  TWITTER / X
                </a>
              </div>
            </HandshakeGate>
          </div>
        </section>
      </main>

      <Footer
        copyright="© 2026 MUBI — ALL RIGHTS RESERVED"
        right="WEB DEV · APP MAKER · FUTURE MD"
      />
    </>
  );
}
