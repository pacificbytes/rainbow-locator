import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Container } from 'react-bootstrap';
import MyReportsClient from '@/components/MyReportsClient';

export const dynamic = 'force-dynamic';

const MyStuffPage = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return (
      <Container className="py-3">
        <div className="alert alert-warning">
          Please <a href="/auth/signin">sign in</a> to view your items and claims.
        </div>
      </Container>
    );
  }

  // Fetch items reported by the logged-in user
  const myItems = await prisma.item.findMany({
    where: { ownerId: session.user.id },
    orderBy: { date: 'desc' },
  });

  // Fetch claims submitted by the logged-in user
  // We include the item title so we can show what they claimed
  const myClaims = await prisma.claim.findMany({
    where: { userId: session.user.id },
    include: {
      item: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // We use the MyReportsClient component to handle the layout and styling
  // This helps make it look like the home page's recent listings!
  return (
    <MyReportsClient 
      items={myItems as any} 
      claims={myClaims as any} 
    />
  );
};

export default MyStuffPage;
