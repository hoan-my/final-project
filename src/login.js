import React from "react";
import axios from "./axios"; //import copy of axios (original is in node)
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            //error: false,
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
        console.log("Login state:", this.state);
    }
    login(e) {
        e.preventDefault();

        console.log("login function running");
        axios
            .post("/login", this.state)
            .then(function (response) {
                console.log("response from POST/Login", response);
                location.replace("/");
            })
            .catch(function (err) {
                console.log("err in POST/Login:", err);
            });
    }
    render() {
        console.log("rendering login");
        return (
            <div>
                {this.state.LoginError ? (
                    <p className="error">
                        Oops... Please try again or refresh the page
                    </p>
                ) : (
                    <p></p>
                )}
                <div className="row">
                    <div className="column">
                        <form>
                            <h2> Already part of the community ? </h2>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <input
                                type="submit"
                                value="Login"
                                onClick={(e) => this.login(e)}
                            />
                        </form>
                    </div>
                    <div className="column"></div>
                </div>
            </div>
        );
    }
}
