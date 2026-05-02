'use client';

import { signOut } from 'next-auth/react';
import { Button, Col, Row, Container, Card } from 'react-bootstrap';
import { BoxArrowRight, XCircle } from 'react-bootstrap-icons';
import Link from 'next/link';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <main className="main-bg auth-page">
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          {/* Confirmation Panel */}
          <Card className="form-card auth-panel auth-panel--form auth-panel--signin-form">
            <Card.Body>
              <div className="auth-form-header">
                <p className="section-kicker">Sign Out</p>
                <h2 className="section-title auth-form-title">End your session?</h2>
                <p className="auth-form-copy">
                  Confirm that you would like to sign out of your account. You can always sign back in at any time.
                </p>
              </div>

              <div className="d-grid gap-3 mt-4">
                <Button 
                  className="btn-gold auth-submit-btn d-flex align-items-center justify-content-center gap-2"
                  onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                >
                  <BoxArrowRight size={18} /> Sign Out Now
                </Button>
                <Link 
                  href="/" 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '0.6rem', fontWeight: '700', padding: '0.8rem 1.4rem' }}
                >
                  <XCircle size={18} /> Stay Signed In
                </Link>
              </div>

              <div className="auth-form-meta mt-4">
                <span>Secure credential logout</span>
                <span>UH Manoa Community</span>
              </div>
            </Card.Body>
            <Card.Footer className="auth-footer text-center">
              Need help? <Link href="/" className="link-green">Visit Support</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default SignOut;


