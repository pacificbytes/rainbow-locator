import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import EditItemForm from '@/components/EditItemForm';

export const dynamic = 'force-dynamic';

const EditItemPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  // Security check: Only owner or admin can edit
  const isOwner = session.user.id === item.ownerId;
  const isAdmin = session.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    redirect('/not-authorized');
  }

  return (
    <EditItemForm item={item} />
  );
};

export default EditItemPage;
