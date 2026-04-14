'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  
  const currentUser = session?.user?.email;
  const role = session?.user?.role;
  const isLoading = status === 'loading';

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Lost and Found</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {!isLoading && currentUser && (
              <>
                <Nav.Link id="report-item-nav" href="/report" active={pathName === '/report'}>
                  Report Item
                </Nav.Link>
                <Nav.Link id="browse-items-nav" href="/items" active={pathName === '/items'}>
                  Browse Items
                </Nav.Link>
                <Nav.Link id="my-stuff-nav" href="/my-stuff" active={pathName === '/my-stuff'}>
                  My Stuff
                </Nav.Link>
              </>
            )}
            {!isLoading && currentUser && role === 'ADMIN' && (
              <Nav.Link id="admin-dashboard-nav" href="/admin" active={pathName?.startsWith('/admin')}>
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isLoading ? (
              <Nav.Link disabled>Loading...</Nav.Link>
            ) : session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
