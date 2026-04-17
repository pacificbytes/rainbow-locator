import Link from 'next/link';
import { ArrowRight, Check2Circle, GeoAlt, ShieldCheck } from 'react-bootstrap-icons';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const Home = async () => {
  const session = await auth();
  const recentItems = session ? await prisma.item.findMany({
    where: {
      status: { not: 'resolved' },
    },
    orderBy: {
      date: 'desc',
    },
    take: 3,
  }) : [];

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
        <div className="container-narrow hero-layout">
          <div className="hero-copy">
            <p className="hero-kicker">University of Hawaiʻi at Mānoa</p>

            <h1 className="hero-title">
              Lost and found, designed to feel trustworthy.
            </h1>

            <p className="hero-description">
              Rainbow Locator helps students, faculty, and staff report missing
              belongings, browse verified listings, and reconnect items with the
              right owners across campus.
            </p>

            <div className="hero-actions">
              <Link href="/items" className="btn-gold">
                Browse Listings <ArrowRight size={16} />
              </Link>
              <Link href="/report" className="btn-white">Report an Item</Link>
              <Link href="/my-stuff" className="btn-outline">My Dashboard</Link>
            </div>

            <div className="hero-highlights">
              <span><ShieldCheck size={16} /> Structured item reporting</span>
              <span><GeoAlt size={16} /> Campus-focused locations</span>
              <span><Check2Circle size={16} /> Clear claim tracking</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel__card">
              <p className="hero-panel__eyebrow">Product Snapshot</p>
              <div className="hero-panel__metrics">
                <div>
                  <strong>{openCount}</strong>
                  <span>Open reports</span>
                </div>
                <div>
                  <strong>{lostCount}</strong>
                  <span>Lost items</span>
                </div>
                <div>
                  <strong>{foundCount}</strong>
                  <span>Found items</span>
                </div>
              </div>
              <p className="hero-panel__note">
                Built by PacificBytes to make recovery workflows clearer,
                faster, and more credible than a generic bulletin-board app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-padding">
        <div className="section-header container-narrow">
          <p className="section-kicker">Live activity</p>
          <h2 className="section-title">A clearer view of what is active on campus</h2>
        </div>
        <div className="grid-3">
          <StatCard title="Open Reports" value={openCount} color="#024731" />
          <StatCard title="Lost Items" value={lostCount} color="#f4c542" />
          <StatCard title="Found Items" value={foundCount} color="#2f6f4f" />
        </div>
      </section>

      {/* CAMPUS LOCATIONS */}
      <section className="section-padding">
        <div className="section-header container-narrow">
          <p className="section-kicker">Coverage</p>
          <h2 className="section-title">Common campus locations people search first</h2>
        </div>
        <div className="grid-3">
          {['Hamilton Library', 'Campus Center', 'Dorms', 'Classrooms', 'Gym', 'Parking Lots'].map((loc) => (
            <div key={loc} className="location-card">
              {loc}
            </div>
          ))}
        </div>
      </section>

      {session ? (
        <section className="section-padding">
          <div className="section-header container-narrow">
            <p className="section-kicker">Latest reports</p>
            <h2 className="section-title">Recent listings from the Rainbow Locator feed</h2>
          </div>

          {recentItems.length === 0 ? (
            <p className="container-narrow">No items yet.</p>
          ) : (
            <div className="grid-3">
              {recentItems.map((item) => (
                <div key={item.id} className="item-card">
                  <span className={`badge-status badge-${item.type}`}>{item.type}</span>
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
      ) : null}

      {/* CTA */}
      <section className="cta-section">
        <div className="container-narrow">
          <p className="section-kicker">Take action</p>
          <h2>Need to post a missing item or return something you found?</h2>
          <p>Start a clean, trackable report and let PacificBytes&apos; platform do the organizing.</p>

          <Link href="/report" className="btn-gold">
            Report Lost Item
          </Link>
        </div>
      </section>
    </main>
  );
};

/* ---------- COMPONENTS ---------- */

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

const StatCard = ({ title, value, color }: StatCardProps) => (
  <div
    className="stat-card"
    style={{ borderTop: `6px solid ${color}` }}
  >
    <h3>{title}</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default Home;
