'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ListUl, Grid3x3GapFill } from 'react-bootstrap-icons';
import { deleteItem } from '@/lib/dbActions';
import swal from 'sweetalert';

type AdminItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  date: Date;
  status: string;
  ownerId: string;
  owner: {
    email: string;
  };
};

interface AdminItemsClientProps {
  initialItems: AdminItem[];
}

const AdminItemsClient = ({ initialItems }: AdminItemsClientProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [items, setItems] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    const confirm = await swal({
      title: 'Are you sure?',
      text: 'This will permanently delete this report!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    });

    if (confirm) {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      // Adjust current page if last item on page was deleted
      const newTotalPages = Math.ceil((items.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      swal('Deleted!', 'The report has been removed.', 'success');
    }
  };

  return (
    <main style={{ fontFamily: 'system-ui', backgroundColor: '#f5f7f6', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HEADER & TOGGLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={sectionTitle}>Manage All Items (Admin)</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Review, edit, or delete any report on the platform.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: '#e0e0e0', padding: '0.3rem', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={viewMode === 'grid' ? activeToggle : inactiveToggle}
            >
              <Grid3x3GapFill />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={viewMode === 'list' ? activeToggle : inactiveToggle}
            >
              <ListUl size={20} />
            </button>
          </div>
        </div>

        {/* ITEMS SECTION */}
        {paginatedItems.length === 0 ? (
          <div style={itemCard}>
            <p className="mb-0 text-center">No reports found in the system.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div style={grid3}>
                {paginatedItems.map((item) => (
                  <div key={item.id} style={itemCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <h3 style={{ color: '#024731' }}>{item.title}</h3>
                       <span style={{ 
                         backgroundColor: item.type === 'lost' ? '#ffebee' : '#e8f5e9',
                         color: item.type === 'lost' ? '#c62828' : '#2e7d32',
                         padding: '0.2rem 0.6rem',
                         borderRadius: '0.4rem',
                         fontSize: '0.75rem',
                         fontWeight: 'bold',
                         textTransform: 'uppercase'
                       }}>
                         {item.type}
                       </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                      <strong>Owner:</strong> {item.owner.email}
                    </p>
                    
                    <p style={{ fontSize: '0.9rem', color: '#444' }}>{item.description}</p>

                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      <p style={{ margin: '0.3rem 0' }}><strong>📍</strong> {item.location}</p>
                      <p style={{ margin: '0.3rem 0' }}><strong>📦</strong> {item.category}</p>
                      <p style={{ margin: '0.3rem 0' }}><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</p>
                      <p style={{ margin: '0.3rem 0' }}><strong>Status:</strong> {item.status}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <Link href={`/items/${item.id}`} style={{ ...btnBase, background: '#e3f2fd', color: '#1565c0' }}>Details</Link>
                      <Link href={`/edit/${item.id}`} style={{ ...btnBase, background: '#fff3cd', color: '#856404' }}>Edit</Link>
                      <button onClick={() => handleDelete(item.id)} style={{ ...btnBase, background: '#ffebee', color: '#c62828', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {paginatedItems.map((item) => (
                  <div key={item.id} style={listCard}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <h3 style={{ color: '#024731', fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>({item.owner.email})</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
                        <span><strong>📍</strong> {item.location}</span>
                        <span><strong>📦</strong> {item.category}</span>
                        <span><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/edit/${item.id}`} style={{ color: '#856404', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>Edit</Link>
                      <button onClick={() => handleDelete(item.id)} style={{ color: '#c62828', fontWeight: 'bold', background: 'none', border: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>Delete</button>
                      <Link href={`/items/${item.id}`} style={{ color: '#024731', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>Details →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '3rem' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline-success"
                  style={{ borderRadius: '0.6rem', fontWeight: 'bold' }}
                >
                  ← Previous
                </button>
                <span style={{ fontWeight: '600', color: '#41554d' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline-success"
                  style={{ borderRadius: '0.6rem', fontWeight: 'bold' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

/* ---------- STYLES ---------- */

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
  display: 'flex',
  flexDirection: 'column' as const,
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

const btnBase = {
  padding: '0.4rem 0.8rem',
  borderRadius: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  flex: 1,
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

export default AdminItemsClient;
