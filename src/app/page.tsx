import { Container, Row, Col, Button } from 'react-bootstrap';
import { Search, PlusCircle, ListUl } from 'react-bootstrap-icons';
import Link from 'next/link';

const Home = () => (
  <main>
    <Container className="py-5 text-center">
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <h1 className="display-4 fw-bold mb-3">University Lost and Found</h1>
          <p className="lead mb-4">
            Helping students and faculty reconnect with their missing belongings.
            Report found items or search for something you've lost.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link href="/items" className="btn btn-primary btn-lg px-4 gap-3">
              <Search className="me-2" /> Browse Items
            </Link>
            <Link href="/report" className="btn btn-outline-secondary btn-lg px-4">
              <PlusCircle className="me-2" /> Report an Item
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="g-4 py-5 row-cols-1 row-cols-lg-3">
        <Col className="d-flex align-items-start">
          <div className="icon-square bg-light text-dark flex-shrink-0 me-3 p-3 rounded">
            <PlusCircle size={32} />
          </div>
          <div>
            <h2>Report</h2>
            <p>Found something? Or lost something valuable? Report it here so the community can help you.</p>
            <Link href="/report" className="btn btn-primary">
              Report Now
            </Link>
          </div>
        </Col>
        <Col className="d-flex align-items-start">
          <div className="icon-square bg-light text-dark flex-shrink-0 me-3 p-3 rounded">
            <Search size={32} />
          </div>
          <div>
            <h2>Browse</h2>
            <p>Search through our database of lost and found items. Filter by category, location, and date.</p>
            <Link href="/items" className="btn btn-primary">
              Start Searching
            </Link>
          </div>
        </Col>
        <Col className="d-flex align-items-start">
          <div className="icon-square bg-light text-dark flex-shrink-0 me-3 p-3 rounded">
            <ListUl size={32} />
          </div>
          <div>
            <h2>Manage</h2>
            <p>Keep track of your reports and claims in one place. Update item status once resolved.</p>
            <Link href="/my-stuff" className="btn btn-primary">
              My Stuff
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
