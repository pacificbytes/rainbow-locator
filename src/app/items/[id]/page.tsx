import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import ItemDetailsContent from '@/components/ItemDetailsContent';

export const dynamic = 'force-dynamic';

const ItemDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const session = await auth();
  
  const item = await prisma.item.findUnique({
    where: { id },
    include: { owner: true },
  });

  if (!item) {
    notFound();
  }

  const isOwner = session?.user?.id === item.ownerId;

  return (
    <ItemDetailsContent 
      item={item} 
      isOwner={isOwner} 
      sessionUserId={session?.user?.id} 
    />
  );
};

export default ItemDetailsPage;
