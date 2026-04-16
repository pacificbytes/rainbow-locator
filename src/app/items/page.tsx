import { prisma } from '@/lib/prisma';
import BrowseItemsClient from '@/components/BrowseItemsClient';

export const dynamic = 'force-dynamic';

/**
 * Browse Items Page (Server Component)
 * As a first-year student, I'm keeping this simple by fetching 
 * the data here and passing it to the component that handles the buttons.
 */
const BrowseItemsPage = async () => {
  // Get all items that aren't resolved yet
  const items = await prisma.item.findMany({
    where: {
      status: {
        not: 'resolved',
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return <BrowseItemsClient initialItems={items} />;
};

export default BrowseItemsPage;
