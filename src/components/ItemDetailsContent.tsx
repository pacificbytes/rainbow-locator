'use client';

import { Container } from 'react-bootstrap';
import ClaimForm from '@/components/ClaimForm';
import { Item, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar3, GeoAlt, Person, Tag, InfoCircle } from 'react-bootstrap-icons';

interface ItemDetailsContentProps {
  item: Item & { owner: User };
  isOwner: boolean;
  sessionUserId?: string;
}

const ItemDetailsContent = ({ item, isOwner, sessionUserId }: ItemDetailsContentProps) => {
  const itemType = item.type || 'lost';
  const ownerName = item.owner?.name || item.owner?.email || 'Unknown User';

  return (
    <main className="main-bg section-padding">
      <Container className="container-narrow">
        <Link href="/items" className="link-green d-inline-flex align-items-center gap-2 mb-4">
          <ArrowLeft /> Back to items
        </Link>

        <div className="detail-card">
          <div className="detail-image-container">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="detail-image"
                sizes="(min-width: 768px) 50vw, 100vw"
                unoptimized
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                No Image Provided
              </div>
            )}
          </div>

          <div className="detail-content">
            <div className="detail-meta">
              <span className={`badge-status badge-${itemType}`}>
                {itemType.toUpperCase()}
              </span>
              <span className={`badge-status badge-${item.status || 'open'}`}>
                {item.status || 'open'}
              </span>
            </div>

            <h1 className="detail-title">{item.title}</h1>

            <div className="detail-property-list">
              <div className="detail-property">
                <strong><Tag size={14} className="me-2" /> Category</strong>
                <p>{item.category}</p>
              </div>

              <div className="detail-property">
                <strong><InfoCircle size={14} className="me-2" /> Description</strong>
                <p>{item.description}</p>
              </div>

              <div className="detail-property">
                <strong><GeoAlt size={14} className="me-2" /> Location</strong>
                <p>{item.location}</p>
              </div>

              <div className="detail-property">
                <strong><Calendar3 size={14} className="me-2" /> Date</strong>
                <p>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</p>
              </div>

              <div className="detail-property">
                <strong><Person size={14} className="me-2" /> Reported By</strong>
                <p>{ownerName}</p>
              </div>
            </div>

            {isOwner ? (
              <div className="alert alert-info border-0 rounded-4 py-3">
                <strong>Notice:</strong> You reported this item. You can manage it from your dashboard.
              </div>
            ) : sessionUserId ? (
              item.status === 'open' ? (
                <div className="claim-section">
                  <h3 className="section-title" style={{ fontSize: '1.5rem' }}>Claim this item</h3>
                  <p className="text-muted mb-4">If you believe this item belongs to you, please provide details below.</p>
                  <ClaimForm itemId={item.id} userId={sessionUserId} />
                </div>
              ) : (
                <div className="alert alert-warning border-0 rounded-4 py-3">
                  This item is no longer available for claims.
                </div>
              )
            ) : (
              <div className="alert alert-warning border-0 rounded-4 py-3">
                Please <Link href="/auth/signin" className="fw-bold text-decoration-none">sign in</Link> to claim this item.
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ItemDetailsContent;
