'use client';

import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import ClaimForm from '@/components/ClaimForm';
import { Item, User } from '@prisma/client';

interface ItemDetailsContentProps {
  item: Item & { owner: User };
  isOwner: boolean;
  sessionUserId?: string;
}

const ItemDetailsContent = ({ item, isOwner, sessionUserId }: ItemDetailsContentProps) => {
  const itemType = item.type || 'lost';
  const ownerName = item.owner?.name || item.owner?.email || 'Unknown User';

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Row className="g-0">
              <Col md={6}>
                {item.image ? (
                  <Card.Img
                    src={item.image}
                    alt={item.title}
                    style={{ height: '100%', minHeight: '300px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light d-flex align-items-center justify-content-center h-100" style={{ minHeight: '300px' }}>
                    No Image Provided
                  </div>
                )}
              </Col>
              <Col md={6}>
                <Card.Body>
                  <Card.Title className="h2">{item.title}</Card.Title>
                  <Card.Subtitle className="mb-3">
                    <Badge bg={itemType === 'lost' ? 'danger' : 'success'} className="me-2">
                      {itemType.toUpperCase()}
                    </Badge>
                    {item.category}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Description:</strong><br />
                    {item.description}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {item.location}<br />
                    <strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}<br />
                    <strong>Reported by:</strong> {ownerName}<br />
                    <strong>Status:</strong> <Badge bg="info">{item.status || 'open'}</Badge>
                  </Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          {!isOwner && sessionUserId && item.status === 'open' && (
            <Card>
              <Card.Header>
                <h3>Claim Item</h3>
              </Card.Header>
              <Card.Body>
                <ClaimForm itemId={item.id} userId={sessionUserId} />
              </Card.Body>
            </Card>
          )}

          {!sessionUserId && (
            <div className="alert alert-warning">
              Please <a href="/auth/signin">sign in</a> to claim this item.
            </div>
          )}

          {isOwner && (
            <div className="alert alert-info">
              You reported this item.
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDetailsContent;
