import React from "react";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import axios from "./axios";
import Planner from "./planner";

export default class List extends React.Component {
    render() {
        console.log("this.state:", this.state);
        return (
            <div className="app">
                <h6>BAGGAGE CHECKLIST</h6>
                <div className="button-app">
                    <Link to="/planner">
                        {" "}
                        <h4>
                            <h3 className="Links"> X </h3>
                        </h4>
                    </Link>
                </div>
                <input placeholder="Add items" />
                <p>
                    <input type="checkbox" id="test1" />
                    <label for="test1">Solar Cream</label>
                </p>
                <p>
                    <input type="checkbox" id="test1" />
                    <label for="test1">Book</label>
                </p>
                <p>
                    <input
                        type="checkbox"
                        id="test3"
                        checked="checked"
                        disabled="disabled"
                    />
                    <label for="test3">Towels</label>
                </p>
                <p>
                    <input
                        type="checkbox"
                        id="test3"
                        checked="checked"
                        disabled="disabled"
                    />
                    <label for="test3">Flip Flops</label>
                </p>
                <p>
                    <h3 className="Links">Edit List</h3>
                </p>
            </div>
        );
    }
}
