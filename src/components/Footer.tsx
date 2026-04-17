import { Container } from 'react-bootstrap';
import { BoxArrowUpRight, CodeSlash, GeoAltFill, PeopleFill } from 'react-bootstrap-icons';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="site-footer mt-auto">
    <Container className="site-footer__inner">
      <div>
        <p className="site-footer__eyebrow">Built by PacificBytes</p>
        <h2 className="site-footer__title">PacificBytes</h2>
        <p className="site-footer__copy">
          Design and engineering for Rainbow Locator, a polished lost-and-found
          experience built for the UH Manoa community.
        </p>
      </div>

      <div className="site-footer__meta">
        <div className="site-footer__pill">
          <PeopleFill size={14} />
          Team Project
        </div>
        <div className="site-footer__pill">
          <GeoAltFill size={14} />
          Honolulu, Hawaii
        </div>
        <div className="site-footer__pill">
          <CodeSlash size={14} />
          ICS 314
        </div>
        <a
          className="site-footer__link"
          href="https://github.com/pacificbytes"
          target="_blank"
          rel="noreferrer"
        >
          PacificBytes GitHub <BoxArrowUpRight size={14} />
        </a>
      </div>
    </Container>
  </footer>
);

export default Footer;
