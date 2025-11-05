import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import CustomBreadcrumbs from './Breadcrumbs';

const Layout: React.FC = () => (
  <>
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/">Анализ Жанров</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Главная</Nav.Link>
            <Nav.Link as={Link} to="/services">Список Услуг</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
    <Container className="mt-3">
      <CustomBreadcrumbs />
      <div className="main-content">
          <Outlet />
      </div>
    </Container>
  </>
);
export default Layout;