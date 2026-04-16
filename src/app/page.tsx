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
    <main className="main-bg">
      {/* HERO */}
      <section className="hero-section">
        <div className="container-narrow">
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
            <Link href="/items" className="btn-gold">Browse Items</Link>
            <Link href="/report" className="btn-white">Report Item</Link>
            <Link href="/my-stuff" className="btn-outline">My Stuff</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-padding">
        <div className="grid-3">
          <StatCard title="Open Reports" value={openCount} color="#024731" />
          <StatCard title="Lost Items" value={lostCount} color="#f4c542" />
          <StatCard title="Found Items" value={foundCount} color="#2f6f4f" />
        </div>
      </section>

      {/* CAMPUS LOCATIONS */}
      <section className="section-padding">
        <h2 className="section-title">📍 Common Campus Locations</h2>
        <div className="grid-3">
          {['Hamilton Library', 'Campus Center', 'Dorms', 'Classrooms', 'Gym', 'Parking Lots'].map((loc) => (
            <div key={loc} className="location-card">
              {loc}
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ITEMS */}
      <section className="section-padding">
        <h2 className="section-title">Recent Listings</h2>

        {recentItems.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <div className="grid-3">
            {recentItems.map((item) => (
              <div key={item.id} className="item-card">
                <h3 style={{ color: '#024731' }}>{item.title}</h3>
                <p>{item.description}</p>

                <p><strong>📍</strong> {item.location}</p>
                <p><strong>📦</strong> {item.category}</p>
                <p><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</p>

                <Link href={`/items/${item.id}`} className="link-green">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Lost something on campus?</h2>
        <p>Report it now and let the UH Mānoa community help you find it.</p>

        <Link href="/report" className="btn-gold">
          Report Lost Item
        </Link>
      </section>
    </main>
  );
};

/* ---------- COMPONENTS ---------- */

const StatCard = ({ title, value, color }: any) => (
  <div
    className="stat-card"
    style={{ borderTop: `6px solid ${color}` }}
  >
    <h3>{title}</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default Home;
