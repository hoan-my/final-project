import React from "react";
import Register from "./register";
import Login from "./login";
import axios from "./axios"; //import copy of axios (original is in node)
import ResetPassword from "./resetPassword";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div>
            <h1>WOMEN OF COLORS IN TECH</h1>
            <img src="WOC.png" />
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </React.Fragment>
            </HashRouter>
            <footer>©Hoan-My 2020</footer>
        </div>
    );
}

//check HashRouter documentation (only take one child)
//if path is "/" show component Registration
