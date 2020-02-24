import React, { useEffect, useState } from "react"
import Head from 'next/head';
import axios from "axios"
import { Table, Container, Button, Modal, Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash, faCogs, faSync } from "@fortawesome/free-solid-svg-icons"
import { Cookies } from "react-cookie"
import { useFormik } from "formik"
import NProgress from "nprogress"
import { verify, redirect } from "../utils"

import { API_URL } from "../config"


const cookies = new Cookies();

const Devices = () => {
    const [devices, setDevices] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const token = cookies.get("token");

    const fetchData = async () => {
        try {
            const result = await axios.get(`${API_URL}/api/device`, {
                headers: { Authorization: token }
            });
            console.log(result.data.devices);
            setDevices(result.data.devices);
        } catch (e) {
            console.error(e.response.data);
        }
    }

    useEffect(() => {

        fetchData();

    }, []);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleCreateDevice = async ({ name, type }) => {
        try {
            NProgress.start();

            await axios.post(`${API_URL}/api/device`, {
                name,
                type
            }, {
                headers: { Authorization: token }
            });
            NProgress.done();

            fetchData();
            handleCloseModal();
        } catch (e) {

            NProgress.done();
            console.error(e.response);
        }
    };

    const handleDeleteDevice = deviceID => async () => {
        try {
            NProgress.start();

            await axios.delete(`${API_URL}/api/device/${deviceID}`, {
                headers: {
                    Authorization: token
                }
            });

            NProgress.done();
            fetchData();
        } catch (e) {

            NProgress.done();
            console.error(e.response)
        }
    }

    const handleTriggerDevice = (deviceID, action) => async e => {
        e.preventDefault();

        try {

            NProgress.start();
            await axios.post(`${API_URL}/api/device/${deviceID}/${action}`, {}, {
                headers: {
                    Authorization: token
                }
            });

            fetchData();
            NProgress.done();

        } catch (e) {

            NProgress.done();
            console.error(e.response);

        }
    };

    const { handleSubmit, values, handleChange } = useFormik({
        onSubmit: handleCreateDevice,
        initialValues: {
            name: "",
            type: "LockController"
        }
    });
    return (
        <React.Fragment>
            <Head>
                <title>Devices</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <Table responsive bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Device Type</th>
                            <th>Actions</th>
                            <th>State</th>
                            <th>UUID</th>
                            <th>
                                <Button size="sm" className="mr-1" variant="outline-primary" onClick={handleOpenModal}><i className="fas fa-plus"></i></Button>
                                <Button size="sm" variant="outline-primary" onClick={fetchData}><i className="fas fa-sync"></i></Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices ? devices.map((device, i) => (
                            <tr key={i}>
                                <td>{device.name}</td>
                                <td>{device.type}</td>
                                <td>{device.actions.map((action, i) => (
                                    <p key={i}>
                                        {action}
                                        <a href="" onClick={handleTriggerDevice(device._id, action)} style={{ float: "right" }}>
                                            <i className="fas fa-cogs"></i>
                                        </a>
                                    </p>
                                ))}
                                </td>
                                <td>{device.state}</td>
                                <td>{device._id}</td>
                                <td><Button size="sm" variant="outline-primary" onClick={handleDeleteDevice(device._id)}><i className="fas fa-trash"></i></Button></td>
                            </tr>
                        )) : null}
                    </tbody>
                </Table>
            </Container>
            <Modal show={modalOpen} onHide={handleCloseModal} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Genete new Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name of new Device</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                placeholder="Name of Device"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>DeviceType</Form.Label>
                            <Form.Control name="type" onChange={handleChange} value={values.type} as="select">
                                <option value="LockController" label="LockController" />
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit}>Create Device</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

Devices.getInitialProps = async ctx => {
    const isLogged = await verify(ctx);


    if (!isLogged) {
        redirect("/login", ctx, { cb: "/devices", ...ctx.query });

        return {};
    }

    return {
        query: ctx.query
    }
}
export default Devices;