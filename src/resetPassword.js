import React from "react";
import axios from "./axios"; //import copy of axios (original is in node)
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resetEmail: "",
            changedPassword: "",
            resetCode: "",
            passwordChangeSuccess: false,
            errorInResetPassword: false,
            resetEmailSent: false,
        };
    }
    handleChangeResetEmail(e) {
        console.log("handleChangeEmail e.target.value:", e.target.value);
        this.setState({
            resetEmail: e.target.value,
        });
        console.log("handleChangeEmail state:", this.state);
    }

    handleChangeResetCode(e) {
        console.log("handleChangeEmail e.target.value:", e.target.value);
        this.setState({
            resetCode: e.target.value,
        });
        console.log("handleChangeResetCode state:", this.state);
    }

    handleChangeChangedPassword(e) {
        this.setState({
            changedPassword: e.target.value,
        });
        console.log("handleChangeChangedPassword:", this.state);
    }
    sendPasswordResetEmail(e) {
        e.preventDefault();
        let self = this;
        this.setState({
            errorInResetPassword: false,
        });
        console.log("sendPasswordResetEmail running");
        let userInfo = {
            email: self.state.resetEmail,
        };
        console.log(self.state.resetEmail);
        axios
            .post("/resetPassword/start", userInfo)
            .then((response) => {
                console.log(response);
                if (response.data.error) {
                    self.setState({
                        errorInResetPassword: true,
                        resetEmailSent: false,
                    });
                } else {
                    self.setState({
                        resetEmailSent: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error in axios POST /password/reset/start :", err);
            });
    }
    changePassword(e) {
        e.preventDefault();
        let self = this;
        self.setState({
            errorInResetPassword: false,
        });
        console.log("changePassword running");
        let userInfo = {
            email: self.state.resetEmail,
            changedPassword: self.state.changedPassword,
            resetCode: self.state.resetCode,
        };
        axios
            .post("/resetPassword/verify", userInfo)
            .then((result) => {
                console.log(result);
                console.log("self.state /password/reset/verify:", self.state);
                console.log(result.data.passwordUpdated);
                if (result.data.passwordUpdated) {
                    console.log("if result.data.passwordUpdated TRUE");
                    self.setState({
                        passwordChangeSuccess: true,
                    });
                    console.log(self.state);
                } else {
                    self.setState({
                        errorInResetPassword: true,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "error in axios POST /password/reset/verify :",
                    err
                );
                self.setState({
                    errorInResetPassword: true,
                });
            });
    }
    getCurrentDisplay() {
        let self = this;
        console.log("getCurrentDisplay is running");
        if (!self.state.resetEmailSent) {
            console.log("IF NOT RESET EMAIL SENT:", !self.state.resetEmailSent);
            return (
                <div>
                    <p>Please enter your e-mail :</p>
                    <form>
                        <input
                            type="email"
                            name="resetEmail"
                            value={self.state.resetEmail}
                            placeholder="Reset E-mail"
                            onChange={(e) => self.handleChangeResetEmail(e)}
                        />
                        <input
                            type="submit"
                            value="submit"
                            onClick={(e) => self.sendPasswordResetEmail(e)}
                        />
                    </form>
                </div>
            );
        } else if (
            !self.state.passwordChangeSuccess &&
            self.state.resetEmailSent
        ) {
            console.log(
                "IF NOT PASSWORD CHANGE SUCCESS AND RESET EMAIL SENT:",
                self.state
            );
            return (
                <div>
                    <p>Please use secret code :</p>
                    <form>
                        <input
                            name="resetCode"
                            value={self.state.resetCode}
                            placeholder="Secret Code"
                            onChange={(e) => self.handleChangeResetCode(e)}
                        />
                        <input
                            type="password"
                            name="changedPassword"
                            value={self.state.changedPassword}
                            placeholder="New Password"
                            onChange={(e) =>
                                self.handleChangeChangedPassword(e)
                            }
                        />
                        <input
                            type="submit"
                            value="submit"
                            onClick={(e) => self.changePassword(e)}
                        />
                    </form>
                </div>
            );
        } else if (self.state.passwordChangeSuccess) {
            console.log("PASSWORD CHANGE SUCCESS");
            return (
                <div>
                    <Link to="/login">LOGIN NOW</Link>
                </div>
            );
        }
    }
    render() {
        console.log("Reset Password rendering");
        return (
            <div>
                {this.state.errorInResetPassword ? (
                    <p className="error">
                        Oops... Please try again or refresh the page
                    </p>
                ) : (
                    <p></p>
                )}
                {this.getCurrentDisplay()}
            </div>
        );
    }
}
