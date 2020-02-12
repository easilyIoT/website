import React from "react";
import { Cookies } from "react-cookie";
import Router from "next/router"
import axios from "axios"
import url from "url"

import { API_URL } from "../config";


const cookies = new Cookies();

export const verify = async ctx => {
        let token = null;
        let url = null;
        
        // if context has request info aka Server Side
        if (ctx.req) {
                // ugly way to get cookie value from a string of values
                // good enough for demostration
                token = ctx.req.headers.cookie ? ctx.req.headers.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1") : null;
        }
        else {
                // we dont have request info aka Client Side
                token = cookies.get('token')
        }       


        try {
                await axios.post(API_URL + "/auth/verify", {}, {
                        headers: {
                                Authorization: token,
                        }
                });
                return {
                        token
                };

        } catch (err) {
                return false;
        }
}

export const objectToURI = object => Object.keys(object).reduce(function (a, k) { a.push(k + '=' + encodeURIComponent(object[k])); return a }, []).join('&');

export const redirect = (to, ctx, query = {}) => {
        if (ctx.res) {
                console.log(`${to}?${objectToURI(query)}`);
                ctx.res.writeHead(302, {
                        Location: `${to}?${objectToURI(query)}`
                });

                ctx.res.end();
        } else {
                Router.push({
                        pathname: to,
                        query
                });
        }
}