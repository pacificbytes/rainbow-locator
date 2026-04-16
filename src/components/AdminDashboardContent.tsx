'use client';

import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { 
  ClipboardData, 
  BoxSeam, 
  CheckCircle, 
  ExclamationCircle,
  ArrowRight,
  ListCheck,
  Collection
} from 'react-bootstrap-icons';

interface AdminDashboardContentProps {
  stats: {
    totalItems: number;
    openItems: number;
    pendingClaims: number;
    resolvedItems: number;
  };
}

const AdminDashboardContent = ({ stats }: AdminDashboardContentProps) => {
  return (
    <div className="container-narrow section-padding">
      
      {/* HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 'bold' }}>🌈 Admin Dashboard</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Overview of Rainbow Locator activity and management tools.
        </p>
      </div>

      {/* STATS GRID */}
      <Row className="mb-5">
        <Col md={3} className="mb-3">
          <StatCard 
            title="Total Reports" 
            value={stats.totalItems} 
            color="#024731" 
            icon={<Collection size={24} />}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard 
            title="Open Items" 
            value={stats.openItems} 
            color="#f4c542" 
            icon={<ExclamationCircle size={24} />}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard 
            title="Pending Claims" 
            value={stats.pendingClaims} 
            color="#2f6f4f" 
            icon={<ClipboardData size={24} />}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard 
            title="Resolved" 
            value={stats.resolvedItems} 
            color="#024731" 
            icon={<CheckCircle size={24} />}
          />
        </Col>
      </Row>

      {/* ACTION CARDS */}
      <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Management Tools</h3>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        <ActionCard 
          title="Manage Items" 
          description="View, edit, or delete all lost and found listings on campus."
          link="/admin/items"
          icon={<BoxSeam size={32} />}
          btnText="Go to Items"
        />
        <ActionCard 
          title="Review Claims" 
          description="Approve or deny claims submitted by users for found items."
          link="/admin/claims"
          icon={<ListCheck size={32} />}
          btnText="Go to Claims"
        />
      </div>
    </div>
  );
};

/* ---------- SUB-COMPONENTS ---------- */

const StatCard = ({ title, value, color, icon }: any) => (
  <div
    className="stat-card"
    style={{ borderTop: `6px solid ${color}`, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
  >
    <div style={{ color: color, marginBottom: '0.5rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#024731' }}>{value}</p>
  </div>
);

const ActionCard = ({ title, description, link, icon, btnText }: any) => (
  <div className="item-card" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{ 
        backgroundColor: '#f0f4f2', 
        padding: '1rem', 
        borderRadius: '0.75rem',
        color: '#024731'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ color: '#024731', fontWeight: 'bold' }}>{title}</h4>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>{description}</p>
        <Link href={link} className="btn-gold" style={{ padding: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>
          {btnText} <ArrowRight className="ms-1" />
        </Link>
      </div>
    </div>
  </div>
);

export default AdminDashboardContent;
