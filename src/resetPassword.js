import React from "react";
import axios from "./axios"; //import copy of axios (original is in node)
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
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
            email: e.target.value,
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
            email: self.state.email,
        };
        console.log(("self.state.email:", self.state.email));
        axios
            .post("/resetPassword/start", userInfo)
            .then((response) => {
                console.log("response resetpassword/start:", response);
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
                console.log("error in axios POST /resetPassword/start :", err);
            });
    }
    changePassword(e) {
        console.log("changePassword running");
        e.preventDefault();
        // let self = this;
        self.setState({
            errorInResetPassword: false,
        });
        // let userInfo = {
        //     email: self.state.email,
        //     resetCode: self.state.resetCode,
        //     changedPassword: self.state.changedPassword,
        // };

        axios
            .post("/resetPassword/verify", this.state)
            .then((result) => {
                // console.log("resetPassword/verify result:", result); //PROBLEMMMMMMM : result is not correct
                // console.log("self.state /resetPassword/verify:", self.state);
                // console.log(result.data.changedPassword);
                // if (result.data.changedPassword) {
                //     console.log("if result.data.passwordUpdated TRUE");
                self.setState({
                    passwordChangeSuccess: true,
                });

                //     console.log(self.state);
                // } else {
                //     self.setState({
                //         errorInResetPassword: true,
                //     });
            })
            .catch((err) => {
                console.log("error in axios POST /resetPassword/verify :", err);
                self.setState({
                    errorInResetPassword: true,
                });
            });
    }
    getCurrentDisplay() {
        let self = this;
        console.log("getCurrentDisplay is running");
        if (!self.state.resetEmailSent) {
            console.log(
                "Getting display 1 (!self.state.resetEmailSent):",
                !self.state.resetEmailSent
            );
            return (
                <div>
                    <form>
                        <p>Please enter your e-mail :</p>

                        <input
                            type="email"
                            name="resetEmail"
                            value={self.state.resetEmail}
                            placeholder="E-mail"
                            onChange={(e) => self.handleChangeResetEmail(e)}
                        />
                        <input
                            type="submit"
                            value="SEND SECRET CODE"
                            onClick={(e) => self.sendPasswordResetEmail(e)}
                        />
                    </form>
                </div>
            );
        } else if (self.state.resetEmailSent) {
            console.log("Getting display 2 (self.state):", self.state);
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
            console.log("Getting display 3 (self.state):", self.state);
            return (
                <div>
                    <Link to="/login">LOGIN NOW</Link>
                </div>
            );
        }
    }
    render() {
        console.log("rendering reset password");
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
