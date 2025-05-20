import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../auth/AuthStore';
import LogoutLink from '../pages/Logout';

const NavigationBar = () => {
  const { groups } = useAuthStore();

  const linkStyle = { fontSize: '1.4rem' }; // Adjust size as needed, e.g. 1.1rem or 16px

  return (
    <Navbar bg="light" variant="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" style={linkStyle}>Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/shop" style={linkStyle}>Shop</Nav.Link>
            {groups.includes("Customer") && (
              <Nav.Link as={Link} to="/profile" style={linkStyle}>Profile</Nav.Link>
            )}
            {groups.includes("Admin") && (
              <Nav.Link as={Link} to="/admin" style={linkStyle}>Admin</Nav.Link>
            )}
          </Nav>
          <Nav>
            <div style={linkStyle}>
              <LogoutLink />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
