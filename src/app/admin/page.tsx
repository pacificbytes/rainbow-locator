import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboardContent from '@/components/AdminDashboardContent';

export const dynamic = 'force-dynamic';

const AdminDashboardPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  const stats = {
    totalItems: await prisma.item.count(),
    openItems: await prisma.item.count({ where: { status: 'open' } }),
    pendingClaims: await prisma.claim.count({ where: { status: 'pending' } }),
    resolvedItems: await prisma.item.count({ where: { status: 'resolved' } }),
  };

  return <AdminDashboardContent stats={stats} />;
};

export default AdminDashboardPage;
