import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";

export default class Profile extends React.Component {
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
        console.log("state in Profiles:", this.state); //always console log props
        return (
            <div className="Profile">
                <p>
                    <h7> Welcome {this.state.first}</h7>
                </p>
                <p>
                    <h8>Let's plan your next...</h8>
                </p>
                <Link to="/form" className="form">
                    {" "}
                    <p className="line-1 anim-typewriter">
                        <h10>VOYAGE</h10>
                    </p>
                </Link>
            </div>
        );
    }
}
