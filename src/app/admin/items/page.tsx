import { prisma } from '@/lib/prisma';
import { Container, Row, Col } from 'react-bootstrap';
import ItemCardAdmin from '@/components/ItemCardAdmin';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
    <Container className="py-3">
      <h2 className="mb-4 text-center">Manage All Items</h2>
      <Row>
        {items.length === 0 ? (
          <Col className="text-center">
            <p>No items found.</p>
          </Col>
        ) : (
          items.map((item) => (
            <Col key={item.id} md={4} className="mb-4">
              <ItemCardAdmin item={item} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default AdminItemsPage;
