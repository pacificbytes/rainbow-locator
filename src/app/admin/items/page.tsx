import { prisma } from '@/lib/prisma';
import { Row, Col } from 'react-bootstrap';
import ItemCardAdmin from '@/components/ItemCardAdmin';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'react-bootstrap-icons';

export const dynamic = 'force-dynamic';

const AdminItemsPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  const items = await prisma.item.findMany({
    include: { owner: true },
    orderBy: { date: 'desc' },
  });

  return (
    <main className="main-bg section-padding">
      <div className="container-narrow">
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/admin" className="link-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ArrowLeft /> Back to Dashboard
          </Link>
          <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage All Items</h2>
          <p style={{ color: '#666' }}>Review and manage every item reported on campus.</p>
        </div>

        {items.length === 0 ? (
          <div className="item-card" style={{ padding: '2rem' }}>
            <p className="mb-0 text-center">No items found.</p>
          </div>
        ) : (
          <Row className="g-4">
            {items.map((item) => (
              <Col key={item.id} md={6} lg={4}>
                <ItemCardAdmin item={item} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </main>
  );
};

export default AdminItemsPage;
