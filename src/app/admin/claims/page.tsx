import { prisma } from '@/lib/prisma';
import { Table } from 'react-bootstrap';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClaimReviewRow from '@/components/ClaimReviewRow';
import Link from 'next/link';
import { ArrowLeft } from 'react-bootstrap-icons';

export const dynamic = 'force-dynamic';

const AdminClaimsPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  const claims = await prisma.claim.findMany({
    include: {
      item: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="main-bg section-padding">
      <div className="container-narrow">
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/admin" className="link-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ArrowLeft /> Back to Dashboard
          </Link>
          <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Review Claims</h2>
          <p style={{ color: '#666' }}>Review and process claims submitted for found items.</p>
        </div>

        <div className="table-card">
          {claims.length === 0 ? (
            <p className="text-center mb-0">No claims submitted yet.</p>
          ) : (
            <Table responsive hover style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th className="table-header">Item</th>
                  <th className="table-header">Claimant</th>
                  <th className="table-header">Message</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <ClaimReviewRow key={claim.id} claim={claim} />
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminClaimsPage;
