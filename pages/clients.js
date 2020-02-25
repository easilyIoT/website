import React, { useEffect, useState } from "react"
import Head from 'next/head';
import axios from "axios"
import { Table, Container, Button, Modal, Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Cookies } from "react-cookie"
import { useFormik } from "formik"
import NProgress from "nprogress"
import { verify, redirect } from "../utils"

import { API_URL } from "../config"


const cookies = new Cookies();

const Clients = () => {
    const [clients, setClients] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const token = cookies.get("token");

    const fetchData = async () => {
        NProgress.start();
        try {
            const result = await axios.get(`${API_URL}/oauth/client`, {
                headers: { Authorization: token }
            });

            setClients(result.data.clients);
        } catch (e) {
            console.error(e);
        }
        NProgress.done();
    
    };

    useEffect(() => {

        fetchData();

    }, []);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleCreateClient = async ({ name }) => {
        try {
            NProgress.start();

            await axios.post(`${API_URL}/oauth/client`, {
                name
            }, {
                headers: { Authorization: token }
            });
            NProgress.done();

            fetchData();
            handleCloseModal();
        } catch (e) {

            NProgress.done();
            console.error(e);
        }
    };

    const handleDeleteClient = ({ client_id }) => async () => {
        try {
            NProgress.start();

            await axios.delete(`${API_URL}/oauth/client/${client_id}`, {
                headers: {
                    Authorization: token
                }
            });

            NProgress.done();
            fetchData();
        } catch (e) {

            NProgress.done();
            console.error(e)
        }
    }

    const { handleSubmit, values, handleChange } = useFormik({
        onSubmit: handleCreateClient,
        initialValues: {
            name: ""
        }
    });

    return (
        <React.Fragment>
            <Head>
                <title>Clients</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <Table responsive bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Client ID</th>
                            <th>Client Secret</th>
                            <th><Button size="sm" variant="outline-primary" onClick={handleOpenModal}><i className="fas fa-plus"></i></Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients ? clients.map((client, i) => (
                            <tr key={i}>
                                <td>{client.name}</td>
                                <td>{client.client_id}</td>
                                <td>{client.client_secret}</td>
                                <td><Button size="sm" variant="outline-primary" onClick={handleDeleteClient(client)}><i className="fas fa-trash"></i></Button></td>
                            </tr>
                        )) : null}
                    </tbody>
                </Table>
            </Container>
            <Modal show={modalOpen} onHide={handleCloseModal} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name of new OAuth Client</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                placeholder="Name of Oauth Client"
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit}>Create Client</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

Clients.getInitialProps = async ctx => {
    const isLogged = await verify(ctx);


    if (!isLogged) {
        redirect("/login", ctx, { cb: "/clients", ...ctx.query });

        return {};
    }

    return {
        query: ctx.query
    }
}
export default Clients;