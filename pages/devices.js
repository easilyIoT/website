import React, { useEffect, useState, useContext } from "react";
import Head from 'next/head';
import axios from "axios";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { useFormik } from "formik";
import NProgress from "nprogress";

import ErrorContext from "../context/ErrorContext";

import { verify, redirect } from "../utils";
import { isErrorResponse } from "../utils/errors";

import { API_URL } from "../config";


const cookies = new Cookies();

const Devices = () => {
    const [devices, setDevices] = useState(null);
    const [deviceTypes, setDeviceTypes] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const { setError } = useContext(ErrorContext);

    const token = cookies.get("token");

    const fetchData = async () => {
        NProgress.start();

        try {
            const result = await axios.get(`${API_URL}/api/device`, {
                headers: { Authorization: token }
            });

            setDevices(result.data.devices);
        } catch (e) {
            if (isErrorResponse(e))
                setError(e.response.data.message, e.response.status)
        }

        try {
            const result = await axios.get(`${API_URL}/api/device/types`, {
                headers: { Authorization: token }
            });

            setDeviceTypes(result.data.types);
        } catch (e) {
            if (isErrorResponse(e))
                setError(e.response.data.message, e.response.status)
        }

        NProgress.done();
    }

    useEffect(() => {

        fetchData();

    }, []);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleCreateDevice = async ({ name, type }) => {

        if (type === "none")
            return

        NProgress.start();
        try {

            await axios.post(`${API_URL}/api/device`, {
                name,
                type
            }, {
                headers: { Authorization: token }
            });

            fetchData();
            handleCloseModal();
        } catch (e) {
            if (isErrorResponse(e))
                setError(e.response.data.message, e.response.status)
        }
        NProgress.done();

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

            if (isErrorResponse(e))
                setError(e.response.data.message, e.response.status)
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
            if (isErrorResponse(e))
                setError(e.response.data.message, e.response.status)
        }
    };

    const { handleSubmit, values, handleChange } = useFormik({
        onSubmit: handleCreateDevice,
        initialValues: {
            name: "",
            type: deviceTypes ? deviceTypes[0] : "none"
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
                            <th>Reads</th>
                            <th>State</th>
                            <th>Connectivity</th>
                            <th>UUID</th>
                            <th>
                                <Button size="sm" className="mr-1" variant="primary" onClick={handleOpenModal}><i className="fas fa-plus"></i></Button>
                                <Button size="sm" variant="primary" onClick={fetchData}><i className="fas fa-sync"></i></Button>
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
                                <td>{device.reads.map((read, i) => (
                                    <p key={i}>{read}</p>
                                ))}
                                </td>
                                <td>{device.state}</td>
                                <td>{device.isOnline ? "Online" : "Offline"}</td>
                                <td>{device._id}</td>
                                <td><Button size="sm" variant="primary" onClick={handleDeleteDevice(device._id)}><i className="fas fa-trash"></i></Button></td>
                            </tr>
                        )) : null}
                    </tbody>
                </Table>
            </Container>
            <Modal show={modalOpen} onHide={handleCloseModal} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new Device</Modal.Title>
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
                            <Form.Control name="type" onChange={handleChange} value={values.type} as="select" >
                                <React.Fragment>
                                    <option value="none" key={-1} label="none" defaultValue/>
                                    {deviceTypes
                                        ? deviceTypes.map((type, i) => <option value={type} key={i} label={type} />)
                                        : null
                                    }
                                </React.Fragment>
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

Devices.getInitialProps = async (ctx, isLogged) => {

    if (!isLogged) {
        redirect("/login", ctx, { cb: "/devices", ...ctx.query });

        return {};
    }

    return {
        query: ctx.query
    }
}
export default Devices;