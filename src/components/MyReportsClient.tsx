'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ListUl, Grid3x3GapFill, PencilSquare } from 'react-bootstrap-icons';

type MyItem = {
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

type MyClaim = {
  id: string;
  itemId: string;
  message: string;
  createdAt: Date;
  status: string;
  item: {
    title: string;
  };
};

interface MyReportsClientProps {
  items: MyItem[];
  claims: MyClaim[];
}

const MyReportsClient = ({ items, claims }: MyReportsClientProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <main style={{ fontFamily: 'system-ui', backgroundColor: '#f5f7f6', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HEADER & TOGGLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={sectionTitle}>My Reports</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Manage the lost and found items you have posted.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: '#e0e0e0', padding: '0.3rem', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={viewMode === 'grid' ? activeToggle : inactiveToggle}
              title="Grid View"
            >
              <Grid3x3GapFill />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={viewMode === 'list' ? activeToggle : inactiveToggle}
              title="List View"
            >
              <ListUl size={20} />
            </button>
          </div>
        </div>

        {/* ITEMS SECTION */}
        {items.length === 0 ? (
          <div style={{ ...itemCard, marginBottom: '3rem' }}>
            <p className="mb-0 text-center">
              You haven&apos;t reported any items yet.{' '}
              <Link href="/report" style={{ color: '#024731', fontWeight: 'bold' }}>Report one now.</Link>
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ ...grid3, marginBottom: '3rem' }}>
            {items.map((item) => (
              <div key={item.id} style={itemCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <h3 style={{ color: '#024731', fontSize: '1.25rem' }}>{item.title}</h3>
                   <span style={{ 
                     backgroundColor: item.status === 'open' ? '#e3f2fd' : '#fff3e0',
                     color: item.status === 'open' ? '#1565c0' : '#ef6c00',
                     padding: '0.2rem 0.6rem',
                     borderRadius: '0.4rem',
                     fontSize: '0.75rem',
                     fontWeight: 'bold',
                     textTransform: 'uppercase'
                   }}>
                     {item.status}
                   </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#444', height: '3em', overflow: 'hidden' }}>{item.description}</p>

                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem' }}>
                  <p style={{ marginBottom: '0.4rem' }}><strong>📍</strong> {item.location}</p>
                  <p style={{ marginBottom: '1rem' }}><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <Link href={`/items/${item.id}`} style={linkStyle}>
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
              <div key={item.id} style={listCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#024731', fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                    <span style={{ 
                      backgroundColor: item.status === 'open' ? '#e3f2fd' : '#fff3e0',
                      color: item.status === 'open' ? '#1565c0' : '#ef6c00',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '0.3rem',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
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
                  <Link href={`/items/${item.id}`} style={linkStyle}>Details →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLAIMS SECTION */}
        <h2 style={sectionTitle}>My Submitted Claims</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Track the status of items you have claimed.
        </p>

        {claims.length === 0 ? (
          <div style={itemCard}>
            <p className="mb-0 text-center">You haven&apos;t submitted any claims yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {claims.map((claim) => (
              <div key={claim.id} style={listCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Link href={`/items/${claim.itemId}`} style={{ color: '#024731', fontWeight: 'bold', textDecoration: 'none' }}>
                      {claim.item.title}
                    </Link>
                    <span style={{ 
                      backgroundColor: claim.status === 'approved' ? '#e8f5e9' : claim.status === 'denied' ? '#ffebee' : '#fff3e0',
                      color: claim.status === 'approved' ? '#2e7d32' : claim.status === 'denied' ? '#c62828' : '#ef6c00',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '0.3rem',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {claim.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    <p className="mb-1 italic">"{claim.message}"</p>
                    <span>Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link href={`/items/${claim.itemId}`} style={linkStyle}>
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

/* ---------- STYLES ---------- */

const grid3 = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
};

const sectionTitle = {
  color: '#024731',
  marginBottom: '1rem',
};

const itemCard = {
  padding: '1rem',
  background: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column' as const,
};

const listCard = {
  padding: '1rem',
  background: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const linkStyle = {
  color: '#024731',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
};

const activeToggle = {
  background: 'white',
  border: 'none',
  borderRadius: '0.4rem',
  padding: '0.4rem 0.6rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  color: '#024731',
};

const inactiveToggle = {
  background: 'transparent',
  border: 'none',
  padding: '0.4rem 0.6rem',
  cursor: 'pointer',
  color: '#666',
};

export default MyReportsClient;
