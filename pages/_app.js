import App from "next/app"
import Router from "next/router";
import NProgress from "nprogress"

import Navbar from "../components/Navbar";

import "nprogress/nprogress.css"
import "bootstrap/dist/css/bootstrap.min.css"

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
                                <div style={{ height: "100vh" }} >
                                        <Navbar />
                                        <div style={{ minHeight: "70px" }} />
                                        <div className="p-5" style={{ height: "90%"}} >
                                                <div className="shadow-lg rounded h-100">
                                                        <div className="p-5 h-100 component-h">
                                                                <Component {...pageProps} />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                                <style jsx global>{`
                                        @media screen and (max-width: 600px) {
                                                h1 {
                                                        font-size: 2rem
                                                }
                                                h2 {
                                                        font-size: 1.5rem
                                                }
                                        }
                                `}</style>
                        </React.Fragment>
                );
        }
}