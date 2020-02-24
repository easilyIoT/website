import React, { useEffect, useState } from "react";
import Head from "next/head";
import Router from "next/router"
import axios from "axios"
import { Cookies } from "react-cookie"
import { Form, Button, Alert } from "react-bootstrap"
import * as Yup from "yup"
import { useFormik } from "formik"

import CenterInScreen from "../components/CenterInScreen";

import { verify, redirect } from "../utils/index";

import { API_URL } from "../config"

const cookies = new Cookies();

const Register = () => {
   
    const [registerError, setRegisterError] = useState(null);
    

    const submitHandler = async ({ email, password }) => {
        try {
            await axios.post(`${API_URL}/auth/register`, { email, password });

            cookies.set("token", response);
            Router.push("/");

        } catch (e) {
            setRegisterError(e.response.data.message);
        }   
    }

    const { handleSubmit, handleChange, values, touched, isValid, errors } = useFormik({
        onSubmit: submitHandler,
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required().max(20).min(6),
        }),

    });


    return (
        <React.Fragment>
            <Head>
                <title>Register</title>
            </Head>
            <CenterInScreen>
                <h3>Register</h3>
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Group controlId="validationFormikUsername">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={touched.email && errors.email}
                                placeholder="Enter email"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group controlId="validationFormikPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={touched.email && errors.password}
                                placeholder="Password"

                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>
                    </Form.Group>
                </Form>
                {
                    registerError 
                        ? (<Alert variant="danger">{registerError}</Alert>)
                        : null
                }
            </CenterInScreen>
        </React.Fragment>
    )

};



Register.getInitialProps = async ctx => {

    const isLogged = await verify(ctx);

    if (isLogged) {
       redirect("/", ctx);
    }

    return {
        query: ctx.query
    }
}

export default Register;
