import React from "react";
import Register from "./register";
import Login from "./login";
import axios from "./axios"; //import copy of axios (original is in node)
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div>
            <HashRouter>
                <React.Fragment>
                    <Route path="/" component={Register} />
                    <Route path="/login" component={Login} />
                </React.Fragment>
            </HashRouter>
        </div>
    );
}

//check HashRouter documentation (only take one child)
//if path is "/" show component Registration
