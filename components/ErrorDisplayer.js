import React, { useState, useEffect } from "react"

import { Toast } from "react-bootstrap"

const ErrorDisplayer = ({ errors, closeToast }) => (
        <React.Fragment>
                {
                        errors
                                ? errors.map((error, i) => {
                                        return (
                                                <Toast key={i} show={error.isVisible} onClose={() => closeToast(i)}>
                                                        <Toast.Header>
                                                                <i className="fas fa-exclamation-circle mr-2 text-danger"></i>
                                                                <strong className="mr-auto">Error</strong>
                                                                <small>{error.status}</small>
                                                        </Toast.Header>
                                                        <Toast.Body>
                                                                {error.message}
                                                        </Toast.Body>
                                                </Toast>
                                        )
                                })
                                : null
                }
        </React.Fragment>
);


export default ErrorDisplayer;
