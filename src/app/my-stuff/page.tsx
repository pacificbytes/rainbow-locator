import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import ItemCard from '@/components/ItemCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type MyItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  date: Date;
  image?: string | null;
  status: string;
  ownerId: string;
};

type MyClaim = {
  id: string;
  itemId: string;
  message: string;
  createdAt: Date;
  status: string;
  item: {
    title: string;
  };
};

const MyStuffPage = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Container className="py-3">
        <div className="alert alert-warning">
          Please <a href="/auth/signin">sign in</a> to view your items and claims.
        </div>
      </Container>
    );
  }

  const myItems: MyItem[] = await prisma.item.findMany({
    where: { ownerId: session.user.id },
    orderBy: { date: 'desc' },
  });

  const myClaims: MyClaim[] = await prisma.claim.findMany({
    where: { userId: session.user.id },
    include: { item: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Container className="py-3">
      <h2 className="mb-4">My Reported Items</h2>
      <Row className="mb-5">
        {myItems.length === 0 ? (
          <Col>
            <p>
              You haven&apos;t reported any items yet.{' '}
              <Link href="/report">Report one now.</Link>
            </p>
          </Col>
        ) : (
          myItems.map((item) => (
            <Col key={item.id} md={4} className="mb-4">
              <ItemCard item={item} />
              <div className="mt-2 text-center">
                <Link href={`/edit/${item.id}`} className="btn btn-warning btn-sm">
                  Edit Item
                </Link>
              </div>
            </Col>
          ))
        )}
      </Row>

      <h2 className="mb-4">My Submitted Claims</h2>
      <Row>
        <Col>
          {myClaims.length === 0 ? (
            <p>You haven&apos;t submitted any claims yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Message</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td>
                      <Link href={`/items/${claim.itemId}`}>
                        {claim.item.title}
                      </Link>
                    </td>
                    <td>{claim.message}</td>
                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge
                        bg={
                          claim.status === 'approved'
                            ? 'success'
                            : claim.status === 'denied'
                              ? 'danger'
                              : 'warning'
                        }
                      >
                        {claim.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyStuffPage;
