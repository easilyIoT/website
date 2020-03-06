import React, { useEffect, useState, useContext } from "react";
import Head from 'next/head';
import { useRouter } from "next/router"
import axios from "axios";
import { Cookies } from "react-cookie";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import { useFormik, Formik } from "formik";
import NProgress from "nprogress";

import ErrorContext from "../context/ErrorContext";

import { verify, redirect } from "../utils";
import { isErrorResponse } from "../utils/errors";

import { API_URL } from "../config";

const cookies = new Cookies();

const GroupModal = ({ isModalOpen, handleCloseModal, handleSubmit, values, handleChange, devices, isCreating }) => (
        <Modal show={isModalOpen} onHide={handleCloseModal} animation={true}>
                <Modal.Header closeButton>
                        <Modal.Title>{isCreating ? "Create new" : "Edit"} Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group>
                                        <Form.Label>Name of the Group</Form.Label>
                                        <Form.Control
                                                type="text"
                                                required
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                placeholder="Name of Group"
                                                autoFocus
                                        />
                                </Form.Group>
                                <Form.Group>
                                        <Form.Label>Description of the Group</Form.Label>
                                        <Form.Control
                                                type="text"
                                                required
                                                name="description"
                                                value={values.description}
                                                onChange={handleChange}
                                                placeholder="Description of Group"
                                                autoFocus
                                        />
                                </Form.Group>
                                <Form.Group>
                                        <Form.Label>Devices</Form.Label>
                                        <div className="text-left">
                                                {
                                                        devices
                                                                ? devices.map((device, i) => (
                                                                        <Form.Check
                                                                                custom
                                                                                type={"checkbox"}
                                                                                label={device.name}
                                                                                id={device._id}
                                                                                name={device._id}
                                                                                key={i}
                                                                                checked={values[device._id] || false}
                                                                                onChange={handleChange}
                                                                        />
                                                                ))
                                                                : null

                                                }
                                        </div>
                                </Form.Group>
                        </Form>
                </Modal.Body>
                <Modal.Footer>
                        <Button onClick={handleSubmit}>{isCreating ? "Create" : "Edit"} Group</Button>
                </Modal.Footer>
        </Modal>
);


const Groups = () => {
        const router = useRouter();
        const [groups, setGroups] = useState();
        const [devices, setDevices] = useState();
        const [isCreating, setIsCreating] = useState(true);
        const [modalOpen, setModalOpen] = useState(false);
        const { setError } = useContext(ErrorContext);

        const token = cookies.get("token");


        const getGroups = async () => {
                NProgress.start();

                try {
                        const { data } = await axios.get(`${API_URL}/api/group`, {
                                headers: { Authorization: token }
                        });

                        setGroups(data.groups);
                } catch (e) {
                        if (isErrorResponse(e))
                                setError(e.response.data.message, e.response.status);
                }
                NProgress.done();
        };

        const getDevices = async () => {
                NProgress.start();

                try {
                        const { data } = await axios.get(`${API_URL}/api/device`, {
                                headers: { Authorization: token }
                        });

                        setDevices(data.devices);
                } catch (e) {
                        if (isErrorResponse(e)) 
                                setError(e.response.data.message, e.response.status);
                        
                }
                NProgress.done();
        }

        const fetchData = () => {
                getGroups();
                getDevices();
        };

        useEffect(() => {
                fetchData();
        }, []);


        const handleOpenCreateGroupModal = () => {
                const ownedDevice = {};
                devices.forEach(device => ownedDevice[device._id] = false);
                
                createGroupForm.setValues({
                        name: "",
                        description: "",
                        ...ownedDevice
                });
                
                setIsCreating(true);
                setModalOpen(true);
        }

        const handleCloseModal = () => setModalOpen(false);


        const handleCreateGroup = async ({ name, description, ...rest }) => {
                NProgress.start();

                const devices = Object.keys(rest).filter(key => rest[key]);

                try {
                        await axios.post(`${API_URL}/api/group`, {
                                name,
                                description,
                                devices
                        }, { headers: { Authorization: token } });
                } catch (e) {
                        if (isErrorResponse(e))
                                setError(e.response.data.message, e.response.status)
                }

                getGroups();
                setModalOpen(false);
                
                NProgress.done();
        };

        const handleEditGroup = async ({ name, description, _id, ...rest }) => {
                NProgress.start();
                
                
                const devices = Object.keys(rest).filter(key => rest[key]);
                
                try {
                        await axios.put(`${API_URL}/api/group/${_id}`, {
                                name,
                                description,
                                devices: devices
                        }, { headers: { Authorization: token } });
                } catch (e) {
                        console.log(e.response)
                        if (isErrorResponse(e))
                                setError(e.response.data.message, e.response.status);
                }

                getGroups();
                setModalOpen(false);
                NProgress.done();
        };

        const handleDeleteGroup = id => async () => {
                NProgress.start();
                try {
                        await axios.delete(`${API_URL}/api/group/${id}`, {
                                headers: { Authorization: token }
                        });
                } catch (e) {
                        if (isErrorResponse(e))
                                setError(e.response.data.message, e.response.status);
                }
                getGroups();
                NProgress.done();
        };

        const handleInspectGroup = id => () => {
                const group = groups.find(e => e._id === id);
                const ownedDevice = {};


                group.devices.map(device => device._id).forEach(device => ownedDevice[device] = true);
                
                editGroupForm.setValues({
                        name: group.name,
                        description: group.description,
                        _id: group._id,
                        ...ownedDevice
                });

                setIsCreating(false);
                setModalOpen(true);
        }

        const createGroupForm = useFormik({
                onSubmit: handleCreateGroup,
                initialValues: {}
        });

        const editGroupForm = useFormik({
                onSubmit: handleEditGroup
        })

        return (
                <React.Fragment>
                        <Head>
                                <title>Groups</title>
                                <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <Container>
                                <Table responsive bordered>
                                        <thead>
                                                <tr>
                                                        <th>Name</th>
                                                        <th>Description</th>
                                                        <th>UUID</th>
                                                        <th>
                                                                <Button size="sm" className="mr-1" variant="primary" onClick={handleOpenCreateGroupModal}><i className="fas fa-plus"></i></Button>
                                                                <Button size="sm" variant="primary" onClick={fetchData}><i className="fas fa-sync"></i></Button>
                                                        </th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {groups ? groups.map((group, i) => (
                                                        <tr key={i}>
                                                                <td>{group.name}</td>
                                                                <td>{group.description}</td>
                                                                <td>{group._id}</td>
                                                                <td>
                                                                        <Button size="sm" className="mr-1" variant="primary" onClick={handleDeleteGroup(group._id)}><i className="fas fa-trash"></i></Button>
                                                                        <Button size="sm" variant="primary" onClick={handleInspectGroup(group._id)}><i className="fas fa-eye"></i></Button>
                                                                </td>
                                                        </tr>
                                                )) : null}
                                        </tbody>
                                </Table>
                        </Container>
                        <GroupModal
                                handleChange={isCreating ? createGroupForm.handleChange : editGroupForm.handleChange}
                                handleCloseModal={handleCloseModal}
                                handleSubmit={isCreating ? createGroupForm.handleSubmit : editGroupForm.handleSubmit}
                                isModalOpen={modalOpen}
                                values={isCreating ? createGroupForm.values : editGroupForm.values}
                                devices={devices}
                                isCreating={isCreating}
                        />
                </React.Fragment>
        )
}

Groups.getInitialProps = async ctx => {
        const isLogged = await verify(ctx);


        if (!isLogged) {
                redirect("/login", ctx, { cb: "/groups", ...ctx.query });

                return {};
        }

        return {
                query: ctx.query
        }
}

export default Groups;