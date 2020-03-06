import React, { useEffect } from "react";
import { useRouter } from "next/router"
import Link from "next/link"
import { Cookies } from "react-cookie"
import Router from "next/router"
import { Nav, Navbar, Container } from "react-bootstrap"

import routes from "../utils/routes"

const cookies = new Cookies();

const MyNavbar = ({ isLogged }) => {
        const router = useRouter();

        
        const handleLogout = () => {
                cookies.remove("token");

                Router.push("/");
        };

        const handleLogin = () => {
                Router.push({
                        pathname: "/login",
                        query: {
                                cb: Router.asPath
                        }
                })
        }

        const handleRegister = () => {
                Router.push("/register");
        }

        return (
                <React.Fragment>
                        <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect fixed="top">
                                <Container>
                                        <Link href="/" passHref><Navbar.Brand>Easily IoT</Navbar.Brand></Link>
                                        <Navbar.Toggle />
                                        <Navbar.Collapse id="navbar-nav">
                                                <Nav className="mr-auto">
                                                        {routes.map((route, i) => (
                                                                <Link key={i} href={route.path} passHref>
                                                                        <Nav.Link as="span" active={route.path === router.asPath}>
                                                                                <a className="NavLink-Next">{route.name}</a>
                                                                        </Nav.Link>
                                                                </Link> 
                                                        ))}
                                                </Nav>
                                                <Nav>
                                                        {
                                                                isLogged
                                                                        ? (
                                                                                <Nav.Link onClick={handleLogout}>
                                                                                        Logout
                                                                                </Nav.Link>
                                                                        )
                                                                        : (
                                                                                <React.Fragment>
                                                                                        <Nav.Link onClick={handleLogin}>
                                                                                                Login
                                                                                        </Nav.Link>
                                                                                        <Nav.Link onClick={handleRegister}>
                                                                                                Register
                                                                                        </Nav.Link>

                                                                                </React.Fragment>
                                                                        )
                                                        }

                                                </Nav>
                                        </Navbar.Collapse>

                                </Container>
                        </Navbar>
                        <style jsx>
                        {`
                                .NavLink-Next {
                                        cursor: pointer;
                                }
                        `}
                        </style>
                </React.Fragment>

        )
}

export default MyNavbar;