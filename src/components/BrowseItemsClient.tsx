'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ListUl, Grid3x3GapFill } from 'react-bootstrap-icons';

type Item = {
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

interface BrowseItemsClientProps {
  initialItems: Item[];
}

const BrowseItemsClient = ({ initialItems }: BrowseItemsClientProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <main style={{ fontFamily: 'system-ui', backgroundColor: '#f5f7f6', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* TOP BAR WITH HEADING AND TOGGLE BUTTONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={sectionTitle}>Browse Items</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Explore all active lost and found reports from the UH Mānoa community.
            </p>
          </div>

          {/* View Toggles */}
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

        {/* ITEMS LISTING */}
        {initialItems.length === 0 ? (
          <div style={itemCard}>
            <p className="mb-0 text-center">No items found yet.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW - EXACTLY LIKE HOME PAGE RECENT LISTINGS */
          <div style={grid3}>
            {initialItems.map((item) => (
              <div key={item.id} style={itemCard}>
                <h3 style={{ color: '#024731' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#444' }}>{item.description}</p>

                <p style={{ margin: '0.5rem 0' }}><strong>📍</strong> {item.location}</p>
                <p style={{ margin: '0.5rem 0' }}><strong>📦</strong> {item.category}</p>
                <p style={{ margin: '0.5rem 0' }}><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</p>

                <Link href={`/items/${item.id}`} style={linkStyle}>
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW - COMPACT VERSION */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {initialItems.map((item) => (
              <div key={item.id} style={listCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#024731', fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                    <span style={{ 
                      backgroundColor: item.type === 'lost' ? '#ffebee' : '#e8f5e9',
                      color: item.type === 'lost' ? '#c62828' : '#2e7d32',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '0.3rem',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {item.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
                    <span><strong>📍</strong> {item.location}</span>
                    <span><strong>📦</strong> {item.category}</span>
                    <span><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link href={`/items/${item.id}`} style={linkStyle}>
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

/* ---------- STYLES (Match Homepage) ---------- */

const grid3 = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
};

const sectionTitle = {
  color: '#024731',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
};

const itemCard = {
  padding: '1.5rem',
  background: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
};

const listCard = {
  padding: '1rem 1.5rem',
  background: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const linkStyle = {
  color: '#024731',
  fontWeight: 'bold',
  textDecoration: 'none',
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

export default BrowseItemsClient;
