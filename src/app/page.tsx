import Link from 'next/link';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Search, PlusCircle, ListUl } from 'react-bootstrap-icons';
import { prisma } from '@/lib/prisma';
import ItemCard from '@/components/ItemCard';

export const dynamic = 'force-dynamic';

const Home = async () => {
  const recentItems: Awaited<ReturnType<typeof prisma.item.findMany>> =
    await prisma.item.findMany({
      where: {
        status: { not: 'resolved' },
      },
      orderBy: {
        date: 'desc',
      },
      take: 3,
    });

  const openCount = await prisma.item.count({
    where: {
      status: 'open',
    },
  });

  const foundCount = await prisma.item.count({
    where: {
      type: 'found',
      status: { not: 'resolved' },
    },
  });

  const lostCount = await prisma.item.count({
    where: {
      type: 'lost',
      status: { not: 'resolved' },
    },
  });

  return (
    <main>
      <Container className="py-5">
        <Row className="align-items-center py-5">
          <Col lg={7}>
            <h1 className="display-4 fw-bold mb-3">Rainbow Locator</h1>
            <p className="lead mb-4">
              Helping students and faculty reconnect with missing belongings.
              Report found items, browse recent listings, and manage your claims in one place.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link href="/items" passHref legacyBehavior>
                <Button size="lg" variant="primary">
                  <Search className="me-2" />
                  Browse Items
                </Button>
              </Link>

              <Link href="/report" passHref legacyBehavior>
                <Button size="lg" variant="success">
                  <PlusCircle className="me-2" />
                  Report an Item
                </Button>
              </Link>

              <Link href="/my-stuff" passHref legacyBehavior>
                <Button size="lg" variant="outline-secondary">
                  <ListUl className="me-2" />
                  My Stuff
                </Button>
              </Link>
            </div>
          </Col>

          <Col lg={5} className="mt-4 mt-lg-0">
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="mb-3">Current Activity</h3>
                <p className="mb-2"><strong>Open reports:</strong> {openCount}</p>
                <p className="mb-2"><strong>Lost items:</strong> {lostCount}</p>
                <p className="mb-0"><strong>Found items:</strong> {foundCount}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h2 className="fw-bold">Recent Listings</h2>
            <p className="text-muted">
              Here are the most recent unresolved lost and found reports.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {recentItems.length === 0 ? (
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  <p className="mb-0">No active items have been reported yet.</p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            recentItems.map((item) => (
              <Col key={item.id} md={6} lg={4}>
                <ItemCard item={item} />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </main>
  );
};

export default Home;
