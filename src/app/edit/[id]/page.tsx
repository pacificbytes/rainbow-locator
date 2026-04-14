import { notFound } from 'next/navigation';
import { Item } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import EditItemForm from '@/components/EditItemForm';

export const dynamic = 'force-dynamic';

export default async function EditItemPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string; role: string };
    } | null,
  );

  const item: Item | null = await prisma.item.findUnique({
    where: {
      id: id,
    },
  });

  if (!item) {
    return notFound();
  }

  // Only owner or admin can edit
  const isOwner = session?.user?.id === item.ownerId;
  const isAdmin = session?.user?.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return notFound(); // Or redirect to not-authorized
  }

  return (
    <main>
      <EditItemForm item={item} />
    </main>
  );
}
