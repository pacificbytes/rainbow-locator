'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Item, Prisma } from '@prisma/client';
import { ListUl, Grid3x3GapFill, PencilSquare, Search, Trash } from 'react-bootstrap-icons';
import { deleteItem } from '@/lib/dbActions';
import swal from 'sweetalert';

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

const MyReportsClient = ({ items: initialItems, claims }: MyReportsClientProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    const confirm = await swal({
      title: 'Are you sure?',
      text: 'This will permanently remove your report!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    });

    if (confirm) {
      await deleteItem(id);
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      
      // Adjust current page if last item on page was deleted
      const newTotalPages = Math.ceil(newItems.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      swal('Removed!', 'Your report has been deleted.', 'success');
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const query = searchQuery.toLowerCase();
    return (
      claim.item.title.toLowerCase().includes(query) ||
      claim.message.toLowerCase().includes(query)
    );
  });

  return (
    <main className="main-bg section-padding">
      <div className="container-narrow">
        
        {/* HEADER & TOGGLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Reports</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Manage the lost and found items you have posted.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="themed-filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search your reports..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="themed-search-bar"
              />
              <Search className="search-icon" />
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
        </div>

        {/* ITEMS SECTION */}
        {paginatedItems.length === 0 ? (
          <div className="item-card" style={{ marginBottom: '3rem' }}>
            <p className="mb-0 text-center">
              {searchQuery || statusFilter !== 'all' ? (
                `No reports found matching your filters`
              ) : (
                <>
                  You haven&apos;t reported any items yet.{' '}
                  <Link href="/report" className="link-green">Report one now.</Link>
                </>
              )}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid-3" style={{ marginBottom: '3rem' }}>
                {paginatedItems.map((item) => (
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

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <Link href={`/items/${item.id}`} className="btn btn-outline-success btn-sm flex-fill" style={{ borderRadius: '0.5rem' }}>
                        Details
                      </Link>
                      <Link href={`/edit/${item.id}`} className="btn btn-warning btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: '0.5rem' }}>
                        <PencilSquare size={14} /> Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                        style={{ borderRadius: '0.5rem', padding: '0.4rem 0.6rem' }}
                        title="Delete Report"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {paginatedItems.map((item) => (
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
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <Link href={`/edit/${item.id}`} className="btn btn-outline-warning btn-sm">Edit</Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                      >
                        <Trash size={14} /> Delete
                      </button>
                      <Link href={`/items/${item.id}`} className="link-green">Details →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
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

        {/* CLAIMS SECTION */}
        <h2 className="section-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Submitted Claims</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Track the status of items you have claimed.
        </p>

        {filteredClaims.length === 0 ? (
          <div className="item-card">
            <p className="mb-0 text-center">
              {searchQuery ? `No claims found matching "${searchQuery}"` : "You haven't submitted any claims yet."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredClaims.map((claim) => (
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
