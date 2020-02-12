import React, { useState } from "react"
import axios from "axios"
import { Cookies } from "react-cookie"
import { useFormik } from "formik"
import * as Yup from "yup"
import Router from "next/router"
import Head from 'next/head';

import { verify, redirect } from "../utils"
import { Form, Button, Alert } from "react-bootstrap";
import CenterInScreen from "../components/CenterInScreen"
import { API_URL } from "../config"

const cookies = new Cookies();

const Login = ({ query }) => {
    
    const [errorMessage, setErrorMessage] = useState(null);

    const submitHandler = async ({ email, password }) => {

        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })

            const token = data.token;

            cookies.set("token", token);

            setErrorMessage(null);

            if (query.cb) {
                Router.push({
                    pathname: query.cb,
                    query: { cb: null, ...query },
                });
            } else {
                Router.replace("/");
            }


        } catch (e) {
            setErrorMessage(e.message);
        }

    };

    const { handleSubmit, handleChange, values, touched, isValid, errors } = useFormik({
        onSubmit: submitHandler,
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required().max(20).min(6),
            remember: Yup.boolean()
        }),

    })

    return (
        <React.Fragment>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CenterInScreen>
                <h3>Login</h3>
                <Form noValidate onSubmit={handleSubmit}>
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
                </Form>
                {
                    errorMessage 
                        ? (
                            <Alert variant="danger" className="mt-5 w-50" >{errorMessage}</Alert>
                        )
                        : null
                }
            </CenterInScreen>
        </React.Fragment>
    );
};

Login.getInitialProps = async ctx => {

    const isLogged = await verify(ctx);

    if (isLogged) {
        redirect("/", ctx);
    }

    return {
        query: ctx.query
    }
}
export default Login;