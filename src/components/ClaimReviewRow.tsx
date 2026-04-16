'use client';

import { Claim, Item, User } from '@prisma/client';
import { Button } from 'react-bootstrap';
import { updateClaimStatus } from '@/lib/dbActions';
import swal from 'sweetalert';
import Link from 'next/link';
import { Check, X } from 'react-bootstrap-icons';

interface ClaimReviewRowProps {
  claim: Claim & { item: Item; user: User };
}

const ClaimReviewRow = ({ claim }: ClaimReviewRowProps) => {
  const handleAction = async (status: 'approved' | 'denied') => {
    await updateClaimStatus(claim.id, status);
    swal('Success', `Claim ${status}`, 'success');
  };

  return (
    <tr style={{ verticalAlign: 'middle' }}>
      <td>
        <Link href={`/items/${claim.itemId}`} className="link-green">
          {claim.item.title}
        </Link>
        <div className="mt-1">
          <span className={`badge-status badge-${claim.item.type}`} style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem' }}>
            {claim.item.type}
          </span>
        </div>
      </td>
      <td className="small text-muted">{claim.user.name || claim.user.email}</td>
      <td style={{ fontSize: '0.9rem', maxWidth: '300px' }}>
        <p className="mb-0 text-truncate" title={claim.message}>{claim.message}</p>
      </td>
      <td>
        <span className={`badge-status badge-${claim.status}`} style={{ fontSize: '0.7rem' }}>
          {claim.status}
        </span>
      </td>
      <td>
        {claim.status === 'pending' ? (
          <div className="d-flex gap-2">
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => handleAction('approved')}
              className="d-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              <Check size={16} /> Approve
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => handleAction('denied')}
              className="d-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              <X size={16} /> Deny
            </Button>
          </div>
        ) : (
          <span className="text-muted small">Processed</span>
        )}
      </td>
    </tr>
  );
};

export default ClaimReviewRow;
