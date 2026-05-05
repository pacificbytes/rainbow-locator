'use client';

import { Item, User } from '@prisma/client';
import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { deleteItem } from '@/lib/dbActions';
import swal from 'sweetalert';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

import { useRouter } from 'next/navigation';

interface ItemCardAdminProps {
  item: Item & { owner: User };
}

const ItemCardAdmin = ({ item }: ItemCardAdminProps) => {
  const router = useRouter();

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
      router.refresh();
    }
  };

  return (
    <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
      {item.image && (
        <Card.Img
          variant="top"
          src={item.image}
          alt={item.title}
          style={{ height: '180px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title style={{ color: '#024731', fontWeight: 'bold', margin: 0 }}>{item.title}</Card.Title>
          <span className={`badge-status badge-${item.status}`} style={{ fontSize: '0.7rem' }}>
            {item.status}
          </span>
        </div>
        
        <div className="mb-3">
          <span className={`badge-status badge-${item.type} me-2`} style={{ fontSize: '0.7rem' }}>
            {item.type}
          </span>
          <span className="text-muted small">{item.category}</span>
        </div>

        <Card.Text className="small flex-grow-1">
          <div className="mb-1 text-truncate"><strong>👤 Owner:</strong> {item.owner.name || item.owner.email}</div>
          <div className="mb-1 text-truncate"><strong>📍 Location:</strong> {item.location}</div>
          <div><strong>📅 Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
        </Card.Text>

        <div className="d-flex gap-2 mt-3">
          <Link href={`/edit/${item.id}`} className="btn btn-warning btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" style={{ fontWeight: 'bold', borderRadius: '0.5rem' }}>
            <PencilSquare size={14} /> Edit
          </Link>
          <Button variant="outline-danger" size="sm" className="flex-fill d-flex align-items-center justify-content-center gap-1" onClick={handleDelete} style={{ borderRadius: '0.5rem' }}>
            <Trash size={14} /> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemCardAdmin;
