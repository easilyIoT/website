import React from "react";
import Link from "next/link"
import { Cookies } from "react-cookie"
import Router from "next/router"

import { Nav, Navbar, Container } from "react-bootstrap"

const cookies = new Cookies();

const MyNavbar = () => {

        const token = cookies.get("token") !== "null" ? cookies.get("token") : null;
        

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
                                                        <Link href="/" passHref>
                                                                <Nav.Link as="span">
                                                                        <a className="NavLink-Next">Home</a>
                                                                </Nav.Link>
                                                        </Link>
                                                        <Link href="/clients" passHref>
                                                                <Nav.Link as="span">
                                                                        <a className="NavLink-Next">Clients</a>
                                                                </Nav.Link>
                                                        </Link>
                                                        <Link href="/devices" passHref>
                                                                <Nav.Link as="span">
                                                                        <a className="NavLink-Next">Devices</a>
                                                                </Nav.Link>
                                                        </Link>
                                                </Nav>
                                                <Nav>
                                                        {
                                                                token
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