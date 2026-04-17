'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Item, Prisma } from '@prisma/client';
import { ListUl, Grid3x3GapFill, PencilSquare } from 'react-bootstrap-icons';

export type MyItem = Item;
export type MyClaim = Prisma.ClaimGetPayload<{
  include: {
    item: {
      select: {
        title: true,
      },
    },
  },
}>;

interface MyReportsClientProps {
  items: MyItem[];
  claims: MyClaim[];
}

const MyReportsClient = ({ items, claims }: MyReportsClientProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <main className="main-bg section-padding">
      <div className="container-narrow">
        
        {/* HEADER & TOGGLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Reports</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Manage the lost and found items you have posted.
            </p>
          </div>

          <div className="view-toggle-container">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <Grid3x3GapFill />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              <ListUl size={20} />
            </button>
          </div>
        </div>

        {/* ITEMS SECTION */}
        {items.length === 0 ? (
          <div className="item-card" style={{ marginBottom: '3rem' }}>
            <p className="mb-0 text-center">
              You haven&apos;t reported any items yet.{' '}
              <Link href="/report" className="link-green">Report one now.</Link>
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid-3" style={{ marginBottom: '3rem' }}>
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <h3 style={{ color: '#024731', fontSize: '1.25rem' }}>{item.title}</h3>
                   <span className={`badge-status badge-${item.status}`}>
                     {item.status}
                   </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#444', height: '3em', overflow: 'hidden' }}>{item.description}</p>

                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
                  <p style={{ marginBottom: '0.4rem' }}><strong>📍</strong> {item.location}</p>
                  <p style={{ marginBottom: '1rem' }}><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <Link href={`/items/${item.id}`} className="link-green">
                    View Details →
                  </Link>
                  <Link href={`/edit/${item.id}`} className="btn btn-warning btn-sm d-flex align-items-center gap-1">
                    <PencilSquare size={14} /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {items.map((item) => (
              <div key={item.id} className="list-card">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#024731', fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                    <span className={`badge-status badge-${item.status}`} style={{ fontSize: '0.65rem' }}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
                    <span><strong>📍</strong> {item.location}</span>
                    <span><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Link href={`/edit/${item.id}`} className="btn btn-outline-warning btn-sm">Edit</Link>
                  <Link href={`/items/${item.id}`} className="link-green">Details →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLAIMS SECTION */}
        <h2 className="section-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Submitted Claims</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Track the status of items you have claimed.
        </p>

        {claims.length === 0 ? (
          <div className="item-card">
            <p className="mb-0 text-center">You haven&apos;t submitted any claims yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {claims.map((claim) => (
              <div key={claim.id} className="list-card">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Link href={`/items/${claim.itemId}`} style={{ color: '#024731', fontWeight: 'bold', textDecoration: 'none' }}>
                      {claim.item.title}
                    </Link>
                    <span className={`badge-status badge-${claim.status}`} style={{ fontSize: '0.65rem' }}>
                      {claim.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    <p className="mb-1 italic">&ldquo;{claim.message}&rdquo;</p>
                    <span>Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link href={`/items/${claim.itemId}`} className="link-green">
                  View Item →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyReportsClient;
