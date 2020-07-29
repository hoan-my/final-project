import React from "react";
import axios from "./axios"; //import copy of axios (original is in node)
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStart: "",
            dateEnd: "",
            location: "",
            error: false,
        };
    }

    handleChange(e) {
        console.log(e.target.value);
        this.setState({
            [e.target.name]: e.target.value,
            // last: e.target.value,
            // email: e.target.value,
            // password: e.target.value,
        });
        console.log("Form state:", this.state);
    }

    form(e) {
        e.preventDefault();
        console.log("Form function running");
        axios
            .post("/form", this.state)
            .then((response) => {
                console.log("response /form:", response);
                if (response.data.error) {
                    this.setState({
                        error: true,
                    });
                } else {
                    this.setState({
                        error: false,
                    });
                    location.replace("/planner");
                }
            })
            .catch((err) => {
                console.log("error in axios POST /register:", err);
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="Form">
                    {this.state.FormError ? (
                        <p className="error">
                            Oops... Please try again or refresh the page
                        </p>
                    ) : (
                        <p></p>
                    )}
                    <div className="Form">
                        <h7>VOYAGE VOYAGE</h7>

                        <p>
                            <h11>Start Date </h11>
                            <input
                                className="form-input"
                                name="dateStart"
                                placeholder="YYYY/MM/DD"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </p>
                        <p>
                            <h11>
                                End Date
                                <input
                                    name="dateEnd"
                                    className="form-input"
                                    placeholder="YYYY/MM/DD"
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </h11>
                        </p>
                        <p>
                            <h11>
                                Where ?
                                <input
                                    name="location"
                                    className="form-input"
                                    placeholder="LOCATION"
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </h11>
                        </p>

                        <h4>
                            <h3
                                className="Links"
                                type="submit"
                                value="submit"
                                onClick={(e) => this.form(e)}
                            >
                                START MY PLANNER
                            </h3>
                        </h4>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
