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
                                        <script src="https://kit.fontawesome.com/3b2e248047.js" crossOrigin="anonymous"></script>
                                </Head>
                                <div style={{ height: "100vh" }} >
                                        <Navbar />
                                        <div style={{ minHeight: "70px" }} />
                                        <div className="p-5 shadowed-container container-box" style={{ height: "90%"}} >
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