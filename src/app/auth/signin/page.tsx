'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    await signIn('credentials', {
      callbackUrl: '/',
      email,
      password,
    });
  };

  return (
    <main className="main-bg auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <div className="auth-shell auth-shell--signin">
              <div className="auth-panel auth-panel--brand auth-panel--signin-brand">
                <p className="auth-eyebrow">PacificBytes Access</p>
                <h1 className="auth-title">Welcome back to Rainbow Locator.</h1>
                <p className="auth-copy">
                  Log in to manage your reports, browse open items, and track claims
                  across the UH Manoa community.
                </p>
                <div className="auth-status-stack">
                  <div className="auth-status-card">
                    <strong>Personal dashboard</strong>
                    <span>Review your reports and claims without hunting through multiple pages.</span>
                  </div>
                  <div className="auth-status-card">
                    <strong>Focused recovery flow</strong>
                    <span>Jump straight into active listings and status updates.</span>
                  </div>
                </div>
                <div className="auth-feature-list">
                  <span>Open-item browsing</span>
                  <span>Claim tracking</span>
                  <span>Personal dashboard</span>
                </div>
              </div>

              <Card className="form-card auth-panel auth-panel--form auth-panel--signin-form">
                <Card.Body>
                  <div className="auth-form-header">
                    <p className="section-kicker">Log In</p>
                    <h2 className="section-title auth-form-title">Access your account</h2>
                    <p className="auth-form-copy">Use your PacificBytes account credentials to continue into the recovery dashboard.</p>
                  </div>
                  <Form method="post" onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <input name="email" type="email" className="form-control" placeholder="you@hawaii.edu" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <input name="password" type="password" className="form-control" placeholder="Enter your password" />
                    </Form.Group>
                    <Button type="submit" className="btn-gold auth-submit-btn mt-3">
                      Log In
                    </Button>
                  </Form>
                  <div className="auth-form-meta">
                    <span>Secure credential login</span>
                    <span>Built for campus recovery workflows</span>
                  </div>
                </Card.Body>
                <Card.Footer className="auth-footer">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="link-green">Sign up</Link>
                </Card.Footer>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
