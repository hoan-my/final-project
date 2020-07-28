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
                <h1>VOYAGE</h1>
                <div className="side-button">
                    <Link to="/welcome#/register">
                        <h4>
                            <h3 className="Links"> REGISTER </h3>
                        </h4>
                    </Link>
                </div>
                <h2> HAPPY TO SEE YOU </h2>

                <form>
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
                </form>
                <button type="submit" onClick={(e) => this.login(e)} />
                <footer>©HOAN-MY 2020</footer>
            </div>
        );
    }
}
