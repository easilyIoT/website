import React from 'react';
import Head from 'next/head';
import axios from "axios"
import { Cookies } from "react-cookie"
import {  Row, Col, Button } from "react-bootstrap"
import NProgress from "nprogress"

import { API_URL } from "../config"
import { verify, objectToURI, redirect } from "../utils"
import CenterInScreen from '../components/CenterInScreen';


const cookies = new Cookies();

const Authorize = ({ client, error, query }) => {

    const token = cookies.get("token");

    const acceptHandler = async () => {
        try {
            NProgress.start();

            const { data } = await axios.post(`${API_URL}/oauth/login`,
                {
                    client_id: query.client_id
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            //console.log(`${query.redirect_uri}?${objectToURI(query)}`);

            window.location.href = `${query.redirect_uri}?${objectToURI({
                code: data.code,
                state: query.state
            })}`;

            NProgress.done();
        } catch (e) {
            NProgress.done();
            console.error(e);
        }
    };


    return (
        <React.Fragment>
            <Head>
                <title>Authorize</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CenterInScreen>
                <div className="h-100 d-flex flex-column justify-content-center align-items-stretch">
                    {
                        client
                            ? (
                                <React.Fragment>
                                    <h3 className="h-100 d-flex flex-column justify-content-center align-items-center">Autorizzare {client.name}?</h3>
                                    <Row className="h-100">
                                        <Col xs="6">
                                            <Button variant="outline-success" size="lg" className="mr-3" onClick={acceptHandler}>Accetta</Button>
                                        </Col>
                                        <Col xs="6">
                                            <Button variant="outline-danger" size="lg" className="ml-3">Rifiuta</Button>
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            )
                            : (
                                <Row>
                                    <Col className="align-items-center">
                                        <h2>Error: {error}</h2>
                                    </Col>
                                </Row>
                            )
                    }
                </div>



            </CenterInScreen>
        </React.Fragment>

    );
}


Authorize.getInitialProps = async (ctx, logged) => {

    if (!logged) {
        redirect("/login", ctx, { cb: "/authorize", ...ctx.query })
    }

    try {
        if (ctx.query.client_id) {

            const { data } = await axios.get(`${API_URL}/oauth/client/${ctx.query.client_id}`, {
                headers: { Authorization: logged.token }
            });

            return {
                client: data,
                query: ctx.query
            }

        } else
            throw new Error("client_id not found");

    } catch (e) {
        return {
            error: e.message
        }
    }


}
export default Authorize
