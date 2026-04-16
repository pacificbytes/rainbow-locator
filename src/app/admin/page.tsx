import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import AdminDashboardContent from '@/components/AdminDashboardContent';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const AdminPage = async () => {
  const session = await auth();

  // Fix: Add role check to prevent non-admins from seeing this page
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  // Fix: Fetch the correct statistics for the admin dashboard
  const totalItems = await prisma.item.count();
  const openItems = await prisma.item.count({ where: { status: 'open' } });
  const pendingClaims = await prisma.claim.count({ where: { status: 'pending' } });
  const resolvedItems = await prisma.item.count({ where: { status: 'resolved' } });

  const stats = {
    totalItems,
    openItems,
    pendingClaims,
    resolvedItems,
  };

  // Fix: Use the AdminDashboardContent component instead of the home page layout
  return (
    <main>
      <AdminDashboardContent stats={stats} />
    </main>
  );
};

export default AdminPage;
