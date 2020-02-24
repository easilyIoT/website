import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress"

import Navbar from "../components/Navbar";

import "nprogress/nprogress.css"
import "../styles/index.scss"

export default class MyApp extends App {

        componentDidMount() {
                NProgress.configure({
                        showSpinner: false
                });

                Router.events.on("routeChangeStart", () => NProgress.start());
                Router.events.on("routeChangeComplete", () => NProgress.done());
                Router.events.on("routeChangeError", () => NProgress.done());
        }

        componentWillUnmount() {
                Router.events.off("routeChangeStart", () => NProgress.start());
                Router.events.off("routeChangeComplete", () => NProgress.done());
                Router.events.off("routeChangeError", () => NProgress.done());
        }


        render() {
                const { Component, pageProps } = this.props;

                return (
                        <React.Fragment>
                                <Head>
                                        <meta charSet='utf-8' />
                                        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
                                        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
                                        <meta name='description' content='Simplify integration beetween your arduino and alexa or other applications' />
                                        <meta name='keywords' content='IoT Alexa Arduino Easy' />
                                        <title>Easily IoT</title>

                                        <link rel="manifest" href="/manifest.json" />
                                        <link href='/images/icons/favicon_32x32.png' rel='icon' type='image/png' sizes='32x32' />
                                        <meta name="theme-color" content="#4ac205" />
                                        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png"/>
                                        
                                        <link href="https://fonts.googleapis.com/css?family=Quicksand&display=swap" rel="stylesheet" />
                                        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.1/css/all.css" integrity="sha384-v8BU367qNbs/aIZIxuivaU55N5GPF89WBerHoGA4QTcbUjYiLQtKdrfXnqAcXyTv" crossorigin="anonymous"/>
                                </Head>
                                <div style={{ height: "100vh" }} >
                                        <Navbar />
                                        <div style={{ minHeight: "10%" }} />
                                        <div className="p-5 shadowed-container container-box" style={{ height: "90%" }} >
                                                <div className="shadow-lg rounded h-100 main-box">
                                                        <div className="p-5 h-100 component-h component-container">
                                                                <Component {...pageProps} />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </React.Fragment>
                );
        }
}