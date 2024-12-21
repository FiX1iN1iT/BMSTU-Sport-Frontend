import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { FC } from 'react'

interface NavigationBarProps {
    isAuthenticated: boolean
    username?: string
    is_staff: boolean
    handleLogout: () => void
}

export const NavigationBar: FC<NavigationBarProps> = ({
    isAuthenticated,
    username,
    is_staff,
    handleLogout
}) => {
  return (
    <Navbar bg="danger" data-bs-theme="dark">
            <Navbar.Brand as={Link} to={ROUTES.HOME}>{ROUTE_LABELS.HOME}</Navbar.Brand>

            <Nav>
                <Nav.Link as={Link} to={ROUTES.SECTIONS}>{ROUTE_LABELS.SECTIONS}</Nav.Link>
                {is_staff && (
                    <Nav.Link as={Link} to={ROUTES.SECTIONSTABLE}>{ROUTE_LABELS.SECTIONSTABLE}</Nav.Link>
                )}

                {isAuthenticated ? (
                    <>
                        <Nav.Link as={Link} to={ROUTES.APPLICATIONS}>{ROUTE_LABELS.APPLICATIONS}</Nav.Link>
                        <Nav.Link as={Link} to={ROUTES.USER_DASHBOARD}>{username}</Nav.Link>
                        <Nav.Link onClick={handleLogout}>Выйти</Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link as={Link} to={ROUTES.REGISTER}>{ROUTE_LABELS.REGISTER}</Nav.Link>
                        <Nav.Link as={Link} to={ROUTES.LOGIN}>{ROUTE_LABELS.LOGIN}</Nav.Link>
                    </>
                )}
            </Nav>
    </Navbar>
  );
}
