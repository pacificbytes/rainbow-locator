'use client';

import { Card, Badge } from 'react-bootstrap';
import Link from 'next/link';

type ItemCardItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  date: Date;
  image?: string | null;
  status: string;
  ownerId: string;
};

interface ItemCardProps {
  item: ItemCardItem;
}

const ItemCard = ({ item }: ItemCardProps) => (
  <Card className="h-100">
    {item.image && (
      <Card.Img
        variant="top"
        src={item.image}
        alt={item.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
    )}
    <Card.Body>
      <Card.Title>{item.title}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        <Badge bg={item.type === 'lost' ? 'danger' : 'success'} className="me-2">
          {item.type.toUpperCase()}
        </Badge>
        {item.category}
      </Card.Subtitle>
      <Card.Text>
        <strong>Location:</strong> {item.location}
        <br />
        <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
        <br />
        <strong>Status:</strong> <Badge bg="info">{item.status}</Badge>
      </Card.Text>
      <Link href={`/items/${item.id}`} className="btn btn-primary btn-sm">
        View Details
      </Link>
    </Card.Body>
  </Card>
);

export default ItemCard;
