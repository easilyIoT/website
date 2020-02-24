import React, { useEffect } from "react"
import Head from 'next/head';
import { Button, Col, Row } from "react-bootstrap"
import CenterInScreen from "../components/CenterInScreen";

import circuitBoard from "../public/circuit-board.svg"

const Index = () => (
        <React.Fragment>
                <Head>
                        <title>IoT System</title>
                </Head>
                <CenterInScreen>
                        <h1 className="text-primary font-weight-bold">
                                You need to interface<br />your arduino project with the web?
                        </h1>
                        <br />
                        <h2 className="text-secondary">This is exactly what it does for you!</h2>
                        <br />
                        <br />
                        <Button size="lg">
                                <h3>Getting started</h3>
                        </Button>

                </CenterInScreen>
        </React.Fragment>
);


export default Index;