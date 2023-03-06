import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../../redux/actions/userActions";




const Header = () => {
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const userLogout = () => {
        dispatch(logout());
    }

    return (
        <Navbar bg="dark" variant="dark" style={{height: "60px"}}>
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>Chat System</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav className="ms-auto">
                        {userInfo ? (
                            <NavDropdown title={userInfo.email} id="username">
                                <LinkContainer to="/dashboard">
                                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/settings">
                                    <NavDropdown.Item>Settings</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={userLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : <LinkContainer to="/login">
                                <Nav.Link><i className="fas fa-user"></i> Sign In</Nav.Link>
                            </LinkContainer>}
                    </Nav>
            </Container>
        </Navbar>
    )
}

export { Header };