import React from "react";
import axios from "./axios"; //import copy of axios (original is in node)
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            LoginError: false,
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
        let self = this;

        let userInfo = {
            email: self.state.email,
            password: self.state.password,
        };

        console.log("login function running");
        axios
            .post("/login", userInfo)
            .then((response) => {
                console.log("response /login:", response);
                if (response.data.error) {
                    self.setState({
                        LoginError: true,
                    });
                    location.replace("/"); //change here!!
                } else {
                    self.setState({
                        LoginError: false,
                    });
                    location.replace("/profile");
                }
            })
            .catch((err) => {
                console.log("error in axios POST /login:", err);
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
                        <h3>
                            Promoting Innovation, Cultural Inclusion and Gender
                            Equality in the Tech World.
                        </h3>
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
                        <p>
                            Forgot your password ?
                            <Link to="/resetPassword"> Reset </Link>
                        </p>
                        <div className="content">
                            When we listen and celebrate what is both common and
                            different, we become a wiser, more inclusive, and
                            better organization. — Pat Wadors, Head of HR at
                            LinkedIn
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
