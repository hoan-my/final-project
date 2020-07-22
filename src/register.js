import React from "react";
import axios from "./axios"; //import copy of axios (original is in node)
import { Link } from "react-router-dom";


export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
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
        console.log("Register state:", this.state);
    }
    register(e) {
        e.preventDefault();
        console.log("register function running");
        axios
            .post("/register", this.state)
            .then((response) => {
                console.log("response /register:", response);
                if (response.data.error) {
                    this.setState({
                        error: true,
                    });
                } else {
                    this.setState({
                        error: false,
                    });
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("error in axios POST /register:", err);
            });
    }
    render() {
        return (
            <div>
                {this.state.RegistrationError ? (
                    <p className="error">
                        Oops... Please try again or refresh the page
                    </p>
                ) : (
                    <p></p>
                )}
                <div className="row">
                    <div className="column">
                        <h3>
                            Promoting Innovation, Cultural Inclusion and Gender
                            Equality in the Tech World.
                        </h3>
                        <form>
                            <h2> Be part of the Change now ! </h2>
                            <input
                                name="first"
                                placeholder="First name"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <input
                                name="last"
                                placeholder="Last name"
                                onChange={(e) => this.handleChange(e)}
                            />
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
                                value="Register"
                                onClick={(e) => this.register(e)}
                            />
                        </form>
                        <p>
                            Already part of the community ?
                            <Link to="/login"> Login </Link>
                        </p>
                        <div className="content">
                            Diversity drives innovation - when we limit who can
                            contribute, we in turn limit what problems we can
                            solve. — Telle Whitney
                        </div>
                    </div>
                    <div className="column">
                        <img src="img1.jpg" />
                    </div>
                </div>
            </div>
        );
    }
}
