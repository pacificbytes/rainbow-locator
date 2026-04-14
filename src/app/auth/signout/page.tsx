'use client';

import { signOut } from 'next-auth/react'; // v5 compatible
import { Button, Col, Row, Container, Card } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <main>
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={6} className="text-center">
          <Card>
            <Card.Body>
              <Card.Title>Do you want to sign out?</Card.Title>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button variant="danger" onClick={() => signOut({ callbackUrl: '/', redirect: true })}>
                  Sign Out
                </Button>
                <Button variant="secondary" href="/">
                  Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default SignOut;
