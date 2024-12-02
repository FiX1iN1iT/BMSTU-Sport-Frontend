import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import "./NavBar.css";

function NavigationBar() {
  return (
    <Navbar bg="danger" data-bs-theme="dark">
        {/* <div className='navbar-content'> */}
            <Navbar.Brand as={Link} to="/">BMSTU Sport</Navbar.Brand>

            <Nav>
                <Nav.Item>
                    <Nav.Link as={Link} to="/sections">Секции</Nav.Link>
                </Nav.Item>
            </Nav>
        {/* </div> */}
    </Navbar>
  );
}

export default NavigationBar;