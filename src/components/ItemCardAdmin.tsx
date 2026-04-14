'use client';

import { Item, User } from '@prisma/client';
import { Card, Badge, Button } from 'react-bootstrap';
import Link from 'next/link';
import { deleteItem } from '@/lib/dbActions';
import swal from 'sweetalert';

interface ItemCardAdminProps {
  item: Item & { owner: User };
}

const ItemCardAdmin = ({ item }: ItemCardAdminProps) => {
  const handleDelete = async () => {
    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this item!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    });

    if (confirm) {
      await deleteItem(item.id);
      swal('Poof! Your item has been deleted!', {
        icon: 'success',
      });
    }
  };

  return (
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
          <strong>Owner:</strong> {item.owner.email}<br />
          <strong>Location:</strong> {item.location}<br />
          <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}<br />
          <strong>Status:</strong> <Badge bg="info">{item.status}</Badge>
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Link href={`/edit/${item.id}`} className="btn btn-warning btn-sm">
            Edit
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemCardAdmin;
