'use client';

import React from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { PersonCircle, Gear, BoxArrowRight } from 'react-bootstrap-icons';

const ProfilePage = () => {
  // Placeholder data - eventually this will come from PostgreSQL
  const user = {
    name: "Za'Niyah",
    role: "Standard User",
    joined: "April 2026",
  };

  return (
    <main>
      <Container className="py-5">
        {/* Profile Header */}
        <Row className="align-items-center bg-white p-4 rounded shadow-sm mb-4">
          <Col md={2} className="text-center">
            <PersonCircle size={80} className="text-secondary" />
          </Col>
          <Col md={7}>
            <h2 className="mb-1">Welcome back, {user.name}!</h2>
            <p className="text-muted mb-0">Member since {user.joined}</p>
            <span className="badge bg-primary mt-2">{user.role}</span>
          </Col>
          <Col md={3} className="text-md-end mt-3 mt-md-0">
            <Button variant="outline-secondary">Edit Profile</Button>
          </Col>
        </Row>

        <Row>
          {/* Recent Activity Column */}
          <Col md={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-bottom-0 pt-4">
                <Card.Title>Recent Activity</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                    Reported a lost item (Hydroflask)
                    <span className="text-muted small">Today</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                    Logged in from MacBook Air
                    <span className="text-muted small">2 hours ago</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Account Settings Column */}
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-bottom-0 pt-4">
                <Card.Title>Account Settings</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="light" className="text-start">
                    <Gear className="me-2"/> Security Settings
                  </Button>
                  <Button variant="light" className="text-start text-danger">
                    <BoxArrowRight className="me-2"/> Logout
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ProfilePage;
