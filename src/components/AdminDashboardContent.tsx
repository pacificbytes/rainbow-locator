'use client';

import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import Link from 'next/link';

interface AdminDashboardContentProps {
  stats: {
    totalItems: number;
    openItems: number;
    pendingClaims: number;
    resolvedItems: number;
  };
}

const AdminDashboardContent = ({ stats }: AdminDashboardContentProps) => {
  return (
    <Container className="py-3">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center bg-primary text-white h-100">
            <Card.Body>
              <Card.Title>Total Items</Card.Title>
              <Card.Text className="h1">{stats.totalItems}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center bg-info text-white h-100">
            <Card.Body>
              <Card.Title>Open Items</Card.Title>
              <Card.Text className="h1">{stats.openItems}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center bg-warning text-white h-100">
            <Card.Body>
              <Card.Title>Pending Claims</Card.Title>
              <Card.Text className="h1">{stats.pendingClaims}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center bg-success text-white h-100">
            <Card.Body>
              <Card.Title>Resolved Items</Card.Title>
              <Card.Text className="h1">{stats.resolvedItems}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Actions</Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-2">
                <Link href="/admin/items" className="nav-link text-primary">
                  Manage Items
                </Link>
                <Link href="/admin/claims" className="nav-link text-primary">
                  Review Claims
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardContent;
