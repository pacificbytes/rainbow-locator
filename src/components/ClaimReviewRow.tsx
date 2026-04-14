'use client';

import { Claim, Item, User } from '@prisma/client';
import { Button, Badge } from 'react-bootstrap';
import { updateClaimStatus } from '@/lib/dbActions';
import swal from 'sweetalert';
import Link from 'next/link';

interface ClaimReviewRowProps {
  claim: Claim & { item: Item; user: User };
}

const ClaimReviewRow = ({ claim }: ClaimReviewRowProps) => {
  const handleAction = async (status: 'approved' | 'denied') => {
    await updateClaimStatus(claim.id, status);
    swal('Success', `Claim ${status}`, 'success');
  };

  return (
    <tr>
      <td>
        <Link href={`/items/${claim.itemId}`}>{claim.item.title}</Link>
        <br />
        <Badge bg={claim.item.type === 'lost' ? 'danger' : 'success'}>
          {claim.item.type.toUpperCase()}
        </Badge>
      </td>
      <td>{claim.user.email}</td>
      <td>{claim.message}</td>
      <td>
        <Badge bg={
          claim.status === 'approved' ? 'success' : 
          claim.status === 'denied' ? 'danger' : 'warning'
        }>
          {claim.status}
        </Badge>
      </td>
      <td>
        {claim.status === 'pending' && (
          <div className="d-flex gap-2">
            <Button variant="success" size="sm" onClick={() => handleAction('approved')}>
              Approve
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleAction('denied')}>
              Deny
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default ClaimReviewRow;
