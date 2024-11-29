import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavigationBar() {
  return (
    <Navbar bg="danger" data-bs-theme="dark">
        <Navbar.Brand href="/">BMSTU Sport</Navbar.Brand>

        {/* <Nav className="me-auto"></Nav> */}

        <Nav>
            <Nav.Item>
                <Nav.Link href="/sections">Секции</Nav.Link>
            </Nav.Item>
        </Nav>
    </Navbar>
  );
}

export default NavigationBar;