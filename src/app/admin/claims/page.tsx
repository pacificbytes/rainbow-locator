import { prisma } from '@/lib/prisma';
import { Container, Table } from 'react-bootstrap';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClaimReviewRow from '@/components/ClaimReviewRow';

export const dynamic = 'force-dynamic';

const AdminClaimsPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  const claims = await prisma.claim.findMany({
    include: {
      item: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <Container className="py-3">
      <h2 className="mb-4 text-center">Review Claims</h2>
      {claims.length === 0 ? (
        <p className="text-center">No claims submitted yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Item</th>
              <th>Claimant</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim: { id: string }) => (
              <ClaimReviewRow key={claim.id} claim={claim} />
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminClaimsPage;
