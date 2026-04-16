import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const Home = async () => {
  const recentItems = await prisma.item.findMany({
    where: {
      status: { not: 'resolved' },
    },
    orderBy: {
      date: 'desc',
    },
    take: 3,
  });

  const openCount = await prisma.item.count({
    where: { status: 'open' },
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
    <main style={{ fontFamily: 'system-ui', backgroundColor: '#f5f7f6' }}>
      {/* HERO */}
      <section
        style={{
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, #024731, #2f6f4f)',
          color: 'white',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#f4c542', fontWeight: 'bold' }}>
            University of Hawaiʻi at Mānoa
          </p>

          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            🌈 Rainbow Locator
          </h1>

          <p style={{ maxWidth: '700px', fontSize: '1.2rem' }}>
            Helping the UH Mānoa community reconnect with lost belongings across
            campus — from Hamilton Library to Campus Center and beyond.
          </p>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/items" style={btnGold}>Browse Items</Link>
            <Link href="/report" style={btnWhite}>Report Item</Link>
            <Link href="/my-stuff" style={btnOutline}>My Stuff</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '2rem' }}>
        <div style={grid3}>
          <StatCard title="Open Reports" value={openCount} color="#024731" />
          <StatCard title="Lost Items" value={lostCount} color="#f4c542" />
          <StatCard title="Found Items" value={foundCount} color="#2f6f4f" />
        </div>
      </section>

      {/* CAMPUS LOCATIONS */}
      <section style={{ padding: '2rem' }}>
        <h2 style={sectionTitle}>📍 Common Campus Locations</h2>
        <div style={grid3}>
          {['Hamilton Library', 'Campus Center', 'Dorms', 'Classrooms', 'Gym', 'Parking Lots'].map((loc) => (
            <div key={loc} style={locationCard}>
              {loc}
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ITEMS */}
      <section style={{ padding: '2rem' }}>
        <h2 style={sectionTitle}>Recent Listings</h2>

        {recentItems.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <div style={grid3}>
            {recentItems.map((item) => (
              <div key={item.id} style={itemCard}>
                <h3 style={{ color: '#024731' }}>{item.title}</h3>
                <p>{item.description}</p>

                <p><strong>📍</strong> {item.location}</p>
                <p><strong>📦</strong> {item.category}</p>
                <p><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</p>

                <Link href={`/items/${item.id}`} style={linkStyle}>
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: '#024731',
          color: 'white',
        }}
      >
        <h2>Lost something on campus?</h2>
        <p>Report it now and let the UH Mānoa community help you find it.</p>

        <Link href="/report" style={btnGold}>
          Report Lost Item
        </Link>
      </section>
    </main>
  );
};

/* ---------- COMPONENTS ---------- */

const StatCard = ({ title, value, color }: any) => (
  <div
    style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '1rem',
      borderTop: `6px solid ${color}`,
      textAlign: 'center',
    }}
  >
    <h3>{title}</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
  </div>
);

/* ---------- STYLES ---------- */

const grid3 = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
};

const sectionTitle = {
  color: '#024731',
  marginBottom: '1rem',
};

const locationCard = {
  padding: '1rem',
  background: 'white',
  borderRadius: '0.75rem',
  textAlign: 'center' as const,
};

const itemCard = {
  padding: '1rem',
  background: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
};

const linkStyle = {
  color: '#024731',
  fontWeight: 'bold',
  textDecoration: 'none',
};

const btnGold = {
  padding: '0.8rem 1.4rem',
  backgroundColor: '#f4c542',
  color: '#024731',
  borderRadius: '0.6rem',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const btnWhite = {
  padding: '0.8rem 1.4rem',
  backgroundColor: 'white',
  color: '#024731',
  borderRadius: '0.6rem',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const btnOutline = {
  padding: '0.8rem 1.4rem',
  border: '1px solid white',
  color: 'white',
  borderRadius: '0.6rem',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default Home;
