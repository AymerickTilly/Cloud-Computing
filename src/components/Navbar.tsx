import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../auth/AuthStore';
import LogoutLink from '../pages/Logout';

const NavigationBar = () => {

  const { groups} = useAuthStore();


  return (
    
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/shop">Shop</Nav.Link>  
              {groups.includes("Customer") && (
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              )}
              {groups.includes("Admin") && (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              )}
            </Nav>
            <Nav>
              <LogoutLink />
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}









export default NavigationBar;