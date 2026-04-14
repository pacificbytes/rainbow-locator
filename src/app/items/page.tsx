import { prisma } from '@/lib/prisma';
import { Container, Row, Col } from 'react-bootstrap';
import ItemCard from '@/components/ItemCard';

export const dynamic = 'force-dynamic';

const BrowseItemsPage = async () => {
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

  return (
    <Container className="py-3">
      <h2 className="text-center mb-4">Browse Items</h2>
      <Row>
        {items.length === 0 ? (
          <Col className="text-center">
            <p>No items found.</p>
          </Col>
        ) : (
          items.map((item) => (
            <Col key={item.id} md={4} className="mb-4">
              <ItemCard item={item} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default BrowseItemsPage;
