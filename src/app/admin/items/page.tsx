import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'react-bootstrap-icons';
import AdminItemsClient from '@/components/AdminItemsClient';

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
          <p style={{ color: '#666' }}>Review and manage every item reported on campus.</p>
        </div>

        <AdminItemsClient initialItems={items} />
      </div>
    </main>
  );
};

export default AdminItemsPage;
