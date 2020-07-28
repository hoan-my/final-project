import React from "react";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import axios from "./axios";

export default class List extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        console.log("my component has mounted");
        axios.get("/user").then((response) => {
            console.log("response GET/user: ", response.data);
            this.setState({
                first: response.data[0].first,
                last: response.data[0].last,
            });
        });
    }
    render() {
        console.log("this.state:", this.state);
        return (
            <div className="app2">
                <div className="button-app">
                    <Link to="/planner">
                        <h4>
                            <h3 className="Links"> X </h3>
                        </h4>
                    </Link>
                </div>
                <div className="Budget">
                    <h6>BUDGET TRACKER</h6>
                </div>
                <input placeholder="Add expense" />
                <input placeholder="EUR" />
                <input placeholder="Paid by" />
                <p>
                    <h3 className="Links">+ Add new expense</h3>
                </p>
            </div>
        );
    }
}
